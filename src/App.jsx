import { useState, createContext, useContext } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import HomePage from './pages/HomePage'
import DiscoverPage from './pages/DiscoverPage'
import DetailPage from './pages/DetailPage'
import CartPage from './pages/CartPage'
import OrdersPage from './pages/OrdersPage'
import ProfilePage from './pages/ProfilePage'
import CharityPage from './pages/CharityPage'
import ArtistPage from './pages/ArtistPage'
import ExhibitionsPage from './pages/ExhibitionsPage'

const AppContext = createContext()

export const useApp = () => useContext(AppContext)

function App() {
  const [cart, setCart] = useState([])
  const [favs, setFavs] = useState([])
  const [toast, setToast] = useState(null)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2200)
  }

  const addToCart = (art) => {
    setCart(prev => {
      const existing = prev.find(item => item.art.id === art.id)
      if (existing) {
        return prev.map(item => 
          item.art.id === art.id 
            ? { ...item, qty: item.qty + 1 }
            : item
        )
      }
      return [...prev, { art, qty: 1 }]
    })
    showToast('已加入购物车')
  }

  const removeFromCart = (artId) => {
    setCart(prev => prev.filter(item => item.art.id !== artId))
  }

  const updateCartQty = (artId, qty) => {
    if (qty <= 0) {
      removeFromCart(artId)
    } else {
      setCart(prev => prev.map(item => 
        item.art.id === artId ? { ...item, qty } : item
      ))
    }
  }

  const toggleFav = (artId) => {
    setFavs(prev => 
      prev.includes(artId) 
        ? prev.filter(id => id !== artId)
        : [...prev, artId]
    )
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.art.price * item.qty, 0)
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0)

  return (
    <AppContext.Provider value={{
      cart,
      favs,
      toast,
      showToast,
      addToCart,
      removeFromCart,
      updateCartQty,
      toggleFav,
      cartTotal,
      cartCount
    }}>
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/discover" element={<DiscoverPage />} />
            <Route path="/detail/:id" element={<DetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/charity" element={<CharityPage />} />
            <Route path="/artist/:id" element={<ArtistPage />} />
            <Route path="/exhibitions" element={<ExhibitionsPage />} />
          </Routes>
          
          {toast && (
            <div className="fixed top-16 left-1/2 transform -translate-x-1/2 bg-text text-white px-4 py-2 rounded-lg text-sm z-50 fade-in">
              {toast}
            </div>
          )}
          
          <BottomNav />
        </div>
      </Router>
    </AppContext.Provider>
  )
}

function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const { cartCount } = useApp()

  const navItems = [
    { path: '/', icon: '🏠', label: '首页' },
    { path: '/discover', icon: '🔍', label: '发现' },
    { path: '/exhibitions', icon: '🎨', label: '活动' },
    { path: '/cart', icon: '🛒', label: '购物车', badge: cartCount },
    { path: '/profile', icon: '👤', label: '我的' }
  ]

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-divider z-40">
      <div className="flex h-15">
        {navItems.map(item => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 text-xs font-medium transition-colors ${
              location.pathname === item.path ? 'text-primary' : 'text-text-light'
            }`}
          >
            <span className="text-xl relative">
              {item.icon}
              {item.badge > 0 && (
                <span className="absolute -top-1 -right-2 bg-danger text-white text-[10px] min-w-[16px] h-4 rounded-full flex items-center justify-center px-1">
                  {item.badge}
                </span>
              )}
            </span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}

export default App
