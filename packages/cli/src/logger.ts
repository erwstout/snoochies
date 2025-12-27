export const logStep = (message: string): void => {
  console.log(`• ${message}`);
};

export const logSuccess = (message: string): void => {
  console.log(`\n✅ ${message}`);
};

export const logWarning = (message: string): void => {
  console.warn(`⚠️ ${message}`);
};

export const logError = (message: string, error?: unknown): void => {
  console.error(`✖ ${message}`);
  if (error) {
    console.error(error);
  }
};

export const logProgress = (percent: number, message: string): void => {
  const clamped = Math.min(100, Math.max(0, Math.round(percent)));
  const width = 22;
  const filled = Math.round((clamped / 100) * width);
  const empty = Math.max(0, width - filled);
  const bar = `${'='.repeat(filled)}${'.'.repeat(empty)}`;
  const badge = clamped === 0 ? '🚀' : clamped >= 100 ? '🏁' : '✨';
  console.log(`${badge} ${clamped.toString().padStart(3, ' ')}% [${bar}] ${message}`);
};
