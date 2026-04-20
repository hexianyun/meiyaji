import { artworks } from './data'

export function getArtistCoverArtwork(artistId) {
  return (
    artworks.find(art => art.aid === artistId && art.featured) ||
    artworks.find(art => art.aid === artistId) ||
    null
  )
}
