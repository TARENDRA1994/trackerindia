"use client";

import { useEffect, useState } from "react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from "recharts";
import { 
  TrendingUp, 
  Target, 
  Clock, 
  Zap,
  ChevronRight,
  AlertCircle
} from "lucide-react";

export default function AnalyticsDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-20 text-center font-bold text-primary animate-pulse">Analyzing performance metrics...</div>;

  const hasData = data?.chartData?.length > 0;
  const metrics = data?.metrics || { consistency: 0, avgHours: 0, avgAccuracy: 0, globalRank: "N/A" };

  return (
    <div className="space-y-10">
      {metrics.isGap && (
        <div className="bg-red-50 border border-red-100 p-6 flex items-center gap-6 animate-in slide-in-from-top duration-500">
           <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
              <AlertCircle className="w-6 h-6 text-white" />
           </div>
           <div>
              <h3 className="text-xl font-serif font-bold text-red-900 italic">Discontinuity Warning</h3>
              <p className="text-xs font-medium text-red-600/80 uppercase tracking-widest mt-1">
                 System has detected a gap of {metrics.gapDays} days. Mentorship council has been notified.
              </p>
           </div>
        </div>
      )}

      {/* Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <MetricCard label="Consistency" value={`${metrics.consistency}%`} trend="+0%" icon={TrendingUp} />
        <MetricCard label="Avg Study Hours" value={metrics.avgHours} unit="/ day" icon={Clock} />
        <MetricCard label="Test Accuracy" value={`${metrics.avgAccuracy}%`} trend="stable" icon={Zap} accent />
        <MetricCard label="Overall Gap" value={metrics.gapDays} unit="days" icon={AlertCircle} isWarning={metrics.isGap} />
        <MetricCard label="Global Rank" value={metrics.globalRank} icon={Target} />
      </div>

      {!hasData ? (
        <div className="bg-white border border-dashed border-border py-32 text-center space-y-4">
          <Target className="w-12 h-12 text-stone-200 mx-auto" />
          <div className="space-y-1">
             <h3 className="text-xl font-serif font-bold text-stone-300 italic">Fresh Profile Detected</h3>
             <p className="text-[10px] uppercase font-bold tracking-widest text-stone-400">Please complete your first daily log to generate analytics</p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Study Hours Trend */}
            <div className="bg-white border border-stone-200 p-8 shadow-xl">
              <div className="flex justify-between items-start mb-8">
                <h3 className="text-lg font-serif font-bold text-primary flex items-center gap-2 italic">
                  <Clock className="w-5 h-5 text-primary" /> Study Consistency
                </h3>
                <p className="text-[9px] font-bold text-stone-300 uppercase tracking-widest">Last 30 Logs</p>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                    <XAxis dataKey="date" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                    <YAxis fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 0, border: '1px solid #e5e5e5' }} />
                    <Line type="monotone" dataKey="hours" stroke="#1D0A69" strokeWidth={3} dot={{ r: 4, fill: "#1D0A69" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Accuracy Trend */}
            <div className="bg-white border border-stone-200 p-8 shadow-xl">
              <div className="flex justify-between items-start mb-8">
                <h3 className="text-lg font-serif font-bold text-accent flex items-center gap-2 italic">
                  <Zap className="w-5 h-5 text-accent" /> Accuracy Progress
                </h3>
                <p className="text-[9px] font-bold text-stone-300 uppercase tracking-widest">AI Test History</p>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.testData}>
                    <defs>
                      <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#DAA520" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#DAA520" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                    <XAxis dataKey="date" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                    <YAxis fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Area type="monotone" dataKey="accuracy" stroke="#DAA520" fillOpacity={1} fill="url(#colorAcc)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* AI Insights Section */}
          <div className="bg-primary text-white p-12 relative overflow-hidden shadow-2xl">
            <TrendingUp className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5 opacity-20" />
            <h3 className="text-2xl font-serif font-bold mb-8 flex items-center gap-3 italic">
              AI PERFORMANCE INSIGHTS
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
              <div className="space-y-4">
                <InsightItem 
                   icon={AlertCircle} 
                   label="Efficiency Check" 
                   text={`Based on your ${data.chartData.length} logs, your most productive hours are mornings. Late evening sessions show a 15% drop in focus.`} 
                   color="text-accent"
                />
                <InsightItem 
                   icon={Zap} 
                   label="Retention Status" 
                   text="High conceptual clarity observed in recent topics. Maintaining current accuracy will put you in the top 5% of aspirants." 
                   color="text-green-400"
                />
              </div>
              <div className="space-y-6">
                <p className="text-lg font-serif italic text-white/80 leading-relaxed">
                  "Aspirant, your current consistency is building a strong foundation. Next week, prioritize Economy and Current Affairs to maintain this momentum."
                </p>
                <button className="text-[10px] font-bold uppercase tracking-[0.2em] border-b border-accent text-accent pb-1 hover:text-white hover:border-white transition-all">
                  Generate Personalized Study Plan <ChevronRight className="inline w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function MetricCard({ label, value, trend, unit, icon: Icon, accent, isWarning }: any) {
  return (
    <div className={`bg-white p-8 border border-stone-200 shadow-lg flex flex-col justify-between group hover:border-primary/30 transition-all ${accent ? 'border-l-4 border-l-accent' : ''} ${isWarning ? 'border-l-4 border-l-red-600 bg-red-50/30' : ''}`}>
      <span className="text-[9px] uppercase font-bold text-stone-400 tracking-[0.2em]">{label}</span>
      <div className="mt-4 flex items-end gap-2">
        <span className={`text-4xl font-serif font-bold ${accent ? 'text-accent' : isWarning ? 'text-red-600' : 'text-primary'}`}>{value}</span>
        {unit && <span className="text-[10px] font-bold text-stone-400 uppercase mb-1">{unit}</span>}
        {trend && (
           <span className={`text-[10px] font-bold mb-1 ${trend.includes('+') ? 'text-green-600' : trend === 'stable' ? 'text-blue-500' : 'text-red-600'}`}>
              {trend}
           </span>
        )}
      </div>
    </div>
  );
}

function InsightItem({ icon: Icon, label, text, color }: any) {
  return (
    <div className="flex gap-5 items-start p-6 bg-white/5 border border-white/10 backdrop-blur-sm">
      <Icon className={`w-6 h-6 ${color} flex-shrink-0`} />
      <div>
        <p className={`font-bold text-[10px] uppercase tracking-widest ${color}`}>{label}</p>
        <p className="text-sm mt-2 text-white/70 leading-relaxed font-medium">{text}</p>
      </div>
    </div>
  );
}
