import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { artworks, artists, charity, charityActivities } from '../data'
import { getArtistCoverArtwork } from '../artistMedia'
import { useApp } from '../App'
import { getPublicArtworks, getPublicContents } from '../services/contentApi'

const HERO_SLIDES = [
  {
    image: '/hero-carousel/1232997301.jpg',
    eyebrow: 'ART & PUBLIC GOOD',
    title: '让收藏成为一场\n持续发生的美育行动',
    description: '以艺术作品为入口，连接艺术家、收藏者与乡村美育计划。',
  },
  {
    image: '/hero-carousel/1710908245.jpg',
    eyebrow: 'CURATED CHARITY',
    title: '把作品带到更远的地方\n也把美带给更多孩子',
    description: '通过线上展陈、公益讲堂与长期项目支持，让艺术的影响真正落地。',
  },
  {
    image: '/hero-carousel/549412817.jpg',
    eyebrow: 'MEIYAJI',
    title: '在图录式浏览中\n理解作品，也理解公益',
    description: '每一次浏览与收藏，都是对乡村美育的一次微小灌溉。',
  },
]

function SectionIntro({ eyebrow, title, description, actionLabel, onAction }) {
  return (
    <div className="flex items-end justify-between gap-4 mb-6">
      <div className="min-w-0">
        <p className="text-[11px] font-bold tracking-[0.25em] uppercase mb-2.5" style={{ color: 'var(--accent)' }}>
          {eyebrow}
        </p>
        <h2 className="text-[26px] leading-[1.25] font-bold whitespace-pre-line tracking-tight" style={{ color: 'var(--text)' }}>
          {title}
        </h2>
        {description && (
          <p className="text-[14px] leading-relaxed mt-3 max-w-[320px]" style={{ color: 'var(--text-muted)' }}>
            {description}
          </p>
        )}
      </div>

      {actionLabel && (
        <button
          onClick={onAction}
          className="text-[13px] font-semibold flex items-center gap-1 pb-1 transition-opacity hover:opacity-70 shrink-0"
          style={{ color: 'var(--text)' }}
        >
          {actionLabel}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      )}
    </div>
  )
}

function formatPrice(value) {
  return `¥${new Intl.NumberFormat('zh-CN').format(Number(value) || 0)}`
}

function isLandscapeArtwork(artwork) {
  const size = artwork?.size || ''
  const match = size.match(/(\d+(?:\.\d+)?)\s*[×x]\s*(\d+(?:\.\d+)?)/)
  if (!match) return false
  return Number(match[1]) > Number(match[2])
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}

