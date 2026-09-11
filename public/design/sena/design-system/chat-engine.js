/* ════════════════════════════════════════════════════════════════════════
 * Sena Chat Engine — shared, embeddable chat with streaming + chart rendering
 * ════════════════════════════════════════════════════════════════════════
 * Lifted from screens/chat.html so any screen can host a real Sena chat that
 * renders `sena-chart` visualizations and text/insight cards identically.
 *
 * Requires (load before this file):
 *   - amCharts 5: index, xy, percent, radar, hierarchy, themes/Animated
 *   - marked (UMD)
 *
 * Usage:
 *   SenaChat.init({
 *     conversation : document.getElementById('conversation'),  // scroll container
 *     input        : document.getElementById('chatInput'),     // <textarea>
 *     sendBtn      : document.getElementById('sendBtn'),        // send/stop button
 *     emptyState   : document.getElementById('emptyState'),     // optional
 *     clearBtn     : document.getElementById('clearBtn'),        // optional
 *     userInitials : 'JS',                                       // avatar text
 *     emptyHTML    : '<div class="chat-empty">…</div>',          // re-rendered on clear
 *     seedMessages : [ {role:'user',content:'…'}, … ]            // hidden context (not displayed)
 *   });
 *
 * Differences from the main chat page (by design, for embedded/side use):
 *   - No business-context injection.
 *   - Chart cards render clean (no add-to-report / edit / export chrome).
 *   - No localStorage persistence.
 * ════════════════════════════════════════════════════════════════════════ */
