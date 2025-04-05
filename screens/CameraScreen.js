import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Alert, ActivityIndicator, Image } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CameraScreen({ navigation }) {
  // Estados da câmera e permissões
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  const [locationPermission, setLocationPermission] = useState(null);
  
  // Estados do fluxo de foto
  const [isLoading, setIsLoading] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [location, setLocation] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  
  const cameraRef = useRef(null);

  // Solicitar todas as permissões necessárias
  useEffect(() => {
    (async () => {
      await requestPermission();
      await requestMediaPermission();
      
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === 'granted');
    })();
  }, []);

  // Função para capturar foto
  const takePicture = async () => {
    if (!cameraRef.current) return;

    setIsLoading(true);
    try {
      // Tirar foto
      const photo = await cameraRef.current.takePictureAsync();
      
      // Obter localização
      let locationData = null;
      if (locationPermission) {
        const currentLocation = await Location.getCurrentPositionAsync({});
        locationData = {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        };
        
        // Obter endereço aproximado
        const addressResponse = await Location.reverseGeocodeAsync({
          latitude: locationData.latitude,
          longitude: locationData.longitude,
        });
        
        if (addressResponse.length > 0) {
          const address = addressResponse[0];
          locationData.address = `${address.street || ''}, ${address.city || ''}`;
        }
      }
      
      setCapturedImage(photo.uri);
      setLocation(locationData);
      setShowPreview(true);
      
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível capturar a foto: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para postar - ATUALIZADA
  const handlePost = async () => {
    if (!capturedImage) return;
    
    try {
      setIsLoading(true);
      // Cria o novo post
      const newPost = {
        id: Date.now().toString(),
        image: capturedImage,
        location: location?.address || "Localização desconhecida",
        timestamp: new Date().toISOString(),
      };

      // Salva no AsyncStorage
      const existingPosts = await AsyncStorage.getItem('user_posts');
      const posts = existingPosts ? JSON.parse(existingPosts) : [];
      posts.unshift(newPost); // Adiciona no início do array
      await AsyncStorage.setItem('user_posts', JSON.stringify(posts));

      // Navega para o perfil com flag de atualização
      navigation.navigate('Profile', { refresh: true,  randomKey: Math.random().toString() });
      
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível publicar: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!permission || !mediaPermission || locationPermission === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!permission.granted || !mediaPermission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Por favor, conceda as permissões necessárias</Text>
        <TouchableOpacity 
          style={styles.permissionButton}
          onPress={() => {
            requestPermission();
            requestMediaPermission();
          }}
        >
          <Text style={styles.permissionButtonText}>Solicitar Permissões</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Tela da Câmera */}
      {!showPreview && (
        <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.buttonFlip} 
              onPress={() => setFacing(current => current === 'back' ? 'front' : 'back')}
            >
              <Ionicons name="camera-reverse" size={30} color="white" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.buttonTake} 
              onPress={takePicture}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <View style={styles.captureButtonInner} />
              )}
            </TouchableOpacity>

            <View style={styles.spacer} />
          </View>
        </CameraView>
      )}

      {/* Preview da Foto com Mapa */}
      {showPreview && capturedImage && (
        <View style={styles.previewContainer}>
          <Image source={{ uri: capturedImage }} style={styles.previewImage} />
          
          <View style={styles.mapContainer}>
            {location ? (
              <>
                <MapView
                  style={styles.map}
                  initialRegion={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}
                >
                  <Marker
                    coordinate={{
                      latitude: location.latitude,
                      longitude: location.longitude,
                    }}
                  />
                </MapView>
                <Text style={styles.locationText}>
                  {location.address || 'Localização registrada'}
                </Text>
              </>
            ) : (
              <Text style={styles.locationText}>Localização não disponível</Text>
            )}
          </View>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setShowPreview(false)}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>Tirar outra</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.postButton, isLoading && styles.disabledButton]}
              onPress={handlePost}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Postar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingBottom: 30,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  buttonFlip: {
    padding: 10,
  },
  buttonTake: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    marginLeft: -35,
    backgroundColor: 'white',
    borderRadius: 35,
    height: 70,
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    backgroundColor: 'white',
    borderRadius: 30,
    height: 60,
    width: 60,
  },
  spacer: {
    width: 40,
  },
  previewContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  previewImage: {
    flex: 1,
    resizeMode: 'contain',
    backgroundColor: 'black',
  },
  mapContainer: {
    height: 200,
    margin: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  locationText: {
    color: 'white',
    padding: 10,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  cancelButton: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  postButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  message: {
    textAlign: 'center',
    padding: 20,
    fontSize: 16,
    color: 'white',
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    alignSelf: 'center',
  },
  permissionButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});