// ThreadTrace consumer app — C1 Gateway → C2 Scanning → C3–C7 Passport.
// Rendered inside the phone chrome in index.html. Exports window.ConsumerApp.
const { Button, Input, Badge, Seal,
        HonestyMark, HonestyLabel, HonestyRing } = window.ThreadTraceDesignSystem_f6483d;
var { TieredHonestyRing, JargonToggle, HeritageMedia, RepairPartnerList,
      TransferOwnerFlow, RecyclerGate, DisassemblyPanel, TransparencyInsights } = window;
const P = window.TT.passport;

/* ============================ shared bits ============================ */

const SWATCH = {
  indigo: 'linear-gradient(150deg,#2D3E6B,#1E2A4A)',
  madder: 'linear-gradient(150deg,#B5502E,#97411F)',
  leaf: 'linear-gradient(150deg,#708A56,#4A5D3A)',
  cotton: 'linear-gradient(150deg,#E8E2D4,#C3B8A1)',
};

function Weave({ radius = 8, opacity = 0.16 }) {
  // two-directional textile weave + a soft raking sheen so empty swatches read as woven fabric, not a missing image
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, borderRadius: radius, overflow: 'hidden', pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', inset: 0, opacity,
        backgroundImage: 'repeating-linear-gradient(45deg,rgba(255,255,255,0.9) 0 1px,transparent 1px 6px),repeating-linear-gradient(-45deg,rgba(0,0,0,0.28) 0 1px,transparent 1px 6px)',
        backgroundSize: '7px 7px' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(150deg,rgba(255,255,255,0.22),transparent 42%,rgba(0,0,0,0.16))' }} />
    </div>
  );
}

function Sheet({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 1100, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(28,24,20,0.38)', backdropFilter: 'blur(1.5px)' }} />
      <div className="tt-sheet" style={{ position: 'relative', background: 'var(--surface-card)',
        borderTopLeftRadius: 'var(--radius-xl)', borderTopRightRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-xl)', padding: '10px 22px 30px', maxHeight: '88%', overflowY: 'auto' }}>
        <div style={{ width: 40, height: 4, borderRadius: 999, background: 'var(--paper-300)', margin: '0 auto 16px' }} />
        <button onClick={onClose} aria-label="Close" style={{ position: 'absolute', top: 14, right: 16, width: 34, height: 34, borderRadius: '50%', border: '1px solid var(--border-hairline)', background: 'var(--surface-card)', color: 'var(--ink-700)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
        </button>
        {children}
      </div>
    </div>
  );
}

/* ============================ C1 Gateway ============================ */

function POVToggle({ pov, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 3, padding: 3, background: 'var(--surface-sunken)',
      border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)' }}>
      {[['consumer', 'Consumer'], ['supplier', 'Business']].map(([id, label]) => {
        const active = pov === id;
        return (
          <button key={id} onClick={() => onChange(id)} style={{ padding: '5px 13px', border: 'none', cursor: 'pointer',
            borderRadius: 'var(--radius-sm)', background: active ? 'var(--surface-raised)' : 'transparent',
            boxShadow: active ? 'var(--shadow-xs)' : 'none', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500,
            letterSpacing: '0.04em', textTransform: 'uppercase', color: active ? 'var(--indigo-700)' : 'var(--ink-400)' }}>{label}</button>
        );
      })}
    </div>
  );
}

function Corner({ pos }) {
  const base = { position: 'absolute', width: 30, height: 30, borderColor: 'var(--paper-50)', borderStyle: 'solid', borderWidth: 0 };
  const map = {
    tl: { top: 16, left: 16, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 8 },
    tr: { top: 16, right: 16, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 8 },
    bl: { bottom: 16, left: 16, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 8 },
    br: { bottom: 16, right: 16, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 8 },
  };
  return <span style={{ ...base, ...map[pos] }} />;
}

function QRTag({ scale = 1 }) {
  return (
    <div style={{ width: 150 * scale, height: 190 * scale, borderRadius: 8, background: 'linear-gradient(150deg,#3a3229,#241f19)',
      boxShadow: '0 14px 34px rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 84 * scale, height: 84 * scale, borderRadius: 4, background: 'var(--paper-50)', padding: 8 * scale, boxSizing: 'border-box' }}>
        <div style={{ width: '100%', height: '100%', borderRadius: 2, opacity: 0.9,
          backgroundImage: 'repeating-linear-gradient(0deg,#1C1814 0 4px,transparent 4px 8px),repeating-linear-gradient(90deg,#1C1814 0 4px,transparent 4px 8px)' }} />
      </div>
    </div>
  );
}

function Gateway({ pov, onPov, onScan, onManual, onBack, onSignOut }) {
  const [sheet, setSheet] = React.useState(null);
  const [code, setCode] = React.useState('');
  const [manualOpen, setManualOpen] = React.useState(false);
  const [account, setAccount] = React.useState(loadAccount);
  const supplier = pov === 'supplier';
  return (
    <React.Fragment>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 22px 6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          {onBack ? (
            <button onClick={onBack} aria-label="Back to passport" title="Back" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, border: '1px solid var(--border-hairline)', background: 'var(--surface-card)', boxShadow: 'var(--shadow-sm)', cursor: 'pointer', borderRadius: 'var(--radius-pill)', padding: '5px 11px 5px 8px', color: 'var(--ink-700)', fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 600, flex: '0 0 auto' }}>
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M12 4l-6 6 6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Back
            </button>
          ) : (
            <React.Fragment>
              <img src={(window.__resources && window.__resources.logoMark) || "../assets/logo-mark.svg"} width="24" height="24" style={{ color: 'var(--ink-900)' }} alt="" />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 500, color: 'var(--ink-900)' }}>ThreadTrace</span>
            </React.Fragment>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button onClick={() => setSheet('account')} aria-label={account ? 'Account (signed in)' : 'Sign in'} title={account ? 'Account' : 'Sign in'}
            style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 4, color: account ? 'var(--indigo-500)' : 'var(--ink-400)', display: 'inline-flex', flex: '0 0 auto', position: 'relative' }}>
            <svg width="20" height="20" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="6.2" r="3" stroke="currentColor" strokeWidth="1.4" /><path d="M3.2 15.2c1-2.6 3.2-4 5.8-4s4.8 1.4 5.8 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
            {account ? <span style={{ position: 'absolute', top: 2, right: 1, width: 7, height: 7, borderRadius: '50%', background: 'var(--leaf-600)', border: '1.5px solid var(--surface-page)' }}></span> : null}
          </button>
          <button onClick={() => setSheet('explain')} aria-label="What is a Garment Passport?" title="What is a Garment Passport?"
            style={{ width: 30, height: 30, borderRadius: '50%', border: '1.5px solid var(--paper-400)', background: 'transparent', cursor: 'pointer', color: 'var(--ink-500)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 16, lineHeight: 1, flex: '0 0 auto' }}>?</button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingTop: 14, overflow: 'hidden' }}>
        <div style={{ position: 'relative', margin: '0 20px', height: 340, borderRadius: 'var(--radius-lg)', overflow: 'hidden',
          background: 'linear-gradient(165deg,#26313f,#171e28 60%,#12171f)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-md)' }}>
          {/* edge-tracking target grid — stabilises the scan on warped / puckered fabric */}
          <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(250,248,243,0.09) 1px,transparent 1px),linear-gradient(90deg,rgba(250,248,243,0.09) 1px,transparent 1px)', backgroundSize: '34px 34px' }} />
          <div aria-hidden="true" className="tt-track" style={{ position: 'absolute', width: 168, height: 168, border: '1.5px solid rgba(112,196,140,0.55)', borderRadius: 10 }}>
            <span style={{ position: 'absolute', top: '50%', left: -10, right: -10, height: 1, background: 'rgba(112,196,140,0.4)' }} />
            <span style={{ position: 'absolute', left: '50%', top: -10, bottom: -10, width: 1, background: 'rgba(112,196,140,0.4)' }} />
          </div>
          <QRTag />
          <Corner pos="tl" /><Corner pos="tr" /><Corner pos="bl" /><Corner pos="br" />
          <div style={{ position: 'absolute', top: 14, left: 0, right: 0, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(250,248,243,0.5)' }}>Live camera · edge tracking</div>
        </div>

        <div style={{ textAlign: 'center', padding: '22px 34px 0' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 23, lineHeight: 1.25, color: 'var(--ink-900)' }}>
            {supplier ? <span>Scan a tag to <em style={{ fontStyle: 'italic' }}>attest</em> its next stage</span> : <span>Point at the QR on<br />your garment tag</span>}
          </div>
          {supplier ? <div style={{ marginTop: 8, fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-500)' }}>You're acting as <strong style={{ color: 'var(--ink-800)' }}>Atelier Nord</strong></div> : null}
        </div>

        <div style={{ marginTop: 'auto', padding: '0 20px 34px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Button variant="primary" size="lg" fullWidth onClick={onScan}
            leadingIcon={<svg width="19" height="19" viewBox="0 0 22 22" fill="none"><path d="M2 7V4a2 2 0 012-2h3M20 7V4a2 2 0 00-2-2h-3M2 15v3a2 2 0 002 2h3M20 15v3a2 2 0 01-2 2h-3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /><path d="M6 11h10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>}>
            {supplier ? 'Scan to attest' : 'Scan tag'}
          </Button>

          {/* progressive-disclosure manual-entry drawer — fallback for low-light / wrinkled fabric */}
          <div style={{ border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)', overflow: 'hidden' }}>
            <button onClick={() => setManualOpen((o) => !o)} aria-expanded={manualOpen} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', padding: '13px 15px', textAlign: 'left' }}>
              <svg width="17" height="17" viewBox="0 0 18 18" fill="none" style={{ color: 'var(--ink-500)', flex: '0 0 auto' }}><rect x="2.5" y="4" width="13" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3" /><path d="M5 7.5h.01M7.5 7.5h.01M10 7.5h.01M12.5 7.5h.01M5.5 10.5h7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
              <span style={{ flex: 1, fontFamily: 'var(--font-sans)', fontSize: 13.5, fontWeight: 600, color: 'var(--ink-800)' }}>Type Product / Blockchain Code Manually</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: 'var(--ink-400)', flex: '0 0 auto', transform: manualOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            {manualOpen ? (
              <div style={{ padding: '2px 15px 15px', borderTop: '1px solid var(--border-hairline)' }}>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-500)', margin: '12px 0 12px' }}>Find the printed passport ID on the garment's care label.</div>
                <Input label="Product / blockchain code" mono placeholder="DPP·TT–·········" value={code} onChange={(e) => setCode(e.target.value)} style={{ marginBottom: 14 }} />
                <Button variant="primary" fullWidth disabled={code.trim().length < 4} onClick={() => { setManualOpen(false); setCode(''); onManual(); }}>Resolve passport</Button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <Sheet open={sheet === 'account'} onClose={() => setSheet(null)}>
        <AccountSheet account={account}
          onSignIn={(a) => { saveAccount(a); setAccount(a); setSheet(null); }}
          onSignOut={() => { saveAccount(null); setAccount(null); setSheet(null); if (onSignOut) onSignOut(); }} />
      </Sheet>

      <Sheet open={sheet === 'explain'} onClose={() => setSheet(null)}>
        <div style={{ marginBottom: 14 }}><Badge tone="info">Garment Passport</Badge></div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--ink-900)', lineHeight: 1.15, marginBottom: 12 }}>A garment's whole story, in one scan.</div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14.5, color: 'var(--ink-700)', lineHeight: 1.6, marginBottom: 18 }}>
          One scan shows what we've <strong>Checked</strong>, what a brand <strong>told us</strong>, and what's <strong>not yet</strong> known. Gaps are shown, never hidden.
        </div>
        <Button variant="primary" fullWidth onClick={() => setSheet(null)}>Got it</Button>
      </Sheet>
    </React.Fragment>
  );
}

/* ============================ C2 Scanning ============================ */

function Scanning({ onCancel }) {
  return (
    <React.Fragment>
      <div style={{ padding: '10px 22px 6px', fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 500, color: 'var(--ink-900)' }}>ThreadTrace</div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ position: 'relative', margin: '8px 20px 0', height: 300, borderRadius: 'var(--radius-lg)', overflow: 'hidden',
          background: 'linear-gradient(165deg,#26313f,#171e28 60%,#12171f)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-md)' }}>
          <div style={{ position: 'relative', outline: '3px solid var(--madder-400)', outlineOffset: 6, borderRadius: 4 }}>
            <QRTag scale={0.9} />
          </div>
          <div className="tt-sweep" style={{ position: 'absolute', left: 18, right: 18, top: 24, height: 2, background: 'var(--madder-400)', boxShadow: '0 0 12px var(--madder-400)' }} />
          <div style={{ position: 'absolute', bottom: 12, left: 0, right: 0, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--leaf-200)' }}>QR locked on</div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <div className="tt-spin" style={{ width: 44, height: 44, borderRadius: '50%', border: '3px solid var(--paper-300)', borderTopColor: 'var(--indigo-500)' }} />
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink-900)', whiteSpace: 'nowrap' }}>Reading tag…</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-400)', letterSpacing: '0.06em' }}>resolving canonical record</div>
        </div>

        <div style={{ padding: '0 20px 22px' }}>
          <Button variant="secondary" fullWidth onClick={onCancel}>Cancel</Button>
        </div>
      </div>
    </React.Fragment>
  );
}

/* ============================ C0 Passport home ============================ */

/* ---- reference-structure home: ID card, name pill, hero w/ origin callout, badge strip, barcode ---- */

function VerifiedCheck({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" style={{ flex: '0 0 auto' }} aria-label="Authenticated">
      <path d="M10 1.2l2.1 1.6 2.6-.3 1 2.4 2.3 1.3-.5 2.6.5 2.6-2.3 1.3-1 2.4-2.6-.3-2.1 1.6-2.1-1.6-2.6.3-1-2.4-2.3-1.3.5-2.6-.5-2.6 2.3-1.3 1-2.4 2.6.3L10 1.2z" fill="var(--indigo-500)" />
      <path d="M6.7 10.3l2.1 2.1 4.5-4.8" stroke="var(--paper-50)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Barcode({ serial }) {
  const bars = [3, 1, 2, 1, 4, 1, 1, 2, 3, 1, 2, 4, 1, 1, 3, 2, 1, 1, 2, 3, 1, 4, 1, 2, 1, 3, 2, 1, 1, 2];
  let x = 0;
  const rects = [];
  bars.forEach((w, i) => { if (i % 2 === 0) rects.push(<rect key={i} x={x} y="0" width={w} height="26" fill="var(--ink-900)" />); x += w + 1; });
  return (
    <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
      border: '1px solid var(--border-hairline)', borderRadius: 10, background: 'var(--surface-raised)', padding: '8px 13px 6px' }}>
      <svg width={x} height="26" viewBox={`0 0 ${x} 26`} aria-hidden="true">{rects}</svg>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.12em', color: 'var(--ink-500)' }}>{serial || P.serial}</div>
    </div>
  );
}

const HOME_BADGES = [
  ['Organic fibre', <svg key="i" viewBox="0 0 20 20" fill="none"><path d="M4.5 15.5C4.5 8.5 9.5 4.5 16 4.5c0 6.5-4 11.5-11.5 11z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /><path d="M4.5 15.5c2.5-3.7 5.3-6.5 8.7-8.7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>],
  ['Woven, not bonded', <svg key="i" viewBox="0 0 20 20" fill="none"><path d="M3 6.5h14M3 10h14M3 13.5h14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /><path d="M6.5 3v14M10 3v14M13.5 3v14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeDasharray="2.4 2.4" /></svg>],
  ['Natural dye', <svg key="i" viewBox="0 0 20 20" fill="none"><path d="M10 2.6c3 3.9 5 6.4 5 8.9a5 5 0 11-10 0c0-2.5 2-5 5-8.9z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /><path d="M7.4 11.7a2.7 2.7 0 002.4 2.6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>],
  ['Repairable', <svg key="i" viewBox="0 0 20 20" fill="none"><path d="M4 16L14.6 5.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /><circle cx="15.4" cy="4.6" r="1.7" stroke="currentColor" strokeWidth="1.2" /><path d="M5 11.5l3.5 3.5M7.5 9l3.5 3.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeDasharray="1.6 2" /></svg>],
  ['Named suppliers', <svg key="i" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.2" stroke="currentColor" strokeWidth="1.3" /><path d="M10 2.8c-2.4 2-3.6 4.4-3.6 7.2s1.2 5.2 3.6 7.2c2.4-2 3.6-4.4 3.6-7.2S12.4 4.8 10 2.8z" stroke="currentColor" strokeWidth="1.1" /><path d="M3.2 10h13.6" stroke="currentColor" strokeWidth="1.1" /></svg>],
  ['Take-back ready', <svg key="i" viewBox="0 0 20 20" fill="none"><path d="M4.2 8.2a6 6 0 0110.4-1.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /><path d="M14.8 3.2v3.4h-3.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /><path d="M15.8 11.8a6 6 0 01-10.4 1.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /><path d="M5.2 16.8v-3.4h3.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>],
];

/* ---- passport index: every DPP data category, one accordion ---- */

const INDEX_ICONS = {
  fabric: <svg viewBox="0 0 20 20" fill="none"><path d="M9 3a6 6 0 106 6H9V3z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /><path d="M12 2.5A5.5 5.5 0 0117.5 8H12V2.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /><path d="M13 13h5M13 16h5M15.5 11.5v6" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" /></svg>,
  care: <svg viewBox="0 0 20 20" fill="none"><path d="M2.5 6h15L15.7 15.5H4.3L2.5 6z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /><path d="M5.5 10c1.5 1.2 4.5 1.2 6 0s3-1.2 3-1.2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" /></svg>,
  supply: <svg viewBox="0 0 20 20" fill="none"><circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.3" /><path d="M8 2.5C6.2 4 5.3 6 5.3 8S6.2 12 8 13.5C9.8 12 10.7 10 10.7 8S9.8 4 8 2.5z" stroke="currentColor" strokeWidth="1" /><path d="M12 12l5.5 5.5M14 17.5h3.5V14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  component: <svg viewBox="0 0 20 20" fill="none"><path d="M11 3h5.5v5.5L9 16a2 2 0 01-2.8 0L4 13.8a2 2 0 010-2.8L11 3z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /><circle cx="14" cy="6" r="1.1" stroke="currentColor" strokeWidth="1.1" /></svg>,
  social: <svg viewBox="0 0 20 20" fill="none"><circle cx="7" cy="6.5" r="2.5" stroke="currentColor" strokeWidth="1.3" /><path d="M2.5 15.5c0-2.5 2-4 4.5-4s4.5 1.5 4.5 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /><path d="M13 5.2a2.3 2.3 0 010 4.4M14.5 15.5c0-2.2-1.2-3.6-3-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>,
  sustainability: <svg viewBox="0 0 20 20" fill="none"><path d="M16.5 3.5C9 3 4 6.5 4 12.5c0 1.5.5 3 .5 3S12 16 15 10c1.5-3 1.5-6.5 1.5-6.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /><path d="M6 15C8 11 11 8.5 14 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>,
  footprint: <svg viewBox="0 0 20 20" fill="none"><path d="M8.5 12c1.3 0 2.2-1.4 2.2-3.6S10 3.8 8.1 3.8 6 5.5 6 7.7 7.2 12 8.5 12z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" /><path d="M6.6 13.7c0 1.6 3.2 1.6 3.2 0 0-.9-.5-1.4-.5-2.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /><circle cx="14" cy="6.5" r="1" stroke="currentColor" strokeWidth="1.1" /><circle cx="15.3" cy="9.2" r="0.9" stroke="currentColor" strokeWidth="1.1" /><circle cx="14.2" cy="11.8" r="0.8" stroke="currentColor" strokeWidth="1.1" /></svg>,
  circular: <svg viewBox="0 0 20 20" fill="none"><path d="M4.2 8.2a6 6 0 0110.4-1.8M15.8 11.8a6 6 0 01-10.4 1.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /><path d="M14.8 3.2v3.4h-3.4M5.2 16.8v-3.4h3.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  lca: <svg viewBox="0 0 20 20" fill="none"><path d="M3.5 16.5v-5M8 16.5V8M12.5 16.5v-6.5M17 16.5V5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /><path d="M3.5 8C6 5 9 3.5 12.5 3.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeDasharray="2 2.4" /></svg>,
  endoflife: <svg viewBox="0 0 20 20" fill="none"><path d="M10 3.5l2 3.4H8l2-3.4zM4.2 15.5l2-3.4 2 3.4h-4zM11.8 15.5l2-3.4 2 3.4h-4z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" /><path d="M7.5 8.5l-2 3M12.5 8.5l2 3M8.5 15.5h3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" /></svg>,
  feedback: <svg viewBox="0 0 20 20" fill="none"><path d="M3 4.5h14v9H9l-3.5 3v-3H3v-9z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /><path d="M6.5 8h7M6.5 10.5h4.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" /></svg>,
};

const INDEX_ROWS = [
  { id: 'fabric', label: 'Fabric composition', state: 'checked', tab: 'materials', tabLabel: 'Materials',
    farm: 'Certified organic cotton co-operative', location: 'Söke Valley, Türkiye · knit & finished in Portugal',
    body: '60% organic cotton, 38% recycled wool, corozo buttons. Every part has its own honesty mark.' },
  { id: 'care', label: 'Care instructions', state: 'checked', tab: 'materials', tabLabel: 'Materials',
    body: 'Wash cold 30°, no bleach, line dry, iron low. Written for natural indigo, confirmed by the brand’s care spec.' },
  { id: 'supply', label: 'Supply chain', state: 'told', tab: 'story', tabLabel: 'Story',
    body: 'Field to finished jacket: Guimarães, Biella, Oaxaca, Porto. Each stop wears its mark.' },
  { id: 'lca', label: 'Life cycle assessment', state: 'told', tab: 'circular', tabLabel: 'Circular',
    body: '12.4 kg CO₂e · 1,180 L water · 34 kWh. Brand-modelled, independent review in progress.' },
  { id: 'footprint', label: 'Footprint', state: 'told', tab: 'circular', tabLabel: 'Circular',
    body: 'The exact demand this garment places on nature. It focuses on environmental impact — a carbon footprint in tonnes of CO₂e, or an ecological footprint in biologically productive land.' },
  { id: 'social', label: 'Social impact', state: 'told', tab: 'circular', tabLabel: 'Circular',
    body: 'Living wages, capped voluntary overtime and audited health & safety at the Portugal atelier. Wage and safety data checked; the rest brand-reported.' },
  { id: 'sustainability', label: 'Sustainability index', state: 'told', tab: 'circular', tabLabel: 'Circular',
    body: 'Rain-fed cotton, recycled trims, renewable-share energy and higher resale value — the garment’s headline sustainability metrics.' },
  { id: 'component', label: 'Component traceability', state: 'checked', tab: 'materials', tabLabel: 'Materials',
    body: 'Named supplier and origin per component, down to buttons and thread. Gaps shown, never hidden.' },
];

function PassportIndex({ onGo }) {
  const [open, setOpen] = React.useState({});
  const toggle = (id) => setOpen((o) => ({ ...o, [id]: !o[id] }));
  return (
    <div>
      {INDEX_ROWS.map((r) => (
        <div key={r.id} style={{ borderBottom: '1px solid var(--border-hairline)' }}>
          <button onClick={() => toggle(r.id)} style={{ display: 'flex', alignItems: 'center', gap: 11, width: '100%', textAlign: 'left',
            padding: '13px 2px', border: 'none', background: 'transparent', cursor: 'pointer' }}>
            <span style={{ width: 20, height: 20, display: 'inline-flex', color: 'var(--ink-700)', flex: '0 0 auto' }}>{React.cloneElement(INDEX_ICONS[r.id], { width: 20, height: 20 })}</span>
            <span style={{ flex: 1, fontFamily: 'var(--font-sans)', fontSize: 14.5, fontWeight: 600, color: 'var(--ink-900)' }}>{r.label}</span>
            <HonestyMark state={r.state} size={16} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 16, color: 'var(--ink-400)', lineHeight: 1, width: 14, textAlign: 'center' }}>{open[r.id] ? '–' : '+'}</span>
          </button>
          {open[r.id] ? (
            <div style={{ padding: '0 2px 14px 31px' }}>
              {r.id === 'lca' ? <LcaCard /> : r.id === 'sustainability' ? <CircularInsights bare /> : r.id === 'footprint' ? (
                <React.Fragment>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-600)', lineHeight: 1.55, marginBottom: 12 }}>{r.body}</div>
                  <Footprint />
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-600)', lineHeight: 1.55 }}>{r.body}</div>
                  {r.farm || r.location ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 28px', marginTop: 12 }}>
                      {r.farm ? (
                        <div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-400)' }}>Farm</div>
                          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-800)', marginTop: 3 }}>{r.farm}</div>
                        </div>
                      ) : null}
                      {r.location ? (
                        <div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-400)' }}>Location</div>
                          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-800)', marginTop: 3 }}>{r.location}</div>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                  {r.tab !== 'materials' ? (
                    <button onClick={() => onGo(r.tab)} style={{ marginTop: 8, border: 'none', background: 'transparent', cursor: 'pointer', padding: 0,
                      fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em', color: 'var(--madder-500)' }}>Open {r.tabLabel} →</button>
                  ) : null}
                </React.Fragment>
              )}
            </div>
          ) : null}
        </div>
      ))}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 18, padding: '14px 0 2px' }}>
        <HonestyLabel state="checked">Checked</HonestyLabel>
        <HonestyLabel state="told">Told us</HonestyLabel>
        <HonestyLabel state="notyet">Not yet</HonestyLabel>
      </div>
    </div>
  );
}

