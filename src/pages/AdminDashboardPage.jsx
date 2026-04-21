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

function SurfaceCard({ children, className = '', style = {} }) {
  return (
    <section
      className={`border ${className}`}
      style={{
        background: 'rgba(251,248,244,0.95)',
        borderColor: 'rgba(224,214,202,0.96)',
        ...style,
      }}
    >
      {children}
    </section>
  )
}

function SectionCard({ title, intro, extra, children }) {
  return (
    <SurfaceCard className="p-4 md:p-5">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <p className="text-[11px] tracking-[0.24em] uppercase" style={{ color: 'var(--text-weak)' }}>
            Admin Workspace
          </p>
          <h2 className="text-[20px] font-semibold mt-1" style={{ color: 'var(--text)' }}>
            {title}
          </h2>
          {intro && (
            <p className="text-[13px] mt-2 leading-6 max-w-[560px]" style={{ color: 'var(--text-muted)' }}>
              {intro}
            </p>
          )}
        </div>
        {extra}
      </div>
      {children}
    </SurfaceCard>
  )
}

function Field({ label, hint, children }) {
  return (
    <label className="block">
      <div className="flex items-center justify-between gap-3 mb-2">
        <span className="text-[12px]" style={{ color: 'var(--text-muted)' }}>
          {label}
        </span>
        {hint ? (
          <span className="text-[11px]" style={{ color: 'var(--text-weak)' }}>
            {hint}
          </span>
        ) : null}
      </div>
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

function Select(props) {
  return (
    <select
      {...props}
      className="w-full px-3 py-3 border text-[14px] outline-none"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
    />
  )
}

function SummaryCard({ label, value, detail }) {
  return (
    <div className="border px-4 py-4 min-h-[108px] flex flex-col justify-between" style={{ borderColor: 'rgba(214,201,187,0.95)' }}>
      <div className="text-[11px] tracking-[0.18em] uppercase" style={{ color: 'var(--text-weak)' }}>
        {label}
      </div>
      <div>
        <div className="text-[28px] font-semibold leading-none" style={{ color: 'var(--text)' }}>
          {value}
        </div>
        <p className="text-[12px] mt-3 leading-5" style={{ color: 'var(--text-muted)' }}>
          {detail}
        </p>
      </div>
    </div>
  )
}

function TabButton({ active, label, note, count, onClick }) {
  return (
    <button
      onClick={onClick}
      className="border px-4 py-3 text-left min-w-[132px] transition-colors"
      style={{
        background: active ? 'rgba(38, 46, 56, 0.96)' : 'rgba(251,248,244,0.92)',
        borderColor: active ? 'rgba(38, 46, 56, 0.96)' : 'rgba(214,201,187,0.95)',
        color: active ? '#F6F0E7' : 'var(--text)',
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-[14px] font-medium">{label}</span>
        {typeof count === 'number' ? (
          <span
            className="text-[11px] px-2 py-[3px]"
            style={{
              background: active ? 'rgba(246,240,231,0.14)' : 'rgba(197,162,144,0.14)',
              color: active ? '#F6F0E7' : '#8A5B52',
            }}
          >
            {count}
          </span>
        ) : null}
      </div>
      <div className="text-[11px] mt-2 leading-5" style={{ color: active ? 'rgba(246,240,231,0.75)' : 'var(--text-weak)' }}>
        {note}
      </div>
    </button>
  )
}

function MetaPill({ children, tone = 'default' }) {
  const tones = {
    default: {
      background: 'rgba(197,162,144,0.14)',
      color: '#8A5B52',
    },
    dark: {
      background: 'rgba(38,46,56,0.08)',
      color: '#2C3440',
    },
    success: {
      background: 'rgba(84,119,94,0.12)',
      color: '#54775E',
    },
    warn: {
      background: 'rgba(167,110,76,0.12)',
      color: '#A76E4C',
    },
  }

  return (
    <span className="inline-flex px-2 py-1 text-[11px]" style={tones[tone]}>
      {children}
    </span>
  )
}

function ActionButton({ children, onClick, variant = 'primary', className = '', type = 'button' }) {
  const styles = {
    primary: {
      background: 'var(--text)',
      color: 'white',
      borderColor: 'var(--text)',
    },
    secondary: {
      background: 'var(--surface)',
      color: 'var(--text)',
      borderColor: 'var(--border)',
    },
    danger: {
      background: 'rgba(201,143,134,0.1)',
      color: '#8A5B52',
      borderColor: 'rgba(201,143,134,0.45)',
    },
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={`border px-4 py-3 text-[13px] ${className}`}
      style={styles[variant]}
    >
      {children}
    </button>
  )
}

function formatRoleLabel(user) {
  if (user.role === 'admin') return '管理员'
  if (user.role === 'artist' && user.artistStatus === 'approved') return '已认证艺术家'
  if (user.role === 'artist' && user.artistStatus === 'pending') return '待审核艺术家'
  if (user.role === 'artist' && user.artistStatus === 'rejected') return '驳回艺术家'
  return '普通会员'
}

function tabLabelForContent(kind) {
  return kind === 'project' ? '公益项目' : '公益活动'
}

const tabMeta = {
  review: {
    label: '审核',
    note: '处理艺术家入驻申请与用户权限',
  },
  articles: {
    label: '文章编辑',
    note: '发布和更新公益文章内容',
  },
  artworks: {
    label: '作品管理',
    note: '配置艺术家作品与售卖说明',
  },
  orders: {
    label: '订单物流',
    note: '维护购买状态与物流单号',
  },
  users: {
    label: '用户管理',
    note: '查看成员结构并清理账号',
  },
}

export default function AdminDashboardPage() {
  const navigate = useNavigate()
  const { currentUser, showToast } = useApp()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('review')
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

  const memberCount = useMemo(
    () => users.filter(user => user.role === 'member').length,
    [users],
  )

  const adminCount = useMemo(
    () => users.filter(user => user.role === 'admin').length,
    [users],
  )

  const pendingApplications = useMemo(
    () => applications.filter(user => user.artistStatus === 'pending'),
    [applications],
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
      showToast(error instanceof Error ? error.message : '管理员数据加载失败，请稍后再试。')
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
        <SectionCard title="管理员后台" intro="请先使用管理员账号登录后再进入后台工作台。">
          <ActionButton onClick={() => navigate('/login')}>前往登录</ActionButton>
        </SectionCard>
      </div>
    )
  }

  if (currentUser.role !== 'admin') {
    return (
      <div className="px-4 pt-6 pb-24">
        <SectionCard title="管理员后台" intro="当前账号没有管理员权限，仅管理员可以进入此页面。">
          <ActionButton onClick={() => navigate('/profile')} variant="secondary">返回我的页面</ActionButton>
        </SectionCard>
      </div>
    )
  }

  const handleReview = async (userId, artistStatus) => {
    try {
      await reviewArtistApplication(userId, artistStatus)
      showToast(artistStatus === 'approved' ? '已通过艺术家申请' : '已驳回艺术家申请')
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

  const resetContentForm = () => {
    setEditingContentId('')
    setContentForm(initialContentForm)
  }

  const resetArtworkForm = () => {
    setEditingArtworkId('')
    setArtworkForm(initialArtworkForm)
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

      resetContentForm()
      loadDashboard()
    } catch (error) {
      showToast(error instanceof Error ? error.message : '文章保存失败，请稍后再试。')
    }
  }

  const startEditContent = (content) => {
    setActiveTab('articles')
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

      resetArtworkForm()
      loadDashboard()
    } catch (error) {
      showToast(error instanceof Error ? error.message : '作品保存失败，请稍后再试。')
    }
  }

  const startEditArtwork = (artwork) => {
    setActiveTab('artworks')
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
      showToast('订单物流已更新')
      loadDashboard()
    } catch (error) {
      showToast(error instanceof Error ? error.message : '物流更新失败，请稍后再试。')
    }
  }

  const tabCounts = {
    review: pendingApplications.length,
    articles: contents.length,
    artworks: artworks.length,
    orders: orders.length,
    users: users.length,
  }

  const renderReviewTab = () => (
    <div className="space-y-5">
      <SectionCard
        title="艺术家申请审核"
        intro="优先处理待审核申请。通过后，艺术家即可进入专属后台发布和维护作品。"
        extra={<MetaPill tone="warn">待处理 {pendingApplications.length}</MetaPill>}
      >
        <div className="space-y-3">
          {applications.length === 0 ? (
            <p className="text-[14px] leading-7" style={{ color: 'var(--text-muted)' }}>
              当前没有待处理的艺术家申请。
            </p>
          ) : applications.map(user => (
            <div key={user.id} className="border p-4" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[16px] font-semibold" style={{ color: 'var(--text)' }}>
                      {user.realName || user.username || user.email}
                    </p>
                    <MetaPill tone={user.artistStatus === 'pending' ? 'warn' : 'default'}>
                      {user.artistStatus === 'pending' ? '待审核' : user.artistStatus === 'rejected' ? '已驳回' : '申请中'}
                    </MetaPill>
                  </div>
                  <p className="text-[12px] mt-2" style={{ color: 'var(--text-muted)' }}>
                    {user.email}
                  </p>
                  <p className="text-[13px] leading-6 mt-3" style={{ color: 'var(--text-muted)' }}>
                    {user.bio || user.artistIntro || '暂无申请说明'}
                  </p>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <ActionButton onClick={() => handleReview(user.id, 'approved')} className="min-w-[92px]">
                    通过
                  </ActionButton>
                  <ActionButton onClick={() => handleReview(user.id, 'rejected')} variant="secondary" className="min-w-[92px]">
                    驳回
                  </ActionButton>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="角色与结构"
        intro="这里快速查看当前平台成员结构，便于判断内容供给和运营负荷。"
      >
        <div className="grid grid-cols-2 gap-3">
          <SummaryCard label="普通会员" value={memberCount} detail="已注册，可浏览、收藏、购买并申请成为艺术家。" />
          <SummaryCard label="认证艺术家" value={approvedArtists.length} detail="已通过审核，可在后台维护自己的作品。" />
          <SummaryCard label="管理员" value={adminCount} detail="拥有审核、发布、编辑、订单与用户管理权限。" />
          <SummaryCard label="待审核" value={pendingApplications.length} detail="当前仍需平台处理的艺术家入驻申请数量。" />
        </div>
      </SectionCard>
    </div>
  )

  const renderArticlesTab = () => (
    <div className="space-y-5">
      <SectionCard
        title={editingContentId ? '编辑公益文章' : '发布公益文章'}
        intro="统一维护公益活动与公益项目内容，确保前台展示全部来自当前可用文章。"
        extra={editingContentId ? (
          <ActionButton onClick={resetContentForm} variant="secondary" className="px-3 py-2 text-[12px]">
            取消编辑
          </ActionButton>
        ) : <MetaPill>{contents.length} 篇文章</MetaPill>}
      >
        <form onSubmit={submitContent} className="space-y-3">
          <Field label="内容类型">
            <Select value={contentForm.kind} onChange={(event) => setContentForm(prev => ({ ...prev, kind: event.target.value }))}>
              <option value="activity">公益活动文章</option>
              <option value="project">公益项目文章</option>
            </Select>
          </Field>
          <Field label="标题">
            <Input value={contentForm.title} onChange={(event) => setContentForm(prev => ({ ...prev, title: event.target.value }))} />
          </Field>
          <Field label="封面图片 URL">
            <Input value={contentForm.cover} onChange={(event) => setContentForm(prev => ({ ...prev, cover: event.target.value }))} />
          </Field>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="发布日期">
              <Input value={contentForm.dateLabel} onChange={(event) => setContentForm(prev => ({ ...prev, dateLabel: event.target.value }))} />
            </Field>
            <Field label="作者">
              <Input value={contentForm.author} onChange={(event) => setContentForm(prev => ({ ...prev, author: event.target.value }))} />
            </Field>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="地点">
              <Input value={contentForm.location} onChange={(event) => setContentForm(prev => ({ ...prev, location: event.target.value }))} />
            </Field>
            <Field label="标签">
              <Input value={contentForm.tag} onChange={(event) => setContentForm(prev => ({ ...prev, tag: event.target.value }))} />
            </Field>
          </div>
          <Field label="摘要">
            <Textarea value={contentForm.summary} onChange={(event) => setContentForm(prev => ({ ...prev, summary: event.target.value }))} />
          </Field>
          <Field label="正文段落" hint="每行代表一个段落">
            <Textarea value={contentForm.sectionsText} onChange={(event) => setContentForm(prev => ({ ...prev, sectionsText: event.target.value }))} />
          </Field>
          <Field label="正文图片 URL" hint="每行一张图片链接">
            <Textarea value={contentForm.imagesText} onChange={(event) => setContentForm(prev => ({ ...prev, imagesText: event.target.value }))} />
          </Field>
          <ActionButton type="submit" className="w-full">
            {editingContentId ? '保存文章修改' : '发布文章'}
          </ActionButton>
        </form>
      </SectionCard>

      <SectionCard title="文章列表" intro="点击任意文章即可带入上方表单继续编辑。">
        <div className="space-y-3">
          {contents.length === 0 ? (
            <p className="text-[14px] leading-7" style={{ color: 'var(--text-muted)' }}>
              当前还没有文章内容。
            </p>
          ) : contents.map(content => (
            <button
              key={content.id}
              onClick={() => startEditContent(content)}
              className="w-full border p-4 text-left"
              style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[15px] font-semibold" style={{ color: 'var(--text)' }}>
                      {content.title}
                    </p>
                    <MetaPill>{tabLabelForContent(content.kind)}</MetaPill>
                  </div>
                  <p className="text-[12px] mt-2" style={{ color: 'var(--text-muted)' }}>
                    {content.dateLabel} · {content.author}
                  </p>
                  {content.summary ? (
                    <p className="text-[13px] mt-3 leading-6" style={{ color: 'var(--text-muted)' }}>
                      {content.summary}
                    </p>
                  ) : null}
                </div>
                <MetaPill tone="dark">编辑</MetaPill>
              </div>
            </button>
          ))}
        </div>
      </SectionCard>
    </div>
  )

  const renderArtworksTab = () => (
    <div className="space-y-5">
      <SectionCard
        title={editingArtworkId ? '编辑艺术作品' : '发布艺术作品'}
        intro="由管理员统一补充或修订作品资料，公益说明会同步用于作品详情页与销售说明。"
        extra={editingArtworkId ? (
          <ActionButton onClick={resetArtworkForm} variant="secondary" className="px-3 py-2 text-[12px]">
            取消编辑
          </ActionButton>
        ) : <MetaPill tone="success">已上架 {artworks.length}</MetaPill>}
      >
        <form onSubmit={submitArtwork} className="space-y-3">
          <Field label="所属艺术家">
            <Select value={artworkForm.artistId} onChange={(event) => setArtworkForm(prev => ({ ...prev, artistId: event.target.value }))}>
              <option value="">请选择艺术家</option>
              {approvedArtists.map(artist => (
                <option key={artist.id} value={artist.id}>
                  {artist.realName || artist.username || artist.email}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="作品名称">
            <Input value={artworkForm.title} onChange={(event) => setArtworkForm(prev => ({ ...prev, title: event.target.value }))} />
          </Field>
          <Field label="作品图片 URL">
            <Input value={artworkForm.imageUrl} onChange={(event) => setArtworkForm(prev => ({ ...prev, imageUrl: event.target.value }))} />
          </Field>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="价格">
              <Input type="number" value={artworkForm.price} onChange={(event) => setArtworkForm(prev => ({ ...prev, price: event.target.value }))} />
            </Field>
            <Field label="库存">
              <Input type="number" value={artworkForm.stock} onChange={(event) => setArtworkForm(prev => ({ ...prev, stock: event.target.value }))} />
            </Field>
          </div>
          <Field label="公益说明" hint="说明收益如何支持乡村美育">
            <Textarea value={artworkForm.charitySupportNote} onChange={(event) => setArtworkForm(prev => ({ ...prev, charitySupportNote: event.target.value }))} />
          </Field>
          <Field label="作品描述">
            <Textarea value={artworkForm.description} onChange={(event) => setArtworkForm(prev => ({ ...prev, description: event.target.value }))} />
          </Field>
          <ActionButton type="submit" className="w-full">
            {editingArtworkId ? '保存作品修改' : '发布作品'}
          </ActionButton>
        </form>
      </SectionCard>

      <SectionCard title="作品列表" intro="以更清晰的卡片方式查看价格、库存和艺术家归属。">
        <div className="grid grid-cols-1 gap-3">
          {artworks.length === 0 ? (
            <p className="text-[14px] leading-7" style={{ color: 'var(--text-muted)' }}>
              当前还没有作品数据。
            </p>
          ) : artworks.map(artwork => (
            <div key={artwork.id} className="border p-4" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[15px] font-semibold" style={{ color: 'var(--text)' }}>
                      {artwork.title}
                    </p>
                    <MetaPill tone="success">{artwork.artistName}</MetaPill>
                  </div>
                  <p className="text-[12px] mt-2" style={{ color: 'var(--text-muted)' }}>
                    ￥{Number(artwork.price).toLocaleString()} · 库存 {artwork.stock}
                  </p>
                  <p className="text-[13px] mt-3 leading-6" style={{ color: 'var(--text-muted)' }}>
                    {artwork.charitySupportNote}
                  </p>
                </div>
                <ActionButton onClick={() => startEditArtwork(artwork)} variant="secondary" className="px-3 py-2 text-[12px] shrink-0">
                  编辑
                </ActionButton>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  )

  const renderOrdersTab = () => (
    <div className="space-y-5">
      <SectionCard title="订单与物流" intro="管理员可在这里维护物流公司、物流单号、物流备注，以及订单状态。">
        <div className="space-y-3">
          {orders.length === 0 ? (
            <p className="text-[14px] leading-7" style={{ color: 'var(--text-muted)' }}>
              当前还没有订单。
            </p>
          ) : orders.map(order => (
            <div key={order.id} className="border p-4" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[15px] font-semibold" style={{ color: 'var(--text)' }}>
                    {order.orderNo}
                  </p>
                  <p className="text-[12px] mt-2" style={{ color: 'var(--text-muted)' }}>
                    {order.buyerName} · {order.buyerEmail} · ￥{Number(order.total).toLocaleString()}
                  </p>
                </div>
                <MetaPill tone="dark">{order.status}</MetaPill>
              </div>
              <div className="grid grid-cols-1 gap-2 mt-4">
                <Input placeholder="物流公司" defaultValue={order.logisticsCompany || ''} onBlur={(event) => handleUpdateOrder(order.id, { logisticsCompany: event.target.value })} />
                <Input placeholder="物流单号" defaultValue={order.logisticsNumber || ''} onBlur={(event) => handleUpdateOrder(order.id, { logisticsNumber: event.target.value })} />
                <Textarea placeholder="物流备注" defaultValue={order.trackingNote || ''} onBlur={(event) => handleUpdateOrder(order.id, { trackingNote: event.target.value })} />
                <Select defaultValue={order.statusCode} onChange={(event) => handleUpdateOrder(order.id, { status: event.target.value })}>
                  <option value="pending_payment">待付款</option>
                  <option value="pending_shipment">待发货</option>
                  <option value="in_transit">运输中</option>
                  <option value="completed">已完成</option>
                  <option value="cancelled">已取消</option>
                </Select>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  )

  const renderUsersTab = () => (
    <div className="space-y-5">
      <SectionCard title="用户管理" intro="查看当前所有用户的身份状态，并按需删除无效或不再需要的账号。">
        <div className="space-y-3">
          {users.map(user => (
            <div key={user.id} className="border p-4 flex items-start justify-between gap-4" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[15px] font-semibold" style={{ color: 'var(--text)' }}>
                    {user.realName || user.username || user.email}
                  </p>
                  <MetaPill tone={user.role === 'admin' ? 'dark' : user.role === 'artist' ? 'success' : 'default'}>
                    {formatRoleLabel(user)}
                  </MetaPill>
                </div>
                <p className="text-[12px] mt-2" style={{ color: 'var(--text-muted)' }}>
                  {user.email}
                </p>
              </div>
              {user.id !== currentUser.id ? (
                <ActionButton onClick={() => handleDeleteUser(user.id)} variant="danger" className="shrink-0">
                  删除
                </ActionButton>
              ) : (
                <MetaPill tone="dark">当前账号</MetaPill>
              )}
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  )

  return (
    <div className="px-4 pt-5 pb-24 fade-in space-y-5">
      <SurfaceCard
        className="p-4 md:p-5 overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, rgba(247,242,235,0.96) 0%, rgba(239,231,220,0.96) 42%, rgba(233,223,210,0.96) 100%)',
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <button
            onClick={() => navigate('/profile')}
            className="w-10 h-10 flex items-center justify-center border shrink-0"
            style={{ background: 'rgba(255,255,255,0.5)', borderColor: 'rgba(214,201,187,0.95)', color: 'var(--text)' }}
          >
            ←
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] tracking-[0.34em] uppercase" style={{ color: 'var(--text-weak)' }}>
              Meiyaji Control Room
            </p>
            <h1 className="text-[25px] font-semibold mt-2 leading-tight" style={{ color: 'var(--text)' }}>
              美芽集管理员后台
            </h1>
            <p className="text-[13px] leading-6 mt-3 max-w-[620px]" style={{ color: 'var(--text-muted)' }}>
              将审核、内容、作品、订单与用户管理拆分成独立工作台，让后台更像一套清晰的运营面板，而不是一条冗长的信息流。
            </p>
          </div>
          <ActionButton onClick={loadDashboard} variant="secondary" className="shrink-0 px-3 py-2 text-[12px]">
            刷新
          </ActionButton>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-5">
          <SummaryCard label="平台用户" value={overview?.users ?? 0} detail="当前平台已注册并可参与浏览、购买或申请入驻的总人数。" />
          <SummaryCard label="待审核申请" value={overview?.pendingArtists ?? 0} detail="需要平台尽快处理的艺术家入驻申请数量。" />
          <SummaryCard label="公益文章" value={overview?.contents ?? 0} detail="已进入数据库、可被前台调用展示的文章内容数。" />
          <SummaryCard label="订单记录" value={overview?.orders ?? 0} detail="已产生的购买订单，可继续填写物流与状态。" />
        </div>
      </SurfaceCard>

      {loading ? (
        <SectionCard title="正在加载" intro="正在读取管理员工作台数据，请稍候。">
          <p className="text-[14px]" style={{ color: 'var(--text-muted)' }}>
            正在同步审核、文章、作品与订单信息...
          </p>
        </SectionCard>
      ) : (
        <>
          <SurfaceCard className="p-3">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {Object.entries(tabMeta).map(([key, meta]) => (
                <TabButton
                  key={key}
                  active={activeTab === key}
                  label={meta.label}
                  note={meta.note}
                  count={tabCounts[key]}
                  onClick={() => setActiveTab(key)}
                />
              ))}
            </div>
          </SurfaceCard>

          {activeTab === 'review' && renderReviewTab()}
          {activeTab === 'articles' && renderArticlesTab()}
          {activeTab === 'artworks' && renderArtworksTab()}
          {activeTab === 'orders' && renderOrdersTab()}
          {activeTab === 'users' && renderUsersTab()}
        </>
      )}
    </div>
  )
}
