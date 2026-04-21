import {
  artists,
  artworks,
  charityActivities,
  charityArticleDetails,
  charityProjectDetails,
} from '../data'

const CURRENT_USER_STORAGE_KEY = 'meiyaji_current_user'
const AUTH_TOKEN_STORAGE_KEY = 'meiyaji_auth_token'

function wait(ms) {
  return new Promise(resolve => {
    window.setTimeout(resolve, ms)
  })
}

function getApiBaseUrl() {
  return (import.meta.env.VITE_API_BASE_URL || '').trim()
}

function buildApiUrl(path) {
  return `${getApiBaseUrl()}${path}`
}

function resolveDisplayName(user) {
  return user?.name || user?.realName || user?.username || user?.email || '美芽集用户'
}

function buildCharitySupportNote(artwork) {
  if (artwork.charitySupportNote) return artwork.charitySupportNote
  if (artwork.charityPct) {
    return `该作品成交收益的 ${artwork.charityPct}% 将持续投入乡村美育公益项目。`
  }

  return '该作品的销售收益将用于支持乡村美育公益项目的持续开展。'
}

function normalizeCurrentUser(user) {
  if (!user) return null

  return {
    id: user.id ?? null,
    name: resolveDisplayName(user),
    email: user.email ?? '',
    username: user.username ?? '',
    realName: user.realName ?? '',
    avatarUrl: user.avatarUrl ?? '',
    role: user.role ?? 'member',
    artistStatus: user.artistStatus ?? 'pending',
    bio: user.bio ?? '',
    artistIntro: user.artistIntro ?? '',
    portfolioUrl: user.portfolioUrl ?? '',
    artistProfileId: user.artistProfileId ?? user.artistId ?? user.id ?? null,
  }
}

async function parseApiResponse(response) {
  const contentType = response.headers.get('content-type') || ''

  if (!contentType.includes('application/json')) {
    throw new Error(`接口返回异常，当前请求未拿到有效数据：${response.status}`)
  }

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data?.message || '请求失败，请稍后再试。')
  }

  return data
}

async function requestJson(path, options = {}) {
  const { method = 'GET', body, auth = false } = options
  const headers = {
    ...(body ? { 'Content-Type': 'application/json' } : {}),
  }

  if (auth) {
    const token = getStoredAuthToken()
    if (!token) {
      throw new Error('请先登录后再执行该操作。')
    }
    headers.Authorization = `Bearer ${token}`
  }

  try {
    const response = await fetch(buildApiUrl(path), {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })

    return await parseApiResponse(response)
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }

    throw new Error('网络连接失败，请稍后再试。')
  }
}

function normalizeStaticArtwork(artwork) {
  return {
    ...artwork,
    charitySupportNote: buildCharitySupportNote(artwork),
    inventoryStatus: artwork.stock === 0 ? 'sold_out' : 'in_stock',
    imageUrl: artwork.img,
    artistId: artwork.aid,
  }
}

function normalizeRemoteArtwork(artwork) {
  return {
    id: artwork.id,
    title: artwork.title,
    aid: artwork.artistId,
    artistId: artwork.artistId,
    artist: artwork.artist,
    price: Number(artwork.price || 0),
    orig: null,
    cat: artwork.cat || '公益艺术作品',
    style: artwork.style || '平台发布',
    size: artwork.size || '',
    year: artwork.year || '',
    mat: artwork.mat || '',
    desc: artwork.desc || artwork.description || '',
    img: artwork.img || artwork.imageUrl,
    views: 0,
    sold: 0,
    stock: artwork.stock ?? 1,
    featured: Boolean(artwork.featured),
    charityPct: artwork.charityPct || null,
    inventoryStatus: artwork.inventoryStatus || 'in_stock',
    charitySupportNote: artwork.charitySupportNote || buildCharitySupportNote(artwork),
  }
}

function mergeById(primaryItems, fallbackItems) {
  const map = new Map()

  primaryItems.forEach(item => {
    map.set(String(item.id), item)
  })

  fallbackItems.forEach(item => {
    if (!map.has(String(item.id))) {
      map.set(String(item.id), item)
    }
  })

  return Array.from(map.values())
}

