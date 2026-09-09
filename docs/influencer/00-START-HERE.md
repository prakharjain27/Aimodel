# AI Female Influencer — Build Plan (START HERE)

## Sabse pehle: main kya kar sakta hoon, kya nahi

Main ek **remote cloud container** mein chal raha hoon — tumhare laptop se connected nahi hoon.

| Cheez | Main kar sakta hoon? |
|---|---|
| Tumhare Chrome ko control karna, ChatGPT/Canva khud chalana | **Nahi.** Woh Chrome extension wala Claude alag instance hai, uske paas ye session nahi hai. |
| Images generate karna (face/body) | **Nahi** — is session mein image tool nahi hai. |
| Character bible, locked identity spec, copy-paste prompts, realism system | **Haan — aur asli bottleneck yahi hai.** |
| Tumhare `ai-influencer-studio` app ko is character ke liye tune karna | **Haan.** |

**Toh division of labour:** main dimaag ka kaam karta hoon (spec + prompts + QC system), tum ChatGPT mein
paste karke generate karte ho. Har output mujhe describe karo ya app mein daalo — main iterate karunga.

Ek aur option: tumhara **apna app** (`ai-influencer-studio`) already OpenAI image API se generate karta hai.
Woh ChatGPT UI se better hai kyunki wahan `master_prompt` save hota hai = consistency. Recommend karta hoon
ki final pipeline app pe chale, ChatGPT sirf experimentation ke liye.

---

## Workflow (exact order — isi order mein chalna, shortcut mat maarna)

```
STEP 0  Identity lock        →  01-character-bible.md   (ho chuka, tum approve karo)
STEP 1  Hero face image      →  02-prompt-pack.md § A   (1 image, 20-30 tries lagenge)
STEP 2  Face QC              →  03-realism-checklist.md (pass na ho to STEP 1 repeat)
STEP 3  Character sheet      →  02-prompt-pack.md § B   (hero face ko reference upload karke)
STEP 4  Full body turnaround →  02-prompt-pack.md § C
STEP 5  Consistency lock     →  04-consistency-system.md (LoRA / master prompt)
STEP 6  Content batch        →  scenes generate, har ek pe checklist chalao
```

**Critical:** STEP 1 ka output hi poori influencer ki neev hai. Usme 90% effort jaana chahiye.
Ek average hero face = hamesha average influencer. Jab tak "ye banda real lagta hai" ka
gut feeling na aaye, aage mat badho.

---

## Tumse kya chahiye (ye do, phir main aage badhta hoon)

### Zaroori
1. **Reference images** — jaise bola tha. Par padho neeche "Reference rules".
2. **Naam final** — maine `Ira Sethi` default rakha hai. Change karna ho to bolo.
3. **Niche** — fashion / fitness / travel / beauty / lifestyle-comedy? Ye poora outfit + location
   + caption tone decide karta hai. Maine `urban fashion + dry-humour lifestyle` assume kiya hai.
4. **Platform** — Instagram primary? Reels chahiye? (Reels = video model bhi chahiye, alag budget.)
5. **City** — main `Mumbai` assume kar raha hoon. Ye backgrounds, weather, light quality,
   local landmarks sab decide karta hai. Galat city = log pakad lenge.

### Reference rules — ye seriously padhna
- References **vibe, pose, lighting, outfit, colour grade** ke liye do — **face clone karne ke liye nahi.**
- Kisi **real person ka chehra copy mat karo.** Teen problems: (a) legal — personality rights,
  India mein ab courts ne actors ko ye diya hai, (b) platform pe report ho ke permanent ban,
  (c) koi bhi reverse-image search karega to poora setup ek din mein exposed.
- Best: 4-6 alag logon ki photos do "isme se ye jaw chahiye, isme se ye hair" — blend original hota hai.

### Optional par bahut helpful
6. ChatGPT Plus hai ya free? (free pe image limits kaafi tight hain)
7. Budget kuch hai? — ₹0 (sirf ChatGPT), ya ₹2-5k/month (Flux LoRA + video) me farak bada hai.
8. Monetisation plan — brand deals? affiliate? Ye decide karta hai kitna "safe for brands" rehna hai.

---

## Ek practical warning (moral lecture nahi, account bachane ki baat)

Virtual influencer banana legit business hai — Lil Miquela, Aitana López, Milla Sofia sab
paisa kama rahe hain. Par:

- **Instagram/Meta ka AI-content label** — photorealistic AI content ko label karna policy hai.
  Bahut saare successful virtual influencers bio mein `AI` ya `virtual` likh dete hain aur
  phir bhi lakhon followers hain. Chhupane ki koshish mein account gaya to sab mehnat zero.
- **Brand deals** — koi bhi serious brand contract mein poochhega. Baad mein pata chala =
  payment rukega + legal notice. Pehle se disclose karna zyada paisa deta hai, kam nahi.
- Isliye target ye rakho: **"itna real dikhe ki scroll karte hue koi farak na pade"** —
  na ki **"kabhi kisi ko pata na chale"**. Pehla achievable aur profitable hai. Doosra nahi.

Baaki poora realism engineering — jo tumne maanga tha, chhote se chhota point — wo
`03-realism-checklist.md` mein hai. Usme koi compromise nahi kiya.
