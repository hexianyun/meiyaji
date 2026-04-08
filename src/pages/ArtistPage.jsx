import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../App'
import { artists, artworks } from '../data'

export default function ArtistPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { favs, toggleFav } = useApp()
  
  const artist = artists.find(a => a.id === parseInt(id))
  if (!artist) return null
  
  const artistWorks = artworks.filter(a => a.aid === artist.id)

  return (
    <div className="pb-16 fade-in">
      <div className="bg-gradient-to-b from-primary to-background pt-4 pb-6 px-4">
        <div className="flex items-center gap-4 mb-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full bg-black/15 flex items-center justify-center text-white"
          >
            ←
          </button>
          <span className="text-[10px] text-white/80 tracking-wider">ARTIST</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full border-2 border-white overflow-hidden">
            <img 
              src={artist.avatar} 
              alt={artist.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-xl font-bold text-white">{artist.name}</p>
            <p className="text-xs text-white/80 mt-1">{artist.location}</p>
          </div>
        </div>

        <div className="flex gap-0 mt-4 bg-white rounded-xl p-4 border border-divider">
          <div className="flex-1 text-center">
            <p className="text-lg font-bold">{artist.followers.toLocaleString()}</p>
            <p className="text-[10px] text-text-light">粉丝</p>
          </div>
          <div className="flex-1 text-center">
            <p className="text-lg font-bold">{artist.works}</p>
            <p className="text-[10px] text-text-light">作品</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <p className="text-xs text-text-light mb-2">艺术家简介</p>
        <div className="bg-white rounded-xl border border-divider p-4 text-sm leading-relaxed">
          {artist.bio}
        </div>
      </div>

      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <span className="font-bold text-base">他的作品</span>
        </div>
        <div className="grid grid-cols-2 gap-3 pb-20">
          {artistWorks.map(art => {
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
                  <p className="text-sm font-bold text-primary">¥{art.price.toLocaleString()}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
