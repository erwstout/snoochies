import fs from 'node:fs/promises';
import path from 'node:path';

import { DEFAULT_PROJECT_NAME } from './constants.js';
import { isEnoentError, isErrnoException } from './error-guards.js';

export const updatePackageManifest = async (
  projectPath: string,
  projectName: string,
): Promise<void> => {
  const manifestPath = path.join(projectPath, 'package.json');
  const content = await fs.readFile(manifestPath, 'utf8');
  const manifest = JSON.parse(content) as Record<string, unknown>;

  manifest.name = normalizePackageName(projectName);
  manifest.version = '0.1.0';
  delete manifest.bin;

  const formatted = `${JSON.stringify(manifest, null, 2)}\n`;
  await fs.writeFile(manifestPath, formatted, 'utf8');
};

export const updatePackageLock = async (
  projectPath: string,
  projectName: string,
): Promise<void> => {
  const lockPath = path.join(projectPath, 'package-lock.json');
  try {
    const content = await fs.readFile(lockPath, 'utf8');
    const lockfile = JSON.parse(content) as Record<string, unknown>;

    lockfile.name = normalizePackageName(projectName);
    lockfile.version = '0.1.0';

    const formatted = `${JSON.stringify(lockfile, null, 2)}\n`;
    await fs.writeFile(lockPath, formatted, 'utf8');
  } catch (unknownError: unknown) {
    if (!isErrnoException(unknownError)) {
      throw unknownError;
    }

    if (isEnoentError(unknownError)) {
      return;
    }

    throw unknownError;
  }
};

export const normalizePackageName = (value: string): string => {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '');

  return slug.length > 0 ? slug : DEFAULT_PROJECT_NAME;
};
