import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Modal } from 'react-native';
import { useState } from 'react';
import { colors, spacing, borderRadius } from '../../theme/theme';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { storage } from '../../storage/storage';
import { useThemeStore } from '../../store/useThemeStore';

export default function Settings() {
  const colorScheme = useThemeStore((s: any) => s.theme) as 'light' | 'dark';
  const toggleTheme = useThemeStore((s: any) => s.toggleTheme);
  const theme = colors[colorScheme];
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [showClearModal, setShowClearModal] = useState(false);

  const toggleDarkMode = () => {
    toggleTheme();
  };

  const executeClearHistory = async () => {
    await storage.saveScannedHistory([]);
    await storage.saveGeneratedHistory([]);
    setShowClearModal(false);
  };

  const handleClearHistory = () => {
    setShowClearModal(true);
  };

  const renderItem = (title: string, icon: any, onPress: () => void, isDestructive = false) => (
    <TouchableOpacity style={[styles.item, { backgroundColor: theme.card, borderColor: theme.border }]} onPress={onPress}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
        <View style={[styles.iconBox, { backgroundColor: isDestructive ? 'rgba(239, 68, 68, 0.1)' : colors.primary + '15' }]}>
          <Ionicons name={icon} size={20} color={isDestructive ? colors.danger : colors.primary} />
        </View>
        <Text style={[styles.itemText, { color: isDestructive ? colors.danger : theme.text }]}>{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={theme.icon} />
    </TouchableOpacity>
  );

  return (
    <>
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, spacing.xxl) + 120, paddingTop: Math.max(insets.top, spacing.lg) }}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View entering={FadeInDown.springify()} style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(100).springify()}>
        <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>Preferences</Text>
        <TouchableOpacity style={[styles.item, { backgroundColor: theme.card, borderColor: theme.border }]} onPress={toggleDarkMode} activeOpacity={0.8}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
            <View style={[styles.iconBox, { backgroundColor: colors.accent + '15' }]}>
              <Ionicons name="moon" size={20} color={colors.accent} />
            </View>
            <Text style={[styles.itemText, { color: theme.text }]}>Dark Mode</Text>
          </View>
          <Switch 
            value={colorScheme === 'dark'} 
            onValueChange={toggleDarkMode} 
            trackColor={{ true: colors.primary, false: '#CBD5E1' }} 
            thumbColor={'#fff'}
          />
        </TouchableOpacity>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200).springify()} style={{ marginTop: spacing.lg }}>
        <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>Legal & Info</Text>
        {renderItem('Privacy Policy', 'document-text', () => router.push('/privacy'))}
        {renderItem('Terms & Conditions', 'newspaper', () => router.push('/terms'))}
      </Animated.View>
      
      <Animated.View entering={FadeInDown.delay(300).springify()} style={{ marginTop: spacing.lg }}>
        <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>Data</Text>
        {renderItem('Clear History', 'trash', handleClearHistory, true)}
      </Animated.View>
      
      <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.footerInfo}>
        <View style={{ opacity: 0.5, alignItems: 'center' }}>
          <Text style={{ color: theme.textSecondary, fontWeight: '600' }}>QR Master v1.0.0</Text>
        </View>
      </Animated.View>
    </ScrollView>

    <Modal visible={showClearModal} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={[styles.modalIconBox, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
            <Ionicons name="warning" size={32} color={colors.danger} />
          </View>
          <Text style={[styles.modalTitle, { color: theme.text }]}>Clear History</Text>
          <Text style={[styles.modalDesc, { color: theme.textSecondary }]}>Are you sure you want to delete all scanned and generated QR codes? This cannot be undone.</Text>
          
          <View style={styles.modalActions}>
            <TouchableOpacity style={[styles.modalBtn, { backgroundColor: theme.background }]} onPress={() => setShowClearModal(false)}>
              <Text style={[styles.modalBtnText, { color: theme.text }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalBtn, { backgroundColor: colors.danger }]} onPress={executeClearHistory}>
              <Text style={[styles.modalBtnText, { color: '#fff' }]}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: spacing.lg },
  header: { marginBottom: spacing.xl },
  title: { fontSize: 32, fontWeight: '900', letterSpacing: -1 },
  
  sectionHeader: { fontSize: 14, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: spacing.sm, marginLeft: spacing.xs, letterSpacing: 1 },
  item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.md, borderRadius: 16, borderWidth: 1, marginBottom: spacing.sm },
  iconBox: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  itemText: { fontSize: 16, fontWeight: '600' },
  
  footerInfo: { marginTop: spacing.xl, alignItems: 'center' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  modalContent: { width: '100%', padding: spacing.xl, borderRadius: 24, borderWidth: 1, alignItems: 'center' },
  modalIconBox: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.md },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: spacing.sm },
  modalDesc: { fontSize: 14, textAlign: 'center', marginBottom: spacing.xl, lineHeight: 20 },
  modalActions: { flexDirection: 'row', gap: spacing.md },
  modalBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  modalBtnText: { fontSize: 16, fontWeight: 'bold' }
});
