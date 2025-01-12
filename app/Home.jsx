import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { clearTokens } from '../services/authService';
import { getUserProfile } from '../services/userService';
import { useRouter } from 'expo-router';

const HomeScreen = ({ navigation }) => {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const data = await getUserProfile();
      setUserData(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load user data');
      router.navigate('Login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await clearTokens();
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Error', 'Logout failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <View style={HomeStyles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={HomeStyles.container}>
      <View style={HomeStyles.header}>
        <Text style={HomeStyles.welcomeText}>
          Welcome, {userData?.username || 'User'}!
        </Text>
        <TouchableOpacity
          style={HomeStyles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={HomeStyles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={HomeStyles.content}>
        {/* Add your home screen content here */}
        <Text style={HomeStyles.contentText}>
          Your home screen content goes here
        </Text>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;


const HomeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  logoutButton: {
    padding: 10,
    backgroundColor: '#ff4444',
    borderRadius: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
  },
});




