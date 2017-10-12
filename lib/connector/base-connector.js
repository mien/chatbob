'use strict';
class IConnector {
  constructor() {
    this.handler = null;
    this.platform = null; //name of the channel
  }
  postMessage(channelId, text) {}
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
    return msg.channelId + msg.sender_user_id;
  }
}

module.exports = IConnector;
