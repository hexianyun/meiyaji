import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { verifyMember } from '../middleware/auth.js'
import { comparePassword, hashPassword, serializeUser, signAccessToken } from '../utils/auth.js'

const router = Router()

const registerSchema = z.object({
  email: z.string().email('请输入有效邮箱地址'),
  password: z.string().min(6, '密码至少 6 位'),
  username: z.string().min(2).max(30).optional(),
  realName: z.string().min(2).max(50).optional(),
})

const loginSchema = z.object({
  email: z.string().email('请输入有效邮箱地址'),
  password: z.string().min(6, '密码至少 6 位'),
})

const artistApplicationSchema = z.object({
  realName: z.string().min(2, '真实姓名至少 2 个字符'),
  bio: z.string().min(20, '艺术家介绍至少 20 个字符'),
  artistIntro: z.string().min(20, '申请说明至少 20 个字符').optional(),
  portfolioUrl: z.string().url('作品集链接格式不正确').optional(),
})

const avatarUpdateSchema = z.object({
  avatarUrl: z
    .string()
    .min(1, '头像内容不能为空。')
    .max(2_000_000, '头像内容过大，请重新选择图片。')
    .regex(/^data:image\/(png|jpeg|jpg|webp);base64,/i, '头像格式不支持，请使用 JPG、PNG 或 WEBP。'),
})

router.post('/register', async (req, res) => {
  try {
    const data = registerSchema.parse(req.body)

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: data.email },
          ...(data.username ? [{ username: data.username }] : []),
        ],
      },
    })

    if (existingUser) {
      return res.status(409).json({
        message: '该邮箱或用户名已被注册。',
      })
    }

    const passwordHash = await hashPassword(data.password)

    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        username: data.username,
        realName: data.realName,
        role: 'member',
      },
    })

    const token = signAccessToken(user)

    return res.status(201).json({
      message: '注册成功。',
      token,
      user: serializeUser(user),
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: '请求参数不合法。',
        errors: error.flatten(),
      })
    }

    return res.status(500).json({
      message: '注册失败，请稍后再试。',
    })
  }
})

router.post('/login', async (req, res) => {
  try {
    const data = loginSchema.parse(req.body)

    const user = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (!user) {
      return res.status(401).json({
        message: '邮箱或密码错误。',
      })
    }

    const isPasswordValid = await comparePassword(data.password, user.passwordHash)

    if (!isPasswordValid) {
      return res.status(401).json({
        message: '邮箱或密码错误。',
      })
    }

    const token = signAccessToken(user)

    return res.json({
      message: '登录成功。',
      token,
      user: serializeUser(user),
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: '请求参数不合法。',
        errors: error.flatten(),
      })
    }

    return res.status(500).json({
      message: '登录失败，请稍后再试。',
    })
  }
})

router.post('/artist/apply', verifyMember, async (req, res) => {
  try {
    const data = artistApplicationSchema.parse(req.body)

    if (req.user.role === 'artist' && req.user.artistStatus === 'approved') {
      return res.status(409).json({
        message: '你已经是已认证艺术家，无需重复申请。',
      })
    }

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        realName: data.realName,
        bio: data.bio,
        artistIntro: data.artistIntro ?? data.bio,
        portfolioUrl: data.portfolioUrl,
        artistStatus: 'pending',
      },
    })

    return res.json({
      message: '艺术家入驻申请已提交，当前状态为 pending。',
      user: serializeUser(user),
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: '请求参数不合法。',
        errors: error.flatten(),
      })
    }

    return res.status(500).json({
      message: '提交申请失败，请稍后再试。',
    })
  }
})

router.post('/member/avatar', verifyMember, async (req, res) => {
  try {
    const data = avatarUpdateSchema.parse(req.body)

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        avatarUrl: data.avatarUrl,
      },
    })

    return res.json({
      message: '头像更新成功。',
      user: serializeUser(user),
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: '头像参数不合法。',
        errors: error.flatten(),
      })
    }

    return res.status(500).json({
      message: '头像保存失败，请稍后再试。',
    })
  }
})

export default router
