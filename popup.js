// popup.js - Handles the popup UI logic

document.addEventListener('DOMContentLoaded', async () => {
    const toggleSwitch = document.getElementById('toggleSwitch');
    const statusText = document.getElementById('statusText');
    const btcRateDisplay = document.getElementById('btcRateDisplay');
    const modeBtc = document.getElementById('modeBtc');
    const modeSats = document.getElementById('modeSats');

    /**
     * Updates the UI based on the current extension state.
     * @param {boolean} isEnabled - Whether the overlay is enabled.
     * @param {string} displayMode - 'btc' or 'sats'.
     */
    function updateUI(isEnabled, displayMode) {
        toggleSwitch.checked = isEnabled;
        statusText.textContent = isEnabled ? 'On' : 'Off';
        statusText.style.color = isEnabled ? '#4CAF50' : '#f44336';

        if (displayMode === 'btc') {
            modeBtc.checked = true;
        } else {
            modeSats.checked = true;
        }
    }

    /**
     * Fetches and displays the current BTC/USD rate.
     */
    async function fetchAndDisplayBtcRate() {
        btcRateDisplay.textContent = 'Fetching...';
        try {
            // Request the BTC rate from the background script
            const response = await chrome.runtime.sendMessage({ action: 'getBtcRate' });
            if (response && response.btcRate) {
                btcRateDisplay.textContent = `$${response.btcRate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            } else {
                btcRateDisplay.textContent = 'N/A';
            }
        } catch (error) {
            console.error('Error fetching BTC rate in popup:', error);
            btcRateDisplay.textContent = 'Error';
        }
    }

    // Load initial state from storage
    const settings = await chrome.storage.sync.get(['isEnabled', 'displayMode']);
    const isEnabled = settings.isEnabled !== false; // Default to true
    const displayMode = settings.displayMode || 'btc'; // Default to 'btc'
    updateUI(isEnabled, displayMode);
    fetchAndDisplayBtcRate();

    // Event listener for the toggle switch
    toggleSwitch.addEventListener('change', async () => {
        const newIsEnabled = toggleSwitch.checked;
        await chrome.storage.sync.set({ isEnabled: newIsEnabled });
        updateUI(newIsEnabled, displayMode);

        // Send message to active tab's content script to update overlay
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleOverlay', isEnabled: newIsEnabled });
            }
        });
    });

    // Event listeners for display mode radio buttons
    modeBtc.addEventListener('change', async () => {
        await chrome.storage.sync.set({ displayMode: 'btc' });
        // Send message to active tab's content script to change display mode
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'changeDisplayMode', mode: 'btc' });
            }
        });
    });

    modeSats.addEventListener('change', async () => {
        await chrome.storage.sync.set({ displayMode: 'sats' });
        // Send message to active tab's content script to change display mode
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'changeDisplayMode', mode: 'sats' });
            }
        });
    });

    // Listen for messages from background script about rate updates
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === 'updateBtcRate') {
            fetchAndDisplayBtcRate(); // Refresh rate display in popup
        }
    });
});
