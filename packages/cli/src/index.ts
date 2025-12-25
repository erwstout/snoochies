#!/usr/bin/env node
import path from 'node:path';

import { parseArguments } from './args.js';
import { installDependencies } from './install.js';
import { logError, logStep, logSuccess, logWarning } from './logger.js';
import { printNextSteps } from './messages.js';
import { resolveRepoRoot, resolveTargetPath, resolveTemplateRoot } from './paths.js';
import { updatePackageLock, updatePackageManifest } from './project.js';
import { copyTemplate, ensureTargetDirectory, pruneRepoArtifacts } from './scaffold.js';

const main = async (): Promise<void> => {
  const options = parseArguments(process.argv.slice(2));
  const repoRoot = resolveRepoRoot();
  const templateRoot = resolveTemplateRoot(repoRoot);
  const targetPath = resolveTargetPath(options.projectName);

  logStep(`Scaffolding Snoochies starter into ${targetPath}...`);
  await ensureTargetDirectory(targetPath);
  await copyTemplate(templateRoot, targetPath);
  await pruneRepoArtifacts(targetPath);
  await updatePackageManifest(targetPath, options.projectName);
  await updatePackageLock(targetPath, options.projectName);

  const readmePath = path.join(targetPath, 'README.md');
  logStep(`Template copied. README available at ${readmePath}.`);

  if (options.install) {
    await installDependencies(targetPath);
  } else {
    logWarning('Skipping dependency installation. Run `npm install` before development.');
  }

  logSuccess('Snoochies starter created successfully.');
  printNextSteps(targetPath, { install: options.install });
};

main().catch((error) => {
  logError('Unable to create Snoochies starter.', error);
  process.exit(1);
});
