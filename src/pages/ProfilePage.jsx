import { useNavigate } from 'react-router-dom'
import { useApp } from '../App'
import { orders } from '../data'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { favs } = useApp()

  const menuItems = [
    { icon: '◻', label: '我的订单', badge: orders.length, path: '/orders' },
    { icon: '♡', label: '我的收藏', badge: favs.length, path: '/discover' },
    { icon: '◎', label: '收货地址', badge: null, path: '/profile' },
    { icon: '◇', label: '支付管理', badge: null, path: '/profile' },
    { icon: '○', label: '设置', badge: null, path: '/profile' },
    { icon: '✉', label: '联系客服', badge: null, path: '/profile' }
  ]

  return (
    <div className="pb-20 fade-in">
      {/* 头部 */}
      <div className="pt-12 pb-8 px-6 text-center">
        <div className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden"
          style={{ background: 'var(--surface-2)', border: '2px solid var(--border)' }}
        >
          <div className="w-full h-full flex items-center justify-center" style={{ color: 'var(--text-weak)', fontSize: '28px' }}>
            ○
          </div>
        </div>
        <p className="text-lg font-bold mb-1" style={{ color: 'var(--text)' }}>艺术爱好者</p>
        <p className="text-xs" style={{ color: 'var(--text-weak)' }}>ID: 88888888</p>
      </div>

      {/* 数据卡片 */}
      <div className="flex rounded-2xl mx-4 -mt-3 p-5 relative z-10 gap-0"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <div className="flex-1 text-center">
          <p className="text-lg font-bold" style={{ color: 'var(--text)' }}>{favs.length}</p>
          <p className="text-[10px]" style={{ color: 'var(--text-weak)' }}>收藏</p>
        </div>
        <div className="flex-1 text-center" style={{ borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)' }}>
          <p className="text-lg font-bold" style={{ color: 'var(--text)' }}>{orders.length}</p>
          <p className="text-[10px]" style={{ color: 'var(--text-weak)' }}>订单</p>
        </div>
        <div className="flex-1 text-center">
          <p className="text-lg font-bold" style={{ color: 'var(--text)' }}>0</p>
          <p className="text-[10px]" style={{ color: 'var(--text-weak)' }}>优惠券</p>
        </div>
      </div>

      {/* 菜单列表 */}
      <div className="px-4 mt-6">
        {menuItems.map((item, index) => (
          <div
            key={index}
            onClick={() => item.path && navigate(item.path)}
            className="rounded-xl overflow-hidden mb-2.5 cursor-pointer active:bg-opacity-70 transition-colors"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)'
            }}
          >
            <div className="flex items-center gap-3.5 px-4 py-3.5">
              <span className="text-base" style={{ color: 'var(--primary)' }}>{item.icon}</span>
              <span className="flex-1 text-sm" style={{ color: 'var(--text)' }}>{item.label}</span>
              {item.badge !== null && item.badge > 0 && (
                <span
                  className="text-white text-[10px] px-2 py-0.5 rounded-full font-medium"
                  style={{ background: 'var(--accent)' }}
                >
                  {item.badge}
                </span>
              )}
              <span className="text-sm" style={{ color: 'var(--text-weak)' }}>›</span>
            </div>
          </div>
        ))}
      </div>

      {/* 关注我们 */}
      <div className="px-4 mt-6">
        <div className="rounded-2xl p-5" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: 'var(--text)' }}>关注我们</p>
          <div className="flex justify-center gap-8">
            {[
              { name: '微信', icon: '♡' },
              { name: '微博', icon: '◇' },
              { name: '小红书', icon: '□' }
            ].map((platform, i) => (
              <div key={i} className="text-center">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-lg mx-auto mb-1.5"
                  style={{ background: 'var(--surface-2)' }}
                >
                  <span style={{ color: 'var(--primary)' }}>{platform.icon}</span>
                </div>
                <p className="text-[10px]" style={{ color: 'var(--text-weak)' }}>{platform.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
