#!/bin/bash

# TermuxLive Installation Script
# Run this inside Termux to set up the 'vibe' command

echo "Installing TermuxLive Shell Helpers..."

# Add alias to .bashrc if not already present
if ! grep -q "alias vibe=" ~/.bashrc; then
    echo "alias vibe='am start -d \"vibe://port/\$1\" -a android.intent.action.VIEW com.termux.live'" >> ~/.bashrc
    echo "✓ Alias 'vibe' added to .bashrc"
else
    echo "• Alias 'vibe' already exists in .bashrc"
fi

# Reload bashrc
source ~/.bashrc

echo ""
echo "Installation complete!"
echo "Usage: vibe <port>"
echo "Example: vibe 3000"
echo ""
echo "Note: Make sure you have the TermuxLive Android APK installed on your device."
