/*
  Author: Alexangelo Orozco Gutierrez
*/
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const router = useRouter();

  const handleEnterApp = () => {
    router.replace('/tabs/posts');
  };

  const handleGitHubLogin = () => {
    const githubAuthUrl = 'https://beuma-64bbab9df83e.herokuapp.com/oauth2/authorization/github';
    router.replace(githubAuthUrl);
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
