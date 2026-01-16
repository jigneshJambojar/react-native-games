import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Image } from 'react-native';
import starImage from '../assets/images/star.png';

const StarProgress = ({
    totalTime = 30,
    timeLeft = 30,
    totalStars = 3,
    width = 300,
}) => {
    const progressAnim = useRef(new Animated.Value(timeLeft)).current;

    // Animate on EVERY timeLeft change
    useEffect(() => {
        Animated.timing(progressAnim, {
            toValue: timeLeft,
            duration: 950, // smooth 1s transition
            useNativeDriver: false,
        }).start();
    }, [timeLeft]);

    // Convert time → width
    const progressWidth = progressAnim.interpolate({
        inputRange: [0, totalTime],
        outputRange: [0, width],
        extrapolate: 'clamp',
    });

    return (
        <View style={[styles.container, { width }]}>
            {/* Stars */}
            <View style={styles.starsContainer}>
                {Array.from({ length: totalStars }).map((_, index) => (
                    <Image
                        key={index}
                        source={starImage}
                        style={styles.starImage}
                        resizeMode="contain"
                    />
                ))}
            </View>

            {/* Progress Bar */}
            <View style={styles.progressBar}>
                <Animated.View
                    style={[
                        styles.progressFill,
                        { width: progressWidth },
                    ]}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 50,
        justifyContent: 'center',
    },
    starsContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        zIndex: 1,
    },
    starImage: {
        width: 40,
        height: 40,
    },
    progressBar: {
        height: 20,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#FFC107',
        borderRadius: 8,
    },
});

export default StarProgress;
