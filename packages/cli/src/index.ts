#!/usr/bin/env node
import path from 'node:path';

import { parseArguments } from './args.js';
import { installDependencies } from './install.js';
import { logError, logProgress, logStep, logSuccess, logWarning } from './logger.js';
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

  const totalSteps = 6 + (options.install ? 1 : 0);
  let completedSteps = 0;

  const tick = (message: string): void => {
    completedSteps += 1;
    logProgress((completedSteps / totalSteps) * 100, message);
  };

  logStep(`Scaffolding Snoochies starter into ${targetPath}...`);
  logProgress(0, 'Starting scaffold');

  if (targetPath.startsWith(templateRoot)) {
    throw new Error(
      `Cannot scaffold into a subdirectory of the template source (${templateRoot}). Choose a target outside the template.`,
    );
  }

  await ensureTargetDirectory(targetPath);
  tick('Target directory ready');
  await copyTemplate(templateRoot, targetPath);
  tick('Template copied');
  await pruneRepoArtifacts(targetPath);
  tick('Preparing files');
  await updatePackageManifest(targetPath, templateValues);
  tick('package.json updated');
  await updatePackageLock(targetPath, templateValues);
  tick('package-lock.json updated');
  await updateReadmeHeading(targetPath, templateValues.projectName);
  tick('README heading updated');

  const readmePath = path.join(targetPath, 'README.md');
  logStep(`Template copied. README available at ${readmePath}.`);

  if (options.install) {
    await installDependencies(targetPath, templateValues.packageManager);
    tick('Dependencies installed');
  } else {
    const installCommand = getInstallCommand(templateValues.packageManager);
    logWarning(`Skipping dependency installation. Run \`${installCommand}\` before development.`);
  }

  logProgress(100, 'Scaffold complete');
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
