"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { Sparkles, ArrowLeft, Upload, Loader2, User, HelpCircle, Coins, Heart, ChevronRight } from 'lucide-react'

// Options Constants
const GENDERS = [
  { id: 'Male', name: 'Male', image: '/male_avatar.png' },
  { id: 'Female', name: 'Female', image: '/female_avatar.png' }
]

const BODY_TYPES = [
  { id: 'Slim/Athletic', label: 'Slim / Athletic', desc: 'Lean and toned silhouette' },
  { id: 'Curvy', label: 'Curvy', desc: 'Soft curves with defined lines' },
  { id: 'Muscular/Fit', label: 'Muscular / Fit', desc: 'Highly defined athletic build' },
  { id: 'Petite', label: 'Petite', desc: 'Shorter and compact frame' },
  { id: 'Average', label: 'Average', desc: 'Standard proportioned build' }
]

const SKIN_TONES = [
  { name: 'Fair', color: '#FDF0D5', class: 'bg-[#FDF0D5]' },
  { name: 'Peach', color: '#F2C6A3', class: 'bg-[#F2C6A3]' },
  { name: 'Olive', color: '#D5A982', class: 'bg-[#D5A982]' },
  { name: 'Bronze/Tan', color: '#9C6644', class: 'bg-[#9C6644]' },
  { name: 'Dark', color: '#472F22', class: 'bg-[#472F22]' }
]

const FACE_SHAPES = [
  { id: 'Oval', label: 'Oval', desc: 'Symmetric, classic proportions' },
  { id: 'Round', label: 'Round', desc: 'Soft angles, equal width/length' },
  { id: 'Square', label: 'Square', desc: 'Strong, defined jawline' },
  { id: 'Heart', label: 'Heart', desc: 'Wide forehead, pointed chin' },
  { id: 'Chiseled', label: 'Chiseled', desc: 'Sharp, angular model bone structure' }
]

const HAIR_STYLES = [
  { id: 'Long Wavy', label: 'Long Wavy' },
  { id: 'Sleek Bob', label: 'Sleek Bob' },
  { id: 'Classic Crop', label: 'Classic Crop' },
  { id: 'Pixie Cut', label: 'Pixie Cut' },
  { id: 'Messy Shag', label: 'Messy Shag' },
  { id: 'Undercut', label: 'Undercut' }
]

const HAIR_COLORS = [
  { name: 'Black', hex: '#09090b' },
  { name: 'Blonde', hex: '#fef08a' },
  { name: 'Chestnut Brown', hex: '#78350f' },
  { name: 'Auburn Red', hex: '#991b1b' },
  { name: 'Platinum Grey', hex: '#cbd5e1' },
  { name: 'Neon Blue', hex: '#06b6d4' }
]

const EYE_SHAPES = [
  { id: 'Almond', label: 'Almond' },
  { id: 'Round', label: 'Round' },
  { id: 'Hooded', label: 'Hooded' },
  { id: 'Monolid', label: 'Monolid' },
  { id: 'Upturned', label: 'Upturned' }
]

const EYE_COLORS = [
  { name: 'Deep Blue', class: 'bg-blue-600' },
  { name: 'Emerald Green', class: 'bg-emerald-600' },
  { name: 'Warm Brown', class: 'bg-amber-800' },
  { name: 'Amber Hazel', class: 'bg-amber-600' },
  { name: 'Steel Grey', class: 'bg-slate-550' }
]

const TATTOOS = [
  { id: 'None', label: 'No Tattoos' },
  { id: 'Full Sleeve', label: 'Full Sleeve Ink' },
  { id: 'Minimalist Geometry', label: 'Minimalist Geometric' },
  { id: 'Cybernetic Glow', label: 'Cybernetic Glow Lines' },
  { id: 'Chest Piece', label: 'Artistic Chest Piece' }
]

const STYLE_VIBES = [
  { id: 'Cyberpunk Techwear', label: 'Cyberpunk Techwear', desc: 'Neon glows, functional dark fabrics, futuristic edge' },
  { id: 'High-Fashion Streetwear', label: 'High-Fashion Streetwear', desc: 'Oversized luxury layers, sneakers, high-end accessories' },
  { id: 'Bohemian Beach', label: 'Bohemian Beach', desc: 'Flowing linen outfits, warm sun-kissed textures' },
  { id: 'Classic Minimalist', label: 'Classic Minimalist', desc: 'Neutral tones, clean structured tailoring, quiet luxury' },
  { id: 'Y2K Retro', label: 'Y2K Retro', desc: 'Bright nostalgic colors, mesh tees, vintage futuristic shades' }
]

