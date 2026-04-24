import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { charity, charityActivities, charityProjectDetails, charityStories, charitySignupEvents } from '../data'
import { getPublicContents } from '../services/contentApi'

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

function CharityHero({ activities }) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const carouselActivities = [...activities].sort((a, b) => String(b.date).localeCompare(String(a.date))).slice(0, 5)

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId)
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  useEffect(() => {
    if (carouselActivities.length <= 1) return

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselActivities.length)
    }, 4500)

    return () => clearInterval(timer)
  }, [carouselActivities.length])

  if (carouselActivities.length === 0) return null

  return (
    <section className="px-4 pt-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-[20px] leading-[1.2] font-bold tracking-wide" style={{ color: 'var(--text)' }}>
            美育公益
          </h1>
          <p className="text-[10px] font-bold tracking-[0.3em] uppercase mt-1" style={{ color: 'var(--text-weak)' }}>
            PUBLIC GOOD
          </p>
        </div>
      </div>

      <div 
        className="w-full relative overflow-hidden mb-5" 
        style={{ borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}
      >
        <div className="aspect-[4/5] w-full relative">
          {carouselActivities.map((activity, idx) => (
            <img 
              key={activity.id}
              src={activity.cover} 
              alt={activity.title} 
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
              style={{ opacity: currentSlide === idx ? 1 : 0 }}
            />
          ))}
          
          {/* 渐变遮罩层，让底部按钮清晰可见 */}
          <div className="absolute inset-0 z-10 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.8) 100%)' }} />

          {/* 轮播指示点 */}
          <div className="absolute top-4 inset-x-0 flex justify-center gap-1.5 z-20">
            {carouselActivities.map((_, idx) => (
              <div 
                key={idx}
                className="h-1 rounded-full transition-all duration-500"
                style={{
                  width: currentSlide === idx ? '16px' : '6px',
                  background: currentSlide === idx ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)'
                }}
              />
            ))}
          </div>

          {/* 悬浮在图片底部的按钮组 */}
          <div className="absolute inset-x-0 bottom-0 p-4 z-20">
            <div className="grid grid-cols-3 gap-3">
              <button 
                onClick={() => scrollToSection('charity-activities')}
                className="flex flex-col items-center justify-center py-3.5 transition-transform active:scale-95"
                style={{ background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(12px)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255, 255, 255, 0.3)' }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'white' }}>
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span className="text-[12px] font-bold mt-1.5" style={{ color: 'white' }}>公益活动</span>
              </button>

              <button 
                onClick={() => scrollToSection('charity-signup')}
                className="flex flex-col items-center justify-center py-3.5 transition-transform active:scale-95"
                style={{ background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(12px)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255, 255, 255, 0.3)' }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'white' }}>
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <polyline points="16 11 18 13 22 9"></polyline>
                </svg>
                <span className="text-[12px] font-bold mt-1.5" style={{ color: 'white' }}>活动报名</span>
              </button>

              <button 
                onClick={() => scrollToSection('charity-stories')}
                className="flex flex-col items-center justify-center py-3.5 transition-transform active:scale-95"
                style={{ background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(12px)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255, 255, 255, 0.3)' }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'white' }}>
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
                <span className="text-[12px] font-bold mt-1.5" style={{ color: 'white' }}>公益故事</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ImpactSection() {
  const totalRaised = charity.reduce((sum, item) => sum + item.raised, 0)
  const totalBeneficiaries = charity.reduce((sum, item) => sum + item.beneficiaries, 0)
  const stats = [
    { value: charity.length + charityActivities.length, label: '公益项目与行动' },
    { value: totalBeneficiaries, label: '累计受益人次' },
    { value: `¥${Math.round(totalRaised / 10000)}万`, label: '当前项目筹集' },
  ]

  return (
    <section className="px-4 mt-16">
      <SectionIntro
        eyebrow="MISSION"
        title={'公益不是附属说明\n而是项目的核心结构'}
        description="我们把作品展陈、艺术家参与、乡村课堂与长期项目并置，让公益页不仅能被阅读，也能被信任。"
      />

      <div className="p-6 relative overflow-hidden" style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}>
        {/* Decorative element */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none" style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }}></div>

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

        <div className="pt-5 border-t" style={{ borderColor: 'var(--border)' }}>
          <p className="text-[14px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            从长期美育教室，到儿童写生支持，再到艺术家公益讲堂，我们希望每一个项目都能够留下清晰的方法、真实的记录与持续的影响。
          </p>
        </div>
      </div>
    </section>
  )
}

function InitiativesSection({ projects }) {
  const navigate = useNavigate()

  return (
    <section id="charity-activities" className="px-4 mt-16 scroll-mt-24">
      <SectionIntro
        eyebrow="CHARITY EVENTS"
        title={'公益活动\n把每一次行动清晰展开'}
        description="从长期计划到现场实践，公益栏目首先呈现正在发生和已经留下影响的项目行动。"
      />

      <div className="space-y-4">
        {projects.map(item => (
          <div
            key={item.id}
            className="group overflow-hidden"
            style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}
          >
            <div className="aspect-[16/10] overflow-hidden">
              <img src={item.cover} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="text-[11px] font-bold tracking-[0.2em] uppercase mb-2.5" style={{ color: 'var(--text-weak)' }}>
                    {item.tag}
                  </p>
                  <h3 className="text-[22px] leading-[1.3] font-bold" style={{ color: 'var(--text)' }}>
                    {item.title}
                  </h3>
                </div>
                <div className="text-right text-[12px] font-medium" style={{ color: 'var(--text-muted)' }}>
                  <div>项目类型 · {item.kind === 'project' ? '长期项目' : '公益内容'}</div>
                  <div className="mt-1">{item.date}</div>
                </div>
              </div>
              <p className="text-[14px] leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
                {item.desc || item.summary}
              </p>
              {item.id && (
                <button
                  onClick={() => navigate(`/charity/project/${item.id}`)}
                  className="text-[13px] font-semibold flex items-center gap-1 transition-opacity hover:opacity-70"
                  style={{ color: 'var(--accent)' }}
                >
                  查看项目详情
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function SignupSection({ events }) {
  const navigate = useNavigate()
  const signupItems = [...events].sort((a, b) => String(b.date).localeCompare(String(a.date)))

  return (
    <section id="charity-signup" className="px-4 mt-16 scroll-mt-24">
      <SectionIntro
        eyebrow="EVENT SIGNUP"
        title={'活动报名\n查看近期开放活动'}
        description="这里集中展示近期公益活动与参与入口，方便查看内容、时间和报名相关信息。"
      />

      <div className="space-y-4">
        {signupItems.map(event => (
          <button
            key={event.id}
            onClick={() => navigate(`/charity/article/${event.id}`)}
            className="w-full text-left group overflow-hidden"
            style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}
          >
            <div className="aspect-[16/10] overflow-hidden">
              <img src={event.cover} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between gap-4 mb-3 text-[12px] font-medium" style={{ color: 'var(--text-weak)' }}>
                <span className="uppercase tracking-wider font-bold">{event.tag}</span>
                <span>{event.location} · {event.date}</span>
              </div>
              <h3 className="text-[20px] leading-[1.3] font-bold mb-3" style={{ color: 'var(--text)' }}>
                {event.title}
              </h3>
              <p className="text-[14px] leading-relaxed mb-5" style={{ color: 'var(--text-muted)' }}>
                {event.desc || event.summary}
              </p>
              <div className="flex items-center justify-between text-[13px] font-semibold">
                <span style={{ color: 'var(--text-weak)' }}>{event.status || '开放报名中'}</span>
                <span className="flex items-center gap-1 transition-colors group-hover:text-opacity-70" style={{ color: 'var(--accent)' }}>
                  查看征集详情
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}

function StoriesSection({ stories }) {
  const navigate = useNavigate()
  const storyItems = [...stories].sort((a, b) => String(b.date).localeCompare(String(a.date)))

  return (
    <section id="charity-stories" className="px-4 mt-16 scroll-mt-24">
      <SectionIntro
        eyebrow="CHARITY STORIES"
        title={'公益故事\n把现场变成可阅读的记录'}
        description="这一组内容延续真实活动文章，但以更轻的阅读节奏呈现项目背后的温度与细节。"
      />

      <div className="grid grid-cols-2 gap-4">
        {storyItems.map(story => (
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
              <h3 className="text-[15px] leading-[1.4] font-bold mb-2 line-clamp-2" style={{ color: 'var(--text)' }}>
                {story.title}
              </h3>
              <p className="text-[12px] leading-relaxed font-medium line-clamp-2 mb-2.5" style={{ color: 'var(--text-muted)' }}>
                {story.desc}
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

function CharityFooter() {
  const navigate = useNavigate()

  return (
    <footer className="px-4 mt-20 pb-32">
      <div className="p-8 text-center" style={{ background: 'linear-gradient(180deg, var(--surface) 0%, var(--surface-2) 100%)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)' }}>
        <p className="text-[11px] font-bold tracking-[0.25em] uppercase mb-4" style={{ color: 'var(--text-weak)' }}>
          CONTINUE THE PROJECT
        </p>
        <h3 className="text-[24px] leading-[1.3] font-bold mb-4" style={{ color: 'var(--text)' }}>
          让公益页成为<br/>下一次行动的起点
        </h3>
        <p className="text-[14px] leading-relaxed mb-8 mx-auto max-w-[280px]" style={{ color: 'var(--text-muted)' }}>
          你可以继续阅读活动记录、浏览参与作品，也可以从这里回到首页，完整理解这场艺术公益计划的结构与方法。
        </p>

        <div className="flex flex-col gap-3 max-w-[200px] mx-auto mb-8">
          <button
            onClick={() => navigate('/discover')}
            className="btn-primary w-full"
          >
            浏览参与作品
          </button>
          <button
            onClick={() => navigate('/')}
            className="btn-outline w-full"
            style={{ background: 'transparent' }}
          >
            返回首页
          </button>
        </div>

        <div className="pt-6 border-t flex flex-col items-center gap-2" style={{ borderColor: 'var(--border)', color: 'var(--text-weak)' }}>
          <span className="text-[12px] font-bold">美芽集 · 公益活动</span>
          <span className="text-[10px] tracking-wider uppercase">Art for Rural Aesthetic Education</span>
        </div>
      </div>
    </footer>
  )
}

export default function CharityPage() {
  const [activities, setActivities] = useState(charityActivities)
  const [projects, setProjects] = useState(charity.map(item => ({
    ...item,
    id: String(item.id),
  })))
  const [signupEvents] = useState(charitySignupEvents)
  const [storyItems] = useState(charityStories)

  useEffect(() => {
    let isActive = true

    async function loadContent() {
      const [nextActivities, nextProjects] = await Promise.all([
        getPublicContents('activity'),
        getPublicContents('project'),
      ])

      if (!isActive) return

      setActivities(nextActivities)
      setProjects(nextProjects)
    }

    loadContent()

    return () => {
      isActive = false
    }
  }, [])

  return (
    <div className="pb-20 fade-in min-h-screen">
      <CharityHero activities={activities} />
      <ImpactSection />

      {/* 插入的计划书图片 */}
      <section className="px-4 mt-12 mb-4">
        <div className="w-full overflow-hidden" style={{ borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}>
          <img src="/jihuashu.png" alt="公益计划书" className="w-full h-auto block" />
        </div>
      </section>

      <InitiativesSection projects={projects} />
      <SignupSection events={signupEvents} />
      <StoriesSection stories={storyItems} />
      <CharityFooter />
    </div>
  )
}
