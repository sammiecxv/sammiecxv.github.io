// ThreadTrace supplier console — Data Collection tab (batch-scoped intake form).
// 4 sections: composition & inflows, footprint, proof, digital ID anchors.
const { Button: DButton, Badge: DBadge, HonestyMark: DMark } = window.ThreadTraceDesignSystem_f6483d;

function DField({ label, hint, children, span }) {
  return (
    <div style={{ gridColumn: span ? 'span ' + span : undefined }}>
      <label style={{ display: 'flex', alignItems: 'baseline', gap: 8, fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase', color: 'var(--ink-500)', marginBottom: 6 }}>
        {label}{hint ? <span style={{ textTransform: 'none', letterSpacing: 0, fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--ink-300)' }}>{hint}</span> : null}
      </label>
      {children}
    </div>
  );
}

const dInputStyle = { width: '100%', boxSizing: 'border-box', height: 'var(--control-md)', padding: '0 12px', border: '1.5px solid var(--paper-400)', borderRadius: 'var(--radius-md)', background: 'var(--surface-raised)', boxShadow: 'var(--shadow-inset)', fontFamily: 'var(--font-sans)', fontSize: 14.5, color: 'var(--ink-900)' };
const dMonoInput = { ...dInputStyle, fontFamily: 'var(--font-mono)', fontSize: 13.5 };

function DSection({ num, title, sub, children }) {
  return (
    <section style={{ border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-lg)', background: 'var(--surface-card)', padding: '22px 24px', marginBottom: 18 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--madder-500)', letterSpacing: '0.04em' }}>{num}</span>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 21, fontWeight: 500, color: 'var(--ink-900)', margin: 0 }}>{title}</h2>
      </div>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-500)', marginBottom: 18, lineHeight: 1.5 }}>{sub}</div>
      {children}
    </section>
  );
}

/* ---- 1 · composition & inflows ---- */

const FIBER_ROWS = [
  { fiber: 'Certified organic cotton', pct: 60 },
  { fiber: 'Post-consumer recycled wool', pct: 38 },
  { fiber: 'Elastane', pct: 2 },
];
const COMPONENT_ROWS = [
  { part: 'Main fabric', desc: '12oz indigo twill', lot: 'LOT-2261' },
  { part: 'Lining', desc: 'Organic cotton poplin', lot: 'LOT-2274' },
  { part: 'Thread', desc: 'Tex 40 corespun', lot: '' },
  { part: 'Hardware', desc: 'Corozo buttons 18mm', lot: 'LOT-2291' },
];

function FiberBreakdown() {
  const [rows, setRows] = React.useState(FIBER_ROWS);
  const total = rows.reduce((s, r) => s + (Number(r.pct) || 0), 0);
  const ok = total === 100;
  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {rows.map((r, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 110px', gap: 10 }}>
            <input value={r.fiber} onChange={(e) => setRows(rows.map((x, j) => j === i ? { ...x, fiber: e.target.value } : x))} style={dInputStyle} />
            <div style={{ position: 'relative' }}>
              <input value={r.pct} onChange={(e) => setRows(rows.map((x, j) => j === i ? { ...x, pct: e.target.value } : x))} style={{ ...dMonoInput, paddingRight: 28, textAlign: 'right' }} />
              <span style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--ink-400)' }}>%</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
        <button onClick={() => setRows([...rows, { fiber: '', pct: '' }])} style={{ border: 'none', background: 'transparent', padding: 0, cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, color: 'var(--indigo-500)' }}>+ add fiber</button>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: 'var(--font-mono)', fontSize: 12, color: ok ? 'var(--leaf-600)' : 'var(--madder-600)' }}>
          <DMark state={ok ? 'checked' : 'notyet'} size={15} />total {total}%{ok ? '' : ' · must equal 100%'}
        </span>
      </div>
    </div>
  );
}

/* ---- 2 · footprint ---- */

