import { createContext, useContext, useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
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
import ArtistDashboardPage from './pages/ArtistDashboardPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ArtistApplyPage from './pages/ArtistApplyPage'
import { getStoredCurrentUser, setStoredCurrentUser } from './services/contentApi'

const AppContext = createContext(null)
const FAVORITES_STORAGE_KEY = 'meiyaji_favorites'
const CART_STORAGE_KEY = 'meiyaji_cart'

function readStoredJson(key, fallbackValue) {
  if (typeof window === 'undefined') return fallbackValue

  try {
    const rawValue = window.localStorage.getItem(key)
    return rawValue ? JSON.parse(rawValue) : fallbackValue
  } catch {
    return fallbackValue
  }
}

function AppProvider({ children }) {
  const [favs, setFavs] = useState(() => readStoredJson(FAVORITES_STORAGE_KEY, []))
  const [cart, setCart] = useState(() => readStoredJson(CART_STORAGE_KEY, []))
  const [toast, setToast] = useState(null)
  const [currentUser, setCurrentUserState] = useState(() => getStoredCurrentUser())

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favs))
    }
  }, [favs])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
    }
  }, [cart])

  const toggleFav = (id) => {
    setFavs(prev => prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id])
  }

  const showToast = (msg) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2000)
  }

  const addToCart = (artwork) => {
    setCart(prev => {
      const existing = prev.find(item => item.art.id === artwork.id)

      if (existing) {
        return prev.map(item => item.art.id === artwork.id ? { ...item, qty: item.qty + 1 } : item)
      }

      return [...prev, { art: artwork, qty: 1 }]
    })

    showToast('已加入购物车')
  }

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.art.id !== id))
  }

  const updateCartQty = (id, qty) => {
    if (qty <= 0) {
      removeFromCart(id)
      return
    }

    setCart(prev => prev.map(item => item.art.id === id ? { ...item, qty } : item))
  }

  const clearCart = () => setCart([])
  const cartTotal = cart.reduce((sum, item) => sum + item.art.price * item.qty, 0)

  const setCurrentUser = (user) => {
    setCurrentUserState(user)
    setStoredCurrentUser(user)
  }

  return (
    <AppContext.Provider
      value={{
        favs,
        toggleFav,
        cart,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        cartTotal,
        toast,
        showToast,
        currentUser,
        setCurrentUser,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

function useApp() {
  const context = useContext(AppContext)

  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }

  return context
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
    { path: '/profile', icon: 'User', label: '我的' },
  ]

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 safe-area-pb"
      style={{
        background: 'rgba(248, 244, 239, 0.96)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(215, 205, 194, 0.92)',
        boxShadow: '0 -10px 28px rgba(27, 23, 19, 0.06)',
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
              className="relative flex-1 pt-3 pb-3 flex flex-col items-center gap-1.5 transition-colors"
              style={{ color: isActive ? '#2f2720' : '#6a5f56' }}
            >
              <span
                className="absolute top-0 left-1/2 -translate-x-1/2 h-[3px] transition-all"
                style={{
                  width: isActive ? '26px' : '0px',
                  background: '#2f2720',
                }}
              />
              <span className="nav-icon relative" style={{ fontSize: '21px', lineHeight: 1 }}>
                {isActive ? (
                  item.icon === 'Home' ? '○' :
                  item.icon === 'Heart' ? '♡' :
                  item.icon === 'Gallery' ? '□' :
                  item.icon === 'Palette' ? '◇' : '◦'
                ) : (
                  item.icon === 'Home' ? '○' :
                  item.icon === 'Heart' ? '♡' :
                  item.icon === 'Gallery' ? '□' :
                  item.icon === 'Palette' ? '◇' : '◦'
                )}
                {item.path === '/profile' && cartCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ background: 'var(--accent)' }}
                  >
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </span>
              <span className="text-[13px] font-semibold tracking-[0.03em]">{item.label}</span>
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
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/artist/apply" element={<ArtistApplyPage />} />
          <Route path="/artist/:id" element={<ArtistPage />} />
          <Route path="/artist/dashboard" element={<ArtistDashboardPage />} />
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
      <AppProvider>
        <AppContent />
      </AppProvider>
    </BrowserRouter>
  )
}

export { useApp }
