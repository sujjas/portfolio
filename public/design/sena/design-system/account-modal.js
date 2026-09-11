/* ════════════════════════════════════════════════════════════════════════════ */
/* ACCOUNT-MODAL.JS — Account settings overlay (Profile · Security · Privacy)  */
/* Import after screen.js:                                                    */
/*   <script src="../design-system/account-modal.js"></script>                 */
/*                                                                            */
/* Opened from the sidebar user-row menu (see screen.js openMenu) or from any  */
/* element carrying data-account-open="profile|security|privacy".              */
/*                                                                            */
/* The Privacy tab mirrors the four iubenda consent categories. Choices live   */
/* in localStorage under 'sena-privacy'; the panel edits a DRAFT and only      */
/* commits on "Save preferences", so "Reject all" / "Accept all" flip the      */
/* toggles and the user still confirms the save (matching the CMP copy).       */
/* ════════════════════════════════════════════════════════════════════════════ */

window.SenaAccount = (function () {

  var PRIVACY_KEY = 'sena-privacy';

  var TABS = [
    { key: 'profile',  label: 'Profile',  icon: 'circle-user',  title: 'Profile details' },
    { key: 'security', label: 'Security', icon: 'shield-check', title: 'Security' },
    { key: 'privacy',  label: 'Privacy',  icon: 'cookie-bite',  title: 'Your Privacy Choices' }
  ];

  /* iubenda's four categories, verbatim. "Necessary" carries no consent flag —
     it is always on and its toggle is disabled. */
  var CATEGORIES = [
    { key: 'necessary', name: 'Necessary', locked: true,
      desc: 'These trackers are used for activities that are strictly necessary to operate or ' +
            'deliver the service you requested from us and, therefore, do not require you to consent.' },
    { key: 'experience', name: 'Experience',
      desc: 'These trackers help us to improve the quality of your user experience and enable ' +
            'interactions with external content, networks and platforms.' },
    { key: 'measurement', name: 'Measurement',
      desc: 'These trackers help us to measure traffic and analyze your behavior to improve our service.' },
    { key: 'marketing', name: 'Marketing',
      desc: 'These trackers help us to deliver personalized ads or marketing content to you, ' +
            'and to measure their performance.' }
  ];
  var CONSENT_KEYS = ['experience', 'measurement', 'marketing'];

  /* Brand mark — Font Awesome has no Google glyph, so this follows the same
     inline-SVG exception the social buttons on sign-in.html use. */
  var GOOGLE_SVG =
    '<svg class="am-line-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>' +
      '<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>' +
      '<path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>' +
      '<path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>' +
    '</svg>';

  /* ── Helpers ───────────────────────────────────────────────────────────── */
  function esc(str) {
    var d = document.createElement('div');
    d.textContent = str == null ? '' : String(str);
    return d.innerHTML;
  }

  function scenario() {
    try { return (window.Scenario && Scenario.get()) || {}; } catch (e) { return {}; }
  }

  function domText(selector) {
    var el = document.querySelector(selector);
    return el ? el.textContent.trim() : '';
  }

  function slug(str) {
    return String(str || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  /* Identity is read live, and in the sidebar's own order of preference, so the
     panel can never contradict the row the user opened it from. */
  function identity() {
    var s = scenario();
    var user = s.user || {};
    var name = user.name || domText('.user-name') || 'Jane Smith';
    var company = (s.company && s.company.name) || domText('.user-company') || 'Red Bull';
    var initials = user.initials || domText('.sidebar-foot .avatar > div');
    if (!initials) {
      initials = name.split(/\s+/).map(function (p) { return p.charAt(0); }).join('').slice(0, 2).toUpperCase();
    }
    var email = user.email;
    if (!email) {
      var parts = name.split(/\s+/).map(slug).filter(Boolean);
      email = (parts.join('.') || 'you') + '@' + (slug(company) || 'example') + '.com';
    }
    return { name: name, company: company, initials: initials, email: email };
  }

  /* Device line for the Security tab — real browser/platform, mock IP. */
  function device() {
    var ua = navigator.userAgent || '';
    var platform = /Macintosh|Mac OS X/.test(ua) ? 'Macintosh'
      : /Windows/.test(ua) ? 'Windows'
      : /Linux/.test(ua) ? 'Linux'
      : /iPhone|iPad/.test(ua) ? 'iOS device'
      : 'This computer';
    var browser = 'Browser';
    var m = ua.match(/(Edg|OPR|Chrome|Firefox|Version)\/([\d.]+)/);
    if (m) {
      browser = ({ Edg: 'Edge', OPR: 'Opera', Version: 'Safari' })[m[1]] || m[1];
      browser += ' ' + m[2];
    }
    return {
      platform: platform,
      browser: browser,
      ip: '2001:8a0:5943:9a00:ed36:a05e:4b2d:2e03 (Lisbon, Portugal)',
      seen: 'Today at ' + new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    };
  }

  function stamp(ts) {
    var d = new Date(ts);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) +
      ' at ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }

  /* ── Privacy choices store ─────────────────────────────────────────────── */
  /* No record yet = consent captured at sign-up, all purposes accepted. That
     is the "first-time login" state the Privacy tab calls out. */
  function readPrivacy() {
    var rec = null;
    try { rec = JSON.parse(localStorage.getItem(PRIVACY_KEY) || 'null'); } catch (e) { rec = null; }
    if (!rec || typeof rec !== 'object') {
      rec = { experience: true, measurement: true, marketing: true, source: 'signup', updatedAt: null };
    }
    CONSENT_KEYS.forEach(function (k) { rec[k] = rec[k] !== false; });
    return rec;
  }
  function writePrivacy(rec) {
    localStorage.setItem(PRIVACY_KEY, JSON.stringify(rec));
  }

  /* ── State ─────────────────────────────────────────────────────────────── */
  var overlay = null;
  var activeTab = 'profile';
  var draft = null;          // in-panel copy of the consent flags
  var justSaved = false;     // drives the confirmation notice
  var loadFailed = false;    // simulates the CMP failing to load
  var policyOpen = false;    // full policy shown in place of the Privacy content

  function draftDirty() {
    var saved = readPrivacy();
    return CONSENT_KEYS.some(function (k) { return !!draft[k] !== !!saved[k]; });
  }

  /* ── Tab bodies ────────────────────────────────────────────────────────── */
  function profileHTML() {
    var me = identity();
    return '' +
      '<div class="am-row">' +
        '<span class="am-row-label">Profile</span>' +
        '<div class="am-row-main">' +
          '<div class="am-identity">' +
            '<span class="am-identity-avatar">' + esc(me.initials) + '</span>' +
            '<span class="am-identity-name">' + esc(me.name) + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="am-row-action"><button class="am-action" type="button">Update profile</button></div>' +
      '</div>' +
      '<div class="am-row">' +
        '<span class="am-row-label">Email addresses</span>' +
        '<div class="am-row-main">' +
          '<span class="am-line">' + esc(me.email) + '<span class="am-tag">Primary</span></span>' +
          '<button class="am-add" type="button"><span class="fa" aria-hidden="true">plus</span>Add email address</button>' +
        '</div>' +
        '<div class="am-row-action">' +
          '<button class="am-dots fa" type="button" aria-label="Email options">ellipsis</button>' +
        '</div>' +
      '</div>' +
      '<div class="am-row">' +
        '<span class="am-row-label">Connected accounts</span>' +
        '<div class="am-row-main">' +
          '<span class="am-line">' + GOOGLE_SVG + 'Google' +
            '<span class="am-line-muted">· ' + esc(me.email) + '</span></span>' +
        '</div>' +
        '<div class="am-row-action">' +
          '<button class="am-dots fa" type="button" aria-label="Connected account options">ellipsis</button>' +
        '</div>' +
      '</div>';
  }

  function securityHTML() {
    var dev = device();
    return '' +
      '<div class="am-row">' +
        '<span class="am-row-label">Password</span>' +
        '<div class="am-row-main">' +
          '<button class="am-action am-action-start" type="button">Set password</button>' +
        '</div>' +
        '<div class="am-row-action"></div>' +
      '</div>' +
      '<div class="am-row">' +
        '<span class="am-row-label">Two-step verification</span>' +
        '<div class="am-row-main">' +
          '<button class="am-add" type="button"><span class="fa" aria-hidden="true">plus</span>Add two-step verification</button>' +
        '</div>' +
        '<div class="am-row-action"></div>' +
      '</div>' +
      '<div class="am-row">' +
        '<span class="am-row-label">Active devices</span>' +
        '<div class="am-row-main">' +
          '<span class="am-line"><span class="am-device-thumb"></span>' + esc(dev.platform) +
            '<span class="am-tag">This device</span></span>' +
          '<span class="am-meta">' + esc(dev.browser) + '<br>' + esc(dev.ip) + '<br>' + esc(dev.seen) + '</span>' +
        '</div>' +
        '<div class="am-row-action"></div>' +
      '</div>';
  }

  function privacyHTML() {
    if (loadFailed) {
      return '' +
        '<div class="am-error">' +
          '<span class="am-error-icon fa" aria-hidden="true">triangle-exclamation</span>' +
          '<span class="am-error-title">We could not load your privacy choices</span>' +
          '<p class="am-error-text">Our consent manager did not respond, so your current choices ' +
            'are not showing. Nothing has changed. Try again in a moment.</p>' +
          '<div class="am-error-actions">' +
            '<button class="btn btn-secondary btn-sm" type="button" data-am-retry>Try again</button>' +
            '<button class="btn btn-ghost btn-sm" type="button" data-am-policy>See full cookie policy</button>' +
          '</div>' +
        '</div>';
    }

    return '' +
      '<div class="am-privacy">' +
        '<div>' +
          '<p>In this panel you can express some preferences related to the processing of your ' +
            'personal information.</p>' +
          '<p>You may review and change expressed choices at any time by resurfacing this panel ' +
            'via the provided link.</p>' +
          '<p>To deny your consent to the specific processing activities described below, switch ' +
            'the toggles to off or use the “Reject all” button and confirm you want to save your choices.</p>' +
        '</div>' +

        '<div class="am-privacy-actions">' +
          '<button class="btn btn-secondary btn-sm" type="button" data-am-reject>Reject all</button>' +
          '<button class="btn btn-secondary btn-sm" type="button" data-am-accept>Accept all</button>' +
        '</div>' +

        '<div data-am-notice></div>' +

        '<h3 class="am-subtitle">Your consent preferences for tracking technologies</h3>' +
        '<p>The options provided in this section allow you to customize your consent preferences ' +
          'for any tracking technology used for the purposes described below. To learn more about ' +
          'how these trackers help us and how they work, refer to the ' +
          '<button class="am-action am-action-link" type="button" data-am-policy>cookie policy</button>. ' +
          'Please be aware that denying consent for a particular purpose may make related features ' +
          'unavailable.</p>' +

        '<div class="am-cats">' +
          CATEGORIES.map(function (c) {
            var on = c.locked ? true : !!draft[c.key];
            return '<div class="am-cat">' +
              '<div class="am-cat-text">' +
                '<span class="am-cat-name">' + esc(c.name) +
                  (c.locked ? '<span class="am-tag">Always on</span>' : '') +
                '</span>' +
                '<span class="am-cat-desc">' + esc(c.desc) + '</span>' +
              '</div>' +
              '<div class="am-cat-control">' +
                '<label class="am-switch">' +
                  '<input type="checkbox" class="am-switch-input"' +
                    (c.locked ? ' disabled' : ' data-am-cat="' + c.key + '"') +
                    (on ? ' checked' : '') +
                    ' aria-label="' + esc(c.name) + ' trackers">' +
                  '<span class="am-switch-track"></span>' +
                '</label>' +
              '</div>' +
            '</div>';
          }).join('') +
        '</div>' +

        '<span class="am-meta" data-am-updated></span>' +
      '</div>';
  }

  /* Full policy, shown IN PLACE of the Privacy Choices content (same tab, same
     panel — not a new tab or an external page). Wireframe placeholder until the
     real policy content lands. The back control returns to the choices with the
     draft toggles untouched; the panel's X still closes the whole modal. */
  function policyHTML() {
    return '' +
      '<div class="am-policy">' +
        '<div class="am-policy-placeholder">' +
          '<span class="fa" aria-hidden="true">file-lines</span>' +
          '<span class="am-policy-name">Full privacy policy</span>' +
          '<span class="am-policy-note">Placeholder. The policy content loads here.</span>' +
        '</div>' +
      '</div>';
  }

  /* Notice + save button + "last updated" all key off draft vs saved state.
     Updated in place so toggling a category never rebuilds (and rescrolls) the
     list under the user's cursor. */
  function syncControls() {
    var saved = readPrivacy();

    var notice = overlay.querySelector('[data-am-notice]');
    if (notice) {
      if (justSaved) {
        notice.innerHTML =
          '<div class="am-notice am-notice-ok">' +
            '<span class="fa" aria-hidden="true">circle-check</span>' +
            '<span>Your choices are saved. They apply across Sena on this browser.</span>' +
          '</div>';
      } else if (saved.source === 'signup') {
        notice.innerHTML =
          '<div class="am-notice">' +
            '<span class="fa" aria-hidden="true">circle-info</span>' +
            '<span>These are the choices captured when you signed up. Review or change them any time.</span>' +
          '</div>';
      } else {
        notice.innerHTML = '';
      }
    }

    overlay.querySelectorAll('[data-am-cat]').forEach(function (input) {
      input.checked = !!draft[input.getAttribute('data-am-cat')];
    });

    var updated = overlay.querySelector('[data-am-updated]');
    if (updated) {
      updated.textContent = saved.updatedAt ? 'Last updated ' + stamp(saved.updatedAt) : '';
    }

    var saveBtn = overlay.querySelector('[data-am-save]');
    if (saveBtn) saveBtn.disabled = !draftDirty();
  }

  function footHTML() {
    if (activeTab !== 'privacy' || loadFailed || policyOpen) return '';
    return '' +
      '<div class="am-foot">' +
        '<button class="am-action" type="button" data-am-policy>See full cookie policy</button>' +
        '<button class="btn btn-primary btn-sm" type="button" data-am-save' +
          (draftDirty() ? '' : ' disabled') + '>Save preferences</button>' +
      '</div>';
  }

  /* ── Render ────────────────────────────────────────────────────────────── */
  function build() {
    overlay = document.createElement('div');
    overlay.className = 'am-overlay';
    overlay.innerHTML =
      '<div class="am-panel" role="dialog" aria-modal="true" aria-label="Account">' +
        '<div class="am-header">' +
          '<div class="am-header-text">' +
            '<h2 class="am-heading">Account</h2>' +
            '<p class="am-heading-sub">Manage your account info.</p>' +
          '</div>' +
          '<button class="am-close fa" type="button" aria-label="Close">xmark</button>' +
        '</div>' +
        '<div class="am-split">' +
          '<div class="am-rail">' +
            '<div class="am-tabs" role="tablist" aria-label="Account sections">' +
              TABS.map(function (t) {
                return '<button class="am-tab" type="button" role="tab" data-am-tab="' + t.key + '">' +
                  '<span class="am-tab-icon fa" aria-hidden="true">' + t.icon + '</span>' +
                  '<span>' + t.label + '</span>' +
                '</button>';
              }).join('') +
            '</div>' +
          '</div>' +
          '<div class="am-content">' +
            '<div class="am-body" role="tabpanel"></div>' +
          '</div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);

    overlay.querySelector('.am-close').addEventListener('click', close);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    overlay.addEventListener('click', onPanelClick);
    overlay.addEventListener('change', onPanelChange);
  }

  function render() {
    var content = overlay.querySelector('.am-content');
    var body = overlay.querySelector('.am-body');
    var tab = TABS.filter(function (t) { return t.key === activeTab; })[0] || TABS[0];

    overlay.querySelectorAll('[data-am-tab]').forEach(function (btn) {
      var on = btn.getAttribute('data-am-tab') === tab.key;
      btn.classList.toggle('active', on);
      btn.setAttribute('aria-selected', on ? 'true' : 'false');
    });

    /* The policy replaces the Privacy Choices content within the same tab, so
       it gets its own title plus a back control above it. */
    var showPolicy = tab.key === 'privacy' && policyOpen;
    var inner = tab.key === 'security' ? securityHTML()
      : showPolicy ? policyHTML()
      : tab.key === 'privacy' ? privacyHTML()
      : profileHTML();
    var back = showPolicy
      ? '<button class="am-back" type="button" data-am-back>' +
          '<span class="fa" aria-hidden="true">arrow-left</span>Your Privacy Choices</button>'
      : '';
    var title = showPolicy ? 'Full privacy policy' : tab.title;
    body.innerHTML = back + '<h1 class="am-title">' + title + '</h1>' + inner;
    body.scrollTop = 0;

    var foot = content.querySelector('.am-foot');
    if (foot) foot.remove();
    var html = footHTML();
    if (html) content.insertAdjacentHTML('beforeend', html);

    if (tab.key === 'privacy' && !loadFailed) syncControls();
  }

  /* ── Interaction ───────────────────────────────────────────────────────── */
  function onPanelClick(e) {
    var tabBtn = e.target.closest('[data-am-tab]');
    if (tabBtn) { setTab(tabBtn.getAttribute('data-am-tab')); return; }

    if (e.target.closest('[data-am-reject]')) { setAll(false); return; }
    if (e.target.closest('[data-am-accept]')) { setAll(true); return; }
    if (e.target.closest('[data-am-save]')) { save(); return; }
    if (e.target.closest('[data-am-retry]')) { loadFailed = false; render(); return; }
    if (e.target.closest('[data-am-policy]')) { policyOpen = true; render(); return; }
    if (e.target.closest('[data-am-back]')) { policyOpen = false; render(); return; }
  }

  function onPanelChange(e) {
    var input = e.target.closest('[data-am-cat]');
    if (!input) return;
    draft[input.getAttribute('data-am-cat')] = input.checked;
    justSaved = false;
    syncControls();
  }

  function setAll(value) {
    CONSENT_KEYS.forEach(function (k) { draft[k] = value; });
    justSaved = false;
    syncControls();
  }

  function save() {
    var rec = readPrivacy();
    CONSENT_KEYS.forEach(function (k) { rec[k] = !!draft[k]; });
    rec.source = 'panel';
    rec.updatedAt = Date.now();
    writePrivacy(rec);
    justSaved = true;
    syncControls();
  }

  function setTab(key) {
    if (activeTab === key) return;
    activeTab = key;
    justSaved = false;
    policyOpen = false;
    if (key === 'privacy') resetDraft();
    render();
  }

  function resetDraft() {
    var saved = readPrivacy();
    draft = {};
    CONSENT_KEYS.forEach(function (k) { draft[k] = !!saved[k]; });
  }

  /* Escape steps back before it closes: with the policy open it returns to the
     choices, and only a second Escape dismisses the modal. */
  function onKey(e) {
    if (e.key !== 'Escape') return;
    e.stopPropagation();
    if (policyOpen) { policyOpen = false; render(); return; }
    close();
  }

  /* ── Public API ────────────────────────────────────────────────────────── */
  function open(tab) {
    if (!overlay) build();
    activeTab = TABS.some(function (t) { return t.key === tab; }) ? tab : 'profile';
    justSaved = false;
    policyOpen = false;
    resetDraft();
    render();
    overlay.classList.add('open');
    document.addEventListener('keydown', onKey, true);
    var closeBtn = overlay.querySelector('.am-close');
    if (closeBtn) closeBtn.focus();
  }

  function close() {
    if (overlay) overlay.classList.remove('open');
    document.removeEventListener('keydown', onKey, true);
  }

  /* Prototype-only state switch for the Privacy tab's edge states:
       'error'     — the consent manager failed to load
       'saved'     — the just-confirmed state (post-save confirmation)
       'first-run' — no record yet, i.e. consent as captured at sign-up
       'ok'        — normal state */
  function setPrivacyState(state) {
    loadFailed = state === 'error';
    justSaved = state === 'saved';
    if (state === 'first-run') localStorage.removeItem(PRIVACY_KEY);
    if (state === 'saved') {
      var rec = readPrivacy();
      rec.source = 'panel';
      rec.updatedAt = rec.updatedAt || Date.now();
      writePrivacy(rec);
    }
    resetDraft();
    if (overlay && overlay.classList.contains('open')) render();
  }

  function resetPrivacy() {
    localStorage.removeItem(PRIVACY_KEY);
    loadFailed = false;
    justSaved = false;
    resetDraft();
    if (overlay && overlay.classList.contains('open')) render();
  }

  /* ── Init ──────────────────────────────────────────────────────────────── */
  function wireOpeners() {
    document.querySelectorAll('[data-account-open]').forEach(function (el) {
      if (el.dataset.amWired) return;
      el.dataset.amWired = 'true';
      el.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        open(el.getAttribute('data-account-open') || 'profile');
      });
    });
  }

  function init() {
    wireOpeners();
    /* Deep links for prototyping: ?account=privacy opens the panel on that tab,
       ?privacy=error|saved|first-run forces one of the Privacy edge states. */
    var q = window.location.search;
    var p = q.match(/[?&]privacy=([^&]*)/);
    var m = q.match(/[?&]account(?:=([^&]*))?/);
    if (m || p) open(m ? (m[1] || 'profile') : 'privacy');
    if (p) setPrivacyState(p[1]); /* after open(), which resets the edge state */
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return {
    open: open,
    close: close,
    setTab: setTab,
    setPrivacyState: setPrivacyState,
    readPrivacy: readPrivacy,
    resetPrivacy: resetPrivacy,
    wireOpeners: wireOpeners,
    CATEGORIES: CATEGORIES
  };
})();
