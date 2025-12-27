import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDir = path.dirname(fileURLToPath(new URL('.', import.meta.url)));

const findRepoRoot = (): string => {
  let dir = currentDir;
  while (true) {
    const candidate = path.join(dir, 'package.json');
    try {
      const pkg = JSON.parse(fs.readFileSync(candidate, 'utf8')) as { name?: string };
      if (pkg.name === 'snoochies') {
        return dir;
      }
    } catch {
      // keep walking
    }
    const parent = path.dirname(dir);
    if (parent === dir) {
      throw new Error('Could not locate repository root (package.json with name "snoochies").');
    }
    dir = parent;
  }
};

export const resolveRepoRoot = (): string => findRepoRoot();

export const resolveTemplateRoot = (repoRoot: string): string => repoRoot;

export const resolveTargetPath = (projectName: string): string =>
  path.resolve(process.cwd(), projectName);

export const normalizeRelativePath = (absolutePath: string, basePath: string): string =>
  path.relative(basePath, absolutePath).split(path.sep).join('/');
