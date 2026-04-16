import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import DiscoverPage from './pages/DiscoverPage'
import DetailPage from './pages/DetailPage'
import CartPage from './pages/CartPage'
import OrdersPage from './pages/OrdersPage'
import ProfilePage from './pages/ProfilePage'
import ArtistPage from './pages/ArtistPage'
import ExhibitionsPage from './pages/ExhibitionsPage'
import CharityPage from './pages/CharityPage'

function useApp() {
  const [favs, setFavs] = useState([])
  const [cart, setCart] = useState([])
  const [toast, setToast] = useState(null)

  const toggleFav = (id) => {
    setFavs(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id])
  }

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i)
      }
      return [...prev, { ...item, qty: 1 }]
    })
    setToast('已加入购物车')
    setTimeout(() => setToast(null), 2000)
  }

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(i => i.id !== id))
  }

  const updateQty = (id, qty) => {
    if (qty <= 0) {
      removeFromCart(id)
      return
    }
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i))
  }

  const clearCart = () => setCart([])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2000)
  }

  return { favs, toggleFav, cart, addToCart, removeFromCart, updateQty, clearCart, toast, showToast }
}

function Navigation() {
  const location = useLocation()
  const navigate = useNavigate()
  const { cart } = useApp()
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0)

  const navItems = [
    { path: '/', icon: '🏠', label: '首页' },
    { path: '/discover', icon: '🔍', label: '艺术品' },
    { path: '/exhibitions', icon: '🎨', label: '活动' },
    { path: '/charity', icon: '💚', label: '公益' },
    { path: '/profile', icon: '👤', label: '我的' }
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-divider z-50 safe-area-pb">
      <div className="max-w-[430px] mx-auto flex">
        {navItems.map(item => {
          const isActive = location.pathname === item.path
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex-1 py-2.5 flex flex-col items-center gap-0.5 ${
                isActive ? 'text-primary' : 'text-text-light'
              }`}
            >
              <span className="text-lg relative">
                {item.icon}
                {item.path === '/profile' && cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-danger text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

function Toast({ msg }) {
  if (!msg) return null
  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 bg-black/80 text-white px-4 py-2.5 rounded-full text-sm z-50">
      {msg}
    </div>
  )
}

function AppContent() {
  const { toast } = useApp()
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[430px] mx-auto">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/detail/:id" element={<DetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/artist/:id" element={<ArtistPage />} />
          <Route path="/exhibitions" element={<ExhibitionsPage />} />
          <Route path="/charity" element={<CharityPage />} />
        </Routes>
      </div>
      <Navigation />
      <Toast msg={toast} />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export { useApp }
