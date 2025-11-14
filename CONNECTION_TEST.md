# Connection Test - Frontend ↔️ Backend

## ✅ System Status

### Backend (Spring Boot)
- **Status**: Running ✅
- **Port**: 8080
- **Health Check**: http://localhost:8080/api/health
- **CORS**: Properly configured for `http://localhost:1234`

### Frontend (React + Parcel)
- **Status**: Running ✅
- **Port**: 1234
- **URL**: http://localhost:1234

---

## 🧪 Test the Integration

### 1. Open Browser
Navigate to: **http://localhost:1234**

### 2. Check Browser Console
Press **F12** to open DevTools, go to **Console** tab

You should see:
- ✅ No Firebase errors
- ✅ No CORS errors
- ✅ "Welcome to Smart Parking" home page loads

### 3. Test Authentication

#### Sign Up
1. Click **"Signup"** button in header
2. Fill in the form:
   - **Name**: Test User
   - **Email**: test@example.com
   - **Password**: test123
   - **Confirm Password**: test123
3. Click **"Sign Up"**
4. Should redirect to `/dashboard`

#### Check Network Tab
- Open **Network** tab in DevTools (F12)
- You should see requests to backend APIs
- Check for `Authorization: Bearer ...` headers

### 4. Test Vehicle Entry (Requires Setup)

**Important**: Before testing vehicle entry, you need at least one parking lot with slots.

#### Create Parking Lot via Backend

**Option 1: Using cURL**

```bash
# First, get Firebase token from browser console:
# 1. Open browser console
# 2. Type: firebase.auth().currentUser.getIdToken().then(t => console.log(t))
# 3. Copy the token

# Then create parking lot
curl -X POST http://localhost:8080/api/parking-lots \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN_HERE" \
  -d '{
    "name": "Main Parking Lot",
    "address": "123 Test Street",
    "totalFloors": 1
  }'

# Copy the parkingLotId from response, then add a floor
curl -X POST http://localhost:8080/api/parking-lots/floors \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN_HERE" \
  -d '{
    "floorNo": 0,
    "parkingLotId": "PASTE_PARKING_LOT_ID_HERE",
    "slotConfiguration": {
      "COMPACT": 5,
      "STANDARD": 10,
      "LARGE": 3
    }
  }'
```

**Option 2: Using Postman**
1. Set request type to **POST**
2. URL: `http://localhost:8080/api/parking-lots`
3. Headers:
   - `Content-Type: application/json`
   - `Authorization: Bearer YOUR_TOKEN`
4. Body (raw JSON):
   ```json
   {
     "name": "Main Parking Lot",
     "address": "123 Test Street",
     "totalFloors": 1
   }
   ```
5. Send request
6. Repeat for adding floor (change URL to `/api/parking-lots/floors`)

#### Test Entry in Frontend
1. Go to Dashboard → Click **"Entry"**
2. Select vehicle type: **Car**
3. Enter registration: **TEST123**
4. Click **"Park Vehicle"**
5. Should see success message with slot assignment

### 5. Test Vehicle Exit
1. Go to Dashboard → Click **"Exit"**
2. Enter registration: **TEST123**
3. Click **"Search Vehicle"**
4. Should display vehicle information
5. Click **"Process Exit"**
6. Should show bill with amount

---

## 🔍 Troubleshooting

### Issue: Still seeing CORS errors

**Solution 1**: Clear browser cache
- Press **Ctrl+Shift+Delete** (or Cmd+Shift+Delete on Mac)
- Select "Cached images and files"
- Click "Clear data"
- Refresh page

**Solution 2**: Hard reload
- Open page with **F12** (DevTools open)
- Right-click refresh button
- Select **"Empty Cache and Hard Reload"**

### Issue: Firebase authentication errors

**Check**:
1. `.env` file has correct Firebase credentials
2. No trailing spaces in `.env`
3. Dev server was restarted after `.env` changes

**Fix**:
```bash
# Restart frontend server
# Press Ctrl+C in terminal running npm start
npm start
```

### Issue: 401 Unauthorized on API calls

**Cause**: Not logged in or token expired

**Fix**:
1. Logout and login again
2. Check browser console for Firebase user:
   ```javascript
   firebase.auth().currentUser
   ```
3. Should show user object, not null

### Issue: "No available slots" error

**Cause**: No parking lot or floors created

**Fix**: Follow "Create Parking Lot via Backend" section above

---

## ✅ Success Checklist

- [ ] Backend running on port 8080
- [ ] Frontend running on port 1234
- [ ] Home page loads without errors
- [ ] Can sign up new user
- [ ] Can log in
- [ ] Network tab shows API requests with Authorization headers
- [ ] Parking lot created with at least one floor
- [ ] Can park a vehicle
- [ ] Can search for parked vehicle
- [ ] Can exit vehicle and see bill

---

## 📊 Expected API Flow

### 1. User Signs Up
```
Frontend → Firebase Authentication
Firebase → Returns user + ID token
Frontend → Stores token in memory
```

### 2. User Parks Vehicle
```
Frontend → POST /api/parking/entry
Headers: Authorization: Bearer <token>
Body: { vehicleType: "CAR", vehicleRegistration: "TEST123" }

Backend → Verifies token with Firebase
Backend → Finds available slot
Backend → Assigns slot to vehicle
Backend → Returns vehicle data with slot info

Frontend → Displays success message
```

### 3. User Exits Vehicle
```
Frontend → GET /api/parking/vehicle/TEST123
Backend → Returns vehicle info

Frontend → POST /api/parking/exit/TEST123
Backend → Calculates parking duration
Backend → Generates bill
Backend → Returns bill data

Frontend → Displays bill
```

---

## 🎯 Quick Test Commands

### Check Backend
```bash
curl http://localhost:8080/api/health
```

### Check Frontend
```bash
curl http://localhost:1234
```

### Check Parking Lots (requires auth)
```bash
curl http://localhost:8080/api/parking-lots \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Firebase Token (in browser console)
```javascript
firebase.auth().currentUser.getIdToken().then(token => {
  console.log('Token:', token);
  navigator.clipboard.writeText(token);
  console.log('Token copied to clipboard!');
});
```

---

## 🎉 If Everything Works

You should be able to:
1. ✅ Sign up and log in
2. ✅ See dashboard after login
3. ✅ Park a vehicle and get slot assignment
4. ✅ Exit a vehicle and see parking bill
5. ✅ All without CORS errors
6. ✅ All API calls include Authorization header

**Congratulations! Your Smart Parking system is fully integrated and working!** 🚀

---

## 📞 Need Help?

If you encounter issues:
1. Check browser console for errors
2. Check Network tab for failed requests
3. Verify both servers are running
4. Review [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
5. Check backend logs for errors
