// screens/ProfileScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, Alert, StyleSheet } from 'react-native';
import { getUserProfile } from '../services/userService';
import { useRouter } from 'expo-router';

const Profile = () => {
    const router = useRouter();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user details from your backend API
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const data = await getUserProfile(router);
  
      console.log("user profile :  " , data);
      if(data?.status === 'failed') return Alert.alert("Error", data?.message);
      setUserDetails(data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: userDetails?.profile_photo }} style={styles.profileImage} />
      <Text style={styles.detailText}>First Name: {userDetails?.first_name}</Text>
      <Text style={styles.detailText}>Last Name: {userDetails?.last_mame}</Text>
      <Text style={styles.detailText}>Email: {userDetails?.email}</Text>
      <Text style={styles.detailText}>Phone: {userDetails?.phone_no}</Text>
      <Button title="Delete Account" color="red" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  detailText: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default Profile;
