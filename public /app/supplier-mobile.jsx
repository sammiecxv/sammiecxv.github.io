// ThreadTrace business — MOBILE app version (phone frame, same tab as consumer).
// Factory-floor companion for Marcus: ledger at a glance, scan intake, cert alerts, sync.
// Exports window.SupplierMobileApp.
const { Button: MButton, Input: MInput, Badge: MBadge, Tag: MTag, HonestyMark: MMark } = window.ThreadTraceDesignSystem_f6483d;

const M_NOW = new Date(2026, 6, 1);
function mCertStatus(c) { return c.status; }
function mFmtYM(ym) {
  if (!ym || !/^\d{4}-\d{2}$/.test(ym)) return ym || '';
  const [y, m] = ym.split('-').map(Number);
  return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][m - 1] + ' ' + y;
}
const M_CERT_TYPE = Object.fromEntries(window.TT.certTypes.map((t) => [t.id, t]));

/* ---- bottom sheet (mirrors consumer Sheet) ---- */
function MSheet({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 1100, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(28,24,20,0.38)', backdropFilter: 'blur(1.5px)' }} />
      <div className="tt-sheet" style={{ position: 'relative', background: 'var(--surface-card)', borderTopLeftRadius: 'var(--radius-xl)', borderTopRightRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-xl)', padding: '10px 22px 30px', maxHeight: '88%', overflowY: 'auto' }}>
        <div style={{ width: 40, height: 4, borderRadius: 999, background: 'var(--paper-300)', margin: '0 auto 16px' }} />
        <button onClick={onClose} aria-label="Close" style={{ position: 'absolute', top: 14, right: 16, width: 34, height: 34, borderRadius: '50%', border: '1px solid var(--border-hairline)', background: 'var(--surface-card)', color: 'var(--ink-700)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
        </button>
        {children}
      </div>
    </div>
  );
}

/* ---- business account sheet (mirrors consumer AccountSheet) ---- */
function MAccountSheet({ online, onSignOut }) {
  const certs = window.TT.certs;
  const valid = certs.filter((c) => c.status === 'valid').length;
  return (
    <div>
      <div style={{ marginBottom: 12, fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-400)' }}>Signed in as</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)', padding: '14px 16px', marginBottom: 16 }}>
        <span style={{ width: 42, height: 42, borderRadius: '50%', background: 'var(--ink-900)', color: 'var(--paper-50)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 17, flex: '0 0 auto' }}>MR</span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'block', fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 600, color: 'var(--ink-900)' }}>Marcus Rehnström</span>
          <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-500)', overflow: 'hidden', textOverflow: 'ellipsis' }}>marcus@atelier-nord.com</span>
        </span>
      </div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        {[['Facility', 'Hackney, E8'], ['Certificates', `${valid}/${certs.length} valid`], ['Sync', online ? 'Live' : 'Offline']].map(([l, v]) => (
          <div key={l} style={{ flex: 1, border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)', padding: '10px 11px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-400)', marginBottom: 4 }}>{l}</div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, color: 'var(--ink-900)' }}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-500)', lineHeight: 1.55, marginBottom: 16 }}>
        You're acting as <strong style={{ color: 'var(--ink-800)' }}>Atelier Nord</strong> with scan &amp; read permissions. Full authoring lives in the desktop console.
      </div>
      <MButton variant="secondary" size="lg" fullWidth onClick={onSignOut}>Sign out</MButton>
    </div>
  );
}

/* ---- business explainer sheet (mirrors consumer explain sheet) ---- */
function MHelpSheet({ onClose }) {
  return (
    <div>
      <div style={{ marginBottom: 14 }}><MBadge tone="info">Business companion</MBadge></div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--ink-900)', lineHeight: 1.15, marginBottom: 12 }}>Attest each stage, from the floor.</div>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14.5, color: 'var(--ink-700)', lineHeight: 1.6, marginBottom: 18 }}>
        Scan intake to log IDs against a batch, watch certificate expiries, and keep records synced to the Edge DB — even offline. Every scan is attributed to you, so the passport shows who attested what.
      </div>
      <MButton variant="primary" size="lg" fullWidth onClick={onClose}>Got it</MButton>
    </div>
  );
}

/* ---- sign-in ---- */
function MSignIn({ onIn }) {
  const [signup, setSignup] = React.useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--surface-page)', padding: '0 26px' }}>
      <div style={{ paddingTop: 22 }}><window.AppSwitch current="supplier" /></div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--ink-900)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <img src={(window.__resources && window.__resources.logoMark) || "../assets/logo-mark.svg"} width="28" height="28" style={{ filter: 'invert(1)' }} alt="ThreadTrace" />
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--madder-500)', marginBottom: 6 }}>Business · mobile</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 500, color: 'var(--ink-900)', lineHeight: 1.1, marginBottom: 8 }}>{signup ? 'Create a workspace' : 'Factory-floor companion'}</div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--ink-500)', lineHeight: 1.55, marginBottom: 26 }}>{signup ? 'Register your facility to log intake, track cert expiries, and sync records.' : 'Scan intake, watch cert expiries, keep records synced. From the floor, not the desk.'}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {signup ? <MInput label="Facility / brand" placeholder="Atelier Nord" /> : null}
          <MInput label="Email" placeholder="marcus@atelier-nord.com" defaultValue="marcus@atelier-nord.com" />
          <MInput label="Password" type="password" defaultValue="passport" />
          <MButton variant="primary" size="lg" fullWidth onClick={onIn}>{signup ? 'Create workspace' : 'Sign in'}</MButton>
        </div>
      </div>
      <div style={{ padding: '0 0 26px', textAlign: 'center', fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-500)' }}>
        {signup ? 'Already registered?' : 'No workspace yet?'}{' '}
        <button onClick={() => setSignup(!signup)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700, color: 'var(--indigo-700)' }}>{signup ? 'Sign in' : 'Create a workspace'}</button>
      </div>
    </div>
  );
}

