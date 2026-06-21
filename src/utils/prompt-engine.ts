/**
 * TypeScript Interfaces for Avatar Creator & Prompt Engine
 */

export interface Character {
  id: string;
  user_id: string;
  name: string;
  gender: string;
  age: number;
  height: number;
  skin_tone: string;
  body_type: string;
  face_shape: string;
  hair_color_style: string;
  eye_color: string;
  eye_shape: string;
  face_features?: string | null;
  tattoos: string;
  birthmarks?: string | null;
  style_vibe: string;
  signature_pose?: string | null;
  reference_image_url: string;
  master_prompt?: string | null;
  created_at: string;
}

export interface GenerateRequest {
  characterId?: string;
  charId?: string;
  prompt?: string;
  scenePrompt?: string;
  aspectRatio?: string;
  mode?: 'txt2img' | 'img2img' | 'multi';
  charPrompt?: string;
}

export interface GenerateResponse {
  output_image_url: string;
  outputImageUrl: string;
}

export interface ValidateRequest {
  characterId?: string;
  charId?: string;
  prompt?: string;
  scenePrompt?: string;
  aspectRatio?: string;
}

export interface ValidateResponse {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  sanitizedPrompt?: string;
}

/**
 * Global Realism Suffix containing camera parameters, natural skin textures,
 * unposed candid lighting, and organic facial features.
 * Note: 'close-up portrait' is removed here because we will intelligently inject it via Smart Scene Detection.
 */
export const GLOBAL_REALISM_SUFFIX = 
  `, person slightly looking away or caught mid-moment, not staring directly at camera, candid natural expression, caught in a moment, slight natural smile or thoughtful look, not posing, unposed natural moment, candid lifestyle photography, real human moment, iPhone candid or DSLR street photography style, looks like iPhone or DSLR candid shot, casual snap, natural daylight or window light or cafe light, natural ambient illumination, no orange grading, f/1.8 natural light, natural clothing matching lifestyle - casual top, shirt, everyday outfit, lifestyle scene background - cafe, street, home, office, real-world setting, wheatish olive Indian skin tone, naturally South Asian appearance, real skin texture with varied pores, subtle blemishes, uneven skin tone, natural redness on cheeks and nose, natural imperfections, deep dark brown eyes, naturally dark iris, no blue or grey eyes, slight natural facial asymmetry, one side slightly different from other, natural random curly hair with flyaways, frizz, broken curl groups, not every curl perfectly defined, film grain, detailed facial features, no blur on face`;

/**
 * List of forbidden buzzwords associated with plastic, synthetic, or AI-generated looks.
 */
export const FORBIDDEN_KEYWORDS = [
  /\bperfect\s+skin\b/gi,
  /\bflawless\b/gi,
  /\bsmooth\s+skin\b/gi,
  /\bcinematic\s+lighting\b/gi,
  /\bstudio\b/gi,
  /\bsymmetrical\b/gi,
  /\b8k\s+ultra\s+sharp\b/gi,
  /\b8k\b/gi,
  /\bprofessional\s+photography\b/gi,
  /\bprofessional\b/gi
];

/**
 * 3. Scene Understanding & Sanitization Function
 * Cleans the raw user prompt, removing forbidden keywords and double commas/whitespaces.
 */
export function sanitizeScenePrompt(rawPrompt: string): string {
  if (!rawPrompt) return '';
  let sanitized = rawPrompt;

  // Scrub each forbidden keyword
  FORBIDDEN_KEYWORDS.forEach(regex => {
    sanitized = sanitized.replace(regex, '');
  });

  // Normalize commas and excessive spacing
  sanitized = sanitized.replace(/,\s*,/g, ',');
  sanitized = sanitized.replace(/\s+/g, ' ');
  sanitized = sanitized.trim();

  // Strip leading/trailing commas
  if (sanitized.startsWith(',')) sanitized = sanitized.substring(1).trim();
  if (sanitized.endsWith(',')) sanitized = sanitized.substring(0, sanitized.length - 1).trim();

  return sanitized;
}

/**
 * 4. Prompt Assembly Engine
 * Combines character details, master prompt, scene description, and global realism tags.
 * Includes Smart Scene Detection based on user keywords.
 */
export function assemblePrompt(character: Partial<Character>, sceneDescription: string): string {
  const sanitizedScene = sanitizeScenePrompt(sceneDescription);
  
  // Smart Scene Detection
  const lowerScene = sanitizedScene.toLowerCase();
  let sceneTypeModifier = '';
  if (/(sitting|standing|walking|outfit|environment)/.test(lowerScene)) {
    sceneTypeModifier = 'full body shot, showing entire outfit and environment';
  } else if (/(face|selfie|portrait|close up)/.test(lowerScene)) {
    sceneTypeModifier = 'close-up portrait, face and shoulders only';
  } else {
    // Default fallback if no specific keywords are detected
    sceneTypeModifier = 'medium portrait, waist up';
  }

  let basePrompt = '';
  if (character.master_prompt && character.master_prompt.trim().length > 0) {
    // Preserve master prompt exactly as saved, adding only the scene description and smart modifier
    basePrompt = `${character.master_prompt.trim()} + Scene: ${sanitizedScene}, ${sceneTypeModifier}`;
  } else {
    // Fallback if master prompt is somehow missing
    const genderTerm = (character.gender || 'Female').toLowerCase();
    const skinToneLower = (character.skin_tone || 'porcelain').toLowerCase();
    const toneString = `extremely detailed ${skinToneLower} skin tone, natural skin texture with realistic ${skinToneLower} pigmentation`;
    const faceShapeString = `a clear and distinct ${(character.face_shape || 'Oval').toLowerCase()} face shape`;
    
    let hairColor = 'Black';
    let hairStyle = 'Straight';
    if (character.hair_color_style && character.hair_color_style.includes('/')) {
      const parts = character.hair_color_style.split('/');
      hairColor = parts[0].trim().toLowerCase();
      hairStyle = parts[1].trim().toLowerCase();
    } else if (character.hair_color_style) {
      hairStyle = character.hair_color_style.trim().toLowerCase();
    }
    const hairString = `hair specifically colored ${hairColor} and styled in a ${hairStyle} haircut`;

    basePrompt = `A photorealistic image of ${character.name || 'AI Model'}, a ${character.gender || 'Female'} model, ${character.age || 24} years old, height ${character.height || 170}cm, ${toneString}, body type: ${character.body_type || 'Slim'}, ${faceShapeString}, face details: ${character.face_features || 'natural features'}, ${hairString}, eye color: ${character.eye_color || 'Brown'}, tattoos: ${character.tattoos || 'None'}, scene/action: ${sanitizedScene}, ${sceneTypeModifier}`;
  }

  // Combine with suffix and perform a final cleanup pass
  const compiledPrompt = `${basePrompt}${GLOBAL_REALISM_SUFFIX}`;
  return sanitizeScenePrompt(compiledPrompt);
}

/**
 * Maps the Next.js frontend aspect ratio parameter to the OpenAI DALL-E size string.
 */
export function mapAspectRatioToSize(ratio: string): "1024x1024" | "1024x1792" | "1792x1024" {
  switch (ratio) {
    case '9:16':
      return "1024x1792";
    case '16:9':
      return "1792x1024";
    case '1:1':
    case '4:3':
    default:
      return "1024x1024";
  }
}
