#!/usr/bin/env node

/**
 * This is a template MCP server that implements a simple notes system.
 * It demonstrates core MCP concepts like resources and tools by allowing:
 * - Listing notes as resources
 * - Reading individual notes
 * - Creating new notes via a tool
 * - Summarizing all notes via a prompt
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import fs from 'fs-extra';
import path from 'path';
import { SearchEngine } from './search.js';

/**
 * Type for discovered documents
 */
type DocEntry = {
  path: string;
  title: string;
  lastModified: Date;
};

// Always use ./docs directory
const docDir = './docs';

/**
 * Discover all documentation files
 */
async function discoverDocs(): Promise<DocEntry[]> {
  const docs: DocEntry[] = [];
  
  // Ensure docs directory exists
  await fs.ensureDir(docDir);
  
  // Auto-include project README.md if it exists
  const readmePath = './README.md';
  if (await fs.pathExists(readmePath)) {
    const stats = await fs.stat(readmePath);
    docs.push({
      path: readmePath,
      title: 'Project README',
      lastModified: stats.mtime
    });
  }
  
  // Auto-include project CHANGELOG.md if it exists
  const changelogPath = './CHANGELOG.md';
  if (await fs.pathExists(changelogPath)) {
    const stats = await fs.stat(changelogPath);
    docs.push({
      path: changelogPath,
      title: 'Project Changelog',
      lastModified: stats.mtime
    });
  }
  
  // Scan docs directory for .md files
  if (await fs.pathExists(docDir)) {
    await scanDirectory(docDir, docs);
  }
  
  return docs;
}

/**
 * Recursively scan directory for markdown files
 */
async function scanDirectory(dir: string, docs: DocEntry[]): Promise<void> {
  const entries = await fs.readdir(dir);
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const stats = await fs.stat(fullPath);
    
    if (stats.isDirectory()) {
      await scanDirectory(fullPath, docs);
    } else if (entry.endsWith('.md')) {
      // Create title from file path
      const relativePath = path.relative('.', fullPath);
      const title = relativePath.replace(/\.md$/, '').replace(/\//g, ' / ');
      
      docs.push({
        path: fullPath,
        title,
        lastModified: stats.mtime
      });
    }
  }
}

/**
 * Generate or update TABLE_OF_CONTENTS.md in the docs directory
 */
async function generateTableOfContents(docs: DocEntry[]): Promise<void> {
  const tocPath = path.join(docDir, 'TABLE_OF_CONTENTS.md');
  
  // Create table of contents content
  let content = '# Documentation Table of Contents\n\n';
  content += `Generated on: ${new Date().toISOString()}\n\n`;
  
  // Group docs by category
  const projectDocs: DocEntry[] = [];
  const docsDirDocs: DocEntry[] = [];
  
  docs.forEach(doc => {
    if (doc.path.startsWith('./docs/') || doc.path.startsWith('docs/')) {
      docsDirDocs.push(doc);
    } else {
      projectDocs.push(doc);
    }
  });
  
  // Add project-level documents
  if (projectDocs.length > 0) {
    content += '## Project Documentation\n\n';
    projectDocs.forEach(doc => {
      const relativePath = path.relative('.', doc.path);
      content += `- [${doc.title}](../${relativePath}) - *Modified: ${doc.lastModified.toISOString().split('T')[0]}*\n`;
    });
    content += '\n';
  }
  
  // Add docs directory documents
  if (docsDirDocs.length > 0) {
    content += '## Documentation Files\n\n';
    docsDirDocs.forEach(doc => {
      const relativePath = path.relative(docDir, doc.path);
      content += `- [${doc.title}](${relativePath}) - *Modified: ${doc.lastModified.toISOString().split('T')[0]}*\n`;
    });
    content += '\n';
  }
  
  if (docs.length === 0) {
    content += 'No documentation files found.\n\n';
    content += 'To add documentation:\n';
    content += '1. Add .md files to the ./docs directory\n';
    content += '2. Create README.md in the project root\n';
    content += '3. Create CHANGELOG.md in the project root\n';
    content += '4. Run the refresh_docs tool to update this table of contents\n';
  }
  
  // Write table of contents
  await fs.writeFile(tocPath, content);
  console.log(`Generated TABLE_OF_CONTENTS.md with ${docs.length} documents`);
}

// Initialize search engine
const searchEngine = new SearchEngine(docDir);
await searchEngine.initialize();

/**
 * Create an MCP server with capabilities for resources (to list/read notes),
 * tools (to create new notes), and prompts (to summarize notes).
 */


const server = new Server(
  {
    name: "docs-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    }
  }
);

/**
 * Handler for listing available resources (both notes and docs).
 * Each resource is exposed with:
 * - A unique URI scheme
 * - Plain text MIME type
 * - Human readable name and description
 */
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  const docs = await discoverDocs();
  const docResources = docs.map((doc, index) => ({
    uri: `doc:///${index}`,
    mimeType: "text/markdown",
    name: doc.title,
    description: `Documentation file: ${doc.path}`
  }));

  return {
    resources: docResources
  };
});

