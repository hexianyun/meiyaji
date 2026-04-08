import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../App'
import { artworks, artists, categories, categoryIcons, charity, exhibitions } from '../data'

export default function HomePage() {
  const navigate = useNavigate()
  const { showToast } = useApp()
  const featured = artworks.filter(a => a.featured)
  const [currentSlide, setCurrentSlide] = useState(0)
  const trackRef = useRef(null)

  const scrollToSlide = (index) => {
    if (trackRef.current) {
      const slideWidth = 296
      trackRef.current.scrollTo({
        left: index * slideWidth,
        behavior: 'smooth'
      })
      setCurrentSlide(index)
    }
  }

  const handleScroll = (e) => {
    const scrollLeft = e.target.scrollLeft
    const slideWidth = 296
    const newIndex = Math.round(scrollLeft / slideWidth)
    setCurrentSlide(newIndex)
  }

  return (
    <div className="pb-16 fade-in">
      <div className="bg-background p-4 pb-0">
        <div className="flex items-end justify-between mb-3">
          <div>
            <p className="text-[10px] text-text-light tracking-widest mb-1">ART GALLERY</p>
            <h1 className="text-2xl font-bold">画里画外</h1>
          </div>
          <button
            onClick={() => navigate('/profile')}
            className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center"
          >
            🌟
          </button>
        </div>

        <div
          onClick={() => navigate('/discover')}
          className="bg-white border border-divider rounded-full px-4 py-3 flex items-center gap-2"
        >
          <span>🔍</span>
          <span className="text-text-light text-sm">搜索艺术品、艺术家...</span>
        </div>
      </div>

      <div
        onClick={() => navigate(`/detail/${featured[0].id}`)}
        className="mx-4 my-3 rounded-2xl overflow-hidden relative aspect-video cursor-pointer"
      >
        <img
          src={featured[0].img}
          alt={featured[0].title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-end p-5">
          <span className="bg-primary text-white text-[10px] px-2 py-1 rounded-full inline-block mb-1 w-fit">
            精选
          </span>
          <p className="text-white text-lg font-bold mb-1">{featured[0].title}</p>
          <p className="text-white/80 text-xs mb-1">{featured[0].artist} · {featured[0].cat}</p>
          <p className="text-secondary font-bold">¥{featured[0].price.toLocaleString()}</p>
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

        <div className="relative">
          <div
            ref={trackRef}
            onScroll={handleScroll}
            className="flex gap-3 overflow-x-auto px-4 pb-2 scroll-smooth"
            style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}
          >
            {charity.map((item, index) => (
              <div
                key={item.id}
                onClick={() => navigate('/charity')}
                className="flex-shrink-0 w-[280px] h-[180px] rounded-2xl overflow-hidden relative cursor-pointer"
                style={{ scrollSnapAlign: 'start' }}
              >
                <img
                  src={item.cover}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <span className="bg-white/25 backdrop-blur-sm text-[9px] px-2 py-0.5 rounded-full font-bold">
                    {item.tag}
                  </span>
                  <p className="text-sm font-bold mt-2 leading-tight">{item.title}</p>
                  <p className="text-[11px] text-white/80 mt-1">{item.desc.substring(0, 20)}...</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-1.5 mt-3">
          {charity.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToSlide(index)}
              className={`h-1.5 rounded-full transition-all ${
                currentSlide === index
                  ? 'w-5 bg-green-500'
                  : 'w-1.5 bg-gray-300'
              }`}
            />
          ))}
        </div>

        <div className="flex justify-center mt-3 px-4">
          <button
            onClick={() => showToast('感谢您的支持！')}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-2.5 rounded-full text-sm font-bold shadow-lg"
          >
            💚 支持公益
          </button>
        </div>
      </div>

      <div className="px-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="font-bold text-base">艺术分类</span>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => navigate('/discover')}
              className="flex flex-col items-center gap-1.5"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">
                {categoryIcons[cat]}
              </div>
              <span className="text-xs text-text-light font-medium">{cat}</span>
            </button>
          ))}
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

      <div
        onClick={() => navigate('/exhibitions')}
        className="mx-4 my-4 rounded-2xl bg-gradient-to-br from-primary to-secondary p-5 flex items-center gap-4 text-white cursor-pointer"
      >
        <span className="text-4xl flex-shrink-0">🎨</span>
        <div className="flex-1">
          <p className="font-bold text-sm mb-1">正在展出 & 即将开展</p>
          <p className="text-xs opacity-85 leading-relaxed">探索精彩展览，参与艺术活动</p>
        </div>
        <span className="bg-white/20 border border-white/40 px-3 py-2 rounded-full text-xs flex-shrink-0">
          查看全部
        </span>
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
          <p className="text-sm font-bold text-primary">¥{art.price.toLocaleString()}</p>
          {art.charityPct && (
            <span className="bg-green-100 text-green-700 text-[9px] px-1.5 py-0.5 rounded">
              {art.charityPct}%公益
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
