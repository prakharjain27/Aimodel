# Consistency System — same chehra, hamesha

## Seedhi baat: akela ChatGPT ye nahi kar sakta

Ye sabse zaroori cheez hai jo tumhe pata honi chahiye, aur zyadatar tutorials ise chhupate hain.

ChatGPT ke image model mein **seed control nahi hai**. Har generation naye sire se hoti hai.
Reference image upload karne se wo *"kaafi similar"* chehra banata hai — par:

- 10 images ke baad drift dikhna shuru
- 30 images ke baad ye saaf taur pe alag insaan hai
- Mole ki jagah badalti rehti hai
- Chehre ka anupat dheere-dheere "average pretty face" ki taraf khinchta hai

**Aur followers exactly yahi pakadte hain.** Ek image dekh ke koi nahi keh sakta "ye AI hai".
Par 30 posts scroll karke jab chehra badalta dikhega — game over. Consistency realism se
bhi zyada important hai.

---

## Teen levels — apna budget dekho

### LEVEL 1 — Sirf ChatGPT (₹0 extra) — "chalega, par limited"

**Kaise:**
1. Hero face ko har nayi chat mein **upload** karo
2. Ek **Master Prompt** text file rakho aur wo bhi har baar paste karo (neeche template)
3. Ek hi lambi chat mein raho jab tak wo dheemi na ho jaaye — context consistency deta hai
4. Naya scene = purani image + "same woman, same face" + master prompt

**Reality check:** isse ~70-80% consistency milegi. Ek chhote account ke liye kaam chal jayega.
Serious growth ke liye kam hai. Aur ye labour-intensive hai — har image manual QC.

**Ceiling:** ~50-100 images, phir drift dikhne lagega.

---

### LEVEL 2 — Flux LoRA training (₹1,500-4,000/month) — **ye industry standard hai**

Asli virtual influencers (Aitana López type) ye karte hain. Yahi actual solution hai.

**Kaise kaam karta hai:**
1. ChatGPT se 20-30 images banao — sirf ek hi chehra, alag angles/expressions/light
   (§ B ka character sheet exactly isi ke liye hai)
2. Un images pe ek **LoRA** train karo — ye ek chhoti file hoti hai (~50-150 MB) jo model ko
   sirf *is ek chehre* ko yaad karati hai
3. Uske baad har generation mein wo LoRA lagao — **chehra locked**

**Kahan train karo:** Replicate pe `ostris/flux-dev-lora-trainer` — ~$2-3 per training run,
20-30 min. **Tumhare `package.json` mein `replicate` already installed hai** — matlab
tumne ye plan already socha hua tha. Sahi socha tha.

**Faayda:**
- 95%+ face consistency, hazaaron images tak
- Seed control — exact same image reproduce kar sakte ho
- Har image ka cost ~₹2-4
- Batch generation — 50 images ek raat mein

**Nuksan:**
- Ek baar ka setup effort
- Training images ki quality LoRA ki quality decide karti hai (garbage in, garbage out)
- Fine-tuning ke liye 2-3 training rounds lagenge

**Meri sifarish: yahi karo.** Level 1 se sirf training data banao, phir Level 2 pe shift.

---

### LEVEL 3 — LoRA + video (₹5,000-15,000/month)

Reels ke bina Instagram pe 2026 mein growth nahi hai. Static images ka reach girta ja raha hai.

- **Kling 2.5 / Runway Gen-4** — image-to-video, 5-10 sec clips
- **Higgsfield / Hedra** — talking-head, lip-sync
- **ElevenLabs** — locked voice (voice bhi consistent honi chahiye, chehre ki tarah)

**Video ka sabse bada tell:** haath ki movement aur blink rate. Asli insaan har 3-5 second
mein palak jhapakta hai. AI video ya to bilkul nahi jhapakta ya galat rhythm mein.

---

## MASTER PROMPT — har generation ke saath paste karo

> Ye tumhare app ke `characters.master_prompt` column mein bhi jaana chahiye.
> `prompt-engine.ts` isko already support karta hai (`assemblePrompt` isko verbatim preserve karta hai) — achha design hai.

```
Ira: a 23-year-old Indian woman, 165 cm, slim with a light athletic build and narrow
shoulders. Warm wheatish skin with olive undertones, visible pores across the T-zone,
natural redness on the cheeks and nose tip, faint under-eye shadows. Soft heart-shaped
face, slightly wider jaw on the left. Very dark brown eyes with slightly downturned outer
corners; the left eyelid is a little more hooded so that eye reads marginally smaller.
Thick natural eyebrows, the right one arching higher. Straight nose with a softly rounded
tip and a faint scatter of freckles across the bridge only. Full lower lip, thinner upper
lip, natural mauve-brown colour. Natural off-white teeth with the upper left lateral
incisor slightly rotated. A 4 mm dark mole on her left cheekbone two centimetres below the
outer eye corner, and a 2 mm mole on her right jawline near the ear. Dark brown-black hair,
natural loose wave, mid-back length, parted slightly left of centre, with face-framing
layers, persistent flyaways and frizz, and sun-lightened dry ends. Two piercings in her
left earlobe, one in her right. A small mole on her left collarbone and a small pale scar
on her right knee. Short bare almond nails; a thin gold ring on her right index finger.
No tattoos. No watch.
```

**Rules:**
- Isme **ek shabd bhi mat badlo**. Ye tumhari character ki DNA string hai.
- Scene description iske **baad** aata hai, iske andar nahi
- Realism instructions sabse aakhir mein
- Isko `docs/influencer/master-prompt.txt` mein save rakho (main kar deta hoon)

**Order hamesha ye:**
```
[MASTER PROMPT]  →  [SCENE: kahan, kya kar rahi, kya pehna]  →  [CAMERA & REALISM]
```

---

## Drift kaise pakdo (mahine mein ek baar karo)

1. Apni saari posted images ek folder mein rakho
2. Hero face ko unke saath side-by-side rakho
3. **Sirf mole map dekho** — M1 left cheekbone, M2 right jaw, M6 piercings
4. Agar 3 se zyada images mein mismatch hai → drift shuru ho gaya hai
5. Fix: apni **behtareen recent** images se LoRA dobara train karo (ya LoRA pe shift karo)

**Pro move:** ek "reference grid" image banao — hero face 6 angles se, ek hi PNG mein.
Har naye generation ke liye wahi upload karo, alag-alag images nahi. Ek consistent
reference = kam drift.

---

## Agla kadam — bolo aur main kar doon

Tumhare paas already ek app hai jo ye sab automate kar sakta hai. Main ye kar sakta hoon:

| # | Kaam | Faayda |
|---|---|---|
| 1 | `prompt-engine.ts` ko tag-soup se **prose** mein convert | Sabse bada quality jump, ek ghante ka kaam |
| 2 | Ira ko ek **seed character** ke roop mein DB mein daalna | App khol ke turant generate |
| 3 | **Replicate + Flux LoRA** pipeline wire karna | Asli consistency — `replicate` already installed hai |
| 4 | **EXIF-strip + JPEG-recompress** post-process script | Forensic detection se bachaav, automatic |
| 5 | Checklist ko app mein **QC screen** banana | Har image pe manual checklist, bhoolne ka chance nahi |
| 6 | Content calendar generator (captions + scene prompts) | Batch planning |

**Meri raay — is order mein:** 1 → 4 → 3 → 2 → 5 → 6.
#1 aur #4 sabse zyada faayda dete hain sabse kam kaam mein.
