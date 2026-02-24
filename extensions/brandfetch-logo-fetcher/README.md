# Brandfetch Logo Fetcher

![Brandfetch Logo Fetcher Banner](assets/banner.png)

**Fetch company logos and brand assets by domain — insert as Markdown, SVG URL, or HTML**

[![VS Code](https://img.shields.io/badge/VS%20Code-1.109%2B-blue)](https://code.visualstudio.com/)

Type a domain name, choose your format, and the logo is ready to paste. Powered by Brandfetch API with Logo.dev fallback. LRU cache keeps repeated lookups instant.

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

## Source

Shared client: `shared/api/brandfetch.ts`. API key stored via VS Code SecretStorage. License: MIT
