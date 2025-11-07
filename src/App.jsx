import { useEffect, useState } from "react"
import { NewTodoForm } from "./NewTodoForm"
import { TodoList } from "./TodoList" // remove ?
import { Synset } from "./Synset.jsx"
import { CreateNavigator } from "./nav.js"
import { random_node } from "./core.js"


//------------------------------------------------------------------------------
// Hooks
//
// Window Dims

// Windows dimensions

function getWindowDimensions() {
  // Use innerWidth/innerHeight for layout calculations (full viewport including UI chrome)
  // visualViewport excludes browser chrome and can cause layout to be calculated for smaller area
  // This is especially important in WebView where we need the full screen dimensions
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

function useWindowDimensions() {

	const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function updateDimensions() {
      const newDims = getWindowDimensions();
      // Debug logging for WebView orientation issues
      if (window.visualViewport) {
        console.log('Dimensions - inner:', newDims.width, 'x', newDims.height, 
                   'visualViewport:', window.visualViewport.width, 'x', window.visualViewport.height);
      } else {
        console.log('Dimensions - inner:', newDims.width, 'x', newDims.height);
      }
      setWindowDimensions(prevDims => {
        // Only update if dimensions actually changed (avoid unnecessary re-renders)
        if (prevDims.width !== newDims.width || prevDims.height !== newDims.height) {
          console.log('Dimensions changed from', prevDims.width, 'x', prevDims.height, 
                     'to', newDims.width, 'x', newDims.height);
          return newDims;
        }
        return prevDims;
      });
    }

    function handleResize() {
      updateDimensions();
    }

    function handleOrientationChange() {
      // On mobile devices/WebView, orientation change might not immediately update window dimensions
      // WebView can be slow, especially after first rotation - use longer delays and more checks
      const timeouts = [0, 50, 100, 200, 400, 600, 800, 1000, 1500, 2000];
      timeouts.forEach(delay => {
        setTimeout(updateDimensions, delay);
      });
      
      // Also use requestAnimationFrame for immediate next frame checks
      requestAnimationFrame(() => {
        updateDimensions();
        requestAnimationFrame(() => {
          updateDimensions();
        });
      });
      
      // Continuous check until dimensions stabilize (stop after 3 seconds)
      // This handles cases where WebView is very slow to update dimensions
      let checkCount = 0;
      const initialDims = getWindowDimensions();
      let lastWidth = initialDims.width;
      let lastHeight = initialDims.height;
      let stableCount = 0;
      const maxChecks = 30; // 30 checks over 3 seconds
      const stableThreshold = 3; // Stop after 3 consecutive stable checks
      
      const intervalId = setInterval(() => {
        checkCount++;
        const currentDims = getWindowDimensions();
        
        // Check if dimensions have changed
        if (currentDims.width !== lastWidth || currentDims.height !== lastHeight) {
          // Dimensions changed, update and reset stable counter
          lastWidth = currentDims.width;
          lastHeight = currentDims.height;
          stableCount = 0;
          updateDimensions();
        } else {
          // Dimensions are stable
          stableCount++;
        }
        
        // Stop if dimensions have been stable or max checks reached
        if (checkCount >= maxChecks || stableCount >= stableThreshold) {
          clearInterval(intervalId);
        }
      }, 100);
    }

    // Use visualViewport API if available (better for mobile/WebView)
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleResize);
    }

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleOrientationChange);
    
    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", handleResize);
      }
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleOrientationChange);
    };
  }, [] );

  return windowDimensions;
}

// performance timer hook

/*
import React, { useState, useEffect } from 'react';

function MyComponent() {
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    const startTime = performance.now();

    const intervalId = setInterval(() => {
      const endTime = performance.now();
      setTimeElapsed(endTime - startTime);
    }, 1000); // Update every 1 second

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  return (
    <div>
      Time elapsed: {timeElapsed / 1000} seconds
    </div>
  );
}
*/


/*


*/




//------------------------------------------------------------------------------
// App


export default function App() {

	var nav = CreateNavigator();

	const [navctx, setNavctx] = useState(() => {
		const localValue = localStorage.getItem("NAVCTX26")
		if (localValue == null) {
			console.log('localValue null')

			nav.current = nav.origin = random_node();
			nav.history = [nav.current];

			return nav.get();
		}
		return JSON.parse(localValue)
	})

	useEffect(() => {
		localStorage.setItem("NAVCTX26", JSON.stringify(navctx))
	}, [navctx])

	function setCtx(ctx) {
		setNavctx((navctx) => {return ctx });

	}

	// nav object is set and ready to go.
	nav.set(navctx);

	// Get the main window dimensions
	const extent = useWindowDimensions();

	// Create a key based on dimensions to force re-render when orientation changes
	// This ensures the layout is recalculated with the new aspect ratio
	const synsetKey = `${extent.width}x${extent.height}`;

	return (
		<>
		<Synset key={synsetKey} nav = {nav} extent = {extent} onClick = { setCtx } />
		<NewTodoForm nav = { nav } onSubmit = { setCtx } />
		</>
	)
}
