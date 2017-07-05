'use strict';
const _ = require('lodash');

class ConnectorMediator {

  constructor(connectors) {
    if (_.isArray(connectors)) {
      this.connectors = connectors;
    } else {
      this.connectors = [connectors];
    }
    this.mapConnectors = this._initConnector(this.connectors);
    this.handler = null;
  }

  _initConnector(connectors) {
    let mapConnectors = {};
    _.each(connectors, connector => mapConnectors[connector.platform] = connector);
    return mapConnectors;
  }

  registerListener(handler) {
    this.handler = handler;
    _.each(this.connectors, connector => connector.registerListener(this.handler))
  }

  startListening() {
    _.each(this.connectors, connector => connector.listen())
  }

  addConnector(connector) {
    this.connectors.push(connector);
    this.mapConnectors[connector.platform] = connector;
  }

  postMessage(msg) {
    let msg_platform = msg.platform;
    this.mapConnectors[msg_platform].postMessage(msg.channelId, msg.text);
  }

  broadcastToAllChannels(msg) {
    let msg_platform = msg.platform;
    _.each(this.connectors, connector => connector.postMessage(msg.channelId, msg.text));
  }
}

module.exports = ConnectorMediator;
