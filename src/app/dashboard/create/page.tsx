"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { Sparkles, ArrowLeft, Upload, Loader2, HelpCircle, Coins, Check, RefreshCw, Edit, Sparkle } from 'lucide-react'

// Options Constants
const GENDERS = [
  { id: 'Male', name: 'Male AI Model', image: '/male_face.png' },
  { id: 'Female', name: 'Female AI Model', image: '/female_face.png' }
]

const SKIN_TONES = [
  { name: 'Porcelain', description: 'Very fair, cool undertone (Northern European)', hex: '#f6ede4' },
  { name: 'Ivory', description: 'Fair, neutral undertone (European)', hex: '#f3e0d3' },
  { name: 'Sand', description: 'Light, warm undertone (Mediterranean, Latin)', hex: '#eec0a6' },
  { name: 'Beige', description: 'Light medium, neutral (East Asian, Middle Eastern)', hex: '#d5a982' },
  { name: 'Honey', description: 'Medium, warm golden (South Asian, Latino)', hex: '#be8763' },
  { name: 'Wheatish', description: 'Medium brown, warm (Indian, Southeast Asian)', hex: '#a27756' },
  { name: 'Caramel', description: 'Medium dark, warm (Hispanic, Middle Eastern)', hex: '#855b41' },
  { name: 'Bronze', description: 'Dark medium, warm (African, South Asian)', hex: '#6a4632' },
  { name: 'Mahogany', description: 'Dark, cool undertone (African)', hex: '#523629' },
  { name: 'Ebony', description: 'Deep dark (West African)', hex: '#291c1b' }
]

const HAIR_COLORS = [
  { name: 'Black', hex: '#09090b' },
  { name: 'Brown', hex: '#5c3d2e' },
  { name: 'Blonde', hex: '#ecd599' },
  { name: 'Red', hex: '#b83b1d' },
  { name: 'Auburn', hex: '#843b2b' },
  { name: 'White', hex: '#e2e8f0' },
  { name: 'Pink', hex: '#f472b6' },
  { name: 'Blue', hex: '#2563eb' }
]

const EYE_COLORS = [
  { name: 'Brown', gradient: 'radial-gradient(circle at 35% 35%, #78350f 0%, #451a03 70%, #000 100%)' },
  { name: 'Black', gradient: 'radial-gradient(circle at 35% 35%, #1e293b 0%, #0f172a 70%, #000 100%)' },
  { name: 'Blue', gradient: 'radial-gradient(circle at 35% 35%, #3b82f6 0%, #1d4ed8 70%, #000 100%)' },
  { name: 'Green', gradient: 'radial-gradient(circle at 35% 35%, #10b981 0%, #047857 70%, #000 100%)' },
  { name: 'Hazel', gradient: 'radial-gradient(circle at 35% 35%, #d97706 0%, #78350f 70%, #000 100%)' },
  { name: 'Grey', gradient: 'radial-gradient(circle at 35% 35%, #94a3b8 0%, #475569 70%, #000 100%)' }
]

const STYLE_VIBES = [
  { id: 'Cyberpunk Techwear', label: 'Cyberpunk Techwear', desc: 'Neon glows, functional dark fabrics, futuristic edge' },
  { id: 'High-Fashion Streetwear', label: 'High-Fashion Streetwear', desc: 'Oversized luxury layers, sneakers, high-end accessories' },
  { id: 'Bohemian Beach', label: 'Bohemian Beach', desc: 'Flowing linen outfits, warm sun-kissed textures' },
  { id: 'Classic Minimalist', label: 'Classic Minimalist', desc: 'Neutral tones, clean structured tailoring, quiet luxury' },
  { id: 'Y2K Retro', label: 'Y2K Retro', desc: 'Bright nostalgic colors, mesh tees, vintage futuristic shades' }
]

// Tattoo Styles & Sizes
const TATTOO_STYLES = [
  { 
    id: 'Minimalist', 
    label: 'Minimalist', 
    svg: (
      <svg viewBox="0 0 40 40" className="w-8 h-8 stroke-current fill-none" strokeWidth="2">
        <circle cx="20" cy="20" r="4" />
        <line x1="20" y1="8" x2="20" y2="32" />
      </svg>
    )
  },
  { 
    id: 'Floral', 
    label: 'Floral', 
    svg: (
      <svg viewBox="0 0 40 40" className="w-8 h-8 stroke-current fill-none" strokeWidth="2">
        <circle cx="20" cy="20" r="5" />
        <circle cx="20" cy="11" r="4" />
        <circle cx="20" cy="29" r="4" />
        <circle cx="11" cy="20" r="4" />
        <circle cx="29" cy="20" r="4" />
      </svg>
    )
  },
  { 
    id: 'Tribal', 
    label: 'Tribal', 
    svg: (
      <svg viewBox="0 0 40 40" className="w-8 h-8 stroke-current fill-none" strokeWidth="2">
        <path d="M10,20 Q20,10 30,20 Q20,30 10,20 Z M15,20 Q20,15 25,20 Q20,25 15,20 Z" />
      </svg>
    )
  },
  { 
    id: 'Geometric', 
    label: 'Geometric', 
    svg: (
      <svg viewBox="0 0 40 40" className="w-8 h-8 stroke-current fill-none" strokeWidth="2">
        <polygon points="20,8 32,28 8,28" />
        <polygon points="20,32 32,12 8,12" />
      </svg>
    )
  },
  { 
    id: 'Script', 
    label: 'Script', 
    svg: (
      <svg viewBox="0 0 40 40" className="w-8 h-8 stroke-current fill-none" strokeWidth="2">
        <path d="M10,25 C15,10 25,10 30,25 C25,30 15,30 10,25 Z" />
        <path d="M12,20 C18,28 22,28 28,20" />
      </svg>
    )
  },
  { 
    id: 'Japanese', 
    label: 'Japanese', 
    svg: (
      <svg viewBox="0 0 40 40" className="w-8 h-8 stroke-current fill-none" strokeWidth="2">
        <path d="M8,15 Q20,5 32,15 T20,25 T8,15 Z" />
        <path d="M14,25 Q20,18 26,25" />
      </svg>
    )
  },
  { 
    id: 'Realistic', 
    label: 'Realistic', 
    svg: (
      <svg viewBox="0 0 40 40" className="w-8 h-8 stroke-current fill-none" strokeWidth="2">
        <circle cx="20" cy="20" r="12" />
        <circle cx="20" cy="20" r="7" className="fill-slate-700/30" />
      </svg>
    )
  }
]

const TATTOO_SIZES = [
  { id: 'Small', label: 'Small', radius: 'w-4 h-4' },
  { id: 'Medium', label: 'Medium', radius: 'w-6 h-6' },
  { id: 'Large', label: 'Large', radius: 'w-8 h-8' }
]

// Special Face Features
const SPECIAL_FACE_FEATURES = [
  { 
    id: 'Dimples', 
    label: 'Dimples',
    svg: (
      <svg viewBox="0 0 60 60" className="w-10 h-10 stroke-current fill-none" strokeWidth="2">
        <path d="M15,25 Q30,40 45,25" />
        <circle cx="12" cy="22" r="2.5" className="fill-current" />
        <circle cx="48" cy="22" r="2.5" className="fill-current" />
      </svg>
    )
  },
  { 
    id: 'Freckles', 
    label: 'Freckles',
    svg: (
      <svg viewBox="0 0 60 60" className="w-10 h-10 fill-current" strokeWidth="0">
        <circle cx="20" cy="25" r="1.2" />
        <circle cx="24" cy="28" r="1" />
        <circle cx="18" cy="30" r="1.5" />
        <circle cx="38" cy="25" r="1.2" />
        <circle cx="42" cy="28" r="1" />
        <circle cx="36" cy="30" r="1.5" />
        <circle cx="30" cy="32" r="1" />
      </svg>
    )
  },
  { 
    id: 'Sharp Jawline', 
    label: 'Sharp Jaw',
    svg: (
      <svg viewBox="0 0 60 60" className="w-10 h-10 stroke-current fill-none" strokeWidth="2.5">
        <path d="M15,15 L15,35 L30,48 L45,35 L45,15" />
      </svg>
    )
  },
  { 
    id: 'High Cheekbones', 
    label: 'High Cheekbones',
    svg: (
      <svg viewBox="0 0 60 60" className="w-10 h-10 stroke-current fill-none" strokeWidth="2">
        <path d="M15,22 C22,25 28,18 30,18 C32,18 38,25 45,22" />
        <path d="M18,32 Q30,22 42,32" />
      </svg>
    )
  },
  { 
    id: 'Soft Features', 
    label: 'Soft Features',
    svg: (
      <svg viewBox="0 0 60 60" className="w-10 h-10 stroke-current fill-none" strokeWidth="2">
        <path d="M16,16 C30,12 44,16 44,30 C44,44 30,46 30,46 C30,46 16,44 16,30 Z" />
      </svg>
    )
  },
  { 
    id: 'Strong Brow', 
    label: 'Strong Brow',
    svg: (
      <svg viewBox="0 0 60 60" className="w-10 h-10 stroke-current fill-none" strokeWidth="3">
        <path d="M14,20 Q22,14 27,18" />
        <path d="M46,20 Q38,14 33,18" />
      </svg>
    )
  }
]

