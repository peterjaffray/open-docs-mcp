declare module 'jieba-wasm' {
  export function load(): Promise<void>;
  export function cut(text: string, hmm?: boolean): string[];
  export function cutAll(text: string): string[];
  export function cutForSearch(text: string, hmm?: boolean): string[];
  export function tag(text: string, hmm?: boolean): Array<[string, string]>;
  export function extract(text: string, topk: number): Array<[string, number]>;
}