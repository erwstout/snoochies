import { DEFAULT_PACKAGE_MANAGER } from './constants.js';

export type PackageManager = 'npm' | 'pnpm';

const PACKAGE_MANAGER_LABELS: Record<PackageManager, string> = {
  npm: 'npm',
  pnpm: 'pnpm',
};

const INSTALL_COMMANDS: Record<PackageManager, string> = {
  npm: 'npm install',
  pnpm: 'pnpm install',
};

const RUN_COMMANDS: Record<PackageManager, string> = {
  npm: 'npm run',
  pnpm: 'pnpm',
};

const INSTALL_HINTS: Record<PackageManager, string> = {
  npm: 'npm install',
  pnpm: 'pnpm install',
};

const PACKAGE_MANAGER_VERSION_EXTRACTOR: Partial<Record<PackageManager, () => string | undefined>> =
  {
    npm: () => process.env.npm_config_user_agent?.match(/npm\/([\d.]+)/)?.[1],
  };

export const resolvePackageManager = (value?: string): PackageManager => {
  if (value === 'pnpm') {
    return 'pnpm';
  }

  return DEFAULT_PACKAGE_MANAGER;
};

export const formatPackageManagerLabel = (manager: PackageManager): string =>
  PACKAGE_MANAGER_LABELS[manager];

export const getInstallCommand = (manager: PackageManager): string => INSTALL_COMMANDS[manager];

export const getRunCommand = (manager: PackageManager): string => RUN_COMMANDS[manager];

export const getInstallHint = (manager: PackageManager): string => INSTALL_HINTS[manager];

export const getPackageManagerFieldValue = (manager: PackageManager): string => {
  const versionResolver = PACKAGE_MANAGER_VERSION_EXTRACTOR[manager];
  const version = versionResolver?.();

  if (version) {
    return `${manager}@${version}`;
  }

  return manager;
};
