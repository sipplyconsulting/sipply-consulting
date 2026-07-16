/* ===== Cookie Consent Banner Logic — Sipply Consulting ===== */
(function () {
  var CONSENT_KEY = "sipply-site-consent";
  var CONSENT_VERSION = "1";
  var GA_ID = "G-D6DXEQFZNW";

  function getConsent() {
    try {
      var raw = localStorage.getItem(CONSENT_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (parsed.version !== CONSENT_VERSION) return null;
      if (Date.now() - parsed.timestamp > 365 * 24 * 60 * 60 * 1000) return null;
      return parsed;
    } catch (e) { return null; }
  }

  function saveConsent(analytics) {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({
      version: CONSENT_VERSION,
      analytics: analytics,
      timestamp: Date.now()
    }));
  }

  function loadGoogleAnalytics() {
    if (window.gaLoaded) return;
    window.gaLoaded = true;
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", GA_ID, { anonymize_ip: true });
  }

  function applyConsent(consent) {
    if (consent && consent.analytics) {
      loadGoogleAnalytics();
    }
  }

  function injectBanner() {
    var html =
      '<div id="site-consent" role="dialog" aria-live="polite" aria-label="Cookie consent">' +
      '<p>We use cookies to run this site and understand how it is used. Essential cookies are always on. ' +
      'You can choose whether to allow analytics cookies (Google Analytics). See our ' +
      '<a href="privacy-policy.html">Privacy Policy</a> for details.</p>' +
      '<div class="cc-options" id="cc-options">' +
      '<div class="cc-option-row">' +
      '<div class="cc-option-text"><strong>Essential</strong><span>Required for the site to function. Cannot be turned off.</span></div>' +
      '<label class="cc-switch"><input type="checkbox" checked disabled /><span class="cc-slider"></span></label>' +
      '</div>' +
      '<div class="cc-option-row">' +
      '<div class="cc-option-text"><strong>Analytics</strong><span>Google Analytics — helps us understand traffic and improve the site.</span></div>' +
      '<label class="cc-switch"><input type="checkbox" id="cc-analytics-toggle" /><span class="cc-slider"></span></label>' +
      '</div>' +
      '</div>' +
      '<div class="cc-actions">' +
      '<button class="cc-btn primary" id="cc-accept-all">Accept all</button>' +
      '<button class="cc-btn" id="cc-reject-all">Reject non-essential</button>' +
      '<button class="cc-btn link" id="cc-customize">Customize</button>' +
      '<button class="cc-btn link" id="cc-save" style="display:none;">Save preferences</button>' +
      '</div></div>';

    var wrapper = document.createElement("div");
    wrapper.innerHTML = html;
    document.body.appendChild(wrapper.firstElementChild);
  }

  injectBanner();

  var banner = document.getElementById("site-consent");
  var optionsBox = document.getElementById("cc-options");
  var analyticsToggle = document.getElementById("cc-analytics-toggle");
  var customizeBtn = document.getElementById("cc-customize");
  var saveBtn = document.getElementById("cc-save");
  var acceptAllBtn = document.getElementById("cc-accept-all");
  var rejectAllBtn = document.getElementById("cc-reject-all");

  var existing = getConsent();

  if (!existing) {
    banner.classList.add("is-visible");
  } else {
    applyConsent(existing);
  }

  customizeBtn.addEventListener("click", function () {
    optionsBox.classList.add("is-open");
    customizeBtn.style.display = "none";
    saveBtn.style.display = "inline-block";
  });

  acceptAllBtn.addEventListener("click", function () {
    saveConsent(true);
    applyConsent({ analytics: true });
    banner.classList.remove("is-visible");
  });

  rejectAllBtn.addEventListener("click", function () {
    saveConsent(false);
    banner.classList.remove("is-visible");
  });

  saveBtn.addEventListener("click", function () {
    var analyticsAllowed = analyticsToggle.checked;
    saveConsent(analyticsAllowed);
    applyConsent({ analytics: analyticsAllowed });
    banner.classList.remove("is-visible");
  });

  window.reopenCookieConsent = function () {
    banner.classList.add("is-visible");
    optionsBox.classList.add("is-open");
    customizeBtn.style.display = "none";
    saveBtn.style.display = "inline-block";
    var existing = getConsent();
    if (existing) analyticsToggle.checked = existing.analytics;
  };
})();