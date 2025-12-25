import path from 'node:path';

export const printNextSteps = (projectPath: string, options: { install: boolean }): void => {
  const relativePath = path.relative(process.cwd(), projectPath) || '.';
  const changeDirCommand = relativePath.includes(' ')
    ? `cd "${relativePath}"`
    : `cd ${relativePath}`;

  console.log('\nNext steps:');
  console.log(`  1. ${changeDirCommand}`);
  if (!options.install) {
    console.log('  2. npm install');
    console.log('  3. cp .env.example .env && npm run dev');
  } else {
    console.log('  2. cp .env.example .env');
    console.log('  3. npm run dev');
  }
  console.log('  4. npm test');
  console.log('  5. npm run lint');
};
