// src/App.js
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import './App.css';

const contractABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "ChangeOwner",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [],
		"name": "Destroy",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [],
		"name": "Reset",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "voter",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "proposalName",
				"type": "string"
			}
		],
		"name": "VoteCast",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "proposalName",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "voteCount",
				"type": "uint256"
			}
		],
		"name": "WinnerDeclared",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Withdraw",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "changeOwner",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "declareWinner",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "destroy",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "initialOwner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "proposals",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "voteCount",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "reset",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "proposalIndex",
				"type": "uint256"
			}
		],
		"name": "vote",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "voteCost",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "votes",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "votingCompleted",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	}
];

const contractAddress = "0x3F20F35E85129362B532c00b1656B9557938b857";

function App() {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [votesLeft, setVotesLeft] = useState(5);
  const [owner, setOwner] = useState('');
  const [balance, setBalance] = useState('0');
  const [isOwner, setIsOwner] = useState(false);
  const [votingCompleted, setVotingCompleted] = useState(false);

  useEffect(() => {
    const loadWeb3 = async () => {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        const web3 = window.web3;
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);

        const proposalContract = new web3.eth.Contract(contractABI, contractAddress);
        setContract(proposalContract);

        const owner = await proposalContract.methods.owner().call();
        setOwner(owner);
        setIsOwner(accounts[0] === owner);

        const proposalList = await Promise.all([
          proposalContract.methods.proposals(0).call(),
          proposalContract.methods.proposals(1).call(),
          proposalContract.methods.proposals(2).call(),
        ]);
        setProposals(proposalList);

        const votesLeft = await proposalContract.methods.votes(accounts[0]).call();
        setVotesLeft(5 - parseInt(votesLeft));

        const balance = await web3.eth.getBalance(contractAddress);
        setBalance(web3.utils.fromWei(balance, 'ether'));

        const votingCompleted = await proposalContract.methods.votingCompleted().call();
        setVotingCompleted(votingCompleted);
      }
    };

    loadWeb3();
  }, []);

  const vote = async (proposalIndex) => {
    if (contract) {
      await contract.methods.vote(proposalIndex).send({ from: account, value: Web3.utils.toWei('0.01', 'ether') });
      const updatedVotes = await contract.methods.votes(account).call();
      setVotesLeft(5 - parseInt(updatedVotes));
      const proposalList = await Promise.all([
        contract.methods.proposals(0).call(),
        contract.methods.proposals(1).call(),
        contract.methods.proposals(2).call(),
      ]);
      setProposals(proposalList);
    }
  };

  const declareWinner = async () => {
    if (contract && isOwner) {
      await contract.methods.declareWinner().send({ from: account });
      setVotingCompleted(true);
    }
  };

  const withdraw = async () => {
    if (contract && isOwner) {
      await contract.methods.withdraw().send({ from: account });
    }
  };

  const reset = async () => {
    if (contract && isOwner) {
      await contract.methods.reset().send({ from: account });
      setVotingCompleted(false);
      const proposalList = await Promise.all([
        contract.methods.proposals(0).call(),
        contract.methods.proposals(1).call(),
        contract.methods.proposals(2).call(),
      ]);
      setProposals(proposalList);
      setVotesLeft(5);
    }
  };

  const changeOwner = async (newOwner) => {
    if (contract && isOwner) {
      await contract.methods.changeOwner(newOwner).send({ from: account });
      setOwner(newOwner);
      setIsOwner(account === newOwner);
    }
  };

  const destroy = async () => {
    if (contract && isOwner) {
      await contract.methods.destroy().send({ from: account });
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Proposal Voting DApp</h1>
        <p>Current Account: {account}</p>
        <p>Contract Owner: {owner}</p>
        <p>Contract Balance: {balance} ETH</p>
        <p>Votes Left: {votesLeft}</p>
        <div>
          {proposals.map((proposal, index) => (
            <div key={index}>
              <h3>{proposal.name}</h3>
              <p>Votes: {proposal.voteCount}</p>
              <button onClick={() => vote(index)} disabled={votingCompleted || account === owner ||  votesLeft === 0}>
                Vote
              </button>
            </div>
          ))}
        </div>
        {isOwner && (
          <div>
            <button onClick={declareWinner} disabled={votingCompleted}>Declare Winner</button>
            <button onClick={withdraw}>Withdraw</button>
            <button onClick={reset} disabled={!votingCompleted}>Reset</button>
            <button onClick={() => changeOwner(prompt('Enter new owner address:'))} disabled={!votingCompleted}>Change Owner</button>
            <button onClick={destroy}>Destroy</button>
          </div>
        )}
      </header>
    </div>
  );
}
//account === owner ||
export default App;