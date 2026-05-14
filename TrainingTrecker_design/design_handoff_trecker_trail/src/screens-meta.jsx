// screens-meta.jsx — Login, Profile, Trainer dashboard, Athlete profile, Weight.

// ─────────────────────────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────────────────────────
function LoginScreen({ t, ctx }) {
  const [role, setRole] = React.useState('athlete');
  const [mode, setMode] = React.useState('signin');
  const [email, setEmail] = React.useState('maya@example.com');
  const [pwd, setPwd] = React.useState('••••••••');

  const submit = () => {
    ctx.setRole(role);
    ctx.setRoute({ name: role === 'trainer' ? 'trainer' : 'home' });
  };

  // TRAIL — dark hero panel up top
  if (t.variant === 'trail') {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{
          background: t.hero, color: t.heroInk, padding: '32px 24px 80px',
          position: 'relative', overflow: 'hidden',
          borderBottomLeftRadius: 40, borderBottomRightRadius: 40,
        }}>
          <div style={{ position: 'absolute', top: -80, right: -60, width: 280, height: 280,
            borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(74,222,128,0.4), transparent)' }}/>
          <div style={{ position: 'relative' }}>
            <Logo t={t} dark/>
            <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', marginTop: 32, lineHeight: 1.15 }}>
              Train.<br/>Log.<br/>Repeat.
            </div>
            <div style={{ fontSize: 13, color: 'rgba(236,253,245,0.7)', marginTop: 10, maxWidth: 240 }}>
              The training journal for coaches and athletes who care about the numbers.
            </div>
          </div>
        </div>
        <div style={{ flex: 1, padding: '0 24px 24px', marginTop: -60, position: 'relative' }}>
          <Card t={t} raised style={{ padding: 22 }}>
            <RoleToggle t={t} value={role} onChange={setRole}/>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
              <Input t={t} value={email} onChange={setEmail} placeholder="Email" type="email"/>
              <Input t={t} value={pwd} onChange={setPwd} placeholder="Password" type="password"/>
              <Button t={t} full size="lg" onClick={submit}>{mode === 'signin' ? 'Sign in' : 'Create account'}</Button>
              <button onClick={() => setMode(m => m === 'signin' ? 'signup' : 'signin')}
                style={{ ...btnReset, color: t.inkMuted, fontSize: 13, marginTop: 4 }}>
                {mode === 'signin' ? 'New here? Create an account' : 'Have an account? Sign in'}
              </button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // GARDEN / FIELD — centered card
  const sharp = t.variant === 'field';
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column',
      justifyContent: 'center', padding: '0 24px', background: t.bg }}>
      <div style={{ textAlign: sharp ? 'left' : 'center', marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: sharp ? 'flex-start' : 'center' }}>
          <Logo t={t}/>
        </div>
        <div style={{ fontSize: 24, fontWeight: 700, color: t.ink, marginTop: 16, letterSpacing: '-0.02em' }}>
          {mode === 'signin' ? 'Welcome back' : 'Create account'}
        </div>
        <div style={{ fontSize: 13, color: t.inkMuted, marginTop: 4 }}>
          {mode === 'signin' ? 'Pick up where you left off.' : 'Start logging in under a minute.'}
        </div>
      </div>
      <Card t={t} style={{ padding: sharp ? 18 : 22 }}>
        <RoleToggle t={t} value={role} onChange={setRole}/>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
          <Input t={t} value={email} onChange={setEmail} placeholder="Email" type="email"/>
          <Input t={t} value={pwd} onChange={setPwd} placeholder="Password" type="password"/>
          <Button t={t} full size="lg" onClick={submit}>{mode === 'signin' ? 'Sign in' : 'Create account'}</Button>
        </div>
      </Card>
      <button onClick={() => setMode(m => m === 'signin' ? 'signup' : 'signin')}
        style={{ ...btnReset, color: t.inkMuted, fontSize: 13, marginTop: 16, alignSelf: 'center' }}>
        {mode === 'signin' ? 'New here? Create an account' : 'Have an account? Sign in'}
      </button>
    </div>
  );
}

