import { createClient } from '@/utils/supabase/server'
import { notFound, redirect } from 'next/navigation'
import ClientCharacterDetails from './ClientCharacterDetails'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function CharacterPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Verify authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  // Fetch character details
  const { data: character } = await supabase
    .from('characters')
    .select('*')
    .eq('id', id)
    .single()

  if (!character) {
    notFound()
  }

  // Fetch user credit balance
  const { data: profile } = await supabase
    .from('profiles')
    .select('credits')
    .single()

  const credits = profile?.credits ?? 0

  return (
    <ClientCharacterDetails character={character} initialCredits={credits} />
  )
}
