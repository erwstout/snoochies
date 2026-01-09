import { EventEmitter } from 'node:events';

import { beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals';

import type { spawn } from 'node:child_process';

const spawnMock = jest.fn();

jest.unstable_mockModule('node:child_process', () => ({
  spawn: spawnMock,
}));

type SpawnReturn = ReturnType<typeof spawn>;

let installDependencies: typeof import('../install.js').installDependencies;
let generatePrismaClient: typeof import('../prisma.js').generatePrismaClient;

const createChildProcess = ({
  exitCode = 0,
  error,
}: {
  exitCode?: number;
  error?: Error;
} = {}): SpawnReturn => {
  const emitter = new EventEmitter();

  process.nextTick(() => {
    if (error) {
      emitter.emit('error', error);
      return;
    }

    emitter.emit('exit', exitCode);
  });

  return emitter as SpawnReturn;
};

const expectSpawned = (command: string, args: string[], targetPath: string): void => {
  expect(spawnMock).toHaveBeenCalledWith(command, args, {
    cwd: targetPath,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
};

describe('cli install integration', () => {
  const targetPath = '/tmp/snoochies';

  beforeAll(async () => {
    ({ installDependencies } = await import('../install.js'));
    ({ generatePrismaClient } = await import('../prisma.js'));
  });

  beforeEach(() => {
    spawnMock.mockReset();
  });

  it('runs the installer command and resolves on success', async () => {
    spawnMock.mockImplementation(() => createChildProcess());

    await expect(installDependencies(targetPath, 'npm')).resolves.toBeUndefined();

    expectSpawned('npm', ['install'], targetPath);
  });

  it('rejects when installation exits non-zero', async () => {
    spawnMock.mockImplementation(() => createChildProcess({ exitCode: 1 }));

    await expect(installDependencies(targetPath, 'pnpm')).rejects.toThrow(
      'Dependency installation failed',
    );

    expectSpawned('pnpm', ['install'], targetPath);
  });

  it('uses npm --if-present when generating Prisma client', async () => {
    spawnMock.mockImplementation(() => createChildProcess());

    await expect(generatePrismaClient(targetPath, 'npm')).resolves.toBeUndefined();

    expectSpawned('npm', ['run', 'db:generate', '--if-present'], targetPath);
  });

  it('omits npm flags for other package managers', async () => {
    spawnMock.mockImplementation(() => createChildProcess());

    await expect(generatePrismaClient(targetPath, 'pnpm')).resolves.toBeUndefined();

    expectSpawned('pnpm', ['db:generate'], targetPath);
  });

  it('bubbles up spawn errors during Prisma generation', async () => {
    const error = new Error('spawn failed');
    spawnMock.mockImplementation(() => createChildProcess({ error }));

    await expect(generatePrismaClient(targetPath, 'yarn')).rejects.toThrow('spawn failed');

    expectSpawned('yarn', ['db:generate'], targetPath);
  });
});
