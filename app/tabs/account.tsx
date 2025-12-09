import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ImageBackground, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { storage } from '../../lib/storage';

const bgImage = require('../../assets/images/umastagram_background_2.png');

export default function AccountPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [usernameModalVisible, setUsernameModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
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

  const deleteAccount = () => {
    setDeleteModalVisible(true);
  };

  const performAccountDeletion = async () => {
    try {
      const response = await fetch('https://beuma-64bbab9df83e.herokuapp.com/user/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: (await storage.getAuth())?.token,
        }),
      });
      const data = await response.json();
      console.log('Response from account deletion:', data);
      if (response.ok) {
        console.log('Account deleted successfully');
        setDeleteModalVisible(false);
        await storage.clearAuth();
        router.replace('/');
      } else {
        setModalMessage(data.error || 'An error occurred while deleting the account.');
      }
    } catch (error) {
      setModalMessage('An error occurred while deleting the account.');
    }
  };
  
  const handleChangeUsername = () => {
    setModalMessage('');
    setModalUsername('');
    setUsernameModalVisible(true);
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
        
        // Update stored auth with new username
        const auth = await storage.getAuth();
        if (auth) {
          await storage.saveAuth(
            auth.token || '',
            auth.userId || 0,
            data.username,
            auth.email || ''
          );
        }
        
        setUsername(data.username); // Update display immediately
        setModalUsername('');
        setModalMessage('');
        setUsernameModalVisible(false);
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
    <ImageBackground source={bgImage} style={styles.background} imageStyle={styles.bgImage} resizeMode="cover">
    <View style={styles.container}>
      {/* Username Change Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={usernameModalVisible}
        onRequestClose={() => setUsernameModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1}
          onPress={() => setUsernameModalVisible(false)}
        >
          <TouchableOpacity 
            style={styles.modalContent}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.modalTitle}>Change Username</Text>
            {modalMessage ? (
              <Text style={styles.modalMessage}>{modalMessage}</Text>
            ) : (
              <Text style={styles.modalMessage}>Enter your new username below:</Text>
            )}
            <TextInput
              style={styles.input}
              value={modalUsername}
              onChangeText={setModalUsername}
              placeholder="Enter your username"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonCancel]} 
                onPress={() => {
                  setUsernameModalVisible(false);
                  setModalMessage('');
                  setModalUsername('');
                }}
              >
                <Text style={styles.modalButtonTextCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={handleModalClose}>
                <Text style={styles.modalButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Account Deletion Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1}
          onPress={() => setDeleteModalVisible(false)}
        >
          <TouchableOpacity 
            style={styles.modalContent}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.modalTitle}>Confirm Deletion</Text>
            {modalMessage ? (
              <Text style={styles.modalMessage}>{modalMessage}</Text>
            ) : (
              <Text style={styles.modalMessage}>Are you sure you want to delete your account? This action cannot be undone.</Text>
            )}
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonCancel]} 
                onPress={() => {
                  setDeleteModalVisible(false);
                  setModalMessage('');
                }}
              >
                <Text style={styles.modalButtonTextCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonDanger]} 
                onPress={performAccountDeletion}
              >
                <Text style={styles.modalButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
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
            <TouchableOpacity style={styles.settingItem} onPress={deleteAccount}>
              <Ionicons name="trash-outline" size={24} />
              <Text style={[styles.settingText, { color: '#ff4444' }]}>Delete Account</Text>
              <Ionicons name="chevron-forward" size={20}/>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#F3E9EC',
    width: '100%',
    height: '100%',
  },
  bgImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'repeat',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
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
    flex: 1,
  },
  modalButtonCancel: {
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  modalButtonDanger: {
    backgroundColor: '#ff4444',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalButtonTextCancel: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  input: { // taken from react native docs
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});