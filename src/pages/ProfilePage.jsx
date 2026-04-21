import { useNavigate } from 'react-router-dom'
import { useApp } from '../App'
import { orders } from '../data'
import { clearAuthSession } from '../services/contentApi'

function getRoleMeta(currentUser) {
  if (!currentUser) {
    return {
      label: '访客',
      note: '登录后可同步收藏、订单与艺术家申请状态。',
    }
  }

  if (currentUser.role === 'artist' && currentUser.artistStatus === 'approved') {
    return {
      label: '已认证艺术家',
      note: '你已开通艺术家身份，可继续管理作品与申请资料。',
    }
  }

  if (currentUser.role === 'artist' && currentUser.artistStatus === 'rejected') {
    return {
      label: '艺术家申请未通过',
      note: '可以重新补充更完整的资料，再次提交申请。',
    }
  }

  if (currentUser.role === 'artist' && currentUser.artistStatus === 'pending') {
    return {
      label: '艺术家申请中',
      note: '你的申请正在审核中，资料仍可继续完善。',
    }
  }

  return {
    label: '普通会员',
    note: '可以收藏作品、查看订单，并申请艺术家入驻。',
  }
}

function HeroAvatar({ currentUser }) {
  const initial = currentUser?.name?.trim()?.charAt(0) || '芽'

  return (
    <div
      className="w-[70px] h-[70px] border shrink-0"
      style={{
        background: 'rgba(255,255,255,0.16)',
        borderColor: 'rgba(255,255,255,0.45)',
      }}
    >
      <div className="w-full h-full flex items-center justify-center" style={{ color: 'white', fontSize: '28px', fontWeight: 600 }}>
        {initial}
      </div>
    </div>
  )
}

