import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.resolve(__dirname, '..', 'content', 'post');

function walkMarkdown(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walkMarkdown(fullPath);
    if (entry.isFile() && entry.name.endsWith('.md') && entry.name !== '_index.md') {
      return [fullPath];
    }
    return [];
  });
}

function parseValue(value) {
  const trimmed = value.trim();
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    return trimmed.slice(1, -1).split(',').map(item =>
      item.trim().replace(/^['"]|['"]$/g, '')
    ).filter(Boolean);
  }
  return trimmed.replace(/^['"]|['"]$/g, '');
}

function parseFrontMatter(source, filepath) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) throw new Error(`Missing YAML front matter: ${filepath}`);

  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const separator = line.indexOf(':');
    if (separator === -1 || line.trim().startsWith('#')) continue;
    const key = line.slice(0, separator).trim();
    data[key] = parseValue(line.slice(separator + 1));
  }
  return { data, markdown: match[2] };
}

function slugify(value) {
  return value
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function plainWordCount(markdown) {
  const plain = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#>*_`\[\]()!|~-]/g, ' ');
  return (plain.match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu) || []).length;
}

function normalizeMarkdownImages(markdown) {
  return markdown.replace(/\((?:\.\.\/)+img\//g, '(/img/');
}

async function loadPost(filepath) {
  const source = fs.readFileSync(filepath, 'utf8');
  const { data, markdown } = parseFrontMatter(source, filepath);
  const slug = data.slug || slugify(path.basename(filepath, '.md'));
  const date = String(data.date || '').slice(0, 10);
  if (!data.title || !date) throw new Error(`Post needs title and date: ${filepath}`);

  const normalizedMarkdown = normalizeMarkdownImages(markdown);
  const rendered = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkHtml, { allowDangerousHtml: true })
    .process(normalizedMarkdown);

  const wordCount = plainWordCount(normalizedMarkdown);
  const statedReadTime = Number.parseInt(data.estimated_read_time, 10);

  return {
    id: slug,
    title: data.title,
    slug,
    date,
    category: (data.categories || ['General'])[0],
    categories: data.categories || ['General'],
    tags: data.tags || [],
    series: data.series || '',
    description: data.description || '',
    readTime: Number.isFinite(statedReadTime) ? statedReadTime : Math.max(1, Math.ceil(wordCount / 220)),
    wordCount,
    body: String(rendered),
    sourcePath: path.relative(path.resolve(__dirname, '..'), filepath),
  };
}

export async function loadPosts() {
  const posts = await Promise.all(walkMarkdown(CONTENT_DIR).map(loadPost));
  return posts.sort((a, b) => b.date.localeCompare(a.date));
}
