import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { GameProvider } from './src/context/GameContext';
import HomeScreen from './src/screens/HomeScreen';
import GameScreen from './src/screens/GameScreen';
import GuideScreen from './src/screens/GuideScreen';
import ShopScreen from './src/screens/ShopScreen';
import adService from './src/services/AdService';

export type RootStackParamList = {
  Home: undefined;
  Game: { levelId: number };
  Guide: undefined;
  Shop: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const queryClient = new QueryClient();

export default function App() {
  useEffect(() => {
    // Initialize AdMob on app start
    adService.initialize().catch(error => {
      console.error('[App] Failed to initialize AdMob:', error);
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <GameProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Home"
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: '#f8fafc' },
              }}
            >
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Game" component={GameScreen} />
              <Stack.Screen name="Guide" component={GuideScreen} />
              <Stack.Screen name="Shop" component={ShopScreen} />
            </Stack.Navigator>
          </NavigationContainer>
          <StatusBar style="auto" />
        </GameProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
