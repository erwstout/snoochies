import { spawn } from 'node:child_process';

import { logStep } from './logger.js';
import { getRunCommand, PackageManager } from './package-manager.js';

export const generatePrismaClient = async (
  targetPath: string,
  packageManager: PackageManager,
): Promise<void> => {
  const runCommand = getRunCommand(packageManager);
  const [command, ...baseArgs] = runCommand.split(' ');
  const args = [...baseArgs, 'db:generate'];

  // npm supports --if-present to avoid hard failures if scripts are missing
  if (packageManager === 'npm') {
    args.push('--if-present');
  }

  logStep('Generating Prisma client with prisma generate...');

  await new Promise<void>((resolve, reject) => {
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

      reject(new Error(`Prisma client generation failed with exit code ${code ?? 'unknown'}.`));
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
};
