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
    <div className="flex items-end justify-between gap-4 mb-5">
      <div className="min-w-0">
        <p className="text-[10px] tracking-[0.28em] uppercase mb-2" style={{ color: 'var(--text-weak)' }}>
          {eyebrow}
        </p>
        <h2 className="text-[24px] leading-[1.18] font-semibold whitespace-pre-line" style={{ color: 'var(--text)' }}>
          {title}
        </h2>
        {description && (
          <p className="text-[13px] leading-6 mt-3 max-w-[300px]" style={{ color: 'var(--text-muted)' }}>
            {description}
          </p>
        )}
      </div>

      {actionLabel && (
        <button
          onClick={onAction}
          className="text-[12px] whitespace-nowrap pb-1"
          style={{ color: 'var(--text)', borderBottom: '1px solid var(--text)' }}
        >
          {actionLabel}
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
    <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="20" r="1.2" />
      <circle cx="17" cy="20" r="1.2" />
      <path d="M3 4h2l2.2 10.5a1.6 1.6 0 0 0 1.6 1.3h8.8a1.6 1.6 0 0 0 1.5-1.1L21 7H6.1" />
    </svg>
  )
}

function ArtworkTile({ artwork, large = false, onOpen, onAdd }) {
  const landscape = isLandscapeArtwork(artwork)

  return (
    <article
      className={`border overflow-hidden ${large ? 'col-span-2' : ''}`}
      style={{ borderColor: 'rgba(232,225,216,0.92)', background: 'rgba(251,248,244,0.92)' }}
    >
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
        <div
          className={`flex items-center justify-center ${large ? 'aspect-[16/10]' : 'aspect-[4/5]'}`}
          style={{ background: 'rgba(255,255,255,0.7)' }}
        >
          <img
            src={artwork.img}
            alt={artwork.title}
            className="block object-contain"
            loading="lazy"
            style={{
              maxWidth: large ? (landscape ? '84%' : '94%') : (landscape ? '80%' : '92%'),
              maxHeight: large ? (landscape ? '74%' : '88%') : (landscape ? '70%' : '84%'),
            }}
          />
        </div>

        <div className={large ? 'px-4 py-3' : 'px-3 py-2.5'}>
          <p
            className={`${large ? 'text-[12px]' : 'text-[11px]'} font-medium mb-1`}
            style={{ color: 'var(--text-muted)' }}
          >
            {artwork.artist}
          </p>
          <p
            className={`${large ? 'text-[18px]' : 'text-[14px]'} leading-[1.28] font-semibold`}
            style={{
              color: 'var(--text)',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: large ? '2.56em' : '2.56em',
            }}
          >
            {artwork.title}
          </p>
          <div className="mt-2 flex items-center justify-between gap-3">
            <p className={`${large ? 'text-[15px]' : 'text-[13px]'} font-semibold`} style={{ color: 'var(--text)' }}>
              {formatPrice(artwork.price)}
            </p>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                onAdd(artwork)
              }}
              className={`shrink-0 border flex items-center justify-center ${large ? 'w-9 h-9' : 'w-8 h-8'}`}
              style={{ borderColor: 'var(--border)', background: 'var(--surface)', color: 'var(--text)' }}
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

