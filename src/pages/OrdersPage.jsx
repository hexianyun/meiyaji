import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../App'
import { getMemberOrders } from '../services/contentApi'

function BackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"></line>
      <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
  )
}

export default function OrdersPage() {
  const navigate = useNavigate()
  const { currentUser } = useApp()
  const [activeTab, setActiveTab] = useState('全部')
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const tabs = ['全部', '待付款', '待发货', '运输中', '已完成', '已取消']

  useEffect(() => {
    let isActive = true

    async function loadOrders() {
      if (!currentUser) {
        setLoading(false)
        return
      }

      try {
        const payload = await getMemberOrders()
        if (!isActive) return
        setOrders(payload.orders || [])
      } catch (error) {
        if (!isActive) return
        setErrorMessage(error instanceof Error ? error.message : '获取订单失败，请稍后再试。')
      } finally {
        if (isActive) setLoading(false)
      }
    }

    loadOrders()

    return () => {
      isActive = false
    }
  }, [currentUser])

  const filteredOrders = activeTab === '全部'
    ? orders
    : orders.filter(order => order.status === activeTab)

  const getStatusStyle = (status) => {
    switch (status) {
      case '已完成': return { bg: 'rgba(159,179,168,0.15)', color: '#5C7860' }
      case '运输中': return { bg: 'rgba(170,182,197,0.15)', color: '#5A6677' }
      case '待发货': return { bg: 'rgba(216,181,138,0.15)', color: '#8A6E45' }
      case '已取消': return { bg: 'rgba(191,170,170,0.18)', color: '#7A6666' }
      default: return { bg: 'var(--surface-2)', color: 'var(--text-muted)' }
    }
  }

  return (
    <div className="pb-20 fade-in min-h-screen bg-[var(--bg)]">
      <div className="sticky top-0 z-30 px-4 pt-5 pb-4"
        style={{ background: 'rgba(250, 250, 250, 0.85)', backdropFilter: 'blur(16px) saturate(180%)' }}
      >
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full shadow-sm transition-transform active:scale-90"
            style={{ background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)' }}
          >
            <BackIcon />
          </button>
          <span className="text-[15px] font-bold" style={{ color: 'var(--text)' }}>我的订单</span>
          <span className="w-10" />
        </div>
      </div>

      <div className="flex px-4 sticky top-[72px] z-20 overflow-x-auto no-scrollbar"
        style={{ background: 'rgba(250, 250, 250, 0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)' }}
      >
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="py-3 text-center text-[14px] font-bold border-b-2 transition-colors min-w-[68px]"
            style={{
              color: activeTab === tab ? 'var(--text)' : 'var(--text-weak)',
              borderColor: activeTab === tab ? 'var(--text)' : 'transparent',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="p-4 pb-20 space-y-4 mt-2">
        {!currentUser ? (
          <div className="text-center py-16" style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
            <p className="font-bold mb-2 text-[16px]" style={{ color: 'var(--text)' }}>请先登录</p>
            <p className="text-[13px] mb-6 font-medium" style={{ color: 'var(--text-muted)' }}>登录后即可查看订单与物流信息</p>
            <button onClick={() => navigate('/login')} className="btn-primary px-8 py-3 w-auto mx-auto block">
              前往登录
            </button>
          </div>
        ) : loading ? (
          <div className="text-center py-16 text-[14px] font-medium" style={{ color: 'var(--text-muted)' }}>
            正在加载订单...
          </div>
        ) : errorMessage ? (
          <div className="px-4 py-4 text-[13px] font-medium" style={{ background: 'rgba(201,143,134,0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(201,143,134,0.3)', color: '#8A5B52' }}>
            {errorMessage}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-16" style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
            <p className="font-bold mb-2 text-[16px]" style={{ color: 'var(--text)' }}>暂无订单</p>
            <p className="text-[13px] font-medium" style={{ color: 'var(--text-muted)' }}>快去选购心仪的艺术品吧</p>
          </div>
        ) : (
          filteredOrders.map(order => (
            <div key={order.id} className="p-5"
              style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-[11px] font-bold tracking-wider uppercase" style={{ color: 'var(--text-weak)' }}>{order.orderNo}</span>
                <span
                  className="px-2.5 py-1 text-[11px] font-bold rounded-full"
                  style={{ background: getStatusStyle(order.status).bg, color: getStatusStyle(order.status).color }}
                >
                  {order.status}
                </span>
              </div>

              {order.arts.map((art, index) => (
                <div key={`${order.id}-${index}`} className="flex gap-4 py-3"
                  style={{ borderTop: index === 0 ? '' : '1px solid var(--border)' }}
                >
                  <div className="w-16 h-16 overflow-hidden flex-shrink-0" style={{ borderRadius: 'var(--radius-md)', background: 'var(--surface-2)' }}>
                    <img src={art.img} alt={art.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <p className="text-[14px] font-bold truncate mb-1" style={{ color: 'var(--text)' }}>{art.title}</p>
                    <p className="text-[11px] font-bold text-[var(--text-weak)] tracking-wider uppercase mb-2">{art.artist}</p>
                    <p className="text-[14px] font-bold" style={{ color: 'var(--accent)' }}>
                      ¥{Number(art.price).toLocaleString()} × {art.qty}
                    </p>
                  </div>
                </div>
              ))}

              {(order.logisticsCompany || order.logisticsNumber) && (
                <div className="mt-4 px-4 py-3 text-[12px] font-medium leading-relaxed" style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)' }}>
                  <div><span style={{ color: 'var(--text)' }}>物流公司：</span>{order.logisticsCompany || '待补充'}</div>
                  <div className="mt-1"><span style={{ color: 'var(--text)' }}>物流单号：</span>{order.logisticsNumber || '待补充'}</div>
                  {order.trackingNote && <div className="mt-1"><span style={{ color: 'var(--text)' }}>备注：</span>{order.trackingNote}</div>}
                </div>
              )}

              <div className="flex justify-between items-center pt-4 mt-4"
                style={{ borderTop: '1px solid var(--border)' }}
              >
                <span className="text-[11px] font-medium" style={{ color: 'var(--text-weak)' }}>
                  {new Date(order.date).toLocaleString('zh-CN')}
                </span>
                <span className="text-[16px] font-bold" style={{ color: 'var(--text)' }}>
                  总计 ¥{Number(order.total).toLocaleString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
