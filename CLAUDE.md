# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a simplified, personal-use MCP (Model Context Protocol) server that provides local documentation management functionality. The server automatically discovers documentation files in your project, builds searchable indexes, and provides AI assistants with contextual access to documentation through the MCP protocol. This version has been streamlined to always use the `./docs` folder and automatically include `README.md` and `CHANGELOG.md` from the project root.

## Key Commands

### Development
- `npm run build` - Compile TypeScript to JavaScript and make the output executable
- `npm run prepare` - Runs build automatically (used by npm during install)
- `npm run watch` - Watch mode for development (auto-rebuild on changes)
- `npm run inspector` - Debug with MCP Inspector using `npx @modelcontextprotocol/inspector build/index.js`

### Runtime
- `npx open-docs-mcp` - Run the MCP server (always uses `./docs` directory)
- The server runs as an MCP server and communicates via stdio transport

## Architecture

### Core Components

**Main Entry Point (`src/index.ts`)**
- MCP server implementation using `@modelcontextprotocol/sdk`
- Handles tool requests and resource requests
- Auto-discovers documentation files from `./docs`, `./README.md`, and `./CHANGELOG.md`
- Generates `TABLE_OF_CONTENTS.md` automatically
- Integrates with SearchEngine for document indexing and search

**Search Engine (`src/search.ts`)**
- Uses Lunr.js for full-text search indexing
- Builds and maintains search indexes from discovered markdown files
- Provides relevance-scored search results with excerpts
- Persistent index storage in `./docs/search-index.json`

**Document Discovery**
- Automatically scans `./docs` directory for `.md` files
- Auto-includes `./README.md` and `./CHANGELOG.md` if they exist
- Recursively scans subdirectories in `./docs`
- No configuration required

### Data Flow

1. **Discovery**: Auto-discover all `.md` files in `./docs`, plus `./README.md` and `./CHANGELOG.md`
2. **Table of Contents**: Generate `./docs/TABLE_OF_CONTENTS.md` with links to all discovered files
3. **Indexing**: SearchEngine builds Lunr.js index from discovered markdown files
4. **Search**: MCP clients can search across all indexed documentation
5. **Persistence**: Search index is saved to `./docs/search-index.json` for faster startup

### MCP Integration

**Tools Provided:**
- `search_docs` - Search documentation with pagination support
- `list_docs` - List all discovered documentation files (with optional verbose mode)
- `refresh_docs` - Scan for new/updated docs, generate TABLE_OF_CONTENTS.md, and rebuild index
- `build_index` - Build/rebuild search index manually

**Resources:**
- Direct access to discovered documentation files as markdown resources
- Each document accessible via `doc:///` URI scheme

## Configuration

- **Docs Directory**: Fixed to `./docs` (no configuration needed)
- **Auto-discovery**: Project `README.md` and `CHANGELOG.md` automatically included
- **No Setup Required**: Works out of the box with any project structure

## Key Dependencies

- `@modelcontextprotocol/sdk` - MCP protocol implementation
- `lunr` - Full-text search indexing
- `fs-extra` - Enhanced filesystem operations

## Development Notes

- The project uses ES modules (`"type": "module"` in package.json)
- TypeScript configuration targets ES2022 with Node16 module resolution
- Search index is persisted as JSON in `./docs/search-index.json` for fast startup
- All documentation files must be in Markdown (`.md`) format
- Automatic TABLE_OF_CONTENTS.md generation shows file modification dates

## Testing and Quality

No test framework is currently configured. When adding tests, check if the project needs a testing framework setup first.