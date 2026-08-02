// ThreadTrace supplier console — S1 Sign-in → S2 Operations Ledger → S3 Record Authoring
// → S4 Certifications (+ multi-step upload wizard), + real QR generation on publish.
// Desktop. Exports window.SupplierApp.
const { Button: SButton, Input: SInput, Badge: SBadge,
        HonestyMark: SMark, HonestyRing: SRing } = window.ThreadTraceDesignSystem_f6483d;

const CERT_TYPE = Object.fromEntries(window.TT.certTypes.map((t) => [t.id, t]));
var { ttFmtYM, PublishGateModal, AuditModal } = window;

// "now" for validity math — matches the prototype's world clock (mid-2026).
const NOW = new Date(2026, 6, 1);
function computeCertStatus(expires) {
  if (!expires || !/^\d{4}-\d{2}$/.test(expires)) return 'valid';
  const [y, m] = expires.split('-').map(Number);
  const exp = new Date(y, m - 1, 1);
  if (exp <= NOW) return 'expired';
  const months = (exp.getFullYear() - NOW.getFullYear()) * 12 + (exp.getMonth() - NOW.getMonth());
  return months <= 2 ? 'expiring' : 'valid';
}
// mock document extraction per standard
const EXTRACT = {
  gots:     { issuer: 'Control Union', issued: '2026-03', expires: '2027-03' },
  oekotex:  { issuer: 'Hohenstein',    issued: '2026-01', expires: '2027-01' },
  grs:      { issuer: 'Control Union', issued: '2025-11', expires: '2027-11' },
  bluesign: { issuer: 'bluesign tech', issued: '2026-02', expires: '2027-02' },
  iso14001: { issuer: 'SGS',           issued: '2025-06', expires: '2028-06' },
  fsc:      { issuer: 'SCS Global',    issued: '2026-04', expires: '2027-04' },
};
function randRef(type) {
  const p = { gots: 'GT', oekotex: 'SH', grs: 'GRS', bluesign: 'BS', iso14001: 'EN', fsc: 'FSC' }[type] || 'XX';
  return p + '-' + Math.floor(1000 + Math.random() * 8999);
}

/* ================= shared: modal ================= */

function Modal({ open, onClose, width = 460, children }) {
  if (!open) return null;
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 1300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(28,24,20,0.4)', backdropFilter: 'blur(2px)' }} />
      <div className="tt-fade" style={{ position: 'relative', width, maxWidth: '92%', maxHeight: '90%', overflowY: 'auto', background: 'var(--surface-card)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)', padding: '24px 26px' }}>
        {children}
      </div>
    </div>
  );
}

/* ================= shared: real QR ================= */

// Builds the QR SVG string. `gap` insets each module (fraction of a cell) to
// counteract textile warp/bleed — the adaptive QA compensation.
function buildQrSvg(text, size, dark, gap) {
  const qr = window.qrcode(0, 'M');
  qr.addData(text); qr.make();
  const n = qr.getModuleCount();
  const cell = size / (n + 8);
  const off = cell * 4;
  const inset = cell * (gap || 0) * 0.5;
  const w = Math.max(0.4, cell - inset * 2);
  let rects = '';
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (qr.isDark(r, c)) rects += `<rect x="${(off + c * cell + inset).toFixed(2)}" y="${(off + r * cell + inset).toFixed(2)}" width="${w.toFixed(2)}" height="${w.toFixed(2)}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><rect width="${size}" height="${size}" fill="#FAF8F3"/><g fill="${dark}">${rects}</g></svg>`;
}

function QRCode({ text, size = 200, dark = 'var(--ink-900)', gap = 0 }) {
  const html = React.useMemo(() => {
    try { return buildQrSvg(text, size, dark, gap); }
    catch (e) { return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" fill="#E8E2D4"/></svg>`; }
  }, [text, size, dark, gap]);
  return <div aria-label={`QR code for ${text}`} style={{ width: size, height: size, borderRadius: 'var(--radius-sm)', overflow: 'hidden' }} dangerouslySetInnerHTML={{ __html: html }} />;
}

function qrPngDataUrl(text, px = 640, gap = 0) {
  const qr = window.qrcode(0, 'M');
  qr.addData(text); qr.make();
  const n = qr.getModuleCount();
  const cell = Math.floor(px / (n + 8));
  const size = cell * (n + 8);
  const cv = document.createElement('canvas');
  cv.width = size; cv.height = size;
  const ctx = cv.getContext('2d');
  ctx.fillStyle = '#FAF8F3'; ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = '#1C1814';
  const off = cell * 4;
  const inset = cell * (gap || 0) * 0.5;
  const w = Math.max(1, cell - inset * 2);
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (qr.isDark(r, c)) ctx.fillRect(off + c * cell + inset, off + r * cell + inset, w, w);
  return cv.toDataURL('image/png');
}

function downloadBlob(dataUrl, filename) {
  const a = document.createElement('a');
  a.href = dataUrl; a.download = filename; a.click();
}

/* ================= shared: cert bits ================= */

function CertStatusPill({ status }) {
  const s = window.TT.CERT_STATUS[status];
  return <SBadge tone={s.tone} size="sm">{s.label}</SBadge>;
}

function CertFileIcon({ size = 42 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: 6, background: 'var(--surface-sunken)', flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size * 0.45} height={size * 0.45} viewBox="0 0 20 20" fill="none" style={{ color: 'var(--ink-500)' }}><path d="M5 2h7l3 3v13H5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /><path d="M12 2v3h3" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /><path d="M7.5 11.5l1.5 1.5 3-3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </div>
  );
}

/* ================= cert upload wizard (multi-step) ================= */

const WIZ_STEPS = ['Standard', 'Document', 'Details', 'Review'];

function WizStepper({ step }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 22 }}>
      {WIZ_STEPS.map((label, i) => {
        const state = i < step ? 'checked' : i === step ? 'told' : 'notyet';
        const active = i === step;
        return (
          <React.Fragment key={label}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: '0 0 auto' }}>
              <SMark state={state} size={20} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '0.06em', textTransform: 'uppercase', color: active ? 'var(--ink-800)' : 'var(--ink-400)', fontWeight: active ? 600 : 400 }}>{label}</span>
            </div>
            {i < WIZ_STEPS.length - 1 ? <div style={{ flex: 1, height: 2, marginTop: 9, borderTop: `2px dashed ${i < step ? 'var(--leaf-400)' : 'var(--paper-400)'}` }} /> : null}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function StdCard({ t, active, onClick }) {
  return (
    <button onClick={onClick} style={{ display: 'flex', flexDirection: 'column', gap: 4, textAlign: 'left', padding: '12px 14px', cursor: 'pointer',
      borderRadius: 'var(--radius-md)', background: active ? 'var(--indigo-100)' : 'var(--surface-card)',
      border: `1.5px solid ${active ? 'var(--indigo-400)' : 'var(--border-hairline)'}` }}>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--ink-900)' }}>{t.name}</span>
      <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--ink-500)', lineHeight: 1.35 }}>{t.full}</span>
    </button>
  );
}

function LabeledField({ label, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase', color: 'var(--ink-500)', marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );
}

function CertWizard({ open, onClose, onComplete, attachLabel, presetStd, renewMode }) {
  const [step, setStep] = React.useState(0);
  const [std, setStd] = React.useState(null);
  const [file, setFile] = React.useState(null); // { name, progress, done }
  const [form, setForm] = React.useState({ ref: '', issuer: '', issued: '', expires: '' });
  const timer = React.useRef(null);

  React.useEffect(() => {
    if (open) { setStd(presetStd || null); setStep(presetStd ? 1 : 0); setFile(null); setForm({ ref: '', issuer: '', issued: '', expires: '' }); }
    return () => clearInterval(timer.current);
  }, [open]);

  function pickStandard(id) {
    setStd(id);
    // reset any prior extraction if standard changed
    setFile(null);
    setForm({ ref: '', issuer: '', issued: '', expires: '' });
  }

  function startUpload(name) {
    setFile({ name, progress: 0, done: false });
    clearInterval(timer.current);
    timer.current = setInterval(() => {
      setFile((f) => {
        if (!f) return f;
        const p = Math.min(100, f.progress + 12);
        if (p >= 100) {
          clearInterval(timer.current);
          const ex = EXTRACT[std] || {};
          setForm({ ref: randRef(std), issuer: ex.issuer || '', issued: ex.issued || '', expires: ex.expires || '' });
          return { ...f, progress: 100, done: true };
        }
        return { ...f, progress: p };
      });
    }, 120);
  }

  const t = std ? CERT_TYPE[std] : null;
  const status = computeCertStatus(form.expires);
  const canNext = [!!std, !!(file && file.done), !!(form.ref && form.issuer && form.issued && form.expires), true][step];

  function finish() {
    const cert = { id: 'c' + Date.now(), type: std, ref: form.ref.trim(), issuer: form.issuer.trim(), issued: form.issued, expires: form.expires, status, file: file ? file.name : 'certificate.pdf' };
    onComplete(cert, `${t.name} ${cert.ref}`);
  }

  return (
    <Modal open={open} onClose={onClose} width={540}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 4 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 23, color: 'var(--ink-900)', whiteSpace: 'nowrap' }}>Upload certificate</div>
        <button onClick={onClose} aria-label="Close" style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--ink-400)', fontSize: 22, lineHeight: 1 }}>×</button>
      </div>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13.5, color: 'var(--ink-500)', marginBottom: 20 }}>
        {renewMode ? <span>Renew. The new proof replaces the lapsing one.</span> : attachLabel ? <span>Adds to your library and backs <strong style={{ color: 'var(--ink-700)' }}>{attachLabel}</strong>.</span> : 'Add a textile or sustainability proof to your library.'}
      </div>

      <WizStepper step={step} />

      {/* STEP 0 — choose standard */}
      {step === 0 ? (
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase', color: 'var(--ink-400)', margin: '4px 0 8px' }}>Textile</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
            {window.TT.certTypes.filter((x) => x.kind === 'textile').map((x) => <StdCard key={x.id} t={x} active={std === x.id} onClick={() => pickStandard(x.id)} />)}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase', color: 'var(--ink-400)', margin: '4px 0 8px' }}>Sustainability</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {window.TT.certTypes.filter((x) => x.kind === 'sustainability').map((x) => <StdCard key={x.id} t={x} active={std === x.id} onClick={() => pickStandard(x.id)} />)}
          </div>
        </div>
      ) : null}

      {/* STEP 1 — upload document */}
      {step === 1 ? (
        <div>
          {!file ? (
            <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '34px 20px', border: '1.5px dashed var(--paper-400)', borderRadius: 'var(--radius-md)', background: 'var(--paper-100)', cursor: 'pointer', textAlign: 'center' }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" style={{ color: 'var(--indigo-500)' }}><path d="M12 16V4M7 9l5-5 5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /><path d="M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 600, color: 'var(--ink-800)' }}>Drop the {t.name} certificate</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-500)' }}>PDF or image · we read it to pre-fill the details</span>
              <input type="file" accept=".pdf,image/*" style={{ display: 'none' }} onChange={(e) => startUpload((e.target.files[0] && e.target.files[0].name) || `${std}-certificate.pdf`)} />
              <span style={{ marginTop: 6, fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--ink-300)', letterSpacing: '0.04em' }}>MOCKED · picks a sample if none chosen</span>
            </label>
          ) : (
            <div style={{ padding: '18px 20px', border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <CertFileIcon />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14.5, fontWeight: 600, color: 'var(--ink-900)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: file.done ? 'var(--leaf-600)' : 'var(--ink-400)', letterSpacing: '0.03em', marginTop: 1 }}>{file.done ? '✓ read · 4 fields extracted' : 'Reading document…'}</div>
                </div>
                {file.done ? <SMark state="checked" size={20} /> : null}
              </div>
              <div style={{ height: 6, background: 'var(--paper-200)', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ width: file.progress + '%', height: '100%', background: file.done ? 'var(--leaf-500,var(--leaf-600))' : 'var(--indigo-400)', borderRadius: 999, transition: 'width 120ms linear' }} />
              </div>
              {file.done ? <button onClick={() => setFile(null)} style={{ marginTop: 12, border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--indigo-500)' }}>Replace file</button> : null}
            </div>
          )}
        </div>
      ) : null}

      {/* STEP 2 — verify details */}
      {step === 2 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-500)' }}>
            <SMark state="checked" size={16} /> Extracted from <strong style={{ color: 'var(--ink-700)' }}>{file ? file.name : 'document'}</strong>. Check and correct.
          </div>
          <LabeledField label="Standard">
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 15, color: 'var(--ink-900)', padding: '9px 12px', border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-sunken)' }}>{t.name} — {t.full}</div>
          </LabeledField>
          <SInput label="Certificate ref" mono value={form.ref} onChange={(e) => setForm({ ...form, ref: e.target.value })} />
          <SInput label="Issuing body" value={form.issuer} onChange={(e) => setForm({ ...form, issuer: e.target.value })} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <SInput label="Issued (YYYY-MM)" mono value={form.issued} onChange={(e) => setForm({ ...form, issued: e.target.value })} />
            <SInput label="Expires (YYYY-MM)" mono value={form.expires} onChange={(e) => setForm({ ...form, expires: e.target.value })} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-500)' }}>
            Validity from expiry: <CertStatusPill status={status} />
          </div>
        </div>
      ) : null}

      {/* STEP 3 — review */}
      {step === 3 ? (
        <div>
          <div style={{ display: 'flex', gap: 14, padding: '18px 20px', border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)', marginBottom: 14 }}>
            <CertFileIcon size={48} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 19, color: 'var(--ink-900)' }}>{t.name}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-400)' }}>{form.ref}</span>
              </div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-500)', marginTop: 2 }}>{t.full} · {form.issuer}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-400)', marginTop: 6 }}>issued {form.issued} · expires {form.expires}</div>
            </div>
            <CertStatusPill status={status} />
          </div>
          <div style={{ padding: '14px 16px', border: '1px dashed var(--paper-400)', borderRadius: 'var(--radius-md)', background: 'var(--paper-100)', fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-600)', lineHeight: 1.5 }}>
            {status === 'expired'
              ? <span>This proof is <strong>expired</strong>. It will be stored but cannot back a <strong>Checked</strong> mark until renewed.</span>
              : attachLabel
                ? <span>On confirm, this backs <strong>{attachLabel}</strong> and raises it to <strong style={{ color: 'var(--leaf-600)' }}>Checked</strong>.</span>
                : <span>On confirm, this is added to your library and can back a <strong style={{ color: 'var(--leaf-600)' }}>Checked</strong> mark on any record.</span>}
          </div>
        </div>
      ) : null}

      {/* footer nav */}
      <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
        {step > 0 ? <SButton variant="ghost" onClick={() => setStep(step - 1)}>Back</SButton> : <SButton variant="ghost" onClick={onClose}>Cancel</SButton>}
        <div style={{ flex: 1 }} />
        {step < 3
          ? <SButton variant="primary" disabled={!canNext} onClick={() => setStep(step + 1)}>Continue</SButton>
          : <SButton variant="primary" onClick={finish}>{renewMode ? 'Renew certificate' : attachLabel ? 'Add & attach' : 'Add to library'}</SButton>}
      </div>
    </Modal>
  );
}

/* ================= S1 sign-in ================= */

