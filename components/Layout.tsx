
import React, { useState } from 'react';
import { AgentMode, AgentLog, Theme } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeMode: AgentMode;
  onModeChange: (mode: AgentMode) => void;
  userLanguage: string;
  onLanguageChange: (lang: string) => void;
  agentLogs: AgentLog[];
  theme: Theme;
  onThemeToggle: () => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeMode, 
  onModeChange, 
  userLanguage, 
  onLanguageChange, 
  agentLogs,
  theme,
  onThemeToggle
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogs, setShowLogs] = useState(false);

  const isDark = theme === 'dark';

  const navItems = [
    { mode: AgentMode.VISION, icon: 'fa-eye', label: 'Visual Audit' },
    { mode: AgentMode.DASHBOARD, icon: 'fa-chart-pie', label: 'Overview' },
    { mode: AgentMode.STRATEGY, icon: 'fa-brain', label: 'Forecaster' },
    { mode: AgentMode.NEGOTIATOR, icon: 'fa-handshake', label: 'Negotiator' },
    { mode: AgentMode.MARKETING, icon: 'fa-bullhorn', label: 'Marketing' },
  ];

  const bgColor = isDark ? 'bg-[#0a0f18]' : 'bg-slate-50';
  const panelColor = isDark ? 'bg-[#0d1421]' : 'bg-white';
  const textColor = isDark ? 'text-slate-100' : 'text-slate-900';
  const borderColor = isDark ? 'border-white/5' : 'border-slate-200';
  const subTextColor = isDark ? 'text-slate-500' : 'text-slate-400';

  return (
    <div className={`flex h-screen w-full ${bgColor} ${textColor} overflow-hidden fixed inset-0 font-['Inter'] transition-colors duration-500`}>
      {/* Sidebar - Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 ${panelColor} border-r ${borderColor} transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-black text-emerald-500 flex items-center gap-2 tracking-tighter">
              <i className="fa-solid fa-microchip animate-pulse"></i>
              SUPPLYCHAIN.AI
            </h1>
            <button className="md:hidden text-slate-400" onClick={() => setIsMobileMenuOpen(false)}>
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          <p className={`text-[10px] ${subTextColor} mt-2 uppercase tracking-[0.3em] font-black`}>Autonomous OS</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-6 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.mode}
              onClick={() => {
                onModeChange(item.mode);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                activeMode === item.mode 
                  ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]' 
                  : `${isDark ? 'text-slate-400 hover:bg-white/5 hover:text-slate-100' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`
              }`}
            >
              <i className={`fa-solid ${item.icon} w-5 text-base`}></i>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 mt-auto">
          <button 
            onClick={() => setShowLogs(!showLogs)}
            className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl ${isDark ? 'bg-white/5 text-white' : 'bg-slate-100 text-slate-900'} text-[10px] font-black uppercase tracking-widest hover:opacity-80 transition-all border ${borderColor}`}
          >
            <span>Orchestration Log</span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <i className={`fa-solid ${showLogs ? 'fa-chevron-down' : 'fa-terminal'}`}></i>
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Solo Performance Dashboard - Bottom Left Corner */}
        <div className="fixed bottom-6 left-6 z-[60] pointer-events-none hidden lg:block">
          <div className={`${isDark ? 'bg-[#0d1421]/80' : 'bg-white/80'} backdrop-blur-xl rounded-3xl p-5 border ${borderColor} shadow-2xl min-w-[220px]`}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
              <p className="text-[10px] font-black uppercase text-emerald-500 tracking-widest">Solo Performance Dashboard</p>
            </div>
            <div className="space-y-2">
              <div className={`flex justify-between items-center text-[10px] font-black uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'} tracking-tighter`}>
                <span>Model</span>
                <span className={isDark ? 'text-white' : 'text-slate-900'}>Gemini 3 Flash Preview</span>
              </div>
              <div className={`flex justify-between items-center text-[10px] font-black uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'} tracking-tighter`}>
                <span>Status</span>
                <span className="text-emerald-500">3x Faster Inference</span>
              </div>
              <div className={`flex justify-between items-center text-[10px] font-black uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'} tracking-tighter`}>
                <span>Logic Profile</span>
                <span className="text-emerald-500">78% SWE-bench</span>
              </div>
              <div className={`flex justify-between items-center text-[10px] font-black uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'} tracking-tighter`}>
                <span>Cost Efficiency</span>
                <span className="text-emerald-500">90% Savings</span>
              </div>
            </div>
            <div className={`mt-4 pt-3 border-t ${borderColor} flex items-center justify-between`}>
               <span className={`text-[8px] font-bold ${subTextColor} uppercase tracking-widest`}>Inference Active</span>
               <span className="text-[10px] font-black text-emerald-500">72ms</span>
            </div>
          </div>
        </div>

        <header className={`h-20 ${panelColor} border-b ${borderColor} flex items-center justify-between px-8 shrink-0 relative z-40 transition-colors duration-500`}>
          <div className="flex items-center gap-6">
            <button className="md:hidden text-slate-500 p-2" onClick={() => setIsMobileMenuOpen(true)}>
              <i className="fa-solid fa-bars text-xl"></i>
            </button>
            <div>
              <h2 className={`text-sm font-black uppercase tracking-[0.2em] ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {navItems.find(i => i.mode === activeMode)?.label}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className={`text-[10px] ${subTextColor} font-bold uppercase tracking-widest`}>Real-time Grounding Enabled</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            
            {/* Segmented Theme Toggle */}
            <div className={`flex items-center p-1 rounded-2xl border ${borderColor} ${isDark ? 'bg-white/5' : 'bg-slate-100 shadow-inner'} transition-all`}>
              <button 
                onClick={() => theme === 'dark' && onThemeToggle()}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!isDark ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <i className="fa-solid fa-sun"></i>
                <span className="hidden lg:inline">Lite</span>
              </button>
              <button 
                onClick={() => theme === 'light' && onThemeToggle()}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isDark ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <i className="fa-solid fa-moon"></i>
                <span className="hidden lg:inline">Dark</span>
              </button>
            </div>

            <select 
              value={userLanguage}
              onChange={(e) => onLanguageChange(e.target.value)}
              className={`hidden sm:block ${isDark ? 'bg-white/5 text-slate-300' : 'bg-white text-slate-700 shadow-sm'} border ${borderColor} rounded-xl px-4 py-2 text-[10px] font-black uppercase outline-none focus:ring-1 focus:ring-emerald-500`}
            >
              {['English', 'Hindi', 'Bengali', 'Spanish'].map(l => <option key={l} value={l} className={isDark ? 'bg-[#0d1421]' : 'bg-white'}>{l}</option>)}
            </select>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-lg">
              <i className="fa-solid fa-store text-lg"></i>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 relative scroll-smooth">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
          
          {/* Orchestration Log Overlay */}
          {showLogs && (
            <div className={`absolute right-8 top-8 bottom-8 w-96 ${isDark ? 'bg-[#0d1421]/95' : 'bg-white/95'} backdrop-blur-2xl rounded-[40px] p-8 ${isDark ? 'text-white' : 'text-slate-900'} border ${borderColor} shadow-[0_0_50px_rgba(0,0,0,0.5)] z-[100] overflow-hidden flex flex-col animate-slideInRight`}>
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                    <i className="fa-solid fa-terminal text-xs"></i>
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-500">Multi-Agent Reasoning Log</h3>
                </div>
                <button onClick={() => setShowLogs(false)} className="text-slate-500 hover:text-emerald-500 transition-colors">
                  <i className="fa-solid fa-xmark text-lg"></i>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-6 font-mono text-[11px] pr-2 custom-scrollbar">
                {agentLogs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-600 gap-4 opacity-50">
                    <i className="fa-solid fa-robot text-4xl"></i>
                    <p className="font-black uppercase tracking-widest">Waiting for operations...</p>
                  </div>
                ) : (
                  agentLogs.map((log, i) => (
                    <div key={i} className={`border-l-2 border-emerald-500/50 pl-5 py-1 ${isDark ? 'bg-white/[0.02]' : 'bg-slate-50'} rounded-r-2xl border ${borderColor} p-4 transition-all hover:opacity-80`}>
                      <p className="text-emerald-500 font-black mb-2 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Agent: {log.agent}
                      </p>
                      <div className="space-y-2 leading-relaxed">
                        <p className={isDark ? 'text-slate-300' : 'text-slate-700'}><span className={`${subTextColor} font-bold`}>[ACTION]</span> {log.action}</p>
                        <p className="text-emerald-600/80"><span className={`${subTextColor} font-bold`}>[OBSERVATION]</span> {log.observation}</p>
                      </div>
                      <p className={`text-[9px] ${subTextColor} mt-4 font-bold uppercase tracking-widest`}>{log.timestamp}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Bottom Nav */}
        <nav className={`md:hidden ${panelColor} border-t ${borderColor} flex justify-around p-2 fixed bottom-0 left-0 right-0 z-40 h-20 shadow-2xl transition-colors duration-500`}>
          {navItems.map((item) => (
            <button
              key={item.mode}
              onClick={() => onModeChange(item.mode)}
              className={`flex flex-col items-center justify-center gap-2 p-2 rounded-2xl transition-all ${
                activeMode === item.mode ? 'text-emerald-500 bg-emerald-500/10' : subTextColor
              }`}
            >
              <i className={`fa-solid ${item.icon} text-xl`}></i>
              <span className="text-[8px] font-black uppercase tracking-tighter">{item.label}</span>
            </button>
          ))}
        </nav>
      </main>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}
    </div>
  );
};

export default Layout;
