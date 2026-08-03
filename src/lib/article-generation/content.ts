import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export interface ExistingPostFile {
  name: string;
  isFile(): boolean;
}

export interface ExistingPostFileSystem {
  readdirSync(directory: string): ExistingPostFile[];
  readFileSync(path: string, encoding: 'utf8'): string;
}

const nodeFileSystem: ExistingPostFileSystem = {
  readdirSync: (directory) => readdirSync(directory, { withFileTypes: true }),
  readFileSync,
};

function explicitSlug(content: string): string | undefined {
  const frontmatter = content.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/u)?.[1];
  if (!frontmatter) return undefined;
  const match = frontmatter.match(/^slug:\s*(?:"([^"]+)"|'([^']+)'|([^\s#]+))\s*$/mu);
  return match?.[1] ?? match?.[2] ?? match?.[3];
}

export function collectExistingPostSlugs(
  postsDirectory: string,
  fs: ExistingPostFileSystem = nodeFileSystem,
): string[] {
  const slugs = new Set<string>();
  for (const entry of fs.readdirSync(postsDirectory)) {
    if (!entry.isFile() || !entry.name.toLowerCase().endsWith('.mdx')) continue;
    const filenameSlug = entry.name.slice(0, -'.mdx'.length);
    slugs.add(filenameSlug);
    const frontmatterSlug = explicitSlug(
      fs.readFileSync(join(postsDirectory, entry.name), 'utf8'),
    );
    if (frontmatterSlug) slugs.add(frontmatterSlug);
  }
  return [...slugs];
}
