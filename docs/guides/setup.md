# Setup Guide

This guide explains how to set up the simplified MCP server.

## Quick Start

1. Clone the repository
2. Run `npm install`
3. Run `npm run build`
4. Use `npx open-docs-mcp` to start the server

## Configuration

No configuration is needed! The server automatically:
- Uses the `./docs` directory
- Includes `README.md` and `CHANGELOG.md` from project root
- Generates `TABLE_OF_CONTENTS.md`
- Builds search index

## Testing

Create some `.md` files in the `./docs` directory and the server will discover them automatically.