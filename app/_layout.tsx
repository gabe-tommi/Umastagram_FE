import { Stack, useRouter, usePathname, SplashScreen } from "expo-router";
import { useEffect, useCallback, useState } from "react";
import * as Linking from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { storage } from "../lib/storage";
import { Platform } from 'react-native';

// Keep the splash screen visible while we check auth
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);

  const checkAuthAndHandleCallback = useCallback(async () => {
    try {
      // Web-specific: Check URL fragment for OAuth callback data
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        const hash = window.location.hash;
        if (hash.includes('token=')) {
          console.log('Web OAuth callback detected:', hash);
          
          // Parse fragment parameters
          const params = new URLSearchParams(hash.substring(1)); // Remove '#'
          const token = params.get('token');
          const userId = params.get('userId');
          const username = params.get('username');
          const email = params.get('email');

          if (token && userId && email) {
            // Store auth data
            await AsyncStorage.multiSet([
              ['@auth:token', token],
              ['@auth:userId', userId],
              ['@auth:username', username || ''],
              ['@auth:email', email],
            ]);

            // Clear the hash from URL
            window.history.replaceState(null, '', window.location.pathname);
            
            console.log('OAuth data stored, navigating to account');
            router.replace('/tabs/account');
            return;
          }
        }
      }

      // Check if user is already logged in
      const auth = await storage.getAuth();
      const isOnAuthPage = pathname === '/' || pathname === '/signup';
      
      if (auth?.token && isOnAuthPage) {
        console.log('User already authenticated, redirecting from auth page to app');
        router.replace('/tabs/posts');
      } else if (!auth?.token && !isOnAuthPage) {
        console.log('User not authenticated, redirecting to login');
        router.replace('/');
      }
    } finally {
      setIsReady(true);
      SplashScreen.hideAsync();
    }
  }, [router, pathname]);

  const handleDeepLink = useCallback(async (url: string) => {
    console.log('Handling deep link:', url);
    try {
      const { hostname, path, queryParams } = Linking.parse(url);
      
      // Check if it's the OAuth callback
      // URL format: umastagram://auth/callback?token=...&userId=...&email=...
      if ((hostname === 'auth' || path === '/auth/callback' || path === 'auth/callback') && queryParams?.token) {
        console.log('Received OAuth callback:', queryParams);
        
        // Store only token, userId, and email individually
        await AsyncStorage.multiSet([
          ['@auth:token', queryParams.token as string],
          ['@auth:userId', String(queryParams.userId)],
          ['@auth:username', queryParams.username as string],
          ['@auth:email', queryParams.email as string],
        ]);
        
        // Navigate to the main app
        router.replace('/tabs/account');
      } else {
        console.log('Deep link not matched:', { hostname, path, queryParams });
      }
    } catch (error) {
      console.error('Error handling deep link:', error);
    }
  }, [router]);

  useEffect(() => {
    if (Platform.OS === 'web') {
      // Web: Check for OAuth callback and auth status
      checkAuthAndHandleCallback();
    } else {
      // Mobile (Android/iOS): Handle deep links
      console.log('Setting up deep link listener');
      const subscription = Linking.addEventListener('url', ({ url }) => {
        handleDeepLink(url);
      });

      // Handle deep link when app opens from closed state
      Linking.getInitialURL().then((url) => {
        if (url) {
          handleDeepLink(url);
        }
      });

      // Also check auth status on mobile
      checkAuthAndHandleCallback();

      return () => subscription.remove();
    }
  }, [handleDeepLink, checkAuthAndHandleCallback]);

  if (!isReady) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{ animation: 'fade' }}
        // screenOptions={{
        //   animation: 'slide_from_right', // Options: 'slide_from_right', 'slide_from_left', 'slide_from_bottom', 'fade', 'flip', 'none'
        // }}
      />
      <Stack.Screen
        name="signup"
        options={{ animation: 'fade' }}
      />
    </Stack>
  );
}