function normalizeStaticActivity(id, activity) {
  const article = charityArticleDetails[id]
  return {
    id: String(id),
    legacyId: id,
    kind: 'activity',
    title: article?.title || activity.title,
    cover: article?.cover || activity.cover,
    date: article?.date || activity.date,
    author: article?.author || '美芽集公益项目组',
    location: article?.location || activity.location,
    tag: article?.tag || activity.tag,
    summary: activity.desc || article?.sections?.[0] || '',
    sections: article?.sections || [],
    images: article?.images || [],
    participants: activity.participants,
    price: activity.price,
    status: activity.status,
    desc: activity.desc,
  }
}

function normalizeStaticProject(id, project) {
  return {
    id: String(id),
    legacyId: Number(id),
    kind: 'project',
    title: project.title,
    cover: project.cover,
    date: project.date,
    author: project.author,
    location: project.location,
    tag: project.tag,
    summary: project.sections?.[0] || '',
    sections: project.sections || [],
    images: project.images || [],
  }
}

function normalizeRemoteContent(content) {
  return {
    ...content,
    id: String(content.id),
    legacyId: content.legacyId ?? null,
    sections: Array.isArray(content.sections) ? content.sections : [],
    images: Array.isArray(content.images) ? content.images : [],
    date: content.date || content.dateLabel,
  }
}

export function getStoredCurrentUser() {
  if (typeof window === 'undefined') return null

  try {
    const rawValue = window.localStorage.getItem(CURRENT_USER_STORAGE_KEY)
    return rawValue ? normalizeCurrentUser(JSON.parse(rawValue)) : null
  } catch {
    return null
  }
}

export function setStoredCurrentUser(user) {
  if (typeof window === 'undefined') return

  if (!user) {
    window.localStorage.removeItem(CURRENT_USER_STORAGE_KEY)
    return
  }

  window.localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(normalizeCurrentUser(user)))
}

export function getStoredAuthToken() {
  if (typeof window === 'undefined') return ''
  return window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) || ''
}

export function setStoredAuthToken(token) {
  if (typeof window === 'undefined') return

  if (!token) {
    window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
    return
  }

  window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token)
}

export function persistAuthSession(payload) {
  setStoredAuthToken(payload?.token || '')
  setStoredCurrentUser(payload?.user || null)
  return normalizeCurrentUser(payload?.user || null)
}

export function clearAuthSession() {
  setStoredAuthToken('')
  setStoredCurrentUser(null)
}

export async function registerUser(payload) {
  return requestJson('/api/auth/register', {
    method: 'POST',
    body: payload,
  })
}

export async function loginUser(payload) {
  return requestJson('/api/auth/login', {
    method: 'POST',
    body: payload,
  })
}

export async function applyArtistApplication(payload) {
  return requestJson('/api/auth/artist/apply', {
    method: 'POST',
    body: payload,
    auth: true,
  })
}

export async function updateMemberAvatar(avatarUrl) {
  const token = getStoredAuthToken()

  if (!token) {
    throw new Error('当前头像将先保存在本地。')
  }

  const payload = await requestJson('/api/auth/member/avatar', {
    method: 'POST',
    body: { avatarUrl },
    auth: true,
  })

  setStoredCurrentUser(payload?.user || null)
  return normalizeCurrentUser(payload?.user || null)
}

export async function getPublicArtworks() {
  const staticArtworks = artworks.map(normalizeStaticArtwork)

  try {
    const payload = await requestJson('/api/public/artworks')
    const remoteArtworks = (payload.artworks || []).map(normalizeRemoteArtwork)
    return mergeById(remoteArtworks, staticArtworks)
  } catch {
    await wait(120)
    return staticArtworks
  }
}

export async function getArtistProfileById(artistId) {
  try {
    const payload = await requestJson(`/api/public/artists/${artistId}`)
    const artist = payload.artist

    if (!artist) return null

    return {
      ...artist,
      artworks: (artist.artworks || []).map(normalizeRemoteArtwork),
      creativePhilosophy: artist.creativePhilosophy || artist.bio,
    }
  } catch {
    await wait(140)

    const staticArtistId = Number(artistId)
    const artist = artists.find(item => item.id === staticArtistId)
    if (!artist) return null

    const artistArtworks = artworks.filter(item => item.aid === staticArtistId)

    return {
      ...artist,
      creativePhilosophy: artist.bio,
      artworks: artistArtworks.map(normalizeStaticArtwork),
    }
  }
}

