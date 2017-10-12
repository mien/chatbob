'use strict';
const rl = require('readline');
const IConnector = require('./base-connector');
const TelegramBot = require('node-telegram-bot-api');
const Message = require('../message');

class TelegramConnector extends IConnector {
  constructor(token) {
    super()
    this.platform = 'telegram'
    this.bot = new TelegramBot(token, {
      polling: true
    });

    this.handler = null; // method called when new message comes;
  }
  postMessage(channelId, text) {
    this.bot.sendMessage(channelId, text);
  }
  processMessage(msg) {
    let msg_params = {
      platform: this.platform,
      msgId: msg.message_id,
      text: msg.text,
      channelId: msg.chat.id,
      userId: msg.from.id,
      timestamp: msg.date,
      isDirectMsg: msg.chat.type == 'private' ? true : false,
      isGroupMsg: msg.chat.type == 'group' ? true : false,
    }
    const msg_obj = new Message(msg_params);
    this.handler(msg_obj);
  }

  listen() {
    this.bot.on('message', (msg) => {
      this.processMessage(msg)
    });
    console.log('listening on : ', this.platform);
  }
}

module.exports = TelegramConnector
