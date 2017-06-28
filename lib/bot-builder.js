'use strict';
const mm = require('micromatch');
const Conversation = require('./conversation');
// const Context = require('./context');

class BotBuilder {
  constructor(params) {
    this.connector = params.connector;
    this.defaultDialog = params.defaultDialog;
    this.connector.registerListener(this.onMessage.bind(this));
    this.sessionData = {};
    this.dialogLibrary = [];
  }
  onMessage(msg) {
    let sessionKey = this.connector.getSessionKey(msg);
    let convo = this.sessionData[sessionKey];
    if (!convo) {
      let convo_params = {
        'connector': this.connector,
        'dialogs': this.dialogLibrary,
        'defaultDialog': this.defaultDialog
      };
      convo = new Conversation(convo_params)
      this.sessionData[sessionKey] = convo;
    }
    convo.onMessage(msg);
  }

  addDialog(dialog) {
    this.dialogLibrary.push(dialog)
  }
}

module.exports = BotBuilder;
