# 🌍 GeoQuest — World Capital Quiz

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.18-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![EJS](https://img.shields.io/badge/EJS-3.1-B4CA65?style=for-the-badge&logo=ejs&logoColor=white)](https://ejs.co/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15%2B-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> **An interactive, fast-paced geography trivia web application that challenges players to test and sharpen their knowledge of world capitals across 250+ countries.**

---

## ✨ Key Features & UX Enhancements

- 🌍 **250+ World Capitals**: Comprehensive dataset loaded directly from a PostgreSQL relational database with zero cold start.
- 🎨 **Modern Glassmorphic UI**: High-contrast, ambient dark overlay over scenic cartography with smooth gradients, card depth, and Google Fonts (`Outfit` & `Plus Jakarta Sans`).
- 🔥 **Streak & Score Tracking**: Real-time score counter and streak multiplier that elevates excitement with every consecutive correct guess.
- 🏆 **Persistent High Scores**: Automatically saves all-time personal best scores in the browser's `localStorage`.
- 💡 **Smart Hint System**: Stuck on a country? Click the hint toggle to reveal the capital's starting letter and character length without revealing the whole answer.
- ⏭️ **Skip Question Support**: Seamless skip action allowing players to advance if they do not know a capital.
- 🎉 **Visual & Audio Feedback**:
  - Fullscreen canvas confetti bursts on correct answers.
  - Clean synthesizer audio chimes via the **Web Audio API** (with a dedicated mute/unmute toggle).
- 🎯 **Polished Game Over Review**:
  - Replaces jarring browser `alert()` popups with an in-card game over review.
  - Displays the missed country, the correct capital in high contrast, and your guess.
  - Dynamically computes a playful adventurer rank (e.g. *Continental Explorer*, *Atlas Master*).
  - One-click instant **Play Again** restart button.
- 🛡️ **Resilient Fallback Mode**: If PostgreSQL is ever offline or unconfigured, the application gracefully falls back to `capitals.csv` automatically so the quiz is always playable!

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Runtime** | Node.js (ES Modules) |
| **Backend Framework** | Express.js |
| **Template Engine** | EJS (Embedded JavaScript) |
| **Database** | PostgreSQL (`pg` connection pool) |
| **Environment Config** | Dotenv (`.env`) |
| **Styling & Design** | Modern CSS3 (Glassmorphism, Flexbox, CSS Grid, Custom Properties) |
| **Interactivity** | Vanilla JavaScript (Canvas Confetti, Web Audio API, LocalStorage) |

---

## 📁 Project Structure

```text
World+Capital+Quiz/
├── public/
│   ├── images/
│   │   └── background.jpg         # High-resolution world map background
│   ├── scripts/
│   │   └── game.js                # Audio effects, confetti, high-score & input UX
│   └── styles/
│       └── main.css               # Modern responsive glassmorphism styles
├── views/
│   └── index.ejs                  # Dynamic EJS quiz & game over template
├── .env.example                   # Sample environment variable template
├── .gitignore                     # Git ignore rules for node_modules & credentials
├── capitals.csv                   # 250+ countries and capitals dataset
├── index.js                       # Express server, DB queries, and game routing
├── package.json                   # Project scripts and dependencies
└── README.md                      # Project documentation & GitHub guide
```

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v16.x or newer)
- [PostgreSQL](https://www.postgresql.org/) (Optional but recommended; app has automatic CSV fallback)
- [Git](https://git-scm.com/)

---

### 2. Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/<your-username>/world-capital-quiz.git
   cd world-capital-quiz
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

---

### 3. Database Setup (PostgreSQL)

1. Open `psql` or **pgAdmin** and create a new database named `world`:
   ```sql
   CREATE DATABASE world;
   ```

2. Connect to the `world` database and create the `capitals` table:
   ```sql
   \c world;

   CREATE TABLE capitals (
     id SERIAL PRIMARY KEY,
     country VARCHAR(100),
     capital VARCHAR(100)
   );
   ```

3. Import the dataset from `capitals.csv`:
   ```sql
   \copy capitals FROM 'capitals.csv' DELIMITER ',' CSV HEADER;
   ```
   *(Alternatively, use pgAdmin's "Import/Export Data" GUI tool)*.

---

### 4. Configure Environment Variables

1. Copy `.env.example` to create your local `.env` file:
   ```bash
   cp .env.example .env
   ```
   *(On Windows PowerShell: `Copy-Item .env.example .env`)*

2. Update `.env` with your PostgreSQL credentials:
   ```env
   PORT=3000
   DB_USER=postgres
   DB_HOST=localhost
   DB_DATABASE=world
   DB_PASSWORD=your_actual_password
   DB_PORT=5432
   ```

> **Note**: If you don't configure PostgreSQL, GeoQuest will automatically load `capitals.csv` in offline fallback mode!

---

### 5. Running the Application

- **Standard Run:**
  ```bash
  npm start
  ```

- **Development Mode (Auto-restart on change):**
  ```bash
  npm run dev
  ```

Open your browser and navigate to:
```text
http://localhost:3000
```

---

## 🎮 How to Play

1. A random country or territory name appears on the card.
2. Type the correct capital city into the input field and press <kbd>Enter</kbd> or click **Submit Answer**.
3. If correct:
   - Your score and streak increase!
   - Confetti bursts and an upbeat chime plays.
   - The next random country is served immediately.
4. If you're stuck, toggle **💡 Need a hint?** to view the starting letter and character count.
5. If you enter an incorrect answer or skip:
   - Game over screen reveals the missed capital alongside your response.
   - Your final score and streak are compared with your all-time high score.
   - Click **Play Again 🔄** to reset and start a new run!

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check the [issues page](https://github.com/<your-username>/world-capital-quiz/issues).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use and adapt it for learning or personal projects.

---

## 🙏 Acknowledgments

- Built based on Angela Yu's [The Complete 2024 Web Development Bootcamp](https://www.udemy.com/course/the-complete-web-development-bootcamp/).
- Enhanced with modern glassmorphism UI, audio synthesizers, confetti feedback, and high score persistence.
