import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../App'
import { artists, artworks } from '../data'

export default function ArtistPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { favs, toggleFav } = useApp()
  
  const artist = artists.find(a => a.id === parseInt(id))
  if (!artist) return null
  
  const artistWorks = artworks.filter(a => a.aid === artist.id)

  return (
    <div className="pb-20 fade-in">
      {/* 品牌头 */}
      <div className="pt-4 pb-6 px-4">
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >←</button>
          <span className="text-[10px] tracking-[0.35em] uppercase" style={{ color: 'var(--text-weak)' }}>ARTIST</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-full max-w-[180px] aspect-[4/3] overflow-hidden"
            style={{ borderRadius: '12px', border: '1px solid var(--border)' }}
          >
            <img src={artist.avatar} alt={artist.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-xl font-bold" style={{ color: 'var(--text)' }}>{artist.name}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{artist.location}</p>
          </div>
        </div>

        <div className="flex rounded-xl p-4 mt-5 gap-0"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <div className="flex-1 text-center">
            <p className="text-lg font-bold" style={{ color: 'var(--text)' }}>{artist.followers.toLocaleString()}</p>
            <p className="text-[10px]" style={{ color: 'var(--text-weak)' }}>粉丝</p>
          </div>
          <div className="flex-1 text-center" style={{ borderLeft: '1px solid var(--border)' }}>
            <p className="text-lg font-bold" style={{ color: 'var(--text)' }}>{artist.works}</p>
            <p className="text-[10px]" style={{ color: 'var(--text-weak)' }}>作品</p>
          </div>
        </div>
      </div>

      {/* 简介 */}
      <div className="px-4 mb-4">
        <p className="text-[11px] mb-2" style={{ color: 'var(--text-weak)' }}>艺术家简介</p>
        <div className="rounded-2xl p-4 text-sm leading-relaxed"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
        >
          {artist.bio}
        </div>
      </div>

      {/* 作品列表 */}
      <div className="px-4">
        <div className="flex items-center mb-3">
          <span className="font-semibold text-base" style={{ color: 'var(--text)' }}>他的作品</span>
        </div>
        <div className="grid grid-cols-2 gap-3 pb-20">
          {artistWorks.map(art => {
            const isFav = favs.includes(art.id)
            return (
              <div
                key={art.id}
                className="art-card cursor-pointer"
                onClick={() => navigate(`/detail/${art.id}`)}
              >
                <div className="aspect-[4/3] relative" style={{ background: 'var(--surface-2)' }}>
                  <img src={art.img} alt={art.title} className="w-full h-full object-cover" />
                  {art.orig && (
                    <span className="absolute top-2.5 left-2.5 tag-accent">限时</span>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleFav(art.id) }}
                    className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ background: isFav ? 'rgba(199,164,154,0.25)' : 'rgba(255,255,255,0.75)', backdropFilter: 'blur(6px)' }}
                  >
                    <span style={{ fontSize: '13px', color: isFav ? '#C98F86' : '#A59B92' }}>{isFav ? '♥' : '♡'}</span>
                  </button>
                </div>
                <div className="px-3 pt-2.5 pb-3">
                  <p className="text-xs font-semibold truncate mb-0.5" style={{ color: 'var(--text)' }}>{art.title}</p>
                  <p className="text-[10px] mb-1.5" style={{ color: 'var(--text-muted)' }}>{art.artist}</p>
                  <p className="text-sm font-bold" style={{ color: 'var(--primary)' }}>¥{art.price.toLocaleString()}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