function ArtworkTile({ artwork, large = false, onOpen, onAdd }) {
  const landscape = isLandscapeArtwork(artwork)

  return (
    <article className={`art-card ${large ? 'col-span-2' : ''}`}>
      <div
        role="button"
        tabIndex={0}
        onClick={() => onOpen(artwork.id)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            onOpen(artwork.id)
          }
        }}
        className="block text-left cursor-pointer"
      >
        <div className={`img-wrapper flex items-center justify-center ${large ? 'p-6' : 'p-4'}`} style={{ background: 'var(--surface-2)' }}>
          <img
            src={artwork.img}
            alt={artwork.title}
            className="block drop-shadow-md w-full h-auto"
            loading="lazy"
          />
        </div>

        <div className={large ? 'px-4 py-3' : 'px-3.5 py-3'}>
          <p className={`${large ? 'text-[12px]' : 'text-[10px]'} font-bold tracking-wider uppercase mb-1`} style={{ color: 'var(--text-weak)' }}>
            {artwork.artist}
          </p>
          <p
            className={`${large ? 'text-[18px]' : 'text-[14px]'} leading-[1.3] font-bold`}
            style={{
              color: 'var(--text)',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {artwork.title}
          </p>
          <div className="mt-2.5 flex items-center justify-between gap-2">
            <p className={`${large ? 'text-[16px]' : 'text-[14px]'} font-bold`} style={{ color: 'var(--accent)' }}>
              {formatPrice(artwork.price)}
            </p>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                onAdd(artwork)
              }}
              className={`shrink-0 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 ${large ? 'w-10 h-10' : 'w-8 h-8'}`}
              style={{ background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)' }}
              aria-label={`加入购物车：${artwork.title}`}
            >
              <CartIcon />
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

function getArtworkArtistKey(artwork) {
  return String(artwork.artistId ?? artwork.aid ?? artwork.artist ?? 'unknown')
}

function selectTwoWorksPerArtist(artworksData, artistList = []) {
  const groupedWorks = new Map()
  const selectedWorks = []

  artworksData.forEach(artwork => {
    if (!artwork?.img || artwork.inventoryStatus === 'archived') return

    const artistKey = getArtworkArtistKey(artwork)

    if (!groupedWorks.has(artistKey)) {
      groupedWorks.set(artistKey, [])
    }

    groupedWorks.get(artistKey).push(artwork)
  })

  const orderedArtistKeys = [
    ...artistList.map(artist => String(artist.id)),
    ...Array.from(groupedWorks.keys()).filter(key => !artistList.some(artist => String(artist.id) === key)),
  ]

  orderedArtistKeys.forEach(artistKey => {
    const works = groupedWorks.get(artistKey) || []
    selectedWorks.push(...works.slice(0, 2))
  })

  return selectedWorks
}

function HeroShowcase() {
  const navigate = useNavigate()
  const [current, setCurrent] = useState(0)
  const total = HERO_SLIDES.length

  const goNext = useCallback(() => {
    setCurrent(prev => (prev + 1) % total)
  }, [total])

  useEffect(() => {
    if (total <= 1) return
    const timer = setInterval(goNext, 5000)
    return () => clearInterval(timer)
  }, [goNext, total])

  const slide = HERO_SLIDES[current]

  return (
    <section className="px-4 pt-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-[20px] leading-[1.2] font-bold tracking-wide" style={{ color: 'var(--text)' }}>
            美芽集
          </h1>
          <p className="text-[10px] font-bold tracking-[0.3em] uppercase mt-1" style={{ color: 'var(--text-weak)' }}>
            MEIYAJI
          </p>
        </div>
      </div>

      <div
        className="relative overflow-hidden cursor-pointer"
        style={{ borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', background: 'var(--surface-2)' }}
        onClick={() => navigate('/charity')}
      >
        <div className="aspect-[4/5] relative">
          <img src={slide.image} alt="" className="w-full h-full object-cover transition-transform duration-1000 ease-out" style={{ transform: 'scale(1.03)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%)' }} />

          <div className="absolute inset-x-0 top-0 px-6 pt-6 flex items-start justify-between">
            <p className="text-[11px] font-bold tracking-[0.25em] uppercase" style={{ color: 'rgba(255,255,255,0.9)' }}>
              {slide.eyebrow}
            </p>
            <div className="text-[12px] font-medium tracking-widest" style={{ color: 'rgba(255,255,255,0.8)' }}>
              {String(current + 1).padStart(2, '0')} <span className="opacity-50">/</span> {String(total).padStart(2, '0')}
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 px-6 pb-6">
            <h2 className="text-[32px] leading-[1.15] font-bold whitespace-pre-line mb-3 blur-reveal" key={current} style={{ color: 'white', textShadow: '0 2px 12px rgba(0,0,0,0.2)' }}>
              {slide.title}
            </h2>
            <p className="text-[14px] leading-relaxed max-w-[290px] mb-6 blur-reveal" key={`desc-${current}`} style={{ color: 'rgba(255,255,255,0.85)', animationDelay: '0.1s' }}>
              {slide.description}
            </p>

            <div className="flex gap-3">
              <button
                onClick={(event) => {
                  event.stopPropagation()
                  navigate('/discover')
                }}
                className="btn-primary"
              >
                浏览藏品
              </button>
              <button
                onClick={(event) => {
                  event.stopPropagation()
                  navigate('/charity')
                }}
                className="btn-outline"
              >
                公益计划
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-6">
        {HERO_SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className="h-[3px] rounded-full transition-all duration-500"
            style={{
              width: index === current ? '32px' : '8px',
              background: index === current ? 'var(--text)' : 'var(--secondary)',
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

function MissionBlock() {
  const navigate = useNavigate()
  const totalProjects = charity.length + charityActivities.length
  const stats = [
    { value: totalProjects, label: '公益项目与实践' },
    { value: artworks.length, label: '参与作品' },
    { value: artists.length, label: '合作艺术家' },
  ]

  const leadProject = charity[0]

  return (
    <section className="px-4 mt-16">
      <SectionIntro
        eyebrow="PUBLIC GOOD"
        title={'把公益做成长期项目\n而不是一次性活动'}
        description="我们希望让艺术的流动真正进入乡村教育现场，让作品、课堂、艺术家与受益者形成可持续连接。"
      />

      <div className="p-6 relative overflow-hidden" style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}>
        {/* Decorative element */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none" style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }}></div>

        <p className="text-[11px] font-bold tracking-[0.2em] uppercase mb-5" style={{ color: 'var(--text-weak)' }}>
          Current Initiative
        </p>
        <div className="grid grid-cols-3 gap-4 mb-8">
          {stats.map(stat => (
            <div key={stat.label}>
              <p className="text-[36px] leading-none font-bold mb-2 tracking-tight" style={{ color: 'var(--text)' }}>
                {stat.value}
              </p>
              <p className="text-[12px] font-medium" style={{ color: 'var(--text-muted)' }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {leadProject && (
          <div className="pt-5 border-t" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-start justify-between gap-4 mb-3">
              <h3 className="text-[20px] font-bold leading-[1.3]" style={{ color: 'var(--text)' }}>
                {leadProject.title}
              </h3>
              <span className="tag-sage shrink-0">
                {leadProject.tag}
              </span>
            </div>
            <p className="text-[14px] leading-relaxed mb-5" style={{ color: 'var(--text-muted)' }}>
              {leadProject.desc}
            </p>
            <button
              onClick={() => navigate(`/charity/project/${leadProject.id}`)}
              className="text-[13px] font-semibold flex items-center gap-1 transition-opacity hover:opacity-70"
              style={{ color: 'var(--accent)' }}
            >
              查看项目详情
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

function FeaturedWorksSection({ artworksData }) {
  const navigate = useNavigate()
  const { addToCart } = useApp()
  const curatedWorks = selectTwoWorksPerArtist(artworksData, artists)

  if (!curatedWorks.length) return null

  const col1 = curatedWorks.filter((_, i) => i % 2 === 0)
  const col2 = curatedWorks.filter((_, i) => i % 2 === 1)

  return (
    <section className="px-4 mt-16">
      <SectionIntro
        eyebrow="CURATED WORKS"
        title={'以作品为入口\n让艺术与公益被看见'}
        description="每一件作品都像一段被轻轻展开的艺术叙事，值得你慢慢停下来观看。"
        actionLabel="全部作品"
        onAction={() => navigate('/discover')}
      />

      <div className="flex gap-4 items-start">
        <div className="flex flex-col gap-4 flex-1">
          {col1.map(work => (
            <ArtworkTile
              key={work.id}
              artwork={work}
              onOpen={(id) => navigate(`/detail/${id}`)}
              onAdd={addToCart}
            />
          ))}
        </div>
        <div className="flex flex-col gap-4 flex-1">
          {col2.map(work => (
            <ArtworkTile
              key={work.id}
              artwork={work}
              onOpen={(id) => navigate(`/detail/${id}`)}
              onAdd={addToCart}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function ArtistsSection() {
  const navigate = useNavigate()
  const featuredArtists = artists.slice(0, 10)

  return (
    <section className="mt-16 overflow-hidden">
      <div className="px-4">
        <SectionIntro
          eyebrow="ARTISTS"
          title={'与艺术家并肩\n让作品进入更广阔的现场'}
          description="每一位合作艺术家都以自己的作品参与这场长期的美育支持计划。"
          actionLabel="艺术家名录"
          onAction={() => navigate('/artists')}
        />
      </div>

      {/* Grid Layout: 2 Rows, 5 Columns */}
      <div className="grid grid-cols-5 gap-y-5 gap-x-2 px-4 pb-6">
        {featuredArtists.map(artist => {
          const coverArt = getArtistCoverArtwork(artist.id)

          return (
            <button
              key={artist.id}
              onClick={() => navigate(`/artist/${artist.id}`)}
              className="flex flex-col items-center group w-full"
            >
              <div 
                className="w-[56px] h-[56px] rounded-full overflow-hidden mb-1.5 transition-transform duration-300 group-hover:scale-105 shadow-sm"
                style={{ border: '2px solid white', background: 'var(--surface-2)', outline: '1px solid var(--border)' }}
              >
                {coverArt ? (
                  <img src={coverArt.img} alt={`${artist.name}代表作品`} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full" />
                )}
              </div>
              <p className="text-[11px] font-bold text-center w-full truncate px-0.5" style={{ color: 'var(--text)' }}>
                {artist.name}
              </p>
            </button>
          )
        })}
      </div>
    </section>
  )
}

function StoriesSection({ activities }) {
  const navigate = useNavigate()
  const latestActivities = [...activities].sort((a, b) => String(b.date).localeCompare(String(a.date)))
  const leadStory = latestActivities[0]
  const sideStories = latestActivities.slice(1, 3)

  if (!leadStory) return null

  return (
    <section className="px-4 mt-10">
      <SectionIntro
        eyebrow="FIELD NOTES"
        title={'让公益被看见\n也让它被认真记录'}
        description="公益故事是一本持续更新的现场札记，既有温度，也有真实的脉络。"
        actionLabel="全部公益"
        onAction={() => navigate('/charity')}
      />

      <div className="mb-4 group cursor-pointer" onClick={() => navigate(`/charity/article/${leadStory.id}`)} style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}>
        <div className="aspect-[16/10] overflow-hidden">
          <img src={leadStory.cover} alt={leadStory.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        </div>
        <div className="p-5">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase mb-2" style={{ color: 'var(--text-weak)' }}>
            {leadStory.tag}
          </p>
          <h3 className="text-[22px] leading-[1.3] font-bold mb-2" style={{ color: 'var(--text)' }}>
            {leadStory.title}
          </h3>
          <p className="text-[14px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            {leadStory.desc || leadStory.summary}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {sideStories.map(story => (
          <button
            key={story.id}
            onClick={() => navigate(`/charity/article/${story.id}`)}
            className="text-left group"
            style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img src={story.cover} alt={story.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="p-4">
              <p className="text-[10px] font-bold tracking-[0.15em] uppercase mb-2" style={{ color: 'var(--text-weak)' }}>
                {story.tag}
              </p>
              <p className="text-[15px] leading-[1.4] font-bold mb-2 line-clamp-2" style={{ color: 'var(--text)' }}>
                {story.title}
              </p>
              <p className="text-[12px] font-medium" style={{ color: 'var(--text-muted)' }}>
                {story.location} · {story.date}
              </p>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}

function FooterSection() {
  const navigate = useNavigate()

  return (
    <footer className="px-4 mt-20 pb-32">
      <div className="p-8 text-center" style={{ background: 'linear-gradient(180deg, var(--surface) 0%, var(--surface-2) 100%)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)' }}>
        <p className="text-[11px] font-bold tracking-[0.25em] uppercase mb-4" style={{ color: 'var(--text-weak)' }}>
          MEIYAJI FOUNDATION
        </p>
        <h3 className="text-[24px] leading-[1.3] font-bold mb-4" style={{ color: 'var(--text)' }}>
          让线上展陈成为<br/>公益支持的开始
        </h3>
        <p className="text-[14px] leading-relaxed mb-8 mx-auto max-w-[280px]" style={{ color: 'var(--text-muted)' }}>
          艺术不仅值得被收藏，也值得被分享给更多孩子。
        </p>

        <div className="flex flex-col gap-3 max-w-[200px] mx-auto mb-8">
          <button
            onClick={() => navigate('/charity')}
            className="btn-primary w-full"
          >
            查看公益计划
          </button>
          <button
            onClick={() => navigate('/discover')}
            className="btn-outline w-full"
            style={{ background: 'transparent' }}
          >
            浏览全部作品
          </button>
        </div>

        <div className="pt-6 border-t flex flex-col items-center gap-2" style={{ borderColor: 'var(--border)', color: 'var(--text-weak)' }}>
          <span className="text-[12px] font-bold">美芽集 · 艺术公益</span>
          <span className="text-[10px] tracking-wider uppercase">Art for Rural Aesthetic Education</span>
        </div>
      </div>
    </footer>
  )
}

export default function HomePage() {
  const [publicArtworks, setPublicArtworks] = useState(artworks)
  const [publicActivities, setPublicActivities] = useState(charityActivities)

  useEffect(() => {
    let isActive = true

    async function loadPublicData() {
      const [nextArtworks, nextActivities] = await Promise.all([
        getPublicArtworks(),
        getPublicContents('activity'),
      ])

      if (!isActive) return

      setPublicArtworks(nextArtworks)
      setPublicActivities(nextActivities)
    }

    loadPublicData()

    return () => {
      isActive = false
    }
  }, [])

  return (
    <div className="min-h-screen fade-in">
      <HeroShowcase />
      <MissionBlock />
      <FeaturedWorksSection artworksData={publicArtworks} />
      <ArtistsSection />
      <StoriesSection activities={publicActivities} />
      <FooterSection />
    </div>
  )
}
