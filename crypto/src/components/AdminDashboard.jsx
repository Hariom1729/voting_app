// import { Navigate, useNavigate } from 'react-router-dom'
// import { useEffect } from 'react'
// import { appState, loadCandidates } from '../state'

// export default function AdminDashboard() {
//   const navigate = useNavigate()
  
//   // Load candidates when dashboard loads
//   useEffect(() => {
//     loadCandidates()
//   }, [])
  
//   if (!appState.admin.loggedIn) {
//     return <Navigate to="/admin/login" replace />
//   }

//   const totalVotes = appState.candidates.reduce((sum, c) => sum + c.votes, 0)

//   return (
//     <div className="min-h-screen relative overflow-hidden bg-gray-950 font-mono p-6">
//       <div className="absolute inset-0 z-0 opacity-30" style={{ backgroundImage: 'linear-gradient(to right, #1a1a1a 1px, transparent 1px), linear-gradient(to bottom, #1a1a1a 1px, transparent 1px)', backgroundSize: '40px 40px', backgroundPosition: '-1px -1px', pointerEvents: 'none' }} />
//       <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/30 to-black/60 z-0" />

//       <div className="max-w-7xl mx-auto space-y-6 relative z-10">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 
//               className="text-3xl font-bold text-indigo-400"
//               style={{ textShadow: '0 0 8px rgba(129, 140, 248, 0.7)' }}
//             >
//               Admin Dashboard
//             </h1>
//             <p className="text-sm text-gray-400 mt-1">Logged in as {appState.admin.email}</p>
//           </div>
          
//           <button 
//             onClick={() => navigate('/candidate/aadhaar')} 
//             className="px-8 py-3 rounded-md bg-fuchsia-500/20 hover:bg-fuchsia-500/40 text-fuchsia-300 border border-fuchsia-500 shadow-lg shadow-fuchsia-500/20 transition-all duration-300"
//           >
//             Add the Candidate
//           </button>
//         </div>

//         {/* Main content area changed to a grid layout */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

//           {/* Left Column: Data Cards */}
//           <div className="lg:col-span-2 space-y-6">
//             <div className="bg-black/30 backdrop-blur-sm border border-indigo-500/50 rounded-lg shadow-lg shadow-indigo-500/10 p-6">
//               <h2 className="text-xl font-bold mb-4 text-indigo-400">Votes by Candidate</h2>
//               <div className="space-y-4">
//                 {appState.candidates.map(c => {
//                   const pct = totalVotes > 0 ? Math.round((c.votes / totalVotes) * 100) : 0
//                   return (
//                     <div key={c.id} className="bg-gray-800/30 rounded-lg p-4">
//                       <div className="flex items-start space-x-4 mb-3">
//                         {c.partyIcon && (
//                           <img 
//                             src={c.partyIcon} 
//                             alt={`${c.party} icon`} 
//                             className="w-16 h-16 object-cover rounded-full border-2 border-fuchsia-500/50 flex-shrink-0"
//                           />
//                         )}
//                         <div className="flex-1 min-w-0">
//                           <div className="text-center mb-2">
//                             <h3 className="text-lg font-semibold text-gray-200 mb-1">{c.name}</h3>
//                             <div className="text-sm text-fuchsia-400 font-medium mb-1">{c.party}</div>
//                             {c.slogan && (
//                               <p className="text-xs text-cyan-400 italic">"{c.slogan}"</p>
//                             )}
//                           </div>
//                           <div className="flex justify-between text-sm text-gray-300">
//                             <span>{c.votes} votes</span>
//                             <span>{pct}%</span>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="h-3 bg-gray-700 rounded-full">
//                         <div className="h-3 bg-fuchsia-500 rounded-full" style={{ width: `${pct}%`, boxShadow: '0 0 6px rgba(217, 70, 239, 0.7)' }} />
//                       </div>
//                     </div>
//                   )
//                 })}
//               </div>
//             </div>

//             <div className="bg-black/30 backdrop-blur-sm border border-indigo-500/50 rounded-lg shadow-lg shadow-indigo-500/10 p-6">
//               <h2 className="text-xl font-bold mb-4 text-indigo-400">Voters</h2>
//               <div className="overflow-x-auto">
//                 <table className="w-full text-sm">
//                   <thead>
//                     <tr className="border-b border-gray-700 text-left">
//                       <th className="py-2 pr-4 font-medium text-gray-300">Name</th>
//                       <th className="py-2 pr-4 font-medium text-gray-300">Aadhaar</th>
//                       <th className="py-2 pr-4 font-medium text-gray-300">Status</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {appState.voters.map(v => (
//                       <tr key={v.aadhaar} className="border-b border-gray-800 last:border-0">
//                         <td className="py-3 pr-4 text-gray-400">{v.name}</td>
//                         <td className="py-3 pr-4 text-gray-400">{v.aadhaar}</td>
//                         <td className={`py-3 pr-4 font-medium ${v.hasVoted ? 'text-green-400' : 'text-red-400'}`}>
//                           {v.hasVoted ? 'Voted' : 'Not Voted'}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>

