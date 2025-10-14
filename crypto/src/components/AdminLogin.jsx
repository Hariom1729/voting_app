import { useNavigate } from 'react-router-dom'
import { appState } from '../state'

export default function AdminLogin() {
  const navigate = useNavigate()
  function handleSubmit(e) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const email = form.get('email')?.toString().trim() || ''
    const password = form.get('password')?.toString() || ''
    if (!email || !password) return
    appState.admin.loggedIn = true
    appState.admin.email = email
    navigate('/admin/dashboard')
  }
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-center">Admin Sign In</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="password">Password</label>
            <input id="password" name="password" type="password" required className="w-full border rounded px-3 py-2" />
          </div>
          <button type="submit" className="w-full bg-purple-600 text-white rounded py-2 hover:bg-purple-700">Login</button>
        </form>
      </div>
    </div>
  )
}


