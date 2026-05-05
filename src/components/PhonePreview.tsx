import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useDragControls } from 'motion/react';
import { 
  Maximize2, 
  Minimize2, 
  RefreshCw, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  RotateCw, 
  Terminal as TerminalIcon, 
  ShieldCheck, 
  Cpu,
  Wifi,
  Signal,
  Battery,
  Globe
} from 'lucide-react';

interface PhonePreviewProps {
  currentPort: string;
  isFloating?: boolean;
}

export default function PhonePreview({ currentPort, isFloating: defaultIsFloating = true }: PhonePreviewProps) {
  const [isFloating, setIsFloating] = useState(defaultIsFloating);
  const [isMini, setIsMini] = useState(false);
  const [showConsole, setShowConsole] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const dragControls = useDragControls();

  useEffect(() => {
    setIsFloating(defaultIsFloating);
  }, [defaultIsFloating]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  if (!isFloating) {
    return (
      <motion.button 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={() => setIsFloating(true)}
        className="fixed bottom-10 right-10 w-16 h-16 bg-purple-600 shadow-2xl rounded-2xl flex items-center justify-center text-white z-[100] hover:bg-purple-500 transition-colors border border-white/20"
      >
        <div className="relative">
          <TerminalIcon size={24} />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-purple-600 animate-pulse" />
        </div>
      </motion.button>
    );
  }

  return (
    <motion.div
      drag={!isMini}
      dragControls={dragControls}
      dragMomentum={false}
      initial={{ x: 0, y: 0, opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        width: isMini ? 180 : 320,
        height: isMini ? 80 : 640
      }}
      className={`${isFloating ? 'fixed bottom-10 right-10' : 'relative'} z-[100] group select-none`}
      style={{ touchAction: 'none' }}
    >
      {/* 3D Shadows */}
      <div className="absolute inset-0 bg-black/40 blur-3xl -z-10 group-hover:bg-purple-500/10 transition-colors" />
      
      {/* Device Frame */}
      <div className="relative w-full h-full bg-[#0F0F12] rounded-[3rem] border-[10px] border-black shadow-2xl overflow-hidden flex flex-col ring-1 ring-white/10">
        
        {/* Notch / Speaker */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-[60] flex items-center justify-center gap-1.5 px-4 border-x border-b border-white/5">
           <div className="w-8 h-1 bg-white/10 rounded-full" />
           <div className="w-1.5 h-1.5 rounded-full bg-blue-500/20" />
        </div>

        {/* Status Bar */}
        <div className="h-10 px-6 pt-2 flex items-center justify-between shrink-0 bg-transparent text-[10px] font-bold text-white z-50">
           <span className="tracking-tight">{formatTime(currentTime)}</span>
           <div className="flex items-center gap-1.5 opacity-80">
              <Signal size={10} />
              <Wifi size={10} />
              <div className="flex items-center gap-0.5">
                <span className="text-[8px] font-mono">84%</span>
                <Battery size={10} />
              </div>
           </div>
        </div>

        {/* Mini Content Header */}
        <div 
          onPointerDown={(e) => !isMini && dragControls.start(e)}
          className={`h-12 px-4 flex items-center gap-3 bg-black/40 border-b border-white/5 shrink-0 z-50 cursor-grab active:cursor-grabbing ${isMini ? 'h-full bg-purple-600 border-none' : ''}`}
        >
           {isMini ? (
              <button 
                onClick={() => setIsMini(false)}
                className="flex-1 flex items-center gap-3 outline-none"
              >
                 <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white">
                    <TerminalIcon size={20} />
                 </div>
                 <div className="text-left">
                    <div className="text-[10px] font-black italic text-white uppercase tracking-tighter">Bridge Active</div>
                    <div className="text-[8px] font-bold text-white/60 uppercase tracking-widest">Tap to Return</div>
                 </div>
              </button>
           ) : (
              <>
                 <div className="flex items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 hover:bg-white/5 rounded-lg text-white">
                      <ChevronLeft size={14} />
                    </button>
                    <button className="p-1.5 hover:bg-white/5 rounded-lg text-white">
                      <ChevronRight size={14} />
                    </button>
                 </div>
                 
                 <div className="flex-1 bg-black/40 border border-white/10 rounded-xl h-8 flex items-center px-3 justify-between overflow-hidden">
                    <div className="flex items-center gap-2 max-w-[120px] shrink-0">
                      <div className={`w-1.5 h-1.5 rounded-full ${currentPort ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-yellow-500'} animate-pulse`} />
                      <span className="text-[9px] font-mono text-purple-400 truncate lowercase">{currentPort ? `localhost:${currentPort}` : 'waiting...'}</span>
                    </div>
                    <button 
                      onClick={() => {
                        const frame = document.querySelector('iframe');
                        if (frame) frame.src = frame.src;
                      }}
                      className="p-1 hover:bg-white/5 rounded transition-colors text-white/40 hover:text-white"
                    >
                      <RotateCw size={10} />
                    </button>
                 </div>

                 <div className="flex items-center gap-1">
                    <button onClick={() => setIsMini(true)} className="p-1.5 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-all">
                       <Minimize2 size={14} />
                    </button>
                    <button onClick={() => setIsFloating(false)} className="p-1.5 hover:bg-red-500/20 rounded-lg text-red-500 transition-all">
                       <X size={14} />
                    </button>
                 </div>
              </>
           )}
        </div>

        {/* Browser / Terminal View */}
        {!isMini && (
          <div className="flex-1 relative bg-white overflow-hidden">
            {currentPort && /^\d+$/.test(currentPort) ? (
              <div className="w-full h-full flex flex-col">
                <iframe 
                  src={`http://localhost:${currentPort}`}
                  className="w-full h-full border-none"
                  title="Local Preview"
                />
                
                {/* Console Overlay Button */}
                <button 
                  onClick={() => setShowConsole(!showConsole)}
                  className="absolute bottom-4 right-4 w-10 h-10 bg-purple-600 rounded-2xl shadow-xl flex items-center justify-center text-white z-[70] hover:scale-110 transition-transform active:scale-95"
                >
                  <Globe size={20} />
                </button>

                <AnimatePresence>
                  {showConsole && (
                    <motion.div 
                      initial={{ y: '100%' }}
                      animate={{ y: 0 }}
                      exit={{ y: '100%' }}
                      className="absolute bottom-0 left-0 w-full h-1/2 bg-black/95 p-4 font-mono text-[10px] text-purple-400 z-[80] overflow-y-auto border-t border-white/10"
                    >
                      <div className="flex justify-between items-center mb-4 text-white/40 border-b border-white/5 pb-2">
                        <span className="uppercase font-bold tracking-widest">Runtime Console</span>
                        <button onClick={() => setShowConsole(false)} className="hover:text-white">CLOSE</button>
                      </div>
                      <div className="space-y-1">
                        <div>&gt; bridge.init()</div>
                        <div className="text-white/60">OK: Hooked into localhost:{currentPort}</div>
                        <div>&gt; logs.stream()</div>
                        <div className="text-green-500/80">[INFO] Bridge channel established</div>
                        <div className="text-white/20 animate-pulse">&gt; _</div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="h-full bg-[#0F0F12] flex flex-col p-8 font-mono">
                 <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center text-purple-400">
                      <TerminalIcon size={24} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-white text-xs font-black uppercase tracking-tighter italic leading-none">Bridge::OS</h3>
                      <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse shadow-[0_0_8px_rgba(234,179,8,0.4)]" />
                         <span className="text-[9px] text-slate-500 uppercase font-black tracking-[0.2em]">Awaiting Signal</span>
                      </div>
                    </div>
                 </div>

                 <div className="space-y-6 flex-1">
                    <div className="p-5 bg-white/[0.03] rounded-3xl border border-white/5 space-y-4 relative overflow-hidden">
                       <div className="flex items-center justify-between">
                          <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.3em]">Scanner v2.4.1</span>
                          <ShieldCheck size={12} className="text-purple-400 animate-pulse" />
                       </div>
                       <div className="space-y-2 text-[10px] leading-relaxed">
                          <div className="text-purple-400/80">[0.00ms] SYSCALL_INIT_BOOT</div>
                          <div className="text-white/40">[0.12ms] PROBING_INTERFACE_WLAN0</div>
                          <div className="text-white/40">[0.45ms] CACHE_INVALIDATED</div>
                          <div className="text-white/20 animate-pulse">[SCANNING] Waiting for local intent...</div>
                       </div>
                       <div className="absolute -bottom-4 -right-4 opacity-5 pointer-events-none">
                          <RotateCw size={80} className="animate-[spin_12s_linear_infinite]" />
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col gap-1">
                          <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Protocol</span>
                          <span className="text-xs font-bold text-slate-400">V2_SECURE</span>
                       </div>
                       <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col gap-1">
                          <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Arch</span>
                          <span className="text-xs font-bold text-slate-400">ARM64_V8</span>
                       </div>
                    </div>
                 </div>

                 <div className="mt-auto space-y-5">
                    <div className="space-y-2">
                       <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ x: '-100%' }}
                            animate={{ x: '100%' }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                            className="w-1/2 h-full bg-gradient-to-r from-transparent via-purple-500 to-transparent"
                          />
                       </div>
                       <div className="flex justify-between text-[8px] font-black uppercase text-slate-700 tracking-widest">
                          <span>Security_Module_Active</span>
                          <span>Bridge_v0.1.2</span>
                       </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center">
                             <Cpu size={14} className="text-slate-600" />
                          </div>
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Local Link</span>
                       </div>
                       <button
                         onClick={() => setIsMini(true)}
                         className="px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 rounded-lg text-[9px] font-black text-purple-400 uppercase tracking-widest transition-colors"
                       >
                         Minimize
                       </button>
                    </div>
                 </div>
              </div>
            )}
          </div>
        )}

        {/* Swipe Bar / Home Indicator */}
        {!isMini && (
           <div className="h-8 flex items-center justify-center shrink-0">
              <div className="w-24 h-1.5 bg-white/20 rounded-full" />
           </div>
        )}
      </div>
    </motion.div>
  );
}


