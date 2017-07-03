'use strict';
class IConnector {
  constructor() {
    this.handler = null;
    this.source = null; //name of the channel
  }
  postMessage(channel_id, text) {}
  processMessage(msg) {}
  listen() {}
  registerListener(msgHandler) {
    this.handler = msgHandler;
  }
  /**
   * help to identify user session
   * @param  {Message} msg framework message object
   * @return {String}     session id
   */
  getSessionKey(msg) {
    return msg.channel_id + msg.sender_user_id;
  }
}

module.exports = IConnector;
