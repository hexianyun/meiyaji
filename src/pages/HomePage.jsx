import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { artworks, artists, charity, charityActivities } from '../data'
import { getArtistCoverArtwork } from '../artistMedia'

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
        <p className="text-[11px] tracking-[0.34em] uppercase mb-3" style={{ color: 'var(--text-weak)' }}>
          MEIYAJI
        </p>
        <h1 className="text-[34px] leading-[1.08] font-semibold whitespace-pre-line" style={{ color: 'var(--text)' }}>
          收藏艺术之美
          {'\n'}
          灌溉乡村美育之芽
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
            <button className="text-[12px] pb-1" style={{ color: 'var(--text)', borderBottom: '1px solid var(--text)' }}>
              查看项目详情
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

function FeaturedWorksSection() {
  const navigate = useNavigate()
  const featured = artworks.filter(art => art.featured).slice(0, 4)
  const lead = featured[0]
  const secondary = featured.slice(1)

  if (!lead) return null

  return (
    <section className="px-4 mt-14">
      <SectionIntro
        eyebrow="CURATED WORKS"
        title={'以作品为入口\n理解艺术，也理解公益'}
        description="首页只保留少量精选作品，让浏览更像阅读图录，而不是滚动商品列表。"
        actionLabel="全部作品"
        onAction={() => navigate('/discover')}
      />

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => navigate(`/detail/${lead.id}`)}
          className="col-span-2 text-left border overflow-hidden"
          style={{ borderColor: 'rgba(232,225,216,0.92)', background: 'rgba(251,248,244,0.92)' }}
        >
          <div className="aspect-[16/11] relative">
            <img src={lead.img} alt={lead.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(23,21,18,0.02) 20%, rgba(23,21,18,0.55) 100%)' }} />
            <div className="absolute left-4 right-4 bottom-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: 'rgba(255,255,255,0.72)' }}>
                  Lead Work
                </p>
                <p className="text-[24px] leading-[1.15] font-semibold" style={{ color: 'white' }}>
                  {lead.title}
                </p>
                <p className="text-[12px] mt-1" style={{ color: 'rgba(255,255,255,0.74)' }}>
                  {lead.artist}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-[0.18em]" style={{ color: 'rgba(255,255,255,0.72)' }}>
                  公益贡献
                </p>
                <p className="text-[20px] font-semibold" style={{ color: 'white' }}>
                  {lead.charityPct}%
                </p>
              </div>
            </div>
          </div>
        </button>

        {secondary.map(work => (
          <button
            key={work.id}
            onClick={() => navigate(`/detail/${work.id}`)}
            className="text-left border overflow-hidden"
            style={{ borderColor: 'rgba(232,225,216,0.92)', background: 'rgba(251,248,244,0.92)' }}
          >
            <div className="aspect-[4/5]">
              <img src={work.img} alt={work.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-3">
              <p className="text-[15px] font-semibold leading-[1.3] mb-1" style={{ color: 'var(--text)' }}>
                {work.title}
              </p>
              <p className="text-[11px] mb-3" style={{ color: 'var(--text-muted)' }}>
                {work.artist}
              </p>
              <div className="flex items-center justify-between text-[11px]" style={{ color: 'var(--text-weak)' }}>
                <span>{work.mat}</span>
                <span>{work.charityPct}% 公益</span>
              </div>
            </div>
          </button>
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

function StoriesSection() {
  const navigate = useNavigate()
  const latestActivities = [...charityActivities].sort((a, b) => b.date.localeCompare(a.date))
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
              {leadStory.desc}
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
  return (
    <div className="pb-20 fade-in">
      <HeroShowcase />
      <MissionBlock />
      <FeaturedWorksSection />
      <ArtistsSection />
      <StoriesSection />
      <FooterSection />
    </div>
  )
}
