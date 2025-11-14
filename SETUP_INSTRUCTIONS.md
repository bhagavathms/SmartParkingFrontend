# Smart Parking - Setup Instructions

## 🎯 Prerequisites

Before you begin, ensure you have:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** (optional, for version control)
- **Firebase Account** - [Sign up](https://firebase.google.com/)
- **Backend Server** running (Spring Boot)

---

## 📦 Installation Steps

### Step 1: Install Dependencies

Navigate to the project directory and install all required packages:

```bash
cd /home/hello/Desktop/SmartParking
npm install
```

This will install:
- `firebase` - Firebase SDK for authentication
- `react` & `react-dom` - React framework
- `react-router-dom` - Routing library
- `parcel` - Build tool

---

### Step 2: Firebase Setup

#### 2.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name (e.g., "smart-parking")
4. Disable Google Analytics (optional)
5. Click "Create project"

#### 2.2 Enable Authentication

1. In Firebase Console, go to **Authentication** → **Get Started**
2. Click on **Sign-in method** tab
3. Enable the following providers:
   - **Email/Password** - Click, toggle "Enable", Save
   - **Google** (optional) - Click, toggle "Enable", add support email, Save

#### 2.3 Register Web App

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll to "Your apps"
3. Click the **Web** icon (`</>`)
4. Register app:
   - App nickname: "Smart Parking Web"
   - Don't check Firebase Hosting
   - Click "Register app"

#### 2.4 Get Firebase Config

You'll see a `firebaseConfig` object like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "smart-parking-xxxxx.firebaseapp.com",
  projectId: "smart-parking-xxxxx",
  storageBucket: "smart-parking-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:xxxxxxxxxxxxx"
};
```

Copy these values - you'll need them in Step 3.

---

### Step 3: Environment Configuration

#### 3.1 Create .env File

Copy the example environment file:

```bash
cp .env.example .env
```

#### 3.2 Edit .env File

Open `.env` in your text editor and fill in the values:

```env
# API Configuration
REACT_APP_API_BASE_URL=http://localhost:8080/api
REACT_APP_API_BASE_URL_PROD=https://smartparking-abxp.onrender.com/api

# Firebase Configuration (REPLACE WITH YOUR VALUES)
REACT_APP_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXX
REACT_APP_FIREBASE_AUTH_DOMAIN=smart-parking-xxxxx.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=smart-parking-xxxxx
REACT_APP_FIREBASE_STORAGE_BUCKET=smart-parking-xxxxx.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789012
REACT_APP_FIREBASE_APP_ID=1:123456789012:web:xxxxxxxxxxxxx

# OCR Service (Already configured)
REACT_APP_OCR_API_URL=https://amankumar00-smartParking.hf.space/ocr

# Environment
REACT_APP_ENV=development
```

**Important:**
- Replace all `xxxxx` values with your actual Firebase config
- Keep `REACT_APP_` prefix for all variables (required by React)
- Never commit `.env` to version control

---

### Step 4: Backend Configuration

#### 4.1 Ensure Backend is Running

Start your Spring Boot backend server:

```bash
# In your backend project directory
./mvnw spring-boot:run

# Or if using Gradle
./gradlew bootRun
```

Backend should be running at `http://localhost:8080`

#### 4.2 Verify CORS Configuration

In your backend's `SecurityConfig.java`, ensure CORS allows frontend origin:

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList(
        "http://localhost:1234",  // Parcel default port
        "http://localhost:3000"   // Alternative port
    ));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```

#### 4.3 Firebase Admin SDK (Backend)

Ensure your backend has Firebase Admin SDK configured:

1. Download service account JSON from Firebase Console:
   - Project Settings → Service Accounts
   - Click "Generate new private key"
   - Save as `firebase-service-account.json` in backend `src/main/resources/`

2. Backend should initialize Firebase Admin:
   ```java
   @PostConstruct
   public void initializeFirebase() {
       FileInputStream serviceAccount = new FileInputStream("src/main/resources/firebase-service-account.json");

       FirebaseOptions options = FirebaseOptions.builder()
           .setCredentials(GoogleCredentials.fromStream(serviceAccount))
           .build();

       FirebaseApp.initializeApp(options);
   }
   ```

---

### Step 5: Start the Frontend

Run the development server:

```bash
npm start
```

The application will start at:
- **URL:** `http://localhost:1234`
- **Auto-reload:** Enabled (changes will refresh automatically)

