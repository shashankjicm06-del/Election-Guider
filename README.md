#### Indian Election Assistant - Election Guider

🇮🇳 **A Comprehensive Voter Information & Election Guidance Platform**

## 📖 Project Overview

Election Guider is an intelligent web application designed to simplify the Indian election process for voters. It provides comprehensive information about candidates, parties, voting procedures, polling stations, and post-election processes. Built with a professional, modern UI and powered by AI, it ensures citizens are well-informed and confident in their electoral participation.

**Key Focus:** Indian Election System (ECI, EVMs, Lok Sabha, post-election processes)

---

## ✨ Features

### 🎯 Core Features
- **Candidate Information**: Access detailed profiles of candidates including party affiliation, background, and past performance
- **Election Calendar**: Track important dates - nomination periods, voting days, results declaration
- **Polling Station Locator**: Find your designated polling station based on registered address
- **Voting Procedures Guide**: Step-by-step guidance on how to vote, Voter ID requirements, and absentee voting
- **FAQs & Resources**: Comprehensive FAQ section for common election-related queries

### 🎨 Professional UI/UX Enhancements
- **Color Palette**: Deep Navy Blue (trust/authority), Saffron/Orange accents (vibrancy), crisp whites/light grays
- **Glassmorphism Effects**: Modern modals with soft shadows and transparency
- **Smooth Micro-animations**: Engaging hover states and smooth transitions
- **Responsive Design**: Fully responsive interface for all devices
- **Modern Typography**: Highly readable font combinations for better user experience

### 📚 Interactive Flashcards
- **3D Flippable Cards**: Animated card flip effects using CSS transforms
- **Election Terminology**: Learn key terms like "EVM", "VVPAT", "Model Code of Conduct", "Hung Assembly", "Coalition Government"
- **Quick Learning**: Perfect for voters preparing for elections

### 📅 Election Timeline
- **Pre-Election Phase**: Campaign periods, nomination submission
- **Voting Phase**: Election day schedule
- **Post-Election Phase**: Counting, government formation, oath-taking
- **Results Phase**: Final results and seat allocation

### 🔐 Security & Backend
- **Secure API**: Backend /api/chat endpoint protects API keys
- **Mock Authentication**: Firebase integration support with testing bypass
- **User Data Protection**: Encrypted data transmission and storage

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Git

### Installation

1. Clone the Repository
   git clone https://github.com/shashankjicm06-del/Election-Guider.git
   cd Election-Guider

2. Install Dependencies
   npm install

3. Create Environment Variables
   cp .env.example .env

4. Start the Development Server
   npm start

---

## 📁 Project Structure

Election-Guider/
├── src/
│   ├── components/
│   │   ├── Header.js              # Navigation header
│   │   ├── ChatInterface.js        # AI chat component
│   │   ├── Flashcards.js           # Interactive flashcards feature
│   │   ├── ElectionTimeline.js     # Timeline visualization
│   │   └── QuickActions.js         # Quick action buttons
│   ├── pages/
│   ├── services/
│   ├── utils/
│   └── App.js
├── public/
├── server/
│   └── server.js                   # Node.js backend server
├── docker/
│   ├── Dockerfile
│   └── .dockerignore
├── .env.example
├── package.json
├── README.md
└── LICENSE

---

## ⚙️ Configuration

Update server/server.js with the system prompt for Indian election expertise.
Create a .env file with your API keys and configuration.

---

## 🐳 Docker & Cloud Run Deployment

Build Docker image:
gcloud builds submit --tag gcr.io/[PROJECT_ID]/election-guider

Deploy to Cloud Run:
gcloud run deploy election-guider --image gcr.io/[PROJECT_ID]/election-guider --platform managed --region us-central1

---

## 🧪 Testing Checklist

- Run server locally and verify professional theme
- Test flashcard animations
- Test election timeline
- Test chat integration with backend
- Verify API key protection
- Test responsive design
- Verify Docker build
- Test Cloud Run deployment

---

## 🔒 Security Features

- API Key Protection
- Data Encryption
- User Authentication
- Environment Variables
- CORS Configuration

---

## 📝 API Endpoints

POST /api/chat
Content-Type: application/json
{ "message": "What is VVPAT?" }

---

## 🤝 Contributing

Fork the repository, create a feature branch, make changes, commit, push, and open a pull request.

---

## 📄 License

MIT License

---

## 👨‍💻 Author

Shashank Jicm06
GitHub: @shashankjicm06-del

---

Last Updated: 2026-05-02 09:09:28
Empowering Indian voters with knowledge and technology 🇮🇳✨

###Architecture
┌─────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                            │
│  ┌──────────────┬──────────────┬──────────────┬──────────────┐  │
│  │   Header &   │  Chat        │  Flashcards  │  Election    │  │
│  │   Nav        │  Interface   │  Feature     │  Timeline    │  │
│  └──────────────┴──────────────┴──────────────┴──────────────┘  │
└─────────────────────────────────────────────────────────────────┘
              ↓                                      ↓
┌─────────────────────────────────────────────────────────────────┐
│                    API GATEWAY LAYER                             │
│                   /api/chat endpoint                             │
│              (Backend Request Handler)                           │
└─────────────────────────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────────────────────────┐
│                   BACKEND SERVER (Node.js)                       │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Express Routes │ Middleware │ Authentication │ Validation │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────────────────────────┐
│              AI/LLM PROCESSING LAYER                             │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Hugging Face API │ System Prompt │ Response Processing   │ │
│  │  (Indian Election Expert)                                  │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────────────────────────┐
│                  DATA LAYER                                      │
│  ┌──────────────┬──────────────┬──────────────┬──────────────┐  │
│  │  Firebase    │  Local       │  Election    │  Candidate   │  │
│  │  Database    │  Storage     │  Data Cache  │  Database    │  │
│  └──────────────┴──────────────┴──────────────┴──────────────┘  │
└─────────────────────────────────────────────────────────────────┘
