## *BTC Overlay Chrome Extension

## *Overview

The "BTC Overlay" Chrome Extension is a powerful tool designed for Bitcoin enthusiasts and anyone looking to quickly understand the value of everyday purchases in Bitcoin terms. This Manifest V3 extension allows you to highlight any USD price on a webpage, and a small, non-intrusive infotip will instantly appear showing its equivalent in Bitcoin (₿) or Satoshis (sats). This on-demand approach ensures minimal browser resource consumption.
Features

* On-Demand Price Conversion: Highlight any dollar amount on a webpage to see its Bitcoin (₿) or Satoshi (sats) equivalent in a discreet infotip.
* CoinGecko API: Utilizes the reliable CoinGecko public API to fetch the most current BTC/USD exchange rate.
* Efficient Rate Fetching: The extension fetches the BTC/USD rate only once per minute and caches it to minimize API calls and ensure smooth browsing.
* Toggle On/Off: A convenient popup UI allows you to easily enable or disable the infotip feature.
* Display Mode Selection: Choose to display converted prices in full Bitcoin (₿0.00001234) or in Satoshis (1234 sats).
* Persistent Settings: Your preferences (enabled/disabled state, display mode) are saved using chrome.storage.sync.
* Minimal Resource Usage: Activates only when text is highlighted, making it exceptionally light on browser resources.


## Installation and Publishing
1. Prepare Your Extension Files
* Create a new folder on your computer (e.g., btc-overlay-extension).
* Save the following files into this folder:
   * manifest.json
   * background.js
   * content.js
   * popup.html
   * popup.js
   * style.css
* Create a subfolder named icons inside btc-overlay-extension.
* Place Bitcoin logo images (e.g., bitcoin-16.png, bitcoin-48.png, bitcoin-128.png) in the icons folder. You can create simple PNGs from the ₿ emoji.

2. Load for Local Testing (Developer Mode)
* Open Google Chrome.
* Navigate to chrome://extensions/.
* Enable "Developer mode" (usually a toggle switch in the top right corner).
* Click on the "Load unpacked" button.
* Select the btc-overlay-extension folder you created.
* To update after making changes: Simply click the refresh (reload) button on your extension's card on the chrome://extensions/ page. You may also need to refresh any open webpages to see the changes in content.js.
* Pin the Extension (Optional but Recommended): Click the puzzle piece icon (Extensions) in your Chrome toolbar. Find "BTC Overlay" and click the pin icon next to it to make it visible in your toolbar.

3. Publish to the Chrome Web Store
To make your extension available to others globally:
* Create a ZIP File: Compress your entire btc-overlay-extension folder into a single .zip file. Ensure manifest.json is at the root of the ZIP.
* Developer Account: You'll need a Google developer account. Sign up at the Chrome Web Store Developer Dashboard (one-time fee applies).
* Upload Your Extension: Go to the Developer Dashboard, click "Add new item", and upload your .zip file.
* Fill in Listing Details: Provide a detailed description, screenshots, promotional images, and other required information for your extension's listing. You can link https://bitcoinforengineers.com as your website URL.
* Submit for Review: After filling in all details, submit your extension. The review process can take some time.
4. Share Your Extension
Once your extension is published, you'll receive a unique URL for its listing on the Chrome Web Store. You can find this link in your Chrome Web Store Developer Dashboard under "Your Items." Share this link on bitcoinforengineers.com and other platforms to allow users to easily install your extension.

## Usage
1. Click the ₿ icon in your Chrome toolbar to open the extension popup.
2. Use the "Enable Overlay" toggle switch to turn the Bitcoin price conversion on or off.
3. Select your preferred "Display Mode" (BTC or Sats) using the radio buttons.
4. The popup will also show the Current BTC/USD Rate.
5. On any webpage, highlight a dollar amount (e.g., "$150", "$1,234.56"). A small infotip bubble will appear next to your selection, showing the Bitcoin equivalent.
Built by bitcoinforengineers.com
This extension was built with the aim of making Bitcoin more accessible and understandable in everyday contexts.
