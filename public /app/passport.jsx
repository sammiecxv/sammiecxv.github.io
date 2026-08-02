(function () {
// ThreadTrace — web consumer passport, Vaayu-style.
// Clean light single column, product-image hero, sticky minimal header with a
// horizontal pill nav, soft rounded cards. Same honesty content as the phone
// app. Exports window.WebPassport.
const { Button, Badge, Input, HonestyMark, HonestyLabel, HonestyRing } = window.ThreadTraceDesignSystem_f6483d;
const { TieredHonestyRing, JargonToggle, HeritageMedia, RepairPartnerList,
        TransferOwnerFlow, RecyclerGate, DisassemblyPanel, VaultTab, AccountSheet, StoryBook, CostPerWear } = window;
let P = window.TT.passport;
function pickPassport(g) { return g && g.passport && window.TT[g.passport] ? window.TT[g.passport] : window.TT.passport; }

const SECTIONS = [
  ['wardrobe', 'Wardrobe'],
  ['overview', 'Overview'],
  ['materials', 'Materials'],
  ['story', 'Story'],
  ['circular', 'Circular'],
  ['vault', 'Vault'],
];

const SWATCH = {
  indigo: 'linear-gradient(150deg,#2D3E6B,#1E2A4A)',
  crocus: 'linear-gradient(150deg,#9B8AC9,#6B5A9E)',
  leaf: 'linear-gradient(150deg,#708A56,#4A5D3A)',
  cotton: 'linear-gradient(150deg,#E8E2D4,#C3B8A1)',
};

const STATE_COLOR = { checked: 'var(--leaf-600)', told: 'var(--ochre-600)', notyet: 'var(--paper-400)' };

const cardBox = { background: 'var(--surface-card)', border: '1px solid var(--border-hairline)', borderRadius: 18 };
const eyebrow = { fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase', color: 'var(--ink-400)' };

function Weave({ radius = 10, opacity = 0.14 }) {
  return <div style={{ position: 'absolute', inset: 0, borderRadius: radius, opacity, pointerEvents: 'none',
    backgroundImage: 'repeating-linear-gradient(45deg,#fff 0 1px,transparent 1px 8px)' }} />;
}

function HonestyPill({ children }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 12px 5px 10px', borderRadius: 'var(--radius-pill)', background: 'var(--surface-card)', border: '1px solid var(--border-hairline)', boxShadow: 'var(--shadow-xs)', fontFamily: 'var(--font-mono)', fontSize: 11.5, letterSpacing: '0.02em', color: 'var(--ink-700)' }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--leaf-600)' }} />{children}
    </span>
  );
}

/* ---------- hero (product image + title, Vaayu style) ---------- */

function ImageHero() {
  return (
    <div>
      <div style={{ position: 'relative', aspectRatio: '1 / 1', borderRadius: 22, overflow: 'hidden', background: SWATCH.crocus, boxShadow: 'var(--shadow-md)' }}>
        <Weave radius={22} opacity={0.1} />
        <image-slot id={'tt-web-hero-' + P.slug} shape="rounded" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} placeholder="Add the garment's product photo"></image-slot>
      </div>
      <div style={{ marginTop: 22 }}>
        <div style={{ ...eyebrow, marginBottom: 8 }}>{P.brand} · {P.season}</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 38, fontWeight: 500, color: 'var(--ink-900)', margin: 0, lineHeight: 1.05, letterSpacing: '-0.02em' }}>{P.name}</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
          <HonestyPill>{P.honestyPercent}% honest</HonestyPill>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--ink-400)' }}>{P.checkedCount} of {P.totalClaims} claims checked</span>
        </div>
        {P.shopUrl ? <a href={P.shopUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 14, fontFamily: 'var(--font-mono)', fontSize: 11.5, letterSpacing: '0.03em', textTransform: 'uppercase', color: 'var(--indigo-600)', textDecoration: 'none' }}>{P.shopLabel || 'View product'}<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3.5 8.5L8.5 3.5M4.5 3.5h4v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg></a> : null}
      </div>
    </div>
  );
}

/* compact page title for non-overview sections */
function MiniTitle() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 14, marginBottom: 22 }}>
      <div>
        <div style={{ ...eyebrow, marginBottom: 5 }}>{P.brand} · {P.season}</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 500, color: 'var(--ink-900)', lineHeight: 1.1 }}>{P.name}</div>
      </div>
      <HonestyPill>{P.honestyPercent}%</HonestyPill>
    </div>
  );
}

