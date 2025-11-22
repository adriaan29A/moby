import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

// Global function that can be called from nav.js
let celebrationCallback = null;
let isCelebrating = false; // Prevent multiple simultaneous celebrations

// Detect Android WebView for performance optimizations
function isAndroidWebView() {
  const ua = navigator.userAgent || navigator.vendor || window.opera;
  return /android/i.test(ua) && /wv/i.test(ua);
}

export function showWinCelebration(message = "You Won!") {
  console.log('showWinCelebration called:', message, 'callback:', !!celebrationCallback, 'isCelebrating:', isCelebrating);
  if (celebrationCallback && !isCelebrating) {
    celebrationCallback(message);
  } else if (!celebrationCallback) {
    console.warn('Celebration callback not registered yet');
  } else if (isCelebrating) {
    console.warn('Celebration already in progress');
  }
}

export function Celebration() {
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("You Won!");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Register the callback so showWinCelebration() can trigger it
    celebrationCallback = (msg) => {
      if (isCelebrating) {
        console.log('Celebration already in progress, skipping');
        return; // Prevent duplicate triggers
      }
      isCelebrating = true;
      console.log('Starting celebration with message:', msg);
      
      // Reset and show container immediately
      setMessage(msg);
      setShowMessage(false); // Start with message hidden
      setIsVisible(true); // Show container immediately
      
      // Optimize for Android WebView - use lighter settings
      const isAndroid = isAndroidWebView();
      const confettiDuration = 4000; // Confetti runs for 4 seconds
      const messageDisplayDuration = 11000; // Message stays visible for 11 seconds total
      const animationEnd = Date.now() + confettiDuration;
      
      // Use lighter settings for Android to prevent freezing
      const defaults = isAndroid 
        ? { startVelocity: 20, spread: 360, ticks: 40, zIndex: 10000, particleCount: 20 } // Lighter for Android
        : { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };
      
      const intervalMs = isAndroid ? 400 : 250; // Slower interval for Android
      const maxParticleCount = isAndroid ? 30 : 50; // Fewer particles for Android

      function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
      }

      // Show message sooner on Android to ensure it's visible even if confetti struggles
      const messageDelay = isAndroid ? 200 : 500;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTimeout(() => {
            console.log('Showing message - setting showMessage to true');
            setShowMessage(true);
          }, messageDelay);
        });
      });

      // Use requestAnimationFrame-based animation for better performance on Android
      let animationFrameId = null;
      let lastFrameTime = Date.now();
      let fallbackTimeout = null;
      let hideTimeout = null;
      
      function animateConfetti() {
        const now = Date.now();
        const timeLeft = animationEnd - now;
        
        // Throttle to intervalMs to prevent too many calls
        if (now - lastFrameTime >= intervalMs) {
          if (timeLeft > 0) {
            try {
              const particleCount = Math.floor(maxParticleCount * (timeLeft / confettiDuration));
              
              // Launch confetti from left
              confetti({
                ...defaults,
                particleCount: isAndroid ? particleCount : undefined, // Use explicit count for Android
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
              });
              
              // Launch confetti from right (skip on Android to reduce load)
              if (!isAndroid) {
                confetti({
                  ...defaults,
                  particleCount,
                  origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
                });
              }
              
              lastFrameTime = now;
            } catch (error) {
              console.error('Confetti error:', error);
              // Continue even if confetti fails
            }
          } else {
            // Animation complete
            if (animationFrameId) {
              cancelAnimationFrame(animationFrameId);
              animationFrameId = null;
            }
            return;
          }
        }
        
        // Continue animation
        animationFrameId = requestAnimationFrame(animateConfetti);
      }
      
      // Start animation
      animationFrameId = requestAnimationFrame(animateConfetti);
      
      // Fallback cleanup in case animation doesn't complete
      fallbackTimeout = setTimeout(() => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      }, confettiDuration + 1000);

      // Hide after message display duration (longer than confetti so message stays visible)
      hideTimeout = setTimeout(() => {
        console.log('Hiding celebration');
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
        if (fallbackTimeout) {
          clearTimeout(fallbackTimeout);
          fallbackTimeout = null;
        }
        setIsVisible(false);
        setShowMessage(false);
        isCelebrating = false;
      }, messageDisplayDuration);
    };

    console.log('Celebration component mounted, callback registered');
    
    // Cleanup
    return () => {
      console.log('Celebration component unmounting');
      celebrationCallback = null;
      isCelebrating = false;
    };
  }, []);

  // Debug: log current state
  useEffect(() => {
    if (isVisible || showMessage) {
      console.log('Celebration render - isVisible:', isVisible, 'showMessage:', showMessage, 'message:', message);
    }
  }, [isVisible, showMessage, message]);

  // Always render but control visibility - this ensures transitions work
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10000,
        pointerEvents: 'none',
        visibility: isVisible ? 'visible' : 'hidden',
      }}
    >
      <div
        style={{
          background: 'rgba(0, 0, 0, 0.8)',
          padding: '2rem 3rem',
          borderRadius: '1rem',
          textAlign: 'center',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
          border: '2px solid #98c9ff',
          opacity: showMessage ? 1 : 0,
          transform: showMessage ? 'scale(1)' : 'scale(0.95)',
          transition: 'opacity 0.8s ease-in, transform 0.8s ease-out',
          willChange: 'opacity, transform',
        }}
      >
        <h1
          style={{
            color: '#98c9ff',
            fontSize: '3rem',
            fontWeight: 'bold',
            margin: 0,
            textShadow: '0 0 10px rgba(152, 201, 255, 0.5)',
            fontFamily: 'monospace, Courier, Arial, Helvetica, sans-serif',
          }}
        >
          {message}
        </h1>
      </div>
    </div>
  );
}

