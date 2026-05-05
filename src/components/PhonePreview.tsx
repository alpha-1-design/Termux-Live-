import { useState } from 'react';
import { motion, AnimatePresence, useDragControls } from 'motion/react';
import { Maximize2, Minimize2, RefreshCw, X, Layout, Terminal as TerminalIcon, GripHorizontal } from 'lucide-react';

interface PhonePreviewProps {
  currentPort: string;
}

export default function PhonePreview({ currentPort }: PhonePreviewProps) {
  const [isFloating, setIsFloating] = useState(true);
  const [isMini, setIsMini] = useState(false);
  const [showConsole, setShowConsole] = useState(false);
  const dragControls = useDragControls();

  return (
    <div className="relative w-[300px] sm:w-[320px] h-[600px] sm:h-[640px] bg-[#1a1a1a] rounded-[40px] sm:rounded-[48px] border-[6px] sm:border-[8px] border-[#333] shadow-2xl overflow-hidden self-center">
      {/* ... existing notch and buttons ... */}
      <div className="absolute top-0 w-full h-8 bg-transparent z-50 flex justify-between px-6 sm:px-8 items-center pt-2">
        <span className="text-[9px] sm:text-[10px] text-white font-medium">9:41</span>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-b-2xl z-30 flex items-center justify-center gap-2 border-x border-b border-white/5">
            <div className="w-8 h-1 bg-white/10 rounded-full" />
            <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
        </div>
        <div className="flex items-center gap-1 text-white opacity-80">
          <div className="w-3 h-2 border border-white/40 rounded-[1px]" />
          <div className="w-1.5 h-1.5 bg-white rounded-full opacity-60" />
        </div>
      </div>

      <div className="absolute -left-[2px] top-24 w-[3px] h-12 bg-white/10 rounded-l-md" />
      <button 
        onClick={() => {
          const frame = document.querySelector('iframe');
          if (frame) frame.src = frame.src;
        }}
        className="absolute -right-[2px] top-20 w-[3px] h-10 bg-cyan-500/40 rounded-r-md hover:bg-cyan-400 transition-colors cursor-pointer group z-50 focus:outline-none"
        title="Refresh Bridge"
      >
        <div className="absolute right-4 top-0 bg-cyan-500 text-white text-[8px] px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity font-bold pointer-events-none">RELOAD</div>
      </button>
      <div className="absolute -right-[2px] top-36 w-[3px] h-16 bg-white/10 rounded-r-md" />

      {/* Main OS View (Termux Background) */}
      <div className="w-full h-full bg-[#000] p-4 pt-10 flex flex-col gap-4">
        <div className="grid grid-cols-4 gap-4 mt-4">
          <div className="aspect-square bg-gray-800/50 rounded-xl flex items-center justify-center">
            <TerminalIcon className="text-white/40" />
          </div>
          <div className="aspect-square bg-gray-800/50 rounded-xl" />
          <div className="aspect-square bg-gray-800/50 rounded-xl" />
          <div className="aspect-square bg-purple-600/80 rounded-xl flex items-center justify-center">
            <Layout className="text-white" />
          </div>
        </div>
        
        <div className="mt-auto pb-4">
            <div className="h-1 w-24 bg-white/30 rounded-full mx-auto" />
        </div>
      </div>

      {/* Floating Window (TermuxLive) */}
      <AnimatePresence>
        {isFloating && (
          <motion.div
            drag
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 40, left: 10, right: 10, bottom: 40 }}
            initial={{ scale: 0.8, opacity: 0, y: 100 }}
            animate={{ 
              scale: isMini ? 0.4 : 1, 
              opacity: 1, 
              y: isMini ? 240 : 100,
              x: isMini ? 80 : 0
            }}
            className={`absolute z-40 bg-white shadow-2xl rounded-lg overflow-hidden border border-gray-200 ${
              isMini ? 'w-48 h-32' : 'w-[280px] h-[400px]'
            }`}
          >
            {/* Header bar - DRAG HANDLE */}
            <div 
              onPointerDown={(e) => dragControls.start(e)}
              className="bg-white px-4 py-2.5 flex items-center justify-between border-b border-gray-100 group cursor-grab active:cursor-grabbing touch-none rounded-t-3xl"
            >
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-400/20 border border-red-400/40" />
                  <div className="w-2 h-2 rounded-full bg-yellow-400/20 border border-yellow-400/40" />
                  <div className="w-2 h-2 rounded-full bg-green-400/20 border border-green-400/40" />
                </div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Termux::Bridge</span>
              </div>
              <div className="flex items-center gap-2 opacity-40 group-hover:opacity-100 transition-all">
                <button onClick={() => setIsMini(!isMini)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors pointer-events-auto">
                  {isMini ? <Maximize2 size={12} className="text-gray-600" /> : <Minimize2 size={12} className="text-gray-600" />}
                </button>
                <button onClick={() => setIsFloating(false)} className="p-1 hover:bg-red-50 rounded-lg transition-colors pointer-events-auto">
                  <X size={12} className="text-red-500" />
                </button>
              </div>
            </div>

            {/* Browser Content */}
            <div className="relative w-full h-full bg-white overflow-hidden pointer-events-auto rounded-b-3xl">
              {currentPort ? (
                <div className="w-full h-full flex flex-col">
                  <div className="h-10 bg-gray-50/50 backdrop-blur-sm border-b border-gray-100 flex items-center px-4 justify-between shrink-0">
                    <div className="flex items-center gap-2 px-3 py-1 bg-white border border-gray-100 rounded-full flex-1 max-w-[180px]">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      <div className="text-[9px] font-mono text-gray-500 truncate lowercase">localhost:{currentPort}</div>
                    </div>
                  </div>
                  <iframe 
                    src={`http://localhost:${currentPort}`}
                    className="w-full h-full border-none"
                    title="Local Preview"
                  />
                </div>
              ) : (
                <div className="p-6 flex flex-col h-full bg-[#FAFAFA]">
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <h3 className="text-sm font-black text-gray-900 uppercase italic tracking-tighter">System Status</h3>
                      <p className="text-[9px] text-gray-400 uppercase font-bold tracking-widest">Awaiting local signal...</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                       <div className="p-3 bg-white border border-gray-100 rounded-2xl shadow-sm space-y-1 text-center">
                          <span className="text-[8px] font-black text-gray-300 uppercase block">Port</span>
                          <span className="text-xs font-mono font-bold text-cyan-500">NULL</span>
                       </div>
                       <div className="p-3 bg-white border border-gray-100 rounded-2xl shadow-sm space-y-1 text-center">
                          <span className="text-[8px] font-black text-gray-300 uppercase block">Ping</span>
                          <span className="text-xs font-mono font-bold text-gray-400">--ms</span>
                       </div>
                    </div>

                    <div className="p-4 bg-gray-900 rounded-2xl border border-white/5 space-y-3">
                       <div className="flex items-center justify-between">
                          <span className="text-[9px] font-black text-white/50 uppercase tracking-widest">Bridge Logs</span>
                          <div className="flex gap-1">
                             <div className="w-1 h-1 rounded-full bg-cyan-500 animate-bounce" />
                          </div>
                       </div>
                       <div className="space-y-1.5 font-mono text-[8px]">
                          <div className="text-cyan-400/70">[0.00s] INIT_BOOT_SEQUENCE</div>
                          <div className="text-white/40">[0.12s] SCANNING_LOCAL_STACK</div>
                          <div className="text-white/40">[0.15s] WAITING_FOR_AM_INTENT</div>
                       </div>
                    </div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <div className="flex flex-col gap-2">
                       <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="w-1/3 h-full bg-cyan-500 rounded-full" />
                       </div>
                       <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest text-center">Protocol v2.4.1 Active</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Eruda Console Toggle Button */}
              <button 
                onClick={() => setShowConsole(!showConsole)}
                className="absolute right-2 bottom-8 w-6 h-6 bg-gray-200/80 rounded-full border border-gray-300 flex items-center justify-center text-[10px] font-bold shadow-lg z-50 pointer-events-auto"
              >
                E
              </button>
            </div>
            
            {/* Console Overlay (Eruda) */}
            <AnimatePresence>
              {showConsole && (
                <motion.div 
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  className="absolute bottom-0 left-0 w-full h-1/2 bg-black/90 p-2 text-xs font-mono text-cyan-400 border-t border-cyan-500/30 overflow-y-auto z-50 pointer-events-auto"
                >
                  <div className="flex justify-between items-center mb-1 text-[8px] opacity-50">
                    <span>Eruda v2.4.1</span>
                    <button onClick={() => setShowConsole(false)}>close</button>
                  </div>
                  <div>&gt; _</div>
                  <div className="text-[10px]">Console initialized.</div>
                  <div className="text-[10px] text-yellow-500">Log: localhost:{currentPort} linked.</div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating State Indicator (if closed) */}
      {!isFloating && (
        <button 
          onClick={() => setIsFloating(true)}
          className="absolute bottom-20 right-4 w-12 h-12 bg-orange-600 shadow-xl rounded-full flex items-center justify-center text-white z-50"
        >
          <Maximize2 size={20} />
        </button>
      )}
    </div>
  );
}

