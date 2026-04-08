import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../App'
import { artworks, categories } from '../data'

export default function DiscoverPage() {
  const [searchQ, setSearchQ] = useState('')
  const [searchCat, setSearchCat] = useState(0)
  const navigate = useNavigate()
  const { favs, toggleFav } = useApp()

  const filtered = artworks.filter(art => {
    if (searchCat > 0 && art.cat !== categories[searchCat]) return false
    if (searchQ && !art.title.includes(searchQ) && !art.artist.includes(searchQ)) return false
    return true
  })

  return (
    <div className="pb-16 fade-in">
      <div className="bg-background p-4 border-b border-divider sticky top-0 z-30">
        <div className="bg-white border border-divider rounded-xl px-4 py-3 flex items-center gap-2">
          <span>🔍</span>
          <input
            type="text"
            placeholder="搜索作品、艺术家..."
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
            className="flex-1 border-none outline-none bg-none text-sm"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto py-2 whitespace-nowrap">
          {categories.map((cat, i) => (
            <button
              key={cat}
              onClick={() => setSearchCat(i)}
              className={`px-3 py-1 rounded-full text-xs transition-colors ${
                searchCat === i 
                  ? 'bg-primary text-white' 
                  : 'bg-white border border-divider text-text-light'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 pb-20">
        <p className="text-[11px] text-text-light mb-3">共 {filtered.length} 件作品</p>
        <div className="grid grid-cols-2 gap-3">
          {filtered.map(art => {
            const isFav = favs.includes(art.id)
            return (
              <div 
                key={art.id}
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
                  <p className="text-[10px] text-text-light mb-1.5">{art.artist}</p>
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
          })}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <div className="text-5xl mb-3">🔍</div>
            <p className="font-semibold mb-2">没有找到相关作品</p>
            <p className="text-sm text-text-light">试试其他关键词或分类</p>
          </div>
        )}
      </div>
    </div>
  )
}
