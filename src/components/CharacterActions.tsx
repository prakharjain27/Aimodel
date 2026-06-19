"use client"

import { Pencil, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function CharacterActions({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault() // prevent navigating to character page
    if (!confirm("Are you sure you want to delete this character?")) return

    setIsDeleting(true)
    
    // --- DEMO MODE BYPASS ---
    const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'your-supabase-project-url'
    if (isDemoMode) {
      alert("Running in DEMO MODE: Character deletion simulated.")
      setIsDeleting(false)
      return
    }
    // ------------------------

    try {
      const { error } = await supabase.from('characters').delete().eq('id', id)
      if (error) throw error
      router.refresh()
    } catch (err) {
      alert("Failed to delete character.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <Link
        href={`/dashboard/edit/${id}`}
        onClick={(e) => e.stopPropagation()}
        className="p-2 bg-slate-900/80 hover:bg-violet-600 border border-slate-800 hover:border-violet-500 rounded-xl text-slate-300 hover:text-white transition-all backdrop-blur-md"
        title="Edit Character"
      >
        <Pencil className="h-4 w-4" />
      </Link>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="p-2 bg-slate-900/80 hover:bg-rose-600 border border-slate-800 hover:border-rose-500 rounded-xl text-slate-300 hover:text-white transition-all backdrop-blur-md disabled:opacity-50"
        title="Delete Character"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  )
}
