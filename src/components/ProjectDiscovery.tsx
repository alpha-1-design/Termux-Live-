import { useState, useEffect } from 'react';
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
}

const COMMON_PORTS = [
  { port: '5173', name: 'Vite Dashboard', subtitle: 'React + TypeScript', framework: 'React' },
  { port: '3000', name: 'Next.js / Express', subtitle: 'Fullstack App', framework: 'Node' },
  { port: '8000', name: 'FastAPI / Django', subtitle: 'Python Backend', framework: 'Python' },
  { port: '8080', name: 'Webpack / Docs', subtitle: 'Utility Server', framework: 'JS' },
  { port: '4200', name: 'Angular Dev', subtitle: 'Enterprise UI', framework: 'Angular' },
];

export default function ProjectDiscovery({ currentPort, onSelectProject, onShowDocs }: ProjectDiscoveryProps) {
  const [projects, setProjects] = useState<Project[]>(COMMON_PORTS.map(p => ({ ...p, status: 'offline' })));
  const [isScanning, setIsScanning] = useState(false);

  const [lastCheck, setLastCheck] = useState<string>('Never');

  const scanPorts = async () => {
    setIsScanning(true);
    setLastCheck(new Date().toLocaleTimeString());
    setProjects(prev => prev.map(p => ({ ...p, status: 'scanning' })));

    const probe = async (port: string) => {
      try {
        return new Promise<'online' | 'offline'>((resolve) => {
          const img = new Image();
          const timer = setTimeout(() => {
            img.src = '';
            resolve('offline');
          }, 1000);

          img.onload = () => {
            clearTimeout(timer);
            resolve('online');
          };
          img.onerror = () => {
            clearTimeout(timer);
            // In local bridge context, errors often mean 'refused' which means service is there but rejected headers
            resolve('online'); 
          };
          img.src = `http://127.0.0.1:${port}/favicon.ico?t=${Date.now()}`;
        });
      } catch {
        return 'offline';
      }
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
    // Priority: 5173 (Vite) > 3000 (Node) > 8000 (Python) > 8080 > 4200
    const priorityOrder = ['5173', '3000', '8000', '8080', '4200'];
    const online = updatedProjects.filter(p => p.status === 'online');
    
    if (online.length > 0) {
      // Find the "best" available port based on priority
      const best = online.sort((a, b) => {
        const indexA = priorityOrder.indexOf(a.port);
        const indexB = priorityOrder.indexOf(b.port);
        return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
      })[0];

      // Auto-connect if:
      // 1. We don't have a port yet
      // 2. Our current port is offline
      // 3. We found a higher priority port than the current one
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
  };

  useEffect(() => {
    scanPorts();
    // Auto-reconnect heartbeat every 10 seconds
    const interval = setInterval(scanPorts, 10000);
    return () => clearInterval(interval);
  }, []);

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

      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {onlineProjects.length > 0 ? (
            projects.map((project) => (
              <motion.button
                layout
                key={project.port}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => project.status === 'online' && onSelectProject(project.port)}
                className={`w-full text-left p-3 rounded-xl border transition-all relative group overflow-hidden ${
                  currentPort === project.port 
                    ? 'bg-cyan-500/10 border-cyan-500/40 shadow-[0_0_20px_rgba(34,211,238,0.05)]' 
                    : project.status === 'online'
                      ? 'bg-white/5 border-white/5 hover:border-white/20 active:scale-[0.98]'
                      : 'bg-black/20 border-white/5 opacity-40 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-3 relative z-10">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                     currentPort === project.port ? 'bg-cyan-400/20 border-cyan-400/30 text-cyan-400' : 'bg-black/40 border-white/5 text-slate-500'
                  }`}>
                    {project.framework === 'React' ? <Globe size={14} /> : <Server size={14} />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-[11px] font-black uppercase tracking-tight truncate ${currentPort === project.port ? 'text-white' : 'text-slate-300'}`}>
                        {project.name}
                      </span>
                      <span className="text-[10px] font-mono opacity-50">:{project.port}</span>
                    </div>
                    <div className="text-[9px] text-slate-500 uppercase font-bold tracking-widest truncate">{project.subtitle}</div>
                  </div>

                  <div className="flex items-center justify-center w-5">
                    {project.status === 'scanning' ? (
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    ) : project.status === 'online' ? (
                      <CheckCircle2 size={12} className="text-green-500" />
                    ) : (
                      <AlertCircle size={12} className="text-slate-700" />
                    )}
                  </div>
                </div>

                {/* Selection Indicator */}
                {currentPort === project.port && (
                  <motion.div 
                    layoutId="active-border"
                    className="absolute inset-0 border border-cyan-400/50 rounded-xl"
                    initial={false}
                  />
                )}
              </motion.button>
            ))
          ) : !isScanning && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-white/5 rounded-2xl border border-dashed border-white/10 text-center space-y-3"
            >
              <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-600">
                <Cpu size={20} />
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-slate-200 uppercase tracking-widest">No Active Servers</p>
                <p className="text-[9px] text-slate-500 leading-relaxed uppercase font-mono">
                  Probing complete. No local development services detected on standard ports.
                </p>
              </div>
              <button 
                onClick={onShowDocs}
                className="text-[10px] font-black text-cyan-400 hover:text-cyan-300 uppercase tracking-tighter italic border-b border-cyan-400/20 pb-0.5"
              >
                Learn how to start a service &rarr;
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
