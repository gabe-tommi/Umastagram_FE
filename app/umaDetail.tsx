import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Easing, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
const bgImage = require('../assets/images/umastagram_background.png');

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

  // Format birthday to only display month and day for umas
  const formatUmaBirthday = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const days = ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth', 'Eleventh', 'Twelfth', 'Thirteenth', 'Fourteenth', 'Fifteenth', 'Sixteenth', 'Seventeenth', 'Eighteenth', 'Nineteenth', 'Twentieth', 'Twenty-First', 'Twenty-Second', 'Twenty-Third', 'Twenty-Fourth', 'Twenty-Fifth', 'Twenty-Sixth', 'Twenty-Seventh', 'Twenty-Eighth', 'Twenty-Ninth', 'Thirtieth', 'Thirty-First'];
      const month = months[date.getMonth()];
      const day = days[date.getDate() - 1];
      return `${month} ${day}`;
    } catch {
      return dateString;
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
    <ImageBackground source={bgImage} style={styles.background} imageStyle={styles.bgImage} resizeMode="contain">
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={28} color="#603745" />
          </TouchableOpacity>
          <Text style={styles.errorText}>Error: {error || 'Uma not found'}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => fetchUmaDetail(id as string)}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
    );

  }

  return (
  <ImageBackground source={bgImage} style={styles.background} imageStyle={styles.bgImage} resizeMode="contain">
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="chevron-back" size={28} color="#603745" />
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

      <View style={[styles.mainLayout, viewMode === 'real' && styles.mainLayoutColumn]}>
        <View style={[styles.leftContent, viewMode === 'real' && styles.leftContentFull]}>
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
                  { label: 'Birth Date', value: formatUmaBirthday(getUma('umaBirthday', 'umaBirthDate') || '') },
                  { label: 'Fun Fact', value: getUma('funFact') },
                ]
              : [
                  { label: 'Birth Date', value: getHorse('horseBirthday', 'birthDate') || '' },
                  { label: 'Death Date', value: getHorse('horseDeathday', 'deathDate') || '' },                ];

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

        {viewMode === 'game' && (
          <Animated.Image
            source={{ uri: currentHero || uma.umaImageLink }}
            style={[styles.heroImage, { opacity: heroFade }]}
            resizeMode="contain"
          />
        )}
      </View>

      {viewMode === 'real' && (
        <Animated.Image
          source={{ uri: currentHero || (horse?.horseImageLink || uma.imagePath || uma.umaImageLink) }}
          style={[styles.heroImageBottom, { opacity: heroFade }]}
          resizeMode="contain"
        />
      )}
    </ScrollView>
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
    width: '20%',
    height: 500,
    backgroundColor: '#F3E9EC',
  },
  heroImageBottom: {
    alignSelf: 'center',
    width: '40%',
    height: 350,
    backgroundColor: '#F3E9EC',
    marginTop: 20,
    marginBottom: 20,
  },
  mainLayout: {
    flexDirection: 'row',
    paddingTop: 64,
    marginBottom: 20,
  },
  mainLayoutColumn: {
    flexDirection: 'column',
    paddingTop: 0,
  },
  leftContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  leftContentFull: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginTop: 60,
    marginBottom: 16,
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: 'transparent',
    marginHorizontal: 6,
  },
  toggleButtonActive: {
    backgroundColor: '#9ADB58',
  },
  toggleText: {
    color: '#603745',
    fontWeight: '600',
  },
  toggleTextActive: {
    color: '#fff',
  },
  profileIcon: {
    width: 80,
    height: 80,
    marginBottom: 12,
    borderRadius: 40,
    backgroundColor: '#fbf8f9',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#603745',
    textAlign: 'center',
  },
  infoSection: {
    backgroundColor: '#fdfbfb',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#603745',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#fdfbfb',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#603745',
  },
  value: {
    fontSize: 14,
    color: '#603745',
    flex: 1,
    textAlign: 'right',
  },
  descriptionSection: {
    backgroundColor: '#fdfbfb',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: '#603745',
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
