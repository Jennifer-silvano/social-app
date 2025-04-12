import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');

  const checkBiometrics = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    
    if (!compatible) {
      Alert.alert('Erro', 'Seu dispositivo não possui sensor biométrico');
      return false;
    }

    const enrolled = await LocalAuthentication.isEnrolledAsync();
    if (!enrolled) {
      Alert.alert('Erro', 'Nenhuma biometria cadastrada no dispositivo');
      return false;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Autentique-se para criar conta',
      fallbackLabel: 'Use sua senha',
    });

    return result.success;
  };

  const handleRegister = async () => {
    if (!name || !email || !password || !age) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    // Adicione aqui sua lógica para criar um novo usuário
    // Por simplicidade, estamos apenas verificando se os campos foram preenchidos

    const authenticated = await checkBiometrics();
    if (authenticated) {
      navigation.replace('MainApp');
    } else {
      Alert.alert('Falha', 'Autenticação biométrica falhou');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Cadastro</Text>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nome"
            value={name}
            onChangeText={setName}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ano do nascimento"
            value={age}
            onChangeText={setAge}
            keyboardType="new Date"
          />
        </View>
        
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.loginLink} 
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginText}>
            Já tem uma conta? <Text style={styles.loginTextBold}>Faça login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#F6F6F6',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  button: {
    backgroundColor: '#007BFF',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginLink: {
    marginTop: 20,
  },
  loginText: {
    color: '#666',
    fontSize: 14,
  },
  loginTextBold: {
    fontWeight: 'bold',
    color: '#007BFF',
  },
});

export default RegisterScreen;