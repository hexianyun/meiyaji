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
import AdminDashboardPage from './pages/AdminDashboardPage'
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

  const renderIcon = (iconName, isActive) => {
    const strokeColor = isActive ? '#171717' : '#A3A3A3'
    const commonProps = {
      width: 22,
      height: 22,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: strokeColor,
      strokeWidth: 1.8,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      'aria-hidden': true,
      style: { transition: 'stroke 0.3s ease' }
    }

    switch (iconName) {
      case 'Home':
        return (
          <svg {...commonProps}>
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        )
      case 'Heart':
        return (
          <svg {...commonProps}>
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        )
      case 'Gallery':
        return (
          <svg {...commonProps}>
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        )
      case 'Palette':
        return (
          <svg {...commonProps}>
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
            <circle cx="7.5" cy="10.5" r=".5" fill={isActive ? '#171717' : 'currentColor'} stroke="none" />
            <circle cx="10.5" cy="5.5" r=".5" fill={isActive ? '#171717' : 'currentColor'} stroke="none" />
            <circle cx="15.5" cy="7.5" r=".5" fill={isActive ? '#171717' : 'currentColor'} stroke="none" />
          </svg>
        )
      case 'User':
      default:
        return (
          <svg {...commonProps}>
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        )
    }
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 safe-area-pb"
      style={{
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(20px) saturate(180%)',
        borderTop: '1px solid rgba(255, 255, 255, 0.4)',
        boxShadow: '0 -4px 30px rgba(0, 0, 0, 0.04)',
      }}
    >
      <div className="max-w-[430px] mx-auto flex px-2 py-1">
        {navItems.map(item => {
          const isActive = item.path === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(item.path)

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="relative flex-1 pt-2 pb-3 flex flex-col items-center gap-1.5 transition-all duration-300"
              style={{ color: isActive ? '#171717' : '#A3A3A3' }}
            >
              <div className="relative flex items-center justify-center w-10 h-10">
                {/* Active Highlight Background Bubble */}
                <div 
                  className="absolute inset-0 rounded-full transition-all duration-300"
                  style={{
                    background: isActive ? 'rgba(0,0,0,0.04)' : 'transparent',
                    transform: isActive ? 'scale(1)' : 'scale(0.8)',
                    opacity: isActive ? 1 : 0
                  }}
                />
                
                <span
                  className="relative z-10 transition-transform duration-300"
                  style={{
                    transform: isActive ? 'translateY(-1px)' : 'translateY(0)'
                  }}
                >
                  {renderIcon(item.icon, isActive)}
                  {item.path === '/profile' && cartCount > 0 && (
                    <span
                      className="absolute -top-1 -right-1 text-white text-[9px] w-[14px] h-[14px] rounded-full flex items-center justify-center font-bold"
                      style={{ background: 'var(--danger)', boxShadow: '0 2px 4px rgba(181, 108, 97, 0.3)' }}
                    >
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </span>
              </div>
              <span className="text-[10px] font-medium tracking-[0.03em] transition-all duration-300"
                style={{ 
                  opacity: isActive ? 1 : 0.7,
                  transform: isActive ? 'translateY(-2px)' : 'translateY(0)'
                }}>
                {item.label}
              </span>
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
      className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] blur-reveal"
      style={{
        background: 'rgba(23, 23, 23, 0.85)',
        backdropFilter: 'blur(12px)',
        color: 'white',
        padding: '12px 28px',
        borderRadius: 'var(--radius-full)',
        fontSize: '14px',
        fontWeight: '500',
        letterSpacing: '0.02em',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid rgba(255,255,255,0.1)'
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
          <Route path="/admin" element={<AdminDashboardPage />} />
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
