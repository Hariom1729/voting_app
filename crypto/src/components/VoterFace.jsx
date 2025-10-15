// import { Navigate, useLocation, useNavigate } from 'react-router-dom'
// import { appState } from '../state'

// export default function VoterFace() {
//   const location = useLocation()
//   const navigate = useNavigate()
//   if (!appState.voter.otpVerified) {
//     return <Navigate to="/voter/otp" state={{ from: location }} replace />
//   }

//   function handleCapture(e) {
//     e.preventDefault()
//     appState.voter.faceVerified = true
//     navigate('/voter/vote')
//   }

//   return (
//     <div className="min-h-screen relative overflow-hidden bg-gray-950 font-mono p-4 flex items-center justify-center">
//       {/* Background grid overlay */}
//       <div className="absolute inset-0 z-0 opacity-30" style={{ backgroundImage: 'linear-gradient(to right, #1a1a1a 1px, transparent 1px), linear-gradient(to bottom, #1a1a1a 1px, transparent 1px)', backgroundSize: '40px 40px', backgroundPosition: '-1px -1px', pointerEvents: 'none' }} />
//       <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/30 to-black/60 z-0" />

//       {/* Main container changed to a 2-column grid */}
//       <div className="relative z-10 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

//         {/* Left Column: Face Verification UI */}
//         <div className="bg-black/30 backdrop-blur-sm border border-cyan-500/50 rounded-lg shadow-lg shadow-cyan-500/10 p-8 text-center space-y-6">
//           <h2 
//             className="text-2xl font-bold text-cyan-400"
//             style={{ textShadow: '0 0 8px rgba(0, 255, 255, 0.7)' }}
//           >
//             Face Verification
//           </h2>
//           <div className="aspect-video w-full bg-black/80 rounded-md grid place-items-center border-2 border-fuchsia-500/50 animate-pulse">
//             <p className="text-fuchsia-400 font-medium">WEBCAM FEED</p>
//           </div>
//           <button 
//             onClick={handleCapture} 
//             className="w-full py-3 rounded-md font-medium text-lg bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 border border-cyan-500 shadow-lg shadow-cyan-500/20 transition-all duration-300"
//           >
//             Capture & Verify
//           </button>
//         </div>

//         {/* New Right Column: Article/Description Section */}
//         <div className="text-gray-300">
//             <h2 className="text-2xl font-bold text-cyan-400 mb-4" style={{ textShadow: '0 0 8px rgba(0, 255, 255, 0.7)' }}>
//                 Liveness & Identity Check
//             </h2>
//             <p className="mb-4 text-base leading-relaxed">
//                 This is the final security check. We use your device's camera to verify that you are the same person authenticated via Aadhaar and, crucially, that you are a **live person** present at the time of voting.
//             </p>
//             <p className="text-base leading-relaxed text-gray-400">
//                 This advanced biometric step prevents fraud using photos or videos, ensuring the integrity of your vote. Please position your face clearly in the frame and ensure you are in a well-lit area.
//             </p>
//         </div>
//       </div>
//     </div>
//   )
// }

// import { Navigate, useLocation, useNavigate } from 'react-router-dom';
// import { useState, useRef, useCallback } from 'react'; // Import React hooks
// import Webcam from 'react-webcam'; // Import the Webcam component
// import { appState } from '../state';

// export default function VoterFace() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   // Ref to access the webcam component
//   const webcamRef = useRef(null);
  
//   // State for loading indicators and error messages
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   // Protect the route: ensure voter has verified OTP
//   if (!appState.voter.otpVerified) {
//     return <Navigate to="/voter/otp" state={{ from: location }} replace />;
//   }

//   // Handles capturing the photo and calling the verification API
//   const handleCapture = useCallback(async () => {
//     if (loading) return; // Prevent multiple clicks
    
//     setError(''); // Clear previous errors
    
//     // Get the image from the webcam as a base64 string
//     const imageSrc = webcamRef.current.getScreenshot();

//     if (!imageSrc) {
//       setError('Could not capture image. Please ensure camera permissions are enabled.');
//       return;
//     }

//     setLoading(true);

//     try {
//       // Send the captured image to your backend for verification
//       const response = await fetch('/api/verify-face', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           imageData: imageSrc,
//           // You should send a unique ID for the voter
//           voterId: appState.voter.profile?.id, 
//         }),
//       });

//       if (!response.ok) {
//         throw new Error('Verification service is unavailable.');
//       }

//       const result = await response.json();

//       // If the backend confirms the face is verified, proceed to vote
//       if (result.verified) {
//         appState.voter.faceVerified = true;
//         navigate('/voter/vote');
//       } else {
//         setError(result.error || 'Face did not match. Please try again.');
//       }

//     } catch (err) {
//       console.error('Verification API call failed:', err);
//       setError('An error occurred during verification. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   }, [navigate, loading]); // Dependencies for useCallback

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
//       <div className="w-full max-w-md bg-white rounded-lg shadow p-6 text-center space-y-4">
//         <h2 className="text-xl font-semibold">Face Verification</h2>
        
//         {/* The Webcam component replaces the old placeholder div */}
//         <div className="aspect-video w-full bg-black rounded overflow-hidden">
//           <Webcam
//             audio={false}
//             ref={webcamRef}
//             screenshotFormat="image/jpeg"
//             className="w-full h-full object-cover"
//           />
//         </div>
        
