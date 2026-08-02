// ThreadTrace supplier console — extras: Data Requests, Material Registry,
// Facility Profile, Bulk upload / ERP sync. Loaded BEFORE supplier.jsx.
const { Button: XButton, Badge: XBadge, Input: XInput, HonestyMark: XMark } = window.ThreadTraceDesignSystem_f6483d;

function XModal({ open, onClose, width = 480, children }) {
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

function XPageTitle({ title, sub, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 22 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 500, color: 'var(--ink-900)', margin: 0, lineHeight: 1.1, whiteSpace: 'nowrap' }}>{title}</h1>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--ink-500)', marginTop: 4 }}>{sub}</div>
      </div>
      {action || null}
    </div>
  );
}

/* ================= Data Requests ================= */

const DATA_REQUESTS = [
  { id: 'dr1', garment: 'Denim Apron', batch: '0038', from: 'Atelier Nord · brand', asks: ['Fibre origin (Tier 4)', 'Carbon footprint'], due: 'Jul 18', urgency: 'high' },
  { id: 'dr2', garment: 'Indigo Field Jacket', batch: '0042', from: 'Atelier Nord · brand', asks: ['Carbon footprint'], due: 'Jul 24', urgency: 'medium' },
  { id: 'dr3', garment: 'Canvas Tote', batch: '0051', from: 'Nord Retail EU · buyer', asks: ['ZDHC wastewater log', 'REACH declaration'], due: 'Aug 02', urgency: 'low' },
];
const URGENCY = { high: ['attention', 'Due soon'], medium: ['pending', 'Open'], low: ['neutral', 'Open'] };

function DataRequestsView({ onProvide }) {
  return (
    <div style={{ padding: '28px 32px 40px' }}>
      <XPageTitle title="Data Requests" sub="What brands & buyers are waiting on from you — resolves the AWAITING DATA badges." />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 860 }}>
        {DATA_REQUESTS.map((r) => {
          const [tone, label] = URGENCY[r.urgency];
          return (
            <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-lg)', background: 'var(--surface-card)' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--ink-900)' }}>{r.garment}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-400)' }}>Batch {r.batch}</span>
                  <XBadge tone={tone} size="sm">{label}</XBadge>
                </div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-500)', marginTop: 3 }}>{r.from} needs:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                  {r.asks.map((a) => (
                    <span key={a} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 999, background: 'var(--surface-sunken)', border: '1px solid var(--border-hairline)', fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-700)' }}>
                      <XMark state="notyet" size={13} />{a}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ textAlign: 'right', flex: '0 0 auto' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: r.urgency === 'high' ? 'var(--madder-600)' : 'var(--ink-400)', marginBottom: 8 }}>due {r.due}</div>
                <XButton variant="secondary" size="sm" onClick={() => onProvide(r)}>Provide data</XButton>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ================= Material Registry ================= */

const MATERIAL_LOTS = [
  { lot: 'LOT-2261', material: 'Organic cotton yarn 30/1', supplier: 'Fiação Beira · Tier 3', received: 'Jun 22', cert: 'GOTS GT-4471', state: 'checked' },
  { lot: 'LOT-2274', material: 'Post-consumer wool fibre', supplier: 'Re-Lana s.r.l. · Tier 4', received: 'Jun 28', cert: 'GRS GRS-2210', state: 'checked' },
  { lot: 'LOT-2280', material: 'Natural indigo dye (woad)', supplier: 'Woad Works · Tier 3', received: 'Jul 03', cert: '—', state: 'told' },
  { lot: 'LOT-2291', material: 'Corozo buttons 18mm', supplier: 'Botão Sul · Tier 3', received: 'Jul 08', cert: 'FSC FSC-1183', state: 'checked' },
];

