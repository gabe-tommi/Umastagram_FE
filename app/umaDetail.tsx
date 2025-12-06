import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Easing, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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

interface HorseDetail {
  horseId: number;
  horseImageLink: string;
  horseBirthday?: string;
  horseDeathday?: string;
  horseBio?: string;
  horseDescription?: string;
  horseName?: string;
  bio?: string;
  description?: string;
  [key: string]: any;
}

export default function UmaDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [uma, setUma] = useState<UmaDetail | null>(null);
  const [horse, setHorse] = useState<HorseDetail | null>(null);
  const [viewMode, setViewMode] = useState<'game' | 'real'>('game');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const heroFade = useRef(new Animated.Value(1)).current;
  const iconFade = useRef(new Animated.Value(1)).current;
  const [currentHero, setCurrentHero] = useState<string | undefined>(undefined);
  const [currentIcon, setCurrentIcon] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (id) {
      fetchUmaDetail(id as string);
      fetchHorseDetail(id as string);
    }
  }, [id]);

  useEffect(() => {
    // initialize current sources after uma/horse load
    if (uma) {
      const heroImg = viewMode === 'game' ? uma.umaImageLink : (horse?.horseImageLink || uma.imagePath || uma.umaImageLink);
      const iconImg = viewMode === 'game' ? uma.umaIconLink : undefined;
      setCurrentHero(heroImg);
      setCurrentIcon(iconImg);
      heroFade.setValue(1);
      iconFade.setValue(1);
    }
  }, [uma, horse]);

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

  const fetchHorseDetail = async (umaId: string) => {
    try {
      const response = await fetch(`https://beuma-64bbab9df83e.herokuapp.com/api/horse/${umaId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch Horse details');
      }
      const data = await response.json();
      setHorse(data);
    } catch (err) {
      console.error('Error fetching Horse detail:', err);
    }
  };

  

  const handleToggle = (mode: 'game' | 'real') => {
    if (mode === viewMode || !uma) return;
    setViewMode(mode);

    // compute new sources
    const newHero = mode === 'game' ? uma.umaImageLink : (horse?.horseImageLink || uma.imagePath || uma.umaImageLink);
    const newIcon = mode === 'game' ? uma.umaIconLink : undefined;

    // cross-fade hero
    Animated.timing(heroFade, {
      toValue: 0,
      duration: 160,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(() => {
      setCurrentHero(newHero);
      Animated.timing(heroFade, {
        toValue: 1,
        duration: 160,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    });

    // cross-fade icon
    Animated.timing(iconFade, {
      toValue: 0,
      duration: 120,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(() => {
      setCurrentIcon(newIcon);
      Animated.timing(iconFade, {
        toValue: 1,
        duration: 120,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    });
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
        <View style={styles.errorContainer}>
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

      <View style={styles.toggleContainer}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityState={{ selected: viewMode === 'game' }}
          style={[styles.toggleButton, viewMode === 'game' && styles.toggleButtonActive]}
          onPress={() => handleToggle('game')}
        >
          <Text style={[styles.toggleText, viewMode === 'game' && styles.toggleTextActive]}>In-Game</Text>
        </TouchableOpacity>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityState={{ selected: viewMode === 'real' }}
          style={[styles.toggleButton, viewMode === 'real' && styles.toggleButtonActive]}
          onPress={() => handleToggle('real')}
        >
          <Text style={[styles.toggleText, viewMode === 'real' && styles.toggleTextActive]}>Real Life</Text>
        </TouchableOpacity>
      </View>

      <Animated.Image
        source={{ uri: currentHero || (viewMode === 'game' ? uma.umaImageLink : (horse?.horseImageLink || uma.imagePath || uma.umaImageLink)) }}
        style={[styles.heroImage, { opacity: heroFade }]}
        resizeMode="contain"
      />

      <View style={styles.content}>
        <View style={styles.profileSection}>
            {currentIcon && (
              <Animated.Image
                source={{ uri: currentIcon }}
                style={[styles.profileIcon, { opacity: iconFade }]}
                resizeMode="contain"
              />
            )}
          <Text style={styles.name}>{viewMode === 'game' ? (uma.umaName || uma.umaId) : (horse?.horseName || uma.name || uma.realName || uma.umaName)}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Information</Text>
          {(() => {
            const getUma = (...keys: string[]) => keys.map(k => uma[k]).find(Boolean);
            const getHorse = (...keys: string[]) => keys.map(k => horse?.[k]).find(Boolean);
            const rows = viewMode === 'game'
              ? [
                  { label: 'Birth Date', value: getUma('umaBirthday', 'umaBirthDate') },
                  { label: 'Fun Fact', value: getUma('funFact') },
                ]
              : [
                  { label: 'Birth Date', value: getHorse('horseBirthday', 'birthDate') },
                  { label: 'Death Date', value: getHorse('horseDeathday', 'deathDate') },                ];

            return rows.map((r, idx) => r.value ? (
              <View style={styles.infoRow} key={String(idx)}>
                <Text style={styles.label}>{r.label}:</Text>
                <Text style={styles.value}>{String(r.value)}</Text>
              </View>
            ) : null);
          })()}
        </View>

        {(() => {
          const getUma = (...keys: string[]) => keys.map(k => uma[k]).find(Boolean);
          const getHorse = (...keys: string[]) => keys.map(k => horse?.[k]).find(Boolean);
          const bio = viewMode === 'game'
            ? getUma('umaBio', 'umaDescription')
            : getHorse('horseBio', 'horseDescription', 'bio', 'description');

          return bio ? (
            <View style={styles.descriptionSection}>
              <Text style={styles.sectionTitle}>Bio</Text>
              <Text style={styles.description}>{String(bio)}</Text>
            </View>
          ) : null;
        })()}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
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
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
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
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginTop: 64,
    marginBottom: 8,
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: 'transparent',
    marginHorizontal: 6,
  },
  toggleButtonActive: {
    backgroundColor: '#4FBF1D',
  },
  toggleText: {
    color: '#333',
    fontWeight: '600',
  },
  toggleTextActive: {
    color: '#fff',
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
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
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
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
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
