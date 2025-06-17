
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.0104ad5751124547bf3c092c7fdb1b88',
  appName: 'MI CAMPAÑA 2025',
  webDir: 'dist',
  server: {
    url: 'https://0104ad57-5112-4547-bf3c-092c7fdb1b88.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1e40af',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false
    }
  }
};

export default config;
