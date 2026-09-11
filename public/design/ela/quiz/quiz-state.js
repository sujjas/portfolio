/* =============================================================================
   quiz-state.js — the only thing the four standalone quizzes + the hub share.

   The quiz pages are otherwise islands (no build step, no framework, each its
   own inline <script>). This tiny module gives them three shared things:

     1. QUIZZES        — one registry every surface renders cards from, so the
                         hub grid and each page's "Keep going" row never drift.
     2. ElaQuiz.state  — a faked, persisted "signed-in" account in localStorage:
                         a sign-in flag, which topics are done, and the actual
                         read for each done topic (so a finished quiz can
                         re-show its full read with no second API call).
     3. renderCards()  — shared card markup + styles (injected once), used by
                         both the hub and the inline "more quizzes" section.

   No backend: "sign up" stays a prototype gate. This only persists the
   *illusion* of an account across the four pages.
   ========================================================================== */
(function (global) {
  'use strict';

  // ---------------------------------------------------------------------------
  // The registry. `accent` is a colors.css var (loaded on every page); `badge`
  // is the Ela badge SVG under design-system/images/ela-badge/.
  // ---------------------------------------------------------------------------
  var QUIZZES = [
    { topic: 'dating',  title: 'Dating energy',  file: 'ela-dating-quiz.html',
      tag: 'How you show up in love',        accent: 'var(--color-red-400)',        badge: 'Variant=Dating.svg'   },
    { topic: 'founder', title: 'Founder energy', file: 'ela-founder-quiz.html',
      tag: 'How you build and lead',          accent: 'var(--color-soft-green-400)', badge: 'Variant=Business.svg' },
    { topic: 'fitness', title: 'Fitness energy', file: 'ela-fitness-quiz.html',
      tag: 'How you move and stay consistent', accent: 'var(--color-blue-400)',       badge: 'Variant=Fitness.svg'  },
    { topic: 'money',   title: 'Money energy',   file: 'ela-money-quiz.html',
      tag: 'How you relate to money',          accent: 'var(--color-orange-400)',     badge: 'Variant=Investing.svg'},
  ];
  var BY_TOPIC = QUIZZES.reduce(function (m, q) { m[q.topic] = q; return m; }, {});

  // ---------------------------------------------------------------------------
  // Persisted state. All keys namespaced under `ela:`. Reads are defensive —
  // a wiped / corrupt store just looks like a brand-new visitor.
  // ---------------------------------------------------------------------------
  var K_SIGNED = 'ela:signedIn';
  var K_USER   = 'ela:user';
  var K_DONE   = 'ela:done';          // array of topic strings
  var K_READ   = 'ela:read:';         // + topic  → the read object
  var K_TX     = 'ela:transcript:';   // + topic  → [{q,a}] the answered conversation

  function safeGet(key) {
    try { return global.localStorage.getItem(key); } catch (_) { return null; }
  }
  function safeSet(key, val) {
    try { global.localStorage.setItem(key, val); } catch (_) { /* private mode, full, etc. */ }
  }
  function safeDel(key) {
    try { global.localStorage.removeItem(key); } catch (_) {}
  }
  function readJSON(key, fallback) {
    var raw = safeGet(key);
    if (!raw) return fallback;
    try { return JSON.parse(raw); } catch (_) { return fallback; }
  }

  function isSignedIn() { return safeGet(K_SIGNED) === '1'; }

  function signIn(user) {
    safeSet(K_SIGNED, '1');
    if (user) safeSet(K_USER, JSON.stringify(user));
  }

  // Clear the whole session: signed-in flag, user, completed list, and every
  // saved read. Leaves a clean signed-out slate (prototype only).
  function signOut() {
    getDone().forEach(function (t) { safeDel(K_READ + t); safeDel(K_TX + t); });
    safeDel(K_SIGNED); safeDel(K_USER); safeDel(K_DONE);
  }

  function getUser() { return readJSON(K_USER, null); }

  function getDone() {
    var arr = readJSON(K_DONE, []);
    return Array.isArray(arr) ? arr : [];
  }
  function isDone(topic) { return getDone().indexOf(topic) !== -1; }

  // Record a finished quiz: sign the person in, remember the topic, and stash
  // the read (so the hub's "view your read" can re-render it offline) plus the
  // answered conversation (so the account can export/format the answers).
  function markDone(topic, read, transcript) {
    signIn();
    var done = getDone();
    if (done.indexOf(topic) === -1) { done.push(topic); safeSet(K_DONE, JSON.stringify(done)); }
    if (read) safeSet(K_READ + topic, JSON.stringify(read));
    if (transcript && transcript.length) safeSet(K_TX + topic, JSON.stringify(transcript));
  }

  function getRead(topic) { return readJSON(K_READ + topic, null); }
  function getTranscript(topic) {
    var tx = readJSON(K_TX + topic, []);
    return Array.isArray(tx) ? tx : [];
  }

  // Headline score for a read: the average of its trait scores, 0–100. Falls
  // back to 0 when a read carries no traits.
  function scoreOf(read) {
    var t = (read && read.traits) || [];
    if (!t.length) return 0;
    var sum = t.reduce(function (n, x) { return n + (Number(x.score) || 0); }, 0);
    return Math.round(sum / t.length);
  }

  // "Export the score and conversation to the user account (format the answers)."
  // Returns a plain-text card the account can store, copy, or download.
  function exportText(topic) {
    var q = BY_TOPIC[topic];
    var read = getRead(topic) || {};
    var tx = getTranscript(topic);
    var name = (getUser() && getUser().name) ? getUser().name + '’s ' : 'My ';
    var title = name + (q ? q.title : (topic + ' energy'));
    var lines = [];
    lines.push(title);
    lines.push('Result: ' + (read.archetype || '—') + '  ·  Score: ' + scoreOf(read) + '/100');
    if (read.lede) { lines.push(''); lines.push(read.lede); }
    if (tx.length) {
      lines.push(''); lines.push('— Your answers —');
      tx.forEach(function (turn, i) {
        lines.push((i + 1) + '. ' + turn.q);
        lines.push('   → ' + turn.a);
      });
    }
    if (read.traits && read.traits.length) {
      lines.push(''); lines.push('— Traits —');
      read.traits.forEach(function (t) { lines.push('• ' + t.name + ': ' + (Number(t.score) || 0)); });
    }
    lines.push(''); lines.push('Discover your energy with Ela.');
    return lines.join('\n');
  }

  // The first quiz (in registry order) the person hasn't finished — i.e. the
  // one to nudge next. Returns null once everything is done.
  function nextUndone() {
    for (var i = 0; i < QUIZZES.length; i++) {
      if (!isDone(QUIZZES[i].topic)) return QUIZZES[i];
    }
    return null;
  }

  // ---------------------------------------------------------------------------
  // Card rendering. Styles are injected once; markup is shared so the hub and
  // the inline row look identical.
  // ---------------------------------------------------------------------------
  var STYLE_ID = 'ela-quiz-cards-css';
  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var css = [
      // Auth chrome is toggled via the `hidden` attribute; several of those
      // elements set an explicit `display` (inline-flex pills/buttons) which
      // would otherwise beat `[hidden]`. Force it so hiding actually hides.
      '[hidden]{display:none !important;}',
      '.quiz-grid{display:grid;gap:14px;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));}',
      '.quiz-card{position:relative;display:flex;align-items:center;gap:14px;',
        'padding:16px 18px;border-radius:var(--br-l,16px);color:#fff;text-align:left;',
        'background:rgba(8,16,34,.55);border:1px solid rgba(255,255,255,.12);',
        '-webkit-backdrop-filter:saturate(150%) blur(16px);backdrop-filter:saturate(150%) blur(16px);',
        'box-shadow:0 14px 32px -16px rgba(0,0,0,.6);overflow:hidden;',
        'transition:transform .16s ease,border-color .16s ease,background .16s ease;}',
      '.quiz-card:hover{transform:translateY(-2px);background:rgba(8,16,34,.7);border-color:rgba(255,255,255,.24);}',
      '.quiz-card::before{content:"";position:absolute;left:0;top:0;bottom:0;width:4px;background:var(--qc-accent,#fff);}',
      '.quiz-card__badge{flex:0 0 auto;width:46px;height:46px;border-radius:50%;',
        'background-size:cover;background-position:center;background-repeat:no-repeat;',
        'box-shadow:0 0 0 2px rgba(255,255,255,.16), 0 0 18px -4px var(--qc-accent,transparent);}',
      '.quiz-card__body{flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:3px;}',
      '.quiz-card__title{font-family:var(--ff-display,inherit);font-weight:700;font-size:17px;line-height:1.15;}',
      '.quiz-card__tag{font-size:13px;color:rgba(255,255,255,.7);line-height:1.3;}',
      '.quiz-card__cta{flex:0 0 auto;display:inline-flex;align-items:center;gap:6px;',
        'font-size:13px;font-weight:600;color:var(--qc-accent,#fff);white-space:nowrap;}',
      '.quiz-card.is-done .quiz-card__cta{color:rgba(255,255,255,.82);}',
      '.quiz-card__check{flex:0 0 auto;width:20px;height:20px;border-radius:50%;',
        'display:inline-flex;align-items:center;justify-content:center;font-size:11px;',
        'background:var(--qc-accent,#fff);color:#0b1120;}',
    ].join('');
    var el = document.createElement('style');
    el.id = STYLE_ID;
    el.textContent = css;
    document.head.appendChild(el);
  }

  // Build one card's HTML. `done` flips the CTA to "View your read".
  // `webTarget` points cards at the in-app web quiz / results (for signed-in
  // members) instead of the standalone marketing quiz.
  function cardHTML(q, done, webTarget) {
    var badgeURL = '../design-system/images/ela-badge/' + q.badge;
    var cta = done
      ? '<span class="quiz-card__cta"><span class="quiz-card__check"><i class="fa-solid fa-check"></i></span> View your read</span>'
      : '<span class="quiz-card__cta">Take it · 2 min <i class="fa-solid fa-chevron-right"></i></span>';
    var href;
    if (webTarget) {
      // Signed-in members stay in the web app: done → saved read, else in-app quiz.
      href = done ? '../web-prototype/results.html?topic=' + q.topic
                  : '../web-prototype/' + q.topic + '-quiz.html';
    } else {
      // Guests use the standalone marketing quiz; done deep-links to the read.
      href = done ? q.file + '?read=1' : q.file;
    }
    return ''
      + '<a class="quiz-card' + (done ? ' is-done' : '') + '" href="' + href + '" '
      +   'style="--qc-accent:' + q.accent + '">'
      +   '<span class="quiz-card__badge" style="background-image:url(\'' + badgeURL + '\')"></span>'
      +   '<span class="quiz-card__body">'
      +     '<span class="quiz-card__title">' + q.title + '</span>'
      +     '<span class="quiz-card__tag">' + q.tag + '</span>'
      +   '</span>'
      +   cta
      + '</a>';
  }

  // Render cards into `container`. opts.exclude = a topic to skip (the current
  // quiz, on the inline row). opts.order = 'remaining-first' floats not-yet-done
  // quizzes to the top (used by the signed-in hub). The hub passes no exclude.
  function renderCards(container, opts) {
    if (!container) return;
    injectStyles();
    opts = opts || {};
    var list = QUIZZES.filter(function (q) { return q.topic !== opts.exclude; });
    if (opts.order === 'remaining-first') {
      // Stable partition: undone keep registry order, then done keep registry order.
      list = list.slice().sort(function (a, b) {
        return (isDone(a.topic) ? 1 : 0) - (isDone(b.topic) ? 1 : 0);
      });
    }
    container.classList.add('quiz-grid');
    container.innerHTML = list.map(function (q) { return cardHTML(q, isDone(q.topic), opts.webTarget); }).join('');
  }

  // Render the "Your quizzes" sidebar history — the completed reads, each a
  // clickable link to its saved read in the web app. Auto-runs on any element
  // with [data-history] (see boot below), so pages just add the container.
  function renderHistory(container) {
    if (!container) return;
    var done = getDone();
    // Reads live in the web app; from an ela-quiz page they're one level up.
    var base = /\/ela-quiz\//.test(location.pathname) ? '../web-prototype/' : '';
    container.classList.add('chat-history__list');
    if (!done.length) {
      container.innerHTML = '<p style="margin:0;font-size:13px;color:var(--text-tertiary);">No reads yet — take a quiz.</p>';
      return;
    }
    container.innerHTML = done.map(function (t) {
      var q = BY_TOPIC[t];
      var name = q ? q.title.replace(/ energy$/i, '') : (t.charAt(0).toUpperCase() + t.slice(1));
      var accent = q ? q.accent : 'var(--fg-brand)';
      return '<a class="chat-history__item" href="' + base + 'results.html?topic=' + t + '" '
        +   'style="text-decoration:none;color:inherit;display:block;">'
        +   '<div class="chat-history__item-content"><div class="chat-history__meta">'
        +     '<span class="chat-history__topic"><span class="chat-history__topic-dot" style="background:' + accent + '"></span>' + name + '</span>'
        +   '</div><span class="chat-history__label">Your ' + name + ' read</span></div>'
        + '</a>';
    }).join('<hr class="chat-history__divider" />');
  }

  // Inject styles immediately (not just on first renderCards) so the forcing
  // [hidden] rule is present before any page hides its guest chrome at boot.
  if (document.head) injectStyles();
  else document.addEventListener('DOMContentLoaded', injectStyles);

  // Auto-fill any [data-history] sidebar list with the user's saved reads.
  function autoHistory() { document.querySelectorAll('[data-history]').forEach(renderHistory); }
  if (document.readyState !== 'loading') autoHistory();
  else document.addEventListener('DOMContentLoaded', autoHistory);

  // Tab-away nudge — swap the document title when the user leaves the tab, and
  // restore it when they come back. A light re-engagement touch.
  (function () {
    if (typeof document === 'undefined' || !document.addEventListener) return;
    var original = document.title;
    document.addEventListener('visibilitychange', function () {
      document.title = document.hidden ? 'We hate to see you go 🥺' : original;
    });
  })();

  global.ElaQuiz = {
    QUIZZES: QUIZZES,
    injectStyles: injectStyles,
    byTopic: function (t) { return BY_TOPIC[t]; },
    isSignedIn: isSignedIn,
    signIn: signIn,
    signOut: signOut,
    getUser: getUser,
    getDone: getDone,
    isDone: isDone,
    markDone: markDone,
    getRead: getRead,
    getTranscript: getTranscript,
    scoreOf: scoreOf,
    exportText: exportText,
    nextUndone: nextUndone,
    renderCards: renderCards,
    renderHistory: renderHistory,
  };
})(window);
