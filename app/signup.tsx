/*
  Author: Armando Vega
  Date Created: 18 November 2025
  Last Modified By: Armando Vega
  Date Last Modified: 18 November 2025
  Description: Signup screen for Umastagram application
*/
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Index() {
  const router = useRouter();

  const handleSignup = () => {
    console.log("Signup button pressed");
    // router.replace('/tabs/posts');
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
        />
        <TextInput 
            placeholder="Username"
            style={styles.input}
        />
        <TextInput 
            placeholder="Password"
            style={styles.input}
            secureTextEntry={true}
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
