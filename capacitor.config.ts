
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.micampana.electoral2025',
  appName: 'MI CAMPAÑA 2025',
  webDir: 'dist',
  server: {
    url: 'https://0104ad57-5112-4547-bf3c-092c7fdb1b88.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: '#1e40af',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: true,
      spinnerColor: '#ffffff'
    },
    StatusBar: {
      style: 'light',
      backgroundColor: '#1e40af'
    },
    Keyboard: {
      resize: 'body',
      style: 'light'
    },
    App: {
      launchAutoHide: false
    }
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true
  },
  ios: {
    contentInset: 'automatic',
    scrollEnabled: true,
    preferredContentMode: 'mobile'
  }
};

export default config;
