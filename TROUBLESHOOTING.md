# Troubleshooting Guide - Smart Parking

## 🔥 Firebase Errors

### Error: `Firebase: Error (auth/invalid-api-key)`

This error occurs when Firebase cannot validate your API key.

**Solutions:**

1. **Verify Firebase API Key in Console:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project (`smartparking-14e22`)
   - Click the gear icon → **Project Settings**
   - Scroll to "Your apps" section
   - Find your web app
   - Verify the `apiKey` value matches your `.env` file

2. **Check API Key Restrictions:**
   - In Firebase Console → Project Settings
   - Go to the **Service accounts** tab (if available)
   - Or go to [Google Cloud Console](https://console.cloud.google.com/)
   - Navigate to: APIs & Services → Credentials
   - Find your API key (starts with `AIza...`)
   - Click "Edit API key"
   - Check if there are any restrictions:
     - **Application restrictions**: Should be "None" or "HTTP referrers" with `localhost` allowed
     - **API restrictions**: Should allow "Identity Toolkit API" and "Token Service API"
   - If restricted, add `localhost:1234` to allowed referrers

3. **Enable Required Firebase Services:**
   In Firebase Console:
   - Enable **Authentication**: Go to Authentication → Get Started
   - Enable **Identity Toolkit API** in Google Cloud Console
   - Enable **Token Service API** in Google Cloud Console

4. **Restart Development Server:**
   After changing `.env`:
   ```bash
   # Stop current server (Ctrl+C)
   # Then restart
   npm start
   ```

5. **Clear Browser Cache:**
   - Open DevTools (F12)
   - Right-click the refresh button
   - Select "Empty Cache and Hard Reload"

6. **Check .env File Format:**
   Ensure no trailing spaces or special characters:
   ```env
   REACT_APP_FIREBASE_API_KEY=AIzaSyALa0IxLMAevdzo4sTq_goMjcqOftHRQM0
   ```
   NOT:
   ```env
   REACT_APP_FIREBASE_API_KEY=AIzaSyALa0IxLMAevdzo4sTq_goMjcqOftHRQM0
   # No trailing space! ^
   ```

---

### Error: `can't access property "onAuthStateChanged"`

This error occurs when Firebase auth object is undefined.

**Causes:**
- Invalid API key (see above)
- Firebase not properly initialized
- Environment variables not loaded

**Solutions:**

1. **Fix the API key first** (see above section)

2. **Verify all Firebase config values:**
   ```env
   REACT_APP_FIREBASE_API_KEY=your_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789012
   REACT_APP_FIREBASE_APP_ID=1:123456789012:web:xxxxx
   ```

3. **Check Firebase initialization:**
   Open browser console and run:
   ```javascript
   console.log(process.env.REACT_APP_FIREBASE_API_KEY)
   ```
   If it shows `undefined`, environment variables aren't loading.

4. **Restart dev server** after `.env` changes

---

## 🌐 CORS Errors

### Error: `Access to fetch... has been blocked by CORS policy`

**Backend Fix (Spring Boot):**

Add to `SecurityConfig.java`:

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();

    // Add all possible origins
    configuration.setAllowedOrigins(Arrays.asList(
        "http://localhost:1234",
        "http://localhost:3000",
        "http://127.0.0.1:1234",
        "http://127.0.0.1:3000"
    ));

    configuration.setAllowedMethods(Arrays.asList(
        "GET", "POST", "PUT", "DELETE", "OPTIONS"
    ));

    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setAllowCredentials(true);
    configuration.setMaxAge(3600L);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```

Restart backend after changes.

---

## 🔒 Authentication Errors

### Error: `401 Unauthorized` on API calls

**Causes:**
- User not logged in
- Token expired
- Token not being sent
- Backend Firebase config wrong

**Solutions:**

1. **Verify user is logged in:**
   ```javascript
   // In browser console
   firebase.auth().currentUser
   ```
   Should show user object, not `null`

2. **Check token is being sent:**
   - Open Network tab (F12)
   - Make an API call
   - Click the request
   - Check "Headers" tab
   - Should see: `Authorization: Bearer eyJhbGc...`

3. **Verify backend Firebase Admin SDK:**
   - Check `firebase-service-account.json` exists in backend
   - Verify Firebase Admin is initialized in backend
   - Check backend logs for Firebase errors

4. **Re-login:**
   - Logout and login again to get fresh token

---

## 📦 Module/Dependency Errors

### Error: `Module not found: Can't resolve 'firebase'`

**Solution:**
```bash
npm install firebase
```

### Error: `Cannot find module 'react-router-dom'`

**Solution:**
```bash
npm install react-router-dom
```

### Generic dependency issues:

```bash
# Clear everything and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

---

## 🚀 Build/Server Errors

### Error: `Port 1234 is already in use`

**Solution:**
```bash
# Find and kill process
lsof -ti:1234 | xargs kill -9

# Or use different port
parcel index.html --port 3000
```

### Dev server won't start:

**Solutions:**

1. **Check Node.js version:**
   ```bash
   node --version  # Should be v16+
   npm --version
   ```

2. **Reinstall Parcel:**
   ```bash
   npm install --save-dev parcel
   ```

3. **Clear Parcel cache:**
   ```bash
   rm -rf .parcel-cache dist
   npm start
   ```

---

## 🐛 Runtime Errors

### React Hook Errors

**Error:** `Invalid hook call`

**Causes:**
- Multiple React versions
- Hooks called outside component
- Hooks called conditionally

**Solution:**
```bash
npm ls react react-dom
# If multiple versions, reinstall
npm install react react-dom
```

### Context Errors

**Error:** `useAuth must be used within an AuthProvider`

**Cause:** Component not wrapped in provider

**Solution:** Ensure `App.jsx` has:
```javascript
<AuthProvider>
  <YourComponent />
</AuthProvider>
```

---

## 📊 API Response Errors

### Vehicle not found

**Error:** `Vehicle not found` on exit

**Cause:** Vehicle wasn't properly parked or registration doesn't match

**Solutions:**
- Check exact registration number used during entry
- Verify vehicle was successfully parked (check backend DB)
- Registration is case-sensitive (though frontend converts to uppercase)

### No available slots

**Error:** `No available slots`

**Cause:** All parking slots occupied or no floors created

**Solutions:**

1. **Create parking lot and floors via backend:**
   ```bash
   # Create parking lot
   curl -X POST http://localhost:8080/api/parking-lots \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d '{
       "name": "Main Lot",
       "address": "123 Street",
       "totalFloors": 1
     }'

   # Add floor with slots
   curl -X POST http://localhost:8080/api/parking-lots/floors \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d '{
       "floorNo": 0,
       "parkingLotId": "LOT_ID_FROM_ABOVE",
       "slotConfiguration": {
         "COMPACT": 10,
         "STANDARD": 20,
         "LARGE": 5
       }
     }'
   ```

2. **Verify slots in database**

---

## 🔍 Debugging Tips

### Enable Verbose Logging

**In browser console:**
```javascript
// Log all environment variables
console.log('Env vars:', {
  apiUrl: process.env.REACT_APP_API_BASE_URL,
  firebaseKey: process.env.REACT_APP_FIREBASE_API_KEY,
  // etc.
});

