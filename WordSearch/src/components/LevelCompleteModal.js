import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, Image } from 'react-native';
import starImage from '../assets/images/star.png'; // your star icon

const LevelCompleteModal = ({
    visible,
    stars = 0,
    score = 0,
    onNextLevel,
    onMenu,
}) => {
    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.title}>Level Complete!</Text>

                    {/* Stars */}
                    <View style={styles.starsContainer}>
                        {Array.from({ length: stars }).map((_, index) => (
                            <Image
                                key={index}
                                source={starImage}
                                style={styles.star}
                                resizeMode="contain"
                            />
                        ))}
                    </View>

                    {/* Score */}
                    <Text style={styles.score}>🏆 Score: {score}</Text>

                    {/* Buttons */}
                    <View style={styles.btnContainer}>
                        <TouchableOpacity style={[styles.button, styles.nextButton]} onPress={onNextLevel}>
                            <Text style={styles.buttonText}>Next Level</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.button, styles.menuButton]} onPress={onMenu}>
                            <Text style={styles.buttonText}>Menu</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: 300,
        padding: 24,
        backgroundColor: '#fff',
        borderRadius: 16,
        alignItems: 'center',
        elevation: 10,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    starsContainer: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    star: {
        width: 32,
        height: 32,
        marginHorizontal: 4,
    },
    score: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 24,
    },
    btnContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        marginHorizontal: 4,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    nextButton: {
        backgroundColor: '#4A90E2',
    },
    menuButton: {
        backgroundColor: '#FFC107',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default LevelCompleteModal;
