import { useThemeStore } from '../../store/useThemeStore';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity,  KeyboardAvoidingView, Platform } from 'react-native';
import { colors, spacing, borderRadius } from '../../theme/theme';
import { useState, useRef } from 'react';
import QRCode from 'react-native-qrcode-svg';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { storage } from '../../storage/storage';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeInDown, Layout } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const QR_TYPES = [
  { id: 'url', label: 'Website', icon: 'globe-outline' },
  { id: 'text', label: 'Text', icon: 'text-outline' },
  { id: 'phone', label: 'Phone', icon: 'call-outline' },
  { id: 'email', label: 'Email', icon: 'mail-outline' },
  { id: 'wifi', label: 'Wi-Fi', icon: 'wifi-outline' }
];

export default function Generate() {
  const colorScheme = useThemeStore((s: any) => s.theme) as 'light' | 'dark';
  const theme = colors[colorScheme];
  const [activeType, setActiveType] = useState('url');
  const [text, setText] = useState('');
  let svgRef: any = useRef(null);
  const insets = useSafeAreaInsets();

  const getQRValue = () => {
    if (!text) return 'https://qrmaster.app';
    if (activeType === 'phone') return `tel:${text}`;
    if (activeType === 'email') return `mailto:${text}`;
    if (activeType === 'wifi') return `WIFI:T:WPA;S:${text};P:;;`; // Simplified WiFi
    return text;
  };

  const handleShare = async () => {
    if (!svgRef.current) return;
    svgRef.current.toDataURL(async (data: string) => {
      const path = FileSystem.cacheDirectory + 'qr_master_' + Date.now() + '.png';
      await FileSystem.writeAsStringAsync(path, data, { encoding: FileSystem.EncodingType.Base64 });
      await Sharing.shareAsync(path);
      
      const record = {
        id: Date.now().toString(),
        type: activeType as any,
        content: text,
        date: new Date().toISOString(),
        isFavorite: false,
      };
      await storage.addGeneratedRecord(record);
    });
  };

  const getPlaceholder = () => {
    switch (activeType) {
      case 'url': return 'https://example.com';
      case 'phone': return '+1 234 567 8900';
      case 'email': return 'hello@example.com';
      case 'wifi': return 'Network Name (SSID)';
      default: return 'Enter your text here...';
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView 
        style={[styles.container, { backgroundColor: theme.background }]}
        contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, spacing.xxl) + 120, paddingTop: Math.max(insets.top, spacing.lg) }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInUp.springify()} style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Create QR</Text>
        </Animated.View>

        <View style={styles.typeSelector}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.sm }}>
            {QR_TYPES.map((type) => {
              const isActive = activeType === type.id;
              return (
                <TouchableOpacity 
                  key={type.id} 
                  style={[
                    styles.typeChip, 
                    { backgroundColor: isActive ? colors.primary : theme.card, borderColor: isActive ? colors.primary : theme.border }
                  ]}
                  onPress={() => { setActiveType(type.id); setText(''); }}
                >
                  <Ionicons name={type.icon as any} size={18} color={isActive ? '#fff' : theme.icon} />
                  <Text style={[styles.typeLabel, { color: isActive ? '#fff' : theme.textSecondary }]}>{type.label}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <Animated.View layout={Layout.springify()} entering={FadeInDown.springify()} style={styles.contentArea}>
          <View style={[styles.qrShowcase, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.qrWrapper}>
              <QRCode
                value={getQRValue()}
                size={220}
                color={colorScheme === 'dark' ? '#fff' : '#000'}
                backgroundColor={theme.card}
                getRef={(c) => (svgRef.current = c)}
                quietZone={10}
              />
            </View>
          </View>
          
          <View style={styles.inputSection}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>Data Content</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
              value={text}
              onChangeText={setText}
              placeholder={getPlaceholder()}
              placeholderTextColor={theme.textSecondary}
              multiline={activeType === 'text'}
              keyboardType={activeType === 'phone' ? 'phone-pad' : activeType === 'email' ? 'email-address' : 'default'}
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity style={[styles.primaryButton, { backgroundColor: colors.primary }]} onPress={handleShare}>
            <Ionicons name="share-outline" size={24} color="#fff" />
            <Text style={styles.primaryButtonText}>Share & Save</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.md },
  title: { fontSize: 32, fontWeight: '900', letterSpacing: -1 },
  
  typeSelector: { marginBottom: spacing.xl },
  typeChip: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderRadius: 100, borderWidth: 1, gap: 6 },
  typeLabel: { fontSize: 14, fontWeight: '600' },
  
  contentArea: { paddingHorizontal: spacing.lg },
  qrShowcase: { padding: spacing.xl, borderRadius: 32, borderWidth: 1, alignItems: 'center', marginBottom: spacing.xl, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 5 },
  qrWrapper: { padding: spacing.sm, backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden' },
  
  inputSection: { marginBottom: spacing.xl },
  inputLabel: { fontSize: 16, fontWeight: '700', marginBottom: spacing.md },
  input: { borderWidth: 1, borderRadius: borderRadius.lg, padding: spacing.lg, fontSize: 16, minHeight: 60, textAlignVertical: 'top' },
  
  primaryButton: { flexDirection: 'row', padding: spacing.lg, borderRadius: borderRadius.full, alignItems: 'center', justifyContent: 'center', gap: spacing.sm, shadowColor: colors.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 8 },
  primaryButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});
