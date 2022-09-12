import minimist from 'minimist';
import path, { dirname } from 'path/posix';

export const getEnvFilePaths = (): string[] => {
  const envFile = minimist(process.argv.slice(2)).env;
  const srcFolder = dirname(require.main.filename);

  return [
    path.join(srcFolder, '..', 'env', `${envFile}.env`),
    path.join(srcFolder, '..', 'env', `default.env`),
  ];
};
