import { useNavigate } from 'react-router-dom'
import { useApp } from '../App'
import { orders } from '../data'

function AuthEntryCard({ onLogin, onRegister }) {
  return (
    <div
      className="mx-4 mt-5 border p-5"
      style={{ background: 'rgba(251,248,244,0.95)', borderColor: 'rgba(232,225,216,0.92)' }}
    >
      <p className="text-[10px] tracking-[0.24em] uppercase mb-3" style={{ color: 'var(--text-weak)' }}>
        Account
      </p>
      <h2 className="text-[22px] leading-[1.2] font-semibold mb-2" style={{ color: 'var(--text)' }}>
        登录 / 注册
      </h2>
      <p className="text-[13px] leading-6 mb-5" style={{ color: 'var(--text-muted)' }}>
        登录后可查看订单、收藏作品，并在后续接入购买与艺术家申请功能。
      </p>

      <div className="flex gap-2.5">
        <button
          onClick={onLogin}
          className="flex-1 py-3 text-[14px] font-medium"
          style={{ background: 'var(--text)', color: 'white' }}
        >
          登录
        </button>
        <button
          onClick={onRegister}
          className="flex-1 py-3 text-[14px] font-medium border"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
        >
          注册
        </button>
      </div>
    </div>
  )
}

function LoggedInCard({ currentUser, onLogout }) {
  const roleLabel = currentUser?.role === 'artist'
    ? currentUser?.artistStatus === 'approved'
      ? '已认证艺术家'
      : '艺术家申请中'
    : '普通会员'

  return (
    <div
      className="mx-4 mt-5 border p-5"
      style={{ background: 'rgba(251,248,244,0.95)', borderColor: 'rgba(232,225,216,0.92)' }}
    >
      <p className="text-[10px] tracking-[0.24em] uppercase mb-3" style={{ color: 'var(--text-weak)' }}>
        Signed In
      </p>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[20px] font-semibold mb-1" style={{ color: 'var(--text)' }}>
            {currentUser?.name || '美芽集用户'}
          </h2>
          <p className="text-[12px] mb-1" style={{ color: 'var(--text-muted)' }}>
            用户 ID：{currentUser?.id || '未分配'}
          </p>
          <p className="text-[12px]" style={{ color: 'var(--text-muted)' }}>
            当前身份：{roleLabel}
          </p>
        </div>

        <button
          onClick={onLogout}
          className="px-3 py-2 text-[12px] border"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
        >
          退出登录
        </button>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const { favs, currentUser, setCurrentUser, showToast } = useApp()

  const menuItems = [
    { icon: '◌', label: '我的订单', badge: orders.length, path: '/orders' },
    { icon: '♡', label: '我的收藏', badge: favs.length, path: '/discover' },
    { icon: '⌂', label: '收货地址', badge: null, path: '/profile' },
    { icon: '¥', label: '支付管理', badge: null, path: '/profile' },
    { icon: '⋯', label: '设置', badge: null, path: '/profile' },
    { icon: '✦', label: '联系客服', badge: null, path: '/profile' },
  ]

  const handleLoginEntry = () => {
    showToast('登录入口已添加，下一步可继续接入登录表单')
  }

  const handleRegisterEntry = () => {
    showToast('注册入口已添加，下一步可继续接入注册表单')
  }

  const handleLogout = () => {
    setCurrentUser(null)
    showToast('已退出当前账号')
  }

  return (
    <div className="pb-20 fade-in">
      <div className="pt-12 pb-6 px-6 text-center">
        <div
          className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden"
          style={{ background: 'var(--surface-2)', border: '2px solid var(--border)' }}
        >
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ color: 'var(--text-weak)', fontSize: '28px' }}
          >
            ○
          </div>
        </div>
        <p className="text-lg font-bold mb-1" style={{ color: 'var(--text)' }}>
          {currentUser ? (currentUser.name || '美芽集用户') : '欢迎来到美芽集'}
        </p>
        <p className="text-xs" style={{ color: 'var(--text-weak)' }}>
          {currentUser ? `ID: ${currentUser.id || '未分配'}` : '登录后可同步收藏与订单信息'}
        </p>
      </div>

      {currentUser ? (
        <LoggedInCard currentUser={currentUser} onLogout={handleLogout} />
      ) : (
        <AuthEntryCard onLogin={handleLoginEntry} onRegister={handleRegisterEntry} />
      )}

      <div
        className="flex rounded-2xl mx-4 mt-5 p-5 relative z-10 gap-0"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <div className="flex-1 text-center">
          <p className="text-lg font-bold" style={{ color: 'var(--text)' }}>{favs.length}</p>
          <p className="text-[10px]" style={{ color: 'var(--text-weak)' }}>收藏</p>
        </div>
        <div
          className="flex-1 text-center"
          style={{ borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)' }}
        >
          <p className="text-lg font-bold" style={{ color: 'var(--text)' }}>{orders.length}</p>
          <p className="text-[10px]" style={{ color: 'var(--text-weak)' }}>订单</p>
        </div>
        <div className="flex-1 text-center">
          <p className="text-lg font-bold" style={{ color: 'var(--text)' }}>0</p>
          <p className="text-[10px]" style={{ color: 'var(--text-weak)' }}>优惠券</p>
        </div>
      </div>

      <div className="px-4 mt-6">
        {menuItems.map((item, index) => (
          <div
            key={index}
            onClick={() => item.path && navigate(item.path)}
            className="rounded-xl overflow-hidden mb-2.5 cursor-pointer active:bg-opacity-70 transition-colors"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
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

      <div className="px-4 mt-6">
        <div className="rounded-2xl p-5" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: 'var(--text)' }}>关注我们</p>
          <div className="flex justify-center gap-8">
            {[
              { name: '微信', icon: '♡' },
              { name: '微博', icon: '◌' },
              { name: '小红书', icon: '□' },
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
