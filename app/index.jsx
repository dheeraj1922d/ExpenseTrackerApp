import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { checkAuthStatus } from '../services/authService';
import { useRouter } from 'expo-router';

const AuthLoader = () => {
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const checkAuthentication = async () => {
      try {
        const { isAuthenticated } = await checkAuthStatus();
        if (isMounted) {
          console.log(isAuthenticated);
          router.replace(isAuthenticated ? 'Home' : 'Login');
        }
      } catch (error) {
        if (isMounted) {
          console.error('Authentication check failed:', error);
          router.replace('Login');
        }
      }
    };

    checkAuthentication();

    return () => {
      isMounted = false;
    };
  }, [router]);

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