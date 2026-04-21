import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../App'
import {
  createAdminArtwork,
  createAdminContent,
  deleteAdminUser,
  getAdminApplications,
  getAdminArtworks,
  getAdminContents,
  getAdminOrders,
  getAdminOverview,
  getAdminUsers,
  reviewArtistApplication,
  updateAdminArtwork,
  updateAdminContent,
  updateAdminOrder,
} from '../services/contentApi'

const initialContentForm = {
  kind: 'activity',
  title: '',
  cover: '',
  dateLabel: '',
  author: '',
  location: '',
  tag: '',
  summary: '',
  sectionsText: '',
  imagesText: '',
}

const initialArtworkForm = {
  artistId: '',
  title: '',
  imageUrl: '',
  price: '',
  stock: '1',
  charitySupportNote: '',
  description: '',
}

function SectionCard({ title, children, extra }) {
  return (
    <section className="border p-4" style={{ background: 'rgba(251,248,244,0.94)', borderColor: 'rgba(232,225,216,0.92)' }}>
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="text-[18px] font-semibold" style={{ color: 'var(--text)' }}>{title}</h2>
        {extra}
      </div>
      {children}
    </section>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-[12px] mb-2" style={{ color: 'var(--text-muted)' }}>{label}</span>
      {children}
    </label>
  )
}

function Input(props) {
  return (
    <input
      {...props}
      className="w-full px-3 py-3 border text-[14px] outline-none"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
    />
  )
}

function Textarea(props) {
  return (
    <textarea
      {...props}
      className="w-full px-3 py-3 border text-[14px] outline-none min-h-[120px]"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
    />
  )
}

