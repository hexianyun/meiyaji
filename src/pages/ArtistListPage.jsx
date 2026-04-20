import { useNavigate } from 'react-router-dom'
import { artists } from '../data'
import { getArtistCoverArtwork } from '../artistMedia'

export default function ArtistListPage() {
  const navigate = useNavigate()

  return (
    <div className="pb-20 fade-in">
      {/* 品牌头 */}
      <div className="pt-10 pb-8 px-6">
        <p className="text-[10px] tracking-[0.35em] uppercase mb-2.5" style={{ color: 'var(--text-weak)' }}>
          ARTISTS
        </p>
        <h1 className="text-[26px] font-bold mb-2" style={{ color: 'var(--text)', letterSpacing: '-0.01em' }}>
          艺术家
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          探索名家风采，品味艺术人生
        </p>
      </div>

      <div className="px-4 pb-6 grid grid-cols-2 gap-3">
        {artists.map(artist => {
          const coverArt = getArtistCoverArtwork(artist.id)

          return (
            <div
              key={artist.id}
              onClick={() => navigate(`/artist/${artist.id}`)}
              className="rounded-2xl overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <div className="aspect-square relative" style={{ background: 'var(--surface-2)' }}>
                {coverArt ? (
                  <img src={coverArt.img} alt={`${artist.name}作品《${coverArt.title}》`} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full" />
                )}
                <span className="absolute top-2 left-2 tag-sage" style={{ fontSize: '9px', padding: '2px 7px' }}>
                  代表作品
                </span>
                <span className="absolute bottom-2 right-2 text-white text-[9px] px-2 py-0.5 rounded-full backdrop-blur-md bg-black/30">
                  {artist.location}
                </span>
              </div>
              <div className="px-4 pt-3 pb-4">
                <p className="text-sm font-semibold mb-0.5" style={{ color: 'var(--text)' }}>{artist.name}</p>
                <p className="text-[11px] leading-relaxed line-clamp-2 mb-2.5" style={{ color: 'var(--text-muted)' }}>{artist.bio}</p>
                <div className="flex justify-between text-[10px]" style={{ color: 'var(--text-weak)' }}>
                  <span>{artist.works} 件作品</span>
                  <span>{artist.followers.toLocaleString()} 关注</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