// Log auth state
firebase.auth().onAuthStateChanged(user => {
  console.log('Auth state:', user);
});

// Log API calls
// Edit src/services/apiClient.js and add console.logs
```

### Check Network Requests

1. Open DevTools (F12)
2. Go to Network tab
3. Filter by "Fetch/XHR"
4. Make an API call
5. Click the request to see:
   - Request headers (should have Authorization)
   - Response status
   - Response body

### Check Firebase Console Logs

1. Go to Firebase Console
2. Navigate to Authentication → Users
3. Verify users are being created
4. Check usage statistics

---

## 📋 Quick Checklist

When things aren't working:

- [ ] Backend server is running (`http://localhost:8080`)
- [ ] Frontend server is running (`http://localhost:1234`)
- [ ] `.env` file exists and has correct values
- [ ] No trailing spaces in `.env` file
- [ ] Firebase Authentication is enabled in console
- [ ] API key restrictions allow localhost
- [ ] CORS is configured in backend
- [ ] Firebase Admin SDK configured in backend
- [ ] At least one parking lot exists
- [ ] At least one floor with slots exists
- [ ] Browser cache cleared
- [ ] Dev server restarted after `.env` changes
- [ ] No console errors in browser
- [ ] Network tab shows successful API calls

---

## 💬 Getting Help

If issues persist:

1. **Check browser console** for error messages
2. **Check backend logs** for errors
3. **Verify Firebase Console** for auth/API issues
4. **Check Network tab** to see failed requests
5. **Review documentation:**
   - [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md)
   - [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)

---

## 🔧 Common Solutions Summary

| Problem | Quick Fix |
|---------|-----------|
| Firebase auth/invalid-api-key | Check Firebase Console → Project Settings → API Key |
| CORS error | Add localhost:1234 to backend CORS config |
| 401 Unauthorized | Login again, check token in Network tab |
| Module not found | `npm install [module-name]` |
| Port in use | `lsof -ti:1234 \| xargs kill -9` |
| .env not loading | Restart dev server |
| No slots available | Create parking lot and floors via backend API |

---

**Most issues can be resolved by:**
1. Checking the `.env` file
2. Restarting the dev server
3. Clearing browser cache
4. Verifying backend is running
