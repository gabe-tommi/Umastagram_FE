import { Ionicons } from '@expo/vector-icons';
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { storage } from '../../lib/storage';

export default function AccountPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('Set Your Username!');
  const [modalMessage, setModalMessage] = useState('');
  const [onModalClose, setOnModalClose] = useState<(() => void) | null>(null);
  const [modalUsername, setModalUsername] = useState('');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const auth = await storage.getAuth();
    if (auth?.username) {
      setUsername(auth.username);
    }
  };

  const showAlert = (title: string, message: string, onOk?: () => void) => {
    setModalTitle(title);
    setModalMessage(message);
    setOnModalClose(() => onOk || null);
    setModalVisible(true);
  };
  
  const handleChangeUsername = () => {
    showAlert('Change Username', 'Enter your new username below:', () => {
      setModalVisible(false);
    });
  };

  const handleModalClose = async () => {
    if (!modalUsername.trim()) {
      setModalMessage('Username cannot be empty. Please enter a valid username.');
      return;
    }
    try{
      const response = await fetch('https://beuma-64bbab9df83e.herokuapp.com/user/username/change', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: (await storage.getAuth())?.token,
          newUsername: modalUsername.trim(),
        }),
      });
      const data = await response.json();
      console.log('Response from username change:', data);
      if (response.ok) {
        console.log('Username changed successfully');
        showAlert('Success', 'Username changed!', () => console.log('User clicked OK'));  
        await storage.setItem('auth', JSON.stringify({ username : data.username.trim() }));
        loadUserData();
        setModalVisible(false);
        if (onModalClose) {
          onModalClose();
        }
      } else {
        setModalMessage(data.error || 'An error occurred while changing username.');
      }
    } catch (error) {
      setModalMessage('An error occurred while changing username.');
    }
  };

  const handleLogout = async () => {
    await storage.clearAuth();
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      {/* Custom Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <TouchableOpacity 
            style={styles.modalContent}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <TextInput
              style={styles.input}
              value={modalUsername}
              onChangeText={setModalUsername}
              placeholder="Enter your username"
            />
            <TouchableOpacity style={styles.modalButton} onPress={handleModalClose}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Account</Text>
        </View>
        
        <View style={styles.content}>
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={40} color="#666" />
            </View>
            <Text style={styles.username}>{username}</Text>
          </View>

          {/* Settings Section */}
          <View style={styles.settingsSection}>
            <TouchableOpacity style={styles.settingItem} onPress={handleChangeUsername}>
              <Ionicons name="create-outline" size={24} />
              <Text style={[styles.settingText, { color: '#2d87ecff' }]}>Change Username</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={24} />
              <Text style={[styles.settingText, { color: '#ff4444' }]}>Sign Out</Text>
              <Ionicons name="chevron-forward" size={20}/>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  username: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  bio: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 32,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  settingsSection: {
    gap: 1,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 8,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 16,
    color: '#333',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
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
  input: { // taken from react native docs
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});