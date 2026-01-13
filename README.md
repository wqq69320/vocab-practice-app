# Vocab Practice App

🌐 Live Demo: https://vocab-practice-1386e.web.app/

A production-oriented vocabulary practice web application built on Firebase. The app is delivered as a fast, single-page experience with static hosting, anonymous authentication, and a Cloud Function–backed write path to ensure secure and consistent leaderboard updates in Firestore.

This project was originally created for an English class at Hana Academy Seoul, where students take vocabulary tests based on *능률보카 어원편*. The goal was simple: reduce students’ study overhead by providing a focused, repeatable practice tool that mirrors the actual test format—without adding yet another platform to learn.

In short: the app exists to help students spend less time memorising word lists and more time doing literally anything else productive. If it slightly reduces pre-test stress, it has already succeeded.

## Highlights
- Multiple practice modes: per-day sets, all-days marathon, and an automatically generated incorrect-words list
- Anonymous authentication combined with App Check to protect sensitive write operations
- Leaderboard writes handled exclusively through a callable Cloud Function for validation and normalization
- Zero-build static deployment via Firebase Hosting with a lightweight client-side architecture
- Designed for real classroom use, not demos—built to lower cognitive load rather than add features for their own sake

## Tech Stack
- Frontend: HTML, Tailwind CSS (CDN), vanilla JavaScript
- Backend: Firebase Cloud Functions (Node.js 22), Firestore, Firebase Authentication, App Check
- Infrastructure: Firebase Hosting and Firebase Emulator Suite

## Project Structure
```
public/                Static frontend (index.html, vocabulary.js, assets)
functions/             Firebase Cloud Functions
firebase.json          Firebase Hosting + Functions config
.firebaserc            Firebase project mapping
```

## Getting Started
### Prerequisites
- Node.js 22
- Firebase CLI (`npm i -g firebase-tools`)
- A Firebase project with Hosting, Auth (Anonymous), Firestore, and App Check enabled

### Install
```bash
cd functions
npm install
```

### Run locally
```bash
firebase emulators:start --only hosting,functions,firestore,auth
```

Open the hosted URL printed by the emulator. The frontend loads `public/vocabulary.js` directly.

### Deploy
```bash
firebase deploy
```

## Data Model (Firestore)
- Rankings:
  - `artifacts/{appId}/public/data/allDaysRankings`
- Incorrect words per user:
  - `artifacts/{appId}/users/{uid}/incorrectVocabulary/userWords`

## Cloud Function
Callable function used for ranking writes:
- `finishSession` (region: `us-central1`, App Check enforced)
- Validates auth, normalizes name, and writes a ranking document

## Notes
- Vocabulary datasets are defined in `public/vocabulary.js` and loaded dynamically at runtime.
- App Check is enforced using reCAPTCHA v3 in `public/index.html`; the site key should be updated when deploying to a different Firebase project.
- Although originally built for classroom deployment, the app is structured as a general-purpose vocabulary practice tool and can be adapted to other datasets or curricula with minimal changes.
- No students were harmed in the making of this app; several late-night Firebase emulator sessions, however, did not survive.