/* ---- operations tools: bulk gen · audit proofs · embroidery export ---- */
function genId() {
  const h = () => Math.floor(Math.random() * 65536).toString(16).toUpperCase().padStart(4, '0');
  return 'DPP·TT–' + h() + '·' + h();
}
function MOpsTools() {
  const [tool, setTool] = React.useState(null);
  const toggle = (t) => setTool((cur) => (cur === t ? null : t));
  // bulk generation
  const [bGarment, setBGarment] = React.useState('');
  const [bCount, setBCount] = React.useState('50');
  const [bIds, setBIds] = React.useState(null);
  const runGen = () => {
    const n = Math.max(1, Math.min(500, parseInt(bCount, 10) || 0));
    setBIds(Array.from({ length: n }, genId));
  };
  // audit proofs
  const [proofs, setProofs] = React.useState([
    { id: 1, name: 'GOTS-scope-2025.pdf', size: '412 KB', state: 'verified' },
    { id: 2, name: 'REACH-SVHC-decl.pdf', size: '188 KB', state: 'verified' },
  ]);
  const pId = React.useRef(3);
  const addProof = () => {
    const names = ['ISO-14021-selfdecl.pdf', 'EN-ISO-3758-carelabel.pdf', 'lab-report-azo.pdf', 'oeko-tex-cert.pdf'];
    const name = names[proofs.length % names.length];
    const np = { id: pId.current++, name, size: (100 + Math.floor(Math.random() * 400)) + ' KB', state: 'checking' };
    setProofs((p) => [np, ...p]);
    setTimeout(() => setProofs((p) => p.map((x) => (x.id === np.id ? { ...x, state: 'verified' } : x))), 1300);
  };
  // embroidery export
  const rows = window.TT.ledger;
  const [expBatch, setExpBatch] = React.useState(rows[0] ? rows[0].batch : '');
  const [expFmt, setExpFmt] = React.useState('svg');
  const [exported, setExported] = React.useState(null);

  const card = { border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)', overflow: 'hidden' };
  const headBtn = (open) => ({ display: 'flex', alignItems: 'center', gap: 11, width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', padding: '13px 14px', textAlign: 'left' });
  const iconWrap = { width: 30, height: 30, borderRadius: 'var(--radius-sm)', flex: '0 0 auto', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-sunken)', color: 'var(--ink-700)' };
  const chevron = (open) => ({ width: 16, height: 16, flex: '0 0 auto', color: 'var(--ink-400)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' });
  const body = { padding: '4px 14px 15px', borderTop: '1px solid var(--border-hairline)' };
  const lbl = { fontFamily: 'var(--font-sans)', fontSize: 13.5, fontWeight: 600, color: 'var(--ink-900)' };
  const sub = { fontFamily: 'var(--font-sans)', fontSize: 11.5, color: 'var(--ink-400)', marginTop: 1 };

  return (
    <div style={{ marginTop: 22 }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-400)', margin: '0 2px 10px' }}>Batch operations · desktop-grade</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

        {/* bulk generation */}
        <div style={card}>
          <button onClick={() => toggle('gen')} aria-expanded={tool === 'gen'} style={headBtn(tool === 'gen')}>
            <span style={iconWrap}><svg width="17" height="17" viewBox="0 0 18 18" fill="none"><rect x="2.5" y="2.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="10.5" y="2.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="2.5" y="10.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/><path d="M13 10.5v5M10.5 13h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg></span>
            <span style={{ flex: 1 }}><span style={lbl}>Bulk batch generation</span><span style={sub}>Mint passport IDs for a production run</span></span>
            <svg viewBox="0 0 16 16" fill="none" style={chevron(tool === 'gen')}><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          {tool === 'gen' ? (
            <div style={body}>
              <MInput label="Garment / style" placeholder="Indigo Field Jacket" value={bGarment} onChange={(e) => setBGarment(e.target.value)} style={{ marginBottom: 10 }} />
              <MInput label="Units in run" mono type="number" value={bCount} onChange={(e) => { setBCount(e.target.value); setBIds(null); }} style={{ marginBottom: 12 }} />
              <MButton variant="primary" fullWidth onClick={runGen}>Generate {Math.max(1, Math.min(500, parseInt(bCount, 10) || 0))} IDs</MButton>
              {bIds ? (
                <div style={{ marginTop: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <MBadge tone="verified" size="sm">{bIds.length} generated</MBadge>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11.5, color: 'var(--ink-400)' }}>{bGarment.trim() || 'Untitled'} · queued to Edge DB</span>
                  </div>
                  <div style={{ maxHeight: 132, overflowY: 'auto', border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-sm)', background: 'var(--surface-page)' }}>
                    {bIds.slice(0, 60).map((id, i) => (
                      <div key={id} style={{ display: 'flex', gap: 8, padding: '6px 10px', borderBottom: i < Math.min(bIds.length, 60) - 1 ? '1px solid var(--border-hairline)' : 'none', fontFamily: 'var(--font-mono)', fontSize: 11 }}>
                        <span style={{ color: 'var(--ink-300)', width: 26, flex: '0 0 auto' }}>{String(i + 1).padStart(3, '0')}</span>
                        <span style={{ color: 'var(--ink-700)' }}>{id}</span>
                      </div>
                    ))}
                    {bIds.length > 60 ? <div style={{ padding: '6px 10px', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-400)' }}>+{bIds.length - 60} more…</div> : null}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        {/* audit proofs */}
        <div style={card}>
          <button onClick={() => toggle('proof')} aria-expanded={tool === 'proof'} style={headBtn(tool === 'proof')}>
            <span style={iconWrap}><svg width="17" height="17" viewBox="0 0 18 18" fill="none"><path d="M9 12V4M6 6.5L9 3.5l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M3.5 11.5v2a1 1 0 001 1h9a1 1 0 001-1v-2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg></span>
            <span style={{ flex: 1 }}><span style={lbl}>Upload auditing proofs</span><span style={sub}>{proofs.length} on file · attach verified certificates</span></span>
            <svg viewBox="0 0 16 16" fill="none" style={chevron(tool === 'proof')}><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          {tool === 'proof' ? (
            <div style={body}>
              <button onClick={addProof} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, width: '100%', minHeight: 84, border: '1.5px dashed var(--paper-400)', borderRadius: 'var(--radius-md)', background: 'var(--surface-page)', cursor: 'pointer', marginBottom: 12 }}>
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" style={{ color: 'var(--ink-400)' }}><path d="M11 15V5M7 8.5L11 4.5l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 14v2.5a1 1 0 001 1h12a1 1 0 001-1V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, color: 'var(--ink-700)' }}>Drop a PDF or tap to upload</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-300)', letterSpacing: '0.04em' }}>MOCKED · adds a sample proof</span>
              </button>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {proofs.map((p) => (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 11px', border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-sm)', background: 'var(--surface-page)' }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: 'var(--madder-500)', flex: '0 0 auto' }}><path d="M4 1.5h5l3 3v10a0 0 0 010 0H4a0 0 0 010 0V1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M9 1.5v3h3" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>
                    <span style={{ flex: 1, minWidth: 0 }}><span style={{ display: 'block', fontFamily: 'var(--font-sans)', fontSize: 12.5, fontWeight: 600, color: 'var(--ink-800)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</span><span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--ink-400)' }}>{p.size}</span></span>
                    {p.state === 'verified' ? <MBadge tone="verified" size="sm">verified</MBadge> : <MBadge tone="pending" size="sm">checking…</MBadge>}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {/* embroidery export */}
        <div style={card}>
          <button onClick={() => toggle('exp')} aria-expanded={tool === 'exp'} style={headBtn(tool === 'exp')}>
            <span style={iconWrap}><svg width="17" height="17" viewBox="0 0 18 18" fill="none"><path d="M3 9c3-4 9-4 12 0-3 4-9 4-12 0z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><circle cx="9" cy="9" r="1.6" stroke="currentColor" strokeWidth="1.3"/></svg></span>
            <span style={{ flex: 1 }}><span style={lbl}>Export embroidery blueprint</span><span style={sub}>Vector .SVG / .DST for the QR tag</span></span>
            <svg viewBox="0 0 16 16" fill="none" style={chevron(tool === 'exp')}><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          {tool === 'exp' ? (
            <div style={body}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500, letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase', color: 'var(--ink-500)', margin: '8px 0 8px' }}>Batch</div>
              <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 14 }}>
                {rows.map((r) => {
                  const on = expBatch === r.batch;
                  return <button key={r.batch} onClick={() => { setExpBatch(r.batch); setExported(null); }} style={{ border: `1.5px solid ${on ? 'var(--indigo-400)' : 'var(--paper-400)'}`, background: on ? 'var(--indigo-100)' : 'var(--surface-card)', color: on ? 'var(--indigo-700)' : 'var(--ink-500)', cursor: 'pointer', borderRadius: 999, padding: '6px 11px', fontFamily: 'var(--font-mono)', fontSize: 11.5, fontWeight: on ? 600 : 500 }}>{r.batch}</button>;
                })}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500, letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase', color: 'var(--ink-500)', marginBottom: 8 }}>Format</div>
              <div style={{ display: 'flex', gap: 7, marginBottom: 14 }}>
                {[['svg', '.SVG vector'], ['dst', '.DST stitch'], ['pes', '.PES stitch']].map(([f, label]) => {
                  const on = expFmt === f;
                  return <button key={f} onClick={() => { setExpFmt(f); setExported(null); }} style={{ border: `1.5px solid ${on ? 'var(--indigo-400)' : 'var(--paper-400)'}`, background: on ? 'var(--indigo-100)' : 'var(--surface-card)', color: on ? 'var(--indigo-700)' : 'var(--ink-500)', cursor: 'pointer', borderRadius: 999, padding: '6px 11px', fontFamily: 'var(--font-sans)', fontSize: 12.5, fontWeight: on ? 600 : 500 }}>{label}</button>;
                })}
              </div>
              <MButton variant="primary" fullWidth onClick={() => setExported({ batch: expBatch, fmt: expFmt })}>Export blueprint</MButton>
              {exported ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12, padding: '11px 13px', border: '1px solid var(--leaf-600)', borderRadius: 'var(--radius-md)', background: 'var(--leaf-100)' }}>
                  <span style={{ fontSize: 15, lineHeight: 1 }}>↓</span>
                  <span style={{ flex: 1, fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-700)', lineHeight: 1.4 }}>Exported <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--ink-900)' }}>tt-{exported.batch}-tag.{exported.fmt}</span> — ready for the embroidery machine.</span>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

      </div>
    </div>
  );
}

/* ---- ledger tab ---- */
function MLedger({ pendingSync, drafts, onGoScan, onGoNew }) {
  const rows = [...(drafts || []), ...window.TT.ledger];
  const { STATUS_LABEL, STATUS_TONE } = window.TT;
  const expiring = window.TT.certs.filter((c) => c.status !== 'valid');
  const [query, setQuery] = React.useState('');
  const [statusF, setStatusF] = React.useState('all');
  const LED = {
    published: { label: 'Live', dot: 'var(--leaf-600)', fg: 'var(--leaf-700)', bg: 'var(--leaf-100)' },
    draft:     { label: 'Draft', dot: 'var(--ink-300)', fg: 'var(--ink-500)', bg: 'var(--surface-sunken)' },
    awaiting:  { label: 'Awaiting', dot: 'var(--ochre-500)', fg: 'var(--ochre-600)', bg: 'var(--ochre-100)' },
  };
  const q = query.trim().toLowerCase();
  const filtered = rows.filter((r) => (statusF === 'all' || r.status === statusF) && (!q || r.garment.toLowerCase().includes(q) || (r.sku || '').toLowerCase().includes(q) || String(r.batch).includes(q)));
  const fchips = [['all', 'All'], ['published', 'Live'], ['draft', 'Draft'], ['awaiting', 'Awaiting']];
  return (
    <div style={{ padding: '18px 16px 24px' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--ink-900)', marginBottom: 4 }}>Products</div>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-500)', marginBottom: 16 }}>Atelier Nord · your garment collection</div>

      {drafts && drafts.length ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 13px', border: '1px solid var(--leaf-600)', borderRadius: 'var(--radius-md)', background: 'var(--leaf-100)', marginBottom: 14 }}>
          <span style={{ fontSize: 15, lineHeight: 1 }}>✓</span>
          <span style={{ flex: 1, fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-700)', lineHeight: 1.4 }}>
            {drafts.length} new {drafts.length === 1 ? 'record' : 'records'} added this session, saved as drafts.
          </span>
        </div>
      ) : null}

      {expiring.length && false ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 13px', border: '1px solid var(--ochre-500)', borderRadius: 'var(--radius-md)', background: 'var(--ochre-100)', marginBottom: 14 }}>
          <span style={{ fontSize: 15, lineHeight: 1 }}>⏳</span>
          <span style={{ flex: 1, fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-700)', lineHeight: 1.4 }}>
            {expiring.length} {expiring.length === 1 ? 'certificate needs' : 'certificates need'} attention. Checked claims lapse without them.
          </span>
        </div>
      ) : null}

      {/* search + status filter */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)', marginBottom: 10 }}>
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ color: 'var(--ink-400)', flex: '0 0 auto' }}><circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.4" /><path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search garment, SKU or batch" style={{ flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'var(--font-sans)', fontSize: 13.5, color: 'var(--ink-900)' }} />
        {query ? <button onClick={() => setQuery('')} aria-label="Clear search" style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--ink-400)', padding: 2, display: 'inline-flex', flex: '0 0 auto' }}><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3.5 3.5l7 7M10.5 3.5l-7 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg></button> : null}
      </div>
      <div style={{ display: 'flex', gap: 7, marginBottom: 14 }}>
        {fchips.map(([k, l]) => { const on = statusF === k; return (
          <button key={k} onClick={() => setStatusF(k)} style={{ flex: 1, minHeight: 32, border: '1px solid ' + (on ? 'var(--ink-900)' : 'var(--border-hairline)'), background: on ? 'var(--ink-900)' : 'transparent', color: on ? 'var(--paper-50)' : 'var(--ink-500)', cursor: 'pointer', borderRadius: 999, fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 600 }}>{l}</button>
        ); })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {filtered.map((r, i) => {
          const st = LED[r.status] || LED.draft;
          const sw = ['#3B4A78', '#6E5A9C', '#4E6B52', '#9C5A52', '#8B6D4B'][i % 5];
          const hon = r.honesty;
          const tone = hon == null ? 'var(--ink-300)' : hon >= 80 ? 'var(--leaf-600)' : hon >= 40 ? 'var(--ochre-500)' : 'var(--madder-500)';
          return (
            <button key={r.batch} onClick={onGoNew} style={{ textAlign: 'left', padding: 0, border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)', overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'relative', height: 92, background: `linear-gradient(150deg, ${sw}, color-mix(in oklab, ${sw} 62%, #000))` }}>
                <image-slot id={'mbiz-prod-' + r.batch} shape="rect" placeholder=" "></image-slot>
                <span style={{ position: 'absolute', top: 8, left: 8, display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 8px', borderRadius: 999, background: st.bg }}>
                  <span style={{ width: 6, height: 6, borderRadius: 999, background: st.dot }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.05em', textTransform: 'uppercase', color: st.fg }}>{st.label}</span>
                </span>
              </div>
              <div style={{ padding: '9px 11px 11px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: 'var(--ink-900)', lineHeight: 1.15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.garment}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-400)', marginTop: 3, letterSpacing: '0.02em' }}>{r.sku ? r.sku + ' · ' : ''}#{r.batch}</div>
                </div>
                <div style={{ marginTop: 'auto' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--ink-400)' }}>Honesty</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, color: tone }}>{hon == null ? '—' : hon + '%'}</span>
                  </div>
                  <div style={{ height: 4, borderRadius: 999, background: 'var(--paper-300)', overflow: 'hidden' }}>
                    <div style={{ width: (hon || 0) + '%', height: '100%', background: tone, borderRadius: 999 }} />
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: pendingSync.includes(r.batch) ? 'var(--ochre-600)' : 'var(--ink-300)', marginTop: 6, textTransform: pendingSync.includes(r.batch) ? 'uppercase' : 'none', letterSpacing: '0.03em' }}>{pendingSync.includes(r.batch) ? 'pending sync' : r.updated}</div>
                </div>
              </div>
            </button>
          );
        })}
        {filtered.length === 0 ? <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '26px 0', fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-400)' }}>No products match.</div> : null}
      </div>

      <MOpsTools />

      <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
        <button onClick={onGoNew} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flex: 1, minHeight: 48, border: '1px solid var(--ink-900)', cursor: 'pointer', borderRadius: 999, background: 'transparent', color: 'var(--ink-900)', fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
          New record
        </button>
        <button onClick={onGoScan} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flex: 1, minHeight: 48, border: 'none', cursor: 'pointer', borderRadius: 999, background: 'var(--madder-500)', color: 'var(--paper-50)', fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          <svg width="15" height="15" viewBox="0 0 14 14" fill="none"><path d="M2 2h3v3H2zM9 2h3v3H9zM2 9h3v3H2z" stroke="currentColor" strokeWidth="1.2" /><path d="M9 9h1.5v1.5H9zM12 9v3M9 12h3" stroke="currentColor" strokeWidth="1.2" /></svg>
          Scan
        </button>
      </div>
    </div>
  );
}

/* ---- scan tab (mirrors consumer camera gateway) ---- */
function MCorner({ pos }) {
  const base = { position: 'absolute', width: 30, height: 30, borderColor: 'var(--paper-50)', borderStyle: 'solid', borderWidth: 0 };
  const map = {
    tl: { top: 16, left: 16, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 8 },
    tr: { top: 16, right: 16, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 8 },
    bl: { bottom: 16, left: 16, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 8 },
    br: { bottom: 16, right: 16, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 8 },
  };
  return <span style={{ ...base, ...map[pos] }} />;
}
function MQRTag() {
  return (
    <div style={{ width: 150, height: 190, borderRadius: 8, background: 'linear-gradient(150deg,#3a3229,#241f19)', boxShadow: '0 14px 34px rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 84, height: 84, borderRadius: 4, background: 'var(--paper-50)', padding: 8, boxSizing: 'border-box' }}>
        <div style={{ width: '100%', height: '100%', borderRadius: 2, opacity: 0.9, backgroundImage: 'repeating-linear-gradient(0deg,#1C1814 0 4px,transparent 4px 8px),repeating-linear-gradient(90deg,#1C1814 0 4px,transparent 4px 8px)' }} />
      </div>
    </div>
  );
}
function MScan({ online, queue, onScan }) {
  return (
    <div style={{ padding: '18px 16px 24px', display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--ink-900)', marginBottom: 2 }}>Scan intake</div>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-500)', marginBottom: 16 }}>Inbound pallets · Batch 0044 · Denim Apron</div>

      <div style={{ position: 'relative', height: 300, borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'linear-gradient(165deg,#26313f,#171e28 60%,#12171f)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-md)' }}>
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(250,248,243,0.09) 1px,transparent 1px),linear-gradient(90deg,rgba(250,248,243,0.09) 1px,transparent 1px)', backgroundSize: '34px 34px' }} />
        <div aria-hidden="true" className="tt-track" style={{ position: 'absolute', width: 168, height: 168, border: '1.5px solid rgba(112,196,140,0.55)', borderRadius: 10 }}>
          <span style={{ position: 'absolute', top: '50%', left: -10, right: -10, height: 1, background: 'rgba(112,196,140,0.4)' }} />
          <span style={{ position: 'absolute', left: '50%', top: -10, bottom: -10, width: 1, background: 'rgba(112,196,140,0.4)' }} />
        </div>
        <MQRTag />
        <MCorner pos="tl" /><MCorner pos="tr" /><MCorner pos="bl" /><MCorner pos="br" />
        <div style={{ position: 'absolute', top: 14, left: 0, right: 0, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(250,248,243,0.5)' }}>Live camera · edge tracking</div>
        <div style={{ position: 'absolute', bottom: 14, left: 0, right: 0, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.04em', color: 'rgba(250,248,243,0.45)' }}>+137 IDs per pallet · MOCKED</div>
      </div>

      <div style={{ marginTop: 16 }}>
        <MButton variant="primary" size="lg" fullWidth onClick={onScan}
          leadingIcon={<svg width="19" height="19" viewBox="0 0 22 22" fill="none"><path d="M2 7V4a2 2 0 012-2h3M20 7V4a2 2 0 00-2-2h-3M2 15v3a2 2 0 002 2h3M20 15v3a2 2 0 01-2 2h-3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /><path d="M6 11h10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>}>
          Scan pallet to attest
        </MButton>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12, padding: '13px 14px', border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)' }}>
        <span style={{ width: 9, height: 9, borderRadius: 999, background: online ? 'var(--leaf-600)' : 'var(--ochre-500)', flex: '0 0 auto' }}></span>
        <span style={{ flex: 1, fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-700)' }}>{online ? 'Live. Scans sync instantly' : 'Offline. Scans buffer locally'}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: queue ? 'var(--ochre-600)' : 'var(--ink-400)' }}>{queue ? `${queue} queued` : 'clear'}</span>
      </div>
    </div>
  );
}

/* ---- certs tab ---- */
function MCerts() {
  const certs = window.TT.certs;
  const { CERT_STATUS } = window.TT;
  const cov = window.TT.standardsCoverage;
  const covColor = { checked: 'var(--leaf-600)', told: 'var(--ochre-500)', notyet: 'var(--paper-400)' };
  return (
    <div style={{ padding: '18px 16px 24px' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--ink-900)', marginBottom: 2 }}>Certificates</div>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-500)', marginBottom: 16 }}>Mapped &amp; standardised. Expiries watched.</div>

      {/* standards coverage — CE / UKCA / EN / ISO */}
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-400)', margin: '0 2px 8px' }}>Standards coverage</div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
        {cov.map((s) => (
          <div key={s.code} style={{ flex: 1, border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)', padding: '10px 6px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: 'var(--ink-900)' }}>{s.code}</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: covColor[s.state], flex: '0 0 auto' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8.5, color: 'var(--ink-400)', letterSpacing: '0.03em' }}>{s.state === 'checked' ? 'Mapped' : 'Partial'}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {certs.map((c) => {
          const t = M_CERT_TYPE[c.type];
          const s = CERT_STATUS[c.status];
          const std = window.TT.certStandards[c.type] || [];
          return (
            <div key={c.id} style={{ border: `1px solid ${c.status === 'valid' ? 'var(--border-hairline)' : 'var(--ochre-500)'}`, borderRadius: 'var(--radius-md)', background: 'var(--surface-card)', padding: '12px 13px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: 14.5, fontWeight: 600, color: 'var(--ink-900)' }}>{t.name}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--ink-400)' }}>{c.ref}</span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--ink-500)', marginTop: 2 }}>{c.issuer} · expires {mFmtYM(c.expires)}</div>
                </div>
                <MBadge tone={s.tone} size="sm">{s.label}</MBadge>
              </div>
              {std.length ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--ink-400)', marginRight: 2 }}>Maps to</span>
                  {std.map((x) => <MTag key={x}>{x}</MTag>)}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---- profile tab ---- */
const MACCT_SVG = { width: 26, height: 26, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true', focusable: 'false' };
const MACCT_ICON = {
  user: <svg {...MACCT_SVG}><circle cx="12" cy="8" r="3.4" /><path d="M5 20c1.2-3.4 4-5 7-5s5.8 1.6 7 5" /></svg>,
  building: <svg {...MACCT_SVG}><rect x="5" y="3" width="14" height="18" rx="1.5" /><path d="M9 7h1M14 7h1M9 11h1M14 11h1M9 15h1M14 15h1" /><path d="M10 21v-3h4v3" /></svg>,
  shield: <svg {...MACCT_SVG}><path d="M12 3l7 3v5c0 4.2-2.9 7.5-7 9-4.1-1.5-7-4.8-7-9V6l7-3z" /><path d="M9 12l2 2 4-4" /></svg>,
  people: <svg {...MACCT_SVG}><circle cx="9" cy="8" r="3" /><path d="M2.8 20c1-3.1 3.4-4.6 6.2-4.6" /><circle cx="16.6" cy="9" r="2.4" /><path d="M14.8 20c.5-2.6 2.5-4 4.9-4" /></svg>,
  sync: <svg {...MACCT_SVG}><path d="M19.5 12a7.5 7.5 0 11-2.1-5.2" /><path d="M18 3v4h-4" /></svg>,
  bell: <svg {...MACCT_SVG}><path d="M12 4a5 5 0 00-5 5v2.8L5.5 15h13L17 11.8V9a5 5 0 00-5-5z" /><path d="M10 19a2 2 0 004 0" /></svg>,
  eyeOff: <svg {...MACCT_SVG}><path d="M3 3l18 18" /><path d="M10.6 10.7a2 2 0 002.7 2.8" /><path d="M6.6 6.7C4.7 7.9 3 9.8 2 12c1.8 4 5.5 6 10 6 1.5 0 2.9-.3 4.2-.8" /><path d="M9.9 5.2A9.9 9.9 0 0112 5c4.5 0 8.2 2 10 6a13 13 0 01-2.4 3.3" /></svg>,
  doc: <svg {...MACCT_SVG}><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 8h6M9 12h6M9 16h4" /></svg>,
  chat: <svg {...MACCT_SVG}><path d="M5 5h14a1 1 0 011 1v8a1 1 0 01-1 1H9l-4 4V6a1 1 0 011-1z" /></svg>,
  logout: <svg {...MACCT_SVG}><path d="M15 4h3.5A1.5 1.5 0 0120 5.5v13a1.5 1.5 0 01-1.5 1.5H15" /><path d="M10 8l-4 4 4 4" /><path d="M6 12h9" /></svg>,
};
function MAcctCard({ icon, title, sub, tone, note, onClick }) {
  const danger = tone === 'danger';
  const label = title + '. ' + sub + (note ? '. Status ' + note.label : '');
  return (
    <button className="tt-acct-card" onClick={onClick} aria-label={label} style={{ textAlign: 'left', cursor: 'pointer', border: danger ? '1px solid var(--madder-400)' : '1px solid var(--border-hairline)', background: 'var(--surface-card)', borderRadius: 'var(--radius-lg)', padding: '15px 15px 16px', display: 'flex', flexDirection: 'column', minHeight: 120, position: 'relative' }}>
      <span aria-hidden="true" style={{ color: danger ? 'var(--madder-600)' : 'var(--ink-700)', marginBottom: 14, display: 'inline-flex' }}>{icon}</span>
      {note ? <span aria-hidden="true" style={{ position: 'absolute', top: 17, right: 15, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-700)', display: 'inline-flex', alignItems: 'center', gap: 5 }}><span style={{ width: 8, height: 8, borderRadius: 999, background: note.live ? 'var(--leaf-600)' : 'var(--ochre-500)' }}></span>{note.label}</span> : null}
      <span style={{ fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 600, color: danger ? 'var(--madder-600)' : 'var(--ink-900)', marginBottom: 4 }}>{title}</span>
      <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, lineHeight: 1.45, color: 'var(--ink-700)', textWrap: 'pretty' }}>{sub}</span>
    </button>
  );
}
function MProfile({ online, onSignOut, inSheet }) {
  const certs = window.TT.certs;
  const valid = certs.filter((c) => c.status === 'valid').length;
  const attention = certs.length - valid;
  const grid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 };
  return (
    <div style={{ padding: inSheet ? '2px 0 6px' : '18px 16px 24px' }}>
      <style>{`.tt-acct-card{transition:border-color .12s,box-shadow .12s}.tt-acct-card:hover{border-color:var(--ink-300)}.tt-acct-card:focus-visible{outline:3px solid var(--indigo-500);outline-offset:2px;border-color:var(--indigo-500)}`}</style>
      <h2 style={{ textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, color: 'var(--ink-900)', margin: '0 0 14px' }}>My Account</h2>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, marginBottom: 22 }}>
        <span aria-hidden="true" style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--ink-900)', color: 'var(--paper-50)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 18 }}>MR</span>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 600, color: 'var(--ink-900)' }}>Marcus Rehnström</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-700)' }}>Floor lead · Atelier Nord</span>
      </div>
      <div style={grid} role="list">
        <MAcctCard icon={MACCT_ICON.user} title="My profile" sub="Role, identity &amp; contact" />
        <MAcctCard icon={MACCT_ICON.building} title="Facility" sub="Hackney studio · Tier 1 assembly" />
        <MAcctCard icon={MACCT_ICON.shield} title="Certificates" sub={`${valid} valid · ${attention} on watch`} />
        <MAcctCard icon={MACCT_ICON.people} title="Team &amp; roles" sub="Members and permissions" />
      </div>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 400, color: 'var(--ink-900)', margin: '24px 0 12px' }}>Settings</h3>
      <div style={grid} role="list">
        <MAcctCard icon={MACCT_ICON.sync} title="Edge DB sync" sub={`Local records · ${window.TT.ledger.length} batches`} note={{ live: online, label: online ? 'live' : 'offline' }} />
        <MAcctCard icon={MACCT_ICON.bell} title="Notifications" sub="Cert expiry &amp; recall alerts" />
        <MAcctCard icon={MACCT_ICON.eyeOff} title="Privacy &amp; data" sub="How supplier data is handled" />
        <MAcctCard icon={MACCT_ICON.doc} title="Terms of Service" sub="Read the legal detail" />
        <MAcctCard icon={MACCT_ICON.chat} title="Help &amp; support" sub="Docs and customer care" />
        <MAcctCard icon={MACCT_ICON.logout} title="Sign out" sub="End this session on device" tone="danger" onClick={onSignOut} />
      </div>
      <div style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-400)', marginTop: 20 }}>ThreadTrace · Atelier v1.0 · desktop console for full authoring</div>
    </div>
  );
}

/* ---- supply chain tab (mirrors desktop console: stage strip + tiered lineage) ---- */
function MChain({ onViewPassport }) {
  const stages = window.TT.chainStages;
  const L = window.TT.lineage;
  const stateColor = { checked: 'var(--leaf-600)', told: 'var(--ochre-500)', notyet: 'var(--paper-400)' };
  const markState = (s) => (s === 'checked' ? 'checked' : s === 'told' || s === 'pending' ? 'told' : 'notyet');
  const [signed, setSigned] = React.useState({});
  const parentState = (p) => (signed[p.id] ? 'checked' : p.state);

  return (
    <div style={{ padding: '18px 16px 24px' }}>
      {/* style header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--ink-900)' }}>Supply chain</span>
        <MBadge tone="verified" size="sm">Active</MBadge>
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--ink-500)', marginBottom: 16 }}>{L.child.title} · {L.child.id}</div>

      {/* stage pipeline strip */}
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-400)', margin: '0 2px 10px' }}>Production stages</div>
      <div className="tt-tabrow" style={{ display: 'flex', gap: 0, overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch', paddingBottom: 6, marginBottom: 20 }}>
        {stages.map((st, i) => (
          <div key={st.id} style={{ display: 'flex', alignItems: 'flex-start', flex: '0 0 auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 74 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', border: `2px solid ${stateColor[st.state]}`, background: 'var(--surface-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                <MMark state={markState(st.state)} size={18} />
              </div>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 10.5, fontWeight: 600, color: 'var(--ink-800)', marginTop: 7, textAlign: 'center', lineHeight: 1.2 }}>{st.label}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8.5, color: 'var(--ink-400)', marginTop: 2, textAlign: 'center', lineHeight: 1.15 }}>{st.supplier}</span>
            </div>
            {i < stages.length - 1 ? <div style={{ width: 14, height: 2, background: 'var(--paper-300)', marginTop: 19, flex: '0 0 auto' }} /> : null}
          </div>
        ))}
      </div>

      {/* tiered supplier lineage */}
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-400)', margin: '0 2px 10px' }}>Upstream suppliers</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {L.parents.map((p) => {
          const stt = parentState(p);
          return (
            <div key={p.id} style={{ border: `1px solid ${stt === 'checked' ? 'var(--border-hairline)' : 'var(--ochre-500)'}`, borderRadius: 'var(--radius-md)', background: 'var(--surface-card)', padding: '12px 13px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <MMark state={markState(stt)} size={20} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14.5, fontWeight: 600, color: 'var(--ink-900)' }}>{p.supplier}</div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--ink-500)', marginTop: 1 }}>{p.material} · {p.tier}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
                <MTag>{p.cert}</MTag>
                {stt === 'checked'
                  ? <MBadge tone="verified" size="sm" style={{ marginLeft: 'auto' }}>Co-signed</MBadge>
                  : <button onClick={() => setSigned((s) => ({ ...s, [p.id]: true }))} style={{ marginLeft: 'auto', border: 'none', cursor: 'pointer', borderRadius: 'var(--radius-md)', background: 'var(--brand)', color: 'var(--paper-50)', padding: '6px 12px', fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 600 }}>Co-sign</button>}
              </div>
            </div>
          );
        })}
      </div>

      {/* assembler / factory node */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '6px 0' }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2v12M4 10l4 4 4-4" stroke="var(--ink-300)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
      <div style={{ border: '1.5px solid var(--indigo-400)', borderRadius: 'var(--radius-md)', background: 'var(--indigo-100)', padding: '13px 14px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--indigo-700)', marginBottom: 3 }}>{L.child.tier}</div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 600, color: 'var(--ink-900)' }}>{L.child.maker}</div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-600)', marginTop: 1 }}>{L.child.title} · {L.child.sub}</div>
      </div>

      <button onClick={onViewPassport} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', marginTop: 16, minHeight: 46, border: '1px solid var(--ink-900)', cursor: 'pointer', borderRadius: 'var(--radius-md)', background: 'transparent', color: 'var(--ink-900)', fontFamily: 'var(--font-sans)', fontSize: 13.5, fontWeight: 600 }}>
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><rect x="3" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" /><rect x="11" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" /><rect x="3" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" /><path d="M11 11h3v3M17 11v6M14 17h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
        View garment passport
      </button>
    </div>
  );
}

