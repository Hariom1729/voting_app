// // import { appState } from '../state' // Make sure the path to your state file is correct

// // export default function LiveVoteTally() {
// //   const totalVotes = appState.candidates.reduce((sum, c) => sum + c.votes, 0)

// //   return (
// //     <div className="bg-black/30 backdrop-blur-sm border border-indigo-500/50 rounded-lg shadow-lg shadow-indigo-500/10 p-6">
// //       <h2 className="text-xl font-bold mb-4 text-indigo-400">Live Vote Tally</h2>
// //       <div className="space-y-4">
// //         {appState.candidates.map(c => {
// //           const pct = totalVotes > 0 ? Math.round((c.votes / totalVotes) * 100) : 0
// //           return (
// //             <div key={c.id} className="bg-gray-800/30 rounded-lg p-4">
// //               <div className="flex items-start space-x-4 mb-3">
// //                 {c.partyIcon && (
// //                   <img 
// //                     src={c.partyIcon} 
// //                     alt={`${c.party} icon`} 
// //                     className="w-16 h-16 object-cover rounded-full border-2 border-fuchsia-500/50 flex-shrink-0"
// //                   />
// //                 )}
// //                 <div className="flex-1 min-w-0">
// //                   <div className="text-center mb-2">
// //                     <h3 className="text-lg font-semibold text-gray-200 mb-1">{c.name}</h3>
// //                     <div className="text-sm text-fuchsia-400 font-medium mb-1">{c.party}</div>
// //                     {c.slogan && (
// //                       <p className="text-xs text-cyan-400 italic">"{c.slogan}"</p>
// //                     )}
// //                   </div>
// //                   <div className="flex justify-between text-sm text-gray-300">
// //                     <span>{c.votes} votes</span>
// //                     <span>{pct}%</span>
// //                   </div>
// //                 </div>
// //               </div>
// //               <div className="h-3 bg-gray-700 rounded-full">
// //                 <div className="h-3 bg-fuchsia-500 rounded-full" style={{ width: `${pct}%`, boxShadow: '0 0 6px rgba(217, 70, 239, 0.7)' }} />
// //               </div>
// //             </div>
// //           )
// //         })}
// //       </div>
// //     </div>
// //   )
// // }



// // import { appState } from '../state' 

// // export default function LiveVoteTally() {
// //   const totalVotes = appState.candidates.reduce((sum, c) => sum + c.votes, 0)

// //   return (
// //     <div className="bg-black/30 backdrop-blur-sm border border-indigo-500/50 rounded-lg shadow-lg shadow-indigo-500/10 p-6">
// //       <h2 className="text-xl font-bold mb-4 text-indigo-400">Live Vote Tally</h2>
// //       <div className="space-y-4">
// //         {appState.candidates.map(c => {
// //           const pct = totalVotes > 0 ? Math.round((c.votes / totalVotes) * 100) : 0
// //           return (
// //             <div key={c.id} className="bg-gray-800/30 rounded-lg p-4">
// //               {/* Main flex container for top row */}
// //               <div className="flex items-center space-x-4 mb-3">

// //                 {/* Left Side: Party Info */}
// //                 <div className="w-1/3 flex items-center space-x-3 flex-shrink-0"> {/* Adjusted width & added space-x */}
// //                   {c.partyIcon && (
// //                     <img
// //                       src={c.partyIcon}
// //                       alt={`${c.party} icon`}
// //                       className="w-16 h-16 object-cover rounded-full border-2 border-fuchsia-500/50 flex-shrink-0" // Increased size
// //                     />
// //                   )}
// //                   {/* Container for Name and Slogan */}
// //                   <div className="flex flex-col text-left"> {/* Aligned text left */}
// //                     <div className="text-sm text-fuchsia-400 font-medium mb-0.5">{c.party}</div>
// //                     {c.slogan && (
// //                       <p className="text-xs text-cyan-400 italic">"{c.slogan}"</p>
// //                     )}
// //                   </div>
// //                 </div>

