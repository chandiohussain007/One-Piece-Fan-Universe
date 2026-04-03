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

  const fetchDashboardData = async () => {
    try {
      const statsRes = await api.get('/admin/stats').catch(() => ({ data: { activeUsers: '24.8K', newFanArtToday: 1402, mangaChapters: 892, reportedContent: 42 } }))
      setStats(statsRes.data)

      // keep if future use needed
      // const fanArtRes = await api.get('/fanart')
      // setRecentUploads(fanArtRes.data?.slice(0, 4) || [])
    } catch (err) {
      console.error('Could not load dashboard data', err)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const renderDashboardOverview = () => {
    const s = stats || { activeUsers: '24.8K', newFanArtToday: '1,402', mangaChapters: '892', reportedContent: '42' }

    return (
      <>
        <header>
          <div>
            <h2>Admin Core</h2>
            <p>System Overseer — Dashboard Overview</p>
          </div>
          <div>
            <button>
                                Generate Report
                            </button>
            <button>
                                Sync Database
                            </button>
          </div>
        </header>

        <section>
          <div>
            <div>
              <span data-icon="group">group</span>
            </div>
            <p>Active Users</p>
            <div>
              <h3>{s.activeUsers || '24.8K'}</h3>
              <span>+12%</span>
            </div>
          </div>
          <div>
            <div>
              <span data-icon="palette">palette</span>
            </div>
            <p>New Fan Art</p>
            <div>
              <h3>{s.newFanArtToday || '1,402'}</h3>
              <span>Today</span>
            </div>
          </div>
          <div>
            <div>
              <span data-icon="book_5">book_5</span>
            </div>
            <p>Manga Chapters</p>
            <div>
              <h3>{s.mangaChapters || '892'}</h3>
              <span>Total</span>
            </div>
          </div>
          <div>
            <div>
              <span data-icon="warning">warning</span>
            </div>
            <p>Reported Content</p>
            <div>
              <h3>{s.reportedContent || '42'}</h3>
              <span>Urgent</span>
            </div>
          </div>
        </section>

        <div>
          <section>
            <div>
              <h4>Recent User Uploads</h4>
              <a href="#">View All Activity</a>
            </div>
            <div>
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Content Type</th>
                    <th>Timestamp</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div>
                        <span data-icon="person">person</span>
                      </div>
                      <span>Kaito_Vibes</span>
                    </td>
                    <td>
                      <span>Fan Art</span>
                    </td>
                    <td>2 mins ago</td>
                    <td>
                      <span>
                        <span></span>
                                                              Approved
                                                          </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div>
                        <span data-icon="person">person</span>
                      </div>
                      <span>Manga_Collector_99</span>
                    </td>
                    <td>
                      <span>Chapter Update</span>
                    </td>
                    <td>14 mins ago</td>
                    <td>
                      <span>
                        <span></span>
                                                              Pending
                                                          </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div>
                        <span data-icon="person">person</span>
                      </div>
                      <span>GhostInShell</span>
                    </td>
                    <td>
                      <span>Video Clip</span>
                    </td>
                    <td>42 mins ago</td>
                    <td>
                      <span>
                        <span></span>
                                                              Approved
                                                          </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div>
                        <span data-icon="person">person</span>
                      </div>
                      <span>Nexus_Zero</span>
                    </td>
                    <td>
                      <span>Fan Art</span>
                    </td>
                    <td>1 hour ago</td>
                    <td>
                      <span>
                        <span></span>
                                                              Pending
                                                          </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h4>Quick Actions</h4>
            <div>
              <button onClick={() => setActiveTab('manga')}>
                <div>
                  <div>
                    <span data-icon="library_add">library_add</span>
                  </div>
                  <div>
                    <p>Add New Chapter</p>
                    <p>Upload latest manga scanlation</p>
                  </div>
                </div>
                <div></div>
              </button>
              <button onClick={() => setActiveTab('videos')}>
                <div>
                  <div>
                    <span data-icon="video_call">video_call</span>
                  </div>
                  <div>
                    <p>Upload Video</p>
                    <p>Add anime edits or trailers</p>
                  </div>
                </div>
                <div></div>
              </button>
              
              <div>
                <p>System Integrity</p>
                <div>
                  <div>
                    <div>
                      <span>Server Load</span>
                      <span>24%</span>
                    </div>
                    <div>
                      <div></div>
                    </div>
                  </div>
                  <div>
                    <div>
                      <span>Bandwidth Usage</span>
                      <span>68%</span>
                    </div>
                    <div>
                      <div></div>
                    </div>
                  </div>
                </div>
                <div>
                  <span>Global Status</span>
                  <span>
                    <span></span>
                                                    Operational
                                                </span>
                </div>
              </div>
            </div>
          </section>
        </div>
        
        <footer>
          <div>
            <span></span>
            <p>Neon Horizon Terminal v2.04</p>
            <span></span>
          </div>
        </footer>
      </>
    )
  }

  return (
    <div>
      <aside>
        <div>
          <h1 onClick={() => navigate('/')}>NEON_HORIZON</h1>
          <div>
            <img alt="Admin Avatar"  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQRpHZAQqWtvdVfCiIFT0t4bfiCD5FKRZyjV49dU4IxPxx6b8uYSiimPjQXhy6p8TPDiGB_SK5qn-97diNk3udF239IM5eGEvy07GEgoWnemzAMksKQD5luJlTV2KWjQHHZgQxYd4j5d7R3gPobtHNNEWNBWqHDF6huDN7P2yuQ1SBSIGxuzneiwzyhK6eFBx7MhPIjG0v9-aMw6cQZKHEQFTj5dK_qZcZnwxmUfZ1qifBEKSw8842K8w6v-Wdo8f9TtN5mvf-s-El"/>
            <div>
              <p>Admin Core</p>
              <p>System Overseer</p>
            </div>
          </div>
        </div>
        <nav>
          <a onClick={() => setActiveTab('dashboard')}>
            <span>dashboard</span>
            <span>Dashboard</span>
          </a>
          <a onClick={() => setActiveTab('manga')}>
            <span>book_5</span>
            <span>Manga Management</span>
          </a>
          <a onClick={() => setActiveTab('fanart')}>
            <span>palette</span>
            <span>Fan Art Moderation</span>
          </a>
          <a onClick={() => setActiveTab('videos')}>
            <span>movie</span>
            <span>Video Management</span>
          </a>
          <a onClick={() => setActiveTab('animelinks')}>
            <span>tv</span>
            <span>Anime Links</span>
          </a>
          <a onClick={() => setActiveTab('users')}>
            <span>group</span>
            <span>User Management</span>
          </a>
        </nav>
        <div>
          <a onClick={handleLogout}>
            <span>logout</span>
            <span>Logout</span>
          </a>
        </div>
      </aside>

      <main>
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