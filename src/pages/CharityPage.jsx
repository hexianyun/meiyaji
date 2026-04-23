import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { charity, charityActivities, charityProjectDetails } from '../data'
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
  const navigate = useNavigate()
  const leadActivity = [...activities].sort((a, b) => String(b.date).localeCompare(String(a.date)))[0]

  if (!leadActivity) return null

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

      <div className="relative overflow-hidden cursor-pointer" style={{ borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', background: 'var(--surface-2)' }}>
        <div className="aspect-[4/5] relative">
          <img src={leadActivity.cover} alt={leadActivity.title} className="w-full h-full object-cover transition-transform duration-1000 ease-out" style={{ transform: 'scale(1.03)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%)' }} />

          <div className="absolute inset-x-0 top-0 px-6 pt-6 flex items-start justify-between">
            <p className="text-[11px] font-bold tracking-[0.25em] uppercase" style={{ color: 'rgba(255,255,255,0.9)' }}>
              FIELD PRACTICE
            </p>
            <div className="text-right text-[12px] font-medium tracking-wide" style={{ color: 'rgba(255,255,255,0.8)' }}>
              {leadActivity.location}
              <br />
              {leadActivity.date}
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 px-6 pb-6">
            <span
              className="inline-block px-3 py-1.5 text-[10px] font-bold tracking-wider rounded-full mb-4"
              style={{ color: 'white', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              {leadActivity.tag}
            </span>
            <h2 className="text-[32px] leading-[1.15] font-bold mb-3 blur-reveal" style={{ color: 'white', textShadow: '0 2px 12px rgba(0,0,0,0.2)' }}>
              {leadActivity.title}
            </h2>
            <p className="text-[14px] leading-relaxed max-w-[290px] mb-6 blur-reveal" style={{ color: 'rgba(255,255,255,0.85)', animationDelay: '0.1s' }}>
              {leadActivity.desc || leadActivity.summary}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/charity/article/${leadActivity.id}`)}
                className="btn-primary"
              >
                阅读现场记录
              </button>
              <button
                onClick={() => navigate('/discover')}
                className="btn-outline"
                style={{ color: 'white', borderColor: 'rgba(255,255,255,0.4)', background: 'transparent' }}
              >
                浏览参与作品
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
    <section className="px-4 mt-16">
      <SectionIntro
        eyebrow="INITIATIVES"
        title={'把长期项目单独陈列\n让每一项计划都清晰可见'}
        description="公益项目不只是一则活动信息，而应该像机构图录一样，被完整地展开。"
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

function ActivitiesSection({ activities }) {
  const navigate = useNavigate()
  const sortedActivities = [...activities].sort((a, b) => String(b.date).localeCompare(String(a.date)))

  return (
    <section className="px-4 mt-16">
      <SectionIntro
        eyebrow="FIELD NOTES"
        title={'把行动现场整理成\n可持续阅读的公益记录'}
        description="每一次讲堂、回访与现场实践，都应该留下完整的图像和叙事，而不是短暂滑过的信息。"
      />

      <div className="space-y-4">
        {sortedActivities.map(activity => (
          <button
            key={activity.id}
            onClick={() => navigate(`/charity/article/${activity.id}`)}
            className="w-full text-left group overflow-hidden"
            style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}
          >
            <div className="aspect-[16/10] overflow-hidden">
              <img src={activity.cover} alt={activity.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between gap-4 mb-3 text-[12px] font-medium" style={{ color: 'var(--text-weak)' }}>
                <span className="uppercase tracking-wider font-bold">{activity.tag}</span>
                <span>{activity.location} · {activity.date}</span>
              </div>
              <h3 className="text-[20px] leading-[1.3] font-bold mb-3" style={{ color: 'var(--text)' }}>
                {activity.title}
              </h3>
              <p className="text-[14px] leading-relaxed mb-5" style={{ color: 'var(--text-muted)' }}>
                {activity.desc || activity.summary}
              </p>
              <div className="flex items-center justify-between text-[13px] font-semibold">
                <span style={{ color: 'var(--text-weak)' }}>{activity.participants ? `${activity.participants} 人参与` : '查看项目现场'}</span>
                <span className="flex items-center gap-1 transition-colors group-hover:text-opacity-70" style={{ color: 'var(--accent)' }}>
                  查看现场记录
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

function StoriesSection({ activities }) {
  const navigate = useNavigate()
  const editorialActivities = [...activities].sort((a, b) => String(b.date).localeCompare(String(a.date))).slice(0, 2)

  return (
    <section className="px-4 mt-16">
      <SectionIntro
        eyebrow="EDITORIAL"
        title={'用更编辑化的方式\n补充项目的温度与背景'}
        description="这一组内容同样来自已有公益活动文章，只是以更轻的编辑式方式再次呈现，让页面不止有数据，也有阅读节奏。"
      />

      <div className="grid grid-cols-2 gap-4">
        {editorialActivities.map(story => (
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
      <InitiativesSection projects={projects} />
      <ActivitiesSection activities={activities} />
      <StoriesSection activities={activities} />
      <CharityFooter />
    </div>
  )
}
