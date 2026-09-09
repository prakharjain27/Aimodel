# Prompt Pack — ChatGPT ke liye

## Pehle ek zaroori baat: ChatGPT ko tags pasand nahi

Midjourney/Stable Diffusion comma-soup pe chalte hain:
`beautiful girl, 8k, detailed skin, bokeh, masterpiece`

**ChatGPT ka image model (GPT Image) ise theek se handle nahi karta.** Wo ek language model se
driven hai — usko **poore vaakya, ek scene ka description** chahiye, jaise tum kisi photographer
ko phone pe samjha rahe ho.

> ⚠️ **Tumhare app mein bhi yahi issue hai.** `src/utils/prompt-engine.ts` ka
> `GLOBAL_REALISM_SUFFIX` 180+ comma-separated tags hai jo OpenAI API ko hi jaata hai.
> Isko prose mein convert karne se output kaafi improve hoga. Bolo to main wo refactor kar doon.

Neeche ke saare prompts **prose style** mein hain. Waise hi paste karo.

---

## § A — HERO FACE (Step 1)

Ye sabse important image hai. Iske baad sab kuch isi se derive hoga.
**Nayi ChatGPT chat kholo. 20-30 baar generate karoge — normal hai.**

### A1. Main prompt — paste this

```
An unedited candid photo of a 23-year-old Indian woman, taken by a friend on an
iPhone 15 Pro in a Mumbai cafe on an overcast afternoon. Not a professional shoot —
just a phone snap.

She has warm wheatish skin with olive undertones and visible texture: open pores across
her T-zone, slight oiliness on her forehead and nose, natural redness on her cheeks and
the tip of her nose, and faint under-eye shadows that her concealer hasn't fully covered.
Her face is a soft heart shape and noticeably asymmetric — her jaw is slightly wider on
the left, her left eyelid is a little more hooded so that eye reads marginally smaller,
and her right eyebrow arches higher than the left. Her eyebrows are thick and natural,
not shaped. Her eyes are very dark brown with outer corners that turn slightly downward.
There is a small dark mole about four millimetres wide on her left cheekbone, two
centimetres below the outer corner of her eye, and a tiny mole on her right jawline near
her ear. A faint scatter of freckles sits only across the bridge of her nose.

Her hair is dark brown-black with a natural loose wave, parted slightly off-centre to the
left, with face-framing pieces. It is not smooth or styled — there are flyaways catching
the light, some frizz near the part, and the ends are dry and a shade lighter from sun.
Her left earlobe has two piercings, her right has one.

She is caught mid-thought, looking slightly away from the camera and past it, with a small
closed-mouth half-smile and one eyebrow slightly raised. She is not posing.

She wears a plain washed-black cotton t-shirt, slightly wrinkled, with a thin gold chain.
No makeup beyond a little concealer and a natural mauve-brown tint on her lips.

The light is soft, flat, grey daylight from a window on the left. It is not flattering
light — it shows her skin as it is. The background is a blurred cafe interior with no
readable text or signage.

The photo is slightly underexposed and slightly soft, as phone photos are. There is fine
sensor noise in the shadows and mild JPEG compression. The white balance is slightly cool
and imperfect. There is no beauty filter, no skin smoothing, no colour grading, no bokeh
effect from a portrait mode. It looks like an ordinary photo someone would not think twice
about while scrolling.
```

### A2. Agar output plastic aaye — ye follow-up bhejo

```
Too smooth and too flattering — it still looks generated. Redo it with these changes:
make the skin texture more prominent (visible pores, slight unevenness in tone across
the cheeks and chin), make the lighting flatter and less kind, let the face be more
asymmetric, and let the photo be slightly out of focus on one side. Reduce the overall
image sharpness. She should look like an ordinary attractive person, not a model.
```

### A3. Kuch aur variations — inko try karo, aksar A1 se better nikalte hain

**Flash night selfie** (sabse zyada real lagta hai — direct flash texture chhupata nahi, dikhata hai):
```
Same woman as described. Now: a direct-flash selfie taken at night on a phone's rear
camera, held at arm's length in a stairwell. Harsh flash, hard shadow on the wall
behind her, shiny highlights on her forehead, nose and cheekbones, slightly red eyes
from the flash. Her expression is flat and unimpressed, chin slightly raised. The photo
is unflattering and she posted it anyway.
```

**Mirror selfie** (agar mirror consistency sahi aayi to bahut believable hota hai):
```
Same woman. A bathroom mirror selfie taken on a phone. Her phone partially covers the
lower half of her face — an iPhone in a plain beige case. The mirror has a few water
spots and a smudge. The bathroom light is a warm overhead bulb, casting downward shadows
under her eyes and nose. Her hair is damp at the roots. She is looking at her own
reflection, not at the phone's camera.
```

**Motion / imperfect** (AI kabhi motion blur nahi deta — isliye ye strong signal hai):
```
Same woman. She is walking and the friend taking the photo did not warn her — there is
slight motion blur on her hand and hair, her eyes are half-closed mid-blink, and the
framing is off with too much space above her head. It is a bad photo, technically. Keep
it that way.
```

### A4. Hero face kab final maano
`03-realism-checklist.md` ki **saari** lines pass ho jayein. Ek bhi fail = doosra generate.
Jo pass ho use save karo: `assets/ira/hero-face-v1.png`. **Iska backup rakho — ye poori
influencer ki master key hai.**

---

## § B — CHARACTER SHEET (Step 3)

