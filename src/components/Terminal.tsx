import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface TerminalProps {
  onCommand?: (cmd: string) => void;
}

export default function Terminal({ onCommand }: TerminalProps) {
  const [history, setHistory] = useState<string[]>([
    'Welcome to Termux (v0.118-TermuxLive)',
    'Type "help" for a list of commands.',
    '',
    '$ vibration-check',
    'Sensors active...',
    '$ vibe 3000',
    'Switching preview to localhost:3000...',
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && input.trim()) {
      setHistory(prev => {
        const newHistory = [...prev, `$ ${input}`];
        
        // Command logic
        const args = input.trim().split(/\s+/);
        const cmd = args[0].toLowerCase();
        
        if (cmd === 'vibe') {
          const port = args[1] || '3000';
          newHistory.push(`Intent sent: vibe://port/${port}`);
          newHistory.push(`Target: http://127.0.0.1:${port}`);
          onCommand?.(input);
        } else if (cmd === 'help') {
          newHistory.push('TermuxLive Commands:');
          newHistory.push('  vibe <port>    - Switch preview to specific port');
          newHistory.push('  scan           - Scan local ports');
          newHistory.push('  status         - Show connection status');
          newHistory.push('  clear          - Clear terminal history');
        } else if (cmd === 'clear') {
          return [];
        } else if (cmd === 'scan') {
          newHistory.push('Starting discovery protocol...');
          onCommand?.('scan');
        } else if (cmd === 'status') {
          newHistory.push('Session: ACTIVE');
          newHistory.push('Shell: bash-5.1');
          newHistory.push('Bridge: TermuxLive/0.1.2');
        } else {
          newHistory.push(`sh: command not found: ${cmd}`);
        }

        // Limit history to 100 lines
        return newHistory.slice(-100);
      });
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-black/40 text-[#ffffff]/80 font-mono p-4 rounded-2xl border border-white/5 shadow-2xl overflow-hidden backdrop-blur-md">
      <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2 text-[10px] font-bold uppercase tracking-widest opacity-40">
        <div className="flex items-center gap-2">
           <TerminalIcon size={12} />
           <span>termux - bash</span>
        </div>
        <span>v0.118</span>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-1 mb-4 custom-scrollbar text-[11px] leading-relaxed">
        {history.map((line, i) => (
          <div key={i} className={line.startsWith('$') ? 'text-cyan-400 font-bold' : 'opacity-60'}>
            {line}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="flex items-center gap-2 bg-white/5 p-2 rounded-lg border border-white/5">
        <ChevronRight size={14} className="text-cyan-400 shrink-0" />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-none outline-none text-white focus:ring-0 p-0 text-[11px]"
          autoFocus
          spellCheck={false}
        />
      </div>
    </div>
  );
}