/* ---------- reusable pieces ---------- */

function SectionTitle({ children, sub }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 500, color: 'var(--ink-900)', margin: 0 }}>{children}</h2>
      {sub ? <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--ink-500)', marginTop: 4, lineHeight: 1.5, textWrap: 'pretty' }}>{sub}</div> : null}
    </div>
  );
}

function Leader({ label, value, tone }) {
  const color = { verified: 'var(--leaf-600)', told: 'var(--ochre-600)' }[tone] || 'var(--ink-800)';
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, fontFamily: 'var(--font-mono)', fontSize: 12.5, padding: '9px 0', borderTop: '1px solid var(--border-hairline)' }}>
      <span style={{ color: 'var(--ink-500)', whiteSpace: 'nowrap' }}>{label}</span>
      <span style={{ flex: 1 }} />
      <span style={{ color, fontWeight: 500, whiteSpace: 'nowrap' }}>{value}</span>
    </div>
  );
}

function MaterialBar({ m, onOpen, mode }) {
  const sub = mode === 'expert' ? (m.jargon || m.statusLine) : (m.plain || `${m.pct} of the garment`);
  const color = STATE_COLOR[m.state] || 'var(--ink-300)';
  return (
    <button onClick={() => onOpen(m.id)} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '16px 18px', border: '1px solid var(--border-hairline)', borderRadius: 14, background: 'var(--surface-card)', cursor: 'pointer' }}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--paper-400)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-hairline)'}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ flex: 1, fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--ink-900)' }}>{m.name}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--ink-600)' }}>{m.pct}</span>
        <HonestyMark state={m.state} size={20} />
      </div>
      {m.pctNum ? (
        <div style={{ height: 6, borderRadius: 999, background: 'var(--surface-sunken)', margin: '11px 0 9px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${m.pctNum}%`, borderRadius: 999, background: color }} />
        </div>
      ) : <div style={{ height: 11 }} />}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ flex: 1, fontFamily: mode === 'expert' ? 'var(--font-mono)' : 'var(--font-sans)', fontSize: mode === 'expert' ? 12 : 13.5, color: 'var(--ink-500)', lineHeight: 1.45 }}>{sub}</span>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, fontWeight: 600, color: 'var(--indigo-500)', whiteSpace: 'nowrap' }}>Evidence →</span>
      </div>
    </button>
  );
}

function NoteOnTrust() {
  return (
    <div style={{ marginTop: 20, padding: '18px 20px', border: '1px dashed var(--paper-400)', borderRadius: 14, background: 'var(--paper-100)' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--ink-800)', marginBottom: 6 }}>Note on trust</div>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--ink-600)', lineHeight: 1.6 }}>
        The chain proves this record was not changed after it was written. It does not prove the original input was true.
        We show you the sources so you can judge for yourself.
      </div>
    </div>
  );
}

function EvidenceItem({ item }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 16px', border: '1px solid var(--border-hairline)', borderRadius: 14, background: 'var(--surface-card)' }}>
      <div style={{ width: 44, height: 44, borderRadius: 8, background: SWATCH.cotton, flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ color: 'var(--ink-500)' }}><path d="M5 2h7l3 3v13H5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /><path d="M12 2v3h3" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14.5, fontWeight: 600, color: 'var(--ink-900)' }}>{item.title}</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-400)', letterSpacing: '0.04em', marginTop: 1 }}>{item.meta}</div>
      </div>
      <Button variant="secondary" size="sm">View</Button>
    </div>
  );
}

/* ---------- sections ---------- */

