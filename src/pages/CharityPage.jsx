import { useNavigate } from 'react-router-dom'
import { charity, charityActivities, stories } from '../data'

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
          <p className="text-[13px] leading-6 mt-3 max-w-[304px]" style={{ color: 'var(--text-muted)' }}>
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

function CharityHero() {
  const navigate = useNavigate()
  const leadActivity = [...charityActivities].sort((a, b) => b.date.localeCompare(a.date))[0]

  if (!leadActivity) return null

  return (
    <section className="px-4 pt-5">
      <div className="mb-6">
        <p className="text-[11px] tracking-[0.34em] uppercase mb-3" style={{ color: 'var(--text-weak)' }}>
          PUBLIC GOOD
        </p>
        <h1 className="text-[34px] leading-[1.08] font-semibold whitespace-pre-line" style={{ color: 'var(--text)' }}>
          让公益被认真记录
          {'\n'}
          也让美育持续发生
        </h1>
      </div>

      <div className="border overflow-hidden" style={{ borderColor: 'rgba(232,225,216,0.92)', background: '#D8D1C8' }}>
        <div className="aspect-[4/5] relative">
          <img src={leadActivity.cover} alt={leadActivity.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(18,17,15,0.08) 0%, rgba(18,17,15,0.62) 100%)' }} />

          <div className="absolute inset-x-0 top-0 px-5 pt-5 flex items-start justify-between">
            <p className="text-[10px] tracking-[0.24em] uppercase" style={{ color: 'rgba(255,255,255,0.74)' }}>
              FIELD PRACTICE
            </p>
            <div className="text-right text-[11px]" style={{ color: 'rgba(255,255,255,0.74)' }}>
              {leadActivity.location}
              <br />
              {leadActivity.date}
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 px-5 pb-5">
            <span
              className="inline-block px-2 py-1 text-[10px] mb-3"
              style={{ color: 'white', border: '1px solid rgba(255,255,255,0.34)' }}
            >
              {leadActivity.tag}
            </span>
            <h2 className="text-[28px] leading-[1.12] font-semibold mb-3" style={{ color: 'white' }}>
              {leadActivity.title}
            </h2>
            <p className="text-[13px] leading-6 max-w-[300px] mb-5" style={{ color: 'rgba(255,255,255,0.8)' }}>
              {leadActivity.desc}
            </p>
            <div className="flex gap-2.5">
              <button
                onClick={() => navigate(`/charity/article/${leadActivity.id}`)}
                className="px-4 py-3 text-[12px] font-medium"
                style={{ background: 'white', color: '#161412' }}
              >
                阅读现场记录
              </button>
              <button
                onClick={() => navigate('/discover')}
                className="px-4 py-3 text-[12px] font-medium border"
                style={{ borderColor: 'rgba(255,255,255,0.34)', color: 'white' }}
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
    <section className="px-4 mt-14">
      <SectionIntro
        eyebrow="MISSION"
        title={'公益不是附属说明\n而是项目的核心结构'}
        description="我们把作品展陈、艺术家参与、乡村课堂与长期项目并置，让公益页不仅能被阅读，也能被信任。"
      />

      <div className="border p-5" style={{ borderColor: 'rgba(232,225,216,0.92)', background: 'rgba(251,248,244,0.9)' }}>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {stats.map(stat => (
            <div key={stat.label}>
              <p className="text-[32px] leading-none font-semibold mb-2" style={{ color: 'var(--text)' }}>
                {stat.value}
              </p>
              <p className="text-[11px] leading-5" style={{ color: 'var(--text-muted)' }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t" style={{ borderColor: 'rgba(232,225,216,0.9)' }}>
          <p className="text-[12px] leading-6" style={{ color: 'var(--text-muted)' }}>
            从长期美育教室，到儿童写生支持，再到艺术家公益讲堂，我们希望每一个项目都能够留下清晰的方法、真实的记录与持续的影响。
          </p>
        </div>
      </div>
    </section>
  )
}

function InitiativesSection() {
  return (
    <section className="px-4 mt-14">
      <SectionIntro
        eyebrow="INITIATIVES"
        title={'把长期项目单独陈列\n让每一项计划都清晰可见'}
        description="公益项目不只是一则活动信息，而应该像机构图录一样，被完整地展开。"
      />

      <div className="space-y-3">
        {charity.map(item => (
          <div
            key={item.id}
            className="border"
            style={{ borderColor: 'rgba(232,225,216,0.92)', background: 'rgba(251,248,244,0.92)' }}
          >
            <div className="aspect-[16/10]">
              <img src={item.cover} alt={item.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="text-[10px] tracking-[0.2em] uppercase mb-2" style={{ color: 'var(--text-weak)' }}>
                    {item.tag}
                  </p>
                  <h3 className="text-[20px] leading-[1.25] font-semibold" style={{ color: 'var(--text)' }}>
                    {item.title}
                  </h3>
                </div>
                <div className="text-right text-[11px]" style={{ color: 'var(--text-muted)' }}>
                  <div>筹集 ¥{item.raised.toLocaleString()}</div>
                  <div>{item.beneficiaries} 人受益</div>
                </div>
              </div>
              <p className="text-[13px] leading-6" style={{ color: 'var(--text-muted)' }}>
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function ActivitiesSection() {
  const navigate = useNavigate()
  const activities = [...charityActivities].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <section className="px-4 mt-14">
      <SectionIntro
        eyebrow="FIELD NOTES"
        title={'把行动现场整理成\n可持续阅读的公益记录'}
        description="每一次讲堂、回访与现场实践，都应该留下完整的图像和叙事，而不是短暂滑过的信息。"
      />

      <div className="space-y-3">
        {activities.map(activity => (
          <button
            key={activity.id}
            onClick={() => navigate(`/charity/article/${activity.id}`)}
            className="w-full text-left border overflow-hidden"
            style={{ borderColor: 'rgba(232,225,216,0.92)', background: 'rgba(251,248,244,0.92)' }}
          >
            <div className="aspect-[16/10]">
              <img src={activity.cover} alt={activity.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between gap-4 mb-2 text-[11px]" style={{ color: 'var(--text-weak)' }}>
                <span>{activity.tag}</span>
                <span>{activity.location} · {activity.date}</span>
              </div>
              <h3 className="text-[19px] leading-[1.32] font-semibold mb-2" style={{ color: 'var(--text)' }}>
                {activity.title}
              </h3>
              <p className="text-[13px] leading-6 mb-4" style={{ color: 'var(--text-muted)' }}>
                {activity.desc}
              </p>
              <div className="flex items-center justify-between text-[12px]">
                <span style={{ color: 'var(--text-weak)' }}>{activity.participants} 人参与</span>
                <span style={{ color: 'var(--text)', borderBottom: '1px solid var(--text)', paddingBottom: '4px' }}>
                  查看现场记录
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}

function StoriesSection() {
  return (
    <section className="px-4 mt-14">
      <SectionIntro
        eyebrow="EDITORIAL"
        title={'用更编辑化的方式\n补充项目的温度与背景'}
        description="除了活动现场，我们也保留更轻的公益观察与艺术家行动记录，让页面不止有数据，也有情感线索。"
      />

      <div className="grid grid-cols-2 gap-3">
        {stories.map(story => (
          <div
            key={story.id}
            className="border"
            style={{ borderColor: 'rgba(232,225,216,0.92)', background: 'rgba(251,248,244,0.92)' }}
          >
            <div className="aspect-[4/3]">
              <img src={story.cover} alt={story.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-3">
              <p className="text-[10px] tracking-[0.16em] uppercase mb-2" style={{ color: 'var(--text-weak)' }}>
                {story.type}
              </p>
              <h3 className="text-[15px] leading-[1.38] font-semibold mb-2" style={{ color: 'var(--text)' }}>
                {story.title}
              </h3>
              <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                {story.author} · {story.read}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function CharityFooter() {
  const navigate = useNavigate()

  return (
    <footer className="px-4 mt-14 pb-28">
      <div className="border p-5" style={{ borderColor: 'rgba(232,225,216,0.92)', background: 'rgba(248,244,239,0.92)' }}>
        <p className="text-[10px] tracking-[0.26em] uppercase mb-3" style={{ color: 'var(--text-weak)' }}>
          CONTINUE THE PROJECT
        </p>
        <h3 className="text-[24px] leading-[1.2] font-semibold mb-3" style={{ color: 'var(--text)' }}>
          让公益页成为下一次行动的起点
        </h3>
        <p className="text-[13px] leading-6 mb-5 max-w-[304px]" style={{ color: 'var(--text-muted)' }}>
          你可以继续阅读活动记录、浏览参与作品，也可以从这里回到首页，完整理解这场艺术公益计划的结构与方法。
        </p>

        <div className="flex gap-2.5 mb-6">
          <button
            onClick={() => navigate('/discover')}
            className="px-4 py-3 text-[12px] font-medium"
            style={{ background: 'var(--text)', color: 'white' }}
          >
            浏览参与作品
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-3 text-[12px] font-medium border"
            style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
          >
            返回首页
          </button>
        </div>

        <div className="pt-4 border-t text-[11px] flex items-center justify-between gap-3" style={{ borderColor: 'rgba(232,225,216,0.9)', color: 'var(--text-weak)' }}>
          <span>美芽集 · 公益活动</span>
          <span>Art for Rural Aesthetic Education</span>
        </div>
      </div>
    </footer>
  )
}

export default function CharityPage() {
  return (
    <div className="pb-20 fade-in">
      <CharityHero />
      <ImpactSection />
      <InitiativesSection />
      <ActivitiesSection />
      <StoriesSection />
      <CharityFooter />
    </div>
  )
}
