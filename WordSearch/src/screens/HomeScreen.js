import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Image } from 'react-native';
import logo from '../assets/images/logo.png';
import btnPlay from '../assets/images/btn-play.png';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Image source={logo} style={styles.logo} />
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.playButton}
          onPress={() => navigation.navigate('LevelSelect')}>
          <Image source={btnPlay} style={styles.btnPlayImage} />
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>Tap & Drag to Form Words</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#91c4e7',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  logo: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  title: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#FFD700',
    textShadowColor: '#FF6347',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: -10,
    textShadowColor: '#4A90E2',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  buttonsContainer: {
    width: '100%',
    maxWidth: 300,
  },
  playButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  btnPlayImage: {
    width: '50%',
    resizeMode: 'contain',
  },
  button: {
    backgroundColor: '#24d3ff',
    padding: 20,
    borderRadius: 15,
    marginVertical: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  secondaryButton: {
    backgroundColor: '#ff6844',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  footer: {
    fontSize: 18,
    color: '#FFF',
    fontStyle: 'italic',
    marginBottom: 20,
  },
});

export default HomeScreen;