function Logo({ t, dark = false }) {
  const fg = dark ? t.heroAccent : t.accent;
  const ink = dark ? t.heroInk : t.ink;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <div style={{
        width: 32, height: 32, borderRadius: 9, background: fg,
        display: 'grid', placeItems: 'center', color: dark ? '#062014' : '#fff',
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
          <path d="M6 12h12M9 7v10M15 7v10M4 10v4M20 10v4"/>
        </svg>
      </div>
      <div style={{ fontSize: 17, fontWeight: 800, color: ink, letterSpacing: '-0.01em' }}>
        Trecker
      </div>
    </div>
  );
}

function RoleToggle({ t, value, onChange }) {
  const sharp = t.variant === 'field';
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4,
      padding: 4, background: t.surfaceAlt, borderRadius: sharp ? t.radius.sm : 999,
    }}>
      {[
        { id: 'athlete', label: 'Athlete' },
        { id: 'trainer', label: 'Coach' },
      ].map(r => (
        <button key={r.id} onClick={() => onChange(r.id)} style={{
          ...btnReset, height: 36, borderRadius: sharp ? t.radius.sm - 2 : 999,
          background: value === r.id ? t.surface : 'transparent',
          color: value === r.id ? t.ink : t.inkMuted,
          fontSize: 13, fontWeight: 600,
          boxShadow: value === r.id ? t.shadow : 'none',
          transition: 'all 0.18s',
        }}>{r.label}</button>
      ))}
    </div>
  );
}

function Input({ t, value, onChange, placeholder, type = 'text' }) {
  return (
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{
      width: '100%', height: 44, borderRadius: t.variant === 'field' ? t.radius.sm : t.radius.md,
      background: t.surfaceAlt, border: '1px solid ' + t.border,
      color: t.ink, fontFamily: t.font, fontSize: 14, fontWeight: 500,
      padding: '0 14px', outline: 'none',
    }}/>
  );
}

