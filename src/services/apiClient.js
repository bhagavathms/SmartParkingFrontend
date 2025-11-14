/**
 * API Client
 * Centralized HTTP client with automatic token injection and error handling
 */

import API_CONFIG from '../config/api.config';
import { auth } from '../config/firebase.config';

/**
 * API Response wrapper
 */
class ApiResponse {
  constructor(success, data, message, error) {
    this.success = success;
    this.data = data;
    this.message = message;
    this.error = error;
  }
}

/**
 * Get current user's Firebase ID token
 */
const getAuthToken = async () => {
  try {
    if (auth?.currentUser) {
      const token = await auth.currentUser.getIdToken();
      return token;
    }
    return null;
  } catch (error) {
    console.warn('Error getting auth token:', error.message);
    return null;
  }
};

/**
 * Main API Client class
 */
class ApiClient {
  constructor(baseURL = API_CONFIG.BASE_URL) {
    this.baseURL = baseURL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  /**
   * Build request headers with authentication token
   */
  async buildHeaders(customHeaders = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };

    const token = await getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Generic request handler
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = await this.buildHeaders(options.headers);

    const config = {
      method: options.method || 'GET',
      headers,
      ...options,
    };

    // Add body if present and not GET request
    if (options.body && config.method !== 'GET') {
      config.body = JSON.stringify(options.body);
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const contentType = response.headers.get('content-type');
      let data;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        // Extract user-friendly error message
        let errorMessage = data?.message || data || `HTTP ${response.status}: ${response.statusText}`;

        // Handle long backend error messages - extract key info
        if (typeof errorMessage === 'string') {
          // Check for unique constraint violation (duplicate vehicle)
          if (errorMessage.includes('Unique index or primary key violation') ||
              errorMessage.includes('VEHICLE_REGISTRATION')) {
            errorMessage = 'This vehicle is already parked. Please use a different registration number or exit the existing vehicle first.';
          }
          // Check for "No available slot" error
          else if (errorMessage.includes('No available slot')) {
            errorMessage = 'No parking slots available for this vehicle type. Please try again later.';
          }
          // Truncate very long error messages
          else if (errorMessage.length > 200) {
            // Try to extract the first sentence or main error
            const firstLine = errorMessage.split('\n')[0];
            errorMessage = firstLine.length > 200 ? firstLine.substring(0, 200) + '...' : firstLine;
          }
        }

        // Log error details for debugging (won't trigger error overlay)
        console.warn(`API Error [${config.method} ${endpoint}]:`, errorMessage);
        return new ApiResponse(false, null, errorMessage, new Error(errorMessage));
      }

      // Handle backend's ApiResponse<T> format
      if (data && typeof data === 'object' && 'success' in data) {
        return new ApiResponse(data.success, data.data, data.message, null);
      }

      return new ApiResponse(true, data, 'Success', null);
    } catch (error) {
      if (error.name === 'AbortError') {
        console.warn(`API Timeout [${config.method} ${endpoint}]`);
        return new ApiResponse(false, null, 'Request timeout - please try again', error);
      }

      console.warn(`API Error [${config.method} ${endpoint}]:`, error.message);
      return new ApiResponse(false, null, error.message || 'An unexpected error occurred', error);
    }
  }

  /**
   * HTTP Methods
   */
  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  async post(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', body });
  }

  async put(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PUT', body });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }

  async patch(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PATCH', body });
  }
}

// Export singleton instance
const apiClient = new ApiClient();

export default apiClient;
export { ApiResponse };
