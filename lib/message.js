const uuid = require('node-uuid');

class Message {
  constructor(params) {
    this.isGroupMsg = params.isGroupMsg;
    this.isDirectMsg = params.isDirectMsg;
    if (this.isDirectMsg && this.isGroupMsg) {
      throw new Error('Message cannot be both group and private message')
    }
    this.platform = params.platform;
    this.text = params.text;
    this.entities = params.entities || []; // entities extracted from the text msg
    this.channelId = params.channelId; // channel through which we recieved msg could be group channel or user private channel that can be known from isGroupMsg or isDirectMsg flag
    this.userId = params.userId; // user id of the user sending message platfrom specific id not to be confused with user private channel id
    this.groupId = params.groupId; // group id not to be confused with the group channel id of the
    if (this.isDirectMsg) {
      this.to_bot = params.true; // is this message addressing the bot
    }
    this.type = params.type; // is it text or multi-media message
    this.msgId = params.msgId || uuid.v4(); // unique message id
    this.attachments = params.attachments || [];
    // TODO: need to standarize how to store time
    this.timestamp = params.timestamp || Date.now();
    this.userObj = params.userObj; // internal user Object;
  }

  addAttachments(attachment) {
    this.attachments.push(attachment);
  }

  setUser(userObj) {
    this.userObj = userObj;
  }

  getUser(userObj) {
    return this.userObj;
  }

  isGroupMsg() {
    return this.isGroupMsg;
  }

  isPrivateMsg() {
    return this.isDirectMsg;
  }

  addEntity(entity) {
    this.entities.push = entity;
  }
}

module.exports = Message;
