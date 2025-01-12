import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { registerUser } from '../services/authService';
import { validateSignupInputs } from '../utils/validation';
import { useRouter } from 'expo-router';

const SignupScreen = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phoneNo: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const validationError = validateSignupInputs(formData);
      if (validationError) {
        Alert.alert('Validation Error', validationError);
        return;
      }

      setLoading(true);
      console.log(formData)
      const response = await registerUser(formData);
      
      if (response.success) {
        Alert.alert(
          'Success',
          'Registration successful!',
          [
            {
              text: 'OK',
              onPress: () => router.navigate('Home'),
            },
          ]
        );
        router.navigate('Home');
      } else {
        Alert.alert('Error', response.message || 'Registration failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={SignupStyles.container}>
      <Text style={SignupStyles.title}>Create Account</Text>
      
      <TextInput
        style={SignupStyles.input}
        placeholder="First Name"
        value={formData.firstName}
        onChangeText={(text) => handleInputChange('firstName', text)}
        autoCapitalize="words"
      />

      <TextInput
        style={SignupStyles.input}
        placeholder="Last Name"
        value={formData.lastName}
        onChangeText={(text) => handleInputChange('lastName', text)}
        autoCapitalize="words"
      />

      <TextInput
        style={SignupStyles.input}
        placeholder="Username"
        value={formData.username}
        onChangeText={(text) => handleInputChange('username', text)}
        autoCapitalize="none"
      />
      
      <TextInput
        style={SignupStyles.input}
        placeholder="Email"
        value={formData.email}
        onChangeText={(text) => handleInputChange('email', text)}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={SignupStyles.input}
        placeholder="Phone Number"
        value={formData.phoneNo}
        onChangeText={(text) => handleInputChange('phoneNo', text)}
        keyboardType="phone-pad"
      />
      
      <TextInput
        style={SignupStyles.input}
        placeholder="Password"
        value={formData.password}
        onChangeText={(text) => handleInputChange('password', text)}
        secureTextEntry
      />
      
      <TextInput
        style={SignupStyles.input}
        placeholder="Confirm Password"
        value={formData.confirmPassword}
        onChangeText={(text) => handleInputChange('confirmPassword', text)}
        secureTextEntry
      />
      
      <TouchableOpacity
        style={SignupStyles.button}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={SignupStyles.buttonText}>
          {loading ? 'Creating Account...' : 'Sign Up'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={SignupStyles.loginButton}
        onPress={() => router.navigate('Login')}
      >
        <Text style={SignupStyles.loginText}>
          Already have an account? Login
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={SignupStyles.loginButton}
        onPress={() => router.navigate('Home')}
      >
        <Text style={SignupStyles.loginText}>
          Go back to home?
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignupScreen;

const SignupStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginText: {
    color: '#007AFF',
    fontSize: 16,
  },
});