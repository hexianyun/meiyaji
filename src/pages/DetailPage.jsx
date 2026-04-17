import { useParams, useNavigate, useState } from 'react-router-dom'
import { useApp } from '../App'
import { artworks, artists } from '../data'

export default function DetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { favs, toggleFav, addToCart } = useApp()
  const [showZoom, setShowZoom] = useState(false)

  const art = artworks.find(a => a.id === parseInt(id))
  if (!art) return null

  const artist = artists.find(a => a.id === art.aid)
  const isFav = favs.includes(art.id)

  return (
    <div className="pb-22 fade-in">
      {/* 大图（点击放大） */}
      <div className="aspect-[4/3] relative cursor-pointer" style={{ background: 'var(--surface-2)' }} onClick={() => setShowZoom(true)}>
        <img src={art.img} alt={art.title} className="w-full h-full object-cover" />
        
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-3 left-3 w-9 h-9 rounded-full flex items-center justify-center text-base"
          style={{ background: 'rgba(62,58,55,0.25)', backdropFilter: 'blur(8px)', color: 'white' }}
        >
          ←
        </button>

        <div className="absolute top-3 right-3 flex gap-2">
          <button 
            onClick={() => toggleFav(art.id)}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: isFav ? 'rgba(199,143,134,0.3)' : 'rgba(255,255,255,0.75)', backdropFilter: 'blur(8px)' }}
          >
            <span style={{ fontSize: '14px', color: isFav ? '#C98F86' : 'white' }}>{isFav ? '♥' : '♡'}</span>
          </button>
          <button 
            onClick={() => navigator.share?.({ title: art.title, text: art.artist })}
            className="w-9 h-9 rounded-full flex items-center justify-center text-base"
            style={{ background: 'rgba(62,58,55,0.25)', backdropFilter: 'blur(8px)', color: 'white' }}
          >
            ↗
          </button>
        </div>
      </div>

      {/* 底部操作栏 */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[430px] p-3 flex gap-2.5 z-40"
        style={{ background: 'rgba(251,248,244,0.94)', backdropFilter: 'blur(12px)', borderTop: '1px solid var(--border)' }}
      >
        <button
          onClick={() => navigate('/cart')}
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <span style={{ fontSize: '17px', color: 'var(--text-muted)' }}></span>
        </button>
        <button
          onClick={() => addToCart(art)}
          className="flex-1 btn-primary py-3"
        >
          加入购物车
        </button>
        <button
          onClick={() => { addToCart(art); navigate('/cart') }}
          className="flex-1 py-3 rounded-xl font-medium text-sm"
          style={{ background: 'var(--text)', color: 'white' }}
        >
          立即购买
        </button>
      </div>

      <div className="px-5 pt-5 pb-28">
        {/* 价格与标题 */}
        <div className="mb-5">
          <p className="text-2xl font-bold mb-1.5" style={{ color: 'var(--primary)' }}>
            ¥{art.price.toLocaleString()}
            {art.orig && (
              <span className="text-sm font-normal ml-2" style={{ color: 'var(--text-weak)', textDecoration: 'line-through' }}>
                ¥{art.orig.toLocaleString()}
              </span>
            )}
          </p>
          <p className="text-lg font-semibold mb-1" style={{ color: 'var(--text)' }}>{art.title}</p>
          <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
            {art.year} · {art.size} · {art.mat}
          </p>
        </div>

        {/* 艺术家信息 */}
        {artist && (
          <div 
            onClick={() => navigate(`/artist/${artist.id}`)}
            className="flex items-center gap-3.5 py-3 cursor-pointer active:bg-opacity-60 transition-colors"
            style={{ borderBottom: '1px solid var(--border)' }}
          >
            <div className="w-11 h-11 overflow-hidden" style={{ borderRadius: '50%', border: '1.5px solid var(--border)' }}>
              <img src={artist.avatar} alt={artist.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{artist.name}</p>
              <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{artist.location} · {artist.works}件作品</p>
            </div>
            <span className="text-xs font-medium" style={{ color: 'var(--primary)' }}>主页 →</span>
          </div>
        )}

        {/* 描述 */}
        <div className="mt-4 mb-5">
          <p className="text-[11px] mb-2" style={{ color: 'var(--text-weak)' }}>作品描述</p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>{art.desc}</p>
        </div>

        {/* 详细信息（两列紧凑） */}
        <div>
          <p className="text-[11px] mb-2" style={{ color: 'var(--text-weak)' }}>详细信息</p>
          <div className="grid grid-cols-2 gap-x-4">
            {[
              ['类别', art.cat],
              ['风格', art.style],
              ['年份', art.year],
              ['材质', art.mat],
              ['尺寸', art.size]
            ].map(([key, val]) => (
              <div key={key} className="flex py-2 border-b" style={{ borderColor: 'var(--border)' }}>
                <span className="w-10 text-xs flex-shrink-0" style={{ color: 'var(--text-weak)' }}>{key}</span>
                <span className="text-xs truncate" style={{ color: 'var(--text)' }}>{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 收藏作品 */}
        <button
          onClick={() => toggleFav(art.id)}
          className={`w-full mt-5 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-colors`}
          style={{
            background: isFav ? 'rgba(169,184,168,0.15)' : 'var(--surface)',
            border: `1px solid ${isFav ? 'var(--primary)' : 'var(--border)'}`,
            color: isFav ? 'var(--primary)' : 'var(--text)',
          }}
        >
          <span>{isFav ? '♥' : '♡'}</span>
          {isFav ? '已收藏' : '收藏作品'}
        </button>

      </div>

      {/* 图片放大弹窗 */}
      {showZoom && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setShowZoom(false)}
        >
          <img src={art.img} alt={art.title} className="max-w-full max-h-full object-contain" />
          <button
            onClick={() => setShowZoom(false)}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white text-lg"
            style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}
          >✕</button>
        </div>
      )}
      </div>
    </div>
  )
}
