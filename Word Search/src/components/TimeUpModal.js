import React, { useEffect, useRef } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
} from 'react-native';

const TimeUpModal = ({ visible, onRetry, onExit }) => {
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 6,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    return (
        <Modal transparent visible={visible} animationType="none">
            <View style={styles.overlay}>
                <Animated.View
                    style={[
                        styles.card,
                        {
                            transform: [{ scale: scaleAnim }],
                            opacity: opacityAnim,
                        },
                    ]}
                >
                    <Text style={styles.icon}>⏰</Text>
                    <Text style={styles.title}>Time’s Up!</Text>
                    <Text style={styles.message}>You ran out of time.</Text>

                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={[styles.button, styles.retry]}
                            onPress={onRetry}
                        >
                            <Text style={styles.buttonText}>Retry</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, styles.exit]}
                            onPress={onExit}
                        >
                            <Text style={styles.buttonText}>Exit</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

export default TimeUpModal;
const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.55)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        width: 280,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
    },
    icon: {
        fontSize: 42,
        marginBottom: 10,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    message: {
        fontSize: 14,
        color: '#666',
        marginVertical: 10,
        textAlign: 'center',
    },
    actions: {
        flexDirection: 'row',
        marginTop: 15,
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        marginHorizontal: 6,
        alignItems: 'center',
    },
    retry: {
        backgroundColor: '#FFC107',
    },
    exit: {
        backgroundColor: '#E0E0E0',
    },
    buttonText: {
        fontWeight: 'bold',
    },
});
