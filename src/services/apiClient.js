import API_CONFIG from '../config/api.config';
import { auth } from '../config/firebase.config';

class ApiResponse {
  constructor(success, data, message, error) {
    this.success = success;
    this.data = data;
    this.message = message;
    this.error = error;
  }
}

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


class ApiClient {
  constructor(baseURL = API_CONFIG.BASE_URL) {
    this.baseURL = baseURL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

 
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

  
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = await this.buildHeaders(options.headers);

    const config = {
      method: options.method || 'GET',
      headers,
      ...options,
    };

    
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
        let errorMessage = data?.message || data || `HTTP ${response.status}: ${response.statusText}`;
        if (typeof errorMessage === 'string') {
          if (errorMessage.includes('Unique index or primary key violation') ||
              errorMessage.includes('VEHICLE_REGISTRATION')) {
            errorMessage = 'This vehicle is already parked. Please use a different registration number or exit the existing vehicle first.';
          }
          else if (errorMessage.includes('No available slot')) {
            errorMessage = 'No parking slots available for this vehicle type. Please try again later.';
          }
          else if (errorMessage.length > 200) {
            const firstLine = errorMessage.split('\n')[0];
            errorMessage = firstLine.length > 200 ? firstLine.substring(0, 200) + '...' : firstLine;
          }
        }

        console.warn(`API Error [${config.method} ${endpoint}]:`, errorMessage);
        return new ApiResponse(false, null, errorMessage, new Error(errorMessage));
      }

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

const apiClient = new ApiClient();

export default apiClient;
export { ApiResponse };
