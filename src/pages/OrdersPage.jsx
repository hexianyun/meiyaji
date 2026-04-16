import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { orders as mockOrders } from '../data'

export default function OrdersPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('全部')
  const tabs = ['全部', '待付款', '待发货', '运输中', '已完成']

  const filteredOrders = activeTab === '全部'
    ? mockOrders
    : mockOrders.filter(o => o.status === activeTab)

  const getStatusStyle = (status) => {
    switch(status) {
      case '已完成': return { bg: 'rgba(159,179,168,0.15)', color: '#5C7860' }
      case '运输中': return { bg: 'rgba(170,182,197,0.15)', color: '#5A6677' }
      case '待发货': return { bg: 'rgba(216,181,138,0.15)', color: '#8A6E45' }
      default: return { bg: 'rgba(232,225,216,0.6)', color: 'var(--text-muted)' }
    }
  }

  return (
    <div className="pb-20 fade-in">
      <div className="sticky top-0 z-30 px-4 pt-3 pb-3"
        style={{ background: 'rgba(246,241,234,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)' }}
      >
        <div className="max-w-[430px] mx-auto flex items-center h-10">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >←</button>
          <span className="flex-1 text-center font-semibold text-sm" style={{ color: 'var(--text)' }}>我的订单</span>
          <span className="w-9"></span>
        </div>
      </div>

      <div className="flex px-4 sticky top-[52px] z-20"
        style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}
      >
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-center text-sm font-medium border-b-2 transition-colors`}
            style={{
              color: activeTab === tab ? 'var(--primary)' : 'var(--text-weak)',
              borderColor: activeTab === tab ? 'var(--primary)' : 'transparent',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="p-4 pb-20">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-4" style={{ color: 'var(--text-weak)' }}>◇</div>
            <p className="font-semibold mb-1.5" style={{ color: 'var(--text)' }}>暂无订单</p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>快去选购心仪的艺术品吧</p>
          </div>
        ) : (
          filteredOrders.map(order => (
            <div key={order.id} className="rounded-2xl p-4 mb-3"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-[11px]" style={{ color: 'var(--text-weak)' }}>{order.id}</span>
                <span
                  className="px-2.5 py-1 rounded-full text-[11px] font-medium"
                  style={{ background: getStatusStyle(order.status).bg, color: getStatusStyle(order.status).color }}
                >
                  {order.status}
                </span>
              </div>
              {order.arts.map((art, i) => (
                <div key={i} className="flex gap-3 py-2"
                  style={{ borderTop: i === 0 ? '' : '1px solid var(--border)' }}
                >
                  <div className="w-14 h-14 overflow-hidden flex-shrink-0" style={{ borderRadius: '12px' }}>
                    <img src={art.img} alt={art.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold" style={{ color: 'var(--text)' }}>{art.title}</p>
                    <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{art.artist}</p>
                    <p className="text-xs font-bold mt-1" style={{ color: 'var(--primary)' }}>
                      ¥{art.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
              <div className="flex justify-between items-center pt-3 mt-2"
                style={{ borderTop: '1px solid var(--border)' }}
              >
                <span className="text-[10px]" style={{ color: 'var(--text-weak)' }}>{order.date}</span>
                <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>¥{order.total.toLocaleString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
