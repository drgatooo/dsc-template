declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly NODE_ENV: 'development' | 'production';
      readonly DISCORD_TOKEN: string;
      readonly DEVELOPMENT_DISCORD_TOKEN: string;
      readonly MONGO_URI: string;
      readonly DEVELOPMENT_MONGO_URI: string;
      readonly SPOTIFY_CLIENT_ID: string;
      readonly SPOTIFY_CLIENT_SECRET: string;
      readonly LYRICS_COOKIE: string;
      readonly TIXTE_API_KEY: string;
      readonly DEVELOPERS_ID: string;
      readonly TEST_GUILD_ID: string;
      readonly PANEL_IMAGE_URL: string;
      readonly ERROR_WEBHOOK_URL: string;
      readonly DEV_ALERT_WEBHOOK_URL: string;
    }
  }
}

export {};
