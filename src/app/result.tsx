import { useThemeStore } from '../store/useThemeStore';
import { View, Text, StyleSheet,  TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors, spacing, borderRadius } from '../theme/theme';
import * as Clipboard from 'expo-clipboard';
import * as Linking from 'expo-linking';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Result() {
  const { data, type } = useLocalSearchParams();
  const colorScheme = useThemeStore((s: any) => s.theme) as 'light' | 'dark';
  const theme = colors[colorScheme];
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(data as string);
  };

  const openLink = async () => {
    if (await Linking.canOpenURL(data as string)) {
      Linking.openURL(data as string);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingBottom: insets.bottom + spacing.md }]}>
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.label, { color: theme.textSecondary }]}>Scanned Content</Text>
        <Text style={[styles.content, { color: theme.text }]}>{data}</Text>
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity style={[styles.btn, { backgroundColor: colors.primary }]} onPress={copyToClipboard}>
          <Text style={styles.btnText}>Copy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, { backgroundColor: colors.accent }]} onPress={openLink}>
          <Text style={styles.btnText}>Open Link</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }]} onPress={() => router.back()}>
          <Text style={[styles.btnText, { color: theme.text }]}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.md, justifyContent: 'center' },
  card: { padding: spacing.xl, borderRadius: borderRadius.lg, borderWidth: 1, marginBottom: spacing.xl },
  label: { fontSize: 14, marginBottom: spacing.sm },
  content: { fontSize: 20, fontWeight: 'bold' },
  actions: { gap: spacing.md },
  btn: { padding: spacing.md, borderRadius: borderRadius.md, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
