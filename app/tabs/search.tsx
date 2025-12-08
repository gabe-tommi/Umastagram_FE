import React, {JSX, useState} from 'react';
import {
    View,
    TextInput,
    FlatList,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    StyleSheet,
} from 'react-native';
import {router} from "expo-router";

export default function SearchPage(): JSX.Element {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<string[]>([]);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async () => {
        if (!query.trim()) return;
        setLoading(true);
        setHasSearched(true);
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

    function profileSelect(friendName: string): void {
        router.replace(`/profile?friendName=${friendName}`);
    }

    const renderItem = ({item}: { item: string }) => (
        <TouchableOpacity style={styles.resultCard} onPress={() => profileSelect(item)}>
            <View style={styles.avatarSmall}>
                <Text style={styles.avatarSmallText}>{item.charAt(0).toUpperCase()}</Text>
            </View>
            <Text style={styles.resultText}>{item}</Text>
            <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.push('/')}
            >
                <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>

            {/* Header */}
            <Text style={styles.header}>Search Users</Text>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <TextInput
                    placeholder="Search for users..."
                    value={query}
                    onChangeText={(text) => {
                        setQuery(text);
                        setHasSearched(false);
                    }}
                    style={styles.input}
                    returnKeyType="search"
                    onSubmitEditing={handleSearch}
                    placeholderTextColor="#999"
                />
                <TouchableOpacity
                    style={styles.searchButton}
                    onPress={handleSearch}
                    disabled={loading}
                >
                    <Text style={styles.searchButtonText}>
                        {loading ? '...' : 'Search'}
                    </Text>
                </TouchableOpacity>
            </View>

            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                    <Text style={styles.loadingText}>Searching for your buddies...</Text>
                </View>
            )}

            {!loading && !hasSearched && query.trim() !== '' && (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>Press enter to search</Text>
                    <Text style={styles.emptyStateSubtext}>or click the Search button</Text>
                </View>
            )}

            {!loading && hasSearched && results.length === 0 && query.trim() !== '' && (
                <View style={styles.emptyState}>
                    <Text style={styles.sadFace}>:(</Text>
                    <Text style={styles.emptyStateText}>No users found</Text>
                    <Text style={styles.emptyStateSubtext}>Try a different search term</Text>
                </View>
            )}

            {!loading && results.length === 0 && query.trim() === '' && !hasSearched && (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>Find Users</Text>
                    <Text style={styles.emptyStateSubtext}>Enter a username to start searching</Text>
                </View>
            )}

            <FlatList
                data={results}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F5F7FA',
    },
    backButton: {
        alignSelf: "flex-start",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: "#fff",
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    backButtonText: {
        fontSize: 16,
        color: "#007AFF",
        fontWeight: "600",
    },
    header: {
        fontSize: 32,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 20,
    },
    searchContainer: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    input: {
        flex: 1,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E8ECF2',
        padding: 14,
        borderRadius: 12,
        fontSize: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    searchButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        shadowColor: "#007AFF",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    searchButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    loadingContainer: {
        alignItems: 'center',
        marginVertical: 32,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 60,
    },
    sadFace: {
        fontSize: 64,
        color: '#999',
        marginBottom: 16,
    },
    emptyStateText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 8,
    },
    emptyStateSubtext: {
        fontSize: 16,
        color: '#666',
    },
    list: {
        paddingBottom: 32,
    },
    resultCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    avatarSmall: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarSmallText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
    },
    resultText: {
        flex: 1,
        color: '#1A1A1A',
        fontSize: 17,
        fontWeight: '500',
    },
    chevron: {
        fontSize: 24,
        color: '#C7C7CC',
        fontWeight: '300',
    },
});