import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        headerTitleAlign: 'center',
        tabBarStyle: {
          backgroundColor: '#fefdfd',
          borderTopWidth: 1,
          borderTopColor:  '#fefdfd',
        },
        tabBarActiveTintColor: '#9ADB58',
        tabBarInactiveTintColor: '#8E8E93',
      }}>
      <Tabs.Screen
        name="posts"
        options={{
          title: 'Posts',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="dms"
        options={{
          title: 'Messages',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="umas"
        options={{
          title: 'Umas',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="paw" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}