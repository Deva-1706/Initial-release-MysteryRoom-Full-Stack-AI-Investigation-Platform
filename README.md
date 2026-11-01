# 🕵️ MysteryRoom – AI-Powered Investigation Platform

> **Build Your Own AI Investigation Room**

MysteryRoom is a full-stack, AI-powered mystery investigation platform that allows users to explore fictional investigation cases, examine clues, analyse evidence, question suspects, and identify the truth through interactive investigations.

The platform integrates **Google Gemini AI** to generate mystery cases and support AI-assisted investigation workflows. It uses **Supabase PostgreSQL** for data storage and authentication, with a React-based frontend and Node.js backend.

---

## 📌 Table of Contents

1. [Project Overview](#-project-overview)
2. [Objectives](#-objectives)
3. [Key Features](#-key-features)
4. [Technology Stack](#-technology-stack)
5. [System Architecture](#-system-architecture)
6. [Project Structure](#-project-structure)
7. [How It Works](#-how-it-works)
8. [Difficulty Levels and Scoring](#-difficulty-levels-and-scoring)
9. [Installation and Setup](#-installation-and-setup)
10. [Environment Variables](#-environment-variables)
11. [Running the Application](#-running-the-application)
12. [API Health Check](#-api-health-check)
13. [Testing](#-testing)
14. [Security](#-security)
15. [Future Enhancements](#-future-enhancements)
16. [Project Status](#-project-status)
17. [Workshop Information](#-workshop-information)
18. [Author](#-author)

---

## 🎯 Project Overview

MysteryRoom transforms traditional mystery-solving activities into an interactive digital investigation experience.

Users can investigate cases, discover clues, analyse evidence, use hints, and submit their final accusations. The application calculates investigation scores based on the user's discoveries and hint usage.

AI integration helps create engaging mystery scenarios and supports the investigation experience.

## 🎯 Objectives

- Develop an interactive mystery investigation platform.
- Integrate generative AI into a full-stack application.
- Generate engaging mystery cases using Google Gemini.
- Organise suspects, clues, and investigation information.
- Provide different investigation difficulty levels.
- Implement a scoring system.
- Store application data using Supabase PostgreSQL.
- Apply Spec-Driven Development (SDD) principles.
- Develop and test a complete frontend and backend application.

## ✨ Key Features

### 1. Mystery Case Generation
- Generate mystery investigation scenarios.
- Create structured case information.
- Support different difficulty levels.

### 2. Interactive Investigation
- Explore mystery cases.
- Discover available clues.
- Examine investigation information.
- Use hints to progress through cases.

### 3. Suspect Investigation
- Present suspects associated with a mystery.
- Support investigation through available case information.
- Compare evidence before making an accusation.

### 4. AI Integration
- Google Gemini API integration.
- AI-assisted mystery generation.
- AI-supported investigation functionality.

### 5. Scoring System
- Calculate scores based on investigation performance.
- Reward discovered clues.
- Deduct points for hints used.
- Evaluate the final accusation.

### 6. Backend and Database
- REST API using Express.js.
- Supabase PostgreSQL integration.
- Authentication support through Supabase.
- Server-side validation and protected investigation data.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React.js |
| Frontend Tool | Vite |
| Backend | Node.js |
| Backend Framework | Express.js |
| Database | Supabase PostgreSQL |
| Authentication | Supabase Auth |
| AI Integration | Google Gemini API |
| Programming Language | JavaScript |
| API Architecture | REST API |
| Testing | Node.js Test Runner |
| Development Environment | Visual Studio Code |
| Version Control | Git and GitHub |

---

## 🏗️ System Architecture

```text
                 ┌──────────────────────┐
                 │       USER           │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │   REACT + VITE       │
                 │   FRONTEND           │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │   NODE.JS +          │
                 │   EXPRESS API        │
                 └──────┬─────────┬─────┘
                        │         │
              ┌─────────▼───┐ ┌───▼──────────┐
              │  SUPABASE   │ │ GOOGLE       │
              │  POSTGRESQL │ │ GEMINI AI    │
              └─────────────┘ └──────────────┘
```

The frontend communicates with the Express backend through REST API endpoints. The backend connects to Supabase PostgreSQL for data operations and Google Gemini for supported AI functionality.

---

## 📁 Project Structure

```text
MYSTERYROOM/
│
├── client/
│   ├── public/
│   ├── src/
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── src/
│   ├── tests/
│   ├── .env.example
│   └── package.json
│
├── docs/
│
├── .github/
│
├── .gitignore
├── README.md
├── SPEC.md
├── PROJECT_ROADMAP.md
├── DEPLOYMENT_GUIDE.md
└── render.yaml
```

*Note: The structure above represents the main project organisation. Individual files may vary as development progresses.*

---

## ⚙️ How It Works

1. **Start Investigation:** The user enters the application and starts a mystery case.
2. **Generate Case:** The application uses the supported AI integration to generate mystery information.
3. **Explore Suspects:** The user reviews the suspects associated with the case.
4. **Discover Clues:** The user investigates available clues and evidence.
5. **Use Hints:** The user can request hints when needed.
6. **Analyse Evidence:** The user reviews the information collected during the investigation.
7. **Submit Accusation:** The user selects the suspected person and submits the final answer.
8. **Calculate Score:** The backend evaluates the accusation and calculates the final score.

---

## 🏆 Difficulty Levels and Scoring

MysteryRoom supports three difficulty levels.

| Difficulty | Suspects | Clues | Hints | Base Points |
|---|---:|---:|---:|---:|
| Easy | 3 | 5 | 2 | 100 |
| Medium | 4 | 7 | 3 | 150 |
| Hard | 5 | 9 | 3 | 200 |

### Scoring Formula

For a correct accusation:

```text
Final Score =
Base Points
+ (Discovered Clues × 5)
- (Hints Used × 10)
```

The minimum score is zero.

For an incorrect accusation:

```text
Final Score = 0
```

---

## 🚀 Installation and Setup

### Prerequisites

Install the following before running the project:

- Node.js
- npm
- Git
- Visual Studio Code
- Supabase account
- Google Gemini API key

### Step 1: Clone the Repository

```bash
git clone https://github.com/Deva-1706/Initial-release-MysteryRoom-Full-Stack-AI-Investigation-Platform.git
```

### Step 2: Open the Project

```bash
cd Initial-release-MysteryRoom-Full-Stack-AI-Investigation-Platform
```

### Step 3: Install Frontend Dependencies

```bash
cd client
npm install
```

### Step 4: Install Backend Dependencies

Open another terminal:

```bash
cd server
npm install
```

### Step 5: Configure Environment Variables

Create `.env` files using the provided `.env.example` templates.

Refer to the environment variable section below.

---

## 🔐 Environment Variables

### Backend – `server/.env`

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173,http://localhost:5174

SUPABASE_URL=your_supabase_project_url
SUPABASE_SECRET_KEY=your_supabase_secret_key

GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
```

### Frontend – `client/.env`

```env
VITE_API_BASE_URL=http://localhost:5000/api

VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_publishable_key
```

**Important Security Notes:**
- Never commit `.env` files to GitHub.
- Never expose Supabase secret keys in frontend code.
- Never publish your Gemini API key.
- Use the appropriate Supabase client key for frontend authentication.
- Keep `.env.example` files limited to placeholder values.

---

## ▶️ Running the Application

The frontend and backend must run in separate terminals.

### Terminal 1 – Start Backend

```bash
cd server
npm run dev
```

Backend URL:

```text
http://localhost:5000
```

### Terminal 2 – Start Frontend

```bash
cd client
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

Open the frontend URL in your browser to access the application.

---

## ❤️ API Health Check

To verify that the backend server is running, open:

```text
http://localhost:5000/api/health
```

A successful response indicates that the API health endpoint is reachable.

---

## 🧪 Testing

### Backend Tests

Run the following command inside the `server` directory:

```bash
npm test
```

**Recorded test result:**

```text
11 tests passed
0 tests failed
```

### Frontend Production Build

Run inside the `client` directory:

```bash
npm run build
```

The production build completed successfully during local development.

---

## 🔒 Security

MysteryRoom uses security measures including:

- Environment-based configuration.
- Server-side validation.
- Supabase authentication support.
- Protected backend credentials.
- Server-side handling of investigation solutions.
- Protection against exposing undiscovered clue contents.

Production security should be reviewed and tested before public deployment.

---

## 🔮 Future Enhancements

Potential improvements include:

- Advanced AI evidence analysis.
- Image and document evidence analysis.
- Automatic contradiction detection.
- Interactive investigation timelines.
- Advanced suspect relationship mapping.
- Evidence upload and management.
- Detailed investigation reports.
- Improved dashboards and analytics.
- Production deployment and monitoring.

These are planned enhancements and should not be interpreted as completed features.

---

## 📊 Project Status

**Development status:** Core application development and local build verification completed; further integration and acceptance testing remain.

| Component | Status |
|---|---|
| React frontend | Local production build successful |
| Express backend | Runs locally |
| Supabase connection | Backend connection verified |
| Backend tests | 11 passed |
| Gemini AI | Integration configured; end-to-end verification pending |
| Browser acceptance testing | Pending |
| Production deployment | Pending |

---

## 🎓 Workshop Information

**Workshop:** Build Your Own AI Investigation Room  
**Organised by:** NxtWave Academy

**Learning Resources:**
- [Workshop Recording](https://learning.ccbp.in/event-details/dd19fdc5-da8e-498f-b73e-91f5406b6cbb)
- [Workshop Help Guide](https://bit.ly/ai-mystery-room-guide)
- [Project Submission Form](https://bit.ly/ai-mystery-room-sub-form)

The project was developed as part of the NxtWave hands-on AI investigation room workshop.

---

## 👨‍💻 Author

**Devanath N**

Student Developer | Full-Stack Development | AI Application Development

**GitHub:** [Deva-1706](https://github.com/Deva-1706)

**Project Repository:** [MysteryRoom – Full-Stack AI Investigation Platform](https://github.com/Deva-1706/Initial-release-MysteryRoom-Full-Stack-AI-Investigation-Platform)

---

## 📜 License

This project is distributed under the license included in the repository. Refer to the `LICENSE` file for the applicable terms.

---

⭐ If you find this project interesting, consider giving the repository a star!

**MysteryRoom – Every clue matters. Every detail tells a story.**