function Overview({ onGo }) {
  return (
    <div className="tt-two-col">
      <div style={{ position: 'sticky', top: 8, alignSelf: 'start' }}><ImageHero /></div>
      <div>
      <div style={{ ...cardBox, padding: '22px 22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <HonestyRing percent={P.honestyPercent} size={104} sublabel={null} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ ...eyebrow, marginBottom: 6 }}>Honesty score</div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14.5, color: 'var(--ink-700)', lineHeight: 1.55, textWrap: 'pretty' }}>
              <strong>{P.checkedCount} of {P.totalClaims}</strong> claims are checked independently. The rest are told to us by the brand or not yet on file — every gap shown, never hidden.
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 18, marginTop: 18, paddingTop: 16, borderTop: '1px solid var(--border-hairline)' }}>
          <HonestyLabel state="checked">Checked</HonestyLabel>
          <HonestyLabel state="told">Told us</HonestyLabel>
          <HonestyLabel state="notyet">Not yet</HonestyLabel>
        </div>
      </div>

      <div style={{ ...cardBox, padding: '20px 22px', marginTop: 16 }}>
        <div style={{ ...eyebrow, marginBottom: 4 }}>At a glance</div>
        <Leader label="Batch" value={P.batch} />
        <Leader label="Maker" value={P.maker} tone="told" />
        <Leader label="Materials checked" value="2 of 5" tone="verified" />
        <Leader label="Serial" value={P.serial} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
        <Button variant="primary" fullWidth onClick={() => onGo('materials')}>Explore materials</Button>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="secondary" fullWidth onClick={() => onGo('evidence')}>View all evidence</Button>
          <Button variant="secondary" fullWidth onClick={() => onGo('circular')}>Care &amp; repair</Button>
        </div>
      </div>

      <button onClick={() => onGo('story')} style={{ display: 'block', width: '100%', textAlign: 'left', cursor: 'pointer', ...cardBox, padding: '20px 22px', marginTop: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
          <span style={eyebrow}>Story</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-400)' }}>{P.storyChapters.length} chapters · community</span>
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--ink-900)', lineHeight: 1.2, marginBottom: 6 }}>Where it came from, and who's wearing it now</div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--ink-600)', lineHeight: 1.55, textWrap: 'pretty' }}>{P.storyChapters[0].body}</div>
        <span style={{ display: 'inline-block', marginTop: 12, fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600, color: 'var(--indigo-500)' }}>Read the story &amp; join the discussion →</span>
      </button>
      </div>
    </div>
  );
}

