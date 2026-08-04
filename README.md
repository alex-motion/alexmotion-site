# AlexMotion — static site

Plain HTML/CSS/JS rebuild of [alexmotion.com](https://www.alexmotion.com), migrated off
Squarespace. No build step, no dependencies — open the files or serve the folder.

## Run locally

```bash
python3 -m http.server 4173 --directory alexmotion-site
```

Then visit <http://localhost:4173>.

## Structure

```
index.html          Home — Vimeo reel, tagline, 5 category cards
about.html          About — bio + portrait
contact.html        Contact — "Let's Chat!" form (needs a Formspree ID, see below)
logo-reveals.html   6 projects
titles.html         5 projects
character.html      5 projects
play.html           7 projects
logos.html          SYMBOL — 29 inline SVG marks with hover-swap
css/style.css       All styles (design tokens at the top)
js/main.js          Mobile nav, touch logo-swap, video fallback
assets/
  images/           Logo mark, favicon, portrait, 5 category card GIFs
  fonts/            Poppins 600/700 (self-hosted, SIL OFL)
  video/            ← project .mp4s go here (see assets/video/README.md)
  custom.css        Original Squarespace custom CSS, kept for reference
  logos-extracted.html  Raw 29 logo blocks as pulled from Squarespace
  raw-pages/        HTML snapshots of the original pages
```

## Design tokens

Lifted from the live Squarespace theme, defined in `css/style.css`:

| Token | Value | Use |
|---|---|---|
| `--blue` | `#0073FF` | Page background |
| `--yellow` | `#FFEA49` | Headings, borders, buttons |
| `--navy` | `#0A1D54` | Text stroke + stacked drop shadow |
| `--mint` | `#EDFFEF` | SYMBOL default fill |
| `--cyan` | `#A5FFFF` | Secondary/meta text |

## Contact form — one step to go live

The form is built and styled; it just needs an endpoint. A static site can't send mail on
its own, so submissions go through [Formspree](https://formspree.io):

1. Sign up, create a form, set its notification address to **alex@alexmotion.com**.
2. Formspree gives you an endpoint like `https://formspree.io/f/abcdwxyz`.
3. In [`contact.html`](contact.html), replace `YOUR_FORM_ID` in the `<form action>` with
   that ID. That's the only edit.

Until then the Submit button won't post — it shows an inline "not connected yet" notice
instead, so nothing silently disappears into a dead endpoint.

How it behaves once connected:

- Submits via `fetch`, so the visitor stays on the page and gets an inline success message.
- **With JS disabled it still works** — the form posts natively to the same endpoint and
  Formspree shows its own confirmation. The JS is an enhancement, not a dependency.
- The Subject field is named `_subject`, so whatever the visitor types becomes the subject
  line of the email you receive. The Email field is named `email`, which Formspree uses as
  the reply-to — so hitting Reply in your inbox goes straight back to them.
- A hidden `_gotcha` honeypot catches basic spam bots.
- Required-field errors only highlight after a submit attempt, not on page load.

To switch providers later (Web3Forms, Basin, Netlify), swap the `action` URL — the field
names follow common conventions, so most services need no other change.

## Fonts

**Cubano** (display) loads from the Adobe Fonts kit `vak5qoq`, linked in each page's `<head>`:

```html
<link rel="stylesheet" href="https://use.typekit.net/vak5qoq.css">
```

The kit serves Cubano as a `url()`-only webfont, so visitors get it whether or not they have
it installed. If it ever fails to load, `--font-display` falls back to `'Display Fallback'`
(Poppins Bold remapped to weight 400, so real Cubano never gets faux-bolded) — visibly not
Cubano, but the layout holds.

⚠️ **Adobe Fonts kits are domain-restricted.** The kit currently works on `localhost` and
`alexmotion.com`. When deploying anywhere else — a Netlify/Vercel preview URL, a staging
domain — add that hostname to the kit in Adobe Fonts or Cubano silently won't load there.

**Poppins** (body) is SIL OFL and self-hosted in `assets/fonts/`.

## Video

All 23 project videos are in place, transcoded to 1080p from the masters in
`~/Documents/_Jobs/1_Alexmotion Brand/Website/Videos` (originals untouched). They play
muted and looped, matching the original Squarespace video block settings.

Because the pages carry a lot of video, each clip is lazy-loaded: `preload="none"` plus an
IntersectionObserver that attaches the source and plays only when the slot scrolls into
view, and pauses it on the way out. A file that's missing or fails to load flips its slot to
a styled placeholder rather than a broken player.

**Aspect ratios.** Slots default to 16:9, but the four clips that aren't get their true ratio
via an inline `--ar` custom property plus `.video-slot--tall` (which caps their width so a
square clip doesn't render as tall as the column is wide):

| Clip | Ratio |
|---|---|
| `oak-life-cycle`, `8-ball`, `hold-the-last-frame` | 1080×1080 (1:1) |
| `skull-morph` | 1080×1350 (4:5) |

If you add a clip that isn't 16:9, give its slot the same treatment — otherwise
`object-fit` will crop it into the default 16:9 box.

Per-file provenance, duration verification, and two clips worth a second look are documented
in [`assets/video/README.md`](assets/video/README.md).

## Notes on fidelity to the original

- **Contact** is a `mailto:` in the nav and footer. The live site has no `/contact` page —
  that URL 404s — so there was nothing to port.
- The **SYMBOL** marks are inline SVG (not images), carried over with the original
  hover-swap: mint by default, navy on hover, cross-faded over 0.3s. Touch devices tap to
  swap, handled in `js/main.js`.
- The **reel** is the same Vimeo embed as the original (video `1040858885`).
- The 29 SYMBOL marks have no titles or captions in the source — they're an unlabeled grid
  there too.
- The original's scrolling "FEATURED" marquee was dropped from the home page by request.
- Video viewers keep the original's rounded corners but not its yellow outline.
- Home cards have no "View Project" button — the whole card is one link, and the yellow
  outline is a hover affordance. Two things make that safe:
  - **Touch/narrow screens keep the outline permanently** (`@media (hover: none), (max-width: 768px)`),
    since without hover there'd be no signal the card is tappable at all.
  - **Padding sits on `.card__link`, not `.card`.** With it on the card, the padding band is
    outside the anchor and silently swallows edge clicks.
