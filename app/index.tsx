/*
  Author: Alexangelo Orozco Gutierrez
  Last Modified By: Armando Vega
  Date Last Modified: 18 November 2025
  Summary: Main entry point for Umastagram application and login screen
*/
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { storage } from '../lib/storage';
// import * as Device from 'expo-device';

export default function Index() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [onModalClose, setOnModalClose] = useState<(() => void) | null>(null);

  const showAlert = (title: string, message: string, onOk?: () => void) => {
    setModalTitle(title);
    setModalMessage(message);
    setOnModalClose(() => onOk || null);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    if (onModalClose) {
      onModalClose();
    }
  };

  const getPlatform = () => {
    // Use Platform.OS for reliable cross-platform detection
    if (Platform.OS === 'web') return 'web';
    if (Platform.OS === 'ios') return 'ios';
    if (Platform.OS === 'android') return 'android';
    return 'android'; // fallback
  };

  const handleEnterApp = () => {
    router.replace('/tabs/posts');
  };

  const handleLogin = async () => {
    if(!username || !password) {
      showAlert('Error', 'Please enter both username and password');
      return;
    }

    try{
      const response = await fetch('https://beuma-64bbab9df83e.herokuapp.com/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if(!response.ok) {
        showAlert('Login Failed', data.error || 'Invalid username or password');
        return;
      }

      await storage.saveAuth(data.token, data.userId, data.username, data.email);
      showAlert('Success', data.message || 'Login successful', () => router.replace('/tabs/account'));
    } catch(error){
      console.error('Login error:', error);
      showAlert('Error', 'An error occurred during login. Please try again.');
    }

  };

  const navigateToSignup = () => {
    router.replace('/signup');
  };

  const handleGitHubLogin = () => {
    const platform = getPlatform();
    const githubAuthUrl = `https://beuma-64bbab9df83e.herokuapp.com/auth/github/${platform}`;

    if(platform === 'web') {
      window.location.href = githubAuthUrl;
    } else if(platform === 'ios' || platform === 'android') {
      // Dynamic import - only load expo-linking on mobile platforms
      import('expo-linking').then(({ openURL }) => {
        openURL(githubAuthUrl);
      }).catch((error) => {
        console.error('Failed to open URL:', error);
      });
    }
  };

  const handleGoogleLogin = () => {
    const platform = getPlatform();
    const googleAuthUrl = `https://beuma-64bbab9df83e.herokuapp.com/auth/google/${platform}`;
    if(platform === 'web') {
      window.location.href = googleAuthUrl;
    } else if(platform === 'ios' || platform === 'android') {
      // Dynamic import - only load expo-linking on mobile platforms
      import('expo-linking').then(({ openURL }) => {
        openURL(googleAuthUrl);
      }).catch((error) => {
        console.error('Failed to open URL:', error);
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Custom Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleModalClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <TouchableOpacity style={styles.modalButton} onPress={handleModalClose}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={styles.content}>
        <Text style={styles.title}>Umastagram</Text>
        <Text style={styles.subtitle}>Welcome to Umastagram!</Text>
        
        <TouchableOpacity style={styles.enterButton} onPress={handleEnterApp}>
          <Text style={styles.enterButtonText}>Enter App</Text>
        </TouchableOpacity>
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
        <TouchableOpacity style={styles.enterButton} onPress={handleLogin}>
          <Text style={styles.enterButtonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.enterButton} onPress={navigateToSignup}>
          <Text style={styles.enterButtonText}>Don't have an account? Signup!</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.enterButton} onPress={handleGitHubLogin}>
          <Text style={styles.enterButtonText}>Login with GitHub</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.enterButton} onPress={handleGoogleLogin}>
          <Text style={styles.enterButtonText}>Login with Google</Text>
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
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    minWidth: 280,
    maxWidth: 400,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.25)',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  modalButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
