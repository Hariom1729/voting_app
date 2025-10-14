import { useNavigate } from 'react-router-dom'
import { appState } from '../state'

export default function CandidateAadhaar() {
  const navigate = useNavigate()
  function handleSubmit(e) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const aadhaar = form.get('aadhar')?.toString().trim() || ''
    const name = form.get('name')?.toString().trim() || ''
    const party = form.get('party')?.toString().trim() || ''
    appState.candidate.profile = { aadhaar, name, party }
    appState.candidate.aadhaarEntered = true
    navigate('/candidate/otp')
  }
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-center">Candidate Sign In</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="name">Full Name</label>
            <input id="name" name="name" type="text" required className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="party">Party</label>
            <input id="party" name="party" type="text" placeholder="Independent if none" className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="aadhar">Aadhaar Number</label>
            <input id="aadhar" name="aadhar" inputMode="numeric" pattern="\d{12}" required className="w-full border rounded px-3 py-2" />
          </div>
          <button type="submit" className="w-full bg-emerald-600 text-white rounded py-2 hover:bg-emerald-700">Continue</button>
        </form>
      </div>
    </div>
  )
}


