import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../App'
import { artworks, artists, charityActivities } from '../data'

function CharityCarousel({ activities }) {
  const navigate = useNavigate()
  const [current, setCurrent] = useState(0)
  const total = Math.min(activities.length, 3)
  const slides = activities.slice(0, 3)

  const goNext = useCallback(() => {
    setCurrent(prev => (prev + 1) % total)
  }, [total])

  useEffect(() => {
    if (total <= 1) return
    const timer = setInterval(goNext, 3500)
    return () => clearInterval(timer)
  }, [goNext, total])

  if (!slides.length) return null

  return (
    <div className="mx-4 mt-3 rounded-xl overflow-hidden relative bg-gradient-to-br from-green-600 to-green-800">
      {/* 轮播图片区 */}
      {slides.map((item, i) => {
        const isActive = i === current
        return (
          <div
            key={item.id}
            onClick={() => navigate(`/charity/article/${item.id}`)}
            className={`cursor-pointer transition-all duration-500 ease-in-out ${isActive ? 'opacity-100' : 'opacity-0 absolute inset-0'}`}
            style={{ pointerEvents: isActive ? 'auto' : 'none' }}
          >
            <div className="aspect-[16/9] relative">
              <img
                src={item.cover}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* 标签 */}
              <div className="absolute top-3 left-3 flex gap-2">
                <span className="bg-green-500/90 backdrop-blur-sm text-white text-[10px] px-2.5 py-1 rounded-full font-medium">
                  💚 公益活动
                </span>
                <span className="bg-white/20 backdrop-blur-sm text-white text-[10px] px-2.5 py-1 rounded-full">
                  {item.location}
                </span>
              </div>

              {/* 文字信息 */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-sm font-bold leading-snug line-clamp-2">{item.title}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[11px] text-white/85">{item.date}</span>
                  <span className="text-[11px] text-white/85">👥 约{item.participants}人参与</span>
                </div>
                <div className="mt-2 inline-flex items-center gap-1 bg-green-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                  查看详情 →
                </div>
              </div>
            </div>
          </div>
        )
      })}

      {/* 指示器 */}
      {total > 1 && (
        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {Array.from({ length: total }).map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setCurrent(i) }}
              className={`transition-all rounded-full ${
                i === current ? 'w-5 h-2 bg-white' : 'w-2 h-2 bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function HomePage() {
  const navigate = useNavigate()
  const { showToast, addToCart } = useApp()
  const featured = artworks.filter(a => a.featured).slice(0, 6)
  const displayedArtists = artists.slice(0, 10)

  // 按日期降序取最新3条公益活动
  const recentActivities = [...charityActivities]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3)

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

      {/* 公益活动轮播 */}
      <CharityCarousel activities={recentActivities} />

      <div className="px-4 mt-4">
        <div className="flex items-center justify-between mb-3">
          <span className="font-bold text-base">艺术品</span>
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
          <span className="font-bold text-base">艺术家</span>
        </div>
        <div className="grid grid-cols-5 gap-3">
          {displayedArtists.map(artist => (
            <div
              key={artist.id}
              onClick={() => navigate(`/artist/${artist.id}`)}
              className="text-center cursor-pointer"
            >
              <div className="aspect-square rounded-xl border-2 border-primary overflow-hidden mb-1.5">
                <img
                  src={artist.avatar}
                  alt={artist.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-[11px] font-semibold truncate">{artist.name}</p>
              <p className="text-[9px] text-text-light truncate">{artist.location}</p>
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
