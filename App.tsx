
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import Layout from './components/Layout';
import { AgentMode, InventoryItem, SupplierOffer, PODraft, Forecast, UserContext, AgentLog, Theme, MarketingContent } from './types';
import { GeminiService } from './services/geminiService';

const INITIAL_INVENTORY: InventoryItem[] = [
  { id: '1', item_name: 'Sona Masuri Rice', quantity: 4, target_quantity: 15, stock_status: 'Low Stock', category: 'Grain' },
  { id: '2', item_name: 'Premium Ghee (500ml)', quantity: 22, target_quantity: 10, stock_status: 'Overstock', category: 'Dairy' },
  { id: '3', item_name: 'Sunflower Oil 5L', quantity: 12, target_quantity: 12, stock_status: 'In Stock', category: 'Oil' },
  { id: '4', item_name: 'Atta 10kg Bag', quantity: 2, target_quantity: 8, stock_status: 'Low Stock', category: 'Flour' },
];

const App: React.FC = () => {
  const [activeMode, setActiveMode] = useState<AgentMode>(AgentMode.DASHBOARD);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [isProcessing, setIsProcessing] = useState(false);
  const [smartInsight, setSmartInsight] = useState("Scanning operations...");
  const [agentLogs, setAgentLogs] = useState<AgentLog[]>([]);
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('supplychain-theme') as Theme) || 'dark');
  const [forecasts, setForecasts] = useState<Forecast[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const isDark = theme === 'dark';
  const [userContext, setUserContext] = useState<UserContext>({
    detected_city: 'Udaipur', detected_state: 'Rajasthan', user_language: 'English'
  });

  const gemini = useMemo(() => new GeminiService(), []);

  const addLogs = (newLogs: AgentLog[]) => setAgentLogs(prev => [...newLogs, ...prev].slice(0, 50));

  const updateDashboardInsights = useCallback(async () => {
    setIsProcessing(true);
    try {
      const { text, logs } = await gemini.generateSmartInsight(inventory, userContext);
      setSmartInsight(text);
      addLogs(logs);
    } catch (err) {
      console.error(err);
      setSmartInsight("System offline. Please check API configuration.");
    } finally {
      setIsProcessing(false);
    }
  }, [gemini, inventory, userContext]);

  useEffect(() => { 
    if (activeMode === AgentMode.DASHBOARD) updateDashboardInsights(); 
  }, [activeMode, updateDashboardInsights]);

  const runForecast = async () => {
    setIsProcessing(true);
    try {
      const { forecasts, logs } = await gemini.predictDemand(userContext);
      setForecasts(forecasts);
      addLogs(logs);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMediaUpload = async (event: React.ChangeEvent<HTMLInputElement> | Blob | File) => {
    let file: File | Blob | undefined;
    let type: string | undefined;
    if ('target' in event) {
      file = event.target.files?.[0];
      type = file?.type;
    } else {
      file = event;
      type = file.type || 'audio/webm';
    }

    if (!file) return;
    setIsProcessing(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = (reader.result as string).split(',')[1];
      try {
        const { inventory: newInv, logs } = await gemini.runVisualAudit(base64, type || 'image/jpeg', userContext);
        if (newInv && newInv.length > 0) setInventory(newInv);
        addLogs(logs);
        setActiveMode(AgentMode.DASHBOARD);
      } catch (err) {
        console.error(err);
      } finally {
        setIsProcessing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const startVoiceAudit = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];
      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        handleMediaUpload(blob);
      };
      recorder.start();
      setIsRecording(true);
    } catch (err) { console.error(err); }
  };

  const stopVoiceAudit = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const panelClass = isDark ? 'bg-[#0d1421] border-white/5 shadow-lg' : 'bg-white border-slate-200 shadow-sm';
  const textClass = isDark ? 'text-slate-100' : 'text-slate-900';

  return (
    <Layout 
      activeMode={activeMode} 
      onModeChange={setActiveMode} 
      userLanguage={userContext.user_language} 
      onLanguageChange={(l) => setUserContext(p => ({ ...p, user_language: l }))} 
      agentLogs={agentLogs} 
      theme={theme} 
      onThemeToggle={() => {
        const next = theme === 'dark' ? 'light' : 'dark';
        setTheme(next);
        localStorage.setItem('supplychain-theme', next);
      }}
    >
      {activeMode === AgentMode.DASHBOARD && (
        <div className="space-y-8 animate-fadeIn pb-32">
          <div className={`p-10 rounded-[48px] ${panelClass} border border-emerald-500/20 shadow-2xl relative overflow-hidden`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white"><i className="fa-solid fa-bolt"></i></div>
              <span className="font-black uppercase text-xs tracking-widest text-emerald-500">Agentic Insights Engine</span>
              {isProcessing && <div className="ml-auto text-[10px] font-black uppercase text-emerald-500 animate-pulse">Processing...</div>}
            </div>
            <div className={`font-mono text-sm whitespace-pre-line leading-relaxed ${textClass}`}>
              {smartInsight.split('\n').map((line, i) => (
                <div key={i} className={line.startsWith('[') ? 'text-emerald-500 font-black mt-2' : 'opacity-80'}>{line}</div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className={`${panelClass} p-10 rounded-[56px] border`}>
              <h4 className={`font-black text-xl uppercase tracking-tighter mb-8 ${textClass}`}>Stock Reconciliation</h4>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={inventory.map(i => ({ name: i.item_name, actual: i.quantity, target: i.target_quantity }))}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
                    <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 800 }} />
                    <Bar dataKey="actual" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="target" fill={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className={`${panelClass} p-10 rounded-[56px] border`}>
              <h4 className={`font-black text-xl uppercase tracking-tighter mb-8 ${textClass}`}>Mandi Price Trends</h4>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[{ day: 'M', demand: 120 }, { day: 'T', demand: 150 }, { day: 'W', demand: 210 }, { day: 'Th', demand: 180 }, { day: 'F', demand: 250 }, { day: 'S', demand: 320 }, { day: 'Su', demand: 280 }]}>
                    <Area type="monotone" dataKey="demand" stroke="#10b981" fillOpacity={1} fill="url(#colorDemand)" />
                    <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 800 }} />
                    <Tooltip />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeMode === AgentMode.VISION && (
        <div className="space-y-12 animate-fadeIn pb-32 flex flex-col items-center">
          <div className={`${panelClass} p-12 rounded-[60px] border border-dashed border-emerald-500/30 max-w-4xl w-full text-center relative overflow-hidden group`}>
             <div className="relative z-10 flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 mb-6">
                  <i className={`fa-solid ${isRecording ? 'fa-microphone-lines animate-pulse' : 'fa-wand-magic-sparkles'} text-3xl`}></i>
                </div>
                <h2 className={`text-3xl font-black uppercase tracking-tighter mb-2 ${textClass}`}>Multimodal Agent Audit</h2>
                <p className="text-slate-500 text-[10px] max-w-md mb-10 uppercase tracking-[0.2em] font-black">Scan Stocks via Camera, Video, or Voice Notes</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
                  <button onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center justify-center gap-3 p-8 rounded-[40px] bg-emerald-600 text-white font-black uppercase tracking-widest hover:scale-[1.02] shadow-xl">
                    <i className="fa-solid fa-camera-viewfinder text-2xl"></i>
                    <span className="text-[10px]">Photo / Video Scan</span>
                  </button>
                  <button onClick={isRecording ? stopVoiceAudit : startVoiceAudit} className={`flex flex-col items-center justify-center gap-3 p-8 rounded-[40px] font-black uppercase tracking-widest hover:scale-[1.02] shadow-xl ${isRecording ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-900 text-white'}`}>
                    <i className={`fa-solid ${isRecording ? 'fa-stop' : 'fa-microphone'} text-2xl`}></i>
                    <span className="text-[10px]">{isRecording ? 'Stop' : 'Voice Audit'}</span>
                  </button>
                </div>
                <input type="file" ref={fileInputRef} onChange={handleMediaUpload} accept="image/*,video/*,audio/*" className="hidden" />
             </div>
          </div>
        </div>
      )}

      {activeMode === AgentMode.STRATEGY && (
        <div className="space-y-12 pb-40">
           <div className={`${panelClass} p-10 rounded-[56px] border`}>
             <h3 className={`text-3xl font-black uppercase tracking-tighter ${textClass} mb-12`}>Demand Projection</h3>
             <div className="h-[400px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={[{ day: 'M', demand: 120 }, { day: 'T', demand: 150 }, { day: 'W', demand: 210 }, { day: 'Th', demand: 180 }, { day: 'F', demand: 250 }, { day: 'S', demand: 320 }, { day: 'Su', demand: 280 }]}>
                    <Line type="stepAfter" dataKey="demand" stroke="#10b981" strokeWidth={4} />
                 </LineChart>
               </ResponsiveContainer>
             </div>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {forecasts.map((f, i) => (
                <div key={i} className={`${panelClass} p-10 rounded-[48px] border`}>
                   <h4 className="font-black text-xl text-emerald-500 uppercase mb-4">{f.event}</h4>
                   <p className={`text-sm opacity-80 mb-6 italic ${textClass}`}>{f.impact}</p>
                   <div className="bg-emerald-500/5 p-6 rounded-3xl border border-emerald-500/10">
                     <p className={`text-xs font-bold ${textClass}`}>{f.recommendation}</p>
                   </div>
                </div>
              ))}
           </div>
           {forecasts.length === 0 && <button onClick={runForecast} className="w-full p-20 border-2 border-dashed rounded-[40px] font-black uppercase tracking-widest opacity-50 hover:opacity-100">Trigger Predictive Engine</button>}
        </div>
      )}

      {isProcessing && (
        <div className={`fixed bottom-10 right-10 ${isDark ? 'bg-slate-900' : 'bg-white'} text-emerald-500 px-8 py-4 rounded-full shadow-2xl flex items-center gap-4 z-[200] border border-emerald-500/20`}>
          <div className="w-4 h-4 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
          <span className="text-[10px] font-black uppercase tracking-widest">Orchestrating Agents...</span>
        </div>
      )}
    </Layout>
  );
};

export default App;
