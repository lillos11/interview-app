# FAA Part 107 Study App

A focused study app for FAA Remote Pilot (Part 107) prep, built with Next.js.

## One-command local start
1. In this folder, run:
```bash
./start.sh
```
2. Open [http://localhost:3000](http://localhost:3000)

If Node.js is missing, the script will try to install it automatically with Homebrew.

Alternative:
```bash
npm run app:start
```

## One-command live deploy (Vercel)
1. Run:
```bash
./deploy.sh
```
2. Follow the Vercel CLI prompts once. At the end, Vercel prints your live URL.

Alternative:
```bash
npm run app:deploy
```

## Main features
- Topic-based Part 107 flashcards
- Practice quiz sessions with answer explanations
- Topic accuracy dashboard and weak-area targeting
- Local progress tracking (streak, mastered cards, quiz history)
- Browser-local storage persistence

## Tests
```bash
npm test
```
