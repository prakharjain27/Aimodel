import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { Sparkles, Plus, Image as ImageIcon, Coins, LogOut, ArrowRight, UserCircle, Download, Play, Video } from 'lucide-react'
import CharacterActions from '@/components/CharacterActions'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()

  // --- DEMO MODE CHECK ---
  const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'your-supabase-project-url'

  let user: any = null
  let credits = 0
  let characters: any[] | null = []
  let generations: any[] | null = []

  if (isDemoMode) {
    const cookieStore = await cookies()
    const demoSessionStr = cookieStore.get('demo_session')?.value
    let demoUser = { email: 'demo-user@studio.ai', fullName: 'Demo User', username: 'demouser' }
    if (demoSessionStr) {
      try {
        demoUser = JSON.parse(decodeURIComponent(demoSessionStr))
      } catch (e) {
        console.error("Failed to parse demo session cookie:", e)
      }
    }
    user = demoUser
    credits = 10

    // Mock characters in demo mode
    characters = [
      {
        id: 'char-1',
        name: 'Mia Jenkins',
        gender: 'Female',
        age: 24,
        height: 168,
        skin_tone: 'Olive',
        body_type: 'Slim/Athletic',
        face_shape: 'Chiseled',
        hair_color_style: 'Blonde / Long Wavy',
        eye_color: 'Blue',
        tattoos: 'Cybernetic Glow',
        style_vibe: 'Cyberpunk Techwear',
        reference_image_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80'
      },
      {
        id: 'char-2',
        name: 'David Chen',
        gender: 'Male',
        age: 27,
        height: 182,
        skin_tone: 'Fair',
        body_type: 'Muscular/Fit',
        face_shape: 'Oval',
        hair_color_style: 'Black / Crew Cut',
        eye_color: 'Brown',
        tattoos: 'Full Sleeve',
        style_vibe: 'High-Fashion Streetwear',
        reference_image_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80'
      }
    ]

    // Mock generations in demo mode
    generations = [
      {
        id: 'gen-1',
        output_image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&q=80',
        prompt: 'Walking through a neon-lit Tokyo street, wearing futuristic cyber streetwear, heavy rain, dramatic reflections',
        characters: { name: 'Mia Jenkins' }
      },
      {
        id: 'gen-2',
        output_image_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=1000&q=80',
        prompt: 'Relaxing on a luxury yacht deck in Monaco, sunny afternoon, wearing a white linen outfit',
        characters: { name: 'David Chen' }
      }
    ]
  } else {
    // Verify authentication
    const { data } = await supabase.auth.getUser()
    user = data.user
    
    if (!user) {
      redirect('/')
    }

    // Fetch user profile (credits)
    let { data: profile } = await supabase
      .from('profiles')
      .select('credits, full_name, username')
      .maybeSingle()

    if (!profile && user) {
      // Auto-create missing profile
      const { data: newProfile } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email,
          credits: 10,
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          username: user.user_metadata?.username || user.email?.split('@')[0] || 'user'
        })
        .select('credits, full_name, username')
        .maybeSingle()
      
      if (newProfile) {
        profile = newProfile
      }
    }

    credits = profile?.credits ?? 10
    user = {
      ...user,
      fullName: profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
      username: profile?.username || user.user_metadata?.username || user.email?.split('@')[0] || 'user'
    }

    // Fetch user characters
    const { data: chars } = await supabase
      .from('characters')
      .select('*')
      .order('created_at', { ascending: false })
    characters = chars

    // Fetch recent generations
    const { data: gens } = await supabase
      .from('generations')
      .select('*, characters(name)')
      .order('created_at', { ascending: false })
    generations = gens
  }

  // Logout action handler
  async function signOut() {
    'use server'
    const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'your-supabase-project-url'
    if (isDemoMode) {
      const cookieStore = await cookies()
      cookieStore.delete('demo_session')
    } else {
      const supabase = await createClient()
      await supabase.auth.signOut()
    }
    redirect('/')
  }

  return (
    <div className="flex-1 min-h-screen bg-[#0A0F1E] text-slate-100 flex flex-col relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-violet-900/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-900/10 blur-[130px] pointer-events-none" />

      {/* Navigation */}
      <header className="border-b border-violet-900/20 bg-[#0A0F1E]/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-tr from-violet-600 to-[#EC4899] p-2 rounded-xl group-hover:scale-105 transition-all shadow-md shadow-violet-500/10">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-white" style={{ fontFamily: "'Syne', sans-serif" }}>AI Influencer Studio</span>
          </Link>

          <div className="flex items-center space-x-4">
            {/* Credit Counter */}
            <div className="flex items-center space-x-2 bg-slate-900/80 border border-violet-900/20 px-3.5 py-1.5 rounded-full">
              <Coins className="h-4.5 w-4.5 text-amber-400" />
              <span className="text-sm font-semibold text-slate-200">
                {credits} <span className="text-slate-500 font-normal">Credits</span>
              </span>
            </div>

            {/* User Profile */}
            <div className="hidden md:flex flex-col items-end text-xs mr-1">
              <span className="font-bold text-slate-200">{user.fullName}</span>
              <span className="text-slate-500 font-medium">@{user.username}</span>
            </div>
            <div className="hidden sm:flex items-center space-x-2 text-slate-400 text-sm bg-slate-900/40 border border-slate-900/80 px-3.5 py-1.5 rounded-full" title={user.email}>
              <UserCircle className="h-4.5 w-4.5 text-violet-500" />
              <span className="max-w-[120px] truncate text-slate-300 font-semibold">{user.email}</span>
            </div>

            {/* Logout Button */}
            <form action={signOut}>
              <button
                type="submit"
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-xl border border-transparent hover:border-rose-900/30 transition-all"
                title="Log out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full px-6 py-10 space-y-12 relative z-10 flex-1">
        
        {/* Welcome & Dashboard Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#0F1629]/50 border border-violet-900/10 p-6 md:p-8 rounded-3xl backdrop-blur-md">
          <div className="space-y-1.5">
            <h1 className="text-3xl font-extrabold text-white tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
              Welcome, {user.fullName.split(' ')[0]}!
            </h1>
            <p className="text-sm text-[#8B92A8] max-w-xl">
              Design custom virtual characters, generate high-fidelity photos in varied scenarios, or render AI videos instantly.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard/create"
              className="flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-violet-600 to-[#EC4899] hover:opacity-90 text-white font-bold rounded-2xl shadow-lg shadow-violet-500/10 transition-all active:scale-[0.98] text-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Create AI Character</span>
            </Link>
            <Link
              href="/dashboard/generate"
              className="flex items-center space-x-2 px-5 py-3 bg-slate-900 border border-slate-800 hover:border-violet-500/40 text-slate-200 font-bold rounded-2xl transition-all active:scale-[0.98] text-sm"
            >
              <ImageIcon className="h-4 w-4 text-violet-400" />
              <span>Generate Image</span>
            </Link>
            <Link
              href="/dashboard/video"
              className="flex items-center space-x-2 px-5 py-3 bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-200 font-bold rounded-2xl transition-all active:scale-[0.98] text-sm"
            >
              <Video className="h-4 w-4 text-cyan-400" />
              <span>Generate Video</span>
            </Link>
          </div>
        </div>

        {/* Characters Grid */}
        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2" style={{ fontFamily: "'Syne', sans-serif" }}>
              <span className="w-1.5 h-6 bg-violet-600 rounded-full" />
              My AI Influencers
            </h2>
            <span className="text-xs text-slate-500">{characters?.length || 0} characters saved</span>
          </div>

          {characters && characters.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {characters.map((char) => (
                <div
                  key={char.id}
                  className="group block rounded-3xl bg-[#0F1629]/40 border border-violet-900/10 hover:border-violet-600/30 hover:bg-[#0F1629]/80 transition-all duration-300 overflow-hidden shadow-md relative"
                >
                  <div className="aspect-[4/3] w-full bg-slate-950 relative overflow-hidden">
                    {/* Character Card Image */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={char.reference_image_url}
                      alt={char.name}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-103"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-85" />
                    
                    {/* Edit and Delete Actions */}
                    <CharacterActions id={char.id} />

                    {/* Overlay Details */}
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                      <div>
                        <h3 className="text-xl font-bold text-white tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>{char.name}</h3>
                        <p className="text-xs text-[#9D5FF0] font-semibold">{char.style_vibe}</p>
                      </div>
                      <div className="flex gap-2">
                        <Link 
                          href={`/dashboard/generate?character=${char.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-md shadow-violet-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                          <ImageIcon className="h-3.5 w-3.5" /> Photo
                        </Link>
                        <Link 
                          href={`/dashboard/video?character=${char.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md shadow-cyan-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                          <Play className="h-3 w-3 fill-white" /> Video
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Character Properties Panel */}
                  <div className="p-5 grid grid-cols-2 gap-y-3 gap-x-4 text-xs border-t border-violet-900/10 bg-[#0F1629]/20">
                    <div>
                      <span className="text-[#8B92A8] block mb-0.5">Gender / Age</span>
                      <span className="font-semibold text-slate-300">{char.gender || 'Female'} / {char.age} yrs</span>
                    </div>
                    <div>
                      <span className="text-[#8B92A8] block mb-0.5">Body / Height</span>
                      <span className="font-semibold text-slate-300 truncate block">{char.body_type} / {char.height || 170}cm</span>
                    </div>
                    <div>
                      <span className="text-[#8B92A8] block mb-0.5">Hair Style</span>
                      <span className="font-semibold text-slate-300 truncate block">{char.hair_color_style}</span>
                    </div>
                    <div>
                      <span className="text-[#8B92A8] block mb-0.5">Eye / Tattoos</span>
                      <span className="font-semibold text-slate-300 truncate block">{char.eye_color} / {char.tattoos || 'None'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-violet-900/20 py-16 text-center bg-[#0F1629]/10 space-y-4">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-slate-650">
                <UserCircle className="h-8 w-8 text-violet-500" />
              </div>
              <div className="max-w-sm mx-auto space-y-1">
                <h3 className="font-bold text-slate-200">No Characters Yet</h3>
                <p className="text-sm text-[#8B92A8]">Create your first AI influencer character to generate high-fidelity photos & videos.</p>
              </div>
              <Link
                href="/dashboard/create"
                className="inline-flex items-center space-x-2 text-sm font-semibold text-violet-400 hover:text-violet-300 transition-colors"
              >
                <span>Define character parameters</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </section>

        {/* Recent Generations Grid */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2" style={{ fontFamily: "'Syne', sans-serif" }}>
            <span className="w-1.5 h-6 bg-cyan-500 rounded-full" />
            Recent Creations
          </h2>

          {generations && generations.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {generations.map((gen) => (
                <div
                  key={gen.id}
                  className="group relative rounded-2xl border border-violet-900/10 bg-[#0F1629]/40 overflow-hidden shadow transition-all duration-300 hover:border-violet-600/30"
                >
                  <div className="aspect-[3/4] w-full bg-slate-950 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={gen.output_image_url}
                      alt={gen.prompt}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Download & Info Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                      <div className="self-end">
                        <a
                          href={gen.output_image_url}
                          download={`generation-${gen.id}.webp`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:bg-slate-800 hover:text-cyan-400 text-white transition-all flex items-center justify-center shadow-lg"
                          title="Download Image"
                        >
                          <Download className="h-4 w-4" />
                        </a>
                      </div>
                      
                      <div className="space-y-1">
                        <span className="text-xs font-semibold text-cyan-450 block truncate">
                          {gen.characters?.name || 'Character'}
                        </span>
                        <p className="text-[10px] text-[#8B92A8] line-clamp-2 leading-relaxed" title={gen.prompt}>
                          {gen.prompt}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-violet-900/20 py-16 text-center bg-[#0F1629]/10 space-y-4">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-slate-650">
                <ImageIcon className="h-8 w-8 text-cyan-500" />
              </div>
              <div className="max-w-sm mx-auto space-y-1">
                <h3 className="font-bold text-slate-200">No Creations Yet</h3>
                <p className="text-sm text-[#8B92A8]">Go to an influencer's page to generate images of them in custom situations.</p>
              </div>
            </div>
          )}
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-violet-900/20 py-8 px-6 text-center text-xs text-slate-500 mt-auto bg-[#0F1629]/30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <span>&copy; {new Date().getFullYear()} AI Influencer Studio. All rights reserved.</span>
          <span className="text-[#8B92A8]">Your AI Influencer, Always On.</span>
        </div>
      </footer>
    </div>
  )
}
