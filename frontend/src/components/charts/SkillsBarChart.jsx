import React, { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

export function SkillsBarChart({ skills = [], title = 'Detected skills' }) {
  const data = useMemo(() => {
    const list = (skills || []).slice(0, 10);
    return list.map((name, i) => ({
      name: name.length > 14 ? `${name.slice(0, 12)}…` : name,
      full: name,
      value: 100 - i * 6
    }));
  }, [skills]);

  if (!data.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white/60 p-8 text-center text-sm text-slate-500">
        Run resume analysis to see skill distribution.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-soft">
      <h3 className="text-sm font-semibold text-slate-800 mb-4">{title}</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
            <XAxis type="number" hide domain={[0, 100]} />
            <YAxis
              type="category"
              dataKey="name"
              width={100}
              tick={{ fontSize: 11, fill: '#64748b' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: 'rgba(241, 245, 249, 0.6)' }}
              contentStyle={{
                borderRadius: 12,
                border: '1px solid #e2e8f0',
                fontSize: 12
              }}
            />
            <Bar
              dataKey="value"
              fill="url(#barBlueSkills)"
              radius={[0, 8, 8, 0]}
              maxBarSize={18}
            />
            <defs>
              <linearGradient id="barBlueSkills" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#7dd3fc" />
                <stop offset="100%" stopColor="#818cf8" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
