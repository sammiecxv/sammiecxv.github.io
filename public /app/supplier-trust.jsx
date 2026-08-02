// ThreadTrace supplier console — trust & audit extras:
// PublishGateModal (disclose, don't block), AuditModal (per-claim change history),
// ttFmtYM date helper. Loaded before supplier.jsx; exports via window.
const { Button: TrButton, HonestyMark: TrMark } = window.ThreadTraceDesignSystem_f6483d;

function ttFmtYM(ym) {
  if (!ym || !/^\d{4}-\d{2}$/.test(ym)) return ym || '';
  const [y, m] = ym.split('-').map(Number);
  return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][m - 1] + ' ' + y;
}

function TrustModal({ open, onClose, width = 470, children }) {
  if (!open) return null;
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 1350, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(28,24,20,0.4)', backdropFilter: 'blur(2px)' }}></div>
      <div className="tt-fade" style={{ position: 'relative', width, maxWidth: '92%', maxHeight: '90%', overflowY: 'auto', background: 'var(--surface-card)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)', padding: '24px 26px' }}>
        {children}
      </div>
    </div>
  );
}

/* ---- Publish gate: disclose gaps, never block ---- */

function PublishGateModal({ open, onClose, onConfirm, tally }) {
  if (!open) return null;
  const gaps = tally.told + tally.notyet;
  const rows = [
    ['checked', 'Checked', tally.checked, 'backed by a valid certificate'],
    ['told', 'Told us', tally.told, 'self-reported, shown as such'],
    ['notyet', 'Not yet', tally.notyet, 'openly marked as missing'],
  ];
  return (
    <TrustModal open={open} onClose={onClose} width={470}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 23, color: 'var(--ink-900)', marginBottom: 6 }}>Publish this passport?</div>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14.5, color: 'var(--ink-700)', lineHeight: 1.55, marginBottom: 18 }}>
        This passport will publish with <strong>{gaps} {gaps === 1 ? 'claim' : 'claims'}</strong> openly marked as unverified — <strong>consumers will see this.</strong>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: 16 }}>
        {rows.map(([state, label, n, note], i) => (
          <div key={state} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', background: 'var(--surface-card)', borderBottom: i < rows.length - 1 ? '1px solid var(--border-hairline)' : 'none' }}>
            <TrMark state={state} size={18} />
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600, color: 'var(--ink-900)', width: 74 }}>{label}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--ink-900)', width: 26, textAlign: 'right' }}>{n}</span>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-500)' }}>{note}</span>
          </div>
        ))}
      </div>
      <div style={{ padding: '13px 15px', border: '1px dashed var(--paper-400)', borderRadius: 'var(--radius-md)', background: 'var(--paper-100)', fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-600)', lineHeight: 1.55, marginBottom: 20 }}>
        ThreadTrace never hides gaps. Unverified claims ship visibly marked, and the honesty score (<strong>{tally.percent}%</strong>) reflects them. Verify them later and the passport updates everywhere — including tags already sewn in.
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <TrButton variant="secondary" fullWidth onClick={onClose}>Keep editing</TrButton>
        <TrButton variant="primary" fullWidth onClick={onConfirm}>Publish openly at {tally.percent}%</TrButton>
      </div>
    </TrustModal>
  );
}

/* ---- Audit trail: per-claim change history ---- */

function AuditModal({ open, onClose, label, entries }) {
  if (!open) return null;
  return (
    <TrustModal open={open} onClose={onClose} width={460}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 2 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 21, color: 'var(--ink-900)' }}>Change history</div>
        <button onClick={onClose} aria-label="Close" style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--ink-400)', fontSize: 22, lineHeight: 1 }}>×</button>
      </div>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13.5, color: 'var(--ink-500)', marginBottom: 18 }}>{label} · every edit is recorded — who, what, when.</div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {entries.map((e, i) => (
          <div key={i} style={{ display: 'flex', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 12, flex: '0 0 auto' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: i === 0 ? 'var(--indigo-500)' : 'var(--paper-400)', marginTop: 5, flex: '0 0 auto' }}></span>
              {i < entries.length - 1 ? <span style={{ flex: 1, borderLeft: '1.5px dashed var(--paper-400)', margin: '3px 0' }}></span> : null}
            </div>
            <div style={{ paddingBottom: i < entries.length - 1 ? 16 : 0 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13.5, fontWeight: 600, color: 'var(--ink-900)' }}>{e.who}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--ink-400)', letterSpacing: '0.03em' }}>{e.when}</span>
              </div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-600)', lineHeight: 1.5, marginTop: 2 }}>{e.what}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 18, fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--ink-300)', letterSpacing: '0.04em' }}>APPEND-ONLY · entries cannot be edited or removed</div>
    </TrustModal>
  );
}

Object.assign(window, { ttFmtYM, PublishGateModal, AuditModal });
