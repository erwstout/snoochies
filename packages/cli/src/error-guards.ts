type ErrnoException = Error & { code?: string | number };
export const isErrnoException = (value: unknown): value is ErrnoException => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  return 'code' in (value as Record<string, unknown>);
};

export const isEnoentError = (value: unknown): value is ErrnoException => {
  if (!isErrnoException(value)) {
    return false;
  }

  const error: ErrnoException = value;
  return error.code === 'ENOENT';
};
