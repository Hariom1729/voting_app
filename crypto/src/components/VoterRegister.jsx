import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ethers } from 'ethers'
import { appState, addVoter } from '../state'
import { createVoter } from '../lib/api'
import AadhaarValidator from './AadhaarValidator'
import WalletConnect from './WalletConnect'
import { checkVotingEligibility } from '../utils/validation'
import { contractService } from '../services/contractService'

export default function VoterRegister() {
  const navigate = useNavigate()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [ageValidation, setAgeValidation] = useState(null)
  const [aadhaarStatus, setAadhaarStatus] = useState(null)
  const [aadhaarValue, setAadhaarValue] = useState('')
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')
  const [blockchainStatus, setBlockchainStatus] = useState('')
  const [isBlockchainRegistering, setIsBlockchainRegistering] = useState(false)

  const handleDobChange = (event) => {
    const dob = event.target.value
    if (dob) {
      const validation = checkVotingEligibility(dob)
      setAgeValidation(validation)
    } else {
      setAgeValidation(null)
    }
  }

  const handleAadhaarChange = (event) => {
    const value = event.target.value.replace(/\D/g, '')
    setAadhaarValue(value)
  }

  const handleAadhaarStatusChange = (status) => {
    setAadhaarStatus(status)
  }

  const handleWalletConnect = async (account) => {
    setWalletConnected(true)
    setWalletAddress(account)
    
    if (account && window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        await contractService.initialize(provider, signer)
        
        const isRegistered = await contractService.isVoterRegisteredOnChain(account)
        if (isRegistered) {
          setBlockchainStatus('Already registered on blockchain')
        } else {
          setBlockchainStatus('Ready for blockchain registration')
        }
      } catch (error) {
        console.error('Contract initialization error:', error)
        setBlockchainStatus('Contract connection failed')
      }
    }
  }

  const handleBlockchainRegistration = async () => {
    if (!walletAddress) {
      alert('Please connect your wallet first')
      return
    }
    setIsBlockchainRegistering(true)
    try {
      const txHash = await contractService.selfRegisterVoter()
      setBlockchainStatus(`Registered on blockchain! TX: ${txHash.slice(0, 10)}...`)
    } catch (error) {
      setBlockchainStatus(`Blockchain registration failed: ${error.message}`)
    } finally {
      setIsBlockchainRegistering(false)
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!walletConnected || !walletAddress) {
      alert('Please connect your MetaMask wallet before registering.')
      return
    }

    const formData = new FormData(event.currentTarget)
    const dob = formData.get('dob')?.toString() || ''
    const aadhaar = aadhaarValue
    const validation = checkVotingEligibility(dob)

    if (!validation.isEligible) {
      alert(validation.message)
      return
    }
    if (aadhaarStatus && aadhaarStatus.isRegistered) {
      alert('This Aadhaar number is already registered. Please use a different Aadhaar number.')
      return
    }
    if (!aadhaar || aadhaar.length !== 12) {
      alert('Please enter a valid 12-digit Aadhaar number')
      return
    }

    setIsSubmitting(true)
    const user = {
      name: formData.get('name')?.toString().trim() || '',
      gender: formData.get('gender')?.toString() || '',
      dob,
      aadhaar,
      walletAddress,
    }

    try {
      await createVoter(user)
      appState.voter.user = { ...user }
      appState.voter.registered = true
      addVoter({ name: user.name, aadhaar: user.aadhaar })
      navigate('/voter/otp')
    } catch (e) {
      alert(e.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputStyles = "w-full bg-gray-800/50 border border-gray-600 rounded px-3 py-2 text-gray-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 placeholder-gray-500";

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-950 font-mono p-4 flex items-center justify-center">
      {/* Background grid overlay */}
      <div className="absolute inset-0 z-0 opacity-30" style={{ backgroundImage: 'linear-gradient(to right, #1a1a1a 1px, transparent 1px), linear-gradient(to bottom, #1a1a1a 1px, transparent 1px)', backgroundSize: '40px 40px', backgroundPosition: '-1px -1px', pointerEvents: 'none' }} />
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/30 to-black/60 z-0" />

      {/* Main container changed to a 2-column grid */}
      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* Left Column: Registration Form */}
        <div className="bg-black/30 backdrop-blur-sm border border-cyan-500/50 rounded-lg shadow-lg shadow-cyan-500/10 p-6">
          <h1 className="text-3xl font-bold text-center text-cyan-400 mb-6" style={{ textShadow: '0 0 8px rgba(0, 255, 255, 0.7)' }}>
            Voter Registration
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300" htmlFor="name">Full Name</label>
              <input id="name" name="name" type="text" required className={inputStyles} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300" htmlFor="gender">Gender</label>
              <select id="gender" name="gender" required className={inputStyles}>
                <option value="">Select...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300" htmlFor="dob">Date of Birth</label>
              <input id="dob" name="dob" type="date" required onChange={handleDobChange} className={inputStyles} />
              {ageValidation && (
                <div className={`mt-2 text-sm ${ageValidation.isEligible ? 'text-green-400' : 'text-red-400'}`}>
                  {ageValidation.message}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300" htmlFor="aadhar">Aadhaar Number</label>
              <input id="aadhar" name="aadhar" value={aadhaarValue} onChange={handleAadhaarChange} inputMode="numeric" pattern="\d{12}" placeholder="12-digit number" required maxLength={12} className={inputStyles}/>
              <p className="text-xs text-gray-400 mt-1">We will verify with an OTP linked to your Aadhaar.</p>
              <AadhaarValidator aadhaar={aadhaarValue} registrationType="voter" onStatusChange={handleAadhaarStatusChange} className="mt-2" />
            </div>
            <div className="pt-2">
              <WalletConnect onConnect={handleWalletConnect} registrationType="voter" />
            </div>
            {walletConnected && (
              <div className="pt-4 border-t border-gray-700">
                {/* Added Heading for clarity */}
                <h3 className="text-lg font-semibold text-fuchsia-400 mb-3">🔗 Blockchain Registration</h3>
                {blockchainStatus && (
                  <div className={`mb-3 p-3 rounded-lg text-sm border ${ blockchainStatus.includes('Ready') ? 'bg-blue-900/50 text-blue-300 border-blue-700' : blockchainStatus.includes('Already registered') ? 'bg-green-900/50 text-green-300 border-green-700' : blockchainStatus.includes('Registered on blockchain') ? 'bg-green-900/50 text-green-300 border-green-700' : 'bg-red-900/50 text-red-300 border-red-700' }`}>
                    {blockchainStatus}
                  </div>
                )}
                {blockchainStatus === 'Ready for blockchain registration' && (
                  <button type="button" onClick={handleBlockchainRegistration} disabled={isBlockchainRegistering} className={`w-full py-2 px-4 rounded-md font-medium transition-all duration-300 ${ isBlockchainRegistering ? 'bg-gray-800/50 text-gray-500 border-gray-600 cursor-not-allowed shadow-none' : 'bg-fuchsia-500/20 hover:bg-fuchsia-500/40 text-fuchsia-300 border border-fuchsia-500 shadow-lg shadow-fuchsia-500/20' }`}>
                    {isBlockchainRegistering ? 'Registering...' : 'Register on Blockchain'}
                  </button>
                )}
                <p className="text-xs text-gray-400 mt-2">Your wallet address will be permanently registered on the blockchain for secure voting.</p>
              </div>
            )}
            <div className="border-t border-gray-700 pt-4">
              <button type="submit" disabled={!walletConnected || isSubmitting || (aadhaarStatus && aadhaarStatus.isRegistered)} className={`w-full py-3 rounded-lg font-medium text-lg transition-all duration-300 ${ !walletConnected || isSubmitting || (aadhaarStatus && aadhaarStatus.isRegistered) ? 'bg-gray-800/50 text-gray-500 border-gray-600 cursor-not-allowed shadow-none' : 'bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 border border-cyan-500 shadow-lg shadow-cyan-500/20' }`}>
                {isSubmitting ? 'Registering...' : 'Complete Registration'}
              </button>
            </div>
          </form>
        </div>

        {/* New Right Column: Article/Description Section */}
        <div className="bg-black/30 backdrop-blur-sm border border-cyan-500/50 rounded-lg shadow-lg shadow-cyan-500/10 p-6 text-gray-300">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4" style={{ textShadow: '0 0 8px rgba(0, 255, 255, 0.7)' }}>
            Secure & Transparent Registration
          </h2>
          <p className="mb-6 text-base leading-relaxed">
            This portal uses a multi-layered approach to ensure every vote is secure, private, and correctly counted. By registering, you are creating a tamper-proof digital identity for this election.
          </p>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-fuchsia-400">1. Identity Verification</h3>
              <p className="text-sm text-gray-400">Your personal details and Aadhaar number are used to confirm your eligibility and prevent duplicate registrations, ensuring the principle of "one person, one vote."</p>
            </div>
            <div>
              <h3 className="font-semibold text-fuchsia-400">2. Wallet Connection</h3>
              <p className="text-sm text-gray-400">Connecting your digital wallet (like MetaMask) provides a secure, anonymous way to interact with the voting contract on the blockchain. Your wallet address is your key to voting.</p>
            </div>
            <div>
              <h3 className="font-semibold text-fuchsia-400">3. Blockchain Registration</h3>
              <p className="text-sm text-gray-400">The final step permanently records your anonymized voting eligibility on an immutable blockchain. This action is transparent and cannot be altered, guaranteeing your right to vote in this election.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}