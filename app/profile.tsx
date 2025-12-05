import {useLocalSearchParams} from "expo-router";
import {Alert, Button, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React, {useCallback, useEffect, useState} from "react";

export default  function ProfilePage(){
    const { username } = useLocalSearchParams<{ username: string }>();
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<string[]>([]);
    //
    //
    // const sendFriendRequest = async({ number:userId }):Promise<void> => {
    //
    // }

    const fetchUserData = useCallback(async (username: string) => {
        if (!username.trim()) {
            setResults([]);
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(
                `https://beuma-64bbab9df83e.herokuapp.com/user/getUserByUsername/${encodeURIComponent(username.trim())}`
            );
            const data: string[] = await res.json();
            setResults(data);
        } catch (err) {
            Alert.alert('Search error', String(err));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUserData(username);
    }, [username, fetchUserData]); // fetchUserData is now stable too

    return (
        <View style={styles.container}>
            <Text> User: { username } </Text>
            <Text> Github: { results[0] }</Text>
            <TouchableOpacity>Send Friend Request</TouchableOpacity>
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