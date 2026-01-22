import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    Image,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity
} from 'react-native';

const { width, height } = Dimensions.get('window');


export default function HomeScreen() {
    const [name, setName] = useState('');

    const onPlay = () => {
        if (!name.trim()) return;

        router.push({
            pathname: '/mode',
            params: {
                playerName: name,
            },
        });
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ImageBackground
                source={require('../../assets/bg.png')} // ✅ your background
                style={styles.container}
                resizeMode="cover"
            >
                {/* LOGO */}
                <Image
                    source={require('../../assets/logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />

                {/* AVATAR */}
                <Image
                    source={require('../../assets/avatars/avatar0.png')}
                    style={styles.avatar}
                    resizeMode="contain"
                />

                {/* PLAYER NAME INPUT */}
                <TextInput
                    placeholder="Enter your name"
                    placeholderTextColor="#bbb"
                    value={name}
                    onChangeText={setName}
                    style={styles.input}
                />

                {/* PLAY BUTTON */}
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => onPlay()}
                    style={styles.playWrapper}
                >
                    <Image
                        source={require('../../assets/buttons/play.png')}
                        style={styles.playButton}
                        resizeMode="contain"
                    />
                </TouchableOpacity>

                {/* FOOTER */}
                <Text style={styles.footer}>Play • Compete • Win</Text>
            </ImageBackground>
        </KeyboardAvoidingView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },

    logo: {
        width: width * 0.9,
        height: 140,
        marginBottom: 5,
    },

    avatar: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },

    input: {
        width: '75%',
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 15,
        fontSize: 16,
        marginBottom: 20,
    },

    playWrapper: {
        marginTop: 10,
    },

    playButton: {
        width: 100,
        height: 100,
    },

    footer: {
        position: 'absolute',
        bottom: 30,
        color: '#fff',
        fontSize: 14,
        opacity: 0.8,
    },
});
