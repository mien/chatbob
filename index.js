'use strict';
const BotBuilder = require('./lib').BotBuilder;
const Dialog = require('./lib').Dialog;
const TelegramConnector = require('./lib/connector/telegram-connector');
const SlackConnector = require('./lib/connector/slack-connector');
const ConsoleConnector = require('./lib/connector/console-connector');

const greetingDialog = new Dialog({
  'name': 'greeting'
});

greetingDialog.setTrigger('hello')

greetingDialog.addQuestion('what is your name?', (ctx, response, next) => {
  ctx.name = response.text;
  next();
});

greetingDialog.addQuestion('what is your age?', (ctx, response, next) => {
  ctx.age = response.text;
  ctx.beginDialog('pizza')
  next();
});
greetingDialog.addQuestion('where do you stay?', (ctx, response, next) => {
  ctx.age = response.text;
  next();
});

const pizzaDialog = new Dialog({
  'name': 'pizza'
})

pizzaDialog.addQuestion('What size pizza do you want ?', (ctx, response, next) => {
  // ctx.endDialog()
  next();
})

pizzaDialog.addQuestion('do you want cheez bust ?', (ctx, response, next) => {
  ctx.beginDialog('bye')
  next();
})

const byeDialog = new Dialog({
  'name': 'bye'
})
byeDialog.addQuestion('have a good day ?', (ctx, response, next) => {
  next();
})

// const cs_connector = new ConsoleConnector();
// const tl_connector = new TelegramConnector('47947300:AAH4Ab7KZy7-gq2E2R16Ks7oDiPu476Islw');
const sl_connector = new SlackConnector('xoxb-186332155015-AiCG7pcF7z9Z1enHokxfCtpq');
const params = {
  'connector': sl_connector,
  'defaultDialog': greetingDialog
}
const bot = new BotBuilder(params)
bot.addDialog(greetingDialog)
bot.addDialog(pizzaDialog)
bot.addDialog(byeDialog)