function Materials({ onOpen, mode, onMode }) {
  const [sort, setSort] = React.useState('honesty');
  const order = { checked: 0, told: 1, notyet: 2 };
  const rows = [...P.materials].sort((a, b) => sort === 'honesty' ? order[a.state] - order[b.state] : b.pctNum - a.pctNum);
  return (
    <div>
      <MiniTitle />
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
        <SectionTitle sub="Every component, with how much we know about it.">Materials</SectionTitle>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {onMode ? <JargonToggle value={mode} onChange={onMode} /> : null}
          <button onClick={() => setSort(sort === 'honesty' ? 'composition' : 'honesty')} style={{ border: '1px solid var(--paper-400)', background: 'transparent', cursor: 'pointer', borderRadius: 'var(--radius-pill)', padding: '6px 13px', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-600)', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>Sort: {sort}</button>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {rows.map((m) => <MaterialBar key={m.id} m={m} onOpen={onOpen} mode={mode} />)}
      </div>
      <Button variant="secondary" fullWidth style={{ marginTop: 14 }} onClick={() => onOpen(null)}>View all evidence</Button>
    </div>
  );
}

function Story() {
  const [sub, setSub] = React.useState('story');
  const seg = (id, label) => {
    const on = sub === id;
    return <button key={id} onClick={() => setSub(id)} style={{ border: 'none', cursor: 'pointer', borderRadius: 999, padding: '8px 22px', background: on ? 'var(--surface-card)' : 'transparent', boxShadow: on ? 'var(--shadow-xs)' : 'none', fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: on ? 700 : 500, color: on ? 'var(--ink-900)' : 'var(--ink-500)' }}>{label}</button>;
  };
  return (
    <div>
      <MiniTitle />
      <div style={{ display: 'inline-flex', gap: 4, padding: 3, marginBottom: 24, background: 'var(--surface-sunken)', border: '1px solid var(--border-hairline)', borderRadius: 999 }}>
        {seg('story', 'Story')}
        {P.storyBook ? seg('making', 'The Making') : null}
        {seg('community', 'Community')}
      </div>
      {sub === 'making' ? (
      <React.Fragment>
        <SectionTitle sub="An aesthetic story book — follow this garment from raw fibre down to finished piece, tier by tier.">The Making</SectionTitle>
        <div style={{ marginTop: 4 }}>{StoryBook ? <StoryBook nodes={P.storyBook} /> : null}</div>
      </React.Fragment>
      ) : sub === 'story' ? (
      <React.Fragment>
      <SectionTitle sub="The story side of the passport, kept separate from the verified facts.">Story Book</SectionTitle>
      <div style={{ ...eyebrow, marginBottom: 14 }}>Heritage blueprint · chapters</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 28 }}>
        {P.storyChapters.map((c) => (
          <div key={c.n} style={{ ...cardBox, borderRadius: 14, padding: '16px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: 'var(--tracking-serial)', color: 'var(--madder-500)' }}>{c.n} · {c.place}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--ink-400)' }}>{c.date}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '4px 0 5px' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 19, color: 'var(--ink-900)' }}>{c.title}</div>
              <HonestyMark state={c.state} size={16} />
            </div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13.5, color: 'var(--ink-600)', lineHeight: 1.55 }}>{c.body}</div>
            <HeritageMedia chapter={c} />
          </div>
        ))}
      </div>
      <div style={{ position: 'relative', border: '1px solid var(--ochre-200)', background: 'var(--ochre-100)', borderRadius: 18, padding: '20px 22px', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase', color: 'var(--ochre-600)' }}>Maker narrative</div>
          <HonestyMark state="told" size={18} title="Told us, not checked yet" />
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
          <div style={{ width: 46, height: 46, borderRadius: '50%', background: SWATCH.leaf, flex: '0 0 auto' }} />
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--ink-900)' }}>{P.maker}</div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--ink-500)' }}>{P.makerRole}</div>
          </div>
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 17, lineHeight: 1.55, color: 'var(--ink-800)' }}>“{P.makerNarrative}”</div>
      </div>
      <div style={{ border: '1px dashed var(--paper-400)', borderRadius: 18, padding: '20px 22px' }}>
        <div style={{ ...eyebrow, marginBottom: 14 }}>Community voice</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {P.communityVoices.map((v, i) => (
            <div key={i} style={{ display: 'flex', gap: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', border: '1.5px solid var(--paper-400)', flex: '0 0 auto', marginTop: 2 }} />
              <div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, color: 'var(--ink-700)' }}>{v.author}</div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--ink-600)', lineHeight: 1.5, marginTop: 2 }}>{v.body}</div>
              </div>
            </div>
          ))}
        </div>
        <Button variant="secondary" style={{ marginTop: 18 }}>Add your voice (sign in)</Button>
      </div>
      </React.Fragment>
      ) : (
      <React.Fragment>
        <SectionTitle sub="Talk about this garment — or fashion &amp; sustainability more broadly.">Community</SectionTitle>
        <div style={{ marginTop: 20 }}>
          <Community />
        </div>
      </React.Fragment>
      )}
    </div>
  );
}

