import * as DBs from '@bot/models';
import { AttachmentBuilder, Client, Collection, type Message, WebhookClient } from 'discord.js';
import { CommandStore, EventStore } from '@bot/stores';
import { colors, emojis, options } from '@bot/constants';
import type { ModelWithCache } from 'cache-mongodb';
import { connect } from 'mongoose';
import { getEmojis } from '@bot/util';

export class BotClient extends Client<true> {
  public constructor() {
    super(options);
  }

  public commands = new CommandStore(this);
  public events = new EventStore(this);
  public panels = new Collection<string, Message<true>>();
  public commandIds = new Collection<string, string>();

  public alertWebhook = new WebhookClient({ url: process.env.DEV_ALERT_WEBHOOK_URL });
  private errorWebhook = new WebhookClient({ url: process.env.ERROR_WEBHOOK_URL });

  private isHandlingErrors = false;

  public async start() {
    console.log('🚀 Starting botClient...');

    await connect(
      process.env.NODE_ENV == 'development'
        ? process.env.DEVELOPMENT_MONGO_URI
        : process.env.MONGO_URI
    )
      .then(() => {
        console.log('☁ MongoDB connection established');
      })
      .catch(err => {
        console.error('☁ MongoDB connection failed', err);
      });

    this.fetchAllDocs();
    void this.events.load();
    await this.commands.load();
    void this.login(
      process.env.NODE_ENV == 'development'
        ? process.env.DEVELOPMENT_DISCORD_TOKEN
        : process.env.DISCORD_TOKEN
    );
  }

  public message(content: string, messageType: 'error' | 'success' | 'info' | 'warn') {
    return `${emojis[messageType]} ${content}`;
  }

  public colors(messageType: 'error' | 'success' | 'info' | 'warn') {
    return colors[messageType];
  }

  public getCommandMD(key: string) {
    return this.commandIds.get(key) ?? `</${key}:1>`;
  }

  private fetchAllDocs() {
    for (const db of Object.values<ModelWithCache<{ _id: string }>>(DBs)) {
      void db.getAll(true).then(docs => {
        console.log(`📁 ${db.model.modelName || 'Unknown'} model: ${docs.length} docs fetched`);
      });
    }
  }

  public handleErrors() {
    if (this.isHandlingErrors) return;

    process.on('unhandledRejection', error => {
      console.error(error);
      const msg = error instanceof Error ? error.stack ?? error.toString() : `${error as string}`;

      void this.errorWebhook.send({
        content: this.message('Nuevo error `unhandledRejection`:', 'error'),
        files: [new AttachmentBuilder(Buffer.from(msg), { name: 'error.txt' })]
      });
    });

    process.on('uncaughtException', error => {
      console.error(error);
      const msg = error instanceof Error ? error.stack ?? error.toString() : `${error as string}`;

      void this.errorWebhook.send({
        content: this.message('Nuevo error `uncaughtException`:', 'error'),
        files: [new AttachmentBuilder(Buffer.from(msg), { name: 'error.txt' })]
      });
    });

    this.isHandlingErrors = true;
    return;
  }

  public getEmojiResolvable(emoji: string) {
    // check if emoji is a custom emoji
    const customEmoji = /<a?:\w+:(\d+)>/.exec(emoji);
    if (customEmoji?.[1]) {
      const discordEmoji = this.emojis.cache.get(customEmoji[1]);
      if (discordEmoji) return { id: discordEmoji.id };
    }

    // check if emoji is an id
    const idEmoji = /(\d+)/.exec(emoji);
    if (idEmoji?.[1]) {
      const discordEmoji = this.emojis.cache.get(idEmoji[1]);
      if (discordEmoji) return { id: discordEmoji.id };
    }

    // check if emoji is a unicode emoji
    const unicode = getEmojis(emoji);
    if (!unicode) return undefined;

    return { name: unicode[0] };
  }
}
