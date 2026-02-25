# DarkNotes Frontend

This is the starter frontend project for the DarkNotes platform, built using:

- React
- Tailwind CSS
- Vite (recommended for fast local dev)

## Getting Started

1. Make sure you have Node.js installed.
2. Run the following commands:

```
npm create vite@latest darknotes-frontend -- --template react
cd darknotes-frontend
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

3. Replace `tailwind.config.js` and `index.css` with your DarkNotes design tokens.
4. Start the app:

```
npm run dev
```

## Pages to Build

- Landing Page (Hero, CTA)
- Mentor Selection
- MuseLab (Creative Studio)
- Collab Zone
- Profile & Challenges (optional)

Feel free to add ShadCN/UI, Framer Motion, or any other modern UI libraries.

Happy building!
