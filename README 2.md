# Snap It — Vehicle Photography Guide PWA

**Version:** 9.1 | **Service Worker Cache:** snapit-v29

A Progressive Web App (PWA) for guided vehicle photography. Designed for iPhone, installed via Safari's "Add to Home Screen". Guides photographers through a structured 58-shot list with framing overlays, automatic lens switching, Cloudinary upload, and a local zip save option.

---

## How It Works

### Core Flow

1. **Home screen** — Enter vehicle registration, check connection status, read tip of the day
2. **Position A prompt** — Bird's eye diagram showing vehicle placement at 45° to wall, front wheels on full lock. Tap "Vehicle Ready" → shot list. Rotate to landscape → camera
3. **Shot list (portrait)** — Full list of all 58 shots, status indicators, thumbnails of captured photos. Rotating to landscape opens the camera
4. **Camera viewfinder (landscape)** — Live camera feed with semi-transparent overlay image, lens selector, overlay opacity slider, shutter button, skip button
5. **Review screen** — Preview captured photo, retake or save and advance
6. **Position B prompt** — Shown automatically when moving from shots 1–4 to shots 5–58. Tap "Vehicle Ready" → goes straight to camera in landscape
7. **Complete screen** — Summary of captured/uploaded/skipped counts, live upload progress bar, save to device (zip), Finish & Delete button

### Navigation Model

- **Portrait orientation** → Shot list
- **Landscape orientation** → Camera viewfinder
- Rotating between them switches screens automatically
- The position prompt screens respond to rotation too

---

## File Structure

```
/
├── index.html          # Entire app — HTML, CSS, JS in one file (~1,800 lines)
├── shots.json          # Shot list data — 58 shots with id, name, position, lens, mandatory
├── manifest.json       # PWA manifest — icons, display mode, theme colour
├── sw.js               # Service worker — caches app for offline use
├── icons/
│   ├── icon-192.png    # PWA home screen icon
│   └── icon-512.png    # PWA splash screen icon
└── overlays/
    ├── photo_1.jpg     # Framing overlay for shot 1 (1280×960, ~150KB each)
    ├── photo_2.jpg
    └── ... photo_58.jpg
```

---

## Shot List Structure (`shots.json`)

Each shot object:

```json
{
  "id": 1,
  "name": "Front 3/4 driver side (wheels angled / roof open)",
  "description": "...",
  "position": "A",
  "mandatory": true,
  "lens": 2.0
}
```

| Field | Values |
|---|---|
| `position` | `"A"` (shots 1–4, vehicle angled) or `"B"` (shots 5–58, vehicle square) |
| `mandatory` | `true` (45 shots) or `false` (13 shots) |
| `lens` | `0.5` (9 shots), `1.0` (7 shots), `2.0` (42 shots) |

---

## Camera System

### Lens Mapping

Built dynamically at runtime by enumerating `mediaDevices` and matching iOS camera labels:

| iOS Label | Mapped to |
|---|---|
| Back Ultra Wide Camera | 0.5× |
| Back Camera | 1.0× |
| Back Telephoto Camera | 3.0× (assumed) |
| 2.0× slot | Always main sensor + `zoom: 2.0` constraint (crop of 1×) |

Virtual/fused cameras (`Back Triple Camera`, `Back Dual Wide Camera`, `Back Dual Camera`) are excluded — these are software constructs, not physical lenses.

### Why 2× is a Crop

The 2× slot deliberately uses the main sensor (`Back Camera`) with a `zoom: 2.0` WebRTC constraint rather than the telephoto lens. This matches Apple's native camera app behaviour for close subjects, giving the full close-focus range of the main sensor (minimum ~10–15cm) rather than the telephoto's longer minimum focus distance.

### Focus

- `focusMode: 'continuous'` requested at stream open — continuous autofocus throughout the session
- `deviceId: { ideal }` used (not `exact`) to give iOS freedom to apply its full focus stack
- Tap-to-focus: tap anywhere on viewfinder to set `pointsOfInterest` and trigger focus at that point

### Capture

- Resolution: `2560×1920` (ideal) — chosen to unlock iOS stabilisation modes while retaining more than sufficient resolution for web use
- Quality: JPEG at 0.80
- Crop: 4:3 from video stream before encoding
- Size cap: images exceeding 10MB are rejected by Cloudinary's free tier; 2560×1920 at 0.80 typically produces 3–7MB

---

## Upload System

### Cloudinary

Photos upload to Cloudinary immediately after each shot is saved. Credentials (Cloud Name, Upload Preset) are stored in `localStorage` and configured in Settings.

