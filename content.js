// content.js - Shows Bitcoin equivalent in an infotip on USD price highlight

let currentBtcRate = null;
let isExtensionEnabled = true;
let displayMode = 'btc'; // 'btc' or 'sats'
let infotipElement = null; // The bubble element
let infotipTimeout = null; // Timeout for hiding the infotip

// Regex to find dollar prices: $99.99, $1,250, etc.
// Changed to match the entire selected string for validation
const USD_PRICE_REGEX = /^\$\s?([0-9,]+(\.\d{1,2})?)$/;

// Debounce function to limit how often a function is called
function debounce(func, delay) {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), delay);
  };
}

/**
 * Fetches the current BTC rate from the background script.
 * @returns {Promise<number|null>} The BTC/USD rate.
 */
async function getBtcRate() {
  try {
    const response = await chrome.runtime.sendMessage({ action: 'getBtcRate' });
    return response.btcRate;
  } catch (error) {
    console.error('Error getting BTC rate from background:', error);
    return null;
  }
}

/**
 * Converts a USD value to Bitcoin (BTC) or Satoshis (sats).
 * @param {number} usdValue - The USD value.
 * @param {number} btcRate - The current BTC/USD rate.
 * @param {string} mode - 'btc' or 'sats'.
 * @returns {string} Formatted Bitcoin or Satoshi string.
 */
function convertUsdToBtc(usdValue, btcRate, mode) {
  if (!btcRate || btcRate === 0) {
    return ''; // Cannot convert without a rate
  }
  const btcValue = usdValue / btcRate;

  if (mode === 'sats') {
    const satsValue = btcValue * 100_000_000;
    return `${Math.round(satsValue).toLocaleString('en-US')} sats`;
  } else { // 'btc' mode
    // Format BTC with up to 8 decimals, removing trailing zeros if possible
    let formattedBtc = btcValue.toFixed(8);
    // Remove trailing zeros and decimal point if it becomes integer
    formattedBtc = parseFloat(formattedBtc).toString();
    return `₿${formattedBtc}`;
  }
}

/**
 * Creates and initializes the infotip element if it doesn't exist.
 */
function ensureInfotipElement() {
  if (!infotipElement) {
    infotipElement = document.createElement('div');
    infotipElement.id = 'btc-infotip';
    infotipElement.className = 'btc-infotip';
    infotipElement.style.position = 'absolute';
    infotipElement.style.zIndex = '99999'; // High z-index to be on top
    infotipElement.style.pointerEvents = 'none'; // Allow clicks to pass through
    infotipElement.style.display = 'none'; // Hidden by default
    document.body.appendChild(infotipElement);
  }
}

/**
 * Shows the infotip with the given text at the specified position.
 * @param {string} text - The text to display in the infotip.
 * @param {DOMRect} rect - The bounding rectangle of the selected text.
 */
function showInfotip(text, rect) {
  ensureInfotipElement();
  infotipElement.textContent = text;
  // Position the infotip slightly above and to the right of the selection
  // Adjusting top to be above the selection, considering scroll position
  infotipElement.style.left = `${rect.right + 5}px`;
  infotipElement.style.top = `${rect.top + window.scrollY - infotipElement.offsetHeight - 5}px`; // 5px padding above selection
  infotipElement.style.display = 'block';

  // Clear any existing timeout and set a new one to hide the infotip after a delay
  if (infotipTimeout) {
    clearTimeout(infotipTimeout);
  }
  infotipTimeout = setTimeout(hideInfotip, 5000); // Hide after 5 seconds
}

/**
 * Hides the infotip.
 */
function hideInfotip() {
  if (infotipElement) {
    infotipElement.style.display = 'none';
  }
  if (infotipTimeout) {
    clearTimeout(infotipTimeout);
    infotipTimeout = null;
  }
}

/**
 * Handles text selection events to show the infotip.
 */
