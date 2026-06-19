"use client"

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Sparkles, User, Lock, Mail, CheckCircle, ArrowRight, ShieldCheck, Zap } from 'lucide-react'

export default function Home() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)
    setSuccessMsg(null)

    try {
      // --- DEMO MODE BYPASS ---
      // If the URL is still the placeholder or undefined, bypass auth for testing.
      const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'your-supabase-project-url'
      
      if (isDemoMode) {
        console.warn("Running in DEMO MODE. Bypassing real authentication.")
        await new Promise(res => setTimeout(res, 800)) // Simulate network delay
        router.push('/dashboard')
        return
      }
      // -------------------------

      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/api/auth/callback`,
          },
        })

        if (error) {
          setErrorMsg(error.message)
        } else if (data?.user && data.session === null) {
          setSuccessMsg("Check your inbox to verify your email address and claim your 10 free credits!")
          setEmail('')
          setPassword('')
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
    <main className="flex-1 min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background Gradient Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-900/30 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-900/20 blur-[120px] pointer-events-none" />

      {/* Header / Navbar */}
      <header className="border-b border-slate-900 backdrop-blur-md bg-slate-950/60 sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-tr from-violet-600 to-cyan-500 p-2 rounded-xl shadow-lg shadow-violet-500/20">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              AI Influencer Studio
            </span>
          </div>
          <div className="text-sm font-medium text-slate-400 flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-800">
            <Zap className="h-4 w-4 text-amber-400 fill-amber-400" />
            Get 10 Free Credits on Signup
          </div>
        </div>
      </header>

      {/* Hero & Authentication Section */}
      <div className="max-w-7xl mx-auto w-full px-6 py-12 lg:py-24 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Side: Copy and Features */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-violet-900/50 text-violet-300 border border-violet-800/60">
              ⚡ Powered by Flux & GPT-4o Vision
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
              Launch Your Next <br />
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                AI Influencer Persona
              </span>
            </h1>
            <p className="text-lg text-slate-400 max-w-xl">
              Create highly consistent AI characters, morph their bodies, choose their styles, and swap faces perfectly using our state-of-the-art vision integration.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3 p-4 rounded-2xl bg-slate-900/40 border border-slate-900/80 hover:border-slate-800/80 transition-all duration-300">
              <CheckCircle className="h-6 w-6 text-violet-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-slate-200">Custom Attributes</h4>
                <p className="text-xs text-slate-400">Configure name, age, hair, skin, vibe and style settings.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 rounded-2xl bg-slate-900/40 border border-slate-900/80 hover:border-slate-800/80 transition-all duration-300">
              <CheckCircle className="h-6 w-6 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-slate-200">Perfect Face Swap</h4>
                <p className="text-xs text-slate-400">Upload a face reference to map the identity onto new scenes.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 rounded-2xl bg-slate-900/40 border border-slate-900/80 hover:border-slate-800/80 transition-all duration-300">
              <CheckCircle className="h-6 w-6 text-fuchsia-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-slate-200">10 Free Credits</h4>
                <p className="text-xs text-slate-400">Start creating immediately with 10 free credits on sign up.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 rounded-2xl bg-slate-900/40 border border-slate-900/80 hover:border-slate-800/80 transition-all duration-300">
              <CheckCircle className="h-6 w-6 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-slate-200">Instant Download</h4>
                <p className="text-xs text-slate-400">Export high-resolution images in one click directly to your device.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="lg:col-span-5 w-full flex justify-center">
          <div className="w-full max-w-md p-8 rounded-3xl bg-slate-900/50 backdrop-blur-xl border border-slate-800/60 shadow-2xl relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-violet-600/10 rounded-full blur-2xl -z-10" />
            
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-2xl font-bold text-white tracking-tight">
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
                    className="w-full pl-11 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-2xl text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
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
                    className="w-full pl-11 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-2xl text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold rounded-2xl shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex justify-center items-center gap-2 group"
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

            <div className="mt-8 pt-6 border-t border-slate-900 text-center">
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp)
                  setErrorMsg(null)
                  setSuccessMsg(null)
                }}
                className="text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors"
              >
                {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-8 px-6 text-center text-xs text-slate-500 mt-auto bg-slate-950/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2 text-slate-400">
            <ShieldCheck className="h-4 w-4 text-violet-500" />
            <span>Secured Authentication by Supabase.</span>
          </div>
          <span>&copy; {new Date().getFullYear()} AI Influencer Studio. All rights reserved.</span>
        </div>
      </footer>
    </main>
  )
}
