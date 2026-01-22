import { router } from 'expo-router';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function Header() {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()}>
        <Image source={require('../../assets/buttons/back.png')} style={styles.icon} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace('/')}>
        <Image source={require('../../assets/buttons/home.png')} style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  icon: { width: 50, height: 50 },
});
