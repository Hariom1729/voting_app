// Simple in-memory app state for demo purposes only
export const appState = {
  // voter flow
  voter: {
    registered: false,
    otpVerified: false,
    faceVerified: false,
    user: null,
  },
  // candidate flow
  candidate: {
    aadhaarEntered: false,
    otpVerified: false,
    faceVerified: false,
    profile: null,
  },
  // admin
  admin: {
    loggedIn: false,
    email: null,
  },
  // data
  candidates: [
    { id: 'cand1', name: 'Candidate A', party: 'Party Alpha', votes: 0 },
    { id: 'cand2', name: 'Candidate B', party: 'Party Beta', votes: 0 },
    { id: 'cand3', name: 'Candidate C', party: 'Party Gamma', votes: 0 },
  ],
  voters: [], // { name, aadhaar, hasVoted }
}

export function addVoter(voter) {
  const existing = appState.voters.find(v => v.aadhaar === voter.aadhaar)
  if (!existing) {
    appState.voters.push({ ...voter, hasVoted: false })
  }
}

export function recordVote(candidateName, voterAadhaar) {
  const cand = appState.candidates.find(c => c.name === candidateName)
  if (cand) cand.votes += 1
  const voter = appState.voters.find(v => v.aadhaar === voterAadhaar)
  if (voter) voter.hasVoted = true
}

export function addCandidate(profile) {
  const id = `cand${appState.candidates.length + 1}`
  appState.candidates.push({ id, name: profile.name || `Candidate ${id}` , party: profile.party || 'Independent', votes: 0 })
}

