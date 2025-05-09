import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';

const HomeScreen = () => {
  // Dados fictícios para os posts
  const posts = [
    {
      id: '1',
      user: 'Estados Unidos',
      location: 'Gerlach, NV 89412, Estados Unidos',
      image: require('../assets/post1.png'),
      
    },
    {
      id: '2',
      user: 'Peru',
      location: 'Cusco, Peru',
      image: require('../assets/post2.png'),
    },
    {
      id: '3',
      user: 'Rio de janeiro',
      location: 'Rio de Janeiro, Brasil',
      image: require('../assets/post3.png'),
    },
  ];

  const renderPost = ({ item }) => (
    <View style={styles.postContainer}>
      <View style={styles.postHeader}>
        <Image source={item.avatar} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.user}</Text>
          <Text style={styles.location}>{item.location}</Text>
        </View>
      </View>
      <Image source={item.image} style={styles.postImage} />
      
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>GeoSnap</Text>
      </View>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        style={styles.feedList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
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
  feedList: {
    flex: 1,
  },
  postContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius:5,
    marginHorizontal: 10,
    marginVertical: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding:10,
  },
 
  userInfo: {
    marginLeft: 5,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  location: {
    fontSize: 12,
    color: '#666',
  },
  postImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  comentario: {
    padding: 10,
    fontSize: 14,
    color: '#333',
  },
});

export default HomeScreen;