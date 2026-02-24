# Brandfetch Logo Fetcher

![Brandfetch Logo Fetcher Banner](https://raw.githubusercontent.com/fabioc-aloha/Extensions/main/extensions/brandfetch-logo-fetcher/assets/banner.png)

**Fetch company logos and brand assets by domain — insert as Markdown, SVG URL, or HTML**

[![VS Code](https://img.shields.io/badge/VS%20Code-1.109%2B-blue)](https://code.visualstudio.com/)

Type a domain name, choose your format, and the logo is ready to paste. Powered by Brandfetch API with Logo.dev fallback. LRU cache keeps repeated lookups instant.

## Features

- **Instant logo lookup** — type a domain, get a logo URL in seconds
- **Multiple output formats** — Markdown image, SVG URL, PNG URL, or HTML img tag
- **Logo.dev fallback** — automatic fallback when Brandfetch returns nothing
- **LRU cache** — repeated lookups never hit the network twice
- **Secure key storage** — API key stored in VS Code SecretStorage, never in settings

## Requirements

A [Brandfetch API key](https://brandfetch.com/developers) is required for full access (generous free tier). Logo.dev fallback works without a key — set yours via Brandfetch: Set API Key.

## Commands

| Command | Description |
|---|---|
| `Brandfetch: Fetch Logo by Domain` | Fetch and copy to clipboard |
| `Brandfetch: Insert Logo at Cursor` | Insert Markdown image at cursor |
| `Brandfetch: Set API Key` | Store Brandfetch API key (uses VS Code SecretStorage) |
| `Brandfetch: Clear Logo Cache` | Clear in-memory LRU cache |

## Output Formats

- **Markdown Image** — `![domain](https://...)`
- **SVG URL** — raw URL for SVG logo
- **PNG URL** — raw URL for PNG logo
- **HTML `<img>`** — full img tag

## License

MIT
