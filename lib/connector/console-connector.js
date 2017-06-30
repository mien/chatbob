'use strict';
const rl = require('readline');
const IConnector = require('./connector');
const Message = require('../message');
const utils = require('util')

class ConsoleConnector extends IConnector {
  constructor() {
    super()
    this.source = 'console'
    this.channel_id = '4007'
    this.sender_user_id = 'r00t'
    this.bot = rl.createInterface(process.stdin, process.stdout, null);
    this.handler = null; // method called when new message comes;
    this.listen()
  }
  postMessage(channel_id, text) {
    this.bot.question(utils.format('> [%s] : %s\n> ', channel_id, text), (answer) => {
      this.processMessage(this.prepareMsg(answer))
    });
  }
  prepareMsg(text) {
    let msg = {
      'message_id': 8779,
      'text': text,
      'type': 'private',
      'date': Date.now(),
    }
    return msg;
  }
  processMessage(msg) {
    let msg_params = {
      source: this.source,
      msg_id: msg.message_id,
      text: msg.text,
      channel_id: this.channel_id,
      sender_user_id: this.sender_user_id,
      timestamp: msg.date,
      type: 'text',
      is_direct_msg: msg.type == 'private' ? true : false,
      is_group_msg: msg.type == 'group' ? true : false,
    }
    const msg_obj = new Message(msg_params);
    this.handler(msg_obj);
  }

  listen() {
    this.postMessage(this.channel_id, 'Hi')
  }
}

module.exports = ConsoleConnector
