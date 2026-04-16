import { useNavigate } from 'react-router-dom'
import { useApp } from '../App'
import { charityActivities } from '../data'

export default function CharityPage() {
  const navigate = useNavigate()

  return (
    <div className="pb-16 fade-in">
      <div className="bg-gradient-to-br from-green-600 to-green-800 text-white px-4 py-5 pb-6">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full bg-black/15 flex items-center justify-center"
          >
            ←
          </button>
          <span className="text-sm font-semibold">公益活动</span>
          <span className="w-9"></span>
        </div>
        <p className="text-[10px] opacity-75 mb-2 tracking-wider">PUBLIC WELFARE</p>
        <p className="text-2xl font-bold mb-2">用艺术点亮山区</p>
        <p className="text-sm opacity-85 leading-relaxed">
          每一幅画，都是一份爱心。<br/>我们与艺术家一起，为山区孩子带去美的教育。
        </p>
      </div>

      <div className="p-4 pb-20">
        {charityActivities.map(activity => (
          <div key={activity.id} className="bg-white rounded-xl border border-divider overflow-hidden mb-4">
            <div
              onClick={() => navigate(`/charity/article/${activity.id}`)}
              className="aspect-[16/9] relative bg-gradient-to-br from-[#D4C5B0] to-divider cursor-pointer active:opacity-90 transition-opacity"
            >
              <img
                src={activity.cover}
                alt={activity.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute top-3 left-3 flex gap-2">
                <span className="bg-green-500 text-white text-[10px] px-2 py-0.5 rounded">
                  {activity.tag}
                </span>
                <span className="bg-white/20 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded">
                  {activity.location}
                </span>
              </div>
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <p className="text-sm font-bold leading-relaxed">{activity.title}</p>
                <p className="text-[11px] text-white/85 mt-1">{activity.date}</p>
              </div>
            </div>
            <div className="p-3">
              <p className="text-[11px] text-text-light leading-relaxed mb-3">{activity.desc}</p>
              <div className="flex items-center justify-between text-[10px] text-text-light">
                <span>👥 约 {activity.participants} 人参与</span>
                <span>📍 {activity.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
