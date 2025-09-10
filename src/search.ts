import lunr from 'lunr';
import path from 'path';
import fs from 'fs-extra';

interface DocEntry {
  path: string;
  title: string;
  content: string;
}

class SearchEngine {
  private index!: lunr.Index;
  private docStore: Record<string, DocEntry> = {};
  private indexPath: string;

  constructor(docsDir: string) {
    this.indexPath = path.join(docsDir, 'search-index.json');
  }

  async initialize() {
    if (await fs.pathExists(this.indexPath)) {
      await this.loadIndex();
    }
  }

  private async loadIndex() {
    const indexData = await fs.readJson(this.indexPath);
    this.index = lunr.Index.load(indexData.index);
    this.docStore = indexData.docStore;
  }

  async buildIndex(docsDir: string, docEntries?: { path: string, title: string }[]) {
    const docs = docEntries ? await this.loadDocsFromEntries(docEntries) : await this.collectDocs(docsDir);
    this.index = lunr(function() {
      this.ref('path');
      this.field('title');
      this.field('content');
      
      docs.forEach(doc => {
        this.add(doc);
      });
    });

    // Store documents separately
    this.docStore = {};
    docs.forEach(doc => {
      this.docStore[doc.path] = doc;
    });

    await this.saveIndex();
  }

  private async loadDocsFromEntries(docEntries: { path: string, title: string }[]): Promise<DocEntry[]> {
    const docs: DocEntry[] = [];
    
    for (const entry of docEntries) {
      try {
        if (await fs.pathExists(entry.path)) {
          const content = await fs.readFile(entry.path, 'utf-8');
          docs.push({
            path: entry.path,
            title: entry.title,
            content
          });
        }
      } catch (error) {
        console.error(`Failed to read file ${entry.path}:`, error);
      }
    }
    
    return docs;
  }

  private async collectDocs(docsDir: string): Promise<DocEntry[]> {
    const docs: DocEntry[] = [];
    const docCategories = await fs.readdir(docsDir);
    
    for (const category of docCategories) {
      const categoryPath = path.join(docsDir, category);
      if ((await fs.stat(categoryPath)).isDirectory()) {
        const files = await fs.readdir(categoryPath);
        
        for (const file of files) {
          if (file.endsWith('.md')) {
            const filePath = path.join(categoryPath, file);
            const content = await fs.readFile(filePath, 'utf-8');
            docs.push({
              path: filePath,
              title: `${category}/${path.basename(file, '.md')}`,
              content
            });
          }
        }
      }
    }
    
    return docs;
  }

  private async saveIndex() {
    await fs.writeJson(this.indexPath, {
      version: new Date().toISOString(),
      index: this.index.toJSON(),
      docStore: this.docStore
    });
  }

  async search(query: string, maxResults = 3, docName?: string, minScore = 0.2, offset = 0) {
    if (!this.index) {
      throw new Error('Index not initialized');
    }

    let results = this.index.search(query);
    
    // 按文档分类筛选
    if (docName) {
      results = results.filter(result => {
        const doc = this.docStore[result.ref];
        return doc.title.startsWith(`${docName}/`);
      });
    }

    // 按分数筛选
    results = results.filter(result => result.score >= minScore);

    return results.slice(offset, offset + maxResults).map(result => {
      const doc = this.docStore[result.ref];
      return {
        path: doc.path,
        score: result.score,
        title: doc.title,
        excerpt: this.createExcerpt(doc.content, query)
      };
    });
  }

  private createExcerpt(content: string, query: string): string {
    const pos = content.toLowerCase().indexOf(query.toLowerCase());
    const start = Math.max(0, pos - 400);
    const end = Math.min(content.length, pos + query.length + 400);
    let excerpt = content.slice(start, end);
    
    if (pos >= 0) {
      excerpt = excerpt.replace(
        new RegExp(query, 'gi'),
        match => `**${match}**`
      );
    }
    
    return excerpt;
  }
}

export { SearchEngine };