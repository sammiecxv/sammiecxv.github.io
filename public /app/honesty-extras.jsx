// ThreadTrace — shared feature components for the roadmap expansion:
//   TieredHonestyRing   — 3-tier concentric ring (Brand claims / Supply chain proof / Third-party audit)
//   JargonToggle        — "Everyday summary" vs "Audit trail (expert)" switcher
//   HeritageMedia        — geo / step imagery / audio placeholders for Story chapters
//   RepairPartnerList    — static nearby repair partners
//   TransferOwnerFlow    — simple ownership hand-off stepper
//   RecyclerGate         — PIN-gated entry into Recycler mode
//   DisassemblyPanel     — recycler-only fibre/dye/stitch teardown data
// Loaded as a sibling script; exports everything to window so consumer.jsx / passport.jsx can use it.

function TieredHonestyRing({ size = 190, sublabel = null }) {
  const tiers = window.TT.computeTiers();
  const order = [tiers.tier3, tiers.tier2, tiers.tier1]; // innermost first (hardest to reach)
  const stroke = Math.max(8, Math.round(size * 0.052));
  const gap = Math.round(stroke * 0.6);
  const [animated, setAnimated] = React.useState(false);
  React.useEffect(() => { const id = requestAnimationFrame(() => setAnimated(true)); return () => cancelAnimationFrame(id); }, []);

  const rings = order.map((t, i) => {
    const r = (size / 2) - stroke / 2 - i * (stroke + gap);
    const c = 2 * Math.PI * r;
    const pct = animated ? t.pct : 0;
    const off = c * (1 - Math.max(0, Math.min(100, pct)) / 100);
    return { ...t, r, c, off };
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block', transform: 'rotate(-90deg)' }}>
          {rings.map((t, i) => (
            <circle key={'track' + i} cx={size / 2} cy={size / 2} r={t.r} fill="none" stroke="var(--paper-300)" strokeWidth={stroke} />
          ))}
          {rings.map((t, i) => (
            <circle key={'fill' + i} cx={size / 2} cy={size / 2} r={t.r} fill="none" stroke={t.color} strokeWidth={stroke}
              strokeLinecap="round" strokeDasharray={t.c} strokeDashoffset={t.off}
              style={{ transition: `stroke-dashoffset 900ms var(--ease-out) ${i * 120}ms` }} />
          ))}
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500, letterSpacing: '-0.02em', color: 'var(--ink-900)', fontSize: size * 0.2, lineHeight: 1 }}>{tiers.tier3.pct}%</span>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: size * 0.072, color: 'var(--ink-500)', marginTop: size * 0.02 }}>audited</span>
          {sublabel ? <span style={{ fontFamily: 'var(--font-mono)', fontSize: size * 0.062, color: 'var(--ink-400)', letterSpacing: 'var(--tracking-serial)', marginTop: 2 }}>{sublabel}</span> : null}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%', maxWidth: size + 60 }}>
        {[tiers.tier1, tiers.tier2, tiers.tier3].map((t, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-700)' }}>
            <span style={{ width: 9, height: 9, borderRadius: '50%', background: t.color, flex: '0 0 auto' }} />
            <span style={{ flex: 1 }}>{t.label}</span>
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink-400)' }}>{t.count}/{t.total} · {t.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function JargonToggle({ value, onChange, style = {} }) {
  const opts = [['plain', 'Everyday summary'], ['expert', 'Audit trail (expert)']];
  return (
    <div style={{ display: 'inline-flex', gap: 3, padding: 3, background: 'var(--surface-sunken)',
      border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', ...style }}>
      {opts.map(([id, label]) => {
        const active = value === id;
        return (
          <button key={id} onClick={() => onChange(id)} style={{ padding: '6px 13px', border: 'none', cursor: 'pointer',
            borderRadius: 'var(--radius-sm)', background: active ? 'var(--surface-raised)' : 'transparent',
            boxShadow: active ? 'var(--shadow-xs)' : 'none', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500,
            letterSpacing: '0.03em', color: active ? 'var(--indigo-700)' : 'var(--ink-400)', whiteSpace: 'nowrap' }}>{label}</button>
        );
      })}
    </div>
  );
}

function HeritageMedia({ chapter }) {
  if (!chapter.geo && !chapter.photos && !chapter.audio) {
    return (
      <div style={{ marginTop: 8, padding: '10px 12px', border: '1px dashed var(--paper-400)', borderRadius: 'var(--radius-sm)',
        fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--ink-400)' }}>No blueprint media on file yet.</div>
    );
  }
  return (
    <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {chapter.geo ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-500)' }}>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{ color: 'var(--madder-500)', flex: '0 0 auto' }}><path d="M8 1.5c-2.6 0-4.6 2-4.6 4.5C3.4 9.5 8 14.5 8 14.5S12.6 9.5 12.6 6C12.6 3.5 10.6 1.5 8 1.5z" stroke="currentColor" strokeWidth="1.3" /><circle cx="8" cy="6" r="1.7" stroke="currentColor" strokeWidth="1.3" /></svg>
          {chapter.geo}
        </div>
      ) : null}
      {chapter.photos ? (
        <div style={{ display: 'flex', gap: 6 }}>
          {Array.from({ length: Math.min(chapter.photos, 5) }).map((_, i) => (
            <div key={i} style={{ width: 44, height: 44, borderRadius: 5, flex: '0 0 auto', background: 'repeating-linear-gradient(45deg,var(--paper-300) 0 6px,var(--paper-200) 6px 12px)' }} />
          ))}
          {chapter.photos > 5 ? <div style={{ display: 'flex', alignItems: 'center', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-400)' }}>+{chapter.photos - 5}</div> : null}
        </div>
      ) : null}
      {chapter.audio ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-sm)', background: 'var(--surface-card)' }}>
          <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--indigo-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 1l7 4-7 4V1z" fill="var(--paper-50)" /></svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-700)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{chapter.audio.title}</div>
            <div style={{ display: 'flex', gap: 1.5, marginTop: 3, height: 12, alignItems: 'flex-end' }}>
              {Array.from({ length: 22 }).map((_, i) => (
                <span key={i} style={{ width: 2, height: 4 + ((i * 37) % 10), background: 'var(--paper-300)', borderRadius: 1 }} />
              ))}
            </div>
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--ink-400)' }}>{chapter.audio.duration}</span>
        </div>
      ) : null}
    </div>
  );
}

