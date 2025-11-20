import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getPosts } from "../../postsAPI/postsAPI";
// import { mockPosts } from "../../postsAPI/postsAPI";

interface Post {
  id: number;
  userId: number;
  text: string;
  image: string;
  datePosted: string;
  likes: number;
}

export default function PostsPage() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [postsLikes, setPostsLikes] = useState<{ [key: number]: number }>({});
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [loadingImages, setLoadingImages] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await getPosts();
        // Reverse posts so newest posts appear first
        setPosts(fetchedPosts.reverse());
        
        // Initialize likes from fetched posts
        const initialLikes = fetchedPosts.reduce((acc: { [key: number]: number }, post: Post) => {
          acc[post.id] = post.likes;
          return acc;
        }, {});
        setPostsLikes(initialLikes);
        
        // Initialize loading images
        setLoadingImages(new Set(fetchedPosts.map((p: Post) => p.id)));
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleLike = (postId: number) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
        setPostsLikes(p => ({ ...p, [postId]: p[postId] - 1 }));
      } else {
        newSet.add(postId);
        setPostsLikes(p => ({ ...p, [postId]: p[postId] + 1 }));
      }
      return newSet;
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Text style={styles.title}>Umastagram</Text>
      </View>
      <View style={styles.content}>
        {/* Make a Post Button */}
        <View style={styles.makePostContainer}>
          <Text style={styles.makePostText}>Make a post</Text>
          <TouchableOpacity
            style={styles.makePostButton}
            onPress={() => router.push('../postMaker')}
          >
            <Ionicons name="add" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Loading State */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Loading posts...</Text>
          </View>
        ) : posts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No posts yet</Text>
          </View>
        ) : (
          posts.map((post: Post) => (
          <View key={post.id} style={styles.post}>
            {/* Post Header */}
            <View style={styles.postHeader}>
              <View style={styles.userInfo}>
                <View style={styles.avatar}>
                  <Ionicons name="person-circle" size={40} color="#007AFF" />
                </View>
                <View>
                  <Text style={styles.username}>User #{post.userId}</Text>
                  <Text style={styles.timestamp}>{formatDate(post.datePosted)}</Text>
                </View>
              </View>
            </View>

            {/* Post Text */}
            <Text style={styles.postText}>{post.text}</Text>

            {/* Post Image */}
            {post.image && (
              <View style={styles.imageContainer}>
                {loadingImages.has(post.id) && (
                  <ActivityIndicator 
                    size="large" 
                    color="#007AFF" 
                    style={styles.loadingSpinner}
                  />
                )}
                <Image
                  source={{ uri: post.image }}
                  style={styles.postImage}
                  onLoadStart={() => {
                    console.log(`Start loading image ${post.id}`);
                    setLoadingImages(prev => new Set(prev).add(post.id));
                  }}
                  onLoadEnd={() => {
                    console.log(`Finished loading image ${post.id}`);
                    setLoadingImages(prev => {
                      const newSet = new Set(prev);
                      newSet.delete(post.id);
                      return newSet;
                    });
                  }}
                />
              </View>
            )}

            {/* Post Actions */}
            <View style={styles.postActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleLike(post.id)}
              >
                <Ionicons
                  name={likedPosts.has(post.id) ? "heart" : "heart-outline"}
                  size={24}
                  color={likedPosts.has(post.id) ? "#ff4444" : "#666"}
                />
                <Text style={[styles.actionText, { color: likedPosts.has(post.id) ? "#ff4444" : "#666" }]}>
                  {postsLikes[post.id]}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="chatbubble-outline" size={24} color="#666" />
                <Text style={styles.actionText}>Comment</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
  },
  content: {
    padding: 12,
  },
  makePostContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  makePostText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  makePostButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  post: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 16,
  },
  postHeader: {
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 12,
  },
  username: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  postText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
    lineHeight: 22,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    marginBottom: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  loadingSpinner: {
    position: 'absolute',
  },
  postImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  actionText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 14,
    color: '#999',
    marginTop: 12,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
  },
});