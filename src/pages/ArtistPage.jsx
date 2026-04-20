import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../App'
import { getArtistCoverArtwork } from '../artistMedia'
import { getArtistProfileById } from '../services/contentApi'

function ArtistProfileSkeleton() {
  return (
    <div className="pb-24 px-4 pt-5 animate-pulse">
      <div className="h-10 w-10 mb-6 border" style={{ borderColor: 'var(--border)' }} />
      <div className="aspect-[4/3] mb-5" style={{ background: 'rgba(232,225,216,0.58)' }} />
      <div className="h-8 w-40 mb-3" style={{ background: 'rgba(232,225,216,0.58)' }} />
      <div className="h-20 w-full" style={{ background: 'rgba(232,225,216,0.42)' }} />
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
            Artist Profile
          </p>
          <h1 className="text-[24px] leading-[1.2] font-semibold mb-3" style={{ color: 'var(--text)' }}>
            没有找到这位艺术家
          </h1>
          <p className="text-[13px] leading-6" style={{ color: 'var(--text-muted)' }}>
            请返回艺术家列表，继续浏览其他艺术家与作品。
          </p>
        </div>
      </div>
    )
  }

  const coverArtwork = getArtistCoverArtwork(artistProfile.id)

  return (
    <div className="pb-24 fade-in">
      <div className="px-4 pt-5">
        <div className="flex items-center justify-between gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center border"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
          >
            ←
          </button>
          <p className="text-[10px] tracking-[0.28em] uppercase" style={{ color: 'var(--text-weak)' }}>
            Artist Profile
          </p>
          <button
            onClick={() => navigate('/artists')}
            className="px-3 py-2 text-[12px] border"
            style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
          >
            艺术家列表
          </button>
        </div>

        <div
          className="border overflow-hidden"
          style={{ borderColor: 'rgba(232,225,216,0.92)', background: 'rgba(251,248,244,0.94)' }}
        >
          <div className="aspect-[4/3]" style={{ background: 'var(--surface-2)' }}>
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
            <p className="text-[10px] tracking-[0.22em] uppercase mb-3" style={{ color: 'var(--text-weak)' }}>
              Mei Ya Ji Artist
            </p>
            <h1 className="text-[30px] leading-[1.08] font-semibold mb-4" style={{ color: 'var(--text)' }}>
              {artistProfile.name}
            </h1>
            <p className="text-[13px] leading-6 max-w-[320px]" style={{ color: 'var(--text-muted)' }}>
              通过艺术家的个人叙述与作品列表，完整呈现其创作气质与持续关注的主题。
            </p>
          </div>
        </div>
      </div>

      <section className="px-4 mt-5">
        <div
          className="border p-5"
          style={{ background: 'rgba(251,248,244,0.95)', borderColor: 'rgba(232,225,216,0.92)' }}
        >
          <p className="text-[10px] tracking-[0.22em] uppercase mb-3" style={{ color: 'var(--text-weak)' }}>
            Creative Philosophy
          </p>
          <h2 className="text-[20px] leading-[1.25] font-semibold mb-3" style={{ color: 'var(--text)' }}>
            创作理念
          </h2>
          <p className="text-[14px] leading-7" style={{ color: 'var(--text-muted)' }}>
            {artistProfile.creativePhilosophy}
          </p>
        </div>
      </section>

      <section className="px-4 mt-5">
        <div className="flex items-end justify-between gap-4 mb-4">
          <div>
            <p className="text-[10px] tracking-[0.22em] uppercase mb-2" style={{ color: 'var(--text-weak)' }}>
              Published Works
            </p>
            <h2 className="text-[20px] font-semibold" style={{ color: 'var(--text)' }}>
              全部艺术品
            </h2>
          </div>
          <p className="text-[12px]" style={{ color: 'var(--text-muted)' }}>
            共 {artistProfile.artworks.length} 件
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {artistProfile.artworks.map(artwork => {
            const isFav = favs.includes(artwork.id)

            return (
              <article
                key={artwork.id}
                onClick={() => navigate(`/detail/${artwork.id}`)}
                className="text-left border overflow-hidden cursor-pointer"
                style={{ borderColor: 'rgba(232,225,216,0.92)', background: 'rgba(251,248,244,0.92)' }}
              >
                <div className="aspect-[4/5] relative" style={{ background: 'var(--surface-2)' }}>
                  <img src={artwork.img} alt={artwork.title} className="w-full h-full object-cover" />
                  <button
                    onClick={(event) => {
                      event.stopPropagation()
                      toggleFav(artwork.id)
                    }}
                    className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center border"
                    style={{
                      background: 'rgba(251,248,244,0.92)',
                      borderColor: 'rgba(232,225,216,0.92)',
                      color: isFav ? 'var(--primary)' : 'var(--text-muted)',
                    }}
                  >
                    {isFav ? '♥' : '♡'}
                  </button>
                </div>
                <div className="p-4">
                  <p className="text-[15px] font-semibold leading-[1.35] mb-1" style={{ color: 'var(--text)' }}>
                    {artwork.title}
                  </p>
                  <p className="text-[11px] mb-3" style={{ color: 'var(--text-muted)' }}>
                    {artwork.year} · {artwork.mat}
                  </p>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[16px] font-semibold" style={{ color: 'var(--primary)' }}>
                      ¥{artwork.price.toLocaleString()}
                    </p>
                    <span className="text-[11px]" style={{ color: 'var(--text-weak)' }}>
                      查看详情
                    </span>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </div>
  )
}
