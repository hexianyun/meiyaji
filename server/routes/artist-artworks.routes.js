import { Router } from 'express'
import { Prisma } from '@prisma/client'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { verifyArtist } from '../middleware/auth.js'

const router = Router()

const imageInputSchema = z
  .string()
  .min(1, '作品图片不能为空')
  .max(8_000_000, '作品图片内容过大，请重新上传')
  .refine(
    (value) => /^https?:\/\//i.test(value) || /^data:image\/(png|jpeg|jpg|webp);base64,/i.test(value),
    '请上传 JPG、PNG、WEBP 图片，或提供有效图片链接',
  )

const createArtworkSchema = z.object({
  title: z.string().min(1, '作品名称不能为空').max(120, '作品名称不能超过 120 个字符'),
  imageUrl: imageInputSchema,
  price: z.coerce.number().positive('价格必须大于 0'),
  stock: z.coerce.number().int().min(0, '库存不能小于 0').default(1),
  description: z.string().max(5000, '作品描述不能超过 5000 个字符').optional(),
  charitySupportNote: z.string().min(10, '公益说明至少 10 个字符').max(5000, '公益说明不能超过 5000 个字符'),
})

const updateArtworkSchema = z.object({
  title: z.string().min(1, '作品名称不能为空').max(120, '作品名称不能超过 120 个字符').optional(),
  imageUrl: imageInputSchema.optional(),
  price: z.coerce.number().positive('价格必须大于 0').optional(),
  stock: z.coerce.number().int().min(0, '库存不能小于 0').optional(),
  description: z.string().max(5000, '作品描述不能超过 5000 个字符').optional(),
  charitySupportNote: z.string().min(10, '公益说明至少 10 个字符').max(5000, '公益说明不能超过 5000 个字符').optional(),
  inventoryStatus: z.enum(['in_stock', 'sold_out', 'archived']).optional(),
})

function slugifyTitle(title) {
  const normalized = title
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')

  return normalized || 'artwork'
}

async function buildUniqueSlug(title) {
  const baseSlug = slugifyTitle(title)
  let candidate = baseSlug
  let counter = 1

  while (await prisma.artwork.findUnique({ where: { slug: candidate } })) {
    counter += 1
    candidate = `${baseSlug}-${counter}`
  }

  return candidate
}

function serializeArtwork(artwork) {
  return {
    id: artwork.id,
    artistId: artwork.artistId,
    title: artwork.title,
    slug: artwork.slug,
    imageUrl: artwork.imageUrl,
    price: Number(artwork.price),
    stock: artwork.stock,
    inventoryStatus: artwork.inventoryStatus,
    description: artwork.description,
    charitySupportNote: artwork.charitySupportNote,
    createdAt: artwork.createdAt,
    updatedAt: artwork.updatedAt,
  }
}

router.use(verifyArtist)

router.post('/', async (req, res) => {
  try {
    const data = createArtworkSchema.parse(req.body)
    const slug = await buildUniqueSlug(data.title)

    const artwork = await prisma.artwork.create({
      data: {
        artistId: req.user.id,
        title: data.title,
        slug,
        imageUrl: data.imageUrl,
        price: new Prisma.Decimal(data.price),
        stock: data.stock,
        inventoryStatus: data.stock > 0 ? 'in_stock' : 'sold_out',
        description: data.description,
        charitySupportNote: data.charitySupportNote,
      },
    })

    return res.status(201).json({
      message: '作品发布成功。',
      artwork: serializeArtwork(artwork),
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: '请求参数不合法。',
        errors: error.flatten(),
      })
    }

    return res.status(500).json({
      message: '发布作品失败，请稍后再试。',
    })
  }
})

router.get('/', async (req, res) => {
  try {
    const artworks = await prisma.artwork.findMany({
      where: { artistId: req.user.id },
      orderBy: { createdAt: 'desc' },
    })

    return res.json({
      message: '获取我的作品列表成功。',
      artworks: artworks.map(serializeArtwork),
    })
  } catch {
    return res.status(500).json({
      message: '获取作品列表失败，请稍后再试。',
    })
  }
})

router.patch('/:id', async (req, res) => {
  try {
    const data = updateArtworkSchema.parse(req.body)

    const existingArtwork = await prisma.artwork.findFirst({
      where: {
        id: req.params.id,
        artistId: req.user.id,
      },
    })

    if (!existingArtwork) {
      return res.status(404).json({
        message: '未找到该作品，或你没有权限修改它。',
      })
    }

    const nextStock = data.stock ?? existingArtwork.stock
    const nextInventoryStatus =
      data.inventoryStatus ??
      (nextStock === 0 && existingArtwork.inventoryStatus !== 'archived' ? 'sold_out' : existingArtwork.inventoryStatus)

    const artwork = await prisma.artwork.update({
      where: { id: existingArtwork.id },
      data: {
        title: data.title,
        imageUrl: data.imageUrl,
        price: typeof data.price === 'number' ? new Prisma.Decimal(data.price) : undefined,
        stock: data.stock,
        description: data.description,
        charitySupportNote: data.charitySupportNote,
        inventoryStatus: nextInventoryStatus,
      },
    })

    return res.json({
      message: nextInventoryStatus === 'archived' ? '作品已下架。' : '作品更新成功。',
      artwork: serializeArtwork(artwork),
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: '请求参数不合法。',
        errors: error.flatten(),
      })
    }

    return res.status(500).json({
      message: '更新作品失败，请稍后再试。',
    })
  }
})

router.patch('/:id/unpublish', async (req, res) => {
  try {
    const existingArtwork = await prisma.artwork.findFirst({
      where: {
        id: req.params.id,
        artistId: req.user.id,
      },
    })

    if (!existingArtwork) {
      return res.status(404).json({
        message: '未找到该作品，或你没有权限下架它。',
      })
    }

    const artwork = await prisma.artwork.update({
      where: { id: existingArtwork.id },
      data: {
        inventoryStatus: 'archived',
      },
    })

    return res.json({
      message: '作品已下架。',
      artwork: serializeArtwork(artwork),
    })
  } catch {
    return res.status(500).json({
      message: '下架作品失败，请稍后再试。',
    })
  }
})

export default router
