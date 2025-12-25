import fs from 'node:fs/promises';
import path from 'node:path';

import { DEFAULT_PROJECT_NAME } from './constants.js';
import { isEnoentError, isErrnoException } from './error-guards.js';
import { getPackageManagerFieldValue, PackageManager } from './package-manager.js';

export interface ProjectTemplateValues {
  projectName: string;
  packageName: string;
  description: string;
  author: string;
  license: string;
  packageManager: PackageManager;
}

export const normalizePackageName = (value: string): string => {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '');

  return slug.length > 0 ? slug : DEFAULT_PROJECT_NAME;
};

const loadJsonFile = async <T extends Record<string, unknown>>(filePath: string): Promise<T> => {
  const content = await fs.readFile(filePath, 'utf8');
  return JSON.parse(content) as T;
};

const writeJsonFile = async (filePath: string, data: Record<string, unknown>): Promise<void> => {
  const formatted = `${JSON.stringify(data, null, 2)}\n`;
  await fs.writeFile(filePath, formatted, 'utf8');
};

export const updatePackageManifest = async (
  projectPath: string,
  templateValues: ProjectTemplateValues,
): Promise<void> => {
  const manifestPath = path.join(projectPath, 'package.json');
  const manifest = await loadJsonFile<Record<string, unknown>>(manifestPath);

  manifest.name = templateValues.packageName;
  manifest.version = '0.1.0';
  manifest.description = templateValues.description;
  manifest.author = templateValues.author;
  manifest.license = templateValues.license;
  manifest.packageManager = getPackageManagerFieldValue(templateValues.packageManager);
  delete manifest.bin;

  await writeJsonFile(manifestPath, manifest);
};

export const updateReadmeHeading = async (
  projectPath: string,
  projectName: string,
): Promise<void> => {
  const readmePath = path.join(projectPath, 'README.md');

  try {
    const content = await fs.readFile(readmePath, 'utf8');
    const [, ...rest] = content.split(/\r?\n/);
    const heading = `# ${projectName}`;

    const nextContent = [heading, ...rest].join('\n');
    await fs.writeFile(readmePath, `${nextContent}\n`, 'utf8');
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

export const updatePackageLock = async (
  projectPath: string,
  templateValues: ProjectTemplateValues,
): Promise<void> => {
  const lockPath = path.join(projectPath, 'package-lock.json');

  if (templateValues.packageManager !== 'npm') {
    await fs.rm(lockPath, { force: true });
    return;
  }

  try {
    const lockfile = await loadJsonFile<Record<string, unknown>>(lockPath);

    lockfile.name = templateValues.packageName;
    lockfile.version = '0.1.0';

    await writeJsonFile(lockPath, lockfile);
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
