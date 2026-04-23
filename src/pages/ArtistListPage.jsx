import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { artists, artworks } from '../data'
import { getArtistCoverArtwork } from '../artistMedia'

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function ArtistWorksStrip({ artistId, navigate }) {
  const artistWorks = artworks.filter(art => art.aid === artistId)
  const previewWorks = artistWorks.slice(0, artistWorks.length > 4 ? 4 : 5)
  const showMore = artistWorks.length > 4

  if (artistWorks.length === 0) {
    return null
  }

  return (
    <div className="flex gap-2 mt-4 overflow-x-auto hide-scrollbar pb-1">
      {previewWorks.map(work => (
        <button
          key={work.id}
          onClick={(event) => {
            event.stopPropagation()
            navigate(`/detail/${work.id}`)
          }}
          className="w-[56px] h-[56px] overflow-hidden flex-shrink-0 rounded-md transition-transform duration-300 hover:scale-105"
          style={{ background: 'var(--surface-2)', border: '1px solid rgba(0,0,0,0.03)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
        >
          <img src={work.img} alt={work.title} className="w-full h-full object-cover" />
        </button>
      ))}

      {showMore && (
        <button
          onClick={(event) => {
            event.stopPropagation()
            navigate(`/artist/${artistId}`)
          }}
          className="w-[56px] h-[56px] flex-shrink-0 flex flex-col items-center justify-center rounded-md transition-colors hover:bg-gray-50"
          style={{ background: 'var(--surface-2)', color: 'var(--text-weak)' }}
        >
          <span className="text-[16px] font-bold leading-none mb-0.5">+</span>
          <span className="text-[9px] font-medium tracking-wider">更多</span>
        </button>
      )}
    </div>
  )
}

export default function ArtistListPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [followedIds, setFollowedIds] = useState([])

  const normalizedQuery = searchQuery.trim()
  const filteredArtists = artists.filter(artist => {
    if (!normalizedQuery) return true

    const artistWorks = artworks.filter(art => art.aid === artist.id)
    const haystacks = [
      artist.name,
      artist.bio,
      artist.location,
      ...artistWorks.map(art => art.title),
    ]

    return haystacks.some(text => text?.includes(normalizedQuery))
  })

  return (
    <div className="pb-20 fade-in min-h-screen">
      <div
        className="sticky top-0 z-30 px-4 pt-5 pb-4"
        style={{ background: 'rgba(250, 250, 250, 0.85)', backdropFilter: 'blur(16px) saturate(180%)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-8 h-8 flex items-center justify-center rounded-full transition-colors active:bg-gray-100"
              style={{ color: 'var(--text)' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>
            <div>
              <h1 className="text-[18px] font-bold tracking-wide" style={{ color: 'var(--text)' }}>
                合作艺术家
              </h1>
              <p className="text-[10px] font-bold tracking-[0.25em] uppercase mt-0.5" style={{ color: 'var(--text-weak)' }}>
                ARTISTS
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 px-4 py-3 rounded-full transition-shadow duration-300 focus-within:shadow-md"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <span style={{ color: 'var(--text-weak)' }}>
            <SearchIcon />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="搜索艺术家、地区..."
            className="flex-1 border-none outline-none bg-transparent text-[14px] font-medium"
            style={{ color: 'var(--text)' }}
          />
        </div>
      </div>

      <div className="px-4 pt-2">
        <p className="text-[12px] font-medium mb-4" style={{ color: 'var(--text-muted)' }}>共 {filteredArtists.length} 位艺术家</p>
        
        <div className="space-y-4">
          {filteredArtists.map(artist => {
            const coverArt = getArtistCoverArtwork(artist.id)
            const isFollowed = followedIds.includes(artist.id)

            return (
              <div
                key={artist.id}
                onClick={() => navigate(`/artist/${artist.id}`)}
                className="p-5 cursor-pointer group transition-transform duration-300 hover:-translate-y-1"
                style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-14 h-14 overflow-hidden flex-shrink-0 rounded-full shadow-sm"
                    style={{ background: 'var(--surface-2)', border: '2px solid white' }}
                  >
                    {coverArt ? (
                      <img src={coverArt.img} alt={`${artist.name}代表作品`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[17px] font-bold truncate tracking-tight mb-1" style={{ color: 'var(--text)' }}>
                          {artist.name}
                        </p>
                        <p className="text-[13px] leading-relaxed line-clamp-2" style={{ color: 'var(--text-muted)' }}>
                          {artist.bio}
                        </p>
                      </div>

                      <button
                        onClick={(event) => {
                          event.stopPropagation()
                          setFollowedIds(prev =>
                            prev.includes(artist.id)
                              ? prev.filter(id => id !== artist.id)
                              : [...prev, artist.id]
                          )
                        }}
                        className={`px-3.5 py-1.5 rounded-full text-[12px] font-bold flex-shrink-0 transition-all active:scale-95 ${isFollowed ? '' : 'shadow-sm'}`}
                        style={{
                          background: isFollowed ? 'var(--surface-2)' : 'var(--text)',
                          color: isFollowed ? 'var(--text-muted)' : 'white',
                          border: isFollowed ? '1px solid transparent' : '1px solid var(--text)',
                        }}
                      >
                        {isFollowed ? '已关注' : '+ 关注'}
                      </button>
                    </div>
                  </div>
                </div>

                <ArtistWorksStrip artistId={artist.id} navigate={navigate} />
              </div>
            )
          })}

          {filteredArtists.length === 0 && (
            <div className="text-center py-20 fade-in">
              <div className="mb-4 flex justify-center">
                <SearchIcon className="w-8 h-8" style={{ color: 'var(--text-weak)', opacity: 0.5 }} />
              </div>
              <p className="text-[16px] font-bold mb-2 tracking-wide" style={{ color: 'var(--text)' }}>未找到相关艺术家</p>
              <p className="text-[13px] font-medium" style={{ color: 'var(--text-muted)' }}>请尝试更换搜索关键词</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
