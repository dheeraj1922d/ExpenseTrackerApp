import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://localhost:8080/auth/v1";

const TOKEN_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
};

export const checkAuthStatus = async () => {
  try {
    const accessToken = await AsyncStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
    console.log(accessToken)
    if (!accessToken) {
      return { isAuthenticated: false };
    }

    // Verify access token with backend
    const response = await fetch(`${API_URL}/ping`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    
    console.log(response);

    if (response.ok) {
      return { isAuthenticated: true };
    }

    // If access token is invalid, try refresh token
    return await refreshTokens();
  } catch (error) {
    console.error("Auth check failed:", error);
    return { isAuthenticated: false };
  }
};

export const refreshTokens = async () => {
  try {
    const refreshToken = await AsyncStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN);
    if (!refreshToken) {
      return { isAuthenticated: false };
    }

    const response = await fetch(`${API_URL}/refreshToken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      // Clear tokens if refresh fails
      await clearTokens();
      return { isAuthenticated: false };
    }

    const { accessToken: newAccessToken, token: newRefreshToken } =
      await response.json();

    // Store new tokens
    await AsyncStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, newAccessToken);
    await AsyncStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, newRefreshToken);

    return { isAuthenticated: true };
  } catch (error) {
    console.error("Token refresh failed:", error);
    await clearTokens();
    return { isAuthenticated: false };
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();
    console.log(data);

    if (response.ok) {
      // Store tokens
      await AsyncStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, data.accessToken);
      await AsyncStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, data.refreshToken);
      return { success: true };
    }

    return { success: false, message: data.message };
  } catch (error) {
    throw new Error("Login request failed");
  }
};

export const clearTokens = async () => {
  await AsyncStorage.multiRemove([
    TOKEN_KEYS.ACCESS_TOKEN,
    TOKEN_KEYS.REFRESH_TOKEN,
  ]);
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
    const requestBody = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone_no: phoneNo,
      password: password,
      username: username,
    };

    // Log the request body before sending the request
    console.log("Request Body:", JSON.stringify(requestBody, null, 2));

    const response = await fetch(`${API_URL}/signup`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: JSON.stringify(requestBody),
    });

    console.log("Response:", response);

    const data = await response.json();
    await AsyncStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, data["accessToken"]);
    await AsyncStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, data["token"]);
    return {
      success: response.ok,
    };
  } catch (error) {
    console.error("Error during registration:", error);
    throw new Error("Registration failed");
  }
};
