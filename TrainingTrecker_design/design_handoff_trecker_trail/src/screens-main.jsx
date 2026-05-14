// screens-main.jsx — Athlete-facing main screens: Home, Plan, Unit, Workout.

const { useState: _useState, useEffect: _useEffect, useRef: _useRef } = React;

// ─────────────────────────────────────────────────────────────
// HOME — biggest variant differentiation
// ─────────────────────────────────────────────────────────────
function HomeScreen({ t, ctx }) {
  const u = SEED.user;
  const plan = SEED.plans[0];
  const nextUnit = SEED.units.find(x => x.id === plan.nextUnitId);
  const ws = SEED.weekStats;

  // TRAIL — dark hero card with ring
  if (t.variant === 'trail') {
    return (
      <div style={{ padding: '4px 16px 120px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 4px 4px' }}>
          <div>
            <div style={{ fontSize: 11, color: t.inkMuted, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>Thursday</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: t.ink, letterSpacing: '-0.01em' }}>Good morning, {u.name.split(' ')[0]}</div>
          </div>
          <Avatar t={t} initials={u.initials} size={40}/>
        </div>
        <div onClick={() => ctx.setRoute({ name: 'unit', unitId: nextUnit.id })}
          style={{ background: t.hero, color: t.heroInk, borderRadius: t.radius.lg, padding: 20, boxShadow: t.glow, border: '1px solid ' + t.heroBorder, cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(74,222,128,0.35), transparent)', pointerEvents: 'none' }}/>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
            <div>
              <div style={{ fontSize: 11, color: t.heroAccent, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Today · Week {plan.currentWeek}</div>
              <div style={{ fontSize: 26, fontWeight: 700, marginTop: 6, letterSpacing: '-0.02em' }}>{nextUnit.name}</div>
              <div style={{ fontSize: 13, color: 'rgba(236,253,245,0.7)', marginTop: 2 }}>{nextUnit.focus}</div>
            </div>
            <ProgressRing value={plan.completedUnits / plan.totalUnits} size={70} stroke={6} color={t.heroAccent} track="rgba(255,255,255,0.1)">
              <BigNum t={{...t, ink: t.heroInk, inkMuted: 'rgba(236,253,245,0.6)', fontMono: t.fontMono}} value={Math.round(plan.completedUnits / plan.totalUnits * 100)} unit="%" size={18}/>
            </ProgressRing>
          </div>
          <div style={{ display: 'flex', gap: 14, marginTop: 18, alignItems: 'center', position: 'relative' }}>
            <BigNum t={{...t, ink: t.heroInk, inkMuted: 'rgba(236,253,245,0.6)'}} value={nextUnit.duration} unit="min" size={28}/>
            <div style={{ width: 1, height: 28, background: 'rgba(236,253,245,0.18)' }}/>
            <BigNum t={{...t, ink: t.heroInk, inkMuted: 'rgba(236,253,245,0.6)'}} value={nextUnit.exercises?.length || 5} unit="ex" size={28}/>
            <div style={{ flex: 1 }}/>
            <button onClick={(e) => { e.stopPropagation(); ctx.setRoute({ name: 'workout', unitId: nextUnit.id }); }}
              style={{ ...btnReset, background: t.heroAccent, color: '#06120b', height: 44, paddingInline: 18, borderRadius: 999, fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon name="play" size={14} stroke={2.5}/> Start
            </button>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {[
            { label: 'Sessions', value: ws.sessions, unit: '/' + ws.sessionsGoal },
            { label: 'Volume',   value: (ws.volume/1000).toFixed(1), unit: 't' },
            { label: 'Streak',   value: ws.streak, unit: 'd' },
          ].map((s, i) => (
            <Card key={i} t={t} padded={false} style={{ padding: '14px 12px' }}>
              <div style={{ fontSize: 10, color: t.inkMuted, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>{s.label}</div>
              <BigNum t={t} value={s.value} unit={s.unit} size={26} mono/>
            </Card>
          ))}
        </div>
        <SectionLabel t={t}>Your plans</SectionLabel>
        {SEED.plans.map(p => <PlanRow key={p.id} t={t} plan={p} onClick={() => ctx.setRoute({ name: 'plan', planId: p.id })}/>)}
      </div>
    );
  }

  // FIELD — editorial, mono-numeric
  if (t.variant === 'field') {
    return (
      <div style={{ padding: '0 16px 120px' }}>
        <div style={{ padding: '8px 4px 16px' }}>
          <div style={{ fontSize: 11, color: t.inkMuted, textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: t.fontMono }}>THU · MAY 14 · W{plan.currentWeek}</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: t.ink, letterSpacing: '-0.02em', marginTop: 2 }}>Today</div>
        </div>
        <Card t={t} padded={false} style={{ padding: 0, overflow: 'hidden' }} onClick={() => ctx.setRoute({ name: 'unit', unitId: nextUnit.id })}>
          <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', alignItems: 'stretch' }}>
            <div style={{ background: t.accent, color: t.accentInk, padding: '18px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em' }}>UNIT&nbsp;{String(nextUnit.position).padStart(2, '0')}</div>
              <div>
                <BigNum t={{...t, ink: t.accentInk, inkMuted: 'rgba(255,255,255,0.7)'}} value={nextUnit.duration} unit="m" size={36}/>
                <div style={{ fontSize: 10, marginTop: 4, opacity: 0.8, letterSpacing: '0.08em', textTransform: 'uppercase' }}>est.</div>
              </div>
            </div>
            <div style={{ padding: '16px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 11, color: t.inkMuted, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Push · Pull · Legs · W{plan.currentWeek}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: t.ink, marginTop: 2 }}>{nextUnit.name}</div>
                <div style={{ fontSize: 12, color: t.inkSoft, marginTop: 2 }}>{nextUnit.focus}</div>
              </div>
              <button onClick={(e) => { e.stopPropagation(); ctx.setRoute({ name: 'workout', unitId: nextUnit.id }); }}
                style={{ ...btnReset, alignSelf: 'flex-start', color: t.accent, fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4, marginTop: 12 }}>
                Start session <Icon name="arrow" size={14} stroke={2.5}/>
              </button>
            </div>
          </div>
        </Card>
        <SectionLabel t={t}>This week</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: t.border, border: '1px solid ' + t.border, borderRadius: t.radius.md, overflow: 'hidden' }}>
          {[
            { label: 'Sessions',  v: ws.sessions, u: '/' + ws.sessionsGoal },
            { label: 'Minutes',   v: ws.minutes,  u: 'min' },
            { label: 'Volume',    v: ws.volume.toLocaleString(),   u: 'kg' },
            { label: 'Streak',    v: ws.streak,   u: 'days' },
          ].map((s, i) => (
            <div key={i} style={{ background: t.surface, padding: '14px 14px' }}>
              <div style={{ fontSize: 10, color: t.inkMuted, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>{s.label}</div>
              <BigNum t={t} value={s.v} unit={s.u} size={24} mono/>
            </div>
          ))}
        </div>
        <SectionLabel t={t} right={<button onClick={() => ctx.setRoute({ name: 'plans' })} style={{ ...btnReset, color: t.accent, fontSize: 11, fontWeight: 700, letterSpacing: '0.06em' }}>SEE ALL</button>}>Plans</SectionLabel>
        {SEED.plans.map(p => <PlanRow key={p.id} t={t} plan={p} onClick={() => ctx.setRoute({ name: 'plan', planId: p.id })}/>)}
      </div>
    );
  }

  // GARDEN — Apple Fitness soft
  return (
    <div style={{ padding: '0 18px 120px' }}>
      <div style={{ padding: '6px 4px 16px' }}>
        <div style={{ fontSize: 13, color: t.inkMuted, fontWeight: 500 }}>Thursday, May 14</div>
        <div style={{ fontSize: 28, fontWeight: 700, color: t.ink, letterSpacing: '-0.02em' }}>Hello, {u.name.split(' ')[0]}</div>
      </div>
      <Card t={t} raised onClick={() => ctx.setRoute({ name: 'unit', unitId: nextUnit.id })} style={{ padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <Pill t={t} kind="soft" icon="flame">Today’s session</Pill>
            <div style={{ fontSize: 22, fontWeight: 700, color: t.ink, marginTop: 10, letterSpacing: '-0.01em' }}>{nextUnit.name}</div>
            <div style={{ fontSize: 13, color: t.inkSoft, marginTop: 2 }}>{nextUnit.focus} · Week {plan.currentWeek}</div>
          </div>
          <ProgressRing value={plan.completedUnits / plan.totalUnits} size={68} stroke={6} color={t.accent} track={t.surfaceAlt}>
            <BigNum t={t} value={Math.round(plan.completedUnits / plan.totalUnits * 100)} unit="%" size={16}/>
          </ProgressRing>
        </div>
        <div style={{ display: 'flex', gap: 18, marginTop: 18, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 11, color: t.inkMuted, fontWeight: 500 }}>Duration</div>
            <BigNum t={t} value={nextUnit.duration} unit="min" size={22}/>
          </div>
          <div style={{ width: 1, alignSelf: 'stretch', background: t.border }}/>
          <div>
            <div style={{ fontSize: 11, color: t.inkMuted, fontWeight: 500 }}>Exercises</div>
            <BigNum t={t} value={nextUnit.exercises?.length || 5} size={22}/>
          </div>
          <div style={{ flex: 1 }}/>
          <Button t={t} icon="play" size="md" onClick={(e) => { e.stopPropagation(); ctx.setRoute({ name: 'workout', unitId: nextUnit.id }); }}>Start</Button>
        </div>
      </Card>
      <SectionLabel t={t}>This week</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Card t={t} style={{ padding: 16 }}>
          <div style={{ fontSize: 11, color: t.inkMuted, fontWeight: 500 }}>Sessions</div>
          <BigNum t={t} value={ws.sessions} unit={'/' + ws.sessionsGoal} size={26}/>
          <div style={{ marginTop: 10 }}><ProgressBar t={t} value={ws.sessions / ws.sessionsGoal}/></div>
        </Card>
        <Card t={t} style={{ padding: 16 }}>
          <div style={{ fontSize: 11, color: t.inkMuted, fontWeight: 500 }}>Volume</div>
          <BigNum t={t} value={(ws.volume/1000).toFixed(1)} unit="t" size={26}/>
          <div style={{ fontSize: 11, color: t.accent, marginTop: 10, fontWeight: 600 }}>+8% from last week</div>
        </Card>
      </div>
      <SectionLabel t={t} right={<button onClick={() => ctx.setRoute({ name: 'plans' })} style={{ ...btnReset, color: t.accent, fontSize: 13, fontWeight: 600 }}>See all</button>}>Your plans</SectionLabel>
      {SEED.plans.map(p => <PlanRow key={p.id} t={t} plan={p} onClick={() => ctx.setRoute({ name: 'plan', planId: p.id })}/>)}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
function PlanRow({ t, plan, onClick }) {
  const pct = plan.totalUnits ? plan.completedUnits / plan.totalUnits : 0;
  if (t.variant === 'field') {
    return (
      <button onClick={onClick} style={{ ...btnReset, width: '100%', textAlign: 'left', padding: '12px 14px', background: t.surface, border: '1px solid ' + t.border, borderRadius: t.radius.md, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ fontSize: 11, fontFamily: t.fontMono, color: t.inkMuted, width: 28, letterSpacing: '0.04em' }}>{String(plan.totalUnits).padStart(2, '0')}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: t.ink }}>{plan.name}</div>
          <div style={{ fontSize: 11, color: t.inkMuted, marginTop: 2, fontFamily: t.fontMono }}>{plan.weeks ? `W${plan.currentWeek}/${plan.weeks}` : 'Ongoing'} · {plan.tag.toUpperCase()}</div>
        </div>
        <div style={{ fontSize: 12, fontWeight: 700, color: t.accent, fontFamily: t.fontMono }}>{Math.round(pct * 100)}%</div>
      </button>
    );
  }
  return (
    <Card t={t} onClick={onClick} style={{ padding: 14, marginBottom: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 42, height: 42, borderRadius: t.variant === 'trail' ? 14 : 12, background: t.accentSoft, color: t.accentSoftInk, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
          <Icon name={plan.tag === 'Recovery' ? 'activity' : plan.tag === 'Conditioning' ? 'bolt' : 'dumbbell'} size={20}/>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: t.ink }}>{plan.name}</div>
          <div style={{ fontSize: 12, color: t.inkMuted, marginTop: 2 }}>{plan.weeks ? `Week ${plan.currentWeek} of ${plan.weeks}` : `${plan.completedUnits} sessions`} · {plan.tag}</div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: t.accent, fontFamily: t.fontMono }}>{Math.round(pct * 100)}%</div>
        </div>
      </div>
      <div style={{ marginTop: 12 }}><ProgressBar t={t} value={pct} height={4}/></div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────
function PlansListScreen({ t, ctx }) {
  return (
    <div style={{ padding: '0 16px 120px' }}>
      <div style={{ padding: '6px 4px 16px' }}>
        <div style={{ fontSize: 26, fontWeight: 700, color: t.ink, letterSpacing: '-0.02em' }}>Plans</div>
        <div style={{ fontSize: 13, color: t.inkMuted, marginTop: 2 }}>{SEED.plans.length} active</div>
      </div>
      {SEED.plans.map(p => <PlanRow key={p.id} t={t} plan={p} onClick={() => ctx.setRoute({ name: 'plan', planId: p.id })}/>)}
      <Button t={t} kind="ghost" full icon="plus" style={{ marginTop: 12 }}>New plan</Button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
function PlanDetailScreen({ t, ctx }) {
  const plan = SEED.plans.find(p => p.id === ctx.route.planId) || SEED.plans[0];
  const units = SEED.units.filter(u => u.planId === plan.id);
  const weeks = {};
  units.forEach(u => { (weeks[u.week] ||= []).push(u); });
  return (
    <div style={{ padding: '0 16px 120px' }}>
      <div style={{ padding: '0 4px 16px' }}>
        <Pill t={t} kind="soft">{plan.tag}</Pill>
        <div style={{ fontSize: 24, fontWeight: 700, color: t.ink, letterSpacing: '-0.02em', marginTop: 10 }}>{plan.name}</div>
        <div style={{ fontSize: 13, color: t.inkMuted, marginTop: 2 }}>by {plan.author}</div>
        <div style={{ marginTop: 16, display: 'flex', gap: 18 }}>
          <div>
            <div style={{ fontSize: 11, color: t.inkMuted, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Progress</div>
            <BigNum t={t} value={plan.completedUnits + '/' + plan.totalUnits} size={22}/>
          </div>
          <div>
            <div style={{ fontSize: 11, color: t.inkMuted, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Week</div>
            <BigNum t={t} value={plan.currentWeek + '/' + plan.weeks} size={22}/>
          </div>
        </div>
        <div style={{ marginTop: 14 }}><ProgressBar t={t} value={plan.completedUnits/plan.totalUnits} height={6}/></div>
      </div>
      {Object.entries(weeks).map(([week, list]) => (
        <div key={week}>
          <SectionLabel t={t}>Week {week}</SectionLabel>
          {list.sort((a,b) => a.position - b.position).map((u) => (
            <UnitRow key={u.id} t={t} unit={u} idx={u.position} done={u.position < 3}
              onView={() => ctx.setRoute({ name: 'unit', unitId: u.id })}
              onStart={() => ctx.setRoute({ name: 'workout', unitId: u.id })}/>
          ))}
        </div>
      ))}
    </div>
  );
}

function UnitRow({ t, unit, idx, done, onView, onStart }) {
  return (
    <Card t={t} style={{ padding: 14, marginBottom: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div onClick={onView} style={{ width: 36, height: 36, borderRadius: t.radius.sm, background: done ? t.accentSoft : t.surfaceAlt, color: done ? t.accentSoftInk : t.inkMuted, display: 'grid', placeItems: 'center', flexShrink: 0, fontFamily: t.fontMono, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
          {done ? <Icon name="check" size={18} stroke={2.5}/> : String(idx).padStart(2, '0')}
        </div>
        <div onClick={onView} style={{ flex: 1, minWidth: 0, cursor: 'pointer' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: t.ink }}>{unit.name}</div>
          <div style={{ fontSize: 12, color: t.inkMuted, marginTop: 2, fontFamily: t.variant === 'field' ? t.fontMono : t.font }}>{unit.focus} · {unit.duration}m</div>
        </div>
        <button onClick={onStart} style={{ ...btnReset, width: 36, height: 36, borderRadius: t.variant === 'field' ? t.radius.sm : 999, background: t.accent, color: t.accentInk, display: 'grid', placeItems: 'center', flexShrink: 0 }} aria-label="Start">
          <Icon name="play" size={16} stroke={2}/>
        </button>
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────
function UnitDetailScreen({ t, ctx }) {
  const unit = SEED.units.find(u => u.id === ctx.route.unitId) || SEED.units[0];
  return (
    <div style={{ padding: '0 16px 120px' }}>
      <div style={{ padding: '0 4px 14px' }}>
        <Pill t={t} kind="soft">{unit.focus}</Pill>
        <div style={{ fontSize: 24, fontWeight: 700, color: t.ink, letterSpacing: '-0.02em', marginTop: 10 }}>{unit.name}</div>
        <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
          <div>
            <div style={{ fontSize: 11, color: t.inkMuted, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Duration</div>
            <BigNum t={t} value={unit.duration} unit="min" size={22}/>
          </div>
          <div>
            <div style={{ fontSize: 11, color: t.inkMuted, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Exercises</div>
            <BigNum t={t} value={unit.exercises?.length || 5} size={22}/>
          </div>
          <div>
            <div style={{ fontSize: 11, color: t.inkMuted, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Sets</div>
            <BigNum t={t} value={(unit.exercises || []).reduce((a, e) => a + e.sets, 0)} size={22}/>
          </div>
        </div>
      </div>
      <SectionLabel t={t}>Exercises</SectionLabel>
      {(unit.exercises || []).map((ex, i) => (
        <Card key={ex.id} t={t} style={{ padding: 14, marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontFamily: t.fontMono, fontSize: 13, fontWeight: 700, color: t.inkMuted, width: 24 }}>{String(i+1).padStart(2,'0')}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: t.ink }}>{ex.name}</div>
              <div style={{ fontSize: 12, color: t.inkMuted, marginTop: 2 }}>{ex.muscle}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: t.ink, fontFamily: t.fontMono }}>{ex.sets} × {ex.reps}</div>
              <div style={{ fontSize: 11, color: t.accent, fontFamily: t.fontMono, fontWeight: 600 }}>{ex.target}</div>
            </div>
          </div>
        </Card>
      ))}
      <div style={{ position: 'sticky', bottom: 0, paddingTop: 12, paddingBottom: 8, background: t.bg }}>
        <Button t={t} full size="lg" icon="play" onClick={() => ctx.setRoute({ name: 'workout', unitId: unit.id })}>Start workout</Button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
function WorkoutScreen({ t, ctx }) {
  const unit = SEED.units.find(u => u.id === ctx.route.unitId) || SEED.units[0];
  const exercises = unit.exercises || [];
  const [exIdx, setExIdx] = _useState(0);
  const [logged, setLogged] = _useState({});
  const [elapsed, setElapsed] = _useState(932);
  const [rest, setRest] = _useState(0);
  const [toast, setToast] = _useState(null);
  _useEffect(() => { const id = setInterval(() => setElapsed(s => s + 1), 1000); return () => clearInterval(id); }, []);
  _useEffect(() => { if (rest > 0) { const id = setTimeout(() => setRest(r => r - 1), 1000); return () => clearTimeout(id); } }, [rest]);
  const ex = exercises[exIdx];
  if (!ex) return null;
  const completeSet = (setIdx) => {
    const key = exIdx + '-' + setIdx;
    setLogged(prev => ({ ...prev, [key]: { ...(prev[key] || {}), done: true } }));
    setRest(ex.rest || 90);
    setToast('Set logged'); setTimeout(() => setToast(null), 1500);
  };
  const updateField = (setIdx, field, val) => {
    const key = exIdx + '-' + setIdx;
    setLogged(prev => ({ ...prev, [key]: { ...(prev[key] || {}), [field]: val } }));
  };
  const totalSets = exercises.reduce((a,e) => a + e.sets, 0);
  const doneSets = Object.values(logged).filter(s => s.done).length;
  const progress = doneSets / totalSets;
  const mins = Math.floor(elapsed/60), secs = elapsed%60;
  const timer = String(mins).padStart(2,'0') + ':' + String(secs).padStart(2,'0');

  const TopChrome = () => t.variant === 'trail' ? (
    <div style={{ background: t.hero, color: t.heroInk, padding: '16px 18px 18px', margin: '0 0 14px', boxShadow: t.glow, borderBottomLeftRadius: t.radius.lg, borderBottomRightRadius: t.radius.lg, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -60, right: -40, width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(74,222,128,0.35), transparent)', pointerEvents: 'none' }}/>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
        <button onClick={() => ctx.setRoute({ name: 'unit', unitId: unit.id })} style={{ ...btnReset, color: t.heroInk, padding: 4 }}><Icon name="chevL" size={22}/></button>
        <div style={{ fontFamily: t.fontMono, fontSize: 18, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{timer}</div>
        <button style={{ ...btnReset, color: t.heroInk, padding: 4 }}><Icon name="x" size={22}/></button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 14, position: 'relative' }}>
        <ProgressRing value={progress} size={72} stroke={6} color={t.heroAccent} track="rgba(255,255,255,0.1)">
          <BigNum t={{...t, ink: t.heroInk, inkMuted: 'rgba(236,253,245,0.6)'}} value={doneSets} unit={'/' + totalSets} size={18}/>
        </ProgressRing>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: t.heroAccent, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{String(exIdx+1).padStart(2,'0')} · {ex.muscle}</div>
          <div style={{ fontSize: 22, fontWeight: 700, marginTop: 4, letterSpacing: '-0.02em' }}>{ex.name}</div>
          <div style={{ fontSize: 12, color: 'rgba(236,253,245,0.7)', marginTop: 2, fontFamily: t.fontMono }}>{ex.sets} × {ex.reps} @ {ex.target}</div>
        </div>
      </div>
      {rest > 0 && (
        <div style={{ marginTop: 12, padding: '8px 12px', background: 'rgba(74,222,128,0.18)', borderRadius: 999, display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 600, color: t.heroAccent }}>
          <Icon name="timer" size={14} stroke={2.2}/> Rest · {rest}s
        </div>
      )}
    </div>
  ) : (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 12px 8px' }}>
        <button onClick={() => ctx.setRoute({ name: 'unit', unitId: unit.id })} style={{ ...btnReset, padding: 8, color: t.ink }}><Icon name="chevL" size={22}/></button>
        <div style={{ fontFamily: t.fontMono, fontSize: 14, fontWeight: 700, color: t.accent, background: t.accentSoft, paddingInline: 12, height: 28, borderRadius: 999, display: 'flex', alignItems: 'center', gap: 6, fontVariantNumeric: 'tabular-nums' }}><Icon name="timer" size={13}/> {timer}</div>
        <button style={{ ...btnReset, padding: 8, color: t.ink }}><Icon name="x" size={22}/></button>
      </div>
      <div style={{ padding: '0 16px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 11, color: t.inkMuted, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Exercise {exIdx+1} of {exercises.length}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: t.ink, marginTop: 4, letterSpacing: '-0.01em' }}>{ex.name}</div>
            <div style={{ fontSize: 12, color: t.accent, fontFamily: t.fontMono, fontWeight: 600, marginTop: 2 }}>{ex.sets} × {ex.reps} · {ex.target}</div>
          </div>
          <Pill t={t} kind="soft">{ex.muscle}</Pill>
        </div>
        <div style={{ marginTop: 12 }}><ProgressBar t={t} value={progress} height={4}/></div>
        {rest > 0 && (
          <div style={{ marginTop: 10, padding: '8px 12px', background: t.accentSoft, color: t.accentSoftInk, borderRadius: t.radius.sm, display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 600 }}>
            <Icon name="timer" size={14}/> Rest · {rest}s
          </div>
        )}
      </div>
    </>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      <TopChrome/>
      <div style={{ flex: 1, overflow: 'auto', padding: '0 16px 100px' }}>
        <Card t={t} padded={false} style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '36px 1fr 1fr 44px', gap: 8, padding: '10px 14px', alignItems: 'center', fontSize: 10, fontWeight: 700, color: t.inkMuted, letterSpacing: '0.08em', textTransform: 'uppercase', borderBottom: '1px solid ' + t.border }}>
            <span>SET</span><span>KG</span><span>REPS</span><span/>
          </div>
          {Array.from({ length: ex.sets }).map((_, i) => {
            const key = exIdx + '-' + i;
            const s = logged[key] || {};
            const targetKg = parseInt(ex.target) || '';
            return (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '36px 1fr 1fr 44px', gap: 8, padding: '10px 14px', alignItems: 'center', borderBottom: i < ex.sets-1 ? '1px solid ' + t.border : 'none', opacity: s.done ? 0.55 : 1, transition: 'opacity 0.2s' }}>
                <span style={{ fontFamily: t.fontMono, fontSize: 13, fontWeight: 700, color: t.inkMuted }}>{String(i+1).padStart(2,'0')}</span>
                <input type="text" inputMode="decimal" placeholder={String(targetKg)} value={s.kg || ''} onChange={e => updateField(i, 'kg', e.target.value)} style={inpStyle(t)}/>
                <input type="text" inputMode="numeric" placeholder={String(ex.reps)} value={s.reps || ''} onChange={e => updateField(i, 'reps', e.target.value)} style={inpStyle(t)}/>
                <button onClick={() => completeSet(i)} style={{ ...btnReset, width: 38, height: 38, borderRadius: '50%', background: s.done ? t.accent : t.surfaceAlt, color: s.done ? t.accentInk : t.inkMuted, display: 'grid', placeItems: 'center', justifySelf: 'end', transition: 'all 0.18s' }}>
                  <Icon name="check" size={18} stroke={2.5}/>
                </button>
              </div>
            );
          })}
        </Card>
        <SectionLabel t={t}>Next up</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {exercises.slice(exIdx+1, exIdx+4).map((nx, i) => (
            <Card key={nx.id} t={t} style={{ padding: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ fontFamily: t.fontMono, fontSize: 12, color: t.inkMuted, width: 20 }}>{String(exIdx + 2 + i).padStart(2,'0')}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: t.ink }}>{nx.name}</div>
                  <div style={{ fontSize: 11, color: t.inkMuted, fontFamily: t.fontMono }}>{nx.sets} × {nx.reps} · {nx.target}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, background: t.bg, padding: '10px 16px 14px', borderTop: '1px solid ' + t.border, display: 'flex', gap: 10 }}>
        <Button t={t} kind="ghost" icon="chevL" onClick={() => setExIdx(Math.max(0, exIdx-1))} style={{ flex: 1 }}>Prev</Button>
        <Button t={t} onClick={() => setExIdx(Math.min(exercises.length-1, exIdx+1))} style={{ flex: 1 }}>
          Next <Icon name="chevR" size={16} stroke={2.5}/>
        </Button>
      </div>
      <Toast t={t} show={!!toast}>{toast}</Toast>
    </div>
  );
}

function inpStyle(t) {
  return { width: '100%', height: 38, borderRadius: t.radius.sm, background: t.surfaceAlt, border: '1px solid ' + t.border, color: t.ink, fontFamily: t.fontMono, fontSize: 15, fontWeight: 600, textAlign: 'center', outline: 'none', fontVariantNumeric: 'tabular-nums' };
}

Object.assign(window, { HomeScreen, PlanRow, PlansListScreen, PlanDetailScreen, UnitDetailScreen, WorkoutScreen });