// Freckle Densities & Locations
const FRECKLE_DENSITIES = [
  { id: 'None', label: 'No Freckles', dots: 0 },
  { id: 'Light', label: 'Light Density', dots: 8 },
  { id: 'Medium', label: 'Medium Density', dots: 20 },
  { id: 'Heavy', label: 'Heavy Density', dots: 45 }
]

const FRECKLE_LOCATIONS = [
  { id: 'Nose', label: 'Nose Bridge' },
  { id: 'Cheeks', label: 'Cheek Bones' },
  { id: 'Full Face', label: 'Scattered Full Face' },
  { id: 'Under Eye', label: 'Under Eyes' }
]

// Signature Poses
const POSES = [
  {
    id: 'Standing confident',
    label: 'Confident Stand',
    svg: (
      <svg viewBox="0 0 100 160" className="w-12 h-18 stroke-current fill-none" strokeWidth="2.5">
        <circle cx="50" cy="22" r="10" />
        <path d="M50,32 L50,85 M35,45 L65,45 M38,45 L38,90 L42,148 M62,45 L62,90 L58,148" />
      </svg>
    )
  },
  {
    id: 'Hand on hip',
    label: 'Hand on Hip',
    svg: (
      <svg viewBox="0 0 100 160" className="w-12 h-18 stroke-current fill-none" strokeWidth="2.5">
        <circle cx="50" cy="22" r="10" />
        <path d="M50,32 L50,85 M35,45 C45,45 32,70 35,80 L44,82 M65,45 L65,95 M38,85 L42,148 M58,85 L58,148" />
      </svg>
    )
  },
  {
    id: 'Looking over shoulder',
    label: 'Over Shoulder',
    svg: (
      <svg viewBox="0 0 100 160" className="w-12 h-18 stroke-current fill-none" strokeWidth="2.5">
        <circle cx="45" cy="22" r="10" />
        <path d="M42,32 Q58,35 55,85 M28,48 L58,44 L54,148 L44,148" />
      </svg>
    )
  },
  {
    id: 'Arms crossed',
    label: 'Arms Crossed',
    svg: (
      <svg viewBox="0 0 100 160" className="w-12 h-18 stroke-current fill-none" strokeWidth="2.5">
        <circle cx="50" cy="22" r="10" />
        <path d="M50,32 L50,85 M32,45 L68,45 M32,45 L42,65 L58,65 L68,45 M40,85 L42,148 M60,85 L58,148" />
      </svg>
    )
  },
  {
    id: 'Candid natural',
    label: 'Candid Natural',
    svg: (
      <svg viewBox="0 0 100 160" className="w-12 h-18 stroke-current fill-none" strokeWidth="2.5">
        <circle cx="53" cy="23" r="10" />
        <path d="M51,33 L45,85 M32,48 L56,42 L52,70 M40,85 L35,145 L38,148 M56,85 L58,145 L54,148" />
      </svg>
    )
  },
  {
    id: 'Power pose',
    label: 'Power Pose',
    svg: (
      <svg viewBox="0 0 100 160" className="w-12 h-18 stroke-current fill-none" strokeWidth="2.5">
        <circle cx="50" cy="22" r="10" />
        <path d="M50,32 L50,85 M22,35 L50,45 L78,35 M30,85 L22,145 L25,148 M70,85 L78,145 L75,148" />
      </svg>
    )
  }
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
  const [bodyType, setBodyType] = useState('Slim')
  const [faceShape, setFaceShape] = useState('Oval')
  const [hairStyle, setHairStyle] = useState('Straight')
  const [hairColor, setHairColor] = useState('Blonde')
  const [eyeShape, setEyeShape] = useState('Almond')
  const [eyeColor, setEyeColor] = useState('Blue')
  const [styleVibe, setStyleVibe] = useState('High-Fashion Streetwear')

  // NEW Visual Selection States replacing Text Inputs
  // 1. Tattoos & Ink
  const [hasTattoos, setHasTattoos] = useState(false)
  const [selectedTattooLocs, setSelectedTattooLocs] = useState<string[]>([])
  const [tattooStyle, setTattooStyle] = useState('Minimalist')
  const [tattooSize, setTattooSize] = useState('Medium')

  // 2. Special Face Features
  const [selectedFaceFeatures, setSelectedFaceFeatures] = useState<string[]>(['Sharp Jawline'])

  // 3. Birthmarks & Freckles
  const [freckleDensity, setFreckleDensity] = useState('Light')
  const [freckleLocations, setFreckleLocations] = useState<string[]>(['Nose', 'Cheeks'])

  // 4. Signature Pose
  const [selectedPose, setSelectedPose] = useState('Looking over shoulder')
  
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [realtimePrompt, setRealtimePrompt] = useState('')

  // DALL-E 3 preview generation states
  const [isPreviewActive, setIsPreviewActive] = useState(false)
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null)
  const [previewLoading, setPreviewLoading] = useState(false)
  const [uploadedRefUrl, setUploadedRefUrl] = useState<string | null>(null)
  const [pipelineState, setPipelineState] = useState('')

  // Build realtime prompt
  useEffect(() => {
    const genderTerm = gender.toLowerCase()
    
    // Format Tattoos description
    const tattooDesc = hasTattoos && selectedTattooLocs.length > 0
      ? `has a ${tattooSize.toLowerCase()} ${tattooStyle.toLowerCase()} style tattoo on the ${selectedTattooLocs.join(', ')}`
      : 'no visible tattoos'

    // Format Face features
    const faceFeaturesDesc = selectedFaceFeatures.length > 0 
      ? `distinguishing features include ${selectedFaceFeatures.join(', ')}` 
      : 'soft features'

    // Format Freckles
    const frecklesDesc = freckleDensity !== 'None' && freckleLocations.length > 0
      ? `, with ${freckleDensity.toLowerCase()} density freckles across the ${freckleLocations.join(', ')}`
      : ''

    const selectedToneObj = SKIN_TONES.find(t => t.name === skinTone)
    const toneString = selectedToneObj 
      ? `${selectedToneObj.name} skin tone (${selectedToneObj.description})` 
      : `${skinTone} skin tone`

    const constructedPrompt = `A high-fidelity photo of ${name || 'an AI Influencer'}, a ${age}-year-old ${genderTerm} model. Physical traits: ${bodyType.toLowerCase()} body type, ${height}cm tall, ${toneString.toLowerCase()}, ${faceShape.toLowerCase()} face shape, ${hairColor.toLowerCase()} ${hairStyle.toLowerCase()} hair, and ${eyeColor.toLowerCase()} ${eyeShape.toLowerCase()}-shaped eyes. Style Details: ${faceFeaturesDesc}${frecklesDesc}, and ${tattooDesc}. Styled in signature ${styleVibe.toLowerCase()} aesthetic, captured in a ${selectedPose.toLowerCase()} pose.`
    setRealtimePrompt(constructedPrompt)
  }, [name, gender, age, height, skinTone, bodyType, faceShape, hairStyle, hairColor, eyeShape, eyeColor, styleVibe, hasTattoos, selectedTattooLocs, tattooStyle, tattooSize, selectedFaceFeatures, freckleDensity, freckleLocations, selectedPose])

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
        let { data: profile } = await supabase
          .from('profiles')
          .select('credits')
          .maybeSingle()

        if (!profile) {
          const { data: newProfile } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              email: user.email,
              credits: 10,
              full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
              username: user.user_metadata?.username || user.email?.split('@')[0] || 'user'
            })
            .select('credits')
            .maybeSingle()
          if (newProfile) {
            profile = newProfile
          }
        }
        setCredits(profile?.credits ?? 10)
      }
    }
    checkUser()
  }, [router, supabase])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      setPreviewUrl(URL.createObjectURL(selectedFile))
      setUploadedRefUrl(null) // Reset cached upload
    }
  }

  const toggleTattooLocation = (loc: string) => {
    if (selectedTattooLocs.includes(loc)) {
      setSelectedTattooLocs(selectedTattooLocs.filter(l => l !== loc))
    } else {
      setSelectedTattooLocs([...selectedTattooLocs, loc])
    }
  }

  const toggleFaceFeature = (feature: string) => {
    if (selectedFaceFeatures.includes(feature)) {
      setSelectedFaceFeatures(selectedFaceFeatures.filter(f => f !== feature))
    } else {
      setSelectedFaceFeatures([...selectedFaceFeatures, feature])
    }
  }

  const toggleFreckleLocation = (loc: string) => {
    if (freckleLocations.includes(loc)) {
      setFreckleLocations(freckleLocations.filter(l => l !== loc))
    } else {
      setFreckleLocations([...freckleLocations, loc])
    }
  }

  const handleGeneratePreview = async () => {
    if (!user) return

    if (!name.trim()) {
      setErrorMsg("Please specify a name for your AI Influencer.")
      const nameInput = document.querySelector('input[type="text"]')
      if (nameInput) {
        nameInput.scrollIntoView({ behavior: 'smooth', block: 'center' })
        ;(nameInput as HTMLInputElement).focus()
      }
      return
    }

    if (!file) {
      setErrorMsg("Please upload a Face Reference Photo.")
      const fileLabel = document.querySelector('label[class*="border-dashed"]')
      if (fileLabel) {
        fileLabel.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }


    setPreviewLoading(true)
    setIsPreviewActive(true)
    setErrorMsg(null)
    setPreviewImageUrl(null)

    try {
      let refUrl = uploadedRefUrl

      if (!refUrl) {
        setPipelineState('Uploading face photo...')
        const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'your-supabase-project-url'
        
        if (isDemoMode) {
          refUrl = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80'
          setUploadedRefUrl(refUrl)
        } else {
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

          const { data: { publicUrl } } = supabase.storage
            .from('influencer-studio')
            .getPublicUrl(filePath)
          
          refUrl = publicUrl
          setUploadedRefUrl(publicUrl)
        }
      }

      setPipelineState('Generating character portrait...')
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          characterId: 'new',
          prompt: realtimePrompt,
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
          face_features: selectedFaceFeatures.join(', ') || 'Soft Features',
          tattoos: hasTattoos && selectedTattooLocs.length > 0 ? `${tattooSize} ${tattooStyle} Ink on ${selectedTattooLocs.join(', ')}` : 'None',
          birthmarks: freckleDensity !== 'None' && freckleLocations.length > 0 ? `${freckleDensity} Freckles on ${freckleLocations.join(', ')}` : 'None',
          style_vibe: styleVibe,
          signature_pose: selectedPose,
          reference_image_url: refUrl
        })
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate preview image.')
      }

      const generatedUrl = data.output_image_url || data.outputImageUrl
      if (!generatedUrl) {
        throw new Error('No image URL returned from the server.')
      }

      setPreviewImageUrl(generatedUrl)
      
      // Update credits locally
      const { data: profile } = await supabase
        .from('profiles')
        .select('credits')
        .single()
      if (profile) {
        setCredits(profile.credits)
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong during generation.')
      setIsPreviewActive(false)
    } finally {
      setPreviewLoading(false)
      setPipelineState('')
    }
  }

  const handleSaveAvatar = async () => {
    if (!user) return

    if (!name.trim()) {
      setErrorMsg("Please specify a name for your AI Influencer.")
      return
    }

    if (!previewImageUrl) {
      setErrorMsg("Please generate a preview first.")
      return
    }

    setLoading(true)
    setErrorMsg(null)

    try {
      const tattoosString = hasTattoos && selectedTattooLocs.length > 0 
        ? `${tattooSize} ${tattooStyle} Ink on ${selectedTattooLocs.join(', ')}` 
        : 'None'

      const faceFeaturesString = selectedFaceFeatures.join(', ') || 'Soft Features'

      const birthmarksString = freckleDensity !== 'None' && freckleLocations.length > 0
        ? `${freckleDensity} Freckles on ${freckleLocations.join(', ')}`
        : 'None'

      // --- DEMO MODE BYPASS ---
      const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'your-supabase-project-url'
      if (isDemoMode) {
        console.warn("Running in DEMO MODE. Simulating character creation.")
        await new Promise(res => setTimeout(res, 1000))
        setShowSuccess(true)
        await new Promise(res => setTimeout(res, 1500))
        router.push('/dashboard')
        router.refresh()
        return
      }
      // ------------------------

      // Save character using the generated previewImageUrl as reference_image_url
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
          face_features: faceFeaturesString,
          tattoos: tattoosString,
          birthmarks: birthmarksString,
          style_vibe: styleVibe,
          signature_pose: selectedPose,
          reference_image_url: previewImageUrl
        })

      if (dbError) {
        throw new Error(`Database Error: ${dbError.message}`)
      }

      setShowSuccess(true)
      await new Promise(res => setTimeout(res, 1500))
      router.push('/dashboard')
      router.refresh()
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleGeneratePreview()
  }

  return (
    <div className="flex-1 min-h-screen bg-[#0A0F1E] text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-violet-955/15 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-955/10 blur-[130px] pointer-events-none" />

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

      {/* Creator Interface */}
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
          <p className="text-sm text-slate-400">Design your virtual AI model with detailed physical traits in a game-like creator.</p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Visual Options (7 cols) */}
          <div className={`lg:col-span-7 space-y-8 bg-[#0F1629]/45 border border-violet-900/10 p-6 sm:p-8 rounded-3xl backdrop-blur-xl transition-all duration-300 ${isPreviewActive ? 'opacity-40 pointer-events-none' : ''}`}>
            {errorMsg && (
              <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-900/60 text-rose-200 text-sm">
                {errorMsg}
              </div>
            )}

            {/* Custom Name */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 tracking-wide uppercase">AI Influencer Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Mia Jenkins"
                className="w-full px-4 py-3 bg-[#0A0F1E] border border-violet-900/20 rounded-2xl text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
              />
            </div>

            {/* GENDER SELECTION */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-350 tracking-wide uppercase">1. Gender Selection</label>
              <div className="grid grid-cols-2 gap-5">
                {GENDERS.map((g) => {
                  const isSelected = gender === g.id
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setGender(g.id)}
                      className={`relative rounded-3xl overflow-hidden aspect-[4/3] border transition-all duration-300 ${
                        isSelected 
                          ? 'border-violet-500/80 shadow-[0_0_20px_rgba(139,92,246,0.3)] ring-2 ring-violet-500/50' 
                          : 'border-violet-900/10 opacity-70 hover:opacity-100 hover:border-violet-900/30'
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={g.image} alt={g.name} className="w-full h-full object-cover object-top" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                      <div className="absolute bottom-3 left-4 right-4 flex justify-between items-center">
                        <span className="text-sm font-bold text-white tracking-wide">{g.name}</span>
                        {isSelected && <div className="bg-violet-500 p-1 rounded-full"><Check className="h-3 w-3 text-white" /></div>}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* FACE SHAPE */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-355 tracking-wide uppercase">2. Face Shape Outline</label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {[
                  {
                    id: 'Oval',
                    svg: (
                      <svg viewBox="0 0 100 100" className="w-12 h-14 stroke-current fill-none" strokeWidth="2.5">
                        <path d="M50,15 C28,15 28,45 28,68 C28,84 38,86 50,86 C62,86 72,84 72,68 C72,45 72,15 50,15 Z" />
                      </svg>
                    )
                  },
                  {
                    id: 'Round',
                    svg: (
                      <svg viewBox="0 0 100 100" className="w-12 h-14 stroke-current fill-none" strokeWidth="2.5">
                        <path d="M50,16 C31,16 30,34 30,52 C30,70 38,80 50,80 C62,80 70,70 70,52 C70,34 69,16 50,16 Z" />
                      </svg>
                    )
                  },
                  {
                    id: 'Square',
                    svg: (
                      <svg viewBox="0 0 100 100" className="w-12 h-14 stroke-current fill-none" strokeWidth="2.5">
                        <path d="M50,16 C31,16 29,26 29,66 C29,81 36,82 50,82 C64,82 71,81 71,66 C71,26 69,16 50,16 Z" />
                      </svg>
                    )
                  },
                  {
                    id: 'Heart',
                    svg: (
                      <svg viewBox="0 0 100 100" className="w-12 h-14 stroke-current fill-none" strokeWidth="2.5">
                        <path d="M50,16 C27,13 25,34 25,54 C25,68 38,79 50,85 C62,79 75,68 75,54 C75,34 73,13 50,16 Z" />
                      </svg>
                    )
                  },
                  {
                    id: 'Diamond',
                    svg: (
                      <svg viewBox="0 0 100 100" className="w-12 h-14 stroke-current fill-none" strokeWidth="2.5">
                        <path d="M50,16 C33,34 26,48 26,60 C26,73 38,83 50,85 C62,83 74,73 74,60 C74,48 67,34 50,16 Z" />
                      </svg>
                    )
                  },
                  {
                    id: 'Oblong',
                    svg: (
                      <svg viewBox="0 0 100 100" className="w-12 h-14 stroke-current fill-none" strokeWidth="2.5">
                        <path d="M50,10 C32,10 32,24 32,74 C32,87 40,89 50,89 C60,89 68,87 68,74 C68,24 68,10 50,10 Z" />
                      </svg>
                    )
                  }
                ].map((f) => {
                  const isSelected = faceShape === f.id
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFaceShape(f.id)}
                      className={`group flex flex-col items-center justify-between p-3 rounded-2xl border transition-all ${
                        isSelected 
                          ? 'border-violet-500 bg-violet-950/20 text-violet-400' 
                          : 'border-violet-900/10 bg-[#0A0F1E]/60 text-slate-500 hover:border-slate-800 hover:text-slate-350'
                      }`}
                    >
                      <div className="mb-2 transition-transform group-hover:scale-105">{f.svg}</div>
                      <span className="text-[10px] font-bold tracking-wide">{f.id}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* SKIN TONE */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-350 tracking-wide uppercase">3. Skin Tone Swatch</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {SKIN_TONES.map((s) => {
                  const isSelected = skinTone === s.name
                  return (
                    <button
                      key={s.name}
                      type="button"
                      onClick={() => setSkinTone(s.name)}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                        isSelected 
                          ? 'border-violet-500 bg-violet-950/20 text-violet-400' 
                          : 'border-violet-900/10 bg-[#0A0F1E]/60 text-slate-500 hover:border-slate-800 hover:text-slate-350'
                      }`}
                      title={s.description}
                    >
                      <div
                        className="w-10 h-10 rounded-full relative shadow-lg border border-slate-900/40 mb-2 transition-transform"
                        style={{ backgroundColor: s.hex }}
                      >
                        {isSelected && (
                          <div className="absolute inset-0 m-auto w-6 h-6 rounded-full bg-slate-950/70 flex items-center justify-center border border-white/20">
                            <Check className="h-3.5 w-3.5 text-white" />
                          </div>
                        )}
                      </div>
                      <span className="text-[11px] font-bold tracking-wide">{s.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* HAIR COLOR */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-355 tracking-wide uppercase">4. Hair Color Shade</label>
              <div className="flex flex-wrap gap-3">
                {HAIR_COLORS.map((hc) => {
                  const isSelected = hairColor === hc.name
                  return (
                    <button
                      key={hc.name}
                      type="button"
                      onClick={() => setHairColor(hc.name)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-full border transition-all ${
                        isSelected 
                          ? 'border-violet-500 bg-violet-950/20' 
                          : 'border-violet-900/10 bg-[#0A0F1E]/60 hover:border-slate-800'
                      }`}
                    >
                      <span 
                        className="w-5 h-5 rounded-full border border-slate-955/30 flex items-center justify-center relative" 
                        style={{ backgroundColor: hc.hex }}
                      >
                        {isSelected && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </span>
                      <span className="text-[10px] font-bold text-slate-300">{hc.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* HAIR STYLE */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-355 tracking-wide uppercase">5. Hair Style Outline</label>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5">
                {[
                  {
                    id: 'Straight',
                    svg: (
                      <svg viewBox="0 0 100 100" className="w-10 h-10 stroke-current fill-none" strokeWidth="2.5">
                        <path d="M50,15 C30,15 25,30 25,60 M75,60 C75,30 70,15 50,15" />
                        <line x1="35" y1="35" x2="35" y2="75" />
                        <line x1="50" y1="20" x2="50" y2="80" />
                        <line x1="65" y1="35" x2="65" y2="75" />
                      </svg>
                    )
                  },
                  {
                    id: 'Wavy',
                    svg: (
                      <svg viewBox="0 0 100 100" className="w-10 h-10 stroke-current fill-none" strokeWidth="2.5">
                        <path d="M50,15 C30,15 25,30 25,50 C25,65 30,70 30,80" />
                        <path d="M75,50 C75,30 70,15 50,15 C50,15 55,40 55,55 C55,70 50,75 50,80" />
                        <path d="M40,30 Q35,45 42,60 T35,80" />
                      </svg>
                    )
                  },
                  {
                    id: 'Curly',
                    svg: (
                      <svg viewBox="0 0 100 100" className="w-10 h-10 stroke-current fill-none" strokeWidth="2.5">
                        <path d="M50,15 C35,15 32,25 32,35 Q32,45 35,48 T32,60 Q32,70 36,75" />
                        <path d="M68,35 Q68,45 65,48 T68,60 Q68,70 64,75" />
                      </svg>
                    )
                  },
                  {
                    id: 'Bun',
                    svg: (
                      <svg viewBox="0 0 100 100" className="w-10 h-10 stroke-current fill-none" strokeWidth="2.5">
                        <circle cx="50" cy="22" r="11" />
                        <path d="M50,36 C32,36 28,45 28,70 C28,82 35,84 50,84 C65,84 72,82 72,70 Z" />
                      </svg>
                    )
                  },
                  {
                    id: 'Ponytail',
                    svg: (
                      <svg viewBox="0 0 100 100" className="w-10 h-10 stroke-current fill-none" strokeWidth="2.5">
                        <path d="M50,20 C32,20 28,30 28,55 C28,68 38,70 50,70 C62,70 72,68 72,55 Z" />
                        <path d="M50,68 C50,68 62,75 58,90 C54,80 50,75 50,68 Z" />
                      </svg>
                    )
                  },
                  {
                    id: 'Short',
                    svg: (
                      <svg viewBox="0 0 100 100" className="w-10 h-10 stroke-current fill-none" strokeWidth="2.5">
                        <path d="M50,18 C35,18 32,25 32,45 C38,40 42,42 50,38 C58,42 62,40 68,45 C68,25 65,18 50,18 Z" />
                      </svg>
                    )
                  },
                  {
                    id: 'Bob',
                    svg: (
                      <svg viewBox="0 0 100 100" className="w-10 h-10 stroke-current fill-none" strokeWidth="2.5">
                        <path d="M50,18 C30,18 25,30 25,62 M75,62 C75,30 70,18 50,18" />
                        <path d="M25,50 C30,55 35,50 35,62" />
                      </svg>
                    )
                  }
                ].map((h) => {
                  const isSelected = hairStyle === h.id
                  return (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => setHairStyle(h.id)}
                      className={`group flex flex-col items-center justify-between p-2 rounded-2xl border transition-all ${
                        isSelected 
                          ? 'border-violet-500 bg-violet-950/20 text-violet-400' 
                          : 'border-violet-900/10 bg-[#0A0F1E]/60 text-slate-500 hover:border-slate-800 hover:text-slate-350'
                      }`}
                    >
                      <div className="mb-1.5 transition-transform group-hover:scale-105">{h.svg}</div>
                      <span className="text-[9px] font-bold tracking-wide">{h.id}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* EYE COLOR */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-355 tracking-wide uppercase">6. Eye Color Iris</label>
              <div className="flex flex-wrap gap-3">
                {EYE_COLORS.map((ec) => {
                  const isSelected = eyeColor === ec.name
                  return (
                    <button
                      key={ec.name}
                      type="button"
                      onClick={() => setEyeColor(ec.name)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-2xl border transition-all ${
                        isSelected 
                          ? 'border-violet-500 bg-violet-950/20' 
                          : 'border-violet-900/10 bg-[#0A0F1E]/60 hover:border-slate-800'
                      }`}
                    >
                      <span 
                        className="w-5 h-5 rounded-full border border-slate-900/80 shadow-md flex items-center justify-center"
                        style={{ background: ec.gradient }}
                      >
                        {isSelected && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </span>
                      <span className="text-[10px] font-bold text-slate-300">{ec.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* EYE SHAPE */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-355 tracking-wide uppercase">7. Eye Shape Outline</label>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                {[
                  {
                    id: 'Almond',
                    svg: (
                      <svg viewBox="0 0 100 60" className="w-14 h-8 stroke-current fill-none" strokeWidth="2.5">
                        <path d="M15,30 C30,10 70,10 85,30 C70,50 30,50 15,30 Z" />
                        <circle cx="50" cy="30" r="10" className="fill-slate-800/40" />
                      </svg>
                    )
                  },
                  {
                    id: 'Round',
                    svg: (
                      <svg viewBox="0 0 100 60" className="w-14 h-8 stroke-current fill-none" strokeWidth="2.5">
                        <path d="M15,30 C28,5 72,5 85,30 C72,55 28,55 15,30 Z" />
                        <circle cx="50" cy="30" r="12" className="fill-slate-800/40" />
                      </svg>
                    )
                  },
                  {
                    id: 'Hooded',
                    svg: (
                      <svg viewBox="0 0 100 60" className="w-14 h-8 stroke-current fill-none" strokeWidth="2.5">
                        <path d="M15,30 C30,10 70,10 85,30 C70,50 30,50 15,30 Z" />
                        <path d="M18,22 C32,8 68,8 82,22" />
                        <circle cx="50" cy="30" r="9" className="fill-slate-800/40" />
                      </svg>
                    )
                  },
                  {
                    id: 'Monolid',
                    svg: (
                      <svg viewBox="0 0 100 60" className="w-14 h-8 stroke-current fill-none" strokeWidth="2.5">
                        <path d="M15,30 C32,18 68,18 85,30 C68,45 32,45 15,30 Z" />
                        <circle cx="50" cy="31" r="10" className="fill-slate-800/40" />
                      </svg>
                    )
                  },
                  {
                    id: 'Upturned',
                    svg: (
                      <svg viewBox="0 0 100 60" className="w-14 h-8 stroke-current fill-none" strokeWidth="2.5">
                        <path d="M15,35 C30,12 68,8 85,25 C68,48 30,52 15,35 Z" />
                        <circle cx="50" cy="30" r="10" className="fill-slate-800/40" />
                      </svg>
                    )
                  },
                  {
                    id: 'Downturned',
                    svg: (
                      <svg viewBox="0 0 100 60" className="w-14 h-8 stroke-current fill-none" strokeWidth="2.5">
                        <path d="M15,25 C30,8 68,12 85,35 C68,52 30,48 15,25 Z" />
                        <circle cx="50" cy="30" r="10" className="fill-slate-800/40" />
                      </svg>
                    )
                  }
                ].map((e) => {
                  const isSelected = eyeShape === e.id
                  return (
                    <button
                      key={e.id}
                      type="button"
                      onClick={() => setEyeShape(e.id)}
                      className={`group flex flex-col items-center justify-between p-2.5 rounded-2xl border transition-all ${
                        isSelected 
                          ? 'border-violet-500 bg-violet-950/20 text-violet-400' 
                          : 'border-violet-900/10 bg-[#0A0F1E]/60 text-slate-500 hover:border-slate-800 hover:text-slate-350'
                      }`}
                    >
                      <div className="mb-2 transition-transform group-hover:scale-105">{e.svg}</div>
                      <span className="text-[10px] font-bold tracking-wide">{e.id}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* BODY TYPE */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-355 tracking-wide uppercase">8. Torso / Body Silhouette</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                  {
                    id: 'Slim',
                    label: 'Slim',
                    maleSvg: (
                      <svg viewBox="0 0 100 150" className="w-10 h-16 stroke-current fill-none" strokeWidth="2.5">
                        <circle cx="50" cy="20" r="10" />
                        <path d="M50,30 L50,45 M40,45 L60,45 M43,45 L43,90 L43,140 M57,45 L57,90 L57,140" />
                      </svg>
                    ),
                    femaleSvg: (
                      <svg viewBox="0 0 100 150" className="w-10 h-16 stroke-current fill-none" strokeWidth="2.5">
                        <circle cx="50" cy="20" r="9" />
                        <path d="M50,29 L50,42 M41,42 C45,45 44,70 43,90 L41,140 M59,42 C55,45 56,70 57,90 L59,140 M41,42 L59,42" />
                      </svg>
                    )
                  },
                  {
                    id: 'Athletic',
                    label: 'Athletic',
                    maleSvg: (
                      <svg viewBox="0 0 100 150" className="w-10 h-16 stroke-current fill-none" strokeWidth="2.5">
                        <circle cx="50" cy="20" r="10" />
                        <path d="M50,30 L50,45 M36,45 L64,45 M38,45 L43,75 L42,140 M62,45 L57,75 L58,140" />
                      </svg>
                    ),
                    femaleSvg: (
                      <svg viewBox="0 0 100 150" className="w-10 h-16 stroke-current fill-none" strokeWidth="2.5">
                        <circle cx="50" cy="20" r="9" />
                        <path d="M50,29 L50,42 M38,42 Q48,47 43,80 L42,140 M62,42 Q52,47 57,80 L58,140 M38,42 L62,42" />
                      </svg>
                    )
                  },
                  {
                    id: 'Curvy',
                    label: gender === 'Male' ? 'Muscular' : 'Curvy',
                    maleSvg: (
                      <svg viewBox="0 0 100 150" className="w-10 h-16 stroke-current fill-none" strokeWidth="2.5">
                        <circle cx="50" cy="20" r="10.5" />
                        <path d="M50,30.5 L50,47 M32,47 L68,47 M35,47 L41,80 L40,140 M65,47 L59,80 L60,140" />
                        <path d="M42,55 Q50,60 58,55" />
                      </svg>
                    ),
                    femaleSvg: (
                      <svg viewBox="0 0 100 150" className="w-10 h-16 stroke-current fill-none" strokeWidth="2.5">
                        <circle cx="50" cy="20" r="9" />
                        <path d="M50,29 L50,42 M37,42 C45,45 38,72 44,92 L41,140 M63,42 C55,45 62,72 56,92 L59,140" />
                      </svg>
                    )
                  },
                  {
                    id: 'Plus size',
                    label: 'Plus Size',
                    maleSvg: (
                      <svg viewBox="0 0 100 150" className="w-10 h-16 stroke-current fill-none" strokeWidth="2.5">
                        <circle cx="50" cy="20" r="10" />
                        <path d="M50,30 L50,45 M38,45 L62,45 M40,45 Q36,90 42,140 M60,45 Q64,90 58,140" />
                      </svg>
                    ),
                    femaleSvg: (
                      <svg viewBox="0 0 100 150" className="w-10 h-16 stroke-current fill-none" strokeWidth="2.5">
                        <circle cx="50" cy="20" r="9" />
                        <path d="M50,29 L50,42 M38,42 C42,45 35,90 44,140 M62,42 C58,45 65,90 56,140" />
                      </svg>
                    )
                  },
                  {
                    id: 'Petite',
                    label: 'Petite',
                    maleSvg: (
                      <svg viewBox="0 0 100 150" className="w-10 h-14 stroke-current fill-none" strokeWidth="2.5">
                        <circle cx="50" cy="25" r="9.5" />
                        <path d="M50,34.5 L50,48 M40,48 L60,48 M42,48 L42,130 M58,48 L58,130" />
                      </svg>
                    ),
                    femaleSvg: (
                      <svg viewBox="0 0 100 150" className="w-10 h-14 stroke-current fill-none" strokeWidth="2.5">
                        <circle cx="50" cy="24" r="8.5" />
                        <path d="M50,32.5 L50,45 M41,45 C44,48 43,72 43,90 L41,130 M59,45 C56,48 57,72 57,90 L59,130" />
                      </svg>
                    )
                  }
                ].map((b) => {
                  const isSelected = bodyType === b.id
                  const activeSvg = gender === 'Male' ? b.maleSvg : b.femaleSvg
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setBodyType(b.id)}
                      className={`group flex flex-col items-center justify-between p-3 rounded-2xl border transition-all ${
                        isSelected 
                          ? 'border-violet-500 bg-violet-950/20 text-violet-400' 
                          : 'border-violet-900/10 bg-[#0A0F1E]/60 text-slate-500 hover:border-slate-800 hover:text-slate-350'
                      }`}
                    >
                      <div className="mb-2 transition-transform group-hover:scale-105">{activeSvg}</div>
                      <span className="text-[10px] font-bold tracking-wide">{b.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* STYLE VIBE */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-355 tracking-wide uppercase">9. Style/Vibe Mood Board</label>
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
                      {isSelected && <div className="bg-violet-500 p-0.5 rounded-full text-white"><Check className="h-3 w-3" /></div>}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* NEW ADDITIONS - 10. TATTOOS & INK INTERACTIVE MAP */}
            <div className="space-y-4 bg-[#0A0F1E]/40 border border-violet-900/10 p-5 rounded-3xl">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-300 tracking-wide uppercase">10. Tattoos & Ink Configuration</label>
                <div className="flex items-center bg-[#050B18] border border-violet-900/20 rounded-xl p-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setHasTattoos(false)
                      setSelectedTattooLocs([])
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${!hasTattoos ? 'bg-rose-900/40 text-rose-200' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    No Tattoos
                  </button>
                  <button
                    type="button"
                    onClick={() => setHasTattoos(true)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${hasTattoos ? 'bg-violet-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    Yes, Add Tattoos
                  </button>
                </div>
              </div>

              {hasTattoos && (
                <div className="space-y-5 pt-2 animate-fade-in">
                  
                  {/* Interactive Body Silhouette click map */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Select Tattoo Locations:</span>
                    <div className="grid grid-cols-2 gap-4">
                      
                      {/* Front View */}
                      <div className="relative border border-violet-900/10 bg-[#050B18] rounded-2xl p-4 flex flex-col items-center justify-center min-h-[220px]">
                        <span className="absolute top-2 text-[9px] text-slate-500 font-bold uppercase tracking-wider">Front View</span>
                        <svg viewBox="0 0 100 180" className="w-20 h-40 stroke-violet-900/20 fill-violet-900/5" strokeWidth="1.5">
                          <circle cx="50" cy="22" r="10" />
                          <path d="M50,32 L50,85 M35,45 L65,45 M38,45 L38,90 L42,148 M62,45 L62,90 L58,148" />
                        </svg>

                        {/* Interactive hotspot labels */}
                        <div className="absolute inset-0 w-full h-full pointer-events-none">
                          {/* Neck */}
                          <button
                            type="button"
                            onClick={() => toggleTattooLocation('Neck')}
                            className={`absolute pointer-events-auto top-[23%] left-[48%] -translate-x-1/2 -translate-y-1/2 rounded-full border text-[9px] font-bold flex items-center justify-center shadow-md transition-all ${selectedTattooLocs.includes('Neck') ? 'bg-violet-600 text-white border-violet-400 w-9 h-5' : 'bg-slate-900 text-slate-500 border-slate-800 w-8 h-4'}`}
                          >
                            Neck
                          </button>
                          {/* Chest */}
                          <button
                            type="button"
                            onClick={() => toggleTattooLocation('Chest')}
                            className={`absolute pointer-events-auto top-[34%] left-[48%] -translate-x-1/2 -translate-y-1/2 rounded-full border text-[9px] font-bold flex items-center justify-center shadow-md transition-all ${selectedTattooLocs.includes('Chest') ? 'bg-violet-600 text-white border-violet-400 w-9 h-5' : 'bg-slate-900 text-slate-500 border-slate-800 w-9 h-4'}`}
                          >
                            Chest
                          </button>
                          {/* Left Arm */}
                          <button
                            type="button"
                            onClick={() => toggleTattooLocation('Left Arm')}
                            className={`absolute pointer-events-auto top-[42%] left-[12%] -translate-y-1/2 rounded-full border text-[8px] font-bold flex items-center justify-center shadow-md transition-all ${selectedTattooLocs.includes('Left Arm') ? 'bg-violet-600 text-white border-violet-400 w-11 h-5' : 'bg-slate-900 text-slate-500 border-slate-800 w-10 h-4'}`}
                          >
                            L Arm
                          </button>
                          {/* Right Arm */}
                          <button
                            type="button"
                            onClick={() => toggleTattooLocation('Right Arm')}
                            className={`absolute pointer-events-auto top-[42%] right-[12%] -translate-y-1/2 rounded-full border text-[8px] font-bold flex items-center justify-center shadow-md transition-all ${selectedTattooLocs.includes('Right Arm') ? 'bg-violet-600 text-white border-violet-400 w-11 h-5' : 'bg-slate-900 text-slate-500 border-slate-800 w-10 h-4'}`}
                          >
                            R Arm
                          </button>
                          {/* Left Wrist */}
                          <button
                            type="button"
                            onClick={() => toggleTattooLocation('Left Wrist')}
                            className={`absolute pointer-events-auto top-[63%] left-[8%] -translate-y-1/2 rounded-full border text-[7.5px] font-bold flex items-center justify-center shadow-md transition-all ${selectedTattooLocs.includes('Left Wrist') ? 'bg-violet-600 text-white border-violet-400 w-11 h-5' : 'bg-slate-900 text-slate-500 border-slate-800 w-10 h-4'}`}
                          >
                            L Wrist
                          </button>
                          {/* Right Wrist */}
                          <button
                            type="button"
                            onClick={() => toggleTattooLocation('Right Wrist')}
                            className={`absolute pointer-events-auto top-[63%] right-[8%] -translate-y-1/2 rounded-full border text-[7.5px] font-bold flex items-center justify-center shadow-md transition-all ${selectedTattooLocs.includes('Right Wrist') ? 'bg-violet-600 text-white border-violet-400 w-11 h-5' : 'bg-slate-900 text-slate-500 border-slate-800 w-10 h-4'}`}
                          >
                            R Wrist
                          </button>
                          {/* Thigh */}
                          <button
                            type="button"
                            onClick={() => toggleTattooLocation('Thigh')}
                            className={`absolute pointer-events-auto top-[66%] left-[48%] -translate-x-1/2 -translate-y-1/2 rounded-full border text-[9px] font-bold flex items-center justify-center shadow-md transition-all ${selectedTattooLocs.includes('Thigh') ? 'bg-violet-600 text-white border-violet-400 w-10 h-5' : 'bg-slate-900 text-slate-500 border-slate-800 w-9 h-4'}`}
                          >
                            Thigh
                          </button>
                        </div>
                      </div>

                      {/* Back View */}
                      <div className="relative border border-violet-900/10 bg-[#050B18] rounded-2xl p-4 flex flex-col items-center justify-center min-h-[220px]">
                        <span className="absolute top-2 text-[9px] text-slate-500 font-bold uppercase tracking-wider">Back View</span>
                        <svg viewBox="0 0 100 180" className="w-20 h-40 stroke-violet-900/20 fill-violet-900/5" strokeWidth="1.5">
                          <circle cx="50" cy="22" r="10" />
                          <path d="M50,32 L50,85 M35,45 L65,45 M38,45 L38,90 L42,148 M62,45 L62,90 L58,148" />
                          {/* back details */}
                          <line x1="50" y1="45" x2="50" y2="78" />
                        </svg>

                        {/* Interactive hotspot labels */}
                        <div className="absolute inset-0 w-full h-full pointer-events-none">
                          {/* Back */}
                          <button
                            type="button"
                            onClick={() => toggleTattooLocation('Back')}
                            className={`absolute pointer-events-auto top-[36%] left-[48%] -translate-x-1/2 -translate-y-1/2 rounded-full border text-[9px] font-bold flex items-center justify-center shadow-md transition-all ${selectedTattooLocs.includes('Back') ? 'bg-violet-600 text-white border-violet-400 w-10 h-5' : 'bg-slate-900 text-slate-500 border-slate-800 w-9 h-4'}`}
                          >
                            Back
                          </button>
                          {/* Ankle */}
                          <button
                            type="button"
                            onClick={() => toggleTattooLocation('Ankle')}
                            className={`absolute pointer-events-auto top-[86%] left-[48%] -translate-x-1/2 -translate-y-1/2 rounded-full border text-[9px] font-bold flex items-center justify-center shadow-md transition-all ${selectedTattooLocs.includes('Ankle') ? 'bg-violet-600 text-white border-violet-400 w-10 h-5' : 'bg-slate-900 text-slate-500 border-slate-800 w-9 h-4'}`}
                          >
                            Ankle
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Tattoo Style Cards */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Select Tattoo Style:</span>
                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5">
                      {TATTOO_STYLES.map((t) => {
                        const isSelected = tattooStyle === t.id
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => setTattooStyle(t.id)}
                            className={`group flex flex-col items-center justify-between p-2 rounded-2xl border transition-all ${
                              isSelected 
                                ? 'border-violet-500 bg-violet-950/20 text-violet-400' 
                                : 'border-violet-900/10 bg-[#0A0F1E]/60 text-slate-500 hover:border-slate-800'
                            }`}
                          >
                            <div className="mb-1 transition-transform group-hover:scale-105">{t.svg}</div>
                            <span className="text-[8px] font-bold tracking-wide text-center">{t.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Tattoo Sizes (visual size comparison) */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Select Size:</span>
                    <div className="flex gap-4">
                      {TATTOO_SIZES.map((ts) => {
                        const isSelected = tattooSize === ts.id
                        return (
                          <button
                            key={ts.id}
                            type="button"
                            onClick={() => setTattooSize(ts.id)}
                            className={`flex-1 flex items-center justify-center gap-3 p-3.5 rounded-2xl border transition-all ${
                              isSelected 
                                ? 'border-violet-500 bg-violet-950/20' 
                                : 'border-violet-900/10 bg-[#0A0F1E]/60 hover:border-slate-800'
                            }`}
                          >
                            {/* visual indicator circle */}
                            <div className="flex items-center justify-center w-8 h-8 rounded bg-[#050B18]">
                              <span className={`bg-violet-400 rounded-full ${ts.radius}`} />
                            </div>
                            <span className="text-xs font-bold text-slate-300">{ts.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                </div>
              )}
            </div>

            {/* NEW ADDITIONS - 11. SPECIAL FACE FEATURES */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-355 tracking-wide uppercase">11. Special Face Features</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {SPECIAL_FACE_FEATURES.map((feature) => {
                  const isSelected = selectedFaceFeatures.includes(feature.id)
                  return (
                    <button
                      key={feature.id}
                      type="button"
                      onClick={() => toggleFaceFeature(feature.id)}
                      className={`group flex flex-col items-center justify-between p-3.5 rounded-2xl border text-center transition-all ${
                        isSelected 
                          ? 'border-violet-500 bg-violet-950/20 text-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.15)]' 
                          : 'border-violet-900/10 bg-[#0A0F1E]/60 text-slate-500 hover:border-slate-850 hover:text-slate-350'
                      }`}
                    >
                      <div className="mb-2 transition-transform group-hover:scale-105">{feature.svg}</div>
                      <span className="text-[10px] font-bold tracking-wide">{feature.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* NEW ADDITIONS - 12. BIRTHMARKS & FRECKLES */}
            <div className="space-y-4 bg-[#0A0F1E]/40 border border-violet-900/10 p-5 rounded-3xl space-y-4">
              <span className="text-xs font-bold text-slate-300 tracking-wide uppercase block">12. Birthmarks & Freckles Density</span>
              
              {/* Density face visuals selection */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {FRECKLE_DENSITIES.map((fd) => {
                  const isSelected = freckleDensity === fd.id
                  return (
                    <button
                      key={fd.id}
                      type="button"
                      onClick={() => {
                        setFreckleDensity(fd.id)
                        if (fd.id === 'None') setFreckleLocations([])
                      }}
                      className={`flex flex-col items-center justify-between p-3.5 rounded-2xl border transition-all ${
                        isSelected 
                          ? 'border-violet-500 bg-violet-950/20 text-violet-400' 
                          : 'border-violet-900/10 bg-[#0A0F1E]/60 text-slate-500 hover:border-slate-800'
                      }`}
                    >
                      {/* Face illustration with dot counts based on density */}
                      <div className="relative w-12 h-12 mb-2 flex items-center justify-center stroke-slate-500 fill-none">
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          <circle cx="50" cy="50" r="32" strokeWidth="2.5" />
                          <circle cx="50" cy="74" r="8" strokeWidth="2" />
                          {/* nose */}
                          <line x1="50" y1="44" x2="50" y2="52" strokeWidth="2.5" />
                          {/* density dots */}
                          {fd.dots >= 8 && (
                            <>
                              <circle cx="36" cy="56" r="1.5" className="fill-violet-400 stroke-none" />
                              <circle cx="44" cy="58" r="1" className="fill-violet-400 stroke-none" />
                              <circle cx="56" cy="58" r="1" className="fill-violet-400 stroke-none" />
                              <circle cx="64" cy="56" r="1.5" className="fill-violet-400 stroke-none" />
                            </>
                          )}
                          {fd.dots >= 20 && (
                            <>
                              <circle cx="38" cy="50" r="1.2" className="fill-violet-400 stroke-none" />
                              <circle cx="42" cy="52" r="1.5" className="fill-violet-400 stroke-none" />
                              <circle cx="58" cy="52" r="1.5" className="fill-violet-400 stroke-none" />
                              <circle cx="62" cy="50" r="1.2" className="fill-violet-400 stroke-none" />
                              <circle cx="48" cy="62" r="1" className="fill-violet-400 stroke-none" />
                              <circle cx="52" cy="62" r="1.2" className="fill-violet-400 stroke-none" />
                            </>
                          )}
                          {fd.dots >= 45 && (
                            <>
                              <circle cx="30" cy="46" r="1" className="fill-violet-400 stroke-none" />
                              <circle cx="70" cy="46" r="1" className="fill-violet-400 stroke-none" />
                              <circle cx="34" cy="62" r="1.5" className="fill-violet-400 stroke-none" />
                              <circle cx="66" cy="62" r="1.5" className="fill-violet-400 stroke-none" />
                              <circle cx="44" cy="66" r="1" className="fill-violet-400 stroke-none" />
                              <circle cx="56" cy="66" r="1.2" className="fill-violet-400 stroke-none" />
                              <circle cx="50" cy="58" r="1.5" className="fill-violet-400 stroke-none" />
                            </>
                          )}
                        </svg>
                      </div>
                      <span className="text-[9px] font-bold tracking-wide">{fd.label}</span>
                    </button>
                  )
                })}
              </div>

              {/* Freckle Locations selection */}
              {freckleDensity !== 'None' && (
                <div className="space-y-2 pt-1 animate-fade-in">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Freckle Placement on Face:</span>
                  <div className="flex flex-wrap gap-2.5">
                    {FRECKLE_LOCATIONS.map((fl) => {
                      const isSelected = freckleLocations.includes(fl.id)
                      return (
                        <button
                          key={fl.id}
                          type="button"
                          onClick={() => toggleFreckleLocation(fl.id)}
                          className={`px-4.5 py-2.5 rounded-2xl border text-xs font-bold transition-all ${
                            isSelected 
                              ? 'border-violet-500 bg-violet-950/30 text-white' 
                              : 'border-violet-900/10 bg-[#0A0F1E]/60 text-slate-450 hover:border-violet-900/40 hover:text-slate-200'
                          }`}
                        >
                          {fl.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* NEW ADDITIONS - 13. SIGNATURE POSE (Visual cards with illustrations) */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-355 tracking-wide uppercase">13. Signature Pose</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {POSES.map((p) => {
                  const isSelected = selectedPose === p.id
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPose(p.id)}
                      className={`group flex flex-col items-center justify-between p-3.5 rounded-2xl border transition-all ${
                        isSelected 
                          ? 'border-violet-500 bg-violet-950/20 text-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.15)]' 
                          : 'border-violet-900/10 bg-[#0A0F1E]/60 text-slate-500 hover:border-slate-800'
                      }`}
                    >
                      <div className="mb-2 transition-transform group-hover:scale-102">{p.svg}</div>
                      <span className="text-[10px] font-bold tracking-wide">{p.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

          </div>

          {/* Right Column: Game-like character view, height silhouette scaling, reference image upload (5 cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            
            {isPreviewActive ? (
              /* Output Canvas Panel */
              <div className="bg-[#0F1629]/60 border border-violet-900/10 p-6 rounded-3xl backdrop-blur-xl space-y-6 flex flex-col min-h-[500px] justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wide mb-4">Output Studio Canvas</h3>
                  
                  <div className="relative aspect-square w-full bg-slate-950/80 rounded-2xl overflow-hidden border border-violet-900/10 flex items-center justify-center">
                    {previewLoading ? (
                      <div className="flex flex-col items-center justify-center p-6 text-center space-y-4">
                        <div className="relative">
                          <div className="w-16 h-16 rounded-full border-4 border-violet-500/20 border-t-violet-500 animate-spin" />
                          <Sparkles className="absolute inset-0 m-auto h-6 w-6 text-violet-400 animate-pulse" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-white">Generating Character Preview</p>
                          <p className="text-xs text-slate-450 animate-pulse">{pipelineState || 'Calling DALL-E 3 API...'}</p>
                        </div>
                      </div>
                    ) : previewImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={previewImageUrl}
                        alt="Character AI generated preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-6 text-slate-500 text-sm">
                        No preview image. Please click "Generate Preview" below.
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons below image (Save Avatar / Regenerate / Edit Details) */}
                {!previewLoading && previewImageUrl && (
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={handleSaveAvatar}
                      disabled={loading}
                      className="w-full py-4 bg-gradient-to-r from-emerald-600 to-green-500 hover:opacity-95 text-white font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span>Saving Avatar...</span>
                        </>
                      ) : (
                        <>
                          <Check className="h-5 w-5 text-white" />
                          <span>Save Avatar</span>
                        </>
                      )}
                    </button>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={handleGeneratePreview}
                        disabled={previewLoading}
                        className="py-3 bg-slate-900 border border-slate-800 hover:border-violet-500/40 text-slate-200 font-bold rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm cursor-pointer"
                      >
                        <RefreshCw className="h-4 w-4 text-violet-400" />
                        <span>Regenerate</span>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setIsPreviewActive(false)}
                        className="py-3 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-350 hover:text-white font-bold rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm cursor-pointer"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Edit Details</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Visual Height / Silhouette Panel */}
                <div className="bg-[#0F1629]/60 border border-violet-900/10 p-6 rounded-3xl backdrop-blur-xl space-y-5 flex flex-col items-center">
                  <div className="w-full flex justify-between items-center border-b border-violet-900/10 pb-3">
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wide">Height Scaling Model</h3>
                    <span className="text-violet-400 font-extrabold text-sm">{height} cm</span>
                  </div>
                  
                  {/* Growing Human Silhouette Illustration */}
                  <div className="h-64 flex items-end justify-center w-full relative bg-[#0A0F1E]/55 rounded-2xl p-4 border border-violet-900/5 overflow-hidden">
                    <div 
                      className="transition-all duration-300 flex flex-col items-center origin-bottom"
                      style={{ transform: `scale(${0.65 + ((height - 140) / 70) * 0.35})` }}
                    >
                      {/* Glowing human outline SVG */}
                      <svg viewBox="0 0 100 200" className="w-24 h-48 stroke-violet-500 fill-violet-500/10 filter drop-shadow-[0_0_8px_rgba(139,92,246,0.3)]" strokeWidth="2">
                        {/* Head */}
                        <circle cx="50" cy="25" r="14" />
                        {/* Neck */}
                        <line x1="50" y1="39" x2="50" y2="45" />
                        {/* Shoulders & Torso */}
                        <path d="M28,52 C32,45 68,45 72,52 L64,105 L36,105 Z" />
                        {/* Arms */}
                        <path d="M28,52 L20,95 L22,100" />
                        <path d="M72,52 L80,95 L78,100" />
                        {/* Pelvis */}
                        <path d="M36,105 L64,105 L58,122 L42,122 Z" />
                        {/* Legs */}
                        <path d="M43,122 L41,185 L48,188" />
                        <path d="M57,122 L59,185 L52,188" />
                      </svg>
                      <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider mt-2.5">AI Silhouette</span>
                    </div>
                  </div>

                  {/* Slider Input */}
                  <div className="w-full space-y-2">
                    <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase">
                      <span>Petite (140cm)</span>
                      <span>Average (175cm)</span>
                      <span>Tall (210cm)</span>
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
                </div>

                {/* Real-time Prompt Builder Panel */}
                <div className="bg-[#0F1629]/60 border border-violet-900/10 p-6 rounded-3xl backdrop-blur-xl space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wide flex items-center gap-2">
                      <Sparkles className="h-4.5 w-4.5 text-violet-400" />
                      Real-time Prompt Builder
                    </h3>
                  </div>
                  <div className="p-4 bg-[#0A0F1E] rounded-2xl border border-violet-900/10">
                    <p className="text-xs text-slate-400 leading-relaxed italic">
                      "{realtimePrompt}"
                    </p>
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
                      {/* Reference Photo Badge */}
                      <div className="absolute top-3 left-3 bg-violet-600/85 backdrop-blur-sm px-2.5 py-1 rounded-md text-[10px] font-bold text-white uppercase tracking-wider z-10 shadow-md">
                        Reference Photo
                      </div>
                      <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl z-20">
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
              </>
            )}
          </div>

          {/* Main Action Footer spanning full width */}
          {!isPreviewActive && (
            <div className="lg:col-span-12 border-t border-violet-900/10 pt-8 flex flex-col items-center justify-center space-y-4">
              <button
                type="button"
                onClick={handleGeneratePreview}
                disabled={previewLoading}
                className="w-full max-w-xl py-5 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-500 hover:opacity-95 text-white font-extrabold rounded-3xl shadow-xl shadow-violet-500/20 transition-all flex items-center justify-center gap-3 active:scale-[0.99] text-lg cursor-pointer"
              >
                {previewLoading ? (
                  <>
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span>Generating Preview...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-6 w-6 fill-white" />
                    <span>Generate Preview</span>
                  </>
                )}
              </button>
              <p className="text-xs text-slate-500 text-center max-w-md leading-relaxed">
                Ensure you have specified the name and uploaded a reference face photo.
              </p>
            </div>
          )}

        </form>

      </main>

      {showSuccess && (
        <div className="fixed inset-0 bg-[#0A0F1E]/95 backdrop-blur-md z-[100] flex flex-col items-center justify-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-violet-600 to-[#EC4899] flex items-center justify-center shadow-lg shadow-violet-500/30 animate-bounce">
            <Check className="h-10 w-10 text-white stroke-[3px]" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold text-white tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
              Avatar Saved Successfully
            </h2>
            <p className="text-sm text-slate-400">
              Redirecting to dashboard...
            </p>
          </div>
        </div>
      )}

    </div>
  )
}
