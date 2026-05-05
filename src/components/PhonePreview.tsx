import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Maximize2, Minimize2, RefreshCw, X, Layout, Code2, Terminal as TerminalIcon } from 'lucide-react';

interface PhonePreviewProps {
  currentPort: string;
}

export default function PhonePreview({ currentPort }: PhonePreviewProps) {
  const [isFloating, setIsFloating] = useState(true);
  const [isMini, setIsMini] = useState(false);
  const [showConsole, setShowConsole] = useState(false);

  return (
    <div className="relative w-[300px] sm:w-[320px] h-[600px] sm:h-[640px] bg-[#1a1a1a] rounded-[40px] sm:rounded-[48px] border-[6px] sm:border-[8px] border-[#333] shadow-2xl overflow-hidden self-center">
      {/* Phone Notch/Status Bar */}
      <div className="absolute top-0 w-full h-8 bg-transparent z-50 flex justify-between px-6 sm:px-8 items-center pt-2">
        <span className="text-[9px] sm:text-[10px] text-white font-medium">9:41</span>
        <div className="w-12 sm:w-16 h-4 bg-black rounded-full" />
        <div className="flex items-center gap-1 text-white opacity-80">
          <div className="w-3 h-2 border border-white/40 rounded-[1px]" />
          <div className="w-1.5 h-1.5 bg-white rounded-full opacity-60" />
        </div>
      </div>

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
            {/* Header bar */}
            <div className="bg-[#f0f0f0] px-3 py-1.5 flex items-center justify-between border-b border-gray-200 group cursor-grab active:cursor-grabbing">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_var(--color-accent-glow)]" />
                <span className="text-[10px] font-bold text-gray-600 uppercase tracking-tight">TermuxLive • {currentPort}</span>
              </div>
              <div className="flex items-center gap-1.5 grayscale group-hover:grayscale-0 transition-all">
                <button onClick={() => setIsMini(!isMini)} className="p-0.5 hover:bg-gray-200 rounded">
                  {isMini ? <Maximize2 size={10} /> : <Minimize2 size={10} />}
                </button>
                <button className="p-0.5 hover:bg-gray-200 rounded">
                  <RefreshCw size={10} className="text-cyan-500" />
                </button>
                <button onClick={() => setIsFloating(false)} className="p-0.5 hover:bg-red-100 rounded">
                  <X size={10} className="text-red-500" />
                </button>
              </div>
            </div>

            {/* Browser Content */}
            <div className="relative w-full h-full bg-white bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat">
              {!isMini && (
                <div className="p-4 flex flex-col h-full items-center justify-center text-center">
                  <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mb-2 animate-pulse">
                    <Layout className="text-cyan-600" size={24} />
                  </div>
                  <h3 className="text-sm font-black text-gray-900 leading-tight">Your App is Live.</h3>
                  <p className="text-[9px] text-gray-500 mt-1 uppercase font-bold tracking-widest">Bridging localhost:{currentPort}</p>
                  
                  <div className="mt-4 w-full h-24 bg-gray-50 rounded-xl border border-dashed border-gray-200 flex items-center justify-center">
                    <span className="text-[8px] text-gray-400 font-mono italic">WebView::SourceRenderer</span>
                  </div>
                </div>
              )}

              {/* Eruda Console Toggle Button (Invisible but active) */}
              <button 
                onClick={() => setShowConsole(!showConsole)}
                className="absolute right-2 bottom-2 w-4 h-4 bg-gray-200/50 rounded-full border border-gray-300 flex items-center justify-center text-[8px]"
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
                  className="absolute bottom-0 left-0 w-full h-1/2 bg-black/90 p-2 text-xs font-mono text-cyan-400 border-t border-cyan-500/30 overflow-y-auto"
                >
                  <div className="flex justify-between items-center mb-1 text-[8px] opacity-50">
                    <span>Eruda v2.4.1</span>
                    <button onClick={() => setShowConsole(false)}>close</button>
                  </div>
                  <div>&gt; _</div>
                  <div className="text-[10px]">Console initialized.</div>
                  <div className="text-[10px] text-yellow-500">Warning: HMR socket connected.</div>
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
          className="absolute bottom-20 right-4 w-12 h-12 bg-orange-600 shadow-xl rounded-full flex items-center justify-center text-white"
        >
          <Maximize2 size={20} />
        </button>
      )}
    </div>
  );
}
