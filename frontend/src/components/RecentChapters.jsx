import React from 'react'
import { Link } from 'react-router-dom'

const RecentChapters = ({ latestChapters = [] }) => {
  return (
    <section className="relative bg-black text-white py-20 px-6 overflow-hidden">

      {/* Background glow */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-purple-600 opacity-20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-120px] right-[-100px] w-[300px] h-[300px] bg-pink-600 opacity-20 blur-[120px] rounded-full"></div>

      <div className="relative max-w-7xl mx-auto">

        {/* HEADER */}
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

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* FEATURED CARD */}
          <Link 
            to={latestChapters[0] ? `/manga/${latestChapters[0]._id}` : '#'}
            className="lg:col-span-2 group relative rounded-2xl overflow-hidden"
          >
            <img 
              src={latestChapters[0]?.coverImage}
              className="w-full h-[400px] object-cover group-hover:scale-105 transition duration-500"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>

            <div className="absolute bottom-6 left-6 right-6">
              <span className="text-xs bg-purple-500 px-3 py-1 rounded-full">
                🔥 Trending Now
              </span>

              <h3 className="text-2xl font-bold mt-3">
                {latestChapters[0]?.title || "Ghost in the Mesh"}
              </h3>

              <p className="text-gray-300 text-sm mt-2">
                {latestChapters[0]?.description || "Chapter drop just hit. Dive in now."}
              </p>
            </div>
          </Link>

          {/* SIDE CARDS */}
          <div className="flex flex-col gap-6">

            {/* CARD 1 */}
            <Link 
              to={latestChapters[1] ? `/manga/${latestChapters[1]._id}` : '#'}
              className="group flex gap-4 bg-white/5 border border-white/10 backdrop-blur-lg rounded-xl p-4 hover:bg-white/10 transition"
            >
              <img 
                src={latestChapters[1]?.coverImage}
                className="w-20 h-28 object-cover rounded-lg group-hover:scale-105 transition"
              />

              <div>
                <h4 className="font-semibold">
                  {latestChapters[1]?.title || "Shadow Bound"}
                </h4>

                <p className="text-xs text-gray-400">
                  Chapter {latestChapters[1]?.order || '24'}
                </p>

                <p className="text-xs text-gray-300 mt-2 line-clamp-2">
                  {latestChapters[1]?.description || "The warriors gather for a final stand."}
                </p>
              </div>
            </Link>

            {/* CARD 2 */}
            <Link 
              to={latestChapters[2] ? `/manga/${latestChapters[2]._id}` : '#'}
              className="group bg-white/5 border border-white/10 backdrop-blur-lg rounded-xl p-4 hover:bg-white/10 transition"
            >
              <img 
                src={latestChapters[2]?.coverImage}
                className="w-full h-40 object-cover rounded-lg mb-3 group-hover:scale-105 transition"
              />

              <h4 className="font-semibold">
                {latestChapters[2]?.title || "Prism Gate"}
              </h4>

              <p className="text-xs text-purple-400 mt-1">
                New Release
              </p>

              <div className="flex justify-between mt-3 text-xs text-gray-300">
                <span>Read Now</span>
                <span>🔖</span>
              </div>
            </Link>

            {/* CARD 3 */}
            <Link 
              to={latestChapters[3] ? `/manga/${latestChapters[3]._id}` : '#'}
              className="group bg-white/5 border border-white/10 backdrop-blur-lg rounded-xl p-4 hover:bg-white/10 transition"
            >
              <img 
                src={latestChapters[3]?.coverImage}
                className="w-full h-40 object-cover rounded-lg mb-3 group-hover:scale-105 transition"
              />

              <h4 className="font-semibold">
                {latestChapters[3]?.title || "Cloud Walker"}
              </h4>

              <p className="text-xs text-pink-400 mt-1">
                Weekly Top
              </p>

              <div className="flex justify-between mt-3 text-xs text-gray-300">
                <span>Read Now</span>
                <span>🔖</span>
              </div>
            </Link>

          </div>

        </div>

      </div>
    </section>
  )
}

export default RecentChapters