function MaterialRegistryView({ onToast }) {
  const [lots, setLots] = React.useState(MATERIAL_LOTS);
  function logInflow() {
    const n = 2291 + lots.length;
    setLots((ls) => [{ lot: 'LOT-' + n, material: 'Organic cotton yarn 30/1', supplier: 'Fiação Beira · Tier 3', received: 'Jul 10', cert: 'GOTS GT-4471', state: 'checked' }, ...ls]);
    onToast('Inflow logged · linked to Supply Lineage');
  }
  return (
    <div style={{ padding: '28px 32px 40px' }}>
      <XPageTitle title="Material Registry" sub="Raw material inflows (bills of materials) — each lot feeds Supply Lineage."
        action={<XButton variant="primary" onClick={logInflow} leadingIcon={<span style={{ fontSize: 16, lineHeight: 1 }}>＋</span>}>Log inflow</XButton>} />
      <div style={{ border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--surface-card)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.8fr 1.5fr 0.8fr 1.1fr 0.9fr', gap: 12, padding: '11px 20px', borderBottom: '1px solid var(--border-hairline)', background: 'var(--surface-sunken)', fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase', color: 'var(--ink-400)' }}>
          <span>Lot</span><span>Material</span><span>Supplier · tier</span><span>Received</span><span>Certificate</span><span>Provenance</span>
        </div>
        {lots.map((l, i) => (
          <div key={l.lot} style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.8fr 1.5fr 0.8fr 1.1fr 0.9fr', gap: 12, alignItems: 'center', padding: '14px 20px', borderBottom: i < lots.length - 1 ? '1px solid var(--border-hairline)' : 'none' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--ink-800)' }}>{l.lot}</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--ink-900)' }}>{l.material}</span>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-600)' }}>{l.supplier}</span>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-500)' }}>{l.received}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: l.cert === '—' ? 'var(--ink-300)' : 'var(--ink-600)' }}>{l.cert}</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-mono)', fontSize: 11, color: l.state === 'checked' ? 'var(--leaf-600)' : 'var(--ink-500)' }}>
              <XMark state={l.state} size={15} />{l.state === 'checked' ? 'Checked' : 'Told us'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= Facility Profile ================= */

const FACILITY_FIELDS = [
  ['Facility name', 'Atelier Nord — Guimarães plant'],
  ['Open Apparel Registry ID', 'OAR ID PT2019-0331'],
  ['Higg FSLM score', '78 / 100 · verified 2026'],
  ['Employees', '142'],
  ['Energy mix', '61% grid · 39% rooftop solar'],
  ['Water recycled', '54% of process water'],
  ['Waste diverted from landfill', '87%'],
  ['Geo coordinates', '41.4425° N, 8.2918° W'],
];
const FACILITY_AUDITS = [
  { name: 'Social compliance audit (SMETA 4-pillar)', date: 'Mar 2026', status: 'valid' },
  { name: 'Wastewater ZDHC ClearStream', date: 'Jan 2026', status: 'valid' },
  { name: 'Fire & building safety', date: 'Sep 2024', status: 'expiring' },
];
const AUDIT_TONE = { valid: ['verified', 'Passed'], expiring: ['attention', 'Renewal due'] };

function FacilityProfileView() {
  return (
    <div style={{ padding: '28px 32px 40px' }}>
      <XPageTitle title="Facility Profile" sub="Facility-level data entered once — applies across every garment you produce." />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 860, marginBottom: 30 }}>
        {FACILITY_FIELDS.map(([label, value]) => (
          <div key={label}>
            <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase', color: 'var(--ink-500)', marginBottom: 6 }}>{label}</label>
            <input defaultValue={value} style={{ width: '100%', boxSizing: 'border-box', height: 'var(--control-md)', padding: '0 12px', border: '1.5px solid var(--paper-400)', borderRadius: 'var(--radius-md)', background: 'var(--surface-raised)', boxShadow: 'var(--shadow-inset)', fontFamily: 'var(--font-sans)', fontSize: 14.5, color: 'var(--ink-900)' }} />
          </div>
        ))}
      </div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 21, fontWeight: 500, color: 'var(--ink-900)', margin: '0 0 12px' }}>Facility audits</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 860 }}>
        {FACILITY_AUDITS.map((a) => {
          const [tone, label] = AUDIT_TONE[a.status];
          return (
            <div key={a.name} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 18px', border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)' }}>
              <span style={{ flex: 1, fontFamily: 'var(--font-sans)', fontSize: 14.5, fontWeight: 600, color: 'var(--ink-900)' }}>{a.name}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-500)' }}>{a.date}</span>
              <XBadge tone={tone} size="sm">{label}</XBadge>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ================= Bulk upload / ERP sync ================= */

const ERP_SYSTEMS = [
  { id: 'apparelmagic', name: 'ApparelMagic', note: 'Styles, BOMs & lot data' },
  { id: 'sap', name: 'SAP S/4HANA', note: 'Production orders & batches' },
  { id: 'odoo', name: 'Odoo MRP', note: 'Manufacturing orders' },
];

function BulkUploadModal({ open, onClose, onToast }) {
  const [tab, setTab] = React.useState('csv');
  const [csv, setCsv] = React.useState(null); // { name, progress, done }
  const [connected, setConnected] = React.useState({});
  const timer = React.useRef(null);
  React.useEffect(() => { if (open) { setTab('csv'); setCsv(null); } return () => clearInterval(timer.current); }, [open]);

  function startCsv(name) {
    setCsv({ name, progress: 0, done: false });
    clearInterval(timer.current);
    timer.current = setInterval(() => setCsv((f) => {
      if (!f) return f;
      const p = Math.min(100, f.progress + 14);
      if (p >= 100) clearInterval(timer.current);
      return { ...f, progress: p, done: p >= 100 };
    }), 130);
  }
  function importRows() { onToast('46 records imported to the ledger · 2 flagged for review'); onClose(); }

  return (
    <XModal open={open} onClose={onClose} width={500}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 4 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 23, color: 'var(--ink-900)' }}>Bulk upload</div>
        <button onClick={onClose} aria-label="Close" style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--ink-400)', fontSize: 22, lineHeight: 1 }}>×</button>
      </div>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13.5, color: 'var(--ink-500)', marginBottom: 16 }}>Load many batches at once — no manual re-entry.</div>

      <div style={{ display: 'flex', gap: 3, padding: 3, background: 'var(--surface-sunken)', border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', marginBottom: 18 }}>
        {[['csv', 'CSV upload'], ['erp', 'ERP sync']].map(([id, label]) => {
          const active = tab === id;
          return <button key={id} onClick={() => setTab(id)} style={{ flex: 1, padding: '7px 0', border: 'none', cursor: 'pointer', borderRadius: 'var(--radius-sm)', background: active ? 'var(--surface-raised)' : 'transparent', boxShadow: active ? 'var(--shadow-xs)' : 'none', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase', color: active ? 'var(--indigo-700)' : 'var(--ink-400)' }}>{label}</button>;
        })}
      </div>

      {tab === 'csv' ? (
        !csv ? (
          <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '32px 20px', border: '1.5px dashed var(--paper-400)', borderRadius: 'var(--radius-md)', background: 'var(--paper-100)', cursor: 'pointer', textAlign: 'center' }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" style={{ color: 'var(--indigo-500)' }}><path d="M12 16V4M7 9l5-5 5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /><path d="M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 600, color: 'var(--ink-800)' }}>Drop a batch CSV</span>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-500)' }}>Template columns: batch, garment, materials, origin, CO₂e</span>
            <input type="file" accept=".csv" style={{ display: 'none' }} onChange={(e) => startCsv((e.target.files[0] && e.target.files[0].name) || 'batches-q3.csv')} />
            <span style={{ marginTop: 6, fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--ink-300)', letterSpacing: '0.04em' }}>MOCKED · picks a sample if none chosen</span>
          </label>
        ) : (
          <div style={{ padding: '18px 20px', border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)' }}>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14.5, fontWeight: 600, color: 'var(--ink-900)', marginBottom: 8 }}>{csv.name}</div>
            <div style={{ height: 6, background: 'var(--paper-200)', borderRadius: 999, overflow: 'hidden' }}>
              <div style={{ width: csv.progress + '%', height: '100%', background: csv.done ? 'var(--leaf-500,var(--leaf-600))' : 'var(--indigo-400)', borderRadius: 999, transition: 'width 130ms linear' }} />
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: csv.done ? 'var(--leaf-600)' : 'var(--ink-400)', marginTop: 8 }}>{csv.done ? '✓ parsed · 48 rows · 46 valid · 2 need review' : 'Parsing rows…'}</div>
            {csv.done ? <div style={{ marginTop: 14 }}><XButton variant="primary" fullWidth onClick={importRows}>Import 46 records</XButton></div> : null}
          </div>
        )
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {ERP_SYSTEMS.map((s) => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14.5, fontWeight: 600, color: 'var(--ink-900)' }}>{s.name}</div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-500)' }}>{s.note}</div>
              </div>
              {connected[s.id]
                ? <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--leaf-600)' }}>✓ Connected · auto-populates ledger</span>
                : <XButton variant="secondary" size="sm" onClick={() => { setConnected((c) => ({ ...c, [s.id]: true })); onToast(s.name + ' connected · ledger will auto-populate'); }}>Connect</XButton>}
            </div>
          ))}
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--ink-300)', letterSpacing: '0.04em', textAlign: 'center', marginTop: 4 }}>MOCKED · connections simulate instantly</div>
        </div>
      )}
    </XModal>
  );
}

Object.assign(window, { DataRequestsView, MaterialRegistryView, FacilityProfileView, BulkUploadModal });
