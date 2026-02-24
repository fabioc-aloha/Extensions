# Brandfetch Logo Fetcher

![Brandfetch Logo Fetcher Banner](https://raw.githubusercontent.com/fabioc-aloha/Extensions/main/extensions/brandfetch-logo-fetcher/assets/banner.png)

**Fetch company logos and brand assets by domain — insert as Markdown, SVG URL, or HTML**

[![VS Code](https://img.shields.io/badge/VS%20Code-1.109%2B-blue)](https://code.visualstudio.com/)
[![Publisher](https://img.shields.io/badge/publisher-fabioc--aloha-orange)](https://marketplace.visualstudio.com/publishers/fabioc-aloha)
[![Version](https://img.shields.io/visual-studio-marketplace/v/fabioc-aloha.brandfetch-logo-fetcher)](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.brandfetch-logo-fetcher)

---

## What It Does

Type a domain name, choose your format, and the logo is ready to paste. Powered by Brandfetch API with Logo.dev fallback. LRU cache keeps repeated lookups instant.

## Features

| Feature | Description |
|---|---|
| **Instant logo lookup** | Type a domain, get a logo URL in seconds |
| **Multiple output formats** | Markdown image, SVG URL, PNG URL, or HTML img tag |
| **Logo.dev fallback** | Automatic fallback when Brandfetch returns nothing |
| **LRU cache** | Repeated lookups never hit the network twice |
| **Secure key storage** | API key stored in VS Code SecretStorage, never in settings |
| **Right-click menus** | Right-click anywhere in an editor → **Fetch Logo** or **Insert Logo at Cursor** |

## Requirements

A [Brandfetch API key](https://brandfetch.com/developers) is required for full access (generous free tier). Logo.dev fallback works without a key — set yours via Brandfetch: Set API Key.

## Commands

| Command | Where | Description |
|---|---|---|
| `Brandfetch: Fetch Logo by Domain` | Palette · Editor right-click | Fetch and copy to clipboard |
| `Brandfetch: Insert Logo at Cursor` | Palette · Editor right-click | Insert Markdown image at cursor |
| `Brandfetch: Set API Key` | Palette | Store Brandfetch API key (uses VS Code SecretStorage) |
| `Brandfetch: Clear Logo Cache` | Palette | Clear in-memory LRU cache |

## Output Formats

- **Markdown Image** — `![domain](https://...)`
- **SVG URL** — raw URL for SVG logo
- **PNG URL** — raw URL for PNG logo
- **HTML `<img>`** — full img tag

## License

MIT
