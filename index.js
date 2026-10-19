import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// PostgreSQL Database Client configuration
const db = new pg.Client({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_DATABASE || "world",
  password: process.env.DB_PASSWORD || "postgres",
  port: parseInt(process.env.DB_PORT, 10) || 5432,
});

let quiz = [];
let totalCorrect = 0;
let streak = 0;
let currentQuestion = {};

// Fallback CSV parser to ensure app works seamlessly even without PostgreSQL setup
function loadCapitalsFromCsv() {
  try {
    const csvPath = path.join(__dirname, "capitals.csv");
    if (!fs.existsSync(csvPath)) return [];
    const content = fs.readFileSync(csvPath, "utf-8");
    const lines = content.split(/\r?\n/).filter((line) => line.trim().length > 0);
    const records = [];
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(",");
      if (parts.length >= 3) {
        const id = parts[0].trim();
        const country = parts[1].trim();
        const capital = parts.slice(2).join(",").trim();
        if (country && capital) {
          records.push({ id, country, capital });
        }
      }
    }
    return records;
  } catch (err) {
    console.error("Error reading fallback CSV:", err.message);
    return [];
  }
}

// Connect to database with resilient fallback
db.connect((err) => {
  if (err) {
    console.warn("⚠️  PostgreSQL connection failed. Using local capitals.csv as fallback dataset.");
    quiz = loadCapitalsFromCsv();
    console.log(`✓ Loaded ${quiz.length} countries from capitals.csv.`);
  } else {
    console.log("✓ Connected to PostgreSQL database.");
    db.query("SELECT * FROM capitals", (queryErr, res) => {
      if (queryErr || !res.rows.length) {
        console.warn("⚠️  Query failed or table empty. Loading from capitals.csv fallback.");
        quiz = loadCapitalsFromCsv();
      } else {
        quiz = res.rows;
        console.log(`✓ Loaded ${quiz.length} countries from PostgreSQL database.`);
      }
      db.end();
    });
  }
});

// Helper function to pick next question
async function nextQuestion() {
  if (!quiz || quiz.length === 0) {
    quiz = loadCapitalsFromCsv();
  }
  const randomCountry = quiz[Math.floor(Math.random() * quiz.length)];
  currentQuestion = randomCountry || { country: "France", capital: "Paris" };
  return currentQuestion;
}

// Helper to generate hints
function generateHint(capital) {
  if (!capital || capital.length < 2) return "";
  const firstLetter = capital[0].toUpperCase();
  const letterCount = capital.replace(/\s+/g, "").length;
  return `Starts with "${firstLetter}" • ${letterCount} letters`;
}

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// GET: Home / Start Quiz
app.get("/", async (req, res) => {
  totalCorrect = 0;
  streak = 0;
  await nextQuestion();
  
  res.render("index.ejs", {
    question: currentQuestion,
    wasCorrect: null,
    totalScore: 0,
    streak: 0,
    previousCountry: null,
    previousCapital: null,
    userAnswer: null,
    gameOver: false,
    hint: generateHint(currentQuestion.capital),
  });
});

// POST: Submit Answer
app.post("/submit", async (req, res) => {
  const isSkip = req.body.action === "skip";
  const answer = (req.body.answer || "").trim();
  const previousCountry = currentQuestion.country;
  const previousCapital = currentQuestion.capital;

  let isCorrect = false;

  if (
    !isSkip &&
    answer &&
    currentQuestion.capital &&
    answer.toLowerCase() === currentQuestion.capital.toLowerCase()
  ) {
    isCorrect = true;
    totalCorrect++;
    streak++;

    await nextQuestion();
    res.render("index.ejs", {
      question: currentQuestion,
      wasCorrect: true,
      totalScore: totalCorrect,
      streak: streak,
      previousCountry: previousCountry,
      previousCapital: previousCapital,
      userAnswer: answer,
      gameOver: false,
      hint: generateHint(currentQuestion.capital),
    });
  } else {
    // Game Over on incorrect answer or skip
    const finalScore = totalCorrect;
    const finalStreak = streak;

    // Reset session score for next attempt
    totalCorrect = 0;
    streak = 0;

    res.render("index.ejs", {
      question: currentQuestion,
      wasCorrect: false,
      totalScore: finalScore,
      streak: finalStreak,
      previousCountry: previousCountry,
      previousCapital: previousCapital,
      userAnswer: isSkip ? "Skipped" : answer,
      gameOver: true,
      hint: "",
    });
  }
});

// GET: Restart Quiz
app.get("/restart", (req, res) => {
  res.redirect("/");
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Capital Quiz server running at http://localhost:${port}`);
});