// //                 {/* Middle: Candidate Name */}
// //                 <div className="flex-1 text-center min-w-0">
// //                   <h3 className="text-xl font-bold text-gray-100 truncate">{c.name}</h3>
// //                 </div>

// //                 {/* Right Side: Votes */}
// //                 <div className="w-1/6 text-center flex-shrink-0"> {/* Adjusted width */}
// //                   <span className="text-lg font-semibold text-gray-200 block">{c.votes}</span>
// //                   <span className="text-xs text-gray-400">votes</span>
// //                 </div>

// //               </div>

// //               {/* Progress Bar and Percentage */}
// //               <div className="flex items-center space-x-2">
// //                 <div className="flex-grow h-3 bg-gray-700 rounded-full">
// //                   <div
// //                     className="h-3 bg-fuchsia-500 rounded-full"
// //                     style={{ width: `${pct}%`, boxShadow: '0 0 6px rgba(217, 70, 239, 0.7)' }}
// //                   />
// //                 </div>
// //                 <span className="text-sm text-gray-300 w-8 text-right">{pct}%</span>
// //               </div>

// //             </div>
// //           )
// //         })}
// //       </div>
// //     </div>
// //   )
// // }


// import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { useEffect, useState } from 'react';
// import { appState, loadCandidates, preserveSampleCandidates } from '../state';

// // Define some colors for the pie chart segments
// const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F', '#FFBB28', '#FF8042'];

// // Custom label rendering for the pie chart (optional)
// const RADIAN = Math.PI / 180;
// const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
//   // Don't render label if percentage is 0 or too small to fit
//   if (percent === 0 || percent < 0.03) return null;
//   const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
//   const x = cx + radius * Math.cos(-midAngle * RADIAN);
//   const y = cy + radius * Math.sin(-midAngle * RADIAN);

//   return (
//     <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12} fontWeight="bold">
//       {`${(percent * 100).toFixed(0)}%`}
//     </text>
//   );
// };

// export default function LiveVoteTally() {
//   const [candidates, setCandidates] = useState([]);
//   const [refreshTrigger, setRefreshTrigger] = useState(0);

//   // Load candidates when component mounts
//   useEffect(() => {
//     const loadData = async () => {
//       preserveSampleCandidates(); // Preserve sample candidates first
//       await loadCandidates(); // Then load from backend
//       setCandidates([...appState.candidates]); // Update local state
//     };
//     loadData();
//   }, []);

//   // Force refresh every 3 seconds
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCandidates([...appState.candidates]);
//       setRefreshTrigger(prev => prev + 1);
//     }, 3000);

//     return () => clearInterval(interval);
//   }, []);

//   const totalVotes = candidates.reduce((sum, c) => sum + c.votes, 0);

//   // Prepare data for the pie chart
//   const pieChartData = candidates.map(c => ({
//     name: c.name, // Used for Legend and Tooltip
//     value: c.votes, // Used for calculating pie slice size
//     party: c.party, // Optional: Can be used in Tooltip or Legend if needed
//   }));

//   return (
//     // Main container using Flexbox, stacking vertically, limited height
//     <div className="flex flex-col gap-6 max-h-[90vh]">

