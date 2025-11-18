import { Ionicons } from '@expo/vector-icons';
import { useState } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { mockPosts } from "../../postsAPI/postsAPI";

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
  const [postsLikes, setPostsLikes] = useState<{ [key: number]: number }>(
    mockPosts.reduce((acc, post) => {
      acc[post.id] = post.likes;
      return acc;
    }, {} as { [key: number]: number })
  );
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [loadingImages, setLoadingImages] = useState<Set<number>>(new Set(mockPosts.map(p => p.id)));

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
    <ScrollView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        {mockPosts.map((post: Post) => (
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
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 12,
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
});