# Cut-out overlays

Transparent PNGs that float over their section and drift against the scroll.
Filenames matter — the code looks for these exact names.

| File | Where it appears |
| --- | --- |
| `palapa_tower.png` | Fusion Festival section, right-hand side, breaking out past the top of the photo tiles |
| `chest.png` | Shipwrecked section, right-hand side, with the hologram countdown beside it |

Copy them from `A:\PROJECTS\SWEETFIX\` into this folder.

**If a file isn't here, its section still renders — the overlay just removes
itself.** Nothing breaks, so you can add them one at a time.

## Getting the best out of them

- **Keep the alpha channel.** Save as PNG-24 with transparency, not PNG-8.
- **Around 1600px on the long edge** is plenty. Bigger just costs load time.
- **Trim the transparent margin** to the artwork's bounding box, otherwise
  the drift looks off-centre — the code positions the file, not the pixels
  inside it.
- A drop shadow is applied in CSS, so the PNG itself doesn't need one baked
  in. If yours already has one, it'll double up — export a clean cut-out.

## The treasure hunt

The chest's countdown and code live in `src/lib/site.ts` under `treasure`:

```ts
export const treasure = {
  unlockAt: '',            // ISO timestamp, e.g. '2026-12-31T20:00:00+13:00'
                           // leave empty to hide the countdown
  code: 'SHIPWRECK',       // case- and space-insensitive
  hint: '…',               // shown under the keypad
  reward: '…',             // revealed once the code is entered
}
```

Once someone cracks it, the unlocked state is remembered in their browser so
it stays open when they come back.