function EcoRing({ pct, big, unit, label, sub, state }) {
  const r = 26, c = 2 * Math.PI * r, off = c * (1 - Math.min(pct, 100) / 100);
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      <div style={{ position: 'relative', width: 64, height: 64 }}>
        <svg width="64" height="64" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r={r} fill="none" stroke="var(--paper-300)" strokeWidth="5" />
          <circle cx="32" cy="32" r={r} fill="none" stroke="var(--leaf-600)" strokeWidth="5" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off} transform="rotate(-90 32 32)" />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: 'var(--ink-900)', lineHeight: 1 }}>{pct}%</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 7.5, letterSpacing: '0.04em', color: 'var(--ink-400)', marginTop: 2 }}>{sub}</span>
        </div>
      </div>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, fontWeight: 600, color: 'var(--ink-900)', marginTop: 8 }}>{big} <span style={{ fontWeight: 400, color: 'var(--ink-500)', fontSize: 10.5 }}>{unit}</span></div>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--ink-500)', lineHeight: 1.3, marginTop: 2 }}>{label}</div>
      {state ? <div style={{ marginTop: 6 }}><HonestyMark state={state} size={14} /></div> : null}
    </div>
  );
}

function SocialImpact() {
  const S = P.social;
  if (!S) return null;
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700, color: 'var(--ink-900)', marginBottom: 4 }}>Labour conditions</div>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-500)', lineHeight: 1.5, marginBottom: 12, textWrap: 'pretty' }}>{S.note}</div>
      <div style={{ border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)', overflow: 'hidden' }}>
        {S.labor.map((r, i) => (
          <div key={r.id} style={{ display: 'flex', gap: 12, padding: '13px 14px', borderTop: i ? '1px solid var(--border-hairline)' : 'none' }}>
            <div style={{ flex: '0 0 108px', display: 'flex', alignItems: 'flex-start', gap: 7 }}>
              <HonestyMark state={r.state} size={14} />
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, fontWeight: 600, color: 'var(--ink-800)', lineHeight: 1.3 }}>{r.label}</span>
            </div>
            <span style={{ flex: 1, fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-600)', lineHeight: 1.5, textWrap: 'pretty' }}>{r.value}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10, padding: '11px 14px', border: '1px dashed var(--paper-400)', borderRadius: 'var(--radius-md)', background: 'var(--paper-50)' }}>
        <HonestyMark state={S.audit.state} size={14} />
        <span style={{ flex: 1, fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-600)', lineHeight: 1.4 }}>Independent social audit</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-700)' }}>{S.audit.body} · grade {S.audit.grade} · {S.audit.date}</span>
      </div>
    </div>
  );
}

function SocialTab_unused() {
  return null;
}

function Footprint() {
  const L = P.lca;
  if (!L) return null;
  return (
    <div style={{ border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)', padding: '18px 14px 18px' }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
        {L.rows.map((r) => <EcoRing key={r.label} pct={r.ring} big={r.big} unit={r.unit} label={r.label} sub={r.ringLabel} state={r.state} />)}
      </div>
    </div>
  );
}

function CustomerFeedback({ onGo }) {
  const rv = P.reviews;
  if (!rv) return null;
  return (
    <button onClick={() => onGo('story')} style={{ display: 'block', width: '100%', textAlign: 'left', cursor: 'pointer', border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)', padding: '16px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <div style={{ textAlign: 'center', flex: '0 0 auto' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 500, letterSpacing: '-0.02em', color: 'var(--ink-900)', lineHeight: 1 }}>{rv.rating}</div>
          <div style={{ display: 'flex', gap: 2, justifyContent: 'center', marginTop: 5, color: 'var(--ochre-500)' }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <svg key={i} width="11" height="11" viewBox="0 0 12 12" fill="currentColor"><path d="M6 .8l1.5 3.2 3.5.4-2.6 2.4.7 3.5L6 9l-3.1 1.7.7-3.5L1 4.4l3.5-.4z" /></svg>
            ))}
          </div>
        </div>
        <div style={{ width: 1, alignSelf: 'stretch', background: 'var(--border-hairline)' }}></div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 500, color: 'var(--ink-900)', lineHeight: 1 }}>{rv.recommend}</div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-600)', lineHeight: 1.45, marginTop: 4 }}>of owners recommend it, from {rv.count} verified reviews.</div>
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 18, color: 'var(--ink-400)', flex: '0 0 auto' }}>→</span>
      </div>
    </button>
  );
}

function HomeTab({ onClaim, onTryOn, onGoVault, onGo, onOpen, onScan }) {
  const batchChars = String(P.batch).split('');
  const [sub, setSub] = React.useState('wardrobe');
  return (
    <div style={{ padding: '16px 16px 28px' }}>
      {sub === 'wardrobe' ? <MyWardrobe onOpen={(g) => onOpen(g)} onScan={onScan} /> : (
      <React.Fragment>
      <button onClick={() => setSub('wardrobe')} aria-label="Back to wardrobe" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, border: 'none', background: 'transparent', cursor: 'pointer', padding: '0 0 12px', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em', color: 'var(--ink-500)' }}>
        <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M12 4l-6 6 6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>Wardrobe
      </button>
      {/* roundel + authenticated ID card (On-chain folded in) */}
      <div style={{ display: 'flex', alignItems: 'stretch', gap: 12, marginBottom: 12 }}>
        <div style={{ width: 92, borderRadius: '50%', aspectRatio: '1', alignSelf: 'center', background: 'var(--ink-900)', flex: '0 0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={(window.__resources && window.__resources.logoMark) || "../assets/logo-mark.svg"} width="38" height="38" style={{ filter: 'invert(1)' }} alt="ThreadTrace" />
        </div>
        <div style={{ flex: 1, border: '1px solid var(--border-hairline)', borderRadius: 14, background: 'var(--surface-raised)', padding: '12px 14px', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <div style={{ flex: 1, fontFamily: 'var(--font-sans)', fontSize: 9.5, lineHeight: 1.45, color: 'var(--ink-500)' }}>
              This passport is authenticated. The ID below is permanently attributed to this garment and cannot be changed.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5, flex: '0 0 auto' }}>
              <VerifiedCheck size={22} />
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-mono)', fontSize: 8.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--leaf-600)' }}><VaultShield size={11} color="var(--leaf-600)" />On-chain</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 14, marginTop: 9 }}>
            {batchChars.map((c, i) => (
              <span key={i} style={{ width: 22, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 17, color: 'var(--ink-900)',
                borderBottom: '1.5px solid var(--ink-300)', paddingBottom: 2 }}>{c}</span>
            ))}
            <span style={{ alignSelf: 'flex-end', fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.1em', color: 'var(--ink-400)', paddingBottom: 3 }}>BATCH N°</span>
          </div>
        </div>
      </div>

      {/* name pill */}
      <div style={{ border: '1px solid var(--border-hairline)', borderRadius: 999, background: 'var(--surface-raised)', padding: '9px 16px',
        textAlign: 'center', fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, color: 'var(--ink-900)', marginBottom: 12 }}>
        {P.brand} · {P.name} N° {P.batch}
      </div>

      {/* hero image with origin callout */}
      <div style={{ position: 'relative', width: '100%', height: 320, borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border-hairline)', marginBottom: 12 }}>
        <image-slot id="product-hero" shape="rect" placeholder="Drop your product photo here"></image-slot>
        <div style={{ position: 'absolute', top: 12, left: 12, right: 12, display: 'flex', alignItems: 'center', gap: 10, pointerEvents: 'none' }}>
          <span style={{ border: '1px solid var(--border-hairline)', borderRadius: 999, background: 'var(--surface-raised)', padding: '5px 16px',
            fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--ink-800)' }}>Origin</span>
          <span style={{ flex: 1, borderTop: '1.5px dashed var(--ink-300)' }}></span>
          <span style={{ borderRadius: 999, background: 'var(--ink-900)', color: 'var(--paper-50)', padding: '5px 12px',
            fontFamily: 'var(--font-mono)', fontSize: 11.5, fontWeight: 600, letterSpacing: '0.06em' }} title="Assembled in Portugal">PT</span>
        </div>
      </div>

      {/* badge strip */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 14px', marginBottom: 12,
        borderTop: '1px solid var(--border-hairline)', borderBottom: '1px solid var(--border-hairline)' }}>
        {HOME_BADGES.map(([label, icon]) => (
          <span key={label} title={label} style={{ width: 32, height: 32, display: 'inline-flex', color: 'var(--ink-700)' }}>
            {React.cloneElement(icon, { width: 32, height: 32 })}
          </span>
        ))}
      </div>

      {/* claim + barcode */}
      <div style={{ display: 'flex', alignItems: 'stretch', gap: 12, marginBottom: 6 }}>
        <button onClick={onClaim} style={{ flex: 1, padding: '13px 16px', border: 'none', cursor: 'pointer',
          borderRadius: 999, background: 'var(--madder-500)', color: 'var(--paper-50)',
          fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--madder-600)'} onMouseLeave={(e) => e.currentTarget.style.background = 'var(--madder-500)'}>
          Claim ownership
        </button>
        <Barcode />
      </div>

      <div style={{ padding: '0 2px' }}>
        {/* try on */}
        <button onClick={onTryOn} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', marginTop: 8, padding: '12px 16px',
          border: '1px solid var(--paper-400)', cursor: 'pointer', borderRadius: 999, background: 'transparent', color: 'var(--ink-800)',
          fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 5V3.5A1.5 1.5 0 013.5 2H5M11 2h1.5A1.5 1.5 0 0114 3.5V5M14 11v1.5a1.5 1.5 0 01-1.5 1.5H11M5 14H3.5A1.5 1.5 0 012 12.5V11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /><circle cx="8" cy="6.6" r="1.8" stroke="currentColor" strokeWidth="1.3" /><path d="M5.4 11.4c.6-1.4 1.6-2.1 2.6-2.1s2 .7 2.6 2.1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
          Try on
        </button>

        {/* passport index */}
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 16.5, fontWeight: 700, color: 'var(--ink-900)', margin: '24px 0 2px' }}>What’s in this passport</div>
        <PassportIndex onGo={onGo} />

        {/* DPP compliance checklist */}
        <div style={{ border: '1px solid var(--border-hairline)', borderRadius: 14, background: 'var(--surface-card)', padding: '16px 16px', marginTop: 24 }}>
          <ComplianceChecklist mode="consumer" />
        </div>

        {/* customer feedback */}
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 16.5, fontWeight: 700, color: 'var(--ink-900)', margin: '24px 0 10px' }}>Customer feedback</div>
        <CustomerFeedback onGo={onGo} />

        {/* story teaser */}
        <button onClick={() => onGo('story')} style={{ display: 'block', width: '100%', textAlign: 'left', cursor: 'pointer', border: '1px solid var(--border-hairline)', borderRadius: 14, background: 'var(--surface-card)', padding: '16px 16px', marginTop: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 6 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-400)' }}>Story</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-400)' }}>{P.storyChapters.length} chapters · community</span>
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--ink-900)', lineHeight: 1.2, marginBottom: 5 }}>Where it came from, and who’s wearing it now</div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-600)', lineHeight: 1.5, textWrap: 'pretty' }}>{P.storyChapters[0].body}</div>
          <span style={{ display: 'inline-block', marginTop: 10, fontFamily: 'var(--font-sans)', fontSize: 13.5, fontWeight: 600, color: 'var(--indigo-500)' }}>Read the story &amp; join the discussion →</span>
        </button>

        <button onClick={onGoVault} style={{ display: 'flex', alignItems: 'center', gap: 8, border: 'none', background: 'transparent', cursor: 'pointer', padding: '14px 0 0', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em', color: 'var(--ink-400)' }}>
          <VaultShield size={13} color="var(--leaf-600)" />
          Provenance secured · view vault
        </button>
      </div>
      </React.Fragment>
      )}
    </div>
  );
}

/* ============================ consumer account (tester login) ============================ */

const TT_ACCOUNT_KEY = 'tt-consumer-account';
const TT_CLAIM_KEY = 'tt-consumer-claim';
function loadAccount() { try { return JSON.parse(localStorage.getItem(TT_ACCOUNT_KEY)); } catch (e) { return null; } }
function saveAccount(a) { try { if (a) localStorage.setItem(TT_ACCOUNT_KEY, JSON.stringify(a)); else localStorage.removeItem(TT_ACCOUNT_KEY); } catch (e) {} }
function loadClaim() { try { return JSON.parse(localStorage.getItem(TT_CLAIM_KEY)); } catch (e) { return null; } }
function saveClaim(c) { try { if (c) localStorage.setItem(TT_CLAIM_KEY, JSON.stringify(c)); else localStorage.removeItem(TT_CLAIM_KEY); } catch (e) {} }

const ACCT_SVG = { width: 26, height: 26, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true', focusable: 'false' };
const ACCT_ICON = {
  user: <svg {...ACCT_SVG}><circle cx="12" cy="8" r="3.4" /><path d="M5 20c1.2-3.4 4-5 7-5s5.8 1.6 7 5" /></svg>,
  tag: <svg {...ACCT_SVG}><path d="M4 12.5V5.6A1.6 1.6 0 015.6 4h6.9L20 11.5a1.6 1.6 0 010 2.3l-6.2 6.2a1.6 1.6 0 01-2.3 0L4 12.5z" /><circle cx="8.2" cy="8.2" r="1.2" /></svg>,
  transfer: <svg {...ACCT_SVG}><path d="M4 9h13m0 0l-3.2-3.2M17 9l-3.2 3.2" /><path d="M20 15H7m0 0l3.2-3.2M7 15l3.2 3.2" /></svg>,
  bell: <svg {...ACCT_SVG}><path d="M12 4a5 5 0 00-5 5v2.8L5.5 15h13L17 11.8V9a5 5 0 00-5-5z" /><path d="M10 19a2 2 0 004 0" /></svg>,
  globe: <svg {...ACCT_SVG}><circle cx="12" cy="12" r="8.2" /><path d="M3.8 12h16.4" /><path d="M12 3.8c2.4 2 2.4 14.4 0 16.4M12 3.8c-2.4 2-2.4 14.4 0 16.4" /></svg>,
  access: <svg {...ACCT_SVG}><circle cx="12" cy="4.6" r="1.7" /><path d="M4 8.4h16" /><path d="M12 8.4v6m0 0l-3 6m3-6l3 6" /></svg>,
  eyeOff: <svg {...ACCT_SVG}><path d="M3 3l18 18" /><path d="M10.6 10.7a2 2 0 002.7 2.8" /><path d="M6.6 6.7C4.7 7.9 3 9.8 2 12c1.8 4 5.5 6 10 6 1.5 0 2.9-.3 4.2-.8" /><path d="M9.9 5.2A9.9 9.9 0 0112 5c4.5 0 8.2 2 10 6a13 13 0 01-2.4 3.3" /></svg>,
  doc: <svg {...ACCT_SVG}><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 8h6M9 12h6M9 16h4" /></svg>,
  trash: <svg {...ACCT_SVG}><path d="M4 7h16" /><path d="M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2" /><path d="M6.5 7l.9 13a1 1 0 001 .9h7.2a1 1 0 001-.9l.9-13" /></svg>,
  signOut: <svg {...ACCT_SVG}><path d="M10 4H6a2 2 0 00-2 2v12a2 2 0 002 2h4" /><path d="M16 8l4 4-4 4" /><path d="M20 12H10" /></svg>,
  chat: <svg {...ACCT_SVG}><path d="M5 5h14a1 1 0 011 1v8a1 1 0 01-1 1H9l-4 4V6a1 1 0 011-1z" /></svg>,
};
function AcctCard({ icon, title, sub, tone, onClick }) {
  const danger = tone === 'danger';
  return (
    <button className="tt-acct-card" onClick={onClick} aria-label={title + '. ' + sub} style={{ textAlign: 'left', cursor: 'pointer', border: danger ? '1px solid var(--madder-400)' : '1px solid var(--border-hairline)', background: 'var(--surface-card)', borderRadius: 'var(--radius-lg)', padding: '15px 15px 16px', display: 'flex', flexDirection: 'column', minHeight: 120 }}>
      <span aria-hidden="true" style={{ color: danger ? 'var(--madder-600)' : 'var(--ink-700)', marginBottom: 14, display: 'inline-flex' }}>{icon}</span>
      <span style={{ fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 600, color: danger ? 'var(--madder-600)' : 'var(--ink-900)', marginBottom: 4 }}>{title}</span>
      <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, lineHeight: 1.45, color: 'var(--ink-700)', textWrap: 'pretty' }}>{sub}</span>
    </button>
  );
}
function AccountGrid({ account, onSignOut }) {
  const initials = account.name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  const grid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 };
  return (
    <div>
      <style>{`.tt-acct-card{transition:border-color .12s,box-shadow .12s}.tt-acct-card:hover{border-color:var(--ink-300)}.tt-acct-card:focus-visible{outline:3px solid var(--indigo-500);outline-offset:2px;border-color:var(--indigo-500)}`}</style>
      <h2 style={{ textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, color: 'var(--ink-900)', margin: '0 0 14px' }}>My Account</h2>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, marginBottom: 22 }}>
        <span aria-hidden="true" style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--indigo-500)', color: 'var(--paper-50)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 18 }}>{initials}</span>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 600, color: 'var(--ink-900)' }}>{account.name}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-600, var(--ink-700))' }}>{account.email}</span>
      </div>
      <div style={grid} role="list">
        <AcctCard icon={ACCT_ICON.user} title="My details" sub="Name, email &amp; sign-in" />
        <AcctCard icon={ACCT_ICON.tag} title="My garments" sub="Passports you keep" />
        <AcctCard icon={ACCT_ICON.transfer} title="Ownership" sub="Claims &amp; hand-offs" />
        <AcctCard icon={ACCT_ICON.bell} title="Notifications" sub="Care &amp; recall alerts" />
      </div>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 400, color: 'var(--ink-900)', margin: '24px 0 12px' }}>Settings</h3>
      <div style={grid} role="list">
        <AcctCard icon={ACCT_ICON.globe} title="Language &amp; Region" sub="Set where you shop" />
        <AcctCard icon={ACCT_ICON.access} title="Accessibility" sub="Adjust text and contrast" />
        <AcctCard icon={ACCT_ICON.eyeOff} title="Privacy Notice" sub="How your data travels" />
        <AcctCard icon={ACCT_ICON.doc} title="Terms &amp; Conditions" sub="Read the legal detail" />
        <AcctCard icon={ACCT_ICON.signOut} title="Sign out" sub="Sign out of this device" onClick={onSignOut} />
        <AcctCard icon={ACCT_ICON.chat} title="Contact Us" sub="Reach the ThreadTrace team" />
      </div>
      <div style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-400)', marginTop: 20 }}>ThreadTrace · Keeper v1.0</div>
    </div>
  );
}

