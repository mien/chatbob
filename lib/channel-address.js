'use strict';
class Channel {
  constructor(params) {
    this.id = params.id; // channel id
    this.admin_id = params.admin_id; // admin id
    this.platform = params.platform;
    this.isGroupChannel = params.isGroupChannel;
    this.isPrivateChannel = params.isPrivateChannel;
    this.name = params.name; // channeld name
  }
}
module.exports
