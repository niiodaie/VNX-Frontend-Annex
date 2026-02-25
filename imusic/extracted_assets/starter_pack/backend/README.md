# DarkNotes Backend (Starter API)

This folder contains backend scaffolding ideas for building DarkNotes with either:

Option A: Firebase (recommended for rapid dev)
Option B: Node.js + Express + MongoDB (for full control)

---

## Option A: Firebase Setup

1. Install Firebase CLI:

```
npm install -g firebase-tools
```

2. Initialize your project:

```
firebase init
```

3. Enable Firestore (Database), Authentication, and Functions.

4. Deploy functions with:

```
firebase deploy
```

---

## Option B: Node.js + Express Setup

1. Create a new folder:

```
mkdir darknotes-backend && cd darknotes-backend
npm init -y
npm install express mongoose cors dotenv
```

2. Create an `index.js` file and start writing endpoints (e.g., `/api/users`, `/api/tracks`, `/api/mentors`)

3. Use MongoDB Atlas for cloud database hosting

---

## Backend Responsibilities

- Authentication (Firebase Auth or JWT)
- Store user data, progress, mentor selections
- Handle audio uploads and session links
- Manage collab requests and messages
- Integrate OpenAI or voice clone APIs

--- 

Bonus: add Stripe or LemonSqueezy for subscriptions if monetizing.

