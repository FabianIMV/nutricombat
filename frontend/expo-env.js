// Minimal Expo setup - only for React Native, not web
if (typeof process !== 'undefined' && process.env) {
  process.env.EXPO_USE_FAST_RESOLVER = '1';
  process.env.METRO_CACHE_KEY = 'nutricombat-minimal';

  // Only run on React Native (not web)
  if (process.platform === 'darwin' && typeof require !== 'undefined') {
    try {
      process.setMaxListeners(20);
      
      // Override fs.watch to limit watchers
      const fs = require('fs');
      if (fs.watch) {
        const originalWatch = fs.watch;
        let watchCount = 0;
        const MAX_WATCHERS = 50;
        
        fs.watch = function(...args) {
          if (watchCount >= MAX_WATCHERS) {
            console.log('Skipping file watcher to prevent EMFILE');
            return { close: () => {} };
          }
          watchCount++;
          const watcher = originalWatch.apply(this, args);
          const originalClose = watcher.close;
          watcher.close = function() {
            watchCount--;
            originalClose.call(this);
          };
          return watcher;
        };
      }
    } catch (e) {
      // Ignore errors in web environment
      console.log('File watcher setup skipped for web');
    }
  }
}