const SIGNIN_PILLARS = [
  { label: 'Origin & factory', icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 17V8l4 3V8l4 3V8l4 3v6H3z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /><path d="M4 8V3.5h2.5V6" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /><path d="M6.5 14h2M11 14h2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg> },
  { label: 'Material & fiber content', icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 17c0-5 2-9 7-11-1 6-3 9-7 11z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /><path d="M10 17c0-4-1.5-7.5-6-9.5 1 5 2.5 7.5 6 9.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg> },
  { label: 'Repairability & recyclability', icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M14.5 5.5a3.5 3.5 0 01-4.6 4.6L6 14l-2-2 3.9-3.9a3.5 3.5 0 014.6-4.6L10 6l1.5 1.5 3-2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /><path d="M13 13l3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg> },
  { label: 'Carbon & environmental score', icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M16 10a6 6 0 11-2-4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /><path d="M14 2.5v3h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /><path d="M10 13c0-2.2 1-4 3-5-.5 2.7-1.3 4.2-3 5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" /></svg> },
];

const DPP_POINTS = [
  { title: 'Product identification', line: 'A unique global code identifies every garment.' },
  { title: 'Standardised data sharing', line: 'One format for materials, care & CO₂ — works for every EU buyer.' },
  { title: 'Traceability', line: 'Digital Link QR + EPCIS events track each item, factory to consumer.' },
  { title: 'Easy access to information', line: 'One scan shows origin, repair & recycling info in real time.' },
  { title: 'Alignment with EU regulations', line: 'Built on open, trusted standards with the European Commission.' },
];

function SignIn({ pov, onPov, onSignIn }) {
  const [show, setShow] = React.useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--surface-page)' }}>
      <header style={{ height: 60, flex: '0 0 auto', borderBottom: '1px solid var(--border-hairline)', background: 'var(--surface-card)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <img src={(window.__resources && window.__resources.logoMark) || "../assets/logo-mark.svg"} width="24" height="24" style={{ color: 'var(--ink-900)' }} alt="" />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 500, color: 'var(--ink-900)' }}>ThreadTrace</span>
        </div>
      </header>

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: '1 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 72, padding: '36px 0' }}>
        <div style={{ width: 300, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase', color: 'var(--ink-400)', marginBottom: 2 }}>Every passport records</div>
          {SIGNIN_PILLARS.map((p, i) => (
            <div key={p.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', borderRadius: 'var(--radius-md)', background: i % 2 === 0 ? 'var(--indigo-500)' : 'var(--ink-900)', color: 'var(--paper-50)', boxShadow: 'var(--shadow-xs)' }}>
              <span style={{ display: 'inline-flex', flex: '0 0 auto' }}>{p.icon}</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 14.5, fontWeight: 600, lineHeight: 1.25 }}>{p.label}</span>
            </div>
          ))}
        </div>
        <div style={{ width: 400 }}>
          <div style={{ textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 500, color: 'var(--ink-900)', marginBottom: 6 }}>Business sign-in</div>
          <div style={{ textAlign: 'center', fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--ink-500)', marginBottom: 28 }}>Author records, manage certifications &amp; issue product QR codes.</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <SInput label="Email" placeholder="you@atelier-nord.com" defaultValue="mateo@atelier-nord.com" />
            <SInput label="Password" type={show ? 'text' : 'password'} defaultValue="passport" suffix={
              <button onClick={() => setShow(!show)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--ink-400)', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.04em' }}>{show ? 'HIDE' : 'SHOW'}</button>
            } />
            <SButton variant="primary" size="lg" fullWidth onClick={onSignIn}>Sign in</SButton>
            <div style={{ textAlign: 'center', fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-400)' }}>Forgot password?</div>
            <div style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--ink-300)', letterSpacing: '0.04em', marginTop: 4 }}>MOCKED · any input signs in</div>
          </div>
        </div>
      </div>

      <div style={{ flex: '0 0 auto', borderTop: '1px solid var(--border-hairline)', background: 'var(--surface-card)', padding: '26px 40px 32px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase', color: 'var(--ink-400)', marginBottom: 16 }}>How ThreadTrace supports the DPP system</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 20 }}>
          {DPP_POINTS.map((p, i) => (
            <div key={p.title} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--madder-500)', letterSpacing: '0.04em' }}>0{i + 1}</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--ink-900)', lineHeight: 1.2 }}>{p.title}</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-500)', lineHeight: 1.45 }}>{p.line}</span>
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}

/* ================= supplier shell ================= */

function Shell({ nav, onNav, onPov, children, sync }) {
  const items = [['overview', 'Overview'], ['operations', 'Operations'], ['products', 'Products', 3], ['library', 'Library']];
  const navBtn = (id, label, count, muted) => {
    const active = nav === id;
    return (
      <button key={id} onClick={() => onNav(id)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, textAlign: 'center', height: '100%', minWidth: 128, padding: '0 26px', cursor: 'pointer', borderRadius: 0, background: active ? 'var(--surface-card)' : 'transparent', border: 'none', borderRight: '1px solid rgba(255,255,255,0.10)', boxShadow: active ? 'inset 0 -4px 0 var(--madder-500)' : 'none', fontFamily: 'var(--font-sans)', fontSize: 16, fontWeight: active ? 700 : 600, letterSpacing: '0.01em', color: active ? 'var(--ink-900)' : (muted ? 'rgba(250,248,243,0.55)' : 'rgba(250,248,243,0.82)') }}>
        <span>{label}</span>
        {count ? <span style={{ flex: '0 0 auto', minWidth: 24, height: 24, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 999, background: 'var(--madder-500)', color: 'var(--paper-50)', fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700 }}>{count}</span> : null}
      </button>
    );
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--surface-page)' }}>
      <header style={{ flex: '0 0 auto', background: 'var(--ink-900)', display: 'flex', alignItems: 'stretch', height: 64 }}>
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 24px', borderRight: '1px solid rgba(255,255,255,0.10)', flex: '0 0 auto' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, letterSpacing: '0.02em', color: 'var(--paper-50)' }}>ThreadTrace · Business</span>
        </div>
        <nav style={{ display: 'flex', alignItems: 'stretch', flex: 1, minWidth: 0, overflowX: 'auto' }}>
          {items.map(([id, label, count]) => navBtn(id, label, count))}
        </nav>
        <div style={{ display: 'flex', alignItems: 'stretch', flex: '0 0 auto' }}>
          {navBtn('facility', 'Facility', null, true)}
          <button onClick={() => onPov('consumer')} style={{ height: '100%', padding: '0 24px', border: 'none', borderLeft: '1px solid rgba(255,255,255,0.10)', cursor: 'pointer', background: 'transparent', fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 600, color: 'rgba(250,248,243,0.6)' }}>Sign out</button>
        </div>
      </header>
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <main style={{ flex: 1, minWidth: 0, overflowY: 'auto', position: 'relative' }}>{children}</main>
      </div>
      {sync || null}
    </div>
  );
}

/* ================= S2 Operations Ledger ================= */

function Ledger({ onEdit, onNew, onQR, onBulk, onLogEvent, onRepair, pendingSync = [] }) {
  const rows = window.TT.ledger;
  const { STATUS_LABEL, STATUS_TONE } = window.TT;
  return (
    <div style={{ padding: '28px 32px 40px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 22 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 500, color: 'var(--ink-900)', margin: 0, lineHeight: 1.1, whiteSpace: 'nowrap' }}>Operations Ledger</h1>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--ink-500)', marginTop: 4 }}>Marcus Malik · factory ops &amp; logistics</div>
        </div>
        <div style={{ display: 'flex', gap: 10, flex: '0 0 auto' }}>
          {onLogEvent ? <SButton variant="secondary" onClick={onLogEvent} leadingIcon={<span style={{ fontSize: 15, lineHeight: 1 }}>＋</span>}>Log event</SButton> : null}
          <SButton variant="secondary" onClick={onBulk} leadingIcon={<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 9V1.5M3.5 5L7 1.5 10.5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /><path d="M1.5 9.5v2a1 1 0 001 1h9a1 1 0 001-1v-2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>}>Bulk upload · ERP</SButton>
          <SButton variant="primary" onClick={onNew} leadingIcon={<span style={{ fontSize: 16, lineHeight: 1 }}>＋</span>}>New record</SButton>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px', border: '1px solid var(--paper-400)', borderRadius: 'var(--radius-md)', color: 'var(--ink-400)', marginBottom: 18, background: 'var(--surface-card)' }}>
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.4" /><path d="M10 10l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13.5 }}>Search / filter</span>
        <span style={{ marginLeft: 8, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-300)' }}>Status: all · Batch: all</span>
      </div>

      <div style={{ border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--surface-card)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 0.7fr 0.8fr 1.1fr 1.1fr 0.9fr 1.5fr', gap: 12, padding: '11px 20px', borderBottom: '1px solid var(--border-hairline)', background: 'var(--surface-sunken)', fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase', color: 'var(--ink-400)' }}>
          <span>Garment</span><span>Batch</span><span>Honesty</span><span>Status</span><span title="Printed tags encode a stable URL and are never reprinted — edits go live on already-sewn tags.">QR tag ↔ record</span><span>Updated</span><span style={{ textAlign: 'right' }}>Actions</span>
        </div>
        {rows.map((r, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.7fr 0.7fr 0.8fr 1.1fr 1.1fr 0.9fr 1.5fr', gap: 12, alignItems: 'center', padding: '15px 20px', borderBottom: i < rows.length - 1 ? '1px solid var(--border-hairline)' : 'none' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--ink-900)' }}>{r.garment}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--ink-600)' }}>{r.batch}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: r.honesty == null ? 'var(--ink-300)' : 'var(--ink-800)' }}>{r.honesty == null ? '—' : r.honesty + '%'}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}><SBadge tone={STATUS_TONE[r.status]} size="sm">{STATUS_LABEL[r.status]}</SBadge>{pendingSync.includes(r.batch) ? <SBadge tone="pending" size="sm">pending sync</SBadge> : null}</span>
            <span title={r.rev ? `Tags printed ${r.rev.printed} serve revision r${r.rev.live} live — no reprint needed.` : 'No tags issued yet'} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {r.rev
                ? (r.rev.live > r.rev.tag
                    ? <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--ink-600)' }}>tag r{r.rev.tag} <span style={{ color: 'var(--leaf-600)' }}>→ live r{r.rev.live}</span></span>
                    : <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--ink-500)' }}>tag r{r.rev.tag} · current</span>)
                : <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--ink-300)' }}>—</span>}
            </span>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-500)' }}>{r.updated}</span>
            <span style={{ display: 'flex', gap: 14, justifyContent: 'flex-end', alignItems: 'center' }}>
              <button onClick={() => onEdit(r)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--indigo-500)', fontWeight: 600 }}>Edit</button>
              <button onClick={() => onQR(r)} disabled={r.status !== 'published'} title={r.status !== 'published' ? 'Publish to issue a QR' : 'Generate product QR'} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, border: 'none', background: 'transparent', cursor: r.status === 'published' ? 'pointer' : 'not-allowed', fontFamily: 'var(--font-sans)', fontSize: 13, color: r.status === 'published' ? 'var(--ink-700)' : 'var(--ink-300)', fontWeight: 500 }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2h3v3H2zM9 2h3v3H9zM2 9h3v3H2z" stroke="currentColor" strokeWidth="1.2" /><path d="M9 9h1.5v1.5H9zM12 9v3M9 12h3" stroke="currentColor" strokeWidth="1.2" /></svg>QR
              </button>
              {onRepair ? <button onClick={() => onRepair(r)} title="Open repair bench" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-700)', fontWeight: 500 }}>
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M11.5 3.5a3 3 0 00-4 4l-4 4 2 2 4-4a3 3 0 004-4l-2 2-2-2 2-2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg>Repair
              </button> : null}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= S4 Certifications library ================= */

function Certifications({ certs, onAddCert, onReplaceCert, onToast }) {
  const [wizard, setWizard] = React.useState(null); // null | {} | { renewId, std }
  const textile = certs.filter((c) => CERT_TYPE[c.type].kind === 'textile');
  const sustain = certs.filter((c) => CERT_TYPE[c.type].kind === 'sustainability');
  const valid = certs.filter((c) => c.status === 'valid').length;

  function Group({ title, note, list }) {
    return (
      <div style={{ marginBottom: 30 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 12 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 21, fontWeight: 500, color: 'var(--ink-900)', margin: 0 }}>{title}</h2>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-400)' }}>{note}</span>
        </div>
        {list.length ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {list.map((c) => {
              const t = CERT_TYPE[c.type];
              return (
                <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)' }}>
                  <CertFileIcon />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--ink-900)' }}>{t.name}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-400)', letterSpacing: '0.04em' }}>{c.ref}</span>
                    </div>
                    <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-500)', marginTop: 1 }}>{t.full} · {c.issuer}</div>
                  </div>
                  <div style={{ textAlign: 'right', marginRight: 6 }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-500)' }}>expires {c.expires}</div>
                  </div>
                  <CertStatusPill status={c.status} />
                  {c.status !== 'valid' ? <button onClick={() => setWizard({ renewId: c.id, std: c.type })} style={{ marginLeft: 4, border: '1px solid var(--paper-400)', background: 'transparent', cursor: 'pointer', borderRadius: 'var(--radius-md)', padding: '5px 11px', fontFamily: 'var(--font-sans)', fontSize: 12.5, fontWeight: 600, color: 'var(--indigo-500)' }}>Renew</button> : null}
                </div>
              );
            })}
          </div>
        ) : <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13.5, color: 'var(--ink-400)', padding: '4px 0' }}>None yet.</div>}
      </div>
    );
  }

  return (
    <React.Fragment>
      <div style={{ padding: '28px 32px 44px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 8 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 500, color: 'var(--ink-900)', margin: 0, lineHeight: 1.1, whiteSpace: 'nowrap' }}>Certifications</h1>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--ink-500)', marginTop: 4 }}>{valid} valid · your proofs unlock a <strong style={{ color: 'var(--leaf-600)' }}>Checked</strong> mark on records.</div>
          </div>
          <SButton variant="primary" onClick={() => setWizard({})} leadingIcon={<span style={{ fontSize: 15, lineHeight: 1 }}>↑</span>}>Upload certificate</SButton>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 16px', border: '1px dashed var(--paper-400)', borderRadius: 'var(--radius-md)', background: 'var(--paper-100)', margin: '16px 0 26px' }}>
          <span style={{ display: 'inline-flex', gap: 4, flex: '0 0 auto' }}><SMark state="checked" size={18} /><SMark state="told" size={18} /></span>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-600)', lineHeight: 1.5 }}>A claim can only be marked <strong>Checked</strong> when it's backed by a valid certificate here. Expired proofs drop it back to <strong>Told us</strong>.</span>
        </div>

        <Group title="Textile certificates" note="fibre content, organic, harmful-substance" list={textile} />
        <Group title="Sustainability certificates" note="recycled content, environmental, sourcing" list={sustain} />
      </div>

      <CertWizard open={!!wizard} presetStd={wizard && wizard.std ? wizard.std : null} renewMode={!!(wizard && wizard.renewId)} onClose={() => setWizard(null)}
        onComplete={(cert) => {
          if (wizard && wizard.renewId) { onReplaceCert(wizard.renewId, cert); onToast('Certificate renewed'); }
          else { onAddCert(cert); onToast('Certificate added to library'); }
          setWizard(null);
        }} />
    </React.Fragment>
  );
}

/* ================= cert attach picker (used in authoring) ================= */

function CertPicker({ open, onClose, certs, onPick, onLaunchWizard }) {
  const [sel, setSel] = React.useState(null);
  React.useEffect(() => { if (open) setSel(null); }, [open]);
  const usable = certs.filter((c) => c.status !== 'expired');

  return (
    <Modal open={open} onClose={onClose} width={480}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink-900)', marginBottom: 4 }}>Attach certificate</div>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13.5, color: 'var(--ink-500)', marginBottom: 16 }}>A valid proof backs this claim and unlocks <strong style={{ color: 'var(--leaf-600)' }}>Checked</strong>.</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        {usable.map((c) => {
          const t = CERT_TYPE[c.type];
          const active = sel === c.id;
          return (
            <button key={c.id} onClick={() => setSel(c.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left', padding: '11px 13px', cursor: 'pointer', borderRadius: 'var(--radius-md)', background: active ? 'var(--indigo-100)' : 'var(--surface-card)', border: `1.5px solid ${active ? 'var(--indigo-400)' : 'var(--border-hairline)'}` }}>
              <CertFileIcon />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14.5, fontWeight: 600, color: 'var(--ink-900)' }}>{t.name} · {c.ref}</div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-500)' }}>{c.issuer} · expires {c.expires}</div>
              </div>
              <CertStatusPill status={c.status} />
            </button>
          );
        })}
      </div>

      <button onClick={onLaunchWizard} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '12px 0', cursor: 'pointer', border: '1.5px dashed var(--paper-400)', borderRadius: 'var(--radius-md)', background: 'var(--paper-100)', color: 'var(--indigo-600,var(--indigo-500))', fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600, marginBottom: 18 }}>
        <span style={{ fontSize: 15 }}>↑</span> Upload a new certificate…
      </button>

      <div style={{ display: 'flex', gap: 10 }}>
        <SButton variant="secondary" fullWidth onClick={onClose}>Cancel</SButton>
        <SButton variant="primary" fullWidth disabled={!sel} onClick={() => onPick(sel)}>Attach</SButton>
      </div>
    </Modal>
  );
}

/* ================= S3 Record Authoring ================= */

// Each field's Checked state is DERIVED from its backing cert's live status.
// certId points into the library; if that cert is expired/missing the claim
// auto-downgrades to the fallback `state`. 'dye' is seeded with the expired
// ISO 14001 cert (c5) so the downgrade is visible on load and reversible via Renew.
const AUTHOR_FIELDS = [
  { id: 'material', label: 'Material composition', kind: 'textile', value: 'Organic cotton 60% · recycled wool 38% · elastane 2%', state: 'told', certId: 'c1' },
  { id: 'origin', label: 'Country of origin', kind: 'textile', value: 'Portugal', state: 'told', certId: 'c2' },
  { id: 'tier2', label: 'Tier 2 · fabric mill', kind: 'traceability', value: 'Tecelagem do Ave · OAR ID PT2019-0087', state: 'told', certId: null },
  { id: 'tier3', label: 'Tier 3 · yarn spinner', kind: 'traceability', value: 'Fiação Beira · LOT-2261', state: 'told', certId: null },
  { id: 'dye', label: 'Dye / finishing', kind: 'sustainability', value: 'Natural indigo (woad)', state: 'told', certId: 'c5' },
  { id: 'chemical', label: 'Chemical compliance', kind: 'compliance', value: 'ZDHC MRSL v3.1 · REACH conform', state: 'told', certId: null },
  { id: 'recycled', label: 'Recycled content', kind: 'sustainability', value: '38% post-consumer wool', state: 'told', certId: null },
  { id: 'carbon', label: 'Carbon footprint', kind: 'sustainability', value: '', state: 'notyet', certId: null },
  { id: 'eol', label: 'End-of-life / disassembly', kind: 'circularity', value: 'Remove corozo buttons before fibre recycling', state: 'told', certId: null },
];