Hero face **upload karo** ChatGPT mein, phir ye bhejo.

### B1. Expression sheet
```
Using the attached photo as the exact reference for this person's face — same bone
structure, same moles (left cheekbone and right jawline), same asymmetric eyes and
eyebrows, same hair — generate a 2x3 grid of six photos of the same woman on the same
day, in the same soft grey daylight, wearing the same plain black t-shirt against the
same plain wall.

Each frame shows a different expression, all candid, none posed:
1. Neutral, looking straight at the camera, no smile
2. Half-smile with one eyebrow raised, looking slightly off to the side
3. Mid-laugh, eyes crinkled, teeth showing
4. Bored, chin slightly raised, flat expression
5. Looking down, soft, almost smiling
6. Caught mid-blink, slightly awkward

Keep her face identical across all six — the same mole positions, the same slightly
hooded left eyelid, the same slightly rotated upper left front tooth when she laughs.
Same phone-camera quality throughout: no retouching, visible skin texture, fine grain.
```

### B2. Angle sheet
```
Same woman, same reference photo, same lighting and outfit. Generate a 2x2 grid showing
her head and shoulders from four angles: straight on, three-quarter turn to her left,
three-quarter turn to her right, and full profile facing left.

The mole on her left cheekbone must be visible in the frontal and left-three-quarter
views and hidden in the right profile. Her left ear must show two piercings and her
right ear one. Keep the hair part on the same side in every frame.
```

### B3. Hair & makeup states
```
Same woman, same reference. A 2x2 grid, all plain background, all phone-camera quality:
1. Hair down and undone, slightly frizzy, no makeup at all — just woken up
2. Hair in a messy claw-clip bun with pieces falling out, light concealer only
3. Hair in a low ponytail, a little mascara and lip tint
4. Hair blow-dried and down, full going-out makeup with defined brows and a matte lip

Her face must be recognisably the same person in all four. Show that makeup changes how
she looks without changing who she is.
```

---

## § C — FULL BODY (Step 4)

**Chetavani:** yahan sabse zyada AI errors aate hain — haath, pair, proportions, kapdon ki seam.
Har full-body image ko checklist se do baar guzaarna.

### C1. Full body reference
```
Using the attached face reference, generate a full-length photo of the same woman,
standing, photographed from about three metres away on a phone by a friend — so the
proportions are natural and there is no wide-angle distortion.

She is 165 cm, slim with a light athletic build and narrow shoulders. Her arms and hands
are slender with long fingers; her nails are short, almond-shaped and bare. She wears a
thin gold ring on her right index finger. There is a small pale scar on her right knee.

She wears straight-leg light-wash jeans that are slightly too long and bunch at the ankle,
a fitted cream ribbed tank top, and white sneakers with visible scuffing on the toes and
dirt in the sole grooves. The clothes fit a real body — the jeans pull slightly at the
hip, the tank has a small wrinkle where it meets the waistband.

She stands on a Mumbai side street in flat overcast light, weight on one leg, one hand
in her pocket, looking off to the side mid-conversation. Her shadow falls consistently
with the sky's light and there are contact shadows where her shoes meet the pavement.

The background is a plain wall and a parked scooter — no readable text or signage
anywhere. Phone camera quality: mild grain, slightly soft, no retouching.
```

### C2. Turnaround
```
Same woman, same outfit, same location, same light. A 1x3 horizontal strip: front view,
side profile facing right, and back view. Her height, proportions, hair length and outfit
must be identical in all three. In the back view, her hair should fall to mid-back with
the same wave and visible flyaways.
```

### C3. Seated / dynamic
```
Same woman, same outfit. She is sitting on a low step, knees up, forearms resting on her
knees, hands loosely clasped — show the hands clearly and correctly, five fingers each,
with visible knuckle creases and short bare nails. The scar on her right knee is visible.
She is looking up at whoever is taking the photo with a flat, unimpressed expression.
Natural overcast light from above, soft shadows under her chin and knees.
```

---

## § D — Universal rules (har prompt pe lagoo)

### ❌ Ye shabd kabhi mat likhna
`beautiful` · `gorgeous` · `stunning` · `flawless` · `perfect skin` · `smooth skin` ·
`model` · `8k` · `ultra HD` · `hyperrealistic` · `masterpiece` · `professional photography` ·
`cinematic lighting` · `studio lighting` · `award winning` · `bokeh` · `sharp focus` · `symmetrical`

**Kyun:** ye saare words model ko uske training data ke *glamour photography* cluster mein le
jaate hain. Aur glamour photography hi wo cheez hai jo AI jaisi dikhti hai. `hyperrealistic`
maangna literally realism ka ulta karta hai.

### ✅ Ye shabd hamesha achhe kaam karte hain
`unedited` · `candid` · `snapshot` · `phone camera` · `overcast` · `flat light` ·
`slightly underexposed` · `mild grain` · `visible pores` · `uneven skin tone` ·
`flyaway hair` · `slightly out of focus` · `mid-blink` · `not posing` ·
`unflattering` · `ordinary` · `she posted it anyway`

### Ek line jo sabse zyada kaam karti hai
Prompt ke ant mein ye add karo:
```
It should look like a photo that would not stand out on anyone's camera roll.
```

### Aspect ratios
- Feed post → `4:5` (Instagram pe sabse zyada jagah leta hai)
- Reels / Story → `9:16`
- Grid / character sheet → `1:1`
