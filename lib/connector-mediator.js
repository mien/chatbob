'use strict';
const _ = require('lodash');

class ConnectorMediator {

  constructor(connectors) {
    if (_.isArray(connectors)) {
      this.connectors = connectors;
    } else {
      this.connectors = [connectors];
    }
    this.map_connectors = this._initConnector(this.connectors);
    this.handler = null;
  }

  getSessionKey(msg) {
    return this.map_connectors[msg.source].getSessionKey(msg);
  }

  _initConnector(connectors) {
    let map_connectors = {};
    _.each(connectors, connector => map_connectors[connector.source] = connector);
    return map_connectors;
  }

  registerListener(handler) {
    this.handler = handler;
    _.each(this.connectors, connector => connector.registerListener(this.handler))
  }

  addConnector(connector) {
    this.connectors.push(connector);
    this.map_connectors[connector.source] = connector;
  }

  postMessage(msg) {
    let msg_source = msg.source;
    this.map_connectors[msg_source].postMessage(msg.channel_id, msg.text);
  }

  broadcastToAllChannels(msg) {
    _.each(this.connectors, connector => connector.postMessage(channel_id, msg));
  }
}

module.exports = ConnectorMediator;
