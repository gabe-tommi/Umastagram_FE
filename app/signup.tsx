/*
  Author: Armando Vega
  Date Created: 18 November 2025
  Last Modified By: Armando Vega
  Date Last Modified: 18 November 2025
  Description: Signup screen for Umastagram application
*/
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

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
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [onModalClose, setOnModalClose] = useState<(() => void) | null>(null);

  // Custom alert function using Modal
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

  const handleSignup = async () => {
    console.log("Signup button pressed");
    
    // Basic validation
    if (!email || !username || !password) {
      showAlert('Error', 'Please fill in all fields');
      return;
    }
    
    try {
      const response = await fetch('https://beuma-64bbab9df83e.herokuapp.com/user/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        // Show error message from backend
        const errorMessage = data.error || 'Signup failed';
        showAlert('Signup Failed', errorMessage);
        return;
      }
      
      console.log('Signup success:', data);
      
      // Show success message and navigate to login
      showAlert(
        'Signup Successful!', 
        `Welcome, ${data.username}! You can now log in.`,
        () => router.replace('/')
      );
    } catch (error) {
      console.error('Signup error:', error);
      showAlert('Error', 'Network error. Please try again.');
    }
  };

  const navToLogin = () => {
    router.replace('/');
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
