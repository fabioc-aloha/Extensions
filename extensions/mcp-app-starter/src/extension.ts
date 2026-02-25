import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

let outputChannel: vscode.OutputChannel;

const MCP_SERVER_TEMPLATES = {
    typescript: {
        label: 'TypeScript (recommended)',
        description: 'Full TypeScript MCP server with typed tool schemas'
    },
    javascript: {
        label: 'JavaScript',
        description: 'Lightweight JS MCP server'
    },
    python: {
        label: 'Python',
        description: 'Python MCP server using mcp package'
    }
};

export function activate(context: vscode.ExtensionContext): void {
    outputChannel = vscode.window.createOutputChannel('MCP App Starter');
    context.subscriptions.push(outputChannel);

    context.subscriptions.push(
        vscode.commands.registerCommand('mcpAppStarter.create', () => createMcpServer()),
        vscode.commands.registerCommand('mcpAppStarter.addTool', () => addTool()),
        vscode.commands.registerCommand('mcpAppStarter.addResource', () => addResource()),
        vscode.commands.registerCommand('mcpAppStarter.validate', () => validateConfig()),
        vscode.commands.registerCommand('mcpAppStarter.openDocs', () => {
            vscode.env.openExternal(vscode.Uri.parse('https://modelcontextprotocol.io/docs'));
        })
    );

    outputChannel.appendLine('[MCP App Starter] Activated.');
}

async function createMcpServer(): Promise<void> {
    // Step 1: Choose language
    const langChoice = await vscode.window.showQuickPick(
        Object.entries(MCP_SERVER_TEMPLATES).map(([id, t]) => ({ label: t.label, description: t.description, id })),
        { title: 'MCP Server Language', placeHolder: 'Choose server language' }
    );
    if (!langChoice) { return; }

    // Step 2: Server name
    const serverName = await vscode.window.showInputBox({
        title: 'MCP Server Name',
        prompt: 'Enter a name for your MCP server (e.g. my-mcp-server)',
        validateInput: v => /^[a-z][a-z0-9-]*$/.test(v) ? null : 'Use lowercase letters, numbers, and hyphens only'
    });
    if (!serverName) { return; }

    // Step 3: Output directory
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (!workspaceRoot) {
        vscode.window.showErrorMessage('Open a workspace folder first.');
        return;
    }

    const outputDir = path.join(workspaceRoot, serverName);
    try {
        await fs.promises.access(outputDir);
        vscode.window.showErrorMessage(`Directory ${serverName} already exists.`);
        return;
    } catch { /* doesn't exist — safe to create */ }

    // Step 4: Scaffold
    await vscode.window.withProgress(
        { location: vscode.ProgressLocation.Notification, title: `Creating MCP server: ${serverName}`, cancellable: false },
        async () => {
            await fs.promises.mkdir(outputDir, { recursive: true });
            await fs.promises.mkdir(path.join(outputDir, 'src'), { recursive: true });

            if (langChoice.id === 'typescript') {
                await scaffoldTypeScript(outputDir, serverName);
            } else if (langChoice.id === 'javascript') {
                await scaffoldJavaScript(outputDir, serverName);
            } else {
                await scaffoldPython(outputDir, serverName);
            }

            outputChannel.appendLine(`[MCP App Starter] Created ${serverName} at ${outputDir}`);
        }
    );

    const openChoice = await vscode.window.showInformationMessage(
        `✅ MCP server "${serverName}" created!`,
        'Open in New Window', 'Open README'
    );
    if (openChoice === 'Open in New Window') {
        vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(outputDir), true);
    } else if (openChoice === 'Open README') {
        const readmePath = path.join(outputDir, 'README.md');
        vscode.workspace.openTextDocument(readmePath).then(doc => vscode.window.showTextDocument(doc));
    }
}

