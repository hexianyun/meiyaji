import { prisma } from '../lib/prisma.js'
import { verifyAccessToken } from '../utils/auth.js'

async function resolveRequestUser(req) {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.slice(7)
  const payload = verifyAccessToken(token)

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
  })

  if (!user || !user.isActive) {
    return null
  }

  return user
}

export async function verifyMember(req, res, next) {
  try {
    const user = await resolveRequestUser(req)

    if (!user) {
      return res.status(401).json({
        message: '请先登录后再执行该操作。',
      })
    }

    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({
      message: '登录状态无效或已过期。',
    })
  }
}

export async function verifyArtist(req, res, next) {
  try {
    const user = await resolveRequestUser(req)

    if (!user) {
      return res.status(401).json({
        message: '请先登录后再访问艺术家后台。',
      })
    }

    const isApprovedArtist = user.role === 'artist' && user.artistStatus === 'approved'

    if (!isApprovedArtist) {
      return res.status(403).json({
        message: '仅已审核通过的艺术家可访问该资源。',
      })
    }

    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({
      message: '登录状态无效或已过期。',
    })
  }
}

export async function verifyAdmin(req, res, next) {
  try {
    const user = await resolveRequestUser(req)

    if (!user) {
      return res.status(401).json({
        message: '请先登录后再访问管理员后台。',
      })
    }

    if (user.role !== 'admin') {
      return res.status(403).json({
        message: '仅管理员可访问该资源。',
      })
    }

    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({
      message: '登录状态无效或已过期。',
    })
  }
}
