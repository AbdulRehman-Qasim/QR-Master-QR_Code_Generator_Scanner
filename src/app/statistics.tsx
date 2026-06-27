import { useThemeStore } from '../store/useThemeStore';
import { View, Text, StyleSheet,  } from 'react-native';
import { colors, spacing } from '../theme/theme';

export default function Statistics() {
  const colorScheme = useThemeStore((s: any) => s.theme) as 'light' | 'dark';
  const theme = colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.text, { color: theme.text }]}>Statistics Coming Soon!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20, fontWeight: 'bold' }
});
