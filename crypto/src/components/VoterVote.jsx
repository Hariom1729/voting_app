import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { appState, recordVote } from '../state'

export default function VoterVote() {
  const location = useLocation()
  const navigate = useNavigate()
  if (!appState.voter.faceVerified) {
    return <Navigate to="/voter/face" state={{ from: location }} replace />
  }

  const candidates = appState.candidates

  function handleVote(candidateName) {
    const aadhaar = appState.voter.user?.aadhaar
    recordVote(candidateName, aadhaar)
    alert(`Your vote for ${candidateName} has been recorded. Thank you!`)
    // Reset voter state for demo
    appState.voter.registered = false
    appState.voter.otpVerified = false
    appState.voter.faceVerified = false
    appState.voter.user = null
    navigate('/')
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">Cast Your Vote</h2>
        <ul className="space-y-3">
          {candidates.map((c) => (
            <li key={c.id} className="border rounded p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">{c.name}</p>
                <p className="text-sm text-gray-600">{c.party}</p>
              </div>
              <button onClick={() => handleVote(c.name)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Vote</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}