/* ---- DPP record tab (product info, composition, chemical safety, compliance, sustainability) ---- */
function MSection({ title, open, onToggle, children }) {
  return (
    <div style={{ border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)', overflow: 'hidden' }}>
      <button onClick={onToggle} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left', border: 'none', background: 'transparent', cursor: 'pointer', padding: '13px 14px' }}>
        <span style={{ flex: 1, fontFamily: 'var(--font-sans)', fontSize: 14.5, fontWeight: 600, color: 'var(--ink-900)' }}>{title}</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .15s', color: 'var(--ink-400)', flex: '0 0 auto' }}><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      {open ? <div style={{ padding: '0 14px 15px', borderTop: '1px solid var(--border-hairline)' }}>{children}</div> : null}
    </div>
  );
}

function MRecord({ onGoChain, onGoCerts, onViewPassport }) {
  const P = window.TT.passport;
  const [story, setStory] = React.useState({
    headline: 'A hoodie that keeps its receipts',
    intro: 'Cut, sewn and finished by a small knit atelier in Portugal, the 365 is the everyday layer this passport is built around — ring-spun organic cotton blended with post-consumer wool, dyed and washed to soften with wear rather than wear out. This is its story, in order, from raw fibre to your keeping.',
  });
  const [chapters, setChapters] = React.useState([
    { id: 'c1', tag: '01', title: 'Where the fibre began', place: 'Covilhã, Portugal · 2025', body: 'Organic cotton spun at Fiação Beira, blended with post-consumer wool reclaimed from Prato. No virgin synthetics in the main body.', media: { photo: 3, audio: 1, video: 0 } },
    { id: 'c2', tag: '02', title: 'Knitted & cut', place: 'Porto atelier · 2025', body: 'Knitted to a 320 GSM loopback, then cut and sewn into a hooded, kangaroo-pouch body with ribbed cuffs and hem.', media: { photo: 5, audio: 0, video: 1 } },
    { id: 'c3', tag: '03', title: 'Finishing & the odour treatment', place: 'Porto atelier · 2025', body: 'Garment-washed for softness and finished with a peppermint-oil odour-control treatment so it needs washing less often.', media: { photo: 2, audio: 0, video: 0 } },
    { id: 'c4', tag: '∞', title: 'In your keeping', place: 'ongoing', body: 'The last chapter is unwritten. Repairs, re-wears and the next owner get added here as they happen.', media: { photo: 0, audio: 0, video: 0 }, open: true },
  ]);
  const setField = (k, v) => setStory((s) => ({ ...s, [k]: v }));
  const setChapter = (i, k, v) => setChapters((cs) => cs.map((c, idx) => idx === i ? { ...c, [k]: v } : c));
  const addMedia = (i, m) => setChapters((cs) => cs.map((c, idx) => idx === i ? { ...c, media: { ...c.media, [m]: (c.media[m] || 0) + 1 } } : c));
  const addChapter = () => setChapters((cs) => {
    const openIdx = cs.findIndex((c) => c.open);
    const n = String(cs.filter((c) => !c.open).length + 1).padStart(2, '0');
    const fresh = { id: 'c' + Date.now(), tag: n, title: '', place: '', body: '', media: { photo: 0, audio: 0, video: 0 } };
    if (openIdx === -1) return [...cs, fresh];
    return [...cs.slice(0, openIdx), fresh, ...cs.slice(openIdx)];
  });

  const MEDIA = {
    photo: { label: 'Photo', icon: <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="3" width="13" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3" /><circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.3" /><path d="M5 3l1-1.5h4L11 3" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg> },
    audio: { label: 'Audio', icon: <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><rect x="6" y="1.5" width="4" height="8" rx="2" stroke="currentColor" strokeWidth="1.3" /><path d="M3.5 7.5a4.5 4.5 0 009 0M8 12v2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg> },
    video: { label: 'Video', icon: <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="4" width="9" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3" /><path d="M10.5 7l4-2v6l-4-2" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg> },
  };
  const miniLabel = { fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-400)', display: 'block', marginBottom: 6 };
  const serif = { width: '100%', border: 'none', outline: 'none', background: 'transparent', fontFamily: 'var(--font-display)', color: 'var(--ink-900)', resize: 'none', display: 'block', padding: 0 };

  return (
    <div style={{ padding: '18px 16px 28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--ink-900)' }}>Brand story</span>
        <MBadge tone="verified" size="sm">Draft</MBadge>
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--ink-500)', marginBottom: 16 }}>Story Book · {P.serial}</div>

      <div style={{ display: 'flex', gap: 9, alignItems: 'flex-start', padding: '11px 13px', border: '1px dashed var(--paper-400)', borderRadius: 'var(--radius-md)', background: 'var(--paper-100)', marginBottom: 18 }}>
        <svg width="15" height="15" viewBox="0 0 18 18" fill="none" style={{ flex: '0 0 auto', marginTop: 1, color: 'var(--madder-500)' }}><path d="M4 2.5h7l3 3V15.5H4z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /><path d="M6.5 8h5M6.5 11h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-600)', lineHeight: 1.5 }}>This is your brand's voice. Write the garment's story in order — it becomes the Story Book a buyer reads on the passport.</span>
      </div>

      {/* deep, linear typography — headline + intro */}
      <div style={{ border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)', padding: '20px 18px', marginBottom: 18 }}>
        <label style={{ ...miniLabel, color: 'var(--madder-500)' }}>The story headline</label>
        <textarea value={story.headline} onChange={(e) => setField('headline', e.target.value)} rows={2} placeholder="One line that opens the story…" style={{ ...serif, fontSize: 25, fontWeight: 500, lineHeight: 1.14, letterSpacing: '-0.02em', marginBottom: 16 }} />
        <label style={miniLabel}>Opening narrative</label>
        <textarea value={story.intro} onChange={(e) => setField('intro', e.target.value)} rows={6} placeholder="Set the scene — who made it, where, and why it matters…" style={{ ...serif, fontWeight: 300, fontSize: 16, lineHeight: 1.6, color: 'var(--ink-700)' }} />
      </div>

      {/* interactive production timeline */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, margin: '2px 0 12px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 500, color: 'var(--ink-900)', margin: 0 }}>Production timeline</h2>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-400)' }}>fibre to keeping</span>
      </div>
      <div style={{ position: 'relative', paddingLeft: 30 }}>
        <span style={{ position: 'absolute', left: 12, top: 6, bottom: 6, width: 2, background: 'var(--paper-300)' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {chapters.map((c, i) => (
            <div key={c.id} style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: -30, top: 18, width: 26, height: 26, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 10.5, fontWeight: 600, background: c.open ? 'var(--surface-card)' : 'var(--ink-900)', color: c.open ? 'var(--ink-400)' : 'var(--paper-50)', border: c.open ? '1.5px dashed var(--paper-400)' : 'none', boxShadow: '0 0 0 4px var(--surface-page)' }}>{c.tag}</span>
              <div style={{ border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)', padding: '15px 15px' }}>
                <input value={c.title} onChange={(e) => setChapter(i, 'title', e.target.value)} placeholder="Chapter title" style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 500, color: 'var(--ink-900)', marginBottom: 3, padding: 0 }} />
                <input value={c.place} onChange={(e) => setChapter(i, 'place', e.target.value)} placeholder="Place · date" style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.04em', color: 'var(--ink-400)', padding: 0 }} />
                <textarea value={c.body} onChange={(e) => setChapter(i, 'body', e.target.value)} rows={2} placeholder="Tell this part of the story…" style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', resize: 'vertical', fontFamily: 'var(--font-sans)', fontSize: 13.5, lineHeight: 1.55, color: 'var(--ink-700)', marginTop: 10, borderTop: '1px solid var(--border-hairline)', paddingTop: 11 }} />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 11 }}>
                  {['photo', 'audio', 'video'].map((m) => {
                    const n = c.media[m] || 0;
                    return (
                      <button key={m} onClick={() => addMedia(i, m)} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, minHeight: 34, padding: '0 11px', borderRadius: 999, cursor: 'pointer', border: `1px solid ${n ? 'var(--indigo-400)' : 'var(--paper-400)'}`, background: n ? 'var(--indigo-100)' : 'var(--surface-card)', color: n ? 'var(--indigo-700)' : 'var(--ink-500)', fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: n ? 600 : 500 }}>
                        {MEDIA[m].icon}{MEDIA[m].label}{n ? <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>{n}</span> : <span style={{ fontSize: 14, lineHeight: 1 }}>＋</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button onClick={addChapter} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, width: '100%', minHeight: 46, marginTop: 14, border: '1px dashed var(--paper-400)', borderRadius: 'var(--radius-md)', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 13.5, fontWeight: 600, color: 'var(--ink-700)' }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
        Add a chapter
      </button>

      <button onClick={onViewPassport} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', marginTop: 12, minHeight: 48, border: 'none', cursor: 'pointer', borderRadius: 'var(--radius-md)', background: 'var(--brand)', color: 'var(--paper-50)', fontFamily: 'var(--font-sans)', fontSize: 13.5, fontWeight: 600 }}>
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M2 10s3-5.5 8-5.5S18 10 18 10s-3 5.5-8 5.5S2 10 2 10z" stroke="currentColor" strokeWidth="1.5" /><circle cx="10" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.5" /></svg>
        Preview story on passport
      </button>
    </div>
  );
}

/* ---- new item / logistics intake tab ---- */
const M_MODES = [
  ['Sea', <svg key="i" width="15" height="15" viewBox="0 0 20 20" fill="none"><path d="M3 12l1.2 4.2A2 2 0 006.1 17.7h7.8a2 2 0 001.9-1.5L17 12M4.5 12V6.5a1 1 0 011-1H9M11 5.5h2.5a1 1 0 011 1V12M10 3v9M3 12h14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>],
  ['Air', <svg key="i" width="15" height="15" viewBox="0 0 20 20" fill="none"><path d="M2.5 11.5l15-5.2a1 1 0 01.9 1.7L6 15l-1.5-3-3-.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg>],
  ['Road', <svg key="i" width="15" height="15" viewBox="0 0 20 20" fill="none"><path d="M2.5 5.5h9v8h-9zM11.5 8h3l2.5 2.5v3h-5.5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /><circle cx="6" cy="14.5" r="1.4" stroke="currentColor" strokeWidth="1.3" /><circle cx="14" cy="14.5" r="1.4" stroke="currentColor" strokeWidth="1.3" /></svg>],
  ['Rail', <svg key="i" width="15" height="15" viewBox="0 0 20 20" fill="none"><rect x="5" y="3" width="10" height="11" rx="2" stroke="currentColor" strokeWidth="1.3" /><path d="M5 9h10M7.5 17l1.5-3M12.5 17l-1.5-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /><circle cx="8" cy="11.5" r="0.7" fill="currentColor" /><circle cx="12" cy="11.5" r="0.7" fill="currentColor" /></svg>],
];

/* ---- record: guided DPP compliance workspace ---- */
const REC_STATUS = {
  missing:  { label: 'Missing',       color: 'var(--ink-400)',    bg: 'var(--surface-sunken)', line: 'var(--paper-400)' },
  self:     { label: 'Self-reported', color: 'var(--ochre-600)',  bg: 'var(--ochre-100)',      line: 'var(--ochre-500)' },
  review:   { label: 'In review',     color: 'var(--indigo-700)', bg: 'var(--indigo-100)',     line: 'var(--indigo-400)' },
  verified: { label: 'Verified',      color: 'var(--leaf-700)',   bg: 'var(--leaf-100)',       line: 'var(--leaf-600)' },
  action:   { label: 'Action needed', color: 'var(--madder-600)', bg: 'var(--madder-100)',     line: 'var(--madder-500)' },
};
const MATERIALS = ['Organic Cotton', 'Recycled Cotton', 'Linen', 'Organic Linen', 'Hemp', 'Recycled Polyester', 'Merino Wool', 'Wool', 'Tencel Lyocell', 'Cupro', 'Viscose', 'Elastane'];
const MAT_CERTS = { 'Organic Cotton': 'GOTS', 'Organic Linen': 'GOTS', 'Recycled Cotton': 'GRS', 'Recycled Polyester': 'GRS', 'Merino Wool': 'RWS', 'Wool': 'RWS', 'Tencel Lyocell': 'FSC' };
const REC_STAGES = [
  { id: 'fiber', label: 'Fibre', hint: 'Farm / source' },
  { id: 'spin', label: 'Spinning', hint: 'Yarn' },
  { id: 'weave', label: 'Weaving', hint: 'Mill' },
  { id: 'dye', label: 'Dye house', hint: 'Colour' },
  { id: 'sew', label: 'Cut & sew', hint: 'Assembly' },
  { id: 'finish', label: 'Finishing', hint: 'Wash / QC' },
  { id: 'ship', label: 'Warehouse', hint: 'Logistics' },
];
const REC_PRESET = {
  fiber:  { company: 'Herdade do Freixo', country: 'Portugal', cert: 'GOTS' },
  spin:   { company: 'Fio Verde Spinning', country: 'Portugal', cert: 'GOTS' },
  weave:  { company: 'Têxtil Douro Mill', country: 'Portugal', cert: 'OEKO-TEX' },
  dye:    { company: 'Casa da Cor Dye House', country: 'Portugal', cert: '' },
  sew:    { company: 'Atelier Nord', country: 'Portugal', cert: 'SA8000' },
  finish: { company: 'Atelier Nord', country: 'Portugal', cert: '' },
  ship:   { company: 'Norte Logística', country: 'Portugal', cert: '' },
};

function MRing({ pct, size = 54, stroke = 5, color }) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r, tone = color || (pct >= 80 ? 'var(--leaf-600)' : pct >= 40 ? 'var(--ochre-500)' : 'var(--madder-500)');
  return (
    <div style={{ position: 'relative', width: size, height: size, flex: '0 0 auto' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-sunken)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={tone} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} style={{ transition: 'stroke-dashoffset 0.4s, stroke 0.3s' }} />
      </svg>
      <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: size > 44 ? 14 : 11, fontWeight: 600, color: 'var(--ink-900)' }}>{pct}</span>
    </div>
  );
}

function MStatusPill({ status, size }) {
  const s = REC_STATUS[status];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: size === 'sm' ? '2px 8px' : '3px 10px', borderRadius: 999, background: s.bg, flex: '0 0 auto' }}>
      <span style={{ width: 6, height: 6, borderRadius: 999, background: s.color, flex: '0 0 auto' }} />
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: size === 'sm' ? 9.5 : 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: s.color }}>{s.label}</span>
    </span>
  );
}

function MSectionCard({ id, srefs, index, title, sub, status, pct, children }) {
  return (
    <div ref={(el) => { srefs.current[id] = el; }} style={{ border: '1px solid var(--border-hairline)', borderLeft: '3px solid ' + REC_STATUS[status].line, borderRadius: 'var(--radius-md)', background: 'var(--surface-card)', padding: '15px 15px 16px', marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 14 }}>
        <MRing pct={pct} size={40} stroke={4} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-400)' }}>{String(index).padStart(2, '0')}</span>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 15.5, fontWeight: 700, color: 'var(--ink-900)' }}>{title}</span>
          </div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11.5, color: 'var(--ink-400)', marginTop: 2 }}>{sub}</div>
        </div>
        <MStatusPill status={status} />
      </div>
      {children}
    </div>
  );
}

