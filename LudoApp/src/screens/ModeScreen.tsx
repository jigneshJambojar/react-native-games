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

const BTN_WIDTH = width * 0.99;
const BTN_HEIGHT = BTN_WIDTH * 0.42;

export default function ModeScreen() {
    const { playerName } = useLocalSearchParams<any>();

    return (
        <ImageBackground
            source={require('../../assets/bg.png')}
            style={styles.container}
            resizeMode="cover"
        >
            <Header />

            <View style={styles.content}>
                <TouchableOpacity
                    onPress={() =>
                        router.push({ pathname: '/PlayerSelect', params: { mode: 'BOT', playerName } })
                    }
                    activeOpacity={0.8}
                >
                    <Image
                        source={require('../../assets/buttons/bot.png')}
                        style={styles.btn}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() =>
                        router.push({ pathname: '/PlayerSelect', params: { mode: 'FRIEND', playerName } })
                    }
                    activeOpacity={0.8}
                >
                    <Image
                        source={require('../../assets/buttons/friends.png')}
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
        marginVertical: 24,
        resizeMode: 'contain',
    },
});
