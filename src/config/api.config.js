/**
 * API Configuration
 * Central configuration for all API endpoints and settings
 */

const API_CONFIG = {
  // Base URLs
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api',
  OCR_URL: process.env.REACT_APP_OCR_API_URL || 'https://amankumar00-smartParking.hf.space/ocr',

  // Environment
  ENV: process.env.REACT_APP_ENV || 'development',

  // Timeout settings (in milliseconds)
  TIMEOUT: 30000,

  // Endpoints
  ENDPOINTS: {
    // Authentication
    AUTH: {
      ME: '/auth/me',
      USER: '/auth/user',
      VERIFY_TOKEN: '/auth/verify-token',
    },

    // Parking
    PARKING: {
      ENTRY: '/parking/entry',
      EXIT: '/parking/exit',
      VEHICLE: '/parking/vehicle',
    },

    // Parking Lots
    PARKING_LOTS: {
      BASE: '/parking-lots',
      FLOORS: '/parking-lots/floors',
      FLOOR_BY_ID: '/parking-lots/floors',
      FLOORS_BY_LOT: '/parking-lots',
    },

    // Employees
    EMPLOYEES: {
      BASE: '/employees',
      BY_EMAIL: '/employees/email',
    },

    // Health
    HEALTH: {
      CHECK: '/health',
      WELCOME: '/',
    },
  },
};

export default API_CONFIG;
