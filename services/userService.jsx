import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getUserProfile = async () => {
    const router = useRouter();
    try {
      const accessToken = await AsyncStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
      console.log(accessToken);

      // if(!accessToken) {
      //   router.navigate('Login');
      // }
      const response = await fetch(`${API_URL}/user/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }
  
      return await response.json();
    } catch (error) {
      throw new Error('Failed to load user data');
    }
  };