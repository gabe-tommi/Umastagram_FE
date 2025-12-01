import * as Linking from 'expo-linking';
import { Stack, useRouter } from "expo-router";
import { useCallback, useEffect } from "react";

export default function RootLayout() {
  const router = useRouter();

  const handleDeepLink = useCallback((url: string) => {
    console.log('Handling deep link:', url);
    try {
      const { hostname, path, queryParams } = Linking.parse(url);
      
      // Check if it's the OAuth callback
      // URL format: umastagram://auth/callback?token=...
      if ((hostname === 'auth' || path === '/auth/callback' || path === 'auth/callback') && queryParams?.token) {
        // Store the token (you might want to use AsyncStorage or a state manager)
        console.log('Received token:', queryParams.token);
        
        // Navigate to the main app immediately
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
