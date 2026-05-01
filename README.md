# 📸 Snap It — Vehicle Photography Guide

A slick Progressive Web App (PWA) that guides your team through vehicle photography shoots — overlaying reference images on the live camera viewfinder, managing shot order, and saving photos directly to the device.

---

## Features

- **58-shot guided workflow** with correct order enforced
- **Semi-transparent overlay** on live camera feed — opacity adjustable in real time
- **Position A / B transition screens** — prompts the team to move the vehicle
- **Mandatory vs optional shots** — skip button disabled on required shots
- **Photos saved to device** immediately after each shot (no overlay included in saved image)
- **Auto-named files** — e.g. `01_front_3_4_driver_side.jpg`
- **Works on iPhone** via Safari — add to Home Screen for full-screen app experience
- **Landscape optimised** with portrait lock warning
- **Screen wake lock** — keeps display on during a shoot
- **Offline capable** via service worker

---

## Project Structure

```
snapit/
├── index.html          ← Main app (single file PWA)
├── shots.json          ← Shot list config (edit this to update shots)
├── manifest.json       ← PWA manifest
├── sw.js               ← Service worker (offline support)
├── icons/
│   ├── icon-192.png
│   └── icon-512.png
└── overlays/
    ├── photo_1.jpg     ← Reference overlay for shot 1
    ├── photo_2.jpg     ← Reference overlay for shot 2
    └── ...             ← photo_3.jpg through photo_58.jpg
```

---

## GitHub Pages Setup (Hosting)

1. Create a new GitHub repository (e.g. `snapit`)
2. Upload all files maintaining the folder structure above
3. Go to **Settings → Pages**
4. Set Source to `main` branch, `/ (root)` folder
5. Click **Save** — your app will be live at:
   `https://yourusername.github.io/snapit/`

---

## iPhone Setup (Add to Home Screen)

1. Open Safari on your iPhone
2. Navigate to your GitHub Pages URL
3. Tap the **Share** button (box with arrow)
4. Tap **Add to Home Screen**
5. Name it **Snap It** and tap **Add**
6. Launch from your Home Screen for full-screen experience

> **Important:** Camera access must be allowed in Settings → Safari → Camera

---

## Updating the Shot List

Edit `shots.json` to add, remove or reorder shots. Each shot follows this format:

```json
{
  "id": 1,
  "name": "Front 3/4 Driver Side",
  "description": "Shoot from the front-left corner at 45°. Wheels angled, roof open.",
  "position": "A",
  "mandatory": true
}
```

| Field | Values | Description |
|-------|--------|-------------|
| `id` | Number | Must match overlay image filename (e.g. id 1 → `overlays/photo_1.jpg`) |
| `name` | String | Short shot name shown in the HUD |
| `description` | String | Full instruction shown to photographer |
| `position` | `"A"` or `"B"` | Vehicle position — triggers transition prompt on change |
| `mandatory` | `true` or `false` | If true, skip button is disabled |

---

## Updating Overlay Images

Replace images in the `overlays/` folder. Filenames must match the shot ID:
- `photo_1.jpg` → Shot 1
- `photo_2.jpg` → Shot 2
- etc.

Images can be portrait or landscape — they're displayed at `object-fit: cover` to fill the viewfinder. JPG format recommended.

---

## Shot List Summary

| # | Shot | Position | Required |
|---|------|----------|----------|
| 1 | Front 3/4 Driver Side (wheels angled / roof open) | A | ✓ |
| 2 | Front Straight On | A | ✓ |
| 3 | Front 3/4 Passenger Side | A | ✓ |
| 4 | Front 3/4 Driver Side (wheels straight / roof closed) | A | ✓ |
| 5 | Rear 3/4 Passenger Side | B | ✓ |
| 6 | Rear Straight On | B | ✓ |
| 7 | Rear 3/4 Driver Side | B | ✓ |
| 8 | Driver Side Profile | B | ✓ |
| 9 | Passenger Side Profile | B | ✓ |
| 10 | Boot Open | B | ✓ |
| 11 | Sunroof Exterior (Open) | B | — |
| 12 | Sunroof Interior (Open) | B | — |
| 13 | Sunroof Interior (Closed) | B | — |
| 14 | Headlight Close-Up | B | ✓ |
| 15 | Brake Light Close-Up | B | ✓ |
| 16 | Spoiler Close-Up | B | — |
| 17 | Door Handle Close-Up | B | ✓ |
| 18 | Door Mirror Close-Up | B | ✓ |
| 19 | Parking Sensor Close-Up | B | — |
| 20 | Front Wheel / Alloy — Driver Side | B | ✓ |
| 21 | Rear Wheel / Alloy — Driver Side | B | ✓ |
| 22 | Rear Wheel / Alloy — Passenger Side | B | ✓ |
| 23 | Front Wheel / Alloy — Passenger Side | B | ✓ |
| 24 | Driver View Close-Up | B | ✓ |
| 25 | Overview — Front Seats Wide Angle | B | ✓ |
| 26 | Passenger View Close-Up | B | ✓ |
| 27 | Front Seats — From Driver Door | B | ✓ |
| 28 | Front Seats — From Passenger Door | B | ✓ |
| 29 | Rear Seats — Passenger Side Rear Door | B | ✓ |
| 30 | Rear Seats — Driver Side Rear Door | B | ✓ |
| 31 | Rear Seats — Wide Angle Overview | B | ✓ |
| 32 | ISOFIX Point | B | — |
| 33 | Electric Seat Adjustment Controls | B | — |
| 34 | Heated Seat Controls | B | — |
| 35 | Rear Seat Heating & USB Ports | B | — |
| 36 | Infotainment — Reversing Camera | B | — |
| 37 | Infotainment — Nav Map | B | — |
| 38 | Infotainment — DAB Radio | B | ✓ |
| 39 | Instrument Cluster / Digital Dash | B | ✓ |
| 40 | Gear Stick / Selector | B | ✓ |
| 41 | Door Card — Mirror & Window Controls | B | ✓ |
| 42 | Door Lock / Unlock Buttons | B | ✓ |
| 43 | Headlight Control Dial | B | ✓ |
| 44 | Front Cup Holders | B | ✓ |
| 45 | Steering Wheel Controls — Left | B | ✓ |
| 46 | Steering Wheel Controls — Right | B | ✓ |
| 47 | Lights Stalk | B | ✓ |
| 48 | Wiper Stalk | B | ✓ |
| 49 | Engine Start / Stop Button | B | ✓ |
| 50 | Park Brake & Auto-Hold Buttons | B | ✓ |
| 51 | Front USB-C, USB-A & 12V Socket | B | ✓ |
| 52 | AC / Climate Control Panel | B | ✓ |
| 53 | Speaker | B | ✓ |
| 54 | Sunglasses Holder (Open) | B | ✓ |
| 55 | Overhead Console | B | ✓ |
| 56 | Exterior Camera | B | — |
| 57 | Power Tailgate Button | B | — |
| 58 | Boot Interior | B | ✓ |

---

## Notes

- Photos are saved as JPEG via browser download prompt — tap **Save** when prompted
- The overlay is never baked into saved photos — only the clean camera image is saved
- The app requests rear camera by default; front camera fallback if unavailable
- Screen wake lock keeps the display on during the shoot (supported on iOS 16.4+)
