import React, { useState, useEffect } from 'react'
import { checkWalletRegistration } from '../lib/api'

export default function WalletConnect({ onConnect, registrationType }) {
  const [account, setAccount] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [status, setStatus] = useState('')
  const [isRegistered, setIsRegistered] = useState(false)

  // ✅ Load wallet from cache (for info only — not auto-connecting)
  useEffect(() => {
    const cachedWallet = localStorage.getItem('voting_app_wallet_address')
    if (cachedWallet) {
      setAccount(cachedWallet)
      setStatus('Wallet cached, please reconnect to verify')
    }
  }, [])

  // ✅ Function to connect wallet via MetaMask (force popup)
  async function connectWallet() {
    if (!window.ethereum) {
      alert('MetaMask not detected. Please install it to continue.')
      return
    }

    try {
      // 🟢 Always request fresh permission (forces MetaMask popup)
      await window.ethereum.request({
        method: 'wallet_requestPermissions',
        params: [{ eth_accounts: {} }],
      })

      // 🟢 Now actually request accounts (popup guaranteed)
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })

      if (!accounts || accounts.length === 0) {
        setStatus('No account found in MetaMask')
        return
      }

      const selectedAccount = accounts[0]
      setAccount(selectedAccount)
      setIsConnected(true)
      setStatus('Wallet connected successfully')

      // ✅ Save wallet to cache memory
      localStorage.setItem('voting_app_wallet_address', selectedAccount)
      localStorage.setItem('voting_app_wallet_connected', 'true')

      // ✅ Check registration status
      checkWalletRegistration(selectedAccount, registrationType)
        .then((registered) => {
          setIsRegistered(registered)
          if (registered) {
            setStatus('Wallet already registered')
          } else {
            setStatus('Wallet is available for registration')
          }
        })
        .catch((err) => {
          console.error('Wallet registration check failed:', err)
          setStatus('Error checking registration status')
        })

      onConnect(selectedAccount)
    } catch (err) {
      console.error('MetaMask connection error:', err)
      if (err.code === 4001) {
        setStatus('Connection request rejected by user')
      } else {
        setStatus('Failed to connect wallet')
      }
    }
  }

  // ✅ Disconnect wallet
  function disconnectWallet() {
    setAccount(null)
    setIsConnected(false)
    setStatus('')
    setIsRegistered(false)
    localStorage.removeItem('voting_app_wallet_address')
    localStorage.removeItem('voting_app_wallet_connected')
    onConnect(null)
  }

  // ✅ Handle account change
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0])
          setIsConnected(true)
          localStorage.setItem('voting_app_wallet_address', accounts[0])
          localStorage.setItem('voting_app_wallet_connected', 'true')
          onConnect(accounts[0])
        } else {
          disconnectWallet()
        }
      })
    }
  }, [onConnect])

  return (
    <div className="mt-3 p-4 rounded-2xl backdrop-blur-lg bg-white/30 border border-white/40 shadow-md">
      <h3 className="text-lg font-semibold text-center text-gray-800 mb-3">
        Wallet Verification
      </h3>

      {!isConnected ? (
        <button
          onClick={connectWallet}
          className="w-full py-2 px-3 rounded-lg font-medium bg-blue-600 text-white 
                     hover:bg-blue-700 active:scale-[0.98] transition-all shadow-md"
        >
          🔗 Connect Wallet
        </button>
      ) : (
        <div className="p-3 bg-green-50 border border-green-300 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-green-700 font-medium flex items-center gap-2">
                ✅ Wallet Connected
              </p>
              <p className="text-sm text-gray-700 mt-1 truncate">
                {account?.slice(0, 6)}...{account?.slice(-4)}
              </p>
            </div>
            <button
              onClick={disconnectWallet}
              className="ml-2 text-xs text-red-600 hover:text-red-800 underline"
            >
              Disconnect
            </button>
          </div>
        </div>
      )}

      {status && (
        <div
          className={`mt-3 text-sm p-2 rounded-lg ${
            status.includes('already')
              ? 'bg-yellow-50 text-yellow-700 border border-yellow-300'
              : status.includes('available')
              ? 'bg-blue-50 text-blue-700 border border-blue-300'
              : status.includes('Failed')
              ? 'bg-red-50 text-red-700 border border-red-300'
              : 'bg-green-50 text-green-700 border border-green-300'
          }`}
        >
          ℹ️ {status}
        </div>
      )}
    </div>
  )
}