function MarkSelector({ state, onChange, hasValidCert, onNeedEvidence }) {
  const opts = [['checked', 'Checked'], ['told', 'Told us'], ['notyet', 'Not yet']];
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      {opts.map(([id, label]) => {
        const active = state === id;
        const gated = id === 'checked' && !hasValidCert;
        return (
          <button key={id} onClick={() => gated ? onNeedEvidence() : onChange(id)} title={gated ? 'Checked needs a valid certificate. Click to attach one.' : label} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 10px', cursor: 'pointer',
            border: active ? '1.5px solid var(--ink-800)' : '1px solid var(--paper-400)',
            borderRadius: 'var(--radius-md)', background: active ? 'var(--surface-raised)' : 'transparent',
            opacity: gated ? 0.5 : 1,
            fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.02em', color: active ? 'var(--ink-900)' : 'var(--ink-500)' }}>
            <SMark state={id} size={15} />{label}{gated ? ' 🔒' : ''}
          </button>
        );
      })}
    </div>
  );
}

// Seeded per-claim change history. Live edits this session are appended on top.
const AUDIT_SEED = {
  material: [
    { who: 'Mateo Silva', when: '2026-06-28 · 14:12', what: 'Attached GOTS GT-2291 (Control Union) — claim raised to Checked' },
    { who: 'Marcus Malik', when: '2026-06-12 · 09:03', what: 'Value updated from ERP import: recycled wool 40% → 38%' },
    { who: 'Mateo Silva', when: '2026-05-30 · 16:40', what: 'Claim created as Told us' },
  ],
  origin: [
    { who: 'Marcus Malik', when: '2026-06-02 · 11:21', what: 'Attached OEKO-TEX 100 SH-0257 (Hohenstein)' },
    { who: 'Mateo Silva', when: '2026-05-30 · 16:40', what: 'Claim created as Told us' },
  ],
  dye: [
    { who: 'System', when: '2026-06-01 · 00:00', what: 'ISO 14001 EN-4420 expired — claim auto-downgraded to Told us' },
    { who: 'Mateo Silva', when: '2025-11-14 · 10:05', what: 'Attached ISO 14001 EN-4420 (SGS)' },
    { who: 'Mateo Silva', when: '2025-11-02 · 15:19', what: 'Claim created as Told us' },
  ],
  carbon: [
    { who: 'Mateo Silva', when: '2026-05-30 · 16:41', what: 'Marked Not yet — no data provided' },
  ],
};
const AUDIT_DEFAULT = [{ who: 'Mateo Silva', when: '2026-05-30 · 16:40', what: 'Claim created as Told us' }];

/* EPD-style structured intake sections (product info → classification → composition) */
const CHAR_CLASS = [
  { id: 'type', q: 'Garment type', value: 'Hoodie / knitwear', options: ['Hoodie / knitwear', 'Woven top', 'Trouser', 'Outerwear', 'Accessory'] },
  { id: 'season', q: 'Season', value: 'Seasonless', options: ['Seasonless', 'Spring / Summer', 'Autumn / Winter'] },
  { id: 'weight', q: 'Fabric weight class', value: 'Midweight (180–330 GSM)', options: ['Lightweight (<180 GSM)', 'Midweight (180–330 GSM)', 'Heavyweight (>330 GSM)'] },
  { id: 'care', q: 'Care class', value: 'Machine wash cold', options: ['Machine wash cold', 'Machine wash warm', 'Hand wash', 'Dry clean only'] },
];
const RAW_COMP = [
  { id: 'natural', q: 'Natural fibres, mass-%', value: '96', origin: 'Portugal' },
  { id: 'recycled', q: 'Recycled fibres, mass-%', value: '0', origin: '' },
  { id: 'synthetic', q: 'Synthetic fibres, mass-%', value: '0', origin: '' },
  { id: 'trims', q: 'Trims & hardware, mass-%', value: '4', origin: 'Portugal' },
];

