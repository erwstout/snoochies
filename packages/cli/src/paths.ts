import path from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDir = path.dirname(fileURLToPath(new URL('.', import.meta.url)));

export const resolveRepoRoot = (): string => path.resolve(currentDir, '../../..');

export const resolveTemplateRoot = (repoRoot: string): string => repoRoot;

export const resolveTargetPath = (projectName: string): string =>
  path.resolve(process.cwd(), projectName);

export const normalizeRelativePath = (absolutePath: string, basePath: string): string =>
  path.relative(basePath, absolutePath).split(path.sep).join('/');
