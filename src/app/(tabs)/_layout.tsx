import { Tabs } from 'expo-router';
import { useThemeStore } from '../../store/useThemeStore';
import {  Platform, StyleSheet, View } from 'react-native';
import { colors } from '../../theme/theme';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const colorScheme = useThemeStore((s: any) => s.theme) as 'light' | 'dark';
  const theme = colors[colorScheme];
  const insets = useSafeAreaInsets();
  
  // Dynamically calculate bottom offset
  // We add the safe area bottom inset (which represents the 3-button navigation height)
  // plus a tiny padding so it floats nicely on all devices.
  const bottomMargin = Platform.OS === 'ios' 
    ? Math.max(insets.bottom, 20) 
    : 16;

  return (
    <Tabs 
      safeAreaInsets={{ bottom: 0 }}
      screenOptions={{
      headerShown: false,
      tabBarStyle: [styles.tabBar, { bottom: bottomMargin }],
      tabBarItemStyle: styles.tabBarItem,
      tabBarBackground: () => (
        <View style={[StyleSheet.absoluteFill, { borderRadius: 35, overflow: 'hidden' }]}>
          <BlurView 
            tint={colorScheme === 'dark' ? 'dark' : 'light'} 
            intensity={80} 
            style={StyleSheet.absoluteFill} 
          />
        </View>
      ),
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: theme.icon,
      tabBarShowLabel: false,
    }}>
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Home', 
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && { backgroundColor: colors.primary + '20' }]}>
              <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />
            </View>
          ) 
        }} 
      />
      <Tabs.Screen 
        name="generate" 
        options={{ 
          title: 'Generate', 
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && { backgroundColor: colors.primary + '20' }]}>
              <Ionicons name={focused ? "qr-code" : "qr-code-outline"} size={24} color={color} />
            </View>
          ) 
        }} 
      />
      <Tabs.Screen 
        name="scan" 
        options={{ 
          title: 'Scan', 
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.fabWrapper}>
              <View style={[styles.scanButton, { shadowColor: colors.primary }]}>
                <Ionicons name="scan" size={28} color="#fff" />
              </View>
            </View>
          ) 
        }} 
      />
      <Tabs.Screen 
        name="history" 
        options={{ 
          title: 'History', 
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && { backgroundColor: colors.primary + '20' }]}>
              <Ionicons name={focused ? "time" : "time-outline"} size={24} color={color} />
            </View>
          ) 
        }} 
      />
      <Tabs.Screen 
        name="settings" 
        options={{ 
          title: 'Settings', 
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && { backgroundColor: colors.primary + '20' }]}>
              <Ionicons name={focused ? "settings" : "settings-outline"} size={24} color={color} />
            </View>
          ) 
        }} 
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    left: 20,
    right: 20,
    height: 70,
    borderRadius: 35,
    borderWidth: 0,
    borderColor: 'transparent',
    borderTopWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
    paddingBottom: 0,
  },
  tabBarItem: {
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    margin: 0,
  },
  iconContainer: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
  },
  fabWrapper: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanButton: {
    position: 'absolute',
    top: -25,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  }
});
