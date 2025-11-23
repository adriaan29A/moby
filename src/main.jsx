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
  
  // Log errors to Android if interface is available
  const logToAndroid = (message) => {
    try {
      if (window.AndroidApp && window.AndroidApp.logError) {
        window.AndroidApp.logError(message);
      }
    } catch (e) {
      // Ignore errors logging to Android
    }
  };
  
  if (window.AndroidApp && typeof window.AndroidApp.onAppReady === 'function') {
    try {
      window.AndroidApp.onAppReady();
      console.log('Notified Android app that React is ready');
      return; // Success, stop retrying
    } catch (e) {
      const errorMsg = 'Error calling AndroidApp.onAppReady: ' + e.message + ' ' + e.stack;
      console.error(errorMsg);
      logToAndroid(errorMsg);
      // Retry after a delay if we haven't exceeded max attempts
      if (notifyAttempts < MAX_NOTIFY_ATTEMPTS) {
        setTimeout(notifyAndroidReady, 200);
      } else {
        const finalError = 'Failed to notify Android app after ' + MAX_NOTIFY_ATTEMPTS + ' attempts';
        console.error(finalError);
        logToAndroid(finalError);
      }
      return;
    }
  }
  
  // Interface not ready yet, retry
  if (notifyAttempts < MAX_NOTIFY_ATTEMPTS) {
    setTimeout(notifyAndroidReady, 100);
  } else {
    const errorMsg = 'AndroidApp interface not available after ' + MAX_NOTIFY_ATTEMPTS + ' attempts';
    console.error(errorMsg);
    logToAndroid(errorMsg);
    // Fallback: try to hide splash screen anyway after a delay
    // This handles cases where the interface might not be available
    setTimeout(() => {
      if (window.AndroidApp && typeof window.AndroidApp.onAppReady === 'function') {
        try {
          window.AndroidApp.onAppReady();
        } catch (e) {
          const finalError = 'Final attempt to notify Android failed: ' + e.message;
          console.error(finalError);
          logToAndroid(finalError);
        }
      }
    }, 1000);
  }
}

// Catch and log any errors during React initialization
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  if (window.AndroidApp && window.AndroidApp.logError) {
    try {
      window.AndroidApp.logError('Global error: ' + event.error.message + ' at ' + event.filename + ':' + event.lineno);
    } catch (e) {
      // Ignore
    }
  }
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  if (window.AndroidApp && window.AndroidApp.logError) {
    try {
      window.AndroidApp.logError('Unhandled rejection: ' + (event.reason?.message || event.reason));
    } catch (e) {
      // Ignore
    }
  }
});

// Wait for React to finish initial render, then notify Android
// Use requestAnimationFrame to ensure DOM is ready
try {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      setTimeout(notifyAndroidReady, 200);
    });
  });
} catch (e) {
  console.error('Error setting up Android notification:', e);
  if (window.AndroidApp && window.AndroidApp.logError) {
    try {
      window.AndroidApp.logError('Error setting up notification: ' + e.message);
    } catch (e2) {
      // Ignore
    }
  }
}
