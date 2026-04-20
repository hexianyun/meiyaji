import { artists, artworks } from '../data'

const CURRENT_USER_STORAGE_KEY = 'meiyaji_current_user'

function wait(ms) {
  return new Promise(resolve => {
    window.setTimeout(resolve, ms)
  })
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
    name: user.name ?? '美芽集用户',
    role: user.role ?? 'member',
    artistStatus: user.artistStatus ?? 'pending',
    artistProfileId: user.artistProfileId ?? user.artistId ?? null,
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
