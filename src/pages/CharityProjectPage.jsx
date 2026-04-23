import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { charity } from '../data'
import { getPublicContentById } from '../services/contentApi'

function BackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"></line>
      <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
  )
}

export default function CharityProjectPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isActive = true

    async function loadProject() {
      setLoading(true)
      const nextArticle = await getPublicContentById('project', id)

      if (!isActive) return

      setArticle(nextArticle)
      setLoading(false)
    }

    loadProject()

    return () => {
      isActive = false
    }
  }, [id])

  const fallbackProject = charity.find(item => String(item.id) === String(id))

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-sm font-medium fade-in" style={{ color: 'var(--text-muted)' }}>正在加载项目...</div>
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 fade-in" style={{ background: 'var(--bg)' }}>
        <div className="text-center max-w-[280px]">
          <p className="text-[12px] font-bold tracking-[0.24em] uppercase mb-3" style={{ color: 'var(--text-weak)' }}>
            Project Detail
          </p>
          <h1 className="text-[24px] leading-[1.2] font-bold mb-3" style={{ color: 'var(--text)' }}>
            未找到项目内容
          </h1>
          <p className="text-[13px] leading-relaxed mb-6 font-medium" style={{ color: 'var(--text-muted)' }}>
            这个项目详情暂未发布，先返回公益栏目继续查看其他内容。
          </p>
          <button
            onClick={() => navigate('/charity')}
            className="btn-primary w-full py-3 text-[14px]"
          >
            返回公益栏目
          </button>
        </div>
      </div>
    )
  }

  const galleryImages = article.images.slice(article.sections.length)

  return (
    <div className="pb-20 fade-in min-h-screen bg-[var(--bg)]">
      <div
        className="sticky top-0 z-30 px-4 pt-5 pb-4"
        style={{
          background: 'rgba(250, 250, 250, 0.85)',
          backdropFilter: 'blur(16px) saturate(180%)',
        }}
      >
        <div className="flex items-center justify-between gap-3 max-w-[430px] mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full shadow-sm transition-transform active:scale-90"
            style={{ background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)' }}
          >
            <BackIcon />
          </button>
          <span className="text-[15px] font-bold" style={{ color: 'var(--text)' }}>
            项目详情
          </span>
          <div className="w-10" />
        </div>
      </div>

      <section>
        <div className="max-w-[430px] mx-auto px-4 mt-2">
          <div className="aspect-[16/10] overflow-hidden" style={{ borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
            <img src={article.cover} alt={article.title} className="w-full h-full object-cover" />
          </div>
          <div className="py-6">
            <p className="text-[11px] font-bold tracking-[0.26em] uppercase mb-3" style={{ color: 'var(--text-weak)' }}>
              {article.tag}
            </p>
            <h1 className="text-[26px] leading-[1.25] font-bold mb-4" style={{ color: 'var(--text)' }}>
              {article.title}
            </h1>
            <p className="text-[14px] leading-relaxed mb-6 font-medium" style={{ color: 'var(--text-muted)' }}>
              {article.summary || fallbackProject?.desc || '这是一项持续推进中的乡村美育公益项目。'}
            </p>

            <div
              className="grid grid-cols-2 gap-x-4 gap-y-3 text-[11px] pt-5 font-medium"
              style={{ borderTop: '1px solid var(--border)', color: 'var(--text-weak)' }}
            >
              <div>发布时间 · {article.date}</div>
              <div>项目统筹 · {article.author}</div>
              <div>项目地点 · {article.location}</div>
              <div>项目标签 · {article.tag}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-[430px] mx-auto px-4 py-4">
        <div className="space-y-8">
          {article.sections.map((section, index) => (
            <div key={index} className="space-y-5">
              <p className="text-[15px] leading-loose tracking-wide font-medium" style={{ color: 'var(--text)' }}>
                {section}
              </p>
              {article.images[index] && (
                <div className="overflow-hidden" style={{ borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                  <img src={article.images[index]} alt="" className="w-full object-cover" loading="lazy" />
                </div>
              )}
            </div>
          ))}
        </div>

        {galleryImages.length > 0 && (
          <div className="mt-12">
            <p className="text-[11px] font-bold tracking-[0.26em] uppercase mb-4" style={{ color: 'var(--text-weak)' }}>
              Project Gallery
            </p>
            <div className="grid grid-cols-2 gap-3">
              {galleryImages.map((image, index) => (
                <div
                  key={index}
                  className="overflow-hidden"
                  style={{ borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', aspectRatio: '4 / 3', boxShadow: 'var(--shadow-sm)' }}
                >
                  <img src={image} alt="" className="w-full h-full object-cover transition-transform hover:scale-105 duration-700" loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 pt-8 flex gap-3" style={{ borderTop: '1px solid var(--border)' }}>
          <button
            onClick={() => navigate('/charity')}
            className="btn-primary flex-1 py-3.5 text-[14px]"
          >
            返回公益栏目
          </button>
          <button
            onClick={() => navigate('/')}
            className="btn-outline flex-1 py-3.5 text-[14px]"
          >
            返回首页
          </button>
        </div>
      </section>
    </div>
  )
}
