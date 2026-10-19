/**
 * Coursera Automation Extension - Settings UI Enhancement Companion
 * Provides responsive controls, subtitle population, tab management, and status feedback
 * while maintaining 100% compatibility with settings.js and chrome.storage.local.
 */
(() => {
  'use strict';

  const SUBTITLE_LANGUAGES = [
    { code: 'en', label: 'English (en)' },
    { code: 'es', label: 'Spanish / Español (es)' },
    { code: 'fr', label: 'French / Français (fr)' },
    { code: 'de', label: 'German / Deutsch (de)' },
    { code: 'zh', label: 'Chinese / 中文 (zh)' },
    { code: 'hi', label: 'Hindi / हिन्दी (hi)' },
    { code: 'ar', label: 'Arabic / العربية (ar)' },
    { code: 'pt', label: 'Portuguese / Português (pt)' },
    { code: 'ja', label: 'Japanese / 日本語 (ja)' },
    { code: 'ru', label: 'Russian / Русский (ru)' },
    { code: 'auto', label: 'Course Default Language' }
  ];

  document.addEventListener('DOMContentLoaded', () => {
    initSubtitleDropdown();
    initConcurrencySlider();
    initTabNavigation();
    initSaveFeedback();
    initBrandingLinks();
    initIntegrityAndAdditionalSettings();
    initShawarmaSupport();
  });

  /**
   * 1. Populate Subtitle Dropdown with high-quality language selections
   */
  function initSubtitleDropdown() {
    const subtitleSelect = document.getElementById('subtitle');
    if (!subtitleSelect) return;

    // Check if options are already populated
    if (subtitleSelect.options.length <= 1) {
      subtitleSelect.innerHTML = '';
      SUBTITLE_LANGUAGES.forEach(lang => {
        const opt = document.createElement('option');
        opt.value = lang.code;
        opt.textContent = lang.label;
        subtitleSelect.appendChild(opt);
      });
    }

    // Load saved value if available in storage
    if (chrome?.storage?.local) {
      chrome.storage.local.get(['subtitle', 'subtitleLanguage'], (res) => {
        const saved = res.subtitle || res.subtitleLanguage;
        if (saved && subtitleSelect.querySelector(`option[value="${saved}"]`)) {
          subtitleSelect.value = saved;
        }
      });
    }
  }

  /**
   * 2. Synchronize concurrency slider and number input
   */
  function initConcurrencySlider() {
    const numberInput = document.getElementById('concurrency');
    const rangeSlider = document.getElementById('concurrencySlider');
    const badge = document.getElementById('concurrencyBadge');

    if (!numberInput || !rangeSlider || !badge) return;

    const updateValue = (val) => {
      const clamped = Math.max(1, Math.min(10, parseInt(val, 10) || 5));
      numberInput.value = clamped;
      rangeSlider.value = clamped;
      badge.textContent = clamped;
    };

    updateValue(numberInput.value || 5);

    numberInput.addEventListener('input', () => updateValue(numberInput.value));
    rangeSlider.addEventListener('input', () => updateValue(rangeSlider.value));
  }

  /**
   * 3. Tab Navigation
   */
  function initTabNavigation() {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetTab = tab.getAttribute('data-tab');
        if (!targetTab) return;

        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));

        tab.classList.add('active');
        const activeContent = document.getElementById(targetTab);
        if (activeContent) {
          activeContent.classList.add('active');
        }
      });
    });
  }

  /**
   * 4. Visual Feedback for Save Actions
   */
  function initSaveFeedback() {
    const saveCourseBtn = document.getElementById('saveBtn');
    const statusCourse = document.getElementById('status');
    const saveAddBtn = document.getElementById('saveAdditionalBtn');
    const statusAdd = document.getElementById('additionalStatus');

    const showSaveNotice = (statusEl) => {
      if (!statusEl) return;
      statusEl.className = 'success';
      statusEl.innerHTML = `<span>✓</span> Settings saved successfully`;
      statusEl.style.display = 'flex';

      clearTimeout(statusEl._timeout);
      statusEl._timeout = setTimeout(() => {
        statusEl.style.display = 'none';
      }, 3500);
    };

    if (saveCourseBtn) {
      saveCourseBtn.addEventListener('click', () => {
        setTimeout(() => showSaveNotice(statusCourse), 150);
      });
    }

    if (saveAddBtn) {
      saveAddBtn.addEventListener('click', () => {
        setTimeout(() => showSaveNotice(statusAdd), 150);
      });
    }
  }

  /**
   * 5. NodeNexus Creator Branding Link Handlers
   */
  function initBrandingLinks() {
    ['aboutGithubLink', 'settingsFooterGithubLink'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('click', (e) => {
        e.preventDefault();
        if (chrome?.tabs?.create) {
          chrome.tabs.create({ url: 'https://github.com/NodeNexus' });
        } else {
          window.open('https://github.com/NodeNexus', '_blank', 'noopener,noreferrer');
        }
      });
    });
  }

  /**
   * 6. Academic Integrity & Additional Settings Auto-persistence
   */
  function initIntegrityAndAdditionalSettings() {
    const toggles = [
      { id: 'attemptAllQuizToggle', key: 'attemptAllQuiz' },
      { id: 'autoQuizToggle', key: 'autoQuiz' },
      { id: 'autoSubmitQuizToggle', key: 'autoSubmitQuiz' },
      { id: 'speechToggle', key: 'speechGuide' },
      { id: 'autoPopupToggle', key: 'autoPopupOnExpiry' }
    ];

    if (!chrome?.storage?.local) return;

    // Load initial values from chrome.storage.local
    const keysToLoad = toggles.map(t => t.key);
    chrome.storage.local.get(keysToLoad, (result) => {
      toggles.forEach(({ id, key }) => {
        const input = document.getElementById(id);
        if (input && typeof result[key] === 'boolean') {
          input.checked = result[key];
        }
      });
    });

    // Auto-save on toggle change
    toggles.forEach(({ id, key }) => {
      const input = document.getElementById(id);
      if (!input) return;

      input.addEventListener('change', () => {
        const update = {};
        update[key] = input.checked;
        chrome.storage.local.set(update, () => {
          const statusAdd = document.getElementById('additionalStatus');
          if (statusAdd) {
            statusAdd.className = 'success';
            statusAdd.innerHTML = `<span>✓</span> Preferences updated`;
            statusAdd.style.display = 'flex';
            clearTimeout(statusAdd._timeout);
            statusAdd._timeout = setTimeout(() => {
              statusAdd.style.display = 'none';
            }, 2500);
          }
        });
      });
    });
  }

  /**
   * 7. Support / Buy Me a Shawarma Handler with UPI Intent and Clipboard Copy
   */
  function initShawarmaSupport() {
    const shawarmaBtn = document.getElementById('settingsShawarmaBtn');
    const copyBtn = document.getElementById('copyUpiSettingsBtn');
    const copyText = document.getElementById('copyUpiSettingsText');
    const upiId = '9067972218@amazonpay';
    const upiUri = 'upi://pay?pa=9067972218%40amazonpay&pn=NodeNexus&cu=INR';

    if (shawarmaBtn) {
      shawarmaBtn.addEventListener('click', (e) => {
        // Normal user-initiated click opens the payment intent
        try {
          window.location.href = upiUri;
        } catch (_) {}
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
          setTimeout(() => {
            if (copyText) copyText.textContent = 'Copy UPI ID';
          }, 2500);
        } catch (_) {
          prompt('Copy UPI ID:', upiId);
        }
      });
    }
  }
})();