function RepairPartnerList({ partners }) {
  const list = partners || window.TT.repairPartners;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {list.map((p, i) => (
        <div key={i} style={{ display: 'flex', gap: 12, padding: '13px 14px', border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 15.5, color: 'var(--ink-900)' }}>{p.name}</div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-500)', marginTop: 2 }}>{p.type}</div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--ink-400)', marginTop: 3 }}>{p.address} · {p.hours}</div>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--indigo-700)', whiteSpace: 'nowrap', flex: '0 0 auto' }}>{p.distance}</div>
        </div>
      ))}
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--ink-400)', letterSpacing: '0.03em', marginTop: 2 }}>Sorted by distance from your location in London.</div>
    </div>
  );
}

function TransferOwnerFlow({ onDone, Button, Input }) {
  const [step, setStep] = React.useState('form');
  const [email, setEmail] = React.useState('');
  const code = 'TT-XFER-' + Math.random().toString(36).slice(2, 6).toUpperCase();

  if (step === 'done') {
    return (
      <div>
        <div style={{ marginBottom: 12, fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--leaf-600)' }}>Transfer complete</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 21, color: 'var(--ink-900)', marginBottom: 8 }}>Passport handed off</div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--ink-600)', lineHeight: 1.6, marginBottom: 16 }}>
          The record now lists <strong>{email || 'the new owner'}</strong> as the current keeper. The chain of keeping updates automatically.
          Your ownership window is closed and stamped, and the next owner's begins.
        </div>
        <Button variant="primary" fullWidth onClick={onDone}>Done</Button>
      </div>
    );
  }
  if (step === 'confirm') {
    return (
      <div>
        <div style={{ marginBottom: 12, fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-400)' }}>Confirm hand-off</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 21, color: 'var(--ink-900)', marginBottom: 8 }}>Transfer to {email || 'new owner'}?</div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--ink-600)', lineHeight: 1.6, marginBottom: 12 }}>
          This moves the passport's current owner record. Nothing else changes. The garment's evidence and story stay exactly as they are.
        </div>
        <div style={{ padding: '10px 12px', background: 'var(--surface-sunken)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--ink-500)', marginBottom: 16 }}>Transfer ref {code}</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="secondary" fullWidth onClick={() => setStep('form')}>Back</Button>
          <Button variant="primary" fullWidth onClick={() => setStep('done')}>Confirm transfer</Button>
        </div>
      </div>
    );
  }
  return (
    <div>
      <div style={{ marginBottom: 12, fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-400)' }}>Ownership hand-off</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 21, color: 'var(--ink-900)', marginBottom: 8 }}>Transfer to a new owner</div>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--ink-600)', lineHeight: 1.6, marginBottom: 16 }}>
        Selling or gifting the garment? Hand the passport on so the next owner gets its full history, care and repairs included.
      </div>
      <Input label="New owner's email" placeholder="them@example.com" value={email} onChange={(e) => setEmail(e.target.value)} style={{ marginBottom: 16 }} />
      <Button variant="primary" fullWidth disabled={!email.includes('@')} onClick={() => setStep('confirm')}>Continue</Button>
    </div>
  );
}

