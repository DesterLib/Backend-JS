type KeyOf<T> = keyof T;

const excludeKeys = <T extends object>(
  obj: T,
  keysToExclude: KeyOf<T>[]
): Omit<T, KeyOf<T>> => {
  const result = { ...obj };

  for (const key of keysToExclude) {
    delete result[key];
  }

  return result;
};

export default excludeKeys;
