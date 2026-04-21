import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../App'
import { orders } from '../data'
import { clearAuthSession, updateMemberAvatar } from '../services/contentApi'

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

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('图片读取失败，请重新选择。'))
    reader.readAsDataURL(file)
  })
}

function loadImage(dataUrl) {
  return new Promise((resolve, reject) => {
    const image = new Image()

    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('图片解析失败，请重新选择。'))
    image.src = dataUrl
  })
}

async function buildAvatarDataUrl(file) {
  const originalDataUrl = await readFileAsDataUrl(file)
  const image = await loadImage(originalDataUrl)
  const size = 320
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error('当前设备暂不支持头像处理，请稍后再试。')
  }

  canvas.width = size
  canvas.height = size

  const sourceSize = Math.min(image.width, image.height)
  const sourceX = (image.width - sourceSize) / 2
  const sourceY = (image.height - sourceSize) / 2

  context.drawImage(
    image,
    sourceX,
    sourceY,
    sourceSize,
    sourceSize,
    0,
    0,
    size,
    size,
  )

  return canvas.toDataURL('image/jpeg', 0.86)
}

function HeroAvatar({ currentUser, onUploadClick, isUploading }) {
  const initial = currentUser?.name?.trim()?.charAt(0) || '芽'
  const avatarUrl = currentUser?.avatarUrl || ''

  return (
    <div
      className="relative w-[88px] h-[88px] border shrink-0 overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.12)',
        borderColor: 'rgba(255,255,255,0.32)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 14px 28px rgba(15, 18, 16, 0.22)',
      }}
    >
      <div
        className="absolute inset-[7px] border"
        style={{ borderColor: 'rgba(255,255,255,0.18)' }}
      />
      {avatarUrl ? (
        <img src={avatarUrl} alt={`${currentUser?.name || '美芽集用户'}头像`} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center" style={{ color: 'white', fontSize: '30px', fontWeight: 600, letterSpacing: '0.04em' }}>
          {initial}
        </div>
      )}
      {currentUser && (
        <button
          type="button"
          onClick={onUploadClick}
          disabled={isUploading}
          className="absolute inset-x-[7px] bottom-[7px] h-7 text-[10px] tracking-[0.1em] uppercase disabled:opacity-60"
          style={{
            background: 'rgba(17, 21, 19, 0.58)',
            color: 'rgba(255,255,255,0.92)',
            borderTop: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          {isUploading ? '上传中...' : '更换头像'}
        </button>
      )}
    </div>
  )
}

