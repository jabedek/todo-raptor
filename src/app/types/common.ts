export type IdEmailPair = {
  id: string;
  email: string;
};

/**
 * Takes a type T and flattens its type hierarchy by combining all of its properties into a single, non-nested type.
 *
 * No need to lookup a chain of interfaces and guess what remains.
 *
 * @see https://www.youtube.com/watch?v=2lCCKiWGlC0
 */
export type Flatten<T> = {
  [K in keyof T]: T[K];
} & {};
