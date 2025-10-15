// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title Voting
 * @dev A smart contract for a simple voting system.
 * The owner (admin) controls the election.
 * Voters are registered by the owner after off-chain verification.
 */
contract Voting {
    address public owner;

    // Data Structures
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    struct Voter {
        bool isRegistered;
        bool hasVoted;
    }

    // State Variables
    mapping(uint => Candidate) public candidates;
    mapping(address => Voter) public voters;
    uint public candidatesCount;
    enum ElectionState {
        NotStarted,
        Running,
        Ended
    }
    ElectionState public electionState;

    // Events
    event ElectionStatusChanged(ElectionState newState);
    event CandidateAdded(uint indexed id, string name);
    event Voted(address indexed voter, uint indexed candidateId);
    event VoterRegistered(address indexed voter);

    // Modifiers
    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Error: Only the owner can call this function."
        );
        _;
    }

    modifier atState(ElectionState _state) {
        require(
            electionState == _state,
            "Error: Election is not in the required state."
        );
        _;
    }

    constructor() {
        owner = msg.sender;
        electionState = ElectionState.NotStarted;
    }

    /**
     * @dev Add a new candidate to the election.
     * Can only be done by the owner before the election starts.
     */
    function addCandidate(
        string memory _name
    ) public onlyOwner atState(ElectionState.NotStarted) {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
        emit CandidateAdded(candidatesCount, _name);
    }

    /**
     * @dev Starts the election.
     */
    function startElection()
        public
        onlyOwner
        atState(ElectionState.NotStarted)
    {
        electionState = ElectionState.Running;
        emit ElectionStatusChanged(ElectionState.Running);
    }

    /**
     * @dev Ends the election.
     */
    function endElection() public onlyOwner atState(ElectionState.Running) {
        electionState = ElectionState.Ended;
        emit ElectionStatusChanged(ElectionState.Ended);
    }

    /**
     * @dev Register a voter's address.
     * This is done by the admin after verifying their identity off-chain.
     */
    function registerVoter(address _voterAddress) public onlyOwner {
        require(
            !voters[_voterAddress].isRegistered,
            "Error: Voter is already registered."
        );
        voters[_voterAddress].isRegistered = true;
        emit VoterRegistered(_voterAddress);
    }

    /**
     * @dev Self-register as a voter.
     * This allows users to register themselves after off-chain verification.
     */
    function registerVoterBySelf() public {
        require(
            !voters[msg.sender].isRegistered,
            "Error: You are already registered as a voter."
        );
        voters[msg.sender].isRegistered = true;
        emit VoterRegistered(msg.sender);
    }

    /**
     * @dev Check if a voter is registered.
     */
    function isVoterRegistered(address _voter) public view returns (bool) {
        return voters[_voter].isRegistered;
    }

    /**
     * @dev Allows a registered voter to cast their vote.
     */
    function vote(uint _candidateId) public atState(ElectionState.Running) {
        require(
            voters[msg.sender].isRegistered,
            "Error: You are not registered to vote."
        );
        require(
            !voters[msg.sender].hasVoted,
            "Error: You have already cast your vote."
        );
        require(
            _candidateId > 0 && _candidateId <= candidatesCount,
            "Error: Invalid candidate ID."
        );

        voters[msg.sender].hasVoted = true;
        candidates[_candidateId].voteCount++;

        emit Voted(msg.sender, _candidateId);
    }
}
