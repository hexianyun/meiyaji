import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../App'
import { getArtistCoverArtwork } from '../artistMedia'
import { getArtistProfileById } from '../services/contentApi'

function BackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"></line>
      <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
  )
}

function HeartIcon({ filled }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[15px] h-[15px]" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

function ArtistProfileSkeleton() {
  return (
    <div className="pb-24 px-4 pt-5 animate-pulse">
      <div className="h-10 w-10 mb-6 bg-gray-200 rounded-full" />
      <div className="aspect-[4/3] mb-5 bg-gray-200 rounded-lg" />
      <div className="h-8 w-40 mb-3 bg-gray-200 rounded-lg" />
      <div className="h-20 w-full bg-gray-100 rounded-lg" />
    </div>
  )
}

export default function ArtistPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { favs, toggleFav } = useApp()
  const [artistProfile, setArtistProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isActive = true

    async function loadArtistProfile() {
      setLoading(true)
      const data = await getArtistProfileById(Number(id))

      if (!isActive) return

      setArtistProfile(data)
      setLoading(false)
    }

    loadArtistProfile()

    return () => {
      isActive = false
    }
  }, [id])

  if (loading) {
    return <ArtistProfileSkeleton />
  }

  if (!artistProfile) {
    return (
      <div className="pb-24 px-4 pt-5 fade-in">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 mb-6 flex items-center justify-center rounded-full shadow-sm transition-transform active:scale-90"
          style={{ background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)' }}
        >
          <BackIcon />
        </button>
        <div
          className="p-6 text-center"
          style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}
        >
          <p className="text-[10px] font-bold tracking-[0.28em] uppercase mb-3" style={{ color: 'var(--text-weak)' }}>
            Artist Profile
          </p>
          <h1 className="text-[20px] font-bold mb-3" style={{ color: 'var(--text)' }}>
            没有找到这位艺术家
          </h1>
          <p className="text-[13px] leading-6 font-medium" style={{ color: 'var(--text-muted)' }}>
            请返回艺术家列表，继续浏览其他艺术家与作品。
          </p>
        </div>
      </div>
    )
  }

  const coverArtwork = getArtistCoverArtwork(artistProfile.id)
  
  const col1 = artistProfile.artworks.filter((_, i) => i % 2 === 0)
  const col2 = artistProfile.artworks.filter((_, i) => i % 2 === 1)

  return (
    <div className="pb-24 fade-in min-h-screen bg-[var(--bg)]">
      <div className="px-4 pt-5">
        <div className="flex items-center justify-between gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full shadow-sm transition-transform active:scale-90"
            style={{ background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)' }}
          >
            <BackIcon />
          </button>
          <p className="text-[10px] font-bold tracking-[0.28em] uppercase" style={{ color: 'var(--text-weak)' }}>
            Artist Profile
          </p>
          <button
            onClick={() => navigate('/artists')}
            className="px-3 py-2 text-[12px] font-bold rounded-full transition-transform active:scale-95 shadow-sm"
            style={{ border: '1px solid var(--border)', color: 'var(--text)', background: 'var(--surface)' }}
          >
            艺术家名录
          </button>
        </div>

        {/* 艺术家主卡片 */}
        <div
          className="overflow-hidden"
          style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}
        >
          <div className="aspect-[4/3] relative" style={{ background: 'var(--surface-2)' }}>
            {coverArtwork ? (
              <img
                src={coverArtwork.img}
                alt={`${artistProfile.name}代表作品`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full" />
            )}
          </div>

          <div className="p-5">
            <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-2" style={{ color: 'var(--accent)' }}>
              Mei Ya Ji Artist
            </p>
            <h1 className="text-[28px] leading-[1.2] font-bold mb-3" style={{ color: 'var(--text)' }}>
              {artistProfile.name}
            </h1>
            <p className="text-[14px] leading-relaxed max-w-[320px] font-medium" style={{ color: 'var(--text-muted)' }}>
              通过艺术家的个人叙述与作品列表，完整呈现其创作气质与持续关注的主题。
            </p>
          </div>
        </div>
      </div>

      <section className="px-4 mt-6">
        <div
          className="p-5"
          style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}
        >
          <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-3" style={{ color: 'var(--text-weak)' }}>
            Creative Philosophy
          </p>
          <h2 className="text-[20px] leading-[1.25] font-bold mb-3" style={{ color: 'var(--text)' }}>
            创作理念
          </h2>
          <p className="text-[14px] leading-relaxed font-medium" style={{ color: 'var(--text-muted)' }}>
            {artistProfile.creativePhilosophy}
          </p>
        </div>
      </section>

      <section className="px-4 mt-8">
        <div className="flex items-end justify-between gap-4 mb-5">
          <div>
            <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-2" style={{ color: 'var(--text-weak)' }}>
              Published Works
            </p>
            <h2 className="text-[20px] font-bold" style={{ color: 'var(--text)' }}>
              全部艺术品
            </h2>
          </div>
          <p className="text-[12px] font-medium" style={{ color: 'var(--text-muted)' }}>
            共 {artistProfile.artworks.length} 件
          </p>
        </div>

        {/* 瀑布流作品列表 */}
        <div className="flex gap-4 items-start">
          <div className="flex flex-col gap-4 flex-1">
            {col1.map(artwork => {
              const isFav = favs.includes(artwork.id)
              return (
                <div
                  key={artwork.id}
                  onClick={() => navigate(`/detail/${artwork.id}`)}
                  className="art-card cursor-pointer group"
                >
                  <div className="img-wrapper relative flex items-center justify-center p-3.5" style={{ background: 'var(--surface-2)' }}>
                    <img src={artwork.img} alt={artwork.title} className="w-full h-auto drop-shadow-md transition-transform duration-700 group-hover:scale-105" />
                    <button
                      onClick={(event) => {
                        event.stopPropagation()
                        toggleFav(artwork.id)
                      }}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-transform active:scale-90"
                      style={{
                        background: isFav ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.6)', 
                        backdropFilter: 'blur(8px)',
                        color: isFav ? 'var(--danger)' : 'var(--text-muted)'
                      }}
                    >
                      <HeartIcon filled={isFav} />
                    </button>
                  </div>
                  <div className="px-3.5 py-3">
                    <p className="text-[14px] font-bold truncate mb-1" style={{ color: 'var(--text)' }}>
                      {artwork.title}
                    </p>
                    <p className="text-[11px] font-medium mb-2.5" style={{ color: 'var(--text-muted)' }}>
                      {artwork.year} · {artwork.mat}
                    </p>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[15px] font-bold" style={{ color: 'var(--accent)' }}>
                        ¥{artwork.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex flex-col gap-4 flex-1">
            {col2.map(artwork => {
              const isFav = favs.includes(artwork.id)
              return (
                <div
                  key={artwork.id}
                  onClick={() => navigate(`/detail/${artwork.id}`)}
                  className="art-card cursor-pointer group"
                >
                  <div className="img-wrapper relative flex items-center justify-center p-3.5" style={{ background: 'var(--surface-2)' }}>
                    <img src={artwork.img} alt={artwork.title} className="w-full h-auto drop-shadow-md transition-transform duration-700 group-hover:scale-105" />
                    <button
                      onClick={(event) => {
                        event.stopPropagation()
                        toggleFav(artwork.id)
                      }}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-transform active:scale-90"
                      style={{
                        background: isFav ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.6)', 
                        backdropFilter: 'blur(8px)',
                        color: isFav ? 'var(--danger)' : 'var(--text-muted)'
                      }}
                    >
                      <HeartIcon filled={isFav} />
                    </button>
                  </div>
                  <div className="px-3.5 py-3">
                    <p className="text-[14px] font-bold truncate mb-1" style={{ color: 'var(--text)' }}>
                      {artwork.title}
                    </p>
                    <p className="text-[11px] font-medium mb-2.5" style={{ color: 'var(--text-muted)' }}>
                      {artwork.year} · {artwork.mat}
                    </p>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[15px] font-bold" style={{ color: 'var(--accent)' }}>
                        ¥{artwork.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
