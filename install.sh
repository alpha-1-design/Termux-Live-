#!/bin/bash

# ==========================================
# TermuxLive Installer (v0.1.2)
# ==========================================

set -e

echo "🚀 Installing TermuxLive Shell Helpers..."

# 1. Add alias to .bashrc
BASHRC_PATH="$HOME/.bashrc"
ALIAS_CMD="alias vibe='am start -d \"vibe://port/\$1\" -a android.intent.action.VIEW com.termux.live'"

if ! grep -q "alias vibe=" "$BASHRC_PATH"; then
    echo "$ALIAS_CMD" >> "$BASHRC_PATH"
    echo "✅ Alias 'vibe' attached to $BASHRC_PATH"
else
    echo "ℹ️  Alias 'vibe' already configured."
fi

# 2. Check for Android intent capability
if command -v am > /dev/null; then
    echo "✅ Android Activity Manager detected."
else
    echo "⚠️  Warning: 'am' command not found. Are you running this inside Termux?"
fi

echo ""
echo "🎉 Setup Complete!"
echo "----------------------------------------"
echo "Usage: vibe <port>"
echo "Example: vibe 5173"
echo "----------------------------------------"
echo "Note: Ensure the TermuxLive APK is installed on your device."

# Reload session (for current shell)
# Note: In some environments source might fail, so we advise the user
echo "Please run 'source ~/.bashrc' or restart Termux to start vibing."
