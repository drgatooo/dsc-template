import type { ClientEvents } from 'discord.js';

export interface BotEvents extends ClientEvents {
  raw: [data: unknown];
  [k: string]: [...unknown[]];
}
