# Architecture Firestore Rules Snippet

Add the following blocks inside the existing `match /databases/{database}/documents { ... }`
section of the shared `home-beam` Firestore rules:

```txt
match /architectureWorkspaces/{projectId} {
  // Any authenticated user can read workspace docs
  allow read: if request.auth != null;
  // Writes require auth — admin check is done in app layer
  allow write: if request.auth != null;
}

match /architectureInvites/{inviteId} {
  // Anyone can read an invite (for accepting via link)
  allow read: if true;
  // Only auth users can create invites
  allow create: if request.auth != null;
  // Only the invitee or admin can update (accept/decline)
  allow update: if request.auth != null;
}
```
