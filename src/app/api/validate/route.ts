import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { FORBIDDEN_KEYWORDS, sanitizeScenePrompt } from '@/utils/prompt-engine'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
    }

    const body = await request.json()
    const characterId = body.characterId || body.charId
    const scenePrompt = body.scenePrompt || body.prompt
    
    if (!characterId) {
      return NextResponse.json({ error: 'Missing character ID.' }, { status: 400 })
    }
    
    if (!scenePrompt || scenePrompt.trim().length === 0) {
      return NextResponse.json({ error: 'Missing scene prompt.' }, { status: 400 })
    }

    const { data: character, error } = await supabase
      .from('characters')
      .select('master_prompt, name')
      .eq('id', characterId)
      .eq('user_id', user.id)
      .single()

    if (error || !character) {
      return NextResponse.json({ error: 'Character not found.' }, { status: 404 })
    }

    const warnings: string[] = []
    
    FORBIDDEN_KEYWORDS.forEach(regex => {
      if (regex.test(scenePrompt)) {
        warnings.push(`Removed forbidden AI buzzword based on regex: ${regex.source}`)
      }
    })

    const sanitizedPrompt = sanitizeScenePrompt(scenePrompt)

    return NextResponse.json({
      isValid: true,
      errors: [],
      warnings,
      sanitizedPrompt,
      hasMasterPrompt: !!(character.master_prompt && character.master_prompt.trim().length > 0)
    })
    
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Validation failed.' }, { status: 500 })
  }
}
