/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { Layout, Terminal as TerminalIcon, Github, Monitor, Phone, Info, Activity } from 'lucide-react';
import Terminal from './components/Terminal';
import PhonePreview from './components/PhonePreview';
import CodeExport from './components/CodeExport';
import ProjectDiscovery from './components/ProjectDiscovery';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'docs' | 'build'>('dashboard');
  const [currentPort, setCurrentPort] = useState('3000');

  const handleCommand = (cmd: string) => {
    if (cmd.startsWith('vibe')) {
      const port = cmd.split(' ')[1] || '3000';
      setCurrentPort(port);
    }
  };

  return (
    <div className="min-h-screen bg-primary text-slate-200 font-sans selection:bg-cyan-500 selection:text-white flex flex-col overflow-hidden">
      {/* Android Status Bar Mock */}
      <div className="h-8 bg-black/40 flex items-center justify-between px-6 text-[10px] font-medium tracking-wider opacity-40">
        <span className="font-mono">TERMUX_LIVE_SHELL</span>
        <div className="flex items-center space-x-4">
          <span>5G</span>
          <span>88%</span>
          <span>12:42 PM</span>
        </div>
      </div>

      {/* Header */}
      <header className="h-20 bg-[#141418] border-b border-white/5 flex items-center px-8 justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-cyan-500/10 rounded-xl border border-cyan-500/20 flex items-center justify-center shadow-[0_0_15px_var(--color-accent-glow)]">
            <Layout className="text-cyan-400" size={20} />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white uppercase">Termux<span className="text-cyan-400">Live</span></h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Instance: 01-Production</p>
          </div>
        </div>

        <nav className="hidden lg:flex items-center bg-black/20 rounded-full p-1 border border-white/5">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Monitor },
            { id: 'docs', label: 'Implementation', icon: Info },
            { id: 'build', label: 'Pipeline', icon: Activity },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all ${
                activeTab === tab.id 
                  ? 'bg-white text-black shadow-lg shadow-white/5' 
                  : 'text-slate-500 hover:text-white'
              }`}
            >
              <tab.icon size={13} />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center bg-black/40 border border-white/10 rounded-full h-10 px-5 space-x-3">
            <span className="text-cyan-400 text-xs font-mono">vibe://</span>
            <span className="text-slate-300 text-xs font-mono">localhost:{currentPort}</span>
            <div className="h-3 w-[1px] bg-white/10 mx-1"></div>
            <span className="text-[9px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded border border-green-500/30 font-mono font-bold">CONNECTED</span>
          </div>
          
          <a href="#" className="p-2 transition-colors hover:text-cyan-400 text-slate-500">
            <Github size={18} />
          </a>
          <button className="h-10 px-5 bg-white text-black text-[11px] font-black rounded-lg uppercase tracking-wider shadow-lg shadow-white/5 hover:bg-slate-100 transition-colors">
            GET APK
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {activeTab === 'dashboard' ? (
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* Sidebar / Port Discovery & Terminal */}
            <aside className="w-full lg:w-80 bg-[#0F0F12] border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col p-4 lg:p-6 overflow-y-auto custom-scrollbar shrink-0">
              <div className="mb-6 lg:mb-8">
                <div className="lg:hidden mb-6 flex flex-col gap-2">
                   <h2 className="text-3xl font-black tracking-tighter uppercase leading-tight italic">
                     Mobile <span className="text-cyan-400">Preview</span> Bridge.
                   </h2>
                </div>

                <div className="space-y-4 mb-4 lg:mb-8 hidden lg:block">
                   <div className="space-y-2">
                     <h2 className="text-2xl font-black tracking-tighter uppercase leading-tight italic">
                       Mobile <span className="text-cyan-400">Preview</span> Bridge.
                     </h2>
                     <p className="text-slate-500 text-[11px] leading-relaxed">
                       Transform your Termux development workflow. Use a standalone, floating WebView shell 
                       to preview your local servers directly on your Android device.
                     </p>
                   </div>
                </div>

                <ProjectDiscovery 
                  currentPort={currentPort} 
                  onSelectProject={setCurrentPort} 
                />
              </div>

              <div className="mt-auto pt-4 border-t border-white/5 hidden lg:block">
                <div className="h-[240px]">
                  <Terminal onCommand={handleCommand} />
                </div>
              </div>
            </aside>

            {/* Preview Section */}
            <section className="flex-1 bg-white relative overflow-hidden flex flex-col min-h-[500px] lg:min-h-0">
              <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat opacity-95">
                <div className="relative z-10 w-full flex justify-center">
                  <div className="scale-[0.7] sm:scale-[0.85] md:scale-90 lg:scale-100 origin-center transition-transform duration-500">
                    <PhonePreview currentPort={currentPort} />
                  </div>
                </div>
                
                {/* Visual Polish */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[600px] aspect-square bg-cyan-500/5 rounded-full blur-[80px] lg:blur-[120px]" />
              </div>

              {/* Status Info Footer Overlay */}
              <div className="h-10 bg-primary border-t border-white/5 flex items-center px-6 justify-between absolute bottom-0 w-full z-20">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-500 uppercase tracking-widest leading-none pt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div>
                    <span>Shell_Ready</span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-2">
                    CPU: <span className="text-slate-300">12%</span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-2">
                    MEM: <span className="text-slate-300">244MB</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-[10px] text-slate-500 font-mono uppercase">
                  <span>Android_API_33</span>
                  <span className="text-cyan-400">stable-v2.4.0</span>
                </div>
              </div>
            </section>
          </div>
        ) : activeTab === 'docs' ? (
          <div className="flex-1 overflow-y-auto p-12 bg-primary">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              <CodeExport />
            </motion.div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 bg-primary">
            <div className="w-20 h-20 bg-cyan-500/5 rounded-3xl flex items-center justify-center border border-cyan-500/10 animate-pulse mb-8">
              <Activity className="text-cyan-400" size={40} />
            </div>
            <div className="space-y-2 text-center mb-12">
              <h2 className="text-3xl font-black uppercase tracking-tight italic">Build <span className="text-cyan-400">Pipeline</span></h2>
              <p className="text-slate-500 max-w-md">Automated Gradle build system is producing artifacts. Your CI/CD environment handles device signature and APK bundling.</p>
            </div>
            <div className="w-full max-w-2xl bg-black/40 border border-white/10 rounded-2xl p-8 font-mono text-[11px] text-cyan-400/80 space-y-2 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Github size={64} />
              </div>
              <div className="flex items-center gap-2 text-white/40 mb-4">
                <div className="w-2 h-2 rounded-full bg-red-500/50" />
                <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                <div className="w-2 h-2 rounded-full bg-green-500/50" />
              </div>
              <div>[SYSTEM] Initializing Ubuntu-latest runner...</div>
              <div>[SDK] Android SDK Platform 33 found</div>
              <div>[GRADLE] Executing task: :app:assembleDebug</div>
              <div>[BUILD] Compiling dex artifacts...</div>
              <div className="animate-pulse flex items-center gap-2">
                <span className="inline-block w-3 h-3 bg-cyan-500/20 rounded animate-spin" />
                [BUILD] Signing bundle...
              </div>
              <div className="mt-8 text-white p-4 bg-white/5 rounded-xl flex justify-between items-center border border-white/5">
                <div className="flex items-center gap-3">
                  <Layout className="text-cyan-400" size={16} />
                  <span className="font-bold">TermuxLive-v0.1.2-debug.apk</span>
                </div>
                <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded border border-green-500/30">ARTIFACT_READY</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer Decoration */}
      <footer className="border-t border-white/10 py-12 px-6 mt-20 opacity-50">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[10px] font-mono tracking-widest uppercase">
            Designed for Termux Devs • Built with Gemini
          </div>
          <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Documentation</a>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