function RecyclerGate({ onUnlock, onCancel, Button, Input }) {
  const [pin, setPin] = React.useState('');
  const [error, setError] = React.useState(false);
  function submit() {
    if (pin === window.TT.recyclerPin) { onUnlock(); setPin(''); setError(false); }
    else setError(true);
  }
  return (
    <div>
      <div style={{ marginBottom: 12, fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-400)' }}>Authorised facility access</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 21, color: 'var(--ink-900)', marginBottom: 8 }}>Recycler mode</div>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--ink-600)', lineHeight: 1.6, marginBottom: 16 }}>
        Sorting scanners and authorised recyclers can ask the passport for a machine readable take-apart guide:
        fibre weights, dye chemistry and stitch removal steps, with no storytelling. Enter your facility PIN to continue.
      </div>
      <Input label="Facility PIN" mono placeholder="····" value={pin} onChange={(e) => { setPin(e.target.value); setError(false); }} style={{ marginBottom: 6 }} />
      {error ? <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--madder-600)', marginBottom: 10 }}>Incorrect PIN. (Demo PIN: {window.TT.recyclerPin})</div> : <div style={{ marginBottom: 10 }} />}
      <div style={{ display: 'flex', gap: 10 }}>
        <Button variant="secondary" fullWidth onClick={onCancel}>Cancel</Button>
        <Button variant="primary" fullWidth onClick={submit}>Unlock</Button>
      </div>
    </div>
  );
}

