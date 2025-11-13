import { Stack, useRouter } from "expo-router";
import { useEffect, useCallback } from "react";
import * as Linking from 'expo-linking';

export default function RootLayout() {
  const router = useRouter();

  const handleDeepLink = useCallback((url: string) => {
    console.log('Handling deep link:', url);
    try {
      const { hostname, queryParams } = Linking.parse(url);
      
      // Check if it's the OAuth callback
      if (hostname === 'auth' && queryParams?.token) {
        // Store the token (you might want to use AsyncStorage or a state manager)
        console.log('Received token:', queryParams.token);
        
        // Navigate to the main app immediately
        router.replace('/tabs/posts');
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

  return <Stack />;
}
