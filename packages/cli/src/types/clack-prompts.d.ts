declare module '@clack/prompts' {
  interface BasePromptOptions {
    message: string;
    initial?: string;
    placeholder?: string;
    validate?: (input?: string) => string | undefined;
  }

  export const intro: (message: string) => void;
  export const outro: (message: string) => void;
  export const cancel: (message: string) => void;
  export const isCancel: (value: unknown) => value is symbol;

  export const text: (options: BasePromptOptions) => Promise<string | symbol>;

  export const select: <Value>(options: {
    message: string;
    options: { value: Value; label: string; hint?: string }[];
    initialValue?: Value;
  }) => Promise<Value | symbol>;
}
