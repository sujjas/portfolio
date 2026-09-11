/* ════════════════════════════════════════════════════════════════════════════ */
/* SCENARIO.JS — Prospect scenario injection system                           */
/* Loads after screen.js: <script src="../design-system/scenario.js"></script> */
/* ════════════════════════════════════════════════════════════════════════════ */

var Scenario = (function () {
  var STORAGE_KEY = 'sena-scenario';

  function get() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function save(scenario) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scenario));
  }

  function clear() {
    localStorage.removeItem(STORAGE_KEY);
  }

  /* Shallow-merge a partial business_context patch into the active scenario */
  function setBusinessContext(patch) {
    var s = get() || {};
    s.business_context = Object.assign({}, s.business_context || {}, patch || {});
    save(s);
    return s;
  }

  /* ── Helpers ─────────────────────────────────────────────────────────── */
  function setText(selector, text, root) {
    var el = (root || document).querySelector(selector);
    if (el) el.textContent = text;
  }

  function setVal(selector, val, root) {
    var el = (root || document).querySelector(selector);
    if (el) el.value = val;
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function currentPage() {
    var path = location.pathname;
    if (path.endsWith('/home.html') || path.endsWith('/home')) return 'home';
    if (path.endsWith('/home-new.html') || path.endsWith('/home-new')) return 'home-new';
    if (path.endsWith('/chat.html') || path.endsWith('/chat')) return 'chat';
    if (path.endsWith('/builder.html') || path.endsWith('/builder')) return 'builder';
    if (path.endsWith('/conversation.html') || path.endsWith('/conversation')) return 'conversation';
    if (path.endsWith('/conversation-market-entry.html') || path.endsWith('/conversation-market-entry')) return 'conversation-deep';
    if (path.endsWith('/custom-report.html') || path.endsWith('/custom-report')) return 'custom-report';
    if (path.endsWith('/reports.html') || path.endsWith('/reports')) return 'reports';
    if (path.endsWith('/data-sources.html') || path.endsWith('/data-sources')) return 'data-sources';
    if (path.endsWith('/business-context.html') || path.endsWith('/business-context')) return 'business-context';
    if (path.endsWith('/generate.html') || path.endsWith('/generate')) return 'generate';
    return null;
  }

  /* ── Sidebar (all pages) ─────────────────────────────────────────────── */
  function applySidebar(s) {
    if (s.user && s.user.name) setText('.user-name', s.user.name);
    if (s.company && s.company.name) setText('.user-company', s.company.name);

    if (s.user && s.user.initials) {
      var avatar = document.querySelector('.sidebar-foot .avatar > div');
      if (avatar) avatar.textContent = s.user.initials;
    }

    if (s.sessions && s.sessions.length) {
      var list = document.querySelector('.session-list');
      if (list) {
        list.innerHTML = s.sessions.map(function (sess, i) {
          var icon = sess.icon || 'grid-2';
          var href = i === 0 ? 'conversation-market-entry.html' : '';
          var onclick = href ? ' onclick="window.location.href=\'' + href + '\'" style="cursor:pointer;"' : '';
          return '<li class="session-item"' + onclick + '>' +
            '<span class="session-icon fa">' + icon + '</span>' +
            '<span class="session-label">' + escapeHtml(sess.label) + '</span>' +
            '</li>';
        }).join('');
      }
    }
  }

  /* ── HOME ─────────────────────────────────────────────────────────────── */
  function applyHome(s) {
    if (!s.home) return;

    // Welcome heading
    if (s.home.welcome_first_name) {
      var h1 = document.querySelector('.welcome-heading');
      if (h1) h1.textContent = 'Welcome back, ' + s.home.welcome_first_name;
    }

    if (s.home.welcome_sub) setText('.welcome-sub', s.home.welcome_sub);

    // Data grid column 1 — insights
    if (s.home.data_grid_insights) {
      var cols = document.querySelectorAll('.data-col');
      if (cols[0]) {
        var items = cols[0].querySelectorAll('.source-label');
        s.home.data_grid_insights.forEach(function (src, i) {
          if (items[i]) items[i].textContent = src.label;
        });
      }
    }

    // Data grid column 2 — uploaded files
    if (s.home.data_grid_files) {
      var cols = document.querySelectorAll('.data-col');
      if (cols[1]) {
        var items = cols[1].querySelectorAll('.source-label');
        s.home.data_grid_files.forEach(function (src, i) {
          if (items[i]) items[i].textContent = src.label;
        });
      }
    }

    // Dropdown items
    if (s.home.dropdown_items) {
      var dropItems = document.querySelectorAll('.dropdown-item .dropdown-item-label');
      s.home.dropdown_items.forEach(function (label, i) {
        if (dropItems[i]) dropItems[i].textContent = label;
      });
    }

    // Connected apps — intentionally NOT changed per scenario
  }

  /* ── REPORTS ─────────────────────────────────────────────────────────── */
  function applyReports(s) {
    if (!s.reports || !s.reports.length) return;

    var rows = document.querySelectorAll('.report-row');

    // Update stats
    var total = s.reports.length;
    var live = s.reports.filter(function (r) { return r.status === 'live'; }).length;
    var draft = s.reports.filter(function (r) { return r.status === 'draft'; }).length;
    var archived = s.reports.filter(function (r) { return r.status === 'archived'; }).length;

    var statEls = document.querySelectorAll('.stat-value');
    if (statEls[0]) statEls[0].textContent = total;
    if (statEls[1]) statEls[1].textContent = live;
    if (statEls[2]) statEls[2].textContent = draft;
    if (statEls[3]) statEls[3].textContent = archived;

    s.reports.forEach(function (report, i) {
      if (!rows[i]) return;
      setText('.report-name', report.name, rows[i]);
      if (report.description) setText('.report-desc', report.description, rows[i]);
      if (report.status) rows[i].setAttribute('data-status', report.status);
      if (report.date) {
        var dateEl = rows[i].querySelector('.report-date');
        if (dateEl) dateEl.textContent = report.date;
      }

      var author = rows[i].querySelector('.report-row-author');
      if (author && report.author_initials) author.textContent = report.author_initials;

      if (report.sources) {
        var badgeWrap = rows[i].querySelector('.report-sources');
        if (badgeWrap) {
          var html = report.sources.slice(0, 3).map(function (src) {
            return '<span class="source-badge" title="' + escapeHtml(src) + '">' + escapeHtml(src) + '</span>';
          }).join('');
          if (report.sources.length > 3) html += '<span class="source-more">+' + (report.sources.length - 3) + '</span>';
          badgeWrap.innerHTML = html;
        }
      }
    });
  }

  /* ── DATA SOURCES ────────────────────────────────────────────────────── */
  function applyDataSources(s) {
    if (!s.data_sources) return;
    var ds = s.data_sources;

    // Consumer insights — update card rows (All Sources tab)
    if (ds.consumer_insights) {
      var cardsRow = document.querySelector('.ds-cards-row');
      if (cardsRow) {
        var insightCard = cardsRow.querySelectorAll('.ds-card')[0];
        if (insightCard) {
          var rows = insightCard.querySelectorAll('.ds-table-row');
          ds.consumer_insights.forEach(function (item, i) {
            if (!rows[i]) return;
            var nameEl = rows[i].querySelector('.ds-row-name');
            if (nameEl) nameEl.textContent = item.name;
            var checkbox = rows[i].querySelector('.checkbox-input');
            if (checkbox) checkbox.setAttribute('data-name', item.name);
            var vals = rows[i].querySelectorAll('.ds-row-value');
            if (item.sample_size && vals[0]) vals[0].textContent = item.sample_size;
            if (item.date && vals[1]) vals[1].textContent = item.date;
          });
        }
      }
    }

    // Uploaded files — update card rows (All Sources tab)
    if (ds.uploaded_files) {
      var cardsRow = document.querySelector('.ds-cards-row');
      if (cardsRow) {
        var fileCard = cardsRow.querySelectorAll('.ds-card')[1];
        if (fileCard) {
          var rows = fileCard.querySelectorAll('.ds-table-row');
          ds.uploaded_files.forEach(function (item, i) {
            if (!rows[i]) return;
            var nameEl = rows[i].querySelector('.ds-row-name');
            if (nameEl) nameEl.textContent = item.name;
            var checkbox = rows[i].querySelector('.checkbox-input');
            if (checkbox) checkbox.setAttribute('data-name', item.name);
            var vals = rows[i].querySelectorAll('.ds-row-value');
            if (item.size && vals[0]) vals[0].textContent = item.size;
            if (item.date && vals[1]) vals[1].textContent = item.date;
          });
        }
      }
    }

    // Tab views — override the JS data arrays used for full tables
    // The page script reads from window._scenarioCI / window._scenarioUD
    if (ds.consumer_insights) {
      window._scenarioCI = ds.consumer_insights.map(function (item) {
        return { name: item.name, sample: item.sample_size || '0', date: item.date || '' };
      });
    }
    if (ds.uploaded_files) {
      window._scenarioUD = ds.uploaded_files.map(function (item) {
        return { name: item.name, size: item.size || '', date: item.date || '' };
      });
    }

    // Re-render full tab tables with scenario data
    if (window._refreshDSTables) window._refreshDSTables();

    // Connected apps — intentionally NOT changed per scenario
  }

  /* ── BUSINESS CONTEXT ────────────────────────────────────────────────── */
  // Applies the scenario AUTHORITATIVELY: every field is set from the scenario,
  // and fields the scenario does NOT have are cleared. This way the form always
  // mirrors stored context — e.g. after onboarding resets it, the page shows the
  // emptied state instead of the page's hardcoded demo defaults.
  function applyBusinessContext(s) {
    if (!s.business_context) return;
    var bc = s.business_context;
    function val(v) { return v != null ? v : ''; }

    // ── About You (#section-role): role title, department, description
    var roleSection = document.getElementById('section-role');
    if (roleSection) {
      var roleFields = roleSection.querySelectorAll('.section-body > .field-row .field-input');
      if (roleFields[0]) roleFields[0].value = val(bc.role_title);
      if (roleFields[1]) roleFields[1].value = val(bc.department);
      if (roleFields[2]) roleFields[2].value = val(bc.role_description);
    }

    // ── Objectives — rebuild from the scenario (empty list when absent)
    var objList = document.getElementById('objectiveList');
    if (objList) {
      objList.innerHTML = (Array.isArray(bc.objectives) ? bc.objectives : []).map(function (o) {
        var title = typeof o === 'string' ? o : ((o && o.title) || '');
        return '' +
          '<div class="kpi-row">' +
            '<input class="objective-title-input field-input" type="text" value="' + escapeHtml(title) + '" placeholder="Objective...">' +
            '<button class="kpi-remove" aria-label="Remove objective" onclick="removeObjective(this)"><span class="fa">trash</span></button>' +
          '</div>';
      }).join('');
    }

    // ── KPIs — rebuild from the scenario (empty list when absent)
    var kpiList = document.getElementById('metricList');
    if (kpiList) {
      kpiList.innerHTML = (Array.isArray(bc.kpis) ? bc.kpis : []).map(function (k) {
        var v = typeof k === 'string' ? k : '';
        return '' +
          '<div class="kpi-row">' +
            '<input class="field-input" type="text" value="' + escapeHtml(v) + '" placeholder="e.g., 15% market share by country">' +
            '<button class="kpi-remove" aria-label="Remove metric" onclick="removeKpi(this)"><span class="fa">trash</span></button>' +
          '</div>';
      }).join('');
    }

    // ── Company Profile (#section-company): read-only admin fields (kept on reset)
    var companySection = document.getElementById('section-company');
    if (companySection) {
      var companyFields = companySection.querySelectorAll('.section-body .field-row .field-input');
      if (companyFields[0]) companyFields[0].value = val(bc.company_name);
      if (companyFields[1]) companyFields[1].value = val(bc.industry);
      if (companyFields[2]) companyFields[2].value = val(bc.description);
      if (companyFields[3]) companyFields[3].value = val(bc.company_size);
    }

    // ── Market & Audience (#section-market): paired default + override per row
    var marketSection = document.getElementById('section-market');
    if (marketSection) {
      var rows = marketSection.querySelectorAll('.market-row');
      // Order in DOM: geographic_focus, target_segments, competitors
      var marketKeys = [
        ['geographic_focus', 'geographic_focus_override'],
        ['target_segments', 'target_segments_override'],
        ['competitors', 'competitors_override']
      ];
      rows.forEach(function (row, i) {
        var keys = marketKeys[i];
        if (!keys) return;
        var pair = row.querySelectorAll('.market-row-inputs .field-input');
        if (pair[0]) pair[0].value = val(bc[keys[0]]);
        if (pair[1]) pair[1].value = val(bc[keys[1]]);
      });
    }

    // Programmatic value changes don't fire input/change events, so nudge any
    // listeners (e.g. the Context Score gauge) to recompute from the new values.
    var notify = document.querySelector('#section-role .field-input');
    if (notify) notify.dispatchEvent(new Event('change', { bubbles: true }));
  }

  /* ── Apply scenario to current page ──────────────────────────────────── */
  function applyScenario(s) {
    var page = currentPage();
    if (!page) return;

    // Sidebar — wait for it to load
    var checkSidebar = setInterval(function () {
      if (document.querySelector('.user-name')) {
        clearInterval(checkSidebar);
        applySidebar(s);
      }
    }, 50);
    setTimeout(function () { clearInterval(checkSidebar); }, 2000);

    switch (page) {
      case 'home': applyHome(s); break;
      case 'home-new': applyHome(s); break;
      case 'chat': break; /* sidebar only — chat is live */
      case 'builder': break; /* sidebar only — report is dynamic */
      case 'conversation': break; /* legacy — sidebar only */
      case 'conversation-deep': break; /* legacy — sidebar only */
      case 'custom-report': break; /* legacy — sidebar only */
      case 'reports': applyReports(s); break;
      case 'data-sources': applyDataSources(s); break;
      case 'business-context': applyBusinessContext(s); break;
    }
  }

  /* ── Load from URL param or localStorage ─────────────────────────────── */
  function init() {
    var params = new URLSearchParams(location.search);
    var scenarioId = params.get('s');

    if (scenarioId) {
      fetch('/api/scenarios/' + encodeURIComponent(scenarioId))
        .then(function (res) {
          if (!res.ok) throw new Error('Not found');
          return res.json();
        })
        .then(function (scenario) {
          save(scenario);
          applyScenario(scenario);
        })
        .catch(function () {
          var s = get();
          if (s) applyScenario(s);
        });
    } else {
      var s = get();
      if (s) applyScenario(s);
    }
  }

  /* ── Generate via server ─────────────────────────────────────────────── */
  function generate(prospectInfo) {
    return fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: prospectInfo })
    })
    .then(function (res) {
      if (!res.ok) return res.json().then(function (e) { throw new Error(e.error); });
      return res.json();
    })
    .then(function (data) {
      save(data.scenario);
      return data;
    });
  }

  document.addEventListener('DOMContentLoaded', init);

  return {
    get: get,
    save: save,
    clear: clear,
    apply: init,
    generate: generate,
    setBusinessContext: setBusinessContext
  };
})();
