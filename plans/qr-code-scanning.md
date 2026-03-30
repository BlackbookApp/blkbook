# Plan: QR Code Scanning

> Source PRD: prds/qr-code-scanning.md

## Architectural decisions

- **Route**: `/scan-qr` — full-screen authenticated page
- **Navigation on success**: `router.replace` so the scanner is removed from history; back from the profile returns to the previous screen
- **URL matching**: regex `/\/p\/([^/?#]+)/` against raw scanned string; matched username is passed to the existing public profile route (with `?from=app`)
- **QR library**: `jsqr` — dynamically imported client-side only
- **Camera**: `getUserMedia({ video: { facingMode: 'environment' } })`; video element requires `playsinline autoplay muted` for iOS PWA compatibility
- **Detection**: `requestAnimationFrame` loop drawing frames to a hidden canvas and passing `ImageData` to `jsqr`; loop cancelled immediately on first detection

---

## Phase 1: Scan & navigate (happy path)

**User stories**: 1, 2, 3, 4, 5, 6, 17

### What to build

A complete end-to-end path: the user taps "Scan QR" in the Add Connection drawer, the app opens a full-screen camera page, the rear camera starts, the detection loop runs continuously, and the moment a Blackbook profile QR is recognised the user is taken to that person's public profile (scanner removed from history). Close button exits back to the previous screen.

### Acceptance criteria

- [ ] "Scan QR" option appears in the Add Connection drawer and navigates to `/scan-qr`
- [ ] Rear camera stream fills the full screen on iOS, Android, and desktop
- [ ] QR codes are detected automatically without any user tap
- [ ] Scanning a valid Blackbook QR (`/p/{username}`) navigates to the public profile
- [ ] After navigation, pressing back does NOT return to the scanner
- [ ] A close/back button exits the scanner and returns to the previous screen
- [ ] Camera releases (indicator light off) when leaving the page

---

## Phase 2: Resilience & edge cases

**User stories**: 7, 8, 12, 13, 14

### What to build

Protect the user when things go wrong. Show a loading state while the camera initialises. If camera permission is denied, replace the video feed with an inline error message and instructions for how to re-enable access. If a non-Blackbook QR is scanned, show an error toast and keep the scanner running so the user can try again immediately. Ensure media tracks are always stopped on unmount regardless of how the page is exited.

### Acceptance criteria

- [ ] A loading indicator is shown while the camera stream is starting
- [ ] Denying camera permission shows an inline error state with recovery instructions (not a blank screen)
- [ ] Scanning a non-Blackbook QR shows an error toast ("Not a Blackbook QR code") and the scanner remains open
- [ ] Scanning a malformed or empty QR string shows the same error toast
- [ ] Navigating away (back, successful scan, or close) fully stops all camera tracks

---

## Phase 3: Design polish & cross-platform verification

**User stories**: 9, 10, 11, 15, 16

### What to build

Bring the scanner UI in line with Blackbook's design language: viewfinder frame overlay, brand typography and colours, consistent motion. Verify and fix any platform-specific issues on iOS PWA (installed to home screen), Android browser, and desktop webcam.

### Acceptance criteria

- [ ] Scanner UI uses brand colours, `font-granjon`/`font-helvetica`, and no inline hex values
- [ ] A viewfinder frame gives the user a clear target area for the QR code
- [ ] Feature works end-to-end on iOS Safari (PWA installed to home screen)
- [ ] Feature works end-to-end on Android Chrome
- [ ] Feature works end-to-end on desktop (Chrome/Safari) using webcam
