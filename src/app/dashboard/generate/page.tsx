"use client"

export const dynamic = 'force-dynamic'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { Sparkles, ArrowLeft, Upload, Loader2, Image as ImageIcon, Download, Play, CheckCircle2 } from 'lucide-react'

// Separate component for searchParams to use Suspense
function GenerateContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const preselectedCharId = searchParams.get('character')

  const [user, setUser] = useState<any>(null)
  const [characters, setCharacters] = useState<any[]>([])
  const [selectedCharId, setSelectedCharId] = useState<string | null>(preselectedCharId)
  const [prompt, setPrompt] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  
  const [generating, setGenerating] = useState(false)
  const [outputImage, setOutputImage] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    const initData = async () => {
      // --- DEMO MODE BYPASS ---
      const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'your-supabase-project-url'
      if (isDemoMode) {
        setUser({ id: 'demo-user-123', email: 'demo-user@studio.ai' })
        setCharacters([
          {
            id: 'char-1',
            name: 'Mia Jenkins',
            style_vibe: 'Streetwear chic',
            reference_image_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80'
          },
          {
            id: 'char-2',
            name: 'David Chen',
            style_vibe: 'Cyberpunk Tech',
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      setPreviewUrl(URL.createObjectURL(selectedFile))
    }
  }

  const handleGenerate = async () => {
    if (!selectedCharId) {
      setErrorMsg("Please select a character first.")
      return
    }
    if (!prompt.trim()) {
      setErrorMsg("Please enter a prompt.")
      return
    }

    setGenerating(true)
    setErrorMsg(null)
    setOutputImage(null)

    try {
      // --- DEMO MODE BYPASS ---
      const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'your-supabase-project-url'
      if (isDemoMode) {
        console.log("DEMO MODE: Simulating 4-step generation process...")
        await new Promise(res => setTimeout(res, 3000))
        setOutputImage("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&q=80") // Beach sunset
        return
      }
      // ------------------------

      // In real mode, this would hit our /api/generate endpoint with a POST request
      // e.g. const res = await fetch('/api/generate', { body: JSON.stringify({ charId, prompt, sceneImage }) })
      // For now, we simulate an error if the API route isn't built yet
      throw new Error("Generation API route is not fully connected yet. Try running in Demo Mode!")

    } catch (err: any) {
      setErrorMsg(err.message || 'Generation failed.')
    } finally {
      setGenerating(false)
    }
  }

  const selectedChar = characters.find(c => c.id === selectedCharId)

  return (
    <div className="space-y-10">
      
      {/* 1. Character Selection */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span className="w-1.5 h-6 bg-violet-600 rounded-full" />
            1. Select Character
          </h2>
          <p className="text-xs text-slate-400 mt-1">Choose the AI influencer you want to feature in this generation.</p>
        </div>

        {characters.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
            {characters.map((char) => {
              const isSelected = selectedCharId === char.id
              return (
                <button
                  key={char.id}
                  onClick={() => setSelectedCharId(char.id)}
                  className={`relative shrink-0 w-32 sm:w-40 aspect-[3/4] rounded-2xl overflow-hidden snap-start transition-all duration-300 ${
                    isSelected ? 'ring-4 ring-violet-500 scale-105 shadow-xl shadow-violet-500/20' : 'ring-1 ring-slate-800 opacity-60 hover:opacity-100 hover:scale-105'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={char.reference_image_url} alt={char.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2 text-left">
                    <p className="text-sm font-bold text-white truncate">{char.name}</p>
                  </div>
                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-violet-500 rounded-full p-1 shadow-lg">
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        ) : (
          <div className="p-8 text-center rounded-2xl bg-slate-900/30 border border-dashed border-slate-800 text-slate-500 text-sm">
            You have no characters. <Link href="/dashboard/create" className="text-violet-400 font-bold hover:underline">Create one first!</Link>
          </div>
        )}
      </section>

      {/* 2. Scene Configuration */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span className="w-1.5 h-6 bg-cyan-500 rounded-full" />
            2. Scene Configuration
          </h2>
          <p className="text-xs text-slate-400 mt-1">Describe the scene or upload a pose/background reference image.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-900/30 border border-slate-900 p-6 rounded-3xl">
          
          {/* Prompt Box */}
          <div className="md:col-span-8 space-y-3">
            <label className="text-xs font-bold text-slate-300 tracking-wide uppercase">Prompt Details</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., beach par sunset mein dikhao, wearing a white flowing dress, highly detailed..."
              rows={5}
              className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-2xl text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all resize-none"
            />
            {errorMsg && (
              <p className="text-rose-400 text-sm font-medium bg-rose-950/30 px-3 py-2 rounded-lg border border-rose-900/50">
                {errorMsg}
              </p>
            )}
          </div>

          {/* Reference Image Upload */}
          <div className="md:col-span-4 flex flex-col">
            <label className="text-xs font-bold text-slate-300 tracking-wide uppercase mb-3">Optional Pose Reference</label>
            {previewUrl ? (
              <div className="relative flex-1 w-full rounded-2xl overflow-hidden border border-slate-800 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewUrl} alt="Scene Reference" className="w-full h-full object-cover absolute inset-0" />
                <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <label className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg cursor-pointer hover:bg-slate-800 text-xs font-semibold text-white">
                    Change
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>
              </div>
            ) : (
              <label className="flex-1 w-full border-2 border-dashed border-slate-800 hover:border-cyan-500/50 rounded-2xl flex flex-col items-center justify-center p-4 text-center cursor-pointer hover:bg-slate-900/20 transition-all">
                <ImageIcon className="h-6 w-6 text-slate-500 mb-2" />
                <span className="text-xs font-bold text-slate-300 mb-1">Scene/Pose Image</span>
                <span className="text-[10px] text-slate-500">Upload to guide the AI</span>
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
            )}
          </div>

        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={generating || !selectedCharId || !prompt.trim()}
          className="w-full py-4.5 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-500 hover:opacity-90 text-white font-bold rounded-2xl shadow-[0_0_40px_-10px_rgba(139,92,246,0.5)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale active:scale-[0.99] text-lg"
        >
          {generating ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Mixing AI Parameters & Rendering...</span>
            </>
          ) : (
            <>
              <Play className="h-6 w-6 fill-white" />
              <span>Generate Studio Image</span>
            </>
          )}
        </button>
      </section>

      {/* 3. Output Area */}
      {(outputImage || generating) && (
        <section className="space-y-4 pt-6 border-t border-slate-900">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span className="w-1.5 h-6 bg-fuchsia-500 rounded-full" />
            3. Final Result
          </h2>
          
          <div className="w-full max-w-2xl mx-auto aspect-[4/5] rounded-3xl bg-slate-900/50 border border-slate-800 flex items-center justify-center relative overflow-hidden shadow-2xl">
            {generating ? (
              <div className="text-center space-y-4">
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-slate-800 border-t-cyan-500 border-r-fuchsia-500 rounded-full animate-spin" />
                  <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-violet-400 h-6 w-6 animate-pulse" />
                </div>
                <p className="text-sm font-semibold text-slate-300 animate-pulse">Running Face Swap & Morphs...</p>
              </div>
            ) : outputImage ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={outputImage} alt="Generated Output" className="w-full h-full object-cover" />
                <div className="absolute top-4 right-4">
                  <a
                    href={outputImage}
                    download="generated-influencer.jpg"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 bg-slate-950/80 hover:bg-violet-600 backdrop-blur-md border border-slate-800 hover:border-violet-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg transition-all"
                  >
                    <Download className="h-4 w-4" /> Download High-Res
                  </a>
                </div>
                <div className="absolute bottom-4 left-4 right-4 bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-xl p-3 flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={selectedChar?.reference_image_url} alt="Face Reference" className="w-10 h-10 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate">Target: {selectedChar?.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">Prompt: {prompt}</p>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </section>
      )}

    </div>
  )
}

export default function GeneratePage() {
  return (
    <div className="flex-1 min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-20%] left-[10%] w-[60%] h-[60%] rounded-full bg-violet-900/10 blur-[130px] pointer-events-none" />
      
      {/* Header */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-tr from-violet-600 to-cyan-500 p-2 rounded-xl group-hover:scale-105 transition-all">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-white">AI Influencer Studio</span>
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto w-full px-6 py-10 flex-1 z-10">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-slate-400 hover:text-slate-200 transition-colors gap-2 group mb-6"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Studio</span>
        </Link>
        
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Create Image</h1>
          <p className="text-sm text-slate-400 mt-1">Blend your character's data with your prompt to generate a highly consistent photo.</p>
        </div>

        <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="h-8 w-8 text-violet-500 animate-spin" /></div>}>
          <GenerateContent />
        </Suspense>
      </main>
    </div>
  )
}
