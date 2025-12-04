import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

interface Uma {
  id: number;
  umaName: string;
  umaImageLink: string;
}

export default function UmasScreen() {
  const router = useRouter();
  const [umas, setUmas] = useState<Uma[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUmas();
  }, []);

  const fetchUmas = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://beuma-64bbab9df83e.herokuapp.com/api/uma');
      if (!response.ok) {
        throw new Error('Failed to fetch Umas');
      }
      const data = await response.json();
      setUmas(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching Umas:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUmaPress = (umaId: number) => {
    router.push({
      pathname: '/umaDetail',
      params: { id: umaId },
    });
  };

  const renderUmaItem = ({ item }: { item: Uma }) => (
    <TouchableOpacity
      style={styles.umaCard}
      onPress={() => handleUmaPress(item.id)}
    >
      <Image
        source={{ uri: item.umaImageLink }}
        style={styles.umaImage}
      />
      <Text style={styles.umaName}>{item.umaName}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4FBF1D" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchUmas}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Uma Characters</Text>
      <FlatList
        data={umas}
        renderItem={renderUmaItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 16,
    marginBottom: 16,
  },
  listContent: {
    paddingHorizontal: 8,
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  umaCard: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  umaImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#e0e0e0',
  },
  umaName: {
    padding: 12,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#4FBF1D',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignSelf: 'center',
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