(function () {
  var am5themes_Animated = window.am5themes_Animated;

  /* ── Theme-aware chart colors ──────────────────────────────────────────── */
  function tv(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  var chartColors = {};
  var chartThemeUpdaters = [];

  function syncChartColors() {
    chartColors.positive      = tv('--data-positive-1') || '#59da9a';
    chartColors.neutral2      = tv('--data-neutral-2')  || '#67b7cb';
    chartColors.neutral3      = tv('--data-neutral-3')  || '#e072a1';
    chartColors.warning1      = tv('--data-warning-1')  || '#e7d45b';
    chartColors.warning2      = tv('--data-warning-2')  || '#fabc6b';
    chartColors.neutral1      = tv('--data-neutral-1')  || '#98acd2';
    chartColors.textPrimary   = tv('--text-primary')    || '#1a1a1a';
    chartColors.textSecondary = tv('--text-secondary')  || '#6b6b6b';
    chartColors.fgOnAccent    = tv('--fg-on-accent')    || '#1b3742';
    chartColors.bgPrimary     = tv('--bg-primary')      || '#ffffff';
  }
  syncChartColors();

  var colorCycle = ['positive', 'neutral2', 'neutral3', 'warning1', 'warning2', 'neutral1'];
  function getColorForIndex(i) { return chartColors[colorCycle[i % colorCycle.length]]; }

  function registerChartThemeUpdater(fn) { chartThemeUpdaters.push(fn); fn(); }
  function refreshAllCharts() { syncChartColors(); chartThemeUpdaters.forEach(function (fn) { fn(); }); }

  new MutationObserver(function (mutations) {
    mutations.forEach(function (m) { if (m.attributeName === 'data-theme') refreshAllCharts(); });
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  var chartRoots = {};
  var chartIdCounter = 0;

  /* ══════════════════════════════════════════════════════════════════════ */
  /* CHART RENDERERS                                                        */
  /* ══════════════════════════════════════════════════════════════════════ */

  function renderBarChart(containerId, data) {
    if (chartRoots[containerId]) { chartRoots[containerId].dispose(); }
    var maxVal = Math.max.apply(null, data.map(function (d) { return d.value; }));
    var root = am5.Root.new(containerId);
    chartRoots[containerId] = root;
    root._logo.dispose();
    root.setThemes([am5themes_Animated.new(root)]);

    var chart = root.container.children.push(am5xy.XYChart.new(root, {
      panX: false, panY: false, wheelX: 'none', wheelY: 'none',
      layout: root.verticalLayout,
      paddingLeft: 0, paddingRight: 0, paddingTop: 0, paddingBottom: 0
    }));

    var yAxis = chart.yAxes.push(am5xy.CategoryAxis.new(root, {
      categoryField: 'category',
      renderer: am5xy.AxisRendererY.new(root, {
        inversed: true, cellStartLocation: 0, cellEndLocation: 1, minGridDistance: 20
      })
    }));
    yAxis.get('renderer').labels.template.setAll({ fontSize: 11, oversizedBehavior: 'truncate', maxWidth: 140 });
    registerChartThemeUpdater(function () {
      yAxis.get('renderer').labels.template.set('fill', am5.color(chartColors.textPrimary));
    });
    yAxis.get('renderer').grid.template.set('visible', false);
    yAxis.data.setAll(data);

    var xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererX.new(root, { visible: false }),
      min: 0, max: maxVal, strictMinMax: true
    }));
    xAxis.get('renderer').labels.template.set('visible', false);
    xAxis.get('renderer').grid.template.set('visible', false);

    var series = chart.series.push(am5xy.ColumnSeries.new(root, {
      xAxis: xAxis, yAxis: yAxis, valueXField: 'value', categoryYField: 'category'
    }));
    series.columns.template.setAll({
      cornerRadiusTL: 6, cornerRadiusTR: 6, cornerRadiusBL: 6, cornerRadiusBR: 6,
      height: am5.percent(80), strokeOpacity: 0, tooltipText: '{category}: {valueX}'
    });
    series.columns.template.adapters.add('fill', function (fill, target) {
      var idx = data.findIndex(function (d) { return d.category === target.dataItem.get('categoryY'); });
      return am5.color(getColorForIndex(idx >= 0 ? idx : 0));
    });

    series.bullets.push(function (root, series, dataItem) {
      var label = am5.Label.new(root, {
        text: String(dataItem.get('valueX')), fontSize: 11, fontWeight: '600',
        centerY: am5.percent(50), x: 9
      });
      registerChartThemeUpdater(function () { label.set('fill', am5.color(chartColors.fgOnAccent)); });
      return am5.Bullet.new(root, { locationX: 0, locationY: 0.5, sprite: label });
    });

    series.data.setAll(data);
    registerChartThemeUpdater(function () {
      series.columns.each(function (col) {
        var cat = col.dataItem.get('categoryY');
        var idx = data.findIndex(function (d) { return d.category === cat; });
        var c = am5.color(getColorForIndex(idx >= 0 ? idx : 0));
        col.setAll({ fill: c, stroke: c });
      });
    });
    series.appear(600);
    chart.appear(600);
  }

  function renderPieChart(containerId, data) {
    if (chartRoots[containerId]) { chartRoots[containerId].dispose(); }
    var root = am5.Root.new(containerId);
    chartRoots[containerId] = root;
    root._logo.dispose();
    root.setThemes([am5themes_Animated.new(root)]);

    var chart = root.container.children.push(am5percent.PieChart.new(root, {
      innerRadius: am5.percent(55), layout: root.horizontalLayout,
      paddingLeft: 0, paddingRight: 0, paddingTop: 0, paddingBottom: 0
    }));

    var series = chart.series.push(am5percent.PieSeries.new(root, {
      valueField: 'value', categoryField: 'category', alignLabels: false
    }));
    series.labels.template.set('visible', false);
    series.ticks.template.set('visible', false);
    series.slices.template.setAll({ strokeWidth: 2, tooltipText: '{category}: {value}' });
    registerChartThemeUpdater(function () {
      series.slices.template.set('stroke', am5.color(chartColors.bgPrimary));
    });
    series.slices.template.adapters.add('fill', function (fill, target) {
      var cat = target.dataItem.get('category');
      var idx = data.findIndex(function (d) { return d.category === cat; });
      return am5.color(getColorForIndex(idx >= 0 ? idx : 0));
    });

    var legend = chart.children.push(am5.Legend.new(root, {
      centerY: am5.percent(50), y: am5.percent(50), layout: root.verticalLayout, marginLeft: -60
    }));
    legend.labels.template.setAll({ fontSize: 12, fontWeight: '600', oversizedBehavior: 'wrap', maxWidth: 120 });
    legend.valueLabels.template.set('visible', false);
    legend.markers.template.setAll({ width: 15, height: 15 });
    registerChartThemeUpdater(function () {
      legend.labels.template.set('fill', am5.color(chartColors.textPrimary));
      legend.markerRectangles.template.setAll({ stroke: am5.color(chartColors.bgPrimary), strokeWidth: 2 });
    });
    registerChartThemeUpdater(function () {
      series.slices.each(function (slice) {
        var cat = slice.dataItem.get('category');
        var idx = data.findIndex(function (d) { return d.category === cat; });
        slice.setAll({ fill: am5.color(getColorForIndex(idx >= 0 ? idx : 0)), stroke: am5.color(chartColors.bgPrimary) });
      });
    });

    series.data.setAll(data);
    legend.data.setAll(series.dataItems);
    series.appear(600);
    chart.appear(600);
  }

  function renderSemiCirclePieChart(containerId, data) {
    if (chartRoots[containerId]) { chartRoots[containerId].dispose(); }
    var root = am5.Root.new(containerId);
    chartRoots[containerId] = root;
    root._logo.dispose();
    root.setThemes([am5themes_Animated.new(root)]);

    var chart = root.container.children.push(am5percent.PieChart.new(root, {
      startAngle: 180, endAngle: 360, innerRadius: am5.percent(50),
      layout: root.horizontalLayout, paddingLeft: 0, paddingRight: 0, paddingTop: 0, paddingBottom: 0
    }));

    var series = chart.series.push(am5percent.PieSeries.new(root, {
      valueField: 'value', categoryField: 'category', startAngle: 180, endAngle: 360, alignLabels: false
    }));
    series.labels.template.set('visible', false);
    series.ticks.template.set('visible', false);
    series.slices.template.setAll({ strokeWidth: 2, tooltipText: '{category}: {value}' });
    registerChartThemeUpdater(function () { series.slices.template.set('stroke', am5.color(chartColors.bgPrimary)); });
    series.slices.template.adapters.add('fill', function (fill, target) {
      var cat = target.dataItem.get('category');
      var idx = data.findIndex(function (d) { return d.category === cat; });
      return am5.color(getColorForIndex(idx >= 0 ? idx : 0));
    });

    var legend = chart.children.push(am5.Legend.new(root, {
      centerY: am5.percent(50), y: am5.percent(50), layout: root.verticalLayout
    }));
    legend.labels.template.setAll({ fontSize: 12, fontWeight: '600', oversizedBehavior: 'wrap', maxWidth: 120 });
    legend.valueLabels.template.set('visible', false);
    legend.markers.template.setAll({ width: 15, height: 15 });
    registerChartThemeUpdater(function () { legend.labels.template.set('fill', am5.color(chartColors.textPrimary)); });
    registerChartThemeUpdater(function () {
      series.slices.each(function (slice) {
        var cat = slice.dataItem.get('category');
        var idx = data.findIndex(function (d) { return d.category === cat; });
        slice.setAll({ fill: am5.color(getColorForIndex(idx >= 0 ? idx : 0)), stroke: am5.color(chartColors.bgPrimary) });
      });
    });

    series.data.setAll(data);
    legend.data.setAll(series.dataItems);
    series.appear(600);
    chart.appear(600);
  }

  function renderStackedColumnChart(containerId, data) {
    if (chartRoots[containerId]) { chartRoots[containerId].dispose(); }
    var root = am5.Root.new(containerId);
    chartRoots[containerId] = root;
    root._logo.dispose();
    root.setThemes([am5themes_Animated.new(root)]);

    var seriesKeys = Object.keys(data[0]).filter(function (k) { return k !== 'category'; });

    var chart = root.container.children.push(am5xy.XYChart.new(root, {
      panX: false, panY: false, wheelX: 'none', wheelY: 'none',
      layout: root.verticalLayout, paddingLeft: 0, paddingRight: 0, paddingTop: 0, paddingBottom: 0
    }));

    var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
      categoryField: 'category',
      renderer: am5xy.AxisRendererX.new(root, { cellStartLocation: 0.05, cellEndLocation: 0.95, minGridDistance: 30 })
    }));
    xAxis.get('renderer').labels.template.setAll({ fontSize: 11, oversizedBehavior: 'truncate', maxWidth: 80 });
    registerChartThemeUpdater(function () { xAxis.get('renderer').labels.template.set('fill', am5.color(chartColors.textPrimary)); });
    xAxis.get('renderer').grid.template.set('visible', false);
    xAxis.data.setAll(data);

    var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, { visible: false }), min: 0
    }));
    yAxis.get('renderer').labels.template.set('visible', false);
    yAxis.get('renderer').grid.template.set('visible', false);

    seriesKeys.forEach(function (key, i) {
      var isTop = i === seriesKeys.length - 1;
      var series = chart.series.push(am5xy.ColumnSeries.new(root, {
        name: key, xAxis: xAxis, yAxis: yAxis, stacked: true, valueYField: key, categoryXField: 'category'
      }));
      series.columns.template.setAll({
        cornerRadiusTL: isTop ? 4 : 0, cornerRadiusTR: isTop ? 4 : 0, cornerRadiusBL: 0, cornerRadiusBR: 0,
        strokeOpacity: 0, tooltipText: '{name}: {valueY}', fill: am5.color(getColorForIndex(i)), width: am5.percent(60)
      });
      series.data.setAll(data);
      series.appear(600);
    });

    if (seriesKeys.length > 1) {
      var legend = chart.children.push(am5.Legend.new(root, { centerX: am5.percent(50), x: am5.percent(50) }));
      legend.labels.template.setAll({ fontSize: 12, fontWeight: '600' });
      legend.markers.template.setAll({ width: 15, height: 15 });
      registerChartThemeUpdater(function () { legend.labels.template.set('fill', am5.color(chartColors.textPrimary)); });
      legend.data.setAll(chart.series.values);
    }
    chart.appear(600);
  }

  function renderTreemapChart(containerId, data) {
    if (chartRoots[containerId]) { chartRoots[containerId].dispose(); }
    var root = am5.Root.new(containerId);
    chartRoots[containerId] = root;
    root._logo.dispose();
    root.setThemes([am5themes_Animated.new(root)]);

    var container = root.container.children.push(am5.Container.new(root, {
      width: am5.percent(100), height: am5.percent(100), layout: root.verticalLayout
    }));

    var series = container.children.push(am5hierarchy.Treemap.new(root, {
      sort: 'descending', singleBranchOnly: false, downDepth: 1, upDepth: 0, initialDepth: 1,
      valueField: 'value', categoryField: 'name', childDataField: 'children', nodePaddingOuter: 4, nodePaddingInner: 2
    }));

    series.rectangles.template.setAll({
      strokeWidth: 2, cornerRadiusTL: 6, cornerRadiusTR: 6, cornerRadiusBL: 6, cornerRadiusBR: 6, tooltipText: '{name}: {value}'
    });
    registerChartThemeUpdater(function () {
      var strokeColor = am5.color(chartColors.bgPrimary);
      series.rectangles.template.set('stroke', strokeColor);
      series.rectangles.each(function (rect) { rect.set('stroke', strokeColor); });
    });
    series.rectangles.template.adapters.add('fill', function (fill, target) {
      if (!target.dataItem || !target.dataItem.dataContext) return fill;
      var idx = target.dataItem.dataContext._index;
      return idx !== undefined ? am5.color(getColorForIndex(idx)) : fill;
    });
    series.rectangles.template.adapters.add('fillOpacity', function (fillOpacity, target) {
      if (!target.dataItem || !target.dataItem.dataContext) return fillOpacity;
      return target.dataItem.dataContext._index === undefined ? 0 : 1;
    });
    series.rectangles.template.adapters.add('strokeOpacity', function (strokeOpacity, target) {
      if (!target.dataItem || !target.dataItem.dataContext) return strokeOpacity;
      return target.dataItem.dataContext._index === undefined ? 0 : 1;
    });
    series.labels.template.setAll({ fontSize: 12, fontWeight: '600', text: '{name}', oversizedBehavior: 'truncate' });
    registerChartThemeUpdater(function () {
      var labelColor = am5.color(chartColors.fgOnAccent);
      series.labels.template.set('fill', labelColor);
      series.labels.each(function (lbl) { lbl.set('fill', labelColor); });
    });

    var treeData = [{ name: 'Root', children: data.map(function (d, i) { return { name: d.category, value: d.value, _index: i }; }) }];
    series.data.setAll(treeData);
    series.set('selectedDataItem', series.dataItems[0]);
    series.appear(600);
  }

  function renderRadarChart(containerId, data) {
    if (chartRoots[containerId]) { chartRoots[containerId].dispose(); }
    var root = am5.Root.new(containerId);
    chartRoots[containerId] = root;
    root._logo.dispose();
    root.setThemes([am5themes_Animated.new(root)]);

    var chart = root.container.children.push(am5radar.RadarChart.new(root, {
      panX: false, panY: false, wheelX: 'none', wheelY: 'none',
      innerRadius: am5.percent(20), paddingLeft: 0, paddingRight: 0, paddingTop: 0, paddingBottom: 0
    }));

    var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
      categoryField: 'category', renderer: am5radar.AxisRendererCircular.new(root, {})
    }));
    xAxis.get('renderer').labels.template.setAll({ fontSize: 11, oversizedBehavior: 'truncate', maxWidth: 80 });
    registerChartThemeUpdater(function () {
      xAxis.get('renderer').labels.template.set('fill', am5.color(chartColors.textPrimary));
      xAxis.get('renderer').grid.template.set('stroke', am5.color(chartColors.textSecondary));
    });
    xAxis.data.setAll(data);

    var maxVal = Math.max.apply(null, data.map(function (d) { return d.value; }));
    var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
      renderer: am5radar.AxisRendererRadial.new(root, {}), min: 0, max: maxVal * 1.1
    }));
    yAxis.get('renderer').labels.template.set('visible', false);
    registerChartThemeUpdater(function () { yAxis.get('renderer').grid.template.set('stroke', am5.color(chartColors.textSecondary)); });

    var series = chart.series.push(am5radar.RadarColumnSeries.new(root, {
      xAxis: xAxis, yAxis: yAxis, valueYField: 'value', categoryXField: 'category'
    }));
    series.columns.template.setAll({ strokeOpacity: 0, tooltipText: '{category}: {valueY}', width: am5.percent(100) });
    series.columns.template.adapters.add('fill', function (fill, target) {
      var cat = target.dataItem.get('categoryX');
      var idx = data.findIndex(function (d) { return d.category === cat; });
      return am5.color(getColorForIndex(idx >= 0 ? idx : 0));
    });
    series.data.setAll(data);
    series.appear(600);
    chart.appear(600);
  }

  function renderGaugeChart(containerId, data) {
    if (chartRoots[containerId]) { chartRoots[containerId].dispose(); }
    var root = am5.Root.new(containerId);
    chartRoots[containerId] = root;
    root._logo.dispose();
    root.setThemes([am5themes_Animated.new(root)]);
    root.container.set('layout', root.verticalLayout);

    var maxVal = Math.max.apply(null, data.map(function (d) { return d.value; }));

    var chart = root.container.children.push(am5radar.RadarChart.new(root, {
      panX: false, panY: false, wheelX: 'none', wheelY: 'none',
      startAngle: 180, endAngle: 360, innerRadius: am5.percent(35),
      paddingLeft: 0, paddingRight: 0, paddingTop: 0, paddingBottom: 0, height: am5.percent(82)
    }));

    data.forEach(function (d, i) {
      var axisRenderer = am5radar.AxisRendererCircular.new(root, {
        radius: am5.percent(100 - i * (60 / data.length)),
        innerRadius: am5.percent(100 - (i + 1) * (60 / data.length) + 3)
      });
      axisRenderer.labels.template.set('visible', false);
      axisRenderer.grid.template.set('visible', false);

      var axis = chart.xAxes.push(am5xy.ValueAxis.new(root, { renderer: axisRenderer, min: 0, max: maxVal, strictMinMax: true }));
      var bgRange = axis.createAxisRange(axis.makeDataItem({ value: 0, endValue: maxVal }));
      bgRange.get('axisFill').setAll({ visible: true, fillOpacity: 0.15, fill: am5.color(getColorForIndex(i)) });
      var fillRange = axis.createAxisRange(axis.makeDataItem({ value: 0, endValue: d.value }));
      fillRange.get('axisFill').setAll({ visible: true, fillOpacity: 1, fill: am5.color(getColorForIndex(i)), tooltipText: d.category + ': ' + d.value });
      fillRange.get('tick').setAll({ visible: false });
      fillRange.get('label').setAll({ visible: false });
    });

    var legendContainer = root.container.children.push(am5.Container.new(root, {
      layout: root.horizontalLayout, width: am5.percent(100), x: am5.percent(50), centerX: am5.percent(50), paddingTop: 4
    }));
    data.forEach(function (d, i) {
      var item = legendContainer.children.push(am5.Container.new(root, { layout: root.horizontalLayout, paddingRight: 14, centerY: am5.percent(50) }));
      item.children.push(am5.RoundedRectangle.new(root, {
        width: 15, height: 15, cornerRadiusTL: 2, cornerRadiusTR: 2, cornerRadiusBL: 2, cornerRadiusBR: 2,
        fill: am5.color(getColorForIndex(i)), centerY: am5.percent(50), y: am5.percent(50)
      }));
      var label = am5.Label.new(root, {
        text: d.category + ' (' + d.value + ')', fontSize: 12, fontWeight: '600', paddingLeft: 5,
        centerY: am5.percent(50), y: am5.percent(50)
      });
      registerChartThemeUpdater(function () { label.set('fill', am5.color(chartColors.textPrimary)); });
      item.children.push(label);
    });
    chart.appear(600);
  }

  function renderVariableRadiusPieChart(containerId, data) {
    if (chartRoots[containerId]) { chartRoots[containerId].dispose(); }
    var root = am5.Root.new(containerId);
    chartRoots[containerId] = root;
    root._logo.dispose();
    root.setThemes([am5themes_Animated.new(root)]);

    var chart = root.container.children.push(am5percent.PieChart.new(root, {
      innerRadius: am5.percent(30), layout: root.horizontalLayout,
      paddingLeft: 0, paddingRight: 0, paddingTop: 0, paddingBottom: 0
    }));

    var vals = data.map(function (d) { return d.value; });
    var minV = Math.min.apply(null, vals);
    var maxV = Math.max.apply(null, vals);

    var series = chart.series.push(am5percent.PieSeries.new(root, { valueField: 'value', categoryField: 'category', alignLabels: false }));
    series.labels.template.set('visible', false);
    series.ticks.template.set('visible', false);
    series.slices.template.setAll({ strokeWidth: 2, tooltipText: '{category}: {value}' });
    series.slices.template.adapters.add('shiftRadius', function (shiftRadius, target) {
      if (!target.dataItem) return 0;
      var val = target.dataItem.get('value');
      var scale = maxV > minV ? (val - minV) / (maxV - minV) : 0;
      return scale * 20;
    });
    registerChartThemeUpdater(function () { series.slices.template.set('stroke', am5.color(chartColors.bgPrimary)); });
    series.slices.template.adapters.add('fill', function (fill, target) {
      var cat = target.dataItem.get('category');
      var idx = data.findIndex(function (d) { return d.category === cat; });
      return am5.color(getColorForIndex(idx >= 0 ? idx : 0));
    });

    var legend = chart.children.push(am5.Legend.new(root, { centerY: am5.percent(50), y: am5.percent(50), layout: root.verticalLayout }));
    legend.labels.template.setAll({ fontSize: 12, fontWeight: '600', oversizedBehavior: 'wrap', maxWidth: 120 });
    legend.valueLabels.template.set('visible', false);
    legend.markers.template.setAll({ width: 15, height: 15 });
    registerChartThemeUpdater(function () { legend.labels.template.set('fill', am5.color(chartColors.textPrimary)); });
    registerChartThemeUpdater(function () {
      series.slices.each(function (slice) {
        var cat = slice.dataItem.get('category');
        var idx = data.findIndex(function (d) { return d.category === cat; });
        slice.setAll({ fill: am5.color(getColorForIndex(idx >= 0 ? idx : 0)), stroke: am5.color(chartColors.bgPrimary) });
      });
    });

    series.data.setAll(data);
    legend.data.setAll(series.dataItems);
    series.appear(600);
    chart.appear(600);
  }

  function renderRadialHistogramChart(containerId, data) {
    if (chartRoots[containerId]) { chartRoots[containerId].dispose(); }
    var root = am5.Root.new(containerId);
    chartRoots[containerId] = root;
    root._logo.dispose();
    root.setThemes([am5themes_Animated.new(root)]);

    var chart = root.container.children.push(am5radar.RadarChart.new(root, {
      panX: false, panY: false, wheelX: 'none', wheelY: 'none',
      innerRadius: am5.percent(30), paddingLeft: 0, paddingRight: 0, paddingTop: 0, paddingBottom: 0
    }));

    var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
      categoryField: 'category', renderer: am5radar.AxisRendererCircular.new(root, { minGridDistance: 20 })
    }));
    xAxis.get('renderer').labels.template.setAll({ fontSize: 10, oversizedBehavior: 'truncate', maxWidth: 70 });
    registerChartThemeUpdater(function () {
      xAxis.get('renderer').labels.template.set('fill', am5.color(chartColors.textPrimary));
      xAxis.get('renderer').grid.template.set('stroke', am5.color(chartColors.textSecondary));
    });
    xAxis.data.setAll(data);

    var maxVal = Math.max.apply(null, data.map(function (d) { return d.value; }));
    var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
      renderer: am5radar.AxisRendererRadial.new(root, {}), min: 0, max: maxVal * 1.1
    }));
    yAxis.get('renderer').labels.template.set('visible', false);
    registerChartThemeUpdater(function () { yAxis.get('renderer').grid.template.set('stroke', am5.color(chartColors.textSecondary)); });

    var series = chart.series.push(am5radar.RadarColumnSeries.new(root, {
      xAxis: xAxis, yAxis: yAxis, valueYField: 'value', categoryXField: 'category'
    }));
    series.columns.template.setAll({ strokeOpacity: 0, tooltipText: '{category}: {valueY}', width: am5.percent(90), cornerRadius: 4 });
    series.columns.template.adapters.add('fill', function (fill, target) {
      var cat = target.dataItem.get('categoryX');
      var idx = data.findIndex(function (d) { return d.category === cat; });
      return am5.color(getColorForIndex(idx >= 0 ? idx : 0));
    });
    series.data.setAll(data);
    series.appear(600);
    chart.appear(600);
  }

  /* ══════════════════════════════════════════════════════════════════════ */
  /* MARKED RENDERER FOR sena-chart BLOCKS (clean card — no action chrome)  */
  /* ══════════════════════════════════════════════════════════════════════ */

  var renderer = new marked.Renderer();
  var defaultCodeRenderer = renderer.code;

  renderer.code = function (token) {
    /* sena-suggest / sena-attach drive chat.html UI — never show as raw JSON */
    if (token.lang === 'sena-suggest' || token.lang === 'sena-attach') return '';
    if (token.lang === 'sena-chart') {
      try {
        var spec = JSON.parse(token.text);
        var id = 'twin-chart-' + (++chartIdCounter);
        var specAttr = JSON.stringify(spec).replace(/'/g, '&#39;').replace(/"/g, '&quot;');
        return '<div class="chat-chart-card' + (spec.type === 'text' ? ' text-card' : '') + (spec.type === 'table' ? ' table-card' : '') + '" data-chart-pending="' + id + '" data-chart-spec="' + specAttr + '">' +
          '<div class="chat-chart-card-header">' +
            (spec.title ? '<span class="chat-chart-title">' + (spec.type === 'text' ? '<span style="color:var(--text-accent);">' + spec.title + '</span>' : spec.title) + '</span>' : '') +
            (spec.subtitle ? '<span class="chat-chart-subtitle">' + spec.subtitle + '</span>' : '') +
          '</div>' +
          (spec.type === 'text' ?
            (spec.kpi ? '<div style="display:flex;flex-direction:column;gap:4px;">' +
              '<span style="font-weight:var(--fw-bold);font-size:36px;line-height:40px;letter-spacing:-0.5px;color:var(--data-neutral-3);">' + spec.kpi + '</span>' +
              (spec.kpiLabel ? '<span style="font-weight:var(--fw-bold);font-size:var(--text-lg);line-height:24px;color:var(--text-primary);">' + spec.kpiLabel + '</span>' : '') +
            '</div>' : '') +
            (spec.body ? '<div class="text-card-body sena-text">' + marked.parse(spec.body) + '</div>' : '')
          : spec.type === 'table' && spec.columns && spec.rows ?
            '<div class="chart-table-wrap">' +
              '<table class="chart-table">' +
                '<thead><tr>' + spec.columns.map(function (col) { return '<th>' + col + '</th>'; }).join('') + '</tr></thead>' +
                '<tbody>' + spec.rows.map(function (row) {
                  return '<tr>' + spec.columns.map(function (col) { return '<td>' + (row[col] !== undefined ? row[col] : '') + '</td>'; }).join('') + '</tr>';
                }).join('') + '</tbody>' +
              '</table>' +
            '</div>'
          : '<div class="chat-chart-container" id="' + id + '"></div>') +
        '</div>';
      } catch (_) {}
    }
    if (token.lang === 'sena-deck') {
      try {
        var deck = JSON.parse(token.text);
        var deckAttr = JSON.stringify(deck).replace(/'/g, '&#39;').replace(/"/g, '&quot;');
        var slides = Array.isArray(deck.slides) ? deck.slides : [];
        var deckId = 'engine-deck-' + (++chartIdCounter);
        return '<div class="chat-deck-card" data-deck-pending="' + deckId + '" data-deck-spec="' + deckAttr + '">' +
          '<div class="deck-card-header">' +
            '<span class="deck-card-icon fa-duotone" data-icon="presentation-screen"></span>' +
            '<div class="deck-card-heading">' +
              '<span class="deck-card-title">' + escText(deck.title || 'Presentation') + '</span>' +
              '<span class="deck-card-subtitle">' + slides.length + ' slides' +
                (deck.subtitle ? ' · ' + escText(deck.subtitle) : '') + '</span>' +
            '</div>' +
            '<div class="deck-theme-switch">' +
              '<button class="deck-theme-opt active" data-theme="neutral">Neutral</button>' +
              '<button class="deck-theme-opt" data-theme="sena-light">Sena Light</button>' +
              '<button class="deck-theme-opt" data-theme="sena-dark">Sena Dark</button>' +
            '</div>' +
            '<button class="btn btn-primary btn-sm deck-download-btn">' +
              '<span class="btn-icon">arrow-down-to-bracket</span> Download .pptx</button>' +
          '</div>' +
          '<div class="deck-preview">' +
            '<button class="deck-nav deck-nav-prev fa" aria-label="Previous slide">chevron-left</button>' +
            '<div class="deck-preview-stage"></div>' +
            '<button class="deck-nav deck-nav-next fa" aria-label="Next slide">chevron-right</button>' +
          '</div>' +
          '<div class="deck-preview-counter"></div>' +
        '</div>';
      } catch (_) {}
    }
    return defaultCodeRenderer.call(this, token);
  };

  marked.setOptions({ renderer: renderer });

  /* Sanitize ALL rendered markdown. Model output is untrusted — it can echo
     attacker-controlled CSV content — so DOMPurify strips scripts, event
     handlers, and javascript: URLs while preserving chart/deck card markup. */
  if (typeof DOMPurify !== 'undefined') {
    marked.use({ hooks: { postprocess: function (html) { return DOMPurify.sanitize(html); } } });
  }

  function escText(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function stripIncompleteChartBlocks(text) {
    /* If there's an unclosed ```sena-chart / -deck / -attach / -suggest at the end, remove it */
    return text.replace(/```sena-(?:chart|deck|attach|suggest)\n(?![\s\S]*?```)[\s\S]*$/, '');
  }

  /* ══════════════════════════════════════════════════════════════════════ */
  /* DECK DOWNLOAD (sena-deck cards → .pptx via SenaDeck, when loaded)       */
  /* ══════════════════════════════════════════════════════════════════════ */

  /* Slide chart palettes are tied to the DECK theme, not the app theme. */
  var DECK_LIGHT_COLORS = {
    positive: '#59da9a', neutral2: '#67b7cb', neutral3: '#e072a1',
    warning1: '#e7d45b', warning2: '#fabc6b', neutral1: '#98acd2',
    textPrimary: '#1a1a1a', textSecondary: '#6b6b6b',
    fgOnAccent: '#1b3742', bgPrimary: '#ffffff'
  };
  var DECK_DARK_COLORS = Object.assign({}, DECK_LIGHT_COLORS, {
    textPrimary: '#f0f3f4', textSecondary: '#abbdc5', bgPrimary: '#182e44'
  });

  var deckChartAdapter = {
    renderChart: function (id, spec, themeKey) {
      var saved = Object.assign({}, chartColors);
      Object.assign(chartColors, themeKey === 'sena-dark' ? DECK_DARK_COLORS : DECK_LIGHT_COLORS);
      try { renderChartBySpec(id, spec); }
      finally { Object.assign(chartColors, saved); }
    },
    getChartRoot: function (id) { return chartRoots[id]; },
    disposeChart: function (id) {
      if (chartRoots[id]) { chartRoots[id].dispose(); delete chartRoots[id]; }
    }
  };

  function getPreparedBy() {
    try {
      if (typeof Scenario !== 'undefined') {
        var s = Scenario.get();
        if (s && s.user && s.user.name) return s.user.name;
      }
    } catch (_) {}
    var el = document.querySelector('.user-name');
    return el ? el.textContent.trim() : '';
  }

  function deckDateLabel() {
    return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  /* Build the HTML preview for one slide (mirrors deck-builder.js layouts) */
  function buildDeckSlide(deck, s, chartId) {
    var el = document.createElement('div');
    el.className = 'dk-slide';
    var h = '';
    if (s.type === 'title') {
      var by = getPreparedBy();
      h = '<div class="dk-title-main">' + escText(deck.title || 'Untitled deck') + '</div>' +
        (deck.subtitle ? '<div class="dk-title-sub">' + escText(deck.subtitle) + '</div>' : '') +
        '<div class="dk-byline">' + (by ? 'Prepared by ' + escText(by) + ' · ' : 'Prepared on ') + deckDateLabel() + '</div>';
    } else if (s.type === 'section') {
      h = '<div class="dk-section-title">' + escText(s.title || '') + '</div>';
    } else if (s.type === 'highlight') {
      h = '<div class="dk-hl-label">Highlight</div>' +
        '<div class="dk-hl-text">' + escText(s.text || '') + '</div>';
    } else if (s.type === 'metrics_3col') {
      h = (s.title ? '<div class="dk-m3-title">' + escText(s.title) + '</div>' : '');
      (s.metrics || []).slice(0, 3).forEach(function (m, i) {
        var left = (4.5 + i * 31.5) + '%';
        h += '<div class="dk-m3-value" style="left:' + left + ';width:27.7%;">' + escText(m.value || '') + '</div>' +
          (m.label ? '<div class="dk-m3-label" style="left:' + left + ';width:27.7%;">' + escText(m.label) + '</div>' : '') +
          (m.description ? '<div class="dk-m3-desc" style="left:' + left + ';width:27.7%;">' + escText(m.description) + '</div>' : '');
      });
    } else if (s.type === 'metrics_grid') {
      h = (s.title ? '<div class="dk-mg-title">' + escText(s.title) + '</div>' : '') +
        (s.description ? '<div class="dk-mg-desc">' + escText(s.description) + '</div>' : '');
      (s.metrics || []).slice(0, 4).forEach(function (m, i) {
        var left = (48 + (i % 2) * 26.3) + '%';
        var top = (29 + Math.floor(i / 2) * 25.5) + '%';
        h += '<div class="dk-mg-value" style="left:' + left + ';top:' + top + ';width:22.5%;">' + escText(m.value || '') + '</div>' +
          (m.label ? '<div class="dk-mg-label" style="left:' + left + ';top:calc(' + top + ' + 9%);width:22.5%;">' + escText(m.label) + '</div>' : '');
      });
    } else if (s.type === 'graphic') {
      h = (s.title ? '<div class="dk-g-title">' + escText(s.title) + '</div>' : '') +
        (s.text ? '<div class="dk-g-text">' + escText(s.text) + '</div>' : '') +
        (s.chart ? '<div class="dk-g-chart" id="' + chartId + '"></div>' : '<div class="dk-g-placeholder"></div>');
    } else {
      h = '<div class="dk-section-title">' + escText(s.title || '') + '</div>';
    }
    el.innerHTML = h;
    return el;
  }

  /* Wire one deck card: build slide previews, arrows, counter, lazy charts */
  function wireDeckCard(card, deckId) {
    var deck;
    try { deck = JSON.parse(card.getAttribute('data-deck-spec')); } catch (_) { return; }
    var slides = Array.isArray(deck.slides) ? deck.slides : [];
    var stage = card.querySelector('.deck-preview-stage');
    var prevBtn = card.querySelector('.deck-nav-prev');
    var nextBtn = card.querySelector('.deck-nav-next');
    var counter = card.querySelector('.deck-preview-counter');
    if (!stage || !slides.length) return;
    stage.innerHTML = ''; /* idempotent: re-wiring must not duplicate slides */

    var els = slides.map(function (s, i) {
      var el = buildDeckSlide(deck, s, deckId + '-chart-' + i);
      stage.appendChild(el);
      return el;
    });
    var rendered = {};
    var current = 0;
    var theme = card.dataset.deckTheme || 'neutral';

    function show(idx) {
      current = Math.max(0, Math.min(slides.length - 1, idx));
      els.forEach(function (el, i) { el.classList.toggle('active', i === current); });
      counter.textContent = (current + 1) + ' / ' + slides.length;
      prevBtn.disabled = current === 0;
      nextBtn.disabled = current === slides.length - 1;
      /* Lazy-render the chart once the slide is actually visible (a hidden
         container would give amCharts a 0x0 canvas) */
      var s = slides[current];
      if (s.type === 'graphic' && s.chart && !rendered[current]) {
        rendered[current] = true;
        try { deckChartAdapter.renderChart(deckId + '-chart-' + current, s.chart, theme); }
        catch (err) { console.error('Deck preview chart failed:', err); }
      }
    }

    function setTheme(key) {
      theme = key;
      card.dataset.deckTheme = key;
      stage.classList.remove('dk-th-neutral', 'dk-th-sena-light', 'dk-th-sena-dark');
      stage.classList.add('dk-th-' + key);
      card.querySelectorAll('.deck-theme-opt').forEach(function (b) {
        b.classList.toggle('active', b.getAttribute('data-theme') === key);
      });
      /* Re-render already-built charts with the new palette */
      Object.keys(rendered).forEach(function (i) {
        deckChartAdapter.disposeChart(deckId + '-chart-' + i);
      });
      rendered = {};
      show(current);
    }

    card.querySelectorAll('.deck-theme-opt').forEach(function (b) {
      b.addEventListener('click', function () { setTheme(b.getAttribute('data-theme')); });
    });
    prevBtn.addEventListener('click', function () { show(current - 1); });
    nextBtn.addEventListener('click', function () { show(current + 1); });
    setTheme(theme);
  }

  function wirePendingDecks(container) {
    container.querySelectorAll('[data-deck-pending]').forEach(function (card) {
      var deckId = card.getAttribute('data-deck-pending');
      card.removeAttribute('data-deck-pending');
      try { wireDeckCard(card, deckId); }
      catch (err) { console.error('Deck card wiring failed:', err); }
    });
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.deck-download-btn');
    if (!btn || btn.disabled) return;
    var card = btn.closest('.chat-deck-card');
    if (!card) return;
    if (!window.SenaDeck) {
      console.error('SenaDeck missing — include design-system/deck-builder.js');
      return;
    }
    var deck;
    try { deck = JSON.parse(card.getAttribute('data-deck-spec')); } catch (_) { return; }
    deck.preparedBy = getPreparedBy();
    deck.theme = card.dataset.deckTheme || 'neutral';

    var original = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<span class="btn-icon">hourglass-half</span> Building…';
    window.SenaDeck.download(deck, deckChartAdapter).then(function () {
      btn.innerHTML = '<span class="btn-icon">check</span> Downloaded';
      setTimeout(function () { btn.innerHTML = original; btn.disabled = false; }, 2500);
    }).catch(function (err) {
      console.error('Deck build failed:', err);
      btn.innerHTML = '<span class="btn-icon">triangle-exclamation</span> Failed. Try again';
      btn.disabled = false;
    });
  });

  function renderChartBySpec(id, spec) {
    if (chartRoots[id]) { chartRoots[id].dispose(); delete chartRoots[id]; }
    var el = document.getElementById(id);
    if (el) el.innerHTML = '';

    if (spec.type === 'bar' && spec.data) renderBarChart(id, spec.data);
    else if (spec.type === 'pie' && spec.data) renderPieChart(id, spec.data);
    else if (spec.type === 'semi_circle_pie' && spec.data) renderSemiCirclePieChart(id, spec.data);
    else if (spec.type === 'stacked_column' && spec.data) renderStackedColumnChart(id, spec.data);
    else if (spec.type === 'treemap' && spec.data) renderTreemapChart(id, spec.data);
    else if (spec.type === 'radar' && spec.data) renderRadarChart(id, spec.data);
    else if (spec.type === 'gauge' && spec.data) renderGaugeChart(id, spec.data);
    else if (spec.type === 'variable_radius_pie' && spec.data) renderVariableRadiusPieChart(id, spec.data);
    else if (spec.type === 'radial_histogram' && spec.data) renderRadialHistogramChart(id, spec.data);
  }

  /* Each card renders in its own try/catch so one broken chart (e.g. a chart
     library failure) can't crash the stream loop or kill the other charts. */
  function renderPendingCharts(container) {
    wirePendingDecks(container);
    var pending = container.querySelectorAll('[data-chart-pending]');
    pending.forEach(function (card) {
      var id = card.getAttribute('data-chart-pending');
      var spec;
      try { spec = JSON.parse(card.getAttribute('data-chart-spec')); } catch (_) { return; }
      card.removeAttribute('data-chart-pending');
      try {
        renderChartBySpec(id, spec);
      } catch (err) {
        console.error('Chart render failed (' + (spec.type || 'unknown') + '):', err);
        var el = document.getElementById(id);
        if (el) {
          var safeMsg = String(err.message || 'chart library error')
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
          el.innerHTML = '<div class="chart-render-error">' +
            '<span class="btn-icon">triangle-exclamation</span> ' +
            'This chart could not be rendered (' + safeMsg + '). Reload the page and try again.</div>';
        }
      }
    });
  }

  /* ══════════════════════════════════════════════════════════════════════ */
  /* CHAT INSTANCE                                                          */
  /* ══════════════════════════════════════════════════════════════════════ */

  function init(opts) {
    var conversation = opts.conversation;
    var input        = opts.input;
    var sendBtn      = opts.sendBtn;
    var clearBtn     = opts.clearBtn || null;
    var emptyState   = opts.emptyState || null;
    var emptyHTML    = opts.emptyHTML || '';
    var userInitials = opts.userInitials || 'JS';
    var seed         = Array.isArray(opts.seedMessages) ? opts.seedMessages : [];

    var messages = seed.slice();
    var isStreaming = false;

    /* Response action row (copy / thumbs up / thumbs down) for Sena messages. */
    if (window.SenaMessageActions) SenaMessageActions.attach(conversation);
    var streamAbort = null;

    function scrollToBottom() {
      conversation.scrollTo({ top: conversation.scrollHeight, behavior: 'smooth' });
    }
    function escapeHtml(str) {
      return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function addUserMessage(text) {
      if (emptyState) { emptyState.remove(); emptyState = null; }
      var msg = document.createElement('div');
      msg.className = 'message-user fade-in';
      var bubble = document.createElement('div');
      bubble.className = 'message-bubble';
      bubble.innerHTML =
        '<div class="message-avatar"><span>' + escapeHtml(userInitials) + '</span></div>' +
        '<p class="message-text">' + escapeHtml(text) + '</p>';
      msg.appendChild(bubble);
      conversation.appendChild(msg);
      scrollToBottom();
    }

    function showThinking() {
      var el = document.createElement('div');
      el.className = 'sena-thinking fade-in';
      el.id = 'twinThinking';
      el.innerHTML = '<div class="thinking-dots"><span></span><span></span><span></span></div><span class="thinking-label">Sena is thinking…</span>';
      conversation.appendChild(el);
      scrollToBottom();
    }
    function removeThinking() {
      var el = document.getElementById('twinThinking');
      if (el) el.remove();
    }

    function createSenaMessage() {
      var msg = document.createElement('div');
      msg.className = 'message-sena fade-in';
      var textEl = document.createElement('div');
      textEl.className = 'sena-text';
      var cursor = document.createElement('span');
      cursor.className = 'typing-cursor';
      textEl.appendChild(cursor);
      msg.appendChild(textEl);
      conversation.appendChild(msg);
      scrollToBottom();
      return textEl;
    }

    function setSendMode() {
      sendBtn.innerHTML = '<span class="btn-icon">arrow-up</span>';
      sendBtn.classList.remove('btn-secondary');
      sendBtn.classList.add('btn-primary');
    }
    function setStopMode() {
      sendBtn.innerHTML = '<span class="btn-icon">stop</span>';
      sendBtn.classList.remove('btn-primary');
      sendBtn.classList.add('btn-secondary');
    }

    /* ── Contextual chat error messages ────────────────────────────────── */
    function isLocalEnv() {
      var h = location.hostname;
      return h === '' || h === 'localhost' || h === '127.0.0.1';
    }

    /* Builds a human error message from what actually went wrong:
       `res` for HTTP errors, `err` for network/stream failures,
       `gotPartial` when the stream died after some text already arrived. */
    function chatErrorHtml(res, err, gotPartial) {
      var msg;
      var logsHint = isLocalEnv() ? 'Check the server console.' : 'Check the Vercel function logs.';
      if (res) {
        if (res.status === 413) {
          msg = 'The request is too large. Clear the chat or detach large data sources, then try again.';
        } else if (res.status === 429) {
          msg = 'Rate limit reached. Wait a moment and try again.';
        } else if (res.status === 401) {
          msg = 'Your session has expired. Redirecting you to sign in…';
          setTimeout(function () { location.href = '/screens/sign-in.html'; }, 1800);
        } else if (res.status === 403) {
          msg = 'Access restricted to rwazi.com accounts.';
        } else if (res.status === 404) {
          msg = 'Chat endpoint not found (HTTP 404). ' + (isLocalEnv() ? 'Are you running <code>node server.js</code>?' : 'The <code>api/chat</code> function may not be deployed.');
        } else {
          msg = 'The server returned an error (HTTP ' + res.status + '). ' + logsHint;
        }
      } else if (gotPartial) {
        msg = 'The connection dropped mid-response, so the reply above may be incomplete. Ask Sena to continue, or try again.';
      } else if (err && err.message && !/failed to fetch|load failed|networkerror/i.test(err.message)) {
        /* A real JS error (not a network failure) — surface it instead of blaming the connection */
        msg = 'Something went wrong while displaying the response: <code>' + escapeHtml(err.message) + '</code>. The details are in the browser console.';
      } else if (isLocalEnv()) {
        msg = 'Could not reach the local server. Is it running? <code>node server.js</code>';
      } else {
        msg = 'Could not reach Sena. Check your internet connection and try again.';
      }
      return '<div class="sena-error">' + msg + '</div>';
    }

    function appendChatError(html) {
      var errEl = document.createElement('div');
      errEl.className = 'message-sena fade-in';
      errEl.innerHTML = html;
      conversation.appendChild(errEl);
      scrollToBottom();
    }

    async function streamResponse() {
      showThinking();
      setStopMode();
      streamAbort = new AbortController();
      var fullText = '';
      var senaTextEl = null;

      try {
        var res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: messages }),
          signal: streamAbort.signal,
        });

        if (!res.ok) {
          removeThinking();
          appendChatError(chatErrorHtml(res, null, false));
          isStreaming = false;
          return;
        }

        var reader = res.body.getReader();
        var decoder = new TextDecoder();
        var buffer = '';
        var firstChunk = true;

        while (true) {
          var result = await reader.read();
          if (result.done) break;

          buffer += decoder.decode(result.value, { stream: true });
          var lines = buffer.split('\n');
          buffer = lines.pop();

          for (var i = 0; i < lines.length; i++) {
            var line = lines[i].trim();
            if (!line.startsWith('data: ')) continue;
            var data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              var evt = JSON.parse(data);
              if (evt.text) {
                if (firstChunk) {
                  removeThinking();
                  senaTextEl = createSenaMessage();
                  firstChunk = false;
                }
                fullText += evt.text;

                var displayText = stripIncompleteChartBlocks(fullText);
                var isBuilding = displayText.length < fullText.length;
                var cur = senaTextEl.querySelector('.typing-cursor');
                senaTextEl.innerHTML = marked.parse(displayText);

                if (isBuilding) {
                  if (cur) cur.remove();
                  if (!senaTextEl.querySelector('.sena-building')) {
                    var b = document.createElement('div');
                    b.className = 'sena-building';
                    b.innerHTML = '<div class="thinking-dots"><span></span><span></span><span></span></div><span class="thinking-label">Sena is building…</span>';
                    senaTextEl.appendChild(b);
                  }
                } else {
                  if (cur) senaTextEl.appendChild(cur);
                  else {
                    var c = document.createElement('span');
                    c.className = 'typing-cursor';
                    senaTextEl.appendChild(c);
                  }
                }
                scrollToBottom();
              }
            } catch (_) {}
          }
        }

        if (senaTextEl) {
          var cur2 = senaTextEl.querySelector('.typing-cursor');
          if (cur2) cur2.remove();
          senaTextEl.innerHTML = marked.parse(fullText);
          /* Stash markdown source for the copy button (sans sena-* blocks). */
          senaTextEl.setAttribute('data-md', fullText.replace(/```sena-(?:chart|deck|attach)\n[\s\S]*?```\n?/g, '').trim());
          renderPendingCharts(senaTextEl);
          if (window.SenaMessageActions) SenaMessageActions.append(senaTextEl.parentNode);
          scrollToBottom();
        }

        if (fullText) messages.push({ role: 'assistant', content: fullText });

      } catch (err) {
        if (err.name === 'AbortError') {
          removeThinking();
          if (senaTextEl) {
            var cur3 = senaTextEl.querySelector('.typing-cursor');
            if (cur3) cur3.remove();
            if (fullText) {
              senaTextEl.innerHTML = marked.parse(stripIncompleteChartBlocks(fullText));
              renderPendingCharts(senaTextEl);
            }
          }
          if (fullText) messages.push({ role: 'assistant', content: fullText });
        } else {
          console.error('Chat stream failed:', err);
          removeThinking();
          /* Keep whatever already streamed in, then explain what went wrong */
          if (fullText) {
            if (senaTextEl) {
              var cur4 = senaTextEl.querySelector('.typing-cursor');
              if (cur4) cur4.remove();
              senaTextEl.innerHTML = marked.parse(stripIncompleteChartBlocks(fullText));
              renderPendingCharts(senaTextEl);
            }
            messages.push({ role: 'assistant', content: fullText });
          }
          appendChatError(chatErrorHtml(null, err, !!fullText));
        }
      }

      streamAbort = null;
      isStreaming = false;
      setSendMode();
    }

    function send() {
      var text = input.value.trim();
      if (!text || isStreaming) return;
      /* Host page may intercept the submit (e.g. route to a different surface).
         Returning true means "handled" — skip the normal Sena chat flow. */
      if (opts.onSubmit && opts.onSubmit(text) === true) {
        input.value = '';
        input.style.height = '';
        return;
      }
      isStreaming = true;
      messages.push({ role: 'user', content: text });
      addUserMessage(text);
      input.value = '';
      input.style.height = '';
      streamResponse();
    }

    /* ── Events ──────────────────────────────────────────────────────────── */
    sendBtn.addEventListener('click', function () {
      if (isStreaming && streamAbort) streamAbort.abort();
      else send();
    });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        if (isStreaming && streamAbort) streamAbort.abort();
        messages = seed.slice();
        conversation.innerHTML = emptyHTML;
        emptyState = conversation.firstElementChild;
        input.focus();
      });
    }

    /* Click a line in Sena's reply to quote it into the composer */
    conversation.addEventListener('click', function (e) {
      var target = e.target.closest('.sena-text p, .sena-text li');
      if (!target || target.closest('.text-card-body')) return;
      var quoted = target.textContent.trim();
      if (!quoted) return;
      input.value = input.value ? input.value + '\n' + quoted : quoted;
      input.focus();
    });

    /* ── Public helpers for host pages that build their own messages ────── */
    function appendUserMessage(text) {
      addUserMessage(text);
    }

    function appendAssistantCards(specs) {
      if (!Array.isArray(specs) || !specs.length) return;
      if (emptyState) { emptyState.remove(); emptyState = null; }
      var msg = document.createElement('div');
      msg.className = 'message-sena fade-in';
      var textEl = document.createElement('div');
      textEl.className = 'sena-text';
      var md = specs.map(function (spec) {
        return '```sena-chart\n' + JSON.stringify(spec) + '\n```';
      }).join('\n\n');
      textEl.innerHTML = marked.parse(md);
      msg.appendChild(textEl);
      conversation.appendChild(msg);
      renderPendingCharts(msg);
      scrollToBottom();
    }

    return {
      send: send,
      reset: function () { if (clearBtn) clearBtn.click(); },
      getMessages: function () { return messages.slice(); },
      addUserMessage: appendUserMessage,
      addAssistantCards: appendAssistantCards
    };
  }

  window.SenaChat = { init: init };
})();