function EnergySources() {
  const [on, setOn] = React.useState({ grid: true, solar: true, wind: false });
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {[['grid', 'Grid'], ['solar', 'Solar'], ['wind', 'Wind']].map(([id, label]) => {
        const active = on[id];
        return (
          <button key={id} onClick={() => setOn({ ...on, [id]: !active })} style={{ flex: 1, height: 'var(--control-md)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7, border: active ? '1.5px solid var(--ink-800)' : '1px solid var(--paper-400)', borderRadius: 'var(--radius-md)', background: active ? 'var(--surface-raised)' : 'transparent', boxShadow: active ? 'var(--shadow-xs)' : 'none', fontFamily: 'var(--font-sans)', fontSize: 13.5, fontWeight: active ? 600 : 500, color: active ? 'var(--ink-900)' : 'var(--ink-500)' }}>
            {active ? <DMark state="checked" size={14} /> : null}{label}
          </button>
        );
      })}
    </div>
  );
}

/* ---- 4 · carrier ---- */

const CARRIERS = [
  { id: 'qr', label: 'QR on care label', note: 'printed satin' },
  { id: 'nfc', label: 'Woven NFC tag', note: 'hem-embedded' },
  { id: 'embroidery', label: 'Scannable embroidery', note: 'stitch-compensated' },
];

function CarrierPicker() {
  const [sel, setSel] = React.useState('embroidery');
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {CARRIERS.map((c) => {
        const active = sel === c.id;
        return (
          <button key={c.id} onClick={() => setSel(c.id)} style={{ flex: 1, minHeight: 56, cursor: 'pointer', textAlign: 'center', padding: '8px 6px', border: `1.5px solid ${active ? 'var(--ink-800)' : 'var(--paper-400)'}`, borderRadius: 'var(--radius-md)', background: active ? 'var(--surface-raised)' : 'transparent', boxShadow: active ? 'var(--shadow-xs)' : 'none' }}>
            <span style={{ display: 'block', fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, color: active ? 'var(--ink-900)' : 'var(--ink-600)', lineHeight: 1.2 }}>{c.label}</span>
            <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 9.5, color: active ? 'var(--madder-500)' : 'var(--ink-400)', marginTop: 3, letterSpacing: '0.04em' }}>{c.note}</span>
          </button>
        );
      })}
    </div>
  );
}

function SerializationLog() {
  const [from, setFrom] = React.useState('TT-0042-00001');
  const [to, setTo] = React.useState('TT-0042-01200');
  const count = (() => {
    const a = Number((from.match(/(\d+)$/) || [])[1]);
    const b = Number((to.match(/(\d+)$/) || [])[1]);
    return Number.isFinite(a) && Number.isFinite(b) && b >= a ? b - a + 1 : null;
  })();
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
      <DField label="First unit ID"><input value={from} onChange={(e) => setFrom(e.target.value)} style={dMonoInput} /></DField>
      <DField label="Last unit ID"><input value={to} onChange={(e) => setTo(e.target.value)} style={dMonoInput} /></DField>
      <div style={{ gridColumn: 'span 2', fontFamily: 'var(--font-mono)', fontSize: 12, color: count ? 'var(--ink-600)' : 'var(--madder-600)' }}>
        {count ? `→ ${count.toLocaleString()} unique passports will be minted for this run` : '⚠ range not readable'}
      </div>
    </div>
  );
}

function UploadStub({ label }) {
  const [file, setFile] = React.useState(null);
  return file ? (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9, height: 'var(--control-md)', padding: '0 12px', border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)' }}>
      <DMark state="checked" size={15} />
      <span style={{ flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: 'var(--font-sans)', fontSize: 13.5, color: 'var(--ink-800)' }}>{file}</span>
      <button onClick={() => setFile(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--ink-400)', fontSize: 14, lineHeight: 1, padding: 0 }}>×</button>
    </div>
  ) : (
    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, height: 'var(--control-md)', border: '1.5px dashed var(--paper-400)', borderRadius: 'var(--radius-md)', background: 'var(--paper-100)', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, color: 'var(--indigo-500)' }}>
      ↑ {label}
      <input type="file" style={{ display: 'none' }} onChange={(e) => setFile((e.target.files[0] && e.target.files[0].name) || 'document.pdf')} />
    </label>
  );
}

