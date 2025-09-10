# open-docs-mcp MCP Server

[![smithery badge](https://smithery.ai/badge/@askme765cs/open-docs-mcp)](https://smithery.ai/server/@askme765cs/open-docs-mcp)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)](package.json)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg)](package.json)

A simplified, personal-use MCP server for local documentation management. Automatically discovers and indexes your project documentation with no configuration required.

[中文文档][url-doczh]

## Features

### ✨ Zero-Configuration Setup
- **Auto-discovery**: Automatically finds all `.md` files in `./docs` directory
- **Project integration**: Includes `./README.md` and `./CHANGELOG.md` automatically  
- **No setup required**: Works out of the box with any project structure

### 📚 Smart Documentation Management
- **TABLE_OF_CONTENTS.md**: Auto-generates comprehensive table of contents
- **Recursive scanning**: Supports nested subdirectories in `./docs`
- **Modification tracking**: Shows last modified dates for all documents

### 🔍 Powerful Search
- **Full-text search**: Lunr.js-powered search with relevance scoring
- **Persistent index**: Fast startup with cached search index
- **Rich results**: Includes file paths, scores, and contextual excerpts

### 🛠 Simplified MCP Tools
1. **search_docs** - Search through all documentation with pagination
2. **list_docs** - List discovered files with optional verbose details
3. **refresh_docs** - One-click refresh of docs, TOC, and search index
4. **build_index** - Manual search index rebuild

### 🎯 Personal Documentation Focus

This simplified version provides focused local documentation management:

1. **Automatic Discovery**:
   - Scans `./docs` directory for all `.md` files recursively
   - Auto-includes project `README.md` and `CHANGELOG.md`
   - Generates `TABLE_OF_CONTENTS.md` with proper linking

2. **Smart Organization**:
   - Groups project-level vs documentation files
   - Shows modification dates for easy tracking
   - Maintains file hierarchy in subdirectories

3. **Reliable Search**:
   - Persistent search index survives restarts
   - No need to rebuild index every time
   - Fast, relevant search results with context

### Architecture
```
┌─────────────────────────────────────────────────────┐
│              Simplified open-docs-mcp               │
├─────────────────┬─────────────────┬─────────────────┤
│ Auto-Discovery  │  Search Engine  │   MCP Server    │
├─────────────────┼─────────────────┼─────────────────┤
│ - Scan ./docs   │ - Lunr.js index │ - 4 simple tools│
│ - Include files │ - Persistent    │ - Doc resources │
│ - Generate TOC  │ - Fast search   │ - No config     │
└─────────────────┴─────────────────┴─────────────────┘
```

## Quick Start

### 1. Run the Server
```bash
npx -y open-docs-mcp
```
*No configuration needed! Always uses `./docs` directory.*

### 2. Add Documentation
```bash
mkdir docs
echo "# My API\nThis is my API documentation." > docs/api.md
echo "# Setup Guide\nHow to set up the project." > docs/setup.md
```

### 3. Use with Claude Desktop
The server will automatically:
- ✅ Discover all `.md` files in `./docs`
- ✅ Include your `README.md` and `CHANGELOG.md`
- ✅ Generate `./docs/TABLE_OF_CONTENTS.md`
- ✅ Build searchable index in `./docs/search-index.json`

### Installing via Smithery

To install Document Management Server for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@askme765cs/open-docs-mcp):

```bash
npx -y @smithery/cli install @askme765cs/open-docs-mcp --client claude
```

### Configuration

### Claude Desktop Configuration

Add this to your Claude Desktop config:

**MacOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows**: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "open-docs-mcp": {
      "command": "npx",
      "args": ["-y", "open-docs-mcp"]
    }
  }
}
```

That's it! No `--docsDir` parameter needed - always uses `./docs`.

## Development

```bash
git clone https://github.com/askme765cs/open-docs-mcp.git
cd open-docs-mcp
npm install
npm run build
npm run watch     # Auto-rebuild on changes
npm run inspector # Debug with MCP Inspector
```

### Project Structure
```
./docs/                   # Your documentation files
├── TABLE_OF_CONTENTS.md  # Auto-generated
├── search-index.json     # Persistent search index
├── api.md               # Your docs
└── guides/
    └── setup.md         # Supports subdirectories

./README.md              # Auto-included
./CHANGELOG.md           # Auto-included  
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](LICENSE)

[url-doczh]: README.zh-CN.md
