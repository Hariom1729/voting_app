// Age validation utilities

/**
 * Calculate age from date of birth
 * @param {string} dob - Date of birth in YYYY-MM-DD format
 * @returns {number} Age in years
 */
export function calculateAge(dob) {
  if (!dob) return 0
  
  const today = new Date()
  const birthDate = new Date(dob)
  
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  
  return age
}

/**
 * Check if user is eligible to vote (18+ years)
 * @param {string} dob - Date of birth in YYYY-MM-DD format
 * @returns {object} { isEligible: boolean, age: number, message: string }
 */
export function checkVotingEligibility(dob) {
  const age = calculateAge(dob)
  
  if (age < 18) {
    return {
      isEligible: false,
      age,
      message: `You are ${age} years old. You must be at least 18 years old to register for voting.`
    }
  }
  
  return {
    isEligible: true,
    age,
    message: `You are ${age} years old and eligible to vote.`
  }
}

/**
 * Validate Aadhaar number format
 * @param {string} aadhaar - Aadhaar number
 * @returns {boolean} True if valid format
 */
export function validateAadhaar(aadhaar) {
  if (!aadhaar) return false
  // Aadhaar should be 12 digits
  return /^\d{12}$/.test(aadhaar.trim())
}

/**
 * Validate wallet address format
 * @param {string} address - Ethereum wallet address
 * @returns {boolean} True if valid format
 */
export function validateWalletAddress(address) {
  if (!address) return false
  // Ethereum address should be 42 characters starting with 0x
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}
