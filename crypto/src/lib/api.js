const API_BASE = (typeof window !== 'undefined' && window?.location?.hostname === 'localhost')
  ? 'http://localhost:4000'
  : 'https://voting-app-uytn.onrender.com';

export async function createVoter(payload) {
  const res = await fetch(`${API_BASE}/api/voters`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = await safeJson(res)
    throw new Error(err?.error || `Failed to create voter (${res.status})`)
  }
  return await res.json()
}

export async function createCandidate(payload) {
  const res = await fetch(`${API_BASE}/api/candidates`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = await safeJson(res)
    throw new Error(err?.error || `Failed to create candidate (${res.status})`)
  }
  return await res.json()
}

export async function getVoters() {
  const res = await fetch(`${API_BASE}/api/voters`)
  if (!res.ok) {
    const err = await safeJson(res)
    throw new Error(err?.error || `Failed to get voters (${res.status})`)
  }
  return await res.json()
}

export async function getCandidates() {
  const res = await fetch(`${API_BASE}/api/candidates`)
  if (!res.ok) {
    const err = await safeJson(res)
    throw new Error(err?.error || `Failed to get candidates (${res.status})`)
  }
  return await res.json()
}

export async function checkWalletRegistration(walletAddress, type = 'voter') {
  const endpoint = type === 'voter' ? 'voters' : 'candidates'
  const res = await fetch(`${API_BASE}/api/${endpoint}/check-wallet/${walletAddress}`)
  if (!res.ok) {
    const err = await safeJson(res)
    throw new Error(err?.error || `Failed to check wallet registration (${res.status})`)
  }
  return await res.json()
}

export async function checkAadhaarRegistration(aadhaar, type = 'voter') {
  const endpoint = type === 'voter' ? 'voters' : 'candidates'
  const res = await fetch(`${API_BASE}/api/${endpoint}/check-aadhaar/${aadhaar}`)
  if (!res.ok) {
    const err = await safeJson(res)
    throw new Error(err?.error || `Failed to check Aadhaar registration (${res.status})`)
  }
  return await res.json()
}

async function safeJson(res) {
  try { return await res.json() } catch { return null }
}


