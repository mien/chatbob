'use strict';
class IConnector {
  constructor() {
    this.handler = null;
  }
  postMessage(params) {}
  processMessage(msg) {}
  registerListener(msgHandler) {
    this.handler = msgHandler;
  }
}

module.exports = IConnector;
