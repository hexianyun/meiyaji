import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../App'
import {
  createArtistArtwork,
  getArtistDashboardArtworks,
  unpublishArtistArtwork,
  updateArtistArtwork,
} from '../services/contentApi'

const initialArtworkForm = {
  title: '',
  imageUrl: '',
  price: '',
  stock: '1',
  charitySupportNote: '',
  description: '',
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

async function buildArtworkImageDataUrl(file) {
  const originalDataUrl = await readFileAsDataUrl(file)
  const image = await loadImage(originalDataUrl)
  const maxSide = 1600
  const longestSide = Math.max(image.width, image.height)
  const scale = longestSide > maxSide ? maxSide / longestSide : 1
  const width = Math.max(1, Math.round(image.width * scale))
  const height = Math.max(1, Math.round(image.height * scale))
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error('当前设备暂不支持图片处理，请稍后再试。')
  }

  canvas.width = width
  canvas.height = height
  context.fillStyle = '#f7f2eb'
  context.fillRect(0, 0, width, height)
  context.drawImage(image, 0, 0, width, height)

  const dataUrl = canvas.toDataURL('image/jpeg', 0.86)

  if (dataUrl.length > 7_500_000) {
    throw new Error('图片仍然过大，请换一张更小的图片。')
  }

  return dataUrl
}

function SurfaceCard({ children, className = '', style = {} }) {
  return (
    <section
      className={`p-6 ${className}`}
      style={{
        background: 'var(--surface)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--border)',
        ...style,
      }}
    >
      {children}
    </section>
  )
}

