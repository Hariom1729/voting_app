import { useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'

export function useWallet() {
  const [account, setAccount] = useState(null)
  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState(null)

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return typeof window !== 'undefined' && window.ethereum
  }

  // Connect to MetaMask
  const connectWallet = useCallback(async () => {
    if (!isMetaMaskInstalled()) {
      setError('MetaMask is not installed. Please install MetaMask to continue.')
      return false
    }

    setIsConnecting(true)
    setError(null)

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })

      if (accounts.length === 0) {
        setError('No accounts found. Please connect your MetaMask wallet.')
        return false
      }

      const web3Provider = new ethers.BrowserProvider(window.ethereum)
      const web3Signer = await web3Provider.getSigner()
      const userAccount = await web3Signer.getAddress()

      setProvider(web3Provider)
      setSigner(web3Signer)
      setAccount(userAccount)
      setIsConnected(true)

      return true
    } catch (err) {
      console.error('Error connecting wallet:', err)
      if (err.code === 4001) {
        setError('User rejected the connection request.')
      } else {
        setError('Failed to connect wallet. Please try again.')
      }
      return false
    } finally {
      setIsConnecting(false)
    }
  }, [])

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    setAccount(null)
    setProvider(null)
    setSigner(null)
    setIsConnected(false)
    setError(null)
  }, [])

  // Listen for account changes
  useEffect(() => {
    if (!isMetaMaskInstalled()) return

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        disconnectWallet()
      } else if (accounts[0] !== account) {
        connectWallet()
      }
    }

    const handleChainChanged = () => {
      // Reload the page when chain changes
      window.location.reload()
    }

    window.ethereum.on('accountsChanged', handleAccountsChanged)
    window.ethereum.on('chainChanged', handleChainChanged)

    return () => {
      if (window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
        window.ethereum.removeListener('chainChanged', handleChainChanged)
      }
    }
  }, [account, connectWallet, disconnectWallet])

  // Auto-connect if previously connected
  useEffect(() => {
    const checkConnection = async () => {
      if (!isMetaMaskInstalled()) return

      try {
        const accounts = await window.ethereum.request({
          method: 'eth_accounts',
        })

        if (accounts.length > 0) {
          const web3Provider = new ethers.BrowserProvider(window.ethereum)
          const web3Signer = await web3Provider.getSigner()
          const userAccount = await web3Signer.getAddress()

          setProvider(web3Provider)
          setSigner(web3Signer)
          setAccount(userAccount)
          setIsConnected(true)
        }
      } catch (err) {
        console.error('Error checking wallet connection:', err)
      }
    }

    checkConnection()
  }, [])

  return {
    account,
    provider,
    signer,
    isConnected,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    isMetaMaskInstalled: isMetaMaskInstalled(),
  }
}
