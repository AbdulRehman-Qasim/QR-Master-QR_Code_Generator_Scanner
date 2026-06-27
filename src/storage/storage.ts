import AsyncStorage from '@react-native-async-storage/async-storage';
import { QRRecord, AppSettings } from '../types';

const SCANNED_HISTORY_KEY = '@qrmaster_scanned_history';
const GENERATED_HISTORY_KEY = '@qrmaster_generated_history';
const SETTINGS_KEY = '@qrmaster_settings';
const ONBOARDING_KEY = '@qrmaster_onboarding_completed';

export const storage = {
  // Scanned History
  getScannedHistory: async (): Promise<QRRecord[]> => {
    try {
      const data = await AsyncStorage.getItem(SCANNED_HISTORY_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to get scanned history', e);
      return [];
    }
  },
  
  saveScannedHistory: async (records: QRRecord[]): Promise<void> => {
    try {
      await AsyncStorage.setItem(SCANNED_HISTORY_KEY, JSON.stringify(records));
    } catch (e) {
      console.error('Failed to save scanned history', e);
    }
  },

  addScannedRecord: async (record: QRRecord): Promise<void> => {
    const history = await storage.getScannedHistory();
    await storage.saveScannedHistory([record, ...history]);
  },

  // Generated History
  getGeneratedHistory: async (): Promise<QRRecord[]> => {
    try {
      const data = await AsyncStorage.getItem(GENERATED_HISTORY_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to get generated history', e);
      return [];
    }
  },
  
  saveGeneratedHistory: async (records: QRRecord[]): Promise<void> => {
    try {
      await AsyncStorage.setItem(GENERATED_HISTORY_KEY, JSON.stringify(records));
    } catch (e) {
      console.error('Failed to save generated history', e);
    }
  },

  addGeneratedRecord: async (record: QRRecord): Promise<void> => {
    const history = await storage.getGeneratedHistory();
    await storage.saveGeneratedHistory([record, ...history]);
  },

  // Settings
  getSettings: async (): Promise<AppSettings> => {
    const defaultSettings: AppSettings = {
      theme: 'system',
      vibrationEnabled: true,
      saveHistory: true,
      openLinksAutomatically: false,
    };
    try {
      const data = await AsyncStorage.getItem(SETTINGS_KEY);
      return data ? { ...defaultSettings, ...JSON.parse(data) } : defaultSettings;
    } catch (e) {
      return defaultSettings;
    }
  },
  
  saveSettings: async (settings: AppSettings): Promise<void> => {
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings', e);
    }
  },

  // Onboarding
  isOnboardingCompleted: async (): Promise<boolean> => {
    try {
      const data = await AsyncStorage.getItem(ONBOARDING_KEY);
      return data === 'true';
    } catch (e) {
      return false;
    }
  },
  
  setOnboardingCompleted: async (completed: boolean): Promise<void> => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, completed ? 'true' : 'false');
    } catch (e) {
      console.error('Failed to save onboarding status', e);
    }
  }
};
