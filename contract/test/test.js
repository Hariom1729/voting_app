const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Voting Contract", function () {
  // We define a fixture to reuse the same setup in every test.
  // This function deploys the contract and returns useful variables.
  async function deployVotingFixture() {
    // Get signers: owner (commissioner), verifier, and two voters
    const [owner, verifier, voter1, voter2] = await ethers.getSigners();

    // Deploy the Voting contract, passing the verifier's address to the constructor
    const Voting = await ethers.getContractFactory("Voting");
    const votingContract = await Voting.deploy(verifier.address);

    return { votingContract, owner, verifier, voter1, voter2 };
  }

  describe("Deployment", function () {
    it("Should set the right election commissioner", async function () {
      const { votingContract, owner } = await loadFixture(deployVotingFixture);
      expect(await votingContract.electionCommissioner()).to.equal(owner.address);
    });

    it("Should set the right verifier", async function () {
      const { votingContract, verifier } = await loadFixture(deployVotingFixture);
      expect(await votingContract.verifier()).to.equal(verifier.address);
    });
  });

  describe("Candidate Management", function () {
    it("Should allow the commissioner to add a candidate", async function () {
      const { votingContract } = await loadFixture(deployVotingFixture);
      await expect(votingContract.addCandidate("Candidate 1"))
        .to.emit(votingContract, "CandidateAdded")
        .withArgs(1, "Candidate 1");

      const candidate = await votingContract.candidates(1);
      expect(candidate.name).to.equal("Candidate 1");
      expect(candidate.voteCount).to.equal(0);
    });

    it("Should NOT allow non-commissioners to add candidates", async function () {
      const { votingContract, voter1 } = await loadFixture(deployVotingFixture);
      await expect(
        votingContract.connect(voter1).addCandidate("Fraudulent Candidate")
      ).to.be.revertedWith("Voting: Only the election commissioner can perform this action");
    });
  });

  describe("Voting Process", function () {
    // Helper function to get a valid signature from the verifier
    async function getValidSignature(voterAddress, verifierSigner) {
      const messageHash = await votingContract.getHash(voterAddress);
      const signature = await verifierSigner.signMessage(ethers.getBytes(messageHash));
      return signature;
    }

    let votingContract, verifier, voter1, voter2;

    // We load the fixture once before all tests in this block
    before(async function () {
      const fixture = await loadFixture(deployVotingFixture);
      votingContract = fixture.votingContract;
      verifier = fixture.verifier;
      voter1 = fixture.voter1;
      voter2 = fixture.voter2;

      // Add a candidate for the voting tests
      await votingContract.addCandidate("Candidate A");
    });

    it("Should allow a verified user to vote successfully", async function () {
      const signature = await getValidSignature(voter1.address, verifier);

      await expect(votingContract.connect(voter1).vote(1, signature))
        .to.emit(votingContract, "VotedSuccessfully")
        .withArgs(voter1.address, 1);

      const candidate = await votingContract.candidates(1);
      expect(candidate.voteCount).to.equal(1);
      expect(await votingContract.hasVoted(voter1.address)).to.be.true;
    });

    it("Should reject a vote with an invalid signature", async function () {
      const invalidSignature = "0x1234"; // Clearly invalid
      await expect(
        votingContract.connect(voter2).vote(1, invalidSignature)
      ).to.be.reverted; // Reverts due to invalid signature length
    });

    it("Should reject a vote if the signature is from a non-verifier account", async function () {
      // Signature signed by the voter themselves, not the verifier
      const signatureFromWrongSigner = await getValidSignature(voter2.address, voter2);

      await expect(
        votingContract.connect(voter2).vote(1, signatureFromWrongSigner)
      ).to.be.revertedWith("Voting: Invalid signature or not authorized to vote");
    });

    it("Should prevent a user from voting twice", async function () {
      // voter1 already voted in the first test of this block
      const signature = await getValidSignature(voter1.address, verifier);
      await expect(
        votingContract.connect(voter1).vote(1, signature)
      ).to.be.revertedWith("Voting: You have already cast your vote");
    });

    it("Should prevent one user from using another user's signature", async function () {
      // Verifier signs a message for voter1
      const signatureForVoter1 = await getValidSignature(voter1.address, verifier);

      // voter2 tries to use voter1's signature
      await expect(
        votingContract.connect(voter2).vote(1, signatureForVoter1)
      ).to.be.revertedWith("Voting: Invalid signature or not authorized to vote");
    });

    it("Should fail if voting for a non-existent candidate", async function () {
      const signature = await getValidSignature(voter2.address, verifier);
      await expect(
        votingContract.connect(voter2).vote(99, signature)
      ).to.be.revertedWith("Voting: Candidate does not exist");
    });
  });
});
