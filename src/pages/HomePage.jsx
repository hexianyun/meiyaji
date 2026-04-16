import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../App'
import { artworks, artists, charityActivities } from '../data'

/* ===== 公益轮播（莫兰迪风格）===== */
function HeroCarousel({ activities }) {
  const navigate = useNavigate()
  const [current, setCurrent] = useState(0)
  const total = Math.min(activities.length, 3)
  const slides = activities.slice(0, 3)

  const goNext = useCallback(() => {
    setCurrent(prev => (prev + 1) % total)
  }, [total])

  useEffect(() => {
    if (total <= 1) return
    const timer = setInterval(goNext, 4000)
    return () => clearInterval(timer)
  }, [goNext, total])

  if (!slides.length) return null

  return (
    <div className="mx-4 mt-5 rounded-2xl overflow-hidden relative" style={{ background: 'var(--surface)' }}>
      {slides.map((item, i) => {
        const isActive = i === current
        return (
          <div
            key={item.id}
            onClick={() => navigate(`/charity/article/${item.id}`)}
            className={`cursor-pointer transition-all duration-700 ease-out ${isActive ? 'opacity-100' : 'opacity-0 absolute inset-0'}`}
            style={{ pointerEvents: isActive ? 'auto' : 'none' }}
          >
            <div className="aspect-[4/3] relative">
              <img src={item.cover} alt={item.title} className="w-full h-full object-cover" />
              {/* 柔和渐变 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

              {/* 标签区 */}
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="tag-sage">公益活动</span>
                <span className="text-white/80 text-[11px] px-2.5 py-0.5 rounded-full backdrop-blur-sm bg-white/15">
                  {item.location}
                </span>
              </div>

              {/* 文字信息 */}
              <div className="absolute bottom-5 left-5 right-5">
                <p className="text-white font-semibold leading-relaxed text-base drop-shadow-sm line-clamp-2">
                  {item.title}
                </p>
                <p className="text-white/70 text-xs mt-2">{item.date}</p>
              </div>
            </div>
          </div>
        )
      })}

      {/* 轻量指示器 */}
      {total > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {Array.from({ length: total }).map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setCurrent(i) }}
              className={`transition-all rounded-full ${
                i === current ? 'w-5 h-1.5 bg-primary' : 'w-1.5 h-1.5 bg-white/40'
              }`}
              style={{ transitionDuration: '0.3s' }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/* ===== 艺术品卡片（画廊风格）===== */
function ArtCard({ art }) {
  const navigate = useNavigate()
  const { favs, toggleFav, addToCart, showToast } = useApp()
  const isFav = favs.includes(art.id)

  return (
    <div
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
          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md"
          style={{ background: isFav ? 'rgba(199,164,154,0.25)' : 'rgba(255,255,255,0.75)' }}
        >
          <span style={{ fontSize: '13px', color: isFav ? '#C98F86' : '#A59B92' }}>{isFav ? '♥' : '♡'}</span>
        </button>
      </div>
      <div className="px-4 pt-3 pb-3.5">
        <p className="text-sm font-semibold truncate mb-1" style={{ color: 'var(--text)', letterSpacing: '0.01em' }}>
          {art.title}
        </p>
        <p className="text-xs mb-2.5 truncate" style={{ color: 'var(--text-muted)' }}>
          {art.artist} · {art.mat}
        </p>
        <div className="flex justify-between items-center">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold" style={{ color: 'var(--primary)' }}>
              ¥{art.price.toLocaleString()}
            </span>
            {art.charityPct && (
              <span className="tag-sage" style={{ fontSize: '9px', padding: '2px 8px' }}>
                {art.charityPct}%公益
              </span>
            )}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); addToCart(art); showToast('已加入购物车') }}
            className="w-7 h-7 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
          >
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>+</span>
          </button>
        </div>
      </div>
    </div>
  )
}

/* ===== 首页主体 ===== */
export default function HomePage() {
  const navigate = useNavigate()
  const featured = artworks.filter(a => a.featured).slice(0, 6)
  const displayedArtists = artists.slice(0, 10)

  // 按日期降序取最新3条公益活动
  const recentActivities = [...charityActivities]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3)

  return (
    <div className="pb-20 fade-in">
      {/* ===== 品牌区域（留白、安静） ===== */}
      <div className="pt-10 pb-8 px-6">
        <p className="text-[10px] tracking-[0.35em] uppercase mb-2.5" style={{ color: 'var(--text-weak)' }}>
          MEIYAJI
        </p>
        <h1 className="text-[28px] font-bold mb-2.5" style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}>
          美芽集
        </h1>
        <p className="text-sm max-w-[240px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          收藏艺术之美，灌溉乡村美育之芽
        </p>
      </div>

      {/* ===== 首屏轮播大图 ===== */}
      <HeroCarousel activities={recentActivities} />

      {/* ===== 公益动态卡片 ===== */}
      <div className="mt-8 px-4">
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold text-base" style={{ color: 'var(--text)' }}>最新公益</span>
          <button
            onClick={() => navigate('/charity')}
            className="btn-ghost"
          >
            全部 →
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          {recentActivities.map(item => (
            <div
              key={item.id}
              onClick={() => navigate(`/charity/article/${item.id}`)}
              className="rounded-xl overflow-hidden cursor-pointer active:scale-[0.97] transition-transform"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <div className="aspect-square relative" style={{ background: 'var(--surface-2)' }}>
                <img src={item.cover} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-t-xl" />
                <span className="absolute top-2 left-2 tag-sage" style={{ fontSize: '8px', padding: '2px 7px' }}>
                  {item.tag}
                </span>
              </div>
              <div className="px-2 pt-1.5 pb-2.5">
                <p className="text-[11px] font-medium line-clamp-1 mb-0.5" style={{ color: 'var(--text)' }}>
                  {item.title.replace(/——|—/, '\n').split('\n').pop()}
                </p>
                <p className="text-[9px]" style={{ color: 'var(--text-weak)' }}>
                  {item.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== 推荐艺术品 ===== */}
      <div className="mt-8 px-4">
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold text-base" style={{ color: 'var(--text)' }}>推荐作品</span>
          <button
            onClick={() => navigate('/discover')}
            className="btn-ghost"
          >
            全部 →
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {featured.map(art => (
            <ArtCard key={art.id} art={art} />
          ))}
        </div>
      </div>

      {/* ===== 艺术家 ===== */}
      <div className="mt-8 px-4 pb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold text-base" style={{ color: 'var(--text)' }}>艺术家</span>
          <button
            onClick={() => navigate('/artists')}
            className="btn-ghost"
          >
            全部 →
          </button>
        </div>
        <div className="grid grid-cols-5 gap-3">
          {displayedArtists.map(artist => (
            <div
              key={artist.id}
              onClick={() => navigate(`/artist/${artist.id}`)}
              className="text-center cursor-pointer group"
            >
              <div
                className="aspect-square overflow-hidden mb-2 transition-transform duration-300 group-active:scale-95"
                style={{
                  borderRadius: '16px',
                  border: '1.5px solid var(--border)',
                  background: 'var(--surface)',
                }}
              >
                <img
                  src={artist.avatar}
                  alt={artist.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-[11px] font-medium truncate" style={{ color: 'var(--text)' }}>
                {artist.name}
              </p>
              <p className="text-[9px] truncate" style={{ color: 'var(--text-weak)' }}>
                {artist.location}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
