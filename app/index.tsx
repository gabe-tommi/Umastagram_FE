/*
  Author: Alexangelo Orozco Gutierrez
  Last Modified By: Armando Vega
  Date Last Modified: 18 November 2025
  Summary: Main entry point for Umastagram application and login screen
*/
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Easing, Image, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { storage } from '../lib/storage';

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
  const router = useRouter();

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
          <Image source={require('../assets/images/uhd_logo.png')} style={styles.logo} />
          
          {/* <TouchableOpacity style={styles.enterButton} onPress={handleEnterApp}>
            <Text style={styles.enterButtonText}>Enter App</Text>
          </TouchableOpacity> */}
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

          <TouchableOpacity style={styles.socialButton} onPress={handleGitHubLogin}>
            <View style={styles.socialButtonContent}>
              <Image source={require('../assets/images/github-mark.png')} style={styles.socialIcon} />
              <Text style={styles.socialButtonText}>Login with GitHub</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin}>
            <View style={styles.socialButtonContent}>
              <Image source={require('../assets/images/g.webp=s96-fcrop64=1,00000000ffffffff-rw.webp')} style={styles.socialIcon} />
              <Text style={styles.socialButtonText}>Login with Google</Text>
            </View>
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
  fallingImageContainer: {
    position: 'absolute',
    top: -80,
    width: 60,
    height: 60,
    zIndex: 1,
  },
  fallingImageSize: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    zIndex: 10,
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
  logo: {
    flex: 1,
    width: '100%',
    maxHeight: 100,
    resizeMode: 'contain',
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
    backgroundColor: '#F7FFED',
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
    backgroundColor: '#4FBF1D',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#F7FFED',
    fontSize: 16,
    fontWeight: '600',
  },
  socialButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  socialIcon: {
    width: 20,
    height: 20,
  },
  socialButton: {
    height: 50,
    backgroundColor: '#ffffffff',
    borderWidth: 3,
    borderColor: '#9ADB58',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    maxWidth: 300,
  },
  socialButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
});
