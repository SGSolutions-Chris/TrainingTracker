// data.jsx — Seed data + shared icons. Pure data, no React state.

const SEED = {
  user: {
    name: 'Maya Chen',
    initials: 'MC',
    handle: '@mayalifts',
    joined: 'Mar 2025',
    bodyweight: 78.4,
    height: 174,
  },
  coach: {
    name: 'Roan Vega',
    initials: 'RV',
    handle: '@coachroan',
  },
  // Plans assigned to current user (athlete)
  plans: [
    {
      id: 'p1',
      name: 'Push · Pull · Legs',
      author: 'Roan Vega',
      weeks: 8,
      currentWeek: 4,
      totalUnits: 24,
      completedUnits: 11,
      nextUnitId: 'u3',
      tag: 'Strength',
    },
    {
      id: 'p2',
      name: 'Conditioning Block',
      author: 'Roan Vega',
      weeks: 4,
      currentWeek: 1,
      totalUnits: 12,
      completedUnits: 2,
      nextUnitId: 'u8',
      tag: 'Conditioning',
    },
    {
      id: 'p3',
      name: 'Mobility Daily',
      author: 'Self',
      weeks: 0,
      currentWeek: 0,
      totalUnits: 0,
      completedUnits: 47,
      nextUnitId: null,
      tag: 'Recovery',
    },
  ],
  units: [
    {
      id: 'u3', planId: 'p1', name: 'Pull A', position: 3, week: 4,
      duration: 52, focus: 'Back · Biceps',
      exercises: [
        { id: 'e1', name: 'Deadlift', sets: 4, reps: '5', target: '110 kg', muscle: 'Back', rest: 180 },
        { id: 'e2', name: 'Pull-Up', sets: 4, reps: '6–8', target: 'BW', muscle: 'Back', rest: 120 },
        { id: 'e3', name: 'Barbell Row', sets: 3, reps: '8', target: '75 kg', muscle: 'Back', rest: 120 },
        { id: 'e4', name: 'Face Pull', sets: 3, reps: '12', target: '22 kg', muscle: 'Rear delt', rest: 90 },
        { id: 'e5', name: 'Incline DB Curl', sets: 3, reps: '10', target: '14 kg', muscle: 'Biceps', rest: 75 },
      ],
    },
    { id: 'u1', planId: 'p1', name: 'Push A', position: 1, week: 4, duration: 48, focus: 'Chest · Shoulders' },
    { id: 'u2', planId: 'p1', name: 'Legs A', position: 2, week: 4, duration: 64, focus: 'Quads · Glutes' },
    { id: 'u4', planId: 'p1', name: 'Push B', position: 4, week: 4, duration: 50, focus: 'Chest · Triceps' },
    { id: 'u5', planId: 'p1', name: 'Pull B', position: 5, week: 4, duration: 52, focus: 'Back · Biceps' },
    { id: 'u6', planId: 'p1', name: 'Legs B', position: 6, week: 4, duration: 60, focus: 'Hamstrings · Glutes' },
  ],
  // Weight log — last 12 entries
  weights: [
    { d: '04-08', w: 79.1 }, { d: '04-12', w: 78.9 },
    { d: '04-16', w: 78.6 }, { d: '04-20', w: 78.7 },
    { d: '04-24', w: 78.3 }, { d: '04-28', w: 78.2 },
    { d: '05-02', w: 78.5 }, { d: '05-06', w: 78.1 },
    { d: '05-08', w: 77.9 }, { d: '05-10', w: 78.0 },
    { d: '05-12', w: 77.7 }, { d: '05-14', w: 78.4 },
  ],
  weightGoal: 76.0,
  // Trainer side
  athletes: [
    { id: 'a1', name: 'Maya Chen',     initials: 'MC', plan: 'Push · Pull · Legs', adherence: 0.86, lastSession: '2d ago',  sessions: 14, streak: 3, status: 'active' },
    { id: 'a2', name: 'Theo Park',     initials: 'TP', plan: 'Hypertrophy Phase 2', adherence: 0.71, lastSession: '4d ago', sessions: 9,  streak: 0, status: 'active' },
    { id: 'a3', name: 'Lia Andersson', initials: 'LA', plan: 'Off-season Base',    adherence: 0.94, lastSession: '12h ago', sessions: 28, streak: 11, status: 'active' },
    { id: 'a4', name: 'Sam Reilly',    initials: 'SR', plan: 'Beginner Strength',  adherence: 0.42, lastSession: '9d ago',  sessions: 4,  streak: 0, status: 'inactive' },
    { id: 'a5', name: 'Noor Aziz',     initials: 'NA', plan: 'Marathon Build',     adherence: 0.79, lastSession: '1d ago',  sessions: 22, streak: 6, status: 'active' },
  ],
  // Activity highlights for athlete home
  weekStats: {
    sessions: 3,
    sessionsGoal: 4,
    volume: 12450, // kg moved
    volumeUnit: 'kg',
    minutes: 184,
    streak: 11,
  },
  // Personal records
  prs: [
    { lift: 'Deadlift', weight: 130, reps: 1, date: '4d ago' },
    { lift: 'Squat',    weight: 105, reps: 3, date: '1w ago' },
    { lift: 'Bench',    weight: 82,  reps: 5, date: '2w ago' },
  ],
};

