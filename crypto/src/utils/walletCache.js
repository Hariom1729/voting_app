// Wallet Cache Utility Functions

const WALLET_CACHE_KEY = 'voting_app_wallet_address'
const CONNECTION_CACHE_KEY = 'voting_app_wallet_connected'

/**
 * Get cached wallet address from localStorage
 * @returns {string|null} Cached wallet address or null if not found
 */
export function getCachedWalletAddress() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(WALLET_CACHE_KEY)
}

/**
 * Get cached connection status from localStorage
 * @returns {boolean} True if wallet was previously connected
 */
export function getCachedConnectionStatus() {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(CONNECTION_CACHE_KEY) === 'true'
}

/**
 * Save wallet address to cache
 * @param {string} walletAddress - The wallet address to cache
 */
export function saveWalletToCache(walletAddress) {
  if (typeof window === 'undefined') return
  localStorage.setItem(WALLET_CACHE_KEY, walletAddress)
  localStorage.setItem(CONNECTION_CACHE_KEY, 'true')
}

/**
 * Clear wallet cache
 */
export function clearWalletCache() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(WALLET_CACHE_KEY)
  localStorage.removeItem(CONNECTION_CACHE_KEY)
}

/**
 * Get complete wallet cache information
 * @returns {object} Wallet cache data
 */
export function getWalletCacheInfo() {
  return {
    address: getCachedWalletAddress(),
    isConnected: getCachedConnectionStatus(),
    hasCache: !!getCachedWalletAddress()
  }
}

/**
 * Check if wallet is cached and connected
 * @returns {boolean} True if wallet is cached and connected
 */
export function isWalletCached() {
  return getCachedWalletAddress() !== null && getCachedConnectionStatus()
}
