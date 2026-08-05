# Project videos

All 23 project videos, exported from After Effects via the Anubis plugin and
committed to the repo (~53 MB total, largest file 7.5 MB). Filenames are
referenced by `data-src` in the project pages, so renaming one breaks its slot.

These replaced an earlier set I transcoded with `avconvert`, which came in at
217 MB — that tool only exposes resolution presets, so it was spending 9–11 Mbit/s
on flat-colour animation that needed a fraction of it.

## Aspect ratios

Slots default to 16:9. Two clips aren't, and carry their true ratio via an inline
`--ar` custom property plus `.video-slot--tall` (which caps their width so a square
clip doesn't render as tall as the column is wide):

| Clip | Ratio |
|---|---|
| `oak-life-cycle`, `8-ball` | 1080×1080 (1:1) |
| everything else | 1920×1080 (16:9) |

`hold-the-last-frame` and `skull-morph` **were** square and 4:5 respectively; the
Anubis exports are 16:9, and their overrides have been removed. If you re-export
either of the two remaining square clips as 16:9, drop the `style="--ar: …"` and
`video-slot--tall` from its slot in `play.html` — otherwise it gets letterboxed
into a square box.

## Files

`sad-studio` · `epoch` · `c-alex-motion` · `radish-logo-reveal` · `and-person` ·
`nimbus` · `meet-ugly` · `sympho` · `jazz-hand` · `elegy-for-the-wind` ·
`ubud-pop` · `genie-meow` · `sly-dog` · `skeleskater` · `hold-the-last-frame` ·
`monster-hangover` · `soft-lock` · `oak-life-cycle` · `8-ball` ·
`between-here-and-there` · `sketchbook-scroll` · `spinner` · `skull-morph`

To replace one, drop in a file with the same name — no markup changes needed
unless its aspect ratio differs from 16:9.

## Playback

Muted, looped, `playsinline`, and lazy-loaded: nothing is fetched until the slot
scrolls into view, and it pauses on the way out. A missing or unplayable file
flips the slot to a styled placeholder rather than a broken player.
