# Smart Parking System - Frontend

<div align="center">

![Smart Parking](https://img.shields.io/badge/Smart-Parking-blue)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)
![Firebase](https://img.shields.io/badge/Firebase-11.2.0-FFCA28?logo=firebase)
![License](https://img.shields.io/badge/license-MIT-green)

An intelligent parking management system with automated vehicle entry/exit, OCR-based number plate detection, and real-time bill generation.

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [API](#-api-endpoints) • [Screenshots](#-screenshots)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Documentation](#-documentation)
- [Environment Variables](#-environment-variables)
- [Development](#-development)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

Smart Parking is a comprehensive parking management solution that streamlines the entire parking workflow from vehicle entry to exit with automated slot assignment, duration tracking, and bill generation.

### Key Highlights

- 🔐 **Secure Authentication** - Firebase-powered user authentication
- 🚗 **Smart Entry** - OCR-based number plate detection for quick entry
- 📊 **Real-time Tracking** - Live parking duration and slot availability
- 💰 **Auto Billing** - Automatic bill calculation on vehicle exit
- 🎯 **Intuitive UI** - Clean, responsive interface for seamless operation
- 🔗 **REST API** - Full integration with Spring Boot backend

---

## ✨ Features

### Authentication & Security
- ✅ Email/Password authentication
- ✅ Google Sign-In integration
- ✅ JWT token-based API security
- ✅ Protected routes and pages
- ✅ Persistent login sessions

### Vehicle Management
- ✅ OCR-based number plate detection
- ✅ Multiple vehicle type support (CAR, BIKE, TRUCK)
- ✅ Automatic parking slot assignment
- ✅ Real-time vehicle status tracking
- ✅ Parking duration calculation

### Billing & Reports
- ✅ Automatic bill generation
- ✅ Vehicle type-based pricing
- ✅ Detailed parking receipts
- ✅ Duration-based charging

### User Interface
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Beautiful modal dialogs
- ✅ Loading states and error handling
- ✅ Success/error notifications
- ✅ Clean, modern UI

### Integration
- ✅ RESTful API communication
- ✅ Global state management
- ✅ Centralized API service layer
- ✅ Error handling and retry logic

---

## 🛠️ Tech Stack

### Frontend
- **React 19.2.0** - UI library
- **React Router 6.23.1** - Client-side routing
- **Firebase 11.2.0** - Authentication & user management
- **Parcel 2.16.1** - Zero-config bundler

### Backend (Integrated)
- **Spring Boot** - REST API framework
- **Firebase Admin SDK** - Token verification
- **PostgreSQL/MySQL** - Database

### Tools & Libraries
- **Fetch API** - HTTP client
- **React Context** - State management
- **CSS3** - Styling

---

## 🚀 Quick Start

### Prerequisites

- Node.js v16+ ([Download](https://nodejs.org/))
- npm or yarn
- Firebase account ([Sign up](https://firebase.google.com/))
- Backend server running

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/smart-parking-frontend.git
cd smart-parking-frontend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your Firebase credentials
nano .env

# Start development server
npm start
```

The app will open at `http://localhost:1234`

### First Time Setup

1. **Configure Firebase** (see [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md))
2. **Start backend server** at `http://localhost:8080`
3. **Create parking lot and slots** via backend API
4. **Open frontend** and sign up for an account
5. **Start parking vehicles!**

---

## 📁 Project Structure

```
SmartParking/
├── src/
│   ├── App.jsx                      # Main application component
│   ├── index.jsx                    # Entry point
│   │
│   ├── config/                      # Configuration files
│   │   ├── api.config.js            # API endpoints
│   │   └── firebase.config.js       # Firebase initialization
│   │
│   ├── services/                    # API service layer
│   │   ├── apiClient.js             # HTTP client with auth
│   │   ├── authService.js           # Authentication methods
│   │   ├── parkingService.js        # Parking operations
│   │   ├── parkingLotService.js     # Lot management
│   │   ├── employeeService.js       # Employee operations
│   │   └── index.js                 # Service exports
│   │
│   ├── context/                     # Global state management
│   │   ├── AuthContext.jsx          # Auth state
│   │   └── ParkingContext.jsx       # Parking state
│   │
│   ├── components/                  # Reusable components
│   │   ├── LoginModal.jsx           # Login modal
│   │   ├── SignupModal.jsx          # Signup modal
│   │   └── OcrBox.jsx               # OCR component
│   │
│   ├── pages/                       # Page components
│   │   ├── Home.jsx                 # Landing page
│   │   ├── Dashboard.jsx            # Main dashboard
│   │   ├── EntryPage.jsx            # Vehicle entry
│   │   └── ExitPage.jsx             # Vehicle exit
│   │
│   ├── layout/                      # Layout components
│   │   ├── Layout.jsx               # Main layout wrapper
│   │   ├── Header.jsx               # Navigation header
│   │   ├── Footer.jsx               # Footer
│   │   └── Body.jsx                 # Body wrapper
│   │
│   └── styles/                      # CSS styles
│       ├── main.css                 # Global styles
│       └── modal.css                # Modal styles
│
├── public/                          # Static assets
├── .env                             # Environment variables (create this)
├── .env.example                     # Environment template
├── package.json                     # Dependencies
├── index.html                       # HTML entry point
│
└── Documentation/
    ├── SETUP_INSTRUCTIONS.md        # Setup guide
    ├── INTEGRATION_GUIDE.md         # Integration docs
    ├── API_INTEGRATION_SUMMARY.md   # Integration summary
    └── QUICK_REFERENCE.md           # Quick reference
```

---

## 🌐 API Endpoints

### Authentication (3 endpoints)
```
GET    /api/auth/me                 # Get current user
GET    /api/auth/user/{uid}         # Get user by UID
POST   /api/auth/verify-token       # Verify auth token
```

### Parking (3 endpoints)
```
POST   /api/parking/entry           # Park a vehicle
POST   /api/parking/exit/{reg}      # Exit & generate bill
GET    /api/parking/vehicle/{reg}   # Get vehicle status
```

### Parking Lots (6 endpoints)
```
POST   /api/parking-lots            # Create parking lot
GET    /api/parking-lots            # Get all lots
GET    /api/parking-lots/{id}       # Get lot by ID
POST   /api/parking-lots/floors     # Add floor to lot
GET    /api/parking-lots/floors/{id}    # Get floor details
GET    /api/parking-lots/{id}/floors    # Get all floors
```

### Employees (6 endpoints)
```
POST   /api/employees               # Create employee
GET    /api/employees               # Get all employees
GET    /api/employees/{id}          # Get by ID
GET    /api/employees/email/{email} # Get by email
PUT    /api/employees/{id}          # Update employee
DELETE /api/employees/{id}          # Delete employee
```

See [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) for detailed API usage.

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md) | Complete setup guide with Firebase configuration |
| [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) | Detailed API integration documentation |
| [API_INTEGRATION_SUMMARY.md](API_INTEGRATION_SUMMARY.md) | Summary of what was integrated |
| [QUICK_REFERENCE.md](QUICK_REFERENCE.md) | Quick copy-paste code snippets |

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
REACT_APP_API_BASE_URL=http://localhost:8080/api

# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id

# OCR Service
REACT_APP_OCR_API_URL=https://amankumar00-smartParking.hf.space/ocr

# Environment
REACT_APP_ENV=development
```

Get Firebase credentials from [Firebase Console](https://console.firebase.google.com/)

---

## 💻 Development

### Available Scripts

```bash
# Start development server (with hot reload)
npm start

# Build for production
npm run build

# Run tests (if configured)
npm test
```

### Development Workflow

1. Make changes to source files in `src/`
2. Parcel auto-reloads on save
3. Check browser console for errors
4. Test authentication flow
5. Test parking operations
6. Verify API calls in Network tab

### Code Style

- Use functional components with hooks
- Follow React best practices
- Keep components small and focused
- Use meaningful variable names
- Add comments for complex logic
- Handle errors gracefully

---

## 🧪 Testing

### Manual Testing Checklist

**Authentication:**
- [ ] Sign up new user
- [ ] Log in with email/password
- [ ] Log out
- [ ] Protected routes redirect
- [ ] Token persists on reload

**Vehicle Entry:**
- [ ] Upload image for OCR
- [ ] Number plate detected correctly
- [ ] Select vehicle type
- [ ] Enter registration manually
- [ ] Park vehicle successfully
- [ ] Slot assigned correctly

**Vehicle Exit:**
- [ ] Search for vehicle
- [ ] Vehicle info displays
- [ ] Duration calculated correctly
- [ ] Process exit
- [ ] Bill generated
- [ ] Amount calculated correctly

**Error Handling:**
- [ ] Shows error on failed login
- [ ] Shows error on no slots available
- [ ] Shows error on vehicle not found
- [ ] Network errors handled
- [ ] Form validation works

---

## 🚀 Deployment

### Build for Production

```bash
# Create optimized build
npm run build

# Output directory: dist/
# Upload contents to hosting service
```

### Deployment Options

1. **Firebase Hosting**
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init hosting
   npm run build
   firebase deploy
   ```

2. **Netlify**
   - Connect GitHub repo
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Vercel**
   ```bash
   npm install -g vercel
   vercel
   ```

4. **Traditional Hosting**
   - Build project
   - Upload `dist/` folder to web server

### Environment Variables for Production

Update `.env` with production values:
```env
REACT_APP_API_BASE_URL=https://your-backend-api.com/api
REACT_APP_ENV=production
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines

- Follow existing code style
- Add comments for complex logic
- Update documentation for new features
- Test thoroughly before submitting
- Keep PRs focused and atomic

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

---

## 🙏 Acknowledgments

- Firebase for authentication infrastructure
- HuggingFace for OCR API
- React team for amazing framework
- Spring Boot for robust backend

---

## 📞 Support

For issues and questions:

- 📧 Email: support@smartparking.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/smart-parking/issues)
- 📖 Docs: See [documentation](#-documentation) section

---

## 🗺️ Roadmap

### Version 1.0 (Current) ✅
- [x] User authentication
- [x] Vehicle entry/exit
- [x] OCR integration
- [x] Bill generation
- [x] Basic parking operations

### Version 2.0 (Planned)
- [ ] Dashboard with analytics
- [ ] Parking lot management UI
- [ ] Employee management panel
- [ ] Payment gateway integration
- [ ] Parking history & reports
- [ ] Email notifications
- [ ] Mobile app (React Native)

### Future Enhancements
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Advanced analytics
- [ ] API rate limiting
- [ ] Real-time slot updates (WebSocket)
- [ ] Reservation system
- [ ] Mobile number OTP login

---

## 📊 Statistics

- **Total Lines of Code:** ~3,500+
- **Components:** 7
- **Services:** 5
- **API Endpoints Integrated:** 21
- **Dependencies:** 4 main packages

---

<div align="center">

**Built with ❤️ using React and Firebase**

[⬆ Back to Top](#smart-parking-system---frontend)

</div>
