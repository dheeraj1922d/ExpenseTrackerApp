import React, { useState , useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { loginUser } from '../services/authService';
import { validateLoginInputs } from '../utils/validation';
import { useRouter } from 'expo-router';
import AuthLoader from '.';
 

const Login = () => {
  const router = useRouter();

  
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setCredentials(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const validationError = validateLoginInputs(credentials);
      if (validationError) {
        Alert.alert('Validation Error', validationError);
        return;
      }

      setLoading(true);
      const response = await loginUser(credentials);
      console.log(response);
      if (response.success) {
        router.navigate('Home');
      } else {
        Alert.alert('Error', response.message || 'Login failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };
 return (
    <View style={LoginStyles.container}>
      <Text style={LoginStyles.title}>Login</Text>
      
      <TextInput
        style={LoginStyles.input}
        placeholder="Username"
        value={credentials.username}
        onChangeText={(text) => handleInputChange('username', text)}
        autoCapitalize="none"
      />
      
      <TextInput
        style={LoginStyles.input}
        placeholder="Password"
        value={credentials.password}
        onChangeText={(text) => handleInputChange('password', text)}
        secureTextEntry
      />
      
      <TouchableOpacity 
        style={LoginStyles.button}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={LoginStyles.buttonText}>
          {loading ? 'Loading...' : 'Login'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={LoginStyles.signupButton}
        onPress={() => router.navigate('SignupScreen')}
      >
        <Text style={LoginStyles.signupText}>
          Don't have an account? Sign up
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={LoginStyles.signupButton}
        onPress={() => router.navigate('Home')}
      >
        <Text style={LoginStyles.signupText}>
          Go back to Home ?
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;
const LoginStyles = StyleSheet.create({
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
  signupButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  signupText: {
    color: '#007AFF',
    fontSize: 16,
  },
});