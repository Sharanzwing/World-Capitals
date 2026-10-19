# 🌍 World Capitals Quiz

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.18-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![EJS](https://img.shields.io/badge/EJS-3.1-B4CA65?style=for-the-badge&logo=ejs&logoColor=white)](https://ejs.co/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15%2B-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> **A full-stack World Capitals quiz web app built with Node.js, Express, EJS, and PostgreSQL, styled with an enhanced modern glassmorphism UI.**

---

## ✨ Features

- 🌍 **250+ World Capitals**: Loaded directly from a PostgreSQL relational database table.
- 🎨 **Modern Glassmorphic UI**: High-contrast, ambient dark backdrop over world cartography with clean Google Fonts (`Outfit` & `Plus Jakarta Sans`).
- ⭐ **Score Tracker**: Displays real-time total score.
- 🎯 **Interactive Feedback**: Instant checkmark (`✔`) and cross (`✖`) animations on submit.
- 🔄 **Restart Mechanism**: Clean restart button to immediately begin a fresh run.
- ☁️ **Cloud Database Ready**: Works on local `localhost` pgAdmin and deploys seamlessly to **Render** or **Vercel** via `DATABASE_URL`.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Runtime** | Node.js (ES Modules) |
| **Backend Framework** | Express.js |
| **Template Engine** | EJS (Embedded JavaScript) |
| **Database** | PostgreSQL (`pg` Client) |
| **Styling** | Modern CSS3 (Glassmorphism, Flexbox, Animations) |

---

## 📁 Project Structure

```text
World+Capital+Quiz/
├── public/
│   ├── images/
│   │   └── background.jpg         # World map background
│   └── styles/
│       └── main.css               # Modern glassmorphism stylesheet
├── views/
│   └── index.ejs                  # EJS quiz template
├── .env.example                   # Environment variable template
├── .gitignore                     # Git ignore rules
├── capitals.csv                   # 250+ countries and capitals dataset
├── index.js                       # Express server and PostgreSQL logic
├── package.json                   # Project configuration
└── README.md                      # Documentation
```

---

## 🚀 Local Setup (pgAdmin / Localhost)

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v16.x or newer)
- [PostgreSQL & pgAdmin](https://www.postgresql.org/)
- [Git](https://git-scm.com/)

### 2. Installation
```bash
git clone https://github.com/Sharanzwing/World-Capitals.git
cd World-Capitals
npm install
```

### 3. Database Setup (pgAdmin / Localhost)
1. In pgAdmin, create a database named `world`:
   ```sql
   CREATE DATABASE world;
   ```
2. Open the Query Tool for `world` and create the `capitals` table:
   ```sql
   CREATE TABLE capitals (
     id SERIAL PRIMARY KEY,
     country VARCHAR(100),
     capital VARCHAR(100)
   );
   ```
3. Import `capitals.csv`:
   - In pgAdmin: Right-click `capitals` table $\rightarrow$ **Import/Export Data** $\rightarrow$ select `capitals.csv`, Header: Yes, Delimiter: `,`.
   - Or using psql command:
     ```sql
     \copy capitals FROM 'capitals.csv' DELIMITER ',' CSV HEADER;
     ```

### 4. Run the App
```bash
npm start
```
Navigate to `http://localhost:3000`.

---

## ☁️ How to Connect a Free PostgreSQL Database on Render or Vercel

When your app is deployed to **Render** or **Vercel**, it cannot connect to your personal PC's `localhost`. You need a free cloud-hosted PostgreSQL database.

### Option A: Free PostgreSQL on Render
1. Go to your [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** $\rightarrow$ **PostgreSQL**.
3. Name your database (e.g., `world-db`) and click **Create Database**.
4. Once created, copy the **Internal Database URL** (for Render-to-Render) or **External Database URL**.
5. In your Render Web Service dashboard:
   - Go to **Environment** tab.
   - Add an environment variable:
     - **Key**: `DATABASE_URL`
     - **Value**: *(Paste the Render Database URL)*
   - Save changes.

---

### Option B: Free Permanent PostgreSQL on Neon.tech (Recommended for Vercel & Render)
*Note: Render's free PostgreSQL instances expire after 30 days. [Neon.tech](https://neon.tech/) provides a permanent 100% free serverless PostgreSQL database.*

1. Sign up at [neon.tech](https://neon.tech/) (free, takes 30 seconds).
2. Create a project named `world`.
3. In the Neon dashboard, go to the **SQL Editor** and run:
   ```sql
   CREATE TABLE capitals (
     id SERIAL PRIMARY KEY,
     country VARCHAR(100),
     capital VARCHAR(100)
   );
   ```
4. Copy the **Connection String** (`postgres://...`).
5. In your **Render** or **Vercel** Project Settings:
   - Add Environment Variable: `DATABASE_URL` = your Neon connection string.

---

### 📥 How to Import `capitals.csv` into Your Cloud Database

You can import the 250+ capitals directly into your Render or Neon cloud database:

#### Method 1: Using pgAdmin on your PC
1. In pgAdmin, right-click **Servers** $\rightarrow$ **Register** $\rightarrow$ **Server**.
2. Paste the cloud database Host, Database, User, Password, and set SSL to **Require**.
3. Once connected, right-click `capitals` table $\rightarrow$ **Import/Export Data** $\rightarrow$ select `capitals.csv` and import!

#### Method 2: Paste the Seed SQL
If you prefer running a single SQL script without uploading files, you can generate multi-row `INSERT` statements or run the copy command in `psql`.

---

## 📄 License
This project is licensed under the **MIT License**.
