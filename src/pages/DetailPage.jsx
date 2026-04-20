import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../App'
import { getArtistCoverArtwork } from '../artistMedia'
import { getArtworkDetailById } from '../services/contentApi'

function ArtworkDetailSkeleton() {
  return (
    <div className="pb-28 animate-pulse">
      <div className="aspect-[4/3]" style={{ background: 'rgba(232,225,216,0.58)' }} />
      <div className="px-5 pt-5">
        <div className="h-9 w-32 mb-3" style={{ background: 'rgba(232,225,216,0.58)' }} />
        <div className="h-7 w-48 mb-3" style={{ background: 'rgba(232,225,216,0.46)' }} />
        <div className="h-20 w-full" style={{ background: 'rgba(232,225,216,0.36)' }} />
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
      <div className="pb-24 px-4 pt-5 fade-in">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 mb-6 flex items-center justify-center border"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
        >
          ←
        </button>
        <div
          className="border p-6"
          style={{ background: 'rgba(251,248,244,0.95)', borderColor: 'rgba(232,225,216,0.92)' }}
        >
          <p className="text-[10px] tracking-[0.28em] uppercase mb-3" style={{ color: 'var(--text-weak)' }}>
            Artwork Detail
          </p>
          <h1 className="text-[24px] leading-[1.2] font-semibold mb-3" style={{ color: 'var(--text)' }}>
            作品不存在或暂时无法查看
          </h1>
          <p className="text-[13px] leading-6" style={{ color: 'var(--text-muted)' }}>
            请返回作品列表，继续浏览其他艺术品。
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

  const detailRows = [
    ['类别', art.cat],
    ['风格', art.style],
    ['年份', art.year],
    ['材质', art.mat],
    ['尺寸', art.size],
  ]

  return (
    <div className="pb-28 fade-in">
      <div
        className="aspect-[4/3] relative cursor-pointer"
        style={{ background: 'var(--surface-2)' }}
        onClick={() => setShowZoom(true)}
      >
        <img src={art.img} alt={art.title} className="w-full h-full object-cover" />

        <button
          onClick={(event) => {
            event.stopPropagation()
            navigate(-1)
          }}
          className="absolute top-3 left-3 w-10 h-10 flex items-center justify-center text-base border"
          style={{ background: 'rgba(251,248,244,0.84)', borderColor: 'rgba(232,225,216,0.92)', color: 'var(--text)' }}
        >
          ←
        </button>

        <div className="absolute top-3 right-3 flex gap-2">
          <button
            onClick={(event) => {
              event.stopPropagation()
              toggleFav(art.id)
            }}
            className="w-10 h-10 flex items-center justify-center border"
            style={{
              background: 'rgba(251,248,244,0.84)',
              borderColor: 'rgba(232,225,216,0.92)',
              color: isFav ? 'var(--primary)' : 'var(--text-muted)',
            }}
          >
            {isFav ? '♥' : '♡'}
          </button>
          <button
            onClick={(event) => {
              event.stopPropagation()
              navigator.share?.({ title: art.title, text: art.artist })
            }}
            className="w-10 h-10 flex items-center justify-center text-base border"
            style={{ background: 'rgba(251,248,244,0.84)', borderColor: 'rgba(232,225,216,0.92)', color: 'var(--text)' }}
          >
            ↗
          </button>
        </div>
      </div>

      <div className="px-5 pt-5 pb-32">
        <div className="mb-6">
          <p className="text-[28px] font-semibold mb-2" style={{ color: 'var(--primary)' }}>
            ¥{art.price.toLocaleString()}
          </p>
          <h1 className="text-[24px] leading-[1.2] font-semibold mb-2" style={{ color: 'var(--text)' }}>
            {art.title}
          </h1>
          <p className="text-[12px]" style={{ color: 'var(--text-muted)' }}>
            {art.year} · {art.size} · {art.mat}
          </p>
        </div>

        {artist && (
          <button
            onClick={() => navigate(`/artist/${artist.id}`)}
            className="w-full flex items-center gap-3.5 py-4 border-b text-left"
            style={{ borderColor: 'rgba(232,225,216,0.92)' }}
          >
            <div className="w-12 h-12 overflow-hidden flex-shrink-0 border" style={{ borderColor: 'rgba(232,225,216,0.92)' }}>
              {artistCover ? (
                <img src={artistCover.img} alt={`${artist.name}代表作品`} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full" />
              )}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-[15px]" style={{ color: 'var(--text)' }}>
                {artist.name}
              </p>
              <p className="text-[12px]" style={{ color: 'var(--text-muted)' }}>
                查看艺术家主页与全部作品
              </p>
            </div>
            <span className="text-[12px]" style={{ color: 'var(--text-weak)' }}>
              进入主页
            </span>
          </button>
        )}

        <section className="mt-5 mb-5">
          <p className="text-[10px] tracking-[0.22em] uppercase mb-3" style={{ color: 'var(--text-weak)' }}>
            Artwork Story
          </p>
          <h2 className="text-[18px] font-semibold mb-3" style={{ color: 'var(--text)' }}>
            作品详情
          </h2>
          <p className="text-[14px] leading-7" style={{ color: 'var(--text-muted)' }}>
            {art.desc}
          </p>
        </section>

        {artist?.creativePhilosophy && (
          <section className="mb-5">
            <p className="text-[10px] tracking-[0.22em] uppercase mb-3" style={{ color: 'var(--text-weak)' }}>
              Artist Vision
            </p>
            <h2 className="text-[18px] font-semibold mb-3" style={{ color: 'var(--text)' }}>
              艺术家创作理念
            </h2>
            <p className="text-[14px] leading-7" style={{ color: 'var(--text-muted)' }}>
              {artist.creativePhilosophy}
            </p>
          </section>
        )}

        <section className="mb-5">
          <p className="text-[10px] tracking-[0.22em] uppercase mb-3" style={{ color: 'var(--text-weak)' }}>
            Charity Note
          </p>
          <div
            className="border p-4"
            style={{ background: 'rgba(248,244,239,0.95)', borderColor: 'rgba(232,225,216,0.92)' }}
          >
            <p className="text-[13px] leading-6" style={{ color: 'var(--text)' }}>
              {art.charitySupportNote}
            </p>
          </div>
        </section>

        <section>
          <p className="text-[10px] tracking-[0.22em] uppercase mb-3" style={{ color: 'var(--text-weak)' }}>
            Artwork Data
          </p>
          <div className="border" style={{ borderColor: 'rgba(232,225,216,0.92)' }}>
            {detailRows.map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between px-4 py-3 border-b last:border-b-0"
                style={{ borderColor: 'rgba(232,225,216,0.92)' }}
              >
                <span className="text-[12px]" style={{ color: 'var(--text-weak)' }}>
                  {label}
                </span>
                <span className="text-[13px] text-right" style={{ color: 'var(--text)' }}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] p-3 z-40"
        style={{ background: 'rgba(251,248,244,0.94)', backdropFilter: 'blur(12px)', borderTop: '1px solid var(--border)' }}
      >
        {isOwner ? (
          <button
            onClick={() => navigate('/artist/dashboard')}
            className="w-full py-3.5 text-[15px] font-medium"
            style={{ background: 'var(--text)', color: 'white' }}
          >
            进入后台管理
          </button>
        ) : (
          <div className="flex gap-2.5">
            <button
              onClick={() => addToCart(art)}
              className="flex-1 py-3.5 border text-[14px] font-medium"
              style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
            >
              加入购物车
            </button>
            <button
              onClick={() => {
                addToCart(art)
                navigate('/cart')
              }}
              className="flex-1 py-3.5 text-[14px] font-medium"
              style={{ background: 'var(--text)', color: 'white' }}
            >
              立即购买
            </button>
          </div>
        )}
      </div>

      {showZoom && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setShowZoom(false)}
        >
          <img src={art.img} alt={art.title} className="max-w-full max-h-full object-contain" />
          <button
            onClick={() => setShowZoom(false)}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-white text-lg border"
            style={{ background: 'rgba(255,255,255,0.12)', borderColor: 'rgba(255,255,255,0.18)' }}
          >
            ×
          </button>
        </div>
      )}
    </div>
  )
}
