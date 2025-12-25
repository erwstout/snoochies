import { spawn } from 'node:child_process';

import { INSTALL_COMMAND } from './constants.js';
import { logStep } from './logger.js';

export const installDependencies = async (targetPath: string): Promise<void> => {
  logStep(`Installing dependencies with \`${INSTALL_COMMAND}\`...`);

  await new Promise<void>((resolve, reject) => {
    const [command, ...args] = INSTALL_COMMAND.split(' ');
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
