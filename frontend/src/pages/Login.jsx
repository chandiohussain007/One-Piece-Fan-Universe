import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
      toast.success('Logged in successfully!')
      navigate('/')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center px-6 overflow-hidden text-white">

      {/* Background Image */}
      <img
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBaC19CoKqiZaNcQMHCdDjsIwdBROfFcQC1o_Cr9PkarKZlyjWFLOi48JlXeIMyot9YqZlaCxJplJyxXxMNqlv6_N0eTLTLMi5g586aFmDXyTSERZVNvYx4zzATG4te2dJSRlGsyaGYa9wv5GEblesWKIOnCkXpkM-CvsFx5eX0ceKnT1wFL88sL8qErGpG5O6O4eRX_NBcR_6V4muo_FKHvt_nLELTdfmM8nMxFnHDm17JnuHQzHlQnU9i6VTSGU-w6Z7XVueS149d"
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black/80 to-purple-900/40"></div>

      {/* Glow Effects */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-purple-600 opacity-30 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-pink-600 opacity-30 blur-[120px] rounded-full"></div>

      {/* CARD */}
      <div className="relative z-10 w-full max-w-md backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">

        {/* TITLE */}
        <h2 className="text-3xl font-extrabold mb-2 text-center">
          Welcome Back
        </h2>
        <p className="text-gray-400 text-center mb-8 text-sm">
          Enter the Anime Universe again ✨
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* EMAIL */}
          <div>
            <label className="text-sm text-gray-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full mt-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 outline-none transition"
              placeholder="you@example.com"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm text-gray-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full mt-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 outline-none transition"
              placeholder="••••••••"
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 font-semibold text-lg hover:scale-[1.02] transition duration-300 shadow-lg shadow-purple-500/30 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

        </form>

        {/* FOOT TEXT */}
        <p className="text-gray-400 text-sm text-center mt-6">
          Don’t have an account?{" "}
          <Link to="/register" className="text-purple-400 hover:underline">
            Register
          </Link>
        </p>

      </div>

    </div>
  )
}

export default Login