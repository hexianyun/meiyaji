import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../App'
import { artworks, artists } from '../data'

export default function DetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { favs, toggleFav, addToCart } = useApp()
  
  const art = artworks.find(a => a.id === parseInt(id))
  if (!art) return null
  
  const artist = artists.find(a => a.id === art.aid)
  const isFav = favs.includes(art.id)

  return (
    <div className="pb-20 fade-in">
      <div className="aspect-[4/3] relative bg-gradient-to-br from-divider to-[#D4C5B0]">
        <img 
          src={art.img} 
          alt={art.title}
          className="w-full h-full object-cover"
        />
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-3 left-3 w-9 h-9 bg-black/35 rounded-full flex items-center justify-center text-white text-base backdrop-blur-sm"
        >
          ←
        </button>
        <div className="absolute top-3 right-3 flex gap-2">
          <button 
            onClick={() => toggleFav(art.id)}
            className="w-9 h-9 bg-black/35 rounded-full flex items-center justify-center text-white text-sm backdrop-blur-sm"
          >
            {isFav ? '❤️' : '🤍'}
          </button>
          <button 
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: art.title, text: art.artist })
              }
            }}
            className="w-9 h-9 bg-black/35 rounded-full flex items-center justify-center text-white text-sm backdrop-blur-sm"
          >
            ↗
          </button>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-divider p-3 flex gap-2 z-40">
        <button
          onClick={() => navigate('/cart')}
          className="w-12 h-12 bg-white border border-divider rounded-xl flex items-center justify-center text-xl"
        >
          🛒
        </button>
        <button
          onClick={() => addToCart(art)}
          className="flex-1 bg-primary text-white py-3 rounded-xl font-semibold text-sm"
        >
          加入购物车
        </button>
        <button
          onClick={() => {
            addToCart(art)
            navigate('/cart')
          }}
          className="flex-1 bg-text text-white py-3 rounded-xl font-semibold text-sm"
        >
          立即购买
        </button>
      </div>

      <div className="p-4 pb-24">
        <p className="text-3xl font-bold text-primary mb-1">
          ¥{art.price.toLocaleString()}
          {art.orig && (
            <span className="text-sm text-text-light line-through font-normal ml-2">
              ¥{art.orig.toLocaleString()}
            </span>
          )}
        </p>
        <p className="text-lg font-bold mb-1">{art.title}</p>
        <p className="text-[11px] text-text-light flex gap-2 flex-wrap">
          {art.year} · {art.size} · {art.mat}
        </p>

        <div className="flex border-t border-b border-divider py-3 my-3">
          <div className="flex-1 text-center">
            <p className="font-bold text-sm">{art.views.toLocaleString()}</p>
            <p className="text-[10px] text-text-light">浏览</p>
          </div>
          <div className="flex-1 text-center">
            <p className="font-bold text-sm">{art.sold}</p>
            <p className="text-[10px] text-text-light">已售</p>
          </div>
          <div className="flex-1 text-center">
            <p className="font-bold text-sm">{art.stock}</p>
            <p className="text-[10px] text-text-light">库存</p>
          </div>
        </div>

        {artist && (
          <div 
            onClick={() => navigate(`/artist/${artist.id}`)}
            className="flex items-center gap-3 py-3 border-b border-divider cursor-pointer"
          >
            <div className="w-11 h-11 rounded-full border-2 border-divider overflow-hidden">
              <img 
                src={artist.avatar} 
                alt={artist.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">{artist.name}</p>
              <p className="text-[11px] text-text-light">{artist.location} · {artist.works}件作品</p>
            </div>
            <span className="text-primary text-xs">主页 →</span>
          </div>
        )}

        <p className="text-xs text-text-light py-3">作品描述</p>
        <p className="text-sm leading-relaxed text-text border-b border-divider pb-3">
          {art.desc}
        </p>

        <div className="py-3">
          <p className="text-xs text-text-light pb-2">详细信息</p>
          {[
            ['类别', art.cat],
            ['风格', art.style],
            ['年份', art.year],
            ['材质', art.mat],
            ['尺寸', art.size]
          ].map(([key, val]) => (
            <div key={key} className="flex py-2 border-b border-divider">
              <span className="w-16 text-xs text-text-light flex-shrink-0">{key}</span>
              <span className="text-xs">{val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