function AccountSheet({ account, onSignIn, onSignOut }) {
  const [step, setStep] = React.useState('form'); // form | verify
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [sentCode, setSentCode] = React.useState('');
  const [typed, setTyped] = React.useState('');
  const [err, setErr] = React.useState(null);
  if (account) {
    return <AccountGrid account={account} onSignOut={onSignOut} />;
  }
  const submit = () => {
    if (!name.trim()) { setErr('Please enter your name.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setErr('Please enter a valid email.'); return; }
    setSentCode(String(Math.floor(100000 + Math.random() * 900000)));
    setErr(null); setTyped(''); setStep('verify');
  };
  const confirm = () => {
    if (typed.trim() !== sentCode) { setErr('That code does not match. Check the note below.'); return; }
    onSignIn({ name: name.trim(), email: email.trim().toLowerCase(), since: new Date().toISOString().slice(0, 10) });
  };
  if (step === 'verify') {
    return (
      <div>
        <div style={{ marginBottom: 12, fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-400)' }}>Check your email</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink-900)', marginBottom: 8 }}>Enter your code</div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13.5, color: 'var(--ink-500)', lineHeight: 1.6, marginBottom: 16 }}>
          We sent a six-digit code to <span style={{ fontWeight: 600, color: 'var(--ink-800)' }}>{email.trim()}</span>.
        </div>
        <Input label="Verification code" mono placeholder="000000" value={typed}
          onChange={(e) => { setTyped(e.target.value.replace(/\D/g, '').slice(0, 6)); setErr(null); }}
          onKeyDown={(e) => { if (e.key === 'Enter') confirm(); }} style={{ marginBottom: err ? 8 : 14 }} />
        {err ? <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--madder-600)', marginBottom: 12 }}>{err}</div> : null}
        <Button variant="primary" fullWidth onClick={confirm}>Verify &amp; sign in</Button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14, padding: '10px 12px', border: '1px dashed var(--paper-400)', borderRadius: 'var(--radius-sm)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-400)', flex: '0 0 auto' }}>Test note</span>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--ink-500)' }}>No email is really sent — your code is <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--ink-800)' }}>{sentCode}</span></span>
        </div>
        <button onClick={() => { setStep('form'); setErr(null); }} style={{ marginTop: 12, border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em', color: 'var(--ink-400)' }}>← Change email</button>
      </div>
    );
  }
  return (
    <div>
      <div style={{ marginBottom: 12, fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-400)' }}>Sign in</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink-900)', marginBottom: 8 }}>Keep this jacket's story with you</div>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13.5, color: 'var(--ink-500)', lineHeight: 1.6, marginBottom: 18 }}>
        No password. Your email just ties your ownership and notes to you.
      </div>
      <Input label="Name" placeholder="Samantha Chan" value={name} onChange={(e) => { setName(e.target.value); setErr(null); }} style={{ marginBottom: 12 }} />
      <Input label="Email" placeholder="you@example.com" value={email} onChange={(e) => { setEmail(e.target.value); setErr(null); }} onKeyDown={(e) => { if (e.key === 'Enter') submit(); }} style={{ marginBottom: err ? 8 : 16 }} />
      {err ? <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--madder-600)', marginBottom: 12 }}>{err}</div> : null}
      <Button variant="primary" fullWidth onClick={submit}>Continue</Button>
    </div>
  );
}

function ClaimSheet({ onDone, account }) {
  const [step, setStep] = React.useState('code');
  const [code, setCode] = React.useState('');
  if (step === 'done') {
    return (
      <div>
        <div style={{ marginBottom: 12, fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--leaf-600)' }}>Claim complete</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 21, color: 'var(--ink-900)', marginBottom: 8 }}>You are the keeper now{account ? `, ${account.name.split(' ')[0]}` : ''}</div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--ink-600)', lineHeight: 1.6, marginBottom: 16 }}>
          The vault lists you as the current owner. The jacket's history, care record and story now travel with you.
        </div>
        <Button variant="primary" fullWidth onClick={onDone}>Done</Button>
      </div>
    );
  }
  return (
    <div>
      <div style={{ marginBottom: 12, fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-400)' }}>Claim ownership</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 21, color: 'var(--ink-900)', marginBottom: 8 }}>Make this passport yours</div>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--ink-600)', lineHeight: 1.6, marginBottom: 16 }}>
        Bought it new? Claim straight away. Bought it second hand? Enter the one-time hand-off code from the seller.
      </div>
      {account ? (
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-500)', marginBottom: 14 }}>
          Claiming as <span style={{ fontWeight: 600, color: 'var(--ink-800)' }}>{account.name}</span> · {account.email}
        </div>
      ) : null}
      <Input label="Hand-off code (second hand only)" mono placeholder="TT-HANDOFF-…" value={code} onChange={(e) => setCode(e.target.value)} style={{ marginBottom: 16 }} />
      <Button variant="primary" fullWidth onClick={() => { setStep('done'); if (account) saveClaim({ name: account.name, email: account.email, date: new Date().toISOString().slice(0, 10) }); }}>Claim ownership</Button>
    </div>
  );
}

/* ============================ passport top nav ============================ */

function TabScroller({ tabs, tab, onTab }) {
  const rowRef = React.useRef(null);
  const btnRefs = React.useRef({});
  React.useEffect(() => {
    const row = rowRef.current, btn = btnRefs.current[tab];
    if (!row || !btn) return;
    const left = btn.offsetLeft, right = left + btn.offsetWidth;
    if (right > row.scrollLeft + row.clientWidth) row.scrollTo({ left: right - row.clientWidth + 12, behavior: 'smooth' });
    else if (left < row.scrollLeft) row.scrollTo({ left: Math.max(0, left - 12), behavior: 'smooth' });
  }, [tab]);
  return (
    <div ref={rowRef} className="tt-tabrow" onWheel={(e) => { if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) { rowRef.current.scrollLeft += e.deltaY; } }} style={{ display: 'flex', gap: 10, marginLeft: 2, overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none',
      WebkitOverflowScrolling: 'touch', flex: 1, minWidth: 0, paddingRight: 14, WebkitMaskImage: 'linear-gradient(to right, #000 calc(100% - 18px), transparent)', maskImage: 'linear-gradient(to right, #000 calc(100% - 18px), transparent)' }}>
      {tabs.map(([id, label]) => {
        const active = tab === id;
        return (
          <button key={id} ref={(el) => { btnRefs.current[id] = el; }} onClick={() => onTab(id)}
            style={{ border: 'none', background: 'transparent', cursor: 'pointer', whiteSpace: 'nowrap', flex: '0 0 auto',
            padding: '7px 4px', fontFamily: 'var(--font-sans)', fontSize: 13.5, fontWeight: active ? 700 : 400, letterSpacing: '0.01em',
            color: active ? 'var(--ink-900)' : 'var(--ink-400)' }}>{label}</button>
        );
      })}
    </div>
  );
}

function TopNav({ tab, onTab, onMenu, onRecycler, onAccount, signedIn }) {
  const tabs = [['home', 'Passport'], ['story', 'Community'], ['circular', 'Circular.'], ['vault', 'Vault']];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderBottom: '1px solid var(--border-hairline)', background: 'var(--surface-card)', flex: '0 0 auto' }}>
      <button onClick={onMenu} aria-label="Scan another tag" title="Scan" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flex: '0 0 auto', border: '1px solid var(--paper-400)', background: 'var(--surface-card)', cursor: 'pointer', borderRadius: 'var(--radius-pill)', padding: '5px 11px 5px 9px', color: 'var(--ink-800)' }}>
        <svg width="17" height="17" viewBox="0 0 20 20" fill="none"><path d="M2.5 6.5V4A1.5 1.5 0 014 2.5h2.5M13.5 2.5H16A1.5 1.5 0 0117.5 4v2.5M17.5 13.5V16a1.5 1.5 0 01-1.5 1.5h-2.5M6.5 17.5H4A1.5 1.5 0 012.5 16v-2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /><path d="M4 10h12" stroke="var(--madder-500)" strokeWidth="1.6" strokeLinecap="round" /></svg>
      </button>
      <TabScroller tabs={tabs} tab={tab} onTab={onTab} />
      {onAccount ? (
        <button onClick={onAccount} aria-label={signedIn ? 'Account (signed in)' : 'Sign in'} title={signedIn ? 'Account' : 'Sign in'}
          style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 4, color: signedIn ? 'var(--indigo-500)' : 'var(--ink-400)', display: 'inline-flex', flex: '0 0 auto', position: 'relative' }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="6.2" r="3" stroke="currentColor" strokeWidth="1.4" /><path d="M3.2 15.2c1-2.6 3.2-4 5.8-4s4.8 1.4 5.8 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
          {signedIn ? <span style={{ position: 'absolute', top: 3, right: 2, width: 7, height: 7, borderRadius: '50%', background: 'var(--leaf-600)', border: '1.5px solid var(--surface-card)' }}></span> : null}
        </button>
      ) : null}
      {onRecycler ? (
        <button onClick={onRecycler} aria-label="Recycler access" title="Recycler access" style={{ marginLeft: 4, border: 'none', background: 'transparent', cursor: 'pointer', padding: 4, color: 'var(--ink-300)', display: 'inline-flex', flex: '0 0 auto' }}>
          <svg width="17" height="17" viewBox="0 0 16 16" fill="none"><rect x="3.5" y="7" width="9" height="7" rx="1.2" stroke="currentColor" strokeWidth="1.3" /><path d="M5.5 7V4.8a2.5 2.5 0 015 0V7" stroke="currentColor" strokeWidth="1.3" /></svg>
        </button>
      ) : null}
    </div>
  );
}

/* ============================ C3 + C4 Materials tab ============================ */

function MaterialRow({ m, onOpen, mode }) {
  const sub = mode === 'expert' ? (m.jargon || m.statusLine) : (m.plain || `${m.pct} of garment`);
  return (
    <button onClick={() => onOpen(m)} style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left',
      padding: '14px 16px', border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)', cursor: 'pointer' }}
      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--paper-100)'} onMouseLeave={(e) => e.currentTarget.style.background = 'var(--surface-card)'}>
      <span style={{ flex: 1 }}>
        <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--ink-900)' }}>{m.name}</span>
        <span style={{ display: 'block', fontFamily: mode === 'expert' ? 'var(--font-mono)' : 'var(--font-sans)', fontSize: mode === 'expert' ? 11 : 12.5, color: 'var(--ink-500)' }}>{sub}</span>
      </span>
      <HonestyMark state={m.state} size={20} />
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: 'var(--ink-300)' }}><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </button>
  );
}

function MaterialsTab({ onEvidence, onViewAll, onTryOn, swatch = 'indigo', mode = 'plain', onMode }) {
  const [sort, setSort] = React.useState('honesty');
  const order = { checked: 0, told: 1, notyet: 2 };
  const rows = [...P.materials].sort((a, b) =>
    sort === 'honesty' ? order[a.state] - order[b.state] : b.pctNum - a.pctNum);
  return (
    <div style={{ padding: '20px 18px 28px' }}>
      {/* jargon toggle */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
        <JargonToggle value={mode} onChange={onMode} />
      </div>

      {/* honesty ring */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
        {mode === 'expert' ? <TieredHonestyRing size={176} sublabel="3-tier audit trail" /> : <HonestyRing percent={P.honestyPercent} sublabel={`${P.checkedCount} / ${P.totalClaims} checked`} size={176} />}
      </div>

      {/* garment identity */}
      <div style={{ display: 'flex', gap: 14, marginBottom: 16 }}>
        <div style={{ position: 'relative', width: 74, height: 88, borderRadius: 6, background: SWATCH[swatch] || SWATCH.indigo, flex: '0 0 auto', boxShadow: 'var(--shadow-sm)' }}><Weave radius={6} /></div>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase', color: 'var(--madder-500)' }}>{P.brand} · {P.season}</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 25, color: 'var(--ink-900)', lineHeight: 1.05, marginTop: 2 }}>{P.name}</div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-500)', marginTop: 4 }}>Batch {P.batch} · {P.maker}</div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-500)' }}>{P.checkedCount} of {P.totalClaims} claims Checked</div>
          {P.shopUrl ? <a href={P.shopUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 7, fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--indigo-600)', textDecoration: 'none' }}>{P.shopLabel || 'View product'}<svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M3.5 8.5L8.5 3.5M4.5 3.5h4v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg></a> : null}
        </div>
      </div>

      {/* legend */}
      <div style={{ display: 'flex', gap: 18, padding: '12px 0', marginBottom: 4 }}>
        <HonestyLabel state="checked">Checked</HonestyLabel>
        <HonestyLabel state="told">Told us</HonestyLabel>
        <HonestyLabel state="notyet">Not yet</HonestyLabel>
      </div>

      <Button variant="primary" fullWidth onClick={onViewAll} style={{ marginBottom: 12 }}>View all evidence</Button>

      {/* virtual try-on */}
      <button onClick={onTryOn} style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left', marginBottom: 22,
        padding: '13px 16px', border: '1px dashed var(--paper-400)', borderRadius: 'var(--radius-md)', background: 'transparent', cursor: 'pointer' }}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ color: 'var(--indigo-600)', flex: '0 0 auto' }}>
          <rect x="3" y="2.5" width="14" height="15" rx="2" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="10" cy="8" r="2.2" stroke="currentColor" strokeWidth="1.4" />
          <path d="M6 15c.8-2 2.4-3 4-3s3.2 1 4 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        <span style={{ flex: 1 }}>
          <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: 15.5, color: 'var(--ink-900)' }}>Virtual try-on</span>
          <span style={{ display: 'block', fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-500)' }}>See it on you before you buy or resell.</span>
        </span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: 'var(--ink-300)' }}><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>

      {/* Materials Hub */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--ink-900)' }}>Materials Hub</div>
        <button onClick={() => setSort(sort === 'honesty' ? 'composition' : 'honesty')} style={{ border: '1px solid var(--paper-400)', background: 'transparent', cursor: 'pointer',
          borderRadius: 'var(--radius-pill)', padding: '5px 12px', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-600)', letterSpacing: '0.04em' }}>
          Sort: {sort}
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {rows.map((m) => <MaterialRow key={m.id} m={m} onOpen={onEvidence} mode={mode} />)}
      </div>

      <CareInstructions />
    </div>
  );
}

/* ============================ care instructions + LCA ============================ */

const CARE_ICONS = {
  wash: <svg viewBox="0 0 22 22" fill="none"><path d="M2.5 6.5h17L17.4 17H4.6L2.5 6.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /><text x="11" y="14" textAnchor="middle" fontSize="6.5" fontFamily="monospace" fill="currentColor">30</text></svg>,
  nobleach: <svg viewBox="0 0 22 22" fill="none"><path d="M11 4.5L19.5 17.5h-17L11 4.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /><path d="M4.5 5l13 12.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>,
  linedry: <svg viewBox="0 0 22 22" fill="none"><rect x="4" y="4" width="14" height="14" rx="1" stroke="currentColor" strokeWidth="1.3" /><path d="M4.5 7.5c4 2.6 9 2.6 13 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>,
  ironlow: <svg viewBox="0 0 22 22" fill="none"><path d="M19 16H3c.7-4 4.2-6.5 8.2-6.5H16A3 3 0 0119 12.5V16z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /><circle cx="12.5" cy="13" r="1" fill="currentColor" /></svg>,
};

function CareInstructions() {
  const C = P.care;
  if (!C) return null;
  return (
    <div style={{ marginTop: 26 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--ink-900)' }}>Care instructions</div>
        <HonestyMark state={C.state} size={20} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {C.items.map((it) => (
          <div key={it.id} title={it.note} style={{ border: '1px solid var(--border-hairline)', borderRadius: 12, background: 'var(--surface-card)',
            padding: '12px 6px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, textAlign: 'center' }}>
            <span style={{ width: 26, height: 26, display: 'inline-flex', color: 'var(--ink-700)' }}>{React.cloneElement(CARE_ICONS[it.id], { width: 26, height: 26 })}</span>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 10.5, fontWeight: 600, color: 'var(--ink-800)', lineHeight: 1.25 }}>{it.label}</span>
          </div>
        ))}
      </div>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-500)', lineHeight: 1.5, marginTop: 10 }}>{C.aside}</div>
    </div>
  );
}

function LcaCard() {
  const L = P.lca;
  if (!L) return null;
  return (
    <div style={{ border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)', padding: '15px 16px', marginBottom: 22 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--ink-900)' }}>Life cycle assessment</div>
        <HonestyMark state={L.state} size={20} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', marginTop: 8 }}>
        {L.rows.map((r) => (
          <div key={r.label} style={{ padding: '7px 0', borderBottom: '1px solid var(--border-hairline)' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13.5, color: 'var(--ink-700)', whiteSpace: 'nowrap' }}>{r.label}</span>
              <span style={{ flex: 1, borderBottom: 'var(--leader)', transform: 'translateY(-3px)' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--ink-900)', whiteSpace: 'nowrap' }}>{r.value}</span>
            </div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11.5, color: 'var(--ink-400)', marginTop: 1 }}>{r.vs}</div>
          </div>
        ))}
      </div>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--ink-500)', lineHeight: 1.5, marginTop: 10 }}>{L.note}</div>
    </div>
  );
}

/* ============================ C5 Evidence drawer ============================ */

const KIND_LABEL = { cert: 'Certificate', report: 'Lab report', audit: 'Audit record', decl: 'Self-declaration' };

function DocThumb() {
  return (
    <div style={{ position: 'relative', width: 46, height: 46, borderRadius: 5, background: SWATCH.cotton, flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ color: 'var(--ink-500)' }}><path d="M5 2h7l3 3v13H5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /><path d="M12 2v3h3" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>
    </div>
  );
}

function MetaLeader({ label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, fontFamily: 'var(--font-mono)', fontSize: 11.5, padding: '3px 0' }}>
      <span style={{ color: 'var(--ink-400)', whiteSpace: 'nowrap' }}>{label}</span>
      <span style={{ flex: 1, borderBottom: 'var(--leader)', transform: 'translateY(-3px)' }} />
      <span style={{ color: 'var(--ink-800)', whiteSpace: 'nowrap', maxWidth: 190, overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</span>
    </div>
  );
}