//         {/* Display any error message from the backend */}
//         {error && <p className="text-red-500 text-sm">{error}</p>}
        
//         <button 
//           onClick={handleCapture} 
//           disabled={loading}
//           className="w-full bg-blue-600 text-white rounded py-2 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
//         >
//           {loading ? 'Verifying...' : 'Capture & Verify'}
//         </button>
//       </div>
//     </div>
//   );
// }


// import React, { useState, useRef, useEffect, useCallback } from 'react';
// import { Navigate, useLocation, useNavigate } from 'react-router-dom';
// import Webcam from 'react-webcam';
// import * as faceapi from 'face-api.js';
// import { appState } from '../state';
// import referenceImagePath from './compare.jpg'; // Your reference image

// export default function VoterFace() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const webcamRef = useRef(null);

//   const [initializing, setInitializing] = useState(true);
//   const [error, setError] = useState('');
//   const [referenceDescriptor, setReferenceDescriptor] = useState();

//   // Load models and prepare the reference face descriptor
//   useEffect(() => {
//     const setupFaceAPI = async () => {
//       try {
//         // We load models directly from a CDN (Content Delivery Network)
//         // This avoids the need to download them to your 'public' folder.
//         await Promise.all([
//           faceapi.nets.tinyFaceDetector.loadFromUri('https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model'),
//           faceapi.nets.faceLandmark68Net.loadFromUri('https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model'),
//           faceapi.nets.faceRecognitionNet.loadFromUri('https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model'),
//         ]);

//         // Now, process the reference image
//         const referenceImage = await faceapi.fetchImage(referenceImagePath);
//         const referenceDetection = await faceapi
//           .detectSingleFace(referenceImage, new faceapi.TinyFaceDetectorOptions())
//           .withFaceLandmarks()
//           .withFaceDescriptor();
        
//         if (referenceDetection) {
//           setReferenceDescriptor(referenceDetection.descriptor);
//         } else {
//           setError("Could not find a face in the reference image (compare.jpg).");
//         }
//       } catch (err) {
//         setError("Error initializing AI. Please refresh the page.");
//         console.error("Initialization Error:", err);
//       }
//       setInitializing(false);
//     };
//     setupFaceAPI();
//   }, []);

//   // Capture image and compare faces
//   const handleCapture = useCallback(async () => {
//     setError('');
//     if (initializing || !webcamRef.current || !referenceDescriptor) return;

//     const imageSrc = webcamRef.current.getScreenshot();
//     if (!imageSrc) {
//       setError('Could not capture an image.');
//       return;
//     }

//     const imageEl = await faceapi.fetchImage(imageSrc);
//     const detection = await faceapi
//       .detectSingleFace(imageEl, new faceapi.TinyFaceDetectorOptions())
//       .withFaceLandmarks()
//       .withFaceDescriptor();

//     if (detection) {
//       // Use the FaceMatcher to compare the two faces
//       const faceMatcher = new faceapi.FaceMatcher(referenceDescriptor);
//       const bestMatch = faceMatcher.findBestMatch(detection.descriptor);

//       if (bestMatch.distance < 0.6) { // 0.6 is the standard threshold for a match
//         appState.voter.faceVerified = true;
//         navigate('/voter/vote');
//       } else {
//         setError("Face does not match the reference image.");
//       }
//     } else {
//       setError("No face detected in the webcam.");
//     }
//   }, [initializing, referenceDescriptor, navigate]);

//   // Route protection
//   if (!appState.voter.otpVerified) {
//     return <Navigate to="/voter/otp" state={{ from: location }} replace />;
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
//       <div className="w-full max-w-md bg-white rounded-lg shadow p-6 text-center space-y-4">
//         <h2 className="text-xl font-semibold">Face Verification</h2>
//         <div className="aspect-video w-full bg-black rounded overflow-hidden">
//           <Webcam
//             audio={false}
//             ref={webcamRef}
//             screenshotFormat="image/jpeg"
//             className="w-full h-full object-cover"
//           />
//         </div>
        
//         {error && <p className="text-red-500 text-sm">{error}</p>}
        
//         <button 
//           onClick={handleCapture} 
//           disabled={initializing}
//           className="w-full bg-blue-600 text-white rounded py-2 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
//         >
//           {initializing ? 'Initializing AI...' : 'Capture & Verify'}
//         </button>
//       </div>
//     </div>
//   );
// }


import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import { appState } from '../state';
import referenceImagePath from './compare.jpg'; // Your reference image

export default function VoterFace() {
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
        appState.voter.faceVerified = true;
        navigate('/voter/vote');
      } else {
        setError("Face does not match the reference image.");
      }
    } else {
      setError("No face detected in the webcam.");
    }
  }, [initializing, referenceDescriptor, navigate]);

  // Route protection
  if (!appState.voter.otpVerified) {
    return <Navigate to="/voter/otp" state={{ from: location }} replace />;
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
            Face Verification
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
                Liveness & Identity Check
            </h2>
            <p className="mb-4 text-base leading-relaxed">
                This is the final security check. We use your device's camera to verify that you are the same person authenticated via Aadhaar and, crucially, that you are a **live person** present at the time of voting.
            </p>
            <p className="text-base leading-relaxed text-gray-400">
                This advanced biometric step prevents fraud using photos or videos, ensuring the integrity of your vote. Please position your face clearly in the frame and ensure you are in a well-lit area.
            </p>
        </div>
      </div>
    </div>
  );
}