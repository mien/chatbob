'use strict';
const rl = require('readline');
const IConnector = require('./connector');
const TelegramBot = require('node-telegram-bot-api');
const Message = require('../message');

class TelegramConnector extends IConnector {
  constructor(token) {
    super()
    this.source = 'telegram'
    this.bot = new TelegramBot(token, {
      polling: true
    });

    this.handler = null; // method called when new message comes;
    this.listen();
  }
  postMessage(channel_id, text) {
    this.bot.sendMessage(channel_id, text);
  }
  processMessage(msg) {
    let msg_params = {
      source: this.source,
      msg_id: msg.message_id,
      text: msg.text,
      channel_id: msg.chat.id,
      sender_user_id: msg.from.id,
      timestamp: msg.date,
      is_direct_msg: msg.chat.type == 'private' ? true : false,
      is_group_msg: msg.chat.type == 'group' ? true : false,
    }
    const msg_obj = new Message(msg_params);
    this.handler(msg_obj);
  }
  getSessionKey(msg) {
    return msg.sender_user_id + msg.channel_id
  }
  listen() {
    this.bot.on('message', (msg) => {
      this.processMessage(msg)
    });
  }
}

module.exports = TelegramConnector
