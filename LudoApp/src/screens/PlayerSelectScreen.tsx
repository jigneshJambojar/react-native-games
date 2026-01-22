import Header from '@/src/ui/Header';
import { router, useLocalSearchParams } from 'expo-router';
import {
    Dimensions,
    Image,
    ImageBackground,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

const BTN_WIDTH = width * 0.65;
const BTN_HEIGHT = BTN_WIDTH * 0.32;

export default function PlayerSelectScreen() {
    const { mode, playerName } = useLocalSearchParams<any>();

    return (
        <ImageBackground
            source={require('../../assets/bg.png')}
            style={styles.container}
            resizeMode="cover"
        >
            <Header />

            <View style={styles.content}>
                <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() =>
                        router.push({
                            pathname: '/game',
                            params: { playerName, mode, pc: 2 },
                        })
                    }
                >
                    <Image
                        source={require('../../assets/buttons/player2.png')}
                        style={styles.btn}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() =>
                        router.push({
                            pathname: '/game',
                            params: { playerName, mode, pc: 4 },
                        })
                    }
                >
                    <Image
                        source={require('../../assets/buttons/player4.png')}
                        style={styles.btn}
                    />
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btn: {
        width: BTN_WIDTH,
        height: BTN_HEIGHT,
        marginVertical: 14,
        resizeMode: 'contain',
    },
});
