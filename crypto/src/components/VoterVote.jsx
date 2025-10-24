import { useState, useEffect } from 'react'; // Change: Imported useState and useEffect
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { appState, recordVote, loadCandidates } from '../state';

export default function VoterVote() {
  const location = useLocation();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(180); // Change: Added state for the 3-minute timer (180 seconds)

  const candidates = appState.candidates;

  // Change: Added a handleLogout function for session timeout
  function handleLogout() {
    alert("Session timed out. You have been logged out.");
    // Reset voter state
    appState.voter.registered = false;
    appState.voter.otpVerified = false;
    appState.voter.faceVerified = false;
    appState.voter.user = null;
    navigate('/');
  }

  // Load candidates when component mounts
  useEffect(() => {
    loadCandidates();
  }, []);

  // Change: Added useEffect to manage the countdown timer
  useEffect(() => {
    // If timer reaches 0, log out.
    if (timeLeft === 0) {
      handleLogout();
      return;
    }

    // Set up an interval to decrement the timer every second.
    const timerId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    // Clean up the interval when the component unmounts or timeLeft changes.
    return () => clearInterval(timerId);
  }, [timeLeft, navigate]);


  if (!appState.voter.faceVerified) {
    return <Navigate to="/voter/face" state={{ from: location }} replace />;
  }

  function handleVote(candidateName) {
    const aadhaar = appState.voter.user?.aadhaar;
    recordVote(candidateName, aadhaar);
    alert(`Your vote for ${candidateName} has been recorded. Thank you!`);
    // Reset voter state for demo
    appState.voter.registered = false;
    appState.voter.otpVerified = false;
    appState.voter.faceVerified = false;
    appState.voter.user = null;
    navigate('/');
  }

  // Format time for display
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-950 font-mono p-6">
      {/* Background grid overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-30" 
        style={{
          backgroundImage: 'linear-gradient(to right, #1a1a1a 1px, transparent 1px), linear-gradient(to bottom, #1a1a1a 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          backgroundPosition: '-1px -1px',
          pointerEvents: 'none'
        }}
      />
      {/* Subtle radial gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/30 to-black/60 z-0" />

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto p-6 space-y-6">
        <h2 
          className="text-3xl font-bold text-center text-cyan-400"
          style={{ textShadow: '0 0 8px rgba(0, 255, 255, 0.7)' }}
        >
          Cast Your Vote
        </h2>

        {/* Change: Added timer display */}
        <div className="text-center bg-red-900/50 border border-red-500/50 rounded-lg py-2">
          <p className="text-red-400 font-bold text-lg animate-pulse">
            Session Expires In: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
          </p>
        </div>

        <ul className="space-y-4">
          {candidates.map((c) => (
            <li key={c.id} className="bg-gray-500/10 border border-gray-700 rounded-lg p-4 hover:bg-gray-500/20 transition-colors duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {c.partyIcon && (
                    <div className="flex-shrink-0">
                      <img 
                        src={c.partyIcon} 
                        alt={`${c.party} icon`} 
                        className="w-12 h-12 object-cover rounded-full border-2 border-fuchsia-500/50"
                      />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-lg text-gray-200">{c.name}</p>
                    <p className="text-sm text-fuchsia-400">{c.party}</p>
                    {c.slogan && (
                      <p className="text-xs text-cyan-400 italic mt-1">"{c.slogan}"</p>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => handleVote(c.name)} 
                  className="px-6 py-2 rounded-md bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-300 border border-indigo-500 shadow-lg shadow-indigo-500/20 transition-all duration-300"
                >
                  Vote
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}