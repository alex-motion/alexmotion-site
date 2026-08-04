# AlexMotion Site Content Reference (v2 — locally verified)

Supersedes the original handoff doc's "not retrievable" sections. Pulled directly via `curl`
against raw page HTML (no JS execution needed — Squarespace server-renders most content;
galleries hydrate client-side but captions/media refs are present in the initial HTML).

Raw HTML snapshots saved in `assets/raw-pages/`. Downloaded assets in `assets/images/`.

## Corrections to the original reference doc

1. **No `/contact` page exists.** `https://www.alexmotion.com/contact` returns a real 404
   (confirmed via HTTP status, not just an unparsed page). The live nav only contains **About**
   — no separate Contact nav item. "Contact" is handled entirely via the footer icons: email
   (mailto:alex@alexmotion.com), Instagram, LinkedIn. Nothing to migrate for a Contact *page*;
   just wire up the footer/social links.
2. **`/logos` (SYMBOL) is not a video/image gallery — it's 29 inline SVG marks with a
   CSS hover-swap effect.** This is great for the migration: no media export needed, it's
   directly portable code. See `assets/logos-extracted.html` for all 29 `<div class="logo-link">`
   blocks (each has a `.logo-default` and `.logo-hover` SVG state). The swap mechanics and
   colors live in `assets/custom.css`:
   - Default state fill: `#edffee`, hover state fill: `#0a1d54`
   - Desktop: CSS `:hover`. Mobile: JS presumably toggles a `.mobile-hover` class (referenced
     in CSS but the toggle script itself wasn't in the static HTML — check Squarespace's
     `website.components.code` block bundle if you need the exact touch-trigger logic).
3. Sitemap shows extra/stray pages not in the original doc: `/logos-1` ("Logos (Copy)" — draft
   duplicate, ignore), `/play-1`, `/home-1`, `/home-2`, `/comingsoon`, and several one-off
   project pages (`/somacola`, `/offbrand`, `/aquaerial`, `/tale-end`, `/froggy`, `/bookbear`,
   `/duk-duk`, `/svgator`, `/svgator-1`, `/gif-link`) that aren't linked from any of the 5
   category pages I fetched. Worth a quick look in the Squarespace admin to see if any are live
   content that should be migrated or just abandoned drafts.

## Logo Reveals page (`/logo-reveals`)

Headline: "Animated Logo Reveals-"
Subhead: "A collection of **animated logo reveals** created for **brands, studios,** and
**personal projects.**"
Note: "Doubleclick Video for Fullscreen." (site-wide gallery UI hint, present on all video
category pages)

1. **Sad Studio** — Logo reveal for design client Sad Studio. A dreaded three-dot loader
   playfully transforms into the final mark.
2. **EPOCH** — A fictional movie studio intro that pays homage to the dramatic grandeur of
   1980s studio logos. Radiant linework and glowing transitions evoke retro-futurist
   aesthetics à la Tristar, Universal, and Paramount—reviving a golden era of cinematic
   branding.
3. **"c"Alex Motion?** — My previous logo animation before rebranding and dropping the "c."
   More textured and cinematic, but ultimately didn't feel like the right fit.
4. **Rad*ish Logo Reveal** — Gritty, high-energy logo reveal for Rad*ish, the production team
   behind several 48 Hour Film Projects. Rough textures and lo-fi transitions match the DIY,
   punk-adjacent spirit of the brand.
5. **& Person** — Don't you just love ampersands?
6. **NImbus** — An ethereal exploration of particle systems and glow effects, reimagined as a
   logo reveal for an AI company focused on empathy training, model wellness checks, and
   robotic rights. Soft motion and luminous transitions reflect a vision of artificial
   intelligence that is emotionally attuned, ethically designed, and quietly self-aware.

**Video sourcing:** 6 videos confirmed embedded (Squarespace native video blocks, HLS-only —
no direct progressive-MP4 URL is public; CDN links are signed and expire). Pull the actual
files from the Squarespace admin media library as originally planned. I could match 4 of 6
video-block IDs to captions with confidence from DOM order (Sad Studio, EPOCH, "c"Alex Motion?
map cleanly to the first three video blocks in sequence); the mapping for **Rad*ish Logo
Reveal**, **& Person**, and **NImbus** vs. the remaining video block IDs was ambiguous in the
raw markup (grid/column layout reorders DOM vs. visual order) — verify those three visually
against the live page rather than trusting file order.

## Character page (`/character`)

Headline: "Character-"
Subhead: "A sampling of **Digital** and **traditional** **frame by frame** **Character
animations.**"

