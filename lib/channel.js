'use strict';
class Channel {
  constructor(params) {
    this.id = params.id; // channel id
    this.platform = params.platform;
    this.isGroupChannel = params.isGroupChannel;
    this.isPrivateChannel = params.isPrivateChannel;
    this.name = params.name;
  }
}
module.exports
