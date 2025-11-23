import React, { useState, useRef, useEffect } from 'react';

// Detect if device supports touch
function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

// Global tooltip management - ensures only one tooltip is visible at a time (both desktop and mobile)
// This prevents multiple tooltips from accumulating when quickly hovering/tapping synonyms
let activeTooltipHide = null;

export function Tooltip({ children, cost, syns, text }) {
  const [show, setShow] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const timeoutRef = useRef(null);
  const hideTimeoutRef = useRef(null);
  const touchStartTimeRef = useRef(null);
  const buttonRef = useRef(null);
  const tooltipRef = useRef(null);
  const isTouch = isTouchDevice();
  
  // Store a stable reference to the hide function for global access
  const hideTooltipRef = useRef(null);

  // Long press threshold (500ms)
  const LONG_PRESS_DURATION = 500;
  // Delay before hiding tooltip when mouse leaves (allows time to click link)
  const HIDE_DELAY = 2000; // 2 seconds

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
      // Clear global reference if this tooltip is the active one (both desktop and mobile)
      if (activeTooltipHide === hideTooltipRef.current) {
        activeTooltipHide = null;
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
    // Immediately hide any existing tooltip when showing a new one (both desktop and mobile)
    // This prevents multiple tooltips from accumulating when quickly hovering/tapping
    if (activeTooltipHide && activeTooltipHide !== hideTooltipRef.current) {
      activeTooltipHide(true); // Immediately hide previous tooltip
      activeTooltipHide = null;
    }
    
    // Register this tooltip's hide function as the active one
    activeTooltipHide = hideTooltipRef.current;
    
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

  const hideTooltip = (immediate = false) => {
    // Clear any pending hide timeout
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    
    // Clear global reference if this is the active tooltip (both desktop and mobile)
    if (activeTooltipHide === hideTooltipRef.current) {
      activeTooltipHide = null;
    }
    
    if (immediate) {
      setShow(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      touchStartTimeRef.current = null;
    } else {
      // Delay hiding to allow time to move mouse to tooltip and click link
      hideTimeoutRef.current = setTimeout(() => {
        setShow(false);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        touchStartTimeRef.current = null;
        hideTimeoutRef.current = null;
        // Clear global reference when hiding completes (both desktop and mobile)
        if (activeTooltipHide === hideTooltipRef.current) {
          activeTooltipHide = null;
        }
      }, HIDE_DELAY);
    }
  };
  
  // Store hideTooltip function in ref so it can be accessed globally
  // This must be done after hideTooltip is defined
  hideTooltipRef.current = hideTooltip;
  
  const cancelHide = () => {
    // Cancel any pending hide when mouse enters tooltip
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
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
      // Don't hide immediately - delay to allow moving mouse to tooltip
      hideTooltip(false);
    }
  };
  
  // Handle mouse entering the tooltip itself
  const handleTooltipMouseEnter = () => {
    if (!isTouch) {
      cancelHide(); // Cancel any pending hide
    }
  };
  
  // Handle mouse leaving the tooltip
  const handleTooltipMouseLeave = () => {
    if (!isTouch) {
      // Hide after delay when mouse leaves tooltip
      hideTooltip(false);
    }
  };

  // Mobile: touch events for long press
  const handleTouchStart = (e) => {
    if (isTouch) {
      touchStartTimeRef.current = Date.now();
      // Aggressively prevent default text selection behavior on Android
      e.preventDefault();
      e.stopPropagation();
      
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
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
        // Clear the timeout since we're ending early
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        // Don't prevent default - let the click event fire normally
      } else {
        // Long press completed - tooltip is shown, prevent click and text selection
        e.preventDefault();
        e.stopPropagation();
        // Prevent any default Android behavior
        e.stopImmediatePropagation();
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
    // Prevent text selection context menu on long press
    onContextMenu: (e) => {
      if (isTouch) {
        e.preventDefault();
      }
    },
    style: {
      ...children.props.style,
      // Additional inline styles to prevent selection
      WebkitUserSelect: 'none',
      MozUserSelect: 'none',
      msUserSelect: 'none',
      userSelect: 'none',
      WebkitTouchCallout: 'none',
      WebkitTapHighlightColor: 'transparent',
      // Prevent all touch gestures to avoid race conditions
      touchAction: 'none',
      msTouchAction: 'none',
    },
  });

  return (
    <>
      {childWithHandlers}
      {show && (
        <div
          ref={tooltipRef}
          onMouseEnter={handleTooltipMouseEnter}
          onMouseLeave={handleTooltipMouseLeave}
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
            pointerEvents: 'auto', // Allow clicks on the link
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
            lineHeight: '1.4',
            textAlign: 'left',
          }}
        >
          <div style={{ pointerEvents: 'none' }}>${cost.toLocaleString()}</div>
          <div style={{ pointerEvents: 'none' }}>{syns} links</div>
          <div style={{ 
            marginTop: '8px', 
            paddingTop: '8px', 
            borderTop: '1px solid rgba(255, 255, 255, 0.3)',
            pointerEvents: 'auto' // Allow clicks on the link
          }}>
            <a
              href={`https://en.m.wiktionary.org/wiki/${encodeURIComponent(text.replace(/\s+/g, '_'))}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                // Check if offline - if so, prevent navigation and show message
                if (!navigator.onLine) {
                  e.preventDefault();
                  alert('Wiktionary is not available offline');
                  return false;
                }
              }}
              style={{
                color: '#98c9ff',
                textDecoration: 'underline',
                fontSize: '12px',
                cursor: 'pointer',
                pointerEvents: 'auto',
              }}
            >
              Wiktionary
            </a>
          </div>
        </div>
      )}
    </>
  );
}

