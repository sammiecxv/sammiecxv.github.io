// ThreadTrace — verifiable provenance screen.
// TRUSTLESS: the chain + published public keys are fetched from the API, then
// every hash and Ed25519 signature is re-checked IN THE BROWSER (see
// provenance-client.js) — the phone never trusts the server's verdict. Exposes
// window.ProvenanceVerify. Crypto: server/data/provenance.js.
const { Button: PVButton } = window.ThreadTraceDesignSystem_f6483d;

function pvShort(h) { return h ? h.slice(0, 10) + '…' + h.slice(-6) : ''; }

function PVCheck({ ok }) {
  return (
    <span title={ok ? 'pass' : 'fail'} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 15, height: 15, borderRadius: 4, flex: '0 0 auto',
      background: ok ? 'var(--leaf-600)' : 'var(--madder-500)', color: 'var(--paper-50)' }}>
      {ok
        ? <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2.5 6.3l2.2 2.2L9.5 3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
        : <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M3.5 3.5l5 5M8.5 3.5l-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>}
    </span>
  );
}

function ProvenanceVerify({ slug, onDone, onCancel }) {
  const [state, setState] = React.useState('loading'); // loading | ok | broken | error
  const [data, setData] = React.useState(null);
  const [expanded, setExpanded] = React.useState(false);
  const [tamper, setTamper] = React.useState(null);
  const loaded = React.useRef(null); // { chain, keys } — fetched once

  const run = React.useCallback(async (tamperSeq) => {
    setState('loading');
    try {
      if (!window.TTVerifyClient) throw new Error('client verifier unavailable');
      if (!loaded.current) loaded.current = await window.TTVerifyClient.load(slug);
      const d = await window.TTVerifyClient.verify(loaded.current, tamperSeq);
      setData(d); setState(d.valid ? 'ok' : 'broken');
    } catch (_) { setState('error'); }
  }, [slug]);

  React.useEffect(() => {
    const t = setTimeout(() => run(tamper), 620); // brief "verifying…" beat
    return () => clearTimeout(t);
  }, [run, tamper]);

  const wrap = { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' };
  const scroll = { flex: 1, overflowY: 'auto', padding: '0 18px 16px' };
  const mono = 'var(--font-mono)';

  // ---- loading ----
  if (state === 'loading') {
    return (
      <div style={{ ...wrap, alignItems: 'center', justifyContent: 'center', gap: 18, padding: 24 }}>
        <div className="tt-spin" style={{ width: 44, height: 44, borderRadius: '50%', border: '3px solid var(--paper-300)', borderTopColor: 'var(--indigo-500)' }} />
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink-900)' }}>Verifying provenance…</div>
        <div style={{ fontFamily: mono, fontSize: 11, color: 'var(--ink-400)', letterSpacing: '0.06em', textAlign: 'center', lineHeight: 1.6 }}>
          re-deriving hash chain<br />checking Ed25519 signatures on-device
        </div>
      </div>
    );
  }

  // ---- error (no server / offline) ----
  if (state === 'error') {
    return (
      <div style={{ ...wrap, alignItems: 'center', justifyContent: 'center', gap: 14, padding: 28, textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--ink-900)' }}>Couldn’t reach the verifier</div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13.5, color: 'var(--ink-600)', lineHeight: 1.55, maxWidth: 300 }}>
          The provenance API isn’t responding. Run the server (<span style={{ fontFamily: mono }}>npm start</span>) to verify the signed chain.
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
          <PVButton variant="secondary" onClick={onCancel}>Back</PVButton>
          <PVButton variant="primary" onClick={onDone}>Continue anyway</PVButton>
        </div>
      </div>
    );
  }

  const valid = state === 'ok';
  const accent = valid ? 'var(--leaf-600)' : 'var(--madder-500)';

  return (
    <div style={wrap}>
      {/* verdict banner */}
      <div style={{ padding: '20px 18px 16px', display: 'flex', alignItems: 'flex-start', gap: 13 }}>
        <span style={{ width: 42, height: 42, borderRadius: 12, flex: '0 0 auto', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: accent, color: 'var(--paper-50)' }}>
          {valid
            ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2.5l7.5 3v5.2c0 4.6-3.1 8.4-7.5 9.8-4.4-1.4-7.5-5.2-7.5-9.8V5.5l7.5-3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><path d="M8.5 12l2.4 2.4L15.5 9.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
            : <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2.5l7.5 3v5.2c0 4.6-3.1 8.4-7.5 9.8-4.4-1.4-7.5-5.2-7.5-9.8V5.5l7.5-3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><path d="M12 8v4.5M12 15.6v.2" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" /></svg>}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 21, color: 'var(--ink-900)', lineHeight: 1.15 }}>
            {valid ? 'Provenance verified' : 'Tampering detected'}
          </div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-600)', marginTop: 4, lineHeight: 1.5 }}>
            {valid
              ? <span>All {data.length} events form an unbroken, signed chain of custody.</span>
              : <span>The chain breaks at event #{data.brokenAt + 1} — its content no longer matches its signature.</span>}
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 8, padding: '3px 9px', borderRadius: 999, background: 'var(--surface-raised)', border: '1px solid var(--border-hairline)' }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M6 11V8a6 6 0 0 1 12 0v3" stroke="var(--ink-500)" strokeWidth="1.8" strokeLinecap="round" /><rect x="4.5" y="11" width="15" height="9" rx="2" stroke="var(--ink-500)" strokeWidth="1.8" /></svg>
            <span style={{ fontFamily: mono, fontSize: 10, letterSpacing: '0.03em', color: 'var(--ink-500)' }}>Verified on your device · public keys only</span>
          </div>
        </div>
      </div>

      {/* chain anchor */}
      <div style={{ margin: '0 18px 14px', padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border-hairline)', background: 'var(--surface-raised)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontFamily: mono, fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-400)', flex: '0 0 auto' }}>Tag anchor</span>
        <span style={{ fontFamily: mono, fontSize: 11.5, color: 'var(--ink-800)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pvShort(data.head)}</span>
      </div>

      {/* per-event ledger */}
      <div style={scroll}>
        <button onClick={() => setExpanded((v) => !v)} style={{ display: 'flex', alignItems: 'center', gap: 6, width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', padding: '4px 0 10px', fontFamily: mono, fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-500)' }}>
          Signed chain · {data.length} events
          <span style={{ marginLeft: 'auto', fontFamily: mono, fontSize: 14, color: 'var(--ink-400)' }}>{expanded ? '–' : '+'}</span>
        </button>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {data.events.map((e, i) => {
            const broke = !e.ok;
            return (
              <div key={e.seq} style={{ display: 'flex', gap: 11, paddingBottom: i === data.events.length - 1 ? 0 : 4 }}>
                {/* rail */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '0 0 auto', width: 16 }}>
                  <span style={{ width: 11, height: 11, borderRadius: '50%', background: broke ? 'var(--madder-500)' : accent, flex: '0 0 auto', marginTop: 3 }} />
                  {i < data.events.length - 1 ? <span style={{ flex: 1, width: 2, background: broke ? 'var(--madder-300,var(--madder-400))' : 'var(--paper-300)', minHeight: 18 }} /> : null}
                </div>
                <div style={{ flex: 1, minWidth: 0, paddingBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <span style={{ fontFamily: mono, fontSize: 10, color: 'var(--ink-400)' }}>#{e.seq + 1}</span>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600, color: 'var(--ink-900)' }}>{e.actorRole}</span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--ink-500)', marginTop: 2 }}>
                    signed by <strong style={{ color: 'var(--ink-700)' }}>{e.issuerName}</strong> · {e.actor}
                  </div>
                  {expanded ? (
                    <div style={{ marginTop: 8, padding: '8px 10px', borderRadius: 8, background: 'var(--surface-raised)', border: '1px solid var(--border-hairline)' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 8 }}>
                        {[['content', 'content'], ['linkage', 'link'], ['signature', 'sig']].map(([k, label]) => (
                          <span key={k} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: mono, fontSize: 10.5, color: 'var(--ink-600)' }}>
                            <PVCheck ok={e.checks[k]} />{label}
                          </span>
                        ))}
                      </div>
                      <div style={{ fontFamily: mono, fontSize: 10, color: 'var(--ink-400)', wordBreak: 'break-all', lineHeight: 1.5 }}>{pvShort(e.recordHash)}</div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                      {[['content', 'content'], ['linkage', 'link'], ['signature', 'sig']].map(([k, label]) => (
                        <span key={k} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: mono, fontSize: 10, color: e.checks[k] ? 'var(--ink-500)' : 'var(--madder-600)' }}>
                          <PVCheck ok={e.checks[k]} />{label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* demo control — thesis explainer */}
        <div style={{ marginTop: 8, padding: '11px 12px', borderRadius: 10, border: '1px dashed var(--paper-400)', background: 'var(--paper-100)' }}>
          <div style={{ fontFamily: mono, fontSize: 9.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-400)', marginBottom: 6 }}>Demo · attack simulation</div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-600)', lineHeight: 1.5, marginBottom: 10 }}>
            Silently edit one event’s claim after it was signed — the hash chain detects it and names the broken event.
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {tamper == null
              ? <button onClick={() => setTamper(Math.min(2, data.length - 1))} style={{ minHeight: 34, border: '1px solid var(--madder-400)', background: 'transparent', color: 'var(--madder-600)', cursor: 'pointer', borderRadius: 8, padding: '0 12px', fontFamily: 'var(--font-sans)', fontSize: 12.5, fontWeight: 600 }}>Simulate a tampered event</button>
              : <button onClick={() => setTamper(null)} style={{ minHeight: 34, border: '1px solid var(--paper-400)', background: 'transparent', color: 'var(--ink-700)', cursor: 'pointer', borderRadius: 8, padding: '0 12px', fontFamily: 'var(--font-sans)', fontSize: 12.5, fontWeight: 600 }}>Reset to honest chain</button>}
          </div>
        </div>
      </div>

      {/* footer actions */}
      <div style={{ padding: '12px 18px 20px', borderTop: '1px solid var(--border-hairline)', display: 'flex', gap: 10, flex: '0 0 auto' }}>
        <PVButton variant="secondary" onClick={onCancel}>Scan again</PVButton>
        <div style={{ flex: 1 }}>
          <PVButton variant="primary" fullWidth onClick={onDone}>Open passport</PVButton>
        </div>
      </div>
    </div>
  );
}

window.ProvenanceVerify = ProvenanceVerify;
