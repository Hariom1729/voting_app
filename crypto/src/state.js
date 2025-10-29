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
    { 
      id: 'cand1', 
      name: 'Rahul Gandhi', 
      party: 'Indian National Congress', 
      slogan: 'Judega Bharat, Jeetega India', 
      partyIcon: 'https://upload.wikimedia.org/wikipedia/commons/6/63/Indian_National_Congress_hand_logo.png',
      votes: 0 
    },
    { 
      id: 'cand2', 
      name: 'Akhilesh Yadav', 
      party: 'Samajwadi Party', 
      slogan: 'Judenge toh jeetenge', 
      partyIcon: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Samajwadi_Party.png', 
      votes: 0 
    },
    { 
      id: 'cand3', 
      name: 'Narendra Modi', 
      party: 'Bharatiya Janata Party', 
      slogan: 'Modi hai toh Mumkin hai ', 
      partyIcon: 'https://c8.alamy.com/comp/2TCXP21/lotus-flower-symbol-political-party-sign-bjp-banner-background-election-symbol-bhartiya-janata-party-2TCXP21.jpg', 
      votes: 0 
    },
    { 
      id: 'cand4', 
      name: 'Arvind Kejriwal', 
      party: 'Aam Aadmi Party' , 
      slogan: 'Jhaadu chalaao, beimaan bhagaao', 
      partyIcon: 'https://i.ndtvimg.com/i/2015-04/aap-logo-650_650x400_41428497829.jpg', 
      votes: 0 
    },
    { 
      id: 'cand5', 
      name: 'Siddaramaiah', 
      party: 'Indian National Congress', 
      slogan: 'udega Bharat, Jeetega India', 
      partyIcon: 'https://upload.wikimedia.org/wikipedia/commons/6/63/Indian_National_Congress_hand_logo.png', 
      votes: 0 
    },
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
  appState.candidates.push({ 
    id, 
    name: profile.name || `Candidate ${id}`, 
    party: profile.party || 'Independent', 
    slogan: profile.slogan || '',
    partyIcon: profile.partyIcon || '',
    votes: 0 
  })
}

export async function loadCandidates() {
  try {
    const { getCandidates } = await import('./lib/api.js')
    const candidates = await getCandidates()
    
    // Store existing sample candidates
    const existingCandidates = [...appState.candidates]
    
    // Add new candidates from backend, but don't replace existing ones
    candidates.forEach((c) => {
      const existingCandidate = existingCandidates.find(existing => 
        existing.name === c.name && existing.party === c.party
      )
      
      if (!existingCandidate) {
        // --- THIS BLOCK IS UPDATED ---
        
        // 1. Get the ID first so we can use it in the fallback name
        const id = c._id || `cand${Date.now()}`;
        
        // 2. Add new candidate from backend
        const newCandidate = {
          id: id,
          // 3. (THE FIX) Provide a fallback name if c.name is missing
          name: c.name || `Candidate ${id.substring(0, 8)}`,
          party: c.party || 'Independent',
          slogan: c.slogan || '',
          partyIcon: c.partyIcon || '',
          votes: c.votes || 0
        }
        existingCandidates.push(newCandidate)
      } else {
        // Update existing candidate with backend data (votes, etc.)
        existingCandidate.votes = c.votes || existingCandidate.votes
        if (c.slogan && !existingCandidate.slogan) {
          existingCandidate.slogan = c.slogan
        }
        if (c.partyIcon && !existingCandidate.partyIcon) {
          existingCandidate.partyIcon = c.partyIcon
        }
      }
    })
    
    appState.candidates = existingCandidates
  } catch (error) {
    console.error('Failed to load candidates:', error)
    // Keep existing candidates if API fails
  }
}

// Function to add sample votes for testing
export function addSampleVotes() {
  appState.candidates.forEach((candidate, index) => {
    // Add some realistic vote distribution
    const baseVotes = [45, 38, 52, 29, 41][index] || 0
    candidate.votes = baseVotes
  })
}

// Function to reset all votes
export function resetVotes() {
  appState.candidates.forEach(candidate => {
    candidate.votes = 0
  })
}

// Function to preserve sample candidates (prevent them from being overwritten)
export function preserveSampleCandidates() {
  const sampleCandidates = [
    { 
      id: 'cand1', 
      name: 'Dr. Sarah Johnson', 
      party: 'Progressive Alliance', 
      slogan: 'Building Tomorrow Together', 
      partyIcon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9IiM4ODg0ZDgiLz4KPHN2ZyB4PSIxNiIgeT0iMTYiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0id2hpdGUiPgo8cGF0aCBkPSJNMjQgMjRIMzJWMzJIMjRWMjRaIi8+CjxwYXRoIGQ9Ik0yOCAyOEgzMlYzMkgyOFYyOFoiLz4KPC9zdmc+Cjwvc3ZnPgo=', 
      votes: 0 
    },
    { 
      id: 'cand2', 
      name: 'Michael Chen', 
      party: 'Unity Party', 
      slogan: 'One Nation, One Future', 
      partyIcon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9IiM4MmNhOWQiLz4KPHN2ZyB4PSIxNiIgeT0iMTYiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0id2hpdGUiPgo8cGF0aCBkPSJNMjQgMjRIMzJWMzJIMjRWMjRaIi8+CjxwYXRoIGQ9Ik0yOCAyOEgzMlYzMkgyOFYyOFoiLz4KPC9zdmc+Cjwvc3ZnPgo=', 
      votes: 0 
    },
    { 
      id: 'cand3', 
      name: 'Elena Rodriguez', 
      party: 'Green Future', 
      slogan: 'Sustainable Progress for All', 
      partyIcon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9IiNmZmM2NTgiLz4KPHN2ZyB4PSIxNiIgeT0iMTYiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0id2hpdGUiPgo8cGF0aCBkPSJNMjQgMjRIMzJWMzJIMjRWMjRaIi8+CjxwYXRoIGQ9Ik0yOCAyOEgzMlYzMkgyOFYyOFoiLz4KPC9zdmc+Cjwvc3ZnPgo=', 
      votes: 0 
    },
    { 
      id: 'cand4', 
      name: 'James Wilson', 
      party: 'Conservative Coalition', 
      slogan: 'Traditional Values, Modern Solutions', 
      partyIcon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9IiNmZjg0NDIiLz4KPHN2ZyB4PSIxNiIgeT0iMTYiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0id2hpdGUiPgo8cGF0aCBkPSJNMjQgMjRIMzJWMzJIMjRWMjRaIi8+CjxwYXRoIGQ9Ik0yOCAyOEgzMlYzMkgyOFYyOFoiLz4KPC9zdmc+Cjwvc3ZnPgo=', 
      votes: 0 
    },
    { 
      id: 'cand5', 
      name: 'Aisha Patel', 
      party: 'Innovation Party', 
      slogan: 'Technology for Everyone', 
      partyIcon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9IiMwMGM0OWYiLz4KPHN2ZyB4PSIxNiIgeT0iMTYiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0id2hpdGUiPgo8cGF0aCBkPSJNMjQgMjRIMzJWMzJIMjRWMjRaIi8+CjxwYXRoIGQ9Ik0yOCAyOEgzMlYzMkgyOFYyOFoiLz4KPC9zdmc+Cjwvc3ZnPgo=', 
      votes: 0 
    },
  ]
  
  // Only add sample candidates if they don't exist
  sampleCandidates.forEach(sampleCandidate => {
    const exists = appState.candidates.find(c => c.id === sampleCandidate.id)
    if (!exists) {
      appState.candidates.push(sampleCandidate)
    }
  })
}

