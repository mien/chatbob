'use strict';
module.exports.Dialog = require('./lib/dialog')
module.exports.BotBuilder = require('./lib/bot-builder')
module.exports.SlackConnector = require('./lib/connector/slack')
module.exports.TelegramConnector = require('./lib/connector/telegram')
module.exports.IConnector = require('./lib/connector/base-connector')
module.exports.SocketClusterConnector = require('./lib/connector/socket-cluster')
