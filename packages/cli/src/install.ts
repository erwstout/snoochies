import { spawn } from 'node:child_process';

import { logStep } from './logger.js';
import { getInstallCommand, PackageManager } from './package-manager.js';

export const installDependencies = async (
  targetPath: string,
  packageManager: PackageManager,
): Promise<void> => {
  const installCommand = getInstallCommand(packageManager);
  logStep(`Installing dependencies with \`${installCommand}\`...`);

  await new Promise<void>((resolve, reject) => {
    const [command, ...args] = installCommand.split(' ');
    const child = spawn(command, args, {
      cwd: targetPath,
      stdio: 'inherit',
      shell: process.platform === 'win32',
    });

    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`Dependency installation failed with exit code ${code ?? 'unknown'}.`));
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
};
