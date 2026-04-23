import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../App'
import { getPublicArtworks } from '../services/contentApi'

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[14px] h-[14px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
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

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

export default function DiscoverPage() {
  const [searchQ, setSearchQ] = useState('')
  const [artworks, setArtworks] = useState([])
  const navigate = useNavigate()
  const { favs, toggleFav, addToCart, showToast } = useApp()

  useEffect(() => {
    let isActive = true

    async function loadArtworks() {
      const nextArtworks = await getPublicArtworks()
      if (isActive) {
        setArtworks(nextArtworks)
      }
    }

    loadArtworks()

    return () => {
      isActive = false
    }
  }, [])

  const filtered = artworks.filter(art => {
    if (searchQ && !art.title.includes(searchQ) && !art.artist.includes(searchQ)) return false
    return true
  })

  return (
    <div className="pb-20 fade-in min-h-screen">
      {/* 搜索栏 */}
      <div className="sticky top-0 z-30 px-4 pt-5 pb-4"
        style={{ background: 'rgba(250, 250, 250, 0.85)', backdropFilter: 'blur(16px) saturate(180%)' }}
      >
        <div className="flex items-center gap-3 px-4 py-3 rounded-full transition-shadow duration-300 focus-within:shadow-md"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <span style={{ color: 'var(--text-weak)' }}>
            <SearchIcon />
          </span>
          <input
            type="text"
            placeholder="搜索藏品、作者..."
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
            className="flex-1 border-none outline-none bg-transparent text-[14px] font-medium"
            style={{ color: 'var(--text)' }}
          />
        </div>
      </div>

      <div className="px-4 pb-6 pt-1">
        <div className="flex items-center justify-between mb-5">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase" style={{ color: 'var(--text-weak)' }}>
            COLLECTION
          </p>
          <p className="text-[12px] font-medium" style={{ color: 'var(--text-muted)' }}>共 {filtered.length} 件作品</p>
        </div>

        <div className="flex gap-4 items-start">
          <div className="flex flex-col gap-4 flex-1">
            {filtered.filter((_, i) => i % 2 === 0).map(art => {
              const isFav = favs.includes(art.id)
              return (
                <div 
                  key={art.id}
                  className="art-card cursor-pointer group"
                  onClick={() => navigate(`/detail/${art.id}`)}
                >
                  <div className="img-wrapper relative flex items-center justify-center p-3.5" style={{ background: 'var(--surface-2)' }}>
                    <img src={art.img} alt={art.title} className="w-full h-auto drop-shadow-md transition-transform duration-700 group-hover:scale-105" />
                    {art.orig && (
                      <span className="absolute top-2.5 left-2.5 tag-accent" style={{ background: 'rgba(255,255,255,0.85)', color: 'var(--accent)' }}>限时</span>
                    )}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFav(art.id)
                      }}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-transform active:scale-90 shadow-sm"
                      style={{ 
                        background: isFav ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.6)', 
                        backdropFilter: 'blur(8px)',
                        color: isFav ? 'var(--danger)' : 'var(--text-muted)'
                      }}
                      aria-label={isFav ? "取消收藏" : "加入收藏"}
                    >
                      <HeartIcon filled={isFav} />
                    </button>
                  </div>
                  <div className="px-3.5 py-3">
                    <p className="text-[10px] font-bold tracking-wider uppercase mb-1" style={{ color: 'var(--text-weak)' }}>{art.artist}</p>
                    <p className="text-[14px] font-bold truncate mb-2.5" style={{ color: 'var(--text)' }}>{art.title}</p>
                    
                    <div className="flex justify-between items-end gap-2">
                      <div className="flex flex-col gap-1 min-w-0">
                        {art.charityPct && (
                          <span className="tag-sage self-start" style={{ fontSize: '9px', padding: '2px 6px' }}>{art.charityPct}%公益</span>
                        )}
                        <p className="text-[14px] font-bold truncate" style={{ color: 'var(--accent)' }}>¥{art.price.toLocaleString()}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          addToCart(art)
                        }}
                        className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shrink-0"
                        style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}
                        aria-label="加入购物车"
                      >
                        <CartIcon />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex flex-col gap-4 flex-1">
            {filtered.filter((_, i) => i % 2 === 1).map(art => {
              const isFav = favs.includes(art.id)
              return (
                <div 
                  key={art.id}
                  className="art-card cursor-pointer group"
                  onClick={() => navigate(`/detail/${art.id}`)}
                >
                  <div className="img-wrapper relative flex items-center justify-center p-3.5" style={{ background: 'var(--surface-2)' }}>
                    <img src={art.img} alt={art.title} className="w-full h-auto drop-shadow-md transition-transform duration-700 group-hover:scale-105" />
                    {art.orig && (
                      <span className="absolute top-2.5 left-2.5 tag-accent" style={{ background: 'rgba(255,255,255,0.85)', color: 'var(--accent)' }}>限时</span>
                    )}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFav(art.id)
                      }}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-transform active:scale-90 shadow-sm"
                      style={{ 
                        background: isFav ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.6)', 
                        backdropFilter: 'blur(8px)',
                        color: isFav ? 'var(--danger)' : 'var(--text-muted)'
                      }}
                      aria-label={isFav ? "取消收藏" : "加入收藏"}
                    >
                      <HeartIcon filled={isFav} />
                    </button>
                  </div>
                  <div className="px-3.5 py-3">
                    <p className="text-[10px] font-bold tracking-wider uppercase mb-1" style={{ color: 'var(--text-weak)' }}>{art.artist}</p>
                    <p className="text-[14px] font-bold truncate mb-2.5" style={{ color: 'var(--text)' }}>{art.title}</p>
                    
                    <div className="flex justify-between items-end gap-2">
                      <div className="flex flex-col gap-1 min-w-0">
                        {art.charityPct && (
                          <span className="tag-sage self-start" style={{ fontSize: '9px', padding: '2px 6px' }}>{art.charityPct}%公益</span>
                        )}
                        <p className="text-[14px] font-bold truncate" style={{ color: 'var(--accent)' }}>¥{art.price.toLocaleString()}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          addToCart(art)
                        }}
                        className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shrink-0"
                        style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}
                        aria-label="加入购物车"
                      >
                        <CartIcon />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        
        {filtered.length === 0 && (
          <div className="text-center py-20 fade-in">
            <div className="mb-4 flex justify-center">
              <SearchIcon className="w-8 h-8" style={{ color: 'var(--text-weak)', opacity: 0.5 }} />
            </div>
            <p className="text-[16px] font-bold mb-2 tracking-wide" style={{ color: 'var(--text)' }}>未找到相关藏品</p>
            <p className="text-[13px] font-medium" style={{ color: 'var(--text-muted)' }}>请尝试更换搜索关键词</p>
          </div>
        )}
      </div>
    </div>
  )
}
