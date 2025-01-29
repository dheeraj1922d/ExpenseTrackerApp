import React, { useEffect ,useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import HomeTabs from "./HomeTabs";
import Login from "./Login";
import SignupScreen from "./SignupScreen";
import { checkAuthStatus } from "../services/authService";
import { useRouter } from "expo-router";

const Stack = createStackNavigator();

const index = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkAuthentication = async () => {
      try {
        const { isAuthenticated } = await checkAuthStatus();
        if (isMounted) {
          console.log(isAuthenticated);
          setIsAuthenticated(isAuthenticated);
        }
      } catch (error) {
        console.error("Error checking authentication status:", error);
      }finally{
        setIsLoading(false);
      }
    };

    checkAuthentication();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }


  return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="HomeTabs" component={HomeTabs} />
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="SignupScreen" component={SignupScreen} />
          </>
        )}
      </Stack.Navigator>
    // </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default index;
