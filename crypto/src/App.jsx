import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Welcome from './components/Welcome.jsx'
import VoterRegister from './components/VoterRegister.jsx'
import VoterOTP from './components/VoterOTP.jsx'
import VoterFace from './components/VoterFace.jsx'
import VoterVote from './components/VoterVote.jsx'
import CandidateAadhaar from './components/CandidateAadhaar.jsx'
import CandidateOTP from './components/CandidateOTP.jsx'
import CandidateFace from './components/CandidateFace.jsx'
import CandidateSuccess from './components/CandidateSuccess.jsx'
import AdminLogin from './components/AdminLogin.jsx'
import AdminDashboard from './components/AdminDashboard.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      {/* Voter flow */}
      <Route path="/voter/register" element={<VoterRegister />} />
      <Route path="/voter/otp" element={<VoterOTP />} />
      <Route path="/voter/face" element={<VoterFace />} />
      <Route path="/voter/vote" element={<VoterVote />} />
      {/* Candidate flow */}
      <Route path="/candidate/aadhaar" element={<CandidateAadhaar />} />
      <Route path="/candidate/otp" element={<CandidateOTP />} />
      <Route path="/candidate/face" element={<CandidateFace />} />
      <Route path="/candidate/success" element={<CandidateSuccess />} />
      {/* Admin */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
