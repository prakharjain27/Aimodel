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

    // 2. Parse request parameters
    const body = await request.json()
    const { characterId, scenePrompt } = body

    if (!characterId || !scenePrompt) {
      return NextResponse.json({ error: 'Missing characterId or scenePrompt.' }, { status: 400 })
    }

    // 3. Retrieve character details
    const { data: character, error: charError } = await supabase
      .from('characters')
      .select('*')
      .eq('id', characterId)
      .eq('user_id', user.id)
      .single()

    if (charError || !character) {
      return NextResponse.json({ error: 'Character not found.' }, { status: 404 })
    }

    // 4. Verify user credits
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile credits could not be verified.' }, { status: 500 })
    }

    if (profile.credits < 1) {
      return NextResponse.json({ error: 'Insufficient credits. You need at least 1 credit to generate an image.' }, { status: 400 })
    }

    // 5. Initialize API clients
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'Server configuration error: Missing OpenAI API Key.' }, { status: 500 })
    }
    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json({ error: 'Server configuration error: Missing Replicate API Token.' }, { status: 500 })
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
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
                - Age: ${character.age} years old
                - Skin Tone: ${character.skin_tone}
                - Body Type: ${character.body_type}
                - Hair Color & Style: ${character.hair_color_style}
                - Eye Color: ${character.eye_color}
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
      // Fallback: build a simple prompt text manually if GPT Vision fails
      generatedPrompt = `A photorealistic image of a person, ${character.age} years old, skin tone: ${character.skin_tone}, body type: ${character.body_type}, hair style: ${character.hair_color_style}, eye color: ${character.eye_color}, style vibe: ${character.style_vibe}, in the following scene: ${scenePrompt}`
    }

    // 7. Call Replicate Flux-Schnell to generate the body-morph target image
    let targetImageUrl = ''
    try {
      const fluxOutput = await replicate.run(
        'black-forest-labs/flux-schnell',
        {
          input: {
            prompt: generatedPrompt,
            num_inference_steps: 4,
            aspect_ratio: '3:4',
            output_format: 'webp',
          },
        }
      )

      if (Array.isArray(fluxOutput)) {
        targetImageUrl = fluxOutput[0]
      } else if (typeof fluxOutput === 'string') {
        targetImageUrl = fluxOutput
      }

      if (!targetImageUrl) {
        throw new Error('No image returned from Flux-Schnell.')
      }
    } catch (fluxErr: any) {
      console.error('Replicate Flux-Schnell failed:', fluxErr)
      return NextResponse.json({ error: `Body generation failed: ${fluxErr.message || fluxErr}` }, { status: 500 })
    }

    // 8. Call Replicate Face-Swap model to map reference face onto target image
    let finalImageUrl = ''
    try {
      const swapOutput = await replicate.run(
        'cdingram/face-swap:d1d6ea8c8be89d664a07a457526f7128109dee7030fdac424788d762c71ed111',
        {
          input: {
            swap_image: character.reference_image_url,
            input_image: targetImageUrl,
          },
        }
      )

      if (Array.isArray(swapOutput)) {
        finalImageUrl = swapOutput[0]
      } else if (typeof swapOutput === 'string') {
        finalImageUrl = swapOutput
      } else if (swapOutput && typeof (swapOutput as any).toString === 'function') {
        finalImageUrl = (swapOutput as any).toString()
      }

      if (!finalImageUrl) {
        throw new Error('No image returned from Face-Swap.')
      }
    } catch (swapErr: any) {
      console.error('Replicate Face-Swap failed:', swapErr)
      return NextResponse.json({ error: `Face swap failed: ${swapErr.message || swapErr}` }, { status: 500 })
    }

    // 9. Deduct 1 credit from user profile
    const { error: deductError } = await supabase
      .from('profiles')
      .update({ credits: profile.credits - 1 })
      .eq('id', user.id)

    if (deductError) {
      console.error('Failed to deduct credit, but image was generated:', deductError)
      // We will still log the generation and return it to not penalize the user for a DB update failure, 
      // but log the incident.
    }

    // 10. Log the generation history
    const { error: logError } = await supabase
      .from('generations')
      .insert({
        user_id: user.id,
        character_id: characterId,
        prompt: scenePrompt, // save the original prompt input
        input_image_url: character.reference_image_url,
        output_image_url: finalImageUrl,
      })

    if (logError) {
      console.error('Failed to log generation in database:', logError)
    }

    // 11. Return final output image
    return NextResponse.json({
      output_image_url: finalImageUrl,
    })

  } catch (err: any) {
    console.error('Generation pipeline crashed:', err)
    return NextResponse.json({ error: err.message || 'An unexpected error occurred during image generation.' }, { status: 500 })
  }
}
