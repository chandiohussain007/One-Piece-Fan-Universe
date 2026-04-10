import React from 'react'
import { Link } from 'react-router-dom'

const RecentChapters = ({ latestChapters = [] }) => {
  const featured = latestChapters[0]
  const sides = latestChapters.slice(1, 4)

  return (
    <section className="bg-black text-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12 flex-wrap gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              Latest <span className="text-purple-400">Chapters</span>
            </h2>
          </div>

          <Link 
            to="/manga"
            className="text-sm px-5 py-2 rounded-full border border-white/20 hover:bg-white/10 transition backdrop-blur-md"
          >
            View All Releases →
          </Link>
        </div>

        {/* Grid */}
        {latestChapters.length === 0 ? (
          <div className="text-gray-400 text-center py-10">Loading latest chapters...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Featured */}
            {featured && (
              <Link 
                to={`/manga/${featured.mangaDexChapterId}`}
                className="lg:col-span-2 rounded-2xl overflow-hidden shadow-lg group relative block bg-gray-900 border border-gray-800"
              >
                <div className="aspect-[3/2] w-full overflow-hidden rounded-2xl bg-black">
                  {featured.coverImage && (
                    <img 
                      src={featured.coverImage}
                      alt={featured.title}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                      loading="lazy"
                    />
                  )}
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
                  <span className="text-xs bg-purple-600 px-3 py-1 rounded-full text-white font-bold tracking-wide">
                    🔥 Latest Drop
                  </span>
                  <h3 className="text-2xl font-bold mt-3 text-white line-clamp-2">{featured.title}</h3>
                  <p className="text-gray-300 text-sm mt-2 font-medium">
                    {featured.chapter && `Chapter ${featured.chapter}`} {featured.volume && `(Vol ${featured.volume})`}
                  </p>
                </div>
              </Link>
            )}

            {/* Side Cards */}
            <div className="flex flex-col gap-6">
              {sides.map((ch) => (
                <Link 
                  key={ch._id}
                  to={`/manga/${ch.mangaDexChapterId}`}
                  className="flex gap-4 bg-gray-900 border border-gray-800 rounded-xl p-4 hover:bg-gray-800 transition-colors group"
                >
                  <div className="w-20 h-28 overflow-hidden rounded-lg bg-black flex-shrink-0">
                    {ch.coverImage && (
                      <img 
                        src={ch.coverImage}
                        alt={ch.title}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 filter transition-opacity"
                        loading="lazy"
                      />
                    )}
                  </div>
                  <div className="flex flex-col justify-center">
                    <h4 className="font-semibold text-gray-200 line-clamp-2 group-hover:text-purple-400 transition-colors">
                      {ch.title}
                    </h4>
                    <p className="text-xs text-gray-400 mt-2 font-medium">
                      {ch.chapter && `Chapter ${ch.chapter}`}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

          </div>
        )}
      </div>
    </section>
  )
}

export default RecentChapters