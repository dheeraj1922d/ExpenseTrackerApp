import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { checkAuthStatus } from '../services/authService';
import { useRouter } from 'expo-router';

const AuthLoader = () => {
  const router = useRouter();
  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    const { isAuthenticated } = await checkAuthStatus();
    if(isAuthenticated){
      console.log("Redirected to Home");
    }
    router.navigate(isAuthenticated ? 'Home' : 'Login');
  };

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AuthLoader;