const handleSelection = debounce(async () => {
  if (!isExtensionEnabled) {
    hideInfotip();
    return;
  }

  const selection = window.getSelection();
  const selectedText = selection.toString().trim();

  // Check if selection is empty or not a valid USD price
  if (!selectedText || !USD_PRICE_REGEX.test(selectedText)) {
    hideInfotip();
    return;
  }

  // Get the bounding rectangle of the selection
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();

  // Fetch BTC rate if not available or stale (though background handles caching)
  if (!currentBtcRate) {
    currentBtcRate = await getBtcRate();
  }

  if (currentBtcRate) {
    const numericPart = selectedText.replace(/\$|\s|,/g, '');
    const usdValue = parseFloat(numericPart);
    if (!isNaN(usdValue)) {
      const btcEquivalent = convertUsdToBtc(usdValue, currentBtcRate, displayMode);
      if (btcEquivalent) {
        showInfotip(btcEquivalent, rect);
      } else {
        hideInfotip();
      }
    } else {
      hideInfotip();
    }
  } else {
    // If rate is not available, try to fetch it again for next time
    getBtcRate().then(rate => currentBtcRate = rate);
    hideInfotip(); // Hide if no rate
  }
}, 100); // Debounce selection handling to avoid rapid calls

/**
 * Initializes the content script.
 */
async function initialize() {
  const settings = await chrome.storage.sync.get(['isEnabled', 'displayMode']);
  isExtensionEnabled = settings.isEnabled !== false;
  displayMode = settings.displayMode || 'btc';

  // Fetch initial BTC rate
  currentBtcRate = await getBtcRate();

  // Add event listener for selection only if enabled
  if (isExtensionEnabled) {
    document.addEventListener('mouseup', handleSelection);
    document.addEventListener('selectionchange', handleSelection); // More robust for keyboard selection
  }
}

// Listen for messages from popup or background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleOverlay') {
    isExtensionEnabled = request.isEnabled;
    if (isExtensionEnabled) {
      // Re-fetch rate to ensure it's fresh
      getBtcRate().then(rate => {
        currentBtcRate = rate;
      });
      document.addEventListener('mouseup', handleSelection);
      document.addEventListener('selectionchange', handleSelection);
    } else {
      document.removeEventListener('mouseup', handleSelection);
      document.removeEventListener('selectionchange', handleSelection);
      hideInfotip(); // Hide infotip if extension is disabled
    }
  } else if (request.action === 'changeDisplayMode') {
    displayMode = request.mode;
    // If infotip is currently visible, update its content
    if (infotipElement && infotipElement.style.display === 'block') {
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();
        if (selectedText && USD_PRICE_REGEX.test(selectedText)) {
            const numericPart = selectedText.replace(/\$|\s|,/g, '');
            const usdValue = parseFloat(numericPart);
            if (!isNaN(usdValue) && currentBtcRate) {
                const btcEquivalent = convertUsdToBtc(usdValue, currentBtcRate, displayMode);
                if (btcEquivalent) {
                    infotipElement.textContent = btcEquivalent;
                }
            }
        }
    }
  } else if (request.action === 'updateBtcRate') {
    currentBtcRate = request.btcRate;
    // If infotip is currently visible, update its content with new rate
    if (infotipElement && infotipElement.style.display === 'block') {
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();
        if (selectedText && USD_PRICE_REGEX.test(selectedText)) {
            const numericPart = selectedText.replace(/\$|\s|,/g, '');
            const usdValue = parseFloat(numericPart);
            if (!isNaN(usdValue) && currentBtcRate) {
                const btcEquivalent = convertUsdToBtc(usdValue, currentBtcRate, displayMode);
                if (btcEquivalent) {
                    infotipElement.textContent = btcEquivalent;
                }
            }
        }
    }
  }
});

// Run initialization when the DOM is ready
initialize();

// Ensure infotip element is created on load
document.addEventListener('DOMContentLoaded', ensureInfotipElement);
