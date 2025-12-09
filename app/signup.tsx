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
import { Animated, Easing, Dimensions, Image } from 'react-native';
import { useRef, useEffect } from 'react';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const FallingImage = ({ imageSource, duration, delay, randomX, randomDelay, isClockwise }: { imageSource: any; duration: number; delay: number; randomX: number; randomDelay: number; isClockwise: boolean }) => {
  const translateY = useRef(new Animated.Value(-80)).current;
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimation = (isFirstRun = true) => {
      translateY.setValue(-80);
      rotation.setValue(0);

      Animated.sequence([
        Animated.delay(isFirstRun ? delay : 0),
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: screenHeight + 100,
            duration: duration,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(rotation, {
            toValue: isClockwise ? -1 : 1,
            duration: duration,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        startAnimation(false);
      });
    };

    startAnimation(true);
  }, []);

  const rotateInterpolate = rotation.interpolate({
    inputRange: isClockwise ? [-1, 0] : [0, 1],
    outputRange: isClockwise ? ['-360deg', '0deg'] : ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        styles.fallingImageContainer,
        {
          left: randomX,
          transform: [
            { translateY },
            { rotate: rotateInterpolate },
          ],
        },
      ]}
    >
      <Image source={imageSource} style={styles.fallingImageSize} />
    </Animated.View>
  );
};

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
  const [fallingImages, setFallingImages] = useState<Array<{ id: number; randomX: number; duration: number; delay: number; shoeImage: any; isClockwise: boolean }>>([]);


  useEffect(() => {
      // Generate falling images with random shoe colors - snowfall effect
      const shoeImages = [
        require('../assets/images/PINK_HORS_FINAL.png'),
        require('../assets/images/GREEN_HORSE_FINAL.png'),
        require('../assets/images/ORANGE_HORSE_FINAL.png'),
        require('../assets/images/PURPLE_HORSE_FINAL.png'),
      ];
  
      const images = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        randomX: Math.random() * (screenWidth - 60),
        duration: 10000 + Math.random() * 5000, // Slower: 10-15 seconds
        delay: i * 200, // Spaced out for flow
        shoeImage: shoeImages[Math.floor(Math.random() * shoeImages.length)],
        isClockwise: Math.random() > 0.5, // Random direction
      }));
      setFallingImages(images);
    }, []);

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
      {/* Falling Shoes */}
      {fallingImages.map((img) => (
        <FallingImage
          key={img.id}
          imageSource={img.shoeImage}
          duration={img.duration}
          delay={img.delay}
          randomX={img.randomX}
          randomDelay={Math.random() * 1000}
          isClockwise={img.isClockwise}
        />
      ))}
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
        <View style={styles.innerContainer}>
          <Image source={require('../assets/images/Signup_Uma.png')} style={styles.logo} />
          
            
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3E9EC',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    zIndex: 1,
  },
  fallingImageContainer: {
    position: 'absolute',
    top: -80,
    width: 60,
    height: 60,
  },
  fallingImageSize: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  logo: {
    // flex: 1,
    width: '100%',
    maxHeight: 80,
    resizeMode: 'contain',
  },
  innerContainer: {
    width: '100%',
    gap: 16,
    backgroundColor: '#f9d0de',
    padding: 32,
    borderRadius: 12,
    maxWidth: 650,
    alignItems: 'center'
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
    backgroundColor: '#9ADB58',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  enterButtonText: {
    color: '#F7FFED',
    fontSize: 16,
    fontWeight: '600',
  },
  input: { // taken from react native docs
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    backgroundColor: '#faf6f7',
    color: '#603745',
    borderColor: '#603745'
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
