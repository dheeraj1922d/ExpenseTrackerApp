import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL =
  "http://Expens-KongA-mIxa7iWuih8L-2043788574.ap-south-1.elb.amazonaws.com/expense/v1";

const TOKEN_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
};

// Helper function to show alerts
const showAlert = (title, message) => {
  Alert.alert(title, message, [{ text: "OK" }]);
};

// Helper function to handle API errors
const handleApiError = (error, customMessage) => {
  console.error(customMessage, error);
  const errorMessage = error?.message || "An unexpected error occurred";
  showAlert("Error", errorMessage);
  return {
    success: false,
    message: errorMessage,
  };
};

export const getExpenses = async () => {
  try {
    const accessToken = await AsyncStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
    if (!accessToken) {
      showAlert("Authentication Error", "Access token not found");
      return null;
    }

    const response = await fetch(`${API_URL}/getExpense`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch expenses");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return handleApiError(error, "Failed to fetch expenses");
  }
};

export const addExpense = async (expenseData) => {
  try {
    const accessToken = await AsyncStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
    if (!accessToken) {
      showAlert("Authentication Error", "Access token not found");
      return null;
    }

    const response = await fetch(`${API_URL}/addExpense`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(expenseData),
    });

    if (!response.ok) {
      throw new Error("Failed to add expense");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    handleApiError(error, "Failed to add expense");
  }
};
