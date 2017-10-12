'use strict';
const rl = require('readline');
const IConnector = require('./base-connector');
const Message = require('../message');
const utils = require('util')

class ConsoleConnector extends IConnector {
  constructor() {
    super()
    this.platform = 'console'
    this.channelId = '4007'
    this.senderUserId = 'r00t'
    this.bot = rl.createInterface(process.stdin, process.stdout, null);
    this.handler = null; // method called when new message comes;
  }
  postMessage(channelId, text) {
    this.bot.question(utils.format('> [%s] : %s\n> ', channelId, text), (answer) => {
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
      platform: this.platform,
      msgId: msg.message_id,
      text: msg.text,
      channelId: this.channelId,
      userId: this.senderUserId,
      timestamp: msg.date,
      type: 'text',
      is_direct_msg: msg.type == 'private' ? true : false,
      is_group_msg: msg.type == 'group' ? true : false,
    }
    const msg_obj = new Message(msg_params);
    this.handler(msg_obj);
  }

  listen() {
    this.postMessage(this.channelId, 'Hi')
    console.log('listening on : ', this.platform)
  }
}

module.exports = ConsoleConnector
