"use client"

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { Sparkles, ArrowLeft, Upload, Loader2, Video, CheckCircle2, Download, RefreshCw, Play, Volume2 } from 'lucide-react'

// Kling API Mock Generation steps
const KLING_STEPS = [
  { text: 'Initiating video generation sequence...', progress: 10 },
  { text: 'Analyzing character face references...', progress: 22 },
  { text: 'Queue position: #3 in Kling pipeline...', progress: 35 },
  { text: 'Synthesizing frames (12/60)...', progress: 50 },
  { text: 'Synthesizing frames (38/60)...', progress: 68 },
  { text: 'Synthesizing frames (57/60)...', progress: 85 },
  { text: 'Post-processing frame interpolation...', progress: 95 },
  { text: 'Finalizing high-fidelity MP4 video output...', progress: 100 }
]

function VideoContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const preselectedCharId = searchParams.get('character')

  const [user, setUser] = useState<any>(null)
  const [characters, setCharacters] = useState<any[]>([])
  const [selectedCharId, setSelectedCharId] = useState<string | null>(preselectedCharId)
  
  // Video params
  const [videoMode, setVideoMode] = useState<'text' | 'image'>('text')
  const [prompt, setPrompt] = useState('')
  const [duration, setDuration] = useState('5s')
  
  // Image to Video File
  const [refFile, setRefFile] = useState<File | null>(null)
  const [refPreviewUrl, setRefPreviewUrl] = useState<string | null>(null)

  // Generation status
  const [generating, setGenerating] = useState(false)
  const [generationStep, setGenerationStep] = useState(0)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [outputVideoUrl, setOutputVideoUrl] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    const initData = async () => {
      const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'your-supabase-project-url'
      if (isDemoMode) {
        setUser({ id: 'demo-user-123', email: 'demo-user@studio.ai' })
        setCharacters([
          {
            id: 'char-1',
            name: 'Mia Jenkins',
            gender: 'Female',
            style_vibe: 'Cyberpunk Techwear',
            reference_image_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80'
          },
          {
            id: 'char-2',
            name: 'David Chen',
            gender: 'Male',
            style_vibe: 'High-Fashion Streetwear',
            reference_image_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80'
          }
        ])
        if (!preselectedCharId) setSelectedCharId('char-1')
        return
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/')
        return
      }
      setUser(user)

      const { data: chars } = await supabase
        .from('characters')
        .select('*')
        .order('created_at', { ascending: false })
      
      setCharacters(chars || [])
      
      if (!preselectedCharId && chars && chars.length > 0) {
        setSelectedCharId(chars[0].id)
      }
    }
    initData()
  }, [router, supabase, preselectedCharId])

  // Kling simulation interval loop
  useEffect(() => {
    if (!generating) return

    const totalSteps = KLING_STEPS.length
    let currentStepIndex = 0

    const interval = setInterval(() => {
      if (currentStepIndex < totalSteps - 1) {
        currentStepIndex++
        setGenerationStep(currentStepIndex)
        setGenerationProgress(KLING_STEPS[currentStepIndex].progress)
      } else {
        clearInterval(interval)
        setGenerating(false)
        // Set sample video url on success
        setOutputVideoUrl('https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-light-in-tokyo-42240-large.mp4')
      }
    }, 1800)

    return () => clearInterval(interval)
  }, [generating])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setRefFile(selectedFile)
      setRefPreviewUrl(URL.createObjectURL(selectedFile))
    }
  }

  const handleGenerate = () => {
    if (!selectedCharId) {
      setErrorMsg("Please select an AI Character.")
      return
    }
    if (!prompt.trim()) {
      setErrorMsg("Please enter a scene prompt.")
      return
    }

    setGenerating(true)
    setGenerationStep(0)
    setGenerationProgress(KLING_STEPS[0].progress)
    setErrorMsg(null)
    setOutputVideoUrl(null)
  }

  const selectedChar = characters.find(c => c.id === selectedCharId)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* Left Column: Form Settings (7 cols) */}
      <div className="lg:col-span-7 space-y-8">
        
        {/* 1. Character selection */}
        <section className="space-y-4 bg-[#0F1629]/40 border border-violet-900/10 p-6 rounded-3xl backdrop-blur-xl">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2" style={{ fontFamily: "'Syne', sans-serif" }}>
              <span className="w-1.5 h-5 bg-violet-600 rounded-full" />
              1. Choose Character
            </h2>
            <p className="text-xs text-slate-450 mt-0.5 font-medium">Select the target AI character model to feature in the generated cinematic clip.</p>
          </div>

          {characters.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto pb-2 snap-x scrollbar-thin">
              {characters.map((char) => {
                const isSelected = selectedCharId === char.id
                return (
                  <button
                    key={char.id}
                    type="button"
                    onClick={() => {
                      setSelectedCharId(char.id)
                      setErrorMsg(null)
                    }}
                    className={`relative shrink-0 w-28 sm:w-32 aspect-[3/4] rounded-2xl overflow-hidden snap-start transition-all duration-300 ${
                      isSelected 
                        ? 'ring-2 ring-violet-500 scale-102 shadow-lg shadow-violet-500/10' 
                        : 'border border-violet-900/10 opacity-60 hover:opacity-100 hover:scale-[1.01]'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={char.reference_image_url} alt={char.name} className="w-full h-full object-cover object-top" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/10 to-transparent" />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 text-left">
                      <p className="text-xs font-bold text-white truncate">{char.name}</p>
                      <p className="text-[9px] text-[#A78BFA] font-semibold truncate">{char.style_vibe}</p>
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-violet-500 rounded-full p-0.5 shadow-md">
                        <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="p-8 text-center rounded-2xl bg-[#0A0F1E] border border-dashed border-violet-900/20 text-slate-500 text-xs">
              No character profiles. <Link href="/dashboard/create" className="text-violet-400 font-bold hover:underline">Define a model first.</Link>
            </div>
          )}
        </section>

        {/* 2. Kling Configuration Settings */}
        <section className="space-y-4 bg-[#0F1629]/40 border border-violet-900/10 p-6 rounded-3xl backdrop-blur-xl">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2" style={{ fontFamily: "'Syne', sans-serif" }}>
              <span className="w-1.5 h-5 bg-cyan-500 rounded-full" />
              2. Kling Generation Engine Parameters
            </h2>
            <p className="text-xs text-slate-450 mt-0.5 font-medium">Select target mode, video lengths and specify high fidelity animation scenarios.</p>
          </div>

          {/* Video modes: Text to Video / Image to Video */}
          <div className="bg-[#0A0F1E] p-1 rounded-2xl border border-violet-900/10 grid grid-cols-2">
            <button
              type="button"
              onClick={() => setVideoMode('text')}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                videoMode === 'text' 
                  ? 'bg-violet-600 text-white' 
                  : 'text-slate-455 hover:text-slate-200'
              }`}
            >
              Text to Video
            </button>
            <button
              type="button"
              onClick={() => setVideoMode('image')}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                videoMode === 'image' 
                  ? 'bg-violet-600 text-white' 
                  : 'text-slate-455 hover:text-slate-200'
              }`}
            >
              Image to Video
            </button>
          </div>

          {/* Scene Prompt */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-350 tracking-wide uppercase">Cinematic Animation Scenario Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Slowly turning head towards the camera, neon signs blinking in rainy background, hair blowing in breeze, 8k Resolution..."
              rows={4}
              className="w-full px-4 py-3 bg-[#0A0F1E] border border-violet-900/20 rounded-2xl text-slate-100 placeholder-slate-650 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          {/* Optional Keyframe reference for Image to Video */}
          {videoMode === 'image' && (
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-slate-355 tracking-wide uppercase">Keyframe / Start Frame Reference Photo</label>
              {refPreviewUrl ? (
                <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-violet-900/20 group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={refPreviewUrl} alt="Video keyframe" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <label className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg cursor-pointer text-xs font-bold text-white hover:bg-slate-850">
                      Change File
                      <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </label>
                  </div>
                </div>
              ) : (
                <label className="flex w-full border-2 border-dashed border-violet-900/15 hover:border-violet-500/50 rounded-2xl flex-col items-center justify-center p-6 text-center cursor-pointer transition-all bg-[#0A0F1E]/40">
                  <Upload className="h-6 w-6 text-slate-500 mb-2" />
                  <span className="text-xs font-bold text-slate-300">Upload Start Frame Image</span>
                  <span className="text-[10px] text-slate-500 mt-1">This photo will act as the first keyframe of your animated sequence.</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              )}
            </div>
          )}

          {/* Clip duration selector */}
          <div className="space-y-3 pt-2">
            <label className="text-xs font-bold text-slate-355 tracking-wide uppercase">Target Video Duration</label>
            <div className="flex gap-3">
              {['5s', '10s', '15s'].map((d) => {
                const isSelected = duration === d
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDuration(d)}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                      isSelected 
                        ? 'border-violet-500 bg-violet-950/20 text-white' 
                        : 'border-violet-900/10 bg-[#0A0F1E]/60 text-slate-450 hover:border-slate-800'
                    }`}
                  >
                    {d} Clip
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-900/60 text-rose-250 text-xs">
            {errorMsg}
          </div>
        )}

        {/* Submit click */}
        <button
          onClick={handleGenerate}
          disabled={generating || !selectedCharId || !prompt.trim()}
          className="w-full py-4.5 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-500 hover:opacity-95 text-white font-bold rounded-3xl shadow-[0_0_30px_-10px_rgba(139,92,246,0.4)] transition-all flex items-center justify-center gap-2.5 disabled:opacity-40 disabled:grayscale active:scale-[0.99] text-base"
        >
          {generating ? (
            <>
              <Loader2 className="h-5.5 w-5.5 animate-spin" />
              <span>Simulating Kling API Render Pipeline...</span>
            </>
          ) : (
            <>
              <Video className="h-5.5 w-5.5" />
              <span>Generate Cinematic Video</span>
            </>
          )}
        </button>
      </div>

      {/* Right Column: Kling Simulation Progress or Video output (5 cols) */}
      <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
        <div className="bg-[#0F1629]/40 border border-violet-900/10 p-6 rounded-3xl backdrop-blur-xl flex flex-col items-center justify-center min-h-[480px] relative overflow-hidden">
          <h3 className="text-sm font-bold text-slate-350 uppercase tracking-wide mb-4 self-start">Kling Output Canvas</h3>

          {generating ? (
            <div className="w-full flex-1 flex flex-col justify-center space-y-6 px-2">
              
              {/* Progress visual spinner */}
              <div className="flex flex-col items-center py-6 space-y-3">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-slate-900 border-t-cyan-500 border-r-violet-500 rounded-full animate-spin" />
                  <Video className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-cyan-400 h-5 w-5 animate-pulse" />
                </div>
                <span className="text-xl font-black text-slate-200">{generationProgress}%</span>
              </div>

              {/* Steps Progress List */}
              <div className="space-y-3 bg-[#0A0F1E] border border-violet-900/15 p-4 rounded-2xl">
                <div className="text-[10px] font-bold text-violet-400 tracking-wide uppercase">Kling API Pipeline logs:</div>
                <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                  {KLING_STEPS.slice(0, generationStep + 1).map((s, idx) => (
                    <div key={idx} className="flex items-start space-x-2 text-xs font-semibold">
                      <span className="text-cyan-500 mt-0.5">✓</span>
                      <span className={idx === generationStep ? 'text-slate-200 font-bold' : 'text-slate-500'}>
                        {s.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : outputVideoUrl ? (
            <div className="w-full flex-1 flex flex-col items-center justify-center space-y-6">
              
              {/* Looping video player */}
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-violet-900/20 bg-slate-950 shadow-2xl">
                <video
                  src={outputVideoUrl}
                  controls
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                
                {/* Audio label badge */}
                <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md p-1.5 rounded-lg border border-violet-900/10 text-white opacity-60 hover:opacity-100 transition-opacity">
                  <Volume2 className="h-3.5 w-3.5" />
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3 w-full">
                <a
                  href={outputVideoUrl}
                  download="generated-influencer-clip.mp4"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 px-4 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs rounded-xl shadow-md transition-all text-center active:scale-[0.98]"
                >
                  <Download className="h-4 w-4" /> Download MP4
                </a>
                <button
                  onClick={handleGenerate}
                  className="flex items-center justify-center gap-1.5 px-4 py-3 bg-[#0A0F1E] hover:bg-slate-900 text-slate-200 font-bold text-xs border border-violet-900/20 rounded-xl transition-all text-center active:scale-[0.98]"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Re-animate
                </button>
              </div>

              {/* Metadata */}
              <div className="w-full bg-[#0A0F1E] rounded-2xl p-4 border border-violet-900/10 text-[11px] leading-relaxed space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#8B92A8]">Featured Model:</span>
                  <span className="font-semibold text-slate-200">{selectedChar?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8B92A8]">Kling API Engine:</span>
                  <span className="font-semibold text-cyan-400">Kling-1.5 Turbo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8B92A8]">Render Settings:</span>
                  <span className="font-semibold text-slate-300">1080p SFX Interpolated ({duration})</span>
                </div>
                <div className="pt-2 border-t border-violet-900/10 text-slate-400 italic">
                  "{prompt}"
                </div>
              </div>

            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500 space-y-3">
              <Video className="h-10 w-10 text-slate-650" />
              <div className="max-w-[200px] text-xs leading-relaxed">
                Choose a model profile, input animation scenario prompt, and generate clip to run Kling simulation sequence.
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  )
}

export default function VideoPage() {
  return (
    <div className="flex-1 min-h-screen bg-[#0A0F1E] text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-20%] left-[10%] w-[60%] h-[60%] rounded-full bg-violet-900/10 blur-[130px] pointer-events-none" />
      
      {/* Header */}
      <header className="border-b border-violet-900/20 bg-[#0A0F1E]/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-tr from-violet-600 to-[#EC4899] p-2 rounded-xl group-hover:scale-105 transition-all shadow-md shadow-violet-500/10">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-white" style={{ fontFamily: "'Syne', sans-serif" }}>AI Influencer Studio</span>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full px-6 py-10 flex-1 z-10 space-y-8">
        
        {/* Navigation back */}
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-slate-400 hover:text-slate-200 transition-colors gap-2 group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Dashboard</span>
        </Link>
        
        {/* Title */}
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>Studio Video Shoot</h1>
          <p className="text-sm text-slate-400 mt-1">Animate your AI Virtual Influencer character with state-of-the-art Kling AI rendering engine.</p>
        </div>

        <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="h-8 w-8 text-violet-500 animate-spin" /></div>}>
          <VideoContent />
        </Suspense>
      </main>
    </div>
  )
}
