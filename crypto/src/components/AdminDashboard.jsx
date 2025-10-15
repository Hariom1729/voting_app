import { Navigate, useNavigate } from 'react-router-dom'
import { appState } from '../state'

export default function AdminDashboard() {
  const navigate = useNavigate()
  if (!appState.admin.loggedIn) {
    return <Navigate to="/admin/login" replace />
  }

  const totalVotes = appState.candidates.reduce((sum, c) => sum + c.votes, 0)

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-950 font-mono p-6">
      <div className="absolute inset-0 z-0 opacity-30" style={{ backgroundImage: 'linear-gradient(to right, #1a1a1a 1px, transparent 1px), linear-gradient(to bottom, #1a1a1a 1px, transparent 1px)', backgroundSize: '40px 40px', backgroundPosition: '-1px -1px', pointerEvents: 'none' }} />
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/30 to-black/60 z-0" />

      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 
              className="text-3xl font-bold text-indigo-400"
              style={{ textShadow: '0 0 8px rgba(129, 140, 248, 0.7)' }}
            >
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-400 mt-1">Logged in as {appState.admin.email}</p>
          </div>
          
          <button 
            onClick={() => navigate('/candidate/aadhaar')} 
            className="px-8 py-3 rounded-md bg-fuchsia-500/20 hover:bg-fuchsia-500/40 text-fuchsia-300 border border-fuchsia-500 shadow-lg shadow-fuchsia-500/20 transition-all duration-300"
          >
            Add the Candidate
          </button>
        </div>

        {/* Main content area changed to a grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column: Data Cards */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-black/30 backdrop-blur-sm border border-indigo-500/50 rounded-lg shadow-lg shadow-indigo-500/10 p-6">
              <h2 className="text-xl font-bold mb-4 text-indigo-400">Votes by Candidate</h2>
              <div className="space-y-4">
                {appState.candidates.map(c => {
                  const pct = totalVotes > 0 ? Math.round((c.votes / totalVotes) * 100) : 0
                  return (
                    <div key={c.id}>
                      <div className="flex justify-between text-sm mb-1 text-gray-300">
                        <span className="font-medium">{c.name} <span className="text-gray-500">({c.party})</span></span>
                        <span>{c.votes} votes · {pct}%</span>
                      </div>
                      <div className="h-3 bg-gray-700 rounded-full">
                        <div className="h-3 bg-fuchsia-500 rounded-full" style={{ width: `${pct}%`, boxShadow: '0 0 6px rgba(217, 70, 239, 0.7)' }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="bg-black/30 backdrop-blur-sm border border-indigo-500/50 rounded-lg shadow-lg shadow-indigo-500/10 p-6">
              <h2 className="text-xl font-bold mb-4 text-indigo-400">Voters</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700 text-left">
                      <th className="py-2 pr-4 font-medium text-gray-300">Name</th>
                      <th className="py-2 pr-4 font-medium text-gray-300">Aadhaar</th>
                      <th className="py-2 pr-4 font-medium text-gray-300">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appState.voters.map(v => (
                      <tr key={v.aadhaar} className="border-b border-gray-800 last:border-0">
                        <td className="py-3 pr-4 text-gray-400">{v.name}</td>
                        <td className="py-3 pr-4 text-gray-400">{v.aadhaar}</td>
                        <td className={`py-3 pr-4 font-medium ${v.hasVoted ? 'text-green-400' : 'text-red-400'}`}>
                          {v.hasVoted ? 'Voted' : 'Not Voted'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* New Right Column: Article/Description Section */}
          <div className="lg:col-span-1">
            <div className="bg-black/30 backdrop-blur-sm border border-indigo-500/50 rounded-lg shadow-lg shadow-indigo-500/10 p-6 text-gray-300 sticky top-6">
              <h2 className="text-xl font-bold text-indigo-400 mb-4">
                Dashboard Overview
              </h2>
              <div className="space-y-4 text-sm">
                <div>
                    <h3 className="font-semibold text-fuchsia-400">Votes by Candidate</h3>
                    <p className="text-gray-400 leading-relaxed">This panel provides a real-time visualization of votes cast, showing both the raw vote count and the overall percentage for each candidate.</p>
                </div>
                <div>
                    <h3 className="font-semibold text-fuchsia-400">Voter Roll</h3>
                    <p className="text-gray-400 leading-relaxed">This table lists all citizens who have successfully registered to vote. Their status is updated in real-time to reflect whether they have cast their ballot, ensuring transparency and aiding in auditing.</p>
                </div>
                <div>
                    <h3 className="font-semibold text-fuchsia-400">Administrator Actions</h3>
                    <p className="text-gray-400 leading-relaxed">Use the buttons and controls on this dashboard to manage the election. The "Add the Candidate" button allows for the registration of new candidates onto the ballot.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}