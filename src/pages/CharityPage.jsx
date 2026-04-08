import { useNavigate } from 'react-router-dom'
import { useApp } from '../App'
import { charity, stories } from '../data'

export default function CharityPage() {
  const navigate = useNavigate()
  const { showToast } = useApp()

  const totalRaised = charity.reduce((sum, c) => sum + c.raised, 0)
  const totalBeneficiaries = charity.reduce((sum, c) => sum + c.beneficiaries, 0)

  return (
    <div className="pb-16 fade-in">
      <div className="bg-gradient-to-br from-[#4A7C59] to-[#2D5A3D] text-white px-4 py-5 pb-6">
        <button 
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full bg-black/15 flex items-center justify-center mb-3"
        >
          ←
        </button>
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

      <div className="p-4 pb-20">
        <div className="flex items-center justify-between mb-3">
          <span className="font-bold text-base">进行中的项目</span>
        </div>
        {charity.map(project => {
          const pct = Math.round(project.raised / project.goal * 100)
          return (
            <div key={project.id} className="bg-white rounded-xl border border-divider overflow-hidden mb-4">
              <div className="aspect-video relative bg-gradient-to-br from-[#D4C5B0] to-divider">
                <img 
                  src={project.cover} 
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 bg-primary text-white text-[10px] px-2 py-0.5 rounded">
                  {project.tag}
                </span>
              </div>
              <div className="p-3">
                <p className="text-sm font-bold mb-1">{project.title}</p>
                <p className="text-[11px] text-text-light leading-relaxed mb-2">{project.desc}</p>
                <div className="text-[11px] text-text-light mb-2">
                  受益儿童 <span className="font-bold text-primary">{project.beneficiaries}</span> 名
                </div>
                <div className="h-1.5 bg-divider rounded-full overflow-hidden mb-1">
                  <div 
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[10px] text-text-light">
                  <span>已筹 ¥{project.raised.toLocaleString()}</span>
                  <span>目标 ¥{project.goal.toLocaleString()}</span>
                  <span>{pct}%</span>
                </div>
                <button 
                  onClick={() => showToast('感谢您的爱心！')}
                  className="w-full bg-primary text-white py-3 rounded-xl font-semibold text-sm mt-3"
                >
                  我要资助
                </button>
              </div>
            </div>
          )
        })}

        <div className="flex items-center justify-between mb-3 mt-6">
          <span className="font-bold text-base">公益故事</span>
        </div>
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
              <span className="bg-secondary text-white text-[9px] px-2 py-0.5 rounded w-fit">
                {story.type}
              </span>
              <p className="text-xs font-semibold leading-relaxed">{story.title}</p>
              <p className="text-[10px] text-text-light">{story.author} · {story.read}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
