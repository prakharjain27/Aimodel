"use client"

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { Sparkles, ArrowLeft, Upload, Loader2, User, HelpCircle, Coins } from 'lucide-react'

export default function CreateCharacterPage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState<number | null>(null)
  
  // Form states
  const [name, setName] = useState('')
  const [age, setAge] = useState(25)
  const [skinTone, setSkinTone] = useState('Fair')
  const [bodyType, setBodyType] = useState('Slim/Athletic')
  const [hairStyle, setHairStyle] = useState('Long wavy blonde')
  const [eyeColor, setEyeColor] = useState('Blue')
  const [faceFeatures, setFaceFeatures] = useState('')
  const [tattoos, setTattoos] = useState('')
  const [birthmarks, setBirthmarks] = useState('')
  const [signaturePose, setSignaturePose] = useState('')
  const [styleVibe, setStyleVibe] = useState('High-fashion street wear')
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    const checkUser = async () => {
      const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'your-supabase-project-url'
      if (isDemoMode) {
        setUser({ id: 'demo-user-123', email: 'demo-user@studio.ai' })
        setCredits(10)
        return
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/')
      } else {
        setUser(user)
        
        // Fetch credits
        const { data: profile } = await supabase
          .from('profiles')
          .select('credits')
          .single()
        setCredits(profile?.credits ?? 0)
      }
    }
    checkUser()
  }, [router, supabase])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      setPreviewUrl(URL.createObjectURL(selectedFile))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    if (!file) {
      setErrorMsg("Please upload a reference face image.")
      return
    }

    setLoading(true)
    setErrorMsg(null)

    try {
      // --- DEMO MODE BYPASS ---
      const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'your-supabase-project-url'
      if (isDemoMode) {
        console.warn("Running in DEMO MODE. Simulating character creation.")
        await new Promise(res => setTimeout(res, 1000))
        router.push('/dashboard')
        router.refresh()
        return
      }
      // ------------------------

      // 1. Upload reference face image to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`
      const filePath = `reference_images/${fileName}`

      const { error: uploadError, data } = await supabase.storage
        .from('influencer-studio')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        })

      if (uploadError) {
        throw new Error(`Upload Error: ${uploadError.message}. Make sure you created a public bucket named "influencer-studio" in Supabase Storage.`)
      }

      // Get public URL of the uploaded image
      const { data: { publicUrl } } = supabase.storage
        .from('influencer-studio')
        .getPublicUrl(filePath)

      // 2. Save character to database
      const { error: dbError } = await supabase
        .from('characters')
        .insert({
          user_id: user.id,
          name,
          age: Number(age),
          skin_tone: skinTone,
          body_type: bodyType,
          hair_color_style: hairStyle,
          eye_color: eyeColor,
          face_features: faceFeatures,
          tattoos,
          birthmarks,
          style_vibe: styleVibe,
          signature_pose: signaturePose,
          reference_image_url: publicUrl
        })

      if (dbError) {
        throw new Error(`Database Error: ${dbError.message}`)
      }

      router.push('/dashboard')
      router.refresh()
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-violet-900/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-900/10 blur-[130px] pointer-events-none" />

      {/* Header */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-tr from-violet-600 to-cyan-500 p-2 rounded-xl group-hover:scale-105 transition-all">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-white">AI Influencer Studio</span>
          </Link>

          {credits !== null && (
            <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-full">
              <Coins className="h-4.5 w-4.5 text-amber-400" />
              <span className="text-sm font-semibold text-slate-200">
                {credits} <span className="text-slate-500 font-normal">Credits</span>
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Form Content */}
      <main className="max-w-4xl mx-auto w-full px-6 py-10 space-y-8 relative z-10 flex-1">
        
        {/* Back Link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-slate-400 hover:text-slate-200 transition-colors gap-2 group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Dashboard</span>
        </Link>

        {/* Title */}
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Create Character</h1>
          <p className="text-sm text-slate-400">Specify the physical features and characteristics of your new virtual model.</p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Left Column: Input Fields (8 cols) */}
          <div className="md:col-span-7 space-y-6 bg-slate-900/30 backdrop-blur-xl border border-slate-900 p-6 sm:p-8 rounded-3xl">
            {errorMsg && (
              <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-900/60 text-rose-200 text-sm">
                {errorMsg}
              </div>
            )}

            {/* Character Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 tracking-wide uppercase">Character Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Mia Jenkins"
                className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-2xl text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
              />
            </div>

            {/* Age Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold text-slate-300 tracking-wide uppercase">
                <span>Age</span>
                <span className="text-violet-400 font-extrabold text-sm">{age} years</span>
              </div>
              <input
                type="range"
                min="18"
                max="60"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full accent-violet-500 h-1.5 bg-slate-850 rounded-lg cursor-pointer"
              />
            </div>

            {/* Two-Column Grid for Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Skin Tone */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 tracking-wide uppercase">Skin Tone</label>
                <select
                  value={skinTone}
                  onChange={(e) => setSkinTone(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-2xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
                >
                  <option value="Fair">Fair/Light</option>
                  <option value="Olive">Olive</option>
                  <option value="Medium/Tan">Medium/Tan</option>
                  <option value="Dark/Deep">Dark/Deep</option>
                  <option value="Golden/Bronze">Golden/Bronze</option>
                </select>
              </div>

              {/* Body Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 tracking-wide uppercase">Body Type</label>
                <select
                  value={bodyType}
                  onChange={(e) => setBodyType(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-2xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
                >
                  <option value="Slim/Athletic">Slim/Athletic</option>
                  <option value="Curvy">Curvy</option>
                  <option value="Muscular/Fit">Muscular/Fit</option>
                  <option value="Petite">Petite</option>
                  <option value="Average">Average</option>
                </select>
              </div>

              {/* Hair Color & Style */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 tracking-wide uppercase">Hair Style & Color</label>
                <input
                  type="text"
                  required
                  value={hairStyle}
                  onChange={(e) => setHairStyle(e.target.value)}
                  placeholder="e.g. Long wavy blonde"
                  className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-2xl text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
                />
              </div>

              {/* Eye Color */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 tracking-wide uppercase">Eye Color</label>
                <select
                  value={eyeColor}
                  onChange={(e) => setEyeColor(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-2xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
                >
                  <option value="Blue">Blue</option>
                  <option value="Green">Green</option>
                  <option value="Brown">Brown</option>
                  <option value="Hazel">Hazel</option>
                  <option value="Grey">Grey</option>
                </select>
              </div>
            </div>

            {/* Additional Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Face Features */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 tracking-wide uppercase">Face Features</label>
                <input
                  type="text"
                  value={faceFeatures}
                  onChange={(e) => setFaceFeatures(e.target.value)}
                  placeholder="e.g. Sharp jawline, dimples"
                  className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-2xl text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
                />
              </div>

              {/* Tattoos */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 tracking-wide uppercase">Tattoos</label>
                <input
                  type="text"
                  value={tattoos}
                  onChange={(e) => setTattoos(e.target.value)}
                  placeholder="e.g. Small rose on left forearm, none"
                  className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-2xl text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
                />
              </div>

              {/* Birthmarks */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 tracking-wide uppercase">Birthmarks & Freckles</label>
                <input
                  type="text"
                  value={birthmarks}
                  onChange={(e) => setBirthmarks(e.target.value)}
                  placeholder="e.g. Light freckles across nose"
                  className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-2xl text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
                />
              </div>

              {/* Signature Pose */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 tracking-wide uppercase">Signature Pose</label>
                <input
                  type="text"
                  value={signaturePose}
                  onChange={(e) => setSignaturePose(e.target.value)}
                  placeholder="e.g. Candid laugh, looking over shoulder"
                  className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-2xl text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
                />
              </div>
            </div>

            {/* Style/Vibe */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 tracking-wide uppercase">Default Style / Vibe</label>
              <input
                type="text"
                required
                value={styleVibe}
                onChange={(e) => setStyleVibe(e.target.value)}
                placeholder="e.g. Cyberpunk techwear, boho beach vibe"
                className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-2xl text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-4 bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold rounded-2xl shadow-lg shadow-violet-500/15 hover:shadow-violet-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.99]"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Uploading Reference & Saving...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  <span>Create AI Influencer</span>
                </>
              )}
            </button>
          </div>

          {/* Right Column: Image Upload & Preview (5 cols) */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-slate-900/30 backdrop-blur-xl border border-slate-900 p-6 rounded-3xl flex flex-col items-center justify-center h-full min-h-[350px] relative">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wide mb-4 self-start">Face Reference Photo</h3>
              
              {previewUrl ? (
                <div className="w-full flex-1 flex flex-col items-center justify-center relative group rounded-2xl overflow-hidden aspect-[3/4]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt="Reference face preview"
                    className="w-full h-full object-cover object-top rounded-2xl"
                  />
                  <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                    <label className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl cursor-pointer hover:bg-slate-800 transition text-sm font-semibold">
                      Change Photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <label className="flex-1 w-full border-2 border-dashed border-slate-800 hover:border-violet-500/50 rounded-2xl flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all hover:bg-slate-900/20 group">
                  <div className="p-4 rounded-full bg-slate-950/60 border border-slate-900 text-slate-400 group-hover:text-violet-400 transition-colors mb-4">
                    <Upload className="h-7 w-7" />
                  </div>
                  <h4 className="font-bold text-slate-300 mb-1">Upload Face Photo</h4>
                  <p className="text-xs text-slate-500 max-w-[200px] leading-relaxed mb-4">
                    Choose a clear, front-facing portrait with good lighting.
                  </p>
                  <span className="px-3.5 py-2 bg-slate-950 border border-slate-900 hover:border-slate-800 text-xs font-bold rounded-xl text-slate-300">
                    Browse File
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}

              {/* Hint Card */}
              <div className="mt-4 flex items-start space-x-2.5 p-3 rounded-xl bg-slate-950/50 border border-slate-900 text-slate-400 text-xs text-left leading-relaxed">
                <HelpCircle className="h-4.5 w-4.5 text-violet-400 shrink-0 mt-0.5" />
                <span>
                  The face swap algorithm maps this photo onto the generated image. Front-facing, high-definition selfies yield the highest quality morphs.
                </span>
              </div>
            </div>
          </div>

        </form>

      </main>
    </div>
  )
}
