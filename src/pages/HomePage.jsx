import { useNavigate } from 'react-router-dom'
import { useApp } from '../App'
import { artworks, artists } from '../data'

export default function HomePage() {
  const navigate = useNavigate()
  const { showToast, addToCart } = useApp()
  const featured = artworks.filter(a => a.featured)

  return (
    <div className="pb-16 fade-in">
      <div className="bg-background p-4 pb-0">
        <div className="flex items-end justify-between mb-3">
          <div>
            <p className="text-[10px] text-text-light tracking-widest mb-1">MEIYAJI</p>
            <h1 className="text-2xl font-bold">美芽集</h1>
          </div>
          <button
            onClick={() => navigate('/profile')}
            className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center"
          >
            🌟
          </button>
        </div>
      </div>

      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <span className="font-bold text-base">精品推荐</span>
          <span
            onClick={() => navigate('/discover')}
            className="text-primary text-xs cursor-pointer"
          >
            查看全部 →
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {featured.map(art => (
            <ArtCard key={art.id} art={art} />
          ))}
        </div>
      </div>

      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <span className="font-bold text-base">热门艺术家</span>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {artists.map(artist => (
            <div
              key={artist.id}
              onClick={() => navigate(`/artist/${artist.id}`)}
              className="text-center flex-shrink-0 cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full border-2 border-primary overflow-hidden mb-2">
                <img
                  src={artist.avatar}
                  alt={artist.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs font-semibold">{artist.name}</p>
              <p className="text-[10px] text-text-light">{artist.location}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ArtCard({ art }) {
  const navigate = useNavigate()
  const { favs, toggleFav } = useApp()
  const isFav = favs.includes(art.id)

  return (
    <div
      className="bg-white rounded-xl border border-divider overflow-hidden cursor-pointer"
      onClick={() => navigate(`/detail/${art.id}`)}
    >
      <div className="aspect-[4/3] relative bg-gradient-to-br from-divider to-[#D4C5B0]">
        <img
          src={art.img}
          alt={art.title}
          className="w-full h-full object-cover"
        />
        {art.orig && (
          <span className="absolute top-2 left-2 bg-danger text-white text-[9px] px-1.5 py-0.5 rounded">
            限时
          </span>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation()
            toggleFav(art.id)
          }}
          className="absolute top-2 right-2 w-7 h-7 bg-white/85 rounded-full flex items-center justify-center text-sm"
        >
          {isFav ? '❤️' : '🤍'}
        </button>
      </div>
      <div className="p-2.5">
        <p className="text-xs font-semibold truncate mb-0.5">{art.title}</p>
        <p className="text-[10px] text-text-light mb-1.5">{art.artist} · {art.cat}</p>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-primary">¥{art.price.toLocaleString()}</p>
            {art.charityPct && (
              <span className="bg-green-100 text-green-700 text-[9px] px-1.5 py-0.5 rounded">
                {art.charityPct}%公益
              </span>
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              addToCart(art)
              showToast('已加入购物车')
            }}
            className="w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center text-xs"
          >
            🛒
          </button>
        </div>
      </div>
    </div>
  )
}
