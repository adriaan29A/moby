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
function notifyAndroidReady() {
  if (window.AndroidApp && typeof window.AndroidApp.onAppReady === 'function') {
    try {
      window.AndroidApp.onAppReady();
      console.log('Notified Android app that React is ready');
    } catch (e) {
      console.error('Error calling AndroidApp.onAppReady:', e);
      // Retry after a delay
      setTimeout(notifyAndroidReady, 200);
    }
  } else {
    // Interface not ready yet, retry
    setTimeout(notifyAndroidReady, 100);
  }
}

// Wait for React to finish initial render, then notify Android
setTimeout(notifyAndroidReady, 200);
