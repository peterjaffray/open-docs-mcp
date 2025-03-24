declare module 'lunr-languages' {
  export const zh: {
    tokenizer: (token: string) => string[],
    stemmer: (token: string) => string
  };
}