function AuthSection({ n, title, hint, children }) {
  return (
    <div style={{ paddingTop: n === 1 ? 0 : 28, marginTop: n === 1 ? 0 : 28, borderTop: n === 1 ? 'none' : '1px solid var(--border-hairline)' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: 'var(--ink-900)', marginBottom: hint ? 4 : 16, lineHeight: 1.15 }}>{n}. {title}</div>
      {hint ? <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-500)', marginBottom: 16, lineHeight: 1.5 }}>{hint}</div> : null}
      {children}
    </div>
  );
}
const authInputStyle = { width: '100%', boxSizing: 'border-box', height: 'var(--control-md)', padding: '0 12px', border: '1.5px solid var(--paper-400)', borderRadius: 'var(--radius-md)', background: 'var(--surface-raised)', boxShadow: 'var(--shadow-inset)', fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--ink-900)' };
function FormSelect({ defaultValue, options }) {
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <select defaultValue={defaultValue} style={{ ...authInputStyle, padding: '0 34px 0 12px', appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer' }}>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <svg style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 4.5L6 8l3.5-3.5" stroke="var(--ink-400)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </div>
  );
}
const authFieldLabel = { fontFamily: 'var(--font-sans)', fontSize: 13.5, fontWeight: 700, color: 'var(--ink-800)' };
const authColHead = { fontFamily: 'var(--font-mono)', fontSize: 10.5, fontWeight: 600, letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase', color: 'var(--ink-500)' };

function Authoring({ certs, onAddCert, onReplaceCert, onPublish, onCancel, onManageCerts }) {
  const [step, setStep] = React.useState(0);
  const [fields, setFields] = React.useState(AUTHOR_FIELDS);
  const [rows, setRows] = React.useState([
    { id: 'm1', material: 'Organic cotton', pct: '58', tier: 'Tier 4 · Raw fibre', facility: 'Fiação Beira', origin: 'Covilhã, Portugal' },
    { id: 'm2', material: 'Recycled wool · post-consumer', pct: '38', tier: 'Tier 4 · Raw fibre', facility: 'Refibra Collect', origin: 'Prato, Italy' },
    { id: 'm3', material: 'Elastane', pct: '2', tier: 'Trims & hardware', facility: 'Filati SpA', origin: 'Bergamo, Italy' },
    { id: 'm4', material: 'Corozo buttons', pct: '2', tier: 'Trims & hardware', facility: 'Botões Corozo', origin: 'Manta, Ecuador' },
  ]);
  const [picker, setPicker] = React.useState(null);
  const [sustOpen, setSustOpen] = React.useState(false);
  const [certFilter, setCertFilter] = React.useState('');
  const [certSel, setCertSel] = React.useState({ 'GOTS': true, 'OEKO-TEX STANDARD 100': true });
  const toggleCert = (c) => setCertSel((s) => ({ ...s, [c]: !s[c] }));
  const [story, setStory] = React.useState({
    headline: 'A hoodie that keeps its receipts',
    intro: 'Cut, sewn and finished by a small knit atelier in Portugal, the 365 is the everyday layer this whole passport is built around — ring-spun organic cotton blended with post-consumer wool, dyed and washed to soften with wear rather than wear out. This is its story, told in order, from raw fibre to your keeping.',
    chapters: [
      { id: 'c1', tag: '01', title: 'Where the fibre began', place: 'Covilhã, Portugal · 2025', body: 'Organic cotton spun at Fiação Beira, blended with post-consumer wool reclaimed from Prato. No virgin synthetics in the main body.', media: { photo: 3, audio: 1, video: 0 } },
      { id: 'c2', tag: '02', title: 'Knitted & cut', place: 'Porto atelier · 2025', body: 'Knitted to a 320 GSM loopback, then cut and sewn into a hooded, kangaroo-pouch body with ribbed cuffs and hem.', media: { photo: 5, audio: 0, video: 1 } },
      { id: 'c3', tag: '03', title: 'Finishing & the odour treatment', place: 'Porto atelier · 2025', body: 'Garment-washed for softness and finished with a peppermint-oil odour-control treatment so it needs washing less often.', media: { photo: 2, audio: 0, video: 0 } },
      { id: 'c4', tag: '04', title: 'In your keeping', place: 'ongoing', body: 'The last chapter is unwritten. Repairs, re-wears and the next owner get added here as they happen.', media: { photo: 0, audio: 0, video: 0 } },
    ],
  });
  const setStoryField = (k, v) => setStory((s) => ({ ...s, [k]: v }));
  const setChapter = (i, k, v) => setStory((s) => ({ ...s, chapters: s.chapters.map((c, idx) => idx === i ? { ...c, [k]: v } : c) }));
  const addMedia = (i, m) => setStory((s) => ({ ...s, chapters: s.chapters.map((c, idx) => idx === i ? { ...c, media: { ...c.media, [m]: (c.media[m] || 0) + 1 } } : c) }));
  const storyDone = story.headline.trim() && story.intro.trim() && story.chapters.every((c) => c.body.trim());
  const [wizard, setWizard] = React.useState(null);
  const [renew, setRenew] = React.useState(null);
  const [gate, setGate] = React.useState(false);
  const [auditFor, setAuditFor] = React.useState(null);
  const [audit, setAudit] = React.useState(AUDIT_SEED);
  const logAudit = (id, what) => setAudit((a) => ({ ...a, [id]: [{ who: 'Mateo Silva', when: 'Just now', what }, ...(a[id] || AUDIT_DEFAULT)] }));

  const certById = (id) => certs.find((c) => c.id === id) || null;
  const backing = (f) => (f.certId ? certById(f.certId) : null);
  const isLapsed = (f) => { const c = backing(f); return !!(c && c.status === 'expired'); };
  function effState(f) { const c = backing(f); if (c && c.status !== 'expired') return 'checked'; if (f.certId) return 'told'; return f.state; }

  const total = fields.length;
  const checked = fields.filter((f) => effState(f) === 'checked').length;
  const told = fields.filter((f) => effState(f) === 'told').length;
  const notyet = fields.filter((f) => effState(f) === 'notyet').length;
  const percent = Math.round((checked / total) * 100);
  const lapsedCount = fields.filter(isLapsed).length;

  function setMark(id, next) { setFields((fs) => fs.map((f) => { if (f.id !== id) return f; if (next === 'checked') return f; return { ...f, state: next, certId: null }; })); logAudit(id, `Mark set to ${next === 'notyet' ? 'Not yet' : 'Told us'}`); }
  function attachTo(id, certId) { setFields((fs) => fs.map((f) => f.id === id ? { ...f, certId, state: 'told' } : f)); const c = certById(certId); if (c) logAudit(id, `Attached ${CERT_TYPE[c.type].name} ${c.ref} (${c.issuer}) — claim raised to Checked`); setPicker(null); }
  function detach(id) { setFields((fs) => fs.map((f) => f.id === id ? { ...f, certId: null, state: 'told' } : f)); logAudit(id, 'Certificate removed — claim dropped to Told us'); }

  const setRow = (i, key, val) => setRows((rs) => rs.map((r, idx) => idx === i ? { ...r, [key]: val } : r));
  const addRow = () => setRows((rs) => [...rs, { id: 'm' + Date.now(), material: '', pct: '', tier: 'Tier 4 · Raw fibre', facility: '', origin: '' }]);
  const removeRow = (i) => setRows((rs) => rs.filter((_, idx) => idx !== i));
  const massTotal = Math.round(rows.reduce((s, r) => s + (parseFloat(r.pct) || 0), 0) * 10) / 10;
  const massOk = Math.round(massTotal) === 100;
  const rowsComplete = rows.length > 0 && rows.every((r) => r.material.trim() && r.facility.trim() && r.origin.trim() && r.pct);
  const matDone = massOk && rowsComplete;

  const TIER_OPTIONS = ['Tier 1 · Final assembly', 'Tier 2 · Fabric mill', 'Tier 3 · Yarn / spinning', 'Tier 4 · Raw fibre', 'Trims & hardware'];
  const STEPS = [
    { label: 'Product', done: true },
    { label: 'Story', done: storyDone },
    { label: 'Materials & origin', done: matDone },
    { label: 'Evidence', done: notyet === 0 },
    { label: 'Review', done: false },
  ];

  const wizField = wizard ? fields.find((f) => f.id === wizard) : null;

  const cardBox = { border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-lg)', background: 'var(--surface-card)', padding: '22px 24px', boxShadow: 'var(--shadow-xs)' };
  const miniLabel = { display: 'block', fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600, letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase', color: 'var(--ink-400)', marginBottom: 6 };
  const inp = authInputStyle;
  const secTitle = { fontFamily: 'var(--font-mono)', fontSize: 10.5, fontWeight: 600, letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase', color: 'var(--ink-400)', marginBottom: 10 };

  function ProductStep() {
    const req = <span style={{ color: 'var(--madder-500)', fontWeight: 700 }}> *</span>;
    const ESPR_SECTORS = ['Select a sector…', 'Apparel & textiles', 'Footwear', 'Home & interior textiles', 'Leather goods', 'Accessories'];
    const CARBON_SCOPE = ['Cradle-to-gate', 'Cradle-to-grave', 'Cradle-to-cradle', 'Gate-to-gate'];
    const ENERGY_CLASS = ['—', 'A', 'B', 'C', 'D', 'E', 'F', 'G'];
    const CERT_GROUP = 'TEXTILES, LEATHER AND APPAREL';
    const CERTS = ['GOTS (Global Organic Textile Standard)', 'OCS (Organic Content Standard)', 'GRS (Global Recycled Standard)', 'RCS (Recycled Claim Standard)', 'RWS (Responsible Wool Standard)', 'RDS (Responsible Down Standard)', 'OEKO-TEX STANDARD 100'];
    const filtered = CERTS.filter((c) => c.toLowerCase().includes(certFilter.toLowerCase()));
    const num = { ...inp };
    const half = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 };
    const quad = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 14 };
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 760 }}>
        <div style={cardBox}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--ink-900)', marginBottom: 16 }}>Product identification</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={miniLabel}>Product name{req}</label>
              <input defaultValue="365 Midweight Hoodie" style={inp} />
            </div>
            <div>
              <label style={miniLabel}>ESPR sector{req}</label>
              <FormSelect defaultValue="Apparel & textiles" options={ESPR_SECTORS} />
            </div>
            <div>
              <label style={miniLabel}>GTIN / EAN / UPC</label>
              <input placeholder="e.g. 4006381333931" inputMode="numeric" style={inp} />
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11.5, color: 'var(--ink-400)', marginTop: 6, lineHeight: 1.45 }}>Leave empty if you don't have a GTIN yet — never enter an approximate one. <a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'var(--indigo-500)', fontWeight: 600, textDecoration: 'none' }}>Verify a GTIN</a></div>
            </div>
            <div>
              <label style={miniLabel}>Model number</label>
              <input placeholder="Optional" style={inp} />
            </div>
            <div>
              <label style={miniLabel}>Batch number</label>
              <input defaultValue="0365" style={inp} />
            </div>
          </div>
        </div>
        <div style={cardBox}>
          <label style={miniLabel}>Description</label>
          <textarea defaultValue="Seasonless midweight organic-cotton hoodie, ring-spun to a 320 GSM loopback and finished with a peppermint-oil odour-control treatment." rows={3} style={{ ...inp, height: 'auto', padding: '10px 12px', resize: 'vertical', lineHeight: 1.5 }} />
        </div>
        <div style={cardBox}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--ink-900)', marginBottom: 16 }}>Classification</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {CHAR_CLASS.map((r) => (
              <div key={r.id}>
                <label style={miniLabel}>{r.q}</label>
                <FormSelect defaultValue={r.value} options={r.options} />
              </div>
            ))}
          </div>
        </div>

        {/* Manufacturer information */}
        <div style={cardBox}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--ink-900)', marginBottom: 16 }}>Manufacturer information</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <div>
              <label style={miniLabel}>Manufacturer name{req}</label>
              <input defaultValue="Atelier Nord" style={inp} />
            </div>
            <div>
              <label style={miniLabel}>Country</label>
              <input placeholder="e.g. PT" style={inp} />
            </div>
            <div>
              <label style={miniLabel}>Manufacturer ID</label>
              <input placeholder="Optional" style={inp} />
            </div>
          </div>
        </div>

        {/* Sustainability & supply chain — optional, collapsible */}
        <div style={{ ...cardBox, padding: 0, overflow: 'hidden' }}>
          <button onClick={() => setSustOpen((o) => !o)} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left', border: 'none', background: 'transparent', cursor: 'pointer', padding: '18px 24px' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flex: '0 0 auto', color: 'var(--ink-500)', transform: sustOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }}><path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--ink-900)' }}>Sustainability &amp; supply chain data</span>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-400)' }}>optional — you can add this later</span>
          </button>
          {sustOpen ? (
            <div style={{ padding: '4px 24px 24px', display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* sustainability data */}
              <div>
                <div style={secTitle}>Sustainability data</div>
                <div style={quad}>
                  <div>
                    <label style={miniLabel}>Carbon footprint (kg CO₂e)</label>
                    <input placeholder="kg CO₂e" inputMode="decimal" style={num} />
                  </div>
                  <div>
                    <label style={miniLabel}>Carbon scope</label>
                    <FormSelect defaultValue="Cradle-to-gate" options={CARBON_SCOPE} />
                  </div>
                  <div>
                    <label style={miniLabel}>Recycled content (%)</label>
                    <input placeholder="%" inputMode="decimal" style={num} />
                  </div>
                  <div>
                    <label style={miniLabel}>Energy class</label>
                    <FormSelect defaultValue="—" options={ENERGY_CLASS} />
                  </div>
                  <div>
                    <label style={miniLabel}>Expected lifetime</label>
                    <input placeholder="e.g. 8 years" style={num} />
                  </div>
                  <div>
                    <label style={miniLabel}>Warranty (years)</label>
                    <input placeholder="Optional" inputMode="numeric" style={num} />
                  </div>
                  <div>
                    <label style={miniLabel}>Repairability score (/10)</label>
                    <input placeholder="/10" inputMode="decimal" style={num} />
                  </div>
                  <div>
                    <label style={miniLabel}>Recyclability (%)</label>
                    <input placeholder="%" inputMode="decimal" style={num} />
                  </div>
                </div>
              </div>

              {/* supply chain */}
              <div>
                <div style={secTitle}>Supply chain</div>
                <div style={{ maxWidth: 300, marginBottom: 16 }}>
                  <label style={miniLabel}>Country of origin</label>
                  <input placeholder="e.g. Portugal" style={inp} />
                </div>
                <label style={miniLabel}>Certifications</label>
                <input value={certFilter} onChange={(e) => setCertFilter(e.target.value)} placeholder="Filter the list…" style={{ ...inp, marginBottom: 8 }} />
                <div style={{ border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)', maxHeight: 176, overflowY: 'auto', padding: '10px 12px' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '0.06em', color: 'var(--ink-400)', marginBottom: 8 }}>{CERT_GROUP}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {filtered.length ? filtered.map((c) => (
                      <label key={c} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '5px 4px', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 13.5, color: 'var(--ink-800)' }}>
                        <input type="checkbox" checked={!!certSel[c]} onChange={() => toggleCert(c)} style={{ width: 15, height: 15, accentColor: 'var(--indigo-500)', flex: '0 0 auto' }} />
                        {c}
                      </label>
                    )) : <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-400)', padding: '4px' }}>No certifications match “{certFilter}”.</div>}
                  </div>
                </div>
                <div style={{ marginTop: 16 }}>
                  <label style={miniLabel}>Other certifications</label>
                  <input placeholder="e.g. NF EN 442-1, a customer-specific scheme" style={inp} />
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11.5, color: 'var(--ink-400)', marginTop: 5, lineHeight: 1.45 }}>Comma-separated. Anything not in the list above is kept exactly as you write it and marked as self-declared.</div>
                </div>
                <div style={{ marginTop: 16 }}>
                  <label style={miniLabel}>Material composition</label>
                  <textarea placeholder="e.g. 68% organic cotton, 32% linen" rows={3} style={{ ...inp, height: 'auto', padding: '10px 12px', resize: 'vertical', lineHeight: 1.5 }} />
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  const MEDIA_META = {
    photo: { label: 'Photo', icon: <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="3" width="13" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3" /><circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.3" /><path d="M5 3l1-1.5h4L11 3" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg> },
    audio: { label: 'Audio', icon: <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><rect x="6" y="1.5" width="4" height="8" rx="2" stroke="currentColor" strokeWidth="1.3" /><path d="M3.5 7.5a4.5 4.5 0 009 0M8 12v2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg> },
    video: { label: 'Video', icon: <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="4" width="9" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3" /><path d="M10.5 7l4-2v6l-4-2" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg> },
  };

  function StoryStep() {
    const bigSerif = { width: '100%', border: 'none', outline: 'none', background: 'transparent', fontFamily: 'var(--font-display)', color: 'var(--ink-900)', resize: 'none', display: 'block' };
    return (
      <div style={{ maxWidth: 760 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '12px 16px', border: '1px dashed var(--paper-400)', borderRadius: 'var(--radius-md)', background: 'var(--paper-100)', marginBottom: 22 }}>
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none" style={{ flex: '0 0 auto', marginTop: 1, color: 'var(--madder-500)' }}><path d="M4 2.5h7l3 3V15.5H4z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /><path d="M6.5 8h5M6.5 11h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-600)', lineHeight: 1.5 }}>This is the brand's voice. Write the garment's story in order — it becomes the <strong>Story Book</strong> a buyer reads on the passport. Every chapter can carry photos, audio and video.</div>
        </div>

        {/* deep, linear typography — headline + intro */}
        <div style={{ ...cardBox, padding: '26px 28px', marginBottom: 18 }}>
          <label style={{ ...miniLabel, color: 'var(--madder-500)' }}>The story headline</label>
          <textarea value={story.headline} onChange={(e) => setStoryField('headline', e.target.value)} rows={1} placeholder="One line that opens the story…" style={{ ...bigSerif, fontSize: 30, fontWeight: 500, lineHeight: 1.12, letterSpacing: '-0.02em', marginBottom: 18 }} />
          <label style={miniLabel}>Opening narrative</label>
          <textarea value={story.intro} onChange={(e) => setStoryField('intro', e.target.value)} rows={5} placeholder="Set the scene — who made it, where, and why it matters…" style={{ ...bigSerif, fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 18, lineHeight: 1.6, color: 'var(--ink-700)' }} />
        </div>

        {/* interactive production timeline — storytelling nodes */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, margin: '4px 0 14px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 500, color: 'var(--ink-900)', margin: 0 }}>Production timeline</h2>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-400)' }}>{story.chapters.length} chapters · fibre to keeping</span>
        </div>
        <div style={{ position: 'relative', paddingLeft: 34 }}>
          <span style={{ position: 'absolute', left: 13, top: 6, bottom: 6, width: 2, background: 'var(--paper-300)' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {story.chapters.map((c, i) => {
              const last = i === story.chapters.length - 1;
              return (
                <div key={c.id} style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: -34, top: 20, width: 28, height: 28, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, background: last ? 'var(--surface-card)' : 'var(--ink-900)', color: last ? 'var(--ink-400)' : 'var(--paper-50)', border: last ? '1.5px dashed var(--paper-400)' : 'none', boxShadow: '0 0 0 4px var(--surface-page)' }}>{last ? '∞' : c.tag}</span>
                  <div style={{ ...cardBox, padding: '18px 20px' }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <input value={c.title} onChange={(e) => setChapter(i, 'title', e.target.value)} placeholder="Chapter title" style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 500, color: 'var(--ink-900)', marginBottom: 3 }} />
                        <input value={c.place} onChange={(e) => setChapter(i, 'place', e.target.value)} placeholder="Place · date" style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.04em', color: 'var(--ink-400)' }} />
                      </div>
                    </div>
                    <textarea value={c.body} onChange={(e) => setChapter(i, 'body', e.target.value)} rows={2} placeholder="Tell this part of the story…" style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', resize: 'vertical', fontFamily: 'var(--font-sans)', fontSize: 14, lineHeight: 1.6, color: 'var(--ink-700)', marginTop: 10, borderTop: '1px solid var(--border-hairline)', paddingTop: 12 }} />
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                      {['photo', 'audio', 'video'].map((m) => {
                        const n = c.media[m] || 0;
                        return (
                          <button key={m} onClick={() => addMedia(i, m)} title={`Add ${MEDIA_META[m].label.toLowerCase()} node`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 11px', borderRadius: 999, cursor: 'pointer', border: `1px solid ${n ? 'var(--indigo-400)' : 'var(--paper-400)'}`, background: n ? 'var(--indigo-100)' : 'var(--surface-card)', color: n ? 'var(--indigo-700)' : 'var(--ink-500)', fontFamily: 'var(--font-sans)', fontSize: 12.5, fontWeight: n ? 600 : 500 }}>
                            {MEDIA_META[m].icon}{MEDIA_META[m].label}{n ? <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>{n}</span> : <span style={{ fontFamily: 'var(--font-sans)', fontSize: 15, lineHeight: 1 }}>＋</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  function MaterialsStep() {
    return (
      <div style={{ maxWidth: 880 }}>
        <div style={{ ...cardBox, padding: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '16px 22px', borderBottom: '1px solid var(--border-hairline)' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--ink-900)' }}>Raw materials &amp; where they come from</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-500)', marginTop: 2 }}>For each material, record its share of mass, the factory that supplied it, and its origin.</div>
            </div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '6px 12px', borderRadius: 999, whiteSpace: 'nowrap', fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, background: massOk ? 'var(--leaf-100)' : 'var(--ochre-100)', color: massOk ? 'var(--leaf-700)' : 'var(--ochre-600)', border: `1px solid ${massOk ? 'var(--leaf-400)' : 'var(--ochre-500)'}` }}>{massOk ? '✓' : '⚠'} {massTotal}% of 100</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {rows.map((r, i) => (
              <div key={r.id} style={{ padding: '18px 22px', borderBottom: '1px solid var(--border-hairline)', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <label style={miniLabel}>Material</label>
                    <input value={r.material} onChange={(e) => setRow(i, 'material', e.target.value)} placeholder="e.g. Organic cotton" style={inp} />
                  </div>
                  <div style={{ width: 104, flex: '0 0 auto' }}>
                    <label style={miniLabel}>Mass %</label>
                    <input value={r.pct} onChange={(e) => setRow(i, 'pct', e.target.value.replace(/[^0-9.]/g, ''))} inputMode="decimal" style={{ ...inp, textAlign: 'right' }} />
                  </div>
                  <button onClick={() => removeRow(i)} title="Remove material" aria-label="Remove material" style={{ flex: '0 0 auto', width: 'var(--control-md)', height: 'var(--control-md)', border: '1px solid var(--paper-400)', background: 'var(--surface-card)', borderRadius: 'var(--radius-md)', cursor: 'pointer', color: 'var(--ink-400)', fontSize: 17, lineHeight: 1 }}>×</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={miniLabel}>Supply tier</label>
                    <FormSelect defaultValue={r.tier} options={TIER_OPTIONS} />
                  </div>
                  <div>
                    <label style={miniLabel}>Factory / supplier</label>
                    <input value={r.facility} onChange={(e) => setRow(i, 'facility', e.target.value)} placeholder="Who made it" style={inp} />
                  </div>
                  <div>
                    <label style={miniLabel}>Origin</label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--ink-400)', display: 'inline-flex' }}><svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M7 1.5c2.2 0 4 1.8 4 4 0 2.8-4 7-4 7s-4-4.2-4-7c0-2.2 1.8-4 4-4z" stroke="currentColor" strokeWidth="1.2" /><circle cx="7" cy="5.5" r="1.4" stroke="currentColor" strokeWidth="1.2" /></svg></span>
                      <input value={r.origin} onChange={(e) => setRow(i, 'origin', e.target.value)} placeholder="City, country" style={{ ...inp, paddingLeft: 30 }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={addRow} style={{ width: '100%', padding: '14px', border: 'none', borderTop: '1px dashed var(--paper-400)', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 13.5, fontWeight: 600, color: 'var(--indigo-500)' }}>＋ Add material</button>
        </div>
        {!massOk ? <div style={{ marginTop: 12, fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ochre-600)' }}>Mass shares should total 100% before publishing.</div> : null}
      </div>
    );
  }

  function EvidenceStep() {
    return (
      <div style={{ maxWidth: 820 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '12px 16px', border: '1px dashed var(--paper-400)', borderRadius: 'var(--radius-md)', background: 'var(--paper-100)', marginBottom: 18 }}>
          <SMark state="told" size={16} />
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-600)', lineHeight: 1.5 }}>Every claim starts as <strong>Told us</strong>. Attach a valid certificate to raise it to <strong style={{ color: 'var(--leaf-700)' }}>Checked</strong>. Gaps stay visible on the passport — that honesty is the point.</div>
        </div>
        {lapsedCount ? (
          <div style={{ padding: '12px 14px', border: '1px solid var(--madder-200)', borderRadius: 'var(--radius-md)', background: 'var(--madder-100)', marginBottom: 18 }}>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, color: 'var(--madder-600)' }}>⚠ {lapsedCount} lapsed {lapsedCount === 1 ? 'proof' : 'proofs'} — auto-downgraded to Told us. Renew below to restore Checked.</div>
          </div>
        ) : null}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {fields.map((f) => {
            const c = backing(f);
            const lapsed = isLapsed(f);
            const es = effState(f);
            return (
              <div key={f.id} style={{ ...cardBox, padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 9 }}>
                  <label style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500, letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase', color: 'var(--ink-500)' }}>{f.label}<span style={{ color: 'var(--ink-300)', marginLeft: 8 }}>{f.kind}</span></label>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                  {c
                    ? (lapsed
                        ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--madder-600)', letterSpacing: '0.03em' }}>⚠ {CERT_TYPE[c.type].name} {c.ref} lapsed</span><button onClick={() => setRenew({ fieldId: f.id, certId: c.id, std: c.type })} style={{ border: '1px solid var(--madder-400)', background: 'transparent', cursor: 'pointer', borderRadius: 'var(--radius-sm)', padding: '2px 8px', fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 600, color: 'var(--madder-600)' }}>Renew</button><button onClick={() => detach(f.id)} title="Remove certificate" style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--ink-400)', fontSize: 13, lineHeight: 1 }}>×</button></span>
                        : <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><span title={`Verified by ${c.issuer} · issued ${ttFmtYM(c.issued)} · expires ${ttFmtYM(c.expires)}`} style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--leaf-600)', letterSpacing: '0.03em' }}>✓ {CERT_TYPE[c.type].name} · {c.issuer} · {ttFmtYM(c.issued)}</span>{c.status === 'expiring' ? <button onClick={() => setRenew({ fieldId: f.id, certId: c.id, std: c.type })} title={`Expires ${ttFmtYM(c.expires)} — renew to keep Checked`} style={{ border: '1px solid var(--ochre-500)', background: 'var(--ochre-100)', cursor: 'pointer', borderRadius: 'var(--radius-sm)', padding: '2px 8px', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.03em', color: 'var(--ochre-600)' }}>⏳ expires {ttFmtYM(c.expires)}</button> : null}<button onClick={() => detach(f.id)} title="Remove certificate" style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--ink-400)', fontSize: 13, lineHeight: 1 }}>×</button></span>)
                    : <button onClick={() => setPicker(f.id)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--indigo-500)', letterSpacing: '0.03em' }}>+ attach certificate</button>}
                  <button onClick={() => setAuditFor(f.id)} title="Change history" aria-label={`Change history for ${f.label}`} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 2, color: 'var(--ink-400)', display: 'inline-flex' }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3" /><path d="M7 4.2V7l2 1.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </button>
                  </span>
                </div>
                <input defaultValue={f.value} placeholder={f.id === 'carbon' ? 'not provided' : ''} style={{ ...inp, marginBottom: 10 }} />
                <MarkSelector state={es} hasValidCert={!!c && !lapsed} onChange={(n) => setMark(f.id, n)} onNeedEvidence={() => setPicker(f.id)} />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function ReviewStep() {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20, maxWidth: 940, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={cardBox}>
            <div style={secTitle}>Product</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--ink-900)' }}>365 Midweight Hoodie</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>{CHAR_CLASS.map((r) => <span key={r.id} style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-600)', background: 'var(--surface-sunken)', border: '1px solid var(--border-hairline)', borderRadius: 999, padding: '4px 12px' }}>{r.value}</span>)}</div>
          </div>
          <div style={cardBox}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><div style={secTitle}>Materials &amp; origin</div><span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: massOk ? 'var(--leaf-700)' : 'var(--ochre-600)' }}>{massOk ? '✓ 100%' : '⚠ ' + massTotal + '%'}</span></div>
            <div>
              {rows.map((r, i) => (
                <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderTop: i ? '1px solid var(--border-hairline)' : 'none' }}>
                  <span style={{ width: 46, flex: '0 0 auto', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--ink-900)', fontWeight: 600 }}>{r.pct || '—'}%</span>
                  <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--ink-900)' }}>{r.material || '—'}</span>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-500)', textAlign: 'right' }}>{r.facility || '—'} · {r.origin || '—'}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={cardBox}>
            <div style={secTitle}>Evidence · claims</div>
            <div>
              {fields.map((f, i) => {
                const es = effState(f);
                return (
                  <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderTop: i ? '1px solid var(--border-hairline)' : 'none' }}>
                    <SMark state={es} size={15} />
                    <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-sans)', fontSize: 13.5, color: 'var(--ink-800)' }}>{f.label}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.03em', color: es === 'checked' ? 'var(--leaf-600)' : es === 'told' ? 'var(--ochre-600)' : 'var(--ink-400)' }}>{es === 'checked' ? 'Checked' : es === 'told' ? 'Told us' : 'Not yet'}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div style={{ position: 'sticky', top: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ ...cardBox, textAlign: 'center' }}>
            <div style={{ ...secTitle, marginBottom: 14 }}>Honesty at publish</div>
            <div style={{ display: 'flex', justifyContent: 'center' }}><SRing percent={percent} sublabel={`${checked} / ${total} checked`} size={150} animate={false} /></div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginTop: 16, flexWrap: 'wrap' }}>
              {[['checked', checked, 'Checked'], ['told', told, 'Told us'], ['notyet', notyet, 'Not yet']].map(([k, n, l]) => (
                <span key={k} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-600)' }}><SMark state={k} size={14} />{n} {l}</span>
              ))}
            </div>
          </div>
          <div style={{ padding: '14px 16px', border: '1px dashed var(--paper-400)', borderRadius: 'var(--radius-md)', background: 'var(--paper-100)' }}>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-600)', lineHeight: 1.5 }}>Publishing issues a permanent QR and a live passport. You can keep improving evidence — updates go live on already-sewn tags.</div>
            <button onClick={onManageCerts} style={{ marginTop: 8, border: 'none', background: 'transparent', padding: 0, cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--indigo-500)', fontWeight: 600 }}>Manage certifications →</button>
          </div>
        </div>
      </div>
    );
  }

  const footerHint =
    step === 2 ? (massOk ? 'Composition totals 100%' : `Composition totals ${massTotal}% — should be 100%`)
    : step === 3 ? `${checked} checked · ${told} told us · ${notyet} not yet`
    : step === 0 ? 'Product details'
    : step === 1 ? 'Brand story & production timeline'
    : 'Ready to publish';

  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '26px 32px 0' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 500, color: 'var(--ink-900)', margin: 0, lineHeight: 1.1 }}>Record a product</h1>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--ink-500)', marginTop: 4 }}>Mateo Silva · 365 Midweight Hoodie · Batch 0365</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: '0 0 auto', padding: '7px 16px 7px 7px', border: '1px solid var(--border-hairline)', borderRadius: 999, background: 'var(--surface-card)' }}>
            <SRing percent={percent} size={44} animate={false} />
            <div style={{ lineHeight: 1.25 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-400)' }}>Honesty</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, color: 'var(--ink-800)' }}>{checked}/{total} checked</div>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', margin: '22px 0 4px' }}>
          {STEPS.map((s, i) => {
            const active = i === step;
            const complete = i < step || (s.done && i !== step);
            return (
              <React.Fragment key={s.label}>
                <button onClick={() => setStep(i)} style={{ display: 'flex', alignItems: 'center', gap: 9, border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, flex: '0 0 auto' }}>
                  <span style={{ width: 28, height: 28, borderRadius: '50%', flex: '0 0 auto', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, background: active ? 'var(--ink-900)' : complete ? 'var(--leaf-500,var(--leaf-600))' : 'var(--surface-card)', color: active || complete ? 'var(--paper-50)' : 'var(--ink-400)', border: active || complete ? 'none' : '1.5px solid var(--paper-400)' }}>{complete ? '✓' : i + 1}</span>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: active ? 700 : 500, color: active ? 'var(--ink-900)' : 'var(--ink-500)', whiteSpace: 'nowrap' }}>{s.label}</span>
                </button>
                {i < STEPS.length - 1 ? <span style={{ flex: 1, height: 2, margin: '0 14px', borderTop: `2px ${i < step ? 'solid var(--leaf-400)' : 'dashed var(--paper-400)'}` }} /> : null}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div style={{ flex: 1, padding: '24px 32px 28px' }}>
        {step === 0 ? ProductStep() : null}
        {step === 1 ? StoryStep() : null}
        {step === 2 ? MaterialsStep() : null}
        {step === 3 ? EvidenceStep() : null}
        {step === 4 ? ReviewStep() : null}
      </div>

      <div style={{ position: 'sticky', bottom: 0, display: 'flex', alignItems: 'center', gap: 16, padding: '13px 32px', borderTop: '1px solid var(--border-hairline)', background: 'var(--surface-page)' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.03em', color: 'var(--ink-400)' }}>Step {step + 1} of {STEPS.length} · {footerHint}</div>
        <div style={{ flex: 1 }} />
        {step > 0 ? <SButton variant="ghost" onClick={() => setStep(step - 1)}>Back</SButton> : <SButton variant="ghost" onClick={onCancel}>Save draft</SButton>}
        {step < STEPS.length - 1 ? <SButton variant="primary" onClick={() => setStep(step + 1)}>Continue</SButton> : <SButton variant="primary" onClick={() => setGate(true)}>Publish &amp; issue QR</SButton>}
      </div>

      <CertPicker open={!!picker} onClose={() => setPicker(null)} certs={certs}
        onPick={(certId) => attachTo(picker, certId)}
        onLaunchWizard={() => { const fid = picker; setPicker(null); setWizard(fid); }} />

      <CertWizard open={!!wizard} attachLabel={wizField ? wizField.label : null} onClose={() => setWizard(null)}
        onComplete={(cert) => { onAddCert(cert); if (cert.status !== 'expired') attachTo(wizard, cert.id); setWizard(null); }} />

      <CertWizard open={!!renew} presetStd={renew ? renew.std : null} renewMode={true} onClose={() => setRenew(null)}
        onComplete={(cert) => { if (renew) { onReplaceCert(renew.certId, cert); logAudit(renew.fieldId, `Renewed ${CERT_TYPE[cert.type].name} → ${cert.ref} (${cert.issuer}), expires ${ttFmtYM(cert.expires)}`); } setRenew(null); }} />

      <PublishGateModal open={gate} onClose={() => setGate(false)} tally={{ checked, told, notyet, total, percent }}
        onConfirm={() => { setGate(false); onPublish(percent); }} />

      <AuditModal open={!!auditFor} onClose={() => setAuditFor(null)}
        label={auditFor ? (fields.find((f) => f.id === auditFor) || {}).label : ''}
        entries={auditFor ? (audit[auditFor] || AUDIT_DEFAULT) : []} />
    </div>
  );
}

/* ================= QR issue modal ================= */

function QRModal({ open, onClose, row }) {
  const [subId, setSubId] = React.useState('denim');
  React.useEffect(() => { if (open) setSubId('denim'); }, [open]);
  if (!open || !row) return null;
  const slug = (row.garment || 'garment').toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + (row.batch || '');
  const url = window.TT.qrBase + slug;
  const sub = window.TT.substrates.find((s) => s.id === subId) || window.TT.substrates[0];

  function downloadPng() { downloadBlob(qrPngDataUrl(url, 720, sub.gap), `threadtrace-${slug}.png`); }
  function downloadSvg() {
    const svg = buildQrSvg(url, 720, '#1C1814', sub.gap);
    downloadBlob('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg), `threadtrace-${slug}-${sub.id}-blueprint.svg`);
  }

  return (
    <Modal open={open} onClose={onClose} width={440}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase', color: 'var(--madder-500)', marginBottom: 4 }}>Product QR · Batch {row.batch}</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 23, color: 'var(--ink-900)', marginBottom: 16 }}>{row.garment}</div>
        <div style={{ display: 'inline-block', padding: 16, background: 'var(--surface-raised)', border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
          <QRCode text={url} size={188} gap={sub.gap} />
          <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
            <img src={(window.__resources && window.__resources.logoMark) || "../assets/logo-mark.svg"} width="15" height="15" style={{ color: 'var(--ink-900)' }} alt="" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em', color: 'var(--ink-500)' }}>THREADTRACE PASSPORT</span>
          </div>
        </div>
      </div>

      {/* Adaptive QA calibration */}
      <div style={{ marginTop: 18, padding: '14px 16px', border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)', textAlign: 'left' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-400)', marginBottom: 8 }}>Material substrate flex</div>
        <div style={{ display: 'flex', gap: 6 }}>
          {window.TT.substrates.map((s) => {
            const on = s.id === subId;
            return (
              <button key={s.id} onClick={() => setSubId(s.id)} style={{ flex: 1, minHeight: 48, cursor: 'pointer', textAlign: 'center', padding: '6px 4px',
                border: `1.5px solid ${on ? 'var(--ink-800)' : 'var(--paper-400)'}`, borderRadius: 'var(--radius-md)',
                background: on ? 'var(--surface-raised)' : 'transparent', boxShadow: on ? 'var(--shadow-xs)' : 'none' }}>
                <span style={{ display: 'block', fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 600, color: on ? 'var(--ink-900)' : 'var(--ink-600)', lineHeight: 1.15 }}>{s.label}</span>
                <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 9.5, color: on ? 'var(--madder-500)' : 'var(--ink-400)', marginTop: 3 }}>{s.warp}</span>
              </button>
            );
          })}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-600)', lineHeight: 1.45 }}>
          <HonestyMark state="checked" size={15} />
          Blueprint compensates by <strong style={{ color: 'var(--ink-800)' }}>{sub.comp}</strong> to counteract stitch bleed and keep scan rates high.
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
        <SButton variant="secondary" fullWidth onClick={downloadSvg}>Export .SVG blueprint</SButton>
        <SButton variant="primary" fullWidth onClick={downloadPng}>Download PNG</SButton>
      </div>
      <div style={{ marginTop: 10, fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--ink-400)', textAlign: 'center' }}>The .SVG feeds the embroidery machine; stitch spacing is baked to the chosen substrate.</div>
    </Modal>
  );
}

/* ================= F1 · Supply lineage (co-sign) ================= */

const LINEAGE_RANK = { notyet: 0, told: 1, pending: 1, checked: 2 };
function inheritedState(parents) {
  const worst = Math.min.apply(null, parents.map((p) => LINEAGE_RANK[p.state]));
  if (worst >= 2) return 'checked';
  if (worst <= 0) return 'notyet';
  return 'told';
}
const CO_LABEL = { checked: 'Verified', pending: 'Awaiting co-sign', notyet: 'No token', told: 'Told us' };

function TokenCard({ p, onCosign }) {
  const tone = p.state === 'checked' ? 'verified' : p.state === 'pending' ? 'pending' : 'neutral';
  return (
    <div style={{ flex: 1, minWidth: 0, background: 'var(--surface-card)', border: `1px solid ${p.state === 'pending' ? 'var(--ochre-200)' : 'var(--border-hairline)'}`, borderRadius: 'var(--radius-md)', padding: '14px 15px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--madder-500)' }}>{p.tier}</span>
        <HonestyMark state={p.state === 'pending' ? 'told' : p.state} size={18} />
      </div>
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--ink-900)', lineHeight: 1.1 }}>{p.material}</div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-500)', marginTop: 2 }}>{p.supplier}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--ink-400)', letterSpacing: '0.03em' }}>
        <svg width="12" height="12" viewBox="0 0 14 14" fill="none" style={{ color: 'var(--ink-300)' }}><path d="M7 1l5 2.2v3.3c0 3-2.1 5-5 6.3-2.9-1.3-5-3.3-5-6.3V3.2L7 1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" /></svg>
        {p.id} · {p.cert}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 2 }}>
        <SBadge tone={tone} size="sm">{CO_LABEL[p.state]}</SBadge>
        {p.state === 'pending' ? (
          <button onClick={() => onCosign(p.id)} style={{ border: 'none', cursor: 'pointer', background: 'var(--brand)', color: 'var(--paper-50)', borderRadius: 'var(--radius-sm)', padding: '6px 12px', fontFamily: 'var(--font-sans)', fontSize: 12.5, fontWeight: 600 }}>Co-sign</button>
        ) : null}
      </div>
    </div>
  );
}

