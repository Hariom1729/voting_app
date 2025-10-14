import { useNavigate } from 'react-router-dom'
import { appState, addVoter } from '../state'

export default function VoterRegister() {
  const navigate = useNavigate()
  const bgUrl = 'https://s.france24.com/media/display/a05c53a6-f5a5-11ee-9356-005056bf30b7/w:980/TAG-India-election.jpg'

  function handleSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const user = {
      name: formData.get('name')?.toString().trim() || '',
      gender: formData.get('gender')?.toString() || '',
      dob: formData.get('dob')?.toString() || '',
      aadhaar: formData.get('aadhar')?.toString().trim() || '',
    }
    appState.voter.user = user
    appState.voter.registered = true
    addVoter({ name: user.name, aadhaar: user.aadhaar })
    navigate('/voter/otp')
  }

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center p-4" style={{ backgroundImage: `url(${bgUrl})` }}>
      <div className="w-full max-w-md bg-white/90 backdrop-blur rounded-lg shadow p-6">
        <h1 className="text-2xl font-semibold text-center mb-4">Voter Registration</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="name">Full Name</label>
            <input id="name" name="name" type="text" required className="w-full border rounded px-3 py-2 focus:outline-none focus:ring" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="gender">Gender</label>
            <select id="gender" name="gender" required className="w-full border rounded px-3 py-2 focus:outline-none focus:ring">
              <option value="">Select...</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="dob">Date of Birth</label>
            <input id="dob" name="dob" type="date" required className="w-full border rounded px-3 py-2 focus:outline-none focus:ring" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="aadhar">Aadhaar Number</label>
            <input id="aadhar" name="aadhar" inputMode="numeric" pattern="\d{12}" placeholder="12-digit number" required className="w-full border rounded px-3 py-2 focus:outline-none focus:ring" />
            <p className="text-xs text-gray-600 mt-1">We will verify with an OTP linked to your Aadhaar.</p>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white rounded py-2 hover:bg-blue-700">Register</button>
        </form>
      </div>
    </div>
  )
}


