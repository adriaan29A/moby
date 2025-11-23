package com.adriaan29a.moby;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebSettings;
import androidx.webkit.WebViewAssetLoader;
import androidx.activity.OnBackPressedCallback;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {
    private static final String TAG = "MainActivity";
    private WebView webView;
    private View splashScreen;
    private Handler mainHandler;
    private boolean splashHidden = false;

    @Override
    @SuppressLint("SetJavaScriptEnabled") // Safe: we control the content (local assets or our own GitHub Pages)
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        mainHandler = new Handler(Looper.getMainLooper()); // Handler(Looper) is the recommended approach
        
        // Action bar is already hidden via NoActionBar theme in styles.xml
        // No need to programmatically hide it
        
        setContentView(R.layout.activity_main);

        webView = findViewById(R.id.webview);
        splashScreen = findViewById(R.id.splash_screen);
        
        // Check for null references to prevent crashes
        if (webView == null) {
            throw new RuntimeException("WebView not found in layout");
        }
        if (splashScreen == null) {
            Log.e(TAG, "Splash screen not found in layout");
        } else {
            // Ensure splash screen is visible initially
            splashScreen.setVisibility(View.VISIBLE);
        }
        
        // Configure WebView settings BEFORE setting WebViewClient
        WebSettings webSettings = webView.getSettings();
        // Enable JavaScript - required for React app to function
        // This is safe because we control the content (local assets or our own GitHub Pages)
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setLoadWithOverviewMode(true);
        webSettings.setUseWideViewPort(true);
        webSettings.setBuiltInZoomControls(true);
        webSettings.setDisplayZoomControls(false);
        webSettings.setSupportZoom(true);
        webSettings.setDefaultTextEncodingName("utf-8");
        
        // Set WebView background to black to match app theme
        // This prevents white flash when loading
        webView.setBackgroundColor(0xFF000000); // Black background
        
        // Disable text selection to prevent Android's default selection handler
        // This allows our custom tooltip to work without interference

        // Android suggested a lambda instead of a method call on an object.
        // I took it's suggestion!
        webView.setOnLongClickListener(v -> {
            // Return true to consume the long click and prevent default text selection
            return true;
        });
        
        // Performance optimizations: Enable aggressive caching and database storage
        // This allows the WebView to use cached resources (like nodes.json and graph.json)
        // instead of re-downloading them on every launch, significantly improving load times
        webSettings.setDatabaseEnabled(true);
        
        // Add JavaScript interface so React app can notify when it's fully loaded
        // This must be done BEFORE setting WebViewClient
        // Note: onAppReady() is called from JavaScript (src/main.jsx), not from Java code
        // Android Studio may show a warning, but this is a false positive - the method IS used
        webView.addJavascriptInterface(new Object() {
            @JavascriptInterface
            @SuppressWarnings("unused") // Suppress warning - method is called from JavaScript
            public void onAppReady() {
                Log.d(TAG, "React app is ready and rendered - hiding splash screen");
                mainHandler.post(() -> {
                    // Wait a bit more to ensure rendering is complete
                    mainHandler.postDelayed(() -> hideSplashScreen(), 300);
                });
            }
            
            @JavascriptInterface
            @SuppressWarnings("unused")
            public void logError(String message) {
                Log.e(TAG + "_JS", "JavaScript error: " + message);
            }
        }, "AndroidApp");
        
        // Enable hardware acceleration for better canvas performance (important for confetti)
        // Use try-catch to handle devices that don't support hardware acceleration
        try {
            webView.setLayerType(View.LAYER_TYPE_HARDWARE, null);
        } catch (Exception e) {
            // Fallback to software rendering if hardware acceleration fails
            try {
                webView.setLayerType(View.LAYER_TYPE_SOFTWARE, null);
            } catch (Exception e2) {
                // If both fail, continue without explicit layer type
            }
        }
        
        // Set WebChromeClient to track loading progress and capture console errors
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                super.onProgressChanged(view, newProgress);
                Log.d(TAG, "Loading progress: " + newProgress + "%");
                // Don't hide splash based on progress alone - wait for React app to signal ready
            }
            
            @Override
            public boolean onConsoleMessage(android.webkit.ConsoleMessage consoleMessage) {
                String message = consoleMessage.message();
                String sourceId = consoleMessage.sourceId();
                int lineNumber = consoleMessage.lineNumber();
                
                android.webkit.ConsoleMessage.MessageLevel level = consoleMessage.messageLevel();
                String logTag = TAG + "_JS";
                
                switch (level) {
                    case ERROR:
                        Log.e(logTag, "[" + sourceId + ":" + lineNumber + "] " + message);
                        break;
                    case WARNING:
                        Log.w(logTag, "[" + sourceId + ":" + lineNumber + "] " + message);
                        break;
                    default:
                        Log.d(logTag, "[" + sourceId + ":" + lineNumber + "] " + message);
                        break;
                }
                return true; // Message handled
            }
        });
        
        // Create WebViewAssetLoader to serve local assets via https:// scheme
        // This is required for ES modules to work (file:// URLs don't support ES modules due to CORS)
        WebViewAssetLoader assetLoader = new WebViewAssetLoader.Builder()
            .setDomain("appassets.androidplatform.net")
            .addPathHandler("/", new WebViewAssetLoader.AssetsPathHandler(this))
            .build();
        
        // Set WebViewClient AFTER configuring settings
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public android.webkit.WebResourceResponse shouldInterceptRequest(WebView view, android.webkit.WebResourceRequest request) {
                // Use WebViewAssetLoader to serve local assets via https:// scheme
                // This allows ES modules to work properly
                android.net.Uri uri = request.getUrl();
                Log.d(TAG, "Intercepting request: " + uri);
                android.webkit.WebResourceResponse response = assetLoader.shouldInterceptRequest(uri);
                if (response == null) {
                    Log.w(TAG, "AssetLoader returned null for: " + uri);
                } else {
                    Log.d(TAG, "AssetLoader serving: " + uri + " (status: " + response.getStatusCode() + ")");
                }
                return response;
            }
            
            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                Log.d(TAG, "onPageFinished called for: " + url);
                // Don't hide splash here - wait for React app to signal it's ready via JavaScript interface
                // This ensures the app is actually rendered, not just the HTML loaded
            }
            
            @Override
            public void onReceivedError(WebView view, android.webkit.WebResourceRequest request, android.webkit.WebResourceError error) {
                super.onReceivedError(view, request, error);
                // getErrorCode() requires API 23+, so check version
                if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
                    Log.e(TAG, "WebView error: " + error.getErrorCode() + " - " + error.getDescription() + " for " + request.getUrl());
                } else {
                    Log.e(TAG, "WebView error for " + request.getUrl());
                }
                // Hide splash screen even on error after a delay
                mainHandler.postDelayed(() -> hideSplashScreen(), 1000);
            }
            
            @Override
            public void onReceivedHttpError(WebView view, android.webkit.WebResourceRequest request, android.webkit.WebResourceResponse errorResponse) {
                super.onReceivedHttpError(view, request, errorResponse);
                Log.e(TAG, "HTTP error: " + errorResponse.getStatusCode() + " for " + request.getUrl());
            }
            
            @Override
            @SuppressWarnings("deprecation") // favicon parameter is deprecated but still functional
            public void onPageStarted(WebView view, String url, android.graphics.Bitmap favicon) {
                super.onPageStarted(view, url, favicon);
                Log.d(TAG, "onPageStarted called for: " + url);
            }
        });
        
        // Fallback: hide splash screen after 8 seconds regardless of WebView state
        // This ensures splash screen is hidden even if WebView callbacks don't fire
        mainHandler.postDelayed(() -> {
            Log.w(TAG, "Fallback: hiding splash screen after timeout");
            hideSplashScreen();
        }, 8000);

        // Load from local assets for offline support, fallback to network URL
        // Use https:// scheme via WebViewAssetLoader (required for ES modules)
        // Check if local assets exist first
        String localUrl = "https://appassets.androidplatform.net/index.html";
        String networkUrl = "https://adriaan29a.github.io/moby";
        
        // Try to load from local assets first (for offline support)
        // If assets don't exist, fall back to network URL
        try {
            java.io.InputStream is = getAssets().open("index.html");
            is.close();
            // Local assets exist, load from there via WebViewAssetLoader
            Log.d(TAG, "Loading from local assets via WebViewAssetLoader: " + localUrl);
            // Use LOAD_DEFAULT for local files (not LOAD_CACHE_ONLY which prevents loading)
            webSettings.setCacheMode(WebSettings.LOAD_DEFAULT);
            webView.loadUrl(localUrl);
        } catch (java.io.IOException e) {
            // Local assets don't exist, load from network
            Log.d(TAG, "Local assets not found, loading from network: " + networkUrl);
            // Use cache-else-network to cache for future offline use
            webSettings.setCacheMode(WebSettings.LOAD_CACHE_ELSE_NETWORK);
            webView.loadUrl(networkUrl);
        }
        
        // Handle back button press (replaces deprecated onBackPressed)
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                if (webView.canGoBack()) {
                    webView.goBack();
                } else {
                    finish();
                }
            }
        });
    }
    
    private void hideSplashScreen() {
        if (splashHidden) {
            return; // Already hidden
        }
        if (splashScreen != null && splashScreen.getVisibility() == View.VISIBLE) {
            Log.d(TAG, "Hiding splash screen");
            splashScreen.setVisibility(View.GONE);
            splashHidden = true;
        }
    }
}