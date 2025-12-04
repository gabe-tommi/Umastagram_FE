import React, {JSX, useState} from 'react';
import {
    View,
    TextInput,
    Button,
    FlatList,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    StyleSheet,
} from 'react-native';

export default function SearchTab(): JSX.Element {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<string[]>([]);

    const handleSearch = async () => {
        if (!query.trim()) return;
        setLoading(true);
        setResults([]);
        try {
            const res = await fetch(`https://beuma-64bbab9df83e.herokuapp.com/user/userSearch/${encodeURIComponent(query.trim())}`);
            const data: string[] = await res.json();
            setResults(data);
        } catch (err) {
            Alert.alert('Search error', String(err));
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }: { item: string }) => (
      <TouchableOpacity style={styles.itemButton}>
          <Text style={styles.itemText}>{item}</Text>
      </TouchableOpacity>
    );

    return (
      <View style={styles.container}>
          <View style={styles.form}>
              <TextInput
                placeholder="Search..."
                value={query}
                onChangeText={setQuery}
                style={styles.input}
                returnKeyType="search"
                onSubmitEditing={handleSearch}
              />
              <Button title="Search" onPress={handleSearch} disabled={loading} />
          </View>

          {loading && <ActivityIndicator style={{ marginVertical: 8 }} />}

          <FlatList
            data={results}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            keyboardShouldPersistTaps="handled"
          />
      </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#fff' },
    form: { flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 12 },
    input: { flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 4 },
    list: { paddingBottom: 32 },
    itemButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 6,
        marginBottom: 8,
    },
    itemText: { color: '#fff', fontSize: 16 },
});