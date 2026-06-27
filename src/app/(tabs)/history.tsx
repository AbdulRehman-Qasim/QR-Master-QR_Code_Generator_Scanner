import { useThemeStore } from '../../store/useThemeStore';
import { View, Text, StyleSheet, FlatList,  Pressable } from 'react-native';
import { colors, spacing } from '../../theme/theme';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { storage } from '../../storage/storage';
import { QRRecord } from '../../types';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function History() {
  const colorScheme = useThemeStore((s: any) => s.theme) as 'light' | 'dark';
  const theme = colors[colorScheme];
  const [history, setHistory] = useState<QRRecord[]>([]);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        const data = await storage.getScannedHistory();
        setHistory(data);
      };
      loadData();
    }, [])
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Animated.View entering={FadeInDown.springify()} style={[styles.header, { paddingTop: Math.max(insets.top, spacing.xl) }]}>
        <Text style={[styles.title, { color: theme.text }]}>History</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Your recent scans</Text>
      </Animated.View>

      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: Math.max(insets.bottom, spacing.xxl) + 120 }}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(index * 50).springify()}>
            <Pressable 
              onPress={() => router.push({ pathname: '/result', params: { data: item.content, type: item.type } })}
              style={[styles.item, { backgroundColor: theme.card, borderColor: theme.border }]}
            >
              <View style={[styles.iconBg, { backgroundColor: colorScheme === 'dark' ? '#334155' : '#E2E8F0' }]}>
                <Ionicons name="scan-outline" size={24} color={theme.text} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.content, { color: theme.text }]} numberOfLines={1}>{item.content}</Text>
                <Text style={[styles.date, { color: theme.textSecondary }]}>
                  {new Date(item.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.icon} />
            </Pressable>
          </Animated.View>
        )}
        ListEmptyComponent={
          <Animated.View entering={FadeInDown.delay(100)} style={styles.emptyContainer}>
            <View style={[styles.emptyCircle, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Ionicons name="timer-outline" size={48} color={theme.icon} />
            </View>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No scan history yet.</Text>
          </Animated.View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.md },
  title: { fontSize: 32, fontWeight: '900', letterSpacing: -1 },
  subtitle: { fontSize: 16, marginTop: 4, fontWeight: '500' },
  
  item: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, borderRadius: 16, borderWidth: 1, marginBottom: spacing.sm, gap: spacing.md },
  iconBg: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  content: { fontSize: 16, fontWeight: '700' },
  date: { fontSize: 12, marginTop: 4 },
  
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  emptyCircle: { width: 100, height: 100, borderRadius: 50, borderWidth: 1, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.md },
  emptyText: { fontSize: 16, fontWeight: '500' }
});
