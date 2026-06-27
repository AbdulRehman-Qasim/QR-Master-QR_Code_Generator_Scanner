import { useThemeStore } from '../../store/useThemeStore';
import { View, Text, StyleSheet, ScrollView,  Pressable, Dimensions } from 'react-native';
import { colors, spacing, borderRadius } from '../../theme/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeIn, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { useState, useCallback } from 'react';
import { storage } from '../../storage/storage';
import { QRRecord } from '../../types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function ScaleButton({ children, onPress, style, delay = 0 }: any) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View entering={FadeInDown.delay(delay).springify()}>
      <AnimatedPressable
        onPressIn={() => (scale.value = withSpring(0.92))}
        onPressOut={() => (scale.value = withSpring(1))}
        onPress={onPress}
        style={[style, animatedStyle]}
      >
        {children}
      </AnimatedPressable>
    </Animated.View>
  );
}

export default function Home() {
  const colorScheme = useThemeStore((s: any) => s.theme) as 'light' | 'dark';
  const theme = colors[colorScheme];
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [recent, setRecent] = useState<QRRecord[]>([]);
  
  useFocusEffect(
    useCallback(() => {
      async function load() {
        const data = await storage.getScannedHistory();
        setRecent(data.slice(0, 5)); // show top 5
      }
      load();
    }, [])
  );

  const renderAmbientBackground = () => (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={[styles.blob, { top: -50, right: -100, backgroundColor: 'rgba(6, 182, 212, 0.25)' }]} />
      <View style={[styles.blob, { top: 300, left: -100, backgroundColor: 'rgba(37, 99, 235, 0.2)' }]} />
      <View style={[styles.blob, { bottom: -100, right: 0, backgroundColor: 'rgba(139, 92, 246, 0.15)' }]} />
      <BlurView intensity={100} tint={colorScheme} style={StyleSheet.absoluteFill} />
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {renderAmbientBackground()}
      <ScrollView 
        style={styles.container}
        contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, spacing.xxl) + 80, paddingTop: Math.max(insets.top, spacing.lg) }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.springify()} style={styles.header}>
          <Text style={[styles.greeting, { color: theme.textSecondary }]}>Welcome back,</Text>
          <Text style={[styles.title, { color: theme.text }]}>Dashboard</Text>
        </Animated.View>

        <ScaleButton 
          delay={100} 
          onPress={() => router.push('/(tabs)/scan')}
          style={styles.heroCardContainer}
        >
          <LinearGradient
            colors={['#1E3A8A', '#3B82F6', '#06B6D4']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroCard}
          >
            <View style={styles.heroContent}>
              <View>
                <Text style={styles.heroTitle}>Smart Scanner</Text>
                <Text style={styles.heroSubtitle}>Instantly decode any QR or barcode</Text>
              </View>
              <View style={styles.heroIconWrap}>
                <Ionicons name="scan" size={32} color="#fff" />
              </View>
            </View>
          </LinearGradient>
        </ScaleButton>

        <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Quick Create</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.md, paddingHorizontal: spacing.lg }}>
            {[
              { icon: 'globe-outline', label: 'Website', color: '#10B981' },
              { icon: 'wifi-outline', label: 'Wi-Fi', color: '#F59E0B' },
              { icon: 'text-outline', label: 'Text', color: '#8B5CF6' },
              { icon: 'call-outline', label: 'Contact', color: '#EC4899' }
            ].map((item, idx) => (
              <ScaleButton key={idx} onPress={() => router.push('/(tabs)/generate')} style={[styles.quickCreateCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <View style={[styles.quickCreateIcon, { backgroundColor: item.color + '20' }]}>
                  <Ionicons name={item.icon as any} size={24} color={item.color} />
                </View>
                <Text style={[styles.quickCreateLabel, { color: theme.text }]}>{item.label}</Text>
              </ScaleButton>
            ))}
          </ScrollView>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).springify()} style={[styles.section, { paddingHorizontal: spacing.lg }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Activity</Text>
            <Pressable onPress={() => router.push('/(tabs)/history')}>
              <Text style={{ color: colors.primary, fontWeight: '600' }}>See All</Text>
            </Pressable>
          </View>
          
          {recent.length === 0 ? (
             <View style={[styles.emptyState, { backgroundColor: theme.card, borderColor: theme.border }]}>
               <Ionicons name="document-text-outline" size={48} color={theme.icon} style={{opacity: 0.5}} />
               <Text style={{ color: theme.textSecondary, marginTop: spacing.sm }}>No recent scans.</Text>
             </View>
          ) : (
            <View style={{ gap: spacing.sm }}>
              {recent.map((rec) => (
                <ScaleButton key={rec.id} onPress={() => router.push({ pathname: '/result', params: { data: rec.content, type: rec.type } })} style={[styles.historyRow, { backgroundColor: theme.card, borderColor: theme.border }]}>
                  <View style={[styles.historyIconBg, { backgroundColor: colorScheme === 'dark' ? '#334155' : '#E2E8F0' }]}>
                    <Ionicons name="link-outline" size={20} color={theme.text} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.historyContent, { color: theme.text }]} numberOfLines={1}>{rec.content}</Text>
                    <Text style={{ color: theme.textSecondary, fontSize: 12, marginTop: 2 }}>{new Date(rec.date).toLocaleDateString()}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={theme.icon} />
                </ScaleButton>
              ))}
            </View>
          )}
        </Animated.View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  blob: { position: 'absolute', width: 300, height: 300, borderRadius: 150 },
  header: { marginBottom: spacing.lg, paddingHorizontal: spacing.lg },
  greeting: { fontSize: 16, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
  title: { fontSize: 36, fontWeight: '900', letterSpacing: -1, marginTop: 4 },
  
  heroCardContainer: { paddingHorizontal: spacing.lg, marginBottom: spacing.xl, shadowColor: '#3B82F6', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 10 },
  heroCard: { borderRadius: 24, padding: spacing.xl, overflow: 'hidden' },
  heroContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  heroTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  heroSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  heroIconWrap: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  
  section: { marginBottom: spacing.xl },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: spacing.md, paddingHorizontal: spacing.lg },
  sectionTitle: { fontSize: 20, fontWeight: '800', letterSpacing: -0.5 },
  
  quickCreateCard: { width: 100, height: 110, borderRadius: 20, borderWidth: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.sm, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  quickCreateIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.sm },
  quickCreateLabel: { fontSize: 13, fontWeight: '600' },

  emptyState: { padding: spacing.xl, borderRadius: 20, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  historyRow: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, borderRadius: 16, borderWidth: 1, gap: spacing.md },
  historyIconBg: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  historyContent: { fontSize: 15, fontWeight: '600' }
});
