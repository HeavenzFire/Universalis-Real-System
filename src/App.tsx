/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { 
  GitBranch, Globe, Database, DollarSign, Activity, 
  ShieldAlert, Send, Plus, Terminal, RefreshCw, 
  Lock, CheckCircle2, MessageSquare, AlertTriangle, 
  Sparkles, FileText, Download, HelpCircle, User, 
  CornerDownRight, Check, CheckSquare, Edit3
} from 'lucide-react';

import { INITIAL_REALLOCATIONS, MAAT_PROTOCOLS, ARCHITECT_COMMENTS } from './data';
import { DividendReallocation, ProtocolFile, ArchitectComment, WhistleblowerReport } from './types';
import DividendTracker from './components/DividendTracker';
import MaatRepository from './components/MaatRepository';

export default function App() {
  // Application State
  const [reallocations, setReallocations] = useState<DividendReallocation[]>(INITIAL_REALLOCATIONS);
  const [protocols, setProtocols] = useState<ProtocolFile[]>(MAAT_PROTOCOLS);
  const [comments, setComments] = useState<ArchitectComment[]>(ARCHITECT_COMMENTS);
  const [activeTab, setActiveTab] = useState<'tracker' | 'repository'>('tracker');
  const [systemLogs, setSystemLogs] = useState<Array<{ time: string; msg: string; type: 'info' | 'success' | 'warn' | 'fincen' }>>([
    { time: '04:15:45', msg: 'MIRROR: Manifestation layer 4 confirmed on-chain.', type: 'success' },
    { time: '04:20:11', msg: 'COMMIT: Updated manifestation_blueprint.md via OpenGovOS.', type: 'info' },
    { time: '04:31:12', msg: 'HDX: Real-time resource reallocation datasets live synced.', type: 'info' },
    { time: '04:32:05', msg: 'SYSTEM: Active monitoring of $93B Hunger Dividend initiated.', type: 'warn' },
  ]);

  // Live Clock State
  const [utcTime, setUtcTime] = useState<string>('04:31:12');
  useEffect(() => {
    const timer = setInterval(() => {
      const d = new Date();
      setUtcTime(d.toUTCString().replace('GMT', 'UTC'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Form State for Whistleblower Portal
  const [selectedSector, setSelectedSector] = useState<string>('Agriculture & Food Security');
  const [targetAgency, setTargetAgency] = useState<string>('Defense Procurement (Excess Offsets)');
  const [dividendAmount, setDividendAmount] = useState<number>(12.5);
  const [formatType, setFormatType] = useState<string>('Mirror Manifest Protocol');
  const [additionalNotes, setAdditionalNotes] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedReport, setGeneratedReport] = useState<string | null>(null);
  const [activeReport, setActiveReport] = useState<WhistleblowerReport | null>(null);

  // Comments Input State
  const [selectedFileForComment, setSelectedFileForComment] = useState<string>('opengov-protocol.sol');
  const [commentLineNumber, setCommentLineNumber] = useState<number>(12);
  const [commentAuthor, setCommentAuthor] = useState<string>('Architect Alpha');
  const [commentText, setCommentText] = useState<string>('');

  // Auto-scroller for log events
  const addLog = (msg: string, type: 'info' | 'success' | 'warn' | 'fincen' = 'info') => {
    const now = new Date();
    const timeString = now.toTimeString().split(' ')[0];
    setSystemLogs(prev => [
      { time: timeString, msg, type },
      ...prev
    ]);
  };

  // Trigger Reallocation action
  const handleTriggerReallocation = (id: string) => {
    setReallocations(prev => 
      prev.map(item => {
        if (item.id === id) {
          const nextStatus = item.status === 'PENDING' ? 'ROUTING' : 
                             item.status === 'ROUTING' ? 'REALLOCATED' : 'IMMUTABLE';
          const nextProgress = nextStatus === 'REALLOCATED' ? 100 : Math.min(100, item.progressPercentage + 25);
          
          addLog(`PROTOCOL ${id}: Status updated to ${nextStatus}. Progress: ${nextProgress}%`, 'success');
          
          return {
            ...item,
            status: nextStatus,
            progressPercentage: nextProgress,
            timestamp: new Date().toISOString()
          };
        }
        return item;
      })
    );
  };

  // Generate Automated Report using server API
  const generateReport = async () => {
    setIsGenerating(true);
    setGeneratedReport(null);
    addLog(`AI: Querying Gemini API for ${selectedSector} exposure report...`, 'warn');

    try {
      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sector: selectedSector,
          dividendAmount,
          agency: targetAgency,
          formatType,
          additionalNotes,
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate report');
      }

      setGeneratedReport(data.report);
      addLog(`AI: Report successfully drafted for ${selectedSector}. Ready for Mirror storage.`, 'success');

      // Set active report structure
      setActiveReport({
        id: `REP-${Math.floor(1000 + Math.random() * 9000)}`,
        sector: selectedSector,
        agency: targetAgency,
        dividendAmount,
        formatType,
        additionalNotes,
        reportContent: data.report,
        status: 'COMPLETED',
        timestamp: new Date().toISOString()
      });

    } catch (err: any) {
      console.error(err);
      const errMessage = err.message || 'An unexpected error occurred';
      setGeneratedReport(`### ⚠️ Protocol Disruption Detected\n\nUnable to initialize the server-side Gemini intelligence models. \n\n**Details:** ${errMessage}\n\n*Action Required: Verify your server environment configuration and ensure the \`GEMINI_API_KEY\` is accurately registered in the secrets panel.*`);
      addLog(`ERROR: Report generation failed. Missing/Invalid API parameters.`, 'warn');
    } finally {
      setIsGenerating(false);
    }
  };

  // File Report (Submit to FinCEN / Mirror / HDX)
  const handleFileReport = () => {
    if (!activeReport) return;
    
    // Simulate filing
    const txHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    
    // Update active report status
    setActiveReport(prev => prev ? { ...prev, status: 'FILED', txHash } : null);
    addLog(`FinCEN: Submitted whistleblower packet under 2026 incentives. Protection Active!`, 'fincen');
    addLog(`MIRROR: Generated report hash stored immutably on-chain: ${txHash.slice(0, 10)}...`, 'success');

    // Add new reallocation dynamically based on this whistleblower report!
    const newReallocation: DividendReallocation = {
      id: `DIV-${Math.floor(105 + Math.random() * 800)}`,
      sector: selectedSector,
      sourceAgency: targetAgency,
      amountBillion: dividendAmount,
      recipientProgram: `Decentralized Resource Feed - ${selectedSector}`,
      status: 'PENDING',
      progressPercentage: 10,
      timestamp: new Date().toISOString(),
      hash: txHash.slice(0, 12)
    };

    setReallocations(prev => [newReallocation, ...prev]);
  };

  // Add Comment/Annotation
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment: ArchitectComment = {
      id: `AC-${Math.floor(100 + Math.random() * 900)}`,
      fileName: selectedFileForComment,
      lineNumber: commentLineNumber,
      author: commentAuthor,
      text: commentText,
      timestamp: new Date().toISOString()
    };

    setComments(prev => [newComment, ...prev]);
    addLog(`ANNOTATION: added on ${selectedFileForComment} at line ${commentLineNumber} by ${commentAuthor}.`, 'info');
    setCommentText('');

    // Append to file content dynamically if it's open
    setProtocols(prev => prev.map(file => {
      if (file.name === selectedFileForComment) {
        const commentLine = `\n// [ANNOTATION by ${commentAuthor}]: ${commentText}\n`;
        return {
          ...file,
          content: file.content + commentLine,
          linesOfCode: file.linesOfCode + 2
        };
      }
      return file;
    }));
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 flex flex-col relative font-sans text-slate-100 overflow-x-hidden selection:bg-cyan-500/30 selection:text-white">
      {/* Decorative Blur Background Spheres for Frosted Glass vibe */}
      <div className="absolute top-[-5%] left-[-5%] w-[45vw] h-[45vw] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-[-5%] right-[-5%] w-[40vw] h-[40vw] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-[35%] right-[10%] w-[35vw] h-[35vw] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none"></div>

      {/* HEADER MATCHING FROSTED GLASS SCHEMA */}
      <header className="h-20 w-full flex items-center justify-between px-6 md:px-10 border-b border-white/10 backdrop-blur-md bg-white/5 z-20">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-tr from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20 shrink-0">
            <span className="text-xs font-black tracking-tighter text-white">URS</span>
          </div>
          <div>
            <h1 className="text-base md:text-lg font-bold tracking-tight uppercase font-heading text-slate-100 flex items-center gap-2">
              Universalis Real System
              <span className="text-[9px] bg-cyan-500/20 text-cyan-400 px-1.5 py-0.5 rounded font-mono font-normal">PROTOTYPE V6</span>
            </h1>
            <p className="text-[9px] md:text-[10px] text-cyan-400 font-mono tracking-[0.2em] uppercase">HeavenzFire Overhaul Protocol</p>
          </div>
        </div>

        <div className="flex gap-4 md:gap-6 items-center">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[9px] text-slate-400 uppercase tracking-widest">System Status</span>
            <span className="text-xs text-emerald-400 font-mono flex items-center gap-1.5 font-semibold">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
              DEPLOYMENT LIVE
            </span>
          </div>
          <div className="hidden sm:block h-8 w-[1px] bg-white/10"></div>
          <div className="text-right">
            <p className="text-xs font-mono text-slate-200">2026_VERIFIED_AUTH</p>
            <p className="text-[10px] text-slate-400 font-mono">{utcTime}</p>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto grid grid-cols-1 xl:grid-cols-4 gap-6 p-4 md:p-8 z-10">
        
        {/* LEFT COLUMN: MANIFESTATION BLUEPRINT */}
        <div className="xl:col-span-1 flex flex-col gap-6">
          <section className="backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 p-6 flex flex-col h-full justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-heading">Manifestation Blueprint</h2>
                <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">IMMUTABLE</span>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-cyan-500/30 transition-all group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[9px] font-mono text-cyan-400">GITHUB (OPENGOVOS)</span>
                    <span className="text-[8px] bg-cyan-400/20 text-cyan-400 px-2 py-0.5 rounded font-mono font-bold">ACTIVE</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors">OpenGovOS Codebase</p>
                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">Public core protocols and decentralized smart contracts. Transparently audited.</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-purple-500/30 transition-all group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[9px] font-mono text-purple-400">MIRROR WRITER</span>
                    <span className="text-[8px] bg-purple-400/20 text-purple-400 px-2 py-0.5 rounded font-mono font-bold">PUBLIC</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-200 group-hover:text-purple-300 transition-colors">HeavenzFire Manifest</p>
                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">Decentralized sovereign documentation and budgetary audit records. Permanently cached.</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-orange-500/30 transition-all group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[9px] font-mono text-orange-400">HUMANITARIAN DATA EXCHANGE (HDX)</span>
                    <span className="text-[8px] bg-orange-400/20 text-orange-400 px-2 py-0.5 rounded font-mono font-bold">LIVE SYNC</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-200 group-hover:text-orange-300 transition-colors">Resource Reallocation Datasets</p>
                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">Sovereign calorie delivery matrix connected via decentralized peer nodes.</p>
                </div>
              </div>
            </div>

            {/* ARCHITECTS COMMENT COLLABORATION SUB-PANEL */}
            <div className="mt-6 pt-5 border-t border-white/10 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold font-mono text-slate-300">
                <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                <span>ARCHITECT COLLABORATION</span>
              </div>
              <p className="text-[10px] text-slate-400">Join the mission. Add zero-knowledge annotations to repository files:</p>
              
              <form onSubmit={handleAddComment} className="space-y-2 bg-white/5 p-3 rounded-xl border border-white/5">
                <div className="grid grid-cols-2 gap-1.5">
                  <select 
                    value={selectedFileForComment} 
                    onChange={(e) => setSelectedFileForComment(e.target.value)}
                    className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-[9px] text-slate-300 font-mono"
                  >
                    {protocols.map(p => (
                      <option key={p.name} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                  <input 
                    type="number" 
                    placeholder="Line #" 
                    value={commentLineNumber} 
                    onChange={(e) => setCommentLineNumber(parseInt(e.target.value) || 1)}
                    className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-[9px] text-slate-300 font-mono"
                  />
                </div>
                
                <input 
                  type="text" 
                  placeholder="Architect Identifier (Sovereign)" 
                  value={commentAuthor} 
                  onChange={(e) => setCommentAuthor(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded px-2 py-1 text-[10px] text-slate-200 font-mono"
                  required
                />
                
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Type encryption annotation..." 
                    value={commentText} 
                    onChange={(e) => setCommentText(e.target.value)}
                    className="w-full bg-slate-900/60 border border-white/10 rounded-lg pl-2 pr-8 py-1.5 text-[10px] text-slate-100"
                    required
                  />
                  <button 
                    type="submit" 
                    className="absolute right-1.5 top-1.5 text-cyan-400 hover:text-cyan-300 transition-colors"
                    title="Publish Annotation"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>

              {/* Display recent comments log */}
              <div className="max-h-24 overflow-y-auto space-y-1.5 text-[9px] pr-1 font-mono">
                {comments.slice(0, 4).map(cmt => (
                  <div key={cmt.id} className="border-b border-white/5 pb-1">
                    <span className="text-cyan-400 font-bold">{cmt.author}</span>
                    <span className="text-slate-500"> on {cmt.fileName}:{cmt.lineNumber}</span>
                    <p className="text-slate-300 mt-0.5 truncate">{cmt.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* MIDDLE COLUMN: REDISTRIBUTION METRICS & PROTOCOL SELECTIONS */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          
          {/* TOP UPPER BANNER: $93B HUNGER DIVIDEND */}
          <section className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 p-6 md:p-8 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none"></div>
            
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-[0.3em] font-mono">Hunger Dividend Redistribution</h3>
                <p className="text-[10px] text-slate-400 uppercase font-mono tracking-widest">REAL-TIME SURPLUS EXPOSURE</p>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded flex items-center gap-1">
                <ShieldAlert className="w-3 h-3 text-emerald-400" />
                SOVEREIGN REVENUE ESCROW
              </span>
            </div>

            <div className="flex items-baseline gap-3 mt-4">
              <span className="text-3xl md:text-5xl lg:text-6xl font-light tracking-tighter text-slate-100 font-heading">
                $93,420,112,000
              </span>
              <span className="text-emerald-400 text-sm md:text-base font-mono font-bold animate-pulse">
                +2.4% ACTIVE RECONCILIATION
              </span>
            </div>

            <p className="text-slate-300 text-xs md:text-sm mt-3 leading-relaxed">
              Real-time asset reallocations mapped directly from global military over-invoicing budgets. 
              Deploying verified, on-chain feeds to decentralized local food nodes.
            </p>
          </section>

          {/* MAIN COMPONENT SELECTOR TAB & PANEL */}
          <div className="flex-1 flex flex-col min-h-[480px]">
            {/* Nav Tabs */}
            <div className="flex border-b border-white/10 mb-4 font-mono text-xs gap-4">
              <button
                onClick={() => setActiveTab('tracker')}
                className={`pb-2.5 px-2 relative transition-all ${
                  activeTab === 'tracker'
                    ? 'text-cyan-400 font-bold border-b-2 border-cyan-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                DIVIDEND LEDGER GRAPH
              </button>
              <button
                onClick={() => setActiveTab('repository')}
                className={`pb-2.5 px-2 relative transition-all ${
                  activeTab === 'repository'
                    ? 'text-purple-400 font-bold border-b-2 border-purple-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                DECENTRALIZED MAAT REPOSITORY
              </button>
            </div>

            {/* TAB PANELS */}
            <div className="flex-1">
              {activeTab === 'tracker' ? (
                <DividendTracker 
                  reallocations={reallocations} 
                  onTriggerReallocation={handleTriggerReallocation} 
                />
              ) : (
                <MaatRepository 
                  protocols={protocols} 
                />
              )}
            </div>
          </div>

          {/* EVENT ACTIVITY TIMELINE: REPOSITORY ACTIVITY */}
          <section className="backdrop-blur-xl bg-slate-900/40 rounded-3xl border border-white/10 p-6 flex flex-col h-60">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-heading">Repository Activity</h2>
              </div>
              <span className="text-[9px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">P2P ENCRYPTED SYNC</span>
            </div>

            <div className="flex-1 space-y-3 font-mono text-[11px] overflow-y-auto pr-1">
              {systemLogs.map((log, index) => (
                <div key={index} className="flex gap-4 p-2 border-b border-white/5 items-start">
                  <span className="text-cyan-400 shrink-0">[{log.time}]</span>
                  <div className="flex-1 text-slate-200">
                    <span className={`text-[9px] uppercase px-1 py-0.2 rounded mr-1.5 shrink-0 ${
                      log.type === 'success' ? 'bg-emerald-950/40 text-emerald-400' :
                      log.type === 'warn' ? 'bg-amber-950/40 text-amber-400' :
                      log.type === 'fincen' ? 'bg-cyan-950/40 text-cyan-400' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {log.type}
                    </span>
                    {log.msg}
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* RIGHT COLUMN: WHISTLEBLOWER PORTAL & PHASE CONTROLS */}
        <div className="xl:col-span-1 flex flex-col gap-6">
          {/* WHISTLEBLOWER PORTAL STATUS */}
          <section className="backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-heading">Whistleblower Portal</h2>
              <span className="text-[8px] bg-red-400/20 text-red-400 border border-red-500/20 px-2 py-0.5 rounded font-mono">SECURE</span>
            </div>

            <div className="flex flex-col items-center justify-center py-2">
              <div className="w-14 h-14 rounded-full border-2 border-dashed border-cyan-500/40 flex items-center justify-center mb-3">
                <div className="w-10 h-10 bg-cyan-500/10 rounded-full flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-pulse"></div>
                </div>
              </div>
              <p className="text-xs font-bold text-slate-200">FinCEN Portal Primed</p>
              <p className="text-[10px] text-slate-400 text-center mt-1 px-1 leading-relaxed">
                Legally binding systemic budget crime reports prepared for automated filing under 2026 guidelines.
              </p>
            </div>

            {/* INTERACTIVE FORM PANEL */}
            <div className="space-y-3 bg-white/5 p-3 rounded-2xl border border-white/5 text-xs">
              <div className="space-y-1">
                <label className="text-[9px] font-mono text-slate-400 block uppercase">Exposure Target Sector</label>
                <select
                  value={selectedSector}
                  onChange={(e) => {
                    setSelectedSector(e.target.value);
                    // Match default target agency based on sector selection
                    if (e.target.value === 'Agriculture & Food Security') {
                      setTargetAgency('Defense Procurement (Excess Offsets)');
                    } else if (e.target.value === 'Clean Water Infrastructure') {
                      setTargetAgency('Fossil Fuel Subsidies Reallocation');
                    } else if (e.target.value === 'Education & Digital Public Goods') {
                      setTargetAgency('Systemic Administrative Discrepancy Fund');
                    } else {
                      setTargetAgency('Special Draw Rights (SDR) Discrepancy Recovery');
                    }
                  }}
                  className="w-full bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-slate-200 font-mono"
                >
                  <option value="Agriculture & Food Security">Agriculture & Food Security</option>
                  <option value="Clean Water Infrastructure">Clean Water Infrastructure</option>
                  <option value="Education & Digital Public Goods">Education & Digital Public Goods</option>
                  <option value="Sovereign Health & Nutrition">Sovereign Health & Nutrition</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-mono text-slate-400 block uppercase">Target Audit Entity</label>
                <input
                  type="text"
                  value={targetAgency}
                  onChange={(e) => setTargetAgency(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-slate-200 font-mono"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[9px] font-mono">
                  <span className="text-slate-400 uppercase">REALLOCATION SUM</span>
                  <span className="text-cyan-400 font-bold">${dividendAmount}B USD</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  step="0.5"
                  value={dividendAmount}
                  onChange={(e) => setDividendAmount(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 bg-slate-800 rounded-lg h-1.5 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-mono text-slate-400 block uppercase">Report Format</label>
                <select
                  value={formatType}
                  onChange={(e) => setFormatType(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-slate-200 font-mono"
                >
                  <option value="FinCEN Whistleblower Portal Document">FinCEN Whistleblower Portal Document</option>
                  <option value="Mirror Manifest Protocol">Mirror Manifest Protocol</option>
                  <option value="HDX Human Resource Log">HDX Human Resource Log</option>
                  <option value="OpenGovOS Ledger Entry">OpenGovOS Ledger Entry</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-mono text-slate-400 block uppercase">Additional Evidence / Comments</label>
                <textarea
                  rows={2}
                  placeholder="Insert additional budgetary audit evidence..."
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-slate-200 placeholder-slate-500 text-[11px]"
                />
              </div>
            </div>
          </section>
          
          {/* CONTROL SWITCHBOARD ACTION AREA */}
          <section className="flex-1 backdrop-blur-xl bg-gradient-to-b from-blue-600/20 to-purple-600/20 rounded-3xl border border-white/20 p-6 flex flex-col justify-end gap-4 min-h-[250px]">
            <div>
              <p className="text-[10px] text-white/60 uppercase tracking-[0.2em] mb-1 font-mono">CURRENT OBJECTIVE</p>
              <h3 className="text-base md:text-lg font-bold leading-tight text-slate-100 font-heading">
                Initiate Phase 6: Public Exposure?
              </h3>
              <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                Generate the first automated report for the Mirror manifest and file the formal systemic budget crimes packet.
              </p>
            </div>

            <div className="space-y-2 mt-2">
              <button
                onClick={generateReport}
                disabled={isGenerating}
                className="w-full py-3 bg-white text-slate-950 hover:bg-cyan-400 transition-colors text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-white/5 active:scale-95 duration-100 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    GENERATING EXPOSURE REPORT...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    GENERATE AUTOMATED REPORT
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setActiveTab('repository');
                  setSelectedFileForComment('opengov-protocol.sol');
                  addLog("NAVIGATION: Opened codes for Architect annotation", "info");
                }}
                className="w-full py-3 bg-white/10 text-white hover:bg-white/15 text-xs font-bold rounded-xl border border-white/10 flex items-center justify-center gap-1.5 active:scale-95 duration-100"
              >
                <Edit3 className="w-3.5 h-3.5 text-purple-400" />
                ANNOTATE GITHUB COMMENTS
              </button>
            </div>
          </section>
        </div>

      </main>

      {/* GENERATED REPORT PANEL DRAWERS / DIALOGS */}
      <AnimatePresence>
        {generatedReport && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-slate-900 border border-white/15 rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl shadow-cyan-500/5 overflow-hidden"
            >
              {/* Report Header */}
              <div className="p-5 border-b border-white/10 bg-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400 border border-cyan-500/20">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100 uppercase font-mono">SOVEREIGN EXPOSURE REPORT DRAFT</h4>
                    <p className="text-[10px] text-slate-400 font-mono">TARGET: {targetAgency} • {dividendAmount}B USD</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-mono px-2 py-0.5 rounded ${
                    activeReport?.status === 'FILED' ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/30' : 'bg-amber-950/40 text-amber-400 border border-amber-500/30 animate-pulse'
                  }`}>
                    {activeReport?.status || 'DRAFT'}
                  </span>
                  
                  <button 
                    onClick={() => setGeneratedReport(null)}
                    className="p-1 text-slate-400 hover:text-white transition-colors rounded hover:bg-white/5"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Report Scroll Area */}
              <div className="p-6 overflow-y-auto flex-1 prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed scrollbar font-sans">
                <ReactMarkdown>{generatedReport}</ReactMarkdown>
              </div>

              {/* Action Footer */}
              <div className="p-5 border-t border-white/10 bg-white/5 flex items-center justify-between flex-wrap gap-4">
                <div className="text-xs text-slate-400 font-mono max-w-sm">
                  {activeReport?.status === 'FILED' ? (
                    <div className="space-y-1">
                      <span className="text-emerald-400 block font-semibold flex items-center gap-1">
                        <Check className="w-4 h-4" /> FILING COMPLETE
                      </span>
                      <span className="text-[9px] block truncate text-slate-500">TXID: {activeReport.txHash}</span>
                    </div>
                  ) : (
                    <span>This report will be immutably stored on the Mirror protocol and forwarded to the FinCEN whistleblower registry.</span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setGeneratedReport(null)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-slate-100 rounded-xl transition-all text-xs font-semibold"
                  >
                    DISMISS
                  </button>

                  {activeReport?.status !== 'FILED' && (
                    <button
                      onClick={handleFileReport}
                      className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white rounded-xl transition-all text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-500/10 active:scale-95 duration-100"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      FILE WITH FINCEN & DEPLOY ON-CHAIN
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <footer className="h-12 border-t border-white/10 flex items-center px-6 md:px-10 backdrop-blur-md bg-white/5 text-[10px] font-mono text-slate-400 z-20 mt-auto overflow-x-auto whitespace-nowrap">
        <div className="flex gap-6 md:gap-8">
          <span>GLOBAL REPOSITORY: <span className="text-emerald-400 font-bold">LIVE</span></span>
          <span>AUDIT: <span className="text-cyan-400 font-bold">2026-VERIFIED</span></span>
          <span>FORKABLE BY: <span className="text-indigo-400 font-bold">THE PEOPLE</span></span>
          <span>NETWORK: <span className="text-purple-400 font-bold">DECENTRALIZED</span></span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>CONNECTION SECURED [P2P-256]</span>
        </div>
      </footer>
    </div>
  );
}
