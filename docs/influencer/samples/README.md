# Sample generations — Canva image model

⚠️ **Ye files sirf 161x200 preview thumbnails hain.** Full-resolution images Canva pe hain —
neeche ke links se download karo.

| # | File | Canva link | Reference used? |
|---|---|---|---|
| 01 | `01-hero-face-cafe.jpg` | https://www.canva.com/M/MAHYVWmBcjc | — (text only) |
| 02 | `02-flash-selfie-night.jpg` | https://www.canva.com/M/MAHYVSKJD0w | — (text only) |
| 03 | `03-full-body-street.jpg` | https://www.canva.com/M/MAHYVQu3vt4 | — (text only) |
| 04 | `04-flash-selfie-REF-locked.jpg` | https://www.canva.com/M/MAHYVfKKY4c | ✅ 01 as reference |
| 05 | `05-full-body-REF-locked.jpg` | https://www.canva.com/M/MAHYVcqYJl4 | ✅ 01 as reference |

## Seekhne wali baat

**01, 02, 03 teen alag log hain.** Teeno pure text-to-image the — har generation naye sire se.
Ye wahi consistency problem hai jo `04-consistency-system.md` mein likhi hai, live dikh rahi hai.

**04 aur 05 mein 01 ko reference image ki tarah diya** — chehra ab match karta hai.
Matlab Canva ka `imageReferences` ChatGPT ke reference upload se behtar kaam karta hai.

## Status

`01-hero-face-cafe.jpg` abhi ke liye **hero candidate** hai — flat light, glamour nahi,
natural texture. Par ye abhi tak final nahi hai: full-res pe
`03-realism-checklist.md` chalana baaki hai.

## Known issues (preview resolution pe jo dikha)

- **Mole M1 consistent nahi hai** poore set mein — 02 mein prominent hai, baaki mein saaf nahi
- **04 mein flash nahi aaya** — prompt mein harsh direct flash maanga tha, model ne soft
  ambient light de diya. Flash wali texture ka faayda nahi mila.
- **03 aur 05 abhi bhi thode "street-style fashion shoot" lagte hain**, candid snap nahi
- Kaan ki piercings (left 2 / right 1), pores, catchlights, ungliyan — **preview pe verify
  nahi ho sakte**, full-res download karke dekhna padega

---

## Round 2 — depth of field fix

Feedback: *"blur nahi hai"* — background out of focus nahi tha, sab flat sharp tha.

| # | File | Canva link | Reference used? |
|---|---|---|---|
| 06 | `06-hero-DOF-cafe.jpg` | https://www.canva.com/M/MAHYVRLz2Ts | — (text only) |
| 07 | `07-hero-DOF-tight-BEST.jpg` | https://www.canva.com/M/MAHYVcReCk0 | — (text only) |
| 08 | `08-full-body-DOF.jpg` | https://www.canva.com/M/MAHYVhZNjXo | ✅ 07 as reference |

### Natural blur vs portrait-mode blur

Ye distinction zaroori hai:

- **Natural optical blur = real.** Blur distance ke saath **gradually** badhta hai. Paas ki
  cheez halki soft, door ki poori dissolved. Baal ke flyaway strands dheere-dheere background
  mein ghul jaate hain.
- **Portrait-mode fake bokeh = giveaway.** Baal ke around ek **sharp cutout edge** hota hai,
  aur poora background uniformly blur hota hai depth ke hisaab se nahi.

Prompt mein maangna hai: focal plane kahan hai, kya sharp hai, kya soft hai, aur **explicitly
mana karna hai** cutout edge / portrait mode. Sirf "blurred background" likhne se Round 1
wala flat result aata hai.

### Status

**`07-hero-DOF-tight-BEST.jpg` ab hero candidate hai** — background poora dissolve hua,
skin texture saaf, mole dikh raha hai, expression flat aur natural.
`01` ko replace karta hai.

Full-res download karke `03-realism-checklist.md` chalana abhi bhi baaki hai.
