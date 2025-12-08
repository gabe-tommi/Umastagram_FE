import { ImageBackground, ScrollView, StyleSheet, Text, View } from "react-native";

const bgImage = require('../../assets/images/umastagram_background.png');

export default function DMsPage() {
  return (
    <ImageBackground source={bgImage} style={styles.background} imageStyle={styles.bgImage} resizeMode="cover">
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Your Messages</Text>
        <Text style={styles.subtitle}>Connect with friends and start conversations</Text>
        
        {/* Placeholder for messages */}
        <View style={styles.messagesPlaceholder}>
          <Text style={styles.placeholderText}>No messages yet...</Text>
          <Text style={styles.placeholderSubtext}>Start a conversation with someone!</Text>
        </View>
      </View>
    </ScrollView>
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
    resizeMode: 'contain',
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
  welcomeText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  messagesPlaceholder: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginTop: 20,
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});