Upload path: `SnapIt/{REGISTRATION}/{DATE}/{filename}`

Filename format: `{REG}-{SHOT_NUM}-{SHOT_NAME}-{YYYYMMDD}_{HHMMSS}.jpg`

### Retry Queue

Failed uploads are added to `uploadQueue`. A 30-second interval timer retries all queued uploads automatically in the background. Upload status is tracked per shot: `taken` → `uploaded` or `failed`.

### Status Indicators

- Upload warning badge on camera screen when uploads are queuing
- Shot list shows per-shot status: Required/Optional → ✓ Taken → ✓✓ Uploaded → ✗ Failed
- Complete screen shows live progress bar while uploads are in flight

---

## Overlay System

### Preloading

All 58 overlay images are preloaded into `overlayCache` immediately when a shoot starts, using 4 parallel `Image()` loaders starting from the current shot index. By the time the user reaches any shot, its overlay is already in memory.

### Display

On shot change, the overlay `<img>` element's `src` is swapped from the cache object directly — no network request, no flash. Falls back to a network load if not yet cached, with a race-condition guard to prevent stale overlays from showing on the wrong shot.

---

## Dependencies

All loaded from CDN, no build step required:

| Dependency | Version | Purpose |
|---|---|---|
| Google Fonts (Syne, DM Sans) | — | Typography |
| JSZip | 3.10.1 | Zip all photos for local save — loaded on demand only |

No npm, no bundler, no framework. Plain HTML/CSS/JS.

---

## Deployment

Hosted on **GitHub Pages** at the repository root.

To deploy: push `index.html`, `shots.json`, `sw.js`, `manifest.json`, `icons/`, and `overlays/` to the `main` branch. GitHub Pages serves directly from root.

To install on iPhone: open URL in Safari → Share → Add to Home Screen.

**Important:** bump the service worker cache version (`CACHE = 'snapit-vN'`) with every deployment, otherwise iOS will serve the old cached version to existing users.

---

## What's Been Built

- ✅ Full 58-shot guided workflow with position A/B transitions
- ✅ Orientation-driven navigation (portrait = list, landscape = camera)
- ✅ Automatic lens switching per shot with dynamic camera map built from device labels
- ✅ 2× virtual crop of main sensor for close-focus capability
- ✅ Semi-transparent overlay images with opacity slider
- ✅ Overlay preloading for instant display
- ✅ Cloudinary background upload with auto-retry
- ✅ Shot list with thumbnails, status pills, per-shot retry
- ✅ Review screen with retake flow
- ✅ Complete screen with live upload progress, save to device, Finish & Delete
- ✅ Zip download via iOS share sheet with dated filename
- ✅ Bird's eye position diagrams (SVG, landscape-responsive)
- ✅ Home screen with connectivity indicator and rotating tip of the day
- ✅ PWA — installable, full screen, no browser chrome
- ✅ Service worker caching for offline capability
- ✅ Safe area handling for notch/Dynamic Island/home indicator
- ✅ Wake lock to prevent screen sleeping during shoot
- ✅ Flash animation and haptic feedback on shutter
- ✅ Black frame prevention (double requestAnimationFrame + brightness check)

---

## Known Issues / Limitations

- **Tap-to-focus** — focus ring displays correctly but iOS Safari's WebRTC implementation may not reliably honour `pointsOfInterest` constraints. Continuous AF works well for most shots
- **Cinematic stabilisation** — Apple's smooth "floaty" stabilisation is only available via native AVFoundation (Swift/SwiftUI app). WebRTC gets basic OIS only
- **PWA viewport** — occasional layout quirks when switching orientation rapidly in PWA mode; viewport meta forces `user-scalable=no` to prevent iOS zoom bug

---

## Still To Do

- [ ] **Revert testing mode** — all shots are currently skippable for testing. Restore mandatory/optional skip button logic before production use
- [ ] **More overlay images** — only `photo_1.jpg` has been replaced with a real reference photo; remaining overlays are placeholders
- [ ] **Test on second device** — lens mapping for a device with a physical 2× telephoto lens has been coded but not tested in the field
- [ ] **Settings screen** — consider adding Cloudinary connection test button so users can verify credentials before starting a shoot
- [ ] **Session persistence** — if the app is closed mid-shoot, all captured photos and progress are lost (held in memory only). Could persist to `IndexedDB` for recovery
- [ ] **Native app** — for cinematic stabilisation, ProRes capture, and tighter focus control, a Swift/SwiftUI app using `AVFoundation` would be the natural next step
