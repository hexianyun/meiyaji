import { useNavigate } from 'react-router-dom'
import { useApp } from '../App'

export default function CartPage() {
  const navigate = useNavigate()
  const { cart, updateCartQty, removeFromCart, cartTotal } = useApp()

  if (cart.length === 0) {
    return (
      <div className="pb-16 fade-in">
        <div className="bg-background/96 backdrop-blur-sm border-b border-divider sticky top-0 z-30">
          <div className="max-w-[430px] mx-auto h-12 flex items-center px-4">
            <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-lg">
              ←
            </button>
            <span className="flex-1 text-center font-semibold text-sm">购物车</span>
            <span className="w-9"></span>
          </div>
        </div>
        <div className="text-center py-12">
          <div className="text-5xl mb-3">🛒</div>
          <p className="font-semibold mb-2">购物车是空的</p>
          <p className="text-sm text-text-light mb-4">去发现心仪的艺术品吧</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-semibold"
          >
            逛逛展厅
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="pb-16 fade-in">
      <div className="bg-background/96 backdrop-blur-sm border-b border-divider sticky top-0 z-30">
        <div className="max-w-[430px] mx-auto h-12 flex items-center px-4">
          <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-lg">
            ←
          </button>
          <span className="flex-1 text-center font-semibold text-sm">购物车</span>
          <span className="text-xs text-text-light">{cart.length}件</span>
        </div>
      </div>

      <div className="p-4 pb-32">
        {cart.map((item, index) => (
          <div key={item.art.id} className="bg-white rounded-xl border border-divider p-3 flex gap-3 mb-3">
            <div 
              className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
              onClick={() => navigate(`/detail/${item.art.id}`)}
            >
              <img 
                src={item.art.img} 
                alt={item.art.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 flex flex-col">
              <p className="text-xs font-semibold truncate">{item.art.title}</p>
              <p className="text-[10px] text-text-light mb-2">{item.art.artist}</p>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-sm font-bold text-primary">
                  ¥{item.art.price.toLocaleString()}
                </span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => updateCartQty(item.art.id, item.qty - 1)}
                    className="w-6 h-6 rounded border border-divider flex items-center justify-center text-xs"
                  >
                    −
                  </button>
                  <span className="text-xs font-semibold min-w-[18px] text-center">{item.qty}</span>
                  <button 
                    onClick={() => updateCartQty(item.art.id, item.qty + 1)}
                    className="w-6 h-6 rounded border border-divider flex items-center justify-center text-xs"
                  >
                    +
                  </button>
                </div>
              </div>
              <button 
                onClick={() => removeFromCart(item.art.id)}
                className="text-[10px] text-text-light text-left mt-1"
              >
                删除
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-16 left-1/2 transform -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-divider p-4 flex items-center justify-between z-30">
        <div>
          <p className="text-xs text-text-light">合计</p>
          <p className="text-xl font-bold text-primary">¥{cartTotal.toLocaleString()}</p>
        </div>
        <button 
          onClick={() => navigate('/orders')}
          className="bg-text text-white px-5 py-3 rounded-xl font-semibold text-sm"
        >
          去结算
        </button>
      </div>
    </div>
  )
}