function MEvidenceStrip({ files, onAdd, onRemove, label }) {
  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: files.length ? 10 : 0 }}>
        {files.map((f) => (
          <span key={f.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '6px 9px', borderRadius: 'var(--radius-sm)', border: '1px solid ' + (f.state === 'verified' ? 'var(--leaf-600)' : 'var(--indigo-400)'), background: f.state === 'verified' ? 'var(--leaf-100)' : 'var(--indigo-100)' }}>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" style={{ color: f.state === 'verified' ? 'var(--leaf-700)' : 'var(--indigo-700)', flex: '0 0 auto' }}><path d="M3.5 1.5h4l3 3v8h-7z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" /><path d="M7.5 1.5v3h3" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" /></svg>
            <span style={{ maxWidth: 128, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'var(--font-sans)', fontSize: 11.5, fontWeight: 600, color: 'var(--ink-800)' }}>{f.name}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.04em', textTransform: 'uppercase', color: f.state === 'verified' ? 'var(--leaf-700)' : 'var(--indigo-700)' }}>{f.state === 'verified' ? 'verified' : 'in review'}</span>
            <button onClick={() => onRemove(f.id)} aria-label="Remove file" style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--ink-400)', padding: 0, display: 'inline-flex' }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
            </button>
          </span>
        ))}
      </div>
      <button onClick={onAdd} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, border: '1px dashed var(--paper-400)', background: 'transparent', cursor: 'pointer', borderRadius: 'var(--radius-md)', padding: '8px 12px', fontFamily: 'var(--font-sans)', fontSize: 12.5, fontWeight: 600, color: 'var(--ink-600)' }}>
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M8 10.5V3M5 5.5L8 2.5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M2.5 10.5v2a1 1 0 001 1h9a1 1 0 001-1v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
        {label || 'Attach evidence'}
      </button>
    </div>
  );
}

