/* ════════════════════════════════════════════════════════════════════════════ */
/* SCREEN.JS — Shared behaviors for all Sena screens                          */
/* Import via <script src="../design-system/screen.js"></script>               */
/* ════════════════════════════════════════════════════════════════════════════ */

/* ── Dev mode ──────────────────────────────────────────────────────────────
   Prototype tooling (trial admin gear, composer token counters) is hidden by
   default. The ?devmode URL param is a PERSISTENT toggle: `?devmode` (or
   `?devmode=on`) switches it on, `?devmode=off` switches it off, and the
   state sticks across pages/reloads via localStorage until toggled again.
   CSS keys off the `sena-dev` class on <html>. */
(function () {
  var m = window.location.search.match(/[?&]devmode(?:=([^&]*))?/);
  if (m) {
    var off = /^(off|0|false)$/i.test(m[1] || '');
    localStorage.setItem('sena-devmode', off ? '' : 'on');
  }
  if (localStorage.getItem('sena-devmode') === 'on') {
    document.documentElement.classList.add('sena-dev');
  }
})();

/* ── Theme toggle ──────────────────────────────────────────────────────── */
function toggleTheme() {
  var html = document.documentElement;
  var isDark = html.getAttribute('data-theme') === 'dark';
  html.classList.add('theme-transitioning');
  html.setAttribute('data-theme', isDark ? '' : 'dark');
  localStorage.setItem('sena-theme', isDark ? '' : 'dark');
  var icon = document.querySelector('.theme-toggle .btn-icon');
  if (icon) icon.textContent = isDark ? 'sun-bright' : 'moon';
  setTimeout(function () { html.classList.remove('theme-transitioning'); }, 500);
}

/* ── Sidebar collapse / expand ─────────────────────────────────────────── */
function toggleSidebar() {
  var wrap = document.getElementById('sidebarWrap');
  if (!wrap) return;
  var willCollapse = !wrap.classList.contains('collapsed');

  if (willCollapse) {
    wrap.classList.add('collapsed');
    wrap.classList.add('no-hover-expand');
    wrap.addEventListener('mouseleave', function once() {
      wrap.classList.remove('no-hover-expand');
      wrap.removeEventListener('mouseleave', once);
    });
  } else {
    wrap.classList.remove('collapsed');
  }
  localStorage.setItem('sena-sidebar', willCollapse ? 'collapsed' : 'expanded');
}

/* ── Sync sidebar state on load ───────────────────────────────────────── */
function initSidebarState() {
  var wrap = document.getElementById('sidebarWrap');
  if (!wrap) return;
  var sidebar = wrap.querySelector('.sidebar');
  var wasHovering = sessionStorage.getItem('sena-sidebar-hover');
  sessionStorage.removeItem('sena-sidebar-hover');
  document.documentElement.classList.remove('sb-c');

  if (localStorage.getItem('sena-sidebar') === 'collapsed') {
    if (wasHovering) {
      // Came from a hover-click navigation — show collapsed + hover overlay.
      // .hover-expanded mirrors the :hover styles via CSS :is().
      wrap.style.transition = 'none';
      sidebar.style.transition = 'none';
      wrap.classList.add('collapsed', 'hover-expanded');
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          wrap.style.transition = '';
          sidebar.style.transition = '';
        });
      });
      // On first mousemove, check if cursor is still over sidebar.
      document.addEventListener('mousemove', function check(e) {
        var rect = wrap.getBoundingClientRect();
        var isOver = e.clientX >= rect.left && e.clientX <= rect.right &&
                     e.clientY >= rect.top  && e.clientY <= rect.bottom;
        if (isOver) {
          // Cursor is here — wait for mouseleave to collapse.
          wrap.addEventListener('mouseleave', function once() {
            wrap.classList.remove('hover-expanded');
            wrap.removeEventListener('mouseleave', once);
          });
        } else {
          // Cursor is elsewhere — collapse now.
          wrap.classList.remove('hover-expanded');
        }
      }, { once: true });
    } else {
      // Normal load — collapse instantly, no flash.
      wrap.style.transition = 'none';
      sidebar.style.transition = 'none';
      wrap.classList.add('collapsed');
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          wrap.style.transition = '';
          sidebar.style.transition = '';
        });
      });
    }
  } else {
    wrap.classList.remove('collapsed');
  }

  // Save hover state before navigation so next page can stay expanded.
  wrap.addEventListener('click', function (e) {
    if (wrap.classList.contains('collapsed')) {
      sessionStorage.setItem('sena-sidebar-hover', 'true');
    }
  }, true);

  // Click on empty area while hover-expanded → pin sidebar open
  wrap.addEventListener('click', function (e) {
    if (!wrap.classList.contains('collapsed')) return;
    if (e.target.closest('a, button, .nav-item, .session-item, .user-row')) return;
    toggleSidebar();
  });
}

