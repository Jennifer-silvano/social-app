import React from 'react';
import { View, Image, StyleSheet, Text, ActivityIndicator } from 'react-native';

const SplashScreenComponent = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Social App</Text>
      <ActivityIndicator size="large" color="#007BFF" style={styles.loader} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  logo: {
    width: 150,
    height: 150,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#007BFF',
  },
  loader: {
    marginTop: 30,
  },
});

export default SplashScreenComponent;