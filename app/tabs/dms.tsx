import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useState, useEffect } from 'react';
import { storage } from '../../lib/storage';

export default function DMsPage() {

  const [username, setUsername] = useState('');
  const [results, setResults] = useState<string[]>([]);

  useEffect(() => {
    loadUserData();
  }, []);


  const loadUserData = async () => {
    const auth = await storage.getAuth();
    if (auth?.username) {
      setUsername(auth.username);
    }
    getUserFollowers(auth?.username || '');
  };

  const getUserFollowers = async (username: string) => {
    try {
      // First, get current user's Id
      const currentUserRes = await fetch(
          `https://beuma-64bbab9df83e.herokuapp.com/user/getUserByUsername/${encodeURIComponent(
              username.trim()
          )}`
      );
      const currentUserData = await currentUserRes.json();
      console.log("Current user data received:", currentUserData);
      const userId = currentUserData[0];

      const res = await fetch(`https://beuma-64bbab9df83e.herokuapp.com/api/friends/getUserFollowers/${encodeURIComponent(userId.trim())}`);
      const data: string[] = await res.json();
      console.log("Followers data received:", data);
      setResults(data);
    } catch (err) {
      console.error('getUserFollowersError', String(err));
    }
  }

  return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Friends</Text>
        </View>
        <View style={styles.content}>
          {results.length > 0 ? (
              results.map((friendUsername, index) => (
                  <TouchableOpacity
                      key={index}
                      style={styles.friendButton}
                      onPress={() => {}}
                  >
                    <Text style={styles.friendButtonText}>{friendUsername}</Text>
                  </TouchableOpacity>
              ))
          ) : (
              <View style={styles.messagesPlaceholder}>
                <Text style={styles.placeholderText}>No friends yet...</Text>
                <Text style={styles.placeholderSubtext}>Start following people to see them here!</Text>
              </View>
          )}
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
  friendButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  friendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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