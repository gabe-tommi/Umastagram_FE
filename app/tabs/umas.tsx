import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useState } from "react"

export default function UmasPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const handleSearch = (query: string) => {
        setSearchQuery(query);
        console.log("Searching for:", query);
    }

    return (
        <View>
            <View style={styles.header}>
                <Text style={styles.title}>Umastagram</Text>
            </View>
            <TextInput 
                placeholder="Search for Umas..." 
                placeholderTextColor="rgba(0, 0, 0, 0.5)"
                style={{ height: 40, borderColor: 'gray', borderWidth: 1, margin: 16, paddingLeft: 8 }} 
                value={searchQuery}
                onChangeText={handleSearch}
            />
            <ScrollView style={styles.container}>
                <View style={styles.content}>
                    {/* Placeholder for posts */}
                    <View style={styles.postPlaceholder}>
                    <Text style={styles.placeholderText}>Looking for a particular Uma?</Text>
                    <Text style={styles.placeholderSubtext}>Search the database here!</Text>
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