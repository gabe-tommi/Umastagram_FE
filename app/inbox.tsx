import { storage } from '../lib/storage';
import { useState, useEffect } from 'react';
import {
    View,
    TextInput,
    FlatList,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    StyleSheet,
} from 'react-native';
import { router } from "expo-router";


export default function InboxPage() {
    const [username, setUsername] = useState('');
    const [friendname, setFriendName] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<string[]>([]);
    const [userId, setUserId] = useState<number | null>(null);

    useEffect(() => {
        loadUserData();
    }, []);


    const loadUserData = async () => {
        const auth = await storage.getAuth();
        if (auth?.username) {
            setUsername(auth.username);
        }
        getActiveFriendRequests(auth?.username || '');
    };

    const getActiveFriendRequests = async (username:string) => {
        setLoading(true);
        try {
            // First, get current user's Id
            const currentUserRes = await fetch(
                `https://beuma-64bbab9df83e.herokuapp.com/user/getUserByUsername/${encodeURIComponent(
                    username.trim()
                )}`
            );
            const currentUserData = await currentUserRes.json();
            console.log("Current user data received:", currentUserData);
            const userId = currentUserData[0];
            setUserId(userId);

            // Now, get active friend requests for that userId
            const activeFriendReqsRes = await fetch(
                `https://beuma-64bbab9df83e.herokuapp.com/api/friends/getUserFriendRequests/${userId}`
            );
            const activeFriendReqsData: string[] = await activeFriendReqsRes.json();
            console.log("Active friend requests data received:", activeFriendReqsData);
            setResults(activeFriendReqsData);
        } catch (err) {
            Alert.alert('getFriendRequestsError', String(err));
        } finally {
            setLoading(false);
        }
    }

    const acceptFriendRequest = async (friendName: string) => {
        try{
            // First, get friend user's Id
            const friendRes = await fetch(
                `https://beuma-64bbab9df83e.herokuapp.com/user/getUserByUsername/${encodeURIComponent(
                    friendName.trim()
                )}`
            );
            const friendData = await friendRes.json();
            setFriendName(friendData[1]);
            console.log("Current user data received:", friendData);
            const friendId = friendData[0];

            // Now, accept friend request
            const acceptRes = await fetch(
                `https://beuma-64bbab9df83e.herokuapp.com/api/friends/acceptFriendRequest/${userId}/${friendId}`,
                {
                    method: 'POST',
                }
            );
            
            await fetch(`https://beuma-64bbab9df83e.herokuapp.com/api/friends/deleteFriendRequest/${friendId}/${userId}`),{
                method: 'DELETE',
            };
            
            if (acceptRes.ok) {
                
                Alert.alert('Success', `You are now friends with ${friendName}`);
                // Refresh friend requests list
                getActiveFriendRequests(username);
            } else {
                const errorData = await acceptRes.json();
                throw new Error(errorData.error || 'Failed to accept friend request');
            }

        }
        catch (err) {
            Alert.alert('Accept Friend Request Error', String(err));
        }
    }

    const renderItem = ({item}: { item: string }) => (
        <TouchableOpacity style={styles.resultCard} onPress={() => acceptFriendRequest(item)}>
            <View style={styles.avatarSmall}>
                <Text style={styles.avatarSmallText}>{item.charAt(0).toUpperCase()}</Text>
            </View>
            <Text style={styles.resultText}>
                <Text style={styles.itemText}>{item}  </Text>wants to be friends!
            </Text>
            <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.replace('/tabs/posts')}
            >
                <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>

            {/* Header */}
            <Text style={styles.header}>Active Friend Requests</Text>

            <FlatList
                data={results}
                keyExtractor={(friendname, index) => index.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F5F7FA',
    },
    backButton: {
        alignSelf: "flex-start",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: "#fff",
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    backButtonText: {
        fontSize: 16,
        color: "#007AFF",
        fontWeight: "600",
    },
    header: {
        fontSize: 32,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 20,
    },
    searchContainer: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    input: {
        flex: 1,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E8ECF2',
        padding: 14,
        borderRadius: 12,
        fontSize: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    searchButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        shadowColor: "#007AFF",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    searchButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    loadingContainer: {
        alignItems: 'center',
        marginVertical: 32,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 60,
    },
    sadFace: {
        fontSize: 64,
        color: '#999',
        marginBottom: 16,
    },
    emptyStateText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 8,
    },
    emptyStateSubtext: {
        fontSize: 16,
        color: '#666',
    },
    list: {
        paddingBottom: 32,
    },
    resultCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    avatarSmall: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarSmallText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
    },
    resultText: {
        flex: 1,
        color: '#1A1A1A',
        fontSize: 17,
        fontWeight: '500',
    },
    chevron: {
        fontSize: 24,
        color: '#C7C7CC',
        fontWeight: '300',
    },
    itemText: {
        color: '#007AFF', // or whatever color you want
        fontWeight: 'bold', // optional
        fontSize: 24
    },
});