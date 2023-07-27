# Tarot Bot

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

The `src/game.ts` file contain the logic to communicate between your AI and the server during a game. It also contains the settings of the game your AI is about to play.

The `src/artificial-intelligence.ts` file contain your Artificial Intelligence's logic to react to the game events.

You can fin the list of events:

- you can listen to in `src/models/events/listen.events.ts`
- you can emit in `src/models/events/emit.events.ts`
