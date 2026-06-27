import { useSyncExternalStore } from 'react';
import { Appearance } from 'react-native';

interface ThemeState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const colorScheme = Appearance.getColorScheme();
let globalTheme: 'light' | 'dark' = (colorScheme === 'dark' || colorScheme === 'light') ? colorScheme : 'light';
const listeners = new Set<() => void>();

const toggleTheme = () => {
  globalTheme = globalTheme === 'light' ? 'dark' : 'light';
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const getSnapshot = () => globalTheme;

export function useThemeStore(selector: (state: ThemeState) => any) {
  const theme = useSyncExternalStore(subscribe, getSnapshot);
  return selector({ theme, toggleTheme });
}
