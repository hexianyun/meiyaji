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
    <div className="pb-20 fade-in">
      <div className="sticky top-0 z-30 px-4 pt-3 pb-3"
        style={{ background: 'rgba(246,241,234,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)' }}
      >
        <div className="max-w-[430px] mx-auto flex items-center h-10">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >←</button>
          <span className="flex-1 text-center font-semibold text-sm" style={{ color: 'var(--text)' }}>活动中心</span>
          <span className="w-9"></span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          当前展示美芽集的公开展览与活动，可直接查看并报名参与。
        </p>

        {allItems.map((item) => (
          <div key={item.id} className="overflow-hidden rounded-2xl"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            <div className="aspect-[16/9] relative" style={{ background: 'var(--surface-2)' }}>
              <img src={item.cover} alt={item.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute top-3 left-3">
                <span className={item.type === 'exhibition' ? 'tag-sage' : 'tag-accent'}>
                  {item.tag}
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-white font-semibold text-sm drop-shadow-sm">{item.title}</p>
                <p className="text-[11px] text-white/75 mt-1">{item.date}</p>
              </div>
            </div>
            <div className="px-4 pt-3 pb-4">
              <p className="text-xs leading-relaxed line-clamp-2 mb-3" style={{ color: 'var(--text-muted)' }}>
                {item.desc}
              </p>
              <div className="flex items-center justify-between pt-3"
                style={{ borderTop: '1px solid var(--border)' }}
              >
                <div className="flex items-center gap-3 text-[11px]" style={{ color: 'var(--text-weak)' }}>
                  <span>{item.participants || 0} 人已报名</span>
                  <span className="font-semibold" style={{ color: 'var(--primary)' }}>
                    {item.price === 0 ? '免费' : `¥${item.price}`}
                  </span>
                </div>
                <button
                  onClick={() => showToast('报名成功，请查收短信通知')}
                  className="btn-outline"
                  style={{ padding: '7px 16px', fontSize: '12px' }}
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
