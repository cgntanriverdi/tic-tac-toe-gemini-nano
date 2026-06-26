# Tic-Tac-Toe vs Gemini Nano

A tic-tac-toe game where you play against an AI opponent powered by **Gemini Nano**, the
on-device model exposed through Chrome's built-in **Prompt API** (`LanguageModel`). No server,
no API key — the model runs locally in your browser.

The project started from the official [React tic-tac-toe tutorial](https://react.dev/learn/tutorial-tic-tac-toe)
and adds an AI opponent on top of it.

## How the AI works (hybrid)

Gemini Nano is a small model and is not reliable at the look-ahead reasoning tic-tac-toe needs,
so the move is decided in a **hybrid** way:

1. **Win** — code checks if the AI has an immediate winning move and plays it.
2. **Block** — otherwise, code checks if the opponent is about to win and blocks it.
3. **Ask Nano** — if there is no critical move, the board is sent to Gemini Nano and it chooses
   from the empty cells.
4. **Validate** — the model's answer is checked (must be an empty cell); if it is invalid, the
   game falls back to a safe empty cell.

In short: code guarantees the critical moves, and the model handles the rest. The AI plays
automatically once it is its turn.

## Requirements

- **Node.js** (v18 or newer)
- **Google Chrome with the Prompt API / Gemini Nano available.** The Prompt API is experimental
  and may need to be enabled. To check, open Chrome DevTools and run:

  ```js
  await LanguageModel.availability()
  ```

  If it returns `"available"`, you are good to go. If `LanguageModel` is undefined or unavailable,
  the AI will not be able to move (the rest of the game still works).

## Getting started

```bash
# 1. Clone the repo
git clone https://github.com/cgntanriverdi/tic-tac-toe-gemini-nano.git
cd tic-tac-toe-gemini-nano

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Then open the printed URL (e.g. `http://localhost:5173/`) **in Chrome**.

## How to play

1. Pick a side — **X** or **O**. (X always moves first.)
2. Click a cell to make your move.
3. The AI takes the other side and responds automatically — you will see **"AI is thinking..."**
   while it decides. The board is locked during the AI's turn.
4. The status line shows **Winner: X/O** when someone wins, or **Draw!** if the board fills up.
5. Use the move list on the right to jump back to any earlier point in the game (time travel).

## Tech stack

- [React](https://react.dev/)
- [Vite](https://vite.dev/)
- Chrome Prompt API (Gemini Nano)

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build |
