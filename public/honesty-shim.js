/* Honesty-component fallback shim.
   The design-system bundle defines HonestyMark / HonestyLabel / HonestyRing, but
   the bundle only recompiles at turn boundaries. This shim fills them in on the
   namespace ONLY if the loaded bundle doesn't have them yet, so the prototype is
   robust regardless of compile timing. When the real bundle has them, this no-ops. */
(function () {
  var NS = window.ThreadTraceDesignSystem_f6483d = window.ThreadTraceDesignSystem_f6483d || {};
  if (NS.HonestyMark && NS.HonestyRing && NS.HonestyLabel) return;
  var R = window.React;
  var STATES = {
    checked: { color: 'var(--leaf-600)', bg: 'var(--leaf-100)', label: 'Checked' },
    told:    { color: 'var(--ochre-500)', bg: 'var(--ochre-100)', label: 'Told us' },
    notyet:  { color: 'var(--ink-300)', bg: 'var(--paper-200)', label: 'Not yet' },
  };
  NS.HONESTY_STATES = NS.HONESTY_STATES || STATES;

  function tickPath(size) { var u = size / 18; return 'M ' + (5.1 * u) + ' ' + (9.4 * u) + ' L ' + (7.6 * u) + ' ' + (11.9 * u) + ' L ' + (12.9 * u) + ' ' + (6.1 * u); }

  NS.HonestyMark = NS.HonestyMark || function HonestyMark(props) {
    props = props || {};
    var state = props.state || 'notyet', size = props.size || 18, s = STATES[state] || STATES.notyet;
    var r = size / 2, sw = Math.max(1.4, size * 0.11), ir = r - sw / 2, kids = [];
    if (state !== 'checked') kids.push(R.createElement('circle', { key: 'c', cx: r, cy: r, r: ir, stroke: s.color, strokeWidth: sw, fill: 'none' }));
    if (state === 'told') kids.push(R.createElement('path', { key: 'h', d: 'M ' + r + ' ' + (sw / 2) + ' A ' + ir + ' ' + ir + ' 0 0 0 ' + r + ' ' + (size - sw / 2) + ' Z', fill: s.color }));
    if (state === 'checked') {
      kids.push(R.createElement('circle', { key: 'f', cx: r, cy: r, r: ir, fill: s.color }));
      kids.push(R.createElement('path', { key: 't', d: tickPath(size), stroke: 'var(--paper-50)', strokeWidth: sw * 0.95, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' }));
    }
    var style = Object.assign({ display: 'block', flex: '0 0 auto' }, props.style || {});
    return R.createElement('svg', { width: size, height: size, viewBox: '0 0 ' + size + ' ' + size, fill: 'none', role: 'img', 'aria-label': props.title || s.label, style: style }, kids);
  };

  NS.HonestyLabel = NS.HonestyLabel || function HonestyLabel(props) {
    props = props || {};
    var state = props.state || 'notyet', size = props.size || 16, s = STATES[state] || STATES.notyet;
    return R.createElement('span', { style: Object.assign({ display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-700)' }, props.style || {}) },
      R.createElement(NS.HonestyMark, { state: state, size: size }), props.children || s.label);
  };

  NS.HonestyRing = NS.HonestyRing || function HonestyRing(props) {
    props = props || {};
    var percent = props.percent || 0, label = props.label !== undefined ? props.label : 'honest',
        sublabel = props.sublabel || null, size = props.size || 180,
        color = props.color || 'var(--indigo-500)', animate = props.animate !== false;
    var stroke = Math.round(size * 0.055), r = (size - stroke) / 2, c = 2 * Math.PI * r;
    var st = R.useState(animate ? 0 : percent), p = st[0], setP = st[1];
    R.useEffect(function () {
      if (!animate) { setP(percent); return; }
      var id = requestAnimationFrame(function () { setP(percent); });
      return function () { cancelAnimationFrame(id); };
    }, [percent, animate]);
    var off = c * (1 - Math.max(0, Math.min(100, p)) / 100);
    return R.createElement('div', { style: Object.assign({ position: 'relative', width: size, height: size }, props.style || {}) },
      R.createElement('svg', { width: size, height: size, viewBox: '0 0 ' + size + ' ' + size, style: { display: 'block', transform: 'rotate(-90deg)' } },
        R.createElement('circle', { cx: size / 2, cy: size / 2, r: r, fill: 'none', stroke: 'var(--paper-300)', strokeWidth: stroke }),
        R.createElement('circle', { cx: size / 2, cy: size / 2, r: r, fill: 'none', stroke: color, strokeWidth: stroke, strokeLinecap: 'round', strokeDasharray: c, strokeDashoffset: off, style: { transition: animate ? 'stroke-dashoffset 900ms var(--ease-out)' : 'none' } })),
      R.createElement('div', { style: { position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' } },
        R.createElement('span', { style: { fontFamily: 'var(--font-display)', fontWeight: 500, letterSpacing: '-0.02em', color: 'var(--ink-900)', fontSize: size * 0.26, lineHeight: 1 } }, Math.round(p) + '%'),
        label ? R.createElement('span', { style: { fontFamily: 'var(--font-sans)', fontSize: size * 0.085, color: 'var(--ink-500)', marginTop: size * 0.02 } }, label) : null,
        sublabel ? R.createElement('span', { style: { fontFamily: 'var(--font-mono)', fontSize: size * 0.072, color: 'var(--ink-400)', letterSpacing: 'var(--tracking-serial)', marginTop: 2 } }, sublabel) : null));
  };
})();
