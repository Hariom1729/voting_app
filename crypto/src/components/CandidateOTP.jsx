import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { appState } from '../state'

export default function CandidateOTP() {
  const location = useLocation()
  const navigate = useNavigate()
  if (!appState.candidate.aadhaarEntered) {
    return <Navigate to="/candidate/aadhaar" state={{ from: location }} replace />
  }

  function handleSendOtp() {
    alert(`OTP sent to Aadhaar: ${appState.candidate.profile?.aadhaar}`)
  }

  function handleVerify(e) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const otp = form.get('otp')?.toString().trim()
    if (!otp || otp.length < 4) {
      alert('Enter a valid OTP')
      return
    }
    appState.candidate.otpVerified = true
    navigate('/candidate/face')
  }

  const inputStyles = "w-full bg-gray-800/50 border border-gray-600 rounded px-3 py-2 text-gray-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 placeholder-gray-500 text-center tracking-[0.5em]";

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-950 font-mono p-4 flex items-center justify-center">
      {/* Background grid overlay */}
      <div className="absolute inset-0 z-0 opacity-30" style={{ backgroundImage: 'linear-gradient(to right, #1a1a1a 1px, transparent 1px), linear-gradient(to bottom, #1a1a1a 1px, transparent 1px)', backgroundSize: '40px 40px', backgroundPosition: '-1px -1px', pointerEvents: 'none' }} />
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/30 to-black/60 z-0" />
      
      {/* Main container changed to a 2-column grid */}
      <div className="relative z-10 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        
        {/* Left Column: OTP Form */}
        <div className="bg-black/30 backdrop-blur-sm border border-cyan-500/50 rounded-lg shadow-lg shadow-cyan-500/10 p-8 text-center">
          <h2 
            className="text-2xl font-bold text-cyan-400 mb-6"
            style={{ textShadow: '0 0 8px rgba(0, 255, 255, 0.7)' }}
          >
            Candidate OTP Verification
          </h2>
          <div className="flex justify-center mb-6">
            <button 
              onClick={handleSendOtp} 
              className="px-6 py-2 rounded-md bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 border border-emerald-500 shadow-lg shadow-emerald-500/20 transition-all duration-300"
            >
              Send OTP
            </button>
          </div>
          <form onSubmit={handleVerify} className="space-y-4">
            <input 
              name="otp" 
              type="text" 
              inputMode="numeric" 
              className={inputStyles}
              placeholder="ENTER OTP" 
              required 
            />
            <button 
              type="submit" 
              className="w-full py-3 rounded-md font-medium text-lg bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 border border-cyan-500 shadow-lg shadow-cyan-500/20 transition-all duration-300"
            >
              Verify OTP
            </button>
          </form>
        </div>

        {/* New Right Column: Article/Description Section */}
        <div className="text-gray-300">
            <h2 className="text-2xl font-bold text-emerald-400 mb-4" style={{ textShadow: '0 0 8px rgba(16, 185, 129, 0.7)' }}>
                Secure Authentication
            </h2>
            <p className="mb-4 text-base leading-relaxed">
                To protect your registration and prevent unauthorized changes, we use two-factor authentication. A unique One-Time Password (OTP) has been sent to the mobile number associated with your Aadhaar.
            </p>
            <p className="text-base leading-relaxed text-gray-400">
                Entering this code confirms your identity and ensures that you, and only you, are in control of this candidacy application. This is a vital step in maintaining the security and integrity of the election.
            </p>
        </div>

      </div>
    </div>
  )
}