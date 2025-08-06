# ₿ BTC Overlay Chrome Extension

**Convert any USD price on the web to Bitcoin instantly.**  
A lightweight, on-demand tool for Bitcoiners.

---

## 🔍 Overview

The **BTC Overlay** is a Chrome extension built for Bitcoin enthusiasts and curious newcomers.  
Highlight any USD price on a webpage — and see the equivalent in Bitcoin (₿) or Satoshis (sats) appear right next to it.

Built with Manifest V3, this extension prioritizes speed, simplicity, and minimal resource usage.

---

## ⚙️ Features

- 🔁 **On-Demand Price Conversion**  
  Highlight any dollar amount (e.g. `$150`, `$1,234.56`) to instantly see its value in Bitcoin or sats.

- 🦎 **Live BTC/USD Rate via CoinGecko**  
  Uses the [CoinGecko API](https://coingecko.com) to fetch current exchange rates.

- 🧠 **Smart Caching**  
  Only fetches price once per minute to avoid unnecessary API calls.

- 🎚️ **Toggle On/Off Anytime**  
  Quickly enable or disable the extension from the popup UI.

- 🔄 **Switch Display Mode**  
  Choose between full Bitcoin (₿0.00001234) or sats (1234 sats).

- 💾 **Persistent Preferences**  
  Saves your settings using `chrome.storage.sync`.

- 🪶 **Minimal Footprint**  
  Activated only when text is highlighted. No background scripts eating resources.

---

## 🧪 Installation & Local Testing

### 1. 📂 Prepare Extension Files

Create a folder named `btc-overlay-extension`, and add the following files:

- `manifest.json`  
- `background.js`  
- `content.js`  
- `popup.html`  
- `popup.js`  
- `style.css`

Inside that folder, create a subfolder called `icons/` and place the following images:

- `bitcoin-16.png`  
- `bitcoin-48.png`  
- `bitcoin-128.png`

> (Tip: You can export these icons from the ₿ emoji using any design tool.)

---

### 2. 🧪 Load in Developer Mode

1. Open **Google Chrome**
2. Navigate to: `chrome://extensions/`
3. Enable **Developer Mode** (top right)
4. Click **Load unpacked**
5. Select your `btc-overlay-extension/` folder

To update changes, just hit the **refresh icon** on your extension inside `chrome://extensions/`.

> 🔖 **Optional**: Pin the extension by clicking the puzzle piece icon in the Chrome toolbar and hitting the pin next to “BTC Overlay.”

---

### 3. 🌍 Publish to Chrome Web Store

1. **Create a ZIP file** of your `btc-overlay-extension/` folder
2. **Create a developer account**:  
   [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole) (one-time $5 fee)
3. **Upload the ZIP**
4. **Add listing info**: Title, description, screenshots, link to [bitcoinforengineers.com](https://bitcoinforengineers.com)
5. **Submit for review**

---

## 🚀 Usage Instructions

1. Click the ₿ icon in your Chrome toolbar
2. Toggle **Enable Overlay**
3. Choose **BTC** or **Sats** display mode
4. Highlight any dollar amount (e.g. `$99.99`) on a webpage
5. Watch the conversion pop up next to your selection — live from CoinGecko

---

## 👷‍♂️ Built By

Made with ❤️ by [bitcoinforengineers.com](https://bitcoinforengineers.com)  
To make Bitcoin more intuitive, visible, and usable in everyday life.

---

## 💡 Ideas? Questions? Contributions?

Open a pull request or issue in the repository.  
Let's make Bitcoin the default unit of account — one highlight at a time.
