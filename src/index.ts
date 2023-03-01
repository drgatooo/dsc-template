import { BotClient } from '@bot/base';

function main() {
  const bot = new BotClient();
  bot.handleErrors();
  void bot.start();
}

main();
