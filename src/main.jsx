import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Notify Android WebView when React app is fully loaded and rendered
// This allows the splash screen to stay visible until the app is actually ready
// Use multiple attempts in case the interface isn't ready immediately
let notifyAttempts = 0;
const MAX_NOTIFY_ATTEMPTS = 50; // Try for 5 seconds (50 * 100ms)

function notifyAndroidReady() {
  notifyAttempts++;
  
  if (window.AndroidApp && typeof window.AndroidApp.onAppReady === 'function') {
    try {
      window.AndroidApp.onAppReady();
      console.log('Notified Android app that React is ready');
      return; // Success, stop retrying
    } catch (e) {
      console.error('Error calling AndroidApp.onAppReady:', e);
      if (window.AndroidApp.logError) {
        window.AndroidApp.logError('Error calling onAppReady: ' + e.message);
      }
      // Retry after a delay if we haven't exceeded max attempts
      if (notifyAttempts < MAX_NOTIFY_ATTEMPTS) {
        setTimeout(notifyAndroidReady, 200);
      } else {
        console.error('Failed to notify Android app after', MAX_NOTIFY_ATTEMPTS, 'attempts');
      }
      return;
    }
  }
  
  // Interface not ready yet, retry
  if (notifyAttempts < MAX_NOTIFY_ATTEMPTS) {
    setTimeout(notifyAndroidReady, 100);
  } else {
    console.error('AndroidApp interface not available after', MAX_NOTIFY_ATTEMPTS, 'attempts');
    // Fallback: try to hide splash screen anyway after a delay
    // This handles cases where the interface might not be available
    setTimeout(() => {
      if (window.AndroidApp && typeof window.AndroidApp.onAppReady === 'function') {
        try {
          window.AndroidApp.onAppReady();
        } catch (e) {
          console.error('Final attempt to notify Android failed:', e);
        }
      }
    }, 1000);
  }
}

// Wait for React to finish initial render, then notify Android
// Use requestAnimationFrame to ensure DOM is ready
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    setTimeout(notifyAndroidReady, 200);
  });
});
