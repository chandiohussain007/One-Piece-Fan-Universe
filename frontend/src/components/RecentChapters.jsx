import React from 'react'
import { Link } from 'react-router-dom'

const RecentChapters = () => {
  return (
    <section className="bg-black text-white py-20 px-6">

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-12 flex-wrap gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              Latest <span className="text-purple-400">Chapters</span>
            </h2>
            <p className="text-gray-400">
              Hand-picked drops from the hottest series right now.
            </p>
          </div>

          <Link 
            to="/manga"
            className="text-sm px-5 py-2 rounded-full border border-white/20 hover:bg-white/10 transition backdrop-blur-md"
          >
            View All Releases →
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Featured */}
          <Link 
            to="#"
            className="lg:col-span-2 rounded-2xl overflow-hidden shadow-lg"
          >
            <div className="aspect-[3/2] w-full overflow-hidden rounded-2xl">
              <img 
                src="/images/Chapter_1179.webp"
                alt="Nerona Imu Descends"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6 bg-gradient-to-t from-black via-black/60 to-transparent">
              <span className="text-xs bg-purple-500 px-3 py-1 rounded-full">
                🔥 Trending Now
              </span>
              <h3 className="text-2xl font-bold mt-3">Nerona Imu Descends</h3>
              <p className="text-gray-300 text-sm mt-2">Chapter 1179</p>
            </div>
          </Link>

          {/* Side Cards */}
          <div className="flex flex-col gap-6">

            <Link 
              to="#"
              className="flex gap-4 bg-white/5 border border-white/10 rounded-xl p-4"
            >
              <div className="w-20 h-28 overflow-hidden rounded-lg">
                <img 
                  src="/images/Chapter_1178.webp"
                  alt="Waking up from the Nightmare"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-semibold">Waking up from the Nightmare</h4>
                <p className="text-xs text-gray-400">Chapter 1178</p>
              </div>
            </Link>

            <Link 
              to="#"
              className="flex gap-4 bg-white/5 border border-white/10 rounded-xl p-4"
            >
              <div className="w-20 h-28 overflow-hidden rounded-lg">
                <img 
                  src="/images/Chapter_1177.webp"
                  alt="Furious"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-semibold">Furious</h4>
                <p className="text-xs text-gray-400">Chapter 1177</p>
              </div>
            </Link>

            <Link 
              to="#"
              className="flex gap-4 bg-white/5 border border-white/10 rounded-xl p-4"
            >
              <div className="w-20 h-28 overflow-hidden rounded-lg">
                <img 
                  src="/images/aces-story.webp"
                  alt="Ace's Story"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-semibold">Ace's Story</h4>
                <p className="text-xs text-gray-400">Light Novel</p>
              </div>
            </Link>

          </div>
        </div>
      </div>
    </section>
  )
}

export default RecentChapters