1. **Genie Meow** — Sometimes you gotta stuff the genie back in the bottle. A Genie cat gets
   the briefest taste of freedom in this animation which began as an exploration of After
   Effects' warp effects and became an exercise in smooth shape transformations.
2. **Sly Dog** — A fun little character animation for Sly Dog Creative Studios. Their mascot
   sniffs around and checks the scene to make sure the coast is clear.
3. **SkeleSkater** — A skeleton skater wipes out in this hand-drawn animation test. An
   exercise in dynamic blocking, perspective, and character motion.
4. **Hold The Last Frame** — A Keith Haring–esque figure cuts loose on the dance floor in
   this animation study focused on hold poses, secondary motion, and dancing like a maniac.
5. **Monster Hangover** — A monster full of big feelings can't make up his mind in this
   experimental exploration of expression and texture.

**Video sourcing:** 5 video blocks, cleanly mapped 1:1 to the 5 projects above in DOM order
(Genie Meow → Sly Dog → SkeleSkater → Hold The Last Frame → Monster Hangover). Still pull
actual files from the Squarespace admin (HLS-only, signed CDN URLs).

## Play page (`/play`)

Headline: "Play-yay!-"
Subhead: "Short **loops**, **tests**, and **motion studies**. Explorations in rhythm,
transformation, and visual logic—**where ideas move** before they make sense."

1. **Soft Lock** — A short motion experiment with bouncing dynamics, nested forms, and
   physical constraints. Explores repetition, collision, and the satisfying illogic of
   movement for its own sake.
2. **Oak life cycle** — A short explainer illustrating the growth of an oak tree from seed to
   maturity. Uses icon-based transitions and a looping structure to communicate biological
   stages with visual clarity.
3. **8 Ball** — A looping motion study exploring the interplay between overlapping black and
   white shape inversions. Built using subtract blend modes to create shifting visual tension
   within a confined frame.
4. **Between here and there** — A kinetic type animation based on a lyric by Pavement. An
   experiment in text stretching techniques and dramatic tiling across screen space.
5. **Sketchbook Scroll** — A more kinetic way to revisit and reframe older sketchbook
   drawings. Combines motion, layering, and camera moves to animate static illustrations into
   a continuous scroll.
6. **Spinner** — A short motion loop exploring rotation, texture, and shifting rhythm. Built
   around layered movement and subtle distortion.
7. **Skull Morph** — A Halloween inspired transformation study focused on morphing a stylized
   skull through multiple visual states in a slow, continuous loop.

**Video sourcing:** 7 video blocks, cleanly mapped 1:1 in DOM order matching the list above.
Pull actual files from the Squarespace admin.

## SYMBOL / Logos page (`/logos`)

No body copy beyond the site-wide nav/logo mark — page is just the 29-mark SVG grid. See
`assets/logos-extracted.html` and `assets/custom.css` (details above). No individual titles
or captions exist for the marks in the source — they're presented as an unlabeled grid.

## Contact

No dedicated page. Footer/nav exposes:
- Email: alex@alexmotion.com (mailto link)
- Instagram: https://www.instagram.com/alexbaileymotion/
- LinkedIn: https://www.linkedin.com/in/alex-bailey-motion

## Assets downloaded

- `assets/images/logo-mark.gif` — animated nav logo (354×108)
- `assets/images/about-profile-photo.png` (converted from WebP; original at
  `about-profile-photo.webp`, 1174×1174)
- `assets/images/favicon-monogram.gif` — favicon/social share monogram (600×600)
- `assets/images/card-*.gif` — the 5 homepage category card animations
  (logo-reveals, symbol, titles, character, play)
- `assets/fonts/poppins-600.woff2`, `poppins-700.woff2` — body typeface, self-hosted
  (SIL OFL). The display face, Cubano, is Adobe Fonts and can't be self-hosted — see
  README.md.
- `assets/custom.css` — site-wide custom CSS (logo hover-swap, header nav styling, speech
  bubble component, typewriter effect, carousel styling)
- `assets/logos-extracted.html` — all 29 SYMBOL logo SVG blocks
- `assets/raw-pages/*.html` — raw HTML snapshots of about, logo-reveals, character, play,
  logos, contact (for future re-extraction if needed)

## Still outstanding

- Actual video files for Logo Reveals (6), Character (5), and Play (7) projects, plus the
  Cinematic Titles page (5) — pull from Squarespace admin media library per the original
  action item, since public CDN URLs are signed/expiring HLS streams only.
- Verify the video↔caption mapping for the 3 ambiguous Logo Reveals items called out above.
- Decide whether the stray sitemap pages (`/somacola`, `/offbrand`, `/aquaerial`, etc.) are
  live content worth migrating.