function MNewItem({ onCreate }) {
  const srefs = React.useRef({});
  const rootRef = React.useRef(null);
  const [name, setName] = React.useState('');
  const [sku, setSku] = React.useState('');
  const [batch, setBatch] = React.useState('');
  const [units, setUnits] = React.useState('');
  const [season, setSeason] = React.useState('AW25');
  const [customSeason, setCustomSeason] = React.useState('');
  const [comp, setComp] = React.useState([{ id: 1, mat: '', pct: '', cert: '' }]);
  const [focusMat, setFocusMat] = React.useState(null);
  const cId = React.useRef(2);
  const [stages, setStages] = React.useState(() => REC_STAGES.map((s) => ({ ...s, company: '', country: '', cert: '', ev: null })));
  const [files, setFiles] = React.useState([]);
  const fId = React.useRef(1);
  const [showPreview, setShowPreview] = React.useState(false);

  const compFilled = comp.filter((c) => c.mat.trim());
  const compTotal = Math.round(comp.reduce((s, c) => s + (parseFloat(c.pct) || 0), 0) * 10) / 10;
  const totalTone = compTotal === 100 ? 'var(--leaf-600)' : compTotal > 100 ? 'var(--madder-500)' : 'var(--ochre-500)';
  const compFiles = files.filter((f) => f.section === 'composition');
  const compVerified = compFiles.some((f) => f.state === 'verified');
  const evFiles = files.filter((f) => f.section === 'evidence');
  const dupBatch = batch.trim() && window.TT.ledger.some((r) => r.batch === batch.trim().replace(/^#/, ''));

  // per-section score (0-100) and status
  const prodFields = [name.trim(), batch.trim(), units.trim(), season].filter(Boolean).length;
  const prodPct = Math.round((prodFields / 4) * 100);
  const prodStatus = !name.trim() && !batch.trim() ? 'missing' : dupBatch ? 'action' : prodFields >= 2 ? 'self' : 'self';

  const compPct = compFilled.length === 0 ? 0 : Math.round((0.5 * (compTotal === 100 ? 1 : 0) + 0.5 * (compVerified ? 1 : 0)) * 100);
  const compStatus = compFilled.length === 0 ? 'missing' : compTotal > 100 || compTotal < 100 ? 'action' : compVerified ? 'verified' : compFiles.length ? 'review' : 'self';

  const stageScore = (s) => (s.company.trim() ? 0.4 : 0) + (s.country.trim() ? 0.2 : 0) + (s.ev === 'verified' ? 0.4 : s.ev === 'review' ? 0.2 : 0);
  const jrnPct = Math.round((stages.reduce((a, s) => a + stageScore(s), 0) / stages.length) * 100);
  const jrnDone = stages.filter((s) => s.company.trim()).length;
  const jrnStatus = jrnDone === 0 ? 'missing' : stages.every((s) => s.ev === 'verified') ? 'verified' : stages.some((s) => s.ev) ? 'review' : 'self';

  const evPct = Math.min(100, Math.round((evFiles.length / 3) * 100));
  const evStatus = evFiles.length === 0 ? 'missing' : evFiles.some((f) => f.state === 'verified') ? 'verified' : 'review';

  const overall = Math.round(prodPct * 0.15 + compPct * 0.3 + jrnPct * 0.4 + evPct * 0.15);
  const allFiles = files.length + stages.filter((s) => s.ev).length;
  const publishBlocks = [];
  if (!name.trim() || !batch.trim()) publishBlocks.push('Product name & batch');
  if (compTotal !== 100) publishBlocks.push('Composition must total 100%');
  if (jrnDone < 3) publishBlocks.push('At least 3 supply-chain stages');
  const consumerReady = publishBlocks.length === 0;

  const steps = [
    { id: 'product', label: 'Product', status: prodStatus },
    { id: 'composition', label: 'Composition', status: compStatus },
    { id: 'journey', label: 'Journey', status: jrnStatus },
    { id: 'evidence', label: 'Evidence', status: evStatus },
    { id: 'review', label: 'Review', status: consumerReady ? 'verified' : 'missing' },
  ];

  const jump = (k) => {
    const el = srefs.current[k]; if (!el) return;
    let p = el.parentElement;
    while (p && !/(auto|scroll)/.test(getComputedStyle(p).overflowY)) p = p.parentElement;
    if (!p) return;
    const top = el.getBoundingClientRect().top - p.getBoundingClientRect().top + p.scrollTop - 12;
    p.scrollTo({ top, behavior: 'smooth' });
  };
  const updC = (id, patch) => setComp((r) => r.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  const rmC = (id) => setComp((r) => (r.length > 1 ? r.filter((c) => c.id !== id) : r));
  const updS = (id, patch) => setStages((r) => r.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  const addFile = (section, nameList) => {
    const names = nameList || ['invoice-' + (batch.trim() || '0045') + '.pdf', 'lab-report-azo.pdf', 'supplier-declaration.pdf', 'gots-scope-cert.pdf'];
    const nm = names[files.filter((f) => f.section === section).length % names.length];
    const nf = { id: fId.current++, name: nm, section, state: 'review' };
    setFiles((f) => [...f, nf]);
    setTimeout(() => setFiles((f) => f.map((x) => (x.id === nf.id ? { ...x, state: 'verified' } : x))), 1400);
  };
  const attachStage = (id) => {
    updS(id, { ev: 'review' });
    setTimeout(() => setStages((r) => r.map((s) => (s.id === id ? { ...s, ev: 'verified' } : s))), 1400);
  };
  const reuseChain = () => setStages((r) => r.map((s) => ({ ...s, ...(REC_PRESET[s.id] || {}) })));

  const canSave = name.trim() && batch.trim();
  const seasonVal = season === 'Custom' ? (customSeason.trim() || 'Custom') : season;
  function save() {
    if (!canSave) return;
    onCreate({
      garment: name.trim(), batch: batch.trim().replace(/^#/, ''), sku: sku.trim(), season: seasonVal, units: units.trim(),
      composition: compFilled.map((c) => ({ mat: c.mat.trim(), pct: c.pct.trim() })),
      legs: stages.filter((s) => s.company.trim()).map((s, i, arr) => ({ from: s.company.trim(), to: (arr[i + 1] && arr[i + 1].company.trim()) || 'Warehouse', mode: 'Road', ref: s.cert })),
      photos: allFiles, honesty: overall, status: 'draft',
    });
  }

  const fieldLabel = { fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500, letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase', color: 'var(--ink-500)', marginBottom: 8 };
  const helper = { fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--ink-400)', letterSpacing: '0.02em', marginTop: 7 };
  const chip = (on) => ({ display: 'inline-flex', alignItems: 'center', gap: 5, border: '1.5px solid ' + (on ? 'var(--indigo-400)' : 'var(--paper-400)'), background: on ? 'var(--indigo-100)' : 'var(--surface-page)', color: on ? 'var(--indigo-700)' : 'var(--ink-500)', cursor: 'pointer', borderRadius: 999, padding: '6px 11px', fontFamily: 'var(--font-sans)', fontSize: 12.5, fontWeight: on ? 600 : 500 });
  const iconBtn = { border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--ink-300)', padding: 4, display: 'inline-flex', flex: '0 0 auto' };

  // AI nudges
  const nudges = [];
  if (dupBatch) nudges.push({ tone: 'action', text: 'Batch ' + batch.trim() + ' already exists in your ledger — this may create a duplicate.', action: null });
  if (compTotal > 0 && compTotal < 100) nudges.push({ tone: 'self', text: 'Composition totals ' + compTotal + '%. Add the remaining ' + Math.round((100 - compTotal) * 10) / 10 + '%?', action: { label: 'Add material', fn: () => setComp((r) => [...r, { id: cId.current++, mat: '', pct: String(Math.round((100 - compTotal) * 10) / 10), cert: '' }]) } });
  compFilled.forEach((c) => { if (MAT_CERTS[c.mat.trim()] && !c.cert.trim() && !nudges.some((n) => n.matCert)) nudges.push({ matCert: true, tone: 'self', text: c.mat.trim() + ' usually carries a ' + MAT_CERTS[c.mat.trim()] + ' certificate. Add it?', action: { label: 'Set ' + MAT_CERTS[c.mat.trim()], fn: () => updC(c.id, { cert: MAT_CERTS[c.mat.trim()] }) } }); });
  if (jrnDone === 0) nudges.push({ tone: 'review', text: 'Reuse your AW25 supply chain? 7 stages will be pre-filled and ready to verify.', action: { label: 'Reuse AW25', fn: reuseChain } });

  return (
    <div ref={rootRef} style={{ position: 'relative' }}>
      <div style={{ padding: '16px 16px 4px' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--ink-900)', marginBottom: 2 }}>New record</div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-500)' }}>Build a Digital Product Passport, stage by stage.</div>
      </div>

      {/* DPP readiness header */}
      <div style={{ margin: '14px 16px 6px', border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-lg)', background: 'linear-gradient(160deg,var(--indigo-100),var(--surface-card) 62%)', padding: '16px 16px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
          <MRing pct={overall} size={64} stroke={6} color="var(--indigo-500)" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.09em', textTransform: 'uppercase', color: 'var(--indigo-700)' }}>EU DPP readiness</div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 17, fontWeight: 700, color: 'var(--ink-900)', margin: '2px 0 4px' }}>{consumerReady ? 'Ready to publish' : overall >= 50 ? 'Almost there' : 'Getting started'}</div>
            <div style={{ display: 'flex', gap: 14, fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--ink-600)' }}>
              <span>{allFiles} evidence</span>
              <span>{jrnDone}/{stages.length} stages</span>
            </div>
          </div>
        </div>
        {publishBlocks.length ? (
          <div style={{ marginTop: 12, paddingTop: 11, borderTop: '1px solid var(--border-hairline)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--madder-600)', marginBottom: 6 }}>Publish blocked by</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {publishBlocks.map((b) => <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 7, fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-700)' }}><span style={{ width: 5, height: 5, borderRadius: 999, background: 'var(--madder-500)', flex: '0 0 auto' }} />{b}</div>)}
            </div>
          </div>
        ) : (
          <div style={{ marginTop: 12, paddingTop: 11, borderTop: '1px solid var(--border-hairline)', display: 'flex', alignItems: 'center', gap: 7, fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--leaf-700)' }}>
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3" /><path d="M5.3 8.2l1.8 1.8 3.6-3.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            All required fields complete — ready for consumer &amp; audit.
          </div>
        )}
      </div>

      {/* step rail */}
      <div style={{ display: 'flex', gap: 7, overflowX: 'auto', padding: '8px 16px 12px', WebkitOverflowScrolling: 'touch' }}>
        {steps.map((s, i) => (
          <button key={s.id} onClick={() => jump(s.id)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flex: '0 0 auto', border: '1px solid ' + REC_STATUS[s.status].line, background: REC_STATUS[s.status].bg, cursor: 'pointer', borderRadius: 999, padding: '6px 11px' }}>
            <span style={{ width: 7, height: 7, borderRadius: 999, background: REC_STATUS[s.status].color, flex: '0 0 auto' }} />
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 600, color: REC_STATUS[s.status].color }}>{s.label}</span>
          </button>
        ))}
      </div>

      <div style={{ padding: '0 16px 20px' }}>

        {/* AI assistant */}
        {nudges.length ? (
          <div style={{ border: '1px solid var(--indigo-400)', borderRadius: 'var(--radius-md)', background: 'var(--indigo-100)', padding: '12px 13px', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 9 }}>
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ color: 'var(--indigo-700)' }}><path d="M8 1.6l1.5 3.4 3.6.3-2.7 2.4.8 3.5L8 13l-3.2 1.6.8-3.5-2.7-2.4 3.6-.3z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" /></svg>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--indigo-700)', fontWeight: 600 }}>Assistant · {nudges.length} suggestion{nudges.length > 1 ? 's' : ''}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {nudges.slice(0, 3).map((n, k) => (
                <div key={k} style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
                  <span style={{ width: 5, height: 5, borderRadius: 999, background: REC_STATUS[n.tone].color, flex: '0 0 auto', marginTop: 6 }} />
                  <span style={{ flex: 1, fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-700)', lineHeight: 1.45 }}>{n.text}</span>
                  {n.action ? <button onClick={n.action.fn} style={{ flex: '0 0 auto', border: '1px solid var(--indigo-400)', background: 'var(--surface-card)', cursor: 'pointer', borderRadius: 999, padding: '4px 10px', fontFamily: 'var(--font-sans)', fontSize: 11.5, fontWeight: 600, color: 'var(--indigo-700)' }}>{n.action.label}</button> : null}
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* 01 product */}
        <MSectionCard id="product" srefs={srefs} index={1} title="Product" sub="Identity — self-declared" status={prodStatus} pct={prodPct}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <MInput label="Garment" placeholder="e.g. Indigo Field Jacket" value={name} onChange={(e) => setName(e.target.value)} />
            <div style={{ display: 'flex', gap: 10 }}>
              <MInput label="SKU" placeholder="IFJ-AW25" mono value={sku} onChange={(e) => setSku(e.target.value)} style={{ flex: 1, minWidth: 0 }} />
              <MInput label="Batch" placeholder="0045" mono value={batch} onChange={(e) => setBatch(e.target.value)} style={{ flex: 1, minWidth: 0 }} />
            </div>
            <div>
              <MInput label="Units" placeholder="90" mono type="number" value={units} onChange={(e) => setUnits(e.target.value)} />
              <div style={{ ...helper, color: dupBatch ? 'var(--madder-600)' : 'var(--ink-400)' }}>{dupBatch ? 'Batch ' + batch.trim() + ' already exists' : units.trim() ? '→ ' + units.trim() + ' QR permalinks will be minted' : '4-digit batch, leading zeros kept · e.g. 0045'}</div>
            </div>
            <div>
              <div style={fieldLabel}>Season</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['SS25', 'AW25', 'SS26', 'AW26', 'Custom'].map((s) => <button key={s} onClick={() => setSeason(s)} style={chip(season === s)}>{s}</button>)}
              </div>
              {season === 'Custom' ? <MInput placeholder="e.g. Continuous line / Resort 25" value={customSeason} onChange={(e) => setCustomSeason(e.target.value)} style={{ marginTop: 10 }} /> : null}
            </div>
          </div>
        </MSectionCard>

        {/* 02 composition */}
        <MSectionCard id="composition" srefs={srefs} index={2} title="Composition" sub="Required · ESPR" status={compStatus} pct={compPct}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
            {comp.map((c) => (
              <div key={c.id} style={{ border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-page)', padding: '11px 11px 12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 9 }}>
                  <div style={{ flex: 1, minWidth: 0, position: 'relative' }}>
                    <MInput placeholder="Material" size="sm" value={c.mat} onChange={(e) => updC(c.id, { mat: e.target.value })} onFocus={() => setFocusMat(c.id)} onBlur={() => setTimeout(() => setFocusMat((f) => (f === c.id ? null : f)), 150)} />
                    {focusMat === c.id && c.mat.trim() && !MATERIALS.includes(c.mat.trim()) ? (
                      <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 5, marginTop: 4, background: 'var(--surface-card)', border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-md)', overflow: 'hidden' }}>
                        {MATERIALS.filter((m) => m.toLowerCase().includes(c.mat.trim().toLowerCase())).slice(0, 4).map((m) => (
                          <button key={m} onMouseDown={() => updC(c.id, { mat: m, cert: MAT_CERTS[m] || c.cert })} style={{ display: 'block', width: '100%', textAlign: 'left', border: 'none', borderBottom: '1px solid var(--border-hairline)', background: 'transparent', cursor: 'pointer', padding: '9px 11px', fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-800)' }}>{m}</button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                  <MInput placeholder="%" size="sm" mono suffix="%" value={c.pct} onChange={(e) => updC(c.id, { pct: e.target.value })} style={{ width: 78, flex: '0 0 auto' }} />
                  <button onClick={() => rmC(c.id)} aria-label="Remove material" style={iconBtn}><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg></button>
                </div>
                <MInput placeholder="Certification (e.g. GOTS)" size="sm" mono value={c.cert} onChange={(e) => updC(c.id, { cert: e.target.value })} />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'var(--surface-sunken)', overflow: 'hidden' }}>
              <div style={{ width: Math.min(compTotal, 100) + '%', height: '100%', background: totalTone, transition: 'width 0.2s' }} />
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: totalTone, flex: '0 0 auto' }}>{compTotal}% of 100%{compTotal > 100 ? ' · over' : compTotal < 100 ? ' allocated' : ' ✓'}</span>
          </div>
          <button onClick={() => setComp((r) => [...r, { id: cId.current++, mat: '', pct: '', cert: '' }])} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, border: '1px dashed var(--paper-400)', background: 'transparent', cursor: 'pointer', borderRadius: 'var(--radius-md)', padding: '8px 12px', fontFamily: 'var(--font-sans)', fontSize: 12.5, fontWeight: 600, color: 'var(--ink-600)', marginBottom: 12 }}>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>Add material
          </button>
          <MEvidenceStrip files={compFiles} onAdd={() => addFile('composition', ['gots-scope-cert.pdf', 'material-lab-report.pdf', 'supplier-declaration.pdf'])} onRemove={(id) => setFiles((f) => f.filter((x) => x.id !== id))} label="Attach lab report / cert" />
        </MSectionCard>

        {/* 03 journey */}
        <MSectionCard id="journey" srefs={srefs} index={3} title="Manufacturing journey" sub="Tier 1–4 supply chain" status={jrnStatus} pct={jrnPct}>
          {jrnDone === 0 ? (
            <button onClick={reuseChain} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', border: '1px solid var(--indigo-400)', background: 'var(--indigo-100)', cursor: 'pointer', borderRadius: 'var(--radius-md)', padding: '10px', marginBottom: 13, fontFamily: 'var(--font-sans)', fontSize: 12.5, fontWeight: 600, color: 'var(--indigo-700)' }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7a5 5 0 019-3M12 7a5 5 0 01-9 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /><path d="M11 1.5V4H8.5M3 12.5V10h2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Reuse AW25 supply chain
            </button>
          ) : null}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {stages.map((s, i) => {
              const stStatus = !s.company.trim() ? 'missing' : s.ev === 'verified' ? 'verified' : s.ev === 'review' ? 'review' : 'self';
              return (
                <div key={s.id}>
                  <div style={{ display: 'flex', gap: 11 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '0 0 auto' }}>
                      <span style={{ width: 26, height: 26, borderRadius: '50%', border: '2px solid ' + REC_STATUS[stStatus].line, background: REC_STATUS[stStatus].bg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 10.5, fontWeight: 600, color: REC_STATUS[stStatus].color }}>{i + 1}</span>
                      {i < stages.length - 1 ? <span style={{ width: 2, flex: 1, minHeight: 14, background: 'var(--paper-400)', margin: '2px 0' }} /> : null}
                    </div>
                    <div style={{ flex: 1, minWidth: 0, paddingBottom: i < stages.length - 1 ? 14 : 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13.5, fontWeight: 700, color: 'var(--ink-900)' }}>{s.label}</span>
                        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--ink-400)' }}>{s.hint}</span>
                        <span style={{ marginLeft: 'auto' }}><MStatusPill status={stStatus} size="sm" /></span>
                      </div>
                      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                        <MInput placeholder="Company" size="sm" value={s.company} onChange={(e) => updS(s.id, { company: e.target.value })} style={{ flex: 1, minWidth: 0 }} />
                        <MInput placeholder="Country" size="sm" value={s.country} onChange={(e) => updS(s.id, { country: e.target.value })} style={{ width: 108, flex: '0 0 auto' }} />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <MInput placeholder="Certification" size="sm" mono value={s.cert} onChange={(e) => updS(s.id, { cert: e.target.value })} style={{ flex: 1, minWidth: 0 }} />
                        {s.ev ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, flex: '0 0 auto', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.04em', textTransform: 'uppercase', color: s.ev === 'verified' ? 'var(--leaf-700)' : 'var(--indigo-700)' }}>
                            <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M3.5 1.5h4l3 3v8h-7z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" /></svg>{s.ev === 'verified' ? 'verified' : 'in review'}
                          </span>
                        ) : (
                          <button onClick={() => attachStage(s.id)} disabled={!s.company.trim()} style={{ flex: '0 0 auto', border: '1px dashed var(--paper-400)', background: 'transparent', cursor: s.company.trim() ? 'pointer' : 'not-allowed', opacity: s.company.trim() ? 1 : 0.45, borderRadius: 999, padding: '5px 10px', fontFamily: 'var(--font-sans)', fontSize: 11.5, fontWeight: 600, color: 'var(--ink-600)' }}>Attach</button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </MSectionCard>

        {/* 04 evidence */}
        <MSectionCard id="evidence" srefs={srefs} index={4} title="Evidence" sub="Invoices · certs · audits · lab reports" status={evStatus} pct={evPct}>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-500)', lineHeight: 1.5, marginBottom: 12 }}>Attach proof so claims read <strong style={{ color: 'var(--leaf-700)' }}>Verified</strong> to buyers and auditors instead of self-reported.</div>
          <MEvidenceStrip files={evFiles} onAdd={() => addFile('evidence')} onRemove={(id) => setFiles((f) => f.filter((x) => x.id !== id))} label="Upload proof" />
        </MSectionCard>

        {/* 05 review & consumer preview */}
        <MSectionCard id="review" srefs={srefs} index={5} title="Review & publish" sub="What the consumer will see" status={consumerReady ? 'verified' : 'missing'} pct={overall}>
          <div style={{ border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--surface-page)' }}>
            <div style={{ display: 'flex', gap: 12, padding: '14px 14px 12px' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-400)', marginBottom: 3 }}>Consumer passport</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--ink-900)', lineHeight: 1.15 }}>{name.trim() || 'Untitled garment'}</div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--ink-500)', marginTop: 2 }}>
                  {(stages.find((s) => s.country.trim()) || {}).country ? 'Made in ' + stages.find((s) => s.country.trim()).country : 'Origin not set'}
                </div>
              </div>
              <div style={{ textAlign: 'center', flex: '0 0 auto' }}>
                <div style={{ width: 58, height: 58, borderRadius: 'var(--radius-sm)', background: 'var(--surface-card)', border: '1px solid var(--border-hairline)', padding: 7, boxSizing: 'border-box' }}>
                  <div style={{ width: '100%', height: '100%', opacity: consumerReady ? 0.9 : 0.25, backgroundImage: 'repeating-linear-gradient(0deg,var(--ink-900) 0 3px,transparent 3px 6px),repeating-linear-gradient(90deg,var(--ink-900) 0 3px,transparent 3px 6px)' }} />
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8.5, color: 'var(--ink-400)', marginTop: 4 }}>{consumerReady ? 'QR live' : 'locked'}</div>
              </div>
            </div>
            <div style={{ padding: '0 14px 12px', display: 'flex', flexDirection: 'column', gap: 5 }}>
              {compFilled.length ? compFilled.map((c, k) => <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-700)' }}><span>{c.mat.trim()}</span><span style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink-500)' }}>{c.pct ? c.pct + '%' : '—'}</span></div>) : <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-400)' }}>Composition not yet added</div>}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', borderTop: '1px solid var(--border-hairline)', background: 'var(--surface-card)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-400)', flex: 1 }}>Traceability score</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: overall >= 80 ? 'var(--leaf-700)' : overall >= 50 ? 'var(--ochre-600)' : 'var(--madder-600)' }}>{overall}<span style={{ fontSize: 12, color: 'var(--ink-400)' }}>/100</span></span>
            </div>
          </div>
        </MSectionCard>
      </div>

      {/* sticky action bar */}
      <div style={{ position: 'sticky', bottom: 0, background: 'var(--surface-card)', borderTop: '1px solid var(--border-hairline)', padding: '11px 16px', display: 'flex', gap: 9, boxShadow: '0 -4px 16px rgba(28,24,20,0.06)' }}>
        <button onClick={save} disabled={!canSave} style={{ flex: '0 0 auto', minHeight: 44, padding: '0 15px', border: '1px solid var(--paper-400)', background: 'transparent', cursor: canSave ? 'pointer' : 'not-allowed', opacity: canSave ? 1 : 0.5, borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, color: 'var(--ink-700)' }}>Save draft</button>
        <MButton variant="primary" size="lg" fullWidth disabled={!consumerReady} onClick={save}>{consumerReady ? 'Publish passport' : publishBlocks.length + ' to resolve'}</MButton>
      </div>
    </div>
  );
}

