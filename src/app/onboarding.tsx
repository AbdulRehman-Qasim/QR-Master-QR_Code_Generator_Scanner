import { useThemeStore } from '../store/useThemeStore';
import { View, Text, StyleSheet, TouchableOpacity,  } from 'react-native';
import { useRouter } from 'expo-router';
import { storage } from '../storage/storage';
import { colors, spacing, borderRadius } from '../theme/theme';

export default function Onboarding() {
  const router = useRouter();
  const colorScheme = useThemeStore((s: any) => s.theme) as 'light' | 'dark';
  const theme = colors[colorScheme];

  const handleFinish = async () => {
    await storage.setOnboardingCompleted(true);
    router.replace('/(tabs)');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>Welcome to QR Master</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Your ultimate tool for scanning and generating QR codes with a premium experience.
        </Text>
      </View>
      <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleFinish}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.xl, justifyContent: 'center' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: spacing.md, textAlign: 'center' },
  subtitle: { fontSize: 16, textAlign: 'center', lineHeight: 24 },
  button: { padding: spacing.lg, borderRadius: borderRadius.full, alignItems: 'center', marginBottom: spacing.xl },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});
