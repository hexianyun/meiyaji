import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getPublicContentById } from '../services/contentApi'

export default function CharityArticlePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isActive = true

    async function loadArticle() {
      setLoading(true)
      const nextArticle = await getPublicContentById('activity', id)

      if (!isActive) return

      setArticle(nextArticle)
      setLoading(false)
    }

    loadArticle()

    return () => {
      isActive = false
    }
  }, [id])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-sm" style={{ color: 'var(--text-muted)' }}>正在加载文章...</div>
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="text-center p-8">
          <div className="text-3xl mb-4" style={{ color: 'var(--text-weak)' }}>◇</div>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>文章未找到</p>
          <button
            onClick={() => navigate('/charity')}
            className="mt-4 text-sm font-medium"
            style={{ color: 'var(--primary)' }}
          >
            返回公益活动
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="pb-20 fade-in" style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <div className="sticky top-0 z-30"
        style={{
          background: 'rgba(246,241,234,0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="max-w-[430px] mx-auto flex items-center justify-between px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            ←
          </button>
          <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>活动详情</span>
          <span className="w-9"></span>
        </div>
      </div>

      <div className="aspect-[16/10] relative overflow-hidden">
        <img src={article.cover} alt={article.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <span className="tag-sage inline-block mb-2">{article.tag}</span>
          <h1 className="text-white font-bold text-lg leading-snug drop-shadow-sm">
            {article.title}
          </h1>
        </div>
      </div>

      <div className="max-w-[430px] mx-auto px-4 py-3 flex items-center gap-4 text-[11px]"
        style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-weak)' }}
      >
        <span>📅 {article.date}</span>
        <span>✍️ {article.author}</span>
        {article.location && (<span>📍 {article.location}</span>)}
      </div>

      <div className="max-w-[430px] mx-auto px-4 py-6 space-y-6">
        {article.sections.map((section, idx) => (
          <div key={idx} className="space-y-3">
            <p className="text-[14px] leading-[1.85] indent-8" style={{ color: 'var(--text)', letterSpacing: '0.02em' }}>
              {section}
            </p>
            {article.images[idx] && (
              <div className="overflow-hidden" style={{ borderRadius: '16px' }}>
                <img src={article.images[idx]} alt="" className="w-full object-cover" loading="lazy" />
              </div>
            )}
          </div>
        ))}

        {article.images.length > article.sections.length && (
          <div className="grid grid-cols-2 gap-2.5 pt-2">
            {article.images.slice(article.sections.length).map((img, idx) => (
              <div key={idx} className="overflow-hidden" style={{ borderRadius: '14px', aspectRatio: '4/3' }}>
                <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        )}

        <div className="pt-6 mt-8" style={{ borderTop: '1px solid var(--border)' }}>
          <p className="text-center text-xs leading-loose" style={{ color: 'var(--text-weak)' }}>
            — 本文完 —<br />
            <span className="text-[10px] opacity-70">美芽集 · 公益活动</span>
          </p>
        </div>

        <button
          onClick={() => navigate('/charity')}
          className="w-full py-3 font-medium text-sm"
          style={{ background: 'var(--primary)', color: 'white' }}
        >
          返回公益活动列表
        </button>
      </div>
    </div>
  )
}