/* ---- repair bench: full "Repairing" workflow opened from a service job ---- */
function MRepairField(props) {
  return <input {...props} style={{ width: '100%', boxSizing: 'border-box', border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', padding: '10px 12px', fontFamily: 'var(--font-sans)', fontSize: 13.5, color: 'var(--ink-900)', background: 'var(--surface-card)', outline: 'none' }} />;
}

function MRepairing({ job, onBack }) {
  const R = window.TT.repairIntake;
  const [type, setType] = React.useState('custom'); // standard | custom | both
  const [step, setStep] = React.useState(0);
  const [showMore, setShowMore] = React.useState(false);
  const [face, setFace] = React.useState('front');
  const [repairTypes, setRepairTypes] = React.useState(R.repairTypes.map((r) => r.name));
  const [materials, setMaterials] = React.useState(R.materials);
  const [trims, setTrims] = React.useState([{ id: 't0', name: '', cost: '' }]);
  const [time, setTime] = React.useState('');
  const [unit, setUnit] = React.useState('Hours');

  const steps = [
    ['Repair Information', 'Repair Information'],
    ['Material Information', 'Custom Repair Information'],
    ['Material Information', 'Custom Material Information'],
  ];
  const typeOpts = [['standard', 'Standard Repair'], ['custom', 'Custom Repair'], ['both', 'Standard + Custom Repair']];

  const eyebrow = { fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-400)' };
  const sectionTitle = { fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 700, color: 'var(--indigo-700)', margin: '4px 0 12px' };
  const iconBtn = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, flex: '0 0 auto', border: '1px solid var(--border-hairline)', background: 'var(--surface-card)', borderRadius: 'var(--radius-md)', cursor: 'pointer', color: 'var(--ink-500)' };
  const addBtn = (label, onClick) => (
    <button onClick={onClick} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, border: '1px dashed var(--paper-400)', background: 'var(--surface-card)', borderRadius: 'var(--radius-md)', cursor: 'pointer', padding: '10px 14px', fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, color: 'var(--ink-800)' }}>
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>{label}
    </button>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--surface-sunken)' }}>
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'var(--surface-card)', borderBottom: '1px solid var(--border-hairline)', flex: '0 0 auto' }}>
        <button onClick={onBack} aria-label="Back" style={{ ...iconBtn, borderRadius: 999 }}>
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M12 4l-6 6 6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--ink-900)' }}>Repairing</span>
        <button aria-label="Process history" style={{ ...iconBtn, marginLeft: 'auto' }}>
          <svg width="15" height="15" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.2" stroke="currentColor" strokeWidth="1.5" /><path d="M10 6v4l2.6 1.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 24px' }}>
        {/* product id card */}
        <div style={{ border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-lg)', background: 'var(--surface-card)', padding: '14px 15px', marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 13 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink-900)' }}>{R.pid}</span>
            <MBadge tone="pending" size="sm">{R.status}</MBadge>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1, background: 'var(--surface-sunken)', borderRadius: 'var(--radius-md)', padding: '10px 12px' }}>
              <div style={eyebrow}>Batch</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600, color: 'var(--ink-900)', marginTop: 3 }}>{R.batch}</div>
            </div>
            <div style={{ flex: 1, background: 'var(--surface-sunken)', borderRadius: 'var(--radius-md)', padding: '10px 12px' }}>
              <div style={eyebrow}>Arrival at facility</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600, color: 'var(--ink-900)', marginTop: 3 }}>{R.arrival}</div>
            </div>
          </div>
          {showMore ? (
            <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
              <div style={{ flex: 1, background: 'var(--surface-sunken)', borderRadius: 'var(--radius-md)', padding: '10px 12px' }}>
                <div style={eyebrow}>Assigned to</div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600, color: 'var(--ink-900)', marginTop: 3 }}>Emil Petersson</div>
              </div>
              <div style={{ flex: 1, background: 'var(--surface-sunken)', borderRadius: 'var(--radius-md)', padding: '10px 12px' }}>
                <div style={eyebrow}>Job ref</div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600, color: 'var(--ink-900)', marginTop: 3 }}>{job ? job.id : 'SVC-118'}</div>
              </div>
            </div>
          ) : null}
          <button onClick={() => setShowMore((s) => !s)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, width: '100%', marginTop: 12, border: '1px solid var(--border-hairline)', background: 'var(--surface-card)', borderRadius: 'var(--radius-md)', cursor: 'pointer', padding: '9px 0', fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, color: 'var(--ink-700)' }}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{ transform: showMore ? 'rotate(180deg)' : 'none' }}><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            {showMore ? 'Show Less' : 'Show More'}
          </button>
        </div>

        {/* flaws in the product */}
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 700, color: 'var(--ink-900)', marginBottom: 10 }}>Flaws in the Product</div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
          {[['front', 'Front'], ['back', 'Back']].map(([id, label]) => (
            <button key={id} onClick={() => setFace(id)} style={{ flex: 1, border: `1.5px solid ${face === id ? 'var(--indigo-400)' : 'var(--paper-400)'}`, background: face === id ? 'var(--indigo-100)' : 'var(--surface-card)', color: face === id ? 'var(--indigo-700)' : 'var(--ink-500)', cursor: 'pointer', borderRadius: 'var(--radius-pill)', padding: '7px 0', fontFamily: 'var(--font-sans)', fontSize: 12.5, fontWeight: face === id ? 600 : 500 }}>{label}</button>
          ))}
        </div>
        <div style={{ position: 'relative', width: '100%', height: 230, borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-hairline)', background: 'var(--surface-card)', marginBottom: 12 }}>
          <image-slot id={'repair-' + face} shape="rect" placeholder={face === 'front' ? 'Front view photo' : 'Back view photo'}></image-slot>
          {R.flaws.map((f, i) => (
            <span key={i} title={f.title} style={{ position: 'absolute', left: (face === 'front' ? f.x : 100 - f.x) + '%', top: f.y + '%', transform: 'translate(-50%,-50%)', width: 22, height: 22, borderRadius: '50%', background: 'var(--madder-500)', color: 'var(--paper-50)', border: '2px solid var(--paper-50)', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700 }}>{i + 1}</span>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 22 }}>
          {R.flaws.map((f, i) => (
            <div key={i} style={{ display: 'flex', gap: 11, border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)', padding: '11px 13px' }}>
              <span style={{ width: 20, height: 20, flex: '0 0 auto', borderRadius: '50%', background: 'var(--madder-100)', color: 'var(--madder-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 10.5, fontWeight: 700 }}>{i + 1}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13.5, fontWeight: 600, color: 'var(--ink-900)' }}>{f.title}{f.count ? <span style={{ color: 'var(--ink-400)', fontWeight: 500 }}> : {f.count}</span> : null}</div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--ink-500)', lineHeight: 1.45, marginTop: 2 }}>{f.note}</div>
              </div>
            </div>
          ))}
        </div>

        {/* process history */}
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 700, color: 'var(--ink-900)', marginBottom: 12 }}>Process History</div>
        <div style={{ position: 'relative', paddingLeft: 4, marginBottom: 24 }}>
          {R.history.map((h, i) => {
            const active = h.state === 'active';
            const last = i === R.history.length - 1;
            return (
              <div key={i} style={{ display: 'flex', gap: 13 }}>
                <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '0 0 auto' }}>
                  <span style={{ width: 20, height: 20, borderRadius: '50%', flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', background: active ? 'var(--ochre-100)' : 'var(--leaf-100)', border: `2px solid ${active ? 'var(--ochre-500)' : 'var(--leaf-600)'}`, color: active ? 'var(--ochre-600)' : 'var(--leaf-600)' }}>
                    {active ? <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--ochre-500)' }}></span> : <svg width="11" height="11" viewBox="0 0 14 14" fill="none"><path d="M3 7.2l2.6 2.6L11 4.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                  </span>
                  {!last ? <span style={{ flex: 1, width: 2, background: 'var(--border-hairline)', margin: '2px 0' }}></span> : null}
                </div>
                <div style={{ flex: 1, minWidth: 0, paddingBottom: last ? 0 : 16 }}>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 700, color: 'var(--ink-900)', lineHeight: 1.2 }}>{h.title}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3, fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--ink-500)' }}>
                    <span>{h.date}</span><span style={{ color: 'var(--ink-300)' }}>|</span><span>{h.by}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* repair details */}
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 700, color: 'var(--ink-900)', marginBottom: 12 }}>Repair Details</div>
        <div style={eyebrow}>Type of Repair</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, margin: '9px 0 20px' }}>
          {typeOpts.map(([id, label]) => {
            const on = type === id;
            return (
              <button key={id} onClick={() => setType(id)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, border: `1.5px solid ${on ? 'var(--indigo-400)' : 'var(--paper-400)'}`, background: on ? 'var(--indigo-100)' : 'var(--surface-card)', cursor: 'pointer', borderRadius: 'var(--radius-md)', padding: '13px 0', fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 700, color: on ? 'var(--indigo-700)' : 'var(--ink-900)' }}>
                {on ? <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" fill="var(--indigo-500)" /><path d="M6 10.2l2.6 2.6L14 7.4" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg> : null}
                {label}
              </button>
            );
          })}
        </div>

        {/* stepper */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 4, marginBottom: 20 }}>
          {steps.map(([, sub], i) => {
            const on = step === i, done = step > i;
            return (
              <React.Fragment key={i}>
                <button onClick={() => setStep(i)} style={{ flex: 1, border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'center', padding: 0 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 26, height: 26, borderRadius: '50%', background: on || done ? 'var(--ink-900)' : 'var(--surface-card)', border: `1.5px solid ${on || done ? 'var(--ink-900)' : 'var(--paper-400)'}`, color: on || done ? 'var(--paper-50)' : 'var(--ink-400)', fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700 }}>{done ? '✓' : i + 1}</span>
                  <span style={{ display: 'block', fontFamily: 'var(--font-sans)', fontSize: 10.5, color: on ? 'var(--ink-900)' : 'var(--ink-400)', fontWeight: on ? 600 : 500, marginTop: 5, lineHeight: 1.25 }}>{sub}</span>
                </button>
                {i < steps.length - 1 ? <span style={{ flex: '0 0 12px', height: 1.5, background: 'var(--border-hairline)', marginTop: 13 }}></span> : null}
              </React.Fragment>
            );
          })}
        </div>

        {/* step body */}
        {step === 0 ? (
          <div>
            <div style={sectionTitle}>Custom repair type</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
              {repairTypes.map((rt, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <MRepairField value={rt} onChange={(e) => setRepairTypes((a) => a.map((x, k) => k === i ? e.target.value : x))} placeholder="Eg. Hole in the seam" />
                  <button onClick={() => setRepairTypes((a) => a.filter((_, k) => k !== i))} aria-label="Remove" style={iconBtn}><svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M5 6h10M8 6V4.5h4V6M6.5 6l.6 9h5.8l.6-9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 22 }}>{addBtn('Add New Repair Type', () => setRepairTypes((a) => [...a, '']))}</div>

            <div style={{ ...eyebrow, marginBottom: 8 }}>Required Time for Repair *</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 22 }}>
              <MRepairField value={time} onChange={(e) => setTime(e.target.value)} placeholder="Eg. 1, 2, 3.5" />
              <div style={{ position: 'relative', flex: '0 0 118px' }}>
                <select value={unit} onChange={(e) => setUnit(e.target.value)} style={{ width: '100%', appearance: 'none', border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', padding: '10px 30px 10px 12px', fontFamily: 'var(--font-sans)', fontSize: 13.5, color: 'var(--ink-900)', background: 'var(--surface-card)', cursor: 'pointer' }}>
                  <option>Hours</option><option>Minutes</option><option>Days</option>
                </select>
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--ink-400)' }}><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
            </div>

            <div style={{ ...eyebrow, marginBottom: 8 }}>Product Before Repair</div>
            <div style={{ height: 140, borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px dashed var(--paper-400)' }}>
              <image-slot id="repair-before" shape="rect" placeholder="Upload image · capture the product's condition"></image-slot>
            </div>
          </div>
        ) : null}

        {step === 1 ? (
          <div>
            <div style={sectionTitle}>Materials used for repairing</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
              {materials.map((m) => (
                <div key={m.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', background: 'var(--surface-sunken)', border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', padding: '12px 13px' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13.5, fontWeight: 600, color: 'var(--ink-900)' }}>{m.name} <span style={{ color: 'var(--ink-400)' }}>|</span> {m.cost}</div>
                    <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--ink-500)', marginTop: 3 }}>{m.comp}</div>
                  </div>
                  <button aria-label="Edit" style={iconBtn}><svg width="13" height="13" viewBox="0 0 20 20" fill="none"><path d="M13.5 4.5l2 2L7 15l-2.6.6L5 13z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg></button>
                  <button onClick={() => setMaterials((a) => a.filter((x) => x.id !== m.id))} aria-label="Delete" style={iconBtn}><svg width="13" height="13" viewBox="0 0 20 20" fill="none"><path d="M5 6h10M8 6V4.5h4V6M6.5 6l.6 9h5.8l.6-9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 24 }}>{addBtn('Add Material', () => setMaterials((a) => [...a, { id: 'm' + Date.now(), name: 'New material', cost: '— SEK', comp: 'Composition to be set' }]))}</div>

            <div style={sectionTitle}>Trim</div>
            <div style={{ border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: 12 }}>
              <div style={{ display: 'flex', background: 'var(--surface-sunken)', padding: '9px 12px', gap: 10 }}>
                <span style={{ flex: 1, ...eyebrow }}>Trim</span>
                <span style={{ flex: 1, ...eyebrow }}>Material Cost</span>
                <span style={{ width: 30 }}></span>
              </div>
              {trims.map((t) => (
                <div key={t.id} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '10px 12px', borderTop: '1px solid var(--border-hairline)' }}>
                  <MRepairField value={t.name} onChange={(e) => setTrims((a) => a.map((x) => x.id === t.id ? { ...x, name: e.target.value } : x))} placeholder="Eg. Lining" />
                  <MRepairField value={t.cost} onChange={(e) => setTrims((a) => a.map((x) => x.id === t.id ? { ...x, cost: e.target.value } : x))} placeholder="SEK" />
                  <button onClick={() => setTrims((a) => a.filter((x) => x.id !== t.id))} aria-label="Delete" style={iconBtn}><svg width="13" height="13" viewBox="0 0 20 20" fill="none"><path d="M5 6h10M8 6V4.5h4V6M6.5 6l.6 9h5.8l.6-9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
                </div>
              ))}
            </div>
            {addBtn('Add Trim', () => setTrims((a) => [...a, { id: 't' + Date.now(), name: '', cost: '' }]))}
          </div>
        ) : null}

        {step === 2 ? (
          <div>
            <div style={sectionTitle}>Custom Material Information</div>
            <div style={{ border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)', padding: '14px 15px', marginBottom: 14 }}>
              <div style={{ ...eyebrow, marginBottom: 10 }}>Summary</div>
              {[['Repair type', typeOpts.find((o) => o[0] === type)[1]], ['Custom repairs', repairTypes.filter(Boolean).join(', ') || '—'], ['Materials', String(materials.length)], ['Trims', String(trims.filter((t) => t.name).length)], ['Est. time', time ? `${time} ${unit}` : '—']].map(([l, v]) => (
                <div key={l} style={{ display: 'flex', gap: 12, padding: '9px 0', borderTop: '1px solid var(--border-hairline)' }}>
                  <span style={{ flex: '0 0 108px', fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--ink-400)' }}>{l}</span>
                  <span style={{ flex: 1, fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-900)' }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ ...eyebrow, marginBottom: 8 }}>Product After Repair</div>
            <div style={{ height: 140, borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px dashed var(--paper-400)' }}>
              <image-slot id="repair-after" shape="rect" placeholder="Upload image · the repaired product"></image-slot>
            </div>
          </div>
        ) : null}
      </div>

      {/* bottom bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'var(--surface-card)', borderTop: '1px solid var(--border-hairline)', flex: '0 0 auto' }}>
        <button aria-label="Rescan product" style={{ ...iconBtn, width: 38, height: 38, borderRadius: 999 }}><svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M10 4a6 6 0 105.7 4.1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /><path d="M14.5 3v3h-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
        <button onClick={() => (step === 0 ? onBack() : setStep((s) => s - 1))} style={{ marginLeft: 'auto', border: 'none', background: 'transparent', cursor: 'pointer', padding: '10px 14px', fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600, color: 'var(--ink-700)' }}>{step === 0 ? 'Cancel' : 'Back'}</button>
        <button onClick={() => (step < 2 ? setStep((s) => s + 1) : onBack())} style={{ border: 'none', cursor: 'pointer', borderRadius: 'var(--radius-md)', background: 'var(--ink-900)', color: 'var(--paper-50)', padding: '11px 18px', fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600 }}>{step < 2 ? 'Save & Proceed' : 'Submit & Scan Next'}</button>
      </div>
    </div>
  );
}

/* ---- service desk tab (repair · maintenance · refurbishment) ---- */
function MService() {
  const T = window.TT.serviceTypes;
  const S = window.TT.serviceStatus;
  const [jobs, setJobs] = React.useState(window.TT.serviceJobs);
  const [filter, setFilter] = React.useState('all');
  const [openJob, setOpenJob] = React.useState(null);
  const advance = (id) => setJobs((js) => js.map((j) => (j.id === id && S[j.status].next ? { ...j, status: S[j.status].next, requested: j.status === 'in_progress' ? 'just now' : j.requested, sla: S[j.status].next === 'done' ? 'done' : j.sla } : j)));

  const filters = [['all', 'All'], ['repair', 'Repair'], ['maintenance', 'Maintenance'], ['refurb', 'Refurb']];
  const shown = filter === 'all' ? jobs : jobs.filter((j) => j.type === filter);
  const openCount = jobs.filter((j) => j.status !== 'done').length;
  const counts = [
    ['Open jobs', String(openCount)],
    ['In progress', String(jobs.filter((j) => j.status === 'in_progress').length)],
    ['Completed', String(jobs.filter((j) => j.status === 'done').length)],
  ];

  if (openJob) return <MRepairing job={openJob} onBack={() => setOpenJob(null)} />;

  return (
    <div style={{ padding: '18px 16px 24px' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--ink-900)', marginBottom: 2 }}>Service desk</div>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-500)', marginBottom: 16 }}>Repair, maintenance &amp; refurbishment jobs.</div>

      {/* counts */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        {counts.map(([l, v]) => (
          <div key={l} style={{ flex: 1, border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)', padding: '11px 10px' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink-900)', lineHeight: 1 }}>{v}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--ink-400)', marginTop: 5 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* type filter */}
      <div className="tt-tabrow" style={{ display: 'flex', gap: 7, overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none', paddingBottom: 4, marginBottom: 16 }}>
        {filters.map(([id, label]) => {
          const on = filter === id;
          return <button key={id} onClick={() => setFilter(id)} style={{ flex: '0 0 auto', border: `1.5px solid ${on ? 'var(--indigo-400)' : 'var(--paper-400)'}`, background: on ? 'var(--indigo-100)' : 'var(--surface-card)', color: on ? 'var(--indigo-700)' : 'var(--ink-500)', cursor: 'pointer', borderRadius: 'var(--radius-pill)', padding: '6px 13px', fontFamily: 'var(--font-sans)', fontSize: 12.5, fontWeight: on ? 600 : 500 }}>{label}</button>;
        })}
      </div>

      {/* job list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {shown.map((j) => {
          const t = T[j.type];
          const st = S[j.status];
          return (
            <div key={j.id} style={{ border: '1px solid var(--border-hairline)', borderLeft: `3px solid ${t.line}`, borderRadius: 'var(--radius-md)', background: 'var(--surface-card)', padding: '13px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7, flexWrap: 'wrap' }}>
                <MBadge tone={t.tone} size="sm">{t.label}</MBadge>
                <MBadge tone={st.tone} size="sm">{st.label}</MBadge>
                <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--ink-400)' }}>{j.id}</span>
              </div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 600, color: 'var(--ink-900)' }}>{j.issue}</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-500)', marginTop: 2 }}>{j.garment} · batch {j.batch} · {j.owner}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 11 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: j.status === 'done' ? 'var(--leaf-600)' : 'var(--ink-400)' }}>
                  {j.status === 'done' ? '✓ logged to passport' : `SLA ${j.sla} · requested ${j.requested}`}
                </span>
                {j.type === 'repair' && j.status !== 'done' ? (
                  <button onClick={() => setOpenJob(j)} style={{ marginLeft: 'auto', border: '1px solid var(--paper-400)', cursor: 'pointer', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)', color: 'var(--ink-800)', padding: '7px 13px', fontFamily: 'var(--font-sans)', fontSize: 12.5, fontWeight: 600 }}>Open repair</button>
                ) : null}
                {st.action ? (
                  <button onClick={() => (j.type === 'repair' && j.status === 'new' ? setOpenJob(j) : advance(j.id))} style={{ marginLeft: j.type === 'repair' && j.status !== 'done' ? 0 : 'auto', border: 'none', cursor: 'pointer', borderRadius: 'var(--radius-md)', background: j.status === 'in_progress' ? 'var(--brand)' : 'var(--ink-900)', color: 'var(--paper-50)', padding: '7px 13px', fontFamily: 'var(--font-sans)', fontSize: 12.5, fontWeight: 600 }}>{st.action}</button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---- FAB quick-action drawers: mint batch · verify cert · new record ---- */
function MRing75({ pct }) {
  const size = 128, stroke = 11, r = (size - stroke) / 2, c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--paper-300)" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--indigo-500)" strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} style={{ transition: 'stroke-dashoffset 0.12s linear' }} />
    </svg>
  );
}

function MStepperCtrl({ value, onChange, min = 1, max = 999 }) {
  const btn = { width: 52, height: 52, flex: '0 0 auto', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-hairline)', background: 'var(--surface-card)', cursor: 'pointer', color: 'var(--ink-900)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <button onClick={() => onChange(Math.max(min, value - 1))} aria-label="Decrease" style={btn}><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4 9h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg></button>
      <input value={value} onChange={(e) => { const n = parseInt(e.target.value.replace(/\D/g, ''), 10); onChange(Math.max(min, Math.min(max, isNaN(n) ? min : n))); }} inputMode="numeric" style={{ flex: 1, minWidth: 0, textAlign: 'center', height: 52, border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)', fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 600, color: 'var(--ink-900)', outline: 'none' }} />
      <button onClick={() => onChange(Math.min(max, value + 1))} aria-label="Increase" style={btn}><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 4v10M4 9h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg></button>
    </div>
  );
}

function MMintWizard({ onClose }) {
  const skus = Array.from(new Set(window.TT.ledger.map((r) => r.garment)));
  const [sku, setSku] = React.useState(skus[0] || '');
  const [qty, setQty] = React.useState(50);
  const [step, setStep] = React.useState(0);
  const [pct, setPct] = React.useState(0);
  const [ids, setIds] = React.useState(null);
  const [done, setDone] = React.useState(false);
  React.useEffect(() => {
    if (step !== 1) return;
    if (pct >= 100) { const t = setTimeout(() => setStep(2), 450); return () => clearTimeout(t); }
    const t = setTimeout(() => setPct((p) => Math.min(100, p + Math.ceil(Math.random() * 11) + 3)), 90);
    return () => clearTimeout(t);
  }, [step, pct]);
  const eyebrow = { fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-400)' };
  const run = () => { setIds(Array.from({ length: qty }, genId)); setPct(0); setStep(1); };
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 23, color: 'var(--ink-900)' }}>Mint new batch</span>
      </div>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-500)', marginBottom: 18 }}>Passport IDs for a production run — ready for the embroidery machine.</div>
      {/* step dots */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        {[0, 1, 2].map((i) => <span key={i} style={{ flex: 1, height: 4, borderRadius: 999, background: step >= i ? 'var(--indigo-500)' : 'var(--paper-300)' }} />)}
      </div>

      {step === 0 ? (
        <div>
          <div style={{ ...eyebrow, marginBottom: 9 }}>Garment / SKU</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 22 }}>
            {skus.map((s) => {
              const on = sku === s;
              return <button key={s} onClick={() => setSku(s)} style={{ display: 'flex', alignItems: 'center', gap: 10, minHeight: 52, border: `1.5px solid ${on ? 'var(--indigo-400)' : 'var(--paper-400)'}`, background: on ? 'var(--indigo-100)' : 'var(--surface-card)', cursor: 'pointer', borderRadius: 'var(--radius-md)', padding: '0 14px', textAlign: 'left' }}>
                <span style={{ width: 18, height: 18, borderRadius: '50%', flex: '0 0 auto', border: `2px solid ${on ? 'var(--indigo-500)' : 'var(--paper-400)'}`, background: on ? 'var(--indigo-500)' : 'transparent', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{on ? <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} /> : null}</span>
                <span style={{ flex: 1, fontFamily: 'var(--font-sans)', fontSize: 14.5, fontWeight: on ? 700 : 500, color: 'var(--ink-900)' }}>{s}</span>
              </button>;
            })}
          </div>
          <div style={{ ...eyebrow, marginBottom: 9 }}>Units in run</div>
          <div style={{ marginBottom: 22 }}><MStepperCtrl value={qty} onChange={setQty} min={1} max={500} /></div>
          <MButton variant="primary" size="lg" fullWidth onClick={run}>Generate {qty} tokens</MButton>
        </div>
      ) : null}

      {step === 1 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '14px 0 22px' }}>
          <div style={{ position: 'relative', width: 128, height: 128, marginBottom: 20 }}>
            <MRing75 pct={pct} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 30, color: 'var(--ink-900)', lineHeight: 1 }}>{pct}%</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-400)', marginTop: 3 }}>minting</span>
            </div>
          </div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600, color: 'var(--ink-900)' }}>Generating {qty} cryptographic tokens…</div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-500)', marginTop: 3 }}>{sku}</div>
        </div>
      ) : null}

      {step === 2 ? (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '13px 14px', border: '1px solid var(--leaf-600)', borderRadius: 'var(--radius-md)', background: 'var(--leaf-100)', marginBottom: 16 }}>
            <span style={{ width: 26, height: 26, borderRadius: '50%', flex: '0 0 auto', background: 'var(--leaf-600)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7.2l2.6 2.6L11 4.4" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
            <span style={{ flex: 1 }}><span style={{ display: 'block', fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 700, color: 'var(--ink-900)' }}>{qty} tokens minted</span><span style={{ display: 'block', fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--ink-600)' }}>{sku} · queued to Edge DB</span></span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 7, marginBottom: 16 }}>
            {(ids || []).slice(0, 10).map((id) => (
              <div key={id} style={{ aspectRatio: '1 / 1', borderRadius: 6, border: '1px solid var(--border-hairline)', background: 'var(--surface-page)', backgroundImage: 'repeating-conic-gradient(var(--ink-900) 0% 25%, transparent 0% 50%)', backgroundSize: '7px 7px', opacity: 0.85 }} title={id} />
            ))}
          </div>
          {done ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '11px 13px', border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-sunken)' }}>
              <span style={{ fontSize: 15 }}>↓</span>
              <span style={{ flex: 1, fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-700)' }}>Downloaded <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--ink-900)' }}>tt-{qty}-qr-matrix.svg.zip</span></span>
            </div>
          ) : (
            <MButton variant="primary" size="lg" fullWidth onClick={() => setDone(true)}>Download SVG archive</MButton>
          )}
        </div>
      ) : null}
    </div>
  );
}

