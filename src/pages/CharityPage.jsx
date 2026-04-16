import { useNavigate } from 'react-router-dom'
import { useApp } from '../App'
import { charityActivities } from '../data'

export default function CharityPage() {
  const navigate = useNavigate()

  return (
    <div className="pb-20 fade-in">
      {/* 柔和品牌头 */}
      <div className="px-4 pt-10 pb-8">
        <p className="text-[10px] tracking-[0.35em] uppercase mb-2.5" style={{ color: 'var(--text-weak)' }}>
          PUBLIC WELFARE
        </p>
        <h1 className="text-[26px] font-bold mb-2" style={{ color: 'var(--text)', letterSpacing: '-0.01em' }}>
          公益活动
        </h1>
        <p className="text-sm leading-relaxed whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
          以艺术之名相聚，为乡村孩童的审美启蒙播种。
        </p>
      </div>

      <div className="px-4 pb-6">
        {charityActivities.map(activity => (
          <div key={activity.id} className="mb-5 overflow-hidden rounded-2xl"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            <div
              onClick={() => navigate(`/charity/article/${activity.id}`)}
              className="aspect-[16/9] relative cursor-pointer active:opacity-90 transition-opacity"
              style={{ background: 'var(--surface-2)' }}
            >
              <img src={activity.cover} alt={activity.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute top-3 left-3 flex gap-2">
                <span className="tag-sage">{activity.tag}</span>
                <span className="tag-mist">{activity.location}</span>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-white font-semibold text-sm leading-relaxed drop-shadow-sm">
                  {activity.title}
                </p>
              </div>
            </div>
            <div className="px-4 pt-3 pb-4">
              <p className="text-xs leading-relaxed mb-2.5" style={{ color: 'var(--text-muted)' }}>
                {activity.desc}
              </p>
              <div className="flex items-center justify-between text-[11px]" style={{ color: 'var(--text-weak)' }}>
                <span>{activity.participants} 人参与</span>
                <button
                  onClick={() => navigate(`/charity/article/${activity.id}`)}
                  className="btn-outline" style={{ padding: '6px 14px', fontSize: '11px' }}
                >
                  查看详情 →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
