export const getShortId = (id: string): string =>
  `${id.substring(0, 1)}_${id.substring(15, 16)}${id.substring(18, 20)}_${id.substring(id.length - 3)}`;
