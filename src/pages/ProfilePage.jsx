import { useNavigate } from 'react-router-dom'
import { useApp } from '../App'
import { orders } from '../data'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { favs } = useApp()

  const menuItems = [
    { icon: '📦', label: '我的订单', badge: orders.length, path: '/orders' },
    { icon: '❤️', label: '我的收藏', badge: favs.length, path: '/discover' },
    { icon: '📍', label: '收货地址', badge: null, path: '/profile' },
    { icon: '💳', label: '支付管理', badge: null, path: '/profile' },
    { icon: '⚙️', label: '设置', badge: null, path: '/profile' },
    { icon: '📞', label: '联系客服', badge: null, path: '/profile' }
  ]

  return (
    <div className="pb-16 fade-in">
      <div className="bg-gradient-to-b from-primary to-background pt-12 pb-6 px-4 text-center">
        <div className="w-18 h-18 rounded-full border-3 border-white mx-auto mb-3 overflow-hidden bg-divider flex items-center justify-center text-3xl">
          👤
        </div>
        <p className="text-lg font-bold mb-1">艺术爱好者</p>
        <p className="text-xs text-text-light">ID: 88888888</p>
      </div>

      <div className="flex bg-white rounded-xl mx-4 -mt-4 p-4 border border-divider relative z-10">
        <div className="flex-1 text-center">
          <p className="text-lg font-bold">{favs.length}</p>
          <p className="text-[10px] text-text-light">收藏</p>
        </div>
        <div className="flex-1 text-center">
          <p className="text-lg font-bold">{orders.length}</p>
          <p className="text-[10px] text-text-light">订单</p>
        </div>
        <div className="flex-1 text-center">
          <p className="text-lg font-bold">0</p>
          <p className="text-[10px] text-text-light">优惠券</p>
        </div>
      </div>

      <div className="px-4 mt-4">
        {menuItems.map((item, index) => (
          <div 
            key={index}
            onClick={() => item.path && navigate(item.path)}
            className="bg-white rounded-xl border border-divider overflow-hidden mb-3"
          >
            <div className="flex items-center gap-3 p-4 cursor-pointer">
              <span className="text-lg">{item.icon}</span>
              <span className="flex-1 text-sm">{item.label}</span>
              {item.badge !== null && item.badge > 0 && (
                <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
              <span className="text-text-light text-sm">→</span>
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 mt-4">
        <div className="bg-white rounded-xl border border-divider p-4">
          <p className="text-sm font-semibold mb-3">关注我们</p>
          <div className="flex justify-center gap-6">
            {[
              { name: '微信', icon: '💚' },
              { name: '微博', icon: '🌐' },
              { name: '小红书', icon: '📕' }
            ].map((platform, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-2xl mx-auto mb-1">
                  {platform.icon}
                </div>
                <p className="text-[10px] text-text-light">{platform.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