async function scaffoldTypeScript(dir: string, name: string): Promise<void> {
    await fs.promises.writeFile(path.join(dir, 'package.json'), JSON.stringify({
        name,
        version: '0.1.0',
        description: `MCP server: ${name}`,
        type: 'module',
        main: 'dist/index.js',
        scripts: {
            build: 'tsc',
            dev: 'tsx src/index.ts',
            start: 'node dist/index.js'
        },
        dependencies: { '@modelcontextprotocol/sdk': '^1.0.0' },
        devDependencies: { typescript: '^5.7.0', tsx: '^4.0.0', '@types/node': '^20.0.0' }
    }, null, 2));

    await fs.promises.writeFile(path.join(dir, 'tsconfig.json'), JSON.stringify({
        compilerOptions: { target: 'ES2022', module: 'Node16', moduleResolution: 'Node16', outDir: 'dist', strict: true }
    }, null, 2));

    await fs.promises.writeFile(path.join(dir, 'src', 'index.ts'), `import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

const server = new Server(
  { name: '${name}', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'hello',
      description: 'Say hello',
      inputSchema: {
        type: 'object',
        properties: { name: { type: 'string', description: 'Name to greet' } },
        required: ['name']
      }
    }
  ]
}));

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === 'hello') {
    const { name } = request.params.arguments as { name: string };
    return { content: [{ type: 'text', text: \`Hello, \${name}! 👋\` }] };
  }
  throw new Error(\`Unknown tool: \${request.params.name}\`);
});

// Start server
const transport = new StdioServerTransport();
await server.connect(transport);
console.error('${name} MCP server running on stdio');
`);

    await fs.promises.writeFile(path.join(dir, 'mcp.json'), JSON.stringify({
        mcpServers: {
            [name]: {
                type: 'stdio',
                command: 'node',
                args: ['dist/index.js']
            }
        }
    }, null, 2));

    await fs.promises.writeFile(path.join(dir, 'README.md'), `# ${name}\n\nAn MCP server scaffolded by MCP App Starter.\n\n## Setup\n\n\`\`\`bash\nnpm install\nnpm run build\n\`\`\`\n\n## Add to VS Code\n\nAdd to your \`.vscode/mcp.json\`:\n\n\`\`\`json\n{\n  "mcpServers": {\n    "${name}": { "type": "stdio", "command": "node", "args": ["dist/index.js"] }\n  }\n}\n\`\`\`\n`);
}

async function scaffoldJavaScript(dir: string, name: string): Promise<void> {
    await fs.promises.writeFile(path.join(dir, 'package.json'), JSON.stringify({
        name, version: '0.1.0', type: 'module', main: 'src/index.js',
        scripts: { start: 'node src/index.js' },
        dependencies: { '@modelcontextprotocol/sdk': '^1.0.0' }
    }, null, 2));

    await fs.promises.writeFile(path.join(dir, 'src', 'index.js'), `import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = new Server({ name: '${name}', version: '1.0.0' }, { capabilities: { tools: {} } });
const transport = new StdioServerTransport();
await server.connect(transport);
console.error('${name} running');
`);
    await fs.promises.writeFile(path.join(dir, 'README.md'), `# ${name}\n\nMCP server (JavaScript).\n\n## Setup\n\n\`\`\`bash\nnpm install && node src/index.js\n\`\`\`\n`);
}

async function scaffoldPython(dir: string, name: string): Promise<void> {
    await fs.promises.writeFile(path.join(dir, 'requirements.txt'), 'mcp>=1.0.0\n');
    await fs.promises.writeFile(path.join(dir, 'src', 'server.py'), `from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp import types

server = Server("${name}")

@server.list_tools()
async def list_tools():
    return [types.Tool(name="hello", description="Say hello",
        inputSchema={"type":"object","properties":{"name":{"type":"string"}},"required":["name"]})]

@server.call_tool()
async def call_tool(name: str, arguments: dict):
    if name == "hello":
        return [types.TextContent(type="text", text=f"Hello, {arguments['name']}!")]
    raise ValueError(f"Unknown tool: {name}")

if __name__ == "__main__":
    import asyncio
    asyncio.run(stdio_server(server))
`);
    await fs.promises.writeFile(path.join(dir, 'README.md'), `# ${name}\n\nMCP server (Python).\n\n## Setup\n\n\`\`\`bash\npip install -r requirements.txt\npython src/server.py\n\`\`\`\n`);
}

async function addTool(): Promise<void> {
    const toolName = await vscode.window.showInputBox({ title: 'Tool Name', prompt: 'Enter tool name (e.g. get_weather)' });
    if (!toolName) { return; }
    vscode.window.showInformationMessage(`Tool stub for "${toolName}" — open your index.ts/index.js and add it to the handlers.`);
}

async function addResource(): Promise<void> {
    const resourceUri = await vscode.window.showInputBox({ title: 'Resource URI', prompt: 'Enter resource URI (e.g. data://config)' });
    if (!resourceUri) { return; }
    vscode.window.showInformationMessage(`Resource stub for "${resourceUri}" — open your server file and add a resource handler.`);
}

async function validateConfig(): Promise<void> {
    const mcpFiles = await vscode.workspace.findFiles('**/mcp.json', '**/node_modules/**');
    if (mcpFiles.length === 0) {
        vscode.window.showWarningMessage('No mcp.json found in workspace.');
        return;
    }
    for (const file of mcpFiles) {
        try {
            const content = (await vscode.workspace.fs.readFile(file)).toString();
            JSON.parse(content);
            outputChannel.appendLine(`✅ ${file.fsPath} — valid JSON`);
        } catch (e) {
            outputChannel.appendLine(`❌ ${file.fsPath} — ${e}`);
        }
    }
    outputChannel.show();
    vscode.window.showInformationMessage('MCP config validation complete. See output channel.');
}

export function deactivate(): void {
    outputChannel?.appendLine('[MCP App Starter] Deactivated.');
}
