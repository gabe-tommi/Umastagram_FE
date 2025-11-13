/*
  Author: Alexangelo Orozco Gutierrez
*/
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as Device from 'expo-device';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

export default function Index() {
  const router = useRouter();
  const getPlatform = () => {
    switch(Device.osName) {
      case 'iOS': return 'ios';
      case 'Android': return 'android'; 
      case 'web': return 'web';
      default: return 'android'; // fallback
    }
  };

  const handleEnterApp = () => {
    router.replace('/tabs/posts');
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
      <View style={styles.content}>
        <Text style={styles.title}>Umastagram</Text>
        <Text style={styles.subtitle}>Welcome to Umastagram!</Text>
        
        <TouchableOpacity style={styles.enterButton} onPress={handleEnterApp}>
          <Text style={styles.enterButtonText}>Enter App</Text>
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
});
