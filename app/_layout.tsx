import { Stack } from "expo-router";

export default function RootLayout() {
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