You should see:
```
Server running at http://localhost:1234
✨ Built in XXXms
```

---

## 🧪 Testing the Setup

### Test 1: Frontend Loads

1. Open browser to `http://localhost:1234`
2. You should see the "Welcome to Smart Parking" home page
3. Check browser console (F12) - no errors should appear

### Test 2: Authentication Works

#### Sign Up
1. Click "Signup" in header
2. Fill in form:
   - Name: "Test User"
   - Email: "test@example.com"
   - Password: "test123"
   - Confirm Password: "test123"
3. Click "Sign Up"
4. Should redirect to `/dashboard`
5. Check browser console for Firebase user object

#### Log Out
1. Click "Logout" in header
2. Should redirect to home page

#### Log In
1. Click "Login" in header
2. Enter credentials from step 2
3. Click "Login"
4. Should redirect to `/dashboard`

### Test 3: API Integration Works

#### Before testing, create a parking lot in backend:
```bash
curl -X POST http://localhost:8080/api/parking-lots \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -d '{
    "name": "Main Parking",
    "address": "123 Test Street",
    "totalFloors": 1
  }'

# Then add a floor with slots:
curl -X POST http://localhost:8080/api/parking-lots/floors \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -d '{
    "floorNo": 0,
    "parkingLotId": "PARKING_LOT_ID_FROM_ABOVE",
    "slotConfiguration": {
      "COMPACT": 5,
      "STANDARD": 10,
      "LARGE": 3
    }
  }'
```

#### Test Vehicle Entry
1. From dashboard, click "Entry"
2. Select vehicle type: "Car"
3. Enter registration: "TEST123"
4. Click "Park Vehicle"
5. Should show success message with:
   - Vehicle ID
   - Assigned slot ID
   - Entry time

#### Test Vehicle Exit
1. From dashboard, click "Exit"
2. Enter registration: "TEST123"
3. Click "Search Vehicle"
4. Should display vehicle information
5. Click "Process Exit"
6. Should show bill with:
   - Duration
   - Amount
   - Exit time

---

## 📂 Project Structure Reference

```
SmartParking/
├── .env                        # Environment variables (DO NOT COMMIT)
├── .env.example                # Environment template
├── .gitignore                  # Git ignore rules
├── package.json                # Dependencies
├── index.html                  # Entry HTML
├── INTEGRATION_GUIDE.md        # Integration documentation
├── SETUP_INSTRUCTIONS.md       # This file
├── src/
│   ├── App.jsx                 # Main app component
│   ├── index.jsx               # Entry point
│   ├── config/
│   │   ├── api.config.js       # API configuration
│   │   └── firebase.config.js  # Firebase setup
│   ├── services/
│   │   ├── apiClient.js        # HTTP client
│   │   ├── authService.js      # Auth methods
│   │   ├── parkingService.js   # Parking API
│   │   ├── parkingLotService.js# Lot management
│   │   ├── employeeService.js  # Employee API
│   │   └── index.js            # Service exports
│   ├── context/
│   │   ├── AuthContext.jsx     # Global auth state
│   │   └── ParkingContext.jsx  # Global parking state
│   ├── components/
│   │   ├── LoginModal.jsx      # Login modal
│   │   ├── SignupModal.jsx     # Signup modal
│   │   └── OcrBox.jsx          # OCR component
│   ├── pages/
│   │   ├── Home.jsx            # Landing page
│   │   ├── Dashboard.jsx       # Dashboard
│   │   ├── EntryPage.jsx       # Vehicle entry
│   │   └── ExitPage.jsx        # Vehicle exit
│   ├── layout/
│   │   ├── Layout.jsx          # Main layout
│   │   ├── Header.jsx          # Header/navbar
│   │   ├── Footer.jsx          # Footer
│   │   └── Body.jsx            # Body wrapper
│   └── styles/
│       ├── main.css            # Global styles
│       └── modal.css           # Modal styles
└── public/
    └── images/                 # Static images
```

