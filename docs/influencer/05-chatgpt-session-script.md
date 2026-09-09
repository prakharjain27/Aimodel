# ChatGPT Session Script — bas copy-paste karo

> Sochna kuch nahi hai. Neeche har MESSAGE ko order mein ChatGPT mein paste karo.
> **Ek hi chat mein raho poore session ke liye** — naya chat khologe to consistency toot jaati hai.

**Setup:** ChatGPT kholo → **naya chat** → neeche se shuru karo.

---

## MESSAGE 1 — Chat ko setup karo

```
I'm creating an original fictional character for a photography project. She is not
based on any real person. I'll be generating a series of photos of her and I need
her face to stay identical across all of them.

Important: I do NOT want glamour or fashion photography. I want ordinary, unremarkable
phone snapshots — the kind that fill a normal person's camera roll. Slightly bad
lighting, visible skin texture, imperfect framing. If a photo looks polished or
flattering, it's wrong.

Please confirm you understand, then wait for the character description.
```

---

## MESSAGE 2 — Character DNA daalo

`docs/influencer/master-prompt.txt` ki poori line paste karo, aur upar ye add karo:

```
Here is the character. Memorise these details exactly — every photo must match them:

[MASTER-PROMPT.TXT KA CONTENT YAHAN PASTE KARO]

Confirm you have these locked, then wait.
```

---

## MESSAGE 3 — Hero face banao

`02-prompt-pack.md` § A1 ka poora prompt paste karo.

**Ab 20-30 baar generate karoge.** Har baar bas ye bhejo:
```
Again, different attempt. Same character, same instructions.
```

---

## MESSAGE 4 — ChatGPT se khud ki galti nikalwao ⭐

Ye sabse under-rated trick hai. ChatGPT apni hi image ko dekh kar critique kar sakta hai.

```
Now look at the image you just generated as if you were trying to prove it was
AI-generated. Be harsh. Check specifically:

- hands and finger count
- whether the catchlights in both eyes match the same light source
- teeth (are they too uniform?)
- ears, and whether the piercings match (left two, right one)
- skin texture — are pores actually visible or is it smoothed?
- any readable or garbled text in the background
- shadow directions — do they all agree?
- is the mole on the left cheekbone present and in the right place?

List every problem you find. Don't be polite about it.
```

Phir:
```
Now regenerate, fixing every issue you just listed.
```

**Ye loop 3-4 baar chalao.** ₹0 budget mein ye tumhara sabse powerful tool hai — ye
manual QC ka 70% kaam kar deta hai.

---

## MESSAGE 5 — Hero face lock karo

Jab ek image `03-realism-checklist.md` ke 7-point quick check pass kar le:

```
That one is correct. This is now the locked reference for this character. Every future
image in this conversation must match this face exactly — same bone structure, same mole
positions, same asymmetry, same hair.

Confirm, then wait for scene requests.
```

**Image download karo. Naam do: `ira-hero-v1.jpg`. Do jagah backup rakho.**
Ye poori influencer ki master key hai — kho gayi to zero se shuru.

---

## MESSAGE 6 — Character sheet

`02-prompt-pack.md` § B1 → § B2 → § B3, ek-ek karke isi chat mein.

Har sheet ke baad MESSAGE 4 wala critique loop chalao.

---

## MESSAGE 7 — Full body

`02-prompt-pack.md` § C1 → § C2 → § C3.

**Full body pe critique loop zaroori hai** — yahan haath, pair aur proportions sabse
zyada galat hote hain.

---

## MESSAGE 8+ — Content batch

`06-scene-library.md` se scene prompts uthao. Har ek ke aage ye lagao:

```
Same character, same locked face. New scene:
[SCENE PROMPT YAHAN]
```

---

## Jab chat dheemi ho jaaye

50-60 images ke baad ChatGPT slow ho jayega aur chehra drift karne lagega. Tab:

1. Naya chat kholo
2. **MESSAGE 1 + MESSAGE 2 dobara** bhejo
3. **`ira-hero-v1.jpg` upload karo** aur likho:
   ```
   This attached photo is the locked reference for this character. Match this face
   exactly in every image. Confirm, then wait.
   ```
4. Aage badho

**Har naye chat mein hamesha wahi ek hero image upload karo** — recent images nahi.
Warna drift compound hota hai: har generation pichhli ki galti inherit karke aur badha deta hai.

---

## ₹0 Consistency Protocol — 6 rules

1. **Ek chat, jitna lamba chal sake**
2. **Hamesha `ira-hero-v1.jpg`** reference — kabhi naya image reference mat banao
3. **Master prompt har naye chat mein** dobara paste
4. **Critique loop** har important image pe (MESSAGE 4)
5. **Mole map check** har image pe — M1 left cheekbone, M2 right jaw, kaan 2/1
6. **Har 20 images pe** hero ke saath side-by-side rakh ke drift check karo

Isse ~80% consistency milegi. Ye ₹0 ki realistic ceiling hai —
100-150 images tak theek chalega, uske baad LoRA ke bina mushkil hoga.
