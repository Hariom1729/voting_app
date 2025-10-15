import { appState } from '../state' // Make sure the path to your state file is correct

export default function LiveVoteTally() {
  const totalVotes = appState.candidates.reduce((sum, c) => sum + c.votes, 0)

  return (
    <div className="bg-black/30 backdrop-blur-sm border border-indigo-500/50 rounded-lg shadow-lg shadow-indigo-500/10 p-6">
      <h2 className="text-xl font-bold mb-4 text-indigo-400">Live Vote Tally</h2>
      <div className="space-y-4">
        {appState.candidates.map(c => {
          const pct = totalVotes > 0 ? Math.round((c.votes / totalVotes) * 100) : 0
          return (
            <div key={c.id}>
              <div className="flex justify-between text-sm mb-1 text-gray-300">
                <span className="font-medium">{c.name} <span className="text-gray-500">({c.party})</span></span>
                <span>{c.votes} votes · {pct}%</span>
              </div>
              <div className="h-3 bg-gray-700 rounded-full">
                <div className="h-3 bg-fuchsia-500 rounded-full" style={{ width: `${pct}%`, boxShadow: '0 0 6px rgba(217, 70, 239, 0.7)' }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}