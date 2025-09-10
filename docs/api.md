# API Documentation

This document describes the MCP server API.

## Tools

### search_docs
Search through all documentation files.

**Parameters:**
- `query` (required): Search query string
- `max_results` (optional): Maximum number of results to return (default: 5)
- `offset` (optional): Number of results to skip (default: 0)

### list_docs
List all discovered documentation files.

**Parameters:**
- `verbose` (optional): Show detailed information (default: false)

### refresh_docs
Refresh the documentation index and table of contents.

**Parameters:**
- `force_rebuild` (optional): Force rebuild even if not needed (default: false)