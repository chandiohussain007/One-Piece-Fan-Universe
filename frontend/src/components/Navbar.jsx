import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Search, Bell, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import SearchModal from './SearchModal'
import toast from 'react-hot-toast'

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/manga', label: 'Manga' },
  { path: '/fanart', label: 'Fan Art' },
  { path: '/videos', label: 'Videos' },
  { path: '/animelinks', label: 'Links' }
]

const Navbar = () => {
  const { user, logout } = useAuth()
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  
  // Modals / Overlays
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isNotifOpen, setIsNotifOpen] = useState(false)

  const isHome = pathname === '/'

  // Detect scroll for shrinking effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
      if (isNotifOpen) setIsNotifOpen(false) // auto close notif on scroll
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isNotifOpen])

  useEffect(() => {
    // Close mobile menu on route change
    setIsMobileMenuOpen(false)
  }, [pathname])

  const linkBase = "text-neutral-400 hover:text-white transition duration-300"
  const activeStyle = "text-[#00fbfb] drop-shadow-[0_0_6px_#00fbfb]"

  return (
    <>
      <nav
        className={`
          fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-black/40 border-b border-white/10
          transition-all duration-300
        `}
      >
        <div
          className={`
            mx-auto flex items-center justify-between
            ${isHome ? 'max-w-7xl px-4 md:px-6 py-4' : 'max-w-[100%] md:max-w-[90%] px-4'}
            ${!isHome && scrolled ? 'py-1 md:scale-95' : 'py-2'}
            md:hover:py-4 md:hover:max-w-7xl md:hover:scale-100
            transition-all duration-300
          `}
        >
          {/* LEFT: MOBILE HAMBURGER & LOGO */}
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <Link to="/">
              <img
                src="/images/logo.png"
                alt="logo"
                className={`transition-all duration-300 ${
                  !isHome && scrolled ? 'h-5 md:h-6' : 'h-6 md:h-8'
                }`}
              />
            </Link>
          </div>

          {/* CENTER: DESKTOP NAV LINKS */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`${linkBase} ${pathname === path ? activeStyle : ''}`}
              >
                {label}
              </Link>
            ))}

            {user?.role === 'admin' && (
              <Link to="/admin" className={linkBase}>
                Admin
              </Link>
            )}
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-4 md:gap-6 relative">
            <button 
              className="text-neutral-400 hover:text-white transition"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search size={18} />
            </button>
            
            <div className="relative">
              <button 
                className="text-neutral-400 hover:text-white transition"
                onClick={() => setIsNotifOpen(!isNotifOpen)}
              >
                <Bell size={18} />
              </button>
              
              {/* Notifications Dropdown */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-4 w-64 bg-[#111] border border-[#222] rounded-xl shadow-2xl overflow-hidden py-2 z-50">
                  <div className="px-4 py-2 border-b border-[#222]">
                    <h4 className="text-sm font-semibold text-white">Notifications</h4>
                  </div>
                  <div className="p-4 text-center text-gray-500 text-sm">
                    No new notifications.
                  </div>
                </div>
              )}
            </div>

            {user ? (
              <img
                onClick={logout}
                src={user.avatar || 'https://via.placeholder.com/32'}
                alt="avatar"
                className="w-7 h-7 md:w-8 md:h-8 rounded-full cursor-pointer border border-white/20 transition-all duration-300"
              />
            ) : (
              <Link
                to="/login"
                className="text-xs md:text-sm text-white border border-white/20 px-3 py-0.5 md:px-4 md:py-1 rounded-full hover:bg-white hover:text-black transition"
              >
                LOGIN
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* MOBILE MENU FULL SCREEN OVERLAY */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-3xl pt-24 px-6 md:hidden flex flex-col">
          <div className="flex flex-col gap-6 text-xl text-center">
            {navLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`py-2 border-b border-white/10 ${pathname === path ? 'text-purple-400 font-bold' : 'text-gray-300'}`}
              >
                {label}
              </Link>
            ))}
            {user?.role === 'admin' && (
              <Link to="/admin" className="py-2 text-pink-400 font-bold tracking-widest">
                ADMIN DASHBOARD
              </Link>
            )}
          </div>
        </div>
      )}

      {/* SEARCH MODAL */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}

export default Navbar