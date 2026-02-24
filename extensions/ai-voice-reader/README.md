# AI Voice Reader

![AI Voice Reader Banner](https://raw.githubusercontent.com/fabioc-aloha/Extensions/main/extensions/ai-voice-reader/assets/banner.png)

**Text-to-speech for VS Code — read documents, selections, and notes aloud**

[![VS Code](https://img.shields.io/badge/VS%20Code-1.109%2B-blue)](https://code.visualstudio.com/)
[![Publisher](https://img.shields.io/badge/publisher-fabioc--aloha-orange)](https://marketplace.visualstudio.com/publishers/fabioc-aloha)
[![Version](https://img.shields.io/visual-studio-marketplace/v/fabioc-aloha.ai-voice-reader)](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.ai-voice-reader)

---

## What It Does

Uses the operating system's built-in TTS engine — no API key required. Automatically strips Markdown syntax before reading so headings and code blocks sound natural.

## Features

| Feature | Description |
|---|---|
| **Read Selection** | Read selected text or the current line with one command |
| **Read Document** | Narrate entire files from start to finish |
| **Markdown-aware** | Strips `#`, `**`, backticks, and code fences before speaking |
| **Cross-platform** | PowerShell TTS on Windows, `say` on macOS, `espeak` on Linux |
| **Configurable speed** | Adjust playback rate from 0.5× to 2.0× |
| **Right-click menus** | Right-click any editor → Read Selection, Read Document, or Stop; right-click in Explorer → Read File |

## Requirements

No external tools required. Uses your operating system's built-in text-to-speech engine.

| OS | Engine | Status |
|---|---|---|
| Windows | `System.Speech.Synthesis` via PowerShell | Pre-installed |
| macOS | `say` command | Pre-installed |
| Linux | `espeak` | `sudo apt install espeak` if missing |

## Commands

| Command | Where | Description |
|---|---|---|
| `Voice Reader: Read Selection` | Palette · Editor right-click (selection) | Read selected text (or current line) |
| `Voice Reader: Read Entire Document` | Palette · Editor right-click | Read the whole active file |
| `Voice Reader: Read File...` | Palette · Explorer right-click | Pick any text file to read |
| `Voice Reader: Stop` | Palette · Editor right-click | Stop playback immediately |
| `Voice Reader: Set Voice` | Palette | Choose from available system voices |

## Settings

| Setting | Default | Description |
|---|---|---|
| `voiceReader.rate` | 1.0 | Speed (0.5–2.0) |
| `voiceReader.stripMarkdown` | true | Remove Markdown before speaking |

## License

MIT