/**
 * Handler for reading the contents of a specific document.
 * Takes a doc:// URI and returns the document content as markdown.
 */
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const url = new URL(request.params.uri);
  const id = parseInt(url.pathname.replace(/^\//, ''));
  const docs = await discoverDocs();
  const doc = docs[id];

  if (!doc) {
    throw new Error(`Document ${id} not found`);
  }

  // Read the actual file content
  const content = await fs.readFile(doc.path, 'utf-8');

  return {
    contents: [{
      uri: request.params.uri,
      mimeType: "text/markdown",
      text: content
    }]
  };
});

/**
 * Handler that lists available tools.
 * Exposes tools for creating notes and managing docs.
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "search_docs",
        description: "Search documentation",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Search query"
            },
            max_results: {
              type: "number",
              description: "Maximum number of results",
              default: 5
            },
            offset: {
              type: "number",
              description: "Number of results to skip",
              default: 0
            }
          },
          required: ["query"]
        }
      },
      {
        name: "list_docs",
        description: "List all discovered documentation files",
        inputSchema: {
          type: "object",
          properties: {
            verbose: {
              type: "boolean",
              description: "Whether to show detailed information including file paths and modification dates",
              default: false
            }
          }
        }
      },
      {
        name: "refresh_docs",
        description: "Scan for new/updated docs, generate TABLE_OF_CONTENTS.md, and rebuild search index",
        inputSchema: {
          type: "object",
          properties: {
            force_rebuild: {
              type: "boolean",
              description: "Whether to force rebuild index even if not needed",
              default: false
            }
          }
        }
      },
      {
        name: "build_index",
        description: "Build or rebuild the search index for all discovered documents",
        inputSchema: {
          type: "object",
          properties: {
            force: {
              type: "boolean",
              description: "Whether to force rebuild index",
              default: false
            }
          }
        }
      }
    ]
  };
});

/**
 * Handler for tool requests.
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  switch (request.params.name) {
    case "search_docs": {
      const query = String(request.params.arguments?.query);
      const maxResults = Number(request.params.arguments?.max_results) || 5;
      const offset = Number(request.params.arguments?.offset) || 0;
      
      try {
        const results = await searchEngine.search(query, maxResults, undefined, 0.2, offset);
        if (results.length === 0) {
          return {
            content: [{
              type: "text",
              text: `No results found for query: "${query}"`
            }]
          };
        }
        
        return {
          content: results.map(result => ({
            type: "text",
            text: `[${result.score.toFixed(2)}] ${result.title}\nPath: ${result.path}\n${result.excerpt}\n---`
          }))
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: `Search failed: ${error instanceof Error ? error.message : String(error)}. Try running refresh_docs to build the index first.`
          }]
        };
      }
    }

    case "list_docs": {
      const verbose = Boolean(request.params.arguments?.verbose);
      const docs = await discoverDocs();
      
      if (docs.length === 0) {
        return {
          content: [{
            type: "text",
            text: "No documentation files found.\n\nTo add documentation:\n1. Add .md files to the ./docs directory\n2. Create README.md in the project root\n3. Create CHANGELOG.md in the project root"
          }]
        };
      }
      
      const result = docs.map(doc => {
        const modDate = doc.lastModified.toISOString().split('T')[0];
        return verbose
          ? `${doc.title}\n  Path: ${doc.path}\n  Modified: ${modDate}`
          : `${doc.title} (${modDate})`;
      });

      return {
        content: [{
          type: "text",
          text: `Found ${docs.length} documentation files:\n\n${result.join('\n')}`
        }]
      };
    }

    case "refresh_docs": {
      const forceRebuild = Boolean(request.params.arguments?.force_rebuild);
      
      try {
        // Discover all docs
        const docs = await discoverDocs();
        
        // Generate table of contents
        await generateTableOfContents(docs);
        
        // Build search index using discovered docs
        await searchEngine.buildIndex(docDir, docs);
        
        return {
          content: [{
            type: "text",
            text: `Documentation refreshed successfully!\n- Found ${docs.length} documents\n- Generated TABLE_OF_CONTENTS.md\n- Built search index\n\nUse search_docs to search the documentation.`
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: `Failed to refresh docs: ${error instanceof Error ? error.message : String(error)}`
          }]
        };
      }
    }

    case "build_index": {
      const force = Boolean(request.params.arguments?.force);
      
      try {
        const docs = await discoverDocs();
        await searchEngine.buildIndex(docDir, docs);
        // Access docStore property to get count
        const docCount = Object.keys((searchEngine as any).docStore || {}).length;
        return {
          content: [{
            type: "text",
            text: `Search index built successfully with ${docCount} documents.`
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: `Failed to build index: ${error instanceof Error ? error.message : String(error)}`
          }]
        };
      }
    }

    default:
      throw new Error(`Unknown tool: ${request.params.name}`);
  }
});


/**
 * Start the server using stdio transport.
 * This allows the server to communicate via standard input/output streams.
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
