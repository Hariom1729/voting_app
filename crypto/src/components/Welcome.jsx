import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Welcome() {
  const navigate = useNavigate()
  const images = useMemo(() => ([
    'https://cdnuploads.aa.com.tr/uploads/Contents/2024/05/25/thumbs_b_c_af3eca0e2a3ebd44c9667400021dec5e.jpg?v=135821',
    'https://www.aljazeera.com/wp-content/uploads/2024/05/AFP__20240507__34R37R8__v2__Preview__IndiaVotingLoneVoter-1715147266.jpg?resize=1200%2C630',
    'https://i.ytimg.com/vi/O8cDraZU7VQ/maxresdefault.jpg',
  ]), [])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setIndex(i => (i + 1) % images.length)
    }, 4000)
    return () => clearInterval(id)
  }, [images.length])

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background slideshow */}
      <div className="absolute inset-0">
        {images.map((src, i) => (
          <div
            key={src}
            className={`absolute inset-0 bg-center bg-cover transition-opacity duration-1000 ${i === index ? 'opacity-100' : 'opacity-0'}`}
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center text-white p-6 text-center space-y-6">
        <h1 className="text-4xl font-extrabold drop-shadow">Welcome to the Election Portal</h1>
        <p className="text-xl font-medium">one vote one india</p>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <button onClick={() => navigate('/voter/register')} className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg">
            Sign in as Voter
          </button>
          <button onClick={() => navigate('/candidate/aadhaar')} className="px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 shadow-lg">
            Sign in as Candidate
          </button>
          <button onClick={() => navigate('/admin/login')} className="px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-700 shadow-lg">
            Sign in as Admin
          </button>
        </div>
      </div>
    </div>
  )
}


