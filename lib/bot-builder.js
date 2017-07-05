'use strict';
const mm = require('micromatch');
const Conversation = require('./conversation');
const ConnectorMediator = require('./connector-mediator');
const UserManager = require('./user-manager');
const User = require('./user');

class BotBuilder {
  constructor(params) {
    this.connector = new ConnectorMediator(params.connector);
    this.userManager = new UserManager();
    this.defaultDialog = params.defaultDialog;
    this.connector.registerListener(this.onMessage.bind(this));
    this.sessionData = {};
    this.dialogLibrary = [];
  }

  onMessage(msg) {
    let userObj = this.findUser(msg);
    msg.setUser(userObj);
    let sessionKey = this.getSessionKey(msg);
    let convo = this.sessionData[sessionKey];
    if (!convo) {
      let convo_params = {
        'connector': this.connector,
        'dialogs': this.dialogLibrary,
        'defaultDialog': this.defaultDialog,
        'userObj': userObj
      };
      convo = new Conversation(convo_params)
      this.sessionData[sessionKey] = convo;
    }
    convo.onMessage(msg);
  }

  findUser(msg) {
    let userObj = this.userManager.searchgUserByChannelId(msg.platform, msg.channelId);
    if (!userObj) {
      console.log('No user found for platform : %s channel : %s', msg.platform, msg.channelId)
      let user_channel_params = {
        'platform': msg.platform,
        'userId': msg.userId,
        'channelId': msg.channelId
      }
      userObj = new User();
      userObj.addChannel(user_channel_params);
      this.userManager.addUser(userObj);
    }
    return userObj;
  }

  getSessionKey(msg) {
    if (msg.getUser()) {
      return msg.getUser().id + msg.platform;
    } else {
      throw new Error('user object not found');
    }
  }

  listen() {
    this.connector.startListening()
  }

  addDialog(dialog) {
    this.dialogLibrary.push(dialog)
  }
}

module.exports = BotBuilder;
