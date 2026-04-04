import React from 'react'

const TrendingFanArt = ({ trendingArt = [] }) => {
  return (
    <section className="relative bg-black text-white py-20 px-6 overflow-hidden">

      {/* Glow background */}
      <div className="absolute top-[-100px] right-[-100px] w-[300px] h-[300px] bg-pink-600 opacity-20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-120px] left-[-100px] w-[300px] h-[300px] bg-purple-600 opacity-20 blur-[120px] rounded-full"></div>

      <div className="relative max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            Trending <span className="text-pink-400">Fan Art</span>
          </h2>
          <p className="text-gray-400 mt-2">
            Community masterpieces that are blowing up right now.
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[200px]">

          {trendingArt.slice(0, 4).map((art, i) => (
            <div
              key={i}
              className={`group relative overflow-hidden rounded-2xl ${
                i === 0 ? "md:col-span-2 md:row-span-2" : ""
              }`}
            >
              {/* IMAGE */}
              <img
                src={art?.mediaUrl}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />

              {/* DARK OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>

              {/* CONTENT */}
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition duration-300">

                <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-3">

                  <p className="font-semibold text-sm">
                    {art?.content || "Untitled Art"}
                  </p>

                  <p className="text-xs text-gray-300 mt-1">
                    by @{art?.user?.username || "Unknown"}
                  </p>

                  <div className="flex justify-between mt-3 text-sm text-gray-300">
                    <span className="hover:text-pink-400 cursor-pointer">❤</span>
                    <span className="hover:text-purple-400 cursor-pointer">↗</span>
                  </div>

                </div>
              </div>

              {/* SUBTLE BORDER GLOW */}
              <div className="absolute inset-0 rounded-2xl border border-white/10 group-hover:border-pink-500/40 transition"></div>

            </div>
          ))}

        </div>

      </div>
    </section>
  )
}

export default TrendingFanArt