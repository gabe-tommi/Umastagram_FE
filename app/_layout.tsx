import { Stack, useRouter } from "expo-router";
import { useEffect, useCallback } from "react";
import * as Linking from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { storage } from "../lib/storage";

export default function RootLayout() {
  const router = useRouter();

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
    // Handle deep links when app is already open
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

    return () => subscription.remove();
  }, [handleDeepLink]);

  return (
    <Stack>
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
