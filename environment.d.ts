declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly DISCORD_TOKEN: string;
      readonly MONGO_URI: string;
      readonly SPOTIFY_CLIENT_ID: string;
      readonly SPOTIFY_CLIENT_SECRET: string;
      readonly LYRICS_COOKIE: string;
      readonly TEST_GUILD_ID: string;
    }
  }
}

export {};
