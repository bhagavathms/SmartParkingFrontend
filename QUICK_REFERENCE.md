# Smart Parking - Quick Reference Card

Quick copy-paste snippets for common operations.

---

## 🚀 Setup Commands

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm start

# Build for production
npm run build
```

---

## 🔐 Using Authentication

### In a Component

```javascript
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const {
    isAuthenticated,  // boolean
    currentUser,      // Firebase user
    userInfo,         // Backend user data
    loading,          // boolean
    error,            // string
    login,            // function
    logout,           // function
    register          // function
  } = useAuth();

  // Login
  const handleLogin = async () => {
    const result = await login('email@example.com', 'password');
    if (result.success) {
      console.log('Success!');
    }
  };

  // Check if logged in
  if (isAuthenticated) {
    return <div>Welcome, {currentUser.displayName}</div>;
  }
}
```

### Protect a Route

```javascript
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function ProtectedPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return <div>Protected Content</div>;
}
```

---

## 🚗 Using Parking Service

### In a Component

```javascript
import { useParking } from '../context/ParkingContext';

function MyComponent() {
  const {
    parkingLots,      // array
    currentVehicle,   // object
    loading,          // boolean
    error,            // string
    parkVehicle,      // function
    exitVehicle,      // function
    getVehicleStatus  // function
  } = useParking();

  // Park a vehicle
  const handlePark = async () => {
    const result = await parkVehicle('CAR', 'ABC123');
    if (result.success) {
      console.log('Parked!', result.data);
    }
  };

  // Exit a vehicle
  const handleExit = async () => {
    const result = await exitVehicle('ABC123');
    if (result.success) {
      console.log('Bill:', result.data.billAmt);
    }
  };

  // Check vehicle status
  const checkStatus = async () => {
    const result = await getVehicleStatus('ABC123');
    if (result.success) {
      console.log('Status:', result.data.status);
    }
  };
}
```

---

## 🌐 Direct API Calls

### Using Service Methods

```javascript
import { parkingService, authService, parkingLotService } from '../services';

// Park vehicle
const result = await parkingService.parkVehicle('CAR', 'ABC123');

// Exit vehicle
const result = await parkingService.exitVehicle('ABC123');

// Get vehicle status
const result = await parkingService.getVehicleStatus('ABC123');

// Get all parking lots
const result = await parkingLotService.getAllParkingLots();

// Create parking lot
const result = await parkingLotService.createParkingLot(
  'Main Lot',
  '123 Street',
  3
);

// Get current user from backend
const result = await authService.getCurrentUser();
```

### Using API Client Directly

```javascript
import apiClient from '../services/apiClient';

// GET request
const response = await apiClient.get('/parking-lots');

// POST request
const response = await apiClient.post('/parking/entry', {
  vehicleType: 'CAR',
  vehicleRegistration: 'ABC123'
});

// PUT request
const response = await apiClient.put('/employees/emp-123', {
  name: 'Updated Name'
});

// DELETE request
const response = await apiClient.delete('/employees/emp-123');
```

---

## 📝 Response Format

All API calls return:

```javascript
{
  success: boolean,    // true if successful
  data: object,        // response data (if success)
  message: string,     // success/error message
  error: Error        // error object (if failed)
}
```

### Handling Responses

```javascript
const result = await parkingService.parkVehicle('CAR', 'ABC123');

