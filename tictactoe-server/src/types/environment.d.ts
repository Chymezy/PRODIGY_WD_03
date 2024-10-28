declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      PORT: string;
      CORS_ORIGIN: string;
      JWT_SECRET: string;
    }
  }
}

export {};