//       {/* Top Section: Candidate List */}
//       <div className="bg-black/30 backdrop-blur-sm border border-indigo-500/50 rounded-lg shadow-lg shadow-indigo-500/10 p-6 overflow-hidden">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-bold text-indigo-400">Live Votes per Candidate</h2>
//           <button
//             onClick={() => {
//               preserveSampleCandidates();
//               loadCandidates();
//               setCandidates([...appState.candidates]);
//               setRefreshTrigger(prev => prev + 1);
//             }}
//             className="px-4 py-2 rounded-md bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-300 border border-indigo-500 shadow-lg shadow-indigo-500/20 transition-all duration-300 text-sm"
//           >
//             Refresh
//           </button>
//         </div>
//         <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-indigo-500/50 scrollbar-track-gray-800/30">
//           {/* Debug info */}
//           <div className="text-xs text-gray-500 mb-2">
//             Total: {candidates.length} | Valid: {candidates.filter(c => c && c.name).length} | Refresh: {refreshTrigger}
//             <br />
//             All: {candidates.map(c => c?.name || 'NO_NAME').join(', ')}
//           </div>
//           {candidates.filter(c => c && c.name).map((c, index) => {
//             const progressBarPct = totalVotes > 0 ? Math.round((c.votes / totalVotes) * 100) : 0;
//             console.log(`Rendering candidate ${index}:`, c.name, c.id); // Debug log
//             return (
//               <div key={c.id || `candidate-${index}`} className="bg-gray-800/30 rounded-lg p-4">
//                 {/* Top row layout */}
//                 <div className="flex items-center space-x-4 mb-3">
//                   {/* Party Info: width w-2/5 */}
//                   <div className="w-2/5 flex items-center space-x-3 flex-shrink-0">
//                     {c.partyIcon && (
//                       <img
//                         src={c.partyIcon}
//                         alt={`${c.party} icon`}
//                         className="w-16 h-16 object-cover rounded-full border-2 border-fuchsia-500/50 flex-shrink-0"
//                       />
//                     )}
//                     <div className="flex flex-col text-left min-w-0">
//                       <div className="text-sm text-fuchsia-400 font-medium mb-0.5">{c.party}</div>
//                       {c.slogan && (
//                         <p className="text-xs text-cyan-400 italic">"{c.slogan}"</p>
//                       )}
//                     </div>
//                   </div>
//                   {/* Candidate Name */}
//                   <div className="flex-1 text-center min-w-0 px-2">
//                     <h3 className="text-lg font-bold text-gray-100">{c.name}</h3>
//                   </div>
//                   {/* Votes: width w-1/5 */}
//                   <div className="w-1/5 text-center flex-shrink-0">
//                     <span className="text-lg font-semibold text-gray-200 block">{c.votes}</span>
//                     <span className="text-xs text-gray-400">votes</span>
//                   </div>
//                 </div>

//                 {/* Progress Bar */}
//                 <div className="flex items-center space-x-2">
//                   <div className="flex-grow h-3 bg-gray-700 rounded-full">
//                     <div
//                       className="h-3 bg-fuchsia-500 rounded-full"
//                       style={{ width: `${progressBarPct}%`, boxShadow: '0 0 6px rgba(217, 70, 239, 0.7)' }}
//                     />
//                   </div>
//                 </div>
//               </div>
//             )
//           })}
//             {/* Add a check for empty candidates */}
//             {candidates.length === 0 && (
//               <p className="text-gray-400 text-center py-4">No candidates available.</p>
//             )}
//         </div>
//       </div>

//       {/* Bottom Section: Pie Chart - Reduced height */}
//       <div className="bg-black/30 backdrop-blur-sm border border-indigo-500/50 rounded-lg shadow-lg shadow-indigo-500/10 p-6 flex-shrink-0">
//         <h2 className="text-xl font-bold mb-4 text-indigo-400">Vote Distribution</h2>
//         {/* Decreased height of the chart container */}
//         <div className="flex flex-col items-center justify-start h-[260px]"> {/* Decreased height */}
//           {totalVotes > 0 ? (
//             // Decreased ResponsiveContainer height
//             <ResponsiveContainer width="100%" height={240}> {/* Decreased height */}
//               {/* Reduced height/width passed to PieChart */}
//               <PieChart width={300} height={300}>
//                 <Pie
//                   data={pieChartData}
//                   cx="50%"
//                   cy="50%"
//                   labelLine={false}
//                   label={renderCustomizedLabel}
//                   outerRadius={85} // Reduced radius to fit smaller space
//                   fill="#8884d8"
//                   dataKey="value"
//                   nameKey="name"
//                 >
//                   {pieChartData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip
//                   contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', border: '1px solid rgba(129, 140, 248, 0.5)', borderRadius: '5px', boxShadow: '0 0 10px rgba(129, 140, 248, 0.3)' }}
//                   itemStyle={{ color: '#cbd5e1' }}
//                   formatter={(value, name) => [`${value} votes (${((value / totalVotes) * 100).toFixed(1)}%)`, name]}
//                  />
//                 <Legend
//                   layout="horizontal"
//                   align="center"
//                   verticalAlign="bottom"
//                   iconType="circle"
//                   // Adjusted wrapperStyle for less padding
//                   wrapperStyle={{ paddingTop: '5px' }}
//                 />
//               </PieChart>
//             </ResponsiveContainer>
//           ) : (
//             // Adjusted margin for better centering in shorter container
//             <p className="text-gray-400 mt-5 text-center">No votes cast yet.</p>
//           )}
//         </div>
//       </div>