---

## 🔧 Common Issues & Solutions

### Issue 1: "npm install" fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue 2: Firebase errors on load

**Error:** `Firebase: Error (auth/invalid-api-key)`

**Solution:**
- Check `.env` file exists
- Verify all Firebase config values are correct
- Ensure values don't have quotes or extra spaces
- Restart dev server after changing `.env`

### Issue 3: CORS errors

**Error:** `Access to fetch at 'http://localhost:8080/api/...' has been blocked by CORS policy`

**Solution:**
- Verify backend is running
- Check backend CORS configuration allows `http://localhost:1234`
- Restart backend server after CORS changes

### Issue 4: Unauthorized (401) errors

**Error:** `401 Unauthorized` on API calls

**Solution:**
- Ensure you're logged in
- Check Firebase token in browser console:
  ```javascript
  // In browser console
  firebase.auth().currentUser.getIdToken().then(token => console.log(token))
  ```
- Verify backend Firebase Admin SDK is configured correctly
- Check service account JSON is in backend resources

### Issue 5: Module not found errors

**Error:** `Module not found: Can't resolve 'firebase'`

**Solution:**
```bash
# Install missing dependency
npm install firebase

# If still fails, try:
rm -rf node_modules package-lock.json
npm install
```

### Issue 6: Port already in use

**Error:** `Error: Port 1234 is already in use`

**Solution:**
```bash
# Option 1: Kill process on port 1234
lsof -ti:1234 | xargs kill -9

# Option 2: Use different port
parcel index.html --port 3000
```

---

## 🚀 Production Build

### Create Production Build

```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

### Environment Variables for Production

Create `.env.production`:

```env
REACT_APP_API_BASE_URL=https://smartparking-abxp.onrender.com/api
REACT_APP_FIREBASE_API_KEY=your_production_firebase_key
# ... other production values
```

---

## 📋 Pre-Launch Checklist

### Frontend
- [ ] All dependencies installed (`npm install`)
- [ ] `.env` file created and configured
- [ ] Firebase credentials correct
- [ ] App runs without errors (`npm start`)
- [ ] No console errors in browser
- [ ] Can sign up new user
- [ ] Can log in
- [ ] Can log out

### Backend
- [ ] Spring Boot server running
- [ ] Firebase Admin SDK configured
- [ ] CORS allows frontend origin
- [ ] At least one parking lot exists
- [ ] At least one floor with slots exists

### Integration
- [ ] Can park a vehicle
- [ ] Can exit a vehicle
- [ ] Bills are calculated correctly
- [ ] All API endpoints respond
- [ ] Authentication tokens work

---

## 🎓 Next Steps

After successful setup:

1. **Read the Integration Guide**: `INTEGRATION_GUIDE.md` for detailed API usage
2. **Customize UI**: Modify components in `src/components/` and `src/pages/`
3. **Add Features**:
   - Dashboard statistics
   - Parking lot management UI
   - Employee management panel
   - Payment integration
4. **Improve UX**:
   - Add loading spinners
   - Toast notifications
   - Form validation
   - Error boundaries

---

## 📞 Support

If you encounter issues:

1. Check browser console for errors (F12)
2. Check terminal for build errors
3. Verify `.env` configuration
4. Ensure backend is running
5. Review `INTEGRATION_GUIDE.md`

---

## ✅ Quick Start Summary

```bash
# 1. Install dependencies
npm install

# 2. Create .env from template
cp .env.example .env

# 3. Edit .env with Firebase credentials
nano .env

# 4. Start backend (in backend directory)
./mvnw spring-boot:run

# 5. Start frontend
npm start

# 6. Open browser to http://localhost:1234
```

**You're all set! 🎉**
