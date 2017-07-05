'use strict';
const _ = require('lodash');

class UserManager {
  constructor(users) {
    this.usersList = users || [];
  }

  addUser(user) {
    this.usersList.push(user);
  }

  addChannelToUser(userId, user_channel_params) {
    let userObj = _.find(this.usersList, {
      'id': user_channel_params.userId
    })
    if (userObj) {
      userObj.addChannel(user_channel_params)
    } else {
      console.log('Couldnt find user %s', user_channel_params.id)
    }
  }

  searchgUserByChannelId(platform, platformChannelId) {
    let searchParams = {
      'platform': platform,
      'channelId': platformChannelId
    }
    return _.find(this.usersList, user => user.hasChannel(searchParams));
  }

  searchUserByUserId(platform, platformUserId) {
    let searchParams = {
      'platform': platform,
      'platformUserId': platformUserId
    }
    return _.find(this.usersList, user => user.hasChannel(searchParams));
  }
}

module.exports = UserManager;
