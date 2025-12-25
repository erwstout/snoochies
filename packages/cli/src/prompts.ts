import { cancel, intro, isCancel, outro, select, text } from '@clack/prompts';

import { DEFAULT_LICENSE, DEFAULT_PROJECT_NAME } from './constants.js';
import { PackageManager, formatPackageManagerLabel } from './package-manager.js';
import { normalizePackageName } from './project.js';

export interface PromptDefaults {
  projectName: string;
  description?: string;
  author?: string;
  license?: string;
}

export interface PromptAnswers {
  projectName: string;
  packageName: string;
  description: string;
  author: string;
  license: string;
  packageManager: PackageManager;
}

interface TextPromptConfig {
  message: string;
  initial?: string;
  placeholder?: string;
  fallback: string;
}

const ensureValue = (value: string | undefined, fallback: string): string => {
  if (!value) {
    return fallback;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
};

const promptForText = async ({
  message,
  initial,
  placeholder,
  fallback,
}: TextPromptConfig): Promise<string> => {
  const response = await text({
    message,
    initial,
    placeholder,
    validate: (input) =>
      input?.trim() ? undefined : 'Please enter a value or keep the suggested default.',
  });

  if (isCancel(response)) {
    cancel('Setup cancelled.');
    process.exit(0);
  }

  return ensureValue(String(response), fallback);
};

const promptForPackageManager = async (): Promise<PackageManager> => {
  const response = await select<PackageManager>({
    message: 'Choose your package manager',
    options: [
      { value: 'npm', label: formatPackageManagerLabel('npm'), hint: 'Default' },
      { value: 'pnpm', label: formatPackageManagerLabel('pnpm'), hint: 'Faster installs' },
    ],
    initialValue: 'npm',
  });

  if (isCancel(response)) {
    cancel('Setup cancelled.');
    process.exit(0);
  }

  return response ?? 'npm';
};

export const collectPromptAnswers = async (defaults: PromptDefaults): Promise<PromptAnswers> => {
  intro('Welcome to the Snoochies starter!');

  const projectName = await promptForText({
    message: 'Project name',
    initial: defaults.projectName,
    fallback: DEFAULT_PROJECT_NAME,
  });

  const description = await promptForText({
    message: 'Project description',
    initial: defaults.description ?? 'A Snoochies starter project.',
    placeholder: 'What are you building?',
    fallback: 'A Snoochies starter project.',
  });

  const author = await promptForText({
    message: 'Author',
    initial: defaults.author ?? '',
    placeholder: 'Your name and email',
    fallback: 'Anonymous',
  });

  const license = await promptForText({
    message: 'License',
    initial: defaults.license ?? DEFAULT_LICENSE,
    fallback: DEFAULT_LICENSE,
  });

  const packageManager = await promptForPackageManager();

  outro('Thanks! Applying your answers to the template...');

  return {
    projectName,
    packageName: normalizePackageName(projectName),
    description,
    author,
    license,
    packageManager,
  };
};
