'use strict';
const IConnector = require('./base-connector');
const Message = require('../message');
const RtmClient = require('@slack/client').RtmClient;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;

const bot_token = process.env.SLACK_BOT_TOKEN || '';
class SocketClusterConnector extends IConnector {
  constructor(scServer) {
    super();
    this.bot = scServer;
    this.platform = 'socket';
  }

  postMessage(channelId, text) {
    console.log(channelId,text)
    this.bot.exchange.publish(channelId, {
      'msg': text
    });
  }

  listen() {}

  processMessage(msg) {
    let msg_params = {
      platform: this.platform,
      text: msg.text,
      channelId: msg.channel_id,
      userId: msg.user_id,
      timestamp: msg.timestamp,
      isDirectMsg: true,
      isGroupMsg: false,
    }
    const msg_obj = new Message(msg_params);
    this.handler(msg_obj);
  }
}
module.exports = SocketClusterConnector;
