import { useState, useEffect } from 'react'
import { checkAadhaarRegistration } from '../lib/api'
import { validateAadhaar } from '../utils/validation'

export default function AadhaarValidator({ 
  aadhaar, 
  registrationType = 'voter', 
  onStatusChange,
  className = '' 
}) {
  const [aadhaarStatus, setAadhaarStatus] = useState(null)
  const [isChecking, setIsChecking] = useState(false)

  useEffect(() => {
    if (aadhaar && validateAadhaar(aadhaar)) {
      checkAadhaarStatus()
    } else {
      setAadhaarStatus(null)
      if (onStatusChange) onStatusChange(null)
    }
  }, [aadhaar, registrationType])

  const checkAadhaarStatus = async () => {
    if (!aadhaar || !validateAadhaar(aadhaar)) return
    
    setIsChecking(true)
    try {
      const status = await checkAadhaarRegistration(aadhaar, registrationType)
      setAadhaarStatus(status)
      if (onStatusChange) onStatusChange(status)
    } catch (err) {
      console.error('Error checking Aadhaar status:', err)
      const errorStatus = { isRegistered: false, message: 'Unable to verify Aadhaar status' }
      setAadhaarStatus(errorStatus)
      if (onStatusChange) onStatusChange(errorStatus)
    } finally {
      setIsChecking(false)
    }
  }

  if (!aadhaar) {
    return null
  }

  if (!validateAadhaar(aadhaar)) {
    return (
      <div className={`bg-yellow-50 border border-yellow-200 rounded-lg p-3 ${className}`}>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-2">
            <p className="text-xs text-yellow-700">Please enter a valid 12-digit Aadhaar number</p>
          </div>
        </div>
      </div>
    )
  }

  if (isChecking) {
    return (
      <div className={`bg-blue-50 border border-blue-200 rounded-lg p-3 ${className}`}>
        <div className="flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-xs text-blue-700">Checking Aadhaar registration status...</span>
        </div>
      </div>
    )
  }

  if (aadhaarStatus && aadhaarStatus.isRegistered) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-3 ${className}`}>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-4 w-4 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-2 flex-1">
            <p className="text-xs text-red-700 font-medium">
              Aadhaar Already Registered
            </p>
            <p className="text-xs text-red-600">
              {aadhaarStatus.message}
            </p>
            {aadhaarStatus.data && (
              <div className="mt-1 text-xs text-red-600">
                <p><strong>Name:</strong> {aadhaarStatus.data.name}</p>
                {aadhaarStatus.data.party && <p><strong>Party:</strong> {aadhaarStatus.data.party}</p>}
                <p><strong>Wallet:</strong> {aadhaarStatus.data.walletAddress?.slice(0, 6)}...{aadhaarStatus.data.walletAddress?.slice(-4)}</p>
                <p><strong>Registered:</strong> {new Date(aadhaarStatus.data.createdAt).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (aadhaarStatus && !aadhaarStatus.isRegistered) {
    return (
      <div className={`bg-green-50 border border-green-200 rounded-lg p-3 ${className}`}>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-4 w-4 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-2">
            <p className="text-xs text-green-700">
              Aadhaar number is available for registration
            </p>
          </div>
        </div>
      </div>
    )
  }

  return null
}
