import { useState, useEffect, useCallback } from 'react';
import { useThemeStore } from '../../store/useThemeStore';
import { View, Text, StyleSheet, Button,  AppState } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter, useFocusEffect } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { colors } from '../../theme/theme';
import { storage } from '../../storage/storage';

export default function Scan() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [appState, setAppState] = useState(AppState.currentState);
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();
  const colorScheme = useThemeStore((s: any) => s.theme) as 'light' | 'dark';
  const theme = colors[colorScheme];

  useFocusEffect(
    useCallback(() => {
      setIsFocused(true);
      return () => setIsFocused(false);
    }, [])
  );

  // Properly manage camera lifecycle to prevent physical device crashes
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      setAppState(nextAppState);
    });
    return () => subscription.remove();
  }, []);

  const isCameraActive = isFocused && appState === 'active';

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ textAlign: 'center', color: theme.text, marginBottom: 20 }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const handleBarCodeScanned = async ({ type, data }: { type: string, data: string }) => {
    setScanned(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    const record = {
      id: Date.now().toString(),
      type: 'url' as any,
      content: data,
      date: new Date().toISOString(),
      isFavorite: false,
    };
    
    await storage.addScannedRecord(record);
    
    router.push({ pathname: '/result', params: { data, type } });
    
    setTimeout(() => setScanned(false), 2000);
  };

  return (
    <View style={styles.container}>
      {isCameraActive ? (
        <CameraView 
          style={StyleSheet.absoluteFill}
          facing="back"
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
        />
      ) : (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: '#000' }]} />
      )}
      <View style={[StyleSheet.absoluteFill, styles.overlay]} pointerEvents="none">
        <View style={styles.scanArea} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  scanArea: { width: 250, height: 250, borderWidth: 2, borderColor: colors.primary, backgroundColor: 'transparent' }
});
