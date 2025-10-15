import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LiveVoteTally from '../components/LiveVoteTally';

export default function Welcome() {
  const navigate = useNavigate();
  const [showLiveVotes, setShowLiveVotes] = useState(false);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-950 font-mono flex items-center justify-center p-4">
      {/* CSS for animations */}
      <style>{`
        @keyframes pan-grid {
          0% { background-position: 0% 0%; }
          100% { background-position: 40px 40px; }
        }
        .animate-pan-grid { animation: pan-grid 20s linear infinite; }
        @keyframes scanline {
          0% { transform: translateY(0); }
          100% { transform: translateY(100%); }
        }
        .scanline-overlay::before {
          content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
          background: linear-gradient(to bottom, rgba(20,20,20,0) 50%, rgba(20,20,20,0.4) 51%);
          background-size: 100% 4px; animation: scanline 0.2s linear infinite; pointer-events: none; z-index: 2;
        }
        @keyframes glitch {
          2%,64%{ transform: translate(2px,0) skew(0deg); }
          4%,60%{ transform: translate(-2px,0) skew(0deg); }
          62%{ transform: translate(0,0) skew(5deg); }
        }
        .glitch-text::before, .glitch-text::after {
          content: attr(data-text); position: absolute; top: 0; left: 0; width: 100%; height: 100%;
        }
        .glitch-text::before {
          left: 2px; text-shadow: -2px 0 #ff00c1; clip: rect(44px, 450px, 56px, 0);
          animation: glitch 5s infinite linear alternate-reverse;
        }
        .glitch-text::after {
          left: -2px; text-shadow: -2px 0 #00fff9, 2px 2px #ff00c1; clip: rect(85px, 450px, 90px, 0);
          animation: glitch 3s infinite linear alternate-reverse;
        }
      `}</style>

      {/* Glassmorphism Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-cyan-500/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-cyan-400">Election Portal</span>
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={() => navigate('/about')} className="hidden md:block text-gray-300 hover:bg-gray-700/50 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">About</button>
              <button onClick={() => navigate('/contact')} className="hidden md:block text-gray-300 hover:bg-gray-700/50 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Contact Us</button>

              <button onClick={() => setShowLiveVotes(true)} className="flex items-center space-x-3 cursor-pointer">
                <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span></span>
                <span className="text-red-400 font-medium text-sm">LIVE</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Animated Backgrounds */}
      <div className="absolute inset-0 z-0 opacity-30 animate-pan-grid" style={{ backgroundImage: 'linear-gradient(to right, #1a1a1a 1px, transparent 1px), linear-gradient(to bottom, #1a1a1a 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/30 to-black/60 z-0 scanline-overlay" />

      {/* Main Content Area */}
      <div className="relative z-10 flex flex-col items-center justify-center text-white text-center space-y-6 max-w-4xl p-8 border border-cyan-500/20 bg-black/20 rounded-lg">
        <h1 className="text-5xl font-extrabold text-cyan-400 relative">
          <span className="glitch-text" data-text="Welcome to the Election Portal">
            Welcome to the Election Portal
          </span>
        </h1>
        <p className="text-xl font-medium text-fuchsia-400">one vote one india</p>
        
        <div className="max-w-2xl text-gray-300 text-base font-normal leading-relaxed pt-4">
          <p className="mb-4">In a democracy, every voice matters. Your vote is your power to shape the future of our nation. It's a fundamental right that ensures your say in who represents you.</p>
          <p>By participating in elections, you influence policies on education, healthcare, the economy, and the environment. Voting holds leaders accountable.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 pt-4">
          <button
            onClick={() => navigate('/voter/register')}
            className="px-8 py-3 rounded-md bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 border border-cyan-500 shadow-lg shadow-cyan-500/20 transition-all duration-300"
          >
            Sign in as Voter
          </button>
          {/* <button
            onClick={() => navigate('/candidate/aadhaar')}
            className="px-8 py-3 rounded-md bg-fuchsia-500/20 hover:bg-fuchsia-500/40 text-fuchsia-300 border border-fuchsia-500 shadow-lg shadow-fuchsia-500/20 transition-all duration-300"
          >
            Sign in as Candidate
          </button> */}
          <button
            onClick={() => navigate('/admin/login')}
            className="px-8 py-3 rounded-md bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-300 border border-indigo-500 shadow-lg shadow-indigo-500/20 transition-all duration-300"
          >
            Sign in as Admin
          </button>
        </div>
      </div>
      
      {/* Modal for Live Vote Tally */}
      {showLiveVotes && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl">
            <LiveVoteTally />
            <button
              onClick={() => setShowLiveVotes(false)}
              className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full h-8 w-8 flex items-center justify-center text-xl font-bold shadow-lg hover:bg-red-600 transition-colors"
              aria-label="Close"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}