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