function EvidenceItem({ item, depth }) {
  const forensic = depth === 'forensic';
  const expandable = depth !== 'summary';
  const [open, setOpen] = React.useState(forensic);
  React.useEffect(() => { setOpen(forensic); }, [forensic]);

  // summary depth: the original compact row
  if (!expandable) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)' }}>
        <DocThumb />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14.5, fontWeight: 600, color: 'var(--ink-900)' }}>{item.title}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-400)', letterSpacing: '0.04em', marginTop: 1 }}>{item.meta}</div>
        </div>
        <Button variant="secondary" size="sm">View</Button>
      </div>
    );
  }

  return (
    <div style={{ border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)', overflow: 'hidden' }}>
      <button onClick={() => setOpen((o) => !o)} style={{ display: 'flex', alignItems: 'center', gap: 14, width: '100%', textAlign: 'left', padding: '12px 14px', border: 'none', background: 'transparent', cursor: 'pointer' }}>
        <DocThumb />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14.5, fontWeight: 600, color: 'var(--ink-900)' }}>{item.title}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--indigo-700)', background: 'var(--indigo-100)', padding: '2px 6px', borderRadius: 'var(--radius-sm)' }}>{KIND_LABEL[item.kind] || 'Source'}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-400)' }}>{item.date || item.meta}</span>
          </div>
        </div>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: 'var(--ink-400)', flex: '0 0 auto', transform: open ? 'rotate(90deg)' : 'none', transition: 'transform var(--dur-fast) var(--ease-out)' }}><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>

      {open ? (
        <div style={{ padding: '4px 16px 16px', borderTop: '1px solid var(--border-hairline)' }}>
          {item.detail ? <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13.5, color: 'var(--ink-700)', lineHeight: 1.55, margin: '12px 0 10px' }}>{item.detail}</div> : null}
          <MetaLeader label="Document" value={item.docType || (KIND_LABEL[item.kind] || 'Source')} />
          {item.issuer ? <MetaLeader label="Issuer" value={item.issuer} /> : null}
          {item.date ? <MetaLeader label="Dated" value={item.date} /> : null}
          {item.method ? (
            <div style={{ marginTop: 10, padding: '10px 12px', background: 'var(--surface-sunken)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-400)', marginBottom: 3 }}>How this was checked</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-700)', lineHeight: 1.5 }}>{item.method}</div>
            </div>
          ) : null}
          {forensic && item.hash ? (
            <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--ink-400)', letterSpacing: '0.04em' }}>
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none" style={{ color: 'var(--leaf-600)' }}><path d="M7 1l5 2.2v3.3c0 3-2.1 5-5 6.3-2.9-1.3-5-3.3-5-6.3V3.2L7 1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" /></svg>
              record hash {item.hash} · anchored on write
            </div>
          ) : null}
          <div style={{ marginTop: 12 }}>
            <Button variant="secondary" size="sm" leadingIcon={<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 8s2.2-4 6-4 6 4 6 4-2.2 4-6 4-6-4-6-4z" stroke="currentColor" strokeWidth="1.3" /><circle cx="8" cy="8" r="1.6" stroke="currentColor" strokeWidth="1.3" /></svg>}>View document</Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function NoteOnTrust() {
  return (
    <div style={{ marginTop: 18, padding: '16px 18px', border: '1px dashed var(--paper-400)', borderRadius: 'var(--radius-md)', background: 'var(--paper-100)' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--ink-800)', marginBottom: 6 }}>Note on trust</div>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13.5, color: 'var(--ink-600)', lineHeight: 1.55 }}>
        The chain proves this record was not changed after it was written. It does not prove the original input was true.
        We show you the sources so you can judge for yourself.
      </div>
    </div>
  );
}

function EvidenceDrawer({ claim, onClose, onBack, depth = 'standard' }) {
  if (!claim) return null;
  const showProvenance = depth !== 'summary' && claim.supplier;
  return (
    <div className="tt-drawer-wrap" style={{ position: 'absolute', inset: 0, zIndex: 1200 }}>
      <div className="tt-drawer" style={{ position: 'absolute', inset: 0, background: 'var(--surface-page)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 18px', borderBottom: '1px solid var(--border-hairline)', background: 'var(--surface-card)' }}>
          <button onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--ink-700)', fontFamily: 'var(--font-sans)', fontSize: 14 }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M11 4L6 9l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>Back
          </button>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-400)' }}>{depth} view</span>
          <button onClick={onClose} aria-label="Close" style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--ink-400)', fontSize: 22, lineHeight: 1 }}>×</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '22px 18px 30px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase', color: 'var(--ink-400)' }}>Evidence</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 27, color: 'var(--ink-900)', lineHeight: 1.05, marginTop: 3 }}>{claim.name} {claim.pct !== '—' ? claim.pct : ''}</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13.5, color: 'var(--ink-500)', marginTop: 4 }}>{claim.statusLine}</div>
            </div>
            <HonestyMark state={claim.state} size={34} />
          </div>

          {showProvenance ? (
            <div style={{ marginTop: 20, padding: '14px 16px', border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-400)', marginBottom: 6 }}>Provenance</div>
              <MetaLeader label="Supplier" value={claim.supplier} />
              {claim.origin ? <MetaLeader label="Origin" value={claim.origin} /> : null}
              {claim.process ? <MetaLeader label="Process" value={claim.process} /> : null}
            </div>
          ) : null}

          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-400)', margin: '22px 0 10px' }}>{claim.evidence.length} {claim.evidence.length === 1 ? 'source' : 'sources'}{depth !== 'summary' ? ' · tap to expand' : ''}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {claim.evidence.length ? claim.evidence.map((it, i) => <EvidenceItem key={i} item={it} depth={depth} />) : (
              <div style={{ padding: '18px 16px', border: '1px dashed var(--paper-400)', borderRadius: 'var(--radius-md)', textAlign: 'center', fontFamily: 'var(--font-sans)', fontSize: 13.5, color: 'var(--ink-400)' }}>
                No sources on file yet. This claim is shown as <strong>Not yet</strong> because we have no evidence to back it.
              </div>
            )}
          </div>

          <NoteOnTrust />
        </div>
      </div>
    </div>
  );
}

/* ============================ C6 Story Book ============================ */

function StoryChapter({ c, last }) {
  return (
    <div style={{ display: 'flex', gap: 14 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 22, flex: '0 0 auto' }}>
        <HonestyMark state={c.state} size={20} title={c.state === 'checked' ? 'Checked' : c.state === 'told' ? 'Told us' : 'Not yet'} />
        {!last ? <div style={{ flex: 1, width: 0, marginTop: 4, borderLeft: '2px dashed var(--paper-400)' }} /> : null}
      </div>
      <div style={{ paddingBottom: last ? 0 : 22, flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: 'var(--tracking-serial)', color: 'var(--madder-500)' }}>{c.n} · {c.place}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--ink-400)', whiteSpace: 'nowrap' }}>{c.date}</span>
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 21, color: 'var(--ink-900)', lineHeight: 1.1, margin: '3px 0 5px' }}>{c.title}</div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13.5, color: 'var(--ink-600)', lineHeight: 1.55 }}>{c.body}</div>
        <HeritageMedia chapter={c} />
      </div>
    </div>
  );
}

function MobileCommunity() {
  const TOPICS = ['This garment', 'Care', 'Repair & reuse', 'Sustainability', 'Fashion'];
  const TOPIC_TONE = { 'This garment': 'var(--indigo-500)', 'Care': 'var(--leaf-600)', 'Repair & reuse': 'var(--ochre-600)', 'Sustainability': 'var(--leaf-600)', 'Fashion': 'var(--madder-500)' };
  const KEY = 'tt-community-' + P.slug;
  const [posts, setPosts] = React.useState(() => {
    try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.length) return s; } catch (e) {}
    return (P.community || []).slice();
  });
  const [name, setName] = React.useState('');
  const [topic, setTopic] = React.useState('This garment');
  const [body, setBody] = React.useState('');
  const [media, setMedia] = React.useState([]);
  const fileRef = React.useRef(null);
  const [filter, setFilter] = React.useState('All');
  const inp = { border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', padding: '9px 11px', fontFamily: 'var(--font-sans)', fontSize: 13.5, color: 'var(--ink-900)', background: 'var(--surface-page)' };
  function submit() {
    if (!body.trim()) return;
    const next = [{ author: name.trim() || 'You', date: 'just now', topic, body: body.trim() }, ...posts];
    setPosts(next); setBody('');
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch (e) {}
  }
  const shown = filter === 'All' ? posts : posts.filter((p) => p.topic === filter);
  const chip = (label, active, onClick) => (
    <button key={label} onClick={onClick} style={{ border: active ? '1px solid var(--ink-900)' : '1px solid var(--border-hairline)', background: active ? 'var(--ink-900)' : 'var(--surface-card)', color: active ? 'var(--paper-50)' : 'var(--ink-600)', cursor: 'pointer', borderRadius: 999, padding: '6px 12px', fontFamily: 'var(--font-sans)', fontSize: 12.5, fontWeight: active ? 600 : 500, whiteSpace: 'nowrap', flex: '0 0 auto' }}>{label}</button>
  );

  // Pinterest-style board: each post becomes a "pin" with a shared photo tile.
  const [compose, setCompose] = React.useState(false);
  const [liked, setLiked] = React.useState(() => { try { return JSON.parse(localStorage.getItem(KEY + '-likes')) || {}; } catch (e) { return {}; } });
  const TILE_TINTS = [SWATCH.indigo, SWATCH.leaf, SWATCH.ochre || 'var(--ochre-300)', SWATCH.madder || 'var(--madder-300)', 'var(--paper-300)', SWATCH.indigo];
  const hash = (s) => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); };
  const pinOf = (p, i) => { const h = hash((p.author || '') + (p.body || '') + i); return { tint: TILE_TINTS[h % TILE_TINTS.length], height: [148, 176, 204, 232, 164, 196][h % 6], baseLikes: 3 + (h % 44) }; };
  const toggleLike = (id) => setLiked((L) => { const n = { ...L, [id]: !L[id] }; try { localStorage.setItem(KEY + '-likes', JSON.stringify(n)); } catch (e) {} return n; });
  const cols = [[], []]; shown.forEach((p, i) => cols[i % 2].push([p, i]));

  const Pin = ([p, i]) => {
    const pin = pinOf(p, i); const id = (p.author || '') + '|' + i; const on = !!liked[id];
    return (
      <div key={id} style={{ breakInside: 'avoid', border: '1px solid var(--border-hairline)', borderRadius: 16, background: 'var(--surface-card)', overflow: 'hidden', boxShadow: 'var(--shadow-xs)' }}>
        <div style={{ position: 'relative', height: pin.height, background: pin.tint }}>
          <Weave radius={0} />
          {p.topic ? <span style={{ position: 'absolute', left: 8, top: 8, fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--paper-50)', background: 'rgba(20,18,15,0.55)', backdropFilter: 'blur(2px)', borderRadius: 999, padding: '2px 8px' }}>{p.topic}</span> : null}
          <button onClick={() => toggleLike(id)} aria-label="Save" style={{ position: 'absolute', right: 8, top: 8, border: 'none', cursor: 'pointer', borderRadius: 999, padding: '5px 8px', display: 'inline-flex', alignItems: 'center', gap: 4, background: on ? 'var(--madder-500)' : 'rgba(20,18,15,0.55)', color: 'var(--paper-50)', fontFamily: 'var(--font-sans)', fontSize: 11.5, fontWeight: 600, backdropFilter: 'blur(2px)' }}>
            <svg width="12" height="12" viewBox="0 0 16 16" fill={on ? 'currentColor' : 'none'}><path d="M8 13.5S2 9.8 2 5.9A3.4 3.4 0 018 3.9a3.4 3.4 0 016 2A6.6 6.6 0 018 13.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>
            {pin.baseLikes + (on ? 1 : 0)}
          </button>
        </div>
        <div style={{ padding: '10px 11px 12px' }}>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-800)', lineHeight: 1.45, textWrap: 'pretty' }}>{p.body}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 10 }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--surface-sunken)', border: '1px solid var(--border-hairline)', flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 11.5, color: 'var(--ink-600)' }}>{(p.author[0] || '?').toUpperCase()}</div>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 600, color: 'var(--ink-800)', flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.author}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--ink-400)', flex: '0 0 auto' }}>{p.date}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* share your story — Pinterest-style composer (always open) */}
      {(
        <div style={{ border: '1px solid var(--border-hairline)', borderRadius: 16, background: 'var(--surface-card)', padding: '14px 14px', marginBottom: 14 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" style={{ ...inp, flex: '0 0 42%', minWidth: 0 }} />
            <select value={topic} onChange={(e) => setTopic(e.target.value)} style={{ ...inp, flex: 1, minWidth: 0, cursor: 'pointer', color: 'var(--ink-700)' }}>
              {TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Tell your story about this garment…" rows={3} style={{ ...inp, width: '100%', boxSizing: 'border-box', resize: 'vertical', lineHeight: 1.5 }} />
          <input ref={fileRef} type="file" accept="image/*,video/*" multiple style={{ display: 'none' }} onChange={(e) => { const names = Array.from(e.target.files || []).map((f) => f.name); if (names.length) setMedia((m) => [...m, ...names]); }} />
          {media.length ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
              {media.map((m, mi) => (
                <span key={mi} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--ink-600)', background: 'var(--surface-sunken)', border: '1px solid var(--border-hairline)', borderRadius: 999, padding: '3px 6px 3px 8px', maxWidth: 130 }}>
                  <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m}</span>
                  <button onClick={() => setMedia((arr) => arr.filter((_, k) => k !== mi))} aria-label="Remove" style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--ink-400)', display: 'inline-flex', padding: 0 }}><svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg></button>
                </span>
              ))}
            </div>
          ) : null}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
            <button onClick={() => fileRef.current && fileRef.current.click()} aria-label="Add photo or video" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, border: '1px dashed var(--paper-400)', borderRadius: 10, background: 'var(--surface-card)', cursor: 'pointer', padding: '7px 11px', fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 600, color: 'var(--ink-700)' }}>
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
              Photo / video
            </button>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, flex: 1 }}>
              <Button variant="secondary" onClick={() => { setBody(''); setMedia([]); }}>Cancel</Button>
            <Button variant="primary" onClick={() => { submit(); setMedia([]); }}>Share</Button>
          </div>
          </div>
        </div>
      )}
      <div style={{ display: 'flex', gap: 7, overflowX: 'auto', marginBottom: 14, paddingBottom: 2, scrollbarWidth: 'none' }}>
        {chip('All', filter === 'All', () => setFilter('All'))}
        {TOPICS.map((t) => chip(t, filter === t, () => setFilter(t)))}
      </div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>{cols[0].map(Pin)}</div>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>{cols[1].map(Pin)}</div>
      </div>
    </div>
  );
}

/* ============================ Aesthetic Story Book (Community › The Making) ============================ */

const SB_ACCENT = { 4: 'var(--leaf-600)', 3: 'var(--ochre-600)', 2: 'var(--indigo-500)', 1: 'var(--madder-500)' };
function sbParseDur(s) { const [m, ss] = String(s).split(':').map(Number); return (m * 60) + (ss || 0); }
function sbFmt(sec) { const m = Math.floor(sec / 60), s = Math.floor(sec % 60); return m + ':' + String(s).padStart(2, '0'); }
// Simulated playback: the clip visibly runs to the end over ~7 real seconds.
function useSbClip(durStr) {
  const total = sbParseDur(durStr);
  const [playing, setPlaying] = React.useState(false);
  const [el, setEl] = React.useState(0);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!playing) return;
    ref.current = setInterval(() => {
      setEl((e) => { const nx = e + total / 70; if (nx >= total) { clearInterval(ref.current); setPlaying(false); return 0; } return nx; });
    }, 100);
    return () => clearInterval(ref.current);
  }, [playing, total]);
  return { playing, toggle: () => setPlaying((p) => !p), el, total, pct: total ? el / total : 0 };
}

function SbSpokenClip({ clip, accent }) {
  const { playing, toggle, el, pct } = useSbClip(clip.duration);
  const BARS = 42;
  return (
    <div style={{ border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)', padding: '12px 13px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
        <button onClick={toggle} aria-label={playing ? 'Pause' : 'Play'} style={{ width: 38, height: 38, borderRadius: '50%', border: 'none', cursor: 'pointer', background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
          {playing
            ? <svg width="12" height="12" viewBox="0 0 12 12"><rect x="2" y="1.5" width="3" height="9" rx="1" fill="var(--paper-50)" /><rect x="7" y="1.5" width="3" height="9" rx="1" fill="var(--paper-50)" /></svg>
            : <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2.5 1.3l8 4.7-8 4.7V1.3z" fill="var(--paper-50)" /></svg>}
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 14.5, color: 'var(--ink-900)', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{clip.title}</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 1.5, height: 20, marginTop: 7 }}>
            {Array.from({ length: BARS }).map((_, i) => {
              const on = i / BARS <= pct; const h = 4 + ((i * 53) % 14);
              return <span key={i} style={{ width: 2.5, height: Math.min(h, 20), borderRadius: 1, background: on ? accent : 'var(--paper-300)', transition: 'background .12s' }} />;
            })}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 9 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--ink-500)' }}>{clip.voice} · {clip.lang}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--ink-400)', fontVariantNumeric: 'tabular-nums' }}>{sbFmt(el)} / {clip.duration}</span>
      </div>
    </div>
  );
}

function SbArtisanVideo({ video, accent }) {
  const { playing, toggle, pct } = useSbClip(video.duration);
  return (
    <button onClick={toggle} style={{ position: 'relative', display: 'block', width: '100%', textAlign: 'left', border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', overflow: 'hidden', cursor: 'pointer', padding: 0, background: 'var(--ink-900)', aspectRatio: '16 / 9' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(135deg,#22272e 0 11px,#272d35 11px 22px)', opacity: playing ? 0.55 : 1, transition: 'opacity .3s' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 90% at 50% 30%, transparent 40%, rgba(0,0,0,0.45) 100%)' }} />
      <div style={{ position: 'absolute', top: 11, left: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: playing ? accent : 'var(--paper-300)', boxShadow: playing ? `0 0 0 3px color-mix(in srgb, ${accent} 30%, transparent)` : 'none' }} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--paper-200)' }}>{playing ? 'Playing' : 'Artisan fragment'}</span>
      </div>
      {!playing ? (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ width: 46, height: 46, borderRadius: '50%', background: 'rgba(255,255,255,0.14)', border: '1.5px solid rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(2px)' }}>
            <svg width="15" height="15" viewBox="0 0 15 15"><path d="M3.5 1.8l9.5 5.7-9.5 5.7V1.8z" fill="var(--paper-50)" /></svg>
          </span>
        </div>
      ) : null}
      <div style={{ position: 'absolute', left: 12, right: 12, bottom: 11 }}>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, fontWeight: 600, color: 'var(--paper-50)', marginBottom: 7, textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>{video.title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ flex: 1, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.25)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: (pct * 100) + '%', background: accent, transition: 'width .12s' }} />
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--paper-200)' }}>{video.duration}</span>
        </div>
      </div>
    </button>
  );
}

