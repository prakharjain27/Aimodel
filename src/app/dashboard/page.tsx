import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { Sparkles, Plus, Image as ImageIcon, Coins, LogOut, ArrowRight, UserCircle, Download, Clock } from 'lucide-react'
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
  } else {
    // Verify authentication
    const { data } = await supabase.auth.getUser()
    user = data.user
    
    if (!user) {
      redirect('/')
    }

    // Fetch user profile (credits)
    const { data: profile } = await supabase
      .from('profiles')
      .select('credits, full_name, username')
      .single()

    credits = profile?.credits ?? 0
    if (profile) {
      user = {
        ...user,
        fullName: profile.full_name || user.user_metadata?.full_name || 'User',
        username: profile.username || user.user_metadata?.username || user.email?.split('@')[0] || 'user'
      }
    } else {
      user = {
        ...user,
        fullName: user.user_metadata?.full_name || 'User',
        username: user.user_metadata?.username || user.email?.split('@')[0] || 'user'
      }
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
    <div className="flex-1 min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-violet-900/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-900/10 blur-[130px] pointer-events-none" />

      {/* Navigation */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-tr from-violet-600 to-cyan-500 p-2 rounded-xl group-hover:scale-105 transition-all">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-white">AI Influencer Studio</span>
          </Link>

          <div className="flex items-center space-x-4">
            {/* Credit Counter */}
            <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-full">
              <Coins className="h-4.5 w-4.5 text-amber-400" />
              <span className="text-sm font-semibold text-slate-200">
                {credits} <span className="text-slate-500 font-normal">Credits</span>
              </span>
            </div>

            {/* User Profile */}
            <div className="hidden sm:flex flex-col items-end text-xs mr-1">
              <span className="font-bold text-slate-200">{user.fullName}</span>
              <span className="text-slate-500 font-medium">@{user.username}</span>
            </div>
            <div className="hidden sm:flex items-center space-x-2 text-slate-400 text-sm bg-slate-900/40 border border-slate-900 px-3.5 py-1.5 rounded-full" title={user.email}>
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
        
        {/* Dashboard Title & Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Your Studio</h1>
            <p className="text-sm text-slate-400">Manage your virtual models and generate professional images.</p>
          </div>
          <Link
            href="/dashboard/create"
            className="flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold rounded-2xl shadow-lg shadow-violet-500/10 hover:shadow-violet-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="h-5 w-5" />
            <span>Create AI Character</span>
          </Link>
        </div>

        {/* Characters Grid */}
        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
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
                  className="group block rounded-3xl bg-slate-900/30 border border-slate-900 hover:border-slate-800/80 hover:bg-slate-900/60 transition-all duration-300 overflow-hidden shadow-md relative"
                >
                  <div className="aspect-[4/3] w-full bg-slate-950 relative overflow-hidden">
                    {/* Character Card Image */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={char.reference_image_url}
                      alt={char.name}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                    
                    {/* Edit and Delete Actions */}
                    <CharacterActions id={char.id} />

                    {/* Overlay Details */}
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                      <div>
                        <h3 className="text-xl font-bold text-white tracking-tight">{char.name}</h3>
                        <p className="text-xs text-slate-300 font-medium">{char.style_vibe}</p>
                      </div>
                      <Link 
                        href={`/dashboard/generate?character=${char.id}`}
                        className="inline-flex items-center text-xs font-semibold text-violet-400 hover:text-violet-300 hover:translate-x-1 transition-all"
                      >
                        Launch <ArrowRight className="h-3.5 w-3.5 ml-1" />
                      </Link>
                    </div>
                  </div>

                  {/* Character Properties Panel */}
                  <div className="p-5 grid grid-cols-2 gap-y-3 gap-x-4 text-xs border-t border-slate-900/60 bg-slate-950/40">
                    <div>
                      <span className="text-slate-500 block mb-0.5">Age</span>
                      <span className="font-semibold text-slate-300">{char.age} yrs</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-0.5">Body Type</span>
                      <span className="font-semibold text-slate-300 truncate block">{char.body_type}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-0.5">Skin Tone</span>
                      <span className="font-semibold text-slate-300 truncate block">{char.skin_tone}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-0.5">Hair Style</span>
                      <span className="font-semibold text-slate-300 truncate block">{char.hair_color_style}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-900 py-16 text-center bg-slate-950/20 space-y-4">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-slate-600">
                <UserCircle className="h-8 w-8" />
              </div>
              <div className="max-w-sm mx-auto space-y-1">
                <h3 className="font-bold text-slate-200">No Characters Yet</h3>
                <p className="text-sm text-slate-500">Create your first AI character to begin generating photos with face swapping.</p>
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
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span className="w-1.5 h-6 bg-cyan-500 rounded-full" />
            Recent Creations
          </h2>

          {generations && generations.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {generations.map((gen) => (
                <div
                  key={gen.id}
                  className="group relative rounded-2xl border border-slate-900 bg-slate-900/30 overflow-hidden shadow transition-all duration-300 hover:border-slate-800"
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
                          className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:bg-slate-800 hover:text-cyan-400 text-white transition-all flex items-center justify-center"
                          title="Download Image"
                        >
                          <Download className="h-4 w-4" />
                        </a>
                      </div>
                      
                      <div className="space-y-1">
                        <span className="text-xs font-semibold text-cyan-400 block truncate">
                          {gen.characters?.name || 'Character'}
                        </span>
                        <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed" title={gen.prompt}>
                          {gen.prompt}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-900 py-16 text-center bg-slate-950/20 space-y-4">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-slate-600">
                <ImageIcon className="h-8 w-8" />
              </div>
              <div className="max-w-sm mx-auto space-y-1">
                <h3 className="font-bold text-slate-200">No Generations Yet</h3>
                <p className="text-sm text-slate-500">Go to a character's page to generate images of them in custom situations.</p>
              </div>
            </div>
          )}
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-8 px-6 text-center text-xs text-slate-500 mt-auto bg-slate-950/20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2 text-slate-500">
            <Clock className="h-4 w-4 text-slate-600" />
            <span>Server Time: {new Date().toISOString()}</span>
          </div>
          <span>&copy; {new Date().getFullYear()} AI Influencer Studio.</span>
        </div>
      </footer>
    </div>
  )
}