function ProfileHero({ currentUser, onAvatarUploadClick, isUploadingAvatar }) {
  const roleMeta = getRoleMeta(currentUser)
  const heroImageSrc = '/profile/my-banner-hero.jpg'
  const profileLabel = currentUser ? roleMeta.label : '美芽集用户中心'
  const profileMeta = currentUser
    ? (currentUser.email || currentUser.username || `ID: ${currentUser.id || '未分配'}`)
    : '登录后可查看收藏、订单与艺术家申请状态'

  return (
    <div className="mx-4 pt-6">
      <div
        className="relative overflow-hidden border"
        style={{ borderColor: 'rgba(232,225,216,0.92)', background: '#d8d0c7' }}
      >
        <div className="aspect-[16/9]">
          <img src={heroImageSrc} alt="美芽集个人中心横幅作品" className="w-full h-full object-cover" />
        </div>

        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(12,18,15,0.12) 0%, rgba(16,22,18,0.58) 58%, rgba(16,18,16,0.8) 100%)' }}
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
          <div
            className="border px-4 py-4"
            style={{
              background: 'linear-gradient(180deg, rgba(22,26,24,0.14) 0%, rgba(22,26,24,0.26) 100%)',
              borderColor: 'rgba(255,255,255,0.14)',
              backdropFilter: 'blur(6px)',
            }}
          >
            <div className="flex items-end gap-4">
              <HeroAvatar currentUser={currentUser} onUploadClick={onAvatarUploadClick} isUploading={isUploadingAvatar} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span
                    className="px-2.5 py-1 text-[10px] tracking-[0.18em] uppercase"
                    style={{ color: 'rgba(255,255,255,0.78)', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
                  >
                    My Profile
                  </span>
                  <span
                    className="px-2.5 py-1 text-[10px]"
                    style={{ color: 'rgba(255,255,255,0.78)', background: 'rgba(18, 88, 63, 0.22)', border: '1px solid rgba(255,255,255,0.12)' }}
                  >
                    {profileLabel}
                  </span>
                </div>
                <h1 className="text-[28px] leading-[1.05] font-semibold mb-1.5" style={{ color: 'white' }}>
                  {currentUser ? (currentUser.name || '美芽集用户') : '欢迎来到美芽集'}
                </h1>
                <p className="text-[12px] leading-5 mb-2" style={{ color: 'rgba(255,255,255,0.8)' }}>
                  {profileMeta}
                </p>
                <p className="text-[11px] leading-5" style={{ color: 'rgba(255,255,255,0.64)' }}>
                  {currentUser ? roleMeta.note : '在这里统一管理收藏、订单与艺术家入驻申请'}
                </p>
                {currentUser && (
                  <p className="text-[10px] mt-2" style={{ color: 'rgba(255,255,255,0.56)' }}>
                    点击头像即可上传新的个人头像
                  </p>
                )}
              </div>
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

function MenuIcon({ icon }) {
  const iconProps = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.7',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }

  return (
    <span
      className="w-10 h-10 border flex items-center justify-center shrink-0"
      style={{ background: 'rgba(248,244,238,0.92)', borderColor: 'rgba(228,220,208,0.96)', color: 'var(--text)' }}
    >
      {icon === 'orders' && (
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" {...iconProps}>
          <path d="M7 3.5h7l3 3V20.5H7z" />
          <path d="M14 3.5v3h3" />
          <path d="M10 11h4" />
          <path d="M10 15h4" />
        </svg>
      )}
      {icon === 'favorites' && (
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" {...iconProps}>
          <path d="M12 20.5s-6.5-4.2-8.4-8C2.1 9.8 3.2 6.8 6 5.7c2-.8 4.1-.1 6 2 1.9-2.1 4-2.8 6-2 2.8 1.1 3.9 4.1 2.4 6.8-1.9 3.8-8.4 8-8.4 8z" />
        </svg>
      )}
      {icon === 'artist' && (
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" {...iconProps}>
          <path d="M12 4.5a7.5 7.5 0 1 0 0 15c1.8 0 3-.8 3-2.1 0-.8-.5-1.4-.5-2 0-.9.6-1.4 1.6-1.4h.6A3.8 3.8 0 0 0 20.5 10 5.5 5.5 0 0 0 15 4.5z" />
          <path d="M8 10h.01" />
          <path d="M12 8h.01" />
          <path d="M15 11h.01" />
          <path d="M10 14h.01" />
        </svg>
      )}
      {icon === 'address' && (
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" {...iconProps}>
          <path d="M12 20s5-5.3 5-9a5 5 0 1 0-10 0c0 3.7 5 9 5 9z" />
          <circle cx="12" cy="11" r="1.8" />
        </svg>
      )}
      {icon === 'payment' && (
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" {...iconProps}>
          <rect x="3.5" y="6" width="17" height="12" rx="1.5" />
          <path d="M3.5 10h17" />
          <path d="M7 14.5h3.5" />
        </svg>
      )}
      {icon === 'settings' && (
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" {...iconProps}>
          <circle cx="12" cy="12" r="2.6" />
          <path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.4-2.4.8a7.4 7.4 0 0 0-1.7-1L14.5 3h-5l-.3 2.9a7.4 7.4 0 0 0-1.7 1l-2.4-.8-2 3.4 2 1.5a7 7 0 0 0 0 2l-2 1.5 2 3.4 2.4-.8a7.4 7.4 0 0 0 1.7 1l.3 2.9h5l.3-2.9a7.4 7.4 0 0 0 1.7-1l2.4.8 2-3.4-2-1.5c.1-.3.1-.7.1-1z" />
        </svg>
      )}
      {icon === 'support' && (
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" {...iconProps}>
          <path d="M5.5 13.5v-1.7A6.5 6.5 0 0 1 12 5.3a6.5 6.5 0 0 1 6.5 6.5v1.7" />
          <path d="M5.5 14.2A1.7 1.7 0 0 0 7.2 16h.8v-4h-.8a1.7 1.7 0 0 0-1.7 1.7z" />
          <path d="M18.5 14.2a1.7 1.7 0 0 1-1.7 1.8H16v-4h.8a1.7 1.7 0 0 1 1.7 1.7z" />
          <path d="M12 18.5h2.5" />
        </svg>
      )}
    </span>
  )
}

function MenuRow({ icon, label, meta, badge, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full overflow-hidden cursor-pointer active:bg-opacity-70 transition-colors"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      <div className="flex items-center gap-3.5 px-4 py-3.5">
        <MenuIcon icon={icon} />
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
        icon="artist"
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
  const fileInputRef = useRef(null)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)

  const collectionItems = [
    { icon: 'orders', label: '我的订单', meta: '查看购买记录与订单状态', badge: orders.length, path: '/orders' },
    { icon: 'favorites', label: '我的收藏', meta: '保存你想再次细看的作品', badge: favs.length, path: '/discover' },
  ]

  const serviceItems = [
    { icon: 'address', label: '收货地址', meta: '管理收件信息', badge: null, path: '/profile' },
    { icon: 'payment', label: '支付管理', meta: '查看支付与结算方式', badge: null, path: '/profile' },
    { icon: 'settings', label: '设置', meta: '管理通知与账号偏好', badge: null, path: '/profile' },
    { icon: 'support', label: '联系客服', meta: '获取人工帮助与支持', badge: null, path: '/profile' },
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

  const handleAvatarUploadClick = () => {
    if (!currentUser) {
      showToast('请先登录后再上传头像')
      navigate('/login')
      return
    }

    fileInputRef.current?.click()
  }

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file || !currentUser) return

    if (!file.type.startsWith('image/')) {
      showToast('请选择 JPG、PNG 或 WEBP 图片')
      return
    }

    if (file.size > 8 * 1024 * 1024) {
      showToast('图片不能超过 8MB')
      return
    }

    setIsUploadingAvatar(true)

    try {
      const avatarUrl = await buildAvatarDataUrl(file)

      try {
        const updatedUser = await updateMemberAvatar(avatarUrl)
        setCurrentUser(updatedUser)
        showToast('头像已更新')
      } catch {
        setCurrentUser({
          ...currentUser,
          avatarUrl,
        })
        showToast('头像已保存到当前设备')
      }
    } catch (error) {
      showToast(error instanceof Error ? error.message : '头像上传失败，请稍后再试。')
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  return (
    <div className="pb-20 fade-in">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={handleAvatarChange}
      />

      <ProfileHero
        currentUser={currentUser}
        onAvatarUploadClick={handleAvatarUploadClick}
        isUploadingAvatar={isUploadingAvatar}
      />

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
            icon={item.icon}
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
            icon={item.icon}
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
