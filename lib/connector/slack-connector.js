'use strict';
const IConnector = require('./connector');
const Message = require('../message');
const RtmClient = require('@slack/client').RtmClient;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;

const bot_token = process.env.SLACK_BOT_TOKEN || '';
class SlackConnector extends IConnector {
  constructor(token) {
    super()
    this.source = 'slack';
    this.bot = new RtmClient(token);
    this.listen();
  }
  postMessage(channel_id, text) {
    this.bot.sendMessage(text, channel_id);

  }

  listen() {
    this.bot.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, () => {
      console.log('connected')
    });
    this.bot.on(RTM_EVENTS.MESSAGE, (msg) => {
      this.processMessage(msg)
    });

    this.bot.start();

  }

  processMessage(msg) {
    let msg_params = {
      source: this.source,
      text: msg.text,
      channel_id: msg.channel,
      sender_user_id: msg.user,
      timestamp: msg.ts,
      is_direct_msg: true,
      is_group_msg: false,
    }
    const msg_obj = new Message(msg_params);
    console.log('processMessage', msg_obj)
    this.handler(msg_obj);
  }
}
module.exports = SlackConnector;