// ─────────────────────────────────────────────────────────────
// PROFILE
// ─────────────────────────────────────────────────────────────
function ProfileScreen({ t, ctx }) {
  const u = ctx.role === 'trainer' ? SEED.coach : SEED.user;
  return (
    <div style={{ padding: '0 16px 120px' }}>
      <div style={{ padding: '6px 4px 16px' }}>
        <div style={{ fontSize: 26, fontWeight: 700, color: t.ink, letterSpacing: '-0.02em' }}>Profile</div>
      </div>
      <Card t={t} style={{ padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Avatar t={t} initials={u.initials} size={56} accent/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: t.ink }}>{u.name}</div>
            <div style={{ fontSize: 13, color: t.inkMuted, fontFamily: t.fontMono }}>{u.handle}</div>
          </div>
          <button style={{ ...btnReset, padding: 8, color: t.inkMuted }}><Icon name="edit" size={20}/></button>
        </div>
        {ctx.role === 'athlete' && (
          <div style={{ display: 'flex', gap: 24, marginTop: 16, paddingTop: 16, borderTop: '1px solid ' + t.border }}>
            <div><div style={{ fontSize: 11, color: t.inkMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Weight</div><BigNum t={t} value={SEED.user.bodyweight} unit="kg" size={20}/></div>
            <div><div style={{ fontSize: 11, color: t.inkMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Height</div><BigNum t={t} value={SEED.user.height} unit="cm" size={20}/></div>
            <div><div style={{ fontSize: 11, color: t.inkMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Joined</div><BigNum t={t} value={SEED.user.joined} size={14} mono={false}/></div>
          </div>
        )}
      </Card>

      <SectionLabel t={t}>Appearance</SectionLabel>
      <Card t={t} padded={false}>
        <SettingRow t={t} icon="moon" label="Dark mode" trailing={
          <Switch t={t} on={ctx.mode === 'dark'} onChange={v => ctx.setMode(v ? 'dark' : 'light')}/>
        }/>
        <SettingRow t={t} icon="bell" label="Notifications" trailing={<Switch t={t} on={true}/>} last/>
      </Card>

      <SectionLabel t={t}>Account</SectionLabel>
      <Card t={t} padded={false}>
        <SettingRow t={t} icon="user" label={ctx.role === 'trainer' ? 'Your athletes' : 'Your coach'} value={ctx.role === 'trainer' ? `${SEED.athletes.length} active` : SEED.coach.name}/>
        <SettingRow t={t} icon="target" label="Goals" value="2 active"/>
        <SettingRow t={t} icon="download" label="Export data"/>
        <SettingRow t={t} icon="settings" label="Settings" last/>
      </Card>

      <div style={{ marginTop: 18 }}>
        <Button t={t} kind="danger" full onClick={() => ctx.setRoute({ name: 'login' })}>Sign out</Button>
      </div>
    </div>
  );
}

function SettingRow({ t, icon, label, value, trailing, last, onClick }) {
  return (
    <div onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '14px 16px',
      borderBottom: last ? 'none' : '1px solid ' + t.border,
      cursor: onClick ? 'pointer' : 'default',
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 9,
        background: t.surfaceAlt, color: t.ink,
        display: 'grid', placeItems: 'center', flexShrink: 0,
      }}><Icon name={icon} size={16}/></div>
      <div style={{ flex: 1, fontSize: 14, fontWeight: 500, color: t.ink }}>{label}</div>
      {value && <div style={{ fontSize: 13, color: t.inkMuted }}>{value}</div>}
      {trailing}
      {!trailing && <Icon name="chevR" size={16}/>}
    </div>
  );
}

function Switch({ t, on, onChange }) {
  return (
    <button onClick={() => onChange && onChange(!on)} style={{
      ...btnReset, width: 40, height: 24, borderRadius: 999,
      background: on ? t.accent : t.surfaceAlt,
      border: '1px solid ' + t.border, position: 'relative',
      transition: 'background 0.2s',
    }}>
      <div style={{
        position: 'absolute', top: 2, left: on ? 18 : 2,
        width: 18, height: 18, borderRadius: '50%',
        background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        transition: 'left 0.2s',
      }}/>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// TRAINER DASHBOARD
// ─────────────────────────────────────────────────────────────
function TrainerScreen({ t, ctx }) {
  const active = SEED.athletes.filter(a => a.status === 'active');
  return (
    <div style={{ padding: '0 16px 120px' }}>
      <div style={{ padding: '6px 4px 16px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 26, fontWeight: 700, color: t.ink, letterSpacing: '-0.02em' }}>Athletes</div>
          <div style={{ fontSize: 13, color: t.inkMuted, marginTop: 2 }}>{active.length} active · {SEED.athletes.length - active.length} idle</div>
        </div>
        <Button t={t} kind="soft" icon="invite" size="sm">Invite</Button>
      </div>

      {/* Trail: hero summary */}
      {t.variant === 'trail' && (
        <div style={{ background: t.hero, color: t.heroInk, borderRadius: t.radius.lg, padding: 18, boxShadow: t.glow, border: '1px solid ' + t.heroBorder, marginBottom: 14, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -50, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(74,222,128,0.32), transparent)' }}/>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, position: 'relative' }}>
            <div><div style={{ fontSize: 10, color: t.heroAccent, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Active</div><BigNum t={{...t, ink: t.heroInk, inkMuted: 'rgba(236,253,245,0.6)'}} value={active.length} size={28}/></div>
            <div><div style={{ fontSize: 10, color: t.heroAccent, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Sessions/wk</div><BigNum t={{...t, ink: t.heroInk, inkMuted: 'rgba(236,253,245,0.6)'}} value="38" size={28}/></div>
            <div><div style={{ fontSize: 10, color: t.heroAccent, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Adherence</div><BigNum t={{...t, ink: t.heroInk, inkMuted: 'rgba(236,253,245,0.6)'}} value="78" unit="%" size={28}/></div>
          </div>
        </div>
      )}

      {/* Garden / Field summary strip */}
      {t.variant !== 'trail' && (
        <Card t={t} style={{ padding: 16, marginBottom: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
            <div><div style={{ fontSize: 10, color: t.inkMuted, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Active</div><BigNum t={t} value={active.length} size={26}/></div>
            <div><div style={{ fontSize: 10, color: t.inkMuted, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Sessions/wk</div><BigNum t={t} value="38" size={26}/></div>
            <div><div style={{ fontSize: 10, color: t.inkMuted, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Adherence</div><BigNum t={t} value="78" unit="%" size={26}/></div>
          </div>
        </Card>
      )}

      <SectionLabel t={t} right={<span style={{ color: t.inkMuted, fontFamily: t.fontMono, letterSpacing: '0.04em' }}>{SEED.athletes.length}</span>}>Roster</SectionLabel>
      {SEED.athletes.map(a => <AthleteRow key={a.id} t={t} athlete={a} onClick={() => ctx.setRoute({ name: 'athlete', athleteId: a.id })}/>)}
    </div>
  );
}

function AthleteRow({ t, athlete: a, onClick }) {
  const adh = Math.round(a.adherence * 100);
  const ok = a.adherence >= 0.7;
  return (
    <Card t={t} onClick={onClick} style={{ padding: 14, marginBottom: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Avatar t={t} initials={a.initials} size={40}/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: t.ink }}>{a.name}</div>
            {a.streak > 0 && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, fontSize: 11, color: t.accent, fontWeight: 700, fontFamily: t.fontMono }}>
                <Icon name="flame" size={11} stroke={2.2}/> {a.streak}
              </span>
            )}
          </div>
          <div style={{ fontSize: 12, color: t.inkMuted, marginTop: 2 }}>{a.plan} · {a.lastSession}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: ok ? t.accent : t.danger, fontFamily: t.fontMono, fontVariantNumeric: 'tabular-nums' }}>{adh}%</div>
          <div style={{ fontSize: 10, color: t.inkMuted, letterSpacing: '0.06em', textTransform: 'uppercase' }}>adh</div>
        </div>
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────
// ATHLETE PROFILE (trainer view) — also serves as plan-builder entry
// ─────────────────────────────────────────────────────────────
function AthleteProfileScreen({ t, ctx }) {
  const a = SEED.athletes.find(x => x.id === ctx.route.athleteId) || SEED.athletes[0];
  const recent = [
    { d: '12h ago', name: 'Pull A',  vol: '4 320', pr: 1 },
    { d: '2d ago',  name: 'Push A',  vol: '3 880', pr: 0 },
    { d: '4d ago',  name: 'Legs A',  vol: '6 240', pr: 1 },
    { d: '6d ago',  name: 'Pull B',  vol: '4 010', pr: 0 },
  ];
  return (
    <div style={{ padding: '0 16px 120px' }}>
      <div style={{ padding: '0 4px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Avatar t={t} initials={a.initials} size={56} accent/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: t.ink, letterSpacing: '-0.01em' }}>{a.name}</div>
            <div style={{ fontSize: 13, color: t.inkMuted, marginTop: 2 }}>{a.plan} · {a.sessions} sessions</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          <Button t={t} kind="soft" size="sm" icon="edit" style={{ flex: 1 }}>Edit plan</Button>
          <Button t={t} kind="soft" size="sm" icon="note" style={{ flex: 1 }}>Message</Button>
        </div>
      </div>

      <SectionLabel t={t}>Snapshot</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Card t={t} style={{ padding: 14 }}>
          <div style={{ fontSize: 10, color: t.inkMuted, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Adherence</div>
          <BigNum t={t} value={Math.round(a.adherence*100)} unit="%" size={26}/>
          <div style={{ marginTop: 8 }}><ProgressBar t={t} value={a.adherence} height={4}/></div>
        </Card>
        <Card t={t} style={{ padding: 14 }}>
          <div style={{ fontSize: 10, color: t.inkMuted, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Streak</div>
          <BigNum t={t} value={a.streak} unit="d" size={26}/>
          <div style={{ fontSize: 11, color: a.streak > 0 ? t.accent : t.inkMuted, marginTop: 6, fontWeight: 600 }}>
            {a.streak > 0 ? 'Active' : 'Re-engage'}
          </div>
        </Card>
      </div>

      <SectionLabel t={t}>Volume · 4 weeks</SectionLabel>
      <Card t={t} style={{ padding: 14 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <BigNum t={t} value="18 450" unit="kg" size={26}/>
          <div style={{ fontSize: 11, color: t.accent, fontFamily: t.fontMono, fontWeight: 700 }}>+12.4%</div>
        </div>
        <div style={{ marginTop: 10, color: t.accent }}>
          <Sparkline data={[3200, 3800, 3650, 4200, 3900, 4500, 4710, 4800]}
            w={280} h={56} color={t.accent} fill={t.accentSoft} dots/>
        </div>
      </Card>

      <SectionLabel t={t}>Recent sessions</SectionLabel>
      {recent.map((r, i) => (
        <Card key={i} t={t} style={{ padding: 12, marginBottom: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontFamily: t.fontMono, fontSize: 11, color: t.inkMuted, width: 60 }}>{r.d}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: t.ink }}>{r.name}</div>
              <div style={{ fontSize: 11, color: t.inkMuted, fontFamily: t.fontMono }}>{r.vol} kg</div>
            </div>
            {r.pr ? <Pill t={t} kind="solid">PR</Pill> : null}
          </div>
        </Card>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// WEIGHT TRACKING
// ─────────────────────────────────────────────────────────────
function WeightScreen({ t, ctx }) {
  const data = SEED.weights;
  const latest = data[data.length-1];
  const prev = data[data.length-2];
  const delta = latest.w - prev.w;
  const goal = SEED.weightGoal;
  const goalDelta = latest.w - goal;
  const [showAdd, setShowAdd] = React.useState(false);
  const [v, setV] = React.useState(latest.w.toFixed(1));

  return (
    <div style={{ padding: '0 16px 120px' }}>
      <div style={{ padding: '6px 4px 16px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 26, fontWeight: 700, color: t.ink, letterSpacing: '-0.02em' }}>Body</div>
          <div style={{ fontSize: 13, color: t.inkMuted, marginTop: 2 }}>{data.length} entries · this quarter</div>
        </div>
        <Button t={t} kind="soft" size="sm" icon="plus" onClick={() => setShowAdd(s => !s)}>Log</Button>
      </div>

      {/* Hero current weight */}
      {t.variant === 'trail' ? (
        <div style={{ background: t.hero, color: t.heroInk, borderRadius: t.radius.lg, padding: 22, boxShadow: t.glow, border: '1px solid ' + t.heroBorder, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -50, right: -40, width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(74,222,128,0.32), transparent)' }}/>
          <div style={{ position: 'relative' }}>
            <div style={{ fontSize: 11, color: t.heroAccent, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Current weight</div>
            <BigNum t={{...t, ink: t.heroInk, inkMuted: 'rgba(236,253,245,0.6)'}} value={latest.w.toFixed(1)} unit="kg" size={48}/>
            <div style={{ display: 'flex', gap: 14, marginTop: 8 }}>
              <span style={{ fontSize: 12, color: t.heroAccent, fontFamily: t.fontMono, fontWeight: 700 }}>{delta > 0 ? '+' : ''}{delta.toFixed(1)} kg</span>
              <span style={{ fontSize: 12, color: 'rgba(236,253,245,0.7)', fontFamily: t.fontMono }}>vs. last entry</span>
            </div>
            <div style={{ marginTop: 14, color: t.heroAccent }}>
              <Sparkline data={data.map(d => d.w)} w={300} h={70} color={t.heroAccent}
                fill="rgba(74,222,128,0.22)" goal={goal} dots/>
            </div>
            <div style={{ display: 'flex', gap: 14, marginTop: 10, fontSize: 11, color: 'rgba(236,253,245,0.6)', fontFamily: t.fontMono }}>
              <span>{data[0].d}</span><span style={{ marginLeft: 'auto' }}>{latest.d}</span>
            </div>
          </div>
        </div>
      ) : (
        <Card t={t} style={{ padding: 20 }}>
          <div style={{ fontSize: 11, color: t.inkMuted, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Current weight</div>
          <BigNum t={t} value={latest.w.toFixed(1)} unit="kg" size={42}/>
          <div style={{ display: 'flex', gap: 14, marginTop: 8 }}>
            <span style={{ fontSize: 12, color: delta < 0 ? t.accent : t.inkSoft, fontFamily: t.fontMono, fontWeight: 700 }}>{delta > 0 ? '+' : ''}{delta.toFixed(1)} kg</span>
            <span style={{ fontSize: 12, color: t.inkMuted, fontFamily: t.fontMono }}>vs. last entry</span>
          </div>
          <div style={{ marginTop: 14, color: t.accent }}>
            <Sparkline data={data.map(d => d.w)} w={300} h={64} color={t.accent}
              fill={t.accentSoft} goal={goal} dots/>
          </div>
          <div style={{ display: 'flex', gap: 14, marginTop: 6, fontSize: 11, color: t.inkMuted, fontFamily: t.fontMono }}>
            <span>{data[0].d}</span><span style={{ marginLeft: 'auto' }}>{latest.d}</span>
          </div>
        </Card>
      )}

      <SectionLabel t={t}>Goal</SectionLabel>
      <Card t={t} style={{ padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: t.accentSoft, color: t.accentSoftInk, display: 'grid', placeItems: 'center' }}>
            <Icon name="target" size={20}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: t.ink }}>Reach {goal.toFixed(1)} kg</div>
            <div style={{ fontSize: 11, color: t.inkMuted, fontFamily: t.fontMono, marginTop: 2 }}>{goalDelta.toFixed(1)} kg to go · est. 6 weeks</div>
          </div>
        </div>
        <div style={{ marginTop: 12 }}>
          <ProgressBar t={t} value={Math.max(0, Math.min(1, 1 - (latest.w - goal) / (data[0].w - goal)))} height={4}/>
        </div>
      </Card>

      <SectionLabel t={t}>Recent</SectionLabel>
      <Card t={t} padded={false}>
        {data.slice(-6).reverse().map((d, i, arr) => (
          <div key={d.d} style={{
            display: 'flex', alignItems: 'center', padding: '12px 16px',
            borderBottom: i < arr.length - 1 ? '1px solid ' + t.border : 'none',
          }}>
            <div style={{ flex: 1, fontSize: 13, color: t.ink }}>{d.d}</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: t.ink, fontFamily: t.fontMono, fontVariantNumeric: 'tabular-nums' }}>{d.w.toFixed(1)} kg</div>
          </div>
        ))}
      </Card>

      {showAdd && (
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: t.variant === 'trail' ? 94 : 76,
          margin: '0 12px', padding: 16, borderRadius: t.radius.lg,
          background: t.surface, boxShadow: t.shadowLg, border: '1px solid ' + t.border,
          zIndex: 30,
        }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: t.ink, marginBottom: 12 }}>Log weight</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input value={v} onChange={e => setV(e.target.value)}
              style={{ flex: 1, height: 44, ...inpStyle(t), fontSize: 18 }}/>
            <Button t={t} onClick={() => setShowAdd(false)}>Save</Button>
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, {
  LoginScreen, ProfileScreen, TrainerScreen, AthleteProfileScreen, WeightScreen,
  Logo, RoleToggle, Input, SettingRow, Switch, AthleteRow,
});