function Lineage({ lineage, onCosign }) {
  const cs = inheritedState(lineage.parents);
  const checkedN = lineage.parents.filter((p) => p.state === 'checked').length;
  const total = lineage.parents.length;
  const complete = cs === 'checked';
  return (
    <div style={{ padding: '28px 32px 40px' }}>
      <div style={{ marginBottom: 8 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 500, color: 'var(--ink-900)', margin: 0, lineHeight: 1.1, whiteSpace: 'nowrap' }}>Supply Lineage</h1>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--ink-500)', marginTop: 4 }}>Marcus Malik · multi-tier co-sign · {window.TT.lineage.child.maker}</div>
      </div>

      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '12px 16px', border: '1px dashed var(--paper-400)', borderRadius: 'var(--radius-md)', background: 'var(--paper-100)', margin: '14px 0 26px', maxWidth: 720 }}>
        <HonestyMark state="told" size={16} />
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-600)', lineHeight: 1.5 }}>A batch is only as honest as its weakest input. You cannot verify what an upstream mill only <em>told</em> you, so each parent token must be <strong>co-signed</strong> before the run inherits its verification.</div>
      </div>

      {/* parent tokens */}
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase', color: 'var(--ink-400)', marginBottom: 12 }}>Upstream parent tokens</div>
      <div style={{ display: 'flex', gap: 14, alignItems: 'stretch' }}>
        {lineage.parents.map((p) => <TokenCard key={p.id} p={p} onCosign={onCosign} />)}
      </div>

      {/* connectors */}
      <div style={{ position: 'relative', height: 40 }}>
        <div style={{ position: 'absolute', left: '16.6%', right: '16.6%', top: 0, height: 18, borderLeft: '2px dashed var(--paper-400)', borderRight: '2px dashed var(--paper-400)', borderBottom: '2px dashed var(--paper-400)' }} />
        <div style={{ position: 'absolute', left: '50%', top: 18, bottom: 0, borderLeft: '2px dashed var(--paper-400)' }} />
      </div>

      {/* child production node */}
      <div style={{ maxWidth: 560, margin: '0 auto', background: complete ? 'var(--leaf-100)' : 'var(--surface-card)', border: `1.5px solid ${complete ? 'var(--leaf-400)' : 'var(--border-strong)'}`, borderRadius: 'var(--radius-lg)', padding: '18px 20px', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <HonestyMark state={cs} size={40} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-400)' }}>{lineage.child.tier} · {lineage.child.id}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink-900)', lineHeight: 1.05, marginTop: 2 }}>{lineage.child.title}</div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-500)', marginTop: 3 }}>{lineage.child.sub} · nests {total} parent tokens</div>
          </div>
        </div>
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${complete ? 'var(--leaf-400)' : 'var(--border-hairline)'}`, fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-600)', lineHeight: 1.5 }}>
          {complete
            ? <span><strong style={{ color: 'var(--leaf-700)' }}>Fully co-signed.</strong> All {total} tokens verified. The run inherits <strong>Checked</strong> end to end.</span>
            : <span>Inherits the weakest input: <strong>{CO_LABEL[cs === 'checked' ? 'checked' : cs === 'notyet' ? 'notyet' : 'told']}</strong>. {checkedN} of {total} tokens co-signed. Resolve the rest to lift the batch.</span>}
        </div>
      </div>
    </div>
  );
}

/* ================= F3 · Async edge buffer / sync status ================= */

function SyncStatus({ online, onOnline, onOffline, pending = [], onSynced }) {
  const [queue, setQueue] = React.useState(0);
  const [syncing, setSyncing] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [hash, setHash] = React.useState('');
  const timer = React.useRef(null);
  React.useEffect(() => () => clearInterval(timer.current), []);

  const storagePct = Math.min(99, (queue * 0.006).toFixed(1));
  function randHash() { return Array.from({ length: 4 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join(''); }

  function scanPallet() { setQueue((q) => q + 137); }
  function reconnect() {
    if (!queue && !pending.length) { onOnline(); return; }
    setSyncing(true); setProgress(0);
    clearInterval(timer.current);
    timer.current = setInterval(() => {
      setProgress((p) => {
        const np = Math.min(100, p + 7);
        setHash(randHash() + '…' + randHash());
        if (np >= 100) { clearInterval(timer.current); setSyncing(false); setQueue(0); onSynced(); onOnline(); }
        return np;
      });
    }, 130);
  }

  // idle + online + nothing queued → slim confirmation bar
  if (online && !queue && !syncing) {
    return (
      <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', borderTop: '1px solid var(--border-hairline)', background: 'var(--surface-card)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-600)' }}>
          <span style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--leaf-500,var(--leaf-600))' }} />
          Edge DB live · all scans &amp; edits synced
        </div>
        <button onClick={onOffline} style={{ minHeight: 36, border: '1px solid var(--paper-400)', background: 'transparent', cursor: 'pointer', borderRadius: 'var(--radius-md)', padding: '6px 12px', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-500)', letterSpacing: '0.03em' }}>Simulate offline</button>
      </div>
    );
  }

  if (syncing) {
    return (
      <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: 16, padding: '12px 20px', borderTop: '2px solid var(--indigo-400)', background: 'var(--indigo-100)' }}>
        <div className="tt-spin" style={{ width: 26, height: 26, borderRadius: '50%', border: '3px solid var(--indigo-300)', borderTopColor: 'var(--indigo-700)', flex: '0 0 auto' }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--indigo-900)', letterSpacing: '0.02em' }}>Pushing {[queue ? `${queue} scans` : null, pending.length ? `${pending.length} record ${pending.length === 1 ? 'edit' : 'edits'}` : null].filter(Boolean).join(' + ') || 'buffer'} to Edge DB · {progress}%</div>
          <div style={{ marginTop: 6, height: 6, background: 'var(--surface-raised)', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ width: progress + '%', height: '100%', background: 'var(--indigo-500)', borderRadius: 999, transition: 'width 130ms linear' }} />
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--indigo-700)', marginTop: 4, letterSpacing: '0.04em' }}>anchoring hash {hash}</div>
        </div>
      </div>
    );
  }

  // offline — cached buffer
  return (
    <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: 16, padding: '12px 20px', borderTop: '2px solid var(--ochre-500)', background: 'var(--ochre-100)' }}>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 18, lineHeight: 1 }}>⚠️</span>
        <div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600, color: 'var(--ochre-600)' }}>{queue || pending.length ? [queue ? `${queue} IDs cached locally` : null, pending.length ? `${pending.length} record ${pending.length === 1 ? 'edit' : 'edits'} pending sync` : null].filter(Boolean).join(' · ') : 'Offline · buffering enabled'}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--ink-500)', letterSpacing: '0.03em', marginTop: 1 }}>Edge buffer · storage {storagePct}% used · no data lost</div>
        </div>
      </div>
      <button onClick={scanPallet} style={{ minHeight: 48, minWidth: 48, border: '1.5px solid var(--ochre-500)', background: 'var(--surface-raised)', cursor: 'pointer', borderRadius: 'var(--radius-md)', padding: '0 16px', fontFamily: 'var(--font-sans)', fontSize: 13.5, fontWeight: 600, color: 'var(--ochre-600)' }}>Scan pallet +137</button>
      <button onClick={reconnect} style={{ minHeight: 48, border: 'none', background: 'var(--brand)', color: 'var(--paper-50)', cursor: 'pointer', borderRadius: 'var(--radius-md)', padding: '0 18px', fontFamily: 'var(--font-sans)', fontSize: 13.5, fontWeight: 600 }}>Reconnect &amp; sync</button>
    </div>
  );
}

/* ================= Overview (landing) ================= */

function Ring({ pct, size = 96, label, sub }) {
  const r = (size - 12) / 2, c = 2 * Math.PI * r, tone = pct >= 80 ? 'var(--leaf-600)' : pct >= 50 ? 'var(--ochre-500)' : 'var(--madder-500)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ position: 'relative', width: size, height: size, flex: '0 0 auto' }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}><circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--paper-300)" strokeWidth="8" /><circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={tone} strokeWidth="8" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} /></svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--ink-900)' }}>{pct}%</div>
      </div>
      <div><div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--ink-900)' }}>{label}</div><div style={{ fontFamily: 'var(--font-sans)', fontSize: 13.5, color: 'var(--ink-500)', marginTop: 3, maxWidth: 230, textWrap: 'pretty' }}>{sub}</div></div>
    </div>
  );
}

function Overview({ requestCount, onGoRecords, onGoOperations }) {
  const rows = window.TT.ledger;
  const { STATUS_LABEL, STATUS_TONE } = window.TT;
  const published = rows.filter((r) => r.status === 'published').length;
  const drafts = rows.filter((r) => r.status === 'draft').length;
  const awaiting = rows.filter((r) => r.status === 'awaiting').length;
  const pct = Math.round((published / rows.length) * 100);
  const totalUnits = rows.reduce((s, r) => s + (r.units || 0), 0);
  const honestyVals = rows.filter((r) => r.honesty != null).map((r) => r.honesty);
  const avgHonesty = Math.round(honestyVals.reduce((s, v) => s + v, 0) / honestyVals.length);
  const recent = rows.slice(0, 4);
  const card = { border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-lg)', background: 'var(--surface-card)', padding: '22px 24px' };

  // synthetic 12-week passport-scan trend (deterministic)
  const scans = [34, 41, 38, 52, 60, 57, 71, 83, 79, 96, 108, 124];
  const scanTotal = scans.reduce((s, v) => s + v, 0);
  const scanMax = Math.max(...scans);
  const scanDelta = Math.round(((scans[scans.length - 1] - scans[scans.length - 2]) / scans[scans.length - 2]) * 100);

  const kpi = (label, value, sub, tone) => (
    <div style={{ ...card, padding: '18px 20px' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-400)' }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 500, color: tone || 'var(--ink-900)', lineHeight: 1.1, marginTop: 8 }}>{value}</div>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-500)', marginTop: 3 }}>{sub}</div>
    </div>
  );

  const compBars = [
    ['Published & live', published, 'var(--leaf-600)'],
    ['Draft in progress', drafts, 'var(--ochre-500)'],
    ['Awaiting supplier data', awaiting, 'var(--madder-500)'],
  ];

  return (
    <div style={{ padding: '28px 32px 40px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 500, color: 'var(--ink-900)', margin: 0, lineHeight: 1.1 }}>Dashboard</h1>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--ink-500)', marginTop: 4 }}>Atelier Nord · Digital Product Passport programme</div>
        </div>
        <SButton variant="primary" onClick={onGoRecords} leadingIcon={<span style={{ fontSize: 16, lineHeight: 1 }}>＋</span>}>New passport</SButton>
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 16 }}>
        {kpi('Active passports', rows.length, `${totalUnits.toLocaleString()} units covered`)}
        {kpi('Published', published, `${pct}% of catalogue live`, 'var(--leaf-600)')}
        {kpi('Avg. honesty', avgHonesty + '%', 'Across verified records', 'var(--indigo-600)')}
        {kpi('Passport scans', scanTotal.toLocaleString(), `${scanDelta >= 0 ? '+' : ''}${scanDelta}% vs last week`, 'var(--ink-900)')}
      </div>

      {/* chart + completeness ring */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 16, marginBottom: 16 }}>
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 18 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--ink-900)' }}>Passport scans</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--ink-400)', letterSpacing: '0.04em' }}>LAST 12 WEEKS</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 150 }}>
            {scans.map((v, i) => {
              const last = i === scans.length - 1;
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: '100%', height: Math.round((v / scanMax) * 128), borderRadius: '4px 4px 0 0', background: last ? 'var(--indigo-500)' : 'var(--indigo-200, color-mix(in oklab, var(--indigo-500) 26%, var(--surface-card)))' }} />
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: last ? 'var(--ink-700)' : 'var(--ink-300)' }}>{i + 1}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div style={card}><Ring pct={pct} label="Evidence completeness" sub={`${published} of ${rows.length} records published with a live passport. The rest are drafts or awaiting data.`} /></div>
      </div>

      {/* compliance breakdown + data requests */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 16, marginBottom: 16 }}>
        <div style={card}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--ink-900)', marginBottom: 16 }}>Compliance status</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {compBars.map(([label, n, color]) => (
              <div key={label}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13.5, color: 'var(--ink-700)' }}>{label}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--ink-500)' }}>{n}</span>
                </div>
                <div style={{ height: 8, borderRadius: 999, background: 'var(--paper-200)', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.round((n / rows.length) * 100)}%`, height: '100%', background: color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <button onClick={onGoRecords} style={{ ...card, textAlign: 'left', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
            <div><div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--ink-900)' }}>Data requests</div><div style={{ fontFamily: 'var(--font-sans)', fontSize: 13.5, color: 'var(--ink-500)', marginTop: 3, maxWidth: 220, textWrap: 'pretty' }}>Brands &amp; buyers waiting on evidence from you.</div></div>
            <span style={{ flex: '0 0 auto', minWidth: 30, height: 30, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 999, background: 'var(--madder-500)', color: 'var(--paper-50)', fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 600 }}>{requestCount}</span>
          </div>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13.5, fontWeight: 600, color: 'var(--indigo-500)', marginTop: 18 }}>Review in Records →</span>
        </button>
      </div>

      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--ink-900)' }}>Recent ledger activity</div>
          <button onClick={onGoOperations} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 13.5, fontWeight: 600, color: 'var(--indigo-500)' }}>Open Operations →</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {recent.map((r, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', borderBottom: i < recent.length - 1 ? '1px solid var(--border-hairline)' : 'none' }}>
              <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--ink-900)' }}>{r.garment}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--ink-500)' }}>Batch {r.batch}</span>
              <SBadge tone={STATUS_TONE[r.status]} size="sm">{STATUS_LABEL[r.status]}</SBadge>
              <span style={{ width: 80, textAlign: 'right', fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-400)' }}>{r.updated}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================= Records (authoring + requests) ================= */

function RecordsView({ requestCount, onNew, onEdit, onProvide }) {
  const [filter, setFilter] = React.useState('all'); // all | action
  const rows = window.TT.ledger;
  const { STATUS_LABEL, STATUS_TONE } = window.TT;
  const chip = (id, label, count) => {
    const on = filter === id;
    return (
      <button key={id} onClick={() => setFilter(id)} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '7px 14px', borderRadius: 999, cursor: 'pointer', border: on ? '1px solid var(--ink-900)' : '1px solid var(--border-hairline)', background: on ? 'var(--ink-900)' : 'var(--surface-card)', color: on ? 'var(--paper-50)' : 'var(--ink-600)', fontFamily: 'var(--font-sans)', fontSize: 13.5, fontWeight: on ? 600 : 500 }}>
        {label}{count != null ? <span style={{ minWidth: 18, height: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 999, background: id === 'action' ? 'var(--madder-500)' : (on ? 'var(--paper-400)' : 'var(--surface-sunken)'), color: id === 'action' ? 'var(--paper-50)' : (on ? 'var(--ink-900)' : 'var(--ink-500)'), fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600 }}>{count}</span> : null}
      </button>
    );
  };
  return (
    <div style={{ padding: '28px 32px 40px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 20 }}>
        <div><h1 style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 500, color: 'var(--ink-900)', margin: 0, lineHeight: 1.1 }}>Records</h1><div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--ink-500)', marginTop: 4 }}>Mateo Ferreira · authoring &amp; incoming requests</div></div>
        <SButton variant="primary" onClick={onNew} leadingIcon={<span style={{ fontSize: 16, lineHeight: 1 }}>＋</span>}>New record</SButton>
      </div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>{chip('all', 'All records', rows.length)}{chip('action', 'Action needed', requestCount)}</div>
      {filter === 'action' ? <window.DataRequestsView onProvide={onProvide} bare /> : (
        <div style={{ border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--surface-card)' }}>
          {rows.map((r, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.8fr 0.8fr 1fr 0.9fr 0.8fr', gap: 12, alignItems: 'center', padding: '15px 20px', borderBottom: i < rows.length - 1 ? '1px solid var(--border-hairline)' : 'none' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--ink-900)' }}>{r.garment}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--ink-600)' }}>{r.batch}</span>
              <span><SBadge tone={STATUS_TONE[r.status]} size="sm">{STATUS_LABEL[r.status]}</SBadge></span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-500)' }}>{r.updated}</span>
              <span style={{ textAlign: 'right' }}><button onClick={() => onEdit(r)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--indigo-500)', fontWeight: 600 }}>Open</button></span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ================= Library (materials + certs + lineage) ================= */

function LibraryView({ sub, onSub, certProps, lineage, onCosign, onToast }) {
  const tabs = [['materials', 'Materials'], ['certs', 'Certs'], ['lineage', 'Lineage']];
  return (
    <div>
      <div style={{ padding: '24px 32px 0' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-400)' }}>Library · reference evidence</div>
        <div style={{ display: 'flex', gap: 4, marginTop: 14, borderBottom: '1px solid var(--border-hairline)' }}>
          {tabs.map(([id, label]) => {
            const on = sub === id;
            return <button key={id} onClick={() => onSub(id)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '10px 16px', marginBottom: -1, borderBottom: on ? '2px solid var(--ink-900)' : '2px solid transparent', fontFamily: 'var(--font-sans)', fontSize: 14.5, fontWeight: on ? 700 : 500, color: on ? 'var(--ink-900)' : 'var(--ink-400)' }}>{label}</button>;
          })}
        </div>
      </div>
      {sub === 'materials' ? <window.MaterialRegistryView onToast={onToast} bare /> : null}
      {sub === 'certs' ? <Certifications {...certProps} bare /> : null}
      {sub === 'lineage' ? <Lineage lineage={lineage} onCosign={onCosign} bare /> : null}
    </div>
  );
}

/* ================= router ================= */

const CHAIN_STAGE_ICONS = {
  design: <svg viewBox="0 0 20 20" fill="none"><path d="M13.5 3.5l3 3L7 16l-3.5.5L4 13 13.5 3.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg>,
  rawmat: <svg viewBox="0 0 20 20" fill="none"><path d="M10 17V8M10 8C10 5 8 3 4.5 3 4.5 6.5 6.5 8 10 8zM10 9c0-2.5 2-4.5 5.5-4.5C15.5 8 13.5 9 10 9z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" strokeLinecap="round" /></svg>,
  spinning: <svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="6.5" stroke="currentColor" strokeWidth="1.3" /><path d="M10 3.5v13M3.5 10h13" stroke="currentColor" strokeWidth="1" /><circle cx="10" cy="10" r="1.6" stroke="currentColor" strokeWidth="1.2" /></svg>,
  weaving: <svg viewBox="0 0 20 20" fill="none"><path d="M4 7h12M4 13h12M7 4v12M13 4v12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>,
  dyeing: <svg viewBox="0 0 20 20" fill="none"><path d="M10 3s4.5 5 4.5 8a4.5 4.5 0 01-9 0C5.5 8 10 3 10 3z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg>,
  sampling: <svg viewBox="0 0 20 20" fill="none"><rect x="3" y="6" width="14" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3" /><path d="M6.5 6v2.5M10 6v3.5M13.5 6v2.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" /></svg>,
  trims: <svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="6" stroke="currentColor" strokeWidth="1.3" /><circle cx="8" cy="8" r="1" fill="currentColor" /><circle cx="12" cy="8" r="1" fill="currentColor" /><circle cx="8" cy="12" r="1" fill="currentColor" /><circle cx="12" cy="12" r="1" fill="currentColor" /></svg>,
  mfg: <svg viewBox="0 0 20 20" fill="none"><path d="M4 16V8l4 2V8l4 2 4-3v9H4z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg>,
};

function chainColor(state) { return state === 'checked' ? 'var(--leaf-600)' : state === 'told' ? 'var(--ochre-500)' : 'var(--paper-400)'; }

const SUPPLY_TREE = {
  tier3: [
    { id: 'TKN·C1', tier: 'Tier 3 Supplier', role: 'Spinning / Weaving', supplier: 'Fio Verde Spinning', cert: 'Global Organic Textile Standard', icon: 'spinning', state: 'checked' },
    { id: 'TKN·D3', tier: 'Tier 3 Supplier', role: 'Dyeing', supplier: 'Casa Tinta', cert: 'Global Organic Textile Standard', icon: 'dyeing', state: 'told' },
  ],
  tier2: [
    { id: 'TKN·F2', tier: 'Tier 2 Supplier', role: 'Fabric', supplier: 'Malha Norte Knitting', cert: 'Global Organic Textile Standard', icon: 'weaving', state: 'checked' },
    { id: 'TKN·T4', tier: 'Tier 2 Supplier', role: 'Trims', supplier: 'Tagua Co-op', cert: 'ISO 9001:2015', icon: 'trims', state: 'notyet' },
  ],
  factory: { id: 'BATCH·0365', role: 'Manufacturing', supplier: 'Knitwear atelier · Portugal', certs: ['Sedex', 'Global Organic Textile Standard'], state: 'checked' },
};

const DPP_ROWS = [
  { label: 'Fabric Composition', icon: 'spinning', state: 'checked', open: true, detail: ['Fabric type: midweight loopback', '100% organic cotton · 320 GSM'] },
  { label: 'Care Instructions', icon: 'dyeing', state: 'checked' },
  { label: 'Supply Chain', icon: 'weaving', state: 'told' },
  { label: 'Component Traceability', icon: 'trims', state: 'told' },
  { label: 'Life Cycle Assessment', icon: 'sampling', state: 'told' },
  { label: 'Repair, Resale and Recycle', icon: 'mfg', state: 'notyet' },
];

function TierCard({ node }) {
  const st = node.state === 'pending' ? 'told' : node.state;
  return (
    <div style={{ border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)', padding: '13px 15px', boxShadow: 'var(--shadow-xs)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 14.5, fontWeight: 700, color: 'var(--ink-900)' }}>{node.tier}</span>
          <SMark state={st} size={15} />
        </div>
        <span style={{ width: 26, height: 26, borderRadius: '50%', border: '1px solid var(--border-hairline)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-500)', flex: '0 0 auto' }}>
          <span style={{ width: 15, height: 15, display: 'inline-flex' }}>{React.cloneElement(CHAIN_STAGE_ICONS[node.icon], { width: 15, height: 15 })}</span>
        </span>
      </div>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-500)', marginTop: 2 }}>{node.role}</div>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11.5, color: 'var(--ink-400)', marginTop: 1 }}>{node.supplier}</div>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, marginTop: 10, padding: '4px 10px', border: '1px solid var(--border-hairline)', borderRadius: 6, background: 'var(--paper-50)' }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: chainColor(st), flex: '0 0 auto' }} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-700)' }}>{node.cert}</span>
      </div>
    </div>
  );
}

