import {useLocalSearchParams} from "expo-router";
import {Alert, StyleSheet, Text, View} from "react-native";
import React, {useState} from "react";



export default  function ProfilePage(){
    const { username } = useLocalSearchParams<{ username: string }>();
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<string[]>([]);

    const fetchUserData = async (p0: { username: string; }):Promise<string[]> => {
        if (!username.trim()) return [];
        setLoading(true);
        setResults([]);
        try {
            const res = await fetch(`https://beuma-64bbab9df83e.herokuapp.com/user/getUserByUsername/${encodeURIComponent(username.trim())}`);
            const data: string[] = await res.json();
            setResults(data);
        } catch (err) {
            Alert.alert('Search error', String(err));
        } finally {
            setLoading(false);
        }
        return results;
    };

    return (
        <View style={styles.container}>
            <Text> User: { username } </Text>
            <Text onTextLayout={() => fetchUserData({username})}></Text>
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