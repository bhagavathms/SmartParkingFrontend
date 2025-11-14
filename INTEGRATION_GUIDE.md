# Smart Parking - Backend API Integration Guide

## Overview

This guide explains how the frontend has been integrated with your Spring Boot backend API. The integration includes:

- Firebase Authentication
- RESTful API communication
- Global state management
- Protected routes
- Complete parking entry/exit workflow

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install firebase
```

### 2. Configure Environment Variables

Create a `.env` file in the project root (copy from `.env.example`):

```bash
cp .env.example .env
```

Edit `.env` with your actual credentials:

```env
# API Configuration
REACT_APP_API_BASE_URL=http://localhost:8080/api
REACT_APP_API_BASE_URL_PROD=https://smartparking-abxp.onrender.com/api

# Firebase Configuration (Get these from Firebase Console)
REACT_APP_FIREBASE_API_KEY=your_actual_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id

# OCR Service
REACT_APP_OCR_API_URL=https://amankumar00-smartParking.hf.space/ocr

# Environment
REACT_APP_ENV=development
```

### 3. Get Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Go to Project Settings → General
4. Scroll to "Your apps" → Select your web app
5. Copy the `firebaseConfig` object values to your `.env` file

### 4. Start the Application

```bash
npm start
```

The app will run at `http://localhost:1234` (Parcel default port)

---

## 📁 Project Structure

```
src/
├── config/
│   ├── api.config.js          # API endpoint configuration
│   └── firebase.config.js     # Firebase initialization
├── services/
│   ├── apiClient.js           # HTTP client with auth interceptor
│   ├── authService.js         # Authentication methods
│   ├── parkingService.js      # Parking operations
│   ├── parkingLotService.js   # Parking lot management
│   ├── employeeService.js     # Employee CRUD
│   └── index.js               # Service exports
├── context/
│   ├── AuthContext.jsx        # Global auth state
│   └── ParkingContext.jsx     # Global parking state
├── components/
│   ├── LoginModal.jsx         # Login modal
│   ├── SignupModal.jsx        # Signup modal
│   └── OcrBox.jsx             # OCR component
├── pages/
│   ├── Home.jsx               # Landing page
│   ├── Dashboard.jsx          # Dashboard
│   ├── EntryPage.jsx          # Vehicle entry
│   └── ExitPage.jsx           # Vehicle exit
├── layout/
│   ├── Layout.jsx             # Main layout wrapper
│   ├── Header.jsx             # Navigation header
│   ├── Footer.jsx             # Footer
│   └── Body.jsx               # Body wrapper
└── styles/
    ├── main.css               # Global styles
    └── modal.css              # Modal styles
```

---

## 🔑 Authentication Flow

### How It Works

1. **User Registration/Login**
   - User fills in login/signup modal
   - Firebase Authentication creates/authenticates user
   - Firebase returns ID token

2. **Token Management**
   - ID token stored in Firebase Auth state
   - `apiClient.js` automatically attaches token to all API requests
   - Token included in `Authorization: Bearer <token>` header

3. **Backend Verification**
   - Spring Boot backend verifies Firebase token
   - Grants access to protected endpoints

### Login Example

```javascript
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { login, isAuthenticated, currentUser } = useAuth();

  const handleLogin = async () => {
    const result = await login('user@example.com', 'password');
    if (result.success) {
      console.log('Logged in:', currentUser);
    }
  };
}
```

---

## 📡 API Integration

### API Client

All API calls go through `apiClient.js`, which:
- Automatically adds authentication tokens
- Handles errors consistently
- Manages request timeouts
- Returns standardized responses

### Making API Calls

**Option 1: Using Service Methods (Recommended)**

```javascript
import { parkingService } from '../services';

// Park a vehicle
const result = await parkingService.parkVehicle('CAR', 'ABC123');
if (result.success) {
  console.log('Vehicle parked:', result.data);
} else {
  console.error('Error:', result.message);
}
```

**Option 2: Direct API Client**

```javascript
import apiClient from '../services/apiClient';

const response = await apiClient.post('/parking/entry', {
  vehicleType: 'CAR',
  vehicleRegistration: 'ABC123'
});
```

### Available Services

#### 1. Authentication Service

```javascript
import { authService } from '../services';

// Register
await authService.register('email@example.com', 'password', 'John Doe');

// Login
await authService.login('email@example.com', 'password');

// Google Login
await authService.loginWithGoogle();

// Logout
await authService.logout();

// Get current user from backend
await authService.getCurrentUser();
```