function Community() {
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
  const [filter, setFilter] = React.useState('All');
  function submit() {
    if (!body.trim()) return;
    const next = [{ author: name.trim() || 'You', date: 'just now', topic, body: body.trim() }, ...posts];
    setPosts(next); setBody('');
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch (e) {}
  }
  const shown = filter === 'All' ? posts : posts.filter((p) => p.topic === filter);
  const chip = (label, active, onClick) => (
    <button key={label} onClick={onClick} style={{ border: active ? '1px solid var(--ink-900)' : '1px solid var(--border-hairline)', background: active ? 'var(--ink-900)' : 'var(--surface-card)', color: active ? 'var(--paper-50)' : 'var(--ink-600)', cursor: 'pointer', borderRadius: 'var(--radius-pill)', padding: '6px 13px', fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: active ? 600 : 500, whiteSpace: 'nowrap' }}>{label}</button>
  );
  return (
    <div>
      <div style={{ ...cardBox, padding: '16px 18px', marginBottom: 18 }}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" style={{ flex: '0 0 40%', border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', padding: '9px 12px', fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--ink-900)', background: 'var(--surface-page)' }} />
          <select value={topic} onChange={(e) => setTopic(e.target.value)} style={{ flex: 1, border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', padding: '9px 12px', fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--ink-700)', background: 'var(--surface-page)', cursor: 'pointer' }}>
            {TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Share a thought about this garment, its care, or fashion &amp; sustainability…" rows={3} style={{ width: '100%', boxSizing: 'border-box', border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', padding: '10px 12px', fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--ink-900)', background: 'var(--surface-page)', resize: 'vertical', lineHeight: 1.5 }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--ink-400)' }}>Be kind. Posts are public to other keepers.</span>
          <Button variant="primary" onClick={submit}>Post</Button>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {chip('All', filter === 'All', () => setFilter('All'))}
        {TOPICS.map((t) => chip(t, filter === t, () => setFilter(t)))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {shown.map((p, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, ...cardBox, borderRadius: 14, padding: '14px 16px' }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--surface-sunken)', border: '1px solid var(--border-hairline)', flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--ink-600)' }}>{(p.author[0] || '?').toUpperCase()}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13.5, fontWeight: 600, color: 'var(--ink-900)' }}>{p.author}</span>
                {p.topic ? <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.03em', color: TOPIC_TONE[p.topic] || 'var(--ink-400)', border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-pill)', padding: '1px 8px' }}>{p.topic}</span> : null}
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--ink-400)', marginLeft: 'auto' }}>{p.date}</span>
              </div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--ink-600)', lineHeight: 1.55, marginTop: 4, textWrap: 'pretty' }}>{p.body}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Lifecycle() {
  return (
    <div style={{ padding: '4px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {P.lifecycle.map((s, i) => (
          <React.Fragment key={i}>
            <HonestyMark state={s.state === 'checked' ? 'checked' : 'notyet'} size={18} />
            {i < P.lifecycle.length - 1 ? <div style={{ flex: 1, borderTop: `2px dashed ${P.lifecycle[i + 1].state === 'checked' ? 'var(--leaf-400)' : 'var(--paper-400)'}` }} /> : null}
          </React.Fragment>
        ))}
      </div>
      <div style={{ display: 'flex', marginTop: 8 }}>
        {P.lifecycle.map((s, i) => (
          <div key={i} style={{ flex: i < P.lifecycle.length - 1 ? 1 : '0 0 auto' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--ink-500)' }}>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Social() {
  const S = P.social;
  if (!S) return null;
  return (
    <div>
      <SectionTitle sub="Who made this, and under what conditions — what we’ve checked, and what we’ve only been told.">Social Impact</SectionTitle>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13.5, color: 'var(--ink-500)', lineHeight: 1.55, marginBottom: 18, textWrap: 'pretty' }}>{S.note}</div>
      <div style={{ ...cardBox, borderRadius: 14, overflow: 'hidden' }}>
        {S.labor.map((r, i) => (
          <div key={r.id} style={{ display: 'flex', gap: 16, padding: '15px 18px', borderTop: i ? '1px solid var(--border-hairline)' : 'none' }}>
            <div style={{ flex: '0 0 130px', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <HonestyMark state={r.state} size={16} />
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13.5, fontWeight: 600, color: 'var(--ink-800)', lineHeight: 1.3 }}>{r.label}</span>
            </div>
            <span style={{ flex: 1, fontFamily: 'var(--font-sans)', fontSize: 13.5, color: 'var(--ink-600)', lineHeight: 1.55, textWrap: 'pretty' }}>{r.value}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12, padding: '13px 18px', border: '1px dashed var(--paper-400)', borderRadius: 14, background: 'var(--paper-50)' }}>
        <HonestyMark state={S.audit.state} size={16} />
        <span style={{ flex: 1, fontFamily: 'var(--font-sans)', fontSize: 13.5, color: 'var(--ink-600)' }}>Independent social audit</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-700)' }}>{S.audit.body} · grade {S.audit.grade} · {S.audit.date}</span>
      </div>
    </div>
  );
}

function Circular({ onTransfer }) {
  return (
    <div>
      <MiniTitle />
      <SectionTitle sub="What happens next, and how much of it is on file.">Circularity</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 28 }}>
        {P.circularity.map((f) => (
          <div key={f.id} style={{ ...cardBox, borderRadius: 14, padding: '18px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--ink-900)' }}>{f.title}</div>
              <HonestyMark state={f.state} size={20} />
            </div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13.5, color: 'var(--ink-500)', lineHeight: 1.5 }}>{f.sub}</div>
          </div>
        ))}
      </div>
      <div style={{ marginBottom: 28 }}><Social /></div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 19, color: 'var(--ink-900)', marginBottom: 12 }}>Lifecycle &amp; ownership</div>
      <Lifecycle />
    </div>
  );
}

