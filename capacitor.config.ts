
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
      spinnerColor: '#ffffff',
      launchAutoHide: true
    },
    StatusBar: {
      style: 'light',
      backgroundColor: '#1e40af',
      overlay: false
    },
    Keyboard: {
      resize: 'body',
      style: 'light',
      resizeOnFullScreen: true
    },
    App: {
      launchAutoHide: false
    },
    Device: {
      enabled: true
    },
    Network: {
      enabled: true
    },
    Storage: {
      enabled: true
    },
    Geolocation: {
      enabled: true
    },
    Camera: {
      enabled: true
    },
    LocalNotifications: {
      enabled: true,
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#1e40af'
    },
    PushNotifications: {
      enabled: true
    }
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false,
    loggingBehavior: 'production',
    minWebViewVersion: 70,
    flavor: 'main',
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
      releaseType: 'AAB',
      signingType: 'apksigner'
    },
    appendUserAgent: 'MiCampana2025/2.0.0'
  },
  ios: {
    contentInset: 'automatic',
    scrollEnabled: true,
    preferredContentMode: 'mobile',
    allowsLinkPreview: false,
    handleApplicationURL: true,
    appendUserAgent: 'MiCampana2025/2.0.0'
  }
};

export default config;
