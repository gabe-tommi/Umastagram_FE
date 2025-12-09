import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { storage } from '../lib/storage';

const bgImage = require('../assets/images/umastagram_background_2.png');

export default function ProfilePage() {
    const { friendName } = useLocalSearchParams<{ friendName: string }>();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<string[]>([]);
    const [currentUsername, setUsername] = useState<string>('');

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        const auth = await storage.getAuth();
        if (auth?.username) {
            setUsername(auth.username);
        }
    };

    const fetchUserData = useCallback(async (friendName: string) => {
        if (!friendName || !friendName.trim()) {
            setResults([]);
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(
                `https://beuma-64bbab9df83e.herokuapp.com/user/getUserByUsername/${encodeURIComponent(
                    friendName.trim()
                )}`
            );
            const data: string[] = await res.json();
            setResults(data);
        } catch (err) {
            Alert.alert("Error", "Failed to load user data");
        } finally {
            setLoading(false);
        }
    }, []);

    const sendFriendRequest = useCallback(async () => {
        // if (!currentUsername) {
        //     Alert.alert('Error', 'You must be logged in to send friend requests');
        //     return;
        // }
        //
        // if (!friendName || !friendName.trim()) {
        //     Alert.alert('Error', 'Invalid friend name');
        //     return;
        // }
        //
        try {
            console.log("Starting friend request process...");

            // Get friend's userId
            const res = await fetch(
                `https://beuma-64bbab9df83e.herokuapp.com/user/getUserByUsername/${encodeURIComponent(
                    friendName.trim()
                )}`
            );
            const friendData = await res.json();
            console.log("Friend data received:", friendData);
            const friendId = friendData[0];

            // Get current user's userId
            const currentUserRes = await fetch(
                `https://beuma-64bbab9df83e.herokuapp.com/user/getUserByUsername/${encodeURIComponent(
                    currentUsername.trim()
                )}`
            );
            const currentUserData = await currentUserRes.json();
            console.log("Current user data received:", currentUserData);
            const userId = currentUserData[0];

            console.log("Sending request with userId:", userId, "friendId:", friendId);

            const requestRes = await fetch(
                `https://beuma-64bbab9df83e.herokuapp.com/api/friends/sendFriendRequest/${userId}/${friendId}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );

            console.log("Request response status:", requestRes.status);
            const responseText = await requestRes.text();
            console.log("Response text:", responseText);

            if (requestRes.ok) {
                Alert.alert('Success', 'Friend request sent!');
            } else {
                Alert.alert('Error', responseText || 'Failed to send friend request');
            }

        } catch (err) {
            console.error('Error sending friend request:', err);
            Alert.alert('Error', String(err));
        }

    }, [friendName, currentUsername]);

    useEffect(() => {
        if (friendName) {
            fetchUserData(friendName);
        }
    }, [friendName, fetchUserData]);

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#9ADB58" />
                <Text style={styles.loadingText}>Loading profile...</Text>
            </View>
        );
    }

    return (
        <ImageBackground source={bgImage} style={styles.background} imageStyle={styles.bgImage} resizeMode="cover">
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                {/* Back Button */}
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.push('/tabs/search')}
                >
                    <Text style={styles.backButtonText}>← Back</Text>
                </TouchableOpacity>

                {/* Profile Header */}
                <View style={styles.profileHeader}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>
                                {friendName?.charAt(0).toUpperCase()}
                            </Text>
                        </View>
                    </View>
                    <Text style={styles.username}>{friendName}</Text>
                </View>

                {/* Profile Details Card */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Contact Information</Text>

                    <View style={styles.infoRow}>
                        <View style={styles.iconPlaceholder}>
                            <Text style={styles.iconText}>📧</Text>
                        </View>
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Email</Text>
                            <Text style={styles.infoValue}>
                                {results[3] || "Not provided"}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.infoRow}>
                        <View style={styles.iconPlaceholder}>
                            <Text style={styles.iconText}>💻</Text>
                        </View>
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>GitHub</Text>
                            <Text style={styles.infoValue}>
                                {results[2] || "Not provided"}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Action Button */}
                <TouchableOpacity
                    style={styles.friendButton}
                    onPress={sendFriendRequest}
                >
                    <Text style={styles.friendButtonText}>Send Friend Request</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
    flex: 1,
    backgroundColor: '#F3E9EC',
    width: '100%',
    height: '100%',
    },
    bgImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'repeat',
    },
    container: {
        flex: 1,
    },
    centerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5F7FA",
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: "#666",
    },
    content: {
        padding: 20,
    },
    backButton: {
        alignSelf: "flex-start",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: "#fff",
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    backButtonText: {
        fontSize: 16,
        color: "#9ADB58",
        fontWeight: "600",
    },
    profileHeader: {
        alignItems: "center",
        marginBottom: 32,
        marginTop: 20,
    },
    avatarContainer: {
        marginBottom: 16,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#9ADB58",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 8,
    },
    avatarText: {
        fontSize: 40,
        fontWeight: "700",
        color: "#fff",
    },
    username: {
        fontSize: 28,
        fontWeight: "700",
        color: "#603745",
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#603745",
        marginBottom: 20,
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 4,
    },
    iconPlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#F0F4FF",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    iconText: {
        fontSize: 20,
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 13,
        color: "#666",
        marginBottom: 4,
        fontWeight: "500",
    },
    infoValue: {
        fontSize: 16,
        color: "#603745",
        fontWeight: "400",
    },
    divider: {
        height: 1,
        backgroundColor: "#E8ECF2",
        marginVertical: 16,
    },
    friendButton: {
        backgroundColor: "#9ADB58",
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: "center",
        shadowColor: "#9ADB58",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    friendButtonText: {
        color: "#fff",
        fontSize: 17,
        fontWeight: "600",
    },
});