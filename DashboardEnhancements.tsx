import React from 'react';
import { 
  Search, 
  Zap, 
  TrendingUp, 
  Target, 
  Compass, 
  BrainCircuit, 
  ChevronRight, 
  Package, 
  DollarSign, 
  BarChart3,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  AlertCircle,
  Clock
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Mock Data ---

const activityLogs = [
  { id: 1, type: 'scan', text: 'AI scanned 120 products in Home & Kitchen', time: '2 mins ago', icon: Search, color: 'text-sky-500', bg: 'bg-sky-500/10' },
  { id: 2, type: 'gap', text: 'Market gap detected in Pet Accessories', time: '15 mins ago', icon: Target, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { id: 3, type: 'supplier', text: 'New supplier discovered for "Mini Blender"', time: '1 hour ago', icon: Package, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { id: 4, type: 'profit', text: 'Profitable product identified: "Ergonomic Mouse"', time: '3 hours ago', icon: Zap, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  { id: 5, type: 'trend', text: 'Rising trend detected: "Sustainable Yoga Mats"', time: '5 hours ago', icon: TrendingUp, color: 'text-rose-500', bg: 'bg-rose-500/10' },
];

const chartData = [
  { name: 'Mon', analyzed: 45, profitable: 12, suppliers: 8 },
  { name: 'Tue', analyzed: 52, profitable: 15, suppliers: 10 },
  { name: 'Wed', analyzed: 48, profitable: 10, suppliers: 7 },
  { name: 'Thu', analyzed: 70, profitable: 22, suppliers: 15 },
  { name: 'Fri', analyzed: 65, profitable: 18, suppliers: 12 },
  { name: 'Sat', analyzed: 40, profitable: 8, suppliers: 5 },
  { name: 'Sun', analyzed: 35, profitable: 6, suppliers: 4 },
];

const radarData = [
  { category: 'Kitchen Tools', level: 'High', value: 90, color: 'bg-emerald-500' },
  { category: 'Pet Products', level: 'Rising', value: 75, color: 'bg-sky-500' },
  { category: 'Car Accessories', level: 'Medium', value: 55, color: 'bg-amber-500' },
  { category: 'Office Products', level: 'Low', value: 30, color: 'bg-rose-500' },
];

// --- Components ---

export const AIActivityFeed = () => (
  <div className="glass-card p-8 space-y-6 flex flex-col h-full">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center border border-sky-500/20">
          <Activity className="w-6 h-6 text-sky-500" />
        </div>
        <h3 className="text-xl font-black text-white tracking-tight">AI Activity Feed</h3>
      </div>
      <span className="text-[10px] font-black text-sky-500 bg-sky-500/10 px-2 py-1 rounded-lg uppercase tracking-widest animate-pulse">Live</span>
    </div>

    <div className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
      {activityLogs.map((log, i) => (
        <motion.div
          key={log.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex gap-4 group cursor-pointer"
        >
          <div className="flex flex-col items-center gap-2">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border border-white/5 transition-all group-hover:scale-110", log.bg)}>
              <log.icon className={cn("w-5 h-5", log.color)} />
            </div>
            {i !== activityLogs.length - 1 && <div className="w-0.5 flex-1 bg-white/5 rounded-full" />}
          </div>
          <div className="pb-6 space-y-1">
            <p className="text-sm font-medium text-gray-200 leading-tight group-hover:text-sky-400 transition-colors">{log.text}</p>
            <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
              <Clock className="w-3 h-3" /> {log.time}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

export const TopOpportunityWidget = () => (
  <div className="premium-card p-8 space-y-6 group">
    <div className="flex items-center justify-between">
      <h3 className="text-xl font-black text-white tracking-tight">Today's Top Opportunity</h3>
      <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
        <Sparkles className="w-6 h-6 text-amber-500" />
      </div>
    </div>

    <div className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 blur-3xl rounded-full -mr-16 -mt-16" />
      
      <div className="flex items-center gap-4 relative z-10">
        <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-sky-500/20">
          <Package className="w-8 h-8 text-white" />
        </div>
        <div>
          <h4 className="text-lg font-black text-white leading-tight">Portable Mini Blender</h4>
          <p className="text-[10px] font-black text-sky-500 uppercase tracking-widest">Kitchen Accessories</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 relative z-10">
        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Opp. Score</p>
          <p className="text-2xl font-black text-emerald-500">91<span className="text-xs text-gray-500 ml-1">/100</span></p>
        </div>
        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Est. Profit</p>
          <p className="text-2xl font-black text-white">$7.20</p>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 relative z-10">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-amber-500" />
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Competition</span>
        </div>
        <span className="text-xs font-black text-amber-500 uppercase tracking-widest">Medium</span>
      </div>

      <button className="w-full py-4 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl font-black text-sm transition-all shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 relative z-10">
        Analyze Full Potential <ArrowUpRight className="w-4 h-4" />
      </button>
    </div>
  </div>
);

export const AnalyticsChart = () => (
  <div className="glass-card p-8 space-y-8">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="space-y-1">
        <h3 className="text-2xl font-black text-white tracking-tight">Product Analysis Overview</h3>
        <p className="text-gray-500 font-medium">Daily performance metrics of AI discovery tools.</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-sky-500" />
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Analyzed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Profitable</span>
        </div>
      </div>
    </div>

    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorAnalyzed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorProfitable" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900 }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900 }} 
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1e293b', 
              border: '1px solid rgba(255,255,255,0.05)', 
              borderRadius: '1rem',
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
            }}
            itemStyle={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase' }}
          />
          <Area 
            type="monotone" 
            dataKey="analyzed" 
            stroke="#0ea5e9" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorAnalyzed)" 
            animationDuration={2000}
          />
          <Area 
            type="monotone" 
            dataKey="profitable" 
            stroke="#10b981" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorProfitable)" 
            animationDuration={2000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export const PerformanceMetrics = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {[
      { label: "Products Analyzed Today", value: 124, icon: Search, color: "text-sky-500", bg: "bg-sky-500/10" },
      { label: "Profitable Opportunities", value: 18, icon: Zap, color: "text-amber-500", bg: "bg-amber-500/10" },
      { label: "Niches Discovered", value: 7, icon: Compass, color: "text-indigo-500", bg: "bg-indigo-500/10" },
      { label: "Suppliers Analyzed", value: 42, icon: Package, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    ].map((stat, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.1 }}
        className="premium-card p-6 group"
      >
        <div className="flex items-center gap-4">
          <div className={cn("w-12 h-12 glow-icon", stat.bg)}>
            <stat.icon className={cn("w-6 h-6", stat.color)} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{stat.label}</p>
            <div className="flex items-baseline gap-1">
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-2xl font-black text-white"
              >
                {stat.value}
              </motion.p>
              <span className="text-[10px] font-black text-emerald-500">+12%</span>
            </div>
          </div>
        </div>
      </motion.div>
    ))}
  </div>
);

export const OpportunityRadar = () => (
  <div className="glass-card p-8 space-y-8">
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <h3 className="text-2xl font-black text-white tracking-tight">Market Opportunity Radar</h3>
        <p className="text-gray-500 font-medium">Categories with the strongest current potential.</p>
      </div>
      <div className="w-12 h-12 rounded-2xl bg-sky-500/10 flex items-center justify-center border border-sky-500/20">
        <Target className="w-7 h-7 text-sky-500" />
      </div>
    </div>

    <div className="space-y-6">
      {radarData.map((item, i) => (
        <div key={i} className="space-y-2">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <p className="text-sm font-black text-white">{item.category}</p>
              <p className={cn("text-[10px] font-black uppercase tracking-widest", 
                item.level === 'High' ? 'text-emerald-500' : 
                item.level === 'Rising' ? 'text-sky-500' : 
                item.level === 'Medium' ? 'text-amber-500' : 'text-rose-500'
              )}>{item.level} Potential</p>
            </div>
            <span className="text-xs font-black text-gray-500">{item.value}%</span>
          </div>
          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${item.value}%` }}
              transition={{ duration: 1.5, delay: i * 0.2 }}
              className={cn("h-full rounded-full", item.color)}
            />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const AIInsightsSummary = () => (
  <div className="glass-card p-8 space-y-8">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
        <BrainCircuit className="w-6 h-6 text-indigo-500" />
      </div>
      <h3 className="text-xl font-black text-white tracking-tight">AI Insights Summary</h3>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[
        { label: "Best Niche Detected", value: "Pet Travel Accessories", icon: Compass, color: "text-sky-500" },
        { label: "Highest ROI Product", value: "Portable Blender", icon: TrendingUp, color: "text-emerald-500" },
        { label: "Supplier Trust Avg", value: "89/100", icon: CheckCircle2, color: "text-amber-500" },
      ].map((insight, i) => (
        <div key={i} className="p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-white/10 transition-all group">
          <div className="flex items-center gap-4 mb-4">
            <div className={cn("w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform", insight.color)}>
              <insight.icon className="w-5 h-5" />
            </div>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{insight.label}</p>
          </div>
          <p className="text-lg font-black text-white leading-tight">{insight.value}</p>
        </div>
      ))}
    </div>
  </div>
);

const Sparkles = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
  </svg>
);
