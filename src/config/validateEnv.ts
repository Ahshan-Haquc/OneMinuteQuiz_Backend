import dotenv from 'dotenv';

dotenv.config();

const requiredEnv = ['JWT_SECRET', 'MONGODB_CONNECTION_STRING_URI'] as const;

export interface EnvConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  JWT_SECRET: string;
  JWT_EXPIRATION: string;
  MONGODB_CONNECTION_STRING_URI: string;
}

const missingEnvError = (key: string): never => {
  throw new Error(`Missing required environment variable: ${key}`);
};

export const validateEnv = (): EnvConfig => {
  const nodeEnv = process.env.NODE_ENV ?? 'development';
  const port = Number(process.env.PORT ?? 3001);
  const jwtSecret = process.env.JWT_SECRET ?? missingEnvError('JWT_SECRET');
  const jwtExpiration = process.env.JWT_EXPIRATION ?? '1h';
  const mongoUri = process.env.MONGODB_CONNECTION_STRING_URI ?? missingEnvError('MONGODB_CONNECTION_STRING_URI');

  if (Number.isNaN(port) || port <= 0) {
    throw new Error('PORT must be a positive number');
  }

  return {
    NODE_ENV: nodeEnv as EnvConfig['NODE_ENV'],
    PORT: port,
    JWT_SECRET: jwtSecret,
    JWT_EXPIRATION: jwtExpiration,
    MONGODB_CONNECTION_STRING_URI: mongoUri,
  };
};

export const env = validateEnv();
