'use strict';
const Chatty = require('../');
const BotBuilder = Chatty.BotBuilder;
const Dialog = Chatty.Dialog;
const TelegramConnector = Chatty.TelegramConnector;
const SlackConnector = Chatty.SlackConnector;

const greetingDialog = new Dialog({
  'name': 'greeting'
});

greetingDialog.setTrigger('hello')

greetingDialog.addQuestion('what is your name?', (ctx, response, next) => {
  ctx.userObj.name = response.text;
  next();
});

greetingDialog.addQuestion('what is your email?', (ctx, response, next) => {
  // ctx.userObj.id = response.text;
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
const TELEGRAM_TOKEN = ''
const SLACK_TOKEN = ''

const tl_connector = new TelegramConnector(TELEGRAM_TOKEN);
const sl_connector = new SlackConnector(SLACK_TOKEN);

const params = {
  'connector': [tl_connector, sl_connector],
  'defaultDialog': greetingDialog
}
const bot = new BotBuilder(params)

bot.addDialog(greetingDialog)
bot.addDialog(pizzaDialog)
bot.addDialog(byeDialog)

bot.listen();
