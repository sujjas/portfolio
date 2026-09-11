/* ════════════════════════════════════════════════════════════════════════════ */
/* MESSAGE ACTIONS — Copy / Thumbs up / Thumbs down for Sena responses         */
/*                                                                            */
/* Usage:                                                                      */
/*   SenaMessageActions.attach(conversationEl)  // once, installs delegation   */
/*   SenaMessageActions.append(messageEl)       // after a Sena msg finalizes  */
/*   SenaMessageActions.backfill(conversationEl)// add rows to existing msgs   */
/*                                                                            */
/* The action row is plain HTML appended to each `.message-sena`, and all      */
/* behaviour is event-delegated on the conversation root — so it survives the  */
/* innerHTML save/restore the chat uses. Thumb state is stored as a CSS class  */
/* (`is-active`), which also persists through restore. The Share-feedback       */
/* popover and toast are mounted on <body>, so they never enter saved HTML.    */
/* ════════════════════════════════════════════════════════════════════════════ */

window.SenaMessageActions = (function () {
  var REASONS = [
    'Incorrect or incomplete',
    'Not what I asked for',
    'Slow or buggy',
    'Style or tone',
    'Safety or legal concern',
    'Other'
  ];

  /* Optional trailing hint (e.g. "Click to quote"), set via configure(). */
  var hintText = '';
  /* Optional hook: (msgEl) => Promise<Blob|null>. If it resolves to a PNG blob,
     Copy puts the image on the clipboard instead of the text (e.g. a chart). */
  var imageGetter = null;
  function escapeAttr(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function configure(opts) {
    if (opts && typeof opts.hint === 'string') hintText = opts.hint;
    if (opts && typeof opts.copyImage === 'function') imageGetter = opts.copyImage;
  }

  /* Icon glyphs are rendered by message-actions.css (::before), so the spans
     are empty — the button class selects copy / thumbs-up / thumbs-down. */
  function buildRow() {
    return '<div class="msg-actions" role="group" aria-label="Response actions">' +
      '<button type="button" class="msg-action msg-action-copy" data-tip="Copy" aria-label="Copy response">' +
        '<span class="msg-action-icon" aria-hidden="true"></span>' +
      '</button>' +
      '<button type="button" class="msg-action msg-action-up" data-tip="Good response" aria-label="Good response">' +
        '<span class="msg-action-icon" aria-hidden="true"></span>' +
      '</button>' +
      '<button type="button" class="msg-action msg-action-down" data-tip="Bad response" aria-label="Bad response">' +
        '<span class="msg-action-icon" aria-hidden="true"></span>' +
      '</button>' +
      (hintText
        ? '<span class="msg-actions-sep" aria-hidden="true">•</span>' +
          '<span class="msg-actions-hint">' + escapeAttr(hintText) + '</span>'
        : '') +
    '</div>';
  }

  /* A message qualifies for actions only if it holds real answer text. */
  function eligible(msgEl) {
    return !!(msgEl &&
      msgEl.classList && msgEl.classList.contains('message-sena') &&
      !msgEl.classList.contains('sena-attach-group') &&
      msgEl.querySelector('.sena-text') &&
      !msgEl.querySelector('.msg-actions'));
  }

  function append(msgEl) {
    if (eligible(msgEl)) msgEl.insertAdjacentHTML('beforeend', buildRow());
  }

  function backfill(rootEl) {
    if (!rootEl) return;
    rootEl.querySelectorAll('.message-sena').forEach(append);
  }

  /* ── Copy ──────────────────────────────────────────────────────────────── */
  /* Prefer the original markdown source (stashed on data-md at finalize) so the
     copy carries markdown formatting; fall back to rendered text if absent. */
  function messageText(msgEl) {
    var t = msgEl.querySelector('.sena-text');
    if (!t) return '';
    if (t.dataset && t.dataset.md) return t.dataset.md;
    return (t.innerText || t.textContent || '').trim();
  }

  function doCopy(text) {
    return new Promise(function (resolve, reject) {
      function fallback() {
        try {
          var ta = document.createElement('textarea');
          ta.value = text;
          ta.style.position = 'fixed';
          ta.style.top = '-9999px';
          document.body.appendChild(ta);
          ta.focus();
          ta.select();
          var ok = document.execCommand('copy');
          ta.remove();
          ok ? resolve() : reject();
        } catch (e) { reject(e); }
      }
      /* Prefer the async Clipboard API; fall back to execCommand if it rejects
         (e.g. not a trusted gesture / restricted context). */
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(resolve, fallback);
      } else {
        fallback();
      }
    });
  }

  function flashCopied(btn) {
    /* CSS swaps the glyph to circle-check via the .is-copied class. */
    btn.classList.add('is-copied');
    btn.setAttribute('data-tip', 'Copied');
    clearTimeout(btn._copyTimer);
    btn._copyTimer = setTimeout(function () {
      btn.classList.remove('is-copied');
      btn.setAttribute('data-tip', 'Copy');
    }, 1600);
  }

  /* ── Share-feedback popover ────────────────────────────────────────────── */
  var popover = null;
  var anchorBtn = null;

  function closeFeedback() {
    if (!popover) return;
    popover.remove();
    popover = null;
    anchorBtn = null;
    document.removeEventListener('mousedown', onOutside, true);
    document.removeEventListener('keydown', onKey, true);
    window.removeEventListener('scroll', closeFeedback, true);
    window.removeEventListener('resize', closeFeedback);
  }

  function onOutside(e) {
    if (popover && !popover.contains(e.target) && (!anchorBtn || !anchorBtn.contains(e.target))) {
      closeFeedback();
    }
  }
  function onKey(e) { if (e.key === 'Escape') closeFeedback(); }

  function positionPopover(pop, anchor) {
    var r = anchor.getBoundingClientRect();
    var pw = pop.offsetWidth, ph = pop.offsetHeight;
    var left = r.left;
    var top = r.bottom + 8;
    if (left + pw > window.innerWidth - 12) left = window.innerWidth - 12 - pw;
    if (left < 12) left = 12;
    if (top + ph > window.innerHeight - 12) top = r.top - 8 - ph; /* flip above */
    if (top < 12) top = 12;
    pop.style.left = left + 'px';
    pop.style.top = top + 'px';
  }

  function openFeedback(downBtn) {
    closeFeedback();
    anchorBtn = downBtn;
    var pop = document.createElement('div');
    pop.className = 'feedback-popover';
    pop.setAttribute('role', 'dialog');
    pop.setAttribute('aria-label', 'Share feedback');
    pop.innerHTML =
      '<div class="feedback-head">' +
        '<span class="feedback-title">Share feedback</span>' +
        '<button type="button" class="feedback-close fa" aria-label="Close">xmark</button>' +
      '</div>' +
      '<div class="feedback-reasons">' +
        REASONS.map(function (r) {
          return '<button type="button" class="feedback-reason">' + r + '</button>';
        }).join('') +
      '</div>' +
      '<textarea class="feedback-details" placeholder="Share details (optional)"></textarea>' +
      '<div class="feedback-foot">' +
        '<span class="feedback-note">Your feedback helps Sena improve.</span>' +
        '<button type="button" class="btn btn-primary btn-sm feedback-submit">Submit</button>' +
      '</div>';
    document.body.appendChild(pop);
    popover = pop;
    positionPopover(pop, downBtn);

    pop.querySelector('.feedback-close').addEventListener('click', closeFeedback);
    pop.querySelectorAll('.feedback-reason').forEach(function (b) {
      b.addEventListener('click', function () { b.classList.toggle('is-selected'); });
    });
    pop.querySelector('.feedback-submit').addEventListener('click', function () {
      closeFeedback();
      toast('Thanks for your feedback');
    });

    /* Defer outside-click wiring so the opening click doesn't immediately close it. */
    setTimeout(function () {
      document.addEventListener('mousedown', onOutside, true);
      document.addEventListener('keydown', onKey, true);
      window.addEventListener('scroll', closeFeedback, true);
      window.addEventListener('resize', closeFeedback);
    }, 0);
  }

  function toast(msg) {
    var t = document.createElement('div');
    t.className = 'sena-toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () {
      t.classList.add('is-out');
      setTimeout(function () { t.remove(); }, 300);
    }, 1800);
  }

  /* ── Delegated click handling ──────────────────────────────────────────── */
  function onClick(e) {
    var btn = e.target.closest && e.target.closest('.msg-action');
    if (!btn) return;
    var msg = btn.closest('.message-sena');
    if (!msg) return;

    if (btn.classList.contains('msg-action-copy')) {
      function copyTextFallback() {
        return doCopy(messageText(msg)).then(function () { flashCopied(btn); });
      }
      var canRich = navigator.clipboard && navigator.clipboard.write && window.ClipboardItem;
      Promise.resolve(imageGetter && canRich ? imageGetter(msg) : null)
        .then(function (res) {
          /* Hook may return a Blob (image only) or { imageBlob, html }. */
          var imageBlob = (res instanceof Blob) ? res : (res && res.imageBlob);
          var html = (res && !(res instanceof Blob)) ? res.html : null;
          if (!imageBlob) return copyTextFallback();
          /* One ClipboardItem with multiple types: rich editors take text/html
             (prose + inline chart), image editors take image/png, plain fields
             take text/plain. */
          var parts = {
            'text/plain': new Blob([messageText(msg)], { type: 'text/plain' }),
            'image/png': imageBlob
          };
          if (html) parts['text/html'] = new Blob([html], { type: 'text/html' });
          return navigator.clipboard.write([new ClipboardItem(parts)])
            .then(function () { flashCopied(btn); })
            .catch(copyTextFallback);
        })
        .catch(function () { copyTextFallback().catch(function () {}); });
      return;
    }

    if (btn.classList.contains('msg-action-up')) {
      var turnOn = !btn.classList.contains('is-active');
      btn.classList.toggle('is-active', turnOn);
      var down = msg.querySelector('.msg-action-down');
      if (down) down.classList.remove('is-active');
      closeFeedback();
      return;
    }

    if (btn.classList.contains('msg-action-down')) {
      var enable = !btn.classList.contains('is-active');
      btn.classList.toggle('is-active', enable);
      var up = msg.querySelector('.msg-action-up');
      if (up) up.classList.remove('is-active');
      if (enable) openFeedback(btn); else closeFeedback();
      return;
    }
  }

  function attach(rootEl) {
    if (!rootEl || rootEl._senaActionsAttached) return;
    rootEl._senaActionsAttached = true;
    rootEl.addEventListener('click', onClick);
  }

  return { attach: attach, append: append, backfill: backfill, configure: configure, rowHtml: buildRow };
})();
