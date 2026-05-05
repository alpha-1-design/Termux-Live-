# TermuxLive 🚀

**Seamless Mobile Preview Bridge for Termux Development**

TermuxLive is a specialized previewer and live window shell for developers building web applications directly on Android using Termux. It provides a standalone, floating WebView environment that bridges your Termux local servers (localhost) to a polished mobile interface with auto-reconnection and smart intent handling.

![TermuxLive UI Preview](https://grainy-gradients.vercel.app/noise.svg)

## ✨ Features

- **Floating UI:** Work in Termux while your app lives in a dedicated, draggable window.
- **Vibe Intent:** Use the `vibe <port>` command in Termux to instantly switch the preview target.
- **Service Discovery:** Automatically scans common dev ports (5173, 3000, 8080) for active servers.
- **Auto-Connect:** Intelligently switches to the most relevant project when it comes online.
- **Mobile Debugging:** Optional Eruda console injection for inspecting elements and logs on the go.

## 🛠️ Termux Setup

1. **Install the helper:**
   Download and run the installer script:
   ```bash
   curl -sSL https://raw.githubusercontent.com/YOUR_USERNAME/TermuxLive/main/install.sh | bash
   ```

2. **Start Vibing:**
   Once your server (e.g., Vite/React) is running on port 5173:
   ```bash
   vibe 5173
   ```

## 📱 Android Implementation

The core of TermuxLive is a lightweight Android Shell that handles the `vibe://` URI scheme.

### Custom Intent Filter
Add this to your `AndroidManifest.xml` to intercept the vibes:
```xml
<intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="vibe" android:host="port" />
</intent-filter>
```

## 🤝 Contributing

We love contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to get started.

## 🛡️ Security

If you discover any security-related issues, please see [SECURITY.md](SECURITY.md) instead of using the issue tracker.

## ⚖️ License

Distributed under the Apache License 2.0. See `LICENSE` for more information.

---
Built with ❤️ for the Termux Community.
