import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { contractService } from '../services/contractService'
import { getWalletCacheInfo } from '../utils/walletCache'

export default function BlockchainVoting() {
  const [walletAddress, setWalletAddress] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [contractInitialized, setContractInitialized] = useState(false)
  const [electionState, setElectionState] = useState('')
  const [candidates, setCandidates] = useState([])
  const [isVoterRegistered, setIsVoterRegistered] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)
  const [isVoting, setIsVoting] = useState(false)
  const [status, setStatus] = useState('')

  useEffect(() => {
    const cacheInfo = getWalletCacheInfo()
    if (cacheInfo.hasCache && cacheInfo.address) {
      setWalletAddress(cacheInfo.address)
      setIsConnected(true)
      initializeContract(cacheInfo.address)
    } else {
      setStatus('Please connect your wallet to vote')
    }
  }, [])

  const initializeContract = async (address) => {
    if (!window.ethereum) {
      setStatus('MetaMask not detected')
      return
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      await contractService.initialize(provider, signer)
      setContractInitialized(true)
      await loadElectionData()
      const isRegistered = await contractService.isVoterRegisteredOnChain(address)
      const voted = await contractService.hasVoterVoted(address)
      setIsVoterRegistered(isRegistered)
      setHasVoted(voted)
      if (!isRegistered) {
        setStatus('You are not registered as a voter on the blockchain')
      } else if (voted) {
        setStatus('You have already voted')
      } else {
        setStatus('Ready to vote')
      }
    } catch (error) {
      console.error('Contract initialization error:', error)
      setStatus('Failed to connect to voting contract')
    }
  }

  const loadElectionData = async () => {
    try {
      const [state, candidatesCount] = await Promise.all([
        contractService.getElectionState(),
        contractService.getCandidatesCount()
      ])
      setElectionState(state)
      if (candidatesCount > 0) {
        const candidatesList = await contractService.getCandidates()
        setCandidates(candidatesList)
      }
    } catch (error) {
      console.error('Error loading election data:', error)
      setStatus('Failed to load election data')
    }
  }

  const handleVote = async (candidateId) => {
    if (!contractInitialized || !isVoterRegistered || hasVoted) {
      alert('You are not eligible to vote')
      return
    }
    setIsVoting(true)
    try {
      const txHash = await contractService.vote(candidateId)
      setHasVoted(true)
      setStatus(`Vote cast successfully! Transaction: ${txHash.slice(0, 10)}...`)
      await loadElectionData()
    } catch (error) {
      console.error('Voting error:', error)
      setStatus(`Voting failed: ${error.message}`)
    } finally {
      setIsVoting(false)
    }
  }

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('MetaMask not detected. Please install MetaMask.')
      return
    }
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      if (accounts.length > 0) {
        const address = accounts[0]
        setWalletAddress(address)
        setIsConnected(true)
        localStorage.setItem('voting_app_wallet_address', address)
        localStorage.setItem('voting_app_wallet_connected', 'true')
        await initializeContract(address)
      }
    } catch (error) {
      console.error('Wallet connection error:', error)
      setStatus('Failed to connect wallet')
    }
  }

  const containerBase = "min-h-screen relative overflow-hidden bg-gray-950 font-mono p-4 flex items-center justify-center";
  const cardBase = "relative z-10 w-full max-w-md bg-black/30 backdrop-blur-sm border border-cyan-500/50 rounded-lg shadow-lg shadow-cyan-500/10 p-8 text-center";

  if (!isConnected) {
    return (
      <div className={containerBase}>
        <div className="absolute inset-0 z-0 opacity-30" style={{ backgroundImage: 'linear-gradient(to right, #1a1a1a 1px, transparent 1px), linear-gradient(to bottom, #1a1a1a 1px, transparent 1px)', backgroundSize: '40px 40px', backgroundPosition: '-1px -1px', pointerEvents: 'none' }} />
        <div className={cardBase}>
          <h1 className="text-2xl font-bold text-cyan-400 mb-2" style={{ textShadow: '0 0 8px rgba(0, 255, 255, 0.7)' }}>
            Blockchain Voting
          </h1>
          <p className="text-gray-300 mb-6">
            Connect your wallet to cast your vote on the blockchain
          </p>
          <button
            onClick={connectWallet}
            className="w-full py-3 rounded-md font-medium text-lg bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 border border-cyan-500 shadow-lg shadow-cyan-500/20 transition-all duration-300"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-950 font-mono p-6">
      <div className="absolute inset-0 z-0 opacity-30" style={{ backgroundImage: 'linear-gradient(to right, #1a1a1a 1px, transparent 1px), linear-gradient(to bottom, #1a1a1a 1px, transparent 1px)', backgroundSize: '40px 40px', backgroundPosition: '-1px -1px', pointerEvents: 'none' }} />
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="bg-black/30 backdrop-blur-sm border border-fuchsia-500/50 rounded-lg shadow-lg shadow-fuchsia-500/10 p-6 mb-6">
          <h1 className="text-3xl font-bold mb-4 text-fuchsia-400" style={{ textShadow: '0 0 8px rgba(217, 70, 239, 0.7)' }}>
            Blockchain Voting
          </h1>
          
          <div className="mb-4 p-3 bg-blue-900/50 border border-blue-700 rounded-lg text-sm">
            <p className="text-blue-300">
              <strong>Wallet:</strong> {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </p>
            <p className="text-blue-300">
              <strong>Status:</strong> {status}
            </p>
            <p className="text-blue-300">
              <strong>Election State:</strong> {electionState}
            </p>
          </div>

          {!isVoterRegistered && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-300">
              <p>❌ You are not registered as a voter on the blockchain. Please register first.</p>
            </div>
          )}

          {isVoterRegistered && hasVoted && (
            <div className="mb-4 p-3 bg-green-900/50 border border-green-700 rounded-lg text-green-300">
              <p>✅ You have already cast your vote. Thank you for participating!</p>
            </div>
          )}
        </div>

        {candidates.length > 0 && (
          <div className="bg-black/30 backdrop-blur-sm border border-cyan-500/50 rounded-lg shadow-lg shadow-cyan-500/10 p-6">
            <h2 className="text-2xl font-bold mb-4 text-cyan-400" style={{ textShadow: '0 0 8px rgba(0, 255, 255, 0.7)' }}>
              Candidates
            </h2>
            <div className="space-y-4">
              {candidates.map((candidate) => (
                <div key={candidate.id} className="bg-gray-500/10 border border-gray-700 rounded-lg p-4 flex items-center justify-between hover:bg-gray-500/20 transition-colors">
                  <div>
                    <h3 className="text-lg font-medium text-gray-200">{candidate.name}</h3>
                    <p className="text-fuchsia-400">Votes: {candidate.voteCount.toString()}</p>
                  </div>
                  {isVoterRegistered && !hasVoted && electionState === 'Running' && (
                    <button
                      onClick={() => handleVote(candidate.id)}
                      disabled={isVoting}
                      className={`px-6 py-2 rounded-md font-medium transition-all duration-300 ${
                        isVoting
                          ? 'bg-gray-800/50 text-gray-500 border-gray-600 cursor-not-allowed shadow-none'
                          : 'bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 border border-emerald-500 shadow-lg shadow-emerald-500/20'
                      }`}
                    >
                      {isVoting ? 'Voting...' : 'Vote'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}