import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { appState, addCandidate } from '../state'

export default function CandidateFace() {
  const location = useLocation()
  const navigate = useNavigate()
  if (!appState.candidate.otpVerified) {
    return <Navigate to="/candidate/otp" state={{ from: location }} replace />
  }

  function handleCapture(e) {
    e.preventDefault()
    appState.candidate.faceVerified = true
    addCandidate(appState.candidate.profile || {})
    navigate('/candidate/success')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6 text-center space-y-4">
        <h2 className="text-xl font-semibold">Candidate Face Verification</h2>
        <div className="aspect-video w-full bg-black/80 rounded grid place-items-center text-white">Webcam Placeholder</div>
        <button onClick={handleCapture} className="w-full bg-emerald-600 text-white rounded py-2 hover:bg-emerald-700">Capture & Verify</button>
      </div>
    </div>
  )
}


