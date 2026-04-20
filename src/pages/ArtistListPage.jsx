import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { artists, artworks } from '../data'
import { getArtistCoverArtwork } from '../artistMedia'

function ArtistWorksStrip({ artistId, navigate }) {
  const artistWorks = artworks.filter(art => art.aid === artistId)
  const previewWorks = artistWorks.slice(0, artistWorks.length > 3 ? 3 : 4)
  const showMore = artistWorks.length > 3

  if (artistWorks.length === 0) {
    return null
  }

  return (
    <div className="flex gap-3 mt-4 overflow-x-auto">
      {previewWorks.map(work => (
        <button
          key={work.id}
          onClick={(event) => {
            event.stopPropagation()
            navigate(`/detail/${work.id}`)
          }}
          className="w-[92px] h-[118px] overflow-hidden flex-shrink-0"
          style={{ background: 'var(--surface-2)' }}
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
          className="w-[92px] h-[118px] flex-shrink-0 flex items-center justify-center text-sm font-medium"
          style={{ background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)' }}
        >
          更多作品 &gt;
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
    <div className="pb-20 fade-in min-h-screen" style={{ background: '#F3F1ED' }}>
      <div
        className="sticky top-0 z-30 px-4 pt-3 pb-3"
        style={{ background: 'rgba(243,241,237,0.96)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(232,225,216,0.8)' }}
      >
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center text-xl"
            style={{ color: 'var(--text)', background: 'var(--surface)' }}
          >
            ←
          </button>

          <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>
            艺术家
          </h1>

          <div className="flex items-center gap-2">
            <button
              className="w-10 h-10 flex items-center justify-center text-lg"
              style={{ color: 'var(--text)', background: 'var(--surface)' }}
            >
              •••
            </button>
            <button
              className="w-10 h-10 flex items-center justify-center text-lg"
              style={{ color: 'var(--text)', background: 'var(--surface)' }}
            >
              ◎
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div
            className="flex-1 flex items-center gap-2 px-4 h-12"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            <span className="text-xl leading-none" style={{ color: 'var(--text-weak)' }}>
              ⌕
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="请输入搜索内容"
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ color: 'var(--text)' }}
            />
          </div>

          <button
            className="px-4 h-12 text-sm font-medium"
            style={{ background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)' }}
          >
            搜索
          </button>

          <button
            className="w-12 h-12 flex items-center justify-center text-lg"
            style={{ background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)' }}
          >
            ⌯
          </button>
        </div>
      </div>

      <div className="px-4 pt-4">
        {filteredArtists.map(artist => {
          const coverArt = getArtistCoverArtwork(artist.id)
          const isFollowed = followedIds.includes(artist.id)

          return (
            <div
              key={artist.id}
              onClick={() => navigate(`/artist/${artist.id}`)}
              className="p-4 mb-4 cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.92)', border: '1px solid rgba(232,225,216,0.9)' }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-14 h-14 overflow-hidden flex-shrink-0"
                  style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
                >
                  {coverArt ? (
                    <img src={coverArt.img} alt={`${artist.name}代表作品`} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full" />
                  )}
                </div>

                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[15px] font-semibold truncate" style={{ color: 'var(--text)' }}>
                        {artist.name}
                      </p>
                      <p className="text-[11px] mt-1 line-clamp-2" style={{ color: 'var(--text-muted)' }}>
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
                      className="px-4 h-10 text-sm font-medium flex-shrink-0"
                      style={{
                        background: isFollowed ? 'var(--text)' : 'white',
                        color: isFollowed ? 'white' : 'var(--text)',
                        border: '1px solid var(--text)',
                      }}
                    >
                      {isFollowed ? '已关注' : '关注'}
                    </button>
                  </div>

                  <p className="text-[10px] mt-2" style={{ color: 'var(--text-weak)' }}>
                    {artist.location} · {artist.works} 件作品 · {artist.followers.toLocaleString()} 关注
                  </p>
                </div>
              </div>

              <ArtistWorksStrip artistId={artist.id} navigate={navigate} />
            </div>
          )
        })}

        {filteredArtists.length === 0 && (
          <div
            className="px-6 py-12 text-center"
            style={{ background: 'rgba(255,255,255,0.92)', border: '1px solid rgba(232,225,216,0.9)' }}
          >
            <p className="text-base font-semibold mb-2" style={{ color: 'var(--text)' }}>
              没有找到相关艺术家
            </p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              试试搜索姓名、地区或作品标题
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
