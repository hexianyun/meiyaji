import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../App'
import { applyArtistApplication } from '../services/contentApi'

const initialForm = {
  realName: '',
  bio: '',
  artistIntro: '',
  portfolioUrl: '',
}

export default function ArtistApplyPage() {
  const navigate = useNavigate()
  const { currentUser, setCurrentUser, showToast } = useApp()
  const [formData, setFormData] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

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
      <div className="px-4 pt-5 pb-24 fade-in">
        <div className="flex items-center justify-between gap-3 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center border"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
          >
            ←
          </button>
          <p className="text-[10px] tracking-[0.28em] uppercase" style={{ color: 'var(--text-weak)' }}>
            Artist Apply
          </p>
          <span className="w-10" />
        </div>

        <section
          className="border p-6"
          style={{ background: 'rgba(251,248,244,0.95)', borderColor: 'rgba(232,225,216,0.92)' }}
        >
          <p className="text-[10px] tracking-[0.24em] uppercase mb-3" style={{ color: 'var(--text-weak)' }}>
            Sign In Required
          </p>
          <h1 className="text-[28px] leading-[1.18] font-semibold mb-3" style={{ color: 'var(--text)' }}>
            先登录，再提交艺术家入驻申请
          </h1>
          <p className="text-[13px] leading-6 mb-6" style={{ color: 'var(--text-muted)' }}>
            入驻申请会绑定当前账号，请先登录会员账号后继续填写资料。
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => navigate('/login')}
              className="flex-1 py-3.5 text-[15px] font-medium"
              style={{ background: 'var(--text)', color: 'white' }}
            >
              去登录
            </button>
            <button
              onClick={() => navigate('/register')}
              className="flex-1 py-3.5 text-[15px] font-medium border"
              style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
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
      <div className="px-4 pt-5 pb-24 fade-in">
        <div className="flex items-center justify-between gap-3 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center border"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
          >
            ←
          </button>
          <p className="text-[10px] tracking-[0.28em] uppercase" style={{ color: 'var(--text-weak)' }}>
            Artist Apply
          </p>
          <span className="w-10" />
        </div>

        <section
          className="border p-6"
          style={{ background: 'rgba(251,248,244,0.95)', borderColor: 'rgba(232,225,216,0.92)' }}
        >
          <p className="text-[10px] tracking-[0.24em] uppercase mb-3" style={{ color: 'var(--text-weak)' }}>
            Status
          </p>
          <h1 className="text-[28px] leading-[1.18] font-semibold mb-3" style={{ color: 'var(--text)' }}>
            你已经是认证艺术家
          </h1>
          <p className="text-[13px] leading-6 mb-6" style={{ color: 'var(--text-muted)' }}>
            你可以直接进入艺术家后台管理作品，也可以继续完善作品信息。
          </p>

          <button
            onClick={() => navigate('/artist/dashboard')}
            className="w-full py-3.5 text-[15px] font-medium"
            style={{ background: 'var(--text)', color: 'white' }}
          >
            进入艺术家后台
          </button>
        </section>
      </div>
    )
  }

  return (
    <div className="px-4 pt-5 pb-24 fade-in">
      <div className="flex items-center justify-between gap-3 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center border"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
        >
          ←
        </button>
        <p className="text-[10px] tracking-[0.28em] uppercase" style={{ color: 'var(--text-weak)' }}>
          Artist Apply
        </p>
        <span className="w-10" />
      </div>

      <section
        className="border p-6"
        style={{ background: 'rgba(251,248,244,0.95)', borderColor: 'rgba(232,225,216,0.92)' }}
      >
        <p className="text-[10px] tracking-[0.24em] uppercase mb-3" style={{ color: 'var(--text-weak)' }}>
          Application
        </p>
        <h1 className="text-[28px] leading-[1.18] font-semibold mb-3" style={{ color: 'var(--text)' }}>
          艺术家入驻申请
        </h1>
        <p className="text-[13px] leading-6 mb-6" style={{ color: 'var(--text-muted)' }}>
          填写真实姓名、创作理念与公益说明，提交后状态会变为 pending，等待审核。
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="block text-[12px] mb-2" style={{ color: 'var(--text-muted)' }}>
              真实姓名
            </span>
            <input
              type="text"
              value={formData.realName}
              onChange={(event) => updateField('realName', event.target.value)}
              placeholder="请输入真实姓名"
              className="w-full px-4 py-3 border text-[14px] outline-none"
              style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
              required
            />
          </label>

          <label className="block">
            <span className="block text-[12px] mb-2" style={{ color: 'var(--text-muted)' }}>
              艺术家介绍 / 创作理念
            </span>
            <textarea
              value={formData.bio}
              onChange={(event) => updateField('bio', event.target.value)}
              placeholder="请介绍你的艺术方向、创作理念，以及你与乡村美育的关系"
              className="w-full px-4 py-3 border text-[14px] outline-none min-h-[120px]"
              style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
              required
            />
          </label>

          <label className="block">
            <span className="block text-[12px] mb-2" style={{ color: 'var(--text-muted)' }}>
              补充说明
            </span>
            <textarea
              value={formData.artistIntro}
              onChange={(event) => updateField('artistIntro', event.target.value)}
              placeholder="可写创作经历、代表作品、公益参与经历等"
              className="w-full px-4 py-3 border text-[14px] outline-none min-h-[100px]"
              style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
            />
          </label>

          <label className="block">
            <span className="block text-[12px] mb-2" style={{ color: 'var(--text-muted)' }}>
              作品集链接
            </span>
            <input
              type="url"
              value={formData.portfolioUrl}
              onChange={(event) => updateField('portfolioUrl', event.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-3 border text-[14px] outline-none"
              style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
            />
          </label>

          {errorMessage && (
            <div
              className="border px-4 py-3 text-[12px]"
              style={{ background: 'rgba(201,143,134,0.08)', borderColor: 'rgba(201,143,134,0.3)', color: '#8A5B52' }}
            >
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 text-[15px] font-medium disabled:opacity-60"
            style={{ background: 'var(--text)', color: 'white' }}
          >
            {submitting ? '提交中...' : '提交申请'}
          </button>
        </form>
      </section>
    </div>
  )
}
