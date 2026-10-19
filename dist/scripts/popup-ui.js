/**
 * Coursera Automation Extension - Popup UI Enhancement Companion
 * Enhances popup.js with real-time connection status, icons, feedback toasts,
 * and isolated developer preview mode without modifying production entitlements.
 */
(() => {
  'use strict';

  // SVG Icons for Actions
  const ACTION_ICONS = {
    lecture: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`,
    skipvideoplus: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>`,
    reading: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>`,
    discussion: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`,
    dialogue: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>`,
    ungradedplugin: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>`,
    shareablelink: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`,
    coursebackup: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`,
    quiz: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`,
    comingsoon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
    default: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle></svg>`
  };

  // State
  let isCourseraActive = false;
  let activeTabId = null;

  document.addEventListener('DOMContentLoaded', () => {
    initSettingsButton();
    initBrandingLinks();
    initShawarmaSupport();
    initTabConnectionCheck();
    initActionObserver();
    initSearchFilter();
    initActionFeedback();
  });

  /**
   * 1. Check if the current active tab is on Coursera
   */
  function initTabConnectionCheck() {
    const connDot = document.getElementById('connDot');
    const connText = document.getElementById('connText');
    const connAction = document.getElementById('connAction');

    if (!chrome?.tabs?.query) return;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs?.[0];
      if (activeTab && activeTab.url) {
        activeTabId = activeTab.id;
        if (activeTab.url.includes('coursera.org')) {
          isCourseraActive = true;
          if (connDot) {
            connDot.className = 'status-dot online';
          }
          if (connText) {
            connText.textContent = 'Coursera Connected';
          }
          if (connAction) {
            connAction.style.display = 'none';
          }
        } else {
          isCourseraActive = false;
          if (connDot) {
            connDot.className = 'status-dot offline';
          }
          if (connText) {
            connText.textContent = 'Coursera Tab Inactive';
          }
          if (connAction) {
            connAction.style.display = 'none';
          }
        }
      }
    });
  }

  /**
   * 2. Observe and enhance buttons created dynamically by popup.js
   */
  function initActionObserver() {
    const grid = document.getElementById('courseraModelGrid');
    if (!grid) return;

    // Enhance existing or newly appended children
    const enhanceButtons = () => {
      const buttons = grid.querySelectorAll('.courseraModelBtn');
      buttons.forEach(btn => {
        if (btn.dataset.enhanced) return;
        btn.dataset.enhanced = 'true';

        // Extract action from wrapper or text
        const text = btn.innerText.trim();
        const lower = text.toLowerCase();
        let iconKey = 'default';

        if (lower.includes('lecture') || lower.includes('video')) iconKey = 'lecture';
        if (lower.includes('skip video')) iconKey = 'skipvideoplus';
        if (lower.includes('reading')) iconKey = 'reading';
        if (lower.includes('discussion')) iconKey = 'discussion';
        if (lower.includes('dialogue')) iconKey = 'dialogue';
        if (lower.includes('ungraded') || lower.includes('plugin')) iconKey = 'ungradedplugin';
        if (lower.includes('shareable') || lower.includes('link')) iconKey = 'shareablelink';
        if (lower.includes('backup')) iconKey = 'coursebackup';
        if (lower.includes('quiz')) iconKey = 'quiz';
        if (lower.includes('soon')) iconKey = 'comingsoon';

        // Restructure button content for icon + label
        const originalBadge = btn.querySelector('.feature-badge');
        const badgeHTML = originalBadge ? originalBadge.outerHTML : '';
        const cleanLabel = originalBadge ? text.replace(originalBadge.innerText, '').trim() : text;

        const iconSVG = ACTION_ICONS[iconKey] || ACTION_ICONS.default;

        btn.innerHTML = `
          <div class="btn-left">
            <span class="btn-icon">${iconSVG}</span>
            <span class="btn-label-text">${cleanLabel}</span>
          </div>
          ${badgeHTML}
        `;
      });
    };

    // Run immediately and observe for additions
    enhanceButtons();
    const observer = new MutationObserver(enhanceButtons);
    observer.observe(grid, { childList: true, subtree: true });
  }

  /**
   * 3. Action feedback toast notifications
   */
  function initActionFeedback() {
    const grid = document.getElementById('courseraModelGrid');
    const toast = document.getElementById('actionToast');
    if (!grid || !toast) return;

    grid.addEventListener('click', (e) => {
      const btn = e.target.closest('.courseraModelBtn');
      if (!btn) return;

      const label = btn.querySelector('.btn-label-text')?.textContent || btn.textContent.trim();

      if (!isCourseraActive) {
        showToast(`⚠️ Please switch to an active Coursera course tab`, 'toast-warning');
        return;
      }

      showToast(`⚡ Dispatched "${label}" to Coursera tab`, 'toast-success');
    });
  }

  function showToast(message, type = 'toast-success') {
    const toast = document.getElementById('actionToast');
    if (!toast) return;

    toast.className = `action-feedback-toast ${type}`;
    toast.textContent = message;
    toast.style.display = 'flex';

    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.style.display = 'none';
    }, 3800);
  }

  /**
   * 4. Search / Filter for action buttons
   */
  function initSearchFilter() {
    const searchInput = document.getElementById('actionSearch');
    const grid = document.getElementById('courseraModelGrid');
    if (!searchInput || !grid) return;

    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const wrappers = grid.querySelectorAll('.courseraBtnWrapper');

      wrappers.forEach(wrapper => {
        const text = wrapper.textContent.toLowerCase();
        if (!query || text.includes(query)) {
          wrapper.style.display = '';
        } else {
          wrapper.style.display = 'none';
        }
      });
    });
  }

  /**
   * 6. Header Settings Button Navigation
   */
  function initSettingsButton() {
    const settingsBtn = document.getElementById('settingsBtn');
    if (!settingsBtn) return;

    settingsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (chrome?.runtime?.openOptionsPage) {
        chrome.runtime.openOptionsPage();
      } else {
        const url = chrome?.runtime?.getURL ? chrome.runtime.getURL('dist/settings.html') : 'settings.html';
        if (chrome?.tabs?.create) {
          chrome.tabs.create({ url });
        } else {
          window.open(url, '_blank');
        }
      }
    });
  }

  /**
   * 7. Creator Branding Link Safe Handler
   */
  function initBrandingLinks() {
    const githubLink = document.getElementById('githubLink');
    if (!githubLink) return;

    githubLink.addEventListener('click', (e) => {
      e.preventDefault();
      if (chrome?.tabs?.create) {
        chrome.tabs.create({ url: 'https://github.com/NodeNexus' });
      } else {
        window.open('https://github.com/NodeNexus', '_blank', 'noopener,noreferrer');
      }
    });
  }

  /**
   * 8. Support / Buy Me a Shawarma Handler with UPI Intent and Desktop Fallback
   */
  function initShawarmaSupport() {
    const shawarmaBtn = document.getElementById('shawarmaBtn');
    const copyBtn = document.getElementById('copyUpiPopupBtn');
    const copyText = document.getElementById('copyUpiPopupText');
    const fallbackNotice = document.getElementById('upiFallbackNotice');
    const upiId = '9067972218@amazonpay';
    const upiUri = 'upi://pay?pa=9067972218%40amazonpay&pn=NodeNexus&cu=INR';

    if (shawarmaBtn) {
      shawarmaBtn.addEventListener('click', (e) => {
        // Normal user-initiated click opens the payment intent
        // On desktop where upi:// may not have an OS handler, display fallback notice
        if (fallbackNotice) {
          fallbackNotice.style.display = 'flex';
        }

        // Show friendly feedback toast
        showToast('🌯 Thank you for supporting NodeNexus! UPI intent triggered.', 'toast-success');
      });
    }

    if (copyBtn) {
      copyBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
          if (navigator?.clipboard?.writeText) {
            await navigator.clipboard.writeText(upiId);
          } else {
            const textarea = document.createElement('textarea');
            textarea.value = upiId;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
          }

          if (copyText) copyText.textContent = 'Copied! ✓';
          if (fallbackNotice) fallbackNotice.style.display = 'flex';
          showToast('✓ UPI ID (9067972218@amazonpay) copied!', 'toast-success');

          setTimeout(() => {
            if (copyText) copyText.textContent = 'Copy UPI';
          }, 2500);
        } catch (_) {
          if (fallbackNotice) fallbackNotice.style.display = 'flex';
          showToast(`UPI ID: ${upiId}`, 'toast-info');
        }
      });
    }
  }
})();


