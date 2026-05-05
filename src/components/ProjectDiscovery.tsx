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
}

const COMMON_PORTS: Project[] = [
  { port: '5173', name: 'Vite Dashboard', subtitle: 'React + TypeScript', status: 'offline', framework: 'React' },
  { port: '3000', name: 'Local API', subtitle: 'Express Server', status: 'offline', framework: 'Node' },
  { port: '8080', name: 'Docs Site', subtitle: 'Docusaurus Instance', status: 'offline', framework: 'Markdown' },
  { port: '8000', name: 'Python Backend', subtitle: 'FastAPI Service', status: 'offline', framework: 'Python' },
  { port: '4200', name: 'Legacy App', subtitle: 'Angular Project', status: 'offline', framework: 'Angular' },
];

export default function ProjectDiscovery({ currentPort, onSelectProject }: ProjectDiscoveryProps) {
  const [projects, setProjects] = useState<Project[]>(COMMON_PORTS);
  const [isScanning, setIsScanning] = useState(false);

  const scanPorts = () => {
    setIsScanning(true);
    // Reset all to scanning
    setProjects(prev => prev.map(p => ({ ...p, status: 'scanning' })));

    setTimeout(() => {
      setProjects(prev => prev.map(p => {
        // Simulate finding 2-3 random active ports
        const isOnline = Math.random() > 0.4 || p.port === currentPort;
        return { ...p, status: isOnline ? 'online' : 'offline' };
      }));
      setIsScanning(false);
    }, 2000);
  };

  useEffect(() => {
    scanPorts();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Search size={14} className="text-cyan-400" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Service Discovery</h3>
        </div>
        <button 
          onClick={scanPorts}
          disabled={isScanning}
          className={`p-1.5 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 transition-all ${isScanning ? 'animate-spin opacity-50' : ''}`}
        >
          <RefreshCw size={12} className="text-slate-400" />
        </button>
      </div>

      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {projects.map((project) => (
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
          ))}
        </AnimatePresence>
      </div>

      <div className="p-3 bg-black/40 rounded-xl border border-white/5">
        <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-2">
            <span>Scan Log</span>
            <span className="text-cyan-400/50">v0.1.2</span>
        </div>
        <div className="font-mono text-[9px] space-y-1 text-slate-600">
            <div className="flex items-center gap-2">
                <span className="text-cyan-400/30">➜</span>
                <span>Initialized cross-origin bridge...</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-cyan-400/30">➜</span>
                <span>Active project: <span className="text-cyan-400">localhost:{currentPort}</span></span>
            </div>
            {isScanning && (
                <div className="flex items-center gap-2 animate-pulse">
                    <span className="text-yellow-400/30">➜</span>
                    <span>Probing broadcast ports...</span>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
