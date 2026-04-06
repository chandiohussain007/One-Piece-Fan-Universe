import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Search, Bell } from 'lucide-react'
import { useState, useEffect } from 'react'

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

  const isHome = pathname === '/'

  // Detect scroll for shrinking effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const linkBase = "text-neutral-400 hover:text-white transition duration-300"
  const activeStyle = "text-[#00fbfb] drop-shadow-[0_0_6px_#00fbfb]"

  return (
    <nav
      className={`
        fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-black/40 border-b border-white/10
        transition-all duration-300
      `}
    >
      <div
        className={`
          mx-auto flex items-center justify-between
          ${isHome ? 'max-w-7xl px-6 py-4' : 'max-w-[90%] px-4'}
          ${!isHome && scrolled ? 'py-1 scale-95' : 'py-2'}
          hover:py-4 hover:max-w-7xl hover:scale-100
          transition-all duration-300
        `}
      >
        {/* LEFT: LOGO */}
       {/* LEFT: LOGO */}
<Link to="/">
  <img
    src="/images/logo.png"
    alt="logo"
    className={`transition-all duration-300 ${
      !isHome && scrolled ? 'h-6' : 'h-8'
    }`}
  />
</Link>

        {/* CENTER: NAV LINKS */}
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
        <div className="flex items-center gap-4 md:gap-6">
          <button className="text-neutral-400 hover:text-white transition">
            <Search size={18} />
          </button>
          <button className="text-neutral-400 hover:text-white transition">
            <Bell size={18} />
          </button>

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
  )
}

export default Navbar