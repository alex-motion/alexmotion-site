# Project videos

All 23 project videos are in place. Filenames are referenced by `data-src` in the
project pages, so renaming one breaks its slot.

## How these were sourced

Transcoded from the masters in
`~/Documents/_Jobs/1_Alexmotion Brand/Website/Videos` with:

```bash
avconvert -s "<master>" -p Preset1920x1080 -o "<slug>.mp4" --replace
```

The masters total ~650 MB (one 4K file alone is 262 MB) — far too heavy to autoplay on a
web page. At 1080p the set is ~220 MB, and the pages lazy-load each clip only when it
scrolls into view, so no visitor downloads more than the few they actually look at.
Aspect ratios are preserved: square pieces stay 1080×1080, `skull-morph` stays 1080×1350.
**The originals were not modified** — re-run the command above to regenerate any file.

## Mapping

Durations were verified against metadata embedded in the original Squarespace pages, so
these pairings are confirmed rather than guessed.

| File | Master | Duration |
|---|---|---|
| `sad-studio.mp4` | Logo Reveals/Sad MSTR_Full HD 3.mp4 | 7.04s ✓ |
| `epoch.mp4` | Logo Reveals/Epoch Master 3.mp4 | 14.00s ✓ |
| `c-alex-motion.mp4` | Logo Reveals/Logo Open Short.mp4 | 5.30s ✓ |
| `radish-logo-reveal.mp4` | Title Design/Radish Compilation Full Purple on Brand 2.mp4 | 9.79s ✓ |
| `and-person.mp4` | Logo Reveals/Ampersand Pointer 8.mp4 | 16.67s ⚠ |
| `nimbus.mp4` | Play/Breeze Saber_Nimbus 2.mp4 | 9.68s ✓ |
| `meet-ugly.mp4` | Title Design/Meet Ugly_TitleandCredits.mp4 | 8.05s — |
| `sympho.mp4` | Title Design/Rainy Night Drive_Sympho 7.mp4 | 4.54s — |
| `jazz-hand.mp4` | Title Design/Jazz Hand Master.mp4 | 17.50s — |
| `elegy-for-the-wind.mp4` | Title Design/An Elegy for the Wind_04.mp4 | 10.01s — |
| `ubud-pop.mp4` | Title Design/Ubud Pop 4_01.mp4 | 7.21s — |
| `genie-meow.mp4` | Character Work/Master Genie 4.mp4 | 3.09s ✓ |
| `sly-dog.mp4` | Logo Reveals/Sly Dog Small_Dog Flip_Final.mp4 | 19.80s ✓ |
| `skeleskater.mp4` | Character Work/Skull Skater_Building Jump_With Sound_30fps_01.mp4 | 5.03s ✓ |
| `hold-the-last-frame.mp4` | Character Work/Dance with emphasis 2.mp4 | 19.53s ✓ |
| `monster-hangover.mp4` | Character Work/Halftone Effect CMYK_04.mp4 | 3.21s ⚠ |
| `soft-lock.mp4` | Play/Ball cage 11.mp4 | 9.47s ✓ |
| `oak-life-cycle.mp4` | Play/Oak Tree Life Cycle_compressed_01.mp4 | 11.73s ✓ |
| `8-ball.mp4` | Play/8 Ball Loop Square_02.mp4 | 9.01s ✓ |
| `between-here-and-there.mp4` | Play/Between Here and There_Tiled 6_01.mp4 | 14.38s ✓ |
| `sketchbook-scroll.mp4` | Character Work/camera up main 9.mp4 | 47.63s ✓ |
| `spinner.mp4` | Play/Spinner_textured.mp4 | 3.03s ✓ |
| `skull-morph.mp4` | Play/Skull Morph IG_06.mp4 | 14.07s ✓ |

✓ = duration matches the live site exactly · ⚠ = see below · — = Cinematic Titles, matched by
filename (that page was never snapshotted, so there's no duration to compare against)

## Two worth a second look

- **`and-person.mp4`** — the live site ran a 4.33s cut; the only local Ampersand file is the
  full 16.67s version, so that's what's here. If you still have the short cut, drop it in
  under the same name.
- **`monster-hangover.mp4`** — 3.21s vs the site's 3.25s (about one frame). Worth flagging
  because `Lark_Text (2).mp4` matched the site duration to within 2ms, but a thumbnail showed
  it to be a pink script "Lark" logo, not the monster. `Halftone Effect CMYK_04.mp4` is
  visually the right piece — a halftone-textured monster, matching "expression and texture"
  in the caption.

Several files also sit in folders that don't match their page: `sly-dog` and the Rad*ish
reveal are filed under Logo Reveals / Title Design respectively, and `sketchbook-scroll` is
`camera up main 9.mp4` under Character Work (the `Sketch Scroll` file is the vertical IG cut
and doesn't match the site's 47.63s 16:9 version).
