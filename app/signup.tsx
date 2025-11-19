/*
  Author: Armando Vega
  Date Created: 18 November 2025
  Last Modified By: Armando Vega
  Date Last Modified: 18 November 2025
  Description: Signup screen for Umastagram application
*/
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Index() {
  
  interface SignupRequest{
    username: string;
    email: string;
    password: string;
  }

  interface SignupResponse{
    userId: number;
    username: string;
    email: string;
  }

  const router = useRouter();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    console.log("Signup button pressed");
    
    try {
      const response = await fetch('https://beuma-64bbab9df83e.herokuapp.com/user/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      
      if (!response.ok) {
        throw new Error('Signup failed');
      }
      
      const data: SignupResponse = await response.json();
      console.log('Signup success:', data);
      
      // Navigate to main app or login
      router.replace('/tabs/posts');
    } catch (error) {
      console.error('Signup error:', error);
      // Show error to user
    }
  };

  const navToLogin = () => {
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Umastagram</Text>
        <Text style={styles.subtitle}>Welcome to Umastagram!</Text>
        
        <TextInput 
            placeholder="Email"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
        />
        <TextInput 
            placeholder="Username"
            style={styles.input}
            value={username}
            onChangeText={setUsername}
        />
        <TextInput 
            placeholder="Password"
            style={styles.input}
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.enterButton} onPress={handleSignup}>
          <Text style={styles.enterButtonText}>Signup</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.enterButton} onPress={navToLogin}>
          <Text style={styles.enterButtonText}>Back to login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 48,
  },
  enterButton: {
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  enterButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  input: { // taken from react native docs
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