function FactoryCard({ node }) {
  return (
    <div style={{ border: '1.5px solid var(--indigo-300)', borderRadius: 'var(--radius-lg)', background: 'var(--indigo-100)', padding: '16px 18px', boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 16, fontWeight: 700, color: 'var(--ink-900)' }}>Factory</span>
          <SMark state={node.state} size={16} />
        </div>
        <span style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid var(--indigo-300)', background: 'var(--surface-card)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--indigo-700)', flex: '0 0 auto' }}>
          <span style={{ width: 16, height: 16, display: 'inline-flex' }}>{React.cloneElement(CHAIN_STAGE_ICONS.mfg, { width: 16, height: 16 })}</span>
        </span>
      </div>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-600)', marginTop: 2 }}>{node.role}</div>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--ink-500)', marginTop: 1 }}>{node.supplier}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 11 }}>
        {node.certs.map((c) => (
          <span key={c} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', border: '1px solid var(--indigo-300)', borderRadius: 6, background: 'var(--surface-card)' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--leaf-600)', flex: '0 0 auto' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-700)' }}>{c}</span>
          </span>
        ))}
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-400)', marginTop: 9 }}>{node.id}</div>
    </div>
  );
}

function ChainGutter() {
  const line = '2px dashed var(--paper-400)';
  return (
    <div style={{ flex: '0 0 54px', position: 'relative', alignSelf: 'stretch' }}>
      <div style={{ position: 'absolute', left: 0, width: '50%', top: '25%', borderTop: line }} />
      <div style={{ position: 'absolute', left: 0, width: '50%', top: '75%', borderTop: line }} />
      <div style={{ position: 'absolute', left: '50%', top: '25%', bottom: '25%', borderLeft: line }} />
      <div style={{ position: 'absolute', left: '50%', right: 6, top: '50%', borderTop: line }} />
      <svg style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' }} width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 2l5 4-5 4" stroke="var(--ink-400)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </div>
  );
}

