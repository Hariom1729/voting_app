import { useNavigate } from 'react-router-dom'

export default function CandidateSuccess() {
  const navigate = useNavigate()
  return (
    // Change: Themed main container
    <div className="min-h-screen relative overflow-hidden bg-gray-950 font-mono p-4 flex items-center justify-center">
      {/* Background grid overlay */}
      <div className="absolute inset-0 z-0 opacity-30" style={{ backgroundImage: 'linear-gradient(to right, #1a1a1a 1px, transparent 1px), linear-gradient(to bottom, #1a1a1a 1px, transparent 1px)', backgroundSize: '40px 40px', backgroundPosition: '-1px -1px', pointerEvents: 'none' }} />
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/30 to-black/60 z-0" />

      {/* Change: Themed content card with emerald accent */}
      <div className="relative z-10 w-full max-w-md bg-black/30 backdrop-blur-sm border border-emerald-500/50 rounded-lg shadow-lg shadow-emerald-500/10 p-8 text-center space-y-6">
        <h2 
          className="text-2xl font-bold text-emerald-400"
          style={{ textShadow: '0 0 8px rgba(16, 185, 129, 0.7)' }}
        >
          You are now listed as a Candidate!
        </h2>
        
        <p className="text-gray-300">Your profile has been added successfully.</p>
        
        <div className="flex justify-center pt-2">
          {/* Change: Themed "Back to Home" button */}
          <button 
            onClick={() => navigate('/')} 
            className="px-6 py-2 rounded-md bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-300 border border-indigo-500 shadow-lg shadow-indigo-500/20 transition-all duration-300"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}