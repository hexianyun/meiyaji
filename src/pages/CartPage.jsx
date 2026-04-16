import { useNavigate } from 'react-router-dom'
import { useApp } from '../App'

export default function CartPage() {
  const navigate = useNavigate()
  const { cart, updateCartQty, removeFromCart, cartTotal } = useApp()

  if (cart.length === 0) {
    return (
      <div className="pb-20 fade-in">
        <div className="sticky top-0 z-30 px-4 pt-3 pb-3"
          style={{ background: 'rgba(246,241,234,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)' }}
        >
          <div className="max-w-[430px] mx-auto flex items-center justify-between h-10">
            <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >←</button>
            <span className="font-semibold text-sm" style={{ color: 'var(--text)' }}>购物车</span>
            <span className="w-9"></span>
          </div>
        </div>
        <div className="text-center py-16">
          <div className="text-4xl mb-4" style={{ color: 'var(--text-weak)' }}>◇</div>
          <p className="font-semibold mb-1.5" style={{ color: 'var(--text)' }}>购物车是空的</p>
          <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>去浏览心仪的艺术品吧</p>
          <button 
            onClick={() => navigate('/')}
            className="btn-primary px-7 py-2.5"
          >
            逛逛展厅
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="pb-20 fade-in">
      {/* 导航栏 */}
      <div className="sticky top-0 z-30 px-4 pt-3 pb-3"
        style={{ background: 'rgba(246,241,234,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)' }}
      >
        <div className="max-w-[430px] mx-auto flex items-center justify-between h-10">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >←</button>
          <span className="font-semibold text-sm" style={{ color: 'var(--text)' }}>购物车</span>
          <span className="text-xs" style={{ color: 'var(--text-weak)' }}>{cart.length}件</span>
        </div>
      </div>

      {/* 商品列表 */}
      <div className="p-4 pb-32">
        {cart.map((item) => (
          <div key={item.art.id} className="rounded-2xl p-3.5 flex gap-3 mb-3"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            <div
              className="w-20 h-20 overflow-hidden flex-shrink-0 cursor-pointer"
              onClick={() => navigate(`/detail/${item.art.id}`)}
              style={{ borderRadius: '14px' }}
            >
              <img src={item.art.img} alt={item.art.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 flex flex-col">
              <p className="text-xs font-semibold truncate" style={{ color: 'var(--text)' }}>{item.art.title}</p>
              <p className="text-[10px] mb-2" style={{ color: 'var(--text-muted)' }}>{item.art.artist}</p>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-sm font-bold" style={{ color: 'var(--primary)' }}>
                  ¥{item.art.price.toLocaleString()}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateCartQty(item.art.id, item.qty - 1)}
                    className="w-6 h-6 rounded-lg flex items-center justify-center text-xs"
                    style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}
                  >−</button>
                  <span className="text-xs font-semibold min-w-[18px] text-center" style={{ color: 'var(--text)' }}>{item.qty}</span>
                  <button
                    onClick={() => updateCartQty(item.art.id, item.qty + 1)}
                    className="w-6 h-6 rounded-lg flex items-center justify-center text-xs"
                    style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}
                  >+</button>
                </div>
              </div>
              <button
                onClick={() => removeFromCart(item.art.id)}
                className="text-[10px] mt-1.5 text-left"
                style={{ color: 'var(--text-weak)' }}
              >
                删除
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 底部结算栏 */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[430px] p-4 flex items-center justify-between z-30"
        style={{ background: 'rgba(251,248,244,0.94)', backdropFilter: 'blur(12px)', borderTop: '1px solid var(--border)' }}
      >
        <div>
          <p className="text-[11px]" style={{ color: 'var(--text-weak)' }}>合计</p>
          <p className="text-xl font-bold" style={{ color: 'var(--primary)' }}>¥{cartTotal.toLocaleString()}</p>
        </div>
        <button
          onClick={() => navigate('/orders')}
          className="px-6 py-3 rounded-xl font-medium text-sm"
          style={{ background: 'var(--text)', color: 'white' }}
        >
          去结算
        </button>
      </div>
    </div>
  )
}
