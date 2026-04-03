import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

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

  const linkBase =
    "relative text-neutral-400 hover:text-white transition-all duration-300 hover:drop-shadow-[0_0_6px_#00fbfb]"

  const activeStyle =
    "text-[#00fbfb] after:w-full after:opacity-100 drop-shadow-[0_0_6px_#00fbfb]"

  const underline =
    "after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-[#00fbfb] after:shadow-[0_0_10px_#00fbfb] after:transition-all after:duration-300 hover:after:w-full"

  return (
    <>
      <style>{`
        .navbar {
          background: rgba(10,10,10,0.7);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow: 0 0 20px rgba(255,122,251,0.1);
          position: fixed;
          top: 0;
          width: 100%;
          z-index: 50;
        }

        .nav-container {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          padding: 1rem 2rem;
        }

        .nav-links {
          display: flex;
          justify-content: center;
          gap: 2rem;
        }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .search {
          background: #0a0a0a;
          border-radius: 9999px;
          padding: 0.5rem 1.5rem;
          width: 16rem;
          color: white;
          border: 1px solid transparent;
          transition: 0.3s;
        }

        .search:focus {
          outline: none;
          border-color: #00fbfb;
          box-shadow: 0 0 10px #00fbfb66;
        }

        .search::placeholder {
          color: #6b7280;
        }

        a {
          text-decoration: none !important;
        }

        @media (max-width: 768px) {
          .nav-links {
            display: none;
          }
        }
      `}</style>

      <nav>
        <div>

          {/* Logo (LEFT) */}
          <Link
            to="/">
            NEON_HORIZON
          </Link>

          {/* CENTER LINKS */}
          <div>
            {navLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}>
                {label}
              </Link>
            ))}

            {user?.role === 'admin' && (
              <Link
                to="/admin">
                Admin
              </Link>
            )}
          </div>

          {/* RIGHT SIDE */}
          <div>

            {/* Search */}
            <input type="text"
              placeholder="Search the multiverse..."
              
            />

            {/* Notifications */}
            <button>
              notifications
            </button>

            {/* User / Login */}
            {user ? (
              <div onClick={logout}>
                <img alt="avatar"
                  
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBmHxfNli6XM1YQSTpTFGTJIyVYUC_TVkdvumAPn_Do7J6IU0QgviImTfndK73dfU6opJw7j-e4sZYvq7s53Bct84Ae14-7CjWQiEALRInPe-j59SWYcm8njDJisH96OEDfGjyRstc4wc_nvsJJ7t2Hylw9BR7nrofkJg6ffRdOsbA4B5ZjaSDyXC65DTI3_sOSx8d4qovaM1TW1HLz58PnAm1HqZ362SFmFxCFabfN8V5eS8unzgoqHa_mL_RKl58GKLpC_S1SfR1J"
                />
              </div>
            ) : (
              <Link
                to="/login">
                LOGIN
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar