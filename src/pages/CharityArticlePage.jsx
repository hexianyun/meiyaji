import { useParams, useNavigate } from 'react-router-dom'
import { charityArticleDetails, charityActivities } from '../data'

export default function CharityArticlePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const articleId = parseInt(id)
  const article = charityArticleDetails[articleId]
  const activity = charityActivities.find(a => a.id === articleId)

  if (!article) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-8">
          <p className="text-2xl mb-4">📄</p>
          <p className="text-text-light text-sm">文章未找到</p>
          <button
            onClick={() => navigate('/charity')}
            className="mt-4 text-primary text-sm font-medium"
          >
            返回公益活动
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20 fade-in">
      {/* 顶部导航 */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-divider">
        <div className="max-w-[430px] mx-auto flex items-center justify-between px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center"
          >
            ←
          </button>
          <span className="text-sm font-semibold text-gray-800">活动详情</span>
          <span className="w-9"></span>
        </div>
      </div>

      {/* 头图 */}
      <div className="aspect-[16/10] relative overflow-hidden">
        <img
          src={article.cover}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <span className="inline-block bg-green-500 text-white text-[10px] px-2 py-0.5 rounded mb-2">
            {article.tag || activity?.tag}
          </span>
          <h1 className="text-white font-bold text-lg leading-snug drop-shadow-md">
            {article.title}
          </h1>
        </div>
      </div>

      {/* 元信息栏 */}
      <div className="max-w-[430px] mx-auto px-4 py-3 bg-white border-b border-divider flex items-center gap-4 text-[11px] text-text-light">
        <span>📅 {article.date}</span>
        <span>✍️ {article.author}</span>
        {article.location && (
          <span>📍 {article.location}</span>
        )}
      </div>

      {/* 正文内容 */}
      <div className="max-w-[430px] mx-auto px-4 py-5 space-y-6">
        {article.sections.map((section, idx) => (
          <div key={idx} className="space-y-3">
            <p className="text-[14px] leading-relaxed text-gray-700 tracking-wide indent-8">
              {section}
            </p>
            {/* 每段后插入对应图片（如果有） */}
            {article.images[idx] && (
              <div className="rounded-xl overflow-hidden shadow-sm">
                <img
                  src={article.images[idx]}
                  alt=""
                  className="w-full object-cover"
                  loading="lazy"
                />
              </div>
            )}
          </div>
        ))}

        {/* 剩余图片以画廊形式展示 */}
        {article.images.length > article.sections.length && (
          <div className="grid grid-cols-2 gap-2 pt-2">
            {article.images.slice(article.sections.length).map((img, idx) => (
              <div key={idx} className="rounded-lg overflow-hidden aspect-[4/3]">
                <img
                  src={img}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}

        {/* 底部分隔线 */}
        <div className="border-t border-divider pt-6 mt-8">
          <p className="text-center text-xs text-text-light leading-loose">
            — 本文完 —<br />
            <span className="text-[10px] opacity-60">美芽集 · 公益活动</span>
          </p>
        </div>

        {/* 返回按钮 */}
        <button
          onClick={() => navigate('/charity?tab=活动')}
          className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold text-sm active:scale-[0.98] transition-transform"
        >
          返回公益活动列表
        </button>
      </div>
    </div>
  )
}
