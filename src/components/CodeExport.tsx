import { useState } from 'react';
import { Copy, Check, FileCode, Terminal, Github } from 'lucide-react';

export default function CodeExport() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const scripts = {
    alias: `alias vibe='am start -d "vibe://port/$1" -a android.intent.action.VIEW com.termux.live'`,
    mainActivity: `package com.termux.live;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.WindowManager;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

/**
 * PRODUCTION-READY TERMUXLIVE SHELL
 * Features: Overlay support, JS Injection, and Custom Scheme handling.
 */
public class MainActivity extends Activity {
    private WebView mWebView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Ensure floating behavior if enabled
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL);
        
        setContentView(R.layout.activity_main);

        mWebView = findViewById(R.id.webview);
        setupWebView();
        
        handleIntent(getIntent());
    }

    private void setupWebView() {
        WebSettings s = mWebView.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setAllowFileAccess(true);
        s.setAllowContentAccess(true);
        
        mWebView.setWebViewClient(new WebViewClient());
        mWebView.setWebChromeClient(new WebChromeClient());

        // Optional: Inject Eruda for mobile debugging
        mWebView.loadUrl("javascript:(function () { var script = document.createElement('script'); script.src='//cdn.jsdelivr.net/npm/eruda'; document.body.appendChild(script); script.onload = function () { eruda.init() } })();");
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        handleIntent(intent);
    }

    private void handleIntent(Intent intent) {
        Uri data = intent.getData();
        if (data != null && "vibe".equals(data.getScheme())) {
            String port = data.getLastPathSegment();
            // Connect to local loopback (Termux session)
            mWebView.loadUrl("http://127.0.0.1:" + port);
        }
    }
}`,
    manifest: `<!-- REQUIRED PERMISSIONS -->
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />

<activity 
    android:name=".MainActivity"
    android:launchMode="singleTask"
    android:theme="@android:style/Theme.DeviceDefault.NoActionBar">
    <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data android:scheme="vibe" android:host="port" />
    </intent-filter>
</activity>`
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto p-4">
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Terminal className="text-cyan-500" size={20} />
          <h2 className="text-lg font-black uppercase tracking-widest italic">Termux Setup</h2>
        </div>
        <p className="text-[11px] text-slate-500 mb-4 uppercase font-bold tracking-tight">Add this alias to your <code className="bg-white/5 border border-white/5 px-1.5 py-0.5 rounded text-cyan-400">.bashrc</code></p>
        <div className="relative group">
          <pre className="bg-black/40 p-6 rounded-2xl border border-white/5 font-mono text-[11px] text-slate-300 overflow-x-auto shadow-2xl">
            {scripts.alias}
          </pre>
          <button 
            onClick={() => copyToClipboard(scripts.alias, 'alias')}
            className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/5"
          >
            {copied === 'alias' ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="text-slate-400" />}
          </button>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <FileCode className="text-cyan-500" size={20} />
          <h2 className="text-lg font-black uppercase tracking-widest italic">Android Implementation</h2>
        </div>
        <p className="text-[11px] text-slate-500 mb-4 uppercase font-bold tracking-tight">Core logic for handling the <code className="text-cyan-400">vibe://</code> intent scheme.</p>
        
        <div className="space-y-4">
          <div className="bg-black/40 rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
            <div className="bg-white/5 px-4 py-3 flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-500 border-b border-white/5">
              <span>MainActivity.java</span>
              <button 
                 onClick={() => copyToClipboard(scripts.mainActivity, 'java')}
                 className="hover:text-cyan-400 flex items-center gap-1 transition-colors"
              >
                {copied === 'java' ? 'Copied' : 'Copy Source'}
              </button>
            </div>
            <pre className="p-6 font-mono text-[10px] text-slate-400 h-64 overflow-y-auto custom-scrollbar leading-relaxed">
              {scripts.mainActivity}
            </pre>
          </div>

          <div className="bg-black/40 rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
           <div className="bg-white/5 px-4 py-3 flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-500 border-b border-white/5">
              <span>AndroidManifest.xml</span>
              <button 
                 onClick={() => copyToClipboard(scripts.manifest, 'manifest')}
                 className="hover:text-cyan-400 flex items-center gap-1 transition-colors"
              >
                {copied === 'manifest' ? 'Copied' : 'Copy Filter'}
              </button>
            </div>
            <pre className="p-6 font-mono text-[10px] text-cyan-400/70 leading-relaxed">
              {scripts.manifest}
            </pre>
          </div>
        </div>
      </section>

      <section className="bg-cyan-500/5 border border-cyan-500/10 p-8 rounded-[32px] flex flex-col items-center text-center shadow-[0_0_50px_rgba(34,211,238,0.05)]">
        <Github size={32} className="mb-4 text-cyan-400" />
        <h3 className="text-xl font-black uppercase tracking-tight italic">Continuous Delivery</h3>
        <p className="text-[11px] text-slate-500 max-w-sm mt-2 uppercase font-bold leading-relaxed px-4">Automate your build pipeline with GitHub Actions. Build and sign your APK for direct distribution.</p>
        <button className="mt-8 px-8 py-3 bg-white text-black text-[11px] font-black rounded-xl uppercase tracking-widest transition-all hover:bg-slate-100 shadow-xl shadow-white/5">
          View Pipeline Docs
        </button>
      </section>
    </div>
  );
}
