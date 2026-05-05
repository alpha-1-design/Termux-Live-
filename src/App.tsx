/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, Component, ReactNode, ErrorInfo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Layout, Terminal as TerminalIcon, Github, Monitor, Phone, Info, Activity, Download, Heart, Code2 } from 'lucide-react';
import { App as CapApp } from '@capacitor/app';
import Terminal from './components/Terminal';
import PhonePreview from './components/PhonePreview';
import CodeExport from './components/CodeExport';
import ProjectDiscovery from './components/ProjectDiscovery';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'docs' | 'build'>('dashboard');
  const [currentPort, setCurrentPort] = useState('3000');
  const [scanTrigger, setScanTrigger] = useState(0);

  useEffect(() => {
    // Handle Capacitor Deep Links
    const setupListeners = async () => {
      try {
        // Only run on native platforms if possible, or handle gracefully
        const listener = await CapApp.addListener('appUrlOpen', data => {
          console.log('App opened with URL:', data.url);
          try {
            // Some deep links might not have double slashes, e.g., vibe:5173
            // new URL() might fail if the scheme is non-standard and missing //
            let urlString = data.url;
            if (urlString.startsWith('vibe:') && !urlString.startsWith('vibe://')) {
              urlString = urlString.replace('vibe:', 'vibe://');
            }
            
            const url = new URL(urlString);
            if (url.protocol === 'vibe:') {
              // Logic check: if host is 'port', the number is in the path
              // vibe://port/5173 -> host="port", path="/5173"
              // vibe://5173 -> host="5173", path=""
              let port = url.host;
              if (port === 'port') {
                port = url.pathname.replace('/', '');
              }
              
              if (port && /^\d+$/.test(port)) {
                setCurrentPort(port);
                setActiveTab('dashboard');
              }
            }
          } catch (e) {
            console.warn('Failed to parse deep link URL:', data.url, e);
          }
        });

        return () => {
          listener.remove();
        };
      } catch (e) {
        console.warn('Capacitor App plugin not available:', e);
      }
    };

    let cleanup: (() => void) | undefined;
    setupListeners().then(cb => { cleanup = cb; });

    return () => {
      if (cleanup) cleanup();
      try {
        CapApp.removeAllListeners();
      } catch (e) {
        // Ignore if plugin not available
      }
    };
  }, []);

  const handleCommand = (cmd: string) => {
    if (cmd.startsWith('vibe')) {
      const port = cmd.trim().split(/\s+/)[1] || '3000';
      if (/^\d+$/.test(port)) {
        setCurrentPort(port);
      }
    } else if (cmd === 'scan') {
      setScanTrigger(prev => prev + 1);
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
          <div className="w-10 h-10 bg-purple-500/10 rounded-xl border border-purple-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.15)]">
            <span className="text-purple-400 font-bold font-mono">&gt;_</span>
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white uppercase">Termux<span className="text-purple-400">Live</span></h1>
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
            <span className="text-purple-400 text-xs font-mono">vibe://</span>
            <span className="text-slate-300 text-xs font-mono">localhost:{currentPort}</span>
            <div className="h-3 w-[1px] bg-white/10 mx-1"></div>
            <span className="text-[9px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded border border-green-500/30 font-mono font-bold">CONNECTED</span>
          </div>
          
          <a href="#" className="p-2 transition-colors hover:text-purple-400 text-slate-500">
            <Github size={18} />
          </a>
          <button className="h-10 px-5 bg-white text-black text-[11px] font-black rounded-lg uppercase tracking-wider shadow-lg shadow-white/5 hover:bg-slate-100 transition-colors">
            GET APK
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' ? (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col lg:flex-row overflow-hidden"
              >
                {/* Sidebar / Port Discovery & Terminal */}
                <aside className="w-full lg:w-80 bg-[#0F0F12] border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col p-4 lg:p-6 overflow-y-auto custom-scrollbar shrink-0">
                  <div className="mb-6 lg:mb-8">
                    <div className="lg:hidden mb-6 flex flex-col gap-2">
                       <h2 className="text-3xl font-black tracking-tighter uppercase leading-tight italic">
                         Mobile <span className="text-purple-400">Preview</span> Bridge.
                       </h2>
                    </div>

                    <div className="space-y-4 mb-4 lg:mb-8 hidden lg:block">
                       <div className="space-y-2">
                         <h2 className="text-2xl font-black tracking-tighter uppercase leading-tight italic">
                           Mobile <span className="text-purple-400">Preview</span> Bridge.
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
                      onShowDocs={() => setActiveTab('docs')}
                      triggerScan={scanTrigger}
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
                        <PhonePreview currentPort={currentPort} isFloating={false} />
                      </div>
                    </div>
                    
                    {/* Visual Polish */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[600px] aspect-square bg-purple-500/5 rounded-full blur-[80px] lg:blur-[120px]" />
                  </div>

                  {/* Status Info Footer Overlay */}
                  <div className="h-10 bg-primary border-t border-white/5 flex items-center px-6 justify-between absolute bottom-0 w-full z-20">
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-500 uppercase tracking-widest leading-none pt-0.5 shrink-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div>
                        <span>Shell_Ready</span>
                      </div>
                      <div className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-2 pr-4 border-r border-white/10">
                        CPU: <span className="text-slate-300">Active</span>
                      </div>
                      <div className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-2 max-w-[200px] sm:max-w-none">
                        USER: <span className="text-purple-400 selection:bg-purple-400/20 truncate">alpharian</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-[10px] text-slate-500 font-mono uppercase shrink-0">
                      <div className="flex items-center gap-2">
                        <span className="hidden sm:inline">Registry</span>
                        <span className="text-white/30 truncate max-w-[80px]">v0.1.2-STABLE</span>
                      </div>
                      <div className="px-2 py-0.5 bg-purple-400/10 text-purple-400 rounded text-[9px] font-bold">PRO</div>
                    </div>
                  </div>
                </section>
              </motion.div>
            ) : activeTab === 'docs' ? (
              <motion.div 
                key="docs"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 overflow-y-auto p-12 bg-primary custom-scrollbar"
              >
                <div className="max-w-4xl mx-auto space-y-12 pb-20">
                  <section className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-black italic uppercase tracking-tighter">Implementation Guide</h3>
                      <p className="text-slate-500 text-xs font-mono uppercase tracking-[0.2em]">Setup Protocol v0.1.2</p>
                    </div>
                    
                    <div className="grid gap-6">
                      <div className="p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-purple-500/20 transition-all space-y-4">
                        <div className="flex items-center gap-4">
                           <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-xs font-black italic shadow-lg shadow-purple-500/20">01</div>
                           <h4 className="text-sm font-bold uppercase tracking-widest text-white">CLI Integration</h4>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed pl-12">
                          Download the installation script into your Termux environment. This adds the <code className="text-purple-400 px-1 bg-purple-400/10 rounded">vibe</code> command to your shell, allowing you to trigger the bridge instantly.
                        </p>
                        <div className="pl-12">
                           <pre className="p-3 bg-black/40 rounded-lg text-[10px] font-mono text-purple-400/70 border border-white/5">
                             curl -sSL https://termux.live/install.sh | bash
                           </pre>
                        </div>
                      </div>

                      <div className="p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-purple-500/20 transition-all space-y-4">
                        <div className="flex items-center gap-4">
                           <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-xs font-black italic shadow-lg shadow-purple-500/20">02</div>
                           <h4 className="text-sm font-bold uppercase tracking-widest text-white">The Vibe Intent</h4>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed pl-12">
                          Once your local dev server is running (e.g. Vite on 5173), simply run the command below to bridge the session to the TermuxLive shell.
                        </p>
                        <div className="pl-12">
                           <pre className="p-3 bg-black/40 rounded-lg text-[10px] font-mono text-purple-400/70 border border-white/5">
                             vibe 5173
                           </pre>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="space-y-6 pt-12 border-t border-white/5">
                    <div className="flex items-center justify-between">
                       <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Android Manifest</h3>
                       <span className="text-[10px] text-purple-400/50 font-mono">Intent-Filter Config</span>
                    </div>
                    <div className="p-6 bg-black/40 rounded-2xl border border-white/5 relative group">
                      <pre className="text-[11px] font-mono text-slate-300 overflow-x-auto leading-normal">
    {`<!-- Add to your Activity in AndroidManifest.xml -->
    <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data android:scheme="vibe" />
    </intent-filter>`}
                      </pre>
                      <button className="absolute top-4 right-4 text-[10px] font-bold text-slate-500 hover:text-white uppercase transition-colors">Copy</button>
                    </div>
                  </section>

                  <div className="pt-12 border-t border-white/5">
                    <CodeExport />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="build"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="flex-1 flex flex-col items-center justify-center p-12 bg-primary relative overflow-hidden"
              >
                {/* Background Art */}
                <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/10 rounded-full animate-[spin_20s_linear_infinite]" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                </div>

                <div className="relative z-10 w-full max-w-4xl flex flex-col items-center">
                  <div className="w-24 h-24 bg-purple-500 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-purple-500/20 mb-8 transform -rotate-12 hover:rotate-0 transition-transform">
                     <span className="text-4xl text-white font-black italic font-mono">&gt;_</span>
                  </div>
                  
                  <div className="space-y-4 text-center mb-12">
                    <h2 className="text-5xl font-black uppercase tracking-tighter italic leading-none">
                      Distribution <span className="text-purple-400">Node</span>.
                    </h2>
                    <p className="text-slate-400 text-sm font-medium uppercase tracking-[0.2em]">Automated Build Pipeline Active</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 w-full">
                    {/* Identity Card */}
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center text-purple-400">
                          <TerminalIcon size={24} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold uppercase tracking-widest text-white">App Identity</h4>
                          <p className="text-[10px] text-slate-500 uppercase font-mono">Termux-Ecosystem Branding</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-[#0F0F12] rounded-2xl flex items-center justify-center border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.15)] relative overflow-hidden group">
                          {/* Terminal Background Pattern */}
                          <div className="absolute inset-0 opacity-10 pointer-events-none font-mono text-[6px] p-2 leading-none">
                            &gt; root@termux<br/>
                            &gt; vibe 5173<br/>
                            &gt; bridge open<br/>
                            &gt; signal active
                          </div>
                          
                          {/* Main Icon Symbol */}
                          <div className="relative z-10 flex flex-col items-center gap-1">
                            <div className="flex items-center gap-1">
                              <span className="text-2xl font-black text-white italic">&gt;</span>
                              <div className="w-2 h-5 bg-purple-500 animate-pulse" />
                            </div>
                            <div className="px-1.5 py-0.5 bg-white text-black text-[7px] font-black italic rounded-sm">LIVE</div>
                          </div>

                          {/* Aesthetic Glow */}
                          <div className="absolute top-0 right-0 w-12 h-12 bg-purple-500/20 rounded-full blur-2xl" />
                        </div>
                        <div className="space-y-1 flex-1">
                          <span className="text-[10px] font-black text-purple-400 uppercase tracking-[0.2em]">Visual Signature</span>
                          <p className="text-[9px] text-slate-400 leading-tight">
                            "Bridge Prompt" design language. Built to sit perfectly alongside Termux:API and Termux:GUI on the home screen.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Status Card */}
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center text-green-400">
                          <Download size={24} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold uppercase tracking-widest text-white">Latest Artifact</h4>
                          <p className="text-[10px] text-slate-500 uppercase font-mono">v0.1.2-STABLE • Debug APK</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="p-4 bg-black/40 rounded-2xl border border-white/5 flex items-center justify-between group">
                          <div className="flex items-center gap-3">
                            <Code2 className="text-purple-400" size={16} />
                            <span className="text-xs font-mono text-slate-300">app-debug.apk</span>
                          </div>
                          <a 
                            href="https://github.com/alpharian/TermuxLive/actions" 
                            target="_blank" 
                            rel="noreferrer"
                            className="px-4 py-2 bg-white text-black text-[10px] font-black rounded-lg hover:bg-purple-400 transition-colors uppercase tracking-widest"
                          >
                            Download
                          </a>
                        </div>
                        <p className="text-[9px] text-slate-500 leading-relaxed italic px-2">
                          Artifacts are stored in GitHub Actions. Visit the pipeline to download the latest signed debug bundle.
                        </p>
                      </div>
                    </div>

                    {/* Logs Card */}
                    <div className="bg-black/40 border border-white/5 rounded-3xl p-6 font-mono text-[10px] space-y-2 relative overflow-hidden group">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-slate-600 uppercase font-bold tracking-widest">CI/CD Terminal</span>
                        <div className="flex gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-red-500/20" />
                          <div className="w-2 h-2 rounded-full bg-yellow-500/20" />
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                        </div>
                      </div>
                      <div className="text-cyan-400/80">$ gradlew assembleDebug</div>
                      <div className="text-white/40">&gt; Building 82% [dexMerger]</div>
                      <div className="text-white/40">&gt; Task :app:processDebugResources</div>
                      <div className="text-white/20">&gt; Task :app:compileDebugJavaWithJavac</div>
                      <div className="text-green-400 mt-4 group-hover:translate-x-1 transition-transform">BUILD SUCCESSFUL in 4m 12s</div>
                    </div>
                  </div>
                </div>
              </motion.div>
          )}
        </AnimatePresence>
      </main>


      {/* Main Footer */}
      <footer className="border-t border-white/10 py-16 px-6 mt-20 relative overflow-hidden bg-[#0F0F12]">
        <div className="container mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center text-white font-black italic transform -rotate-12 shadow-lg shadow-purple-500/20">
                    <span className="text-lg">&gt;_</span>
                  </div>
                  <div className="text-2xl font-black italic tracking-tighter uppercase leading-none">
                    Termux<span className="text-purple-400">Live</span>.
                  </div>
                </div>
                <div className="text-[10px] font-mono tracking-widest uppercase text-slate-500">
                  Universal Bridge for Mobile Devs • Built by Alpha
                </div>
                <div className="flex flex-col gap-1.5 pt-2">
                  <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Lead Maintenance</span>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-slate-800 border border-white/5" />
                    <span className="text-[10px] font-mono text-slate-300">alphariansamuel@gmail.com</span>
                  </div>
                </div>
              </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-white">Resources</h4>
                <div className="flex flex-col gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  <button onClick={() => setActiveTab('docs')} className="hover:text-cyan-400 transition-colors text-left">Documentation</button>
                  <a href="https://github.com/alpharian/termux-live" className="hover:text-cyan-400 transition-colors">GitHub Repo</a>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-white">Connect</h4>
                <div className="flex flex-col gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  <a href="mailto:alphariansamuel@gmail.com" className="hover:text-cyan-400 transition-colors">Email Support</a>
                  <a href="#" className="hover:text-cyan-400 transition-colors">Community</a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between gap-4 text-[9px] font-mono text-slate-600 uppercase tracking-widest">
            <span>© 2026 TermuxLive Project. Open Source under Apache 2.0.</span>
            <div className="flex gap-6">
              <a href="#" className="hover:text-slate-400 transition-colors">Privacy</a>
              <a href="#" className="hover:text-slate-400 transition-colors">Terms</a>
            </div>
          </div>
        </div>
        
        {/* Background Glow */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px]" />
      </footer>
    </div>
  );
}