//     </div> // End of main flex container
//   )
// }


import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';
import { appState, loadCandidates, preserveSampleCandidates } from '../state'; // Make sure this path is correct

// Define some colors for the pie chart segments
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F', '#FFBB28', '#FF8042'];

// Custom label rendering for the pie chart (optional)
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  // Don't render label if percentage is 0 or too small to fit
  if (percent === 0 || percent < 0.03) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12} fontWeight="bold">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function LiveVoteTally() {
  const [candidates, setCandidates] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // State for the button
  const [showPieChart, setShowPieChart] = useState(false); // Pie chart is hidden by default

  // Load candidates when component mounts
  useEffect(() => {
    const loadData = async () => {
      preserveSampleCandidates(); // Preserve sample candidates first
      await loadCandidates(); // Then load from backend
      setCandidates([...appState.candidates]); // Update local state
    };
    loadData();
  }, []);

  // Force refresh every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // Re-load from the global state
      loadCandidates().then(() => {
        setCandidates([...appState.candidates]);
        setRefreshTrigger(prev => prev + 1);
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const totalVotes = candidates.reduce((sum, c) => sum + c.votes, 0);

  // Prepare data for the pie chart
  const pieChartData = candidates.map(c => ({
    name: c.name, // Used for Legend and Tooltip
    value: c.votes, // Used for calculating pie slice size
    party: c.party, // Optional: Can be used in Tooltip or Legend if needed
  }));

  return (
    // ---
    // THIS IS THE FIX:
    // We make the *entire component* a single scrolling box.
    // ---
    <div className="flex flex-col gap-6 max-h-[90vh] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-indigo-500/50 scrollbar-track-gray-800/30">

      {/* Top Section: Candidate List */}
      <div className="bg-black/30 backdrop-blur-sm border border-indigo-500/50 rounded-lg shadow-lg shadow-indigo-500/10 p-6 overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-indigo-400">Live Votes per Candidate</h2>
          <button
            onClick={() => {
              preserveSampleCandidates();
              loadCandidates().then(() => { // Re-run loadCandidates on refresh
                setCandidates([...appState.candidates]);
                setRefreshTrigger(prev => prev + 1);
              });
            }}
            className="px-4 py-2 rounded-md bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-300 border border-indigo-500 shadow-lg shadow-indigo-500/20 transition-all duration-300 text-sm"
          >
            Refresh
          </button>
        </div>
        
        {/* This internal scrolling container is correct */}
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-indigo-500/50 scrollbar-track-gray-800/30">
          
          {/* Debug info */}
          <div className="text-xs text-gray-500 mb-2">
            Total: {candidates.length} | Valid: {candidates.filter(c => c && c.name).length} | Refresh: {refreshTrigger}
            <br />
            All: {candidates.map(c => c?.name || 'NO_NAME').join(', ')}
          </div>
          
          {candidates.filter(c => c && c.name).map((c, index) => {
            const progressBarPct = totalVotes > 0 ? Math.round((c.votes / totalVotes) * 100) : 0;
            console.log(`Rendering candidate ${index}:`, c.name, c.id); // Debug log
            return (
              <div key={c.id || `candidate-${index}`} className="bg-gray-800/30 rounded-lg p-4">
                {/* Top row layout */}
                <div className="flex items-center space-x-4 mb-3">
                  {/* Party Info: width w-2/5 */}
                  <div className="w-2/5 flex items-center space-x-3 flex-shrink-0">
                    {c.partyIcon && (
                      <img
                        src={c.partyIcon}
                        alt={`${c.party} icon`}
                        className="w-16 h-16 object-cover rounded-full border-2 border-fuchsia-500/50 flex-shrink-0"
                      />
                    )}
                    <div className="flex flex-col text-left min-w-0">
                      <div className="text-sm text-fuchsia-400 font-medium mb-0.5">{c.party}</div>
                      {c.slogan && (
                        <p className="text-xs text-cyan-400 italic">"{c.slogan}"</p>
                      )}
                    </div>
                  </div>
                  {/* Candidate Name */}
                  <div className="flex-1 text-center min-w-0 px-2">
                    <h3 className="text-lg font-bold text-gray-100">{c.name}</h3>
                  </div>
                  {/* Votes: width w-1/5 */}
                  <div className="w-1/5 text-center flex-shrink-0">
                    <span className="text-lg font-semibold text-gray-200 block">{c.votes}</span>
                    <span className="text-xs text-gray-400">votes</span>
                  </div>
                </div>

                {/* Progress Bar (with percentage) */}
                <div className="flex items-center space-x-2">
                  <div className="flex-grow h-3 bg-gray-700 rounded-full">
                    <div
                      className="h-3 bg-fuchsia-500 rounded-full"
                      style={{ width: `${progressBarPct}%`, boxShadow: '0 0 6px rgba(217, 70, 239, 0.7)' }}
                    />
                  </div>
                  <span className="text-sm text-gray-300 w-8 text-right">{progressBarPct}%</span>
                </div>
              </div>
            )
          })}
            {/* Add a check for empty candidates */}
            {candidates.length === 0 && (
              <p className="text-gray-400 text-center py-4">No candidates available.</p>
            )}
        </div>
      </div>
      
      {/* 1. This button toggles the pie chart */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowPieChart(prev => !prev)} // Toggles the state
          className="px-6 py-2 rounded-md bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 border border-cyan-500 shadow-lg shadow-cyan-500/20 transition-all duration-300"
        >
          {showPieChart ? 'Hide Vote Distribution' : 'Show Vote Distribution'}
        </button>
      </div>

      {/* 2. The Pie Chart now only renders IF "showPieChart" is true */}
      {showPieChart && (
        <div className="bg-black/30 backdrop-blur-sm border border-indigo-500/50 rounded-lg shadow-lg shadow-indigo-500/10 p-6 flex-shrink-0">
          <h2 className="text-xl font-bold mb-4 text-indigo-400">Vote Distribution</h2>
          <div className="flex flex-col items-center justify-start h-[260px]">
            {totalVotes > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart width={300} height={300}>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={85}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', border: '1px solid rgba(129, 140, 248, 0.5)', borderRadius: '5px', boxShadow: '0 0 10px rgba(129, 140, 248, 0.3)' }}
                    itemStyle={{ color: '#cbd5e1' }}
                    formatter={(value, name) => [`${value} votes (${((value / totalVotes) * 100).toFixed(1)}%)`, name]}
                  />
                  <Legend
                    layout="horizontal"
                    align="center"
                    verticalAlign="bottom"
                    iconType="circle"
                    wrapperStyle={{ paddingTop: '5px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-400 mt-5 text-center">No votes cast yet.</p>
            )}
          </div>
        </div>
      )}

    </div>
  )
}