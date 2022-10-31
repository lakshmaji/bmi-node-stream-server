const DEFAULT_STORAGE_PREFIX = 'storage';

export const JSONFileInputPath = (filename: string): string => {
  return `${DEFAULT_STORAGE_PREFIX}/uploads/${filename}.json`;
};

export const JSONFileOutputPath = (filename: string): string => {
  return `${DEFAULT_STORAGE_PREFIX}/processed/${filename}.json`;
};
