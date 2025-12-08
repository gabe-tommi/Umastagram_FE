import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const bgImage = require('../../assets/images/umastagram_background.png');

interface Uma {
  id: number;
  umaId?: number;
  name: string;
  imagePath: string;
  umaName?: string;
  umaImageLink?: string;
  umaBirthday?: string;
  funFact?: string;
  umaIcon?: string;
  umaIconLink?: string;
  umaBio?: string;
}

export default function UmasScreen() {
  const router = useRouter();
  const [umas, setUmas] = useState<Uma[]>([]);
  const [query, setQuery] = useState('');
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
      onPress={() => handleUmaPress(item.id || item.umaId || 0)}
    >
      <Image
        source={{ uri: item.umaIcon || item.umaIconLink || item.imagePath }}
        style={styles.profileImage}
        resizeMode="cover"
      />
      <View style={styles.cardContent}>
        <Text style={styles.umaName}>{item.name || item.umaName || 'Unknown'}</Text>
        {item.umaBio && (
          <Text style={styles.umaBio} numberOfLines={2}>{item.umaBio}</Text>
        )}
      </View>
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
    <ImageBackground source={bgImage} style={styles.background} imageStyle={styles.bgImage} resizeMode="contain">
    <View style={styles.container}>
      <Text style={styles.title}>Uma Characters</Text>
      <View style={styles.searchContainer}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search by name..."
          placeholderTextColor="#999"
          style={styles.searchInput}
          clearButtonMode="never"
        />
        {query.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={() => setQuery('')}>
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={umas.filter(u => {
          if (!query) return true;
          const q = query.toLowerCase();
          return (
            (u.name && u.name.toLowerCase().includes(q)) ||
            (u.umaName && u.umaName.toLowerCase().includes(q))
          );
        })}
        renderItem={renderUmaItem}
        keyExtractor={(item) => String(item.id ?? item.umaId ?? item.name ?? item.umaName ?? '')}
        contentContainerStyle={styles.listContent}
        scrollEnabled={true}
      />
    </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#F3E9EC',
  },
  bgImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  container: {
    flex: 1,
    paddingTop: 16,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 16,
    marginBottom: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 8,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  umaCard: {
    flexDirection: 'row',
    borderRadius: 12,
    marginVertical: 8,
    overflow: 'hidden',
    elevation: 3,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    backgroundColor: '#e0e0e0',
    flexShrink: 0,
  },
  cardContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  umaImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#e0e0e0',
  },
  umaName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  umaBio: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#333',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    elevation: 1,
  },
  clearButton: {
    marginLeft: 8,
    backgroundColor: '#4FBF1D',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  clearButtonText: {
    color: '#fff',
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
