// app.jsx — Per-instance App shell: routing + theme + phone frame.

function App({ variant, initialMode = 'light', initialRole = 'athlete', initialRoute }) {
  const [mode, setMode] = React.useState(initialMode);
  const [role, setRole] = React.useState(initialRole);
  const [route, setRoute] = React.useState(initialRoute || { name: initialRole === 'trainer' ? 'trainer' : 'home' });
  const [history, setHistory] = React.useState([]);

  const t = resolveTheme(variant, mode);

  const navigate = (next) => {
    setHistory(h => [...h, route]);
    setRoute(next);
  };
  const back = () => {
    setHistory(h => {
      const prev = h[h.length - 1];
      if (prev) setRoute(prev);
      return h.slice(0, -1);
    });
  };

  const ctx = {
    route, setRoute: navigate, back, history,
    mode, setMode, role, setRole,
    variant,
  };

  const showNav = route.name !== 'login' && route.name !== 'workout';
  const showBack = ['plan', 'unit', 'athlete'].includes(route.name);
  const titles = {
    plan: 'Plan', unit: 'Unit', athlete: 'Athlete',
    profile: 'Profile', weight: role === 'trainer' ? 'Trends' : 'Body',
    plans: role === 'trainer' ? 'Library' : 'Plans',
    home: 'Today', trainer: 'Athletes',
  };

  const screen = (() => {
    switch (route.name) {
      case 'login': return <LoginScreen t={t} ctx={ctx}/>;
      case 'home': return <HomeScreen t={t} ctx={ctx}/>;
      case 'plans': return <PlansListScreen t={t} ctx={ctx}/>;
      case 'plan': return <PlanDetailScreen t={t} ctx={ctx}/>;
      case 'unit': return <UnitDetailScreen t={t} ctx={ctx}/>;
      case 'workout': return <WorkoutScreen t={t} ctx={ctx}/>;
      case 'trainer': return <TrainerScreen t={t} ctx={ctx}/>;
      case 'athlete': return <AthleteProfileScreen t={t} ctx={ctx}/>;
      case 'weight': return <WeightScreen t={t} ctx={ctx}/>;
      case 'profile': return <ProfileScreen t={t} ctx={ctx}/>;
      default: return <HomeScreen t={t} ctx={ctx}/>;
    }
  })();

  return (
    <div style={{
      ...themeVars(t),
      width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column',
      background: t.bg, color: t.ink, fontFamily: t.font,
      position: 'relative', overflow: 'hidden',
      fontSize: 14, lineHeight: 1.5,
      letterSpacing: '-0.005em',
    }}>
      <StatusBar t={t}/>
      {showBack && route.name !== 'workout' && (
        <TopBar t={t} title={titles[route.name]} onBack={back}
          trailing={route.name === 'athlete'
            ? <button style={{ ...btnReset, padding: 8, color: t.ink }}><Icon name="settings" size={20}/></button>
            : null
          }/>
      )}
      <div style={{ flex: 1, overflow: 'auto', WebkitOverflowScrolling: 'touch', position: 'relative' }}>
        {screen}
      </div>
      {showNav && <BottomNav t={t} route={route} setRoute={navigate} role={role}/>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Mount helper for the phone artboard
// ─────────────────────────────────────────────────────────────
function mountApp(rootEl, props) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(<App {...props}/>);
  return root;
}

// ─────────────────────────────────────────────────────────────
// Desktop trainer view — wide, web app feel, single direction (uses given variant)
// ─────────────────────────────────────────────────────────────
function DesktopTrainer({ variant = 'garden', mode = 'light' }) {
  const t = resolveTheme(variant, mode);
  const [selected, setSelected] = React.useState(SEED.athletes[0].id);
  const a = SEED.athletes.find(x => x.id === selected);

  return (
    <div style={{
      ...themeVars(t),
      width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column',
      background: t.bg, color: t.ink, fontFamily: t.font, fontSize: 14,
      overflow: 'hidden',
    }}>
      {/* Topbar */}
      <div style={{
        height: 56, display: 'flex', alignItems: 'center',
        padding: '0 22px', borderBottom: '1px solid ' + t.border, gap: 18,
        background: t.surface,
      }}>
        <Logo t={t}/>
        <div style={{ height: 18, width: 1, background: t.border }}/>
        <div style={{ display: 'flex', gap: 18, fontSize: 13, fontWeight: 600 }}>
          {['Athletes', 'Library', 'Trends', 'Settings'].map((n, i) => (
            <span key={n} style={{ color: i === 0 ? t.ink : t.inkMuted, cursor: 'pointer' }}>{n}</span>
          ))}
        </div>
        <div style={{ flex: 1 }}/>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          paddingInline: 12, height: 36, borderRadius: t.radius.sm,
          background: t.surfaceAlt, color: t.inkMuted, fontSize: 13,
          width: 240,
        }}>
          <Icon name="search" size={15}/> Search athletes…
          <span style={{ marginLeft: 'auto', fontFamily: t.fontMono, fontSize: 10, padding: '2px 6px', background: t.surface, borderRadius: 4, border: '1px solid ' + t.border }}>⌘K</span>
        </div>
        <Button t={t} kind="soft" size="sm" icon="invite">Invite</Button>
        <Avatar t={t} initials={SEED.coach.initials} size={32}/>
      </div>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '280px 1fr', minHeight: 0 }}>
        {/* Roster sidebar */}
        <div style={{ borderRight: '1px solid ' + t.border, background: t.surface, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '14px 16px 8px' }}>
            <div style={{ fontSize: 11, color: t.inkMuted, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Roster · {SEED.athletes.length}</div>
          </div>
          <div style={{ flex: 1, overflow: 'auto', padding: '0 8px 12px' }}>
            {SEED.athletes.map(at => {
              const sel = at.id === selected;
              return (
                <button key={at.id} onClick={() => setSelected(at.id)} style={{
                  ...btnReset, width: '100%', textAlign: 'left',
                  padding: '10px 12px', borderRadius: t.radius.sm,
                  background: sel ? t.accentSoft : 'transparent',
                  display: 'flex', alignItems: 'center', gap: 10, marginBottom: 2,
                }}>
                  <Avatar t={t} initials={at.initials} size={32}/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: sel ? t.accentSoftInk : t.ink }}>{at.name}</div>
                    <div style={{ fontSize: 11, color: t.inkMuted, fontFamily: t.fontMono }}>{at.lastSession}</div>
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: at.adherence > 0.7 ? t.accent : t.danger, fontFamily: t.fontMono }}>
                    {Math.round(at.adherence*100)}%
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main detail */}
        <div style={{ overflow: 'auto', padding: '24px 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 24 }}>
            <Avatar t={t} initials={a.initials} size={64} accent/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: t.ink, letterSpacing: '-0.02em' }}>{a.name}</div>
              <div style={{ fontSize: 13, color: t.inkMuted, marginTop: 2, fontFamily: t.fontMono }}>
                {a.plan.toUpperCase()} · LAST SEEN {a.lastSession.toUpperCase()}
              </div>
            </div>
            <Button t={t} kind="ghost" size="sm" icon="note">Message</Button>
            <Button t={t} kind="soft" size="sm" icon="edit">Edit plan</Button>
          </div>

          {/* Stat strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 24 }}>
            {[
              { label: 'Sessions',  v: a.sessions, u: '' },
              { label: 'Adherence', v: Math.round(a.adherence*100), u: '%' },
              { label: 'Streak',    v: a.streak, u: 'd' },
              { label: 'Volume / wk', v: '4 510', u: 'kg' },
            ].map((s,i) => (
              <Card key={i} t={t} style={{ padding: 16 }}>
                <div style={{ fontSize: 10, color: t.inkMuted, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{s.label}</div>
                <BigNum t={t} value={s.v} unit={s.u} size={28}/>
              </Card>
            ))}
          </div>

          {/* Two-column: chart + plan */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18 }}>
            <Card t={t} style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 11, color: t.inkMuted, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Volume · 8 weeks</div>
                  <BigNum t={t} value="36 240" unit="kg" size={28}/>
                </div>
                <Pill t={t} kind="soft">+14.2%</Pill>
              </div>
              <div style={{ marginTop: 18, color: t.accent }}>
                <Sparkline data={[3200, 3800, 3650, 4200, 3900, 4500, 4710, 4800, 5100, 5230]}
                  w={520} h={120} color={t.accent} fill={t.accentSoft} dots/>
              </div>
            </Card>
            <Card t={t} style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: 11, color: t.inkMuted, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Current plan</div>
                <Pill t={t} kind="soft">W{SEED.plans[0].currentWeek}/{SEED.plans[0].weeks}</Pill>
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: t.ink, marginTop: 8 }}>{a.plan}</div>
              <div style={{ marginTop: 14 }}><ProgressBar t={t} value={11/24}/></div>
              <div style={{ fontSize: 12, color: t.inkMuted, marginTop: 8, fontFamily: t.fontMono }}>11 / 24 units complete</div>
              <div style={{ marginTop: 16, display: 'grid', gap: 6 }}>
                {SEED.units.filter(u => u.planId === 'p1').slice(0, 4).map(u => (
                  <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderTop: '1px solid ' + t.border }}>
                    <div style={{ fontFamily: t.fontMono, fontSize: 11, color: t.inkMuted, width: 28 }}>{String(u.position).padStart(2,'0')}</div>
                    <div style={{ flex: 1, fontSize: 13, color: t.ink }}>{u.name}</div>
                    <div style={{ fontSize: 11, color: t.inkMuted, fontFamily: t.fontMono }}>{u.duration}m</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Recent sessions table */}
          <div style={{ marginTop: 24 }}>
            <div style={{ fontSize: 11, color: t.inkMuted, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>Recent sessions</div>
            <Card t={t} padded={false}>
              <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr 120px 100px 60px', padding: '10px 16px', fontSize: 10, fontWeight: 700, color: t.inkMuted, letterSpacing: '0.08em', textTransform: 'uppercase', borderBottom: '1px solid ' + t.border }}>
                <span>Date</span><span>Unit</span><span>Volume</span><span>Duration</span><span>PR</span>
              </div>
              {[
                { d: 'May 13', n: 'Pull A',  v: '4 320 kg', t: '54 min', pr: 1 },
                { d: 'May 11', n: 'Push A',  v: '3 880 kg', t: '48 min', pr: 0 },
                { d: 'May 09', n: 'Legs A',  v: '6 240 kg', t: '67 min', pr: 1 },
                { d: 'May 07', n: 'Pull B',  v: '4 010 kg', t: '52 min', pr: 0 },
                { d: 'May 05', n: 'Push B',  v: '3 720 kg', t: '46 min', pr: 0 },
              ].map((r,i,arr) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '90px 1fr 120px 100px 60px', padding: '12px 16px', fontSize: 13, alignItems: 'center', borderBottom: i < arr.length-1 ? '1px solid ' + t.border : 'none' }}>
                  <span style={{ fontFamily: t.fontMono, color: t.inkMuted }}>{r.d}</span>
                  <span style={{ fontWeight: 600, color: t.ink }}>{r.n}</span>
                  <span style={{ fontFamily: t.fontMono, color: t.ink }}>{r.v}</span>
                  <span style={{ fontFamily: t.fontMono, color: t.inkMuted }}>{r.t}</span>
                  <span>{r.pr ? <Pill t={t} kind="solid">PR</Pill> : null}</span>
                </div>
              ))}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { App, mountApp, DesktopTrainer });
