import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

export default function Header({ onHomePress }) {
    return (
        <View style={styles.header}>
            <View style={styles.container}>
                <View style={styles.logoContainer}>
                    <View style={styles.wordContainer}>
                        <Text style={styles.strokeText}>WORD</Text>
                        <Text style={styles.fillText}>WORD</Text>
                    </View>

                    <View style={styles.wordContainer}>
                        <Text style={styles.strokeText}>Challenges</Text>
                        <Text style={styles.fillText}>Challenges</Text>
                    </View>
                </View>
            </View>

            <TouchableOpacity style={styles.homeBtn} onPress={onHomePress}>
                <Image
                    source={require('../../assets/btn/bt-home.png')}
                    style={styles.homeImg}
                    resizeMode="contain"
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginBottom: 12,
        marginTop: 20,
    },

    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    wordContainer: {
        position: 'relative',
        marginVertical: 4,
    },

    strokeText: {
        position: 'absolute',
        fontSize: 22,
        fontWeight: '900',
        color: '#000',
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        textShadowColor: '#000',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 1,
    },

    fillText: {
        fontSize: 22,
        fontWeight: '900',
        color: '#1e88e5',
        letterSpacing: 1.5,
        textTransform: 'uppercase',
    },

    homeBtn: {
        width: 56,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
    },

    homeImg: {
        width: 56,
        height: 56,
    },
});
