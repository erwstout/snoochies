import path from 'node:path';

import { getInstallHint, getRunCommand, PackageManager } from './package-manager.js';
import { TemplateProfile } from './template-profiles.js';

export const printNextSteps = (
  projectPath: string,
  options: { install: boolean; packageManager: PackageManager; templateProfile: TemplateProfile },
): void => {
  const relativePath = path.relative(process.cwd(), projectPath) || '.';
  const changeDirCommand = relativePath.includes(' ')
    ? `cd "${relativePath}"`
    : `cd ${relativePath}`;

  const runCommand = getRunCommand(options.packageManager);
  const installHint = getInstallHint(options.packageManager);

  console.log('\nNext steps:');
  console.log(`  1. ${changeDirCommand}`);
  if (options.templateProfile === 'docker') {
    console.log('  2. cp .env.docker.example .env.docker');
    if (!options.install) {
      console.log(`  3. ${installHint} # optional for local tooling`);
      console.log('  4. docker compose up --build');
      console.log('  5. docker compose exec api npm run db:generate # keep Prisma client in sync');
    } else {
      console.log('  3. docker compose up --build');
      console.log('  4. docker compose exec api npm run db:generate # keep Prisma client in sync');
    }
    console.log('  6. docker compose exec api npm test # or npm run typecheck');
    console.log('  7. docker compose down --remove-orphans # when you are done');
    return;
  }

  if (!options.install) {
    console.log(`  2. ${installHint}`);
    console.log(`  3. ${runCommand} db:generate`);
    console.log(`  4. cp .env.example .env && ${runCommand} dev`);
    console.log(`  5. ${runCommand} test`);
    console.log(`  6. ${runCommand} lint`);
    return;
  }

  console.log('  2. cp .env.example .env');
  console.log(`  3. ${runCommand} dev`);
  console.log(`  4. ${runCommand} test`);
  console.log(`  5. ${runCommand} lint`);
  console.log(`  6. ${runCommand} db:generate # rerun after Prisma schema changes`);
};
