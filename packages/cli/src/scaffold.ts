import fs from 'node:fs/promises';
import path from 'node:path';

import { REPO_ONLY_PATHS } from './constants.js';
import { isEnoentError, isErrnoException } from './error-guards.js';
import { normalizeRelativePath } from './paths.js';

const shouldSkipPath = (relativePath: string, skipPaths: string[]): boolean =>
  skipPaths.some(
    (skipPath) =>
      relativePath === skipPath ||
      relativePath.startsWith(`${skipPath}/`) ||
      relativePath.startsWith(`${skipPath}\\`),
  );

export const ensureTargetDirectory = async (targetPath: string): Promise<void> => {
  try {
    const stat = await fs.stat(targetPath);
    if (!stat.isDirectory()) {
      throw new Error(`${targetPath} exists and is not a directory.`);
    }

    const existing = await fs.readdir(targetPath);
    if (existing.length > 0) {
      throw new Error(`Target directory ${targetPath} is not empty.`);
    }
  } catch (unknownError: unknown) {
    if (!isErrnoException(unknownError)) {
      throw unknownError;
    }

    if (isEnoentError(unknownError)) {
      await fs.mkdir(targetPath, { recursive: true });
      return;
    }

    throw unknownError;
  }
};

interface CopyTemplateOptions {
  skipPaths?: string[];
  copyContentsOnly?: boolean;
}

const copyWithFilter = async (
  source: string,
  destination: string,
  templateRoot: string,
  skipPaths: string[],
): Promise<void> =>
  fs.cp(source, destination, {
    recursive: true,
    filter: (currentSource) => {
      const relative = normalizeRelativePath(currentSource, templateRoot);
      if (!relative) {
        return true;
      }

      return !shouldSkipPath(relative, skipPaths);
    },
  });

export const copyTemplate = async (
  templateRoot: string,
  targetPath: string,
  options?: CopyTemplateOptions,
): Promise<void> => {
  const skipPaths = options?.skipPaths ?? REPO_ONLY_PATHS;

  if (options?.copyContentsOnly) {
    const entries = await fs.readdir(templateRoot);
    await Promise.all(
      entries.map(async (entry) => {
        const source = path.join(templateRoot, entry);
        const destination = path.join(targetPath, entry);
        await copyWithFilter(source, destination, templateRoot, skipPaths);
      }),
    );
    return;
  }

  await copyWithFilter(templateRoot, targetPath, templateRoot, skipPaths);
};

export const pruneRepoArtifacts = async (targetPath: string): Promise<void> => {
  await Promise.all(
    REPO_ONLY_PATHS.map(async (entry) => {
      const candidate = path.join(targetPath, entry);
      try {
        await fs.rm(candidate, { recursive: true, force: true });
      } catch (unknownError: unknown) {
        if (!isErrnoException(unknownError)) {
          throw unknownError;
        }

        if (isEnoentError(unknownError)) {
          return;
        }

        throw unknownError;
      }
    }),
  );
};
