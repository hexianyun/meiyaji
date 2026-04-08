import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../App'
import { charity, stories } from '../data'

export default function CharityPage() {
  const navigate = useNavigate()
  const { showToast } = useApp()
  const [activeTab, setActiveTab] = useState('项目')

  const totalRaised = charity.reduce((sum, c) => sum + c.raised, 0)
  const totalBeneficiaries = charity.reduce((sum, c) => sum + c.beneficiaries, 0)

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
        <p className="text-sm opacity-85 leading-relaxed mb-4">
          每一幅画，都是一份爱心。<br/>我们与艺术家一起，为山区孩子带去美的教育。
        </p>
        <div className="flex gap-3">
          <div className="flex-1 bg-white/15 rounded-xl p-3 text-center">
            <div className="text-xl font-bold">¥{totalRaised.toLocaleString()}</div>
            <div className="text-[11px] opacity-75">已筹善款</div>
          </div>
          <div className="flex-1 bg-white/15 rounded-xl p-3 text-center">
            <div className="text-xl font-bold">{totalBeneficiaries}</div>
            <div className="text-[11px] opacity-75">受助儿童</div>
          </div>
          <div className="flex-1 bg-white/15 rounded-xl p-3 text-center">
            <div className="text-xl font-bold">{charity.length}</div>
            <div className="text-[11px] opacity-75">公益项目</div>
          </div>
        </div>
      </div>

      <div className="flex border-b border-divider px-4 bg-background sticky top-0 z-20">
        <button
          onClick={() => setActiveTab('项目')}
          className={`flex-1 py-3 text-center text-sm font-medium border-b-2 transition-colors ${
            activeTab === '项目'
              ? 'text-green-600 border-green-600'
              : 'text-text-light border-transparent'
          }`}
        >
          公益项目
        </button>
        <button
          onClick={() => setActiveTab('活动')}
          className={`flex-1 py-3 text-center text-sm font-medium border-b-2 transition-colors ${
            activeTab === '活动'
              ? 'text-green-600 border-green-600'
              : 'text-text-light border-transparent'
          }`}
        >
          公益活动
        </button>
        <button
          onClick={() => setActiveTab('故事')}
          className={`flex-1 py-3 text-center text-sm font-medium border-b-2 transition-colors ${
            activeTab === '故事'
              ? 'text-green-600 border-green-600'
              : 'text-text-light border-transparent'
          }`}
        >
          公益故事
        </button>
      </div>

      {activeTab === '项目' && (
        <div className="p-4 pb-20">
          {charity.map(project => {
            return (
              <div key={project.id} className="bg-white rounded-xl border border-divider overflow-hidden mb-4">
                <div className="aspect-video relative bg-gradient-to-br from-[#D4C5B0] to-divider">
                  <img
                    src={project.cover}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded">
                    {project.tag}
                  </span>
                </div>
                <div className="p-3">
                  <p className="text-sm font-bold mb-1">{project.title}</p>
                  <p className="text-[11px] text-text-light leading-relaxed mb-2">{project.desc}</p>
                  <div className="text-[11px] text-text-light mb-3">
                    受益儿童 <span className="font-bold text-green-600">{project.beneficiaries}</span> 名
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => showToast('感谢您的爱心！')}
                      className="flex-1 bg-green-500 text-white py-2.5 rounded-xl font-semibold text-sm"
                    >
                      💚 我要资助
                    </button>
                    <button
                      onClick={() => showToast('报名成功，请查收短信通知')}
                      className="flex-1 bg-green-50 text-green-600 border border-green-200 py-2.5 rounded-xl font-semibold text-sm"
                    >
                      📝 报名参与
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {activeTab === '活动' && (
        <div className="p-4 pb-20">
          <p className="text-xs text-text-light mb-3">点击卡片查看活动详情，可直接报名参与</p>
          {charity.map(project => (
            <div key={project.id} className="bg-white rounded-xl border border-divider overflow-hidden mb-4">
              <div className="aspect-[16/9] relative bg-gradient-to-br from-[#D4C5B0] to-divider">
                <img
                  src={project.cover}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <span className="bg-green-500 text-white text-[10px] px-2 py-0.5 rounded">
                    {project.tag}
                  </span>
                  <p className="text-sm font-bold mt-2">{project.title}</p>
                </div>
              </div>
              <div className="p-3">
                <p className="text-[11px] text-text-light leading-relaxed mb-3">{project.desc}</p>
                <div className="flex items-center justify-between text-[10px] text-text-light mb-3">
                  <span>👥 已参与 {project.beneficiaries} 人</span>
                  <span>📍 画里画外艺术中心</span>
                </div>
                <button
                  onClick={() => showToast('报名成功，请查收短信通知')}
                  className="w-full bg-green-500 text-white py-2.5 rounded-xl font-semibold text-sm"
                >
                  📝 立即报名
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === '故事' && (
        <div className="p-4 pb-20">
          {stories.map(story => (
            <div key={story.id} className="bg-white rounded-xl border border-divider p-3 flex gap-3 mb-3">
              <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={story.cover}
                  alt={story.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <span className="bg-green-100 text-green-700 text-[9px] px-2 py-0.5 rounded w-fit">
                  {story.type}
                </span>
                <p className="text-xs font-semibold leading-relaxed">{story.title}</p>
                <p className="text-[10px] text-text-light">{story.author} · {story.read}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
