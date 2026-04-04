import { useState, useEffect } from 'react'
import api from '../../services/api'
import toast from 'react-hot-toast'
import { FaUser, FaShieldAlt, FaBan, FaSearch } from 'react-icons/fa'

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [updating, setUpdating] = useState(null)

  useEffect(() => { fetchUsers() }, [])

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/admin/users')
      setUsers(data)
    } catch {
      toast.error('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (id, updates) => {
    setUpdating(id)
    try {
      const { data } = await api.put(`/admin/users/${id}`, updates)
      setUsers(users.map(u => u._id === id ? data : u))
      toast.success('User updated')
    } catch {
      toast.error('Failed to update')
    } finally {
      setUpdating(null)
    }
  }

  const toggleBan = (user) => {
    handleUpdate(user._id, { role: user.role, isBanned: !user.isBanned })
  }

  const toggleAdmin = (user) => {
    handleUpdate(user._id, {
      role: user.role === 'admin' ? 'user' : 'admin',
      isBanned: user.isBanned
    })
  }

  const filtered = users.filter(u =>
    u.username?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6 text-white">

      {/* SEARCH */}
      <div className="relative max-w-md">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search users..."
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 outline-none transition"
        />
      </div>

      {/* COUNT */}
      <p className="text-gray-400 text-sm">
        {filtered.length} user{filtered.length !== 1 ? 's' : ''}
      </p>

      {/* LOADING */}
      {loading ? (
        <div className="text-center text-gray-500 py-20">Loading users...</div>
      ) : (

        /* USER GRID */
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">

          {filtered.map(user => (
            <div
              key={user._id}
              className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:border-purple-500/30 hover:scale-[1.02] transition-all"
            >

              {/* USER INFO */}
              <div className="flex items-center gap-4 mb-4">

                <div className={`p-3 rounded-xl ${
                  user.role === 'admin'
                    ? 'bg-purple-500/20'
                    : 'bg-white/10'
                }`}>
                  {user.role === 'admin'
                    ? <FaShieldAlt className="text-purple-400" />
                    : <FaUser className="text-gray-400" />
                  }
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">{user.username}</span>

                    {user.role === 'admin' && (
                      <span className="px-2 py-1 text-xs rounded-full bg-purple-500/20 text-purple-400">
                        Admin
                      </span>
                    )}

                    {user.isBanned && (
                      <span className="px-2 py-1 text-xs rounded-full bg-red-500/20 text-red-400">
                        Banned
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-400">{user.email}</p>
                  <p className="text-xs text-gray-500">
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-3">

                <button
                  onClick={() => toggleAdmin(user)}
                  disabled={updating === user._id}
                  className="flex-1 py-2 rounded-lg bg-purple-600/20 hover:bg-purple-600/40 text-sm transition disabled:opacity-50"
                >
                  {user.role === 'admin' ? 'Demote' : 'Make Admin'}
                </button>

                <button
                  onClick={() => toggleBan(user)}
                  disabled={updating === user._id}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/40 text-sm transition disabled:opacity-50"
                >
                  <FaBan />
                  {user.isBanned ? 'Unban' : 'Ban'}
                </button>

              </div>

            </div>
          ))}

        </div>
      )}
    </div>
  )
}

export default UserManagement