function SbBlueprint({ bp, accent }) {
  const [sel, setSel] = React.useState(0);
  return (
    <div style={{ border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--paper-100)', padding: '13px 14px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10, marginBottom: 13 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.09em', textTransform: 'uppercase', color: 'var(--ink-400)' }}>Blueprint · {bp.title}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-400)', whiteSpace: 'nowrap' }}>{bp.region}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 12 }}>
        {bp.steps.map((s, i) => {
          const on = i === sel; const done = i < sel;
          return (
            <React.Fragment key={i}>
              <button onClick={() => setSel(i)} style={{ flex: '0 0 auto', width: 66, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, border: 'none', background: 'transparent', cursor: 'pointer', padding: 0 }}>
                <span style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1.5px solid ${on || done ? accent : 'var(--paper-400)'}`, background: on ? accent : 'var(--surface-card)', color: on ? 'var(--paper-50)' : done ? accent : 'var(--ink-500)', fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, transition: 'all .15s' }}>{i + 1}</span>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: on ? 700 : 500, color: on ? 'var(--ink-900)' : 'var(--ink-500)', textAlign: 'center', lineHeight: 1.2 }}>{s.k}</span>
              </button>
              {i < bp.steps.length - 1 ? <span style={{ flex: 1, height: 1.5, background: i < sel ? accent : 'var(--paper-400)', marginTop: 13, transition: 'background .15s' }} /> : null}
            </React.Fragment>
          );
        })}
      </div>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-600)', lineHeight: 1.5, textWrap: 'pretty' }}>{bp.steps[sel].d}</div>
    </div>
  );
}

const SB_STATE_LABEL = { checked: 'Checked', told: 'Told us', notyet: 'Not yet' };
function StoryBook({ nodes }) {
  nodes = nodes || P.storyBook || [];
  if (!nodes.length) return <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-400)' }}>No story on file yet.</div>;
  return (
    <div>
      <div style={{ padding: '15px 16px', border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-sunken)', marginBottom: 20 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--madder-500)', marginBottom: 5 }}>Story book · Tier 4 → Tier 1</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--ink-900)', lineHeight: 1.25 }}>From a boll of cotton to the hoodie in your hands — with the voices, hands and blueprints behind each tier.</div>
      </div>
      {nodes.map((n, i) => {
        const accent = SB_ACCENT[n.num] || 'var(--indigo-500)';
        const last = i === nodes.length - 1;
        return (
          <div key={i} style={{ display: 'flex', gap: 14 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '0 0 auto', width: 28 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: accent, color: 'var(--paper-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, flex: '0 0 auto' }}>{n.num}</div>
              {!last ? <div style={{ width: 2, flex: 1, minHeight: 24, background: 'var(--paper-300)', marginTop: 5 }} /> : null}
            </div>
            <div style={{ flex: 1, minWidth: 0, paddingBottom: last ? 4 : 30 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: accent }}>{n.tier} · {n.stage}</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--ink-400)' }}><HonestyMark state={n.state} size={11} />{SB_STATE_LABEL[n.state]}</span>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 21, color: 'var(--ink-900)', lineHeight: 1.1, marginBottom: 4 }}>{n.title}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-500)', marginBottom: 9 }}>{n.place} · {n.region} · {n.date}</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13.5, color: 'var(--ink-600)', lineHeight: 1.55, textWrap: 'pretty', marginBottom: 12 }}>{n.body}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {n.audio ? <SbSpokenClip clip={n.audio} accent={accent} /> : null}
                {n.video ? <SbArtisanVideo video={n.video} accent={accent} /> : null}
                {n.blueprint ? <SbBlueprint bp={n.blueprint} accent={accent} /> : null}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StoryTab({ onSignIn, signedIn, onGo, showCommunity = true }) {
  const claim = loadClaim();
  const voices = claim ? [...P.communityVoices, { author: `${claim.name} (you)`, date: claim.date, body: 'Current keeper — story in progress.', you: true }] : P.communityVoices;
  const [sub, setSub] = React.useState(showCommunity ? 'community' : 'making');
  const seg = (id, label) => {
    const on = sub === id;
    return <button key={id} onClick={() => setSub(id)} style={{ flex: 1, border: 'none', cursor: 'pointer', borderRadius: 999, padding: '9px 10px', background: on ? 'var(--surface-card)' : 'transparent', boxShadow: on ? 'var(--shadow-xs)' : 'none', fontFamily: 'var(--font-sans)', fontSize: 13.5, fontWeight: on ? 700 : 500, color: on ? 'var(--ink-900)' : 'var(--ink-500)' }}>{label}</button>;
  };
  return (
    <div style={{ padding: '20px 18px 28px' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--ink-900)', margin: '0 0 4px' }}>Community</div>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-500)', lineHeight: 1.5, marginBottom: 14 }}>{sub === 'making' ? 'An aesthetic story book \u2014 follow this hoodie from raw fibre down to finished garment, tier by tier.' : 'Talk about this garment \u2014 or fashion & sustainability more broadly.'}</div>
      {showCommunity ? (
        <div style={{ display: 'flex', gap: 4, padding: 4, background: 'var(--surface-sunken)', borderRadius: 999, marginBottom: 18 }}>
          {seg('community', 'Discussion')}
          {seg('making', 'The Making')}
        </div>
      ) : null}
      {sub === 'community' ? <MobileCommunity /> : <StoryBook />}
    </div>
  );
}

/* ============================ C7 Circularity ============================ */

function CircFacet({ f, onAction }) {
  return (
    <button onClick={onAction} style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left',
      padding: '16px 16px', border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)', cursor: 'pointer' }}
      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--paper-100)'} onMouseLeave={(e) => e.currentTarget.style.background = 'var(--surface-card)'}>
      <span style={{ flex: 1 }}>
        <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--ink-900)' }}>{f.title}</span>
        <span style={{ display: 'block', fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-500)', marginTop: 2 }}>{f.sub}</span>
      </span>
      <HonestyMark state={f.state} size={20} />
    </button>
  );
}

function Lifecycle() {
  return (
    <div style={{ padding: '8px 4px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {P.lifecycle.map((s, i) => (
          <React.Fragment key={i}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '0 0 auto', width: 30 }}>
              <HonestyMark state={s.state === 'checked' ? 'checked' : 'notyet'} size={16} />
            </div>
            {i < P.lifecycle.length - 1 ? <div style={{ flex: 1, height: 2, borderTop: `2px dashed ${P.lifecycle[i + 1].state === 'checked' ? 'var(--leaf-400)' : 'var(--paper-400)'}` }} /> : null}
          </React.Fragment>
        ))}
      </div>
      <div style={{ display: 'flex', marginTop: 8 }}>
        {P.lifecycle.map((s, i) => (
          <div key={i} style={{ flex: i < P.lifecycle.length - 1 ? 1 : '0 0 auto', width: i === P.lifecycle.length - 1 ? 30 : 'auto' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-500)', letterSpacing: '0.02em', display: 'block', marginLeft: -4 }}>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CircularTab({ onRepair, onReturn, onResale, onTransfer, onCare }) {
  return (
    <div style={{ padding: '20px 18px 28px' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--ink-900)', marginBottom: 14 }}>Circularity Portal</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 22 }}>
        {P.circularity.map((f) => <CircFacet key={f.id} f={f} onAction={f.id === 'repair' ? onRepair : f.id === 'resale' ? onResale : f.id === 'recycle' ? onReturn : f.id === 'care' ? onCare : undefined} />)}
      </div>

      <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--ink-900)', marginBottom: 10 }}>Lifecycle &amp; ownership</div>
      <Lifecycle />

      {/* keeper rewards */}
      <KeeperRewards />
    </div>
  );
}

/* ============================ care portal ============================ */

const CIRC_STAT_ICONS = {
  water: <svg viewBox="0 0 20 20" fill="none"><path d="M10 2.5C10 2.5 4.5 8.5 4.5 12.5a5.5 5.5 0 0011 0C15.5 8.5 10 2.5 10 2.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg>,
  recycle: <svg viewBox="0 0 20 20" fill="none"><path d="M5.2 8.3l-1.8 3M8.3 3.6l1.7 3M14.6 8.4l1.8 3M10.9 16.4H14a1.6 1.6 0 001.4-2.4M9.1 16.4H6a1.6 1.6 0 01-1.4-2.4M7.4 6.6L9 3.9a1.6 1.6 0 012.8 0l1.6 2.7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  energy: <svg viewBox="0 0 20 20" fill="none"><path d="M11 2.5L4.5 11h4l-1 6.5L15 9h-4l1-6.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg>,
  leaf: <svg viewBox="0 0 20 20" fill="none"><path d="M16.5 3.5C9 3 4 6.5 4 12.5c0 1.5.5 3 .5 3S12 16 15 10c1.5-3 1.5-6.5 1.5-6.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /><path d="M6 15C8 11 11 8.5 14 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>,
  micro: <svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="11" r="5.5" stroke="currentColor" strokeWidth="1.3" /><path d="M10 5.5V2.5M4.5 6L6.5 8M15.5 6L13.5 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>,
  loop: <svg viewBox="0 0 20 20" fill="none"><path d="M4.2 8.2a6 6 0 0110.4-1.8M15.8 11.8a6 6 0 01-10.4 1.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /><path d="M14.8 3.2v3.4h-3.4M5.2 16.8v-3.4h3.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>,
};

function CircularInsights({ bare }) {
  const stats = P.circularStats || [];
  const [open, setOpen] = React.useState(true);
  const grid = (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'var(--border-hairline)', border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', overflow: 'hidden', margin: bare ? 0 : '14px 0 6px' }}>
      {stats.map((s, i) => (
        <div key={i} style={{ background: 'var(--surface-card)', padding: '16px 14px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 9 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 500, letterSpacing: '-0.02em', color: 'var(--ink-900)', lineHeight: 1 }}>{s.value}</span>
            <span style={{ width: 17, height: 17, color: 'var(--leaf-600)', display: 'inline-flex', flex: '0 0 auto' }}>{CIRC_STAT_ICONS[s.icon]}</span>
            <span style={{ marginLeft: 'auto' }}><HonestyMark state={s.state} size={15} /></span>
          </div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-600)', lineHeight: 1.5, textWrap: 'pretty' }}>{s.text}</div>
        </div>
      ))}
    </div>
  );
  if (bare) return grid;
  return (
    <div style={{ marginBottom: 22 }}>
      <button onClick={() => setOpen((o) => !o)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%',
        padding: '13px 2px', border: 'none', borderBottom: '1px solid var(--border-hairline)', background: 'transparent', cursor: 'pointer', textAlign: 'left' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-800)' }}>Sustainability index</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 15, color: 'var(--ink-400)', lineHeight: 1 }}>{open ? '–' : '+'}</span>
      </button>
      {open ? grid : null}
    </div>
  );
}

const CARE_SYMBOLS = {
  wash: <svg viewBox="0 0 24 24" fill="none"><path d="M3 8c3-2.2 4.5-2.2 6 0s3 2.2 6 0 4.5-2.2 6 0v9a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg>,
  nobleach: <svg viewBox="0 0 24 24" fill="none"><path d="M12 3l8 15H4L12 3z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /><path d="M6 6l12 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>,
  linedry: <svg viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.3" /><path d="M8 4v13M13 4v13" stroke="currentColor" strokeWidth="1.3" /></svg>,
  ironlow: <svg viewBox="0 0 24 24" fill="none"><path d="M4 15l1.5-5A2 2 0 017.4 8.6L18 8a2 2 0 012 2v3a2 2 0 01-2 2H4z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /><circle cx="12" cy="12" r="1" fill="currentColor" /></svg>,
};

function CareSheet({ onRepair }) {
  const C = P.care;
  return (
    <div>
      <div style={{ marginBottom: 12 }}><Badge tone="verified">Care portal</Badge></div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--ink-900)', lineHeight: 1.15, marginBottom: 8 }}>Care for it, sustainably.</div>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--ink-600)', lineHeight: 1.6, marginBottom: 22 }}>How you wash and keep a garment matters more than how it was made. Small habits keep clothes alive longer and cut their footprint.</div>

      {/* this garment's label */}
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700, color: 'var(--ink-900)', marginBottom: 4 }}>This garment’s label</div>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-500)', lineHeight: 1.5, marginBottom: 12 }}>{C.aside}</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 26 }}>
        {C.items.map((it) => (
          <div key={it.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 12px', border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)' }}>
            <span style={{ width: 22, height: 22, flex: '0 0 auto', color: 'var(--leaf-600)', display: 'inline-flex' }}>{CARE_SYMBOLS[it.id]}</span>
            <span style={{ minWidth: 0 }}>
              <span style={{ display: 'block', fontFamily: 'var(--font-sans)', fontSize: 12.5, fontWeight: 600, color: 'var(--ink-900)', lineHeight: 1.2 }}>{it.label}</span>
              <span style={{ display: 'block', fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--ink-500)', marginTop: 2, lineHeight: 1.35 }}>{it.note}</span>
            </span>
          </div>
        ))}
      </div>

      {/* general sustainable-care habits */}
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700, color: 'var(--ink-900)', marginBottom: 4 }}>Sustainable care habits</div>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-500)', lineHeight: 1.5, marginBottom: 12 }}>Works for anything in your wardrobe — not just this piece.</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 22 }}>
        {C.habits.map((h) => (
          <div key={h.id} style={{ padding: '14px 15px', border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10, marginBottom: 4 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--ink-900)' }}>{h.title}</span>
              <span style={{ flex: '0 0 auto', fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '0.03em', color: 'var(--leaf-600)', background: 'var(--leaf-100)', padding: '3px 8px', borderRadius: 'var(--radius-pill)' }}>{h.impact}</span>
            </div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-600)', lineHeight: 1.55, textWrap: 'pretty' }}>{h.body}</div>
          </div>
        ))}
      </div>

      {/* detergent note */}
      <div style={{ display: 'flex', gap: 10, padding: '13px 14px', border: '1px dashed var(--paper-400)', borderRadius: 'var(--radius-md)', background: 'var(--paper-50)', marginBottom: 22 }}>
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={{ color: 'var(--leaf-600)', flex: '0 0 auto', marginTop: 1 }}><path d="M7 2h6v3l2 3v8a2 2 0 01-2 2H7a2 2 0 01-2-2V8l2-3V2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /><path d="M7 11h6" stroke="currentColor" strokeWidth="1.3" /></svg>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-600)', lineHeight: 1.55 }}>{C.detergent}</span>
      </div>

      <Button variant="secondary" fullWidth onClick={onRepair}>Something needs mending? Find a repairer</Button>
    </div>
  );
}

/* ============================ resale market (peer-to-peer) ============================ */

function ResaleListingCard({ l, compact }) {
  const R = window.TT.resale;
  return (
    <div style={{ border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)', overflow: 'hidden' }}>
      <div style={{ position: 'relative', aspectRatio: compact ? '1 / 1' : '4 / 3', background: `linear-gradient(150deg, ${l.swatch}, color-mix(in oklab, ${l.swatch} 62%, #000))` }}>
        <Weave radius={0} opacity={0.16} />
        <image-slot id={'resale-' + l.id} shape="rect" placeholder={l.title}></image-slot>
        {l.verified ? (
          <span style={{ position: 'absolute', top: 7, left: 7, display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 7px', borderRadius: 'var(--radius-pill)', background: 'var(--paper-50)', boxShadow: 'var(--shadow-xs)' }}>
            <HonestyMark state="checked" size={11} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8.5, letterSpacing: '0.04em', color: 'var(--ink-700)' }}>PASSPORT</span>
          </span>
        ) : null}
        <span style={{ position: 'absolute', bottom: 7, right: 7, display: 'inline-flex', alignItems: 'center', gap: 3, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--paper-50)' }}>
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M6 10S1.5 7.2 1.5 4.3A2.3 2.3 0 016 3a2.3 2.3 0 014.5 1.3C10.5 7.2 6 10 6 10z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" /></svg>
          {l.likes}
        </span>
      </div>
      <div style={{ padding: '8px 10px 10px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-sans)', fontSize: 12.5, fontWeight: 600, color: 'var(--ink-900)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.title}</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--ink-900)' }}>{R.currency}{l.price}</span>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--ink-400)', marginTop: 3, letterSpacing: '0.02em' }}>Size {l.size} · {l.condition}</div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--ink-400)', marginTop: 2 }}>@{l.seller}</div>
      </div>
    </div>
  );
}

function ResaleSheet({ onDone }) {
  const R = window.TT.resale;
  const wardrobe = window.TT.wardrobe || [];
  const [pick, setPick] = React.useState(() => (wardrobe.find((w) => w.current) || wardrobe[0] || {}).id);
  const [cond, setCond] = React.useState('excellent');
  const [listed, setListed] = React.useState(false);
  const active = R.conditions.find((c) => c.id === cond) || R.conditions[0];
  const garment = wardrobe.find((w) => w.id === pick) || {};
  const retail = garment.retail || R.retailPrice;
  const price = Math.round(retail * active.mult);

  if (listed) {
    return (
      <div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '4px 0 8px' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--leaf-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7" stroke="var(--leaf-600)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink-900)', marginBottom: 8 }}>Listed on the market</div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--ink-600)', lineHeight: 1.6, marginBottom: 18 }}>
            {garment.name} is live at <strong style={{ color: 'var(--ink-900)' }}>{R.currency}{price}</strong>. When it sells, the passport transfers to the buyer automatically — the next owner inherits every verified claim.
          </div>
        </div>
        <Button variant="primary" fullWidth onClick={onDone}>Done</Button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 12 }}><Badge tone="info">Resale market</Badge></div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink-900)', marginBottom: 4 }}>List for resale</div>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13.5, color: 'var(--ink-600)', lineHeight: 1.55, marginBottom: 16 }}>Give it a second life. The passport travels with the garment, so its story never resets to zero.</div>

      {/* pick a garment from the wardrobe to list */}
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-400)', marginBottom: 8 }}>Choose a piece to sell</div>
      <div style={{ display: 'flex', gap: 9, overflowX: 'auto', paddingBottom: 4, marginBottom: 16, scrollbarWidth: 'none' }}>
        {wardrobe.map((w) => {
          const on = w.id === pick;
          return (
            <button key={w.id} onClick={() => setPick(w.id)} style={{ flex: '0 0 auto', width: 96, textAlign: 'left', cursor: 'pointer', padding: 6, border: `1.5px solid ${on ? 'var(--indigo-400)' : 'var(--border-hairline)'}`, background: on ? 'var(--indigo-100)' : 'var(--surface-card)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ display: 'block', width: '100%', aspectRatio: '1 / 1', borderRadius: 'var(--radius-sm)', marginBottom: 6, background: `linear-gradient(150deg, ${w.swatch}, color-mix(in oklab, ${w.swatch} 60%, #000))` }} />
              <span style={{ display: 'block', fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600, color: 'var(--ink-900)', lineHeight: 1.25, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{w.name}</span>
              <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--ink-400)', marginTop: 1 }}>{w.brand}</span>
            </button>
          );
        })}
      </div>

      {/* garment being listed */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 13px', border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)', marginBottom: 14 }}>
        <span style={{ width: 46, height: 46, flex: '0 0 auto', borderRadius: 'var(--radius-sm)', background: `linear-gradient(150deg, ${garment.swatch || 'var(--indigo-700)'}, color-mix(in oklab, ${garment.swatch || 'var(--indigo-700)'} 60%, #000))` }} />
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'block', fontFamily: 'var(--font-sans)', fontSize: 14.5, fontWeight: 600, color: 'var(--ink-900)' }}>{garment.name}</span>
          <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--ink-400)', marginTop: 2 }}>{garment.serial}</span>
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><HonestyMark state="checked" size={14} /><span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--leaf-600)' }}>{P.honestyPercent}%</span></span>
      </div>

      {/* condition */}
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-400)', marginBottom: 8 }}>Condition</div>
      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 16 }}>
        {R.conditions.map((c) => {
          const on = c.id === cond;
          return <button key={c.id} onClick={() => setCond(c.id)} style={{ border: `1.5px solid ${on ? 'var(--indigo-400)' : 'var(--paper-400)'}`, background: on ? 'var(--indigo-100)' : 'var(--surface-card)', color: on ? 'var(--indigo-700)' : 'var(--ink-500)', cursor: 'pointer', borderRadius: 'var(--radius-pill)', padding: '6px 12px', fontFamily: 'var(--font-sans)', fontSize: 12.5, fontWeight: on ? 600 : 500 }}>{c.label}</button>;
        })}
      </div>

      {/* suggested price */}
      <div style={{ border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--paper-100)', padding: '14px 15px', marginBottom: 12 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-400)', marginBottom: 6 }}>Suggested price</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--ink-900)' }}>{R.currency}{price}</span>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-400)', textDecoration: 'line-through' }}>{R.currency}{retail} retail</span>
        </div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--ink-500)', marginTop: 4 }}>Verified pieces list around {R.currency}{R.estLow}–{R.currency}{R.estHigh}.</div>
      </div>

      {/* verified boost */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 13px', border: '1px solid var(--leaf-400)', borderRadius: 'var(--radius-md)', background: 'var(--leaf-100)', marginBottom: 20 }}>
        <HonestyMark state="checked" size={18} />
        <span style={{ flex: 1, fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-700)', lineHeight: 1.45 }}>{R.marketNote}</span>
      </div>

      {/* similar on the market */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 10 }}>
        <span style={{ flex: 1, fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--ink-900)' }}>Live on the market</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--ink-400)' }}>{R.listings.length} similar</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 22 }}>
        {R.listings.map((l) => <ResaleListingCard key={l.id} l={l} />)}
      </div>

      <Button variant="primary" fullWidth onClick={() => setListed(true)}>List it for {R.currency}{price}</Button>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-300)', letterSpacing: '0.04em', textAlign: 'center', marginTop: 10 }}>passport transfers to the buyer on sale</div>
    </div>
  );
}

/* ============================ keeper rewards (loyalty) ============================ */

function KeeperRewards() {
  const R = window.TT.rewards;
  const [open, setOpen] = React.useState(false);
  const progress = Math.min(100, Math.round((R.points / R.nextAt) * 100));
  return (
    <div style={{ marginTop: 22, border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)', overflow: 'hidden' }}>
      <div style={{ padding: '15px 16px 13px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 3 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--ink-900)' }}>Keeper rewards</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--madder-500)', letterSpacing: '0.05em' }}>{R.tier}</div>
        </div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-500)', marginBottom: 12 }}>Points for keeping the jacket alive, not for buying more.</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 6 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: 'var(--ink-900)', lineHeight: 1 }}>{R.points}</span>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-500)' }}>points · {R.nextAt - R.points} more to {R.nextTier}</span>
        </div>
        <div style={{ height: 6, borderRadius: 3, background: 'var(--paper-300)', overflow: 'hidden' }}>
          <div style={{ width: progress + '%', height: '100%', borderRadius: 3, background: 'var(--indigo-500)' }}></div>
        </div>
      </div>
      <button onClick={() => setOpen(!open)} style={{ display: 'block', width: '100%', padding: '9px 16px', border: 'none', borderTop: '1px solid var(--border-hairline)', background: 'var(--paper-100)', cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-500)' }}>
        {open ? 'Hide detail' : 'How you earned it · how to earn more'}
      </button>
      {open ? (
        <div style={{ padding: '12px 16px 16px', borderTop: '1px solid var(--border-hairline)' }}>
          {R.history.map((h, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-700)' }}>
              <span style={{ flex: 1 }}>{h.action}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-400)' }}>{h.date}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--leaf-600)', width: 44, textAlign: 'right' }}>+{h.pts}</span>
            </div>
          ))}
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-400)', margin: '12px 0 4px' }}>Earn more</div>
          {R.earnMore.map((h, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-500)' }}>
              <span style={{ flex: 1 }}>{h.action}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-400)', width: 44, textAlign: 'right' }}>+{h.pts}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/* ============================ vault: authenticity + your data ============================ */

function AuthenticityCheck() {
  const [status, setStatus] = React.useState('idle'); // idle | checking | genuine
  function run() {
    setStatus('checking');
    setTimeout(() => setStatus('genuine'), 1400);
  }
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--ink-900)', marginBottom: 8 }}>Check it is genuine</div>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13.5, color: 'var(--ink-600)', lineHeight: 1.55, marginBottom: 12 }}>
        Buying second hand? Check the tag against the vault to confirm the seller is the current keeper.
      </div>
      {status === 'idle' ? <Button variant="secondary" fullWidth onClick={run}>Run authenticity check</Button> : null}
      {status === 'checking' ? (
        <div style={{ textAlign: 'center', padding: '14px 0', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-500)', letterSpacing: '0.05em' }}>Comparing tag to vault record…</div>
      ) : null}
      {status === 'genuine' ? (
        <div style={{ border: '1.5px solid var(--leaf-400)', background: 'var(--leaf-100)', borderRadius: 'var(--radius-md)', padding: '14px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 6 }}>
            <VaultShield size={20} color="var(--leaf-600)" />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--ink-900)' }}>Genuine</span>
          </div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-600)', lineHeight: 1.5 }}>
            Tag {P.serial} matches the vault. One keeper on record, no duplicate tags seen. Checked just now.
          </div>
          <button onClick={() => setStatus('idle')} style={{ marginTop: 8, border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--ink-400)', letterSpacing: '0.04em' }}>Run again</button>
        </div>
      ) : null}
    </div>
  );
}

function DataToggle({ on, locked, onFlip }) {
  return (
    <button onClick={locked ? undefined : onFlip} aria-label={on ? 'On' : 'Off'} style={{ width: 36, height: 21, borderRadius: 11, border: 'none', flex: '0 0 auto',
      background: on ? (locked ? 'var(--ink-300)' : 'var(--indigo-500)') : 'var(--paper-400)', cursor: locked ? 'default' : 'pointer', position: 'relative', padding: 0 }}>
      <span style={{ position: 'absolute', top: 2.5, left: on ? 18 : 2.5, width: 16, height: 16, borderRadius: '50%', background: 'var(--paper-50)', boxShadow: 'var(--shadow-xs)', transition: 'left 160ms var(--ease-out)' }}></span>
    </button>
  );
}

function YourData() {
  const [data, setData] = React.useState(window.TT.customerData);
  const flip = (group, i) => setData((d) => ({ ...d, [group]: d[group].map((r, j) => j === i ? { ...r, on: !r.on } : r) }));
  const section = (group, title, sub) => (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-400)', marginBottom: 2 }}>{title}</div>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--ink-400)', marginBottom: 8 }}>{sub}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {data[group].map((r, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13.5, fontWeight: 600, color: 'var(--ink-800)' }}>{r.item}</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--ink-500)', lineHeight: 1.45, marginTop: 1 }}>{r.why}{r.locked ? ' (needed for the vault to work)' : ''}</div>
            </div>
            <DataToggle on={r.on} locked={r.locked} onFlip={() => flip(group, i)} />
          </div>
        ))}
      </div>
    </div>
  );
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--ink-900)', marginBottom: 8 }}>Your data</div>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13.5, color: 'var(--ink-600)', lineHeight: 1.55, marginBottom: 14 }}>
        The same honesty rules apply to you. Everything ThreadTrace holds about you is listed here, and most of it you can switch off.
      </div>
      {section('presale', 'Before you bought it', 'Gathered anonymously while you were browsing.')}
      {section('postpurchase', 'Since you registered', 'Tied to your account as the keeper.')}
    </div>
  );
}