export default function CreateCharacterPage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState<number | null>(null)
  
  // Character Creation Visual States
  const [name, setName] = useState('')
  const [gender, setGender] = useState('Female')
  const [age, setAge] = useState(24)
  const [height, setHeight] = useState(170)
  const [skinTone, setSkinTone] = useState('Olive')
  const [bodyType, setBodyType] = useState('Slim/Athletic')
  const [faceShape, setFaceShape] = useState('Chiseled')
  const [hairStyle, setHairStyle] = useState('Long Wavy')
  const [hairColor, setHairColor] = useState('Blonde')
  const [eyeShape, setEyeShape] = useState('Almond')
  const [eyeColor, setEyeColor] = useState('Deep Blue')
  const [tattoos, setTattoos] = useState('None')
  const [faceFeatures, setFaceFeatures] = useState('Sharp jawline, subtle dimples')
  const [birthmarks, setBirthmarks] = useState('Light freckles across the nose bridge')
  const [signaturePose, setSignaturePose] = useState('Looking over shoulder with a soft smile')
  const [styleVibe, setStyleVibe] = useState('Cyberpunk Techwear')
  
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [realtimePrompt, setRealtimePrompt] = useState('')

  // Build realtime prompt
  useEffect(() => {
    const genderTerm = gender.toLowerCase();
    const constructedPrompt = `A high-fidelity photo of ${name || 'an AI Influencer'}, a ${age}-year-old ${genderTerm} model. Physical traits: ${bodyType.toLowerCase()} body type, ${height}cm tall, ${skinTone.toLowerCase()} skin tone, ${faceShape.toLowerCase()} face shape, ${hairColor.toLowerCase()} ${hairStyle.toLowerCase()} hair, and ${eyeColor.toLowerCase()} ${eyeShape.toLowerCase()}-shaped eyes. Distinguishing details: ${faceFeatures}${birthmarks ? `, ${birthmarks}` : ''}, and ${tattoos === 'None' ? 'no visible tattoos' : tattoos.toLowerCase() + ' tattoo'}. Styled in signature ${styleVibe.toLowerCase()} aesthetic, captured in a ${signaturePose.toLowerCase()} pose.`
    setRealtimePrompt(constructedPrompt)
  }, [name, gender, age, height, skinTone, bodyType, faceShape, hairStyle, hairColor, eyeShape, eyeColor, tattoos, faceFeatures, birthmarks, signaturePose, styleVibe])

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
      setErrorMsg("Please upload a reference face image to train the AI influencer.")
      return
    }

    setLoading(true)
    setErrorMsg(null)

    try {
      // --- DEMO MODE BYPASS ---
      const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'your-supabase-project-url'
      if (isDemoMode) {
        console.warn("Running in DEMO MODE. Simulating character creation.")
        await new Promise(res => setTimeout(res, 1500))
        router.push('/dashboard')
        router.refresh()
        return
      }
      // ------------------------

      // 1. Upload reference face image to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`
      const filePath = `reference_images/${fileName}`

      const { error: uploadError } = await supabase.storage
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
          gender,
          age: Number(age),
          height: Number(height),
          skin_tone: skinTone,
          body_type: bodyType,
          face_shape: faceShape,
          hair_color_style: `${hairColor} / ${hairStyle}`,
          eye_color: eyeColor,
          eye_shape: eyeShape,
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
    <div className="flex-1 min-h-screen bg-[#0A0F1E] text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-violet-900/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-900/10 blur-[130px] pointer-events-none" />

      {/* Header */}
      <header className="border-b border-violet-900/20 bg-[#0A0F1E]/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-tr from-violet-600 to-[#EC4899] p-2 rounded-xl group-hover:scale-105 transition-all shadow-md shadow-violet-500/10">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-white" style={{ fontFamily: "'Syne', sans-serif" }}>AI Influencer Studio</span>
          </Link>

          {credits !== null && (
            <div className="flex items-center space-x-2 bg-slate-900/80 border border-violet-900/20 px-3.5 py-1.5 rounded-full">
              <Coins className="h-4.5 w-4.5 text-amber-400" />
              <span className="text-sm font-semibold text-slate-200">
                {credits} <span className="text-slate-500 font-normal">Credits</span>
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Form Content */}
      <main className="max-w-7xl mx-auto w-full px-6 py-10 space-y-8 relative z-10 flex-1">
        
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
          <h1 className="text-3xl font-extrabold text-white tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>Character Creator</h1>
          <p className="text-sm text-slate-400">Assemble the visual traits and personality of your new AI virtual influencer.</p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Visual Options (7 cols) */}
          <div className="lg:col-span-7 space-y-8 bg-[#0F1629]/40 border border-violet-900/10 p-6 sm:p-8 rounded-3xl backdrop-blur-xl">
            {errorMsg && (
              <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-900/60 text-rose-200 text-sm">
                {errorMsg}
              </div>
            )}

            {/* Custom Name */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 tracking-wide uppercase">Save with Custom Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Mia Jenkins"
                className="w-full px-4 py-3 bg-[#0A0F1E] border border-violet-900/20 rounded-2xl text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Gender Selection Cards */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300 tracking-wide uppercase">1. Gender Identity</label>
              <div className="grid grid-cols-2 gap-4">
                {GENDERS.map((g) => {
                  const isSelected = gender === g.id
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setGender(g.id)}
                      className={`relative rounded-2xl overflow-hidden aspect-[4/3] border transition-all duration-300 ${
                        isSelected 
                          ? 'border-violet-500 ring-2 ring-violet-500 shadow-lg shadow-violet-500/10' 
                          : 'border-violet-900/20 opacity-70 hover:opacity-100'
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={g.image} alt={g.name} className="w-full h-full object-cover object-top" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                      <div className="absolute bottom-3 left-3 flex items-center space-x-2">
                        <span className="text-sm font-bold text-white">{g.name}</span>
                        {isSelected && <Sparkles className="h-4 w-4 text-violet-400 animate-pulse" />}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Body Type Cards */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300 tracking-wide uppercase">2. Body Type</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {BODY_TYPES.map((b) => {
                  const isSelected = bodyType === b.id
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setBodyType(b.id)}
                      className={`flex flex-col text-left p-4 rounded-2xl border transition-all ${
                        isSelected 
                          ? 'bg-violet-950/20 border-violet-500 shadow-md' 
                          : 'bg-[#0A0F1E]/60 border-violet-900/10 hover:border-violet-850'
                      }`}
                    >
                      <span className="font-bold text-sm text-slate-200">{b.label}</span>
                      <span className="text-xs text-slate-500 mt-1">{b.desc}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Height Slider & Age */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Height */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-300 tracking-wide uppercase">
                  <span>Height</span>
                  <span className="text-violet-400 font-extrabold text-sm">{height} cm</span>
                </div>
                <input
                  type="range"
                  min="140"
                  max="210"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full accent-violet-500 h-1.5 bg-slate-900 rounded-lg cursor-pointer"
                />
              </div>

              {/* Age Slider */}
              <div className="space-y-2">
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
                  className="w-full accent-violet-500 h-1.5 bg-slate-900 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Skin Tone Color Palette */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300 tracking-wide uppercase">3. Skin Tone Palette</label>
              <div className="flex flex-wrap gap-4 items-center">
                {SKIN_TONES.map((s) => {
                  const isSelected = skinTone === s.name
                  return (
                    <button
                      key={s.name}
                      type="button"
                      onClick={() => setSkinTone(s.name)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-full border transition-all ${
                        isSelected 
                          ? 'border-violet-500 bg-violet-950/20' 
                          : 'border-violet-900/10 bg-[#0A0F1E]/60 hover:border-slate-800'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-full ${s.class} shadow-inner`} />
                      <span className="text-xs font-semibold text-slate-300">{s.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Face Shape Visual Options */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300 tracking-wide uppercase">4. Face Shape</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {FACE_SHAPES.map((f) => {
                  const isSelected = faceShape === f.id
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFaceShape(f.id)}
                      className={`flex flex-col p-3.5 rounded-xl border text-center transition-all ${
                        isSelected 
                          ? 'bg-violet-950/20 border-violet-500' 
                          : 'bg-[#0A0F1E]/60 border-violet-900/10 hover:border-slate-850'
                      }`}
                    >
                      <span className="font-bold text-xs text-slate-200">{f.label}</span>
                      <span className="text-[10px] text-slate-500 mt-1">{f.desc}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Hair Color & Style */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Hair Style */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 tracking-wide uppercase">5. Hair Style</label>
                <select
                  value={hairStyle}
                  onChange={(e) => setHairStyle(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0A0F1E] border border-violet-900/20 rounded-2xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                >
                  {HAIR_STYLES.map((hs) => (
                    <option key={hs.id} value={hs.id}>{hs.label}</option>
                  ))}
                </select>
              </div>

              {/* Hair Color Swatches */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 tracking-wide uppercase">Hair Color</label>
                <div className="flex flex-wrap gap-2.5 pt-1">
                  {HAIR_COLORS.map((hc) => {
                    const isSelected = hairColor === hc.name
                    return (
                      <button
                        key={hc.name}
                        type="button"
                        onClick={() => setHairColor(hc.name)}
                        className={`w-7.5 h-7.5 rounded-full border relative transition-all ${
                          isSelected 
                            ? 'ring-2 ring-violet-500 border-white' 
                            : 'border-transparent hover:scale-105'
                        }`}
                        style={{ backgroundColor: hc.hex }}
                        title={hc.name}
                      >
                        {isSelected && <span className="absolute inset-0 m-auto w-1.5 h-1.5 bg-white rounded-full" />}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Eye Shape & Color */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Eye Shape */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 tracking-wide uppercase">6. Eye Shape</label>
                <select
                  value={eyeShape}
                  onChange={(e) => setEyeShape(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0A0F1E] border border-violet-900/20 rounded-2xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                >
                  {EYE_SHAPES.map((es) => (
                    <option key={es.id} value={es.id}>{es.label}</option>
                  ))}
                </select>
              </div>

              {/* Eye Color */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 tracking-wide uppercase">Eye Color</label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {EYE_COLORS.map((ec) => {
                    const isSelected = eyeColor === ec.name
                    return (
                      <button
                        key={ec.name}
                        type="button"
                        onClick={() => setEyeColor(ec.name)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs transition-all ${
                          isSelected 
                            ? 'border-violet-500 bg-violet-950/20' 
                            : 'border-violet-900/10 bg-[#0A0F1E]/60 hover:border-slate-800'
                        }`}
                      >
                        <span className={`w-3 h-3 rounded-full ${ec.class}`} />
                        <span className="text-[10px] font-medium text-slate-300">{ec.name.split(' ')[1]}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Tattoo Options */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300 tracking-wide uppercase">7. Tattoos & Ink</label>
              <div className="flex flex-wrap gap-2.5">
                {TATTOOS.map((t) => {
                  const isSelected = tattoos === t.id
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTattoos(t.id)}
                      className={`px-4.5 py-2.5 rounded-2xl border text-xs font-bold transition-all ${
                        isSelected 
                          ? 'border-violet-500 bg-violet-950/30 text-white' 
                          : 'border-violet-900/10 bg-[#0A0F1E]/60 text-slate-400 hover:border-violet-900/40 hover:text-slate-200'
                      }`}
                    >
                      {t.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Style/Vibe Mood Board */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300 tracking-wide uppercase">8. Style Vibe / Mood Board</label>
              <div className="space-y-2.5">
                {STYLE_VIBES.map((vib) => {
                  const isSelected = styleVibe === vib.id
                  return (
                    <button
                      key={vib.id}
                      type="button"
                      onClick={() => setStyleVibe(vib.id)}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl border text-left transition-all ${
                        isSelected 
                          ? 'bg-violet-950/20 border-violet-500 shadow-md' 
                          : 'bg-[#0A0F1E]/60 border-violet-900/10 hover:border-slate-800'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <span className="font-bold text-sm text-slate-200 block">{vib.label}</span>
                        <span className="text-xs text-slate-500 block max-w-md leading-relaxed">{vib.desc}</span>
                      </div>
                      <ChevronRight className={`h-4.5 w-4.5 text-violet-400 transition-transform ${isSelected ? 'translate-x-0.5' : 'opacity-30'}`} />
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Custom Description Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 tracking-wide uppercase">Special Face Features</label>
                <input
                  type="text"
                  value={faceFeatures}
                  onChange={(e) => setFaceFeatures(e.target.value)}
                  placeholder="e.g. sharp jawline, light dimples"
                  className="w-full px-4 py-3 bg-[#0A0F1E] border border-violet-900/20 rounded-2xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 tracking-wide uppercase">Birthmarks & Freckles</label>
                <input
                  type="text"
                  value={birthmarks}
                  onChange={(e) => setBirthmarks(e.target.value)}
                  placeholder="e.g. mole under right eye"
                  className="w-full px-4 py-3 bg-[#0A0F1E] border border-violet-900/20 rounded-2xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 tracking-wide uppercase">Signature Pose</label>
                <input
                  type="text"
                  value={signaturePose}
                  onChange={(e) => setSignaturePose(e.target.value)}
                  placeholder="e.g. looking over shoulder"
                  className="w-full px-4 py-3 bg-[#0A0F1E] border border-violet-900/20 rounded-2xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

          </div>

          {/* Right Column: Sticky prompt builder & Avatar references (5 cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            
            {/* Real-time Prompt Builder Panel */}
            <div className="bg-[#0F1629]/60 border border-violet-900/10 p-6 rounded-3xl backdrop-blur-xl space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wide flex items-center gap-2">
                  <Sparkles className="h-4.5 w-4.5 text-violet-400" />
                  Real-time Prompt Builder
                </h3>
                <span className="text-[10px] text-violet-400 font-bold bg-violet-950/40 px-2 py-0.5 rounded-full border border-violet-900/40">Active</span>
              </div>
              <div className="p-4 bg-[#0A0F1E] rounded-2xl border border-violet-900/10">
                <p className="text-xs text-slate-400 leading-relaxed italic">
                  "{realtimePrompt}"
                </p>
              </div>
              <div className="text-[10px] text-slate-500 leading-relaxed">
                This prompt will be dynamically generated and sent to our generation pipeline to maintain visual consistency across all scene generations.
              </div>
            </div>

            {/* Reference Image Upload */}
            <div className="bg-[#0F1629]/40 border border-violet-900/10 p-6 rounded-3xl backdrop-blur-xl flex flex-col justify-center min-h-[320px] relative">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wide mb-4">Face Reference Photo</h3>
              
              {previewUrl ? (
                <div className="w-full flex-1 flex flex-col items-center justify-center relative group rounded-2xl overflow-hidden aspect-[4/3]">
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
                <label className="flex-1 w-full border-2 border-dashed border-violet-900/20 hover:border-violet-500/50 rounded-2xl flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all hover:bg-[#0A0F1E]/40 group">
                  <div className="p-4 rounded-full bg-slate-950/60 border border-slate-900 text-slate-400 group-hover:text-violet-400 transition-colors mb-4">
                    <Upload className="h-7 w-7" />
                  </div>
                  <h4 className="font-bold text-slate-300 mb-1">Upload Face Photo</h4>
                  <p className="text-xs text-slate-500 max-w-[220px] leading-relaxed mb-4">
                    Choose a clear, front-facing portrait with good lighting.
                  </p>
                  <span className="px-3.5 py-2 bg-slate-950 border border-slate-900 hover:border-slate-850 text-xs font-bold rounded-xl text-slate-300">
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
              <div className="mt-4 flex items-start space-x-2.5 p-3 rounded-xl bg-[#0A0F1E] border border-violet-900/10 text-slate-400 text-[10px] leading-relaxed">
                <HelpCircle className="h-4.5 w-4.5 text-violet-400 shrink-0 mt-0.5" />
                <span>
                  The face swap algorithm maps this photo onto the generated image. Front-facing, high-definition selfies yield the highest quality morphs.
                </span>
              </div>
            </div>

            {/* Action Submit */}
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="w-full py-4.5 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-500 hover:opacity-90 text-white font-bold rounded-2xl shadow-lg shadow-violet-500/10 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.99] text-base"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Processing Visual Parameters...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 fill-white" />
                  <span>Save AI Influencer</span>
                </>
              )}
            </button>
          </div>

        </form>

      </main>
    </div>
  )
}
