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
    this.platform = 'slack';
    this.bot = new RtmClient(token);
  }
  postMessage(channelId, text) {
    this.bot.sendMessage(text, channelId);

  }

  listen() {
    this.bot.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, () => {
      console.log('listening on : ', this.platform);
    });
    this.bot.on(RTM_EVENTS.MESSAGE, (msg) => {
      this.processMessage(msg)
    });
    this.bot.start();
  }

  processMessage(msg) {
    console.log('slack msg', msg)
    let msg_params = {
      platform: this.platform,
      text: msg.text,
      channelId: msg.channel,
      userId: msg.user,
      timestamp: msg.ts,
      isDirectMsg: true,
      isGroupMsg: false,
    }
    const msg_obj = new Message(msg_params);
    this.handler(msg_obj);
  }
}
module.exports = SlackConnector;