export default function AdminDashboardPage() {
  const navigate = useNavigate()
  const { currentUser, showToast } = useApp()
  const [loading, setLoading] = useState(true)
  const [overview, setOverview] = useState(null)
  const [applications, setApplications] = useState([])
  const [users, setUsers] = useState([])
  const [contents, setContents] = useState([])
  const [artworks, setArtworks] = useState([])
  const [orders, setOrders] = useState([])
  const [contentForm, setContentForm] = useState(initialContentForm)
  const [editingContentId, setEditingContentId] = useState('')
  const [artworkForm, setArtworkForm] = useState(initialArtworkForm)
  const [editingArtworkId, setEditingArtworkId] = useState('')

  const approvedArtists = useMemo(
    () => users.filter(user => user.role === 'artist' && user.artistStatus === 'approved'),
    [users],
  )

  async function loadDashboard() {
    setLoading(true)
    try {
      const [overviewPayload, applicationsPayload, usersPayload, contentsPayload, artworksPayload, ordersPayload] = await Promise.all([
        getAdminOverview(),
        getAdminApplications(),
        getAdminUsers(),
        getAdminContents(),
        getAdminArtworks(),
        getAdminOrders(),
      ])

      setOverview(overviewPayload.counts || null)
      setApplications(applicationsPayload.applications || [])
      setUsers(usersPayload.users || [])
      setContents(contentsPayload.contents || [])
      setArtworks(artworksPayload.artworks || [])
      setOrders(ordersPayload.orders || [])
    } catch (error) {
      showToast(error instanceof Error ? error.message : '管理员数据加载失败。')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      loadDashboard()
    } else {
      setLoading(false)
    }
  }, [currentUser])

  if (!currentUser) {
    return (
      <div className="px-4 pt-6 pb-24">
        <SectionCard title="管理员后台">
          <p className="text-[14px] leading-7 mb-4" style={{ color: 'var(--text-muted)' }}>
            请先使用管理员账号登录后再访问后台。
          </p>
          <button onClick={() => navigate('/login')} className="px-5 py-3 text-[13px] font-medium" style={{ background: 'var(--text)', color: 'white' }}>
            前往登录
          </button>
        </SectionCard>
      </div>
    )
  }

  if (currentUser.role !== 'admin') {
    return (
      <div className="px-4 pt-6 pb-24">
        <SectionCard title="管理员后台">
          <p className="text-[14px] leading-7" style={{ color: 'var(--text-muted)' }}>
            当前账号没有管理员权限。
          </p>
        </SectionCard>
      </div>
    )
  }

  const handleReview = async (userId, artistStatus) => {
    try {
      await reviewArtistApplication(userId, artistStatus)
      showToast(artistStatus === 'approved' ? '已通过入驻申请' : '已驳回入驻申请')
      loadDashboard()
    } catch (error) {
      showToast(error instanceof Error ? error.message : '审核失败，请稍后再试。')
    }
  }

  const handleDeleteUser = async (userId) => {
    try {
      await deleteAdminUser(userId)
      showToast('用户已删除')
      loadDashboard()
    } catch (error) {
      showToast(error instanceof Error ? error.message : '删除用户失败，请稍后再试。')
    }
  }

  const submitContent = async (event) => {
    event.preventDefault()

    const payload = {
      kind: contentForm.kind,
      title: contentForm.title,
      cover: contentForm.cover,
      dateLabel: contentForm.dateLabel,
      author: contentForm.author,
      location: contentForm.location,
      tag: contentForm.tag,
      summary: contentForm.summary,
      sections: contentForm.sectionsText.split('\n').map(item => item.trim()).filter(Boolean),
      images: contentForm.imagesText.split('\n').map(item => item.trim()).filter(Boolean),
      published: true,
    }

    try {
      if (editingContentId) {
        await updateAdminContent(editingContentId, payload)
        showToast('文章已更新')
      } else {
        await createAdminContent(payload)
        showToast('文章已发布')
      }

      setEditingContentId('')
      setContentForm(initialContentForm)
      loadDashboard()
    } catch (error) {
      showToast(error instanceof Error ? error.message : '文章保存失败，请稍后再试。')
    }
  }

  const startEditContent = (content) => {
    setEditingContentId(content.id)
    setContentForm({
      kind: content.kind,
      title: content.title,
      cover: content.cover,
      dateLabel: content.dateLabel,
      author: content.author,
      location: content.location || '',
      tag: content.tag || '',
      summary: content.summary || '',
      sectionsText: (content.sections || []).join('\n'),
      imagesText: (content.images || []).join('\n'),
    })
  }

  const submitArtwork = async (event) => {
    event.preventDefault()

    const payload = {
      artistId: artworkForm.artistId,
      title: artworkForm.title,
      imageUrl: artworkForm.imageUrl,
      price: Number(artworkForm.price),
      stock: Number(artworkForm.stock),
      charitySupportNote: artworkForm.charitySupportNote,
      description: artworkForm.description,
    }

    try {
      if (editingArtworkId) {
        await updateAdminArtwork(editingArtworkId, payload)
        showToast('作品已更新')
      } else {
        await createAdminArtwork(payload)
        showToast('作品已发布')
      }

      setEditingArtworkId('')
      setArtworkForm(initialArtworkForm)
      loadDashboard()
    } catch (error) {
      showToast(error instanceof Error ? error.message : '作品保存失败，请稍后再试。')
    }
  }

  const startEditArtwork = (artwork) => {
    setEditingArtworkId(artwork.id)
    setArtworkForm({
      artistId: artwork.artistId,
      title: artwork.title,
      imageUrl: artwork.imageUrl,
      price: String(artwork.price),
      stock: String(artwork.stock),
      charitySupportNote: artwork.charitySupportNote,
      description: artwork.description || '',
    })
  }

  const handleUpdateOrder = async (orderId, nextData) => {
    try {
      await updateAdminOrder(orderId, nextData)
      showToast('物流信息已更新')
      loadDashboard()
    } catch (error) {
      showToast(error instanceof Error ? error.message : '物流更新失败，请稍后再试。')
    }
  }

  return (
    <div className="px-4 pt-5 pb-24 fade-in space-y-5">
      <div className="flex items-center justify-between gap-3">
        <button onClick={() => navigate('/profile')} className="w-10 h-10 flex items-center justify-center border" style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}>←</button>
        <div className="text-center flex-1">
          <p className="text-[10px] tracking-[0.28em] uppercase" style={{ color: 'var(--text-weak)' }}>Admin Dashboard</p>
          <h1 className="text-[24px] font-semibold mt-1" style={{ color: 'var(--text)' }}>美芽集管理后台</h1>
        </div>
        <button onClick={loadDashboard} className="px-3 py-2 text-[12px] border" style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}>刷新</button>
      </div>

      {loading ? (
        <SectionCard title="正在加载">
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>正在读取管理员数据...</p>
        </SectionCard>
      ) : (
        <>
          <SectionCard title="总览">
            <div className="grid grid-cols-2 gap-3">
              {[
                ['用户总数', overview?.users ?? 0],
                ['待审艺术家', overview?.pendingArtists ?? 0],
                ['文章内容', overview?.contents ?? 0],
                ['订单数', overview?.orders ?? 0],
              ].map(([label, value]) => (
                <div key={label} className="border px-3 py-4" style={{ borderColor: 'var(--border)' }}>
                  <div className="text-[24px] font-semibold" style={{ color: 'var(--text)' }}>{value}</div>
                  <div className="text-[12px] mt-1" style={{ color: 'var(--text-muted)' }}>{label}</div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="艺术家入驻审核">
            <div className="space-y-3">
              {applications.length === 0 ? (
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>当前没有待处理申请。</p>
              ) : applications.map(user => (
                <div key={user.id} className="border p-3" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[15px] font-semibold" style={{ color: 'var(--text)' }}>{user.realName || user.username || user.email}</p>
                      <p className="text-[12px] mt-1" style={{ color: 'var(--text-muted)' }}>{user.email}</p>
                      <p className="text-[12px] mt-2 leading-6" style={{ color: 'var(--text-muted)' }}>{user.bio || user.artistIntro || '暂无申请说明'}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => handleReview(user.id, 'approved')} className="px-3 py-2 text-[12px]" style={{ background: 'var(--text)', color: 'white' }}>通过</button>
                      <button onClick={() => handleReview(user.id, 'rejected')} className="px-3 py-2 text-[12px] border" style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>驳回</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="用户管理">
            <div className="space-y-3">
              {users.map(user => (
                <div key={user.id} className="border p-3 flex items-center justify-between gap-3" style={{ borderColor: 'var(--border)' }}>
                  <div className="min-w-0">
                    <p className="text-[14px] font-semibold" style={{ color: 'var(--text)' }}>
                      {user.realName || user.username || user.email}
                    </p>
                    <p className="text-[12px] mt-1" style={{ color: 'var(--text-muted)' }}>
                      {user.role} · {user.artistStatus || '无申请状态'} · {user.email}
                    </p>
                  </div>
                  {user.id !== currentUser.id && (
                    <button onClick={() => handleDeleteUser(user.id)} className="px-3 py-2 text-[12px] border shrink-0" style={{ borderColor: 'rgba(201,143,134,0.5)', color: '#8A5B52' }}>
                      删除
                    </button>
                  )}
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="发布 / 修改文章" extra={editingContentId ? <button onClick={() => { setEditingContentId(''); setContentForm(initialContentForm) }} className="text-[12px]" style={{ color: 'var(--text-weak)' }}>取消编辑</button> : null}>
            <form onSubmit={submitContent} className="space-y-3">
              <Field label="内容类型">
                <select value={contentForm.kind} onChange={(event) => setContentForm(prev => ({ ...prev, kind: event.target.value }))} className="w-full px-3 py-3 border text-[14px] outline-none" style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}>
                  <option value="activity">公益活动文章</option>
                  <option value="project">公益项目文章</option>
                </select>
              </Field>
              <Field label="标题"><Input value={contentForm.title} onChange={(event) => setContentForm(prev => ({ ...prev, title: event.target.value }))} /></Field>
              <Field label="封面图 URL"><Input value={contentForm.cover} onChange={(event) => setContentForm(prev => ({ ...prev, cover: event.target.value }))} /></Field>
              <Field label="发布日期"><Input value={contentForm.dateLabel} onChange={(event) => setContentForm(prev => ({ ...prev, dateLabel: event.target.value }))} /></Field>
              <Field label="作者"><Input value={contentForm.author} onChange={(event) => setContentForm(prev => ({ ...prev, author: event.target.value }))} /></Field>
              <Field label="地点"><Input value={contentForm.location} onChange={(event) => setContentForm(prev => ({ ...prev, location: event.target.value }))} /></Field>
              <Field label="标签"><Input value={contentForm.tag} onChange={(event) => setContentForm(prev => ({ ...prev, tag: event.target.value }))} /></Field>
              <Field label="摘要"><Textarea value={contentForm.summary} onChange={(event) => setContentForm(prev => ({ ...prev, summary: event.target.value }))} /></Field>
              <Field label="正文段落">
                <Textarea value={contentForm.sectionsText} onChange={(event) => setContentForm(prev => ({ ...prev, sectionsText: event.target.value }))} placeholder="每一段单独换行" />
              </Field>
              <Field label="正文图片 URL">
                <Textarea value={contentForm.imagesText} onChange={(event) => setContentForm(prev => ({ ...prev, imagesText: event.target.value }))} placeholder="每一行一张图片 URL" />
              </Field>
              <button type="submit" className="w-full py-3 text-[14px] font-medium" style={{ background: 'var(--text)', color: 'white' }}>
                {editingContentId ? '保存文章修改' : '发布文章'}
              </button>
            </form>

            <div className="space-y-3 mt-5">
              {contents.map(content => (
                <div key={content.id} className="border p-3" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[14px] font-semibold" style={{ color: 'var(--text)' }}>{content.title}</p>
                      <p className="text-[12px] mt-1" style={{ color: 'var(--text-muted)' }}>{content.kind} · {content.dateLabel} · {content.author}</p>
                    </div>
                    <button onClick={() => startEditContent(content)} className="px-3 py-2 text-[12px] border shrink-0" style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>
                      编辑
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="发布 / 修改艺术作品" extra={editingArtworkId ? <button onClick={() => { setEditingArtworkId(''); setArtworkForm(initialArtworkForm) }} className="text-[12px]" style={{ color: 'var(--text-weak)' }}>取消编辑</button> : null}>
            <form onSubmit={submitArtwork} className="space-y-3">
              <Field label="归属艺术家">
                <select value={artworkForm.artistId} onChange={(event) => setArtworkForm(prev => ({ ...prev, artistId: event.target.value }))} className="w-full px-3 py-3 border text-[14px] outline-none" style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}>
                  <option value="">请选择艺术家</option>
                  {approvedArtists.map(artist => (
                    <option key={artist.id} value={artist.id}>
                      {artist.realName || artist.username || artist.email}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="作品名称"><Input value={artworkForm.title} onChange={(event) => setArtworkForm(prev => ({ ...prev, title: event.target.value }))} /></Field>
              <Field label="作品图片 URL"><Input value={artworkForm.imageUrl} onChange={(event) => setArtworkForm(prev => ({ ...prev, imageUrl: event.target.value }))} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="价格"><Input type="number" value={artworkForm.price} onChange={(event) => setArtworkForm(prev => ({ ...prev, price: event.target.value }))} /></Field>
                <Field label="库存"><Input type="number" value={artworkForm.stock} onChange={(event) => setArtworkForm(prev => ({ ...prev, stock: event.target.value }))} /></Field>
              </div>
              <Field label="公益说明"><Textarea value={artworkForm.charitySupportNote} onChange={(event) => setArtworkForm(prev => ({ ...prev, charitySupportNote: event.target.value }))} /></Field>
              <Field label="作品描述"><Textarea value={artworkForm.description} onChange={(event) => setArtworkForm(prev => ({ ...prev, description: event.target.value }))} /></Field>
              <button type="submit" className="w-full py-3 text-[14px] font-medium" style={{ background: 'var(--text)', color: 'white' }}>
                {editingArtworkId ? '保存作品修改' : '发布作品'}
              </button>
            </form>

            <div className="space-y-3 mt-5">
              {artworks.map(artwork => (
                <div key={artwork.id} className="border p-3" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[14px] font-semibold" style={{ color: 'var(--text)' }}>{artwork.title}</p>
                      <p className="text-[12px] mt-1" style={{ color: 'var(--text-muted)' }}>{artwork.artistName} · ¥{Number(artwork.price).toLocaleString()} · 库存 {artwork.stock}</p>
                    </div>
                    <button onClick={() => startEditArtwork(artwork)} className="px-3 py-2 text-[12px] border shrink-0" style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>
                      编辑
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="订单物流管理">
            <div className="space-y-3">
              {orders.map(order => (
                <div key={order.id} className="border p-3" style={{ borderColor: 'var(--border)' }}>
                  <p className="text-[14px] font-semibold" style={{ color: 'var(--text)' }}>{order.orderNo}</p>
                  <p className="text-[12px] mt-1" style={{ color: 'var(--text-muted)' }}>
                    {order.buyerName} · {order.buyerEmail} · ¥{Number(order.total).toLocaleString()} · {order.status}
                  </p>
                  <div className="grid grid-cols-1 gap-2 mt-3">
                    <Input placeholder="物流公司" defaultValue={order.logisticsCompany || ''} onBlur={(event) => handleUpdateOrder(order.id, { logisticsCompany: event.target.value })} />
                    <Input placeholder="物流单号" defaultValue={order.logisticsNumber || ''} onBlur={(event) => handleUpdateOrder(order.id, { logisticsNumber: event.target.value })} />
                    <Textarea placeholder="物流备注" defaultValue={order.trackingNote || ''} onBlur={(event) => handleUpdateOrder(order.id, { trackingNote: event.target.value })} />
                    <select defaultValue={order.statusCode} onChange={(event) => handleUpdateOrder(order.id, { status: event.target.value })} className="w-full px-3 py-3 border text-[14px] outline-none" style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}>
                      <option value="pending_payment">待付款</option>
                      <option value="pending_shipment">待发货</option>
                      <option value="in_transit">运输中</option>
                      <option value="completed">已完成</option>
                      <option value="cancelled">已取消</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </>
      )}
    </div>
  )
}