/* ============================ C9 Digital Vault ============================ */

function VaultShield({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ color, flex: '0 0 auto' }}>
      <path d="M8 1l6 2.7v4c0 3.6-2.6 6-6 7.3-3.4-1.3-6-3.7-6-7.3v-4L8 1z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M5.4 8l1.8 1.8 3.4-3.6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const VAULT_STAGES = {
  secured: { tone: 'verified', badge: 'Provenance secured', line: 'First-hand vault owner', color: 'var(--leaf-600)', bg: 'var(--leaf-100)', border: 'var(--leaf-400)' },
  pending: { tone: 'pending', badge: 'Transfer in progress', line: 'Waiting for the buyer to claim', color: 'var(--ochre-600)', bg: 'var(--ochre-100)', border: 'var(--ochre-500)' },
  transferred: { tone: 'neutral', badge: 'Ownership transferred', line: 'You are viewing this passport as a previous keeper', color: 'var(--ink-500)', bg: 'var(--paper-200)', border: 'var(--paper-400)' },
};

const WARDROBE_STATUS = {
  secured: { label: 'Secured', color: 'var(--leaf-600)', bg: 'var(--leaf-100)' },
  pending: { label: 'Transfer open', color: 'var(--ochre-600)', bg: 'var(--ochre-100)' },
};

function originCode(maker) {
  const s = String(maker || '');
  if (/portugal/i.test(s)) return 'PT';
  if (/vietnam/i.test(s)) return 'VN';
  if (/ital/i.test(s)) return 'IT';
  const last = s.replace(/[·.]/g, ' ').trim().split(/\s+/).pop() || '';
  return last.slice(0, 2).toUpperCase() || '—';
}

const EP_STATE_COLOR = { checked: 'var(--leaf-600)', told: 'var(--ochre-600)', notyet: 'var(--paper-400)' };
const EP_EYEBROW = { fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-400)' };

function EileenEvidence({ item }) {
  return (
    <div style={{ display: 'flex', gap: 12, padding: '12px 13px', border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)' }}>
      <div style={{ width: 38, height: 38, borderRadius: 7, background: SWATCH.cotton, flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={{ color: 'var(--ink-500)' }}><path d="M5 2h7l3 3v13H5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /><path d="M12 2v3h3" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13.5, fontWeight: 600, color: 'var(--ink-900)' }}>{item.title}</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-400)', letterSpacing: '0.04em', marginTop: 2 }}>{item.docType} · {item.issuer} · {item.date}</div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-600)', lineHeight: 1.5, marginTop: 6, textWrap: 'pretty' }}>{item.detail}</div>
        {item.hash ? <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--ink-300)', marginTop: 6, letterSpacing: '0.04em' }}>hash {item.hash}</div> : null}
      </div>
    </div>
  );
}

function EileenMaterial({ m, mode }) {
  const [open, setOpen] = React.useState(false);
  const color = EP_STATE_COLOR[m.state] || 'var(--ink-300)';
  const sub = mode === 'expert' ? (m.jargon || m.statusLine) : (m.plain || m.statusLine);
  return (
    <div style={{ border: '1px solid var(--border-hairline)', borderRadius: 14, background: 'var(--surface-card)', overflow: 'hidden' }}>
      <button onClick={() => setOpen((o) => !o)} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '15px 16px', border: 'none', background: 'transparent', cursor: 'pointer' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ flex: 1, fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--ink-900)' }}>{m.name}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--ink-600)' }}>{m.pct}</span>
          <HonestyMark state={m.state} size={18} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 15, color: 'var(--ink-400)', width: 12, textAlign: 'center' }}>{open ? '–' : '+'}</span>
        </div>
        {m.pctNum ? (
          <div style={{ height: 6, borderRadius: 999, background: 'var(--surface-sunken)', margin: '11px 0 9px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: m.pctNum + '%', borderRadius: 999, background: color }} />
          </div>
        ) : <div style={{ height: 10 }} />}
        <div style={{ fontFamily: mode === 'expert' ? 'var(--font-mono)' : 'var(--font-sans)', fontSize: mode === 'expert' ? 12 : 13, color: 'var(--ink-500)', lineHeight: 1.5, textWrap: 'pretty' }}>{sub}</div>
      </button>
      {open ? (
        <div style={{ padding: '0 16px 16px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 22px', padding: '10px 0 14px' }}>
            <div><div style={EP_EYEBROW}>Supplier</div><div style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-800)', marginTop: 2 }}>{m.supplier}</div></div>
            <div><div style={EP_EYEBROW}>Origin</div><div style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-800)', marginTop: 2 }}>{m.origin}</div></div>
            <div><div style={EP_EYEBROW}>Process</div><div style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-800)', marginTop: 2 }}>{m.process}</div></div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {m.evidence.map((it, i) => <EileenEvidence key={i} item={it} />)}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function EileenSectionTitle({ children, sub }) {
  return (
    <div style={{ margin: '26px 0 12px' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--ink-900)' }}>{children}</div>
      {sub ? <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-500)', lineHeight: 1.5, marginTop: 3, textWrap: 'pretty' }}>{sub}</div> : null}
    </div>
  );
}

function EileenRing({ pct, big, unit, label, sub, state }) {
  return <EcoRing pct={pct} big={big} unit={unit} label={label} sub={sub} state={state} />;
}

function EileenPassportIndex({ EP }) {
  const [open, setOpen] = React.useState({});
  const toggle = (id) => setOpen((o) => ({ ...o, [id]: !o[id] }));
  const rows = [
    { id: 'fabric', icon: 'fabric', label: 'Fabric composition', state: 'checked' },
    { id: 'care', icon: 'care', label: 'Care instructions', state: 'checked' },
    { id: 'supply', icon: 'supply', label: 'Supply chain', state: 'told' },
    { id: 'lca', icon: 'lca', label: 'Life cycle assessment', state: 'told' },
    { id: 'footprint', icon: 'footprint', label: 'Footprint', state: 'told' },
    { id: 'social', icon: 'social', label: 'Social impact', state: 'checked' },
    { id: 'sustainability', icon: 'sustainability', label: 'Sustainability index', state: 'told' },
    { id: 'component', icon: 'component', label: 'Component traceability', state: 'checked' },
  ];
  const compRow = (name, val, extra) => (
    <div style={{ display: 'flex', gap: 10, padding: '9px 0', borderTop: '1px solid var(--border-hairline)' }}>
      <span style={{ flex: 1, fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-800)' }}>{name}{extra ? <span style={{ color: 'var(--ink-400)', fontFamily: 'var(--font-mono)', fontSize: 10.5 }}> · {extra}</span> : null}</span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-600)' }}>{val}</span>
    </div>
  );
  const bodyFor = (id) => {
    if (id === 'fabric') return (
      <div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-600)', lineHeight: 1.55, marginBottom: 8 }}>{EP.fabricIntro}</div>
        {EP.materials.map((m) => (
          <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderTop: '1px solid var(--border-hairline)' }}>
            <span style={{ flex: 1, fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-800)' }}>{m.name}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-600)' }}>{m.pct}</span>
            <HonestyMark state={m.state} size={15} />
          </div>
        ))}
      </div>
    );
    if (id === 'care') return (
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-600)', lineHeight: 1.6 }}>{EP.careCopy}</div>
    );
    if (id === 'supply') return (
      <div>
        {EP.storyChapters.filter((c) => c.state !== 'notyet').map((c) => (
          <div key={c.n} style={{ display: 'flex', gap: 10, padding: '9px 0', borderTop: '1px solid var(--border-hairline)' }}>
            <HonestyMark state={c.state} size={14} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, color: 'var(--ink-800)' }}>{c.title} <span style={{ fontWeight: 400, color: 'var(--ink-500)' }}>· {c.place}</span></div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-600)', lineHeight: 1.5, marginTop: 2, textWrap: 'pretty' }}>{c.body}</div>
            </div>
          </div>
        ))}
      </div>
    );
    if (id === 'lca') return (
      <div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-600)', lineHeight: 1.55, marginBottom: 8 }}>{EP.lca.note}</div>
        {EP.lca.rows.map((r) => (
          <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderTop: '1px solid var(--border-hairline)' }}>
            <HonestyMark state={r.state} size={14} />
            <span style={{ flex: 1, fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-800)' }}>{r.label}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-600)' }}>{r.value}</span>
          </div>
        ))}
      </div>
    );
    if (id === 'footprint') return (
      <div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-600)', lineHeight: 1.55, marginBottom: 12 }}>{EP.footprintNote}</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          {EP.lca.rows.map((r) => <EileenRing key={r.label} pct={r.ring} big={r.big} unit={r.unit} label={r.label} sub={r.ringLabel} state={r.state} />)}
        </div>
      </div>
    );
    if (id === 'social') return (
      <div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-500)', lineHeight: 1.5, marginBottom: 8, textWrap: 'pretty' }}>{EP.social.note}</div>
        {EP.social.labor.map((r) => (
          <div key={r.id} style={{ display: 'flex', gap: 10, padding: '9px 0', borderTop: '1px solid var(--border-hairline)' }}>
            <div style={{ flex: '0 0 108px', display: 'flex', gap: 7 }}>
              <HonestyMark state={r.state} size={14} />
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, fontWeight: 600, color: 'var(--ink-800)', lineHeight: 1.3 }}>{r.label}</span>
            </div>
            <span style={{ flex: 1, fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-600)', lineHeight: 1.5, textWrap: 'pretty' }}>{r.value}</span>
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10, padding: '10px 12px', border: '1px dashed var(--paper-400)', borderRadius: 'var(--radius-md)', background: 'var(--paper-50)' }}>
          <HonestyMark state={EP.social.audit.state} size={14} />
          <span style={{ flex: 1, fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-600)' }}>Independent social audit</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-700)' }}>{EP.social.audit.body} · grade {EP.social.audit.grade} · {EP.social.audit.date}</span>
        </div>
      </div>
    );
    if (id === 'sustainability') return (
      <div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-600)', lineHeight: 1.55, marginBottom: 4 }}>{EP.sustainNote}</div>
        {(EP.sustainRows || []).map((r, i) => <React.Fragment key={i}>{compRow(r.name, r.val, r.extra)}</React.Fragment>)}
      </div>
    );
    if (id === 'component') return (
      <div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-600)', lineHeight: 1.55, marginBottom: 4 }}>{EP.componentNote}</div>
        {EP.materials.map((m) => (
          <div key={m.id} style={{ display: 'flex', gap: 10, padding: '9px 0', borderTop: '1px solid var(--border-hairline)' }}>
            <HonestyMark state={m.state} size={14} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, color: 'var(--ink-800)' }}>{m.name}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--ink-400)', marginTop: 2 }}>{m.supplier} · {m.origin}</div>
            </div>
          </div>
        ))}
      </div>
    );
    return null;
  };
  return (
    <div>
      {rows.map((r) => (
        <div key={r.id} style={{ borderBottom: '1px solid var(--border-hairline)' }}>
          <button onClick={() => toggle(r.id)} style={{ display: 'flex', alignItems: 'center', gap: 11, width: '100%', textAlign: 'left', padding: '13px 2px', border: 'none', background: 'transparent', cursor: 'pointer' }}>
            <span style={{ width: 20, height: 20, display: 'inline-flex', color: 'var(--ink-700)', flex: '0 0 auto' }}>{React.cloneElement(INDEX_ICONS[r.icon], { width: 20, height: 20 })}</span>
            <span style={{ flex: 1, fontFamily: 'var(--font-sans)', fontSize: 14.5, fontWeight: 600, color: 'var(--ink-900)' }}>{r.label}</span>
            <HonestyMark state={r.state} size={16} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 16, color: 'var(--ink-400)', lineHeight: 1, width: 14, textAlign: 'center' }}>{open[r.id] ? '–' : '+'}</span>
          </button>
          {open[r.id] ? <div style={{ padding: '0 2px 16px 31px' }}>{bodyFor(r.id)}</div> : null}
        </div>
      ))}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 18, padding: '14px 0 2px' }}>
        <HonestyLabel state="checked">Checked</HonestyLabel>
        <HonestyLabel state="told">Told us</HonestyLabel>
        <HonestyLabel state="notyet">Not yet</HonestyLabel>
      </div>
    </div>
  );
}

function EileenPassportPage({ g, onBack, onClaim, onTryOn }) {
  const base = (g.passport && window.TT[g.passport]) || window.TT.passport;
  // Every wardrobe item follows the Nudie/Clean Eileen format & structure.
  // Items with their own dataset use it as-is; the rest inherit this template
  // with their own identity (name, brand, batch, serial, maker) overlaid.
  const EP = g.passport && window.TT[g.passport] ? base : { ...base, name: g.name, brand: g.brand, batch: g.batch, serial: g.serial || base.serial, maker: g.maker || base.maker };
  const [mode, setMode] = React.useState('plain');
  const batchChars = String(EP.batch).split('');
  const origin = originCode(EP.maker);
  const rv = EP.reviews;
  return (
    <React.Fragment>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderBottom: '1px solid var(--border-hairline)', background: 'var(--surface-card)', flex: '0 0 auto' }}>
        <button onClick={onBack} aria-label="Back to vault" title="Back to vault" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto', border: '1px solid var(--paper-400)', background: 'var(--surface-card)', cursor: 'pointer', borderRadius: 'var(--radius-pill)', padding: '6px 10px', color: 'var(--ink-800)' }}>
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M12 4l-6 6 6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-400)' }}>Passport</span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ padding: '16px 16px 28px' }}>
          {/* roundel + authenticated ID card */}
          <div style={{ display: 'flex', alignItems: 'stretch', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 92, borderRadius: '50%', aspectRatio: '1', alignSelf: 'center', background: 'var(--ink-900)', flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={(window.__resources && window.__resources.logoMark) || "../assets/logo-mark.svg"} width="38" height="38" style={{ filter: 'invert(1)' }} alt="ThreadTrace" />
            </div>
            <div style={{ flex: 1, border: '1px solid var(--border-hairline)', borderRadius: 14, background: 'var(--surface-raised)', padding: '12px 14px', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div style={{ flex: 1, fontFamily: 'var(--font-sans)', fontSize: 9.5, lineHeight: 1.45, color: 'var(--ink-500)' }}>
                  This passport is authenticated. The ID below is permanently attributed to this garment and cannot be changed.
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5, flex: '0 0 auto' }}>
                  <VerifiedCheck size={22} />
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-mono)', fontSize: 8.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--leaf-600)' }}><VaultShield size={11} color="var(--leaf-600)" />On-chain</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 14, marginTop: 9 }}>
                {batchChars.map((c, i) => (
                  <span key={i} style={{ minWidth: 16, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 17, color: 'var(--ink-900)', borderBottom: '1.5px solid var(--ink-300)', paddingBottom: 2 }}>{c}</span>
                ))}
                <span style={{ alignSelf: 'flex-end', fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.1em', color: 'var(--ink-400)', paddingBottom: 3 }}>BATCH N°</span>
              </div>
            </div>
          </div>

          {/* name pill */}
          <div style={{ border: '1px solid var(--border-hairline)', borderRadius: 999, background: 'var(--surface-raised)', padding: '9px 16px', textAlign: 'center', fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, color: 'var(--ink-900)', marginBottom: 12 }}>
            {EP.brand} · {EP.name} N° {EP.batch}
          </div>

          {EP.shopUrl ? (
            <a href={EP.shopUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center', gap: 6, margin: '-4px 0 12px', fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--indigo-600)', textDecoration: 'none' }}>{EP.shopLabel || 'View product'}<svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M3.5 8.5L8.5 3.5M4.5 3.5h4v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg></a>
          ) : null}

          {/* hero image with origin callout */}
          <div style={{ position: 'relative', width: '100%', height: 320, borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border-hairline)', marginBottom: 12, background: `linear-gradient(150deg, ${g.swatch}, color-mix(in oklab, ${g.swatch} 62%, #000))` }}>
            <Weave radius={16} opacity={0.14} />
            <image-slot id={'wardrobe-' + g.id} shape="rect" placeholder={g.name}></image-slot>
            <div style={{ position: 'absolute', top: 12, left: 12, right: 12, display: 'flex', alignItems: 'center', gap: 10, pointerEvents: 'none' }}>
              <span style={{ border: '1px solid var(--border-hairline)', borderRadius: 999, background: 'var(--surface-raised)', padding: '5px 16px', fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--ink-800)' }}>Origin</span>
              <span style={{ flex: 1, borderTop: '1.5px dashed var(--ink-300)' }}></span>
              <span style={{ borderRadius: 999, background: 'var(--ink-900)', color: 'var(--paper-50)', padding: '5px 12px', fontFamily: 'var(--font-mono)', fontSize: 11.5, fontWeight: 600, letterSpacing: '0.06em' }} title={EP.maker}>{origin}</span>
            </div>
          </div>

          {/* badge strip */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 14px', marginBottom: 12, borderTop: '1px solid var(--border-hairline)', borderBottom: '1px solid var(--border-hairline)' }}>
            {HOME_BADGES.map(([label, icon]) => (
              <span key={label} title={label} style={{ width: 32, height: 32, display: 'inline-flex', color: 'var(--ink-700)' }}>
                {React.cloneElement(icon, { width: 32, height: 32 })}
              </span>
            ))}
          </div>

          {/* claim + barcode */}
          <div style={{ display: 'flex', alignItems: 'stretch', gap: 12, marginBottom: 6 }}>
            <button onClick={onClaim} style={{ flex: 1, padding: '13px 16px', border: 'none', cursor: 'pointer', borderRadius: 999, background: 'var(--madder-500)', color: 'var(--paper-50)', fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--madder-600)'} onMouseLeave={(e) => e.currentTarget.style.background = 'var(--madder-500)'}>
              Claim ownership
            </button>
            <Barcode serial={EP.serial} />
          </div>

          {/* try on */}
          <button onClick={onTryOn} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', marginTop: 8, padding: '12px 16px', border: '1px solid var(--paper-400)', cursor: 'pointer', borderRadius: 999, background: 'transparent', color: 'var(--ink-800)', fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 5V3.5A1.5 1.5 0 013.5 2H5M11 2h1.5A1.5 1.5 0 0114 3.5V5M14 11v1.5a1.5 1.5 0 01-1.5 1.5H11M5 14H3.5A1.5 1.5 0 012 12.5V11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /><circle cx="8" cy="6.6" r="1.8" stroke="currentColor" strokeWidth="1.3" /><path d="M5.4 11.4c.6-1.4 1.6-2.1 2.6-2.1s2 .7 2.6 2.1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
            Try on
          </button>

          {/* honesty score */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 24, padding: '18px 16px', border: '1px solid var(--border-hairline)', borderRadius: 16, background: 'var(--surface-card)' }}>
            <HonestyRing percent={EP.honestyPercent} size={92} sublabel={null} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ ...EP_EYEBROW, marginBottom: 5 }}>Honesty score</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13.5, color: 'var(--ink-700)', lineHeight: 1.5, textWrap: 'pretty' }}>
                <strong>{EP.checkedCount} of {EP.totalClaims}</strong> claims checked independently. The rest are told to us by the maker or not yet on file — every gap shown, never hidden.
              </div>
            </div>
          </div>

          {/* what's in this passport */}
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 16.5, fontWeight: 700, color: 'var(--ink-900)', margin: '26px 0 2px' }}>What’s in this passport</div>
          <EileenPassportIndex EP={EP} />

          <div style={{ border: '1px solid var(--border-hairline)', borderRadius: 14, background: 'var(--surface-card)', padding: '16px 16px', marginTop: 24 }}>
            <ComplianceChecklist mode="consumer" />
          </div>

          {/* story book */}
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--ink-900)', marginTop: 28 }}>Story Book</div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, margin: '8px 0 20px' }}>
            <HonestyMark state="told" size={15} />
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-500)', lineHeight: 1.45 }}>
              Told in the maker’s and owners’ own words. Kept separate from the <strong>Checked</strong> facts, but each chapter still wears its mark.
            </div>
          </div>
          <div style={{ ...EP_EYEBROW, marginBottom: 14 }}>Heritage blueprint · chapters</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
            {EP.storyChapters.map((c) => (
              <div key={c.n} style={{ border: '1px solid var(--border-hairline)', borderRadius: 14, background: 'var(--surface-card)', padding: '15px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em', color: 'var(--madder-500)' }}>{c.n} · {c.place}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-400)' }}>{c.date}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '4px 0 5px' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--ink-900)' }}>{c.title}</div>
                  <HonestyMark state={c.state} size={15} />
                </div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-600)', lineHeight: 1.55, textWrap: 'pretty' }}>{c.body}</div>
              </div>
            ))}
          </div>
          <div style={{ position: 'relative', border: '1px solid var(--ochre-200)', background: 'var(--ochre-100)', borderRadius: 16, padding: '18px 18px', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ ...EP_EYEBROW, color: 'var(--ochre-600)' }}>Maker narrative · brand ethic</div>
              <HonestyMark state="told" size={18} title="Told us, not checked yet" />
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 18, lineHeight: 1.45, color: 'var(--ink-900)', marginBottom: 14 }}>“{EP.makerNarrative}”</div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', paddingTop: 14, borderTop: '1px solid var(--ochre-200)' }}>
              <div style={{ width: 42, height: 42, borderRadius: '50%', background: SWATCH.indigo, flex: '0 0 auto' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--ink-900)' }}>{EP.maker}</div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-500)' }}>{EP.makerRole} · {EP.brand}</div>
              </div>
            </div>
            {EP.makerAside ? <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-600)', lineHeight: 1.55, marginTop: 12 }}>{EP.makerAside}</div> : null}
          </div>
          <div style={{ border: '1px dashed var(--paper-400)', borderRadius: 16, padding: '18px 18px', display: EP.brandVoices ? 'block' : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={EP_EYEBROW}>Brand &amp; supplier voices</div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--ink-400)' }}>{(EP.brandVoices || []).length} voices</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {(EP.brandVoices || []).map((v, i) => (
                <div key={i} style={{ display: 'flex', gap: 12 }}>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--ink-900)', color: 'var(--paper-50)', flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 14 }}>{(v.who[0] || '?').toUpperCase()}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13.5, fontWeight: 600, color: 'var(--ink-900)' }}>{v.who}</span>
                      <HonestyMark state={v.state} size={14} />
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.04em', color: 'var(--ink-400)', marginLeft: 'auto' }}>{v.role}</span>
                    </div>
                    <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-600)', lineHeight: 1.55, marginTop: 4, textWrap: 'pretty' }}>“{v.quote}”</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* customer feedback */}
          {rv ? (
            <React.Fragment>
              <EileenSectionTitle>What owners say</EileenSectionTitle>
              <div style={{ display: 'flex', alignItems: 'center', gap: 18, border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)', padding: '16px 16px', marginBottom: 12 }}>
                <div style={{ textAlign: 'center', flex: '0 0 auto' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 500, letterSpacing: '-0.02em', color: 'var(--ink-900)', lineHeight: 1 }}>{rv.rating}</div>
                  <div style={{ display: 'flex', gap: 2, justifyContent: 'center', marginTop: 5, color: 'var(--ochre-500)' }}>
                    {[0, 1, 2, 3, 4].map((i) => (<svg key={i} width="11" height="11" viewBox="0 0 12 12" fill="currentColor"><path d="M6 .8l1.5 3.2 3.5.4-2.6 2.4.7 3.5L6 9l-3.1 1.7.7-3.5L1 4.4l3.5-.4z" /></svg>))}
                  </div>
                </div>
                <div style={{ width: 1, alignSelf: 'stretch', background: 'var(--border-hairline)' }}></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 500, color: 'var(--ink-900)', lineHeight: 1 }}>{rv.recommend}</div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-600)', lineHeight: 1.45, marginTop: 4 }}>of owners recommend it, from {rv.count} verified reviews.</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {EP.communityVoices.map((v, i) => (
                  <div key={i} style={{ display: 'flex', gap: 11, border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)', padding: '12px 13px' }}>
                    <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--surface-sunken)', border: '1px solid var(--border-hairline)', flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--ink-600)' }}>{(v.author[0] || '?').toUpperCase()}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, fontWeight: 600, color: 'var(--ink-900)' }}>{v.author}</div>
                      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-600)', lineHeight: 1.5, marginTop: 2, textWrap: 'pretty' }}>{v.body}</div>
                    </div>
                  </div>
                ))}
              </div>
            </React.Fragment>
          ) : null}

          <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 8, border: 'none', background: 'transparent', cursor: 'pointer', padding: '18px 0 0', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em', color: 'var(--ink-400)' }}>
            <VaultShield size={13} color="var(--leaf-600)" />
            Provenance secured · view vault
          </button>
        </div>
      </div>
    </React.Fragment>
  );
}

