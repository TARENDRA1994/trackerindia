"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function StudyChart({ data }: { data: { name: string; hours: number }[] }) {
  return (
    <div className="w-full h-[300px] mt-8 bg-white/5 p-4 rounded-lg">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 0,
            left: -20,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="rgba(255,255,255,0.6)" 
            tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} 
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            stroke="rgba(255,255,255,0.6)" 
            tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
            formatter={(value: any) => [`${value} Hours`, 'Study Time']}
          />
          <Bar 
            dataKey="hours" 
            fill="rgba(255,255,255,0.8)" 
            radius={[4, 4, 0, 0]} 
            barSize={32}
            activeBar={{ fill: '#fff' }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
