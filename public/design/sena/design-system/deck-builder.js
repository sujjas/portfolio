/* ════════════════════════════════════════════════════════════════════════ */
/* SENA DECK BUILDER                                                         */
/* Turns a sena-deck JSON spec into a downloadable .pptx via PptxGenJS.      */
/* Charts on "graphic" slides are rendered offscreen with the host page's   */
/* amCharts render functions and embedded as PNG images.                    */
/*                                                                          */
/* Usage (host page must define the chart adapter):                         */
/*   SenaDeck.download(deckSpec, {                                          */
/*     renderChart:  function (containerId, chartSpec) { ... },             */
/*     getChartRoot: function (containerId) { return am5Root; },            */
/*     disposeChart: function (containerId) { ... },                        */
/*   });                                                                    */
/* ════════════════════════════════════════════════════════════════════════ */

window.SenaDeck = (function () {
  var PPTXGENJS_URL = 'https://cdn.jsdelivr.net/npm/pptxgenjs@4.0.1/+esm';
  var EXPORT_PLUGIN_URL = 'https://cdn.amcharts.com/lib/version/5.18.0/plugins/exporting.js';

  /* 16:9 deck geometry (inches) */
  var PAGE_W = 13.33;
  var PAGE_H = 7.5;
  var MARGIN = 0.6;

  var ACCENT = 'F4581C';     /* placeholder orange from the Figma graphic slide */

  /* Slide themes. Values mirror the Sena design system tokens (theme.css):
     sena-light bg = concrete-150, ink = concrete-900 / concrete-700;
     sena-dark  bg = ocean-850,    ink = concrete-150 / concrete-300. */
  var THEMES = {
    'neutral': {
      label: 'Neutral', bg: 'FFFFFF', ink: '111111', soft: '666666',
      titleFont: 'DM Sans', bodyFont: 'DM Sans'
    },
    'sena-light': {
      label: 'Sena Light', bg: 'F0F3F4', ink: '1B3742', soft: '2D5B6E',
      titleFont: 'DM Serif Display', bodyFont: 'DM Sans'
    },
    'sena-dark': {
      label: 'Sena Dark', bg: '182E44', ink: 'F0F3F4', soft: 'ABBDC5',
      titleFont: 'DM Serif Display', bodyFont: 'DM Sans'
    }
  };

  /* Chart render size (px). Deliberately small: amCharts label font sizes are
     fixed px, so a smaller logical canvas makes text proportionally bigger on
     the slide. Export upscales to 1920px wide for resolution. */
  var CHART_W = 640;
  var CHART_H = 360;

  var deckIdCounter = 0;

  /* ── Lazy loaders ──────────────────────────────────────────────────────── */
  var pptxgenPromise = null;
  function loadPptxGen() {
    if (!pptxgenPromise) {
      pptxgenPromise = import(PPTXGENJS_URL).then(function (m) { return m.default; });
    }
    return pptxgenPromise;
  }

  var exportPluginPromise = null;
  function loadExportPlugin() {
    if (window.am5plugins_exporting) return Promise.resolve();
    if (!exportPluginPromise) {
      exportPluginPromise = new Promise(function (resolve, reject) {
        var s = document.createElement('script');
        s.src = EXPORT_PLUGIN_URL;
        s.onload = resolve;
        s.onerror = function () { reject(new Error('Could not load amCharts exporting plugin')); };
        document.head.appendChild(s);
      });
    }
    return exportPluginPromise;
  }

  /* ── Offscreen chart → PNG data URI ───────────────────────────────────── */
  function chartToPng(chartSpec, adapter, themeKey) {
    return loadExportPlugin().then(function () {
      return new Promise(function (resolve, reject) {
        var id = 'sena-deck-export-' + (++deckIdCounter);
        var t = THEMES[themeKey] || THEMES['neutral'];
        /* Offscreen but laid out — display:none would give a 0x0 canvas */
        var holder = document.createElement('div');
        holder.id = id;
        holder.style.cssText = 'position:fixed;left:-99999px;top:0;width:' +
          CHART_W + 'px;height:' + CHART_H + 'px;background:#' + t.bg + ';';
        document.body.appendChild(holder);

        function cleanup() {
          try { adapter.disposeChart(id); } catch (_) {}
          holder.remove();
        }

        try {
          adapter.renderChart(id, chartSpec, themeKey);
        } catch (err) {
          cleanup();
          return reject(err);
        }

        var root = adapter.getChartRoot(id);
        if (!root) { cleanup(); return reject(new Error('Chart did not render')); }

        /* Wait for the render loop to settle, then export at 2x */
        root.events.once('frameended', function () {
          setTimeout(function () {
            var exporting = am5plugins_exporting.Exporting.new(root, {
              pngOptions: { quality: 1, maintainPixelRatio: false, minWidth: 1920 }
            });
            exporting.export('png').then(function (dataUri) {
              cleanup();
              resolve(dataUri);
            }).catch(function (err) { cleanup(); reject(err); });
          }, 150);
        });
      });
    });
  }

  /* ── Slide layouts (one function per Figma slide type) ─────────────────── */

  function slideTitle(slide, deck, s, t) {
    slide.addText(deck.title || 'Untitled deck', {
      x: MARGIN, y: 2.9, w: 9.5, h: 1.0,
      fontFace: t.titleFont, fontSize: 36, bold: true, color: t.ink,
    });
    if (deck.subtitle) {
      slide.addText(deck.subtitle, {
        x: MARGIN, y: 3.9, w: 9.5, h: 0.5,
        fontFace: t.bodyFont, fontSize: 14, color: t.soft,
      });
    }
    var preparedOn = new Date().toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
    var byline = (deck.preparedBy ? 'Prepared by ' + deck.preparedBy + ' · ' : 'Prepared on ') + preparedOn;
    slide.addText(byline, {
      x: MARGIN, y: PAGE_H - MARGIN - 0.4, w: 9.5, h: 0.4,
      fontFace: t.bodyFont, fontSize: 11, color: t.soft,
    });
  }

  function slideSection(slide, deck, s, t) {
    slide.addText(s.title || '', {
      x: MARGIN, y: 3.1, w: 11.0, h: 0.9,
      fontFace: t.titleFont, fontSize: 30, bold: true, color: t.ink,
    });
  }

  function slideHighlight(slide, deck, s, t) {
    slide.addText('Highlight', {
      x: MARGIN, y: 3.25, w: 3.5, h: 0.6,
      fontFace: t.titleFont, fontSize: 24, bold: true, color: t.ink,
    });
    slide.addText(s.text || '', {
      x: 6.2, y: 2.4, w: 6.3, h: 2.6,
      fontFace: t.bodyFont, fontSize: 16, color: t.ink, valign: 'middle',
    });
  }

  function slideMetrics3Col(slide, deck, s, t) {
    if (s.title) {
      slide.addText(s.title, {
        x: MARGIN, y: MARGIN, w: 9.0, h: 0.5,
        fontFace: t.titleFont, fontSize: 24, bold: true, color: t.ink,
      });
    }
    var metrics = (s.metrics || []).slice(0, 3);
    var colW = 3.7;
    metrics.forEach(function (m, i) {
      var x = MARGIN + i * (colW + 0.5);
      slide.addText(m.value || '', {
        x: x, y: 2.8, w: colW, h: 0.6,
        fontFace: t.bodyFont, fontSize: 28, bold: true, color: t.ink,
      });
      if (m.label) {
        slide.addText(m.label, {
          x: x, y: 3.45, w: colW, h: 0.35,
          fontFace: t.bodyFont, fontSize: 12, bold: true, color: t.ink,
        });
      }
      if (m.description) {
        slide.addText(m.description, {
          x: x, y: 3.85, w: colW, h: 1.2,
          fontFace: t.bodyFont, fontSize: 11, color: t.soft,
        });
      }
    });
  }

  function slideMetricsGrid(slide, deck, s, t) {
    if (s.title) {
      slide.addText(s.title, {
        x: MARGIN, y: 2.5, w: 4.4, h: 0.5,
        fontFace: t.titleFont, fontSize: 24, bold: true, color: t.ink,
      });
    }
    if (s.description) {
      slide.addText(s.description, {
        x: MARGIN, y: 3.1, w: 4.0, h: 1.4,
        fontFace: t.bodyFont, fontSize: 11, color: t.soft,
      });
    }
    var metrics = (s.metrics || []).slice(0, 4);
    var cellW = 3.0;
    metrics.forEach(function (m, i) {
      var col = i % 2, row = Math.floor(i / 2);
      var x = 6.4 + col * (cellW + 0.5);
      var y = 2.2 + row * 1.9;
      slide.addText(m.value || '', {
        x: x, y: y, w: cellW, h: 0.6,
        fontFace: t.bodyFont, fontSize: 30, bold: true, color: t.ink,
      });
      if (m.label) {
        slide.addText(m.label, {
          x: x, y: y + 0.62, w: cellW, h: 0.35,
          fontFace: t.bodyFont, fontSize: 11, color: t.soft,
        });
      }
    });
  }

  function slideGraphic(slide, deck, s, t, chartPng) {
    if (s.title) {
      slide.addText(s.title, {
        x: MARGIN, y: MARGIN, w: 4.2, h: 0.8,
        fontFace: t.titleFont, fontSize: 24, bold: true, color: t.ink,
      });
    }
    if (s.text) {
      slide.addText(s.text, {
        x: MARGIN, y: 1.6, w: 3.9, h: 3.0,
        fontFace: t.bodyFont, fontSize: 12, color: t.soft,
      });
    }
    var imgW = 7.6;
    var imgH = imgW * (CHART_H / CHART_W);
    var imgX = PAGE_W - MARGIN - imgW;
    var imgY = (PAGE_H - imgH) / 2;
    if (chartPng) {
      slide.addImage({ data: chartPng, x: imgX, y: imgY, w: imgW, h: imgH });
    } else {
      /* Chart export failed or no chart — orange placeholder like the Figma */
      slide.addShape('rect', {
        x: imgX, y: imgY, w: imgW, h: imgH, fill: { color: ACCENT },
      });
    }
  }

  /* ── Build + download ──────────────────────────────────────────────────── */

  /* Renders every graphic slide's chart to PNG first (sequentially, to keep
     memory in check), then assembles the deck. Returns a Promise. */
  function download(deck, adapter) {
    adapter = adapter || {};
    var slides = Array.isArray(deck.slides) ? deck.slides : [];
    var themeKey = THEMES[deck.theme] ? deck.theme : 'neutral';
    var t = THEMES[themeKey];

    /* 1. Export chart PNGs for graphic slides */
    var pngJobs = slides.map(function (s) {
      if (s.type !== 'graphic' || !s.chart || !adapter.renderChart) {
        return Promise.resolve(null);
      }
      return chartToPng(s.chart, adapter, themeKey).catch(function (err) {
        console.error('Deck chart export failed, using placeholder:', err);
        return null; /* placeholder rect instead of a broken deck */
      });
    });

    return Promise.all(pngJobs).then(function (pngs) {
      /* 2. Assemble the pptx */
      return loadPptxGen().then(function (PptxGenJS) {
        var pptx = new PptxGenJS();
        pptx.defineLayout({ name: 'SENA_WIDE', width: PAGE_W, height: PAGE_H });
        pptx.layout = 'SENA_WIDE';
        pptx.author = 'Sena';
        pptx.title = deck.title || 'Sena deck';

        slides.forEach(function (s, i) {
          var slide = pptx.addSlide();
          slide.background = { color: t.bg };
          switch (s.type) {
            case 'title':        slideTitle(slide, deck, s, t); break;
            case 'section':      slideSection(slide, deck, s, t); break;
            case 'highlight':    slideHighlight(slide, deck, s, t); break;
            case 'metrics_3col': slideMetrics3Col(slide, deck, s, t); break;
            case 'metrics_grid': slideMetricsGrid(slide, deck, s, t); break;
            case 'graphic':      slideGraphic(slide, deck, s, t, pngs[i]); break;
            default:             slideSection(slide, deck, { title: s.title || '' }, t);
          }
        });

        var fileName = (deck.title || 'sena-deck')
          .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') + '.pptx';
        return pptx.writeFile({ fileName: fileName });
      });
    });
  }

  return { download: download, THEMES: THEMES };
})();
