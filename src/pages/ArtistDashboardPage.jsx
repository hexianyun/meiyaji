import { useNavigate } from 'react-router-dom'
import { useApp } from '../App'
import { artworks } from '../data'

export default function ArtistDashboardPage() {
  const navigate = useNavigate()
  const { currentUser } = useApp()

  const myWorks = currentUser?.artistProfileId
    ? artworks.filter(item => item.aid === currentUser.artistProfileId)
    : []

  const isApprovedArtist = currentUser?.role === 'artist' && currentUser?.artistStatus === 'approved'

  if (!isApprovedArtist) {
    return (
      <div className="pb-24 px-4 pt-5 fade-in">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 mb-6 flex items-center justify-center border"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
        >
          ←
        </button>

        <div
          className="border p-6"
          style={{ background: 'rgba(251,248,244,0.95)', borderColor: 'rgba(232,225,216,0.92)' }}
        >
          <p className="text-[10px] tracking-[0.28em] uppercase mb-3" style={{ color: 'var(--text-weak)' }}>
            Artist Dashboard
          </p>
          <h1 className="text-[24px] leading-[1.2] font-semibold mb-3" style={{ color: 'var(--text)' }}>
            当前账号还没有艺术家后台权限
          </h1>
          <p className="text-[13px] leading-6 mb-6" style={{ color: 'var(--text-muted)' }}>
            只有已通过审核的艺术家账号，才可以进入作品管理后台。
          </p>
          <button
            onClick={() => navigate('/profile')}
            className="px-4 py-3 text-[13px] font-medium"
            style={{ background: 'var(--text)', color: 'white' }}
          >
            返回我的页面
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="pb-24 px-4 pt-5 fade-in">
      <div className="flex items-center justify-between gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center border"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
        >
          ←
        </button>
        <p className="text-[10px] tracking-[0.28em] uppercase" style={{ color: 'var(--text-weak)' }}>
          Artist Dashboard
        </p>
        <button
          onClick={() => navigate('/discover')}
          className="px-3 py-2 text-[12px] border"
          style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
        >
          浏览前台
        </button>
      </div>

      <section
        className="border p-6 mb-4"
        style={{ background: 'rgba(251,248,244,0.95)', borderColor: 'rgba(232,225,216,0.92)' }}
      >
        <p className="text-[10px] tracking-[0.28em] uppercase mb-3" style={{ color: 'var(--text-weak)' }}>
          Welcome Back
        </p>
        <h1 className="text-[26px] leading-[1.18] font-semibold mb-3" style={{ color: 'var(--text)' }}>
          进入艺术家专属后台
        </h1>
        <p className="text-[13px] leading-6 mb-6" style={{ color: 'var(--text-muted)' }}>
          这里将接入发布作品、编辑信息、管理库存与公益说明等后台功能。
        </p>

        <div className="grid grid-cols-2 gap-3">
          <div className="border p-4" style={{ borderColor: 'rgba(232,225,216,0.92)' }}>
            <p className="text-[11px] mb-2" style={{ color: 'var(--text-weak)' }}>
              已发布作品
            </p>
            <p className="text-[28px] leading-none font-semibold" style={{ color: 'var(--text)' }}>
              {myWorks.length}
            </p>
          </div>
          <div className="border p-4" style={{ borderColor: 'rgba(232,225,216,0.92)' }}>
            <p className="text-[11px] mb-2" style={{ color: 'var(--text-weak)' }}>
              当前身份
            </p>
            <p className="text-[18px] font-semibold" style={{ color: 'var(--text)' }}>
              已认证艺术家
            </p>
          </div>
        </div>
      </section>

      <section
        className="border p-6"
        style={{ background: 'rgba(248,244,239,0.95)', borderColor: 'rgba(232,225,216,0.92)' }}
      >
        <p className="text-[10px] tracking-[0.28em] uppercase mb-4" style={{ color: 'var(--text-weak)' }}>
          Next Step
        </p>
        <div className="space-y-3 text-[13px] leading-6" style={{ color: 'var(--text-muted)' }}>
          <p>发布艺术品：录入作品名称、图片、价格与公益说明。</p>
          <p>管理我的作品：查看、编辑、下架自己发布的全部作品。</p>
          <p>后续我们可以直接把这里接入你刚建好的艺术家 RESTful API。</p>
        </div>
      </section>
    </div>
  )
}
