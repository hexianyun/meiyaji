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

  const getStatusClass = (status) => {
    switch(status) {
      case '已完成': return 'bg-green-50 text-success'
      case '运输中': return 'bg-blue-50 text-blue-600'
      case '待发货': return 'bg-orange-50 text-orange-600'
      default: return 'bg-gray-50 text-text-light'
    }
  }

  return (
    <div className="pb-16 fade-in">
      <div className="bg-background/96 backdrop-blur-sm border-b border-divider sticky top-0 z-30">
        <div className="max-w-[430px] mx-auto h-12 flex items-center px-4">
          <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-lg">
            ←
          </button>
          <span className="flex-1 text-center font-semibold text-sm">我的订单</span>
          <span className="w-9"></span>
        </div>
      </div>

      <div className="flex border-b border-divider px-4 bg-background sticky top-12 z-20">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-center text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab 
                ? 'text-primary border-primary' 
                : 'text-text-light border-transparent'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="p-4 pb-20">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-3">📋</div>
            <p className="font-semibold mb-2">暂无订单</p>
            <p className="text-sm text-text-light">快去选购心仪的艺术品吧</p>
          </div>
        ) : (
          filteredOrders.map(order => (
            <div key={order.id} className="bg-white rounded-xl border border-divider p-4 mb-3">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[11px] text-text-light">{order.id}</span>
                <span className={`px-2 py-1 rounded-full text-[11px] font-semibold ${getStatusClass(order.status)}`}>
                  {order.status}
                </span>
              </div>
              {order.arts.map((art, i) => (
                <div key={i} className="flex gap-3 py-2 border-t border-divider">
                  <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      src={art.img} 
                      alt={art.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold">{art.title}</p>
                    <p className="text-[10px] text-text-light">{art.artist}</p>
                    <p className="text-xs font-bold text-primary mt-1">
                      ¥{art.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
              <div className="flex justify-between items-center pt-3 border-t border-divider mt-2">
                <span className="text-[10px] text-text-light">{order.date}</span>
                <span className="text-sm font-bold">¥{order.total.toLocaleString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
