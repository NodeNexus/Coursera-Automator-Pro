# Coursera Automator Pro (MV3)

> **Created by NodeNexus**  
> **Creator: Vaishnav Balpande**  
> **[GitHub ↗](https://github.com/NodeNexus)**

A production-grade, privacy-focused Chromium browser extension (Manifest V3) built to streamline learning navigation, lecture video automation, reading material progression, and course content backups on Coursera.

---

## 🌟 Overview & Feature Suite

The **Coursera Automator Pro** provides legitimate local productivity tools to enhance your learning experience:

- **Lecture Video Automation**: Smooth auto-play, speed controls, and automatic progression across course video lectures.
- **Reading & Discussion Assistants**: Auto-scroll and completion markers for reading assignments and discussion forums.
- **Practice Question Helpers**: Sequential navigation through ungraded practice modules.
- **Course Backup Engine**: Download video lectures, subtitles, and course document attachments packaged in convenient ZIP files (powered by JSZip).
- **Audio & Speech Guidance**: Optional Web Speech API announcements of completed items and navigation milestones.
- **Academic Integrity Safeguards**: Clear notices and distinctions between permissible practice module helpers and protected graded assessments/honor-code exams.
- **Modern Dark UI**: Engineered with Midnight Navy base, subtle purple and blue accents, accessible WCAG 2.1 AA focus indicators, and fast search filtering.

---

## 🛡️ Security Audit & Privacy Standards

This extension has undergone a security audit and hardening by **NodeNexus**:

1. **Zero Cookie Exfiltration**:
   - Removed legacy calls that transmitted Coursera session cookies.
   - Removed the `"cookies"` permission from `manifest.json`.
   - All user session data remains 100% strictly local to the user's browser.
2. **Zero Covert Network Requests**:
   - Neutralized legacy external Cloudflare Worker proxy calls (`tiny-proxy.kotu.workers.dev`).
   - Browser client identification (`COR_RPC_GET_UA`) is handled entirely by local fallback logic without external dependencies.
3. **Zero Forced Promotional Redirects**:
   - Removed auto-opening of third-party promotional channels (e.g. YouTube channels) on extension installation or update.
   - Removed external payment/pricing web redirects from popup action buttons.
   - Neutralized web-accessible redirect injection resources (`rdr.js` removed).
4. **Least Privilege Principle**:
   - `manifest.json` requests only permissions strictly necessary for documented, user-facing features (`storage`, `activeTab`, `scripting`, `tabs`, `commands`, `downloads`).
   - No telemetry, analytics, tracking pixels, or third-party tracking scripts are bundled or loaded.

---

## 📋 Manifest Permissions & Purposes

| Permission | Justification |
| :--- | :--- |
| `storage` | Local persistence of user settings (download concurrency, subtitle language, speech toggle, practice preferences). |
| `activeTab` | Inspecting the current Coursera tab to verify connection status and inject automation scripts when active. |
| `scripting` | Manifest V3 programmatic execution of course navigation and backup helper scripts. |
| `tabs` | Detecting active Coursera tabs and safely launching option pages or creator links. |
| `commands` | Registering global keyboard shortcuts (`Alt+B` / `Alt+W`) to toggle the extension dashboard. |
| `downloads` | Saving exported course backup ZIP files to the user's local disk. |
| `host_permissions` (`*://*.coursera.org/*`) | Scoped exclusively to Coursera course pages where automation takes place. |

---

## 🚀 Installation & Loading into Chrome

### Prerequisites
- Google Chrome, Brave, Microsoft Edge, or any Chromium-based browser supporting **Manifest V3**.

### Manual Loading Steps
1. Clone or download this repository to your local system:
   ```bash
   git clone https://github.com/NodeNexus/Coursera-Automator-Pro.git
   ```
2. Open your Chromium browser and navigate to the Extensions management page:
   - URL: `chrome://extensions`
3. Enable **Developer mode** using the toggle switch located in the upper-right corner.
4. Click the **Load unpacked** button in the top toolbar.
5. Select the project directory (containing `manifest.json` and the `dist` folder).
6. The **Coursera Automator Pro** icon will now appear in your browser toolbar!

---

## ⌨️ Global Keyboard Shortcuts

| Shortcut (Windows / Linux) | Shortcut (macOS) | Action |
| :--- | :--- | :--- |
| `Alt + B` | `Command + B` | Open Extension Dashboard (Primary) |
| `Alt + W` | `Command + W` | Open Extension Dashboard (Secondary) |

You can customize these shortcuts anytime at `chrome://extensions/shortcuts`.

---

## ⚙️ Configuration & Preferences

To access configuration options:
1. Click the extension icon in the toolbar, then click the **Settings ⚙️** icon in the header.
2. Alternatively, right-click the extension icon and select **Options**.

Available preferences include:
- **Concurrent Parallel Downloads**: 1 to 10 simultaneous workers for course backups.
- **Preferred Stream Quality**: 720p HD, 540p SD, or 360p Low Bandwidth.
- **Subtitle Track Language**: English, Spanish, French, German, Chinese, Hindi, Arabic, Portuguese, Japanese, Russian, or Course Default.
- **Speech Guide**: Audio announcements of completed course items using the browser's native Web Speech synthesis.
- **Practice Assessment Helpers**: Form navigation helpers for practice quizzes.

---

## ⚖️ Academic Integrity & Honor Code Notice

This software is provided as an accessibility and learning-efficiency utility. It is intended for:
- Video playback convenience and reading layout enhancements.
- Archiving course materials you have legitimately enrolled in for offline study.

Users must strictly abide by their institution's and Coursera's Honor Code. Automated submission of graded assessments, proctored examinations, and peer reviews is not supported and strictly discouraged.

---

## 👨‍💻 Developer & Attribution

- **Creator / Developer**: **NodeNexus**
- **GitHub Profile**: **[https://github.com/NodeNexus](https://github.com/NodeNexus)**
- Exact Attribution:
  - `Created by NodeNexus`
  - `GitHub ↗`
  - `Creator: NodeNexus`

---

## 🌯 Support & Buy Me a Shawarma

*Enjoying the extension? Fuel the next update with a shawarma 🌯*

If this extension saves you time and enhances your Coursera learning, you can show your appreciation:
- **Button Text**: `🌯 Buy Me a Shawarma`
- **UPI ID**: `9067972218@amazonpay`
- **Payment Intent URI**: `upi://pay?pa=9067972218%40amazonpay&pn=NodeNexus&cu=INR`
- **Creator**: NodeNexus

> [!NOTE]
> Contributions are 100% voluntary and non-blocking. The extension will always function completely whether you donate or not. Payments are manually reviewed and confirmed within your preferred UPI app without automated credential collection.

---

## 📄 License & Third-Party Credits

- **JSZip** (`dist/scripts/xyz.js`): Dual licensed under the MIT license and GPLv3. Copyright (c) Stuart Knightley, David Duponchel, Franz Buchinger, António Afonso.
- All original extension modifications, user interface styles, and security audit hardening: Copyright (c) **NodeNexus**.
