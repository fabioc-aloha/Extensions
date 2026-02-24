# MCP App Starter

**Scaffold Model Context Protocol (MCP) servers in seconds — TypeScript, JavaScript, or Python**

[![VS Code](https://img.shields.io/badge/VS%20Code-1.109%2B-blue)](https://code.visualstudio.com/)
[![Publisher](https://img.shields.io/badge/publisher-fabioc--aloha-orange)](https://marketplace.visualstudio.com/publishers/fabioc-aloha)

---

## What Is This?

VS Code 1.109 shipped stable MCP server support. Building an MCP server means setting up boilerplate for the SDK, transport, tool handlers, and config. MCP App Starter does all of that in one command.

## Features

| Feature | Description |
|---|---|
| **Guided wizard** | Language picker → name input → instant scaffold |
| **TypeScript template** | Full typed server with tool schemas, tsconfig, package.json |
| **JavaScript template** | Minimal ESM server for lightweight use |
| **Python template** | Server using the official `mcp` package |
| **mcp.json config** | Auto-generates VS Code MCP config ready to paste |
| **Add Tool** | Guided stub for adding new tools |
| **Validate Config** | JSON validator for all `mcp.json` files in workspace |

## Usage

1. Open Command Palette (`Ctrl+Shift+P`)
2. Run **MCP App Starter: New MCP Server**
3. Choose language → enter name → done
4. Open the README inside your new server for next steps

## Generated TypeScript Structure

```
my-mcp-server/
├── src/
│   └── index.ts      ← Server entry point with hello tool
├── mcp.json          ← VS Code MCP config
├── package.json
├── tsconfig.json
└── README.md
```

## Commands

| Command | Description |
|---|---|
| `MCP App Starter: New MCP Server` | Full wizard to create an MCP server project |
| `MCP App Starter: Add Tool` | Guided stub for adding a new tool |
| `MCP App Starter: Add Resource` | Guided stub for adding a new resource |
| `MCP App Starter: Validate MCP Server Config` | Validate mcp.json files in workspace |
| `MCP App Starter: Open MCP Documentation` | Open modelcontextprotocol.io |

## Requirements

- VS Code 1.109+
- Node.js 20+ (for TypeScript/JavaScript templates)
- Python 3.10+ (for Python template)

## License

MIT
