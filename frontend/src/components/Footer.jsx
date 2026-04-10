import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="relative bg-black text-white pt-20 pb-10 px-6 overflow-hidden">

      {/* Glow Effects */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-purple-600 opacity-20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-120px] right-[-100px] w-[300px] h-[300px] bg-pink-600 opacity-20 blur-[120px] rounded-full"></div>

      <div className="relative max-w-7xl mx-auto">

        {/* TOP GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">

          {/* BRAND */}
          <div>
            <img src="/images/logo.png" alt="One Piece Fan Universe" className="h-10 mb-4" />

            <p className="text-gray-400 mt-4 text-sm leading-relaxed">
              Elevating the anime experience through cinematic design and 
              community-driven content.
            </p>
          </div>

          {/* UNIVERSE */}
          <div>
            <h5 className="font-semibold mb-4 text-white">Universe</h5>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link className="hover:text-purple-400 transition" to="/manga">Original Manga</Link></li>
              <li><Link className="hover:text-purple-400 transition" to="/videos">Streaming</Link></li>
              <li><Link className="hover:text-purple-400 transition" to="/fanart">Creators Hub</Link></li>
              <li><Link className="hover:text-purple-400 transition" to="#">The Vault</Link></li>
            </ul>
          </div>

          {/* COMMUNITY */}
          <div>
            <h5 className="font-semibold mb-4 text-white">Community</h5>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link className="hover:text-pink-400 transition" to="#">Discord</Link></li>
              <li><Link className="hover:text-pink-400 transition" to="/fanart">Fan Art Arena</Link></li>
              <li><Link className="hover:text-pink-400 transition" to="#">Events</Link></li>
              <li><Link className="hover:text-pink-400 transition" to="#">Merchandise</Link></li>
            </ul>
          </div>

          {/* SOCIAL */}
          <div>
            <h5 className="font-semibold mb-4 text-white">Connect</h5>

            <div className="flex gap-4">

              <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-purple-500/20 hover:border-purple-400 transition">
                🌐
              </a>

              <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-pink-500/20 hover:border-pink-400 transition">
                🎥
              </a>

              <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-purple-500/20 hover:border-purple-400 transition">
                📢
              </a>

            </div>
          </div>

        </div>

        {/* DIVIDER */}
        <div className="w-full h-px bg-white/10 mb-6"></div>

        {/* BOTTOM */}
        <div className="flex flex-col md:flex-row justify-between items-center text-gray-500 text-xs gap-4">

          <div className="flex flex-col gap-1">
            <p>
              © 2026 ONE PIECE FAN UNIVERSE. ALL RIGHTS RESERVED.
            </p>
            <p className="text-gray-600 flex items-center gap-1">
              Data synchronized via <img src="https://mangadex.org/favicon.ico" alt="MangaDex" className="h-3 w-3 inline-block grayscale opacity-70" /> MangaDex API.
            </p>
          </div>

          <div className="flex gap-6">
            <Link className="hover:text-white transition" to="#">Privacy Policy</Link>
            <Link className="hover:text-white transition" to="#">Terms of Service</Link>
          </div>

        </div>

      </div>
    </footer>
  )
}

export default Footer