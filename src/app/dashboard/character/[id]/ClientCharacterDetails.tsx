"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Sparkles, ArrowLeft, Coins, Download, Loader2, Sparkle, User, Check, RefreshCw, Zap } from 'lucide-react'
import confetti from 'canvas-confetti'

interface Character {
  id: string
  name: string
  age: number
  skin_tone: string
  body_type: string
  hair_color_style: string
  eye_color: string
  style_vibe: string
  reference_image_url: string
}

interface ClientCharacterDetailsProps {
  character: Character
  initialCredits: number
}

const PRESET_THEMES = [
  {
    id: 'tokyo_street',
    name: 'Cyberpunk Tokyo',
    description: 'Walking through a neon-lit street, futuristic cyberpunk vibe.',
    prompt: 'Walking through a neon-lit Tokyo street, wearing futuristic cyber streetwear, heavy rain, dramatic reflections, cinematic lighting, photorealistic'
  },
  {
    id: 'monaco_yacht',
    name: 'Monaco Yacht',
    description: 'Relaxing on a luxury yacht deck under a bright sun.',
    prompt: 'Relaxing on a luxury yacht deck in Monaco, sunny afternoon, wearing a white linen outfit, holding a cocktail, ocean background, rich lighting, photorealistic'
  },
  {
    id: 'paris_cafe',
    name: 'Parisian Cafe',
    description: 'Cozy autumn afternoon sitting in a French cafe.',
    prompt: 'Sitting in a vintage Parisian cafe, autumn afternoon, wearing a beige cashmere sweater, holding a warm coffee cup, soft focus background, photorealistic'
  },
  {
    id: 'fitness_gym',
    name: 'Fitness Gym',
    description: 'Dramatic lighting inside a premium fitness gym.',
    prompt: 'Posing in a modern industrial gym, intense workout session, wearing athletic activewear, dramatic highlights and shadows, athletic pose, photorealistic'
  },
  {
    id: 'sunset_beach',
    name: 'Sunset Beach',
    description: 'Walking on the sand during golden hour.',
    prompt: 'Walking on a sandy beach during a golden hour sunset, wearing a flowing boho dress, tropical palm trees in background, warm glowing light, photorealistic'
  },
  {
    id: 'fashion_runway',
    name: 'High-Fashion Runway',
    description: 'Spotlight pose at a major fashion show event.',
    prompt: 'Posing at the end of a high-fashion runway, flashing camera lights, wearing designer haute couture dress, luxury event setting, high-contrast lighting, photorealistic'
  }
]

