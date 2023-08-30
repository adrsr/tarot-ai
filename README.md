# Tarot AI

🃏 deterministic rule-based tarot AI

4️⃣ current version works for the classic 4 players game

3️⃣ 5️⃣ variants coming soon !

⚒️ available soon on https://tarot-mania.io/

## Requirements

- Node.js `v18`

## Setup

- `npm install`

## Dev

- `npm run watch`

## Lint

- `npm run lint`
- `npm run lint -- --fix`

## Prod

- `npm run build`
- `npm run start`

## Get started

- `src/ai.ts` contains the AI logic
- `src/game.ts` contains the game settings and the communication logic between AI and server
  - listen to events listed in `src/models/events/listen.events.ts`
  - emit events listed in `src/models/events/emit.events.ts`

