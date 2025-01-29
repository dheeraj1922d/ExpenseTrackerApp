import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://Expens-KongA-mIxa7iWuih8L-2043788574.ap-south-1.elb.amazonaws.com/user/v1";

const TOKEN_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
};

export const getUserProfile = async (router) => {
  try {
    let accessToken;
    try {
      accessToken = await AsyncStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
    } catch (e) {
      console.log("Error retrieving access token: ", e);
    }

    if (!accessToken) {
      router.navigate("Login");
      return;
    }
    const response = await fetch(`${API_URL}/getUser`, {
      method: "GET",
      mode: "cors",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.log("Response status: ", response.status);
      console.log("Response body: ", await response.text());
      throw new Error("Failed to fetch user profile");
    }
    return await response.json();
  } catch (error) {
    console.log("error in home: ", error);
    throw new Error("Failed to load user data");
  }
};