//           {/* New Right Column: Article/Description Section */}
//           <div className="lg:col-span-1">
//             <div className="bg-black/30 backdrop-blur-sm border border-indigo-500/50 rounded-lg shadow-lg shadow-indigo-500/10 p-6 text-gray-300 sticky top-6">
//               <h2 className="text-xl font-bold text-indigo-400 mb-4">
//                 Dashboard Overview
//               </h2>
//               <div className="space-y-4 text-sm">
//                 <div>
//                     <h3 className="font-semibold text-fuchsia-400">Votes by Candidate</h3>
//                     <p className="text-gray-400 leading-relaxed">This panel provides a real-time visualization of votes cast, showing both the raw vote count and the overall percentage for each candidate.</p>
//                 </div>
//                 <div>
//                     <h3 className="font-semibold text-fuchsia-400">Voter Roll</h3>
//                     <p className="text-gray-400 leading-relaxed">This table lists all citizens who have successfully registered to vote. Their status is updated in real-time to reflect whether they have cast their ballot, ensuring transparency and aiding in auditing.</p>
//                 </div>
//                 <div>
//                     <h3 className="font-semibold text-fuchsia-400">Administrator Actions</h3>
//                     <p className="text-gray-400 leading-relaxed">Use the buttons and controls on this dashboard to manage the election. The "Add the Candidate" button allows for the registration of new candidates onto the ballot.</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }


