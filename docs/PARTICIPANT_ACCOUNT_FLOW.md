# Participant Account Flow Notes

This note captures the explicit account creation, login, and onboarding behavior documented in the sibling BEAM/ReadyAimGo projects as of March 20, 2026.

## Sources Reviewed

- `/Users/ehauga/Desktop/local dev/home.beamthinktank.space/README.md`
- `/Users/ehauga/Desktop/local dev/home.beamthinktank.space/docs/FIREBASE_SETUP.md`
- `/Users/ehauga/Desktop/local dev/home.beamthinktank.space/src/lib/firebaseClient.ts`
- `/Users/ehauga/Desktop/local dev/home.beamthinktank.space/src/store/authStore.ts`
- `/Users/ehauga/Desktop/local dev/home.beamthinktank.space/src/app/onboard/handoff/page.tsx`
- `/Users/ehauga/Desktop/local dev/home.beamthinktank.space/src/app/onboard/student/page.tsx`
- `/Users/ehauga/Desktop/local dev/home.beamthinktank.space/src/app/onboard/community/page.tsx`
- `/Users/ehauga/Desktop/local dev/ready-aim-go-website-for-deploy/DEPLOYMENT_READY.md`
- `/Users/ehauga/Desktop/local dev/ready-aim-go-website-for-deploy/app/login/page.tsx`
- `/Users/ehauga/Desktop/local dev/ready-aim-go-website-for-deploy/app/signup/page.tsx`
- `/Users/ehauga/Desktop/local dev/ready-aim-go-website-for-deploy/app/onboarding/page.tsx`

## Explicit Behavior in `home.beamthinktank.space`

### Auth stack

- The explicit auth scaffold is Firebase.
- Required public Firebase env vars are documented in `docs/FIREBASE_SETUP.md`:
  - `NEXT_PUBLIC_FIREBASE_API_KEY`
  - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
  - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
  - `NEXT_PUBLIC_FIREBASE_APP_ID`
  - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- Firebase app, auth, Firestore, and storage are initialized in `src/lib/firebaseClient.ts`.
- Auth state is tracked in `src/store/authStore.ts` using `onAuthStateChanged`.

### Participant sign-in and handoff

- The README explicitly says to use `/onboard/handoff` to test a BEAM-side sign-in/handoff flow.
- `src/app/onboard/handoff/page.tsx`:
  - opens Google sign-in with `signInWithPopup` if the user is not already authenticated
  - builds a BEAM handoff payload including role, source system, organization, cohort, site URL, and redirect target
  - writes that handoff payload to Firestore at:
    - `users/<uid>/profiles/beamHandoff`
  - redirects to either:
    - `/participant-dashboard`
    - or `/onboard/<role>` when `redirectTarget` is `role_onboarding`

### Role onboarding

- `docs/FIREBASE_SETUP.md` documents the onboarding data path as:
  - `users/{uid}/profiles/onboarding`
- `src/app/onboard/student/page.tsx`:
  - collects skills, goals, and preferred organizations
  - signs in with Google if needed
  - writes onboarding data to `users/<uid>/profiles/onboarding`
  - redirects to `/participant-dashboard`
- `src/app/onboard/community/page.tsx`:
  - collects interests, engagement level, and focus areas
  - signs in with Google if needed
  - writes onboarding data to `users/<uid>/profiles/onboarding`
  - redirects to `/community-dashboard`

### Admin-specific note

- `docs/FIREBASE_SETUP.md` explicitly states that website-directory admin writes require Firebase custom claim `admin: true`.

## Explicit Behavior in `ready-aim-go-website-for-deploy`

### Login and signup behavior

- `DEPLOYMENT_READY.md` explicitly says the login and signup pages redirect to `https://clients.readyaimgo.biz`.
- `app/login/page.tsx` includes `// TODO: Implement Firebase authentication`.
- Current `app/login/page.tsx` behavior:
  - "Sign in with Google" redirects to `NEXT_PUBLIC_CLIENT_PORTAL_URL` or `https://clients.readyaimgo.biz`
  - auth check is intentionally skipped in the current code
- `app/signup/page.tsx` includes `// TODO: Implement Firebase authentication`.
- Current `app/signup/page.tsx` behavior:
  - both "Continue as Client" and "Continue as Operator" redirect to `NEXT_PUBLIC_CLIENT_PORTAL_URL` or `https://clients.readyaimgo.biz`

### Onboarding page state

- `app/onboarding/page.tsx` also includes `// TODO: Implement Firebase authentication`.
- The page expects a Supabase session and profile, not a BEAM participant Firebase profile.
- The page is a contract/demo-or-paid-plan flow, not an explicit participant account creation scaffold for BEAM Architecture.

## Practical Takeaway

### Explicitly supported today

- The clearest participant auth/onboarding scaffold currently lives in `home.beamthinktank.space`.
- It uses Google sign-in via Firebase and writes participant data to Firestore user profile paths.

### Explicitly not complete today

- The ReadyAimGo marketing-site login/signup pages are not implementing participant auth themselves.
- They currently act as redirects to the client portal and still carry TODO markers for auth.

## Recommendation

Inference from the sources above:

- Public BEAM Architecture intake should remain lightweight on this site.
- Authenticated participant onboarding should continue to hand off into the Firebase-backed BEAM Home flow until a separate participant auth path is intentionally implemented elsewhere.
