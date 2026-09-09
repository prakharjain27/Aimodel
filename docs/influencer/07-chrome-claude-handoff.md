# Chrome Claude Handoff — isko paste karke kaam karwao

Tumhare browser mein Claude Chrome extension hai. **Wo ChatGPT chala sakta hai, main nahi.**
Toh plan ye hai: maine saara sochne ka kaam kar diya, ab wo execute karega.

## Kaise use karo

1. Chrome mein **ChatGPT kholo**, naya chat
2. Claude extension kholo
3. Neeche wala poora block **ek hi message mein** paste karo
4. `[...]` wali jagah pe `master-prompt.txt` ka content daal do

---

## ✂️ Yahan se copy karo

```
You're going to help me run a photo generation session in ChatGPT, which is open in this
tab. I've already done all the planning — you just need to execute it carefully and
apply quality control. Don't improvise on the creative direction; it's deliberate.

PROJECT
I'm creating an original fictional character for a photography project — she is not based
on any real person, and no reference image of a real person is being used. I need a series
of photos of her where her face stays identical across every image.

THE CRITICAL CONSTRAINT
Do NOT let ChatGPT produce glamour or fashion photography. Every image must look like an
ordinary phone snapshot from a normal person's camera roll — imperfect light, visible skin
texture, awkward framing. If an image looks polished, flattering, or "professional", it has
failed. This is the single most common failure mode, so watch for it every single time.

NEVER let these words into a prompt: beautiful, gorgeous, stunning, flawless, perfect skin,
smooth skin, model, 8k, ultra HD, hyperrealistic, masterpiece, professional photography,
cinematic lighting, studio lighting, award winning, bokeh, sharp focus, symmetrical.
These pull the model toward glamour photography, which is exactly what reads as AI.

THE CHARACTER (memorise — every image must match this exactly)
[PASTE master-prompt.txt CONTENT HERE]

WHAT TO DO, IN ORDER

Step 1. Send ChatGPT this setup message:
"I'm creating an original fictional character for a photography project. She is not based
on any real person. I'll be generating a series of photos and I need her face identical
across all of them. I do NOT want glamour or fashion photography — I want ordinary,
unremarkable phone snapshots. Slightly bad lighting, visible skin texture, imperfect
framing. If a photo looks polished or flattering, it's wrong. Confirm, then wait."

Step 2. Send the character description above.

Step 3. Ask it to generate the hero face. Use this prompt exactly — do not shorten it,
do not convert it into comma-separated tags. ChatGPT's image model responds to descriptive
prose, not tag lists:

"An unedited candid photo of a 23-year-old Indian woman, taken by a friend on an iPhone 15
Pro in a Mumbai cafe on an overcast afternoon. Not a professional shoot — just a phone snap.
She has warm wheatish skin with olive undertones and visible texture: open pores across her
T-zone, slight oiliness on her forehead and nose, natural redness on her cheeks and the tip
of her nose, and faint under-eye shadows her concealer hasn't fully covered. Her face is a
soft heart shape and noticeably asymmetric — her jaw is slightly wider on the left, her left
eyelid is a little more hooded so that eye reads marginally smaller, and her right eyebrow
arches higher. Her eyebrows are thick and natural, not shaped. Her eyes are very dark brown
with outer corners turning slightly downward. There is a small dark mole about four
millimetres wide on her left cheekbone, two centimetres below the outer corner of her eye,
and a tiny mole on her right jawline near her ear. Faint freckles sit only across the bridge
of her nose. Her hair is dark brown-black with a natural loose wave, parted slightly off-centre
to the left, with face-framing pieces — not smooth or styled, with flyaways catching the light,
frizz near the part, and dry sun-lightened ends. Her left earlobe has two piercings, her right
has one. She is caught mid-thought, looking slightly past the camera, with a small closed-mouth
half-smile and one eyebrow slightly raised. She is not posing. She wears a plain washed-black
cotton t-shirt, slightly wrinkled, with a thin gold chain. No makeup beyond concealer and a
natural mauve-brown lip tint. The light is soft, flat, grey daylight from a window on the left
— not flattering light, it shows her skin as it is. The background is a blurred cafe interior
with no readable text or signage. The photo is slightly underexposed and slightly soft. There
is fine sensor noise in the shadows and mild JPEG compression. The white balance is slightly
cool and imperfect. No beauty filter, no skin smoothing, no colour grading, no portrait mode.
It should look like a photo that would not stand out on anyone's camera roll."

Step 4. THIS IS YOUR MAIN JOB. When each image appears, look at it yourself and check:
  - hands: exactly five fingers per hand, knuckle creases present, correct finger lengths
  - eyes: catchlights in BOTH eyes from the same direction and same shape
  - teeth: varied, warm off-white, not uniform, not paper-white
  - ears: TWO piercings left, ONE right
  - the 4mm mole on the LEFT cheekbone — present and correctly placed
  - the 2mm mole on the RIGHT jawline
  - skin: pores actually visible, tone uneven, some imperfection present
  - hair: flyaways and frizz present, baby hairs at the hairline
  - background: absolutely no readable or garbled text anywhere
  - shadows: all falling from one consistent light direction
  - overall: does it look like an ordinary snapshot, or does it look like a photoshoot?

Report to me exactly what fails. Then ask ChatGPT to critique its own image against the
same list and regenerate fixing what it finds — this self-critique loop genuinely works
and is the highest-value thing you can do here.

Step 5. Repeat until an image passes everything. Expect 20-30 attempts. Do not settle for
"close enough" — this image becomes the permanent reference for hundreds of future images,
so a mediocre one poisons the whole project. Tell me when one passes and I'll save it.

RULES FOR YOU
- Stay in ONE ChatGPT conversation. Starting a new chat loses face consistency.
- Never rewrite my prompts into shorter tag lists. The prose length is intentional.
- Never add flattering adjectives, even if an image looks "unattractive". That's the goal.
- If ChatGPT refuses or hedges, tell me what it said — don't try to work around it.
- Tell me honestly when an image fails. Don't tell me it looks good to move things along.
```

## ✂️ Yahan tak

---

## Uske baad

Jab hero face pass ho jaaye:

1. **Download karo** → naam `ira-hero-v1.jpg` → **do jagah backup**
2. Chrome Claude ko bolo: character sheet banaye — `02-prompt-pack.md` § B1, B2, B3
3. Phir full body — § C1, C2, C3
4. Phir content — `06-scene-library.md` se scenes
5. Post karne se pehle **EXIF strip** karo (koi bhi free online EXIF remover) aur
   **JPEG** mein save karo — PNG kabhi nahi, phone PNG nahi deta

---

## Agar Chrome Claude ke saath dikkat aaye

Mujhe yahan bata do ki kya hua ya kya image aayi — main prompts adjust kar dunga.
Main dekh nahi sakta, par tum describe karoge to main diagnose kar sakta hoon:

- "chehra bahut smooth hai" → main texture instructions strengthen karunga
- "model jaisi lag rahi hai" → main aur zyada anti-glamour language daalunga
- "har baar chehra badal jaata hai" → main reference protocol tighten karunga
- "haath kharaab aa rahe hain" → main hand-safe compositions dunga

Ye loop chalate raho — 3-4 round mein output kaafi upar chala jayega.
