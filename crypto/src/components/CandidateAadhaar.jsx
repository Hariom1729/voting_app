import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { appState } from '../state'
import { createCandidate } from '../lib/api'
import { useWallet } from '../hooks/useWallet'
import WalletConnect from './WalletConnect'
import AadhaarValidator from './AadhaarValidator'

export default function CandidateAadhaar() {
  const navigate = useNavigate()
  const { account, isConnected } = useWallet()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [aadhaarStatus, setAadhaarStatus] = useState(null)
  const [aadhaarValue, setAadhaarValue] = useState('')

  const handleWalletConnect = (walletAddress) => {
    console.log('Wallet connected:', walletAddress)
  }

  const handleAadhaarChange = (event) => {
    const value = event.target.value.replace(/\D/g, '') // Remove non-digits
    setAadhaarValue(value)
  }

  const handleAadhaarStatusChange = (status) => {
    setAadhaarStatus(status)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    
    if (!isConnected || !account) {
      alert('Please connect your MetaMask wallet first')
      return
    }

    const form = new FormData(e.currentTarget)
    const aadhaar = aadhaarValue
    const name = form.get('name')?.toString().trim() || ''
    const party = form.get('party')?.toString().trim() || ''
    
    if (aadhaarStatus && aadhaarStatus.isRegistered) {
      alert('This Aadhaar number is already registered. Please use a different Aadhaar number.')
      return
    }

    if (!aadhaar || aadhaar.length !== 12) {
      alert('Please enter a valid 12-digit Aadhaar number')
      return
    }

    setIsSubmitting(true)
    
    try {
      await createCandidate({ name, party, aadhaar, walletAddress: account })
      appState.candidate.profile = { aadhaar, name, party, walletAddress: account }
      appState.candidate.aadhaarEntered = true
      navigate('/candidate/otp')
    } catch (e) {
      alert(e.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputStyles = "w-full bg-gray-800/50 border border-gray-600 rounded px-3 py-2 text-gray-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 placeholder-gray-500";
  
  // State 1: Show wallet connection first - mandatory
  if (!isConnected || !account) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gray-950 font-mono p-4 flex items-center justify-center">
        {/* Background grid overlay */}
        <div className="absolute inset-0 z-0 opacity-30" style={{ backgroundImage: 'linear-gradient(to right, #1a1a1a 1px, transparent 1px), linear-gradient(to bottom, #1a1a1a 1px, transparent 1px)', backgroundSize: '40px 40px', backgroundPosition: '-1px -1px', pointerEvents: 'none' }} />
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/30 to-black/60 z-0" />
        
        <div className="relative z-10 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="bg-black/30 backdrop-blur-sm border border-emerald-500/50 rounded-lg shadow-lg shadow-emerald-500/10 p-8">
            <h2 className="text-2xl font-bold text-center text-cyan-400 mb-6" style={{ textShadow: '0 0 8px rgba(0, 255, 255, 0.7)' }}>
              Candidate Registration
            </h2>
            <div className="bg-emerald-900/50 border border-emerald-700 rounded-lg p-4 mb-6">
              <div className="flex items-center mb-3">
                <svg className="h-6 w-6 text-emerald-400 mr-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <h3 className="text-lg font-semibold text-emerald-300">Step 1: Connect Your Wallet</h3>
              </div>
              <p className="text-sm text-emerald-400">
                To register as a candidate, you must first connect your MetaMask wallet for secure and verifiable registration.
              </p>
            </div>
            <WalletConnect onConnect={handleWalletConnect} required={true} registrationType="candidate" />
          </div>

          <div className="text-gray-300">
            <h2 className="text-2xl font-bold text-emerald-400 mb-4" style={{ textShadow: '0 0 8px rgba(16, 185, 129, 0.7)' }}>
              Secure Your Candidacy
            </h2>
            <p className="mb-4 text-base leading-relaxed">
              Connecting your digital wallet is the foundational step to securing your place on the ballot. This links your identity to a unique, cryptographic address on the blockchain, ensuring that all subsequent actions are verifiably yours.
            </p>
            <p className="text-base leading-relaxed text-gray-400">
              This process guarantees transparency and builds public trust by creating an immutable record of your candidacy.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // State 2: Main form after wallet connection
  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-950 font-mono p-4 flex items-center justify-center">
        {/* Background grid overlay */}
        <div className="absolute inset-0 z-0 opacity-30" style={{ backgroundImage: 'linear-gradient(to right, #1a1a1a 1px, transparent 1px), linear-gradient(to bottom, #1a1a1a 1px, transparent 1px)', backgroundSize: '40px 40px', backgroundPosition: '-1px -1px', pointerEvents: 'none' }} />
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/30 to-black/60 z-0" />

        <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="bg-black/30 backdrop-blur-sm border border-emerald-500/50 rounded-lg shadow-lg shadow-emerald-500/10 p-8">
                <h2 className="text-2xl font-bold text-center text-cyan-400 mb-4" style={{ textShadow: '0 0 8px rgba(0, 255, 255, 0.7)' }}>
                Candidate Registration
                </h2>
                <div className="mb-4">
                <WalletConnect onConnect={handleWalletConnect} required={true} registrationType="candidate" />
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300" htmlFor="name">Full Name</label>
                    <input id="name" name="name" type="text" required className={inputStyles} />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300" htmlFor="party">Party</label>
                    <input id="party" name="party" type="text" placeholder="Independent if none" className={inputStyles} />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300" htmlFor="aadhar">Aadhaar Number</label>
                    <input id="aadhar" name="aadhar" value={aadhaarValue} onChange={handleAadhaarChange} inputMode="numeric" pattern="\d{12}" required maxLength={12} className={inputStyles}/>
                    <AadhaarValidator aadhaar={aadhaarValue} registrationType="candidate" onStatusChange={handleAadhaarStatusChange} className="mt-2"/>
                </div>
                <button type="submit" disabled={!isConnected || isSubmitting || (aadhaarStatus && aadhaarStatus.isRegistered)} className={`w-full py-3 rounded-md font-medium transition-all duration-300 ${ !isConnected || isSubmitting || (aadhaarStatus && aadhaarStatus.isRegistered) ? 'bg-gray-800/50 text-gray-500 border-gray-600 cursor-not-allowed shadow-none' : 'bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 border border-emerald-500 shadow-lg shadow-emerald-500/20' }`}>
                    {isSubmitting ? 'Submitting...' : 'Continue'}
                </button>
                </form>
            </div>

            <div className="text-gray-300 bg-black/30 backdrop-blur-sm border border-emerald-500/50 rounded-lg shadow-lg shadow-emerald-500/10 p-8">
                <h2 className="text-2xl font-bold text-emerald-400 mb-4" style={{ textShadow: '0 0 8px rgba(16, 185, 129, 0.7)' }}>
                    Enter the Political Arena
                </h2>
                <p className="mb-6 text-base leading-relaxed">
                    By completing this form, you are officially declaring your intention to stand for election. This information will be used to create your public profile on the ballot.
                </p>
                <div className="space-y-4 text-sm">
                    <div>
                        <h3 className="font-semibold text-cyan-400">Public Information</h3>
                        <p className="text-gray-400">Your full name and party affiliation will be visible to all voters. If you are not affiliated with a party, please enter "Independent".</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-cyan-400">Identity Verification</h3>
                        <p className="text-gray-400">Your Aadhaar number is used for a one-time verification to confirm your identity and eligibility to hold public office, and to prevent fraudulent nominations. It will not be displayed publicly.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}