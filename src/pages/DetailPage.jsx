import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../App'
import { getArtistCoverArtwork } from '../artistMedia'
import { getArtworkDetailById } from '../services/contentApi'

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
    <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[18px] h-[18px]" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

function ShareIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3"></circle>
      <circle cx="6" cy="12" r="3"></circle>
      <circle cx="18" cy="19" r="3"></circle>
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
    </svg>
  )
}

function ArtworkDetailSkeleton() {
  return (
    <div className="pb-28 animate-pulse">
      <div className="aspect-[4/3] bg-gray-200" />
      <div className="px-5 pt-6">
        <div className="h-10 w-32 mb-4 bg-gray-200 rounded-lg" />
        <div className="h-8 w-48 mb-4 bg-gray-200 rounded-lg" />
        <div className="h-4 w-64 mb-8 bg-gray-100 rounded-lg" />
        
        <div className="h-24 w-full mb-6 bg-gray-100 rounded-2xl" />
        <div className="h-32 w-full bg-gray-100 rounded-2xl" />
      </div>
    </div>
  )
}

export default function DetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { favs, toggleFav, addToCart, currentUser } = useApp()
  const [showZoom, setShowZoom] = useState(false)
  const [artworkDetail, setArtworkDetail] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isActive = true

    async function loadArtworkDetail() {
      setLoading(true)
      const data = await getArtworkDetailById(Number(id))

      if (!isActive) return

      setArtworkDetail(data)
      setLoading(false)
    }

    loadArtworkDetail()

    return () => {
      isActive = false
    }
  }, [id])

  if (loading) {
    return <ArtworkDetailSkeleton />
  }

  if (!artworkDetail) {
    return (
      <div className="pb-24 px-4 pt-5 fade-in min-h-screen">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 mb-6 flex items-center justify-center rounded-full bg-white shadow-sm transition-transform active:scale-90"
          style={{ color: 'var(--text)' }}
        >
          <BackIcon />
        </button>
        <div
          className="p-8 text-center"
          style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}
        >
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase mb-4" style={{ color: 'var(--text-weak)' }}>
            Error
          </p>
          <h1 className="text-[20px] font-bold mb-3" style={{ color: 'var(--text)' }}>
            作品不存在或已下架
          </h1>
          <p className="text-[14px]" style={{ color: 'var(--text-muted)' }}>
            请返回列表，继续浏览其他艺术品。
          </p>
        </div>
      </div>
    )
  }

  const art = artworkDetail
  const artist = artworkDetail.artistProfile
  const artistCover = artist ? getArtistCoverArtwork(artist.id) : null
  const isFav = favs.includes(art.id)
  const isOwner =
    currentUser?.role === 'artist' &&
    currentUser?.artistStatus === 'approved' &&
    currentUser?.artistProfileId === art.aid

  return (
    <div className="pb-32 fade-in min-h-screen bg-[var(--bg)]">
      {/* 顶部导航栏 */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3 sticky top-0 z-30" style={{ background: 'rgba(250, 250, 250, 0.85)', backdropFilter: 'blur(16px) saturate(180%)' }}>
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full transition-transform active:scale-90 shadow-sm"
          style={{ background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)' }}
        >
          <BackIcon />
        </button>

        <div className="flex gap-3">
          <button
            onClick={() => toggleFav(art.id)}
            className="w-10 h-10 flex items-center justify-center rounded-full transition-transform active:scale-90 shadow-sm"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              color: isFav ? 'var(--danger)' : 'var(--text)',
            }}
          >
            <HeartIcon filled={isFav} />
          </button>
          <button
            onClick={() => navigator.share?.({ title: art.title, text: art.artist })}
            className="w-10 h-10 flex items-center justify-center rounded-full transition-transform active:scale-90 shadow-sm"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
          >
            <ShareIcon />
          </button>
        </div>
      </div>

      {/* 顶部图片 */}
      <div
        className="aspect-[4/3] relative cursor-pointer group overflow-hidden"
        style={{ background: 'var(--surface-2)' }}
        onClick={() => setShowZoom(true)}
      >
        <img src={art.img} alt={art.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]" />
      </div>

      {/* 核心信息区 */}
      <div className="px-5 pt-6">
        <div className="mb-8">
          <p className="text-[32px] font-bold mb-2 tracking-tight" style={{ color: 'var(--accent)' }}>
            ¥{art.price.toLocaleString()}
          </p>
          <h1 className="text-[26px] leading-[1.3] font-bold mb-2" style={{ color: 'var(--text)' }}>
            {art.title}
          </h1>
          <p className="text-[13px] font-medium" style={{ color: 'var(--text-muted)' }}>
            {art.year} · {art.size} · {art.mat}
          </p>
        </div>

        {/* 艺术家信息卡片 */}
        {artist && (
          <div
            onClick={() => navigate(`/artist/${artist.id}`)}
            className="w-full flex items-center gap-4 p-4 mb-8 cursor-pointer transition-transform hover:-translate-y-1"
            style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}
          >
            <div className="w-14 h-14 overflow-hidden flex-shrink-0 rounded-full shadow-sm" style={{ border: '2px solid white', background: 'var(--surface-2)' }}>
              {artistCover ? (
                <img src={artistCover.img} alt={`${artist.name}代表作品`} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[16px] mb-0.5 truncate" style={{ color: 'var(--text)' }}>
                {artist.name}
              </p>
              <p className="text-[12px] font-medium truncate" style={{ color: 'var(--text-muted)' }}>
                查看艺术家主页与全部作品
              </p>
            </div>
            <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'var(--bg)', color: 'var(--text-weak)' }}>
              ›
            </div>
          </div>
        )}

        {/* 作品详情 */}
        <section className="mb-8">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase mb-3" style={{ color: 'var(--text-weak)' }}>
            Artwork Story
          </p>
          <h2 className="text-[20px] font-bold mb-4" style={{ color: 'var(--text)' }}>
            作品详情
          </h2>
          <p className="text-[15px] leading-[1.8] font-medium" style={{ color: 'var(--text-muted)' }}>
            {art.desc}
          </p>
        </section>

        {/* 艺术家理念 */}
        {artist?.creativePhilosophy && (
          <section className="mb-8">
            <p className="text-[11px] font-bold tracking-[0.2em] uppercase mb-3" style={{ color: 'var(--text-weak)' }}>
              Artist Vision
            </p>
            <h2 className="text-[20px] font-bold mb-4" style={{ color: 'var(--text)' }}>
              创作理念
            </h2>
            <p className="text-[15px] leading-[1.8] font-medium" style={{ color: 'var(--text-muted)' }}>
              {artist.creativePhilosophy}
            </p>
          </section>
        )}

        {/* 公益说明 */}
        <section className="mb-8">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase mb-3" style={{ color: 'var(--text-weak)' }}>
            Charity Note
          </p>
          <div
            className="p-5"
            style={{ background: 'rgba(107, 142, 125, 0.08)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(107, 142, 125, 0.15)' }}
          >
            <p className="text-[14px] leading-[1.8] font-medium" style={{ color: 'var(--success)' }}>
              {art.charitySupportNote}
            </p>
          </div>
        </section>

      </div>

      {/* 底部购买条 */}
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] p-4 z-40 safe-area-pb"
        style={{ 
          background: 'rgba(255, 255, 255, 0.85)', 
          backdropFilter: 'blur(20px) saturate(180%)', 
          borderTop: '1px solid rgba(0,0,0,0.05)',
          boxShadow: '0 -4px 24px rgba(0,0,0,0.04)'
        }}
      >
        {isOwner ? (
          <button
            onClick={() => navigate('/artist/dashboard')}
            className="btn-primary w-full py-3.5 text-[15px]"
          >
            进入后台管理
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={() => addToCart(art)}
              className="btn-outline flex-1 py-3.5 text-[14px] font-bold"
              style={{ background: 'var(--surface)' }}
            >
              加入购物车
            </button>
            <button
              onClick={() => {
                addToCart(art)
                navigate('/cart')
              }}
              className="btn-primary flex-1 py-3.5 text-[14px]"
            >
              立即购买
            </button>
          </div>
        )}
      </div>

      {/* 图片放大查看 */}
      {showZoom && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 fade-in"
          onClick={() => setShowZoom(false)}
        >
          <img src={art.img} alt={art.title} className="max-w-full max-h-full object-contain" />
          <button
            onClick={() => setShowZoom(false)}
            className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full transition-transform active:scale-90"
            style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