function Evidence({ focus, onBack }) {
  const refs = React.useRef({});
  React.useEffect(() => {
    if (focus && refs.current[focus]) {
      refs.current[focus].animate([{ background: 'var(--indigo-100)' }, { background: 'var(--surface-card)' }], { duration: 1400, easing: 'ease-out' });
    }
  }, [focus]);
  return (
    <div>
      <button onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--ink-500)', fontFamily: 'var(--font-sans)', fontSize: 14, padding: '0 0 14px' }}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M11 4L6 9l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>Materials
      </button>
      <SectionTitle sub={`${P.checkedCount} of ${P.totalClaims} claims checked · sources below`}>Evidence</SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        {P.materials.map((m) => (
          <div key={m.id} ref={(el) => refs.current[m.id] = el} style={{ borderRadius: 14, padding: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <HonestyMark state={m.state} size={24} />
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 19, color: 'var(--ink-900)' }}>{m.name} {m.pct !== '—' ? m.pct : ''}</div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-500)' }}>{m.statusLine}</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 36 }}>
              {m.evidence.length ? m.evidence.map((it, i) => <EvidenceItem key={i} item={it} />) : (
                <div style={{ padding: '14px 16px', border: '1px dashed var(--paper-400)', borderRadius: 14, fontFamily: 'var(--font-sans)', fontSize: 13.5, color: 'var(--ink-400)' }}>
                  No sources on file yet, so it is shown as <strong>Not yet</strong>.
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <NoteOnTrust />
    </div>
  );
}

function AccountIcon({ account, onClick }) {
  return (
    <button onClick={onClick} aria-label={account ? 'Account (signed in)' : 'Sign in'} title={account ? 'Account' : 'Sign in'}
      style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 4, color: account ? 'var(--indigo-500)' : 'var(--ink-500)', display: 'inline-flex', flex: '0 0 auto', position: 'relative' }}>
      <svg width="20" height="20" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="6.2" r="3" stroke="currentColor" strokeWidth="1.4" /><path d="M3.2 15.2c1-2.6 3.2-4 5.8-4s4.8 1.4 5.8 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
      {account ? <span style={{ position: 'absolute', top: 2, right: 1, width: 7, height: 7, borderRadius: '50%', background: 'var(--leaf-600)', border: '1.5px solid var(--surface-card)' }}></span> : null}
    </button>
  );
}

function HelpIcon({ onClick }) {
  return (
    <button onClick={onClick} aria-label="What is a Garment Passport?" title="What is a Garment Passport?"
      style={{ width: 28, height: 28, borderRadius: '50%', border: '1.5px solid var(--paper-400)', background: 'transparent', cursor: 'pointer', color: 'var(--ink-500)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 15, lineHeight: 1, flex: '0 0 auto' }}>?</button>
  );
}

/* ---------- shell ---------- */

function Wardrobe({ onGo, onOpen, activeId }) {
  const items = window.TT.wardrobe || [];
  const active = items.find((x) => x.id === activeId) || items.find((x) => x.current) || items[0];
  return (
    <div>
      <MiniTitle />
      <SectionTitle sub="Every passport you keep, in one place. Open any garment to see its full story.">Your wardrobe</SectionTitle>
      {active && active.retail && CostPerWear ? <div style={{ marginBottom: 18 }}><CostPerWear g={active} /></div> : null}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
        {items.map((g) => {
          const isActive = g.id === activeId;
          return (
          <button key={g.id} onClick={() => onOpen(g)} style={{ display: 'flex', alignItems: 'center', gap: 13, width: '100%', textAlign: 'left', cursor: 'pointer', padding: 12, border: isActive ? '1.5px solid var(--indigo-300)' : '1px solid var(--border-hairline)', borderRadius: 14, background: isActive ? 'var(--indigo-100)' : 'var(--surface-card)' }}
            onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.borderColor = 'var(--paper-400)'; }} onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.borderColor = 'var(--border-hairline)'; }}>
            <div style={{ position: 'relative', width: 56, height: 68, borderRadius: 8, overflow: 'hidden', flex: '0 0 auto', background: `linear-gradient(150deg, ${g.swatch}, color-mix(in oklab, ${g.swatch} 62%, #000))`, boxShadow: 'var(--shadow-sm)' }}>
              <image-slot id={'web-wardrobe-' + g.id} shape="rect" placeholder=" "></image-slot>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ ...eyebrow, color: 'var(--madder-500)' }}>{g.brand}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--ink-900)', lineHeight: 1.15, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5 }}>
                {isActive ? <Badge tone="info">This passport</Badge> : null}
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-400)' }}>Batch {g.batch}</span>
              </div>
            </div>
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none" style={{ color: 'var(--ink-300)', flex: '0 0 auto' }}><path d="M6 4l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          );
        })}
      </div>
    </div>
  );
}

