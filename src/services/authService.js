import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '../config/firebase.config';
import apiClient from './apiClient';
import API_CONFIG from '../config/api.config';

const authService = {
  async register(email, password, displayName) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName) {
        await updateProfile(userCredential.user, { displayName });
      }

      return {
        success: true,
        user: userCredential.user,
        message: 'Registration successful',
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        user: null,
        message: this.getErrorMessage(error.code),
        error,
      };
    }
  },

  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return {
        success: true,
        user: userCredential.user,
        message: 'Login successful',
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        user: null,
        message: this.getErrorMessage(error.code),
        error,
      };
    }
  },

  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      return {
        success: true,
        user: userCredential.user,
        message: 'Google login successful',
      };
    } catch (error) {
      console.error('Google login error:', error);
      return {
        success: false,
        user: null,
        message: this.getErrorMessage(error.code),
        error,
      };
    }
  },

  async logout() {
    try {
      await signOut(auth);
      return {
        success: true,
        message: 'Logout successful',
      };
    } catch (error) {
      console.error('Logout error:', error);
      return {
        success: false,
        message: 'Logout failed',
        error,
      };
    }
  },

  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return {
        success: true,
        message: 'Password reset email sent',
      };
    } catch (error) {
      console.error('Password reset error:', error);
      return {
        success: false,
        message: this.getErrorMessage(error.code),
        error,
      };
    }
  },

  async getCurrentUser() {
    try {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.AUTH.ME);
      return response;
    } catch (error) {
      console.error('Get current user error:', error);
      return {
        success: false,
        data: null,
        message: 'Failed to fetch user info',
        error,
      };
    }
  },

  async getUserByUid(uid) {
    try {
      const response = await apiClient.get(`${API_CONFIG.ENDPOINTS.AUTH.USER}/${uid}`);
      return response;
    } catch (error) {
      console.error('Get user by UID error:', error);
      return {
        success: false,
        data: null,
        message: 'Failed to fetch user',
        error,
      };
    }
  },

  async verifyToken() {
    try {
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.VERIFY_TOKEN);
      return response;
    } catch (error) {
      console.error('Token verification error:', error);
      return {
        success: false,
        data: null,
        message: 'Token verification failed',
        error,
      };
    }
  },

 
  getCurrentFirebaseUser() {
    return auth.currentUser;
  },

  
  async getIdToken() {
    try {
      if (auth.currentUser) {
        return await auth.currentUser.getIdToken();
      }
      return null;
    } catch (error) {
      console.error('Get ID token error:', error);
      return null;
    }
  },

 
  getErrorMessage(errorCode) {
    const errorMessages = {
      'auth/invalid-email': 'Invalid email address',
      'auth/user-disabled': 'This account has been disabled',
      'auth/user-not-found': 'No account found with this email',
      'auth/wrong-password': 'Incorrect password',
      'auth/email-already-in-use': 'Email already in use',
      'auth/weak-password': 'Password should be at least 6 characters',
      'auth/network-request-failed': 'Network error. Please check your connection',
      'auth/too-many-requests': 'Too many attempts. Please try again later',
      'auth/operation-not-allowed': 'Operation not allowed',
      'auth/popup-closed-by-user': 'Sign-in popup closed',
    };

    return errorMessages[errorCode] || 'An error occurred. Please try again';
  },
};

export default authService;
