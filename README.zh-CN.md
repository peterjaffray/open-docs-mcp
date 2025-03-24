# open-docs-mcp MCP 服务器

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)](package.json)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg)](package.json)

开源的MCP实现，提供文档管理功能。[English Version][url-docen]

## 功能特性

### 文档管理
- 从多种来源爬取和索引文档
- 支持多种文档格式
- 全文搜索功能

### MCP服务器接口
- 基于资源的文档访问
- 基于工具的文档管理

### 可用工具
1. **enable_doc** - 启用特定文档的爬取
2. **disable_doc** - 禁用特定文档的爬取  
3. **crawl_docs** - 开始爬取已启用的文档
4. **build_index** - 构建文档搜索索引
5. **search_docs** - 搜索文档
6. **list_enabled_docs** - 列出已启用的文档
7. **list_all_docs** - 列出所有可用文档

### Cursor @Docs 兼容性

本项目旨在复现Cursor的@Docs功能，提供：

1. **文档索引**:
   - 从多种来源爬取和索引文档
   - 支持多种文档格式(HTML, Markdown等)
   - 自动重新索引保持文档更新

2. **文档访问**:
   - 在所有索引文档中搜索
   - 与MCP协议集成提供AI上下文

3. **自定义文档管理**:
   - 通过`enable_doc`工具添加新文档源
   - 通过`list_enabled_docs`工具管理已启用文档
   - 使用`crawl_docs`工具强制重新爬取

### 系统架构
```
┌───────────────────────────────────────────────────────┐
│                    open-docs-mcp Server                    │
├───────────────────┬───────────────────┬───────────────┤
│   爬取模块        │   搜索引擎        │   MCP服务器   │
├───────────────────┼───────────────────┼───────────────┤
│ - 网页爬取        │ - 全文索引       │ - 资源管理    │
│ - 文档转换        │ - 相关性评分     │ - 工具管理    │
│ - 存储管理        │ - 查询解析       │ - 提示管理    │
└───────────────────┴───────────────────┴───────────────┘
```

## 使用

```bash
npx -y open-docs-mcp --docsDir ./docs
```

### 配置

在Claude Desktop中使用，添加服务器配置：

MacOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
Windows: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "open-docs-mcp": {
      "command": "npx",
      "args": [
        "-y",
        "open-docs-mcp",
        "--docsDir",
        "/path/to/docs"
      ]
    }
  }
}
```

**配置选项:**
- `command`: Node.js可执行文件
- `args`: 传递给脚本的参数数组
  - `--docsDir`: 必需，指定文档目录路径
- `disabled`: 设为true可临时禁用服务器
- `alwaysAllow`: 无需确认即可使用的工具名称数组

## 开发

```bash
npm run watch  # 自动重建
npm run inspector  # 使用MCP检查器调试
```

## 文档
完整文档请查看[docs](/docs)目录。

## 贡献
欢迎提交Pull Request。重大改动请先创建issue讨论。

## 许可证
[MIT](LICENSE)

[url-docen]: README.md