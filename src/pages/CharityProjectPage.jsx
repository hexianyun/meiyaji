import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { charity } from '../data'
import { getPublicContentById } from '../services/contentApi'

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
    return <div className="min-h-screen flex items-center justify-center text-sm" style={{ color: 'var(--text-muted)' }}>正在加载项目...</div>
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: 'var(--bg)' }}>
        <div className="text-center max-w-[280px]">
          <p className="text-[12px] tracking-[0.24em] uppercase mb-3" style={{ color: 'var(--text-weak)' }}>
            Project Detail
          </p>
          <h1 className="text-[24px] leading-[1.2] font-semibold mb-3" style={{ color: 'var(--text)' }}>
            未找到项目内容
          </h1>
          <p className="text-[13px] leading-6 mb-6" style={{ color: 'var(--text-muted)' }}>
            这个项目详情暂未发布，先返回公益栏目继续查看其他内容。
          </p>
          <button
            onClick={() => navigate('/charity')}
            className="px-5 py-3 text-[12px] font-medium"
            style={{ background: 'var(--text)', color: 'white' }}
          >
            返回公益栏目
          </button>
        </div>
      </div>
    )
  }

  const galleryImages = article.images.slice(article.sections.length)

  return (
    <div className="pb-20 fade-in" style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <div
        className="sticky top-0 z-30"
        style={{
          background: 'rgba(246,241,234,0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="max-w-[430px] mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-3 py-2 text-[12px] border"
            style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
          >
            返回
          </button>
          <span className="text-[13px] font-medium" style={{ color: 'var(--text)' }}>
            项目详情
          </span>
          <button
            onClick={() => navigate('/charity')}
            className="text-[12px]"
            style={{ color: 'var(--text-weak)' }}
          >
            公益栏目
          </button>
        </div>
      </div>

      <section className="border-b" style={{ borderColor: 'rgba(232,225,216,0.92)' }}>
        <div className="max-w-[430px] mx-auto">
          <div className="aspect-[16/10]">
            <img src={article.cover} alt={article.title} className="w-full h-full object-cover" />
          </div>
          <div className="px-4 py-5">
            <p className="text-[10px] tracking-[0.26em] uppercase mb-3" style={{ color: 'var(--text-weak)' }}>
              {article.tag}
            </p>
            <h1 className="text-[28px] leading-[1.14] font-semibold mb-4" style={{ color: 'var(--text)' }}>
              {article.title}
            </h1>
            <p className="text-[14px] leading-7 mb-5" style={{ color: 'var(--text-muted)' }}>
              {article.summary || fallbackProject?.desc || '这是一项持续推进中的乡村美育公益项目。'}
            </p>

            <div
              className="grid grid-cols-2 gap-x-4 gap-y-3 text-[11px] pt-4 border-t"
              style={{ borderColor: 'rgba(232,225,216,0.9)', color: 'var(--text-weak)' }}
            >
              <div>发布时间 · {article.date}</div>
              <div>项目统筹 · {article.author}</div>
              <div>项目地点 · {article.location}</div>
              <div>项目标签 · {article.tag}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-[430px] mx-auto px-4 py-8">
        <div className="space-y-7">
          {article.sections.map((section, index) => (
            <div key={index} className="space-y-4">
              <p className="text-[15px] leading-[2] indent-8" style={{ color: 'var(--text)' }}>
                {section}
              </p>
              {article.images[index] && (
                <div className="border" style={{ borderColor: 'rgba(232,225,216,0.92)' }}>
                  <img src={article.images[index]} alt="" className="w-full object-cover" loading="lazy" />
                </div>
              )}
            </div>
          ))}
        </div>

        {galleryImages.length > 0 && (
          <div className="mt-10">
            <p className="text-[10px] tracking-[0.26em] uppercase mb-3" style={{ color: 'var(--text-weak)' }}>
              Project Gallery
            </p>
            <div className="grid grid-cols-2 gap-3">
              {galleryImages.map((image, index) => (
                <div
                  key={index}
                  className="border overflow-hidden"
                  style={{ borderColor: 'rgba(232,225,216,0.92)', aspectRatio: '4 / 3' }}
                >
                  <img src={image} alt="" className="w-full h-full object-cover" loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10 pt-6 border-t" style={{ borderColor: 'rgba(232,225,216,0.9)' }}>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/charity')}
              className="px-4 py-3 text-[12px] font-medium"
              style={{ background: 'var(--text)', color: 'white' }}
            >
              返回公益栏目
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-3 text-[12px] font-medium border"
              style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
            >
              返回首页
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