export async function getArtworkDetailById(artworkId) {
  try {
    const payload = await requestJson(`/api/public/artworks/${artworkId}`)
    if (!payload.artwork) return null

    return {
      ...normalizeRemoteArtwork(payload.artwork),
      artistProfile: payload.artwork.artistProfile
        ? {
            ...payload.artwork.artistProfile,
            artworks: (payload.artwork.artistProfile.artworks || []).map(normalizeRemoteArtwork),
          }
        : null,
    }
  } catch {
    await wait(140)

    const staticArtworkId = Number(artworkId)
    const artwork = artworks.find(item => item.id === staticArtworkId)
    if (!artwork) return null

    const artist = artists.find(item => item.id === artwork.aid) ?? null

    return {
      ...normalizeStaticArtwork(artwork),
      artistProfile: artist
        ? {
            ...artist,
            creativePhilosophy: artist.bio,
          }
        : null,
    }
  }
}

export async function getPublicContents(kind) {
  const staticActivities = charityActivities.map(activity => normalizeStaticActivity(activity.id, activity))
  const staticProjects = Object.entries(charityProjectDetails).map(([id, project]) => normalizeStaticProject(id, project))
  const staticContents = kind === 'project' ? staticProjects : staticActivities

  try {
    const payload = await requestJson(`/api/public/contents?kind=${kind}`)
    const remoteContents = (payload.contents || []).map(normalizeRemoteContent)
    return mergeById(remoteContents, staticContents)
  } catch {
    await wait(120)
    return staticContents
  }
}

export async function getPublicContentById(kind, id) {
  try {
    const payload = await requestJson(`/api/public/contents/${id}?kind=${kind}`)
    return payload.content ? normalizeRemoteContent(payload.content) : null
  } catch {
    await wait(120)

    if (kind === 'project') {
      const article = charityProjectDetails[id]
      return article ? normalizeStaticProject(id, article) : null
    }

    const numericId = Number(id)
    const activity = charityActivities.find(item => item.id === numericId)
    return activity ? normalizeStaticActivity(numericId, activity) : null
  }
}

export async function createOrder(payload) {
  return requestJson('/api/orders', {
    method: 'POST',
    body: payload,
    auth: true,
  })
}

export async function getMemberOrders() {
  return requestJson('/api/orders', {
    auth: true,
  })
}

export async function getAdminOverview() {
  return requestJson('/api/admin/overview', { auth: true })
}

export async function getAdminApplications() {
  return requestJson('/api/admin/applications', { auth: true })
}

export async function reviewArtistApplication(userId, artistStatus) {
  return requestJson(`/api/admin/applications/${userId}`, {
    method: 'PATCH',
    body: { artistStatus },
    auth: true,
  })
}

export async function getAdminUsers() {
  return requestJson('/api/admin/users', { auth: true })
}

export async function deleteAdminUser(userId) {
  return requestJson(`/api/admin/users/${userId}`, {
    method: 'DELETE',
    auth: true,
  })
}

export async function getAdminContents() {
  return requestJson('/api/admin/contents', { auth: true })
}

export async function createAdminContent(payload) {
  return requestJson('/api/admin/contents', {
    method: 'POST',
    body: payload,
    auth: true,
  })
}

export async function updateAdminContent(id, payload) {
  return requestJson(`/api/admin/contents/${id}`, {
    method: 'PATCH',
    body: payload,
    auth: true,
  })
}

export async function getAdminArtworks() {
  return requestJson('/api/admin/artworks', { auth: true })
}

export async function createAdminArtwork(payload) {
  return requestJson('/api/admin/artworks', {
    method: 'POST',
    body: payload,
    auth: true,
  })
}

export async function updateAdminArtwork(id, payload) {
  return requestJson(`/api/admin/artworks/${id}`, {
    method: 'PATCH',
    body: payload,
    auth: true,
  })
}

export async function getAdminOrders() {
  return requestJson('/api/admin/orders', { auth: true })
}

export async function updateAdminOrder(id, payload) {
  return requestJson(`/api/admin/orders/${id}`, {
    method: 'PATCH',
    body: payload,
    auth: true,
  })
}