function HeroShowcase() {
  const navigate = useNavigate()
  const [current, setCurrent] = useState(0)
  const total = HERO_SLIDES.length

  const goNext = useCallback(() => {
    setCurrent(prev => (prev + 1) % total)
  }, [total])

  useEffect(() => {
    if (total <= 1) return
    const timer = setInterval(goNext, 4500)
    return () => clearInterval(timer)
  }, [goNext, total])

  const slide = HERO_SLIDES[current]

  return (
    <section className="px-4 pt-5">
      <div className="mb-6">
        <p className="text-[9px] tracking-[0.34em] uppercase mb-2.5" style={{ color: 'var(--text-weak)' }}>
          MEIYAJI
        </p>
        <h1 className="text-[16px] leading-[1.28] font-semibold whitespace-nowrap" style={{ color: '#3a3029' }}>
          美芽集 收藏艺术之美 灌溉乡村美育之芽
        </h1>
      </div>

      <div
        className="relative overflow-hidden border cursor-pointer"
        style={{ borderColor: 'rgba(232,225,216,0.9)', background: '#D9D4CE' }}
        onClick={() => navigate('/charity')}
      >
        <div className="aspect-[4/5] relative">
          <img src={slide.image} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(19,18,17,0.08) 0%, rgba(19,18,17,0.62) 100%)' }} />

          <div className="absolute inset-x-0 top-0 px-5 pt-5 flex items-start justify-between">
            <div>
              <p className="text-[10px] tracking-[0.26em] uppercase" style={{ color: 'rgba(255,255,255,0.72)' }}>
                {slide.eyebrow}
              </p>
            </div>
            <div className="text-[11px]" style={{ color: 'rgba(255,255,255,0.72)' }}>
              {String(current + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 px-5 pb-5">
            <h2 className="text-[29px] leading-[1.12] font-semibold whitespace-pre-line mb-3" style={{ color: 'white' }}>
              {slide.title}
            </h2>
            <p className="text-[13px] leading-6 max-w-[290px] mb-5" style={{ color: 'rgba(255,255,255,0.78)' }}>
              {slide.description}
            </p>

            <div className="flex gap-2.5">
              <button
                onClick={(event) => {
                  event.stopPropagation()
                  navigate('/discover')
                }}
                className="px-4 py-3 text-[12px] font-medium"
                style={{ background: 'white', color: '#161412' }}
              >
                浏览作品
              </button>
              <button
                onClick={(event) => {
                  event.stopPropagation()
                  navigate('/charity')
                }}
                className="px-4 py-3 text-[12px] font-medium border"
                style={{ borderColor: 'rgba(255,255,255,0.38)', color: 'white' }}
              >
                查看公益计划
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        {HERO_SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className="h-[2px] transition-all"
            style={{
              width: index === current ? '44px' : '18px',
              background: index === current ? 'var(--text)' : 'rgba(62,58,55,0.18)',
            }}
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
    <section className="px-4 mt-14">
      <SectionIntro
        eyebrow="PUBLIC GOOD"
        title={'把公益做成长期项目\n而不是一次性活动'}
        description="我们希望让艺术的流动真正进入乡村教育现场，让作品、课堂、艺术家与受益者形成可持续连接。"
      />

      <div className="border p-5" style={{ borderColor: 'rgba(232,225,216,0.92)', background: 'rgba(251,248,244,0.9)' }}>
        <p className="text-[10px] tracking-[0.22em] uppercase mb-4" style={{ color: 'var(--text-weak)' }}>
          Current Initiative
        </p>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {stats.map(stat => (
            <div key={stat.label}>
              <p className="text-[34px] leading-none font-semibold mb-2" style={{ color: 'var(--text)' }}>
                {stat.value}
              </p>
              <p className="text-[11px] leading-5" style={{ color: 'var(--text-muted)' }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {leadProject && (
          <div className="pt-4 border-t" style={{ borderColor: 'rgba(232,225,216,0.9)' }}>
            <div className="flex items-start justify-between gap-4 mb-2">
              <h3 className="text-[19px] font-semibold leading-[1.25]" style={{ color: 'var(--text)' }}>
                {leadProject.title}
              </h3>
              <span className="text-[11px] px-2 py-1 border whitespace-nowrap" style={{ color: 'var(--text-muted)', borderColor: 'rgba(232,225,216,0.9)' }}>
                {leadProject.tag}
              </span>
            </div>
            <p className="text-[13px] leading-6 mb-4" style={{ color: 'var(--text-muted)' }}>
              {leadProject.desc}
            </p>
            <button
              onClick={() => navigate(`/charity/project/${leadProject.id}`)}
              className="text-[12px] pb-1"
              style={{ color: 'var(--text)', borderBottom: '1px solid var(--text)' }}
            >
              查看项目详情
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
  const curatedWorks = artworksData.slice(0, 20)

  if (!curatedWorks.length) return null

  return (
    <section className="px-4 mt-14">
      <SectionIntro
        eyebrow="CURATED WORKS"
        title={'以作品为入口\n让艺术与公益被看见'}
        description="每一件作品都像一段被轻轻展开的艺术叙事，值得你慢慢停下来观看。"
        actionLabel="全部作品"
        onAction={() => navigate('/discover')}
      />

        <div className="grid grid-cols-2 gap-2">
          {curatedWorks.map(work => (
            <ArtworkTile
              key={work.id}
              artwork={work}
              onOpen={(id) => navigate(`/detail/${id}`)}
              onAdd={addToCart}
            />
          ))}
        </div>
      </section>
  )
}

function ArtistsSection() {
  const navigate = useNavigate()
  const featuredArtists = artists.slice(0, 5)

  return (
    <section className="px-4 mt-14">
      <SectionIntro
        eyebrow="ARTISTS"
        title={'与艺术家并肩\n让作品进入更广阔的公共现场'}
        description="每一位合作艺术家都以自己的作品参与这场长期的美育支持计划。"
        actionLabel="艺术家名录"
        onAction={() => navigate('/artists')}
      />

      <div className="flex gap-3 overflow-x-auto pb-1">
        {featuredArtists.map(artist => {
          const coverArt = getArtistCoverArtwork(artist.id)
          const conciseBio = artist.bio.split('，').slice(0, 2).join('，')

          return (
            <button
              key={artist.id}
              onClick={() => navigate(`/artist/${artist.id}`)}
              className="w-[216px] flex-shrink-0 text-left border"
              style={{ borderColor: 'rgba(232,225,216,0.92)', background: 'rgba(251,248,244,0.92)' }}
            >
              <div className="aspect-[4/5]" style={{ background: 'var(--surface-2)' }}>
                {coverArt ? (
                  <img src={coverArt.img} alt={`${artist.name}代表作品`} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full" />
                )}
              </div>
              <div className="p-4">
                <p className="text-[18px] font-semibold mb-2" style={{ color: 'var(--text)' }}>
                  {artist.name}
                </p>
                <p className="text-[12px] leading-6 min-h-[72px]" style={{ color: 'var(--text-muted)' }}>
                  {conciseBio}。
                </p>
                <div className="mt-4 text-[12px]" style={{ color: 'var(--text)', borderBottom: '1px solid var(--text)', display: 'inline-block', paddingBottom: '4px' }}>
                  查看作品
                </div>
              </div>
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
    <section className="px-4 mt-14">
      <SectionIntro
        eyebrow="FIELD NOTES"
        title={'让公益被看见\n也让它被认真记录'}
        description="我们希望公益故事像一本持续更新的现场札记，既有温度，也有真实的项目脉络。"
        actionLabel="全部公益"
        onAction={() => navigate('/charity')}
      />

      <div className="border overflow-hidden mb-3" style={{ borderColor: 'rgba(232,225,216,0.92)', background: 'rgba(251,248,244,0.92)' }}>
        <button onClick={() => navigate(`/charity/article/${leadStory.id}`)} className="w-full text-left">
          <div className="aspect-[16/10]">
            <img src={leadStory.cover} alt={leadStory.title} className="w-full h-full object-cover" />
          </div>
          <div className="p-4">
            <p className="text-[10px] tracking-[0.18em] uppercase mb-2" style={{ color: 'var(--text-weak)' }}>
              {leadStory.tag}
            </p>
            <h3 className="text-[21px] leading-[1.28] font-semibold mb-2" style={{ color: 'var(--text)' }}>
              {leadStory.title}
            </h3>
            <p className="text-[13px] leading-6" style={{ color: 'var(--text-muted)' }}>
              {leadStory.desc || leadStory.summary}
            </p>
          </div>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {sideStories.map(story => (
          <button
            key={story.id}
            onClick={() => navigate(`/charity/article/${story.id}`)}
            className="border text-left"
            style={{ borderColor: 'rgba(232,225,216,0.92)', background: 'rgba(251,248,244,0.92)' }}
          >
            <div className="aspect-[4/3]">
              <img src={story.cover} alt={story.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-3">
              <p className="text-[10px] tracking-[0.14em] uppercase mb-2" style={{ color: 'var(--text-weak)' }}>
                {story.tag}
              </p>
              <p className="text-[15px] leading-[1.4] font-semibold mb-2" style={{ color: 'var(--text)' }}>
                {story.title}
              </p>
              <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
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
    <footer className="px-4 mt-14 pb-28">
      <div className="border p-5" style={{ borderColor: 'rgba(232,225,216,0.92)', background: 'rgba(248,244,239,0.92)' }}>
        <p className="text-[10px] tracking-[0.26em] uppercase mb-3" style={{ color: 'var(--text-weak)' }}>
          MEIYAJI FOUNDATION
        </p>
        <h3 className="text-[24px] leading-[1.2] font-semibold mb-3" style={{ color: 'var(--text)' }}>
          让线上展陈成为公益支持的开始
        </h3>
        <p className="text-[13px] leading-6 mb-5 max-w-[310px]" style={{ color: 'var(--text-muted)' }}>
          这里既是作品浏览入口，也是公益项目的长期记录页。我们相信，艺术不仅值得收藏，也值得被分享给更多孩子。
        </p>

        <div className="flex gap-2.5 mb-6">
          <button
            onClick={() => navigate('/charity')}
            className="px-4 py-3 text-[12px] font-medium"
            style={{ background: 'var(--text)', color: 'white' }}
          >
            查看公益计划
          </button>
          <button
            onClick={() => navigate('/discover')}
            className="px-4 py-3 text-[12px] font-medium border"
            style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
          >
            浏览全部作品
          </button>
        </div>

        <div className="pt-4 border-t text-[11px] flex items-center justify-between gap-3" style={{ borderColor: 'rgba(232,225,216,0.9)', color: 'var(--text-weak)' }}>
          <span>美芽集 · 艺术公益 H5</span>
          <span>Art for Rural Aesthetic Education</span>
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
    <div className="pb-20 fade-in">
      <HeroShowcase />
      <MissionBlock />
      <FeaturedWorksSection artworksData={publicArtworks} />
      <ArtistsSection />
      <StoriesSection activities={publicActivities} />
      <FooterSection />
    </div>
  )
}
