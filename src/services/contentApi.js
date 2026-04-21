import { artists, artworks } from '../data'

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
    artistProfileId: user.artistProfileId ?? user.artistId ?? null,
  }
}

async function parseApiResponse(response) {
  const contentType = response.headers.get('content-type') || ''

  if (!contentType.includes('application/json')) {
    throw new Error('当前线上认证接口暂未连通，请先部署后端接口。')
  }

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data?.message || '请求失败，请稍后再试。')
  }

  return data
}

async function requestAuth(path, payload) {
  const apiBaseUrl = getApiBaseUrl()

  try {
    const response = await fetch(`${apiBaseUrl}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    return await parseApiResponse(response)
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }

    throw new Error('网络连接失败，请稍后再试。')
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

  window.localStorage.setItem(
    CURRENT_USER_STORAGE_KEY,
    JSON.stringify(normalizeCurrentUser(user)),
  )
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
  return requestAuth('/api/auth/register', payload)
}

export async function loginUser(payload) {
  return requestAuth('/api/auth/login', payload)
}

export async function applyArtistApplication(payload) {
  const apiBaseUrl = getApiBaseUrl()
  const token = getStoredAuthToken()

  if (!token) {
    throw new Error('请先登录后再提交艺术家入驻申请。')
  }

  try {
    const response = await fetch(`${apiBaseUrl}/api/auth/artist/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })

    return await parseApiResponse(response)
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }

    throw new Error('网络连接失败，请稍后再试。')
  }
}

export async function updateMemberAvatar(avatarUrl) {
  const apiBaseUrl = getApiBaseUrl()
  const token = getStoredAuthToken()

  if (!apiBaseUrl || !token) {
    throw new Error('当前头像将先保存在本地。')
  }

  try {
    const response = await fetch(`${apiBaseUrl}/api/auth/member/avatar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ avatarUrl }),
    })

    const payload = await parseApiResponse(response)
    setStoredCurrentUser(payload?.user || null)
    return normalizeCurrentUser(payload?.user || null)
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }

    throw new Error('头像上传失败，请稍后再试。')
  }
}

export async function getArtistProfileById(artistId) {
  await wait(140)

  const artist = artists.find(item => item.id === artistId)
  if (!artist) return null

  const artistArtworks = artworks.filter(item => item.aid === artistId)

  return {
    ...artist,
    creativePhilosophy: artist.bio,
    artworks: artistArtworks.map(item => ({
      ...item,
      charitySupportNote: buildCharitySupportNote(item),
    })),
  }
}

export async function getArtworkDetailById(artworkId) {
  await wait(140)

  const artwork = artworks.find(item => item.id === artworkId)
  if (!artwork) return null

  const artist = artists.find(item => item.id === artwork.aid) ?? null

  return {
    ...artwork,
    charitySupportNote: buildCharitySupportNote(artwork),
    artistProfile: artist
      ? {
          ...artist,
          creativePhilosophy: artist.bio,
        }
      : null,
  }
}
