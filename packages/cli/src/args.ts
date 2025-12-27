import { DEFAULT_PROJECT_NAME } from './constants.js';
import { normalizePackageName } from './project.js';
import { TemplateProfile } from './template-profiles.js';

export interface CliOptions {
  projectName: string;
  install: boolean;
  templateProfile?: TemplateProfile;
}

const INSTALL_FLAGS = new Set(['--no-install', '--skip-install']);
const DOCKER_FLAGS = new Set(['--with-docker', '--docker']);

const sanitizeName = (input?: string): string =>
  normalizePackageName(input ?? DEFAULT_PROJECT_NAME) || DEFAULT_PROJECT_NAME;

export const parseArguments = (argv: string[]): CliOptions => {
  const remaining: string[] = [];
  let install = true;
  let templateProfile: TemplateProfile | undefined;

  for (const arg of argv) {
    if (INSTALL_FLAGS.has(arg)) {
      install = false;
      continue;
    }

    if (DOCKER_FLAGS.has(arg)) {
      templateProfile = 'docker';
      continue;
    }

    remaining.push(arg);
  }

  const [maybeName] = remaining;
  const projectName = sanitizeName(maybeName);

  return { projectName, install, templateProfile };
};
