import { Router } from 'express'
import { prisma } from '../lib/prisma.js'

const router = Router()

function resolveDisplayName(user) {
  return user?.realName || user?.username || user?.email || '美芽集艺术家'
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : []
}

function serializePublicArtwork(artwork) {
  return {
    id: artwork.id,
    title: artwork.title,
    artist: resolveDisplayName(artwork.artist),
    artistId: artwork.artistId,
    price: Number(artwork.price),
    img: artwork.imageUrl,
    desc: artwork.description || '',
    charitySupportNote: artwork.charitySupportNote,
    stock: artwork.stock,
    inventoryStatus: artwork.inventoryStatus,
    featured: false,
    cat: '公益艺术作品',
    style: '平台发布',
    size: '',
    year: '',
    mat: '',
  }
}

function serializePublicArtist(user) {
  const artworks = (user.artworks || []).map(serializePublicArtwork)

  return {
    id: user.id,
    name: resolveDisplayName(user),
    bio: user.bio || user.artistIntro || '这位艺术家正在通过作品参与美芽集的公益计划。',
    creativePhilosophy: user.bio || user.artistIntro || '这位艺术家正在通过作品参与美芽集的公益计划。',
    avatar: user.avatarUrl || (artworks[0]?.img ?? ''),
    artworks,
  }
}

function serializeContent(content) {
  return {
    id: content.id,
    legacyId: content.legacyId,
    kind: content.kind,
    title: content.title,
    cover: content.cover,
    date: content.dateLabel,
    author: content.author,
    location: content.location,
    tag: content.tag,
    summary: content.summary || '',
    sections: normalizeArray(content.sections),
    images: normalizeArray(content.images),
  }
}

router.get('/artworks', async (_req, res) => {
  try {
    const artworks = await prisma.artwork.findMany({
      where: {
        inventoryStatus: {
          not: 'archived',
        },
      },
      include: {
        artist: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return res.json({
      artworks: artworks.map(serializePublicArtwork),
    })
  } catch (error) {
    return res.status(500).json({
      message: '获取公开作品失败，请稍后再试。',
    })
  }
})

router.get('/artworks/:id', async (req, res) => {
  try {
    const artwork = await prisma.artwork.findUnique({
      where: { id: req.params.id },
      include: {
        artist: {
          include: {
            artworks: {
              where: {
                inventoryStatus: {
                  not: 'archived',
                },
              },
              orderBy: { createdAt: 'desc' },
            },
          },
        },
      },
    })

    if (!artwork) {
      return res.status(404).json({
        message: '未找到该作品。',
      })
    }

    return res.json({
      artwork: {
        ...serializePublicArtwork(artwork),
        artistProfile: serializePublicArtist(artwork.artist),
      },
    })
  } catch (error) {
    return res.status(500).json({
      message: '获取作品详情失败，请稍后再试。',
    })
  }
})

router.get('/artists/:id', async (req, res) => {
  try {
    const artist = await prisma.user.findFirst({
      where: {
        id: req.params.id,
        role: 'artist',
        artistStatus: 'approved',
      },
      include: {
        artworks: {
          where: {
            inventoryStatus: {
              not: 'archived',
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!artist) {
      return res.status(404).json({
        message: '未找到该艺术家。',
      })
    }

    return res.json({
      artist: serializePublicArtist(artist),
    })
  } catch (error) {
    return res.status(500).json({
      message: '获取艺术家信息失败，请稍后再试。',
    })
  }
})

router.get('/contents', async (req, res) => {
  try {
    const kind = req.query.kind
    const contents = await prisma.charityContent.findMany({
      where: {
        published: true,
        ...(kind ? { kind } : {}),
      },
      orderBy: { updatedAt: 'desc' },
    })

    return res.json({
      contents: contents.map(serializeContent),
    })
  } catch (error) {
    return res.status(500).json({
      message: '获取公益内容失败，请稍后再试。',
    })
  }
})

router.get('/contents/:id', async (req, res) => {
  try {
    const { id } = req.params
    const kind = req.query.kind

    const content = await prisma.charityContent.findFirst({
      where: {
        published: true,
        ...(kind ? { kind } : {}),
        OR: [
          { id },
          ...(Number.isNaN(Number(id)) ? [] : [{ legacyId: Number(id) }]),
        ],
      },
    })

    if (!content) {
      return res.status(404).json({
        message: '未找到该公益内容。',
      })
    }

    return res.json({
      content: serializeContent(content),
    })
  } catch (error) {
    return res.status(500).json({
      message: '获取公益内容详情失败，请稍后再试。',
    })
  }
})

export default router
