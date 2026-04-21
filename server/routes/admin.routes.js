import { Prisma } from '@prisma/client'
import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { verifyAdmin } from '../middleware/auth.js'
import { serializeUser } from '../utils/auth.js'

const router = Router()

const contentSchema = z.object({
  kind: z.enum(['activity', 'project']),
  title: z.string().min(1).max(200),
  cover: z.string().min(1).max(5000),
  dateLabel: z.string().min(1).max(100),
  author: z.string().min(1).max(100),
  location: z.string().max(100).optional().or(z.literal('')),
  tag: z.string().max(60).optional().or(z.literal('')),
  summary: z.string().max(5000).optional().or(z.literal('')),
  sections: z.array(z.string().min(1)).min(1),
  images: z.array(z.string().min(1)).default([]),
  published: z.boolean().default(true),
})

const artworkSchema = z.object({
  artistId: z.string().min(1, '请选择艺术家'),
  title: z.string().min(1).max(120),
  imageUrl: z.string().min(1).max(5000),
  price: z.coerce.number().positive(),
  stock: z.coerce.number().int().min(0).default(1),
  description: z.string().max(5000).optional(),
  charitySupportNote: z.string().min(10).max(5000),
  inventoryStatus: z.enum(['in_stock', 'sold_out', 'archived']).optional(),
})

const reviewSchema = z.object({
  artistStatus: z.enum(['approved', 'rejected']),
})

const orderUpdateSchema = z.object({
  status: z.enum(['pending_payment', 'pending_shipment', 'in_transit', 'completed', 'cancelled']).optional(),
  logisticsCompany: z.string().max(100).optional().or(z.literal('')),
  logisticsNumber: z.string().max(100).optional().or(z.literal('')),
  trackingNote: z.string().max(5000).optional().or(z.literal('')),
})

function slugify(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '') || 'content'
}

async function buildUniqueContentSlug(title) {
  const baseSlug = slugify(title)
  let candidate = baseSlug
  let counter = 1

  while (await prisma.charityContent.findUnique({ where: { slug: candidate } })) {
    counter += 1
    candidate = `${baseSlug}-${counter}`
  }

  return candidate
}

async function buildUniqueArtworkSlug(title) {
  const baseSlug = slugify(title)
  let candidate = baseSlug
  let counter = 1

  while (await prisma.artwork.findUnique({ where: { slug: candidate } })) {
    counter += 1
    candidate = `${baseSlug}-${counter}`
  }

  return candidate
}

function serializeContent(content) {
  return {
    id: content.id,
    legacyId: content.legacyId,
    kind: content.kind,
    slug: content.slug,
    title: content.title,
    cover: content.cover,
    dateLabel: content.dateLabel,
    author: content.author,
    location: content.location,
    tag: content.tag,
    summary: content.summary || '',
    sections: Array.isArray(content.sections) ? content.sections : [],
    images: Array.isArray(content.images) ? content.images : [],
    published: content.published,
    createdAt: content.createdAt,
    updatedAt: content.updatedAt,
  }
}

function serializeArtwork(artwork) {
  return {
    id: artwork.id,
    title: artwork.title,
    slug: artwork.slug,
    imageUrl: artwork.imageUrl,
    price: Number(artwork.price),
    stock: artwork.stock,
    inventoryStatus: artwork.inventoryStatus,
    description: artwork.description || '',
    charitySupportNote: artwork.charitySupportNote,
    artistId: artwork.artistId,
    artistName: artwork.artist ? (artwork.artist.realName || artwork.artist.username || artwork.artist.email) : '',
    createdAt: artwork.createdAt,
    updatedAt: artwork.updatedAt,
  }
}

function formatOrderStatus(status) {
  switch (status) {
    case 'pending_payment': return '待付款'
    case 'pending_shipment': return '待发货'
    case 'in_transit': return '运输中'
    case 'completed': return '已完成'
    case 'cancelled': return '已取消'
    default: return status
  }
}

function serializeOrder(order) {
  return {
    id: order.id,
    orderNo: order.orderNo,
    status: formatOrderStatus(order.status),
    statusCode: order.status,
    total: Number(order.totalAmount),
    buyerName: order.buyerName,
    buyerEmail: order.buyerEmail,
    buyerPhone: order.buyerPhone,
    shippingAddress: order.shippingAddress,
    logisticsCompany: order.logisticsCompany,
    logisticsNumber: order.logisticsNumber,
    trackingNote: order.trackingNote,
    createdAt: order.createdAt,
    arts: Array.isArray(order.items) ? order.items : [],
  }
}

router.use(verifyAdmin)

router.get('/overview', async (_req, res) => {
  const [users, artworks, contents, orders, pendingArtists] = await Promise.all([
    prisma.user.count(),
    prisma.artwork.count(),
    prisma.charityContent.count(),
    prisma.order.count(),
    prisma.user.count({ where: { artistStatus: 'pending' } }),
  ])

  return res.json({
    counts: {
      users,
      artworks,
      contents,
      orders,
      pendingArtists,
    },
  })
})

router.get('/applications', async (_req, res) => {
  const applications = await prisma.user.findMany({
    where: {
      artistStatus: {
        in: ['pending', 'rejected'],
      },
    },
    orderBy: { updatedAt: 'desc' },
  })

  return res.json({
    applications: applications.map(serializeUser),
  })
})

