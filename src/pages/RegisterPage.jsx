import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../App'
import { persistAuthSession, registerUser } from '../services/contentApi'

function BackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"></line>
      <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
  )
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const { setCurrentUser, showToast } = useApp()
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    realName: '',
    password: '',
    confirmPassword: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('两次输入的密码不一致，请重新确认。')
      return
    }

    setSubmitting(true)

    try {
      const payload = await registerUser({
        email: formData.email,
        username: formData.username || undefined,
        realName: formData.realName || undefined,
        password: formData.password,
      })
      const normalizedUser = persistAuthSession(payload)

      setCurrentUser(normalizedUser)
      showToast('注册成功')
      navigate('/profile')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '注册失败，请稍后再试。')
    } finally {
      setSubmitting(false)
    }
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
          Register
        </p>
        <span className="w-10" />
      </div>

      <section
        className="p-6"
        style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}
      >
        <p className="text-[10px] font-bold tracking-[0.24em] uppercase mb-3" style={{ color: 'var(--text-weak)' }}>
          New Account
        </p>
        <h1 className="text-[28px] leading-[1.18] font-bold mb-3" style={{ color: 'var(--text)' }}>
          注册美芽集
        </h1>
        <p className="text-[13px] leading-relaxed mb-8 font-medium" style={{ color: 'var(--text-muted)' }}>
          先注册普通会员账号，后续可以继续申请成为艺术家。
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="block text-[12px] font-bold mb-2.5" style={{ color: 'var(--text-muted)' }}>
              邮箱
            </span>
            <input
              type="email"
              value={formData.email}
              onChange={(event) => updateField('email', event.target.value)}
              placeholder="请输入邮箱"
              className="w-full px-4 py-3.5 text-[14px] outline-none transition-colors"
              style={{ background: 'var(--bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', color: 'var(--text)' }}
              required
            />
          </label>

          <label className="block">
            <span className="block text-[12px] font-bold mb-2.5" style={{ color: 'var(--text-muted)' }}>
              用户名
            </span>
            <input
              type="text"
              value={formData.username}
              onChange={(event) => updateField('username', event.target.value)}
              placeholder="请输入用户名"
              className="w-full px-4 py-3.5 text-[14px] outline-none transition-colors"
              style={{ background: 'var(--bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', color: 'var(--text)' }}
            />
          </label>

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
            />
          </label>

          <label className="block">
            <span className="block text-[12px] font-bold mb-2.5" style={{ color: 'var(--text-muted)' }}>
              密码
            </span>
            <input
              type="password"
              value={formData.password}
              onChange={(event) => updateField('password', event.target.value)}
              placeholder="请输入至少 6 位密码"
              className="w-full px-4 py-3.5 text-[14px] outline-none transition-colors"
              style={{ background: 'var(--bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', color: 'var(--text)' }}
              required
            />
          </label>

          <label className="block">
            <span className="block text-[12px] font-bold mb-2.5" style={{ color: 'var(--text-muted)' }}>
              确认密码
            </span>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(event) => updateField('confirmPassword', event.target.value)}
              placeholder="请再次输入密码"
              className="w-full px-4 py-3.5 text-[14px] outline-none transition-colors"
              style={{ background: 'var(--bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', color: 'var(--text)' }}
              required
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
              className="btn-primary w-full py-3.5 text-[15px]"
            >
              {submitting ? '注册中...' : '创建账号'}
            </button>
          </div>
        </form>

        <div className="mt-8 text-[13px] text-center font-medium" style={{ color: 'var(--text-muted)' }}>
          已有账号？{' '}
          <Link to="/login" className="font-bold transition-opacity hover:opacity-70" style={{ color: 'var(--text)' }}>
            直接登录
          </Link>
        </div>
      </section>
    </div>
  )
}
