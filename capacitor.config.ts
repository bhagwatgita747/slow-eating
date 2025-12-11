import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sloweating.app',
  appName: 'Slow Eating',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    Haptics: {
      // Haptics plugin configuration
    }
  }
};

export default config;
