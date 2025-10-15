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

  const inputStyles = "w-full bg-gray-800/50 border border-gray-600 rounded px-3 py-2 text-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-500";

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-950 font-mono p-4 flex items-center justify-center">
      {/* Background grid overlay */}
      <div className="absolute inset-0 z-0 opacity-30" style={{ backgroundImage: 'linear-gradient(to right, #1a1a1a 1px, transparent 1px), linear-gradient(to bottom, #1a1a1a 1px, transparent 1px)', backgroundSize: '40px 40px', backgroundPosition: '-1px -1px', pointerEvents: 'none' }} />
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/30 to-black/60 z-0" />
      
      {/* Main container changed to a 2-column grid */}
      <div className="relative z-10 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      
        {/* Left Column: Admin Login Form */}
        <div className="bg-black/30 backdrop-blur-sm border border-indigo-500/50 rounded-lg shadow-lg shadow-indigo-500/10 p-8">
          <h2 
            className="text-2xl font-bold text-indigo-400 mb-6 text-center"
            style={{ textShadow: '0 0 8px rgba(129, 140, 248, 0.7)' }}
          >
            Admin Sign In
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300" htmlFor="email">Email</label>
              <input id="email" name="email" type="email" required className={inputStyles} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300" htmlFor="password">Password</label>
              <input id="password" name="password" type="password" required className={inputStyles} />
            </div>
            <div className="pt-2">
              <button 
                type="submit" 
                className="w-full py-3 rounded-md font-medium text-lg bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-300 border border-indigo-500 shadow-lg shadow-indigo-500/20 transition-all duration-300"
              >
                Login
              </button>
            </div>
          </form>
        </div>

        {/* New Right Column: Article/Description Section */}
        <div className="text-gray-300">
            <h2 className="text-2xl font-bold text-indigo-400 mb-4" style={{ textShadow: '0 0 8px rgba(129, 140, 248, 0.7)' }}>
                Election Control Center
            </h2>
            <p className="mb-4 text-base leading-relaxed">
                This portal provides authorized administrators with access to the election's operational dashboard. Here, you can monitor live voting data, manage candidate and voter lists, and ensure the overall integrity of the election process.
            </p>
            <p className="text-base leading-relaxed text-gray-400">
                Access is strictly monitored and restricted to verified personnel. All actions taken within the dashboard are logged for transparency and security auditing. Please proceed with authorized credentials only.
            </p>
        </div>

      </div>
    </div>
  )
}