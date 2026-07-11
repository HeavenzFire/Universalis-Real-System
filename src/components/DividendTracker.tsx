/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, 
  BarChart, Bar, XAxis, YAxis, Legend 
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { 
  DollarSign, TrendingUp, Shield, Activity, 
  ArrowRight, CheckCircle2, RotateCw, AlertTriangle 
} from 'lucide-react';
import { DividendReallocation } from '../types';

interface DividendTrackerProps {
  reallocations: DividendReallocation[];
  onTriggerReallocation: (id: string) => void;
}

const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'];

export default function DividendTracker({ reallocations, onTriggerReallocation }: DividendTrackerProps) {
  const [tickerAmount, setTickerAmount] = useState(93000000000);
  const [selectedItem, setSelectedItem] = useState<DividendReallocation | null>(null);

  // Micro-animations for the live counter
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerAmount(prev => prev + Math.floor(Math.random() * 20) + 1);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  const totalAllocated = reallocations.reduce((sum, item) => sum + item.amountBillion, 0);
  const totalImmutable = reallocations
    .filter(item => item.status === 'IMMUTABLE' || item.status === 'REALLOCATED')
    .reduce((sum, item) => sum + item.amountBillion, 0);

  // Format money nicely
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Recharts data preparing
  const chartData = reallocations.map(item => ({
    name: item.sector,
    value: item.amountBillion,
    status: item.status
  }));

  const barChartData = reallocations.map(item => ({
    name: item.id,
    'Allocated ($B)': item.amountBillion,
    'Progress (%)': item.progressPercentage
  }));

  return (
    <div className="space-y-6" id="dividend-tracker-section">
      {/* Real-time Ticker Banner */}
      <div className="bg-slate-900 border border-emerald-500/30 rounded-xl p-6 relative overflow-hidden" id="ticker-banner">
        <div className="absolute top-0 right-0 p-3 text-xs font-mono text-emerald-400 bg-emerald-950/40 rounded-bl-lg flex items-center gap-1 border-l border-b border-emerald-500/20">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          REAL-TIME PROTOCOL SYNCED
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 items-center">
          <div className="space-y-1">
            <h3 className="text-xs font-mono text-emerald-400 uppercase tracking-widest">Global Maat Dividend Ledger</h3>
            <p className="text-sm text-slate-400">Total verified budget exposure diversion to direct food & water security channels.</p>
          </div>
          
          <div className="md:col-span-2 flex flex-col md:items-end justify-center">
            <span className="text-xs font-mono text-slate-500">LIQUID ALLOCATION ESCROW (USD)</span>
            <span className="text-3xl md:text-4xl font-mono text-emerald-400 font-bold tracking-tight">
              {formatCurrency(tickerAmount)}
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Key Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" id="stats-grid">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 bg-emerald-950/50 text-emerald-400 rounded-lg border border-emerald-500/20">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-mono">TARGET HUNGER DIVIDEND</p>
            <p className="text-xl font-semibold text-slate-100">$93.0 Billion</p>
          </div>
        </div>
        
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 bg-blue-950/50 text-blue-400 rounded-lg border border-blue-500/20">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-mono">CURRENTLY ALLOCATED</p>
            <p className="text-xl font-semibold text-slate-100">${totalAllocated.toFixed(1)} Billion</p>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 bg-purple-950/50 text-purple-400 rounded-lg border border-purple-500/20">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-mono">VERIFIED IMMUTABLE</p>
            <p className="text-xl font-semibold text-slate-100">${totalImmutable.toFixed(1)} Billion</p>
          </div>
        </div>
      </div>

      {/* Interactive Visualisation and Reallocation List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="visualization-grid">
        {/* Left Side: Distribution Charts */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 space-y-6">
          <h4 className="text-sm font-semibold font-mono text-slate-300 border-b border-slate-800 pb-3 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-500" />
            PROTOCOL ALLOCATION GRAPH
          </h4>
          
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                  itemStyle={{ color: '#f1f5f9' }}
                />
                <Legend 
                  layout="vertical" 
                  verticalAlign="middle" 
                  align="right"
                  wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                  itemStyle={{ color: '#f1f5f9' }}
                />
                <Bar dataKey="Allocated ($B)" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Side: Reallocation Ledger Control Panel */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 space-y-4">
          <h4 className="text-sm font-semibold font-mono text-slate-300 border-b border-slate-800 pb-3 flex items-center justify-between">
            <span>SOVEREIGN DISPATCH REGISTRY</span>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">EPOCH 3 ACTIVE</span>
          </h4>

          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1" id="reallocation-list">
            {reallocations.map((item) => (
              <div 
                key={item.id}
                onClick={() => setSelectedItem(selectedItem?.id === item.id ? null : item)}
                className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
                  selectedItem?.id === item.id 
                    ? 'bg-slate-900 border-emerald-500/40 shadow-lg shadow-emerald-500/5' 
                    : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/70'
                }`}
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-emerald-400 font-bold">{item.id}</span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs font-mono text-slate-500 max-w-[160px] truncate">{item.sourceAgency}</span>
                    </div>
                    <h5 className="text-sm font-medium text-slate-200">{item.sector}</h5>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-mono font-bold text-slate-100">${item.amountBillion}B</span>
                    <div className="mt-1">
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                        item.status === 'IMMUTABLE' ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/30' :
                        item.status === 'REALLOCATED' ? 'bg-blue-950/40 text-blue-400 border border-blue-500/30' :
                        item.status === 'ROUTING' ? 'bg-purple-950/40 text-purple-400 border border-purple-500/30' :
                        'bg-amber-950/40 text-amber-400 border border-amber-500/30'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expanded Details Panel */}
                <AnimatePresence>
                  {selectedItem?.id === item.id && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden mt-3 pt-3 border-t border-slate-800 space-y-2.5 text-xs text-slate-400"
                    >
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-slate-500 font-mono block text-[10px]">RECIPIENT INITIATIVE</span>
                          <span className="text-slate-300 font-medium">{item.recipientProgram}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-mono block text-[10px]">VERIFICATION KEY</span>
                          <span className="text-slate-300 font-mono block truncate">{item.hash}</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-mono text-slate-500">
                          <span>ROUTING CONDUIT</span>
                          <span>{item.progressPercentage}% COMPLETE</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                            style={{ width: `${item.progressPercentage}%` }}
                          />
                        </div>
                      </div>

                      {item.status !== 'IMMUTABLE' && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onTriggerReallocation(item.id);
                          }}
                          className="w-full mt-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:border-emerald-500/50 py-1.5 px-3 rounded-md font-mono text-[10px] uppercase flex items-center justify-center gap-1.5 transition-all"
                        >
                          <RotateCw className="w-3 h-3 animate-spin-slow" />
                          PROMPT PROTOCOL REDISTRIBUTION
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