const COL = 560;

function Header({ section, onGo, account, onAccount, onHelp }) {
  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 40, background: 'rgba(250,248,243,0.82)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border-hairline)' }}>
      <div style={{ maxWidth: 980, margin: '0 auto', padding: '13px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <img src={(window.__resources && window.__resources.logoMark) || "../assets/logo-mark.svg"} width="22" height="22" alt="" />
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 500, color: 'var(--ink-900)' }}>ThreadTrace</span>
        <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <HelpIcon onClick={onHelp} />
          <AccountIcon account={account} onClick={onAccount} />
        </span>
      </div>
      <div className="tt-tabrow" style={{ maxWidth: 980, margin: '0 auto', padding: '0 20px 10px', display: 'flex', gap: 8, overflowX: 'auto' }}>
        {SECTIONS.map(([id, label]) => {
          const active = section === id || (id === 'materials' && section === 'evidence');
          return (
            <button key={id} onClick={() => onGo(id)} style={{ border: active ? '1px solid var(--ink-900)' : '1px solid var(--border-hairline)', background: active ? 'var(--ink-900)' : 'var(--surface-card)', color: active ? 'var(--paper-50)' : 'var(--ink-600)', cursor: 'pointer', whiteSpace: 'nowrap',
              padding: '7px 16px', borderRadius: 'var(--radius-pill)', fontFamily: 'var(--font-sans)', fontSize: 13.5, fontWeight: active ? 600 : 500 }}>{label}</button>
          );
        })}
      </div>
    </div>
  );
}

function Footer({ onRecycler }) {
  return (
    <div style={{ maxWidth: COL, margin: '0 auto', padding: '36px 20px 48px', textAlign: 'center' }}>
      <button onClick={onRecycler} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, border: 'none', background: 'transparent', cursor: 'pointer', padding: '6px 2px', fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--ink-400)', letterSpacing: '0.04em' }}>
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><rect x="3.5" y="7" width="9" height="7" rx="1.2" stroke="currentColor" strokeWidth="1.3" /><path d="M5.5 7V4.8a2.5 2.5 0 015 0V7" stroke="currentColor" strokeWidth="1.3" /></svg>
        Recycler access
      </button>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--ink-300)', letterSpacing: '0.04em', lineHeight: 1.7, marginTop: 10 }}>
        {P.serial} · batch {P.batch}<br />Powered by ThreadTrace
      </div>
    </div>
  );
}

