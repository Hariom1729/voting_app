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

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-2 text-center">OTP Verification</h2>
        <p className="text-sm text-gray-600 mb-4 text-center">Aadhaar: {appState.voter.user?.aadhaar}</p>
        <div className="flex justify-center mb-4">
          <button onClick={handleSendOtp} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Send OTP</button>
        </div>
        <form onSubmit={handleVerify} className="space-y-3">
          <input name="otp" type="text" inputMode="numeric" className="w-full border rounded px-3 py-2" placeholder="Enter OTP" required />
          <button type="submit" className="w-full bg-green-600 text-white rounded py-2 hover:bg-green-700">Verify OTP</button>
        </form>
      </div>
    </div>
  )
}