function MVerifyDropzone({ onClose }) {
  const CERTS = [
    { name: 'GOTS-scope-2025.pdf', label: 'GOTS', full: 'Global Organic Textile Standard' },
    { name: 'OEKO-TEX-100-cert.pdf', label: 'OEKO-TEX 100', full: 'Harmful-substance testing' },
    { name: 'GRS-recycled-decl.pdf', label: 'GRS', full: 'Global Recycled Standard' },
  ];
  const [file, setFile] = React.useState(null);
  const idx = React.useRef(0);
  const drop = () => {
    const c = CERTS[idx.current % CERTS.length]; idx.current++;
    setFile({ ...c, state: 'checking' });
    setTimeout(() => setFile((f) => (f ? { ...f, state: 'anchored' } : f)), 1600);
  };
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 23, color: 'var(--ink-900)', marginBottom: 4 }}>Verify a certificate</div>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-500)', marginBottom: 18 }}>Drop a supplier certificate to anchor it cryptographically to this facility.</div>

      {!file ? (
        <button onClick={drop} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 9, width: '100%', minHeight: 168, border: '1.5px dashed var(--paper-400)', borderRadius: 'var(--radius-lg)', background: 'var(--surface-page)', cursor: 'pointer' }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" style={{ color: 'var(--ink-400)' }}><path d="M12 16V6M8 9.5L12 5.5l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /><path d="M4 15v3a1 1 0 001 1h14a1 1 0 001-1v-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 14.5, fontWeight: 600, color: 'var(--ink-800)' }}>Drop a PDF or tap to upload</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-300)', letterSpacing: '0.04em' }}>MOCKED · GOTS · OEKO-TEX · GRS</span>
        </button>
      ) : (
        <div style={{ border: `1px solid ${file.state === 'anchored' ? 'var(--leaf-600)' : 'var(--border-hairline)'}`, borderRadius: 'var(--radius-lg)', background: file.state === 'anchored' ? 'var(--leaf-100)' : 'var(--surface-card)', padding: '16px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 14 }}>
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" style={{ color: 'var(--madder-500)', flex: '0 0 auto' }}><path d="M4 1.5h5l3 3v10H4V1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" /><path d="M9 1.5v3h3" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" /></svg>
            <span style={{ flex: 1, minWidth: 0 }}><span style={{ display: 'block', fontFamily: 'var(--font-sans)', fontSize: 13.5, fontWeight: 700, color: 'var(--ink-900)' }}>{file.name}</span><span style={{ display: 'block', fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--ink-500)' }}>{file.full}</span></span>
          </div>
          {file.state === 'checking' ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0' }}>
              <span className="tt-spin" style={{ width: 20, height: 20, borderRadius: '50%', border: '2.5px solid var(--indigo-200)', borderTopColor: 'var(--indigo-600)', flex: '0 0 auto' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-600)' }}>Hashing &amp; anchoring to ledger…</span>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 12 }}>
                <span style={{ width: 26, height: 26, borderRadius: '50%', flex: '0 0 auto', background: 'var(--leaf-600)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7.2l2.6 2.6L11 4.4" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 700, color: 'var(--leaf-600)' }}>Cryptographically anchored</span>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <MBadge tone="verified" size="sm">{file.label}</MBadge>
                <MBadge tone="info" size="sm">Tier 4 · factory origin</MBadge>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--ink-400)', marginTop: 12, wordBreak: 'break-all' }}>sha256:{genId().replace(/[^A-F0-9]/g, '').toLowerCase()}a1{genId().replace(/[^A-F0-9]/g, '').toLowerCase()}</div>
            </div>
          )}
        </div>
      )}
      {file ? <MButton variant="secondary" size="lg" fullWidth style={{ marginTop: 14 }} onClick={() => setFile(null)}>Add another</MButton> : null}
    </div>
  );
}

function MFabMenu({ onPick }) {
  const rows = [
    ['mint', 'Mint new batch', 'SKU → volume → QR tokens → download', <svg key="i" width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" /><rect x="11" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" /><rect x="3" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" /><path d="M11 11h3v3M17 11v6M14 17h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>],
    ['verify', 'Verify a certificate', 'Anchor GOTS / OEKO-TEX to Tier 4', <svg key="i" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2l6 2.6v4c0 3.7-2.5 6.1-6 7.4-3.5-1.3-6-3.7-6-7.4v-4L10 2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /><path d="M7.4 9.8l1.8 1.8 3.4-3.9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>],
    ['newrecord', 'New product record', 'Author a full DPP record', <svg key="i" width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="4" y="3" width="12" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.4" /><path d="M7 7h6M7 10h6M7 13h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>],
  ];
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-400)', marginBottom: 12 }}>Quick actions</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {rows.map(([id, label, sub, icon]) => (
          <button key={id} onClick={() => onPick(id)} style={{ display: 'flex', alignItems: 'center', gap: 13, width: '100%', minHeight: 64, border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)', cursor: 'pointer', padding: '0 15px', textAlign: 'left' }}>
            <span style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', flex: '0 0 auto', background: 'var(--indigo-100)', color: 'var(--indigo-700)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</span>
            <span style={{ flex: 1, minWidth: 0 }}><span style={{ display: 'block', fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 700, color: 'var(--ink-900)' }}>{label}</span><span style={{ display: 'block', fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-500)', marginTop: 1 }}>{sub}</span></span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: 'var(--ink-300)', flex: '0 0 auto' }}><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---- shell + tab bar ---- */
function MSeg({ options, value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 4, padding: 3, margin: '14px 16px 0', background: 'var(--surface-sunken)', border: '1px solid var(--border-hairline)', borderRadius: 999 }}>
      {options.map(([id, label]) => {
        const on = value === id;
        return <button key={id} onClick={() => onChange(id)} style={{ flex: 1, border: 'none', cursor: 'pointer', borderRadius: 999, padding: '7px 10px', background: on ? 'var(--surface-card)' : 'transparent', boxShadow: on ? 'var(--shadow-xs)' : 'none', fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: on ? 700 : 500, color: on ? 'var(--ink-900)' : 'var(--ink-500)' }}>{label}</button>;
      })}
    </div>
  );
}
const M_TABS = [
  ['products', 'Products', <svg key="i" viewBox="0 0 20 20" fill="none"><rect x="3" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4" /><rect x="11" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4" /><rect x="3" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4" /><rect x="11" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4" /></svg>],
  ['record', 'Story', <svg key="i" viewBox="0 0 20 20" fill="none"><path d="M4 3.5h7l3 3V16.5H4z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /><path d="M7 8h5M7 11h5M7 14h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>],
  ['service', 'Repair', <svg key="i" viewBox="0 0 20 20" fill="none"><path d="M11.5 3.5a3 3 0 00-4 4l-4 4 2 2 4-4a3 3 0 004-4l-2 2-2-2 2-2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg>],
  ['certs', 'Certs', <svg key="i" viewBox="0 0 20 20" fill="none"><path d="M10 2l6 2.6v4c0 3.7-2.5 6.1-6 7.4-3.5-1.3-6-3.7-6-7.4v-4L10 2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /><path d="M7.4 9.8l1.8 1.8 3.4-3.9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>],
];

function SupplierMobileApp() {
  const [phase, setPhase] = React.useState('signin');
  const [tab, setTab] = React.useState('products');
  const [fab, setFab] = React.useState(null); // null | menu | mint | verify | newrecord
  const tabRowRef = React.useRef(null);
  const tabBtnRefs = React.useRef({});
  React.useEffect(() => {
    const row = tabRowRef.current, btn = tabBtnRefs.current[tab];
    if (!row || !btn) return;
    const left = btn.offsetLeft, right = left + btn.offsetWidth;
    if (right > row.scrollLeft + row.clientWidth) row.scrollTo({ left: right - row.clientWidth + 12, behavior: 'smooth' });
    else if (left < row.scrollLeft) row.scrollTo({ left: Math.max(0, left - 12), behavior: 'smooth' });
  }, [tab]);
  const [sheet, setSheet] = React.useState(null);
  const [online, setOnline] = React.useState(true);
  const [queue, setQueue] = React.useState(0);
  const [pendingSync, setPendingSync] = React.useState([]);
  const [drafts, setDrafts] = React.useState([]);
  const [syncing, setSyncing] = React.useState(false);
  const timer = React.useRef(null);
  React.useEffect(() => () => clearInterval(timer.current), []);

  function scan() {
    setQueue((q) => q + 137);
    if (!online) setPendingSync((p) => p.includes('0044') ? p : [...p, '0044']);
  }
  function reconnect() {
    if (!queue && !pendingSync.length) { setOnline(true); return; }
    setSyncing(true);
    clearInterval(timer.current);
    timer.current = setTimeout(() => { setSyncing(false); setQueue(0); setPendingSync([]); setOnline(true); }, 1400);
  }

  function createItem(item) {
    setDrafts((d) => [{ ...item, honesty: item.honesty ?? null, status: item.status || 'draft', updated: 'just now', isDraft: true }, ...d]);
    setTab('products');
  }

  if (phase === 'signin') return <MSignIn onIn={() => setPhase('app')} />;

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--surface-page)' }}>
      {/* top nav — single row (mirrors consumer TopNav) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderBottom: '1px solid var(--border-hairline)', background: 'var(--surface-card)', flex: '0 0 auto' }}>
        <img src={(window.__resources && window.__resources.logoMark) || "../assets/logo-mark.svg"} width="20" height="20" alt="" style={{ flex: '0 0 auto' }} />
        <button onClick={() => setTab('scan')} aria-label="Scan" title="Scan"
          style={{ border: 'none', background: tab === 'scan' ? 'var(--indigo-100)' : 'transparent', cursor: 'pointer', padding: 5, borderRadius: 'var(--radius-md)', color: tab === 'scan' ? 'var(--indigo-700)' : 'var(--ink-500)', display: 'inline-flex', flex: '0 0 auto' }}>
          <svg width="19" height="19" viewBox="0 0 20 20" fill="none"><path d="M2.5 6.5V4A1.5 1.5 0 014 2.5h2.5M13.5 2.5H16A1.5 1.5 0 0117.5 4v2.5M17.5 13.5V16a1.5 1.5 0 01-1.5 1.5h-2.5M6.5 17.5H4A1.5 1.5 0 012.5 16v-2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /><path d="M4 10h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
        </button>
        <div ref={tabRowRef} className="tt-tabrow" onWheel={(e) => { if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) { tabRowRef.current.scrollLeft += e.deltaY; } }} style={{ display: 'flex', gap: 10, marginLeft: 2, flex: 1, minWidth: 0, overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch', paddingRight: 8, WebkitMaskImage: 'linear-gradient(to right, #000 calc(100% - 20px), transparent)', maskImage: 'linear-gradient(to right, #000 calc(100% - 20px), transparent)' }}>
          {M_TABS.map(([id, label]) => {
            const on = tab === id;
            return (
              <button key={id} ref={(el) => { tabBtnRefs.current[id] = el; }} onClick={() => setTab(id)}
                style={{ border: 'none', borderBottom: on ? '2px solid var(--indigo-500)' : '2px solid transparent', background: 'transparent', cursor: 'pointer', whiteSpace: 'nowrap', flex: '0 0 auto', padding: '7px 4px 6px', fontFamily: 'var(--font-sans)', fontSize: 13.5, fontWeight: on ? 700 : 400, letterSpacing: '0.01em', color: on ? 'var(--indigo-700)' : 'var(--ink-400)' }}>{label}</button>
            );
          })}
        </div>
        <button onClick={() => setSheet('account')} aria-label="Account" title="Account"
          style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 4, color: 'var(--indigo-500)', display: 'inline-flex', flex: '0 0 auto', position: 'relative' }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="6.2" r="3" stroke="currentColor" strokeWidth="1.4" /><path d="M3.2 15.2c1-2.6 3.2-4 5.8-4s4.8 1.4 5.8 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
          <span style={{ position: 'absolute', top: 3, right: 2, width: 7, height: 7, borderRadius: '50%', background: online ? 'var(--leaf-600)' : 'var(--ochre-500)', border: '1.5px solid var(--surface-card)' }}></span>
        </button>
        <button onClick={() => setSheet('help')} aria-label="What is the business companion?" title="What is the business companion?"
          style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 4, color: 'var(--ink-300)', display: 'inline-flex', flex: '0 0 auto' }}>
          <svg width="17" height="17" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.4" /><path d="M7 7a2 2 0 013.4 1.4c0 1.2-1.4 1.4-1.4 2.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /><circle cx="9" cy="13" r="0.9" fill="currentColor" /></svg>
        </button>
      </div>

      {/* body */}
      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
        {tab === 'products' ? <MLedger pendingSync={pendingSync} drafts={drafts} onGoScan={() => setTab('scan')} onGoNew={() => setFab('newrecord')} /> : null}
        {tab === 'scan' ? <MScan online={online} queue={queue} onScan={scan} /> : null}
        {tab === 'record' ? <MRecord onGoCerts={() => setTab('certs')} onViewPassport={() => { window.location.href = '/consumer'; }} /> : null}
        {tab === 'service' ? <MService /> : null}
        {tab === 'certs' ? <MCerts /> : null}
      </div>

      {/* sync strip */}
      {syncing ? (
        <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderTop: '2px solid var(--indigo-400)', background: 'var(--indigo-100)' }}>
          <div className="tt-spin" style={{ width: 18, height: 18, borderRadius: '50%', border: '2.5px solid var(--indigo-300)', borderTopColor: 'var(--indigo-700)', flex: '0 0 auto' }}></div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--indigo-900)' }}>Pushing {queue ? `${queue} scans` : 'edits'} to Edge DB…</span>
        </div>
      ) : !online || queue ? (
        <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 16px', borderTop: `2px solid ${online ? 'var(--indigo-400)' : 'var(--ochre-500)'}`, background: online ? 'var(--indigo-100)' : 'var(--ochre-100)' }}>
          <span style={{ flex: 1, fontFamily: 'var(--font-sans)', fontSize: 12.5, fontWeight: 600, color: online ? 'var(--indigo-900)' : 'var(--ochre-600)' }}>{online ? `${queue} scans ready to push` : `Offline · ${queue} scans buffered`}</span>
          <button onClick={reconnect} style={{ minHeight: 36, border: 'none', background: 'var(--brand)', color: 'var(--paper-50)', cursor: 'pointer', borderRadius: 'var(--radius-md)', padding: '0 13px', fontFamily: 'var(--font-sans)', fontSize: 12.5, fontWeight: 600 }}>{online ? 'Push now' : 'Reconnect & sync'}</button>
        </div>
      ) : (
        <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px', borderTop: '1px solid var(--border-hairline)', background: 'var(--surface-card)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 7, fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--ink-500)' }}>
            <span style={{ width: 7, height: 7, borderRadius: 999, background: 'var(--leaf-600)' }}></span>
            Edge DB live · synced
          </span>
          <button onClick={() => setOnline(false)} style={{ border: '1px solid var(--paper-400)', background: 'transparent', cursor: 'pointer', borderRadius: 'var(--radius-md)', padding: '4px 9px', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-500)', letterSpacing: '0.03em' }}>Simulate offline</button>
        </div>
      )}

      <MSheet open={sheet === 'account'} onClose={() => setSheet(null)}>
        <MProfile online={online} inSheet onSignOut={() => { setSheet(null); setPhase('signin'); }} />
      </MSheet>
      <MSheet open={sheet === 'help'} onClose={() => setSheet(null)}>
        <MHelpSheet onClose={() => setSheet(null)} />
      </MSheet>

      {/* FAB + quick-action drawers */}
      {!fab && !sheet ? (
        <button onClick={() => setFab('menu')} aria-label="Quick actions" title="Quick actions" style={{ position: 'absolute', right: 16, bottom: 84, width: 56, height: 56, borderRadius: '50%', background: 'var(--brand)', color: 'var(--paper-50)', border: 'none', cursor: 'pointer', boxShadow: 'var(--shadow-lg)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', zIndex: 60 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        </button>
      ) : null}
      <MSheet open={fab === 'menu'} onClose={() => setFab(null)}>
        <MFabMenu onPick={(k) => setFab(k)} />
      </MSheet>
      <MSheet open={fab === 'mint'} onClose={() => setFab(null)}>
        <MMintWizard onClose={() => setFab(null)} />
      </MSheet>
      <MSheet open={fab === 'verify'} onClose={() => setFab(null)}>
        <MVerifyDropzone onClose={() => setFab(null)} />
      </MSheet>
      <MSheet open={fab === 'newrecord'} onClose={() => setFab(null)}>
        <MNewItem onCreate={(item) => { createItem(item); setFab(null); }} />
      </MSheet>
    </div>
  );
}

window.SupplierMobileApp = SupplierMobileApp;
