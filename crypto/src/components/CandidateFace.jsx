import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import { appState, addCandidate, loadCandidates } from '../state';
import referenceImagePath from './compare.jpg'; // Your reference image

export default function CandidateFace() {
  const navigate = useNavigate();
  const location = useLocation();
  const webcamRef = useRef(null);

  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState('');
  const [referenceDescriptor, setReferenceDescriptor] = useState();

  // Load models and prepare the reference face descriptor
  useEffect(() => {
    const setupFaceAPI = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri('https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model'),
          faceapi.nets.faceLandmark68Net.loadFromUri('https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model'),
          faceapi.nets.faceRecognitionNet.loadFromUri('https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model'),
        ]);

        const referenceImage = await faceapi.fetchImage(referenceImagePath);
        const referenceDetection = await faceapi
          .detectSingleFace(referenceImage, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptor();
        
        if (referenceDetection) {
          setReferenceDescriptor(referenceDetection.descriptor);
        } else {
          setError("Could not find a face in the reference image (compare.jpg).");
        }
      } catch (err) {
        setError("Error initializing AI. Please refresh the page.");
        console.error("Initialization Error:", err);
      }
      setInitializing(false);
    };
    setupFaceAPI();
  }, []);

  // Capture image and compare faces
  const handleCapture = useCallback(async () => {
    setError('');
    if (initializing || !webcamRef.current || !referenceDescriptor) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      setError('Could not capture an image.');
      return;
    }

    const imageEl = await faceapi.fetchImage(imageSrc);
    const detection = await faceapi
      .detectSingleFace(imageEl, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (detection) {
      const faceMatcher = new faceapi.FaceMatcher(referenceDescriptor);
      const bestMatch = faceMatcher.findBestMatch(detection.descriptor);

      if (bestMatch.distance < 0.6) {
        appState.candidate.faceVerified = true;
        addCandidate(appState.candidate.profile || {});
        // Reload candidates from backend to get the latest data
        await loadCandidates();
        navigate('/candidate/success');
      } else {
        setError("Face does not match the reference image.");
      }
    } else {
      setError("No face detected in the webcam.");
    }
  }, [initializing, referenceDescriptor, navigate]);

  // Route protection
  if (!appState.candidate.otpVerified) {
    return <Navigate to="/candidate/otp" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-950 font-mono p-4 flex items-center justify-center">
      {/* Background grid overlay */}
      <div className="absolute inset-0 z-0 opacity-30" style={{ backgroundImage: 'linear-gradient(to right, #1a1a1a 1px, transparent 1px), linear-gradient(to bottom, #1a1a1a 1px, transparent 1px)', backgroundSize: '40px 40px', backgroundPosition: '-1px -1px', pointerEvents: 'none' }} />
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/30 to-black/60 z-0" />

      {/* Main container with 2-column grid */}
      <div className="relative z-10 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

        {/* Left Column: Face Verification UI */}
        <div className="bg-black/30 backdrop-blur-sm border border-cyan-500/50 rounded-lg shadow-lg shadow-cyan-500/10 p-8 text-center space-y-6">
          <h2 
            className="text-2xl font-bold text-cyan-400"
            style={{ textShadow: '0 0 8px rgba(0, 255, 255, 0.7)' }}
          >
            Candidate Face Verification
          </h2>
          <div className="aspect-video w-full bg-black/80 rounded-md grid place-items-center border-2 border-fuchsia-500/50 animate-pulse overflow-hidden">
            {initializing ? (
              <p className="text-cyan-400 font-medium">INITIALIZING AI MODELS...</p>
            ) : (
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button 
            onClick={handleCapture} 
            disabled={initializing}
            className="w-full py-3 rounded-md font-medium text-lg bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 border border-cyan-500 shadow-lg shadow-cyan-500/20 transition-all duration-300 disabled:bg-gray-800/50 disabled:text-gray-500 disabled:border-gray-600 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {initializing ? 'Initializing...' : 'Capture & Verify'}
          </button>
        </div>

        {/* Right Column: Article/Description Section */}
        <div className="text-gray-300">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4" style={{ textShadow: '0 0 8px rgba(0, 255, 255, 0.7)' }}>
                Biometric Confirmation
            </h2>
            <p className="mb-4 text-base leading-relaxed">
                This final step creates a secure, biometric link between your digital registration and your physical identity. It ensures that the individual on the ballot is verifiably you, preventing impersonation and solidifying public trust.
            </p>
            <p className="text-base leading-relaxed text-gray-400">
                Our liveness check confirms you are present for this verification, providing the highest level of security for your candidacy. Please center your face in the webcam feed and ensure you are in a well-lit area.
            </p>
        </div>
      </div>
    </div>
  );
}