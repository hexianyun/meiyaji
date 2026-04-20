import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import DiscoverPage from './pages/DiscoverPage'
import DetailPage from './pages/DetailPage'
import CartPage from './pages/CartPage'
import OrdersPage from './pages/OrdersPage'
import ProfilePage from './pages/ProfilePage'
import ArtistPage from './pages/ArtistPage'
import ArtistListPage from './pages/ArtistListPage'
import ExhibitionsPage from './pages/ExhibitionsPage'
import CharityPage from './pages/CharityPage'
import CharityArticlePage from './pages/CharityArticlePage'
import CharityProjectPage from './pages/CharityProjectPage'


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
    { path: '/', icon: 'Home', label: '首页' },
    { path: '/charity', icon: 'Heart', label: '公益' },
    { path: '/discover', icon: 'Gallery', label: '作品' },
    { path: '/artists', icon: 'Palette', label: '艺术家' },
    { path: '/profile', icon: 'User', label: '我的' }
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-area-pb"
      style={{
        background: 'rgba(248, 244, 239, 0.96)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(215, 205, 194, 0.92)',
        boxShadow: '0 -10px 28px rgba(27, 23, 19, 0.06)'
      }}
    >
      <div className="max-w-[430px] mx-auto flex px-1">
        {navItems.map(item => {
          const isActive = item.path === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(item.path)
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="relative flex-1 pt-3 pb-3.5 flex flex-col items-center gap-1 transition-colors"
              style={{ color: isActive ? 'var(--text)' : 'rgba(81, 73, 64, 0.72)' }}
            >
              <span
                className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] transition-all"
                style={{
                  width: isActive ? '24px' : '0px',
                  background: 'var(--text)',
                }}
              />
              <span className="nav-icon relative" style={{ fontSize: '18px', lineHeight: 1 }}>
                {isActive ? (
                  item.icon === 'Home' ? '◉' :
                  item.icon === 'Heart' ? '♥' :
                  item.icon === 'Gallery' ? '▦' :
                  item.icon === 'Palette' ? '◈' : '●'
                ) : (
                  item.icon === 'Home' ? '○' :
                  item.icon === 'Heart' ? '♡' :
                  item.icon === 'Gallery' ? '▢' :
                  item.icon === 'Palette' ? '◇' : '○'
                )}
                {item.path === '/profile' && cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ background: 'var(--accent)' }}
                  >
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </span>
              <span className="text-[12px] font-medium tracking-[0.04em]">{item.label}</span>
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
    <div
      className="fixed top-16 left-1/2 -translate-x-1/2 text-sm z-50"
      style={{
        background: 'var(--text)',
        color: 'white',
        padding: '10px 22px',
        borderRadius: '999px',
        fontSize: '13px',
      }}
    >
      {msg}
    </div>
  )
}

function AppContent() {
  const { toast } = useApp()
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <div className="max-w-[430px] mx-auto">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/detail/:id" element={<DetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/artist/:id" element={<ArtistPage />} />
          <Route path="/artists" element={<ArtistListPage />} />
          <Route path="/exhibitions" element={<ExhibitionsPage />} />
          <Route path="/charity" element={<CharityPage />} />
          <Route path="/charity/article/:id" element={<CharityArticlePage />} />
          <Route path="/charity/project/:id" element={<CharityProjectPage />} />
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