function WebPassport() {
  const wardrobe = window.TT.wardrobe || [];
  const currentItem = wardrobe.find((x) => x.current) || wardrobe[0];
  const [activeId, setActiveId] = React.useState(currentItem ? currentItem.id : null);
  const [section, setSection] = React.useState('overview');
  const [focus, setFocus] = React.useState(null);
  const [mode, setMode] = React.useState('plain');
  const [gate, setGate] = React.useState(false);
  const [recyclerMode, setRecyclerMode] = React.useState(false);
  const [transferOpen, setTransferOpen] = React.useState(false);
  const [account, setAccount] = React.useState(() => window.ttLoadAccount());
  const [accountOpen, setAccountOpen] = React.useState(false);
  const [helpOpen, setHelpOpen] = React.useState(false);
  const mainRef = React.useRef(null);

  function go(s) { setSection(s); if (mainRef.current) mainRef.current.scrollTop = 0; }
  function openEvidence(id) { setFocus(id); setSection('evidence'); if (mainRef.current) mainRef.current.scrollTop = 0; }
  function openItem(g) { setActiveId(g.id); setMode('plain'); setSection('overview'); if (mainRef.current) mainRef.current.scrollTop = 0; }

  // Drive every section off the selected wardrobe item's passport.
  const activeItem = wardrobe.find((x) => x.id === activeId) || currentItem;
  P = pickPassport(activeItem);

  if (recyclerMode) {
    return (
      <div className="tt-passport" style={{ display: 'block', background: 'var(--paper-100)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 24px', borderBottom: '1px solid var(--border-hairline)', background: 'var(--surface-card)' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 19, color: 'var(--ink-900)' }}>ThreadTrace</span>
          <button onClick={() => setRecyclerMode(false)} style={{ border: '1px solid var(--paper-400)', background: 'transparent', cursor: 'pointer', borderRadius: 'var(--radius-pill)', padding: '6px 14px', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-600)' }}>Exit recycler mode</button>
        </div>
        <div style={{ maxWidth: COL, margin: '0 auto', padding: '30px 20px 56px' }}>
          <DisassemblyPanel />
        </div>
      </div>
    );
  }

  return (
    <div className="tt-passport" style={{ display: 'block', height: '100%', background: 'var(--paper-100)' }}>
      <main className="tt-main" ref={mainRef} style={{ height: '100%', overflowY: 'auto' }}>
        <Header section={section} onGo={go} account={account} onAccount={() => setAccountOpen(true)} onHelp={() => setHelpOpen(true)} />
        <div style={{ maxWidth: section === 'overview' ? 980 : (section === 'wardrobe' ? 860 : COL), margin: '0 auto', padding: '26px 20px 8px' }}>
          {section === 'wardrobe' ? <Wardrobe onGo={go} onOpen={openItem} activeId={activeId} /> : null}
          {section === 'overview' ? <Overview onGo={go} /> : null}
          {section === 'materials' ? <Materials onOpen={openEvidence} mode={mode} onMode={setMode} /> : null}
          {section === 'story' ? <Story /> : null}
          {section === 'circular' ? <Circular onTransfer={() => setTransferOpen(true)} /> : null}
          {section === 'vault' ? <React.Fragment><MiniTitle /><VaultTab /></React.Fragment> : null}
          {section === 'evidence' ? <Evidence focus={focus} onBack={() => go('materials')} /> : null}
        </div>
        <Footer onRecycler={() => setGate(true)} />
      </main>

      {gate ? (
        <div style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(28,24,20,0.38)' }} onClick={() => setGate(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: 400, maxWidth: '90vw', background: 'var(--surface-raised)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)', padding: '24px 24px' }}>
            <RecyclerGate onUnlock={() => { setGate(false); setRecyclerMode(true); }} onCancel={() => setGate(false)} Button={Button} Input={Input} />
          </div>
        </div>
      ) : null}

      {transferOpen ? (
        <div style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(28,24,20,0.38)' }} onClick={() => setTransferOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: 420, maxWidth: '90vw', background: 'var(--surface-raised)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)', padding: '24px 24px' }}>
            <TransferOwnerFlow onDone={() => setTransferOpen(false)} Button={Button} Input={Input} />
          </div>
        </div>
      ) : null}

      {accountOpen ? (
        <div style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(28,24,20,0.38)' }} onClick={() => setAccountOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: 420, maxWidth: '90vw', background: 'var(--surface-raised)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)', padding: '24px 24px' }}>
            <AccountSheet account={account}
              onSignIn={(a) => { window.ttSaveAccount(a); setAccount(a); setAccountOpen(false); }}
              onSignOut={() => { window.ttSaveAccount(null); setAccount(null); setAccountOpen(false); }} />
          </div>
        </div>
      ) : null}

      {helpOpen ? (
        <div style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(28,24,20,0.38)' }} onClick={() => setHelpOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: 440, maxWidth: '90vw', background: 'var(--surface-raised)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)', padding: '26px 26px' }}>
            <div style={{ marginBottom: 14 }}><Badge tone="info">Garment Passport</Badge></div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--ink-900)', lineHeight: 1.15, marginBottom: 12 }}>A garment's whole story, in one scan.</div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14.5, color: 'var(--ink-700)', lineHeight: 1.6, marginBottom: 18 }}>
              One scan shows what we've <strong>Checked</strong>, what a brand <strong>told us</strong>, and what's <strong>not yet</strong> known. Gaps are shown, never hidden.
            </div>
            <Button variant="primary" fullWidth onClick={() => setHelpOpen(false)}>Got it</Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

window.WebPassport = WebPassport;
})();
