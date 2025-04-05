import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';

const ProfileScreen = ({ route }) => {
  const isFocused = useIsFocused();
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Dados do usuário
  const user = {
    name: 'Usuário',
    avatar: require('../assets/profile.png'),
  };

  // Carrega os posts quando a tela está em foco ou recebe parâmetro de atualização
  useEffect(() => {
    if (isFocused || route.params?.refresh) {
      loadPosts();
    }
  }, [isFocused, route.params]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const postsJson = await AsyncStorage.getItem('user_posts');
      setUserPosts(postsJson ? JSON.parse(postsJson) : []);
    } catch (error) {
      console.error('Erro ao carregar posts:', error);
      Alert.alert('Erro', 'Não foi possível carregar as publicações');
    } finally {
      setLoading(false);
    }
  };

  const renderPostItem = ({ item }) => (
    <View style={styles.postItem}>
      <Image source={{ uri: item.image }} style={styles.postImage} />
      <View style={styles.postLocation}>
        <Ionicons name="location" size={14} color="#007BFF" />
        <Text style={styles.locationText}>{item.location}</Text>
      </View>
    </View>
  );

  const EmptyPostsList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="images-outline" size={60} color="#CCCCCC" />
      <Text style={styles.emptyText}>Nenhuma foto publicada ainda</Text>
      <Text style={styles.emptySubText}>
        Suas fotos aparecerão aqui depois de publicadas
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Perfil</Text>
      </View>
      
      <View style={styles.profileSection}>
        <Image source={user.avatar} style={styles.profileImage} />
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.postsCount}>
          {userPosts.length} {userPosts.length === 1 ? 'publicação' : 'publicações'}
        </Text>
      </View>
      
      <View style={styles.separator} />
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007BFF" />
        </View>
      ) : (
        <FlatList
          data={userPosts}
          renderItem={renderPostItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          style={styles.postsList}
          contentContainerStyle={userPosts.length === 0 ? { flex: 1 } : null}
          ListEmptyComponent={<EmptyPostsList />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  profileSection: {
    alignItems: 'center',
    padding: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  postsCount: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  separator: {
    height: 1,
    backgroundColor: '#E8E8E8',
    marginHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postsList: {
    flex: 1,
    padding: 5,
  },
  postItem: {
    flex: 1,
    margin: 5,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#F8F8F8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  postImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  postLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  locationText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  emptySubText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
});

export default ProfileScreen;