#### 2. Parking Service

```javascript
import { parkingService } from '../services';

// Park vehicle
await parkingService.parkVehicle('CAR', 'ABC123');

// Exit vehicle
await parkingService.exitVehicle('ABC123');

// Get vehicle status
await parkingService.getVehicleStatus('ABC123');
```

#### 3. Parking Lot Service

```javascript
import { parkingLotService } from '../services';

// Create parking lot
await parkingLotService.createParkingLot('Main Lot', '123 Street', 3);

// Get all parking lots
await parkingLotService.getAllParkingLots();

// Add floor
await parkingLotService.addFloor(0, 'lot-id', {
  COMPACT: 10,
  STANDARD: 20,
  LARGE: 5
});

// Get floors by parking lot
await parkingLotService.getFloorsByParkingLotId('lot-id');
```

#### 4. Employee Service

```javascript
import { employeeService } from '../services';

// Create employee
await employeeService.createEmployee({
  name: 'John Doe',
  email: 'john@example.com',
  phNo: '1234567890',
  dob: '1990-01-01',
  gender: 'MALE',
  roles: 'ADMIN'
});

// Get all employees
await employeeService.getAllEmployees();

// Update employee
await employeeService.updateEmployee('emp-id', employeeData);

// Delete employee
await employeeService.deleteEmployee('emp-id');
```

---

## 🎯 Global State Management

### Auth Context

Access authentication state anywhere in your app:

```javascript
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const {
    currentUser,        // Firebase user object
    userInfo,           // Backend user info
    isAuthenticated,    // Boolean: is user logged in?
    loading,            // Boolean: auth state loading
    error,              // String: error message
    login,              // Function: login user
    register,           // Function: register user
    logout,             // Function: logout user
    loginWithGoogle,    // Function: Google login
    resetPassword,      // Function: send password reset
  } = useAuth();

  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {currentUser.displayName}</p>
      ) : (
        <button onClick={() => login(email, password)}>Login</button>
      )}
    </div>
  );
}
```

### Parking Context

Manage parking operations globally:

```javascript
import { useParking } from '../context/ParkingContext';

function MyComponent() {
  const {
    parkingLots,        // Array: all parking lots
    currentVehicle,     // Object: current vehicle data
    loading,            // Boolean: operation in progress
    error,              // String: error message
    fetchParkingLots,   // Function: get all lots
    parkVehicle,        // Function: park a vehicle
    exitVehicle,        // Function: exit a vehicle
    getVehicleStatus,   // Function: check vehicle status
    createParkingLot,   // Function: create new lot
  } = useParking();

  return (
    <div>
      {loading ? <p>Loading...</p> : <VehicleList />}
    </div>
  );
}
```

---

## 🛡️ Protected Routes

Routes are automatically protected using authentication context:

```javascript
// In EntryPage.jsx and ExitPage.jsx
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function EntryPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/'); // Redirect to home if not logged in
    }
  }, [isAuthenticated, navigate]);

  // Rest of component...
}
```

---

## 🔄 Complete User Flow

### 1. Landing Page (/)
- User sees welcome page
- Can click "Login" or "Signup" in header
- If already authenticated → redirect to `/dashboard`

### 2. Authentication
- Click Login/Signup button
- Modal appears with form
- Enter credentials
- Firebase authenticates user
- Token automatically attached to all API calls
- Redirect to `/dashboard`

### 3. Dashboard (/dashboard)
- Shows "Entry" and "Exit" options
- Only accessible when logged in

### 4. Vehicle Entry (/entry)
- Upload vehicle image for OCR (optional)
- Detected number plate auto-fills form
- Select vehicle type (CAR/BIKE/TRUCK)
- Enter/confirm registration number
- Click "Park Vehicle"
- Backend assigns parking slot
- Shows success message with slot details

### 5. Vehicle Exit (/exit)
- Enter vehicle registration number
- System fetches vehicle info from backend
- Shows parking duration and details
- Click "Process Exit"
- Backend calculates bill
- Shows final bill with amount
- Vehicle marked as exited

---

## 🚨 Error Handling

All services return a consistent response format:

```javascript
{
  success: true/false,
  data: {...},           // Response data (if success)
  message: "...",        // Success/error message
  error: Error          // Error object (if failed)
}
```

### Handling Errors in Components

```javascript
const handleParkVehicle = async () => {
  const result = await parkVehicle('CAR', 'ABC123');

  if (result.success) {
    // Success - show confirmation
    setSuccessMessage(result.message);
  } else {
    // Error - show error message
    setError(result.message);
  }
};
```

