# RSS Puzzle 🧩

RSS Puzzle is an interactive English learning application inspired by Lingualeo's Phrasebook. The game helps users improve their English sentence construction skills by assembling puzzles that reveal masterpiece paintings.

## 🚀 Demo
[Link to the deployed application](https://viktorelenich.github.io/RSS-PUZZLE/)

## ✨ Features

### 🔐 Auth & Navigation
- **Login Screen:** Simulates user authentication with name/surname validation.
- **Start Screen:** Welcome page with user greeting and "Logout" capability.
- **Routing:** SPA navigation without page reloads.

### 🎮 Gameplay Mechanics
- **Drag & Drop:** Fully interactive puzzle pieces (words) that can be moved between the source line and the puzzle board.
- **Click Interaction:** Alternative click-based interface for moving words.
- **Hints System:**
  - 🖼️ **Background Hint:** Toggles visual puzzle cues.
  - 🗣️ **Translation Hint:** Shows the sentence translation.
  - 🔊 **Audio Hint:** Plays the sentence pronunciation.
- **Validation:** Visual feedback (Green/Red) indicating correct or incorrect placement.

### 💾 Progress & Persistence
- **Auto-Save:** The game remembers the current level and round. Reloading the page resumes gameplay exactly where you left off.
- **Level Progression:** Automatic transition to the next round/level upon completion.

### 🏆 Statistics & Rewards
- **Round Completion:** Smooth "reveal" animation merging puzzle pieces into a complete artwork with Author/Year info.
- **Statistics Page:**
  - Tracks "I know" (solved independently) vs. "I don't know" (used auto-complete) sentences.
  - Mini-gallery of the completed artwork.
  - Audio playback for all sentences in the round.

## 🛠️ Tech Stack
- **Framework:** Vanilla TypeScript (No heavy frameworks used).
- **Build Tool:** Vite.
- **Styling:** CSS3 (Custom styles, animations, responsive layout).
- **Linting:** ESLint.