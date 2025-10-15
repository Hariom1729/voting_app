import { ethers } from 'ethers'

// Contract ABI - This should match your deployed contract
const VOTING_CONTRACT_ABI = [
  "function owner() public view returns (address)",
  "function candidatesCount() public view returns (uint256)",
  "function electionState() public view returns (uint8)",
  "function candidates(uint256) public view returns (uint256 id, string memory name, uint256 voteCount)",
  "function voters(address) public view returns (bool isRegistered, bool hasVoted)",
  "function addCandidate(string memory _name) public",
  "function startElection() public",
  "function endElection() public",
  "function registerVoter(address _voterAddress) public",
  "function vote(uint256 _candidateId) public",
  "function registerVoterBySelf() public", // Self-registration function
  "function isVoterRegistered(address _voter) public view returns (bool)",
  "event ElectionStatusChanged(uint8 newState)",
  "event CandidateAdded(uint256 indexed id, string name)",
  "event Voted(address indexed voter, uint256 indexed candidateId)",
  "event VoterRegistered(address indexed voter)"
]

// Contract address - Update this with your deployed contract address
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000'

class ContractService {
  constructor() {
    this.contract = null
    this.provider = null
    this.signer = null
  }

  // Initialize contract with provider and signer
  async initialize(provider, signer) {
    try {
      this.provider = provider
      this.signer = signer
      this.contract = new ethers.Contract(CONTRACT_ADDRESS, VOTING_CONTRACT_ABI, signer)
      return true
    } catch (error) {
      console.error('Failed to initialize contract:', error)
      throw new Error('Failed to initialize contract connection')
    }
  }

  // Get contract owner
  async getOwner() {
    if (!this.contract) throw new Error('Contract not initialized')
    try {
      return await this.contract.owner()
    } catch (error) {
      console.error('Error getting owner:', error)
      throw new Error('Failed to get contract owner')
    }
  }

  // Get election state (0: NotStarted, 1: Running, 2: Ended)
  async getElectionState() {
    if (!this.contract) throw new Error('Contract not initialized')
    try {
      const state = await this.contract.electionState()
      return {
        0: 'NotStarted',
        1: 'Running', 
        2: 'Ended'
      }[state] || 'Unknown'
    } catch (error) {
      console.error('Error getting election state:', error)
      throw new Error('Failed to get election state')
    }
  }

  // Get candidates count
  async getCandidatesCount() {
    if (!this.contract) throw new Error('Contract not initialized')
    try {
      return await this.contract.candidatesCount()
    } catch (error) {
      console.error('Error getting candidates count:', error)
      throw new Error('Failed to get candidates count')
    }
  }

  // Get all candidates
  async getCandidates() {
    if (!this.contract) throw new Error('Contract not initialized')
    try {
      const count = await this.getCandidatesCount()
      const candidates = []
      
      for (let i = 1; i <= count; i++) {
        const candidate = await this.contract.candidates(i)
        candidates.push({
          id: candidate.id.toString(),
          name: candidate.name,
          voteCount: candidate.voteCount.toString()
        })
      }
      
      return candidates
    } catch (error) {
      console.error('Error getting candidates:', error)
      throw new Error('Failed to get candidates')
    }
  }

  // Check if voter is registered
  async isVoterRegistered(voterAddress) {
    if (!this.contract) throw new Error('Contract not initialized')
    try {
      const voter = await this.contract.voters(voterAddress)
      return voter.isRegistered
    } catch (error) {
      console.error('Error checking voter registration:', error)
      throw new Error('Failed to check voter registration')
    }
  }

  // Check if voter has voted
  async hasVoterVoted(voterAddress) {
    if (!this.contract) throw new Error('Contract not initialized')
    try {
      const voter = await this.contract.voters(voterAddress)
      return voter.hasVoted
    } catch (error) {
      console.error('Error checking if voter has voted:', error)
      throw new Error('Failed to check if voter has voted')
    }
  }

  // Register voter (only owner can call this)
  async registerVoter(voterAddress) {
    if (!this.contract) throw new Error('Contract not initialized')
    try {
      const tx = await this.contract.registerVoter(voterAddress)
      await tx.wait()
      return tx.hash
    } catch (error) {
      console.error('Error registering voter:', error)
      if (error.message.includes('Only the owner')) {
        throw new Error('Only the contract owner can register voters')
      }
      throw new Error('Failed to register voter')
    }
  }

  // Self-register as voter (anyone can call this)
  async selfRegisterVoter() {
    if (!this.contract) throw new Error('Contract not initialized')
    try {
      const tx = await this.contract.registerVoterBySelf()
      await tx.wait()
      return tx.hash
    } catch (error) {
      console.error('Error self-registering voter:', error)
      if (error.message.includes('already registered')) {
        throw new Error('You are already registered as a voter')
      }
      throw new Error('Failed to self-register as voter')
    }
  }

  // Check if voter is registered on blockchain
  async isVoterRegisteredOnChain(voterAddress) {
    if (!this.contract) throw new Error('Contract not initialized')
    try {
      return await this.contract.isVoterRegistered(voterAddress)
    } catch (error) {
      console.error('Error checking voter registration:', error)
      throw new Error('Failed to check voter registration')
    }
  }

  // Add candidate (only owner can call this)
  async addCandidate(name) {
    if (!this.contract) throw new Error('Contract not initialized')
    try {
      const tx = await this.contract.addCandidate(name)
      await tx.wait()
      return tx.hash
    } catch (error) {
      console.error('Error adding candidate:', error)
      if (error.message.includes('Only the owner')) {
        throw new Error('Only the contract owner can add candidates')
      }
      throw new Error('Failed to add candidate')
    }
  }

  // Vote for a candidate
  async vote(candidateId) {
    if (!this.contract) throw new Error('Contract not initialized')
    try {
      const tx = await this.contract.vote(candidateId)
      await tx.wait()
      return tx.hash
    } catch (error) {
      console.error('Error voting:', error)
      if (error.message.includes('not registered')) {
        throw new Error('You are not registered to vote')
      }
      if (error.message.includes('already cast')) {
        throw new Error('You have already voted')
      }
      if (error.message.includes('Invalid candidate')) {
        throw new Error('Invalid candidate ID')
      }
      if (error.message.includes('not in the required state')) {
        throw new Error('Election is not currently running')
      }
      throw new Error('Failed to cast vote')
    }
  }

  // Start election (only owner)
  async startElection() {
    if (!this.contract) throw new Error('Contract not initialized')
    try {
      const tx = await this.contract.startElection()
      await tx.wait()
      return tx.hash
    } catch (error) {
      console.error('Error starting election:', error)
      throw new Error('Failed to start election')
    }
  }

  // End election (only owner)
  async endElection() {
    if (!this.contract) throw new Error('Contract not initialized')
    try {
      const tx = await this.contract.endElection()
      await tx.wait()
      return tx.hash
    } catch (error) {
      console.error('Error ending election:', error)
      throw new Error('Failed to end election')
    }
  }
}

// Export singleton instance
export const contractService = new ContractService()