function DppPhonePanel() {
  return (
    <div style={{ flex: '0 0 300px', alignSelf: 'flex-start' }}>
      <div style={{ borderRadius: 34, border: '9px solid var(--ink-900)', background: 'var(--surface-card)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ padding: '16px 16px 18px' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, color: 'var(--ink-900)', paddingBottom: 10, borderBottom: '2px solid var(--indigo-500)', marginBottom: 12 }}>Digital Product Passport (DPP)</div>
          <div style={{ position: 'relative', height: 120, borderRadius: 10, overflow: 'hidden', background: 'var(--indigo-100)', marginBottom: 12 }}>
            <image-slot id="dpp-map" shape="rect" placeholder="Origin map"></image-slot>
          </div>
          <div>
            {DPP_ROWS.map((r, i) => (
              <div key={r.label} style={{ borderTop: i ? '1px solid var(--border-hairline)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '10px 2px' }}>
                  <span style={{ width: 16, height: 16, display: 'inline-flex', color: 'var(--ink-600)', flex: '0 0 auto' }}>{React.cloneElement(CHAIN_STAGE_ICONS[r.icon], { width: 16, height: 16 })}</span>
                  <span style={{ flex: 1, fontFamily: 'var(--font-sans)', fontSize: 12.5, fontWeight: 600, color: 'var(--ink-900)' }}>{r.label}</span>
                  <SMark state={r.state} size={14} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 15, color: 'var(--ink-400)', width: 12, textAlign: 'center', lineHeight: 1 }}>{r.open ? '–' : '+'}</span>
                </div>
                {r.open && r.detail ? (
                  <div style={{ padding: '0 2px 10px 25px' }}>
                    {r.detail.map((d) => <div key={d} style={{ fontFamily: 'var(--font-sans)', fontSize: 11.5, color: 'var(--ink-500)', lineHeight: 1.5 }}>{d}</div>)}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border-hairline)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-500)' }}><SMark state="checked" size={12} />Verified</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-500)' }}><SMark state="told" size={12} />Unverified</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SupplyChainMap({ onPassport }) {
  const stages = window.TT.chainStages;
  const L = window.TT.lineage;
  return (
    <div style={{ paddingBottom: 44 }}>
      {/* style bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 32px', borderBottom: '1px solid var(--border-hairline)', background: 'var(--surface-card)', position: 'sticky', top: 0, zIndex: 5 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', color: 'var(--ink-400)' }}>STYLE</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--ink-900)' }}>{L.child.id}</span>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11.5, fontWeight: 600, color: 'var(--leaf-700)', background: 'var(--leaf-100)', border: '1px solid var(--leaf-400)', borderRadius: 999, padding: '3px 11px' }}>Active</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
          <SButton variant="secondary">Connect to Shopify</SButton>
          <SButton variant="secondary" onClick={onPassport}>View passport</SButton>
          <SButton variant="primary">Analytics</SButton>
        </div>
      </div>

      <div style={{ padding: '26px 32px 0' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 500, color: 'var(--ink-900)', margin: 0, lineHeight: 1.1 }}>Supply chain</h1>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--ink-500)', marginTop: 4 }}>{L.child.title} · {L.child.sub} · {L.child.tier}</div>
      </div>

      {/* production stage strip */}
      <div style={{ overflowX: 'auto', padding: '26px 32px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', minWidth: 'min-content' }}>
          {stages.map((s, i) => (
            <React.Fragment key={s.id}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 104, flex: '0 0 auto' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', border: `2px solid ${chainColor(s.state)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-card)', color: 'var(--ink-800)' }}>
                  <span style={{ width: 24, height: 24, display: 'inline-flex' }}>{React.cloneElement(CHAIN_STAGE_ICONS[s.id], { width: 24, height: 24 })}</span>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-800)', marginTop: 10, textAlign: 'center' }}>{s.label}</div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--ink-400)', marginTop: 3, textAlign: 'center', lineHeight: 1.3 }}>{s.supplier}</div>
                <div style={{ marginTop: 6 }}><SMark state={s.state} size={13} /></div>
              </div>
              {i < stages.length - 1 ? <div style={{ flex: '0 0 22px', height: 2, marginTop: 27, borderTop: '2px solid var(--paper-400)' }} /> : null}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* supplier network + DPP preview */}
      <div style={{ padding: '0 32px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-500)', paddingBottom: 14, borderBottom: '1px solid var(--border-hairline)', marginBottom: 22 }}>Supplier network</div>
        <div style={{ display: 'flex', gap: 28, alignItems: 'stretch' }}>
          <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'stretch' }}>
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 16 }}>
              {SUPPLY_TREE.tier3.map((n) => <TierCard key={n.id} node={n} />)}
            </div>
            <ChainGutter />
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 16 }}>
              {SUPPLY_TREE.tier2.map((n) => <TierCard key={n.id} node={n} />)}
            </div>
            <ChainGutter />
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <FactoryCard node={SUPPLY_TREE.factory} />
            </div>
          </div>
          <DppPhonePanel />
        </div>
      </div>
    </div>
  );
}