import { Navigate, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { appState, loadCandidates, addSampleVotes, resetVotes, preserveSampleCandidates } from '../state'

export default function AdminDashboard() {
  const navigate = useNavigate()

  // Load candidates when dashboard loads
  useEffect(() => {
    // Assuming loadCandidates fetches and updates appState
    loadCandidates()
  }, [])

  if (!appState.admin.loggedIn) {
    return <Navigate to="/admin/login" replace />
  }

  const totalVotes = appState.candidates.reduce((sum, c) => sum + c.votes, 0)

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-950 font-mono p-6">
      <div className="absolute inset-0 z-0 opacity-30" style={{ backgroundImage: 'linear-gradient(to right, #1a1a1a 1px, transparent 1px), linear-gradient(to bottom, #1a1a1a 1px, transparent 1px)', backgroundSize: '40px 40px', backgroundPosition: '-1px -1px', pointerEvents: 'none' }} />
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/30 to-black/60 z-0" />

      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1
              className="text-3xl font-bold text-indigo-400"
              style={{ textShadow: '0 0 8px rgba(129, 140, 248, 0.7)' }}
            >
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-400 mt-1">Logged in as {appState.admin.email}</p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => navigate('/candidate/aadhaar')}
              className="px-6 py-3 rounded-md bg-fuchsia-500/20 hover:bg-fuchsia-500/40 text-fuchsia-300 border border-fuchsia-500 shadow-lg shadow-fuchsia-500/20 transition-all duration-300"
            >
              Add Candidate
            </button>
            <button
              onClick={addSampleVotes}
              className="px-6 py-3 rounded-md bg-green-500/20 hover:bg-green-500/40 text-green-300 border border-green-500 shadow-lg shadow-green-500/20 transition-all duration-300"
            >
              Add Sample Votes
            </button>
            <button
              onClick={resetVotes}
              className="px-6 py-3 rounded-md bg-red-500/20 hover:bg-red-500/40 text-red-300 border border-red-500 shadow-lg shadow-red-500/20 transition-all duration-300"
            >
              Reset Votes
            </button>
            <button
              onClick={preserveSampleCandidates}
              className="px-6 py-3 rounded-md bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 border border-blue-500 shadow-lg shadow-blue-500/20 transition-all duration-300"
            >
              Restore Sample Data
            </button>
          </div>
        </div>

        {/* Main content area grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column: Data Cards */}
          <div className="lg:col-span-2 space-y-6">
            {/* ##### VOTES BY CANDIDATE SECTION - UPDATED LAYOUT ##### */}
            <div className="bg-black/30 backdrop-blur-sm border border-indigo-500/50 rounded-lg shadow-lg shadow-indigo-500/10 p-6">
              <h2 className="text-xl font-bold mb-4 text-indigo-400">Votes by Candidate</h2>
              <div className="space-y-4">
                {appState.candidates.map(c => {
                  const pct = totalVotes > 0 ? Math.round((c.votes / totalVotes) * 100) : 0
                  return (
                    <div key={c.id} className="bg-gray-800/30 rounded-lg p-4">
                      {/* Main flex container for top row */}
                      <div className="flex items-center space-x-4 mb-3">

                        {/* Left Side: Party Info */}
                        <div className="w-1/3 flex items-center space-x-3 flex-shrink-0">
                          {c.partyIcon && (
                            <img
                              src={c.partyIcon}
                              alt={`${c.party} icon`}
                              className="w-16 h-16 object-cover rounded-full border-2 border-fuchsia-500/50 flex-shrink-0"
                            />
                          )}
                          <div className="flex flex-col text-left">
                            <div className="text-sm text-fuchsia-400 font-medium mb-0.5">{c.party}</div>
                            {c.slogan && (
                              <p className="text-xs text-cyan-400 italic">"{c.slogan}"</p>
                            )}
                          </div>
                        </div>

                        {/* Middle: Candidate Name */}
                        <div className="flex-1 text-center min-w-0">
                          <h3 className="text-xl font-bold text-gray-100 truncate">{c.name}</h3>
                        </div>

                        {/* Right Side: Votes */}
                        <div className="w-1/6 text-center flex-shrink-0">
                          <span className="text-lg font-semibold text-gray-200 block">{c.votes}</span>
                          <span className="text-xs text-gray-400">votes</span>
                        </div>

                      </div>

                      {/* Progress Bar and Percentage */}
                      <div className="flex items-center space-x-2">
                        <div className="flex-grow h-3 bg-gray-700 rounded-full">
                          <div
                            className="h-3 bg-fuchsia-500 rounded-full"
                            style={{ width: `${pct}%`, boxShadow: '0 0 6px rgba(217, 70, 239, 0.7)' }}
                          />
                        </div>
                        <span className="text-sm text-gray-300 w-8 text-right">{pct}%</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            {/* ##### END OF VOTES BY CANDIDATE SECTION ##### */}

            <div className="bg-black/30 backdrop-blur-sm border border-indigo-500/50 rounded-lg shadow-lg shadow-indigo-500/10 p-6">
              <h2 className="text-xl font-bold mb-4 text-indigo-400">Voters</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700 text-left">
                      <th className="py-2 pr-4 font-medium text-gray-300">Name</th>
                      <th className="py-2 pr-4 font-medium text-gray-300">Aadhaar</th>
                      <th className="py-2 pr-4 font-medium text-gray-300">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appState.voters.map(v => (
                      <tr key={v.aadhaar} className="border-b border-gray-800 last:border-0">
                        <td className="py-3 pr-4 text-gray-400">{v.name}</td>
                        <td className="py-3 pr-4 text-gray-400">{v.aadhaar}</td>
                        <td className={`py-3 pr-4 font-medium ${v.hasVoted ? 'text-green-400' : 'text-red-400'}`}>
                          {v.hasVoted ? 'Voted' : 'Not Voted'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column: Article/Description Section */}
          <div className="lg:col-span-1">
            <div className="bg-black/30 backdrop-blur-sm border border-indigo-500/50 rounded-lg shadow-lg shadow-indigo-500/10 p-6 text-gray-300 sticky top-6">
              <h2 className="text-xl font-bold text-indigo-400 mb-4">
                Dashboard Overview
              </h2>
              <div className="space-y-4 text-sm">
                <div>
                    <h3 className="font-semibold text-fuchsia-400">Votes by Candidate</h3>
                    <p className="text-gray-400 leading-relaxed">This panel provides a real-time visualization of votes cast, showing both the raw vote count and the overall percentage for each candidate.</p>
                </div>
                <div>
                    <h3 className="font-semibold text-fuchsia-400">Voter Roll</h3>
                    <p className="text-gray-400 leading-relaxed">This table lists all citizens who have successfully registered to vote. Their status is updated in real-time to reflect whether they have cast their ballot, ensuring transparency and aiding in auditing.</p>
                </div>
                <div>
                    <h3 className="font-semibold text-fuchsia-400">Administrator Actions</h3>
                    <p className="text-gray-400 leading-relaxed">Use the buttons and controls on this dashboard to manage the election. The "Add the Candidate" button allows for the registration of new candidates onto the ballot.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}