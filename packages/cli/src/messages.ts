import path from 'node:path';

import { getInstallHint, getRunCommand, PackageManager } from './package-manager.js';

export const printNextSteps = (
  projectPath: string,
  options: { install: boolean; packageManager: PackageManager },
): void => {
  const relativePath = path.relative(process.cwd(), projectPath) || '.';
  const changeDirCommand = relativePath.includes(' ')
    ? `cd "${relativePath}"`
    : `cd ${relativePath}`;

  const runCommand = getRunCommand(options.packageManager);
  const installHint = getInstallHint(options.packageManager);

  console.log('\nNext steps:');
  console.log(`  1. ${changeDirCommand}`);
  if (!options.install) {
    console.log(`  2. ${installHint}`);
    console.log(`  3. cp .env.example .env && ${runCommand} dev`);
  } else {
    console.log('  2. cp .env.example .env');
    console.log(`  3. ${runCommand} dev`);
  }
  console.log(`  4. ${runCommand} test`);
  console.log(`  5. ${runCommand} lint`);
};