// Inline SVG icons — stroke-based, currentColor.
const Icon = ({ name, size = 20, stroke = 1.75 }) => {
  const paths = {
    home: 'M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z',
    plans: 'M5 4h14a1 1 0 0 1 1 1v15l-4-3-4 3-4-3-4 3V5a1 1 0 0 1 1-1zM9 9h6M9 13h6',
    weight: 'M5 7h14l-1 12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 7zM9 7V5a3 3 0 0 1 6 0v2',
    user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0',
    play: 'M7 4v16l13-8z',
    plus: 'M12 5v14M5 12h14',
    chevR: 'm9 6 6 6-6 6',
    chevL: 'm15 6-6 6 6 6',
    chevD: 'm6 9 6 6 6-6',
    chevU: 'm6 15 6-6 6 6',
    check: 'm5 12 5 5L20 7',
    x: 'M6 6l12 12M6 18 18 6',
    bolt: 'm13 2-9 13h8l-1 7 9-13h-8z',
    timer: 'M12 6v6l4 2M12 22a9 9 0 1 1 0-18 9 9 0 0 1 0 18zM9 2h6',
    edit: 'M4 20h4l11-11-4-4-11 11zM15 5l4 4',
    settings: 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM19 12a7 7 0 0 0-.1-1l2-1.6-2-3.4-2.4 1a7 7 0 0 0-1.7-1l-.4-2.5h-4l-.4 2.5a7 7 0 0 0-1.7 1l-2.4-1-2 3.4 2 1.6a7 7 0 0 0 0 2l-2 1.6 2 3.4 2.4-1c.5.4 1.1.7 1.7 1l.4 2.5h4l.4-2.5c.6-.3 1.2-.6 1.7-1l2.4 1 2-3.4-2-1.6c.1-.3.1-.7.1-1z',
    bell: 'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9zM10 21a2 2 0 0 0 4 0',
    flame: 'M12 22a7 7 0 0 0 7-7c0-3-2-5-3-7-1 2-3 3-5 3-1-2 1-5 1-7-3 1-7 5-7 11a7 7 0 0 0 7 7z',
    flag: 'M5 21V4h14l-3 5 3 5H7v7',
    trend: 'm3 17 6-6 4 4 8-8M14 7h7v7',
    dumbbell: 'M6 6v12M3 9v6M21 9v6M18 6v12M6 12h12',
    barChart: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
    target: 'M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20zM12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zM12 14a2 2 0 1 1 0-4 2 2 0 0 1 0 4z',
    invite: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM19 8v6M22 11h-6',
    moon: 'M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z',
    sun: 'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 1v3M12 20v3M4 12H1M23 12h-3M5.6 5.6 3.5 3.5M20.5 20.5l-2.1-2.1M5.6 18.4l-2.1 2.1M20.5 3.5l-2.1 2.1',
    arrow: 'M5 12h14M12 5l7 7-7 7',
    grip: 'M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01',
    note: 'M5 4h14v16l-4-3-3 3-3-3-4 3z',
    list: 'M4 6h16M4 12h16M4 18h16',
    search: 'm21 21-4-4M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z',
    activity: 'M22 12h-4l-3 9L9 3l-3 9H2',
    calendar: 'M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM3 10h18M8 2v4M16 2v4',
    refresh: 'M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5',
    download: 'M12 3v12m0 0 4-4m-4 4-4-4M3 17v3a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-3',
  };
  const d = paths[name];
  if (!d) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={stroke}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  );
};

Object.assign(window, { SEED, Icon });
