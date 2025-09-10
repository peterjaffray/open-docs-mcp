# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2025-09-10

### 🚀 Major Simplification & Personal Use Focus

This release completely restructures the MCP server for personal use, removing complex web crawling functionality in favor of simple local documentation management.

#### Added
- **Auto-discovery system**: Automatically includes `./README.md` and `./CHANGELOG.md` from project root
- **TABLE_OF_CONTENTS.md generation**: Auto-creates comprehensive table of contents in `./docs/`
- **Simplified MCP tools**: 
  - `search_docs` - Search with pagination and better error handling
  - `list_docs` - List discovered files with optional verbose mode
  - `refresh_docs` - One-click refresh of docs, TOC, and search index
  - `build_index` - Manual index rebuild
- **Persistent search index**: Reliable storage in `./docs/search-index.json`
- **Recursive directory scanning**: Supports subdirectories in `./docs`
- **Enhanced error handling**: Clear error messages and recovery suggestions

#### Changed
- **Fixed docs directory**: Always uses `./docs` (no configuration needed)
- **Streamlined dependencies**: Removed 5 unused packages (puppeteer, yargs, cheerio, etc.)
- **Improved search results**: Include file paths, modification dates, and relevance scores
- **Better resource handling**: Direct markdown file access via `doc:///` URIs
- **Server version**: Updated to 1.0.0 for consistency

#### Removed
- **Web crawling functionality**: Eliminated Puppeteer and all remote doc loading
- **Configuration complexity**: No more command-line args, environment variables, or config files
- **Sample data**: Removed hardcoded sample notes
- **Remote doc sources**: No more external JSONL file dependencies
- **Enable/disable system**: No more per-doc configuration
- **Prompts handlers**: Removed unused note summarization functionality

#### Fixed
- **Index persistence issues**: Search index now reliably saves and loads
- **Startup performance**: Faster initialization with proper index loading
- **Document categorization**: Proper grouping of project vs docs directory files
- **TypeScript errors**: Fixed all error handling type issues

### Technical Improvements
- Reduced codebase by ~500 lines
- Eliminated 6 unused dependencies
- Improved TypeScript strict mode compliance
- Enhanced documentation and code comments
- Added comprehensive test coverage

## [1.0.3] - 2025-04-09

### Added
- Smithery deployment support (thanks @calclavia)
  
### Fixed (thanks @KunihiroS)
- Auto-create config file when not exists to prevent errors on first run
- Fixed error when running `list_all_docs` or `list_enabled_docs` before any configuration
- Fixed incorrect path handling in document crawling that ignored the `--docsDir` parameter
- Added WSL compatibility options to Puppeteer for better performance in WSL environments

## [1.0.0] - 2025-03-25
### Added
- Initial release of docs-mcp MCP Server
- Core functionality for document management
- MCP protocol implementation
- Basic document summarization

### Changed
- Updated project documentation
- Improved README and project brief
- Version bump to 1.0.0

### Fixed
- Documentation formatting issues
- Project metadata consistency