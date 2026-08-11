# Photos

One folder per project. The folder name must match the project's `id` in
`src/lib/site.ts`.

```
public/images/work/
  private-residence-queenstown/
  fusion-palapa-stage/
  shipwrecked-festival/
  film-props/
  decks-southern-lakes/
  new-build-carpentry/
```

## How to add photos

1. Drop the images into the matching folder. Name them `01.jpg`, `02.jpg`, …
   so the order is predictable.
2. Open `src/lib/site.ts` and list them on that project:

   ```ts
   {
     id: 'decks-southern-lakes',
     images: [
       '/images/work/decks-southern-lakes/01.jpg',
       '/images/work/decks-southern-lakes/02.jpg',
     ],
   }
   ```

3. That's it. A project with an empty `images: []` shows a "photo coming"
   plate instead of a broken frame, so nothing looks broken mid-way.

## Before you commit them

Phone photos are 4–8 MB each and will make the site crawl on mobile. Resize
to **2000px on the long edge** and save as JPEG quality ~80, or convert to
WebP. On a Mac, Preview → Tools → Adjust Size. On Windows, Paint or
[squoosh.app](https://squoosh.app) (free, in the browser, no upload).

Aim for **under 400 KB per photo**.

## Captions

Alongside each folder, a one-line note of what it is, where, and roughly when
means the caption on the site can say something real instead of "project".

## A note on naming clients

Don't put a client's name — or an identifiable photo of their home — on the
public site without their written permission. "Private residence,
Queenstown" carries nearly the same weight and carries no risk.
