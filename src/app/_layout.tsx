import { Stack } from 'expo-router';
import { useThemeStore } from '../store/useThemeStore';
import {  View, Text, TextInput } from 'react-native';
import { colors } from '../theme/theme';
import { useEffect, useState } from 'react';
import { storage } from '../storage/storage';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { 
  useFonts, 
  Outfit_400Regular, 
  Outfit_500Medium, 
  Outfit_600SemiBold, 
  Outfit_700Bold, 
  Outfit_900Black 
} from '@expo-google-fonts/outfit';

// @ts-ignore
if (Text.defaultProps == null) Text.defaultProps = {};
// @ts-ignore
Text.defaultProps.style = { fontFamily: 'Outfit_400Regular' };
// @ts-ignore
if (TextInput.defaultProps == null) TextInput.defaultProps = {};
// @ts-ignore
TextInput.defaultProps.style = { fontFamily: 'Outfit_400Regular' };

export default function RootLayout() {
  const colorScheme = useThemeStore((s: any) => s.theme) as 'light' | 'dark';
  const theme = colors[colorScheme];
  const [isReady, setIsReady] = useState(false);
  const [initialRoute, setInitialRoute] = useState<string>('(tabs)');

  const [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
    Outfit_900Black,
  });

  useEffect(() => {
    async function checkOnboarding() {
      const completed = await storage.isOnboardingCompleted();
      if (!completed) {
        setInitialRoute('onboarding');
      }
      setIsReady(true);
    }
    checkOnboarding();
  }, []);

  if (!isReady || !fontsLoaded) return <View style={{ flex: 1, backgroundColor: theme.background }} />;

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <Stack screenOptions={{ 
          headerStyle: { backgroundColor: theme.background },
          headerTintColor: theme.text,
          contentStyle: { backgroundColor: theme.background }
        }}>
          {initialRoute === 'onboarding' ? (
            <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          ) : null}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="result" options={{ title: 'Scan Result', presentation: 'modal' }} />
          <Stack.Screen name="privacy" options={{ title: 'Privacy Policy' }} />
          <Stack.Screen name="terms" options={{ title: 'Terms & Conditions' }} />
          <Stack.Screen name="statistics" options={{ title: 'Statistics' }} />
          <Stack.Screen name="favorites" options={{ title: 'Favorites' }} />
        </Stack>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
