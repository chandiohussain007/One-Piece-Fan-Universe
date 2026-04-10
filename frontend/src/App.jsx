import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import Navbar from './components/Navbar'
import { HelmetProvider } from 'react-helmet-async'

// Pages
import LandingPage from './pages/LandingPage'
import MangaPage from './pages/MangaPage'
import MangaReaderPage from './pages/MangaReaderPage'
import FanArtPage from './pages/FanArtPage'
import VideosPage from './pages/VideosPage'
import AnimeLinksPage from './pages/AnimeLinksPage'
import AdminDashboard from './pages/AdminDashboard'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a1a2e',
            color: '#fff',
            border: '1px solid #7c3aed'
          }
        }}
      />

      {/* 🔥 MAIN LAYOUT WRAPPER */}
      <div>
        
        <Navbar />

        {/* 🔥 CONTENT WRAPPER */}
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/manga" element={<MangaPage />} />
            <Route path="/manga/:id" element={<MangaReaderPage />} />
            <Route path="/fanart" element={<FanArtPage />} />
            <Route path="/videos" element={<VideosPage />} />
            <Route path="/animelinks" element={<AnimeLinksPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
          </Routes>
        </main>

      </div>
      </AuthProvider>
    </HelmetProvider>
  )
}
export default App