// background.js - Service Worker for BTC Overlay Extension

let cachedBtcRate = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60 * 1000; // 1 minute in milliseconds

/**
 * Fetches the current BTC/USD rate from CoinGecko API.
 * Caches the result for CACHE_DURATION to avoid excessive API calls.
 * @returns {Promise<number|null>} The BTC/USD rate or null if fetching fails.
 */
async function fetchBtcRate() {
  const now = Date.now();
  // Check if cached rate is still valid
  if (cachedBtcRate !== null && (now - lastFetchTime < CACHE_DURATION)) {
    console.log('Using cached BTC rate:', cachedBtcRate);
    return cachedBtcRate;
  }

  console.log('Fetching new BTC rate...');
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (data && data.bitcoin && data.bitcoin.usd) {
      cachedBtcRate = data.bitcoin.usd;
      lastFetchTime = now;
      // Store in local storage for persistence across service worker restarts
      chrome.storage.local.set({ btcRate: cachedBtcRate, lastFetchTime: lastFetchTime });
      console.log('Fetched and cached new BTC rate:', cachedBtcRate);
      return cachedBtcRate;
    } else {
      console.error('Unexpected API response structure:', data);
      return null;
    }
  } catch (error) {
    console.error('Error fetching BTC rate:', error);
    return null;
  }
}

// Load cached rate and last fetch time on service worker startup
chrome.storage.local.get(['btcRate', 'lastFetchTime'], (result) => {
  if (result.btcRate) {
    cachedBtcRate = result.btcRate;
    lastFetchTime = result.lastFetchTime || 0;
    console.log('Loaded cached BTC rate from storage:', cachedBtcRate);
  }
});

// Listener for messages from content scripts or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getBtcRate') {
    fetchBtcRate().then(rate => {
      sendResponse({ btcRate: rate });
    }).catch(error => {
      console.error("Error in getBtcRate message handler:", error);
      sendResponse({ btcRate: null });
    });
    // Return true to indicate that sendResponse will be called asynchronously
    return true;
  } else if (request.action === 'refreshBtcRate') {
    // Force a refresh, bypassing cache
    lastFetchTime = 0; // Invalidate cache
    fetchBtcRate().then(rate => {
      sendResponse({ btcRate: rate });
    }).catch(error => {
      console.error("Error in refreshBtcRate message handler:", error);
      sendResponse({ btcRate: null });
    });
    return true;
  }
});

// Optional: Keep the service worker alive for a short period after startup
// This is generally not needed for simple message passing, but can be useful
// for ensuring initial fetch completes before content scripts request data.
// chrome.runtime.onInstalled.addListener(() => {
//   console.log('BTC Overlay installed.');
// });
