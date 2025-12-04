import { useLocalSearchParams} from "expo-router";
import { StyleSheet, View, Text } from "react-native";
import React from "react";

export default function ProfilePage(){
  const { username } = useLocalSearchParams<{ username: string }>();

  return (
    <View style={styles.container}>
      <Text> User: { username } </Text>
    </View>
  );

}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  form: { flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 12 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 4 },
  list: { paddingBottom: 32 },
  itemButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginBottom: 8,
  },
  itemText: { color: '#fff', fontSize: 16 },
});