import { useThemeStore } from '../store/useThemeStore';
import { ScrollView, Text, StyleSheet,  View } from 'react-native';
import { colors, spacing, borderRadius } from '../theme/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function Privacy() {
  const colorScheme = useThemeStore((s: any) => s.theme) as 'light' | 'dark';
  const theme = colors[colorScheme];
  const insets = useSafeAreaInsets();

  const Point = ({ icon, title, desc, delay }: any) => (
    <Animated.View entering={FadeInDown.delay(delay).springify()} style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={[styles.iconBox, { backgroundColor: colors.primary + '15' }]}>
        <Ionicons name={icon} size={24} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>{title}</Text>
        <Text style={[styles.cardDesc, { color: theme.textSecondary }]}>{desc}</Text>
      </View>
    </Animated.View>
  );

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xxl, paddingTop: spacing.xl }}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View entering={FadeInDown.springify()} style={styles.header}>
        <View style={[styles.headerIconBox, { backgroundColor: colors.accent + '20' }]}>
          <Ionicons name="shield-checkmark" size={40} color={colors.accent} />
        </View>
        <Text style={[styles.title, { color: theme.text }]}>Privacy Policy</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Your data stays on your device. Always.</Text>
      </Animated.View>

      <View style={styles.content}>
        <Point delay={100} icon="cloud-offline" title="100% Offline" desc="QR Master functions entirely offline. We do not upload your scanned or generated codes to any servers." />
        <Point delay={200} icon="person-outline" title="No Accounts" desc="You don't need to create an account or log in to use the app. No personal information is collected." />
        <Point delay={300} icon="camera-outline" title="Camera Access" desc="The camera permission is strictly used for scanning QR codes locally on your device." />
        <Point delay={400} icon="trash-outline" title="Total Control" desc="You have full control over your data. You can delete your entire history at any time from the Settings tab." />
      </View>
      
      <Animated.View entering={FadeInDown.delay(500).springify()} style={styles.footer}>
        <View style={{ opacity: 0.7, alignItems: 'center' }}>
          <Text style={{ color: theme.icon, fontSize: 13 }}>Last updated: June 2026</Text>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: spacing.lg },
  header: { alignItems: 'center', marginBottom: spacing.xl },
  headerIconBox: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.lg },
  title: { fontSize: 28, fontWeight: '900', marginBottom: spacing.xs },
  subtitle: { fontSize: 16, textAlign: 'center', lineHeight: 22 },
  
  content: { gap: spacing.md },
  card: { flexDirection: 'row', padding: spacing.md, borderRadius: borderRadius.lg, borderWidth: 1, alignItems: 'center', gap: spacing.md },
  iconBox: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  cardDesc: { fontSize: 14, lineHeight: 20 },
  
  footer: { marginTop: spacing.xxl, alignItems: 'center' }
});