if (result.success) {
  // Success
  console.log(result.message);  // "Vehicle parked successfully"
  console.log(result.data);     // { vehicleId, slotId, ... }
} else {
  // Error
  console.error(result.message); // "No available slots"
  console.error(result.error);   // Error object
}
```

---

## 🎨 Common Patterns

### Loading State

```javascript
function MyComponent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    const result = await parkingService.parkVehicle('CAR', 'ABC123');

    if (result.success) {
      // Success
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p style={{color: 'red'}}>{error}</p>}
      <button onClick={handleSubmit} disabled={loading}>
        Submit
      </button>
    </div>
  );
}
```

### Form Submission

```javascript
function ParkingForm() {
  const [formData, setFormData] = useState({
    vehicleType: 'CAR',
    registration: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await parkingService.parkVehicle(
      formData.vehicleType,
      formData.registration
    );
    // Handle result...
  };

  return (
    <form onSubmit={handleSubmit}>
      <select
        name="vehicleType"
        value={formData.vehicleType}
        onChange={handleChange}
      >
        <option value="CAR">Car</option>
        <option value="BIKE">Bike</option>
        <option value="TRUCK">Truck</option>
      </select>

      <input
        name="registration"
        value={formData.registration}
        onChange={handleChange}
        required
      />

      <button type="submit">Park</button>
    </form>
  );
}
```

---

## 🔗 API Endpoints Quick Reference

### Authentication
```
GET    /api/auth/me
GET    /api/auth/user/{uid}
POST   /api/auth/verify-token
```

### Parking
```
POST   /api/parking/entry
POST   /api/parking/exit/{registration}
GET    /api/parking/vehicle/{registration}
```

### Parking Lots
```
POST   /api/parking-lots
GET    /api/parking-lots
GET    /api/parking-lots/{id}
POST   /api/parking-lots/floors
GET    /api/parking-lots/floors/{id}
GET    /api/parking-lots/{id}/floors
```

### Employees
```
POST   /api/employees
GET    /api/employees
GET    /api/employees/{id}
GET    /api/employees/email/{email}
PUT    /api/employees/{id}
DELETE /api/employees/{id}
```

---

## 📊 Enums Reference

### Vehicle Types
```javascript
'FOUR_WHEELER'   // Car/Four-wheeler
'TWO_WHEELER'    // Bike/Two-wheeler
'HEAVY_VEHICLE'  // Truck/Heavy vehicle
```

### Slot Types
```javascript
'COMPACT'   // Small slots
'STANDARD'  // Medium slots
'LARGE'     // Large slots
```

### Vehicle Status
```javascript
'PARKED'  // Currently parked
'EXITED'  // Has exited
```

### Gender
```javascript
'MALE'
'FEMALE'
'OTHER'
```

---

## 🛠️ Environment Variables

```env
# API
REACT_APP_API_BASE_URL=http://localhost:8080/api

# Firebase
REACT_APP_FIREBASE_API_KEY=your_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project
REACT_APP_FIREBASE_STORAGE_BUCKET=your_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id

# OCR
REACT_APP_OCR_API_URL=https://amankumar00-smartParking.hf.space/ocr

# Environment
REACT_APP_ENV=development
```

---

## 🐛 Debug Commands

```javascript
// In browser console

// Get current Firebase user
firebase.auth().currentUser

// Get Firebase token
firebase.auth().currentUser.getIdToken().then(token => console.log(token))

// Check auth state
console.log(firebase.auth().currentUser)

// Check local storage
console.log(localStorage)

// Check session storage
console.log(sessionStorage)
```

---

## 📦 Import Shortcuts

```javascript
// Services
import {
  authService,
  parkingService,
  parkingLotService,
  employeeService
} from '../services';

// Contexts
import { useAuth } from '../context/AuthContext';
import { useParking } from '../context/ParkingContext';

// React Router
import { useNavigate, useParams, Link } from 'react-router-dom';
```

---

## 🎯 Common Tasks

### Logout User
```javascript
const { logout } = useAuth();
await logout();
navigate('/');
```

### Check if Logged In
```javascript
const { isAuthenticated } = useAuth();
if (isAuthenticated) {
  // User is logged in
}
```

### Show User Name
```javascript
const { currentUser } = useAuth();
console.log(currentUser?.displayName);
console.log(currentUser?.email);
```

### Navigate Programmatically
```javascript
import { useNavigate } from 'react-router-dom';
const navigate = useNavigate();
navigate('/dashboard');
```

### Format Date/Time
```javascript
const timeIn = "2025-11-14T10:30:00";
const formatted = new Date(timeIn).toLocaleString();
// "11/14/2025, 10:30:00 AM"
```

### Calculate Duration
```javascript
function getDuration(startTime, endTime) {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const diffMs = end - start;

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  return `${hours}h ${minutes}m`;
}
```

---

## 🎨 Styling Tips

### Inline Styles
```javascript
const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto'
  },
  button: {
    padding: '12px 24px',
    background: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer'
  }
};

<div style={styles.container}>
  <button style={styles.button}>Click</button>
</div>
```

### Conditional Styling
```javascript
<div style={{
  color: isError ? 'red' : 'green',
  background: isActive ? '#f0f0f0' : 'white'
}}>
  Content
</div>
```

---

## 📱 Responsive Design

```javascript
const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
    '@media (max-width: 768px)': {
      padding: '10px'
    }
  }
};
```

---

## ✅ Quick Checklist

Before deployment:
- [ ] `.env` configured
- [ ] Firebase credentials set
- [ ] Backend URL correct
- [ ] npm install completed
- [ ] App runs without errors
- [ ] Can login/signup
- [ ] Can park vehicle
- [ ] Can exit vehicle
- [ ] No console errors

---

**Keep this as a quick reference while developing!**
