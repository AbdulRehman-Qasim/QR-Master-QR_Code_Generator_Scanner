export type QRType = 'text' | 'url' | 'phone' | 'email' | 'sms' | 'wifi' | 'contact' | 'event' | 'location' | 'social';

export interface QRRecord {
  id: string;
  type: QRType;
  content: string;
  date: string;
  isFavorite: boolean;
  name?: string;
  metadata?: any;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  vibrationEnabled: boolean;
  saveHistory: boolean;
  openLinksAutomatically: boolean;
}
