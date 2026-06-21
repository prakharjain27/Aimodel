import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import OpenAI from 'openai'
import Replicate from 'replicate'

export const maxDuration = 60 // Allow Vercel or other hosts to wait up to 60s for the pipeline

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // 1. Verify user session
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 })
    }

    // 2. Parse request parameters flexibly (supports both character detail page and generate studio page)
    const body = await request.json()
    const characterId = body.characterId || body.charId
    const scenePrompt = body.scenePrompt || body.prompt
    const aspectRatio = body.aspectRatio || '1:1'

    if (!scenePrompt) {
      return NextResponse.json({ error: 'Missing scenePrompt.' }, { status: 400 })
    }

    // 3. Retrieve character details or construct from request body if new/unsaved
    let character: any = null
    if (characterId && characterId !== 'new') {
      const { data, error: charError } = await supabase
        .from('characters')
        .select('*')
        .eq('id', characterId)
        .eq('user_id', user.id)
        .single()

      if (charError || !data) {
        return NextResponse.json({ error: 'Character not found.' }, { status: 404 })
      }
      character = data
    } else {
      character = {
        name: body.name || 'AI Influencer',
        gender: body.gender || 'Female',
        age: body.age || 24,
        height: body.height || 170,
        skin_tone: body.skin_tone || 'Olive',
        body_type: body.body_type || 'Slim',
        face_shape: body.face_shape || 'Oval',
        hair_color_style: body.hair_color_style || 'Blonde / Straight',
        eye_color: body.eye_color || 'Blue',
        eye_shape: body.eye_shape || 'Almond',
        face_features: body.face_features || 'Soft Features',
        tattoos: body.tattoos || 'None',
        birthmarks: body.birthmarks || 'None',
        style_vibe: body.style_vibe || 'High-Fashion Streetwear',
        signature_pose: body.signature_pose || 'Looking over shoulder',
        reference_image_url: body.reference_image_url || ''
      }
    }

    const SKIN_TONE_DESCRIPTIONS: Record<string, string> = {
      'Porcelain': 'Very fair, cool undertone (Northern European)',
      'Ivory': 'Fair, neutral undertone (European)',
      'Sand': 'Light, warm undertone (Mediterranean, Latin)',
      'Beige': 'Light medium, neutral (East Asian, Middle Eastern)',
      'Honey': 'Medium, warm golden (South Asian, Latino)',
      'Wheatish': 'Medium brown, warm (Indian, Southeast Asian)',
      'Caramel': 'Medium dark, warm (Hispanic, Middle Eastern)',
      'Bronze': 'Dark medium, warm (African, South Asian)',
      'Mahogany': 'Dark, cool undertone (African)',
      'Ebony': 'Deep dark (West African)'
    }

    const skinToneName = character.skin_tone || 'Olive'
    const skinToneDescription = SKIN_TONE_DESCRIPTIONS[skinToneName]
    const skinToneString = skinToneDescription ? `${skinToneName} (${skinToneDescription})` : skinToneName

    // 4. Verify user credits (only for existing character image generations - character creation/preview is FREE)
    const isCharacterCreation = !characterId || characterId === 'new'

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile credits could not be verified.' }, { status: 500 })
    }

    if (!isCharacterCreation && profile.credits < 1) {
      return NextResponse.json({ error: 'Insufficient credits. You need at least 1 credit to generate an image.' }, { status: 400 })
    }

    // --- DEMO MODE / FALLBACK CHECK ---
    const isOpenAiDemo = !process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your-openai-api-key'
    
    if (isOpenAiDemo) {
      console.warn("Running in DEMO MODE. Simulating DALL-E 3 image generation.")
      await new Promise(res => setTimeout(res, 2000)) // Simulate network delay
      
      const mockOutputs: Record<string, string> = {
        '1:1': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1000&q=80',
        '9:16': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1000&q=80',
        '16:9': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&q=80',
        '4:3': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1000&q=80'
      }
      
      const finalImageUrl = mockOutputs[aspectRatio] || mockOutputs['1:1']
      
      // Deduct 1 credit (only if not character creation)
      if (!isCharacterCreation) {
        await supabase
          .from('profiles')
          .update({ credits: profile.credits - 1 })
          .eq('id', user.id)
      }

      // Log generation history
      if (characterId && characterId !== 'new') {
        await supabase
          .from('generations')
          .insert({
            user_id: user.id,
            character_id: characterId,
            prompt: scenePrompt,
            input_image_url: character.reference_image_url,
            output_image_url: finalImageUrl,
          })
      }

      return NextResponse.json({
        output_image_url: finalImageUrl,
        outputImageUrl: finalImageUrl
      })
    }
    // ----------------------------------

    // 5. Initialize OpenAI API client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    // 6. Call OpenAI ChatGPT Vision to generate a detailed target prompt matching the reference face
    let generatedPrompt = scenePrompt
    try {
      const visionResponse = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an AI Influencer prompt engineering assistant. Your task is to output a single, detailed image-generation prompt for a model based on their physical traits and the specified scene description, incorporating their facial attributes from the reference image. Output ONLY the raw text prompt. Do not add any conversational text or markdown.',
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Write a high-quality, photorealistic text-to-image prompt.
                Target Scene/Action: ${scenePrompt}
                The character has these properties:
                - Name: ${character.name}
                - Gender: ${character.gender || 'Female'}
                - Age: ${character.age} years old
                - Height: ${character.height || 170} cm tall
                - Skin Tone: ${skinToneString}
                - Body Type: ${character.body_type}
                - Face Shape: ${character.face_shape || 'Oval'}
                - Face Features: ${character.face_features || 'symmetrical'}
                - Hair Style & Color: ${character.hair_color_style}
                - Eye Color & Shape: ${character.eye_color} ${character.eye_shape ? `(${character.eye_shape} shape)` : ''}
                - Tattoos: ${character.tattoos || 'None'}
                - Default Vibe: ${character.style_vibe}
                
                Analyze the face details in the attached image (expression, face shape, features) and blend them with the properties above. Describe the final character in the target scene with realistic pose, clothing matching the vibe, lighting (cinematic/natural), and photorealistic quality.`,
              },
              {
                type: 'image_url',
                image_url: {
                  url: character.reference_image_url,
                },
              },
            ],
          },
        ],
        max_tokens: 300,
      })

      const gptOutput = visionResponse.choices[0]?.message?.content?.trim()
      if (gptOutput) {
        generatedPrompt = gptOutput
      }
    } catch (visionErr) {
      console.error('OpenAI Vision prompt enhancement failed, falling back to raw prompt:', visionErr)
      generatedPrompt = `A photorealistic image of a person, ${character.gender || 'Female'}, ${character.age} years old, height ${character.height || 170}cm, skin tone: ${skinToneString}, body type: ${character.body_type}, face shape: ${character.face_shape || 'Oval'}, hair style: ${character.hair_color_style}, eye color: ${character.eye_color}, tattoos: ${character.tattoos || 'None'}, style vibe: ${character.style_vibe}, in the following scene: ${scenePrompt}`
    }

    // 7. Call OpenAI DALL-E 3 API to generate the image
    let finalImageUrl = ''
    try {
      const characterPrompt = `${generatedPrompt}, close-up portrait, face focused, chest up, professional photography, sharp facial details, neutral background, photorealistic, 8k quality, sharp facial features, professional studio lighting`

      const response = await openai.images.generate({
        model: "gpt-image-1",
        prompt: characterPrompt,
        n: 1,
        size: "1024x1024",
      })

      const imgData = response.data?.[0]
      if (imgData) {
        finalImageUrl = imgData.url || (imgData.b64_json ? `data:image/png;base64,${imgData.b64_json}` : '')
      }

      if (!finalImageUrl) {
        throw new Error('No image URL or base64 data returned from OpenAI.')
      }
    } catch (dalleErr: any) {
      console.error('OpenAI DALL-E generation failed:', dalleErr)
      return NextResponse.json({ error: `Image generation failed: ${dalleErr.message || dalleErr}` }, { status: 500 })
    }

    // 8. Deduct 1 credit from user profile (only if not character creation)
    if (!isCharacterCreation) {
      const { error: deductError } = await supabase
        .from('profiles')
        .update({ credits: profile.credits - 1 })
        .eq('id', user.id)

      if (deductError) {
        console.error('Failed to deduct credit, but image was generated:', deductError)
      }
    }

    // 9. Log the generation history (only if character already exists in db)
    if (characterId && characterId !== 'new') {
      const { error: logError } = await supabase
        .from('generations')
        .insert({
          user_id: user.id,
          character_id: characterId,
          prompt: scenePrompt,
          input_image_url: character.reference_image_url,
          output_image_url: finalImageUrl,
        })

      if (logError) {
        console.error('Failed to log generation in database:', logError)
      }
    }

    // 10. Return final output image (supports both snake_case and camelCase parameters)
    return NextResponse.json({
      output_image_url: finalImageUrl,
      outputImageUrl: finalImageUrl
    })

  } catch (err: any) {
    console.error('Generation pipeline crashed:', err)
    return NextResponse.json({ error: err.message || 'An unexpected error occurred during image generation.' }, { status: 500 })
  }
}
