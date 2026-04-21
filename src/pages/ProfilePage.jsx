import { useNavigate } from 'react-router-dom'
import { useApp } from '../App'
import { orders } from '../data'
import { clearAuthSession } from '../services/contentApi'

function ProfileHero() {
  return (
    <div className="mx-4 pt-6">
      <div className="relative overflow-hidden border" style={{ borderColor: 'rgba(232,225,216,0.92)', background: '#d8d0c7' }}>
        <div className="aspect-[16/7]">
          <img src="/hero-carousel/1710908245.jpg" alt="美芽集个人中心横幅" className="w-full h-full object-cover" />
        </div>
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(20,18,16,0.08) 0%, rgba(20,18,16,0.42) 100%)' }}
        />
        <div className="absolute left-4 right-4 bottom-4">
          <p className="text-[10px] tracking-[0.24em] uppercase mb-1" style={{ color: 'rgba(255,255,255,0.76)' }}>
            MY MEIYAJI
          </p>
          <p className="text-[18px] font-semibold" style={{ color: 'white' }}>
            收藏、订单与艺术家入驻
          </p>
        </div>
      </div>
    </div>
  )
}

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
        登录后可查看订单、收藏作品，并继续申请成为艺术家。
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
      : currentUser?.artistStatus === 'rejected'
        ? '艺术家申请未通过'
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

function ArtistEntryCard({ currentUser, onApply, onDashboard, compact = false }) {
  const isApprovedArtist = currentUser?.role === 'artist' && currentUser?.artistStatus === 'approved'
  const isApplyingArtist = currentUser?.role === 'artist' && currentUser?.artistStatus === 'pending'
  const isRejectedArtist = currentUser?.role === 'artist' && currentUser?.artistStatus === 'rejected'

  const title = isApprovedArtist
    ? '艺术家后台'
    : '艺术家入驻'

  const description = isApprovedArtist
    ? '你已通过认证，可以进入艺术家后台管理作品。'
    : isApplyingArtist
      ? '你的入驻申请正在审核中，申请资料仍可继续完善。'
      : isRejectedArtist
        ? '你的申请暂未通过，可以重新提交更完整的资料。'
        : '填写真实姓名、个人介绍与公益创作理念，即可提交入驻申请。'

  const buttonLabel = isApprovedArtist
    ? '进入艺术家后台'
    : currentUser
      ? '填写入驻申请'
      : '登录后申请'

  const buttonHandler = isApprovedArtist ? onDashboard : onApply
  const compactLabel = isApprovedArtist ? '艺术家后台' : '艺术家入驻申请'
  const compactStatus = isApprovedArtist ? '已开通' : currentUser ? '可申请' : '需登录'

  if (compact) {
    return (
      <button
        onClick={buttonHandler}
        className="w-full rounded-xl overflow-hidden cursor-pointer active:bg-opacity-70 transition-colors"
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
        }}
      >
        <div className="flex items-center gap-3.5 px-4 py-3.5">
          <span className="text-base" style={{ color: 'var(--primary)' }}>•</span>
          <span className="flex-1 text-sm text-left" style={{ color: 'var(--text)' }}>{compactLabel}</span>
          <span className="text-[11px]" style={{ color: 'var(--text-weak)' }}>{compactStatus}</span>
          <span className="text-sm" style={{ color: 'var(--text-weak)' }}>›</span>
        </div>
      </button>
    )
  }

  return (
    <div
      className="mx-4 mt-4 border p-5"
      style={{ background: 'rgba(255,255,255,0.88)', borderColor: 'rgba(232,225,216,0.92)' }}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="text-[10px] tracking-[0.24em] uppercase mb-2" style={{ color: 'var(--text-weak)' }}>
            Artist Entry
          </p>
          <h3 className="text-[18px] font-semibold mb-2" style={{ color: 'var(--text)' }}>
            {title}
          </h3>
          <p className="text-[13px] leading-6" style={{ color: 'var(--text-muted)' }}>
            {description}
          </p>
        </div>

        <span
          className="shrink-0 text-[11px] px-2.5 py-1 border"
          style={{ color: 'var(--text)', borderColor: 'var(--border)', background: 'var(--surface)' }}
        >
          {isApprovedArtist ? '已开通' : currentUser ? '可申请' : '需登录'}
        </span>
      </div>

      <button
        onClick={buttonHandler}
        className="w-full py-3 text-[14px] font-medium border"
        style={{
          background: isApprovedArtist ? 'var(--text)' : 'var(--surface)',
          borderColor: 'var(--border)',
          color: isApprovedArtist ? 'white' : 'var(--text)',
        }}
      >
        {buttonLabel}
      </button>
    </div>
  )
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const { favs, currentUser, setCurrentUser, showToast } = useApp()

  const menuItems = [
    { icon: '•', label: '我的订单', badge: orders.length, path: '/orders' },
    { icon: '•', label: '我的收藏', badge: favs.length, path: '/discover' },
    { icon: '•', label: '收货地址', badge: null, path: '/profile' },
    { icon: '•', label: '支付管理', badge: null, path: '/profile' },
    { icon: '•', label: '设置', badge: null, path: '/profile' },
    { icon: '•', label: '联系客服', badge: null, path: '/profile' },
  ]

  const handleLogout = () => {
    clearAuthSession()
    setCurrentUser(null)
    showToast('已退出当前账号')
  }

  return (
    <div className="pb-20 fade-in">
      <ProfileHero />

      <div className="pt-8 pb-6 px-6 text-center">
        <div
          className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden"
          style={{ background: 'var(--surface-2)', border: '2px solid var(--border)' }}
        >
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ color: 'var(--text-weak)', fontSize: '28px' }}
          >
            •
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
        <AuthEntryCard onLogin={() => navigate('/login')} onRegister={() => navigate('/register')} />
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
        <ArtistEntryCard
          compact
          currentUser={currentUser}
          onApply={() => (currentUser ? navigate('/artist/apply') : navigate('/login'))}
          onDashboard={() => navigate('/artist/dashboard')}
        />
      </div>
    </div>
  )
}