function RepairingConsole({ row, onBack }) {
  const R = window.TT.repairIntake;
  const [type, setType] = React.useState('both');
  const [step, setStep] = React.useState(2);
  const [showMore, setShowMore] = React.useState(false);
  const [materials, setMaterials] = React.useState(R.materials);
  const [trims, setTrims] = React.useState([{ id: 't0', name: '', cost: '' }]);
  const [repairTypes, setRepairTypes] = React.useState(R.repairTypes.map((r) => r.name));
  const [time, setTime] = React.useState('');
  const [unit, setUnit] = React.useState('Hours');
  const pid = R.pid;

  const eyebrow = { fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-500)' };
  const sectionTitle = { fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 700, color: 'var(--indigo-600)', margin: '0 0 14px' };
  const field = { width: '100%', boxSizing: 'border-box', border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', padding: '11px 13px', fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--ink-900)', background: 'var(--surface-card)', outline: 'none' };
  const iconBtn = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, flex: '0 0 auto', border: '1px solid var(--border-hairline)', background: 'var(--surface-card)', borderRadius: 'var(--radius-md)', cursor: 'pointer', color: 'var(--ink-500)' };
  const typeOpts = [['standard', 'Standard Repair'], ['custom', 'Custom Repair'], ['both', 'Standard + Custom Repair']];
  const steps = [['Step 1', 'Repair Information'], ['Step 2', 'Custom Repair Information'], ['Step 3', 'Custom Material Information']];
  const addBtn = (label, onClick) => (
    <button onClick={onClick} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1px solid var(--paper-400)', background: 'var(--surface-card)', borderRadius: 'var(--radius-md)', cursor: 'pointer', padding: '10px 16px', fontFamily: 'var(--font-sans)', fontSize: 13.5, fontWeight: 600, color: 'var(--ink-800)' }}>
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>{label}
    </button>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* screen header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 32px', borderBottom: '1px solid var(--border-hairline)', background: 'var(--surface-card)', flex: '0 0 auto' }}>
        <button onClick={onBack} aria-label="Back" style={{ ...iconBtn, borderRadius: 999 }}>
          <svg width="17" height="17" viewBox="0 0 20 20" fill="none"><path d="M12 4l-6 6 6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink-900)' }}>Repairing</span>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 11 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600, color: 'var(--ink-900)' }}>Emil Petersson</div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--ink-500)' }}>Admin</div>
          </div>
          <span style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--indigo-500)', color: 'var(--paper-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700 }}>EP</span>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '22px 32px' }}>
        {/* pid bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-lg)', background: 'var(--surface-card)', padding: '16px 20px', marginBottom: 22 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 600, color: 'var(--indigo-700)' }}>{pid}</span>
          <SBadge tone="info" size="sm">{R.status}</SBadge>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
            <button onClick={() => setShowMore((s) => !s)} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1px solid var(--paper-400)', background: 'var(--surface-card)', borderRadius: 'var(--radius-md)', cursor: 'pointer', padding: '9px 15px', fontFamily: 'var(--font-sans)', fontSize: 13.5, fontWeight: 500, color: 'var(--ink-700)' }}>
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{ transform: showMore ? 'rotate(180deg)' : 'none' }}><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>Show More
            </button>
            <button style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1px solid var(--paper-400)', background: 'var(--surface-card)', borderRadius: 'var(--radius-md)', cursor: 'pointer', padding: '9px 15px', fontFamily: 'var(--font-sans)', fontSize: 13.5, fontWeight: 500, color: 'var(--ink-700)' }}>
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.2" stroke="currentColor" strokeWidth="1.5" /><path d="M10 6v4l2.6 1.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>Process History
            </button>
          </div>
        </div>
        {showMore ? (
          <div style={{ display: 'flex', gap: 12, marginBottom: 22 }}>
            {[['Batch', R.batch], ['Arrival at facility', R.arrival], ['Assigned to', 'Emil Petersson'], ['Job ref', row && row.batch ? 'SVC · ' + row.batch : 'SVC-118']].map(([l, v]) => (
              <div key={l} style={{ flex: 1, border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)', padding: '12px 15px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--ink-400)' }}>{l}</div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 600, color: 'var(--ink-900)', marginTop: 4 }}>{v}</div>
              </div>
            ))}
          </div>
        ) : null}

        {/* two columns */}
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 28, alignItems: 'start' }}>
          {/* left — flaws */}
          <div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 700, color: 'var(--ink-900)', marginBottom: 12 }}>Flaws in the Product</div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
              {[['front', 'Front'], ['back', 'Back']].map(([id, label]) => (
                <div key={id} style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ position: 'relative', height: 250, borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-hairline)', background: 'var(--surface-card)' }}>
                    <image-slot id={'repair-web-' + id} shape="rect" placeholder={label + ' view'}></image-slot>
                    {R.flaws.map((f, i) => (
                      <span key={i} title={f.title} style={{ position: 'absolute', left: (id === 'front' ? f.x : 100 - f.x) + '%', top: f.y + '%', transform: 'translate(-50%,-50%)', width: 22, height: 22, borderRadius: '50%', background: 'var(--madder-500)', color: 'var(--paper-50)', border: '2px solid var(--paper-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700 }}>{i + 1}</span>
                    ))}
                  </div>
                  <div style={{ textAlign: 'center', marginTop: 7 }}><span style={{ display: 'inline-block', border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)', padding: '3px 14px', fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-700)' }}>{label}</span></div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {R.flaws.map((f, i) => (
                <div key={i} style={{ background: 'var(--surface-sunken)', border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', padding: '12px 14px' }}>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13.5, fontWeight: 600, color: 'var(--ink-900)' }}>{f.title}{f.count ? ' : ' + f.count : ''}</div>
                  {f.note ? <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--ink-500)', lineHeight: 1.45, marginTop: 3 }}>{f.note}</div> : null}
                </div>
              ))}
            </div>
          </div>

          {/* right — repair details */}
          <div style={{ border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-lg)', background: 'var(--surface-card)', padding: '20px 22px' }}>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 700, color: 'var(--ink-900)', marginBottom: 16 }}>Repair Details</div>
            <div style={{ ...eyebrow, marginBottom: 9 }}>Type of Repair</div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid var(--border-hairline)' }}>
              {typeOpts.map(([id, label]) => {
                const on = type === id;
                return (
                  <button key={id} onClick={() => setType(id)} style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, border: `1.5px solid ${on ? 'var(--indigo-400)' : 'var(--paper-400)'}`, background: on ? 'var(--indigo-100)' : 'var(--surface-card)', cursor: 'pointer', borderRadius: 'var(--radius-md)', padding: '13px 10px', fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 700, color: on ? 'var(--indigo-700)' : 'var(--ink-900)' }}>
                    {on ? <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" fill="var(--indigo-500)" /><path d="M6 10.2l2.6 2.6L14 7.4" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg> : null}{label}
                  </button>
                );
              })}
            </div>

            {/* stepper */}
            <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 22 }}>
              {steps.map(([lbl, sub], i) => {
                const on = step === i, done = step > i;
                return (
                  <React.Fragment key={i}>
                    <button onClick={() => setStep(i)} style={{ display: 'flex', alignItems: 'center', gap: 10, border: 'none', background: 'transparent', cursor: 'pointer', padding: 0 }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, flex: '0 0 auto', borderRadius: '50%', background: on || done ? 'var(--ink-900)' : 'var(--surface-card)', border: `1.5px solid ${on || done ? 'var(--ink-900)' : 'var(--paper-400)'}`, color: on || done ? 'var(--paper-50)' : 'var(--ink-400)', fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700 }}>{done ? '✓' : i + 1}</span>
                      <span style={{ textAlign: 'left' }}>
                        <span style={{ display: 'block', fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600, color: on || done ? 'var(--ink-900)' : 'var(--ink-500)' }}>{lbl}</span>
                        <span style={{ display: 'block', fontFamily: 'var(--font-sans)', fontSize: 11.5, color: 'var(--ink-400)' }}>{sub}</span>
                      </span>
                    </button>
                    {i < steps.length - 1 ? <span style={{ flex: 1, height: 1.5, background: 'var(--border-hairline)', margin: '15px 12px 0' }}></span> : null}
                  </React.Fragment>
                );
              })}
            </div>

            {/* step body */}
            {step === 0 ? (
              <div>
                <div style={sectionTitle}>Custom repair type</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
                  {repairTypes.map((rt, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <input value={rt} onChange={(e) => setRepairTypes((a) => a.map((x, k) => k === i ? e.target.value : x))} placeholder="Eg. Hole in the seam" style={field} />
                      <button onClick={() => setRepairTypes((a) => a.filter((_, k) => k !== i))} aria-label="Remove" style={iconBtn}><svg width="15" height="15" viewBox="0 0 20 20" fill="none"><path d="M5 6h10M8 6V4.5h4V6M6.5 6l.6 9h5.8l.6-9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom: 24 }}>{addBtn('Add New Repair Type', () => setRepairTypes((a) => [...a, '']))}</div>
                <div style={{ ...eyebrow, marginBottom: 8 }}>Required Time for Repair *</div>
                <div style={{ display: 'flex', gap: 10, maxWidth: 360, marginBottom: 24 }}>
                  <input value={time} onChange={(e) => setTime(e.target.value)} placeholder="Eg. 1, 2, 3.5" style={field} />
                  <div style={{ position: 'relative', flex: '0 0 130px' }}>
                    <select value={unit} onChange={(e) => setUnit(e.target.value)} style={{ ...field, appearance: 'none', paddingRight: 32, cursor: 'pointer' }}><option>Hours</option><option>Minutes</option><option>Days</option></select>
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--ink-400)' }}><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                </div>
                <div style={{ ...eyebrow, marginBottom: 8 }}>Product Before Repair</div>
                <div style={{ height: 160, maxWidth: 360, borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px dashed var(--paper-400)' }}><image-slot id="repair-web-before" shape="rect" placeholder="Upload image · the product's condition"></image-slot></div>
              </div>
            ) : null}

            {step === 1 ? (
              <div>
                <div style={sectionTitle}>Custom Repair Information</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {repairTypes.map((rt, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <input value={rt} onChange={(e) => setRepairTypes((a) => a.map((x, k) => k === i ? e.target.value : x))} placeholder="Unravelled top stitch" style={field} />
                      <button onClick={() => setRepairTypes((a) => a.filter((_, k) => k !== i))} aria-label="Remove" style={iconBtn}><svg width="15" height="15" viewBox="0 0 20 20" fill="none"><path d="M5 6h10M8 6V4.5h4V6M6.5 6l.6 9h5.8l.6-9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 14 }}>{addBtn('Add New Repair Type', () => setRepairTypes((a) => [...a, '']))}</div>
              </div>
            ) : null}

            {step === 2 ? (
              <div>
                <div style={sectionTitle}>Materials used for repairing</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
                  {materials.map((m) => (
                    <div key={m.id} style={{ display: 'flex', gap: 14, alignItems: 'center', background: 'var(--surface-sunken)', border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', padding: '14px 16px' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600, color: 'var(--ink-900)' }}>{m.name} <span style={{ color: 'var(--ink-400)' }}>|</span> {m.cost}</div>
                        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-500)', marginTop: 3 }}>{m.comp}</div>
                      </div>
                      <button aria-label="Edit" style={iconBtn}><svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M13.5 4.5l2 2L7 15l-2.6.6L5 13z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg></button>
                      <button onClick={() => setMaterials((a) => a.filter((x) => x.id !== m.id))} aria-label="Delete" style={iconBtn}><svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M5 6h10M8 6V4.5h4V6M6.5 6l.6 9h5.8l.6-9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom: 28 }}>{addBtn('Add Material', () => setMaterials((a) => [...a, { id: 'm' + Date.now(), name: 'New material', cost: '— SEK', comp: 'Composition to be set' }]))}</div>

                <div style={sectionTitle}>Trim</div>
                <div style={{ border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: 14 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 44px', gap: 14, background: 'var(--surface-sunken)', padding: '11px 16px' }}>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, color: 'var(--ink-700)' }}>Trim</span>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, color: 'var(--ink-700)' }}>Material Cost</span>
                    <span></span>
                  </div>
                  {trims.map((t) => (
                    <div key={t.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 44px', gap: 14, alignItems: 'center', padding: '12px 16px', borderTop: '1px solid var(--border-hairline)' }}>
                      <input value={t.name} onChange={(e) => setTrims((a) => a.map((x) => x.id === t.id ? { ...x, name: e.target.value } : x))} placeholder="Eg. Lining" style={field} />
                      <input value={t.cost} onChange={(e) => setTrims((a) => a.map((x) => x.id === t.id ? { ...x, cost: e.target.value } : x))} placeholder="SEK" style={field} />
                      <button onClick={() => setTrims((a) => a.filter((x) => x.id !== t.id))} aria-label="Delete" style={{ ...iconBtn, border: 'none' }}><svg width="15" height="15" viewBox="0 0 20 20" fill="none"><path d="M5 6h10M8 6V4.5h4V6M6.5 6l.6 9h5.8l.6-9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
                    </div>
                  ))}
                </div>
                {addBtn('Add Trim', () => setTrims((a) => [...a, { id: 't' + Date.now(), name: '', cost: '' }]))}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* bottom bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 32px', borderTop: '1px solid var(--border-hairline)', background: 'var(--surface-card)', flex: '0 0 auto' }}>
        <button style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1px solid var(--paper-400)', background: 'var(--surface-card)', borderRadius: 'var(--radius-md)', cursor: 'pointer', padding: '10px 16px', fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600, color: 'var(--ink-800)' }}>
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M10 4a6 6 0 105.7 4.1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /><path d="M14.5 3v3h-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>Rescan Product
        </button>
        <button onClick={() => (step === 0 ? onBack() : setStep((s) => s - 1))} style={{ marginLeft: 'auto', border: 'none', background: 'transparent', cursor: 'pointer', padding: '10px 16px', fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600, color: 'var(--ink-800)' }}>Back</button>
        <button onClick={() => (step < 2 ? setStep((s) => s + 1) : onBack())} style={{ border: 'none', cursor: 'pointer', borderRadius: 'var(--radius-md)', background: 'var(--ink-900)', color: 'var(--paper-50)', padding: '11px 20px', fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600 }}>{step < 2 ? 'Save & Proceed' : 'Submit Details & Scan Next'}</button>
      </div>
    </div>
  );
}

const PROD_SWATCH = ['#3B4A78', '#6E5A9C', '#4E6B52', '#9C5A52', '#8B6D4B'];

function ProductsWardrobe({ requestCount, onNew, onEdit, onProvide }) {
  const [filter, setFilter] = React.useState('all');
  const rows = window.TT.ledger;
  const { STATUS_LABEL, STATUS_TONE } = window.TT;
  const chip = (id, label, count) => {
    const on = filter === id;
    return (
      <button key={id} onClick={() => setFilter(id)} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '7px 14px', borderRadius: 999, cursor: 'pointer', border: on ? '1px solid var(--ink-900)' : '1px solid var(--border-hairline)', background: on ? 'var(--ink-900)' : 'var(--surface-card)', color: on ? 'var(--paper-50)' : 'var(--ink-600)', fontFamily: 'var(--font-sans)', fontSize: 13.5, fontWeight: on ? 600 : 500 }}>
        {label}{count != null ? <span style={{ minWidth: 18, height: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 999, background: id === 'action' ? 'var(--madder-500)' : (on ? 'var(--paper-400)' : 'var(--surface-sunken)'), color: id === 'action' ? 'var(--paper-50)' : (on ? 'var(--ink-900)' : 'var(--ink-500)'), fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600 }}>{count}</span> : null}
      </button>
    );
  };
  return (
    <div style={{ padding: '28px 32px 40px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 20 }}>
        <div><h1 style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 500, color: 'var(--ink-900)', margin: 0, lineHeight: 1.1 }}>Products</h1><div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--ink-500)', marginTop: 4 }}>Atelier Nord · your garment collection &amp; passports</div></div>
        <SButton variant="primary" onClick={onNew} leadingIcon={<span style={{ fontSize: 16, lineHeight: 1 }}>＋</span>}>New product</SButton>
      </div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 22 }}>{chip('all', 'All products', rows.length)}{chip('action', 'Action needed', requestCount)}</div>
      {filter === 'action' ? <window.DataRequestsView onProvide={onProvide} bare /> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(244px, 1fr))', gap: 16 }}>
          {rows.map((r, i) => {
            const sw = PROD_SWATCH[i % PROD_SWATCH.length];
            const hon = r.honesty;
            const tone = hon == null ? 'var(--ink-300)' : hon >= 80 ? 'var(--leaf-600)' : hon >= 50 ? 'var(--ochre-500)' : 'var(--madder-500)';
            return (
              <button key={r.batch} onClick={() => onEdit(r)} style={{ textAlign: 'left', padding: 0, border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-lg)', background: 'var(--surface-card)', overflow: 'hidden', cursor: 'pointer', boxShadow: 'var(--shadow-xs)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'relative', height: 150, background: `linear-gradient(150deg, ${sw}, color-mix(in oklab, ${sw} 62%, #000))` }}>
                  <image-slot id={'biz-prod-' + r.batch} shape="rect" placeholder=" "></image-slot>
                  <span style={{ position: 'absolute', top: 10, left: 10 }}><SBadge tone={STATUS_TONE[r.status]} size="sm">{STATUS_LABEL[r.status]}</SBadge></span>
                </div>
                <div style={{ padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--ink-900)', lineHeight: 1.15 }}>{r.garment}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--ink-500)', marginTop: 3, letterSpacing: '0.02em' }}>Batch {r.batch} · {r.sku}</div>
                  </div>
                  <div style={{ marginTop: 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-400)' }}>Honesty</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, color: tone }}>{hon == null ? '—' : hon + '%'}</span>
                    </div>
                    <div style={{ height: 5, borderRadius: 999, background: 'var(--paper-300)', overflow: 'hidden' }}>
                      <div style={{ width: (hon || 0) + '%', height: '100%', background: tone, borderRadius: 999 }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--ink-400)' }}>{r.updated}</span>
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, color: 'var(--indigo-500)' }}>Open →</span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ProductsView({ onBack }) {
  const P = window.TT.productDetail;
  const [showMore, setShowMore] = React.useState(true);
  const eyebrow = { fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-500)' };
  const chip = { display: 'inline-flex', alignItems: 'center', border: '1px solid var(--border-hairline)', background: 'var(--surface-sunken)', borderRadius: 'var(--radius-md)', padding: '11px 16px', fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600, color: 'var(--ink-900)' };
  const sectionTitle = { fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600, color: 'var(--ink-500)', marginBottom: 12 };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--surface-page)' }}>
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 32px', borderBottom: '1px solid var(--border-hairline)', background: 'var(--surface-card)', flex: '0 0 auto' }}>
        <button onClick={onBack} aria-label="Back" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: '50%', border: '1px solid var(--border-hairline)', background: 'var(--surface-card)', cursor: 'pointer', color: 'var(--ink-700)' }}>
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M12 4l-6 6 6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink-900)' }}>Products</span>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 11 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 700, color: 'var(--ink-900)', lineHeight: 1.1 }}>Emil Petersson</div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--ink-500)' }}>Admin</div>
          </div>
          <span style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--indigo-500)', color: 'var(--paper-50)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 700 }}>EP</span>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '26px 32px 40px' }}>
        {/* PID card */}
        <div style={{ border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-lg)', background: 'var(--surface-card)', padding: '22px 24px', marginBottom: 26 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: showMore ? 20 : 0 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 600, color: 'var(--indigo-700)' }}>{P.pid}</span>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, fontWeight: 600, color: 'var(--indigo-700)', background: 'var(--indigo-100)', borderRadius: 'var(--radius-pill)', padding: '4px 12px' }}>{P.status}</span>
            <button onClick={() => setShowMore((s) => !s)} style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 7, border: '1px solid var(--border-hairline)', background: 'var(--surface-card)', cursor: 'pointer', borderRadius: 'var(--radius-md)', padding: '8px 14px', fontFamily: 'var(--font-sans)', fontSize: 13.5, fontWeight: 600, color: 'var(--ink-800)' }}>
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{ transform: showMore ? 'none' : 'rotate(180deg)' }}><path d="M12 10L8 6l-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              {showMore ? 'Show Less' : 'Show More'}
            </button>
          </div>
          {showMore ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14 }}>
              {P.fields.map((f) => (
                <div key={f.label} style={{ background: 'var(--surface-sunken)', border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', padding: '13px 15px' }}>
                  <div style={eyebrow}>{f.label}</div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 700, color: 'var(--ink-900)', marginTop: 5 }}>{f.value}</div>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {/* two columns */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 1fr', gap: 40, alignItems: 'start' }}>
          {/* left — repair details */}
          <div style={{ border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-lg)', background: 'var(--surface-card)', padding: '22px 24px' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--ink-900)', marginBottom: 20 }}>Repair Details</div>
            <div style={sectionTitle}>Flaws in the product</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 26 }}>
              {P.flaws.map((f) => <span key={f} style={chip}>{f}</span>)}
            </div>
            <div style={sectionTitle}>Material Composition</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 26 }}>
              {P.composition.map((c) => <span key={c} style={chip}>{c}</span>)}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
              {[['prod-before', 'Product Before Repairing'], ['prod-after', 'Product After Repairing']].map(([id, label]) => (
                <div key={id}>
                  <div style={{ ...sectionTitle, marginBottom: 10 }}>{label}</div>
                  <div style={{ height: 210, borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-hairline)' }}>
                    <image-slot id={id} shape="rect" placeholder={label}></image-slot>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* right — process / cost */}
          <div style={{ border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-lg)', background: 'var(--surface-card)', padding: '22px 24px' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--ink-900)', marginBottom: 22 }}>Process / Cost undergone by the Product</div>
            <div>
              {P.process.map((h, i) => {
                const last = i === P.process.length - 1;
                return (
                  <div key={i} style={{ display: 'flex', gap: 16 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '0 0 auto' }}>
                      <span style={{ width: 28, height: 28, borderRadius: '50%', flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--leaf-600)', color: 'var(--paper-50)' }}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7.2l2.6 2.6L11 4.4" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </span>
                      {!last ? <span style={{ flex: 1, width: 2, background: 'var(--border-hairline)', margin: '3px 0' }}></span> : null}
                    </div>
                    <div style={{ flex: 1, minWidth: 0, paddingBottom: last ? 0 : 22 }}>
                      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 17, fontWeight: 700, color: 'var(--ink-900)', lineHeight: 1.2 }}>{h.title}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 5, fontFamily: 'var(--font-sans)', fontSize: 13.5, color: 'var(--ink-500)' }}>
                        <span>{h.date}</span><span style={{ color: 'var(--ink-300)' }}>|</span><span>{h.by}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SupplierApp({ pov, onPov }) {
  const [phase, setPhase] = React.useState('signin'); // signin | ledger | authoring | certs | requests | materials | facility
  const [toast, setToast] = React.useState(null);
  const [qr, setQr] = React.useState(null);
  const [bulk, setBulk] = React.useState(false);
  const [repairRow, setRepairRow] = React.useState(null);
  const [certs, setCerts] = React.useState(() => {
    try { const s = localStorage.getItem('tt_certs_v2'); if (s) return JSON.parse(s); } catch (e) {}
    return window.TT.certs;
  });
  const [lineage, setLineage] = React.useState(() => JSON.parse(JSON.stringify(window.TT.lineage)));
  const [online, setOnline] = React.useState(true);
  const [pendingSync, setPendingSync] = React.useState([]); // batches edited while offline
  const markPending = (batch) => setPendingSync((p) => p.includes(batch) ? p : [...p, batch]);
  const cosign = (id) => setLineage((L) => ({ ...L, parents: L.parents.map((p) => p.id === id ? { ...p, state: 'checked', cert: p.cert } : p) }));
  React.useEffect(() => { try { localStorage.setItem('tt_certs_v2', JSON.stringify(certs)); } catch (e) {} }, [certs]);
  const addCert = (c) => setCerts((cs) => [c, ...cs]);
  const replaceCert = (id, c) => setCerts((cs) => cs.map((x) => x.id === id ? { ...c, id } : x));

  React.useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 2600); return () => clearTimeout(t); }, [toast]);

  const [librarySub, setLibrarySub] = React.useState('materials');
  const goCerts = () => { setLibrarySub('certs'); setPhase('library'); };

  if (phase === 'signin') return <SignIn pov={pov} onPov={onPov} onSignIn={() => setPhase('overview')} />;

  const groupFor = { overview: 'overview', ledger: 'operations', collection: 'operations', products: 'products', records: 'products', requests: 'products', authoring: 'products', library: 'library', materials: 'library', certs: 'library', batches: 'library', facility: 'facility' }[phase] || 'overview';
  const groupDefault = { overview: 'overview', operations: 'ledger', products: 'products', library: 'library', facility: 'facility' };

  function publish(p) {
    const row = window.TT.ledger.find((r) => r.batch === '0365') || { garment: '365 Midweight Hoodie', batch: '0365' };
    setPhase('ledger');
    if (!online) { markPending('0365'); setToast(`Published locally · queued for sync · ${p}% honest`); return; }
    setToast(`Published · ships at ${p}% honest`);
    setTimeout(() => setQr(row), 350);
  }

  return (
    <Shell nav={groupFor} onNav={(g) => setPhase(groupDefault[g] || g)} onPov={onPov} sync={<SyncStatus online={online} onOnline={() => setOnline(true)} onOffline={() => setOnline(false)} pending={pendingSync} onSynced={() => setPendingSync([])} />}>
      {phase === 'overview' ? <Overview requestCount={3} onGoRecords={() => setPhase('products')} onGoOperations={() => setPhase('ledger')} /> : null}
      {phase === 'products' ? <ProductsWardrobe requestCount={3} onNew={() => setPhase('authoring')} onEdit={() => setPhase('authoring')} onProvide={() => setPhase('authoring')} /> : null}
      {phase === 'ledger' ? <Ledger onEdit={() => setPhase('authoring')} onNew={() => setPhase('authoring')} onQR={(r) => setQr(r)} onBulk={() => setBulk(true)} onLogEvent={() => setPhase('collection')} pendingSync={pendingSync} /> : null}
      {phase === 'collection' ? (
        <div>
          <div style={{ padding: '20px 32px 0' }}><button onClick={() => setPhase('ledger')} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 13.5, fontWeight: 600, color: 'var(--indigo-500)' }}>← Back to Operations</button></div>
          <window.DataCollectionView onToast={setToast} onManageCerts={goCerts} bare />
        </div>
      ) : null}
      {phase === 'library' ? <LibraryView sub={librarySub} onSub={setLibrarySub} certProps={{ certs, onAddCert: addCert, onReplaceCert: replaceCert, onToast: setToast }} lineage={lineage} onCosign={cosign} onToast={setToast} /> : null}
      {phase === 'facility' ? <window.FacilityProfileView /> : null}
      {phase === 'authoring' ? <Authoring certs={certs} onAddCert={addCert} onReplaceCert={replaceCert} onPublish={publish} onCancel={() => { if (!online) { markPending('0365'); setToast('Saved locally · queued for sync'); } else { setToast('Draft saved (private)'); } setPhase('products'); }} onManageCerts={goCerts} /> : null}

      <QRModal open={!!qr} row={qr} onClose={() => setQr(null)} />
      <window.BulkUploadModal open={bulk} onClose={() => setBulk(false)} onToast={setToast} />

      {toast ? (
        <div className="tt-fade" style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 1400, background: 'var(--ink-900)', color: 'var(--paper-50)', padding: '11px 18px', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', fontFamily: 'var(--font-sans)', fontSize: 14 }}>{toast}</div>
      ) : null}
    </Shell>
  );
}

window.SupplierApp = SupplierApp;
