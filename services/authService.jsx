import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from 'react-native';

const API_URL = "http://Expens-KongA-mIxa7iWuih8L-2043788574.ap-south-1.elb.amazonaws.com/auth/v1";

const TOKEN_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
};

// Helper function to show alerts
const showAlert = (title, message) => {
  Alert.alert(title, message, [{ text: 'OK' }]);
};

// Helper function to handle API errors
const handleApiError = (error, customMessage) => {
  console.error(customMessage, error);
  const errorMessage = error?.message || 'An unexpected error occurred';
  showAlert('Error', errorMessage);
  return {
    success: false,
    message: errorMessage,
  };
};

export const checkAuthStatus = async () => {
  try {
    console.log("Checking authentication...");
    const accessToken = await AsyncStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
    if (!accessToken) {
      return { isAuthenticated: false, message: "Access token not found" };
    }
     
    console.log(accessToken)
    const response = await fetch(`${API_URL}/ping`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    console.log(response)

    if (response.ok) {
      return { isAuthenticated: true };
    }

    if (response.status === 401) {
      return await refreshTokens();
    }

    const errorData = await response.json();
    showAlert('Authentication Error', errorData.message || 'Failed to verify authentication');
    return { isAuthenticated: false, message: errorData.message };
  } catch (error) {
    return handleApiError(error, "Auth check failed:");
  }
};

export const refreshTokens = async () => {
  try {
    const refreshToken = await AsyncStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN);
    if (!refreshToken) {
      showAlert('Authentication Error', 'Refresh token not found');
      return { isAuthenticated: false, message: "Refresh token not found" };
    }

    const response = await fetch(`${API_URL}/refreshToken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await response.json();

    if (!response.ok) {
      await clearTokens();
      showAlert('Token Refresh Failed', data.message || 'Failed to refresh authentication');
      return {
        isAuthenticated: false,
        message: data.message || "Failed to refresh tokens",
      };
    }

    const { accessToken: newAccessToken, token: newRefreshToken } = data;

    if (!newAccessToken || !newRefreshToken) {
      throw new Error('Invalid token data received');
    }

    await AsyncStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, newAccessToken);
    await AsyncStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, newRefreshToken);

    return { isAuthenticated: true };
  } catch (error) {
    await clearTokens();
    return handleApiError(error, "Token refresh failed:");
  }
};

export const loginUser = async (credentials) => {
  try {
    if (!credentials.username || !credentials.password) {
      showAlert('Validation Error', 'Please provide both username and password');
      return { success: false, message: "Missing credentials" };
    }

    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (response.ok) {
      if (!data.accessToken || !data.refreshToken) {
        throw new Error('Invalid token data received from server');
      }

      await AsyncStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, data.accessToken);
      await AsyncStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, data.refreshToken);
      showAlert('Success', 'Login successful');
      return { success: true };
    }

    showAlert('Login Failed', data.message || 'Invalid credentials');
    return {
      success: false,
      message: data.message || "Login failed. Please check your credentials.",
    };
  } catch (error) {
    return handleApiError(error, "Login request failed:");
  }
};

export const clearTokens = async () => {
  try {
    await AsyncStorage.multiRemove([
      TOKEN_KEYS.ACCESS_TOKEN,
      TOKEN_KEYS.REFRESH_TOKEN,
    ]);
  } catch (error) {
    console.error("Error clearing tokens:", error);
  }
};

export const registerUser = async ({
  firstName,
  lastName,
  username,
  email,
  phoneNo,
  password,
}) => {
  try {
    // Input validation
    if (!firstName || !lastName || !username || !email || !phoneNo || !password) {
      showAlert('Validation Error', 'Please fill in all required fields');
      return { success: false, message: "All fields are required" };
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showAlert('Validation Error', 'Please enter a valid email address');
      return { success: false, message: "Invalid email format" };
    }

    const requestBody = {
      first_name: firstName,
      last_name: lastName,
      email,
      phone_no: phoneNo,
      password,
      username,
    };

    const response = await fetch(`${API_URL}/signup`, {
      method: "POST",
      headers: {
        'Accept': "application/json",
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (!response.ok) {
      showAlert('Registration Failed', data.message || 'Failed to register user');
      return {
        success: false,
        message: data.message || "Registration failed",
      };
    }

    if (!data.accessToken || !data.token) {
      throw new Error('Invalid registration response');
    }

    await AsyncStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, data.accessToken);
    await AsyncStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, data.token);

    showAlert('Success', 'Registration successful');
    return { success: true };
  } catch (error) {
    return handleApiError(error, "Error during registration:");
  }
};