import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../App'
import { applyArtistApplication } from '../services/contentApi'

function BackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"></line>
      <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
  )
}

const initialForm = {
  realName: '',
  bio: '',
  artistIntro: '',
  portfolioUrl: '',
}

const artistNoticeSections = [
  {
    title: '一、核心收益分配机制',
    body: [
      '为了兼顾艺术家的创作权益与公益项目的长远发展，我们确立了极其清晰、克制的收益分配规则。当您的作品在平台成功售出后，收益将按以下比例进行分配：',
      '40% 用于艺术创作（归艺术家所有）',
      '我们深知并尊重每一份创作背后的艰辛。这部分收益将直接交予艺术家本人，为您持续的艺术探索提供最实质的支持与回报。',
      '50% 专项用于乡村公益',
      '这是“美芽集”的核心使命。该款项将 100% 转化为乡村孩子们的画材、美育课堂和艺术启蒙，为贫瘠的土壤播撒美的种子。',
      '10% 用于项目运营',
      '该部分资金仅用于维持平台的日常运转（如网站维护、作品宣发）以及公益项目的差旅落地，确保这座连接艺术与爱的桥梁能够坚固长久。',
    ],
  },
  {
    title: '二、我们的透明承诺',
    body: [
      '信任是公益的基石。“美芽集”郑重承诺：',
      '所有款项的流向全程公开透明，平台将定期向入驻艺术家及公众公示资金去向。我们保证让每一份善意，都真正抵达孩子身边。',
    ],
  },
]

