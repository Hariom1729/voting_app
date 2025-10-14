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

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-2 text-center">Candidate OTP Verification</h2>
        <div className="flex justify-center mb-4">
          <button onClick={handleSendOtp} className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700">Send OTP</button>
        </div>
        <form onSubmit={handleVerify} className="space-y-3">
          <input name="otp" type="text" inputMode="numeric" className="w-full border rounded px-3 py-2" placeholder="Enter OTP" required />
          <button type="submit" className="w-full bg-green-600 text-white rounded py-2 hover:bg-green-700">Verify OTP</button>
        </form>
      </div>
    </div>
  )
}


