declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly NODE_ENV: 'development' | 'production';
      readonly DISCORD_TOKEN: string;
      readonly MONGO_URI: string;
      readonly TEST_GUILD_ID: string;
    }
  }
}

export {};
