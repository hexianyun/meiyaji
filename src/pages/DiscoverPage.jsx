import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../App'
import { artworks } from '../data'

export default function DiscoverPage() {
  const [searchQ, setSearchQ] = useState('')
  const navigate = useNavigate()
  const { favs, toggleFav, addToCart, showToast } = useApp()

  const filtered = artworks.filter(art => {
    if (searchQ && !art.title.includes(searchQ) && !art.artist.includes(searchQ)) return false
    return true
  })

  return (
    <div className="pb-20 fade-in">
      {/* 搜索栏 */}
      <div className="sticky top-0 z-30 px-4 pt-4 pb-3"
        style={{ background: 'rgba(246, 241, 234, 0.92)', backdropFilter: 'blur(12px)' }}
      >
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <span style={{ color: 'var(--text-weak)', fontSize: '15px' }}>◇</span>
          <input
            type="text"
            placeholder="搜索作品、艺术家..."
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
            className="flex-1 border-none outline-none bg-none text-sm"
            style={{ color: 'var(--text)', background: 'transparent' }}
          />
        </div>
      </div>

      <div className="px-4 pb-6 pt-2">
        <p className="text-[11px] mb-4" style={{ color: 'var(--text-weak)' }}>共 {filtered.length} 件作品</p>
        <div className="grid grid-cols-2 gap-3">
          {filtered.map(art => {
            const isFav = favs.includes(art.id)
            return (
              <div 
                key={art.id}
                className="art-card cursor-pointer"
                onClick={() => navigate(`/detail/${art.id}`)}
              >
                <div className="aspect-[4/3] relative" style={{ background: 'var(--surface-2)' }}>
                  <img src={art.img} alt={art.title} className="w-full h-full object-cover" />
                  {art.orig && (
                    <span className="absolute top-2.5 left-2.5 tag-accent">限时</span>
                  )}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFav(art.id)
                    }}
                    className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ background: isFav ? 'rgba(199,164,154,0.25)' : 'rgba(255,255,255,0.75)', backdropFilter: 'blur(6px)' }}
                  >
                    <span style={{ fontSize: '13px', color: isFav ? '#C98F86' : '#A59B92' }}>{isFav ? '♥' : '♡'}</span>
                  </button>
                </div>
                <div className="px-3.5 pt-3 pb-3.5">
                  <p className="text-xs font-semibold truncate mb-0.5" style={{ color: 'var(--text)' }}>{art.title}</p>
                  <p className="text-[10px] mb-2" style={{ color: 'var(--text-muted)' }}>{art.artist}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-baseline gap-1.5">
                      <p className="text-sm font-bold" style={{ color: 'var(--primary)' }}>¥{art.price.toLocaleString()}</p>
                      {art.charityPct && (
                        <span className="tag-sage" style={{ fontSize: '9px', padding: '2px 7px' }}>{art.charityPct}%公益</span>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        addToCart(art)
                        showToast('已加入购物车')
                      }}
                      className="w-7 h-7 rounded-xl flex items-center justify-center"
                      style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
                    >
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>+</span>
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-3" style={{ color: 'var(--text-weak)' }}>◇</div>
            <p className="font-semibold mb-1.5" style={{ color: 'var(--text)' }}>没有找到相关作品</p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>试试其他关键词</p>
          </div>
        )}
      </div>
    </div>
  )
}
