import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

// Global function that can be called from nav.js
let celebrationCallback = null;
let isCelebrating = false; // Prevent multiple simultaneous celebrations

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
      setIsVisible(true); // Show container
      
      // Start confetti immediately
      const confettiDuration = 3000; // Confetti runs for 3 seconds
      const messageDisplayDuration = 7000; // Message stays visible for 7 seconds total
      const animationEnd = Date.now() + confettiDuration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };

      function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
      }

      // Show message after a short delay (500ms) so confetti starts first
      // Use a double requestAnimationFrame to ensure DOM is ready for transition
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setShowMessage(false); // Set to false first to ensure transition works
          setTimeout(() => {
            console.log('Showing message - setting showMessage to true');
            setShowMessage(true);
          }, 500);
        });
      });

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }

        const particleCount = 50 * (timeLeft / confettiDuration);
        
        // Launch confetti from left
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        
        // Launch confetti from right
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);

      // Hide after message display duration (longer than confetti so message stays visible)
      setTimeout(() => {
        console.log('Hiding celebration');
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
  // Use visibility and opacity for smoother transitions
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
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease-in, visibility 0.3s',
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
          transition: 'opacity 0.5s ease-in',
          transform: showMessage ? 'scale(1)' : 'scale(0.9)',
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

