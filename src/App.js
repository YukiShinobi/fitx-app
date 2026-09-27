import { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

const initialHistory = [
  { day: 'Mon', score: 42 },
  { day: 'Tue', score: 48 },
  { day: 'Wed', score: 47 },
  { day: 'Thu', score: 55 },
  { day: 'Fri', score: 61 },
  { day: 'Sat', score: 66 },
  { day: 'Sun', score: 72 }
];

const habits = [
  { id: 'workout', label: 'Workout complete', points: 12 },
  { id: 'cardio', label: 'Cardio session', points: 8 },
  { id: 'protein', label: 'Protein target', points: 6 },
  { id: 'water', label: 'Hydration target', points: 4 }
];

export default function App() {
  const [completed, setCompleted] = useState(['workout']);
  const [history, setHistory] = useState(initialHistory);
  const [goal, setGoal] = useState(80);

  const dailyPoints = useMemo(
    () => habits.filter(habit => completed.includes(habit.id)).reduce((sum, habit) => sum + habit.points, 0),
    [completed]
  );

  const progress = Math.min(100, Math.round((dailyPoints / 30) * 100));

  function toggleHabit(id) {
    setCompleted(current =>
      current.includes(id) ? current.filter(item => item !== id) : [...current, id]
    );
  }

  function logDay() {
    setHistory(current => {
      const nextScore = Math.min(100, (current.at(-1)?.score ?? 50) + Math.max(2, Math.round(dailyPoints / 4)));
      return [...current.slice(-6), { day: 'Now', score: nextScore }];
    });
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">FITX · LEGACY PROTOTYPE</p>
          <h1>Make progress visible.</h1>
          <p className="hero-copy">
            A lightweight fitness experiment that explored consistency, progress feedback,
            and game-inspired motivation before the ideas evolved into Project Creation.
          </p>
        </div>
        <div className="score-card">
          <span>Today</span>
          <strong>{dailyPoints}</strong>
          <small>progress points</small>
        </div>
      </section>

      <section className="grid two">
        <article className="panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">DAILY LOOP</p>
              <h2>Consistency checklist</h2>
            </div>
            <span className="pill">{completed.length}/{habits.length}</span>
          </div>

          <div className="habit-list">
            {habits.map(habit => {
              const active = completed.includes(habit.id);
              return (
                <button
                  className={`habit ${active ? 'active' : ''}`}
                  key={habit.id}
                  onClick={() => toggleHabit(habit.id)}
                >
                  <span className="check">{active ? '✓' : ''}</span>
                  <span>{habit.label}</span>
                  <b>+{habit.points}</b>
                </button>
              );
            })}
          </div>

          <div className="progress-track" aria-label={`Daily progress ${progress}%`}>
            <span style={{ width: `${progress}%` }} />
          </div>
          <button className="primary" onClick={logDay}>Log today</button>
        </article>

        <article className="panel chart-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">MOMENTUM</p>
              <h2>Progress trend</h2>
            </div>
            <span className="pill">Goal {goal}</span>
          </div>

          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history}>
                <defs>
                  <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b1e2d" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#8b1e2d" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#232936" vertical={false} />
                <XAxis dataKey="day" stroke="#7d8594" tickLine={false} axisLine={false} />
                <YAxis stroke="#7d8594" tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip contentStyle={{ background: '#111827', border: '1px solid #2b3342', borderRadius: 12 }} />
                <Area type="monotone" dataKey="score" stroke="#a52a3a" strokeWidth={3} fill="url(#scoreFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>

      <section className="grid three">
        <article className="mini-card">
          <span>Current streak</span>
          <strong>7 days</strong>
          <small>showing up beats perfection</small>
        </article>
        <article className="mini-card">
          <span>Weekly score</span>
          <strong>{history.at(-1)?.score ?? 0}</strong>
          <small>simple feedback, not noisy data</small>
        </article>
        <article className="mini-card goal-card">
          <span>Target score</span>
          <strong>{goal}</strong>
          <input
            aria-label="Target score"
            type="range"
            min="50"
            max="100"
            value={goal}
            onChange={event => setGoal(Number(event.target.value))}
          />
        </article>
      </section>

      <footer>
        <span>FITX was an experiment.</span>
        <strong>The lessons moved forward into Project Creation.</strong>
      </footer>
    </main>
  );
}
