import { useNavigate } from 'react-router-dom'
import { artists } from '../data'

export default function ArtistListPage() {
  const navigate = useNavigate()

  return (
    <div className="pb-16 fade-in">
      {/* Header */}
      <div className="bg-primary text-white p-4 pb-5 pt-6">
        <p className="text-[10px] tracking-widest mb-1 opacity-80">ARTISTS</p>
        <h1 className="text-xl font-bold">艺术家</h1>
        <p className="text-xs opacity-80 mt-1">探索名家风采，品味艺术人生</p>
      </div>

      {/* Artist Grid */}
      <div className="px-4 py-4 grid grid-cols-2 gap-3">
        {artists.map(artist => (
          <div
            key={artist.id}
            onClick={() => navigate(`/artist/${artist.id}`)}
            className="bg-white rounded-xl border border-divider overflow-hidden cursor-pointer"
          >
            <div className="aspect-square bg-gradient-to-br from-[#E8DDD0] to-[#D4C5B0] relative flex items-center justify-center">
              <img
                src={artist.avatar}
                alt={artist.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-2 right-2 bg-black/50 text-white text-[9px] px-1.5 py-0.5 rounded-full backdrop-blur-sm">
                {artist.location}
              </span>
            </div>
            <div className="p-3">
              <p className="text-sm font-bold">{artist.name}</p>
              <p className="text-[10px] text-text-light leading-relaxed line-clamp-2 mt-0.5">{artist.bio}</p>
              <div className="flex justify-between items-center mt-2 text-[10px] text-text-light">
                <span>📚 {artist.works} 件作品</span>
                <span>❤️ {artist.followers.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