function WardrobePassportPage({ g, onBack, onStory, onMenu, onGo, onClaim, onTryOn }) {
  const st = WARDROBE_STATUS[g.vault] || WARDROBE_STATUS.secured;
  const batchChars = String(g.batch).split('');
  const origin = originCode(g.maker);
  const row = (label, val) => (
    <div style={{ display: 'flex', gap: 12, padding: '13px 0', borderBottom: '1px solid var(--border-hairline)' }}>
      <span style={{ width: 82, flex: '0 0 auto', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--ink-400)', paddingTop: 2 }}>{label}</span>
      <span style={{ flex: 1, fontFamily: 'var(--font-sans)', fontSize: 13.5, color: 'var(--ink-700)', lineHeight: 1.5, textWrap: 'pretty' }}>{val}</span>
    </div>
  );
  return (
    <React.Fragment>
      {/* top nav */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderBottom: '1px solid var(--border-hairline)', background: 'var(--surface-card)', flex: '0 0 auto' }}>
        <button onClick={onBack} aria-label="Back to vault" title="Back to vault" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto', border: '1px solid var(--paper-400)', background: 'var(--surface-card)', cursor: 'pointer', borderRadius: 'var(--radius-pill)', padding: '6px 10px', color: 'var(--ink-800)' }}>
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M12 4l-6 6 6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-400)' }}>Passport</span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ padding: '16px 16px 28px' }}>
          {/* roundel + authenticated ID card */}
          <div style={{ display: 'flex', alignItems: 'stretch', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 92, borderRadius: '50%', aspectRatio: '1', alignSelf: 'center', background: 'var(--ink-900)', flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={(window.__resources && window.__resources.logoMark) || "../assets/logo-mark.svg"} width="38" height="38" style={{ filter: 'invert(1)' }} alt="ThreadTrace" />
            </div>
            <div style={{ flex: 1, border: '1px solid var(--border-hairline)', borderRadius: 14, background: 'var(--surface-raised)', padding: '12px 14px', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div style={{ flex: 1, fontFamily: 'var(--font-sans)', fontSize: 9.5, lineHeight: 1.45, color: 'var(--ink-500)' }}>
                  This passport is authenticated. The ID below is permanently attributed to this garment and cannot be changed.
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5, flex: '0 0 auto' }}>
                  <VerifiedCheck size={22} />
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-mono)', fontSize: 8.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--leaf-600)' }}><VaultShield size={11} color="var(--leaf-600)" />On-chain</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 14, marginTop: 9 }}>
                {batchChars.map((c, i) => (
                  <span key={i} style={{ minWidth: 16, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 17, color: 'var(--ink-900)', borderBottom: '1.5px solid var(--ink-300)', paddingBottom: 2 }}>{c}</span>
                ))}
                <span style={{ alignSelf: 'flex-end', fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.1em', color: 'var(--ink-400)', paddingBottom: 3 }}>BATCH N°</span>
              </div>
            </div>
          </div>

          {/* name pill */}
          <div style={{ border: '1px solid var(--border-hairline)', borderRadius: 999, background: 'var(--surface-raised)', padding: '9px 16px', textAlign: 'center', fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, color: 'var(--ink-900)', marginBottom: 12 }}>
            {g.brand} · {g.name} N° {g.batch}
          </div>

          {/* hero image with origin callout */}
          <div style={{ position: 'relative', width: '100%', height: 320, borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border-hairline)', marginBottom: 12, background: `linear-gradient(150deg, ${g.swatch}, color-mix(in oklab, ${g.swatch} 62%, #000))` }}>
            <Weave radius={16} opacity={0.14} />
            <image-slot id={'wardrobe-' + g.id} shape="rect" placeholder={g.name}></image-slot>
            <div style={{ position: 'absolute', top: 12, left: 12, right: 12, display: 'flex', alignItems: 'center', gap: 10, pointerEvents: 'none' }}>
              <span style={{ border: '1px solid var(--border-hairline)', borderRadius: 999, background: 'var(--surface-raised)', padding: '5px 16px', fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--ink-800)' }}>Origin</span>
              <span style={{ flex: 1, borderTop: '1.5px dashed var(--ink-300)' }}></span>
              <span style={{ borderRadius: 999, background: 'var(--ink-900)', color: 'var(--paper-50)', padding: '5px 12px', fontFamily: 'var(--font-mono)', fontSize: 11.5, fontWeight: 600, letterSpacing: '0.06em' }} title={g.maker}>{origin}</span>
            </div>
          </div>

          {/* badge strip */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 14px', marginBottom: 12, borderTop: '1px solid var(--border-hairline)', borderBottom: '1px solid var(--border-hairline)' }}>
            {HOME_BADGES.map(([label, icon]) => (
              <span key={label} title={label} style={{ width: 32, height: 32, display: 'inline-flex', color: 'var(--ink-700)' }}>
                {React.cloneElement(icon, { width: 32, height: 32 })}
              </span>
            ))}
          </div>

          {/* claim + barcode */}
          <div style={{ display: 'flex', alignItems: 'stretch', gap: 12, marginBottom: 6 }}>
            <button onClick={onClaim} style={{ flex: 1, padding: '13px 16px', border: 'none', cursor: 'pointer', borderRadius: 999, background: 'var(--madder-500)', color: 'var(--paper-50)', fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--madder-600)'} onMouseLeave={(e) => e.currentTarget.style.background = 'var(--madder-500)'}>
              Claim ownership
            </button>
            <Barcode serial={g.serial} />
          </div>

          {/* try on */}
          <button onClick={onTryOn} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', marginTop: 8, marginBottom: 20, padding: '12px 16px', border: '1px solid var(--paper-400)', cursor: 'pointer', borderRadius: 999, background: 'transparent', color: 'var(--ink-800)', fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 5V3.5A1.5 1.5 0 013.5 2H5M11 2h1.5A1.5 1.5 0 0114 3.5V5M14 11v1.5a1.5 1.5 0 01-1.5 1.5H11M5 14H3.5A1.5 1.5 0 012 12.5V11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /><circle cx="8" cy="6.6" r="1.8" stroke="currentColor" strokeWidth="1.3" /><path d="M5.4 11.4c.6-1.4 1.6-2.1 2.6-2.1s2 .7 2.6 2.1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
            Try on
          </button>

          {/* shared passport sections — mirrors the main passport layout */}
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 16.5, fontWeight: 700, color: 'var(--ink-900)', margin: '4px 0 2px' }}>What’s in this passport</div>
          <PassportIndex onGo={onGo || (() => {})} />

          <div style={{ border: '1px solid var(--border-hairline)', borderRadius: 14, background: 'var(--surface-card)', padding: '16px 16px', marginTop: 24 }}>
            <ComplianceChecklist mode="consumer" />
          </div>

          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 16.5, fontWeight: 700, color: 'var(--ink-900)', margin: '24px 0 10px' }}>Customer feedback</div>
          <CustomerFeedback onGo={onStory} />

          <div style={{ height: 24 }}></div>
          {/* story teaser */}
          <button onClick={onStory} style={{ display: 'block', width: '100%', textAlign: 'left', cursor: 'pointer', border: '1px solid var(--border-hairline)', borderRadius: 14, background: 'var(--surface-card)', padding: '16px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 6 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-400)' }}>Story</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-400)' }}>{P.storyChapters.length} chapters · community</span>
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--ink-900)', lineHeight: 1.2, marginBottom: 5 }}>Where it came from, and who’s wearing it now</div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-600)', lineHeight: 1.5, textWrap: 'pretty' }}>{P.storyChapters[0].body}</div>
            <span style={{ display: 'inline-block', marginTop: 10, fontFamily: 'var(--font-sans)', fontSize: 13.5, fontWeight: 600, color: 'var(--indigo-500)' }}>Read the story &amp; join the discussion →</span>
          </button>

          <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 8, border: 'none', background: 'transparent', cursor: 'pointer', padding: '14px 0 0', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em', color: 'var(--ink-400)' }}>
            <VaultShield size={13} color="var(--leaf-600)" />
            Provenance secured · view vault
          </button>
        </div>
      </div>
    </React.Fragment>
  );
}

/* ============================ Cost-Per-Wear tracker (Wardrobe) ============================ */

const CPW_GOAL = 5; // "paid off" target: $5 / wear
function cpwKey(id) { return 'tt_cpw_' + id; }
function loadWears(g) { try { const v = localStorage.getItem(cpwKey(g.id)); if (v != null) return parseInt(v, 10) || 0; } catch (e) {} return g.wears || 0; }
function saveWears(id, n) { try { localStorage.setItem(cpwKey(id), String(n)); } catch (e) {} }

function CpwRing({ pct, cpw, currency }) {
  const R = 46, C = 2 * Math.PI * R;
  const tone = pct >= 1 ? 'var(--leaf-600)' : pct >= 0.5 ? 'var(--indigo-500)' : 'var(--ochre-500)';
  return (
    <div style={{ position: 'relative', width: 116, height: 116, flex: '0 0 auto' }}>
      <svg width="116" height="116" viewBox="0 0 116 116" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="58" cy="58" r={R} fill="none" stroke="var(--paper-300)" strokeWidth="9" />
        <circle cx="58" cy="58" r={R} fill="none" stroke={tone} strokeWidth="9" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - Math.min(pct, 1))} style={{ transition: 'stroke-dashoffset .6s cubic-bezier(.2,.8,.2,1), stroke .3s' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: 'var(--ink-900)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{currency}{cpw}</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-400)', marginTop: 3 }}>per wear</div>
      </div>
    </div>
  );
}

function CostPerWear({ g }) {
  const currency = (window.TT.resale && window.TT.resale.currency) || '$';
  const [wears, setWears] = React.useState(() => loadWears(g));
  const [pulse, setPulse] = React.useState(false);
  const [checking, setChecking] = React.useState(false);
  React.useEffect(() => { saveWears(g.id, wears); }, [wears, g.id]);
  const retail = g.retail || 0;
  const cpwNum = wears > 0 ? retail / wears : retail;
  const cpw = cpwNum >= 100 ? Math.round(cpwNum) : cpwNum.toFixed(cpwNum < 10 ? 2 : 1);
  const targetWears = Math.max(1, Math.round(retail / CPW_GOAL));
  const pct = Math.min(wears / targetWears, 1);
  const toGoal = Math.max(0, targetWears - wears);

  function log() { setWears((w) => w + 1); setPulse(true); setTimeout(() => setPulse(false), 500); }
  function proximity() {
    if (checking) return;
    setChecking(true);
    setTimeout(() => { setWears((w) => w + 1); setPulse(true); setChecking(false); setTimeout(() => setPulse(false), 500); }, 1400);
  }

  return (
    <div style={{ border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-lg)', background: 'var(--surface-card)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden', marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '11px 14px', borderBottom: '1px solid var(--border-hairline)', background: 'var(--surface-sunken)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-500)' }}>Cost per wear · {g.name}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-400)' }}>{currency}{retail} retail</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 14px' }}>
        <div style={{ transform: pulse ? 'scale(1.06)' : 'scale(1)', transition: 'transform .5s cubic-bezier(.2,.9,.3,1.4)' }}>
          <CpwRing pct={pct} cpw={cpw} currency={currency} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 30, color: 'var(--ink-900)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{wears}</span>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-500)' }}>wears logged</span>
          </div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-600)', lineHeight: 1.45, marginTop: 8, textWrap: 'pretty' }}>
            {pct >= 1
              ? <React.Fragment>Paid off — you’ve beaten the {currency}{CPW_GOAL}/wear goal. Every wear from here is pure value.</React.Fragment>
              : <React.Fragment><strong style={{ color: 'var(--ink-800)' }}>{toGoal} more wears</strong> to reach your {currency}{CPW_GOAL}/wear goal.</React.Fragment>}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, padding: '0 14px 14px' }}>
        <button onClick={log} style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '11px 10px', borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer', background: 'var(--ink-900)', color: 'var(--paper-50)', fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600 }}>
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M3 8.5l3.2 3L13 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
          I wore it today
        </button>
        <button onClick={proximity} disabled={checking} style={{ flex: '0 0 auto', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '11px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-hairline)', cursor: checking ? 'default' : 'pointer', background: 'var(--surface-card)', color: 'var(--ink-700)', fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600 }}>
          {checking
            ? <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ animation: 'tt-spin-kf 0.8s linear infinite' }}><circle cx="8" cy="8" r="6" stroke="var(--paper-300)" strokeWidth="2" /><path d="M8 2a6 6 0 0 1 6 6" stroke="var(--indigo-500)" strokeWidth="2" strokeLinecap="round" /></svg>
            : <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M8 3.5a4.5 4.5 0 0 1 4.5 4.5M8 6a2 2 0 0 1 2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><circle cx="8" cy="8" r="1.3" fill="currentColor" /></svg>}
          {checking ? 'Sensing tag…' : 'Proximity'}
        </button>
      </div>
    </div>
  );
}

function MyWardrobe({ onOpen, onScan }) {
  const items = window.TT.wardrobe || [];
  const claim = loadClaim();
  const keeper = claim ? claim.name : 'you';
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10, marginBottom: 4 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--ink-900)' }}>Your wardrobe</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--ink-400)', letterSpacing: '0.04em' }}>{items.length} in vault</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map((g) => {
          const st = WARDROBE_STATUS[g.vault] || WARDROBE_STATUS.secured;
          return (
            <button key={g.id} onClick={() => onOpen && onOpen(g)} style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left', cursor: 'pointer', padding: 10, border: g.current ? '1.5px solid var(--indigo-300)' : '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', background: g.current ? 'var(--indigo-100)' : 'var(--surface-card)' }}
              onMouseEnter={(e) => { if (!g.current) e.currentTarget.style.background = 'var(--paper-100)'; }} onMouseLeave={(e) => { if (!g.current) e.currentTarget.style.background = 'var(--surface-card)'; }}>
              <div style={{ position: 'relative', width: 52, height: 62, borderRadius: 6, overflow: 'hidden', flex: '0 0 auto', background: `linear-gradient(150deg, ${g.swatch}, color-mix(in oklab, ${g.swatch} 62%, #000))`, boxShadow: 'var(--shadow-sm)' }}>
                <Weave radius={6} opacity={0.2} />
                <image-slot id={'wardrobe-' + g.id} shape="rect" placeholder=" "></image-slot>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase', color: 'var(--madder-500)' }}>{g.brand}</div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600, color: 'var(--ink-900)', lineHeight: 1.2, marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.name}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-400)', marginTop: 3 }}>Batch {g.batch} · kept since {g.since}</div>
              </div>
              <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center' }}>
                <svg width="15" height="15" viewBox="0 0 18 18" fill="none" style={{ color: 'var(--ink-400)' }}><path d="M6 4l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
            </button>
          );
        })}
        <button onClick={onScan} style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left', cursor: 'pointer', padding: '14px 12px', border: '1px dashed var(--paper-400)', borderRadius: 'var(--radius-md)', background: 'transparent' }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--paper-100)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
          <span style={{ width: 52, height: 52, borderRadius: 6, flex: '0 0 auto', border: '1.5px dashed var(--paper-400)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--indigo-600)' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
          </span>
          <span style={{ flex: 1 }}>
            <span style={{ display: 'block', fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600, color: 'var(--ink-900)' }}>Add a new passport</span>
            <span style={{ display: 'block', fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--ink-500)', marginTop: 2 }}>Scan a garment tag to add it to your vault</span>
          </span>
          <svg width="15" height="15" viewBox="0 0 18 18" fill="none" style={{ color: 'var(--ink-400)' }}><path d="M6 4l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>
    </div>
  );
}

function VaultTab({ onOpen, onScan }) {
  const [stage, setStage] = React.useState('secured');
  const [code, setCode] = React.useState(null);
  const [intent, setIntent] = React.useState('resell');
  const [tx, setTx] = React.useState(null);
  const [copied, setCopied] = React.useState(false);
  const [left, setLeft] = React.useState(900); // 15:00
  const claim = loadClaim();
  const s = VAULT_STAGES[stage];

  React.useEffect(() => {
    if (stage !== 'pending') return;
    const t = setInterval(() => setLeft((v) => (v > 0 ? v - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [stage]);

  function rnd(n) { let o = ''; const c = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; for (let i = 0; i < n; i++) o += c[Math.floor(Math.random() * c.length)]; return o; }
  function startTransfer() {
    setCode('TT-' + intent.slice(0, 3).toUpperCase() + '-' + rnd(4) + '-' + rnd(4));
    setTx('0x' + Array.from({ length: 40 }).map(() => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join(''));
    setLeft(900);
    setCopied(false);
    setStage('pending');
  }

  return (
    <div style={{ padding: '20px 18px 28px' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--ink-900)', marginBottom: 4 }}>Digital Vault</div>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-500)', lineHeight: 1.5, marginBottom: 18 }}>
        One garment, one keeper.
      </div>

      {/* vault status */}
      <div style={{ border: `1.5px solid ${s.border}`, background: s.bg, borderRadius: 'var(--radius-lg)', padding: '18px 18px', marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <VaultShield size={34} color={s.color} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 19, color: 'var(--ink-900)', lineHeight: 1.15 }}>{s.badge}</div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-600)', marginTop: 2 }}>{stage === 'secured' && claim ? `Held by ${claim.name}` : s.line}</div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginTop: 14, paddingTop: 12, borderTop: `1px solid ${s.border}`, fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--ink-500)', letterSpacing: '0.04em' }}>
          <span>{P.serial}</span>
          <span>{stage === 'secured' ? `Keeper since ${claim ? claim.date : '2026-01-12'}` : stage === 'pending' ? 'Hand-off open' : 'Handed off today'}</span>
        </div>
      </div>

      {/* why this matters */}
      <div style={{ padding: '14px 16px', border: '1px dashed var(--paper-400)', borderRadius: 'var(--radius-md)', background: 'var(--paper-100)', marginBottom: 22 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--ink-800)', marginBottom: 6 }}>A copied tag cannot copy this</div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13.5, color: 'var(--ink-600)', lineHeight: 1.55 }}>
          Anyone can copy the QR tag. Nobody can copy the vault — it holds one keeper at a time. No vault, no proof.
        </div>
      </div>

      {/* transfer */}
      {stage === 'secured' ? (
        <React.Fragment>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--ink-900)', marginBottom: 4 }}>Secondary market hand-off</div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13.5, color: 'var(--ink-600)', lineHeight: 1.55, marginBottom: 14 }}>
            Gift, resell or recycle this piece. A single-use ledger token lets the next keeper officially claim its full provenance history.
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {[['gift', 'Gift', 'M8 3.5v9M4 6.2h8M8 3.5c-1.4-1.6-3.4-.4-2.2 1 .5.6 2.2.6 2.2.6s1.7 0 2.2-.6c1.2-1.4-.8-2.6-2.2-1z'], ['resell', 'Resell', 'M3 8h10M9 4l4 4-4 4'], ['recycle', 'Recycle', 'M8 3.2l2 3.4H6l2-3.4zM4.6 8.2l-1.8 3.1 3.4.1M11.4 8.2l1.8 3.1-3.4.1']].map(([id, label, path]) => {
              const on = intent === id;
              return (
                <button key={id} onClick={() => setIntent(id)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, padding: '13px 6px', borderRadius: 'var(--radius-md)', cursor: 'pointer', border: on ? '1.5px solid var(--indigo-500)' : '1px solid var(--border-hairline)', background: on ? 'var(--indigo-100)' : 'var(--surface-card)', transition: 'all .14s' }}>
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d={path} stroke={on ? 'var(--indigo-600)' : 'var(--ink-500)'} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, fontWeight: on ? 700 : 500, color: on ? 'var(--indigo-700)' : 'var(--ink-600)' }}>{label}</span>
                </button>
              );
            })}
          </div>
          <Button variant="primary" fullWidth onClick={startTransfer}>Initiate digital ownership transfer</Button>
        </React.Fragment>
      ) : null}

      {stage === 'pending' ? (
        <React.Fragment>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10, marginBottom: 10 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--ink-900)' }}>Single-use hand-off token</div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'var(--font-mono)', fontSize: 10.5, color: left < 60 ? 'var(--madder-500)' : 'var(--ink-500)', fontVariantNumeric: 'tabular-nums' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--ochre-500)' }} />expires {Math.floor(left / 60)}:{String(left % 60).padStart(2, '0')}
            </span>
          </div>
          <div style={{ border: '1.5px solid var(--indigo-300)', borderRadius: 'var(--radius-lg)', background: 'var(--indigo-100)', padding: '16px 16px', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ flex: '0 0 auto', width: 64, height: 64, borderRadius: 'var(--radius-sm)', background: 'var(--surface-card)', border: '1px solid var(--indigo-300)', padding: 6, display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gridTemplateRows: 'repeat(7,1fr)', gap: 1.5 }}>
                {Array.from({ length: 49 }).map((_, i) => {
                  const seed = (code || '').charCodeAt(i % (code || 'x').length) || 0;
                  const on = ((seed + i * 7) % 3 === 0) || i < 1 || i === 6 || i === 42 || i === 48;
                  return <span key={i} style={{ background: on ? 'var(--indigo-700)' : 'transparent', borderRadius: 0.5 }} />;
                })}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--indigo-600)', marginBottom: 4 }}>Ledger claim token</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 15.5, letterSpacing: '0.06em', color: 'var(--indigo-700)', fontWeight: 600, wordBreak: 'break-all' }}>{code}</div>
              </div>
            </div>
            <div style={{ marginTop: 12, paddingTop: 11, borderTop: '1px solid var(--indigo-300)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-500)', marginBottom: 3 }}><span>Intent</span><span style={{ color: 'var(--ink-700)', textTransform: 'capitalize' }}>{intent}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-500)' }}><span>Pending tx</span><span style={{ color: 'var(--ink-700)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 150 }}>{tx}</span></div>
            </div>
          </div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-600)', lineHeight: 1.55, marginBottom: 12 }}>
            Share this token with your buyer only. When they enter it in their ThreadTrace app, the ledger writes the transfer and the token burns — it cannot be reused.
          </div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
            <Button variant="secondary" fullWidth onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 1600); }}>{copied ? 'Copied ✓' : 'Copy token'}</Button>
            <Button variant="primary" fullWidth onClick={() => setStage('transferred')}>Buyer has claimed it</Button>
          </div>
          <button onClick={() => { setStage('secured'); setCode(null); setTx(null); }} style={{ display: 'block', margin: '4px auto 0', border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--ink-400)' }}>Cancel hand-off</button>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-300)', letterSpacing: '0.04em', textAlign: 'center', marginTop: 10 }}>demo: the claim button stands in for the buyer's app</div>
        </React.Fragment>
      ) : null}

      {stage === 'transferred' ? (
        <React.Fragment>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--ink-900)', marginBottom: 8 }}>Ownership transferred</div>
          <div style={{ border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--paper-100)', padding: '12px 14px', marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--ink-500)', marginBottom: 4 }}><span>Ledger tx</span><span style={{ color: 'var(--leaf-600)' }}>confirmed</span></div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--ink-600)', wordBreak: 'break-all' }}>{tx}</div>
          </div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13.5, color: 'var(--ink-600)', lineHeight: 1.55, marginBottom: 14 }}>
            The vault now belongs to the new owner. Your time with the jacket is stamped into the chain of keeping,
            and you can still read the story you were part of.
          </div>
          <Button variant="secondary" fullWidth onClick={() => { setStage('secured'); setCode(null); setTx(null); }}>Reset demo</Button>
        </React.Fragment>
      ) : null}

      <div style={{ height: 26 }}></div>
      <AuthenticityCheck />
      <YourData />
    </div>
  );
}

