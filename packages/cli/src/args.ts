import { DEFAULT_PROJECT_NAME } from './constants.js';

export interface CliOptions {
  projectName: string;
  install: boolean;
}

const INSTALL_FLAGS = new Set(['--no-install', '--skip-install']);

const sanitizeName = (input?: string): string => {
  if (!input) {
    return DEFAULT_PROJECT_NAME;
  }

  const trimmed = input.trim();
  return trimmed.length > 0 ? trimmed : DEFAULT_PROJECT_NAME;
};

export const parseArguments = (argv: string[]): CliOptions => {
  const remaining: string[] = [];
  let install = true;

  for (const arg of argv) {
    if (INSTALL_FLAGS.has(arg)) {
      install = false;
      continue;
    }

    remaining.push(arg);
  }

  const [maybeName] = remaining;
  const projectName = sanitizeName(maybeName);

  return { projectName, install };
};
