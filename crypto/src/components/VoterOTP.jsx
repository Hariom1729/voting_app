import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { appState } from '../state'

export default function VoterOTP() {
  const location = useLocation()
  const navigate = useNavigate()
  if (!appState.voter.registered) {
    return <Navigate to="/voter/register" state={{ from: location }} replace />
  }

  function handleSendOtp() {
    alert(`OTP sent to Aadhaar: ${appState.voter.user?.aadhaar}`)
  }

  function handleVerify(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const otp = formData.get('otp')?.toString().trim()
    if (!otp || otp.length < 4) {
      alert('Enter a valid OTP')
      return
    }
    appState.voter.otpVerified = true
    navigate('/voter/face')
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
            className="text-2xl font-bold text-cyan-400 mb-2"
            style={{ textShadow: '0 0 8px rgba(0, 255, 255, 0.7)' }}
          >
            OTP Verification
          </h2>
          <p className="text-sm text-fuchsia-400 mb-6">Aadhaar: {appState.voter.user?.aadhaar}</p>
          
          <div className="flex justify-center mb-6">
            <button 
              onClick={handleSendOtp} 
              className="px-6 py-2 rounded-md bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-300 border border-indigo-500 shadow-lg shadow-indigo-500/20 transition-all duration-300"
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
            <h2 className="text-2xl font-bold text-cyan-400 mb-4" style={{ textShadow: '0 0 8px rgba(0, 255, 255, 0.7)' }}>
                Two-Factor Authentication
            </h2>
            <p className="mb-4 text-base leading-relaxed">
                The One-Time Password (OTP) is a critical security measure. A unique code has been sent to the mobile number linked with your Aadhaar to confirm that you are the legitimate owner of this identity.
            </p>
            <p className="text-base leading-relaxed text-gray-400">
                This verification step prevents unauthorized access and ensures that only you can proceed to the final stages of casting your vote, adding a powerful layer of security to the democratic process.
            </p>
        </div>
      </div>
    </div>
  )
}