function DisassemblyPanel({ compact = false }) {
  const d = window.TT.disassembly;
  const label = (t) => (
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-400)', margin: '18px 0 8px' }}>{t}</div>
  );
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'var(--ink-900)', borderRadius: 'var(--radius-md)', marginBottom: 4 }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: 'var(--leaf-200)' }}><path d="M8 1l6 2.7v4c0 3.6-2.6 6-6 7.3-3.4-1.3-6-3.7-6-7.3v-4L8 1z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--paper-50)' }}>Recycler mode · machine readable blueprint</span>
      </div>

      {label('Fibre weight matrix')}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {d.fiberMatrix.map((f, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-sm)', background: 'var(--surface-card)', fontFamily: 'var(--font-mono)', fontSize: compact ? 11 : 12.5 }}>
            <span style={{ flex: 1, color: 'var(--ink-800)' }}>{f.material}</span>
            <span style={{ color: 'var(--ink-500)', width: 68, textAlign: 'right' }}>{f.weightG}g</span>
            <span style={{ color: 'var(--ink-400)', width: 54, textAlign: 'right' }}>{f.pctByWeight}</span>
            <span style={{ color: 'var(--indigo-700)', flex: '1 1 auto', textAlign: 'right', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.recoveryPath}</span>
          </div>
        ))}
      </div>

      {label('Dye chemistry composition')}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {d.dyeComposition.map((c, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-sm)', background: 'var(--surface-card)', fontFamily: 'var(--font-mono)', fontSize: compact ? 11 : 12.5 }}>
            <span style={{ flex: 1, color: 'var(--ink-800)' }}>{c.compound}</span>
            <span style={{ color: 'var(--ink-500)', width: 54, textAlign: 'right' }}>{c.pctConcentration}</span>
            <span style={{ color: 'var(--ink-400)', flex: '0 0 auto', textAlign: 'right' }}>{c.hazard}</span>
          </div>
        ))}
      </div>

      {label('Stitch removal steps')}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {d.stitchPath.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-sm)', background: 'var(--surface-card)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--madder-500)', flex: '0 0 auto' }}>{s.step}</span>
            <span style={{ flex: 1, fontFamily: 'var(--font-sans)', fontSize: compact ? 12 : 13, color: 'var(--ink-800)' }}>{s.action}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--ink-400)' }}>{s.tool} · {s.location}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TransparencyInsights({ initialOpen = { index: true, materials: true } }) {
  const I = window.TT.insights;
  const [open, setOpen] = React.useState(initialOpen);
  const toggle = (id) => setOpen((o) => ({ ...o, [id]: !o[id] }));

  const secHead = (id, title) => (
    <button onClick={() => toggle(id)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%',
      padding: '13px 2px', border: 'none', borderBottom: '1px solid var(--border-hairline)', background: 'transparent', cursor: 'pointer', textAlign: 'left' }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-800)' }}>{title}</span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 15, color: 'var(--ink-400)', lineHeight: 1 }}>{open[id] ? '–' : '+'}</span>
    </button>
  );

  return (
    <div>
      {secHead('index', 'Sustainability index')}
      {open.index ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'var(--border-hairline)', border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', overflow: 'hidden', margin: '14px 0 6px' }}>
          {I.stats.map((s, i) => (
            <div key={i} style={{ background: 'var(--surface-card)', padding: '16px 14px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 27, fontWeight: 500, letterSpacing: '-0.02em', color: 'var(--ink-900)', lineHeight: 1 }}>{s.value}</span>
                <HonestyMark state={s.state} size={16} />
              </div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-600)', lineHeight: 1.5 }}>{s.text}</div>
            </div>
          ))}
        </div>
      ) : null}
      {open.index ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', margin: '10px 0 4px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-400)' }}>Materials certified by</span>
          {I.certifiedBy.map((c) => (
            <span key={c} style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, fontWeight: 600, letterSpacing: '0.05em', color: 'var(--ink-700)', border: '1px solid var(--paper-400)', borderRadius: 'var(--radius-pill)', padding: '4px 10px' }}>{c}</span>
          ))}
        </div>
      ) : null}

      <div style={{ height: 10 }}></div>
      {I.details.map((d) => (
        <div key={d.id}>
          {secHead(d.id, d.title)}
          {open[d.id] ? (
            <div style={{ padding: '12px 2px 6px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {d.body.map((line, i) => (
                <div key={i} style={{ display: 'flex', gap: 9, fontFamily: 'var(--font-sans)', fontSize: 13.5, color: 'var(--ink-600)', lineHeight: 1.55 }}>
                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--madder-500)', flex: '0 0 auto', marginTop: 8 }} />
                  <span>{line}</span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

Object.assign(window, {
  TieredHonestyRing, JargonToggle, HeritageMedia, RepairPartnerList,
  TransferOwnerFlow, RecyclerGate, DisassemblyPanel, TransparencyInsights,
});
