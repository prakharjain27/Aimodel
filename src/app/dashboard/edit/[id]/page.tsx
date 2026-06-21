"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { Sparkles, ArrowLeft, Loader2, Coins, Check, RefreshCw, Save } from 'lucide-react'
import { use } from 'react'

// Options Constants with Illustrated SVG Icons
const GENDERS = [
  { 
    id: 'Male', 
    name: 'Male', 
    svg: (
      <svg viewBox="0 0 100 100" className="w-16 h-16 stroke-slate-300 fill-slate-800" strokeWidth="2.5">
        <circle cx="50" cy="48" r="28" />
        <path d="M50,14 C36,14 30,22 30,30 L70,30 C70,22 64,14 50,14 Z" className="fill-slate-600 stroke-none" />
        <circle cx="40" cy="48" r="3" className="fill-slate-200 stroke-none" />
        <circle cx="60" cy="48" r="3" className="fill-slate-200 stroke-none" />
        <path d="M42,60 Q50,65 58,60" className="fill-none stroke-slate-200" strokeWidth="2.5" />
      </svg>
    ) 
  },
  { 
    id: 'Female', 
    name: 'Female', 
    svg: (
      <svg viewBox="0 0 100 100" className="w-16 h-16 stroke-slate-300 fill-slate-850" strokeWidth="2.5">
        <circle cx="50" cy="50" r="26" />
        <path d="M22,50 C22,25 35,18 50,18 C65,18 78,25 78,50 C78,75 75,80 75,80 L25,80 Z" className="fill-slate-650 stroke-none" />
        <circle cx="41" cy="50" r="3" className="fill-slate-200 stroke-none" />
        <circle cx="59" cy="50" r="3" className="fill-slate-200 stroke-none" />
        <path d="M44,61 Q50,66 56,61" className="fill-none stroke-slate-200" strokeWidth="2.5" />
      </svg>
    ) 
  }
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

const FACE_SHAPES = [
  {
    id: 'Oval',
    svg: (
      <svg viewBox="0 0 100 100" className="w-12 h-12 stroke-current fill-none" strokeWidth="2.5">
        <path d="M50,15 C28,15 28,45 28,68 C28,84 38,86 50,86 C62,86 72,84 72,68 C72,45 72,15 50,15 Z" />
      </svg>
    )
  },
  {
    id: 'Round',
    svg: (
      <svg viewBox="0 0 100 100" className="w-12 h-12 stroke-current fill-none" strokeWidth="2.5">
        <path d="M50,16 C31,16 30,34 30,52 C30,70 38,80 50,80 C62,80 70,70 70,52 C70,34 69,16 50,16 Z" />
      </svg>
    )
  },
  {
    id: 'Square',
    svg: (
      <svg viewBox="0 0 100 100" className="w-12 h-12 stroke-current fill-none" strokeWidth="2.5">
        <path d="M50,16 C31,16 29,26 29,66 C29,81 36,82 50,82 C64,82 71,81 71,66 C71,26 69,16 50,16 Z" />
      </svg>
    )
  },
  {
    id: 'Heart',
    svg: (
      <svg viewBox="0 0 100 100" className="w-12 h-12 stroke-current fill-none" strokeWidth="2.5">
        <path d="M50,16 C27,13 25,34 25,54 C25,68 38,79 50,85 C62,79 75,68 75,54 C75,34 73,13 50,16 Z" />
      </svg>
    )
  },
  {
    id: 'Diamond',
    svg: (
      <svg viewBox="0 0 100 100" className="w-12 h-12 stroke-current fill-none" strokeWidth="2.5">
        <path d="M50,16 C33,34 26,48 26,60 C26,73 38,83 50,85 C62,83 74,73 74,60 C74,48 67,34 50,16 Z" />
      </svg>
    )
  },
  {
    id: 'Oblong',
    svg: (
      <svg viewBox="0 0 100 100" className="w-12 h-12 stroke-current fill-none" strokeWidth="2.5">
        <path d="M50,10 C32,10 32,24 32,74 C32,87 40,89 50,89 C60,89 68,87 68,74 C68,24 68,10 50,10 Z" />
      </svg>
    )
  }
]

const EYE_SHAPES = [
  {
    id: 'Almond',
    svg: (
      <svg viewBox="0 0 100 60" className="w-14 h-8 stroke-current fill-none" strokeWidth="2.5">
        <path d="M15,30 C30,10 70,10 85,30 C70,50 30,50 15,30 Z" />
        <circle cx="50" cy="30" r="9" className="fill-slate-700/40" />
      </svg>
    )
  },
  {
    id: 'Round',
    svg: (
      <svg viewBox="0 0 100 60" className="w-14 h-8 stroke-current fill-none" strokeWidth="2.5">
        <path d="M15,30 C28,5 72,5 85,30 C72,55 28,55 15,30 Z" />
        <circle cx="50" cy="30" r="11" className="fill-slate-700/40" />
      </svg>
    )
  },
  {
    id: 'Hooded',
    svg: (
      <svg viewBox="0 0 100 60" className="w-14 h-8 stroke-current fill-none" strokeWidth="2.5">
        <path d="M15,30 C30,10 70,10 85,30 C70,50 30,50 15,30 Z" />
        <path d="M18,22 C32,8 68,8 82,22" />
        <circle cx="50" cy="30" r="8" className="fill-slate-700/40" />
      </svg>
    )
  },
  {
    id: 'Monolid',
    svg: (
      <svg viewBox="0 0 100 60" className="w-14 h-8 stroke-current fill-none" strokeWidth="2.5">
        <path d="M15,30 C32,18 68,18 85,30 C68,45 32,45 15,30 Z" />
        <circle cx="50" cy="31" r="9" className="fill-slate-700/40" />
      </svg>
    )
  },
  {
    id: 'Upturned',
    svg: (
      <svg viewBox="0 0 100 60" className="w-14 h-8 stroke-current fill-none" strokeWidth="2.5">
        <path d="M15,35 C30,12 68,8 85,25 C68,48 30,52 15,35 Z" />
        <circle cx="50" cy="30" r="9" className="fill-slate-700/40" />
      </svg>
    )
  },
  {
    id: 'Downturned',
    svg: (
      <svg viewBox="0 0 100 60" className="w-14 h-8 stroke-current fill-none" strokeWidth="2.5">
        <path d="M15,25 C30,8 68,12 85,35 C68,52 30,48 15,25 Z" />
        <circle cx="50" cy="30" r="9" className="fill-slate-700/40" />
      </svg>
    )
  }
]

const EYE_COLORS = [
  { name: 'Brown', gradient: 'radial-gradient(circle, #78350f 10%, #451a03 70%, #000 100%)' },
  { name: 'Black', gradient: 'radial-gradient(circle, #1e293b 10%, #0f172a 70%, #000 100%)' },
  { name: 'Blue', gradient: 'radial-gradient(circle, #3b82f6 10%, #1d4ed8 70%, #000 100%)' },
  { name: 'Green', gradient: 'radial-gradient(circle, #10b981 10%, #047857 70%, #000 100%)' },
  { name: 'Hazel', gradient: 'radial-gradient(circle, #d97706 10%, #78350f 70%, #000 100%)' },
  { name: 'Grey', gradient: 'radial-gradient(circle, #94a3b8 10%, #475569 70%, #000 100%)' }
]

const EYEBROWS = [
  {
    id: 'Arched',
    svg: (
      <svg viewBox="0 0 60 20" className="w-14 h-6 stroke-current fill-none" strokeWidth="2.5">
        <path d="M10,14 Q30,5 50,14" />
      </svg>
    )
  },
  {
    id: 'Thin',
    svg: (
      <svg viewBox="0 0 60 20" className="w-14 h-6 stroke-current fill-none" strokeWidth="1.5">
        <path d="M10,12 C20,9 40,9 50,12" />
      </svg>
    )
  },
  {
    id: 'Thick',
    svg: (
      <svg viewBox="0 0 60 20" className="w-14 h-6 stroke-current fill-none" strokeWidth="4">
        <path d="M10,13 Q30,7 50,13" />
      </svg>
    )
  },
  {
    id: 'Straight',
    svg: (
      <svg viewBox="0 0 60 20" className="w-14 h-6 stroke-current fill-none" strokeWidth="2.5">
        <line x1="10" y1="10" x2="50" y2="10" />
      </svg>
    )
  },
  {
    id: 'Curved',
    svg: (
      <svg viewBox="0 0 60 20" className="w-14 h-6 stroke-current fill-none" strokeWidth="2.5">
        <path d="M10,15 C20,5 40,5 50,15" />
      </svg>
    )
  }
]

const NOSES = [
  {
    id: 'Straight',
    svg: (
      <svg viewBox="0 0 40 40" className="w-8 h-8 stroke-current fill-none" strokeWidth="2.5">
        <path d="M16,10 L16,28 Q16,32 20,32 L24,32" />
      </svg>
    )
  },
  {
    id: 'Button',
    svg: (
      <svg viewBox="0 0 40 40" className="w-8 h-8 stroke-current fill-none" strokeWidth="2.5">
        <path d="M18,15 L18,28 Q20,32 22,30 Q24,28 26,28" />
      </svg>
    )
  },
  {
    id: 'Turned Up',
    svg: (
      <svg viewBox="0 0 40 40" className="w-8 h-8 stroke-current fill-none" strokeWidth="2.5">
        <path d="M15,10 L15,26 Q15,30 20,29 Q25,27 25,24" />
      </svg>
    )
  },
  {
    id: 'Hooked',
    svg: (
      <svg viewBox="0 0 40 40" className="w-8 h-8 stroke-current fill-none" strokeWidth="2.5">
        <path d="M16,10 Q20,18 16,26 Q15,30 22,30" />
      </svg>
    )
  },
  {
    id: 'Flat',
    svg: (
      <svg viewBox="0 0 40 40" className="w-8 h-8 stroke-current fill-none" strokeWidth="2.5">
        <path d="M14,15 L14,28 L26,28" />
      </svg>
    )
  }
]

const LIPS = [
  {
    id: 'Full',
    svg: (
      <svg viewBox="0 0 60 40" className="w-12 h-8 stroke-current fill-none" strokeWidth="2">
        <path d="M10,20 Q18,12 30,17 Q42,12 50,20 Q30,28 10,20" />
        <path d="M10,20 Q30,34 50,20" />
      </svg>
    )
  },
  {
    id: 'Thin',
    svg: (
      <svg viewBox="0 0 60 40" className="w-12 h-8 stroke-current fill-none" strokeWidth="1.5">
        <path d="M12,20 Q30,17 48,20 Q30,23 12,20" />
      </svg>
    )
  },
  {
    id: 'Bow-shaped',
    svg: (
      <svg viewBox="0 0 60 40" className="w-12 h-8 stroke-current fill-none" strokeWidth="2.5">
        <path d="M10,20 Q16,10 30,18 Q44,10 50,20 Q30,30 10,20" />
      </svg>
    )
  },
  {
    id: 'Round',
    svg: (
      <svg viewBox="0 0 60 40" className="w-12 h-8 stroke-current fill-none" strokeWidth="2">
        <path d="M15,20 C15,10 45,10 45,20 C45,30 15,30 15,20 Z" />
      </svg>
    )
  },
  {
    id: 'Oval',
    svg: (
      <svg viewBox="0 0 60 40" className="w-12 h-8 stroke-current fill-none" strokeWidth="2">
        <path d="M10,20 Q30,13 50,20 Q30,27 10,20 Z" />
      </svg>
    )
  }
]

const HAIR_STYLES = [
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

const BODY_TYPES = [
  {
    id: 'Slim',
    svg: (
      <svg viewBox="0 0 100 150" className="w-10 h-14 stroke-current fill-none" strokeWidth="2.5">
        <circle cx="50" cy="20" r="9" />
        <path d="M50,29 L50,42 M41,42 C45,45 44,70 43,90 L41,140 M59,42 C55,45 56,70 57,90 L59,140 M41,42 L59,42" />
      </svg>
    )
  },
  {
    id: 'Athletic',
    svg: (
      <svg viewBox="0 0 100 150" className="w-10 h-14 stroke-current fill-none" strokeWidth="2.5">
        <circle cx="50" cy="20" r="9" />
        <path d="M50,29 L50,42 M38,42 Q48,47 43,80 L42,140 M62,42 Q52,47 57,80 L58,140 M38,42 L62,42" />
      </svg>
    )
  },
  {
    id: 'Curvy',
    svg: (
      <svg viewBox="0 0 100 150" className="w-10 h-14 stroke-current fill-none" strokeWidth="2.5">
        <circle cx="50" cy="20" r="9" />
        <path d="M50,29 L50,42 M37,42 C45,45 38,72 44,92 L41,140 M63,42 C55,45 62,72 56,92 L59,140" />
      </svg>
    )
  },
  {
    id: 'Plus size',
    svg: (
      <svg viewBox="0 0 100 150" className="w-10 h-14 stroke-current fill-none" strokeWidth="2.5">
        <circle cx="50" cy="20" r="9" />
        <path d="M50,29 L50,42 M38,42 C42,45 35,90 44,140 M62,42 C58,45 65,90 56,140" />
      </svg>
    )
  },
  {
    id: 'Petite',
    svg: (
      <svg viewBox="0 0 100 150" className="w-10 h-14 stroke-current fill-none" strokeWidth="2.5">
        <circle cx="50" cy="24" r="8.5" />
        <path d="M50,32.5 L50,45 M41,45 C44,48 43,72 43,90 L41,130 M59,45 C56,48 57,72 57,90 L59,130" />
      </svg>
    )
  }
]

const STYLE_VIBES = [
  {
    id: 'Cyberpunk Techwear',
    label: 'Cyberpunk',
    svg: (
      <svg viewBox="0 0 100 100" className="w-12 h-12 stroke-current fill-none" strokeWidth="2.5">
        <rect x="20" y="35" width="60" height="30" rx="6" />
        <line x1="20" y1="50" x2="80" y2="50" />
        <circle cx="35" cy="50" r="6" className="fill-current" />
        <circle cx="65" cy="50" r="6" className="fill-current" />
      </svg>
    )
  },
  {
    id: 'High-Fashion Streetwear',
    label: 'Streetwear',
    svg: (
      <svg viewBox="0 0 100 100" className="w-12 h-12 stroke-current fill-none" strokeWidth="2.5">
        <path d="M15,75 L35,55 L65,55 L85,75 Z" />
        <circle cx="35" cy="75" r="10" />
        <circle cx="65" cy="75" r="10" />
      </svg>
    )
  },
  {
    id: 'Bohemian Beach',
    label: 'Bohemian',
    svg: (
      <svg viewBox="0 0 100 100" className="w-12 h-12 stroke-current fill-none" strokeWidth="2">
        <circle cx="50" cy="50" r="18" />
        <line x1="50" y1="15" x2="50" y2="25" />
        <line x1="50" y1="75" x2="50" y2="85" />
        <line x1="15" y1="50" x2="25" y2="50" />
        <line x1="75" y1="50" x2="85" y2="50" />
      </svg>
    )
  },
  {
    id: 'Classic Minimalist',
    label: 'Minimalist',
    svg: (
      <svg viewBox="0 0 100 100" className="w-12 h-12 stroke-current fill-none" strokeWidth="2.5">
        <rect x="25" y="25" width="50" height="50" rx="4" />
        <line x1="25" y1="25" x2="75" y2="75" />
      </svg>
    )
  },
  {
    id: 'Y2K Retro',
    label: 'Retro Y2K',
    svg: (
      <svg viewBox="0 0 100 100" className="w-12 h-12 stroke-current fill-none" strokeWidth="2">
        <circle cx="50" cy="50" r="30" />
        <path d="M30,50 A20,20 0 0,0 70,50" />
        <circle cx="50" cy="50" r="8" className="fill-current" />
      </svg>
    )
  }
]

export default function EditCharacterPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState<number | null>(null)
  const [initialLoading, setInitialLoading] = useState(true)
  
  // Character Visual States
  const [name, setName] = useState('')
  const [gender, setGender] = useState('Female')
  const [age, setAge] = useState(24)
  const [height, setHeight] = useState(170)
  const [skinTone, setSkinTone] = useState('Porcelain')
  const [bodyType, setBodyType] = useState('Slim')
  const [faceShape, setFaceShape] = useState('Oval')
  const [hairStyle, setHairStyle] = useState('Straight')
  const [hairColor, setHairColor] = useState('Black')
  const [eyeShape, setEyeShape] = useState('Almond')
  const [eyeColor, setEyeColor] = useState('Blue')
  const [eyebrows, setEyebrows] = useState('Arched')
  const [nose, setNose] = useState('Straight')
  const [lips, setLips] = useState('Full')
  const [styleVibe, setStyleVibe] = useState('High-Fashion Streetwear')

  // Extra Details (Freckles, Tattoos)
  const [hasTattoos, setHasTattoos] = useState(false)
  const [selectedTattooLocs, setSelectedTattooLocs] = useState<string[]>([])
  const [tattooStyle, setTattooStyle] = useState('Minimalist')
  const [tattooSize, setTattooSize] = useState('Medium')
  const [selectedFaceFeatures, setSelectedFaceFeatures] = useState<string[]>([])
  const [freckleDensity, setFreckleDensity] = useState('None')
  const [freckleLocations, setFreckleLocations] = useState<string[]>([])
  const [selectedPose, setSelectedPose] = useState('Looking over shoulder')
  
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [realtimePrompt, setRealtimePrompt] = useState('')

  // Generation Preview States
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null)
  const [previewLoading, setPreviewLoading] = useState(false)
  const [pipelineState, setPipelineState] = useState('')

  // Build realtime prompt in background automatically
  useEffect(() => {
    const genderTerm = gender.toLowerCase()
    
    const tattooDesc = hasTattoos && selectedTattooLocs.length > 0
      ? `has a ${tattooSize.toLowerCase()} ${tattooStyle.toLowerCase()} style tattoo on the ${selectedTattooLocs.join(', ')}`
      : 'no visible tattoos'

    const eyebrowsDesc = `eyebrows: ${eyebrows.toLowerCase()}`
    const noseDesc = `nose: ${nose.toLowerCase()}`
    const lipsDesc = `lips: ${lips.toLowerCase()}`
    const faceFeaturesDesc = [eyebrowsDesc, noseDesc, lipsDesc, ...selectedFaceFeatures].join(', ')

    const frecklesDesc = freckleDensity !== 'None' && freckleLocations.length > 0
      ? `, with ${freckleDensity.toLowerCase()} freckles on ${freckleLocations.join(', ')}`
      : ''

    const selectedToneObj = SKIN_TONES.find(t => t.name === skinTone)
    const toneString = selectedToneObj 
      ? `${selectedToneObj.name} skin tone (${selectedToneObj.description})` 
      : `${skinTone} skin tone`

    const constructedPrompt = `A portrait photography shot of ${name || 'AI Model'}, a ${age}-year-old ${genderTerm}. Traits: ${bodyType.toLowerCase()} build, ${height}cm, ${toneString.toLowerCase()}, ${faceShape.toLowerCase()} face shape, ${hairColor.toLowerCase()} ${hairStyle.toLowerCase()} hair, and ${eyeColor.toLowerCase()} ${eyeShape.toLowerCase()} eyes. Face Details: ${faceFeaturesDesc}${frecklesDesc}, ${tattooDesc}. Styled in signature ${styleVibe.toLowerCase()} fashion.`
    setRealtimePrompt(constructedPrompt)
  }, [name, gender, age, height, skinTone, bodyType, faceShape, hairStyle, hairColor, eyeShape, eyeColor, eyebrows, nose, lips, styleVibe, hasTattoos, selectedTattooLocs, tattooStyle, tattooSize, selectedFaceFeatures, freckleDensity, freckleLocations])

  useEffect(() => {
    const checkUserAndFetchChar = async () => {
      const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'your-supabase-project-url'
      if (isDemoMode) {
        setUser({ id: 'demo-user-123', email: 'demo-user@studio.ai' })
        setCredits(10)
        
        // Mock existing character data
        setName('Mia Jenkins')
        setGender('Female')
        setAge(24)
        setHeight(170)
        setSkinTone('Porcelain')
        setBodyType('Slim')
        setFaceShape('Oval')
        setHairStyle('Straight')
        setHairColor('Black')
        setEyeShape('Almond')
        setEyeColor('Blue')
        setEyebrows('Arched')
        setNose('Straight')
        setLips('Full')
        setPreviewImageUrl('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80')
        setInitialLoading(false)
        return
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/')
        return
      }
      setUser(user)
      
      const { data: profile } = await supabase.from('profiles').select('credits').maybeSingle()
      setCredits(profile?.credits ?? 10)

      // Fetch character details
      const { data: char, error: charError } = await supabase
        .from('characters')
        .select('*')
        .eq('id', resolvedParams.id)
        .single()
        
      if (charError || !char) {
        router.push('/dashboard')
        return
      }

      setName(char.name)
      setGender(char.gender || 'Female')
      setAge(char.age)
      setHeight(char.height || 170)
      setSkinTone(char.skin_tone)
      setBodyType(char.body_type || 'Slim')
      setFaceShape(char.face_shape || 'Oval')
      
      // Parse hair_color_style (e.g. "Black / Straight")
      if (char.hair_color_style.includes('/')) {
        const parts = char.hair_color_style.split('/')
        setHairColor(parts[0].trim())
        setHairStyle(parts[1].trim())
      } else {
        setHairStyle(char.hair_color_style)
      }

      setEyeColor(char.eye_color)
      setEyeShape(char.eye_shape || 'Almond')
      
      // Parse face features
      if (char.face_features) {
        const feats = char.face_features.split(',').map((f: string) => f.trim())
        
        // Extract eyebrows
        const eyebrowsPart = feats.find((f: string) => f.startsWith('eyebrows:'))
        if (eyebrowsPart) {
          const val = eyebrowsPart.split(':')[1].trim().toLowerCase()
          const matched = EYEBROWS.find(item => item.id.toLowerCase() === val)
          if (matched) {
            setEyebrows(matched.id)
          }
        }
        
        // Extract nose
        const nosePart = feats.find((f: string) => f.startsWith('nose:'))
        if (nosePart) {
          const val = nosePart.split(':')[1].trim().toLowerCase()
          const matched = NOSES.find(item => item.id.toLowerCase() === val)
          if (matched) {
            setNose(matched.id)
          }
        }
        
        // Extract lips
        const lipsPart = feats.find((f: string) => f.startsWith('lips:'))
        if (lipsPart) {
          const val = lipsPart.split(':')[1].trim().toLowerCase()
          const matched = LIPS.find(item => item.id.toLowerCase() === val)
          if (matched) {
            setLips(matched.id)
          }
        }

        // Standard features (anything else)
        const stdFeats = feats.filter((f: string) => !f.startsWith('eyebrows:') && !f.startsWith('nose:') && !f.startsWith('lips:'))
        setSelectedFaceFeatures(stdFeats)
      }

      // Parse tattoos
      const tattoosVal = char.tattoos || 'None'
      if (tattoosVal !== 'None' && tattoosVal.toLowerCase() !== 'none') {
        setHasTattoos(true)
        if (tattoosVal.includes('Ink on')) {
          const parts = tattoosVal.split(' Ink on ')
          const prefix = parts[0].split(' ')
          if (prefix.length > 1) {
            setTattooSize(prefix[0])
            setTattooStyle(prefix[1])
          }
          setSelectedTattooLocs(parts[1].split(',').map((l: string) => l.trim()))
        }
      }

      // Parse birthmarks
      const birthmarksVal = char.birthmarks || 'None'
      if (birthmarksVal !== 'None' && birthmarksVal.toLowerCase() !== 'none') {
        if (birthmarksVal.includes(' Freckles on ')) {
          const parts = birthmarksVal.split(' Freckles on ')
          setFreckleDensity(parts[0])
          setFreckleLocations(parts[1].split(',').map((l: string) => l.trim()))
        }
      }

      setSelectedPose(char.signature_pose || 'Looking over shoulder')
      setPreviewImageUrl(char.reference_image_url)
      setInitialLoading(false)
    }
    
    checkUserAndFetchChar()
  }, [router, supabase, resolvedParams.id])

  const handleGeneratePreview = async () => {
    if (!user) return

    if (!name.trim()) {
      setErrorMsg("Please enter a character name at the top first.")
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    setPreviewLoading(true)
    setErrorMsg(null)
    setPreviewImageUrl(null)
    setPipelineState('Generating avatar portrait...')

    try {
      const faceFeaturesString = [
        `eyebrows: ${eyebrows.toLowerCase()}`,
        `nose: ${nose.toLowerCase()}`,
        `lips: ${lips.toLowerCase()}`,
        ...selectedFaceFeatures
      ].join(', ')

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          characterId: resolvedParams.id,
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
          face_features: faceFeaturesString,
          tattoos: hasTattoos && selectedTattooLocs.length > 0 ? `${tattooSize} ${tattooStyle} Ink on ${selectedTattooLocs.join(', ')}` : 'None',
          birthmarks: freckleDensity !== 'None' && freckleLocations.length > 0 ? `${freckleDensity} Freckles on ${freckleLocations.join(', ')}` : 'None',
          style_vibe: styleVibe,
          signature_pose: selectedPose,
          reference_image_url: '' // Redesigned snapchat style: no reference image upload needed!
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
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong during generation.')
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
      const faceFeaturesString = [
        `eyebrows: ${eyebrows.toLowerCase()}`,
        `nose: ${nose.toLowerCase()}`,
        `lips: ${lips.toLowerCase()}`,
        ...selectedFaceFeatures
      ].join(', ')

      const tattoosString = hasTattoos && selectedTattooLocs.length > 0 
        ? `${tattooSize} ${tattooStyle} Ink on ${selectedTattooLocs.join(', ')}` 
        : 'None'

      const birthmarksString = freckleDensity !== 'None' && freckleLocations.length > 0
        ? `${freckleDensity} Freckles on ${freckleLocations.join(', ')}`
        : 'None'

      const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'your-supabase-project-url'
      if (isDemoMode) {
        setShowSuccess(true)
        await new Promise(res => setTimeout(res, 1500))
        router.push('/dashboard')
        router.refresh()
        return
      }

      const { error: dbError } = await supabase
        .from('characters')
        .update({
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
        .eq('id', resolvedParams.id)

      if (dbError) throw new Error(dbError.message)

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

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-[#060814] flex items-center justify-center text-violet-500">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex-1 min-h-screen bg-[#060814] text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-900/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/10 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="border-b border-slate-900 bg-[#060814]/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-tr from-violet-600 to-blue-500 p-2 rounded-xl group-hover:scale-105 transition-all shadow-md shadow-violet-500/10">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-white" style={{ fontFamily: "'Syne', sans-serif" }}>AI Influencer Studio</span>
          </Link>

          {credits !== null && (
            <div className="flex items-center space-x-2 bg-slate-950/80 border border-slate-900 px-3.5 py-1.5 rounded-full">
              <Coins className="h-4.5 w-4.5 text-amber-400" />
              <span className="text-sm font-semibold text-slate-200">
                {credits} <span className="text-slate-500 font-normal">Credits</span>
              </span>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full px-6 py-8 space-y-8 relative z-10 flex-1 flex flex-col">
        {/* Back Link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-slate-400 hover:text-slate-200 transition-colors gap-2 group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Dashboard</span>
        </Link>

        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>Edit Avatar</h1>
            <p className="text-sm text-slate-400">Modify your virtual influencer avatar with a Snapchat-style interface.</p>
          </div>
          {/* Character Name Input */}
          <div className="w-full md:w-80">
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Character Name (e.g. Mia)..."
              className="w-full px-4 py-3.5 bg-slate-905 border border-slate-800 rounded-2xl text-slate-100 placeholder-slate-650 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all shadow-inner"
            />
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-955/40 border border-rose-900/60 text-rose-205 text-sm">
            {errorMsg}
          </div>
        )}

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start flex-1">
          
          {/* Left Column: Horizontal Scroll Categories (7 cols) */}
          <div className="lg:col-span-7 space-y-8 bg-slate-950/40 border border-slate-900/50 p-6 rounded-3xl backdrop-blur-xl">
            
            {/* 1. GENDER */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 tracking-wide uppercase">1. Gender Selection</label>
              <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-thin scrollbar-thumb-violet-900/20 scrollbar-track-transparent">
                {GENDERS.map((g) => {
                  const isSelected = gender === g.id
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setGender(g.id)}
                      className={`flex-shrink-0 w-24 h-24 rounded-2xl bg-slate-900/90 border flex flex-col items-center justify-center gap-1.5 transition-all duration-300 ${
                        isSelected 
                          ? 'border-violet-500 bg-violet-955/20 text-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.35)] ring-2 ring-violet-500/50' 
                          : 'border-slate-800/80 hover:border-slate-700 hover:bg-slate-900 text-slate-400'
                      }`}
                    >
                      {g.svg}
                      <span className="text-[10px] font-bold tracking-wide">{g.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 2. SKIN TONE */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 tracking-wide uppercase">2. Skin Tone</label>
              <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-thin scrollbar-thumb-violet-900/20 scrollbar-track-transparent">
                {SKIN_TONES.map((s) => {
                  const isSelected = skinTone === s.name
                  return (
                    <button
                      key={s.name}
                      type="button"
                      onClick={() => setSkinTone(s.name)}
                      className={`flex-shrink-0 w-20 h-20 rounded-2xl bg-slate-900/90 border flex flex-col items-center justify-center gap-1.5 transition-all duration-300 ${
                        isSelected 
                          ? 'border-violet-500 bg-violet-955/20 text-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.35)] ring-2 ring-violet-500/50' 
                          : 'border-slate-800/80 hover:border-slate-700 hover:bg-slate-900 text-slate-400'
                      }`}
                      title={s.description}
                    >
                      <div className="w-8 h-8 rounded-full border border-slate-950 shadow-md" style={{ backgroundColor: s.hex }} />
                      <span className="text-[9px] font-semibold">{s.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 3. FACE SHAPE */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 tracking-wide uppercase">3. Face Shape</label>
              <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-thin scrollbar-thumb-violet-900/20 scrollbar-track-transparent">
                {FACE_SHAPES.map((f) => {
                  const isSelected = faceShape === f.id
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFaceShape(f.id)}
                      className={`flex-shrink-0 w-20 h-20 rounded-2xl bg-slate-900/90 border flex flex-col items-center justify-center gap-1.5 transition-all duration-300 ${
                        isSelected 
                          ? 'border-violet-500 bg-violet-950/20 text-violet-455 shadow-[0_0_15px_rgba(139,92,246,0.35)] ring-2 ring-violet-500/50' 
                          : 'border-slate-800/80 hover:border-slate-700 hover:bg-slate-900 text-slate-400'
                      }`}
                    >
                      {f.svg}
                      <span className="text-[10px] font-bold">{f.id}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 4. EYES */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 tracking-wide uppercase">4. Eye Shape</label>
              <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-thin scrollbar-thumb-violet-900/20 scrollbar-track-transparent">
                {EYE_SHAPES.map((e) => {
                  const isSelected = eyeShape === e.id
                  return (
                    <button
                      key={e.id}
                      type="button"
                      onClick={() => setEyeShape(e.id)}
                      className={`flex-shrink-0 w-22 h-20 rounded-2xl bg-slate-900/90 border flex flex-col items-center justify-center gap-1.5 transition-all duration-300 ${
                        isSelected 
                          ? 'border-violet-500 bg-violet-955/20 text-violet-455 shadow-[0_0_15px_rgba(139,92,246,0.35)] ring-2 ring-violet-500/50' 
                          : 'border-slate-800/80 hover:border-slate-700 hover:bg-slate-900 text-slate-400'
                      }`}
                    >
                      {e.svg}
                      <span className="text-[10px] font-bold">{e.id}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 5. EYE COLOR */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 tracking-wide uppercase">5. Eye Color</label>
              <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-thin scrollbar-thumb-violet-900/20 scrollbar-track-transparent">
                {EYE_COLORS.map((ec) => {
                  const isSelected = eyeColor === ec.name
                  return (
                    <button
                      key={ec.name}
                      type="button"
                      onClick={() => setEyeColor(ec.name)}
                      className={`flex-shrink-0 w-20 h-20 rounded-2xl bg-slate-900/90 border flex flex-col items-center justify-center gap-1.5 transition-all duration-300 ${
                        isSelected 
                          ? 'border-violet-500 bg-violet-955/20 text-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.35)] ring-2 ring-violet-500/50' 
                          : 'border-slate-800/80 hover:border-slate-700 hover:bg-slate-900 text-slate-400'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full border border-slate-950 shadow-md" style={{ background: ec.gradient }} />
                      <span className="text-[10px] font-bold">{ec.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 6. EYEBROWS */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 tracking-wide uppercase">6. Eyebrows Shape</label>
              <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-thin scrollbar-thumb-violet-900/20 scrollbar-track-transparent">
                {EYEBROWS.map((eb) => {
                  const isSelected = eyebrows === eb.id
                  return (
                    <button
                      key={eb.id}
                      type="button"
                      onClick={() => setEyebrows(eb.id)}
                      className={`flex-shrink-0 w-20 h-20 rounded-2xl bg-slate-900/90 border flex flex-col items-center justify-center gap-1.5 transition-all duration-300 ${
                        isSelected 
                          ? 'border-violet-500 bg-violet-950/20 text-violet-455 shadow-[0_0_15px_rgba(139,92,246,0.35)] ring-2 ring-violet-500/50' 
                          : 'border-slate-800/80 hover:border-slate-700 hover:bg-slate-900 text-slate-400'
                      }`}
                    >
                      {eb.svg}
                      <span className="text-[10px] font-bold">{eb.id}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 7. NOSE */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 tracking-wide uppercase">7. Nose Shape</label>
              <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-thin scrollbar-thumb-violet-900/20 scrollbar-track-transparent">
                {NOSES.map((n) => {
                  const isSelected = nose === n.id
                  return (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => setNose(n.id)}
                      className={`flex-shrink-0 w-20 h-20 rounded-2xl bg-slate-900/90 border flex flex-col items-center justify-center gap-1.5 transition-all duration-300 ${
                        isSelected 
                          ? 'border-violet-500 bg-violet-955/20 text-violet-455 shadow-[0_0_15px_rgba(139,92,246,0.35)] ring-2 ring-violet-500/50' 
                          : 'border-slate-800/80 hover:border-slate-700 hover:bg-slate-900 text-slate-400'
                      }`}
                    >
                      {n.svg}
                      <span className="text-[10px] font-bold">{n.id}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 8. LIPS */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 tracking-wide uppercase">8. Lip Shape</label>
              <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-thin scrollbar-thumb-violet-900/20 scrollbar-track-transparent">
                {LIPS.map((l) => {
                  const isSelected = lips === l.id
                  return (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => setLips(l.id)}
                      className={`flex-shrink-0 w-20 h-20 rounded-2xl bg-slate-900/90 border flex flex-col items-center justify-center gap-1.5 transition-all duration-300 ${
                        isSelected 
                          ? 'border-violet-500 bg-violet-950/20 text-violet-455 shadow-[0_0_15px_rgba(139,92,246,0.35)] ring-2 ring-violet-500/50' 
                          : 'border-slate-800/80 hover:border-slate-700 hover:bg-slate-900 text-slate-400'
                      }`}
                    >
                      {l.svg}
                      <span className="text-[10px] font-bold">{l.id}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 9. HAIR STYLE */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 tracking-wide uppercase">9. Hair Style</label>
              <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-thin scrollbar-thumb-violet-900/20 scrollbar-track-transparent">
                {HAIR_STYLES.map((h) => {
                  const isSelected = hairStyle === h.id
                  return (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => setHairStyle(h.id)}
                      className={`flex-shrink-0 w-20 h-20 rounded-2xl bg-slate-900/90 border flex flex-col items-center justify-center gap-1.5 transition-all duration-300 ${
                        isSelected 
                          ? 'border-violet-500 bg-violet-955/20 text-violet-455 shadow-[0_0_15px_rgba(139,92,246,0.35)] ring-2 ring-violet-500/50' 
                          : 'border-slate-800/80 hover:border-slate-700 hover:bg-slate-900 text-slate-400'
                      }`}
                    >
                      {h.svg}
                      <span className="text-[10px] font-bold">{h.id}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 10. HAIR COLOR */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 tracking-wide uppercase">10. Hair Color</label>
              <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-thin scrollbar-thumb-violet-900/20 scrollbar-track-transparent">
                {HAIR_COLORS.map((hc) => {
                  const isSelected = hairColor === hc.name
                  return (
                    <button
                      key={hc.name}
                      type="button"
                      onClick={() => setHairColor(hc.name)}
                      className={`flex-shrink-0 w-20 h-20 rounded-2xl bg-slate-900/90 border flex flex-col items-center justify-center gap-1.5 transition-all duration-300 ${
                        isSelected 
                          ? 'border-violet-500 bg-violet-955/20 text-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.35)] ring-2 ring-violet-500/50' 
                          : 'border-slate-800/80 hover:border-slate-700 hover:bg-slate-900 text-slate-400'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full border border-slate-955 shadow-md" style={{ backgroundColor: hc.hex }} />
                      <span className="text-[10px] font-bold">{hc.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 11. BODY TYPE */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 tracking-wide uppercase">11. Body Silhouette</label>
              <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-thin scrollbar-thumb-violet-900/20 scrollbar-track-transparent">
                {BODY_TYPES.map((b) => {
                  const isSelected = bodyType === b.id
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setBodyType(b.id)}
                      className={`flex-shrink-0 w-20 h-20 rounded-2xl bg-slate-900/90 border flex flex-col items-center justify-center gap-1.5 transition-all duration-300 ${
                        isSelected 
                          ? 'border-violet-500 bg-violet-955/20 text-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.35)] ring-2 ring-violet-500/50' 
                          : 'border-slate-800/80 hover:border-slate-700 hover:bg-slate-900 text-slate-400'
                      }`}
                    >
                      {b.svg}
                      <span className="text-[10px] font-bold">{b.id}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 12. STYLE/VIBE */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 tracking-wide uppercase">12. Style & Vibe</label>
              <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-thin scrollbar-thumb-violet-900/20 scrollbar-track-transparent">
                {STYLE_VIBES.map((vib) => {
                  const isSelected = styleVibe === vib.id
                  return (
                    <button
                      key={vib.id}
                      type="button"
                      onClick={() => setStyleVibe(vib.id)}
                      className={`flex-shrink-0 w-24 h-24 rounded-2xl bg-slate-900/90 border flex flex-col items-center justify-center gap-1.5 transition-all duration-300 ${
                        isSelected 
                          ? 'border-violet-500 bg-violet-950/20 text-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.35)] ring-2 ring-violet-500/50' 
                          : 'border-slate-800/80 hover:border-slate-700 hover:bg-slate-900 text-slate-400'
                      }`}
                    >
                      {vib.svg}
                      <span className="text-[9px] font-bold text-center tracking-tight px-1">{vib.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Generate Trigger */}
            <div className="pt-6 border-t border-slate-900">
              <button
                type="button"
                onClick={handleGeneratePreview}
                disabled={previewLoading || !name.trim()}
                className="w-full py-4.5 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-blue-500 hover:opacity-95 text-white font-extrabold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-3 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed text-base cursor-pointer"
              >
                {previewLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Generating Avatar Portrait...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 text-white" />
                    <span>Generate Portrait</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* Right Column: Game-like character studio output canvas (5 cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            <div className="bg-slate-950/40 border border-slate-900/50 p-6 rounded-3xl backdrop-blur-xl space-y-6 flex flex-col min-h-[500px] justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Studio Output Canvas</h3>
                
                <div className="relative aspect-square w-full bg-slate-900/60 rounded-2xl overflow-hidden border border-slate-900 flex items-center justify-center shadow-inner">
                  {previewLoading ? (
                    <div className="flex flex-col items-center justify-center p-6 text-center space-y-4">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full border-4 border-violet-500/20 border-t-violet-500 animate-spin" />
                        <Sparkles className="absolute inset-0 m-auto h-6 w-6 text-violet-400 animate-pulse" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-white">Generating AI Portrait</p>
                        <p className="text-xs text-slate-550 animate-pulse">{pipelineState || 'Calling gpt-image-1 API...'}</p>
                      </div>
                    </div>
                  ) : previewImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={previewImageUrl}
                      alt="AI portrait headshot preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-6 text-slate-500 text-sm space-y-2">
                      <Sparkles className="h-8 w-8 text-slate-700 mx-auto" />
                      <p>No preview generated yet.</p>
                      <p className="text-xs text-slate-650 max-w-[200px] mx-auto">Select traits and click "Generate Portrait" on the left to generate your avatar.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons below image (Save Avatar / Regenerate) */}
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
                        <Save className="h-5 w-5 text-white" />
                        <span>Save Avatar</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleGeneratePreview}
                    disabled={previewLoading}
                    className="w-full py-3 bg-slate-900 border border-slate-800 hover:border-violet-500/40 text-slate-200 font-bold rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm cursor-pointer"
                  >
                    <RefreshCw className="h-4 w-4 text-violet-450" />
                    <span>Regenerate</span>
                  </button>
                </div>
              )}
            </div>

            {/* Prompt Suffix Info Card */}
            <div className="p-5 rounded-3xl bg-slate-950/40 border border-slate-900/50 backdrop-blur-xl text-slate-400 text-xs leading-relaxed space-y-1.5">
              <span className="font-extrabold text-[10px] uppercase tracking-wide text-slate-200 block">Automatic Generation Style:</span>
              <p>
                Every avatar is generated as a lifestyle close-up headshot with natural candid lighting, natural pose looking slightly away, and professional editorial blur.
              </p>
            </div>

          </div>

        </div>

      </main>

      {showSuccess && (
        <div className="fixed inset-0 bg-[#060814]/95 backdrop-blur-md z-[100] flex flex-col items-center justify-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-violet-600 to-blue-500 flex items-center justify-center shadow-lg shadow-violet-500/30 animate-bounce">
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