/* ---- the view ---- */

function DataCollectionView({ onToast, onManageCerts }) {
  return (
    <div style={{ padding: '28px 32px 44px', maxWidth: 900 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 22 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 500, color: 'var(--ink-900)', margin: 0, lineHeight: 1.1 }}>Data Collection</h1>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--ink-500)', marginTop: 4 }}>Batch 0042 · Indigo Field Jacket · everything this run's passport is built from</div>
        </div>
        <DBadge tone="pending" size="sm">Draft</DBadge>
      </div>

      <DSection num="01" title="Material composition & inflows" sub="Exact fiber percentages plus inbound lot IDs — builds a verifiable chain of custody into Supply Lineage.">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <DField label="Fiber breakdown" hint="must sum to 100%"><FiberBreakdown /></DField>
          <DField label="Components & inbound lots" hint="links to Material Registry">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {COMPONENT_ROWS.map((c) => (
                <div key={c.part} style={{ display: 'grid', gridTemplateColumns: '1fr 105px', gap: 10, alignItems: 'center' }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13.5, fontWeight: 600, color: 'var(--ink-900)' }}>{c.part}</div>
                    <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--ink-500)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.desc}</div>
                  </div>
                  <input defaultValue={c.lot} placeholder="lot / invoice" style={{ ...dMonoInput, height: 36, fontSize: 12 }} />
                </div>
              ))}
            </div>
          </DField>
        </div>
      </DSection>

      <DSection num="02" title="Environmental & operational footprint" sub="Simple per-batch resource inputs — no calculations required, just what this run consumed.">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <DField label="Energy used" hint="kWh, whole run"><input defaultValue="1,840" style={dMonoInput} /></DField>
          <DField label="Energy sources"><EnergySources /></DField>
          <DField label="Water used" hint="litres · dyeing & washing"><input defaultValue="12,400" style={dMonoInput} /></DField>
          <DField label="Pre-consumer waste" hint="% fabric scrap at cutting"><input defaultValue="11" style={dMonoInput} /></DField>
          <DField label="Chemical log" hint="ZDHC / MRSL declaration" span={1}><UploadStub label="Upload ZDHC wastewater log" /></DField>
          <DField label="Dye house recipe" span={1}><input defaultValue="Natural indigo (woad) · vat #7" style={dInputStyle} /></DField>
        </div>
      </DSection>

      <DSection num="03" title="Certification & verifiable proof" sub="Pin evidence to this batch — backs the honesty score and keeps the ledger audit-ready.">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <DField label="Transaction certificate" hint="GOTS / GRS · matches batch volume"><UploadStub label="Upload TC (PDF)" /></DField>
          <DField label="TC batch weight" hint="must match TC"><input defaultValue="412 kg" style={dMonoInput} /></DField>
          <DField label="Higg FEM profile"><input defaultValue="higg.org/facility/PT2019-0331" style={dMonoInput} /></DField>
          <DField label="SLCP / SMETA reference"><input defaultValue="SMETA-4P-2026-118" style={dMonoInput} /></DField>
        </div>
        <div style={{ marginTop: 14, fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-500)' }}>
          Standing certificates live in your <button onClick={onManageCerts} style={{ border: 'none', background: 'transparent', padding: 0, cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, color: 'var(--indigo-500)' }}>Certifications library →</button>
        </div>
      </DSection>

      <DSection num="04" title="Digital ID & traceability anchors" sub="How the physical identifier is applied to each garment, and the ID range minted for this run.">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <DField label="Data carrier"><CarrierPicker /></DField>
          <SerializationLog />
        </div>
      </DSection>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <DButton variant="secondary" onClick={() => onToast('Batch data saved (private draft)')}>Save draft</DButton>
        <DButton variant="primary" onClick={() => onToast('Batch data submitted · feeds Record Authoring')}>Submit batch data</DButton>
      </div>
    </div>
  );
}

window.DataCollectionView = DataCollectionView;
