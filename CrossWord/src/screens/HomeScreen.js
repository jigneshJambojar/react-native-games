// HomePage.js
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const HomeScreen = ({ navigation }) => {
    const handlePlayPress = () => {
        // Navigate to the game screen (replace 'GameScreen' with your actual screen name)
        if (navigation) {
            navigation.navigate('Category');
        } else {
            console.log('Play button pressed!');
        }
    };

    return (
        <View style={styles.container}>
            {/* Logo */}
            <Image
                source={require('../../assets/logo.png')} // Place your logo.png in /assets folder
                style={styles.logo}
                resizeMode="contain"
            />

            {/* App Title */}
            <Text style={styles.title}>SMART WORD</Text>
            <Text style={styles.subtitle}>CHALLENGES</Text>


            <TouchableOpacity activeOpacity={0.85} style={styles.playBtn} onPress={handlePlayPress}>
                <View style={styles.playInner}>
                    <Text style={styles.playIcon}>▶</Text>
                    <Text style={styles.playText}>Play</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fec702', // smooth background color
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    logo: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
    title: {
        fontSize: 38,
        fontWeight: 'bold',
        color: '#0a83ec',
        letterSpacing: 1,
    },
    subtitle: {
        fontSize: 24,
        fontWeight: '900',
        color: '#fff',
        letterSpacing: 3,
    },

    playBtn: {
        backgroundColor: '#fff',   // outer pink
        borderRadius: 40,
        padding: 3,                  // border thickness
        borderWidth: 4,
        borderColor: '#0a83ec',         // BLACK border (important)
        width: 200,
        marginTop: 40,

        shadowColor: '#000',          // iOS
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 6,

        elevation: 8,
    },

    playInner: {
        backgroundColor: '#fec702',  // inner lighter pink
        borderRadius: 34,
        paddingVertical: 14,
        paddingHorizontal: 28,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    playIcon: {
        fontSize: 26,
        color: '#0a83ec',            // yellow triangle
        marginRight: 10,
        textShadowColor: '#000',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 0,
    },

    playText: {
        fontSize: 26,
        fontWeight: '900',
        color: '#0a83ec',
        letterSpacing: 1,
        textShadowColor: '#000',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 0,
    },
});
