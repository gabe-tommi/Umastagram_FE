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

type Result = {
    id: string;
    name?: string;
    loading?: boolean;
    error?: string;
};

export default function SearchTab(): JSX.Element {
    const [query, setQuery] = useState('');
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [results, setResults] = useState<Result[]>([]);
    const [loadingNames, setLoadingNames] = useState(false);

    // Call the search route to get a list of item ids (or similar)
    const handleSearch = async () => {
        if (!query.trim()) return;
        setLoadingSearch(true);
        setResults([]);
        try {
            // Example: GET /api/search?query=...
            const res = await fetch(`/api/search?query=${encodeURIComponent(query.trim())}`);
            if (!res.ok) throw new Error(`Search failed: ${res.status}`);
            const ids: string[] = await res.json();

            // Initialize results as ids (show loading while fetching names)
            const init = ids.map((id) => ({ id, loading: true }));
            setResults(init);

            // Fetch names for every id (replace endpoint as needed)
            setLoadingNames(true);
            const namePromises = ids.map(async (id) => {
                try {
                    const r = await fetch(`/api/name/${encodeURIComponent(id)}`);
                    if (!r.ok) throw new Error(`Name fetch failed for ${id}`);
                    const body = await r.json();
                    // assume body.name contains the display name
                    return { id, name: body.name ?? `Item ${id}` };
                } catch (e) {
                    return { id, name: undefined, error: String(e) };
                }
            });

            const named = await Promise.all(namePromises);
            setResults(named.map((n) => ({ id: n.id, name: n.name, error: (n as any).error })));
        } catch (err) {
            Alert.alert('Search error', String(err));
        } finally {
            setLoadingSearch(false);
            setLoadingNames(false);
        }
    };

    // When user presses a result, call a route (example POST /api/route/:id)
    const handlePressResult = async (id: string) => {
        try {
            const res = await fetch(`/api/route/${encodeURIComponent(id)}`, { method: 'POST' });
            if (!res.ok) throw new Error(`Route call failed: ${res.status}`);
            const data = await res.json();
            Alert.alert('Route called', JSON.stringify(data));
        } catch (e) {
            Alert.alert('Error', String(e));
        }
    };

    const renderItem = ({ item }: { item: Result }) => (
        <View style={styles.item}>
            <TouchableOpacity
                onPress={() => handlePressResult(item.id)}
                style={styles.itemButton}
                disabled={!item.name}
            >
                <Text style={styles.itemText}>{item.name ?? (item.error ? 'Error loading' : 'Loading...')}</Text>
            </TouchableOpacity>
        </View>
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
                <Button title={loadingSearch ? 'Searching...' : 'Search'} onPress={handleSearch} disabled={loadingSearch} />
            </View>

            {loadingNames && <ActivityIndicator style={{ marginVertical: 8 }} />}

            <FlatList
                data={results}
                keyExtractor={(it) => it.id}
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
    item: { marginBottom: 8 },
    itemButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 6,
    },
    itemText: { color: '#fff', fontSize: 16 },
});