/* ── Wire all search bar clear buttons ─────────────────────────────────── */
function wireSearchBars() {
  document.querySelectorAll('.search-bar').forEach(function (bar) {
    var input = bar.querySelector('.search-bar-input');
    var clearBtn = bar.querySelector('.search-bar-clear');
    if (!input || !clearBtn || clearBtn.dataset.wired) return;
    clearBtn.dataset.wired = 'true';
    input.addEventListener('input', function () {
      clearBtn.classList.toggle('visible', input.value.length > 0);
    });
    clearBtn.addEventListener('click', function () {
      input.value = '';
      clearBtn.classList.remove('visible');
      input.focus();
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
  });
}

/* ── Recent Sessions visibility ────────────────────────────────────────────
   The session list is static placeholder markup inlined in every sidebar (no
   real backing data). Resetting the trial (devmode) simulates a fresh
   account, so it hides these placeholders via the 'sena-sessions-hidden'
   flag — set by SenaTrial.reset(), never by anything else. Independent of
   that flag, the "Recent Sessions" title only shows when the list actually
   has visible items — general empty-state rule for the section. */
function refreshSidebarSessions() {
  var hidden = localStorage.getItem('sena-sessions-hidden') === '1';
  document.querySelectorAll('.sidebar-section').forEach(function (section) {
    var list = section.querySelector('.session-list');
    var labelRow = section.querySelector('.section-label-row');
    if (!list) return;
    list.querySelectorAll('.session-item').forEach(function (li) {
      li.style.display = hidden ? 'none' : '';
    });
    var anyVisible = Array.prototype.some.call(
      list.querySelectorAll('.session-item'),
      function (li) { return li.style.display !== 'none'; }
    );
    if (labelRow) labelRow.style.display = anyVisible ? '' : 'none';
    section.style.display = anyVisible ? '' : 'none';
  });
}

/* ── Sidebar include helper ────────────────────────────────────────────── */
function loadSidebar(options) {
  options = options || {};
  var slot = document.getElementById('sidebar-slot');
  if (!slot) return Promise.resolve();
  return fetch('../design-system/sidebar-partial.html')
    .then(function (r) { return r.text(); })
    .then(function (html) {
      slot.outerHTML = html;
      // Set active nav item
      if (options.activeNav) {
        var navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(function (item) {
          var label = item.querySelector('.nav-label');
          if (label && label.textContent.trim() === options.activeNav) {
            item.classList.add('active');
          }
        });
      }
      // Set active session
      if (options.activeSession) {
        var sessions = document.querySelectorAll('.session-item');
        sessions.forEach(function (item) {
          var label = item.querySelector('.session-label');
          if (label && label.textContent.trim() === options.activeSession) {
            item.classList.add('active');
          }
        });
      }
      // SenaTrial's DOMContentLoaded pass ran before this markup existed, so
      // the plan row, account menu and tour card have to be mounted now.
      if (window.SenaTrial && SenaTrial.mount) SenaTrial.mount();
      if (window.SenaAccount) SenaAccount.wireOpeners();
    });
}

/* ── Toggle chat panel ─────────────────────────────────────────────────── */
function toggleChatPanel() {
  var panel = document.getElementById('chatPanel');
  if (!panel) return;
  panel.classList.add('animating');
  panel.classList.toggle('collapsed');
  panel.addEventListener('transitionend', function once() {
    panel.classList.remove('animating');
    panel.removeEventListener('transitionend', once);
  });
}

/* ── Keyboard shortcuts ─────────────────────────────────────────────────── */
document.addEventListener('keydown', function (e) {
  var tag = document.activeElement && document.activeElement.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement.isContentEditable) return;
  if (e.key === 's' || e.key === 'S') toggleSidebar();
  if (e.key === 'm' || e.key === 'M') toggleTheme();
  if (e.key === 'c' || e.key === 'C') toggleChatPanel();
});

/* ── Auth gate (skipped for local dev: file:// and localhost) ──────────── */
function checkAuth() {
  var h = location.hostname;
  if (h === '' || h === 'localhost' || h === '127.0.0.1') return;
  var isSignIn = location.pathname.endsWith('/sign-in.html');
  var hasAuth = document.cookie.split(';').some(function (c) {
    return c.trim().startsWith('sena-auth=');
  });
  if (!isSignIn && !hasAuth) {
    location.replace('/screens/sign-in.html');
  }
}
checkAuth();

/* ── Auto-init on DOMContentLoaded ─────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {
  wireSearchBars();
  initSidebarState();
  refreshSidebarSessions();
  wireChatboxAutoGrow();
  // Sync theme toggle icon with persisted theme
  var icon = document.querySelector('.theme-toggle .btn-icon');
  if (icon) icon.textContent = document.documentElement.getAttribute('data-theme') === 'dark' ? 'moon' : 'sun-bright';
});

/* ── Auto-grow chatbox textareas ───────────────────────────────────────── */
function wireChatboxAutoGrow() {
  document.querySelectorAll('.chatbox-input').forEach(function (textarea) {
    if (textarea.dataset.autoGrow) return;
    textarea.dataset.autoGrow = 'true';
    function grow() {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
    textarea.addEventListener('input', grow);
  });
}

/* ════════════════════════════════════════════════════════════════════════ */
/* SENA TRIAL — free Starters plan engine                                   */
/*                                                                          */
/* The unpaid state is the free Starters plan: 25 credits a month that      */
/* reset monthly and never expire. Credits stay fully behind the scenes:    */
/* consumption is counted per ACTION (the real pricing table below), never  */
/* shown as numbers in the UX. Surfaces: sidebar plan row, home checklist,  */
/* low/exhausted banner, out-of-credits gate modal, plans/subscription      */
/* pages, and a devmode-only admin section (the one place the mapping is    */
/* visible).                                                                */
/*   sena-trial = { startedAt, plan, planCycle, upgradedAt, bonuses,        */
/*                  freePeriodStart, freeUsedBaseline,                      */
/*                  actions, checklist, checklistDismissed, dev }           */
/* Credits are DERIVED on read (Σ actions × price), never stored. The       */
/* storage key and the internal plan value 'trial' are kept for             */
/* compatibility; user-facing copy says Starters / free plan.               */
/* Public API: window.SenaTrial.                                            */
/* ════════════════════════════════════════════════════════════════════════ */
window.SenaTrial = (function () {
  var KEY = 'sena-trial';
  var FREE_CREDITS = 25, HARD_CAP = 1000, LOW_CREDITS = 5;
  var DAY = 24 * 60 * 60 * 1000;

  /* Credit pricing (product decision). A Signal is the simple turn itself
     (1 cr); the analytical outputs a turn produces bill on top: each data
     viz / insight card / table = an Insight (10), a presentation = 50.
     Uploads and app connections are one-off 5-credit actions. */
  var CREDIT_PRICING = { signals: 1, uploads: 5, integrations: 5, insights: 10, forecasts: 25, decks: 50 };
  var ACTION_LABELS  = { signals: 'Signals', uploads: 'Data upload', integrations: 'App integrations',
                         insights: 'Insights', forecasts: 'Forecasts', decks: 'Powerpoint generation' };

  var BONUSES = { context: 15, demo: 5, deliverable: 10 };
  var PLAN_NAMES = { trial: 'Starters', starter: 'Starters', growth: 'Growth', enterprise: 'Enterprise' };

  function defaults() {
    return {
      startedAt: Date.now(),
      plan: 'trial',            // internal value for the free Starters plan
      freePeriodStart: Date.now(),
      freeUsedBaseline: 0,      // lifetime credits consumed before this free month
      planCycle: null,
      planPrice: null,
      planCredits: null,
      planUsedBaseline: null,
      cancelAt: null,           // set on cancel: plan stays paid until this ts
      upgradedAt: null,
      bonuses: 0,
      granted: {},              // one-time bonus keys already awarded (e.g. onboarding)
      actions: { signals: 0, uploads: 0, integrations: 0, insights: 0, forecasts: 0, decks: 0 },
      checklist: { context: false, demo: false, deliverable: false },
      checklistDismissed: false,
      dev: { forceState: null, daysOffset: 0 }
    };
  }

  function read() {
    var d = defaults();
    try {
      var t = JSON.parse(localStorage.getItem(KEY));
      if (t && typeof t === 'object' && t.startedAt) {
        t.actions = Object.assign(d.actions, t.actions || {});
        t.checklist = Object.assign(d.checklist, t.checklist || {});
        t.granted = Object.assign(d.granted, t.granted || {});
        t.dev = Object.assign(d.dev, t.dev || {});
        return Object.assign(d, t);
      }
    } catch (_) {}
    return null;
  }
  function write(t) { localStorage.setItem(KEY, JSON.stringify(t)); }

  /* First visit anywhere creates the free account — onboarding needs no
     special hook. */
  function ensureStarted() {
    var t = read();
    if (!t) { t = defaults(); write(t); return t; }
    /* A cancelled subscription stays paid until its period ends, then it
       rolls back to the free Starters plan automatically. */
    if (t.plan !== 'trial' && t.cancelAt && Date.now() >= t.cancelAt) {
      revertToFree(t);
      write(t);
    }
    /* Monthly allowance rollover: when a free month ends, start the next one
       and snapshot consumption so the allowance reads full again. */
    if (t.plan === 'trial' && Date.now() >= freePeriodEnd(t)) {
      var d = new Date(t.freePeriodStart || t.startedAt);
      while (d.getTime() <= Date.now()) d.setMonth(d.getMonth() + 1);
      d.setMonth(d.getMonth() - 1);
      t.freePeriodStart = d.getTime();
      t.freeUsedBaseline = creditsUsed(t);
      write(t);
    }
    return t;
  }
  function revertToFree(t) {
    t.plan = 'trial';
    t.planCycle = null;
    t.planPrice = null;
    t.planCredits = null;
    t.planUsedBaseline = null;
    t.cancelAt = null;
    t.upgradedAt = null;
    /* Fresh free month from the downgrade moment */
    t.freePeriodStart = Date.now();
    t.freeUsedBaseline = creditsUsed(t);
  }
  /* End of the current free month (freePeriodStart + 1 month). */
  function freePeriodEnd(t) {
    var d = new Date(t.freePeriodStart || t.startedAt || Date.now());
    d.setMonth(d.getMonth() + 1);
    return d.getTime();
  }
  /* End of the current billing period: advance from upgradedAt by one cycle
     (month / year) until the date lands in the future. */
  function periodEnd(t) {
    t = t || ensureStarted();
    var d = new Date(t.upgradedAt || Date.now());
    var now = Date.now();
    var annual = t.planCycle === 'annual';
    while (d.getTime() <= now) {
      if (annual) d.setFullYear(d.getFullYear() + 1);
      else d.setMonth(d.getMonth() + 1);
    }
    return d.getTime();
  }

  /* Lifetime credits consumed (Σ actions × price). */
  function creditsUsed(t) {
    t = t || ensureStarted();
    return Object.keys(CREDIT_PRICING).reduce(function (sum, k) {
      return sum + (t.actions[k] || 0) * CREDIT_PRICING[k];
    }, 0);
  }
  /* Credits consumed within the current free month. */
  function freeUsed(t) {
    t = t || ensureStarted();
    return Math.max(0, creditsUsed(t) - (t.freeUsedBaseline || 0));
  }
  function creditsLeft(t) {
    t = t || ensureStarted();
    return FREE_CREDITS + (t.bonuses || 0) - freeUsed(t);
  }
  /* Days until the free allowance resets (kept as daysLeft for API compat). */
  function daysLeft(t) {
    t = t || ensureStarted();
    var left = Math.ceil((freePeriodEnd(t) - Date.now()) / DAY) - (t.dev.daysOffset || 0);
    return Math.max(0, left);
  }

  function state() {
    var t = ensureStarted();
    if (t.dev.forceState) return t.dev.forceState;
    if (t.plan !== 'trial') return 'paid';
    if (creditsUsed(t) >= HARD_CAP || creditsLeft(t) <= 0) return 'exhausted';
    if (creditsLeft(t) <= LOW_CREDITS) return 'low';
    return 'active';
  }

  /* ── Action recording ─────────────────────────────────────────────────── */
  function recordAction(kind, n) {
    var t = ensureStarted();
    if (!(kind in t.actions)) return;
    t.actions[kind] += (n == null ? 1 : n);
    if (t.actions[kind] < 0) t.actions[kind] = 0;
    write(t);
  }

  /* Count a chat turn: every turn is a Signal (the base act of asking Sena);
     each analytical artifact it produced — data viz, insight card, or data
     table — is an Insight; a generated deck is a Powerpoint action. */
  function recordTurn(info) {
    info = info || {};
    recordAction('signals');
    if (info.insightCount > 0) recordAction('insights', info.insightCount);
    if (info.hasDeck) recordAction('decks');
  }

  function grant(n) {
    var t = ensureStarted();
    t.bonuses += Number(n) || 0;
    write(t);
  }
  /* Grant a bonus at most once per account, keyed (e.g. 'onboarding'). Returns
     true if it awarded this call, false if the key was already granted. */
  function grantOnce(key, n) {
    var t = ensureStarted();
    t.granted = t.granted || {};
    if (t.granted[key]) return false;
    t.granted[key] = true;
    t.bonuses += Number(n) || 0;
    write(t);
    refresh();
    return true;
  }

  /* plan: a label (e.g. "500 credits"); price: numeric monthly amount. */
  function upgrade(plan, cycle, price) {
    var t = ensureStarted();
    t.plan = plan || 'paid';
    t.planCycle = cycle || 'monthly';
    t.planPrice = price != null ? Number(price) : null;
    t.upgradedAt = Date.now();
    /* Snapshot the monthly credit allotment (parsed from the label) + the
       consumption baseline, so paid usage = creditsUsed() − baseline. */
    var m = String(plan || '').replace(/[, ]/g, '').match(/\d+/);
    t.planCredits = m ? Number(m[0]) : null;
    t.planUsedBaseline = creditsUsed(t);
    t.cancelAt = null; /* (re)subscribing clears any pending cancellation */
    t.dev.forceState = null;
    write(t);
    refresh();
  }
  /* Credits consumed on the current paid plan this cycle (0 if not paid). */
  function planUsage(t) {
    t = t || ensureStarted();
    if (t.plan === 'trial' || t.planCredits == null) return null;
    var used = Math.max(0, creditsUsed(t) - (t.planUsedBaseline || 0));
    return { used: used, total: t.planCredits, left: Math.max(0, t.planCredits - used) };
  }
  /* Cancel = schedule the downgrade for the period end; stay paid until then.
     The plan reverts to the free trial automatically once cancelAt passes
     (see ensureStarted). */
  function cancel() {
    var t = ensureStarted();
    if (t.plan === 'trial') return;
    t.cancelAt = periodEnd(t);
    write(t);
    refresh();
  }
  /* Undo a pending cancellation while the plan is still live. */
  function resubscribe() {
    var t = ensureStarted();
    if (t.plan === 'trial' || !t.cancelAt) return;
    t.cancelAt = null;
    write(t);
    refresh();
  }
  function reset() {
    write(defaults());
    /* A reset simulates a brand-new account — the static placeholder session
       history no longer makes sense, so hide it too (see refreshSidebarSessions). */
    localStorage.setItem('sena-sessions-hidden', '1');
    if (typeof refreshSidebarSessions === 'function') refreshSidebarSessions();
    refresh();
  }

  /* ── Checklist ────────────────────────────────────────────────────────── */
  function isFilled(v) {
    return Array.isArray(v)
      ? v.some(function (x) { return x && String(x).trim(); })
      : (v != null && String(v).trim() !== '');
  }
  /* Same 12-field rule as the home-new profile card / Context page score —
     self-checkout: the company profile is user-editable and counts too. */
  function contextComplete() {
    var s = window.Scenario && Scenario.get();
    var bc = (s && s.business_context) || null;
    if (!bc) return false;
    var singles = ['company_name', 'industry', 'description', 'company_size',
                   'role_title', 'department', 'role_description', 'objectives', 'kpis'];
    var pairs = [
      ['geographic_focus', 'geographic_focus_override'],
      ['target_segments', 'target_segments_override'],
      ['competitors', 'competitors_override']
    ];
    return singles.every(function (k) { return isFilled(bc[k]); }) &&
           pairs.every(function (p) { return p.some(function (k) { return isFilled(bc[k]); }); });
  }

  /* One-way detection; each newly-completed item silently grants its bonus
     (extends the invisible credit budget) — credits stay behind the scenes. */
  function syncChecklist() {
    var t = ensureStarted();
    var detect = {
      context: contextComplete(),
      demo: (t.actions.signals + t.actions.insights) > 0,
      deliverable: t.actions.decks > 0
    };
    var changed = false;
    Object.keys(detect).forEach(function (k) {
      if (!t.checklist[k] && detect[k]) {
        t.checklist[k] = true;
        t.bonuses += BONUSES[k];
        changed = true;
      }
    });
    if (changed) write(t);
    return changed;
  }
  function setChecklistItem(key) {
    var t = ensureStarted();
    if (t.checklist[key] === false) {
      t.checklist[key] = true;
      t.bonuses += BONUSES[key] || 0;
      write(t);
    }
  }
  function dismissChecklist() {
    var t = ensureStarted();
    t.checklistDismissed = true;
    write(t);
    renderChecklist();
  }

  /* ── Self-demo ────────────────────────────────────────────────────────── */
  function buildDemoPrompt() {
    var s = window.Scenario && Scenario.get();
    var bc = (s && s.business_context) || {};
    var geo  = bc.geographic_focus_override || bc.geographic_focus || 'my key markets';
    var seg  = bc.target_segments_override  || bc.target_segments  || 'my target customers';
    var comp = bc.competitors_override      || bc.competitors      || 'my main competitors';
    var objectives = Array.isArray(bc.objectives) && bc.objectives.length
      ? bc.objectives.join('; ') : 'my growth objectives';
    var role = bc.role_title || 'my role';
    return 'I want a quick demonstration of what you can do for me. Generate a realistic ' +
      'synthetic market snapshot for ' + geo + ', focused on ' + seg + ' and tracking ' + comp + '. ' +
      'Frame it around my objectives: ' + objectives + '. Include 3–4 sena-chart visualizations ' +
      '(a mix of chart types) and one short "what this means for ' + role + '" takeaway. ' +
      'Make clear the data is illustrative sample data.';
  }
  /* A deliverable needs material to work from, so this tour prompt first
     produces a synthetic analysis WITH charts, then a presentation from it —
     the user lands in a conversation that already has data viz, then a deck. */
  function buildDeliverablePrompt() {
    var s = window.Scenario && Scenario.get();
    var bc = (s && s.business_context) || {};
    var geo  = bc.geographic_focus_override || bc.geographic_focus || 'my key markets';
    var seg  = bc.target_segments_override  || bc.target_segments  || 'my target customers';
    var comp = bc.competitors_override      || bc.competitors      || 'my main competitors';
    var role = bc.role_title || 'my role';
    return 'Show me how Sena turns analysis into a deliverable. Using illustrative ' +
      'synthetic data for ' + geo + ' (' + seg + ', tracking ' + comp + '), first present ' +
      '2–3 sena-chart visualizations of the key opportunities, then create a sena-deck ' +
      'presentation summarizing them for ' + role + '. Make clear the data is illustrative sample data.';
  }

  /* Tour launches are flagged tour:true so chat.html does NOT bill the turn
     against the trial — the guided tour shouldn't burn the user's credits. */
  function launchDemo() {
    setChecklistItem('demo');
    localStorage.setItem('sena-submit', JSON.stringify({ message: buildDemoPrompt(), files: [], tour: true }));
    window.location.href = 'chat.html';
  }
  function launchDeckStarter() {
    setChecklistItem('deliverable');
    localStorage.setItem('sena-submit', JSON.stringify({ message: buildDeliverablePrompt(), files: [], tour: true }));
    window.location.href = 'chat.html';
  }

  /* ── Sidebar free-plan row (injected — the sidebar is inlined per screen) */
  function injectTrialRow() {
    document.querySelectorAll('.sidebar-foot').forEach(function (foot) {
      if (foot.querySelector('.st-trial')) return;
      var row = document.createElement('div');
      row.className = 'st-trial';
      /* Circular ring meter; arc = credits consumed (r=8 → C≈50.265). */
      row.innerHTML =
        '<svg class="st-trial-ring" viewBox="0 0 20 20" aria-hidden="true">' +
          '<circle class="st-trial-ring-track" cx="10" cy="10" r="8"></circle>' +
          '<circle class="st-trial-ring-fill" cx="10" cy="10" r="8"></circle>' +
        '</svg>' +
        '<span class="st-trial-label"></span>' +
        '<a class="st-trial-cta" href="plans.html">Upgrade</a>';
      foot.insertBefore(row, foot.querySelector('.user-row'));
    });
  }
  function refreshTrialRow() {
    var s = state(), d = daysLeft(), t = ensureStarted();
    var total = FREE_CREDITS + (t.bonuses || 0);
    var left = Math.max(0, creditsLeft(t));
    var pctUsed = total > 0 ? Math.max(0, Math.min(100, (freeUsed(t) / total) * 100)) : 100;
    document.querySelectorAll('.st-trial').forEach(function (row) {
      var label = row.querySelector('.st-trial-label');
      var ring = row.querySelector('.st-trial-ring-fill');
      row.classList.remove('st-low', 'st-expired');
      if (s === 'paid') { row.style.display = 'none'; return; }
      row.style.display = '';
      row.title = left + (left === 1 ? ' credit' : ' credits') + ' left this month · resets in ' +
        d + (d === 1 ? ' day' : ' days');
      if (ring) {
        /* Arc grows with CONSUMPTION: empty ring = untouched allowance. */
        var C = 2 * Math.PI * 8; /* r=8 in the 20×20 viewBox */
        ring.style.strokeDasharray = C;
        ring.style.strokeDashoffset = C * (1 - pctUsed / 100);
      }
      if (s === 'exhausted') {
        row.classList.add('st-expired');
        label.textContent = 'Out of free credits';
      } else if (s === 'low') {
        row.classList.add('st-low');
        label.textContent = 'Starters · running low';
      } else {
        label.textContent = 'Starters · free plan';
      }
    });
  }

  /* ── User-row account menu (chevron previously had no handler) ────────── */
  var menuEl = null;
  function closeMenu() {
    if (menuEl) { menuEl.remove(); menuEl = null; }
    document.removeEventListener('click', closeMenu);
    document.removeEventListener('keydown', onMenuKey, true);
  }
  function onMenuKey(e) { if (e.key === 'Escape') closeMenu(); }
  function openMenu(row) {
    closeMenu();
    menuEl = document.createElement('div');
    menuEl.className = 'st-menu';
    /* Paid plans show this cycle's usage (credits are visible once bought). */
    var u = planUsage();
    var usageBlock = '';
    if (u) {
      var pct = u.total > 0 ? Math.min(100, Math.round((u.used / u.total) * 100)) : 0;
      usageBlock =
        '<div class="st-menu-usage">' +
          '<div class="st-menu-usage-head">' +
            '<span class="st-menu-usage-label">Usage this month</span>' +
            '<span class="st-menu-usage-val">' + u.used.toLocaleString('en-US') + ' / ' + u.total.toLocaleString('en-US') + '</span>' +
          '</div>' +
          '<div class="credits-bar"><div class="credits-fill" style="width:' + pct + '%;"></div></div>' +
          '<span class="st-menu-usage-sub">' + u.left.toLocaleString('en-US') + ' credits left</span>' +
        '</div>' +
        '<div class="st-menu-sep"></div>';
    }
    /* "Your privacy choices" is a direct entry, not buried behind Account, so
       the consent toggles stay two clicks from any post-auth screen (GDPR
       Art. 7(3): withdrawing consent must be as easy as giving it). */
    menuEl.innerHTML =
      usageBlock +
      '<button class="st-menu-item" type="button" data-st-account="profile"><span class="fa" aria-hidden="true">circle-user</span>Account</button>' +
      '<a class="st-menu-item" href="subscription.html"><span class="fa" aria-hidden="true">credit-card</span>Plan &amp; billing</a>' +
      '<a class="st-menu-item" href="users.html"><span class="fa" aria-hidden="true">users</span>Users</a>' +
      '<div class="st-menu-sep"></div>' +
      '<button class="st-menu-item" type="button" data-st-account="privacy"><span class="fa" aria-hidden="true">cookie-bite</span>Your privacy choices</button>' +
      '<div class="st-menu-sep"></div>' +
      '<a class="st-menu-item" href="sign-in.html"><span class="fa" aria-hidden="true">arrow-right-from-bracket</span>Log out</a>';
    menuEl.querySelectorAll('[data-st-account]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var tab = btn.getAttribute('data-st-account');
        closeMenu();
        if (window.SenaAccount) SenaAccount.open(tab);
      });
    });
    document.body.appendChild(menuEl);
    var r = row.getBoundingClientRect();
    menuEl.style.left = r.left + 'px';
    menuEl.style.bottom = (window.innerHeight - r.top + 6) + 'px';
    setTimeout(function () {
      document.addEventListener('click', closeMenu);
      document.addEventListener('keydown', onMenuKey, true);
    }, 0);
  }
  function wireUserMenu() {
    document.querySelectorAll('.user-row').forEach(function (row) {
      if (row.dataset.stMenu) return;
      row.dataset.stMenu = 'true';
      row.style.cursor = 'pointer';
      row.addEventListener('click', function (e) {
        e.stopPropagation();
        if (menuEl) closeMenu(); else openMenu(row);
      });
    });
  }

  /* ── Gate modal (blocks STARTING an interaction; mid-stream is post-MVP) ─ */
  function gateCopy() {
    var d = daysLeft();
    return {
      title: "You've used this month's free credits",
      body: 'Your free credits reset in ' + d + (d === 1 ? ' day' : ' days') + '. ' +
            'Upgrade to keep working with Sena without the wait. ' +
            "Everything you've set up stays exactly as it is."
    };
  }
  var gateEl = null;
  function onGateKey(e) { if (e.key === 'Escape') closeGate(); }
  function closeGate() {
    if (gateEl) gateEl.classList.remove('open');
    document.removeEventListener('keydown', onGateKey, true);
  }
  function showGate() {
    var copy = gateCopy();
    if (!gateEl) {
      gateEl = document.createElement('div');
      gateEl.className = 'su-overlay st-gate';
      gateEl.innerHTML =
        '<div class="su-panel" role="dialog" aria-modal="true">' +
          '<div class="st-gate-body">' +
            '<div class="st-gate-icon fa" aria-hidden="true">lock</div>' +
            '<h2 class="st-gate-title"></h2>' +
            '<p class="st-gate-text"></p>' +
            '<div class="st-gate-actions">' +
              '<a class="btn btn-primary btn-md" href="plans.html">See plans</a>' +
              '<button class="btn btn-ghost btn-md" type="button" data-st-later>Maybe later</button>' +
            '</div>' +
          '</div>' +
        '</div>';
      document.body.appendChild(gateEl);
      gateEl.addEventListener('click', function (e) { if (e.target === gateEl) closeGate(); });
      gateEl.querySelector('[data-st-later]').addEventListener('click', closeGate);
    }
    gateEl.querySelector('.st-gate-title').textContent = copy.title;
    gateEl.querySelector('.st-gate-text').textContent = copy.body;
    gateEl.classList.add('open');
    document.addEventListener('keydown', onGateKey, true);
  }

  /* ── Getting-started tour (sidebar card, above the trial row) ──────────
     Injected into every sidebar body; free of charge and NOT dismissible
     until all three steps are done. */
  var CHECKLIST_ITEMS = [
    { key: 'context', title: 'Tell Sena about your business',
      sub: 'Complete your context so every answer is tuned to you.',
      go: function () { window.location.href = 'business-context.html'; } },
    { key: 'demo', title: 'See Sena in action',
      sub: 'Run a live analysis on your market.',
      go: launchDemo },
    { key: 'deliverable', title: 'Create your first deliverable',
      sub: 'Turn an insight into a presentation or report.',
      go: launchDeckStarter }
  ];
  function injectChecklist() {
    document.querySelectorAll('.sidebar-body').forEach(function (body) {
      if (body.querySelector('.st-tour-mount')) return;
      var mount = document.createElement('div');
      mount.className = 'st-tour-mount';
      body.appendChild(mount);
    });
  }
  function renderChecklist() {
    var mounts = document.querySelectorAll('.st-tour-mount');
    if (!mounts.length) return;
    var t = ensureStarted();
    var s = state();
    var done = CHECKLIST_ITEMS.filter(function (i) { return t.checklist[i.key]; }).length;
    var allDone = done === CHECKLIST_ITEMS.length;
    var hidden = s === 'paid' || (allDone && t.checklistDismissed);
    /* Onboarding alive → sidebar grows 25% (see sidebar.css .st-onboarding) */
    document.querySelectorAll('.sidebar-wrap').forEach(function (w) {
      w.classList.toggle('st-onboarding', !hidden);
    });
    mounts.forEach(function (mount) {
      if (hidden) { mount.innerHTML = ''; return; }
      mount.innerHTML =
        '<div class="st-checklist">' +
          '<div class="st-checklist-head">' +
            '<span class="st-checklist-title">Get started with Sena</span>' +
            '<span class="st-checklist-count">' + done + '/' + CHECKLIST_ITEMS.length + '</span>' +
            (allDone ? '<button class="st-checklist-dismiss fa" type="button" aria-label="Dismiss">xmark</button>' : '') +
          '</div>' +
          '<div class="credits-bar st-checklist-bar"><div class="credits-fill" style="width:' +
            Math.round((done / CHECKLIST_ITEMS.length) * 100) + '%;"></div></div>' +
          /* The free-credits note only matters while steps remain. */
          (allDone ? '' :
            '<p class="st-checklist-free"><span class="fa" aria-hidden="true">gift</span>This won’t use credits.</p>') +
          CHECKLIST_ITEMS.map(function (i) {
            var isDone = t.checklist[i.key];
            return '<button class="st-check-item' + (isDone ? ' done' : '') + '" type="button" data-st-item="' + i.key + '"' + (isDone ? ' disabled' : '') + '>' +
              '<span class="st-check-box' + (isDone ? ' checked' : '') + '"><span class="fa" aria-hidden="true">check</span></span>' +
              '<span class="st-check-text">' +
                '<span class="st-check-title">' + i.title + '</span>' +
              '</span>' +
              (isDone ? '' : '<span class="st-check-go fa" aria-hidden="true">arrow-right</span>') +
            '</button>';
          }).join('') +
        '</div>';
      var dismiss = mount.querySelector('.st-checklist-dismiss');
      if (dismiss) dismiss.addEventListener('click', dismissChecklist);
      CHECKLIST_ITEMS.forEach(function (i) {
        var el = mount.querySelector('[data-st-item="' + i.key + '"]');
        if (el && !t.checklist[i.key]) el.addEventListener('click', i.go);
      });
    });
  }

  /* ── Low/exhausted banner (renders only where a mount exists) ─────────── */
  function renderBanner() {
    var mount = document.querySelector('[data-trial-banner]');
    if (!mount) return;
    var s = state();
    mount.innerHTML = '';
    if (s !== 'low' && s !== 'exhausted') return;
    if (sessionStorage.getItem('st-banner-' + s)) return;
    var d = daysLeft();
    var msg;
    if (s === 'exhausted') {
      msg = "You've used this month's free credits. They reset in " + d + (d === 1 ? ' day' : ' days') +
            ', or upgrade now to keep going. Everything you set up stays.';
    } else {
      msg = "You're getting close to this month's free limit. Upgrade for more credits; your context and work come with you.";
    }
    var el = document.createElement('div');
    el.className = 'st-banner' + (s === 'low' ? '' : ' st-banner-hard');
    el.innerHTML =
      '<span class="st-banner-icon fa" aria-hidden="true">' + (s === 'low' ? 'hourglass-half' : 'lock') + '</span>' +
      '<span class="st-banner-text">' + msg + '</span>' +
      '<a class="btn btn-primary btn-sm" href="plans.html">Upgrade</a>' +
      '<button class="st-banner-dismiss fa" type="button" aria-label="Dismiss">xmark</button>';
    el.querySelector('.st-banner-dismiss').addEventListener('click', function () {
      sessionStorage.setItem('st-banner-' + s, '1');
      el.remove();
    });
    mount.appendChild(el);
  }

  /* ── Devmode admin modal (self-owned; ?devmode only) ───────────────────
     The ONE place the action → credit mapping is visible. Opened by a gear
     injected into the sidebar footer; reuses the generic su-* modal chrome. */
  function buildAdminSection() {
    var section = document.createElement('div');
    section.className = 'su-block st-admin';
    section.innerHTML =
      '<table class="st-admin-table"><tbody>' +
        Object.keys(CREDIT_PRICING).map(function (k) {
          return '<tr>' +
            '<td>' + ACTION_LABELS[k] + '</td>' +
            '<td class="st-admin-price">' + CREDIT_PRICING[k] + ' cr</td>' +
            '<td class="st-admin-count" data-st-count="' + k + '">0</td>' +
            '<td class="st-admin-btns">' +
              '<button type="button" class="st-admin-step" data-st-dec="' + k + '">−</button>' +
              '<button type="button" class="st-admin-step" data-st-inc="' + k + '">+</button>' +
            '</td>' +
          '</tr>';
        }).join('') +
      '</tbody></table>' +
      '<div class="st-admin-summary" data-st-summary></div>' +
      '<div class="su-slider-row">' +
        '<div class="su-slider-head">' +
          '<span class="su-slider-label">Days into free month</span>' +
          '<span class="su-slider-value" data-st-days-val>0</span>' +
        '</div>' +
        '<input type="range" class="su-range" min="0" max="30" step="1" data-st-days>' +
      '</div>' +
      '<div class="st-admin-states">' +
        ['active', 'low', 'exhausted', 'paid', 'none'].map(function (st) {
          return '<button type="button" class="st-admin-state" data-st-force="' + st + '">' + st + '</button>';
        }).join('') +
      '</div>' +
      '<div class="su-foot"><button class="btn btn-secondary btn-sm" type="button" data-st-reset>Reset account</button></div>';

    section.querySelectorAll('[data-st-inc]').forEach(function (b) {
      b.addEventListener('click', function () { recordAction(b.getAttribute('data-st-inc'), 1); syncAdmin(section); refresh(); });
    });
    section.querySelectorAll('[data-st-dec]').forEach(function (b) {
      b.addEventListener('click', function () { recordAction(b.getAttribute('data-st-dec'), -1); syncAdmin(section); refresh(); });
    });
    section.querySelector('[data-st-days]').addEventListener('input', function () {
      var n = Number(this.value) || 0;
      var t = ensureStarted();
      t.freePeriodStart = Date.now() - n * DAY;
      write(t);
      syncAdmin(section);
      refresh();
    });
    section.querySelectorAll('[data-st-force]').forEach(function (b) {
      b.addEventListener('click', function () {
        var v = b.getAttribute('data-st-force');
        var t = ensureStarted();
        t.dev.forceState = v === 'none' ? null : v;
        write(t);
        syncAdmin(section);
        refresh();
      });
    });
    section.querySelector('[data-st-reset]').addEventListener('click', function () {
      reset();
      syncAdmin(section);
    });
    return section;
  }

  var adminOverlay = null, adminSection = null;
  function onAdminKey(e) { if (e.key === 'Escape') closeAdmin(); }
  function closeAdmin() {
    if (adminOverlay) adminOverlay.classList.remove('open');
    document.removeEventListener('keydown', onAdminKey, true);
  }
  function openAdminModal() {
    if (!adminOverlay) {
      adminOverlay = document.createElement('div');
      adminOverlay.className = 'su-overlay st-admin-overlay';
      adminOverlay.innerHTML =
        '<div class="su-panel" role="dialog" aria-modal="true" aria-label="Free plan admin">' +
          '<div class="su-header">' +
            '<div class="su-header-text">' +
              '<div class="su-title-row">' +
                '<h2 class="su-title">Free plan</h2>' +
                '<span class="su-pill">Admin only</span>' +
              '</div>' +
              '<p class="su-subtitle">Simulate free-plan states and consumption. Prototype tooling, not user-facing.</p>' +
            '</div>' +
            '<button class="su-close fa" type="button" aria-label="Close">xmark</button>' +
          '</div>' +
          '<div class="su-body"></div>' +
        '</div>';
      document.body.appendChild(adminOverlay);
      adminSection = buildAdminSection();
      adminOverlay.querySelector('.su-body').appendChild(adminSection);
      adminOverlay.querySelector('.su-close').addEventListener('click', closeAdmin);
      adminOverlay.addEventListener('click', function (e) { if (e.target === adminOverlay) closeAdmin(); });
    }
    syncAdmin(adminSection);
    adminOverlay.classList.add('open');
    document.addEventListener('keydown', onAdminKey, true);
  }

  /* Gear into the sidebar footer — devmode only (html.sena-dev). */
  function injectGear() {
    if (!document.documentElement.classList.contains('sena-dev')) return;
    document.querySelectorAll('.sidebar-foot').forEach(function (foot) {
      if (foot.querySelector('.st-gear')) return;
      var btn = document.createElement('button');
      btn.className = 'st-gear fa';
      btn.type = 'button';
      btn.setAttribute('aria-label', 'Free plan admin settings');
      btn.textContent = 'gear';
      btn.addEventListener('click', function (e) { e.stopPropagation(); openAdminModal(); });
      foot.appendChild(btn);
    });
  }
  function syncAdmin(section) {
    var t = ensureStarted();
    Object.keys(CREDIT_PRICING).forEach(function (k) {
      var el = section.querySelector('[data-st-count="' + k + '"]');
      if (el) el.textContent = t.actions[k] || 0;
    });
    var sum = section.querySelector('[data-st-summary]');
    if (sum) sum.textContent = freeUsed(t) + ' of ' + (FREE_CREDITS + t.bonuses) +
      ' credits used this month · resets in ' + daysLeft(t) + 'd · state: ' + state();
    var elapsed = Math.min(30, Math.max(0, Math.floor((Date.now() - (t.freePeriodStart || t.startedAt)) / DAY)));
    var days = section.querySelector('[data-st-days]');
    var daysVal = section.querySelector('[data-st-days-val]');
    if (days) days.value = elapsed;
    if (daysVal) daysVal.textContent = elapsed;
    section.querySelectorAll('[data-st-force]').forEach(function (b) {
      var v = b.getAttribute('data-st-force');
      b.classList.toggle('active', (t.dev.forceState || 'none') === v);
    });
  }

  /* ── Refresh + init ───────────────────────────────────────────────────── */
  function refresh() {
    refreshTrialRow();
    renderChecklist();
    renderBanner();
  }

  window.addEventListener('storage', function (e) {
    if (e.key === KEY) refresh();
    if (e.key === 'sena-sessions-hidden' && typeof refreshSidebarSessions === 'function') refreshSidebarSessions();
  });

  function init() {
    ensureStarted();
    injectTrialRow();
    injectChecklist();
    wireUserMenu();
    injectGear();
    syncChecklist();
    refresh();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return {
    /* Re-runs every injection/wiring pass. Every step guards against doubling
       up, so screens that fetch their sidebar late (users.html) can call this
       once the markup lands and get the trial row + account menu wired. */
    mount: init,
    state: state,
    daysLeft: daysLeft,
    creditsUsed: creditsUsed,
    creditsLeft: creditsLeft,
    grant: grant,
    grantOnce: grantOnce,
    recordAction: recordAction,
    recordTurn: recordTurn,
    syncChecklist: syncChecklist,
    setChecklistItem: setChecklistItem,
    dismissChecklist: dismissChecklist,
    buildDemoPrompt: buildDemoPrompt,
    launchDemo: launchDemo,
    upgrade: upgrade,
    planUsage: planUsage,
    periodEnd: periodEnd,
    cancel: cancel,
    resubscribe: resubscribe,
    reset: reset,
    showGate: showGate,
    refresh: refresh,
    PLAN_NAMES: PLAN_NAMES
  };
})();
