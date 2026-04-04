import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import MangaManagement from './admin/MangaManagement'
import FanArtModeration from './admin/FanArtModeration'
import VideoManagement from './admin/VideoManagement'
import UserManagement from './admin/UserManagement'
import AnimeLinkManagement from './admin/AnimeLinkManagement'

const AdminDashboard = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [stats, setStats] = useState(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const statsRes = await api.get('/admin/stats').catch(() => ({
        data: {
          activeUsers: '24.8K',
          newFanArtToday: 1402,
          mangaChapters: 892,
          reportedContent: 42
        }
      }))
      setStats(statsRes.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const renderDashboardOverview = () => {
    const s = stats || {
      activeUsers: '24.8K',
      newFanArtToday: '1,402',
      mangaChapters: '892',
      reportedContent: '42'
    }

    return (
      <div className="space-y-10">

        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold tracking-wide">
              Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Core</span>
            </h2>
            <p className="text-gray-400">System Overseer — Dashboard Overview</p>
          </div>

          <div className="flex gap-3">
            <button className="px-5 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-purple-500/40 transition">
              Generate Report
            </button>
            <button className="px-5 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105 transition">
              Sync Database
            </button>
          </div>
        </header>

        {/* STATS */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Active Users', value: s.activeUsers, color: 'purple' },
            { label: 'New Fan Art', value: s.newFanArtToday, color: 'pink' },
            { label: 'Manga Chapters', value: s.mangaChapters, color: 'blue' },
            { label: 'Reported Content', value: s.reportedContent, color: 'red' }
          ].map((item, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition backdrop-blur-md"
            >
              <p className="text-gray-400 text-sm">{item.label}</p>
              <h3 className="text-2xl font-bold mt-2">{item.value}</h3>
              <span className="text-xs text-green-400">+ Live</span>
            </div>
          ))}
        </section>

        {/* TABLE */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
          <div className="flex justify-between mb-4">
            <h4 className="font-semibold">Recent User Uploads</h4>
            <a className="text-purple-400 text-sm cursor-pointer">View All</a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-400">
                <tr>
                  <th className="text-left py-2">User</th>
                  <th>Type</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {['Approved', 'Pending', 'Approved', 'Pending'].map((status, i) => (
                  <tr key={i} className="border-t border-white/5 hover:bg-white/5 transition">
                    <td className="py-3">User_{i}</td>
                    <td>Fan Art</td>
                    <td>{i * 10} mins ago</td>
                    <td>
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        status === 'Approved'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* QUICK ACTIONS */}
        <section className="grid md:grid-cols-2 gap-6">

          <button
            onClick={() => setActiveTab('manga')}
            className="p-6 rounded-2xl bg-gradient-to-br from-purple-600/30 to-transparent border border-purple-500/20 hover:scale-[1.02] transition"
          >
            <p className="font-semibold">Add New Chapter</p>
            <p className="text-sm text-gray-400">Upload latest manga</p>
          </button>

          <button
            onClick={() => setActiveTab('videos')}
            className="p-6 rounded-2xl bg-gradient-to-br from-pink-600/30 to-transparent border border-pink-500/20 hover:scale-[1.02] transition"
          >
            <p className="font-semibold">Upload Video</p>
            <p className="text-sm text-gray-400">Add anime clips</p>
          </button>

        </section>

      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-black text-white overflow-x-hidden">

      {/* SIDEBAR */}
      <aside className="w-64 hidden md:flex flex-col justify-between border-r border-white/10 bg-black/80 backdrop-blur-xl p-6">

        <div>
          <h1
            onClick={() => navigate('/')}
            className="text-xl font-bold cursor-pointer mb-10 tracking-widest text-purple-400"
          >
            NEON_HORIZON
          </h1>

          <nav className="space-y-3">
            {[
              ['dashboard', 'Dashboard'],
              ['manga', 'Manga'],
              ['fanart', 'Fan Art'],
              ['videos', 'Videos'],
              ['animelinks', 'Anime Links'],
              ['users', 'Users']
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`w-full text-left px-4 py-2 rounded-lg transition ${
                  activeTab === key
                    ? 'bg-purple-600/20 text-purple-400'
                    : 'hover:bg-white/5 text-gray-400'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="text-red-400 hover:text-red-500 transition"
        >
          Logout
        </button>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-6 md:p-10">
        {activeTab === 'dashboard' && renderDashboardOverview()}
        {activeTab === 'manga' && <MangaManagement />}
        {activeTab === 'fanart' && <FanArtModeration />}
        {activeTab === 'videos' && <VideoManagement />}
        {activeTab === 'animelinks' && <AnimeLinkManagement />}
        {activeTab === 'users' && <UserManagement />}
      </main>

    </div>
  )
}

export default AdminDashboard