export default function ClientCharacterDetails({ character, initialCredits }: ClientCharacterDetailsProps) {
  const router = useRouter()
  const [credits, setCredits] = useState(initialCredits)
  const [selectedTheme, setSelectedTheme] = useState(PRESET_THEMES[0].id)
  const [customPrompt, setCustomPrompt] = useState('')
  const [useCustom, setUseCustom] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  
  // Pipeline status states to update the user in real time
  const [pipelineState, setPipelineState] = useState<string>('')
  const [outputImage, setOutputImage] = useState<string | null>(null)

  const handleGenerate = async () => {
    setLoading(true)
    setErrorMsg(null)
    setOutputImage(null)
    setPipelineState('Initializing secure connection...')

    if (credits < 1) {
      setErrorMsg("Insufficient credits. Please top up your account.")
      setLoading(false)
      return
    }

    // Determine the prompt to use
    let promptText = ''
    if (useCustom) {
      if (!customPrompt.trim()) {
        setErrorMsg("Please enter a custom prompt scene.")
        setLoading(false)
        return
      }
      promptText = customPrompt
    } else {
      const theme = PRESET_THEMES.find(t => t.id === selectedTheme)
      promptText = theme ? theme.prompt : PRESET_THEMES[0].prompt
    }

    try {
      // Step 1: Prompt Analysis (GPT Vision)
      setPipelineState('Analyzing reference face with ChatGPT Vision...')
      
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          characterId: character.id,
          scenePrompt: promptText,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Generation pipeline failed.')
      }

      setPipelineState('Finalizing results...')
      setOutputImage(result.output_image_url)
      
      // Update local credits
      setCredits(prev => prev - 1)
      
      // Confetti celebration
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      })

      router.refresh()
    } catch (err: any) {
      setErrorMsg(err.message || 'Generation pipeline crashed. Please try again.')
    } finally {
      setLoading(false)
      setPipelineState('')
    }
  }

  return (
    <div className="flex-1 min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-violet-900/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-900/10 blur-[130px] pointer-events-none" />

      {/* Header */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-tr from-violet-600 to-cyan-500 p-2 rounded-xl group-hover:scale-105 transition-all">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-white">AI Influencer Studio</span>
          </Link>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-full">
              <Coins className="h-4.5 w-4.5 text-amber-400" />
              <span className="text-sm font-semibold text-slate-200">
                {credits} <span className="text-slate-500 font-normal">Credits</span>
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Panel */}
      <main className="max-w-7xl mx-auto w-full px-6 py-10 space-y-8 relative z-10 flex-1">
        
        {/* Navigation */}
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-slate-400 hover:text-slate-200 transition-colors gap-2 group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Studio</span>
        </Link>

        {/* Dashboard Title */}
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Generate Images</h1>
          <p className="text-sm text-slate-400">Bring your influencer persona to life in unique visual situations.</p>
        </div>

        {/* Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Panel: Character Card & Generation Options (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Character Info Card */}
            <div className="bg-slate-900/30 border border-slate-900 rounded-3xl p-6 flex flex-col sm:flex-row gap-6 items-center">
              <div className="w-24 h-24 rounded-2xl bg-slate-950 overflow-hidden border border-slate-800 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={character.reference_image_url}
                  alt={character.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="space-y-2 flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <h2 className="text-2xl font-bold text-white tracking-tight">{character.name}</h2>
                  <span className="inline-flex max-w-fit mx-auto sm:mx-0 items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-950 text-violet-300 border border-violet-900">
                    {character.style_vibe}
                  </span>
                </div>
                
                {/* Visual Traits */}
                <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-1.5 text-xs text-slate-400">
                  <span>Age: <strong className="text-slate-300">{character.age}</strong></span>
                  <span>Skin: <strong className="text-slate-300">{character.skin_tone}</strong></span>
                  <span>Body: <strong className="text-slate-300">{character.body_type}</strong></span>
                  <span>Hair: <strong className="text-slate-300">{character.hair_color_style}</strong></span>
                  <span>Eyes: <strong className="text-slate-300">{character.eye_color}</strong></span>
                </div>
              </div>
            </div>

            {/* Config Box */}
            <div className="bg-slate-900/30 border border-slate-900 rounded-3xl p-6 sm:p-8 space-y-6">
              
              {/* Selector Mode */}
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-900">
                <button
                  type="button"
                  onClick={() => setUseCustom(false)}
                  className={`flex-1 py-2 text-center text-xs font-semibold rounded-lg transition-all ${!useCustom ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  Preset Themes
                </button>
                <button
                  type="button"
                  onClick={() => setUseCustom(true)}
                  className={`flex-1 py-2 text-center text-xs font-semibold rounded-lg transition-all ${useCustom ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  Custom Scene Prompt
                </button>
              </div>

              {/* Error Box */}
              {errorMsg && (
                <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-900/60 text-rose-200 text-sm">
                  {errorMsg}
                </div>
              )}

              {/* Theme Presets View */}
              {!useCustom ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {PRESET_THEMES.map((theme) => (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setSelectedTheme(theme.id)}
                      className={`p-4 rounded-2xl text-left border transition-all duration-300 relative overflow-hidden group ${
                        selectedTheme === theme.id
                          ? 'border-violet-500 bg-violet-950/10 text-white'
                          : 'border-slate-900 bg-slate-950/20 hover:border-slate-800 text-slate-400'
                      }`}
                    >
                      <h4 className="font-bold text-sm text-slate-200 group-hover:text-white transition-colors">{theme.name}</h4>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{theme.description}</p>
                      
                      {selectedTheme === theme.id && (
                        <div className="absolute top-2 right-2 bg-violet-500 p-0.5 rounded-full">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                /* Custom Prompt View */
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 tracking-wide uppercase">Custom Scene Description</label>
                  <textarea
                    rows={4}
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="Describe the setting, pose, outfit, and background in detail. e.g., Sitting on a bench in Central Park during spring, reading a book, wearing a modern yellow coat, cherry blossoms blowing in the air."
                    className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-2xl text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all resize-none"
                  />
                  <span className="text-[10px] text-slate-500 leading-relaxed block">
                    Our backend will combine this description with the character's properties (age, skin tone, body shape, etc.) to generate a consistent model pose.
                  </span>
                </div>
              )}

              {/* Generate Trigger */}
              <div className="pt-4 border-t border-slate-900/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-2 text-slate-400 text-xs">
                  <Coins className="h-4 w-4 text-amber-500" />
                  <span>Cost: <strong>1 credit</strong> per generation.</span>
                </div>

                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={loading}
                  className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold rounded-2xl shadow-lg shadow-violet-500/10 hover:shadow-violet-500/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="h-5 w-5 fill-white text-white animate-pulse" />
                      <span>Generate Influencer Image</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>

          {/* Right Panel: Render Outputs (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900/30 border border-slate-900 rounded-3xl p-6 flex flex-col items-center justify-center min-h-[450px] relative overflow-hidden">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wide mb-4 self-start">Generation Output</h3>
              
              {/* Output Image View */}
              {outputImage && (
                <div className="w-full flex-1 flex flex-col items-center justify-center space-y-4">
                  <div className="w-full aspect-[3/4] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden relative shadow-2xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={outputImage}
                      alt="Generated output photo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Download Link */}
                  <a
                    href={outputImage}
                    download={`${character.name.toLowerCase().replace(/\s+/g, '-')}-output.webp`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3.5 border border-slate-800 hover:border-slate-700 bg-slate-900 hover:bg-slate-850 text-slate-200 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
                  >
                    <Download className="h-5 w-5 text-cyan-400" />
                    <span>Download High-Res Image</span>
                  </a>
                </div>
              )}

              {/* Generating Loader View */}
              {loading && !outputImage && (
                <div className="w-full flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
                  {/* Animated Loader Container */}
                  <div className="relative w-28 h-28 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-4 border-violet-500/20 border-t-violet-500 animate-spin" />
                    <div className="absolute inset-2 rounded-full border-4 border-cyan-500/20 border-t-cyan-500 animate-spin-reverse" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
                    <Sparkle className="h-10 w-10 text-white animate-pulse" />
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-extrabold text-slate-200">Creative Engine Working</h4>
                    <p className="text-xs text-slate-400 max-w-[280px] leading-relaxed mx-auto">
                      This takes 15-20 seconds. We are running vision analysis, prompting Flux, and merging the face structure.
                    </p>
                  </div>

                  {/* Realtime pipeline status tracker */}
                  <div className="px-4 py-2 bg-slate-950 border border-slate-900 rounded-full text-slate-500 text-xs font-semibold animate-pulse">
                    {pipelineState}
                  </div>
                </div>
              )}

              {/* Idle View */}
              {!loading && !outputImage && (
                <div className="w-full flex-1 border-2 border-dashed border-slate-800/80 rounded-2xl flex flex-col items-center justify-center p-8 text-center text-slate-500">
                  <div className="p-4 rounded-full bg-slate-950 border border-slate-900 text-slate-600 mb-4">
                    <Sparkles className="h-8 w-8 animate-pulse" />
                  </div>
                  <h4 className="font-bold text-slate-400 mb-1">Awaiting Generation</h4>
                  <p className="text-xs text-slate-500 max-w-[220px] leading-relaxed">
                    Select a theme or write a custom scene, then click generate to create your image.
                  </p>
                </div>
              )}

            </div>
          </div>

        </div>

      </main>
    </div>
  )
}