---

## 🧪 Testing the Integration

### 1. Start Backend Server

```bash
# In your Spring Boot project
./mvnw spring-boot:run
# Backend runs at http://localhost:8080
```

### 2. Start Frontend

```bash
# In this project
npm start
# Frontend runs at http://localhost:1234
```

### 3. Test Authentication

1. Open `http://localhost:1234`
2. Click "Signup" in header
3. Create a new account
4. Verify you're redirected to dashboard
5. Check browser console for Firebase token

### 4. Test Vehicle Entry

1. Go to Dashboard → Click "Entry"
2. Select vehicle type
3. Enter registration (e.g., "ABC123")
4. Click "Park Vehicle"
5. Check response for slot assignment

### 5. Test Vehicle Exit

1. Go to Dashboard → Click "Exit"
2. Enter same registration number
3. Click "Search Vehicle"
4. Verify vehicle details appear
5. Click "Process Exit"
6. Check bill is generated

---

## 🌐 API Endpoints Used

### Authentication
- `GET /api/auth/me` - Get current user
- `POST /api/auth/verify-token` - Verify token

### Parking
- `POST /api/parking/entry` - Park vehicle
- `POST /api/parking/exit/{registration}` - Exit vehicle
- `GET /api/parking/vehicle/{registration}` - Get vehicle status

### Parking Lots
- `GET /api/parking-lots` - Get all lots
- `POST /api/parking-lots` - Create lot
- `POST /api/parking-lots/floors` - Add floor
- `GET /api/parking-lots/{id}/floors` - Get floors

### Employees
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Create employee
- `PUT /api/employees/{id}` - Update employee
- `DELETE /api/employees/{id}` - Delete employee

---

## 🔧 Configuration

### Switching Between Local and Production API

Edit `src/config/api.config.js`:

```javascript
const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api',
  // ...
};
```

Or set environment variable:

```bash
# For local development
REACT_APP_API_BASE_URL=http://localhost:8080/api

# For production
REACT_APP_API_BASE_URL=https://smartparking-abxp.onrender.com/api
```

---

## 📝 Important Notes

### CORS Configuration
Ensure your backend allows requests from `http://localhost:1234`:

```java
// In SecurityConfig.java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList(
        "http://localhost:1234",
        "http://localhost:3000",
        "https://your-production-url.com"
    ));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```

### Firebase Admin SDK
Make sure your backend has Firebase Admin SDK configured to verify tokens:

```java
// Backend should have firebase-admin dependency and service account JSON
```

### Environment Variables
Never commit `.env` file with actual credentials. Use `.env.example` as template.

---

## 🐛 Troubleshooting

### Issue: "Firebase: Error (auth/invalid-api-key)"
**Solution:** Check that `REACT_APP_FIREBASE_API_KEY` in `.env` is correct

### Issue: "Network Error" or CORS errors
**Solution:**
- Ensure backend is running
- Check CORS configuration in backend
- Verify API base URL in `.env`

### Issue: "Unauthorized" (401) on API calls
**Solution:**
- Check Firebase user is authenticated
- Verify token is being sent in Authorization header
- Check backend Firebase configuration

### Issue: Token not attached to requests
**Solution:** Ensure user is logged in before making API calls

---

## 📚 Next Steps

1. **Add Route Guards**: Implement PrivateRoute component for better route protection
2. **Add Loading Screens**: Global loading indicator for API calls
3. **Improve Error Handling**: Toast notifications for errors
4. **Add Form Validation**: Client-side validation before API calls
5. **Implement Caching**: Cache parking lot data to reduce API calls
6. **Add Pagination**: For employee and vehicle lists
7. **Add Admin Panel**: For managing parking lots and employees
8. **Add Analytics Dashboard**: Show parking statistics

---

## 🤝 Support

For issues or questions:
1. Check this integration guide
2. Review backend API documentation
3. Check browser console for errors
4. Verify environment variables are set correctly

---

## ✅ Checklist

- [ ] Firebase dependencies installed (`npm install firebase`)
- [ ] `.env` file created and configured
- [ ] Firebase credentials added to `.env`
- [ ] Backend server running
- [ ] Frontend server running
- [ ] Can sign up new user
- [ ] Can log in
- [ ] Can park vehicle
- [ ] Can exit vehicle
- [ ] All API calls working

---

**Integration completed successfully! Your frontend is now fully connected to the Spring Boot backend.**
