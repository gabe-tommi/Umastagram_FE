import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function PostsPage() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Umastagram</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Welcome to Umastagram!</Text>
        <Text style={styles.subtitle}>Your feed will appear here</Text>
        
        {/* Placeholder for posts */}
        <View style={styles.postPlaceholder}>
          <Text style={styles.placeholderText}>No posts yet...</Text>
          <Text style={styles.placeholderSubtext}>Start following people to see their posts!</Text>
        </View>
      </View>
    </ScrollView>
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
  postPlaceholder: {
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