function ProfileHero({ currentUser }) {
  const roleMeta = getRoleMeta(currentUser)

  return (
    <div className="mx-4 pt-6">
      <div
        className="relative overflow-hidden border"
        style={{ borderColor: 'rgba(232,225,216,0.92)', background: '#d8d0c7' }}
      >
        <div className="aspect-[16/9]">
          <img src="/hero-carousel/1710908245.jpg" alt="美芽集个人中心背景" className="w-full h-full object-cover" />
        </div>

        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(18,17,15,0.14) 0%, rgba(18,17,15,0.72) 100%)' }}
        />

        <div
          className="absolute -top-8 -right-8 w-28 h-28 border"
          style={{ borderColor: 'rgba(255,255,255,0.16)' }}
        />
        <div
          className="absolute top-5 right-5 text-[10px] tracking-[0.26em] uppercase"
          style={{ color: 'rgba(255,255,255,0.66)' }}
        >
          MEIYAJI ACCOUNT
        </div>

        <div className="absolute inset-x-0 bottom-0 px-5 pb-5">
          <div className="flex items-end gap-4">
            <HeroAvatar currentUser={currentUser} />
            <div className="min-w-0 flex-1">
              <p className="text-[11px] tracking-[0.18em] uppercase mb-1" style={{ color: 'rgba(255,255,255,0.68)' }}>
                My Profile
              </p>
              <h1 className="text-[26px] leading-[1.1] font-semibold mb-1" style={{ color: 'white' }}>
                {currentUser ? (currentUser.name || '美芽集用户') : '欢迎来到美芽集'}
              </h1>
              <p className="text-[12px] leading-5" style={{ color: 'rgba(255,255,255,0.76)' }}>
                {currentUser ? `ID: ${currentUser.id || '未分配'}` : roleMeta.note}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AccountPanel({ currentUser, onLogin, onRegister, onLogout, onArtistEntry }) {
  const roleMeta = getRoleMeta(currentUser)

  if (!currentUser) {
    return (
      <div
        className="mx-4 mt-5 border p-5"
        style={{ background: 'rgba(251,248,244,0.95)', borderColor: 'rgba(232,225,216,0.92)' }}
      >
        <p className="text-[10px] tracking-[0.24em] uppercase mb-3" style={{ color: 'var(--text-weak)' }}>
          Account Access
        </p>
        <h2 className="text-[22px] leading-[1.18] font-semibold mb-2" style={{ color: 'var(--text)' }}>
          登录后开启完整个人中心
        </h2>
        <p className="text-[13px] leading-6 mb-5" style={{ color: 'var(--text-muted)' }}>
          收藏作品、查看订单、同步艺术家申请状态，都将在这里统一呈现。
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

  return (
    <div
      className="mx-4 mt-5 border p-5"
      style={{ background: 'rgba(251,248,244,0.95)', borderColor: 'rgba(232,225,216,0.92)' }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10px] tracking-[0.24em] uppercase mb-3" style={{ color: 'var(--text-weak)' }}>
            Account Status
          </p>
          <h2 className="text-[20px] font-semibold mb-1" style={{ color: 'var(--text)' }}>
            {roleMeta.label}
          </h2>
          <p className="text-[12px] leading-5 mb-2" style={{ color: 'var(--text-muted)' }}>
            {roleMeta.note}
          </p>
          <p className="text-[11px]" style={{ color: 'var(--text-weak)' }}>
            当前账号：{currentUser.email || currentUser.username || currentUser.id || '未分配'}
          </p>
        </div>

        <button
          onClick={onLogout}
          className="px-3 py-2 text-[12px] border shrink-0"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
        >
          退出登录
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2.5 mt-5">
        <button
          onClick={onArtistEntry}
          className="py-3 text-[13px] font-medium border"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
        >
          {currentUser.role === 'artist' && currentUser.artistStatus === 'approved' ? '进入艺术家后台' : '艺术家入驻'}
        </button>
        <button
          onClick={onLogout}
          className="py-3 text-[13px] font-medium border"
          style={{ background: 'transparent', borderColor: 'var(--border)', color: 'var(--text-muted)' }}
        >
          退出当前账号
        </button>
      </div>
    </div>
  )
}

function StatsPanel({ favsCount, ordersCount }) {
  const stats = [
    { value: favsCount, label: '收藏作品' },
    { value: ordersCount, label: '订单记录' },
    { value: 0, label: '优惠券' },
  ]

  return (
    <div
      className="mx-4 mt-5 border px-4 py-5"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      <div className="flex items-center justify-between gap-3 mb-4">
        <p className="text-[10px] tracking-[0.24em] uppercase" style={{ color: 'var(--text-weak)' }}>
          Snapshot
        </p>
        <p className="text-[11px]" style={{ color: 'var(--text-weak)' }}>
          今日概览
        </p>
      </div>

      <div className="grid grid-cols-3 gap-0">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="text-center px-2"
            style={index === 1 ? { borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)' } : undefined}
          >
            <p className="text-[24px] leading-none font-semibold mb-2" style={{ color: 'var(--text)' }}>
              {stat.value}
            </p>
            <p className="text-[11px]" style={{ color: 'var(--text-weak)' }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

function MenuIcon({ glyph }) {
  return (
    <span
      className="w-8 h-8 border flex items-center justify-center text-[13px] shrink-0"
      style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text)' }}
    >
      {glyph}
    </span>
  )
}

function MenuRow({ glyph, label, meta, badge, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full overflow-hidden cursor-pointer active:bg-opacity-70 transition-colors"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      <div className="flex items-center gap-3.5 px-4 py-3.5">
        <MenuIcon glyph={glyph} />
        <div className="min-w-0 flex-1 text-left">
          <p className="text-[14px] font-medium" style={{ color: 'var(--text)' }}>
            {label}
          </p>
          {meta && (
            <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-weak)' }}>
              {meta}
            </p>
          )}
        </div>
        {badge !== null && badge > 0 && (
          <span
            className="text-white text-[10px] px-2 py-0.5 font-medium shrink-0"
            style={{ background: 'var(--accent)' }}
          >
            {badge}
          </span>
        )}
        <span className="text-sm shrink-0" style={{ color: 'var(--text-weak)' }}>›</span>
      </div>
    </button>
  )
}

function ArtistEntryRow({ currentUser, onApply, onDashboard }) {
  const isApprovedArtist = currentUser?.role === 'artist' && currentUser?.artistStatus === 'approved'
  const isApplyingArtist = currentUser?.role === 'artist' && currentUser?.artistStatus === 'pending'
  const isRejectedArtist = currentUser?.role === 'artist' && currentUser?.artistStatus === 'rejected'

  const statusText = isApprovedArtist
    ? '已开通'
    : isApplyingArtist
      ? '审核中'
      : isRejectedArtist
        ? '未通过'
        : currentUser
          ? '可申请'
          : '需登录'

  const label = isApprovedArtist ? '艺术家后台' : '艺术家入驻申请'
  const meta = isApprovedArtist
    ? '进入创作者后台继续管理作品'
    : '阅读入驻须知后提交申请资料'

  return (
    <div className="px-4">
      <MenuRow
        glyph="艺"
        label={label}
        meta={meta}
        badge={null}
        onClick={() => (isApprovedArtist ? onDashboard() : onApply())}
      />
      <div className="flex justify-end pr-4 pt-2">
        <span className="text-[11px]" style={{ color: 'var(--text-weak)' }}>
          {statusText}
        </span>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const { favs, currentUser, setCurrentUser, showToast } = useApp()

  const collectionItems = [
    { glyph: '单', label: '我的订单', meta: '查看购买记录与订单状态', badge: orders.length, path: '/orders' },
    { glyph: '藏', label: '我的收藏', meta: '保存你想再次细看的作品', badge: favs.length, path: '/discover' },
  ]

  const serviceItems = [
    { glyph: '址', label: '收货地址', meta: '管理收件信息', badge: null, path: '/profile' },
    { glyph: '付', label: '支付管理', meta: '查看支付与结算方式', badge: null, path: '/profile' },
    { glyph: '设', label: '设置', meta: '管理通知与账号偏好', badge: null, path: '/profile' },
    { glyph: '服', label: '联系客服', meta: '获取人工帮助与支持', badge: null, path: '/profile' },
  ]

  const handleLogout = () => {
    clearAuthSession()
    setCurrentUser(null)
    showToast('已退出当前账号')
  }

  const handleArtistEntry = () => {
    if (currentUser?.role === 'artist' && currentUser?.artistStatus === 'approved') {
      navigate('/artist/dashboard')
      return
    }

    navigate(currentUser ? '/artist/apply' : '/login')
  }

  return (
    <div className="pb-20 fade-in">
      <ProfileHero currentUser={currentUser} />

      <AccountPanel
        currentUser={currentUser}
        onLogin={() => navigate('/login')}
        onRegister={() => navigate('/register')}
        onLogout={handleLogout}
        onArtistEntry={handleArtistEntry}
      />

      <StatsPanel favsCount={favs.length} ordersCount={orders.length} />

      <div className="px-4 mt-6 space-y-2.5">
        {collectionItems.map(item => (
          <MenuRow
            key={item.label}
            glyph={item.glyph}
            label={item.label}
            meta={item.meta}
            badge={item.badge}
            onClick={() => navigate(item.path)}
          />
        ))}
      </div>

      <div className="mt-6">
        <ArtistEntryRow
          currentUser={currentUser}
          onApply={() => navigate(currentUser ? '/artist/apply' : '/login')}
          onDashboard={() => navigate('/artist/dashboard')}
        />
      </div>

      <div className="px-4 mt-6 space-y-2.5">
        {serviceItems.map(item => (
          <MenuRow
            key={item.label}
            glyph={item.glyph}
            label={item.label}
            meta={item.meta}
            badge={item.badge}
            onClick={() => item.path && navigate(item.path)}
          />
        ))}
      </div>
    </div>
  )
}
