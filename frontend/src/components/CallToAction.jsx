import React from 'react'
import { Link } from 'react-router-dom'

const CallToAction = () => {
  return (
    <section className="relative bg-black text-white py-28 px-6 overflow-hidden">

      {/* Background Glow */}
      <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-600 opacity-20 blur-[150px] rounded-full"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-pink-600 opacity-20 blur-[120px] rounded-full"></div>

      {/* Subtle Grid Texture */}
      <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      <div className="relative max-w-4xl mx-auto text-center">

        {/* HEADLINE */}
        <h2 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
          Become part of the{" "}
          <span className="bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
            Legend
          </span>
        </h2>

        {/* SUBTEXT */}
        <p className="text-gray-300 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
          Join thousands of creators and fans in the most advanced anime ecosystem on the web. 
          Unlock exclusive content, early access drops, and a next-level community experience.
        </p>

        {/* BUTTONS */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">

          <Link to="/register">
            <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 font-semibold text-lg hover:scale-105 transition duration-300 shadow-lg shadow-purple-500/30">
              🚀 Get Early Access
            </button>
          </Link>

          <Link to="/about">
            <button className="px-8 py-4 rounded-xl border border-white/20 backdrop-blur-md hover:bg-white/10 transition duration-300 text-lg">
              Learn More
            </button>
          </Link>

        </div>

        {/* TRUST LINE */}
        <p className="text-xs text-gray-500 mt-8">
          Join 10,000+ anime fans & creators already inside ⚡
        </p>

      </div>

      {/* Bottom Fade into Footer */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-black"></div>

    </section>
  )
}

export default CallToAction