export default function ArtistApplyPage() {
  const navigate = useNavigate()
  const { currentUser, setCurrentUser, showToast } = useApp()
  const [formData, setFormData] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [hasAcceptedNotice, setHasAcceptedNotice] = useState(false)
  const [hasConfirmedAgreement, setHasConfirmedAgreement] = useState(false)

  const isApprovedArtist = currentUser?.role === 'artist' && currentUser?.artistStatus === 'approved'

  useEffect(() => {
    if (!currentUser) return

    setFormData({
      realName: currentUser.realName || currentUser.name || '',
      bio: currentUser.bio || '',
      artistIntro: currentUser.artistIntro || '',
      portfolioUrl: currentUser.portfolioUrl || '',
    })
  }, [currentUser])

  if (!currentUser) {
    return (
      <div className="px-4 pt-5 pb-24 fade-in min-h-screen bg-[var(--bg)]">
        <div className="flex items-center justify-between gap-3 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full shadow-sm transition-transform active:scale-90"
            style={{ background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)' }}
          >
            <BackIcon />
          </button>
          <p className="text-[10px] font-bold tracking-[0.28em] uppercase" style={{ color: 'var(--text-weak)' }}>
            Artist Apply
          </p>
          <span className="w-10" />
        </div>

        <section
          className="p-6"
          style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}
        >
          <p className="text-[10px] font-bold tracking-[0.24em] uppercase mb-3" style={{ color: 'var(--text-weak)' }}>
            Sign In Required
          </p>
          <h1 className="text-[28px] leading-[1.18] font-bold mb-3" style={{ color: 'var(--text)' }}>
            先登录，再提交艺术家入驻申请
          </h1>
          <p className="text-[13px] leading-relaxed mb-6 font-medium" style={{ color: 'var(--text-muted)' }}>
            入驻申请会绑定当前账号，请先登录会员账号后继续填写资料。
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => navigate('/login')}
              className="btn-primary flex-1 py-3.5 text-[15px]"
            >
              去登录
            </button>
            <button
              onClick={() => navigate('/register')}
              className="btn-outline flex-1 py-3.5 text-[15px]"
            >
              去注册
            </button>
          </div>
        </section>
      </div>
    )
  }

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')

    if (!currentUser) {
      navigate('/login')
      return
    }

    setSubmitting(true)

    try {
      const payload = await applyArtistApplication({
        realName: formData.realName.trim(),
        bio: formData.bio.trim(),
        artistIntro: formData.artistIntro.trim() || undefined,
        portfolioUrl: formData.portfolioUrl.trim() || undefined,
      })

      if (payload?.user) {
        setCurrentUser(payload.user)
      }

      showToast('艺术家入驻申请已提交')
      navigate('/profile')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '提交失败，请稍后再试。')
    } finally {
      setSubmitting(false)
    }
  }

  if (isApprovedArtist) {
    return (
      <div className="px-4 pt-5 pb-24 fade-in min-h-screen bg-[var(--bg)]">
        <div className="flex items-center justify-between gap-3 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full shadow-sm transition-transform active:scale-90"
            style={{ background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)' }}
          >
            <BackIcon />
          </button>
          <p className="text-[10px] font-bold tracking-[0.28em] uppercase" style={{ color: 'var(--text-weak)' }}>
            Artist Apply
          </p>
          <span className="w-10" />
        </div>

        <section
          className="p-6"
          style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}
        >
          <p className="text-[10px] font-bold tracking-[0.24em] uppercase mb-3" style={{ color: 'var(--text-weak)' }}>
            Status
          </p>
          <h1 className="text-[28px] leading-[1.18] font-bold mb-3" style={{ color: 'var(--text)' }}>
            你已经是认证艺术家
          </h1>
          <p className="text-[13px] leading-relaxed mb-6 font-medium" style={{ color: 'var(--text-muted)' }}>
            你可以直接进入艺术家后台管理作品，也可以继续完善作品信息。
          </p>

          <button
            onClick={() => navigate('/artist/dashboard')}
            className="btn-primary w-full py-3.5 text-[15px]"
          >
            进入艺术家后台
          </button>
        </section>
      </div>
    )
  }

  if (!hasAcceptedNotice) {
    return (
      <div className="px-4 pt-5 pb-24 fade-in min-h-screen bg-[var(--bg)]">
        <div className="flex items-center justify-between gap-3 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full shadow-sm transition-transform active:scale-90"
            style={{ background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)' }}
          >
            <BackIcon />
          </button>
          <p className="text-[10px] font-bold tracking-[0.28em] uppercase" style={{ color: 'var(--text-weak)' }}>
            Artist Apply
          </p>
          <span className="w-10" />
        </div>

        <section
          className="p-6"
          style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}
        >
          <p className="text-[10px] font-bold tracking-[0.24em] uppercase mb-3" style={{ color: 'var(--text-weak)' }}>
            Entry Notice
          </p>
          <h1 className="text-[24px] leading-[1.22] font-bold mb-4" style={{ color: 'var(--text)' }}>
            「美芽集」艺术家入驻申请须知
          </h1>
          <p className="text-[13px] leading-relaxed mb-4 font-medium" style={{ color: 'var(--text-muted)' }}>
            欢迎来到“美芽集”。我们是一个致力于“以艺术品售卖支援乡村美育公益”的平台。在这里，您的每一件作品不仅是美的表达，更将化作点亮乡村孩子艺术梦想的星光。
          </p>
          <p className="text-[13px] leading-relaxed mb-6 font-medium" style={{ color: 'var(--text-muted)' }}>
            在您提交入驻申请前，请详细阅读以下须知与平台核心机制：
          </p>

          <div className="space-y-6">
            {artistNoticeSections.map(section => (
              <div key={section.title}>
                <h2 className="text-[16px] font-bold mb-2" style={{ color: 'var(--text)' }}>
                  {section.title}
                </h2>
                <div className="space-y-2">
                  {section.body.map((paragraph, index) => (
                    <p key={`${section.title}-${index}`} className="text-[13px] leading-relaxed font-medium" style={{ color: 'var(--text-muted)' }}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <label className="flex items-start gap-3 mt-8 cursor-pointer group">
            <input
              type="checkbox"
              checked={hasConfirmedAgreement}
              onChange={(event) => setHasConfirmedAgreement(event.target.checked)}
              className="mt-1 flex-shrink-0"
            />
            <span className="text-[13px] leading-relaxed font-medium group-hover:opacity-80 transition-opacity" style={{ color: 'var(--text)' }}>
              我已完整阅读并同意以上入驻须知、收益分配机制及平台透明承诺。
            </span>
          </label>

          <button
            type="button"
            disabled={!hasConfirmedAgreement}
            onClick={() => {
              setHasAcceptedNotice(true)
              setErrorMessage('')
            }}
            className="btn-primary w-full py-3.5 text-[15px] mt-6 disabled:opacity-50"
          >
            同意并填写申请表
          </button>
        </section>
      </div>
    )
  }

  return (
    <div className="px-4 pt-5 pb-24 fade-in min-h-screen bg-[var(--bg)]">
      <div className="flex items-center justify-between gap-3 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full shadow-sm transition-transform active:scale-90"
          style={{ background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)' }}
        >
          <BackIcon />
        </button>
        <p className="text-[10px] font-bold tracking-[0.28em] uppercase" style={{ color: 'var(--text-weak)' }}>
          Artist Apply
        </p>
        <span className="w-10" />
      </div>

      <section
        className="p-6"
        style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}
      >
        <p className="text-[10px] font-bold tracking-[0.24em] uppercase mb-3" style={{ color: 'var(--text-weak)' }}>
          Application
        </p>
        <h1 className="text-[28px] leading-[1.18] font-bold mb-3" style={{ color: 'var(--text)' }}>
          艺术家入驻申请
        </h1>
        <p className="text-[13px] leading-relaxed mb-6 font-medium" style={{ color: 'var(--text-muted)' }}>
          填写真实姓名、创作理念与公益说明，提交后状态会变为 pending，等待审核。
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="block text-[12px] font-bold mb-2.5" style={{ color: 'var(--text-muted)' }}>
              真实姓名
            </span>
            <input
              type="text"
              value={formData.realName}
              onChange={(event) => updateField('realName', event.target.value)}
              placeholder="请输入真实姓名"
              className="w-full px-4 py-3.5 text-[14px] outline-none transition-colors"
              style={{ background: 'var(--bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', color: 'var(--text)' }}
              required
            />
          </label>

          <label className="block">
            <span className="block text-[12px] font-bold mb-2.5" style={{ color: 'var(--text-muted)' }}>
              艺术家介绍 / 创作理念
            </span>
            <textarea
              value={formData.bio}
              onChange={(event) => updateField('bio', event.target.value)}
              placeholder="请介绍你的艺术方向、创作理念，以及你与乡村美育的关系"
              className="w-full px-4 py-3.5 text-[14px] outline-none transition-colors min-h-[120px]"
              style={{ background: 'var(--bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', color: 'var(--text)' }}
              required
            />
          </label>

          <label className="block">
            <span className="block text-[12px] font-bold mb-2.5" style={{ color: 'var(--text-muted)' }}>
              补充说明
            </span>
            <textarea
              value={formData.artistIntro}
              onChange={(event) => updateField('artistIntro', event.target.value)}
              placeholder="可写创作经历、代表作品、公益参与经历等"
              className="w-full px-4 py-3.5 text-[14px] outline-none transition-colors min-h-[100px]"
              style={{ background: 'var(--bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', color: 'var(--text)' }}
            />
          </label>

          <label className="block">
            <span className="block text-[12px] font-bold mb-2.5" style={{ color: 'var(--text-muted)' }}>
              作品集链接
            </span>
            <input
              type="url"
              value={formData.portfolioUrl}
              onChange={(event) => updateField('portfolioUrl', event.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-3.5 text-[14px] outline-none transition-colors"
              style={{ background: 'var(--bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', color: 'var(--text)' }}
            />
          </label>

          {errorMessage && (
            <div
              className="px-4 py-3 text-[12px] font-medium"
              style={{ background: 'rgba(201,143,134,0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(201,143,134,0.3)', color: '#8A5B52' }}
            >
              {errorMessage}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full py-3.5 text-[15px] disabled:opacity-60"
            >
              {submitting ? '提交中...' : '提交申请'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
