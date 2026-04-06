import React from 'react'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <section className="relative min-h-screen bg-black text-white overflow-hidden">

      {/* Background Image */}
      <img 
        src="/images/1345309.jpeg"
        alt="anime bg"
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      />

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black/80 to-purple-900/40"></div>

      {/* Glow Effects */}
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-purple-600 opacity-30 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-120px] right-[-120px] w-[400px] h-[400px] bg-pink-600 opacity-30 blur-[120px] rounded-full"></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 flex flex-col lg:flex-row items-center justify-between gap-16">

        {/* LEFT TEXT */}
        <div className="max-w-xl">

          <h4 className="text-purple-400 uppercase tracking-widest mb-4 text-sm">
            The Horizon Awaits
          </h4>

          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            Welcome to the <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
              Anime Universe
            </span>
          </h1>

          <p className="text-gray-300 text-lg mb-8">
            Step into a world where high-fidelity art meets cinematic storytelling. 
            Experience the next generation of manga and fan culture.
          </p>

          {/* BUTTONS */}
          <div className="flex gap-4 flex-wrap">

            <Link to="/explore">
              <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 font-semibold hover:scale-105 transition duration-300 shadow-lg shadow-purple-500/30">
                Explore the Multiverse
              </button>
            </Link>

            <button className="px-6 py-3 rounded-xl border border-white/20 backdrop-blur-md hover:bg-white/10 transition duration-300">
              ▶ Watch Trailer
            </button>

          </div>
        </div>

        {/* RIGHT SIDE CARD */}
        <div className="relative">

          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 w-[300px] shadow-xl">

            <h3 className="text-xl font-semibold mb-3">
              Trending Now 🔥
            </h3>

            <ul className="space-y-2 text-gray-300 text-sm">
              <li className="hover:text-white transition">
                <Link to="">One Piece Manga Chapter 1100</Link>
              </li>
              <li className="hover:text-white transition">
                <Link to="">One Piece Movie: Red</Link>
              </li>
              <li className="hover:text-white transition">
                <Link to="">Latest One Piece Episode</Link>
              </li>
              <li className="hover:text-white transition">
                <Link to="">One Piece Official Merch</Link>
              </li>
            </ul>

          </div>

        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent"></div>


    </section>
  )
}

export default Hero