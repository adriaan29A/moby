import React, { useState, useRef, useEffect } from 'react';

// Detect if device supports touch
function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

export function Tooltip({ children, cost, syns, text }) {
  const [show, setShow] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const timeoutRef = useRef(null);
  const touchStartTimeRef = useRef(null);
  const buttonRef = useRef(null);
  const tooltipRef = useRef(null);
  const isTouch = isTouchDevice();

  // Long press threshold (500ms)
  const LONG_PRESS_DURATION = 500;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Position tooltip relative to button - close to the button
  const updatePosition = () => {
    if (!buttonRef.current || !tooltipRef.current) return;

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();

    // Position directly above the button, very close (2px gap)
    // Center horizontally on the button
    // Use viewport coordinates (getBoundingClientRect gives viewport coords)
    const top = buttonRect.top - tooltipRect.height - 2; // 2px gap - very close
    const left = buttonRect.left + (buttonRect.width / 2) - (tooltipRect.width / 2);

    // Only adjust if tooltip would go completely off screen edges
    // Otherwise, allow it to partially obscure other content
    const adjustedLeft = Math.max(4, Math.min(left, window.innerWidth - tooltipRect.width - 4));
    
    // Prefer above, but show below if not enough space at top of viewport
    const adjustedTop = top < 4
      ? buttonRect.bottom + 2 // Show below if not enough space above viewport
      : top;

    setPosition({ top: adjustedTop, left: adjustedLeft });
  };

  const showTooltip = () => {
    setShow(true);
    // Use multiple requestAnimationFrame calls to ensure DOM is fully updated
    // and tooltip dimensions are available before positioning
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          updatePosition();
        });
      });
    });
  };

  const hideTooltip = () => {
    setShow(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    touchStartTimeRef.current = null;
  };

  // Desktop: hover events
  const handleMouseEnter = () => {
    if (!isTouch) {
      timeoutRef.current = setTimeout(() => {
        showTooltip();
      }, 300); // Small delay for hover (300ms)
    }
  };

  const handleMouseLeave = () => {
    if (!isTouch) {
      hideTooltip();
    }
  };

  // Mobile: touch events for long press
  const handleTouchStart = (e) => {
    if (isTouch) {
      touchStartTimeRef.current = Date.now();
      // Don't preventDefault here - allow scrolling
      // Only prevent click if it becomes a long press
      
      timeoutRef.current = setTimeout(() => {
        showTooltip();
        // Provide haptic feedback if available
        if (navigator.vibrate) {
          navigator.vibrate(10);
        }
      }, LONG_PRESS_DURATION);
    }
  };

  const handleTouchEnd = (e) => {
    if (isTouch) {
      const touchDuration = Date.now() - (touchStartTimeRef.current || 0);
      
      if (touchDuration < LONG_PRESS_DURATION) {
        // Short press - hide tooltip and allow normal click behavior
        hideTooltip();
        // Don't prevent default - let the click event fire normally
      } else {
        // Long press completed - tooltip is shown, prevent click
        e.preventDefault();
        e.stopPropagation();
      }
    }
  };
  
  // Handle tap outside to dismiss tooltip on mobile
  useEffect(() => {
    if (show && isTouch) {
      const handleTouchOutside = (e) => {
        if (tooltipRef.current && !tooltipRef.current.contains(e.target) &&
            buttonRef.current && !buttonRef.current.contains(e.target)) {
          hideTooltip();
        }
      };
      
      // Use a small delay to avoid immediate dismissal
      const timeout = setTimeout(() => {
        document.addEventListener('touchstart', handleTouchOutside);
      }, 100);
      
      return () => {
        clearTimeout(timeout);
        document.removeEventListener('touchstart', handleTouchOutside);
      };
    }
  }, [show, isTouch]);

  const handleTouchCancel = () => {
    if (isTouch) {
      hideTooltip();
    }
  };

  // Update position when tooltip is shown and window resizes
  useEffect(() => {
    if (show) {
      // Update position after tooltip is rendered
      const updateTimeout = setTimeout(() => {
        requestAnimationFrame(() => {
          updatePosition();
        });
      }, 0);
      
      const handleResize = () => {
        requestAnimationFrame(() => {
          updatePosition();
        });
      };
      const handleScroll = () => {
        requestAnimationFrame(() => {
          updatePosition();
        });
      };
      
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleScroll, true);
      
      return () => {
        clearTimeout(updateTimeout);
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll, true);
      };
    }
  }, [show]);

  // Clone children and add event handlers
  const childWithHandlers = React.cloneElement(children, {
    ref: (node) => {
      buttonRef.current = node;
      // Preserve any existing ref from children
      const childRef = children.ref;
      if (childRef) {
        if (typeof childRef === 'function') {
          childRef(node);
        } else if (childRef && typeof childRef === 'object') {
          childRef.current = node;
        }
      }
    },
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
    onTouchCancel: handleTouchCancel,
  });

  return (
    <>
      {childWithHandlers}
      {show && (
        <div
          ref={tooltipRef}
          style={{
            position: 'fixed',
            top: `${position.top}px`,
            left: `${position.left}px`,
            background: 'rgba(0, 0, 0, 0.9)',
            border: '1px solid #fff',
            borderRadius: '4px',
            padding: '8px 12px',
            color: '#98c9ff',
            fontSize: '14px',
            fontFamily: 'monospace, Courier, Arial, Helvetica, sans-serif',
            whiteSpace: 'nowrap',
            zIndex: 10001,
            pointerEvents: 'none',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
            lineHeight: '1.4',
            textAlign: 'left',
          }}
          onTouchStart={(e) => e.preventDefault()} // Prevent touch events on tooltip
        >
          <div>${cost.toLocaleString()}</div>
          <div>{syns} links</div>
        </div>
      )}
    </>
  );
}

