import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../App'
import { persistAuthSession, registerUser } from '../services/contentApi'

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
          Register
        </p>
        <span className="w-10" />
      </div>

      <section
        className="border p-6"
        style={{ background: 'rgba(251,248,244,0.95)', borderColor: 'rgba(232,225,216,0.92)' }}
      >
        <p className="text-[10px] tracking-[0.24em] uppercase mb-3" style={{ color: 'var(--text-weak)' }}>
          New Account
        </p>
        <h1 className="text-[28px] leading-[1.18] font-semibold mb-3" style={{ color: 'var(--text)' }}>
          注册美芽集账号
        </h1>
        <p className="text-[13px] leading-6 mb-6" style={{ color: 'var(--text-muted)' }}>
          先注册普通会员账号，后续可以继续申请成为艺术家。
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="block text-[12px] mb-2" style={{ color: 'var(--text-muted)' }}>
              邮箱
            </span>
            <input
              type="email"
              value={formData.email}
              onChange={(event) => updateField('email', event.target.value)}
              placeholder="请输入邮箱"
              className="w-full px-4 py-3 border text-[14px] outline-none"
              style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
              required
            />
          </label>

          <label className="block">
            <span className="block text-[12px] mb-2" style={{ color: 'var(--text-muted)' }}>
              用户名
            </span>
            <input
              type="text"
              value={formData.username}
              onChange={(event) => updateField('username', event.target.value)}
              placeholder="请输入用户名"
              className="w-full px-4 py-3 border text-[14px] outline-none"
              style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
            />
          </label>

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
            />
          </label>

          <label className="block">
            <span className="block text-[12px] mb-2" style={{ color: 'var(--text-muted)' }}>
              密码
            </span>
            <input
              type="password"
              value={formData.password}
              onChange={(event) => updateField('password', event.target.value)}
              placeholder="请输入至少 6 位密码"
              className="w-full px-4 py-3 border text-[14px] outline-none"
              style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
              required
            />
          </label>

          <label className="block">
            <span className="block text-[12px] mb-2" style={{ color: 'var(--text-muted)' }}>
              确认密码
            </span>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(event) => updateField('confirmPassword', event.target.value)}
              placeholder="请再次输入密码"
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
            {submitting ? '注册中...' : '创建账号'}
          </button>
        </form>

        <div className="mt-5 text-[13px]" style={{ color: 'var(--text-muted)' }}>
          已有账号？{' '}
          <Link to="/login" style={{ color: 'var(--text)', borderBottom: '1px solid var(--text)' }}>
            去登录
          </Link>
        </div>
      </section>
    </div>
  )
}
