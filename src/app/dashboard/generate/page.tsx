"use client"

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { Sparkles, ArrowLeft, Upload, Loader2, Image as ImageIcon, Download, Play, CheckCircle2, RefreshCw, Edit } from 'lucide-react'

const ASPECT_RATIOS = [
  { id: '1:1', label: '1:1', name: 'Square', class: 'aspect-square w-10' },
  { id: '9:16', label: '9:16', name: 'Portrait', class: 'aspect-[9/16] h-12 w-7' },
  { id: '16:9', label: '16:9', name: 'Landscape', class: 'aspect-[16/9] w-12 h-7' },
  { id: '4:3', label: '4:3', name: 'Standard', class: 'aspect-[4/3] w-10 h-7.5' }
]

function GenerateContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const preselectedCharId = searchParams.get('character')

  const [user, setUser] = useState<any>(null)
  const [characters, setCharacters] = useState<any[]>([])
  const [selectedCharId, setSelectedCharId] = useState<string | null>(preselectedCharId)
  
  // Generation Parameters
  const [generationMode, setGenerationMode] = useState<'txt2img' | 'img2img' | 'multi'>('txt2img')
  const [prompt, setPrompt] = useState('')
  const [aspectRatio, setAspectRatio] = useState('1:1')
  
  // Reference files
  const [refFile1, setRefFile1] = useState<File | null>(null)
  const [refPreviewUrl1, setRefPreviewUrl1] = useState<string | null>(null)
  const [refFile2, setRefFile2] = useState<File | null>(null)
  const [refPreviewUrl2, setRefPreviewUrl2] = useState<string | null>(null)

  const [generating, setGenerating] = useState(false)
  const [outputImage, setOutputImage] = useState<string | null>(null)
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
            reference_image_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80',
            age: 24,
            hair_color_style: 'Blonde / Long Wavy',
            body_type: 'Slim/Athletic'
          },
          {
            id: 'char-2',
            name: 'David Chen',
            gender: 'Male',
            style_vibe: 'High-Fashion Streetwear',
            reference_image_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80',
            age: 27,
            hair_color_style: 'Black / Crew Cut',
            body_type: 'Muscular/Fit'
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

  const handleFileChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setRefFile1(selectedFile)
      setRefPreviewUrl1(URL.createObjectURL(selectedFile))
    }
  }

  const handleFileChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setRefFile2(selectedFile)
      setRefPreviewUrl2(URL.createObjectURL(selectedFile))
    }
  }

  const handleGenerate = async () => {
    if (!selectedCharId) {
      setErrorMsg("Please select an AI character first.")
      return
    }
    if (!prompt.trim()) {
      setErrorMsg("Please type a scenario prompt.")
      return
    }

    setGenerating(true)
    setErrorMsg(null)
    setOutputImage(null)

    try {
      // --- DEMO MODE BYPASS ---
      const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'your-supabase-project-url'
      if (isDemoMode) {
        console.log("DEMO MODE: Rendering character with aspect ratio", aspectRatio)
        await new Promise(res => setTimeout(res, 3500))
        
        // Randomly select a high quality photo based on theme or default to a cool photo
        const mockOutputs: Record<string, string> = {
          '1:1': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1000&q=80',
          '9:16': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1000&q=80',
          '16:9': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&q=80',
          '4:3': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1000&q=80'
        }
        setOutputImage(mockOutputs[aspectRatio] || mockOutputs['1:1'])
        return
      }
      // ------------------------

      // Real implementation would invoke /api/generate
      const charData = characters.find(c => c.id === selectedCharId)
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          charId: selectedCharId,
          prompt,
          aspectRatio,
          mode: generationMode,
          charPrompt: `${charData?.name}, a ${charData?.age}-year-old ${charData?.gender || 'Female'} influencer with a ${charData?.body_type} build, ${charData?.skin_tone} skin tone, ${charData?.hair_color_style} style, styled in ${charData?.style_vibe}.`
        })
      })

      if (!response.ok) {
        const errJson = await response.json()
        throw new Error(errJson.error || 'Server error generating image.')
      }

      const resData = await response.json()
      setOutputImage(resData.outputImageUrl)

    } catch (err: any) {
      setErrorMsg(err.message || 'Generation failed.')
    } finally {
      setGenerating(false)
    }
  }

  const selectedChar = characters.find(c => c.id === selectedCharId)

  // Map aspect ratio for preview container styling
  const getPreviewAspectClass = () => {
    switch (aspectRatio) {
      case '9:16': return 'aspect-[9/16] max-w-[280px]'
      case '16:9': return 'aspect-[16/9] max-w-full'
      case '4:3': return 'aspect-[4/3] max-w-lg'
      default: return 'aspect-square max-w-md'
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* Left Column: Config Panel (7 cols) */}
      <div className="lg:col-span-7 space-y-8">
        
        {/* 1. Character Selector Required */}
        <section className="space-y-4 bg-[#0F1629]/40 border border-violet-900/10 p-6 rounded-3xl backdrop-blur-xl">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2" style={{ fontFamily: "'Syne', sans-serif" }}>
              <span className="w-1.5 h-5 bg-violet-600 rounded-full" />
              1. Choose Character
            </h2>
            <p className="text-xs text-slate-450 mt-0.5">Select the virtual model to apply the face swap morphing logic onto.</p>
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
                      <p className="text-[9px] text-[#A78BFA] font-medium truncate">{char.style_vibe}</p>
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
              No custom characters found. <Link href="/dashboard/create" className="text-violet-400 font-bold hover:underline">Design one first!</Link>
            </div>
          )}

          {selectedChar && (
            <div className="p-3 bg-[#0A0F1E] rounded-xl border border-violet-900/10 flex items-center justify-between text-xs">
              <div>
                <span className="text-[#8B92A8] mr-2">Target model:</span>
                <span className="font-bold text-slate-200">{selectedChar.name}</span>
                <span className="mx-2 text-slate-700">|</span>
                <span className="text-[#8B92A8] mr-1">Vibe:</span>
                <span className="font-semibold text-violet-400">{selectedChar.style_vibe}</span>
              </div>
              <Link href={`/dashboard/edit/${selectedChar.id}`} className="text-violet-400 font-bold hover:underline inline-flex items-center gap-1">
                <Edit className="h-3 w-3" /> Edit traits
              </Link>
            </div>
          )}
        </section>

        {/* 2. Generation Modes Tabs */}
        <section className="space-y-4 bg-[#0F1629]/40 border border-violet-900/10 p-6 rounded-3xl backdrop-blur-xl">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2" style={{ fontFamily: "'Syne', sans-serif" }}>
              <span className="w-1.5 h-5 bg-cyan-500 rounded-full" />
              2. Generation Settings
            </h2>
            <p className="text-xs text-slate-450 mt-0.5">Toggle generation inputs and customize the aspect ratio output formats.</p>
          </div>

          {/* Mode Selector Tabs */}
          <div className="bg-[#0A0F1E] p-1 rounded-2xl border border-violet-900/10 grid grid-cols-3">
            {[
              { id: 'txt2img', name: 'Text to Image' },
              { id: 'img2img', name: 'Image to Image' },
              { id: 'multi', name: 'Multi Input' }
            ].map((m) => {
              const isActive = generationMode === m.id
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setGenerationMode(m.id as any)}
                  className={`py-2 text-xs font-bold rounded-xl transition-all ${
                    isActive 
                      ? 'bg-violet-600 text-white shadow-md' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {m.name}
                </button>
              )
            })}
          </div>

          {/* Scenario Text Prompt */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-350 tracking-wide uppercase">Scenario Prompt Description</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Standing inside a high-end streetwear boutique in Paris, holding shopping bags, dynamic cinematic lighting, detailed face..."
              rows={4}
              className="w-full px-4 py-3 bg-[#0A0F1E] border border-violet-900/20 rounded-2xl text-slate-100 placeholder-slate-650 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          {/* Dynamic mode inputs */}
          {generationMode === 'img2img' && (
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-slate-350 tracking-wide uppercase">Background / Pose Reference Image</label>
              {refPreviewUrl1 ? (
                <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-violet-900/25 group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={refPreviewUrl1} alt="Reference" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <label className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl cursor-pointer text-xs font-bold text-white hover:bg-slate-800">
                      Change Reference
                      <input type="file" accept="image/*" onChange={handleFileChange1} className="hidden" />
                    </label>
                  </div>
                </div>
              ) : (
                <label className="flex w-full border-2 border-dashed border-violet-900/10 hover:border-violet-500/50 rounded-2xl flex-col items-center justify-center p-6 text-center cursor-pointer transition-all bg-[#0A0F1E]/40">
                  <Upload className="h-6 w-6 text-slate-500 mb-2" />
                  <span className="text-xs font-bold text-slate-300">Upload Reference Image</span>
                  <span className="text-[10px] text-slate-500 mt-1">This image will act as the template/layout for the generation.</span>
                  <input type="file" accept="image/*" onChange={handleFileChange1} className="hidden" />
                </label>
              )}
            </div>
          )}

          {generationMode === 'multi' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Pose Reference */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-350 tracking-wide uppercase">Pose Reference Template</label>
                {refPreviewUrl1 ? (
                  <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-violet-900/20 group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={refPreviewUrl1} alt="Pose" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <label className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg cursor-pointer text-[10px] font-bold text-white hover:bg-slate-850">
                        Change
                        <input type="file" accept="image/*" onChange={handleFileChange1} className="hidden" />
                      </label>
                    </div>
                  </div>
                ) : (
                  <label className="flex aspect-square w-full border-2 border-dashed border-violet-900/10 hover:border-violet-500/50 rounded-2xl flex-col items-center justify-center p-4 text-center cursor-pointer transition-all bg-[#0A0F1E]/40">
                    <Upload className="h-5 w-5 text-slate-500 mb-1" />
                    <span className="text-[11px] font-bold text-slate-300">Upload Pose</span>
                    <input type="file" accept="image/*" onChange={handleFileChange1} className="hidden" />
                  </label>
                )}
              </div>

              {/* Style/Texture Reference */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-350 tracking-wide uppercase">Style / Texture Sample</label>
                {refPreviewUrl2 ? (
                  <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-violet-900/20 group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={refPreviewUrl2} alt="Style" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <label className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg cursor-pointer text-[10px] font-bold text-white hover:bg-slate-855">
                        Change
                        <input type="file" accept="image/*" onChange={handleFileChange2} className="hidden" />
                      </label>
                    </div>
                  </div>
                ) : (
                  <label className="flex aspect-square w-full border-2 border-dashed border-violet-900/10 hover:border-violet-500/50 rounded-2xl flex-col items-center justify-center p-4 text-center cursor-pointer transition-all bg-[#0A0F1E]/40">
                    <Upload className="h-5 w-5 text-slate-500 mb-1" />
                    <span className="text-[11px] font-bold text-slate-300">Upload Style</span>
                    <input type="file" accept="image/*" onChange={handleFileChange2} className="hidden" />
                  </label>
                )}
              </div>
            </div>
          )}

          {/* Aspect Ratio Selector */}
          <div className="space-y-3 pt-2">
            <label className="text-xs font-bold text-slate-350 tracking-wide uppercase">Aspect Ratio Output Format</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {ASPECT_RATIOS.map((ar) => {
                const isSelected = aspectRatio === ar.id
                return (
                  <button
                    key={ar.id}
                    type="button"
                    onClick={() => setAspectRatio(ar.id)}
                    className={`flex flex-col items-center justify-between p-3.5 rounded-2xl border transition-all ${
                      isSelected 
                        ? 'border-violet-500 bg-violet-950/20 shadow-md' 
                        : 'border-violet-900/10 bg-[#0A0F1E]/60 text-slate-400 hover:border-slate-850 hover:text-slate-200'
                    }`}
                  >
                    <div className={`rounded bg-slate-900/80 border border-violet-900/25 flex items-center justify-center mb-3 ${ar.class}`}>
                      <span className="text-[9px] text-slate-500">{ar.label}</span>
                    </div>
                    <div className="text-center">
                      <span className="text-xs font-bold text-slate-200 block">{ar.name}</span>
                      <span className="text-[9px] text-[#8B92A8] block mt-0.5">{ar.label} format</span>
                    </div>
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

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={generating || !selectedCharId || !prompt.trim()}
          className="w-full py-4.5 bg-gradient-to-r from-violet-600 via-[#EC4899] to-cyan-500 hover:opacity-95 text-white font-bold rounded-3xl shadow-[0_0_30px_-10px_rgba(139,92,246,0.4)] transition-all flex items-center justify-center gap-2.5 disabled:opacity-40 disabled:grayscale active:scale-[0.99] text-base"
        >
          {generating ? (
            <>
              <Loader2 className="h-5.5 w-5.5 animate-spin" />
              <span>Formulating Face Map & Rendering...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-5.5 w-5.5 fill-white" />
              <span>Generate Photo Shoot</span>
            </>
          )}
        </button>
      </div>

      {/* Right Column: Output Showcase (5 cols) */}
      <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
        <div className="bg-[#0F1629]/40 border border-violet-900/10 p-6 rounded-3xl backdrop-blur-xl flex flex-col items-center justify-center min-h-[480px] relative overflow-hidden">
          <h3 className="text-sm font-bold text-slate-350 uppercase tracking-wide mb-4 self-start">Output Studio Canvas</h3>

          {generating ? (
            <div className="flex-1 flex flex-col items-center justify-center py-16 space-y-5">
              <div className="relative">
                <div className="w-18 h-18 border-4 border-slate-900 border-t-violet-500 border-r-fuchsia-500 rounded-full animate-spin" />
                <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-cyan-400 h-5.5 w-5.5 animate-pulse" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm font-bold text-slate-200 animate-pulse">Running Morphing Steps...</p>
                <p className="text-xs text-slate-500">Injecting face references & rendering layout</p>
              </div>
            </div>
          ) : outputImage ? (
            <div className="w-full flex-1 flex flex-col items-center justify-center space-y-6">
              
              {/* Output Image Preview with customized aspect class */}
              <div className={`relative overflow-hidden rounded-2xl border border-violet-900/20 bg-slate-950 shadow-2xl group transition-all duration-300 ${getPreviewAspectClass()}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={outputImage} alt="AI Generation Result" className="w-full h-full object-cover" />
                
                {/* Quick overlay badges */}
                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-violet-900/10 text-[9px] font-bold text-violet-400">
                  {aspectRatio} Ratio
                </div>
              </div>

              {/* Action Buttons: Save, Edit, Regenerate */}
              <div className="grid grid-cols-3 gap-3 w-full">
                <a
                  href={outputImage}
                  download="generated-photo.webp"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 px-4 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs rounded-xl shadow-md transition-all text-center active:scale-[0.98]"
                >
                  <Download className="h-3.5 w-3.5" /> Save
                </a>
                <Link
                  href={`/dashboard/edit/${selectedCharId}`}
                  className="flex items-center justify-center gap-1.5 px-4 py-3 bg-[#0A0F1E] hover:bg-slate-900 text-slate-200 font-bold text-xs border border-violet-900/20 rounded-xl transition-all text-center active:scale-[0.98]"
                >
                  <Edit className="h-3.5 w-3.5" /> Edit Model
                </Link>
                <button
                  onClick={handleGenerate}
                  className="flex items-center justify-center gap-1.5 px-4 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl shadow-md transition-all text-center active:scale-[0.98]"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Regenerate
                </button>
              </div>

              {/* Output Metadata metadata */}
              <div className="w-full bg-[#0A0F1E] rounded-2xl p-4 border border-violet-900/10 text-[11px] leading-relaxed space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#8B92A8]">Influencer:</span>
                  <span className="font-semibold text-slate-200">{selectedChar?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8B92A8]">Prompt Category:</span>
                  <span className="font-semibold text-cyan-400 capitalize">{generationMode === 'txt2img' ? 'Text to Image' : generationMode === 'img2img' ? 'Image to Image' : 'Multi Reference'}</span>
                </div>
                <div className="pt-2 border-t border-violet-900/10 text-slate-400 italic">
                  "{prompt}"
                </div>
              </div>

            </div>
          ) : selectedChar ? (
            <div className="w-full flex-1 flex flex-col items-center justify-center space-y-4">
              <div className="w-full aspect-[3/4] bg-slate-950 rounded-2xl border border-violet-900/10 overflow-hidden relative shadow-2xl max-w-[280px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedChar.reference_image_url}
                  alt="Reference placeholder"
                  className="w-full h-full object-cover opacity-60 grayscale-[20%]"
                />
                {/* Reference Photo Badge */}
                <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-violet-900/10 text-[10px] font-bold text-slate-200 tracking-wide">
                  Reference Photo
                </div>
              </div>
              <div className="text-center px-4">
                <p className="text-xs text-slate-500">
                  This is the reference photo of <strong className="text-slate-400">{selectedChar.name}</strong>. Choose settings, adjust prompt, and click generate to render.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500 space-y-3">
              <ImageIcon className="h-10 w-10 text-slate-650" />
              <div className="max-w-[200px] text-xs leading-relaxed">
                Choose a model, adjust scene properties, and tap generate to render the output canvas.
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  )
}

export default function GeneratePage() {
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
          <h1 className="text-3xl font-extrabold text-white tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>Studio Photo Shoot</h1>
          <p className="text-sm text-slate-400 mt-1">Render high-fidelity scenario photos featuring your defined AI Virtual Influencer character.</p>
        </div>

        <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="h-8 w-8 text-violet-500 animate-spin" /></div>}>
          <GenerateContent />
        </Suspense>
      </main>
    </div>
  )
}
