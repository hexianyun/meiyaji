import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../App'
import { loginUser, persistAuthSession } from '../services/contentApi'

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
          Sign In
        </p>
        <span className="w-10" />
      </div>

      <section
        className="border p-6"
        style={{ background: 'rgba(251,248,244,0.95)', borderColor: 'rgba(232,225,216,0.92)' }}
      >
        <p className="text-[10px] tracking-[0.24em] uppercase mb-3" style={{ color: 'var(--text-weak)' }}>
          Account Access
        </p>
        <h1 className="text-[28px] leading-[1.18] font-semibold mb-3" style={{ color: 'var(--text)' }}>
          登录美芽集
        </h1>
        <p className="text-[13px] leading-6 mb-6" style={{ color: 'var(--text-muted)' }}>
          登录后可查看收藏、订单，并逐步接入艺术家申请与后台管理功能。
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="block text-[12px] mb-2" style={{ color: 'var(--text-muted)' }}>
              邮箱 / 用户名
            </span>
            <input
              type="text"
              value={account}
              onChange={(event) => setAccount(event.target.value)}
              placeholder="请输入邮箱或用户名"
              className="w-full px-4 py-3 border text-[14px] outline-none"
              style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
              required
            />
          </label>

          <label className="block">
            <span className="block text-[12px] mb-2" style={{ color: 'var(--text-muted)' }}>
              密码
            </span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="请输入密码"
              className="w-full px-4 py-3 border text-[14px] outline-none"
              style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
              required
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
            {submitting ? '登录中...' : '立即登录'}
          </button>
        </form>

        <div className="mt-5 text-[13px]" style={{ color: 'var(--text-muted)' }}>
          还没有账号？{' '}
          <Link to="/register" style={{ color: 'var(--text)', borderBottom: '1px solid var(--text)' }}>
            去注册
          </Link>
        </div>
      </section>
    </div>
  )
}
