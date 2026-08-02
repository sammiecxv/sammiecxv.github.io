/* Bits of the phone shell that both apps need. consumer.html and business.html
   load this before their own root file.
   Puts StatusBar, useFitScale and AppSwitch on window. */

function StatusBar() {
  return (
    <div className="statusbar">
      <span className="time">9:41</span>
      <span className="glyphs">
        <svg width="17" height="11" viewBox="0 0 17 11" fill="none"><rect x="0" y="6" width="3" height="5" rx="1" fill="currentColor"/><rect x="4.5" y="3.5" width="3" height="7.5" rx="1" fill="currentColor"/><rect x="9" y="1" width="3" height="10" rx="1" fill="currentColor"/><rect x="13.5" y="0" width="3" height="11" rx="1" fill="currentColor" opacity="0.35"/></svg>
        <svg width="16" height="11" viewBox="0 0 16 11" fill="none"><path d="M8 2.2C10.3 2.2 12.4 3.1 14 4.6L8 10.6 2 4.6C3.6 3.1 5.7 2.2 8 2.2Z" stroke="currentColor" strokeWidth="1.2" fill="none"/></svg>
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none"><rect x="0.5" y="0.5" width="21" height="11" rx="3" stroke="currentColor" opacity="0.4"/><rect x="2" y="2" width="16" height="8" rx="1.5" fill="currentColor"/><rect x="23" y="4" width="1.5" height="4" rx="0.75" fill="currentColor" opacity="0.5"/></svg>
      </span>
    </div>
  );
}

function useFitScale(w, h) {
  const [scale, setScale] = React.useState(1);
  React.useLayoutEffect(() => {
    function fit() {
      const s = Math.min(1, (window.innerWidth - 48) / w, (window.innerHeight - 130) / h);
      setScale(s);
    }
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [w, h]);
  return scale;
}

/* The Consumer / Business chooser on both sign-in screens. Since the two apps
   are now separate pages, picking the other one has to navigate instead of
   just changing state like the old prototype switcher did. */
const APP_PATHS = { consumer: '/consumer', supplier: '/business' };

function AppSwitch({ current }) {
  return (
    <div style={{ display: 'flex', gap: 3, padding: 3, background: 'var(--surface-sunken)',
      border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)' }}>
      {[['consumer', 'Consumer'], ['supplier', 'Business']].map(([id, label]) => {
        const active = current === id;
        return (
          <button key={id} type="button" aria-current={active ? 'page' : undefined}
            onClick={() => { if (!active) window.location.href = APP_PATHS[id]; }}
            style={{ flex: 1, padding: '6px 13px', border: 'none', cursor: active ? 'default' : 'pointer',
              borderRadius: 'var(--radius-sm)', background: active ? 'var(--surface-raised)' : 'transparent',
              boxShadow: active ? 'var(--shadow-xs)' : 'none', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500,
              letterSpacing: '0.04em', textTransform: 'uppercase', color: active ? 'var(--indigo-700)' : 'var(--ink-400)' }}>{label}</button>
        );
      })}
    </div>
  );
}

Object.assign(window, { StatusBar, useFitScale, AppSwitch });
