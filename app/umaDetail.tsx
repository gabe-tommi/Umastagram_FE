import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface UmaDetail {
  umaId: number;
  umaName: string;
  umaImageLink: string;
  umaIconLink?: string;
  umaBirthday?: string;
  umaBirthDate?: string;
  funFact?: string;
  umaBio?: string;
  umaHeight?: string;
  umaWeight?: string;
  umaAbility?: string;
  umaDescription?: string;
  [key: string]: any;
}

export default function UmaDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [uma, setUma] = useState<UmaDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchUmaDetail(id as string);
    }
  }, [id]);

  const fetchUmaDetail = async (umaId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`https://beuma-64bbab9df83e.herokuapp.com/api/uma/${umaId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch Uma details');
      }
      const data = await response.json();
      setUma(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching Uma detail:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4FBF1D" />
      </View>
    );
  }

  if (error || !uma) {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.errorText}>Error: {error || 'Uma not found'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => fetchUmaDetail(id as string)}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="chevron-back" size={28} color="#333" />
      </TouchableOpacity>

      <Image
        source={{ uri: uma.umaImageLink }}
        style={styles.heroImage}
        resizeMode="contain"
      />

      <View style={styles.content}>
        <View style={styles.profileSection}>
          {uma.umaIconLink && (
            <Image
              source={{ uri: uma.umaIconLink }}
              style={styles.profileIcon}
              resizeMode="contain"
            />
          )}
          <Text style={styles.name}>{uma.umaName}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Information</Text>
          
          {(uma.umaBirthday || uma.umaBirthDate) && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Birth Date:</Text>
              <Text style={styles.value}>{uma.umaBirthday || uma.umaBirthDate}</Text>
            </View>
          )}

          {uma.funFact && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Fun Fact:</Text>
              <Text style={styles.value}>{uma.funFact}</Text>
            </View>
          )}

          {uma.umaHeight && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Height:</Text>
              <Text style={styles.value}>{uma.umaHeight}</Text>
            </View>
          )}

          {uma.umaWeight && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Weight:</Text>
              <Text style={styles.value}>{uma.umaWeight}</Text>
            </View>
          )}

          {uma.umaAbility && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Ability:</Text>
              <Text style={styles.value}>{uma.umaAbility}</Text>
            </View>
          )}
        </View>

        {(uma.umaBio || uma.umaDescription) && (
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Bio</Text>
            <Text style={styles.description}>{uma.umaBio || uma.umaDescription}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  heroImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#e0e0e0',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileIcon: {
    width: 100,
    height: 100,
    marginBottom: 12,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  infoSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  value: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  descriptionSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: '#555',
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    marginVertical: 20,
  },
  retryButton: {
    backgroundColor: '#4FBF1D',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 20,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
