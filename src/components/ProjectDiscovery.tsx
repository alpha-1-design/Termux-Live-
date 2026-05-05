import { useState, useEffect, useCallback } from 'react';
import { Search, RefreshCw, Globe, Server, Cpu, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Project {
  port: string;
  name: string;
  subtitle: string;
  status: 'online' | 'offline' | 'scanning';
  framework: string;
}

interface ProjectDiscoveryProps {
  currentPort: string;
  onSelectProject: (port: string) => void;
  onShowDocs?: () => void;
  triggerScan?: number;
}

const COMMON_PORTS = [
  { port: '5173', name: 'Vite Service', subtitle: 'Auto-Detected Node', framework: 'React' },
  { port: '3000', name: 'React/API', subtitle: 'Fullstack Instance', framework: 'Node' },
  { port: '8000', name: 'Backend Socket', subtitle: 'Logic Engine', framework: 'Python' },
  { port: '8080', name: 'Utility Stream', subtitle: 'Dev Tools', framework: 'JS' },
  { port: '4200', name: 'Legacy Native', subtitle: 'Enterprise Port', framework: 'Angular' },
];

export default function ProjectDiscovery({ currentPort, onSelectProject, onShowDocs, triggerScan = 0 }: ProjectDiscoveryProps) {
  const [projects, setProjects] = useState<Project[]>(COMMON_PORTS.map(p => ({ ...p, status: 'offline' })));
  const [isScanning, setIsScanning] = useState(false);

  const [lastCheck, setLastCheck] = useState<string>('Never');

  const scanPorts = useCallback(async () => {
    try {
      setIsScanning(true);
      setLastCheck(new Date().toLocaleTimeString());
      setProjects(prev => prev.map(p => ({ ...p, status: 'scanning' })));

      const probe = async (port: string) => {
        return new Promise<'online' | 'offline'>((resolve) => {
          const img = new Image();
          let resolved = false;

          const timer = setTimeout(() => {
            if (!resolved) {
              resolved = true;
              img.src = '';
              resolve('offline');
            }
          }, 1500);

          img.onload = () => {
            if (!resolved) {
              resolved = true;
              clearTimeout(timer);
              resolve('online');
            }
          };
          img.onerror = () => {
            if (!resolved) {
              resolved = true;
              clearTimeout(timer);
              // In browser context for localhost probes, we'll be conservative.
              // Most dev servers serve a favicon.
              resolve('offline'); 
            }
          };
          img.src = `http://127.0.0.1:${port}/favicon.ico?t=${Date.now()}`;
        });
      };

      const results = await Promise.all(
        COMMON_PORTS.map(async (p) => {
          const status = await probe(p.port);
          return { ...p, status };
        })
      );

      const updatedProjects = results as Project[];
      setProjects(updatedProjects);
      setIsScanning(false);

      // AUTO-CONNECT LOGIC
      const priorityOrder = ['5173', '3000', '8000', '8080', '4200'];
      const online = updatedProjects.filter(p => p.status === 'online');
      
      if (online.length > 0) {
        const best = online.sort((a, b) => {
          const indexA = priorityOrder.indexOf(a.port);
          const indexB = priorityOrder.indexOf(b.port);
          return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
        })[0];

        const currentStatus = updatedProjects.find(p => p.port === currentPort)?.status;
        const isCurrentOffline = !currentPort || currentStatus === 'offline';
        
        const currentPriority = priorityOrder.indexOf(currentPort);
        const bestPriority = priorityOrder.indexOf(best.port);
        const isHigherPriorityFound = bestPriority < (currentPriority === -1 ? 99 : currentPriority);

        if (best && (isCurrentOffline || isHigherPriorityFound)) {
          if (best.port !== currentPort) {
            onSelectProject(best.port);
          }
        }
      }
    } catch (e) {
      console.warn('Scan ports failed:', e);
      setIsScanning(false);
    }
  }, [currentPort, onSelectProject]);

  useEffect(() => {
    if (triggerScan > 0) {
      scanPorts();
    }
  }, [triggerScan, scanPorts]);

  useEffect(() => {
    scanPorts();
    const interval = setInterval(scanPorts, 15000);
    return () => clearInterval(interval);
  }, [scanPorts]);

  const onlineProjects = projects.filter(p => p.status === 'online');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Search size={14} className="text-cyan-400" />
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Service Discovery</h3>
            <div className="text-[8px] text-slate-600 font-mono mt-0.5">Last Sync: {lastCheck}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
           {isScanning && <span className="text-[8px] text-cyan-400/50 font-mono animate-pulse">PROBING...</span>}
           <button 
             onClick={scanPorts}
             disabled={isScanning}
             className={`p-1.5 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 transition-all ${isScanning ? 'opacity-50' : 'hover:border-cyan-500/30'}`}
           >
             <RefreshCw size={12} className={`text-slate-400 ${isScanning ? 'animate-spin' : ''}`} />
           </button>
        </div>
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {isScanning && projects.every(p => p.status === 'offline') ? (
            // Shimmer Loading State
            [...Array(3)].map((_, i) => (
              <div key={i} className="w-full h-16 bg-white/5 rounded-2xl border border-white/5 animate-pulse overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                <div className="h-full flex items-center gap-3 px-4">
                  <div className="w-8 h-8 rounded-lg bg-white/5" />
                  <div className="flex-1 space-y-2">
                    <div className="h-2 w-24 bg-white/5 rounded" />
                    <div className="h-2 w-16 bg-white/5 rounded" />
                  </div>
                </div>
              </div>
            ))
          ) : onlineProjects.length > 0 ? (
            projects.filter(p => p.status === 'online' || p.status === 'scanning').map((project) => (
              <motion.button
                layout
                key={project.port}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => project.status === 'online' && onSelectProject(project.port)}
                className={`w-full text-left p-4 rounded-2xl border transition-all relative group ${
                  currentPort === project.port 
                    ? 'bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-white' 
                    : project.status === 'online'
                      ? 'bg-white/5 border-white/5 hover:bg-white/[0.07] hover:border-white/10 active:scale-[0.98]'
                      : 'bg-black/20 border-white/5 opacity-40 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-4 relative z-10">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${
                     currentPort === project.port ? 'bg-cyan-500 border-cyan-400 text-white' : 'bg-black/40 border-white/5 text-slate-500'
                  }`}>
                    {project.framework === 'React' ? <Globe size={18} /> : <Server size={18} />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-black uppercase tracking-tight truncate ${currentPort === project.port ? 'text-gray-900' : 'text-slate-200'}`}>
                        {project.name}
                      </span>
                      <span className={`text-[10px] font-mono ${currentPort === project.port ? 'text-gray-400' : 'text-slate-600'}`}>:{project.port}</span>
                    </div>
                    <div className={`text-[10px] uppercase font-bold tracking-[0.15em] truncate ${currentPort === project.port ? 'text-cyan-600' : 'text-slate-500'}`}>
                      {project.status === 'scanning' ? 'Verifying Stack...' : project.subtitle}
                    </div>
                  </div>

                  <div className="flex items-center justify-center w-6">
                    {project.status === 'scanning' ? (
                      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    ) : project.status === 'online' ? (
                      <div className={`w-2 h-2 rounded-full transition-colors ${currentPort === project.port ? 'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]' : 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.3)]'}`} />
                    ) : null}
                  </div>
                </div>
              </motion.button>
            ))
          ) : !isScanning && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 bg-white/5 rounded-3xl border border-dashed border-white/10 text-center space-y-4"
            >
              <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto text-slate-500 transform rotate-6 border border-white/5">
                <Cpu size={24} />
              </div>
              <div className="space-y-2">
                <p className="text-xs font-black text-slate-200 uppercase tracking-widest">No Active Nodes</p>
                <p className="text-[10px] text-slate-500 leading-relaxed uppercase font-mono px-4">
                  The bridge is silent. Start a development server in Termux to begin.
                </p>
              </div>
              <button 
                onClick={onShowDocs}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-[10px] font-black text-cyan-400 transition-colors uppercase tracking-widest"
              >
                Setup Guide
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-3 bg-black/40 rounded-xl border border-white/5">
        <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-2">
            <span>Bridge Monitor</span>
            <span className="text-cyan-400/50">Auto-Connect: ON</span>
        </div>
        <div className="font-mono text-[8px] space-y-1 text-slate-600">
            <div className="flex items-center gap-2">
                <span className="text-cyan-400/30">➜</span>
                <span>Initialized cross-origin bridge...</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-green-500/50">✓</span>
                <span>Active link: <span className="text-white">http://127.0.0.1:{currentPort}</span></span>
            </div>
            {isScanning ? (
                <div className="flex items-center gap-2 animate-pulse">
                    <span className="text-yellow-400/30">➜</span>
                    <span>Probing broadcast ports...</span>
                </div>
            ) : (
                <div className="flex items-center gap-2 text-[7px] opacity-40">
                    <span className="text-cyan-400/30">#</span>
                    <span>Auto-scanning every 10s</span>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
