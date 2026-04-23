import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../App'
import { loginUser, persistAuthSession } from '../services/contentApi'

function BackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"></line>
      <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
  )
}

export default function LoginPage() {
  const navigate = useNavigate()
  const { setCurrentUser, showToast } = useApp()
  const [account, setAccount] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')
    setSubmitting(true)

    try {
      const payload = await loginUser({ account, password })
      const normalizedUser = persistAuthSession(payload)

      setCurrentUser(normalizedUser)
      showToast('登录成功')
      navigate(normalizedUser?.role === 'admin' ? '/admin' : '/profile')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '登录失败，请稍后再试。')
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
          Sign In
        </p>
        <span className="w-10" />
      </div>

      <section
        className="p-6"
        style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}
      >
        <p className="text-[10px] font-bold tracking-[0.24em] uppercase mb-3" style={{ color: 'var(--text-weak)' }}>
          Account Access
        </p>
        <h1 className="text-[28px] leading-[1.18] font-bold mb-3" style={{ color: 'var(--text)' }}>
          登录美芽集
        </h1>
        <p className="text-[13px] leading-relaxed mb-8 font-medium" style={{ color: 'var(--text-muted)' }}>
          登录后可查看收藏、订单，并逐步接入艺术家申请与后台管理功能。
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="block text-[12px] font-bold mb-2.5" style={{ color: 'var(--text-muted)' }}>
              邮箱 / 用户名
            </span>
            <input
              type="text"
              value={account}
              onChange={(event) => setAccount(event.target.value)}
              placeholder="请输入邮箱或用户名"
              className="w-full px-4 py-3.5 text-[14px] outline-none transition-colors"
              style={{ background: 'var(--bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', color: 'var(--text)' }}
              required
            />
          </label>

          <label className="block">
            <span className="block text-[12px] font-bold mb-2.5" style={{ color: 'var(--text-muted)' }}>
              密码
            </span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="请输入密码"
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
              {submitting ? '登录中...' : '立即登录'}
            </button>
          </div>
        </form>

        <div className="mt-8 text-[13px] text-center font-medium" style={{ color: 'var(--text-muted)' }}>
          还没有账号？{' '}
          <Link to="/register" className="font-bold transition-opacity hover:opacity-70" style={{ color: 'var(--text)' }}>
            立即注册
          </Link>
        </div>
      </section>
    </div>
  )
}
