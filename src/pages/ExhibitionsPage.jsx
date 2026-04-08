import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../App'
import { exhibitions, events } from '../data'

export default function ExhibitionsPage() {
  const navigate = useNavigate()
  const { showToast } = useApp()
  const [showPartner, setShowPartner] = useState(false)

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
        <div
          onClick={() => setShowPartner(true)}
          className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white cursor-pointer shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
              🤝
            </div>
            <div className="flex-1">
              <p className="font-bold text-base">合伙人招募</p>
              <p className="text-[11px] text-white/80">加入美育合伙人社群，共护乡村儿童艺术梦想</p>
            </div>
            <div className="bg-white/25 px-3 py-1.5 rounded-full">
              <span className="text-xs font-semibold">查看详情</span>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <div className="flex-1 bg-white/15 rounded-lg p-2 text-center">
              <p className="text-sm font-bold">¥3000</p>
              <p className="text-[10px] text-white/70">伴手礼</p>
            </div>
            <div className="flex-1 bg-white/15 rounded-lg p-2 text-center">
              <p className="text-sm font-bold">¥5000</p>
              <p className="text-[10px] text-white/70">速写作品</p>
            </div>
            <div className="flex-1 bg-white/15 rounded-lg p-2 text-center">
              <p className="text-sm font-bold">¥10000</p>
              <p className="text-[10px] text-white/70">原作+证书</p>
            </div>
            <div className="flex-1 bg-white/15 rounded-lg p-2 text-center">
              <p className="text-sm font-bold">¥100000</p>
              <p className="text-[10px] text-white/70">项目冠名</p>
            </div>
          </div>
        </div>

        <p className="text-xs text-text-light">点击卡片查看详情，可直接报名参与</p>

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

      {showPartner && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div
            className="w-full max-w-[430px] mx-auto bg-white rounded-t-3xl p-5 pb-8 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-primary">🤝 合伙人招募</h2>
              <button onClick={() => setShowPartner(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                ✕
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="bg-gradient-to-br from-green-50 to-primary/5 rounded-xl p-4 border border-green-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full">会员名称</span>
                </div>
                <p className="font-bold text-base">新萌芽·美育合伙人</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-primary/5 rounded-xl p-4 border border-green-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full">社群名称</span>
                </div>
                <p className="font-bold text-base">新萌芽美育合伙人社群</p>
              </div>

              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-4">
                <p className="text-[11px] text-text-light mb-2">完整官方文案（直接可用，微信小店首页版）</p>
                <p className="font-bold text-base mb-2">新萌芽美育合伙人计划</p>
                <p className="text-xs text-text leading-relaxed">
                  凡在本店任意消费一次，即可自动成为<br/>
                  <span className="text-primary font-semibold">新萌芽·美育合伙人</span><br/>
                  加入专属合伙人社群，同步公益全程，共护乡村儿童艺术梦想。
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-4 border border-orange-100">
                <p className="font-bold mb-3 flex items-center gap-2">
                  <span>🎁</span> 爱心累计礼遇（消费累计，不清零）
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <span className="bg-orange-500 text-white text-[9px] px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5">¥3000</span>
                    <p className="text-xs">获赠新萌芽精美伴手礼一份</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="bg-orange-500 text-white text-[9px] px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5">¥5000</span>
                    <p className="text-xs">获赠艺术家原创速写作品一幅</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="bg-orange-500 text-white text-[9px] px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5">¥10000</span>
                    <p className="text-xs">获赠艺术家小幅原作一幅<span className="text-primary ml-1">◦ 专属公益收藏证书</span></p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="bg-orange-500 text-white text-[9px] px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5">¥100000</span>
                    <p className="text-xs">尊享乡村美育公益项目冠名权<span className="text-primary ml-1">◦</span><br/>在项目成果册、活动现场及官方宣传中专属署名鸣谢<br/>并受邀参与线下美育公益活动与艺术交流</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-4 border border-green-200">
                <p className="font-bold mb-3 flex items-center gap-2">
                  <span>💚</span> 公益承诺
                </p>
                <p className="text-xs text-text leading-relaxed mb-3">
                  本店义卖所得严格执行：
                </p>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="bg-white rounded-lg p-2 text-center border border-green-100">
                    <p className="text-primary font-bold text-lg">40%</p>
                    <p className="text-[10px] text-text-light">艺术创作</p>
                  </div>
                  <div className="bg-white rounded-lg p-2 text-center border border-green-100">
                    <p className="text-primary font-bold text-lg">10%</p>
                    <p className="text-[10px] text-text-light">项目运营</p>
                  </div>
                  <div className="bg-white rounded-lg p-2 text-center border border-green-100">
                    <p className="text-primary font-bold text-lg">50%</p>
                    <p className="text-[10px] text-text-light">乡村美育公益</p>
                  </div>
                </div>
                <p className="text-[11px] text-text-light leading-relaxed">
                  全程公开透明，定期公示去向，<br/>让每一份善意，都真正抵达孩子身边。
                </p>
              </div>

              <button
                onClick={() => {
                  showToast('感谢您的参与！')
                  setShowPartner(false)
                }}
                className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-xl font-semibold text-sm"
              >
                我要成为合伙人
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
