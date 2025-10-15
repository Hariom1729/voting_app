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
    <div className="min-h-screen relative overflow-hidden bg-gray-950 font-mono p-4 flex items-center justify-center">
      {/* Background grid overlay */}
      <div className="absolute inset-0 z-0 opacity-30" style={{ backgroundImage: 'linear-gradient(to right, #1a1a1a 1px, transparent 1px), linear-gradient(to bottom, #1a1a1a 1px, transparent 1px)', backgroundSize: '40px 40px', backgroundPosition: '-1px -1px', pointerEvents: 'none' }} />
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/30 to-black/60 z-0" />

      {/* Main container changed to a 2-column grid */}
      <div className="relative z-10 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

        {/* Left Column: Face Verification UI */}
        <div className="bg-black/30 backdrop-blur-sm border border-cyan-500/50 rounded-lg shadow-lg shadow-cyan-500/10 p-8 text-center space-y-6">
          <h2 
            className="text-2xl font-bold text-cyan-400"
            style={{ textShadow: '0 0 8px rgba(0, 255, 255, 0.7)' }}
          >
            Candidate Face Verification
          </h2>
          <div className="aspect-video w-full bg-black/80 rounded-md grid place-items-center border-2 border-emerald-500/50 animate-pulse">
            <p className="text-emerald-400 font-medium">WEBCAM FEED</p>
          </div>
          <button 
            onClick={handleCapture} 
            className="w-full py-3 rounded-md font-medium text-lg bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 border border-emerald-500 shadow-lg shadow-emerald-500/20 transition-all duration-300"
          >
            Capture & Verify
          </button>
        </div>

        {/* New Right Column: Article/Description Section */}
        <div className="text-gray-300">
            <h2 className="text-2xl font-bold text-emerald-400 mb-4" style={{ textShadow: '0 0 8px rgba(16, 185, 129, 0.7)' }}>
                Biometric Confirmation
            </h2>
            <p className="mb-4 text-base leading-relaxed">
                This final step creates a secure, biometric link between your digital registration and your physical identity. It ensures that the individual on the ballot is verifiably you, preventing impersonation and solidifying public trust.
            </p>
            <p className="text-base leading-relaxed text-gray-400">
                Our liveness check confirms you are present for this verification, providing the highest level of security for your candidacy. Please center your face in the webcam feed and ensure you are in a well-lit area.
            </p>
        </div>
      </div>
    </div>
  )
}