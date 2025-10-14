import { Navigate } from 'react-router-dom'
import { appState } from '../state'

export default function AdminDashboard() {
  if (!appState.admin.loggedIn) {
    return <Navigate to="/admin/login" replace />
  }

  const totalVotes = appState.candidates.reduce((sum, c) => sum + c.votes, 0)

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-baseline justify-between">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-gray-600">Logged in as {appState.admin.email}</p>
        </div>

        {/* Candidates with visualization */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Votes by Candidate</h2>
          <div className="space-y-3">
            {appState.candidates.map(c => {
              const pct = totalVotes > 0 ? Math.round((c.votes / totalVotes) * 100) : 0
              return (
                <div key={c.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{c.name} <span className="text-gray-500">({c.party})</span></span>
                    <span>{c.votes} votes · {pct}%</span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded">
                    <div className="h-3 bg-blue-600 rounded" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Voter list */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Voters</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Aadhaar</th>
                  <th className="py-2 pr-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {appState.voters.map(v => (
                  <tr key={v.aadhaar} className="border-b last:border-0">
                    <td className="py-2 pr-4">{v.name}</td>
                    <td className="py-2 pr-4">{v.aadhaar}</td>
                    <td className="py-2 pr-4">{v.hasVoted ? 'Voted' : 'Not Voted'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}


