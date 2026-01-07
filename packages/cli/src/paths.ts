import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { TemplateProfile } from './template-profiles.js';

const currentDir = path.dirname(fileURLToPath(new URL('.', import.meta.url)));

const findRepoRoot = (): string => {
  const packageNames = ['get-snoochies', 'snoochies'];
  let dir = currentDir;
  while (true) {
    const candidate = path.join(dir, 'package.json');
    try {
      const pkg = JSON.parse(fs.readFileSync(candidate, 'utf8')) as { name?: string };
      if (pkg.name && packageNames.includes(pkg.name)) {
        return dir;
      }
    } catch {
      // keep walking
    }
    const parent = path.dirname(dir);
    if (parent === dir) {
      throw new Error(
        'Could not locate repository root (package.json with name "get-snoochies" or "snoochies").',
      );
    }
    dir = parent;
  }
};

export const resolveRepoRoot = (): string => findRepoRoot();

export const resolveTemplateRoot = (repoRoot: string, profile: TemplateProfile): string => {
  if (profile === 'docker') {
    return repoRoot;
  }

  return repoRoot;
};

export const resolveTemplateOverlayRoot = (
  repoRoot: string,
  profile: TemplateProfile,
): string | undefined => {
  if (profile !== 'docker') {
    return undefined;
  }

  return path.join(repoRoot, 'templates', 'docker');
};

export const resolveTargetPath = (projectName: string): string =>
  path.resolve(process.cwd(), projectName);

export const normalizeRelativePath = (absolutePath: string, basePath: string): string =>
  path.relative(basePath, absolutePath).split(path.sep).join('/');
