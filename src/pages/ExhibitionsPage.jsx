import { useNavigate } from 'react-router-dom'
import { useApp } from '../App'
import { exhibitions, events } from '../data'

export default function ExhibitionsPage() {
  const navigate = useNavigate()
  const { showToast } = useApp()

  const allItems = [
    ...exhibitions.map(item => ({ ...item, type: 'exhibition' })),
    ...events.map(item => ({ ...item, type: 'event' }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <div className="pb-16 fade-in">
      <div className="bg-background/96 backdrop-blur-sm border-b border-divider sticky top-0 z-30">
        <div className="max-w-[430px] mx-auto h-12 flex items-center px-4">
          <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-lg">
            ←
          </button>
          <span className="flex-1 text-center font-semibold text-sm">活动中心</span>
          <span className="w-9"></span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <p className="text-xs text-text-light">当前展示美芽集的公开展览与活动，可直接查看并报名参与。</p>

        {allItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-divider overflow-hidden"
          >
            <div className="aspect-[16/9] relative bg-gradient-to-br from-[#D4C5B0] to-divider">
              <img
                src={item.cover}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute top-2 left-2 flex gap-2">
                <span className={`${item.type === 'exhibition' ? 'bg-primary' : 'bg-orange-500'} text-white text-[10px] px-2 py-0.5 rounded`}>
                  {item.tag}
                </span>
              </div>
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <p className="text-sm font-bold leading-tight">{item.title}</p>
                <p className="text-[11px] text-white/80 mt-1">{item.date}</p>
              </div>
            </div>
            <div className="p-3">
              <p className="text-[11px] text-text-light leading-relaxed line-clamp-2 mb-3">
                {item.desc}
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-divider">
                <div className="flex items-center gap-3 text-[10px] text-text-light">
                  <span>👥 {item.participants || 0}人已报名</span>
                  <span className="text-primary font-bold">
                    {item.price === 0 ? '免费' : `¥${item.price}`}
                  </span>
                </div>
                <button
                  onClick={() => showToast('报名成功，请查收短信通知')}
                  className="bg-primary text-white px-4 py-2 rounded-lg text-xs font-semibold"
                >
                  立即报名
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