/* ============================ passport + router ============================ */

function Passport({ onMenu, onSignOut, tweaks = {} }) {
  const [tab, setTab] = React.useState(tweaks.landingTab || 'home');
  const [claim, setClaim] = React.useState(null);
  const [sheet, setSheet] = React.useState(null);
  const [mode, setMode] = React.useState('plain');
  const [recyclerMode, setRecyclerMode] = React.useState(false);
  const [account, setAccount] = React.useState(loadAccount);
  const [openG, setOpenG] = React.useState(null); // wardrobe garment shown as its own passport page
  const pendingRef = React.useRef(null); // sheet to open after sign-in
  const bodyRef = React.useRef(null);
  const goTo = (id) => {
    if (id === 'materials') {
      if (tab !== 'home') setTab('home');
      requestAnimationFrame(() => {
        const el = document.getElementById('tt-materials');
        if (el && bodyRef.current) bodyRef.current.scrollTo({ top: el.offsetTop - 8, behavior: 'smooth' });
      });
    } else setTab(id);
  };
  const requireAccount = (target) => {
    if (account) { setSheet(target); } else { pendingRef.current = target; setSheet('account'); }
  };
  const handleSignIn = (a) => {
    saveAccount(a); setAccount(a);
    const next = pendingRef.current; pendingRef.current = null;
    setSheet(next || null);
  };
  // Clear the stored account, then hand back to ConsumerApp so it can drop us
  // on the sign-in screen. Without that last part you stay inside the app.
  const handleSignOut = () => { saveAccount(null); setAccount(null); setSheet(null); if (onSignOut) onSignOut(); };
  const depth = tweaks.evidenceDepth || 'standard';

  const allEvidence = { name: 'All evidence', pct: '—', statusLine: `${P.checkedCount} of ${P.totalClaims} claims Checked · sources below`, state: 'checked',
    evidence: P.materials.flatMap((m) => m.evidence.map((e) => ({ ...e, title: `${e.title}`, meta: `${m.name} · ${e.meta}` }))) };

  if (recyclerMode) {
    return (
      <React.Fragment>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid var(--border-hairline)', background: 'var(--surface-card)', flex: '0 0 auto' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--ink-900)' }}>ThreadTrace</span>
          <button onClick={() => setRecyclerMode(false)} style={{ border: '1px solid var(--paper-400)', background: 'transparent', cursor: 'pointer', borderRadius: 'var(--radius-pill)', padding: '5px 12px', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-600)' }}>Exit recycler mode</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 28px' }}>
          <DisassemblyPanel compact />
        </div>
      </React.Fragment>
    );
  }

  if (openG) {
    return <EileenPassportPage g={openG} onBack={() => setOpenG(null)} onClaim={() => { setOpenG(null); requireAccount('claim'); }} onTryOn={() => { setOpenG(null); setSheet('tryon'); }} />;
  }

  return (
    <React.Fragment>
      <TopNav tab={tab} onTab={setTab} onMenu={onMenu} onRecycler={() => setSheet('recycler')} onAccount={() => setSheet('account')} signedIn={!!account} />
      <div ref={bodyRef} style={{ flex: 1, overflowY: 'auto' }}>
        {tab === 'home' ? <HomeTab onClaim={() => requireAccount('claim')} onTryOn={() => setSheet('tryon')} onGoVault={() => setTab('vault')} onGo={goTo} onOpen={(g) => setOpenG(g)} onScan={onMenu} /> : null}
        {tab === 'story' ? <StoryTab onSignIn={() => requireAccount('voice')} signedIn={!!account} onGo={goTo} showCommunity={tweaks.showCommunity !== false} /> : null}
        {tab === 'circular' ? <CircularTab onRepair={() => setSheet('repair')} onReturn={() => setSheet('return')} onResale={() => setSheet('resale')} onTransfer={() => setSheet('transfer')} onCare={() => setSheet('care')} /> : null}
        {tab === 'vault' ? <VaultTab onOpen={(g) => setOpenG(g)} onScan={onMenu} /> : null}
      </div>

      <EvidenceDrawer claim={claim} onClose={() => setClaim(null)} onBack={() => setClaim(null)} depth={mode === 'expert' ? 'forensic' : depth} />

      <Sheet open={sheet === 'account'} onClose={() => { pendingRef.current = null; setSheet(null); }}>
        <AccountSheet account={account} onSignIn={handleSignIn} onSignOut={handleSignOut} />
      </Sheet>

      <Sheet open={sheet === 'voice'} onClose={() => setSheet(null)}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink-900)', marginBottom: 4 }}>Add your voice</div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13.5, color: 'var(--ink-500)', marginBottom: 18 }}>
          Posting as <span style={{ fontWeight: 600, color: 'var(--ink-800)' }}>{account ? account.name : ''}</span>. Owner notes are kept separate from the verified facts.
        </div>
        <Input label="Your note" placeholder="How has this jacket lived with you?" style={{ marginBottom: 12 }} />
        <Button variant="primary" fullWidth onClick={() => setSheet(null)}>Add note</Button>
      </Sheet>

      <Sheet open={sheet === 'repair'} onClose={() => setSheet(null)}>
        <div style={{ marginBottom: 12 }}><Badge tone="info">Nearby partners</Badge></div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink-900)', marginBottom: 8 }}>Find a repairer</div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13.5, color: 'var(--ink-600)', lineHeight: 1.55, marginBottom: 16 }}>A repair, once logged, adds a <strong>Checked</strong> node to the lifecycle.</div>
        <RepairPartnerList />
      </Sheet>

      <Sheet open={sheet === 'return'} onClose={() => setSheet(null)}>
        <div style={{ marginBottom: 12 }}><Badge tone="info">Partner flow</Badge></div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink-900)', marginBottom: 8 }}>Start a return</div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--ink-600)', lineHeight: 1.6, marginBottom: 18 }}>Take-back and fibre recovery is <strong>Not yet</strong> on file for this garment. Starting a return is how that gap gets filled.</div>
        <Button variant="primary" fullWidth onClick={() => setSheet(null)}>Continue to partner</Button>
      </Sheet>

      <Sheet open={sheet === 'resale'} onClose={() => setSheet(null)}>
        <ResaleSheet onDone={() => setSheet(null)} />
      </Sheet>

      <Sheet open={sheet === 'care'} onClose={() => setSheet(null)}>
        <CareSheet onRepair={() => setSheet('repair')} />
      </Sheet>

      <Sheet open={sheet === 'transfer'} onClose={() => setSheet(null)}>
        <TransferOwnerFlow onDone={() => setSheet(null)} Button={Button} Input={Input} />
      </Sheet>

        <Sheet open={sheet === 'claim'} onClose={() => setSheet(null)}>
        <ClaimSheet account={account} onDone={() => setSheet(null)} />
      </Sheet>

      <Sheet open={sheet === 'tryon'} onClose={() => setSheet(null)}>
        <div style={{ marginBottom: 12 }}><Badge tone="info">Preview</Badge></div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink-900)', marginBottom: 8 }}>Virtual try-on</div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13.5, color: 'var(--ink-600)', lineHeight: 1.55, marginBottom: 14 }}>
          Point your camera at yourself and the jacket is drawn over you at true size, in this batch's exact indigo.
        </div>
        <div style={{ position: 'relative', height: 210, borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: 14,
          background: 'repeating-linear-gradient(45deg, var(--paper-300) 0 8px, var(--paper-200) 8px 16px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-500)', letterSpacing: '0.05em', background: 'var(--paper-50)', padding: '6px 12px', borderRadius: 'var(--radius-pill)' }}>camera preview</span>
        </div>
        <Button variant="primary" fullWidth onClick={() => setSheet(null)}>Allow camera and start</Button>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-300)', letterSpacing: '0.04em', textAlign: 'center', marginTop: 10 }}>nothing is recorded or uploaded</div>
      </Sheet>

      <Sheet open={sheet === 'recycler'} onClose={() => setSheet(null)}>
        <RecyclerGate onUnlock={() => { setSheet(null); setRecyclerMode(true); }} onCancel={() => setSheet(null)} Button={Button} Input={Input} />
      </Sheet>
    </React.Fragment>
  );
}

function ConsumerSignIn({ onIn }) {
  const [mode, setMode] = React.useState('signin'); // signin | signup
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [pw, setPw] = React.useState('');
  const signup = mode === 'signup';
  const submit = () => {
    const derived = email.trim().split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    const acct = { name: (signup ? name.trim() : '') || derived || 'Samantha Chan', email: (email.trim() || 'samantha@example.com').toLowerCase(), since: new Date().toISOString().slice(0, 10) };
    saveAccount(acct);
    onIn(acct);
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--surface-page)', padding: '0 26px' }}>
      <div style={{ paddingTop: 22 }}><window.AppSwitch current="consumer" /></div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ width: 66, height: 66, borderRadius: '50%', background: 'var(--ink-900)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 22 }}>
          <img src={(window.__resources && window.__resources.logoMark) || '../assets/logo-mark.svg'} width="28" height="28" alt="ThreadTrace" style={{ filter: 'invert(1)' }} />
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--madder-500)', marginBottom: 6 }}>Consumer · mobile</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 500, color: 'var(--ink-900)', lineHeight: 1.1, marginBottom: 8 }}>{signup ? 'Create your account' : 'Your garment passport'}</div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--ink-500)', lineHeight: 1.55, marginBottom: 26 }}>{signup ? 'Set up a keeper account to claim garments and keep their stories with you.' : 'Sign in to scan tags, claim ownership, and keep every jacket\'s story with you.'}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {signup ? <Input label="Name" placeholder="Samantha Chan" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') submit(); }} /> : null}
          <Input label="Email" type="email" placeholder="samantha@example.com" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') submit(); }} />
          <Input label="Password" type="password" placeholder="••••••••" value={pw} onChange={(e) => setPw(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') submit(); }} />
          <Button variant="primary" size="lg" fullWidth onClick={submit}>{signup ? 'Create account' : 'Sign in'}</Button>
        </div>
      </div>
      <div style={{ padding: '0 0 26px', textAlign: 'center', fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-500)' }}>
        {signup ? 'Already have an account?' : 'New to ThreadTrace?'}{' '}
        <button onClick={() => setMode(signup ? 'signin' : 'signup')} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700, color: 'var(--indigo-700)' }}>{signup ? 'Sign in' : 'Create an account'}</button>
      </div>
    </div>
  );
}

function ConsumerApp({ pov, onPov, tweaks = {} }) {
  const [phase, setPhaseRaw] = React.useState('signin'); // signin | gateway | scanning | verifying | passport
  const [seenPassport, setSeenPassport] = React.useState(false);
  const setPhase = (p) => { if (p === 'passport') setSeenPassport(true); setPhaseRaw(p); };
  const timer = React.useRef(null);
  React.useEffect(() => () => clearTimeout(timer.current), []);

  function startScan() {
    setPhase('scanning');
    timer.current = setTimeout(() => setPhaseRaw('verifying'), 2100);
  }

  if (phase === 'signin') return <ConsumerSignIn onIn={() => setPhase('passport')} />;
  if (phase === 'gateway') return <Gateway pov={pov} onPov={onPov} onScan={startScan} onManual={() => setPhase('passport')} onBack={seenPassport ? () => setPhase('passport') : null} onSignOut={() => setPhase('signin')} />;
  if (phase === 'scanning') return <Scanning onCancel={() => { clearTimeout(timer.current); setPhase('gateway'); }} />;
  if (phase === 'verifying') return <ProvenanceVerify slug={(window.TT.passport && window.TT.passport.slug) || ''} onDone={() => setPhase('passport')} onCancel={() => setPhase('gateway')} />;
  return <Passport onMenu={() => setPhase('gateway')} onSignOut={() => setPhase('signin')} tweaks={tweaks} />;
}

window.VaultTab = VaultTab;
window.StoryBook = StoryBook;
window.CostPerWear = CostPerWear;
window.AccountSheet = AccountSheet;
window.ttLoadAccount = loadAccount;
window.ttSaveAccount = saveAccount;
window.ConsumerApp = ConsumerApp;

/* ============================ DPP compliance checklist (shared: consumer + business) ============================ */

const DPP_MARK = { done: 'checked', active: 'told', todo: 'notyet' };
const DPP_LABEL = { done: 'Verified', active: 'In progress', todo: 'Planned' };
const DPP_TONE = { done: 'var(--leaf-600)', active: 'var(--ochre-500)', todo: 'var(--paper-400)' };
const DPP_CYCLE = { todo: 'active', active: 'done', done: 'todo' };

function ComplianceChecklist({ mode = 'consumer' }) {
  const C = window.TT.dppCompliance;
  const KEY = 'tt-dpp-compliance';
  const editable = mode === 'business';
  const [states, setStates] = React.useState(() => {
    const base = Object.fromEntries(C.steps.map((s) => [s.n, s.state]));
    if (!editable) return base;
    try { const s = JSON.parse(localStorage.getItem(KEY)); if (s) return { ...base, ...s }; } catch (e) {}
    return base;
  });
  const stateOf = (s) => states[s.n] || s.state;
  const advance = (n) => setStates((prev) => { const nx = { ...prev, [n]: DPP_CYCLE[prev[n] || 'todo'] }; try { localStorage.setItem(KEY, JSON.stringify(nx)); } catch (e) {} return nx; });
  const done = C.steps.filter((s) => stateOf(s) === 'done').length;
  const pct = Math.round((done / C.steps.length) * 100);
  const [open, setOpen] = React.useState(true);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 6 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink-900)', lineHeight: 1.1 }}>DPP compliance</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: '0 0 auto' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink-900)', lineHeight: 1 }}>{done}<span style={{ fontSize: 14, color: 'var(--ink-400)' }}>/{C.steps.length}</span></div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase', color: 'var(--ink-400)' }}>verified</div>
          </div>
          <button onClick={() => setOpen((o) => !o)} role="switch" aria-checked={open} aria-label="Show DPP compliance detail" style={{ position: 'relative', width: 42, height: 24, flex: '0 0 auto', borderRadius: 999, border: 'none', cursor: 'pointer', padding: 0, background: open ? 'var(--leaf-600)' : 'var(--paper-400)', transition: 'background var(--dur-base) var(--ease-out)' }}>
            <span style={{ position: 'absolute', top: 2, left: open ? 20 : 2, width: 20, height: 20, borderRadius: '50%', background: 'var(--paper-50)', boxShadow: 'var(--shadow-sm)', transition: 'left var(--dur-base) var(--ease-out)' }}></span>
          </button>
        </div>
      </div>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-500)', lineHeight: 1.5, marginBottom: 12, textWrap: 'pretty' }}>
        {editable ? C.note : 'Where this brand stands on the seven steps to a compliant Digital Product Passport. Each step wears its honesty mark, same as the rest of the passport.'}
      </div>
      <div style={{ height: 7, borderRadius: 999, background: 'var(--surface-sunken)', border: '1px solid var(--border-hairline)', overflow: 'hidden', marginBottom: open ? 18 : 0 }}>
        <div style={{ width: pct + '%', height: '100%', background: 'var(--leaf-600)', transition: 'width var(--dur-base) var(--ease-out)' }}></div>
      </div>

      {open ? (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {C.steps.map((s, i) => {
          const st = stateOf(s);
          const last = i === C.steps.length - 1;
          return (
            <div key={s.n} style={{ display: 'flex', gap: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 26, flex: '0 0 auto' }}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', border: `1.5px solid ${DPP_TONE[st]}`, background: st === 'done' ? 'var(--leaf-100)' : st === 'active' ? 'var(--ochre-100)' : 'var(--surface-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-500)' }}>
                  {st === 'done' ? <MMarkDone /> : s.n}
                </div>
                {!last ? <div style={{ flex: 1, width: 0, marginTop: 3, borderLeft: `2px ${st === 'done' ? 'solid var(--leaf-400)' : 'dashed var(--paper-400)'}` }}></div> : null}
              </div>
              <div style={{ flex: 1, minWidth: 0, paddingBottom: last ? 0 : 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--ink-900)' }}>{s.title}</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '0.03em', color: DPP_TONE[st] === 'var(--paper-400)' ? 'var(--ink-400)' : DPP_TONE[st] }}>
                    <HonestyMark state={DPP_MARK[st]} size={12} />{DPP_LABEL[st]}
                  </span>
                  <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--ink-400)', whiteSpace: 'nowrap' }}>{s.owner}</span>
                </div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-700)', lineHeight: 1.45, marginTop: 4, textWrap: 'pretty' }}>{s.task}</div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--ink-500)', lineHeight: 1.45, marginTop: 4, textWrap: 'pretty' }}>{s.detail}</div>
                {editable ? (
                  <button onClick={() => advance(s.n)} style={{ marginTop: 8, border: '1px solid var(--border-hairline)', background: 'var(--surface-card)', cursor: 'pointer', borderRadius: 'var(--radius-pill)', padding: '5px 12px', fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 600, color: 'var(--ink-700)' }}>
                    {st === 'done' ? 'Reset step' : st === 'active' ? 'Mark verified' : 'Start step'}
                  </button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
      ) : null}

    </div>
  );
}
function MMarkDone() {
  return <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M3.5 8.5l3 3 6-7" stroke="var(--leaf-600)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
window.ComplianceChecklist = ComplianceChecklist;
