'use strict';
const uuid = require('node-uuid');
const _ = require('lodash');

class User {
  constructor(params) {
    this._id = uuid.v4();
    if (params) {
      if (params.name) this._name = params.name;
      if (params.email) this._email = params.email;
    }
    this.channelList = [];
  }
  addChannel(params) {
    let user_info = {
      'userId': params.userId,
      'platform': params.platform,
      'channelId': params.channelId, // private channel id of the user to communicate
      'isPrivateChannel': params.isPrivateChannel || true, // private channel id of the user to communicate
      'isGroupChannel': params.isGroupChannel || false // private channel id of the user to communicate
    }
    this.channelList.push(user_info);
  }

  removeChannel(platform) {
    delete this.channelList[platform]
  }

  get id() {
    return this._id;
  }

  set id(newId) {
    this._id = newId;
  }

  set email(emailId) {
    this._email = emailId
  }

  set name(name) {
    this._name = name
  }

  getplatformUserId(platform) {
    let channelObjs = this.platformChannelId({
      'platform': platform
    })
    if (channelObjs.length > 0) {
      return channelObjs[0].userId
    } else {
      return null;
    }
  }

  getUserChannelId(platform, isPrivateChannel) {
    if (!_.isNil(isPrivateChannel)) isPrivateChannel = true
    let channelObjs = this.platformChannelId({
      'platform': platform,
      'isPrivateChannel': isPrivateChannel
    })
    return channelObjs
  }

  hasChannel(params) {
    if (this.searchChannels(params).length > 0) {
      return true;
    } else {
      return false;
    }
  }

  searchChannels(params) {
    let searchParams = {
      'platform': params.platform
    }
    /**
     * platformUserId not to be confused with the internal unique user id
     * its the unique id of the user used by the platform system
     */
    if (!_.isNil(params.platformUserId)) searchParams.userId = params.platformUserId
    if (!_.isNil(params.channelId)) searchParams.channelId = params.channelId
    if (!_.isNil(params.isPrivateChannel)) searchParams.isPrivateChannel = params.isPrivateChannel

    return _.filter(this.channelList, searchParams);
  }
}
module.exports = User;
