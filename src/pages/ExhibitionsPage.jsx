import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../App'
import { exhibitions, events } from '../data'

export default function ExhibitionsPage() {
  const navigate = useNavigate()
  const { showToast } = useApp()
  const [activeTab, setActiveTab] = useState('展览')

  const tabs = ['展览', '活动']

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

      <div className="flex border-b border-divider px-4 bg-background sticky top-12 z-20">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-center text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab 
                ? 'text-primary border-primary' 
                : 'text-text-light border-transparent'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === '展览' && (
        <div className="p-4 pb-20">
          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-4 mb-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🎨</span>
              <div>
                <p className="font-bold text-sm">正在展出 & 即将开展</p>
                <p className="text-[11px] text-text-light">{exhibitions.length} 场精彩展览</p>
              </div>
            </div>
          </div>

          {exhibitions.map(ex => (
            <ExhibitionCard key={ex.id} exhibition={ex} />
          ))}
        </div>
      )}

      {activeTab === '活动' && (
        <div className="p-4 pb-20">
          <div className="bg-gradient-to-br from-success/10 to-primary/10 rounded-2xl p-4 mb-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🌟</span>
              <div>
                <p className="font-bold text-sm">公益 & 艺术活动</p>
                <p className="text-[11px] text-text-light">{events.length} 场精彩活动</p>
              </div>
            </div>
          </div>

          {events.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  )
}

function ExhibitionCard({ exhibition }) {
  const navigate = useNavigate()
  const { showToast } = useApp()

  const getStatusColor = (status) => {
    switch(status) {
      case '即将开始': return 'bg-blue-50 text-blue-600'
      case '正在展出': return 'bg-green-50 text-success'
      case '即将结束': return 'bg-orange-50 text-orange-600'
      default: return 'bg-gray-50 text-text-light'
    }
  }

  return (
    <div className="bg-white rounded-xl border border-divider overflow-hidden mb-4">
      <div className="aspect-video relative bg-gradient-to-br from-[#D4C5B0] to-divider">
        <img 
          src={exhibition.cover} 
          alt={exhibition.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded">
            {exhibition.type}
          </span>
          <span className={`text-[10px] px-2 py-0.5 rounded ${getStatusColor(exhibition.status)}`}>
            {exhibition.tag}
          </span>
        </div>
      </div>
      <div className="p-4">
        <p className="font-bold text-sm mb-2">{exhibition.title}</p>
        
        <div className="space-y-1.5 text-[11px] text-text-light mb-3">
          <div className="flex items-center gap-2">
            <span>📍</span>
            <span>{exhibition.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>📅</span>
            <span>{exhibition.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>👤</span>
            <span>{exhibition.artist}</span>
          </div>
        </div>

        <p className="text-xs text-text leading-relaxed mb-3 line-clamp-2">
          {exhibition.desc}
        </p>

        <div className="flex flex-wrap gap-2 mb-3">
          {exhibition.highlights.map((h, i) => (
            <span key={i} className="bg-background text-[10px] px-2 py-1 rounded-full text-text-light">
              {h}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-divider">
          <div className="flex items-center gap-1">
            <span className="text-lg font-bold text-primary">
              {exhibition.price === 0 ? '免费' : `¥${exhibition.price}`}
            </span>
            {exhibition.price > 0 && <span className="text-[10px] text-text-light">/人</span>}
          </div>
          <button 
            onClick={() => showToast('预约成功，请查收短信通知')}
            className="bg-primary text-white px-4 py-2 rounded-lg text-xs font-semibold"
          >
            立即预约
          </button>
        </div>
      </div>
    </div>
  )
}

function EventCard({ event }) {
  const { showToast } = useApp()

  const getStatusColor = (status) => {
    switch(status) {
      case '报名中': return 'bg-green-50 text-success'
      case '已满员': return 'bg-gray-50 text-text-light'
      case '已结束': return 'bg-red-50 text-danger'
      default: return 'bg-gray-50 text-text-light'
    }
  }

  return (
    <div className="bg-white rounded-xl border border-divider overflow-hidden mb-4">
      <div className="flex gap-3 p-3">
        <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-divider to-[#D4C5B0]">
          <img 
            src={event.cover} 
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 flex flex-col">
          <div className="flex items-start justify-between gap-2 mb-1">
            <span className="bg-secondary text-white text-[9px] px-2 py-0.5 rounded w-fit">
              {event.type}
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded ${getStatusColor(event.status)}`}>
              {event.tag}
            </span>
          </div>
          <p className="text-xs font-bold leading-snug mb-1 flex-1">{event.title}</p>
          <div className="space-y-0.5 text-[10px] text-text-light">
            <div className="flex items-center gap-1">
              <span>📅</span>
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>📍</span>
              <span className="truncate">{event.location}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="px-3 pb-3">
        <p className="text-[11px] text-text-light leading-relaxed line-clamp-2 mb-3">
          {event.desc}
        </p>
        <div className="flex items-center justify-between pt-3 border-t border-divider">
          <div className="flex items-center gap-3 text-[10px] text-text-light">
            <span>👥 {event.participants}人已报名</span>
            <span className="text-primary font-bold">
              {event.price === 0 ? '免费' : `¥${event.price}`}
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
  )
}
