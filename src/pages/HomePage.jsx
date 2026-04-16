import { useNavigate } from 'react-router-dom'
import { useApp } from '../App'
import { artworks, artists, categories, categoryIcons, exhibitions } from '../data'

export default function HomePage() {
  const navigate = useNavigate()
  const { showToast, addToCart } = useApp()
  const featured = artworks.filter(a => a.featured)

  return (
    <div className="pb-16 fade-in">
      <div className="bg-background p-4 pb-0">
        <div className="flex items-end justify-between mb-3">
          <div>
            <p className="text-[10px] text-text-light tracking-widest mb-1">ART GALLERY</p>
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

      <div className="my-4">
        <div className="flex items-center justify-between px-4 mb-3">
          <div className="flex items-center gap-2">
            <span className="bg-green-500 text-white text-[10px] px-2 py-1 rounded-full font-bold">💚 公益计划</span>
          </div>
          <span
            onClick={() => navigate('/charity')}
            className="text-green-700 text-xs font-semibold cursor-pointer"
          >
            全部活动 ›
          </span>
        </div>

        <div className="px-4">
          <div
            onClick={() => navigate('/charity')}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-divider cursor-pointer"
          >
            <div className="h-[120px] bg-gradient-to-br from-green-400 to-emerald-600 relative flex items-center justify-center">
              <span className="text-5xl">🌱</span>
              <span className="absolute top-3 right-3 bg-white/25 backdrop-blur-sm text-white text-[9px] px-2 py-0.5 rounded-full font-bold">
                进行中
              </span>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-bold">山区儿童艺术教育基金</span>
              </div>
              <p className="text-[10px] text-text-light mb-2">🏛️ 中国青少年发展基金会</p>
              <p className="text-xs text-text-light leading-relaxed mb-3">为偏远山区的孩子们提供艺术教育资源，让美育不因地域而受限。</p>
              <div className="bg-gray-100 rounded-full h-1.5 mb-2">
                <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '73%' }}></div>
              </div>
              <div className="flex justify-between items-center text-[10px] text-text-light mb-3">
                <span>已筹 <span className="font-semibold text-green-600">¥73,680</span></span>
                <span>目标 ¥100,000 · <span className="font-semibold text-green-600">73%</span></span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-divider">
                <span className="text-[10px] text-text-light">👥 2,341 人参与</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate('/charity')
                    showToast('感谢您对山区儿童的关注！')
                  }}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-1.5 rounded-full text-xs font-bold"
                >
                  💚 支持项目
                </button>
              </div>
            </div>
          </div>
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

      <div className="px-4 pb-2 overflow-x-auto">
        <div className="flex gap-2">
          {exhibitions.slice(0, 3).map(ex => (
            <div
              key={ex.id}
              onClick={() => navigate('/exhibitions')}
              className="flex-shrink-0 w-40 bg-white rounded-xl border border-divider overflow-hidden cursor-pointer"
            >
              <div className="aspect-[4/3] bg-gradient-to-br from-divider to-[#D4C5B0] relative">
                <img
                  src={ex.cover}
                  alt={ex.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-1 left-1 bg-primary text-white text-[8px] px-1.5 py-0.5 rounded">
                  {ex.tag}
                </span>
              </div>
              <div className="p-2">
                <p className="text-[10px] font-semibold truncate">{ex.title}</p>
                <p className="text-[9px] text-text-light mt-0.5">{ex.date}</p>
              </div>
            </div>
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