router.patch('/applications/:id', async (req, res) => {
  try {
    const data = reviewSchema.parse(req.body)
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: {
        role: 'artist',
        artistStatus: data.artistStatus,
      },
    })

    return res.json({
      message: data.artistStatus === 'approved' ? '艺术家申请已通过。' : '艺术家申请已驳回。',
      user: serializeUser(user),
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: '审核参数不合法。',
        errors: error.flatten(),
      })
    }

    return res.status(500).json({
      message: '审核失败，请稍后再试。',
    })
  }
})

router.get('/users', async (_req, res) => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return res.json({
    users: users.map(serializeUser),
  })
})

router.delete('/users/:id', async (req, res) => {
  if (req.params.id === req.user.id) {
    return res.status(400).json({
      message: '不能删除当前管理员账号。',
    })
  }

  await prisma.user.delete({
    where: { id: req.params.id },
  })

  return res.json({
    message: '用户已删除。',
  })
})

router.get('/contents', async (_req, res) => {
  const contents = await prisma.charityContent.findMany({
    orderBy: { updatedAt: 'desc' },
  })

  return res.json({
    contents: contents.map(serializeContent),
  })
})

router.post('/contents', async (req, res) => {
  try {
    const data = contentSchema.parse(req.body)
    const slug = await buildUniqueContentSlug(data.title)

    const content = await prisma.charityContent.create({
      data: {
        ...data,
        location: data.location || null,
        tag: data.tag || null,
        summary: data.summary || null,
        slug,
      },
    })

    return res.status(201).json({
      message: '文章发布成功。',
      content: serializeContent(content),
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: '文章参数不合法。',
        errors: error.flatten(),
      })
    }

    return res.status(500).json({
      message: '文章发布失败，请稍后再试。',
    })
  }
})

router.patch('/contents/:id', async (req, res) => {
  try {
    const data = contentSchema.partial().parse(req.body)
    const content = await prisma.charityContent.update({
      where: { id: req.params.id },
      data: {
        ...data,
        location: data.location === '' ? null : data.location,
        tag: data.tag === '' ? null : data.tag,
        summary: data.summary === '' ? null : data.summary,
      },
    })

    return res.json({
      message: '文章更新成功。',
      content: serializeContent(content),
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: '文章参数不合法。',
        errors: error.flatten(),
      })
    }

    return res.status(500).json({
      message: '文章更新失败，请稍后再试。',
    })
  }
})

router.get('/artworks', async (_req, res) => {
  const artworks = await prisma.artwork.findMany({
    include: { artist: true },
    orderBy: { updatedAt: 'desc' },
  })

  return res.json({
    artworks: artworks.map(serializeArtwork),
  })
})

router.post('/artworks', async (req, res) => {
  try {
    const data = artworkSchema.parse(req.body)
    const slug = await buildUniqueArtworkSlug(data.title)

    const artwork = await prisma.artwork.create({
      data: {
        artistId: data.artistId,
        title: data.title,
        slug,
        imageUrl: data.imageUrl,
        price: new Prisma.Decimal(data.price),
        stock: data.stock,
        inventoryStatus: data.inventoryStatus || (data.stock > 0 ? 'in_stock' : 'sold_out'),
        description: data.description,
        charitySupportNote: data.charitySupportNote,
      },
      include: { artist: true },
    })

    return res.status(201).json({
      message: '作品发布成功。',
      artwork: serializeArtwork(artwork),
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: '作品参数不合法。',
        errors: error.flatten(),
      })
    }

    return res.status(500).json({
      message: '作品发布失败，请稍后再试。',
    })
  }
})

router.patch('/artworks/:id', async (req, res) => {
  try {
    const data = artworkSchema.partial().parse(req.body)
    const nextStock = typeof data.stock === 'number' ? data.stock : undefined

    const artwork = await prisma.artwork.update({
      where: { id: req.params.id },
      data: {
        artistId: data.artistId,
        title: data.title,
        imageUrl: data.imageUrl,
        price: typeof data.price === 'number' ? new Prisma.Decimal(data.price) : undefined,
        stock: nextStock,
        description: data.description,
        charitySupportNote: data.charitySupportNote,
        inventoryStatus: data.inventoryStatus || (nextStock === 0 ? 'sold_out' : undefined),
      },
      include: { artist: true },
    })

    return res.json({
      message: '作品更新成功。',
      artwork: serializeArtwork(artwork),
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: '作品参数不合法。',
        errors: error.flatten(),
      })
    }

    return res.status(500).json({
      message: '作品更新失败，请稍后再试。',
    })
  }
})

router.get('/orders', async (_req, res) => {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return res.json({
    orders: orders.map(serializeOrder),
  })
})

router.patch('/orders/:id', async (req, res) => {
  try {
    const data = orderUpdateSchema.parse(req.body)
    const shouldMarkShipped = Boolean(data.logisticsCompany || data.logisticsNumber)
    const nextStatus = data.status || (shouldMarkShipped ? 'in_transit' : undefined)

    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: {
        status: nextStatus,
        logisticsCompany: data.logisticsCompany === '' ? null : data.logisticsCompany,
        logisticsNumber: data.logisticsNumber === '' ? null : data.logisticsNumber,
        trackingNote: data.trackingNote === '' ? null : data.trackingNote,
        shippedAt: shouldMarkShipped ? new Date() : undefined,
        deliveredAt: nextStatus === 'completed' ? new Date() : undefined,
      },
    })

    return res.json({
      message: '订单物流已更新。',
      order: serializeOrder(order),
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: '订单参数不合法。',
        errors: error.flatten(),
      })
    }

    return res.status(500).json({
      message: '订单更新失败，请稍后再试。',
    })
  }
})

export default router