function SectionCard({ title, intro, extra, children }) {
  return (
    <SurfaceCard className="p-5">
      <div className="flex items-start justify-between gap-3 mb-5">
        <div>
          <p className="text-[10px] font-bold tracking-[0.24em] uppercase" style={{ color: 'var(--text-weak)' }}>
            Artist Workspace
          </p>
          <h2 className="text-[20px] font-bold mt-1.5" style={{ color: 'var(--text)' }}>
            {title}
          </h2>
          {intro ? (
            <p className="text-[13px] mt-2.5 leading-relaxed max-w-[560px] font-medium" style={{ color: 'var(--text-muted)' }}>
              {intro}
            </p>
          ) : null}
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
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <span className="text-[12px] font-bold" style={{ color: 'var(--text-muted)' }}>
          {label}
        </span>
        {hint ? (
          <span className="text-[11px] font-medium" style={{ color: 'var(--text-weak)' }}>
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
      className="w-full px-4 py-3.5 text-[14px] outline-none transition-colors"
      style={{ background: 'var(--bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', color: 'var(--text)' }}
    />
  )
}

function Textarea(props) {
  return (
    <textarea
      {...props}
      className="w-full px-4 py-3.5 text-[14px] outline-none transition-colors min-h-[120px]"
      style={{ background: 'var(--bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', color: 'var(--text)' }}
    />
  )
}

function ActionButton({ children, onClick, type = 'button', variant = 'primary', className = '' }) {
  if (variant === 'primary') {
    return (
      <button type={type} onClick={onClick} className={`btn-primary ${className}`}>
        {children}
      </button>
    )
  }
  if (variant === 'secondary') {
    return (
      <button type={type} onClick={onClick} className={`btn-outline ${className}`}>
        {children}
      </button>
    )
  }
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-3 text-[13px] font-medium rounded-full transition-all active:scale-95 border ${className}`}
      style={{ background: 'rgba(201,143,134,0.08)', color: '#8A5B52', borderColor: 'rgba(201,143,134,0.3)' }}
    >
      {children}
    </button>
  )
}

function MetaPill({ children, tone = 'default' }) {
  const tones = {
    default: {
      background: 'rgba(197,162,144,0.14)',
      color: '#8A5B52',
    },
    success: {
      background: 'rgba(84,119,94,0.12)',
      color: '#54775E',
    },
    dark: {
      background: 'var(--text)',
      color: 'white',
    },
    warn: {
      background: 'rgba(167,110,76,0.12)',
      color: '#A76E4C',
    },
  }

  return (
    <span className="inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full" style={tones[tone]}>
      {children}
    </span>
  )
}

function SummaryCard({ label, value, detail }) {
  return (
    <div className="p-4 min-h-[108px] flex flex-col justify-between" style={{ background: 'var(--bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
      <div className="text-[11px] font-bold tracking-[0.18em] uppercase mb-3" style={{ color: 'var(--text-weak)' }}>
        {label}
      </div>
      <div>
        <div className="text-[28px] font-bold leading-none mb-2" style={{ color: 'var(--text)' }}>
          {value}
        </div>
        <p className="text-[12px] leading-relaxed font-medium" style={{ color: 'var(--text-muted)' }}>
          {detail}
        </p>
      </div>
    </div>
  )
}

function inventoryLabel(status) {
  switch (status) {
    case 'in_stock':
      return '可售'
    case 'sold_out':
      return '售罄'
    case 'archived':
      return '已下架'
    default:
      return status || '未设置'
  }
}

export default function ArtistDashboardPage() {
  const navigate = useNavigate()
  const { currentUser, showToast } = useApp()
  const fileInputRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [processingImage, setProcessingImage] = useState(false)
  const [editingArtworkId, setEditingArtworkId] = useState('')
  const [artworkForm, setArtworkForm] = useState(initialArtworkForm)
  const [myWorks, setMyWorks] = useState([])

  const isApprovedArtist = currentUser?.role === 'artist' && currentUser?.artistStatus === 'approved'

  const activeWorks = useMemo(
    () => myWorks.filter(item => item.inventoryStatus !== 'archived').length,
    [myWorks],
  )

  const archivedWorks = useMemo(
    () => myWorks.filter(item => item.inventoryStatus === 'archived').length,
    [myWorks],
  )

  async function loadMyWorks() {
    if (!isApprovedArtist) {
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const artworks = await getArtistDashboardArtworks()
      setMyWorks(artworks)
    } catch (error) {
      showToast(error instanceof Error ? error.message : '作品数据加载失败，请稍后再试。')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMyWorks()
  }, [currentUser?.id, currentUser?.role, currentUser?.artistStatus])

  const resetForm = () => {
    setEditingArtworkId('')
    setArtworkForm(initialArtworkForm)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const startEdit = (artwork) => {
    setEditingArtworkId(artwork.id)
    setArtworkForm({
      title: artwork.title || '',
      imageUrl: artwork.img || artwork.imageUrl || '',
      price: String(artwork.price ?? ''),
      stock: String(artwork.stock ?? 1),
      charitySupportNote: artwork.charitySupportNote || '',
      description: artwork.desc || artwork.description || '',
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePickImage = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) return

    if (!file.type.startsWith('image/')) {
      showToast('请选择 JPG、PNG 或 WEBP 图片')
      return
    }

    if (file.size > 8 * 1024 * 1024) {
      showToast('图片不能超过 8MB')
      return
    }

    setProcessingImage(true)

    try {
      const imageUrl = await buildArtworkImageDataUrl(file)
      setArtworkForm(prev => ({ ...prev, imageUrl }))
      showToast('作品图片已载入')
    } catch (error) {
      showToast(error instanceof Error ? error.message : '图片处理失败，请稍后再试。')
    } finally {
      setProcessingImage(false)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!artworkForm.imageUrl) {
      showToast('请先上传作品图片')
      return
    }

    setSubmitting(true)

    const payload = {
      title: artworkForm.title,
      imageUrl: artworkForm.imageUrl,
      price: Number(artworkForm.price),
      stock: Number(artworkForm.stock),
      charitySupportNote: artworkForm.charitySupportNote,
      description: artworkForm.description,
    }

    try {
      if (editingArtworkId) {
        await updateArtistArtwork(editingArtworkId, payload)
        showToast('作品已更新')
      } else {
        await createArtistArtwork(payload)
        showToast('作品已发布')
      }

      resetForm()
      await loadMyWorks()
    } catch (error) {
      showToast(error instanceof Error ? error.message : '作品保存失败，请稍后再试。')
    } finally {
      setSubmitting(false)
    }
  }

  const handleUnpublish = async (id) => {
    try {
      await unpublishArtistArtwork(id)
      showToast('作品已下架')
      await loadMyWorks()
    } catch (error) {
      showToast(error instanceof Error ? error.message : '作品下架失败，请稍后再试。')
    }
  }

  if (!isApprovedArtist) {
    return (
      <div className="pb-24 px-4 pt-5 fade-in">
        <SectionCard
          title="艺术家后台"
          intro="只有审核通过的艺术家账号，才可以进入作品发布与管理后台。"
          extra={<MetaPill tone="warn">未开放</MetaPill>}
        >
          <ActionButton onClick={() => navigate('/profile')}>返回我的页面</ActionButton>
        </SectionCard>
      </div>
    )
  }

  return (
    <div className="pb-24 px-4 pt-5 fade-in space-y-5">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={handleImageChange}
      />

      <SurfaceCard
        className="p-4 md:p-5 overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, rgba(247,242,235,0.96) 0%, rgba(239,231,220,0.96) 42%, rgba(233,223,210,0.96) 100%)',
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <button
            onClick={() => navigate('/profile')}
            className="w-10 h-10 flex items-center justify-center rounded-full shadow-sm transition-transform active:scale-90 bg-white/50 backdrop-blur"
            style={{ color: 'var(--text)', border: '1px solid var(--border)' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold tracking-[0.34em] uppercase" style={{ color: 'var(--text-weak)' }}>
              Artist Control Room
            </p>
            <h1 className="text-[25px] font-bold mt-2 leading-tight" style={{ color: 'var(--text)' }}>
              艺术家作品后台
            </h1>
            <p className="text-[13px] leading-relaxed mt-3 max-w-[620px] font-medium" style={{ color: 'var(--text-muted)' }}>
              在这里你可以自行发布作品、修改价格与库存、上传作品图片，并管理已经上架的艺术作品。
            </p>
          </div>
          <ActionButton onClick={loadMyWorks} variant="secondary" className="shrink-0">
            刷新
          </ActionButton>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-5">
          <SummaryCard label="我的作品" value={myWorks.length} detail="当前账号名下的全部作品数量，包括已下架作品。" />
          <SummaryCard label="可售作品" value={activeWorks} detail="仍在前台展示并可继续售卖的作品数量。" />
          <SummaryCard label="已下架" value={archivedWorks} detail="已从前台撤下，但仍保留在后台中的作品。" />
          <SummaryCard label="当前身份" value="已认证" detail="你已通过平台审核，可以自行管理和发布作品。" />
        </div>
      </SurfaceCard>

      <SectionCard
        title={editingArtworkId ? '编辑作品' : '发布新作品'}
        intro="每件作品都需要包含名称、图片、价格和公益说明。作品图片现在可以直接上传，不需要再填写链接。"
        extra={editingArtworkId ? (
          <ActionButton onClick={resetForm} variant="secondary" className="px-3 py-2 text-[12px]">
            取消编辑
          </ActionButton>
        ) : <MetaPill tone="success">可自助发布</MetaPill>}
      >
        <form onSubmit={handleSubmit} className="space-y-3">
          <Field label="作品名称">
            <Input value={artworkForm.title} onChange={(event) => setArtworkForm(prev => ({ ...prev, title: event.target.value }))} />
          </Field>

          <Field label="作品图片" hint="支持 JPG / PNG / WEBP">
            <div className="space-y-3">
              <div
                className="p-3"
                style={{ background: 'var(--bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
              >
                {artworkForm.imageUrl ? (
                  <img
                    src={artworkForm.imageUrl}
                    alt="作品预览"
                    className="w-full h-auto block rounded"
                    style={{ maxHeight: '320px', objectFit: 'contain', background: '#f7f2eb' }}
                  />
                ) : (
                  <div
                    className="w-full flex items-center justify-center text-[13px] font-medium"
                    style={{ minHeight: '180px', color: 'var(--text-weak)', background: '#f7f2eb', borderRadius: 'var(--radius-md)' }}
                  >
                    上传后将在这里预览作品图片
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <ActionButton onClick={handlePickImage} variant="secondary" className="flex-1">
                  {processingImage ? '正在处理图片...' : artworkForm.imageUrl ? '更换图片' : '上传图片'}
                </ActionButton>
                {artworkForm.imageUrl ? (
                  <ActionButton onClick={() => setArtworkForm(prev => ({ ...prev, imageUrl: '' }))} variant="danger" className="px-4">
                    删除图片
                  </ActionButton>
                ) : null}
              </div>
            </div>
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="价格">
              <Input type="number" min="0" step="0.01" value={artworkForm.price} onChange={(event) => setArtworkForm(prev => ({ ...prev, price: event.target.value }))} />
            </Field>
            <Field label="库存">
              <Input type="number" min="0" step="1" value={artworkForm.stock} onChange={(event) => setArtworkForm(prev => ({ ...prev, stock: event.target.value }))} />
            </Field>
          </div>
          <Field label="公益说明" hint="至少写清楚这件作品如何支持乡村美育">
            <Textarea value={artworkForm.charitySupportNote} onChange={(event) => setArtworkForm(prev => ({ ...prev, charitySupportNote: event.target.value }))} />
          </Field>
          <Field label="作品描述">
            <Textarea value={artworkForm.description} onChange={(event) => setArtworkForm(prev => ({ ...prev, description: event.target.value }))} />
          </Field>
          <ActionButton type="submit" className="w-full" variant="primary">
            {submitting ? '正在保存...' : editingArtworkId ? '保存作品修改' : '发布作品'}
          </ActionButton>
        </form>
      </SectionCard>

      <SectionCard title="我的作品列表" intro="可以随时继续编辑已有作品，或者将作品下架。">
        {loading ? (
          <p className="text-[14px]" style={{ color: 'var(--text-muted)' }}>
            正在同步你的作品数据...
          </p>
        ) : myWorks.length === 0 ? (
          <p className="text-[14px] leading-7" style={{ color: 'var(--text-muted)' }}>
            你还没有发布作品。现在就可以在上方填写信息并发布第一件作品。
          </p>
        ) : (
          <div className="space-y-3">
            {myWorks.map(artwork => (
              <div key={artwork.id} className="p-4" style={{ border: '1px solid var(--border)', background: 'var(--bg)', borderRadius: 'var(--radius-md)' }}>
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[15px] font-semibold" style={{ color: 'var(--text)' }}>
                        {artwork.title}
                      </p>
                      <MetaPill tone={artwork.inventoryStatus === 'archived' ? 'warn' : artwork.inventoryStatus === 'sold_out' ? 'dark' : 'success'}>
                        {inventoryLabel(artwork.inventoryStatus)}
                      </MetaPill>
                    </div>
                    <p className="text-[12px] mt-2" style={{ color: 'var(--text-muted)' }}>
                      ￥{Number(artwork.price).toLocaleString()} · 库存 {artwork.stock}
                    </p>
                    {artwork.charitySupportNote ? (
                      <p className="text-[13px] leading-6 mt-3" style={{ color: 'var(--text-muted)' }}>
                        {artwork.charitySupportNote}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <ActionButton onClick={() => startEdit(artwork)} variant="secondary" className="px-5">
                      编辑
                    </ActionButton>
                    {artwork.inventoryStatus !== 'archived' ? (
                      <ActionButton onClick={() => handleUnpublish(artwork.id)} variant="danger" className="px-5">
                        下架
                      </ActionButton>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  )
}
