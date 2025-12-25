#!/usr/bin/env node
import path from 'node:path';

import { parseArguments } from './args.js';
import { installDependencies } from './install.js';
import { logError, logStep, logSuccess, logWarning } from './logger.js';
import { printNextSteps } from './messages.js';
import { getInstallCommand } from './package-manager.js';
import { collectPromptAnswers } from './prompts.js';
import { resolveRepoRoot, resolveTargetPath, resolveTemplateRoot } from './paths.js';
import {
  ProjectTemplateValues,
  updatePackageLock,
  updatePackageManifest,
  updateReadmeHeading,
} from './project.js';
import { copyTemplate, ensureTargetDirectory, pruneRepoArtifacts } from './scaffold.js';

const main = async (): Promise<void> => {
  const options = parseArguments(process.argv.slice(2));
  const promptAnswers = await collectPromptAnswers({ projectName: options.projectName });
  const repoRoot = resolveRepoRoot();
  const templateRoot = resolveTemplateRoot(repoRoot);
  const templateValues: ProjectTemplateValues = {
    ...promptAnswers,
  };
  const targetPath = resolveTargetPath(promptAnswers.projectName);

  logStep(`Scaffolding Snoochies starter into ${targetPath}...`);
  await ensureTargetDirectory(targetPath);
  await copyTemplate(templateRoot, targetPath);
  await pruneRepoArtifacts(targetPath);
  await updatePackageManifest(targetPath, templateValues);
  await updatePackageLock(targetPath, templateValues);
  await updateReadmeHeading(targetPath, templateValues.projectName);

  const readmePath = path.join(targetPath, 'README.md');
  logStep(`Template copied. README available at ${readmePath}.`);

  if (options.install) {
    await installDependencies(targetPath, templateValues.packageManager);
  } else {
    const installCommand = getInstallCommand(templateValues.packageManager);
    logWarning(`Skipping dependency installation. Run \`${installCommand}\` before development.`);
  }

  logSuccess('Snoochies starter created successfully.');
  printNextSteps(targetPath, {
    install: options.install,
    packageManager: templateValues.packageManager,
  });
};

main().catch((error) => {
  logError('Unable to create Snoochies starter.', error);
  process.exit(1);
});
