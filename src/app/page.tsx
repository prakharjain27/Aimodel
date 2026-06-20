"use client"

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Sparkles, User, Lock, Mail, CheckCircle, ArrowRight, ShieldCheck, Zap, AtSign, X } from 'lucide-react'

export default function Home() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  
  // Auth Form State
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  
  // CTA input state
  const [ctaEmail, setCtaEmail] = useState('')
  
  const router = useRouter()
  const supabase = createClient()

  // Open modal and prefill email if typed in CTA
  const handleOpenAuth = (signUpMode: boolean, prefillEmail = '') => {
    setIsSignUp(signUpMode)
    if (prefillEmail) {
      setEmail(prefillEmail)
    }
    setErrorMsg(null)
    setSuccessMsg(null)
    setIsAuthModalOpen(true)
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)
    setSuccessMsg(null)

    // Form Client-side Validations
    if (isSignUp) {
      if (!fullName.trim()) {
        setErrorMsg("Full name is required.")
        setLoading(false)
        return
      }
      const cleanUsername = username.trim().replace(/^@/, '')
      if (!cleanUsername) {
        setErrorMsg("Username is required.")
        setLoading(false)
        return
      }
      if (cleanUsername.length < 3 || cleanUsername.length > 15) {
        setErrorMsg("Username must be between 3 and 15 characters.")
        setLoading(false)
        return
      }
      if (!/^[a-zA-Z0-9_]+$/.test(cleanUsername)) {
        setErrorMsg("Username can only contain letters, numbers, and underscores.")
        setLoading(false)
        return
      }
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.")
      setLoading(false)
      return
    }

    try {
      // --- DEMO MODE BYPASS ---
      const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'your-supabase-project-url'
      
      if (isDemoMode) {
        console.warn("Running in DEMO MODE. Bypassing real authentication.")
        await new Promise(res => setTimeout(res, 800)) // Simulate network delay
        
        const cleanUsername = username.trim().replace(/^@/, '')
        const demoUser = {
          email,
          fullName: isSignUp ? fullName.trim() : (email.split('@')[0] || 'Demo User'),
          username: isSignUp ? cleanUsername : (email.split('@')[0] || 'demouser')
        }
        
        document.cookie = `demo_session=${encodeURIComponent(JSON.stringify(demoUser))}; path=/; max-age=86400`
        router.push('/dashboard')
        router.refresh()
        return
      }
      // -------------------------

      if (isSignUp) {
        const cleanUsername = username.trim().replace(/^@/, '')
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/api/auth/callback`,
            data: {
              full_name: fullName.trim(),
              username: cleanUsername,
            }
          },
        })

        if (error) {
          setErrorMsg(error.message)
        } else if (data?.user && data.session === null) {
          setSuccessMsg("Check your inbox to verify your email address and claim your 10 free credits!")
          setEmail('')
          setPassword('')
          setFullName('')
          setUsername('')
        } else if (data?.user && data.session) {
          router.push('/dashboard')
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          setErrorMsg(error.message)
        } else if (data?.user) {
          router.push('/dashboard')
        }
      }
    } catch (err: any) {
      console.error('Authentication request error:', err)
      const errStr = String(err)
      if (errStr.includes('Failed to fetch') || err.message?.includes('Failed to fetch')) {
        setErrorMsg("Failed to connect to Supabase database. Please open the '.env.local' file in your project folder and replace the placeholder keys with your actual Supabase Project API credentials.")
      } else {
        setErrorMsg(err.message || "A network error occurred. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex-1 min-h-screen text-slate-100 flex flex-col relative overflow-hidden bg-[#0A0F1E] font-sans">
      
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-16 py-5 bg-[#0A0F1E]/70 backdrop-blur-md border-b border-violet-900/20">
        <div className="logo font-extrabold text-2xl tracking-tight bg-gradient-to-br from-white to-[#EC4899] bg-clip-text text-transparent cursor-pointer" style={{ fontFamily: "'Syne', sans-serif" }} onClick={() => router.push('/')}>
          InfluenceAI
        </div>
        <div className="hidden md:flex items-center gap-8 nav-links">
          <a href="#features" className="text-[#8B92A8] text-sm font-medium hover:text-white transition-colors">Features</a>
          <a href="#how" className="text-[#8B92A8] text-sm font-medium hover:text-white transition-colors">How it works</a>
          <a href="#proof" className="text-[#8B92A8] text-sm font-medium hover:text-white transition-colors">Reviews</a>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => handleOpenAuth(false)} className="text-sm font-semibold text-slate-300 hover:text-white transition-colors px-3 py-1.5">
            Sign In
          </button>
          <button onClick={() => handleOpenAuth(true)} className="nav-cta bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white border-none px-6 py-2.5 rounded-lg text-sm font-semibold cursor-pointer hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-violet-600/20 transition-all">
            Start Free →
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-32 pb-20 relative overflow-hidden hero">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.3)_0%,rgba(236,72,153,0.15)_50%,transparent_75%)] pointer-events-none animate-pulse-orb -z-10" />
        <div className="absolute top-[30%] left-[60%] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(236,72,153,0.2)_0%,transparent_70%)] pointer-events-none animate-float-orb -z-10" />

        <div className="hero-badge inline-flex items-center gap-2 bg-[#7C3AED]/15 border border-[#7C3AED]/40 px-4 py-1.5 rounded-full text-xs font-semibold text-[#C4B5FD] mb-8 relative z-10">
          <span className="badge-dot w-2 h-2 rounded-full bg-[#EC4899] animate-blink-dot" />
          AI-powered influencer engine — now live
        </div>

        <h1 className="font-extrabold text-5xl md:text-8xl tracking-tight leading-[1.0] select-none relative z-10 mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>
          <span className="block text-white">Your AI Influencer,</span>
          <span className="block bg-gradient-to-r from-[#9D5FF0] to-[#EC4899] bg-clip-text text-transparent">Always On.</span>
        </h1>

        <p className="text-[#8B92A8] text-lg md:text-xl max-w-xl mx-auto leading-relaxed mb-10 relative z-10">
          Create viral content, grow your audience, and monetize your influence — all on autopilot. No burnout. No creative blocks.
        </p>

        <div className="flex gap-4 justify-center flex-wrap relative z-10 hero-actions">
          <button onClick={() => handleOpenAuth(true)} className="btn-primary bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white border-none px-9 py-4 rounded-xl text-base font-bold cursor-pointer hover:-translate-y-0.5 transition-all shadow-[0_0_40px_rgba(124,58,237,0.4)] hover:shadow-[0_0_60px_rgba(124,58,237,0.6)] active:translate-y-0">
            Launch Your AI Influencer →
          </button>
          <button onClick={() => handleOpenAuth(false)} className="btn-ghost bg-transparent border border-white/15 text-white px-9 py-4 rounded-xl text-base font-semibold cursor-pointer hover:border-white/30 hover:bg-white/5 transition-all">
            See a Demo
          </button>
        </div>

        <div className="flex gap-12 justify-center flex-wrap mt-16 relative z-10 hero-stats">
          <div className="stat">
            <div className="stat-num font-extrabold text-4xl bg-gradient-to-br from-white to-[#9D5FF0] bg-clip-text text-transparent" style={{ fontFamily: "'Syne', sans-serif" }}>10x</div>
            <div className="stat-label text-xs text-[#8B92A8] mt-1">More content output</div>
          </div>
          <div className="stat">
            <div className="stat-num font-extrabold text-4xl bg-gradient-to-br from-white to-[#9D5FF0] bg-clip-text text-transparent" style={{ fontFamily: "'Syne', sans-serif" }}>3.2M+</div>
            <div className="stat-label text-xs text-[#8B92A8] mt-1">Posts generated</div>
          </div>
          <div className="stat">
            <div className="stat-num font-extrabold text-4xl bg-gradient-to-br from-white to-[#9D5FF0] bg-clip-text text-transparent" style={{ fontFamily: "'Syne', sans-serif" }}>50K+</div>
            <div className="stat-label text-xs text-[#8B92A8] mt-1">Creators using it</div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-wrap overflow-hidden py-6 border-y border-[#7C3AED]/20 bg-[#0F1629]">
        <div className="marquee flex gap-12 animate-marquee w-max select-none">
          <div className="marquee-item text-xs md:text-sm font-semibold text-[#8B92A8] whitespace-nowrap flex items-center gap-2">🎯 Instagram Reels <span className="text-[#9D5FF0]">•</span></div>
          <div className="marquee-item text-xs md:text-sm font-semibold text-[#8B92A8] whitespace-nowrap flex items-center gap-2">🐦 Twitter / X Threads <span className="text-[#9D5FF0]">•</span></div>
          <div className="marquee-item text-xs md:text-sm font-semibold text-[#8B92A8] whitespace-nowrap flex items-center gap-2">📹 YouTube Shorts <span className="text-[#9D5FF0]">•</span></div>
          <div className="marquee-item text-xs md:text-sm font-semibold text-[#8B92A8] whitespace-nowrap flex items-center gap-2">💼 LinkedIn Posts <span className="text-[#9D5FF0]">•</span></div>
          <div className="marquee-item text-xs md:text-sm font-semibold text-[#8B92A8] whitespace-nowrap flex items-center gap-2">🎵 TikTok Scripts <span className="text-[#9D5FF0]">•</span></div>
          <div className="marquee-item text-xs md:text-sm font-semibold text-[#8B92A8] whitespace-nowrap flex items-center gap-2">📸 Caption Writing <span className="text-[#9D5FF0]">•</span></div>
          <div className="marquee-item text-xs md:text-sm font-semibold text-[#8B92A8] whitespace-nowrap flex items-center gap-2">📈 Hashtag Strategy <span className="text-[#9D5FF0]">•</span></div>
          <div className="marquee-item text-xs md:text-sm font-semibold text-[#8B92A8] whitespace-nowrap flex items-center gap-2">💰 Brand Deal Pitches <span className="text-[#9D5FF0]">•</span></div>
          {/* duplicate for seamless loop */}
          <div className="marquee-item text-xs md:text-sm font-semibold text-[#8B92A8] whitespace-nowrap flex items-center gap-2">🎯 Instagram Reels <span className="text-[#9D5FF0]">•</span></div>
          <div className="marquee-item text-xs md:text-sm font-semibold text-[#8B92A8] whitespace-nowrap flex items-center gap-2">🐦 Twitter / X Threads <span className="text-[#9D5FF0]">•</span></div>
          <div className="marquee-item text-xs md:text-sm font-semibold text-[#8B92A8] whitespace-nowrap flex items-center gap-2">📹 YouTube Shorts <span className="text-[#9D5FF0]">•</span></div>
          <div className="marquee-item text-xs md:text-sm font-semibold text-[#8B92A8] whitespace-nowrap flex items-center gap-2">💼 LinkedIn Posts <span className="text-[#9D5FF0]">•</span></div>
          <div className="marquee-item text-xs md:text-sm font-semibold text-[#8B92A8] whitespace-nowrap flex items-center gap-2">🎵 TikTok Scripts <span className="text-[#9D5FF0]">•</span></div>
          <div className="marquee-item text-xs md:text-sm font-semibold text-[#8B92A8] whitespace-nowrap flex items-center gap-2">📸 Caption Writing <span className="text-[#9D5FF0]">•</span></div>
          <div className="marquee-item text-xs md:text-sm font-semibold text-[#8B92A8] whitespace-nowrap flex items-center gap-2">📈 Hashtag Strategy <span className="text-[#9D5FF0]">•</span></div>
          <div className="marquee-item text-xs md:text-sm font-semibold text-[#8B92A8] whitespace-nowrap flex items-center gap-2">💰 Brand Deal Pitches <span className="text-[#9D5FF0]">•</span></div>
        </div>
      </div>

      {/* FEATURES */}
      <section id="features" className="px-6 md:px-16 py-24 max-w-7xl mx-auto w-full">
        <div className="section-label text-xs font-semibold tracking-[3px] text-[#9D5FF0] uppercase mb-4">What it does</div>
        <h2 className="font-extrabold text-3xl md:text-5xl leading-tight text-white mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>Every tool an influencer needs,<br />powered by AI</h2>
        <p className="text-[#8B92A8] text-base md:text-lg max-w-md leading-relaxed">From content creation to monetization — InfluenceAI handles the grind so you can focus on growth.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16 features-grid">
          
          <div className="feat-card bg-[#0F1629] border border-violet-950/40 rounded-2xl p-8 hover:border-violet-600/50 hover:-translate-y-1 transition-all duration-300 relative group overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#7C3AED] to-[#EC4899] opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="feat-icon w-12 h-12 rounded-xl bg-[#7C3AED]/15 flex items-center justify-center text-xl mb-5">✍️</div>
            <h3 className="font-bold text-lg text-white mb-2.5" style={{ fontFamily: "'Syne', sans-serif" }}>AI Content Generator</h3>
            <p className="text-sm text-[#8B92A8] leading-relaxed">Generate platform-native posts, captions, hooks, and scripts that match your voice and niche — in seconds.</p>
          </div>

          <div className="feat-card bg-[#0F1629] border border-violet-950/40 rounded-2xl p-8 hover:border-violet-600/50 hover:-translate-y-1 transition-all duration-300 relative group overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#7C3AED] to-[#EC4899] opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="feat-icon w-12 h-12 rounded-xl bg-[#7C3AED]/15 flex items-center justify-center text-xl mb-5">📊</div>
            <h3 className="font-bold text-lg text-white mb-2.5" style={{ fontFamily: "'Syne', sans-serif" }}>Viral Score Predictor</h3>
            <p className="text-sm text-[#8B92A8] leading-relaxed">Before you post, see how likely your content is to go viral. Optimize hooks and CTAs with real data.</p>
          </div>

          <div className="feat-card bg-[#0F1629] border border-violet-950/40 rounded-2xl p-8 hover:border-violet-600/50 hover:-translate-y-1 transition-all duration-300 relative group overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#7C3AED] to-[#EC4899] opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="feat-icon w-12 h-12 rounded-xl bg-[#7C3AED]/15 flex items-center justify-center text-xl mb-5">🗓️</div>
            <h3 className="font-bold text-lg text-white mb-2.5" style={{ fontFamily: "'Syne', sans-serif" }}>Auto Content Calendar</h3>
            <p className="text-sm text-[#8B92A8] leading-relaxed">Never think "what do I post today." Your AI fills the calendar with trending content ideas for your niche.</p>
          </div>

          <div className="feat-card bg-[#0F1629] border border-violet-950/40 rounded-2xl p-8 hover:border-violet-600/50 hover:-translate-y-1 transition-all duration-300 relative group overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#7C3AED] to-[#EC4899] opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="feat-icon w-12 h-12 rounded-xl bg-[#7C3AED]/15 flex items-center justify-center text-xl mb-5">🤖</div>
            <h3 className="font-bold text-lg text-white mb-2.5" style={{ fontFamily: "'Syne', sans-serif" }}>Your AI Persona</h3>
            <p className="text-sm text-[#8B92A8] leading-relaxed">Train an AI that writes exactly like you — your tone, slang, humor, and brand voice. Fully yours.</p>
          </div>

          <div className="feat-card bg-[#0F1629] border border-violet-950/40 rounded-2xl p-8 hover:border-violet-600/50 hover:-translate-y-1 transition-all duration-300 relative group overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#7C3AED] to-[#EC4899] opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="feat-icon w-12 h-12 rounded-xl bg-[#7C3AED]/15 flex items-center justify-center text-xl mb-5">💌</div>
            <h3 className="font-bold text-lg text-white mb-2.5" style={{ fontFamily: "'Syne', sans-serif" }}>Brand Deal Outreach</h3>
            <p className="text-sm text-[#8B92A8] leading-relaxed">AI writes personalized pitch emails to brands. Close sponsorships 5x faster with proven templates.</p>
          </div>

          <div className="feat-card bg-[#0F1629] border border-violet-950/40 rounded-2xl p-8 hover:border-violet-600/50 hover:-translate-y-1 transition-all duration-300 relative group overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#7C3AED] to-[#EC4899] opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="feat-icon w-12 h-12 rounded-xl bg-[#7C3AED]/15 flex items-center justify-center text-xl mb-5">📈</div>
            <h3 className="font-bold text-lg text-white mb-2.5" style={{ fontFamily: "'Syne', sans-serif" }}>Growth Analytics</h3>
            <p className="text-sm text-[#8B92A8] leading-relaxed">Know exactly what's working. See which content drives followers, engagement, and real revenue.</p>
          </div>

        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-24 bg-[#0F1629] border-y border-violet-900/20">
        <div className="max-w-7xl mx-auto px-6 md:px-16 w-full">
          <div className="section-label text-xs font-semibold tracking-[3px] text-[#9D5FF0] uppercase mb-4">The process</div>
          <h2 className="font-extrabold text-3xl md:text-5xl text-white mb-16" style={{ fontFamily: "'Syne', sans-serif" }}>Live in 3 steps</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-0 steps relative">
            <div className="hidden md:block absolute top-[28px] left-[16.6%] right-[16.6%] h-[1px] bg-gradient-to-r from-[#7C3AED] to-[#EC4899]" />
            
            <div className="step text-center px-8">
              <div className="step-num w-14 h-14 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#EC4899] flex items-center justify-center font-bold text-xl text-white mx-auto mb-6 relative z-10" style={{ fontFamily: "'Syne', sans-serif" }}>1</div>
              <h3 className="font-bold text-lg text-white mb-2.5" style={{ fontFamily: "'Syne', sans-serif" }}>Set Your Niche</h3>
              <p className="text-sm text-[#8B92A8] leading-relaxed">Tell us your niche, platforms, and audience. The AI builds your custom influence strategy in minutes.</p>
            </div>

            <div className="step text-center px-8">
              <div className="step-num w-14 h-14 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#EC4899] flex items-center justify-center font-bold text-xl text-white mx-auto mb-6 relative z-10" style={{ fontFamily: "'Syne', sans-serif" }}>2</div>
              <h3 className="font-bold text-lg text-white mb-2.5" style={{ fontFamily: "'Syne', sans-serif" }}>Train Your AI</h3>
              <p className="text-sm text-[#8B92A8] leading-relaxed">Feed it your best posts. It learns your voice, style, and what your audience loves — and replicates it at scale.</p>
            </div>

            <div className="step text-center px-8">
              <div className="step-num w-14 h-14 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#EC4899] flex items-center justify-center font-bold text-xl text-white mx-auto mb-6 relative z-10" style={{ fontFamily: "'Syne', sans-serif" }}>3</div>
              <h3 className="font-bold text-lg text-white mb-2.5" style={{ fontFamily: "'Syne', sans-serif" }}>Grow & Earn</h3>
              <p className="text-sm text-[#8B92A8] leading-relaxed">Approve, schedule, and publish. Watch your followers, engagement, and brand deals grow on autopilot.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="proof" className="px-6 md:px-16 py-24 max-w-7xl mx-auto w-full">
        <div className="section-label text-xs font-semibold tracking-[3px] text-[#9D5FF0] uppercase mb-4">Real creators</div>
        <h2 className="font-extrabold text-3xl md:text-5xl leading-tight text-white mb-16" style={{ fontFamily: "'Syne', sans-serif" }}>They blew up.<br />You're next.</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 testimonials">
          
          <div className="testi-card bg-[#0F1629] border border-violet-950/40 rounded-2xl p-8 flex flex-col justify-between">
            <div>
              <div className="stars text-[#EC4899] text-sm mb-4">★★★★★</div>
              <p className="text-sm md:text-base leading-relaxed text-[#F8F9FF] mb-6">"I went from 2K to 85K followers in 4 months. InfluenceAI generates content that sounds exactly like me — my audience can't even tell."</p>
            </div>
            <div className="testi-author flex items-center gap-3">
              <div className="testi-avatar w-10 h-10 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#EC4899] flex items-center justify-center text-sm font-bold text-white">P</div>
              <div>
                <div className="testi-name text-sm font-semibold text-white">Priya Sharma</div>
                <div className="testi-handle text-xs text-[#8B92A8]">@priyacreates · Lifestyle</div>
              </div>
            </div>
          </div>

          <div className="testi-card bg-[#0F1629] border border-violet-950/40 rounded-2xl p-8 flex flex-col justify-between">
            <div>
              <div className="stars text-[#EC4899] text-sm mb-4">★★★★★</div>
              <p className="text-sm md:text-base leading-relaxed text-[#F8F9FF] mb-6">"Closed 3 brand deals in my first month using the AI pitch tool. Made back 100x my subscription in one week."</p>
            </div>
            <div className="testi-author flex items-center gap-3">
              <div className="testi-avatar w-10 h-10 rounded-full bg-gradient-to-br from-[#0EA5E9] to-[#7C3AED] flex items-center justify-center text-sm font-bold text-white">R</div>
              <div>
                <div className="testi-name text-sm font-semibold text-white">Rahul Mehra</div>
                <div className="testi-handle text-xs text-[#8B92A8]">@rahultech · Tech & Finance</div>
              </div>
            </div>
          </div>

          <div className="testi-card bg-[#0F1629] border border-violet-950/40 rounded-2xl p-8 flex flex-col justify-between">
            <div>
              <div className="stars text-[#EC4899] text-sm mb-4">★★★★★</div>
              <p className="text-sm md:text-base leading-relaxed text-[#F8F9FF] mb-6">"I post 3x more content now and spend 80% less time. The viral score predictor alone changed everything for me."</p>
            </div>
            <div className="testi-author flex items-center gap-3">
              <div className="testi-avatar w-10 h-10 rounded-full bg-gradient-to-br from-[#EC4899] to-[#F97316] flex items-center justify-center text-sm font-bold text-white">Z</div>
              <div>
                <div className="testi-name text-sm font-semibold text-white">Zara Khan</div>
                <div className="testi-handle text-xs text-[#8B92A8]">@zarafitness · Health & Wellness</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="cta-section py-28 px-6 text-center relative overflow-hidden bg-[#0A0F1E]">
        <div className="cta-orb absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(236,72,153,0.15)_0%,transparent_70%)] pointer-events-none -z-10" />
        <h2 className="font-extrabold text-4xl md:text-7xl leading-tight text-white mb-5 relative z-10" style={{ fontFamily: "'Syne', sans-serif" }}>
          Ready to become an<br />
          <em className="not-italic bg-gradient-to-r from-[#9D5FF0] to-[#EC4899] bg-clip-text text-transparent">AI-powered influencer?</em>
        </h2>
        <p className="text-[#8B92A8] text-base md:text-lg mb-10 relative z-10">Join 50,000+ creators who grow on autopilot. Start free, no credit card needed.</p>
        <div className="cta-form flex gap-3 justify-center flex-wrap relative z-10">
          <input 
            type="email" 
            placeholder="Enter your email address" 
            value={ctaEmail}
            onChange={(e) => setCtaEmail(e.target.value)}
            className="bg-white/5 border border-white/10 text-white px-5 py-3.5 rounded-xl text-sm w-[300px] outline-none focus:border-[#7C3AED] transition-colors"
          />
          <button onClick={() => handleOpenAuth(true, ctaEmail)} className="btn-primary bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white border-none px-8 py-3.5 rounded-xl text-sm font-semibold cursor-pointer hover:opacity-90 shadow-lg shadow-violet-600/20 transition-all">
            Launch for Free →
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-6 md:px-16 py-10 border-t border-violet-900/20 flex flex-col md:flex-row items-center justify-between gap-6 bg-[#0A0F1E]">
        <div className="logo font-extrabold text-xl tracking-tight bg-gradient-to-br from-white to-[#EC4899] bg-clip-text text-transparent" style={{ fontFamily: "'Syne', sans-serif" }}>
          InfluenceAI
        </div>
        <div className="flex gap-6 footer-links">
          <a href="#" className="text-xs text-[#8B92A8] hover:text-white transition-colors">Privacy</a>
          <a href="#" className="text-xs text-[#8B92A8] hover:text-white transition-colors">Terms</a>
          <a href="#" className="text-xs text-[#8B92A8] hover:text-white transition-colors">Support</a>
          <a href="#" className="text-xs text-[#8B92A8] hover:text-white transition-colors">Blog</a>
        </div>
        <p className="text-xs text-[#8B92A8]">© 2026 InfluenceAI. All rights reserved.</p>
      </footer>

      {/* AUTH MODAL */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 bg-[#0A0F1E]/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-md p-8 rounded-3xl bg-[#0F1629]/95 border border-violet-900/30 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button 
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition-colors p-1.5 rounded-lg hover:bg-white/5"
              title="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center space-y-2 mb-8">
              <h2 className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
                {isSignUp ? 'Create your Studio Account' : 'Welcome Back'}
              </h2>
              <p className="text-sm text-slate-400">
                {isSignUp 
                  ? 'Sign up now and receive 10 free creation credits' 
                  : 'Sign in to access your influencer dashboard'}
              </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-5">
              {errorMsg && (
                <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-900/60 text-rose-200 text-sm">
                  {errorMsg}
                </div>
              )}

              {successMsg && (
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-900/60 text-emerald-200 text-sm flex flex-col gap-1.5">
                  <span className="font-semibold">Registration Successful!</span>
                  <span>{successMsg}</span>
                </div>
              )}

              {isSignUp && (
                <>
                  <div className="space-y-1.5 transition-all">
                    <label className="text-xs font-semibold text-slate-300 tracking-wide uppercase">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <User className="h-5 w-5" />
                      </div>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full pl-11 pr-4 py-3 bg-[#0A0F1E]/80 border border-violet-900/20 rounded-2xl text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-[#7C3AED] transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 transition-all">
                    <label className="text-xs font-semibold text-slate-300 tracking-wide uppercase">Username</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <AtSign className="h-5 w-5" />
                      </div>
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => {
                          let val = e.target.value
                          if (val === '@') {
                            setUsername('')
                          } else if (val && !val.startsWith('@')) {
                            setUsername('@' + val.replace(/\s+/g, ''))
                          } else {
                            setUsername(val.replace(/\s+/g, ''))
                          }
                        }}
                        placeholder="@username"
                        className="w-full pl-11 pr-4 py-3 bg-[#0A0F1E]/80 border border-violet-900/20 rounded-2xl text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-[#7C3AED] transition-all"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 tracking-wide uppercase">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-11 pr-4 py-3 bg-[#0A0F1E]/80 border border-violet-900/20 rounded-2xl text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-[#7C3AED] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 tracking-wide uppercase">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3 bg-[#0A0F1E]/80 border border-violet-900/20 rounded-2xl text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-[#7C3AED] transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-[#7C3AED] to-[#EC4899] hover:opacity-90 text-white font-bold rounded-2xl shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex justify-center items-center gap-2 group"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{isSignUp ? 'Get Started Free' : 'Sign In'}</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-violet-950/20 text-center">
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp)
                  setErrorMsg(null)
                  setSuccessMsg(null)
                }}
                className="text-sm font-medium text-[#9D5FF0] hover:text-[#7C3AED] transition-colors"
              >
                {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
