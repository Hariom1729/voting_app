import { useNavigate } from 'react-router-dom'

export default function CandidateSuccess() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6 text-center space-y-4">
        <h2 className="text-2xl font-semibold text-emerald-700">You are now listed as a Candidate!</h2>
        <p className="text-gray-700">Your profile has been added successfully.</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => navigate('/')} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Back to Home</button>
        </div>
      </div>
    </div>
  )
}


