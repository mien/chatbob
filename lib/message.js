class Message {
  constructor(params) {
    this.is_group_msg = params.is_group_msg;
    this.is_direct_msg = params.is_direct_msg;
    if (this.is_direct_msg && this.is_group_msg) {
      throw new Error('Message cannot be both group and private message')
    }
    this.source = params.source;
    this.text = params.text;
    this.entities = params.entities || [];
    this.channel_id = params.channel_id;
    this.user_id = params.user_id;
    this.group_id = params.group_id;
    if (this.is_direct_msg) {
      this.to_bot = params.true; // is this message addressing the bot
    }
    this.sender_user_id = params.sender_user_id;
    this.type = params.type; // is it text of multi-media message
    this.msg_id = params.msg_id;
    this.attachments = params.attachments || [];
    this.timestamp = params.timestamp;
  }

  addAttachments(attachment) {
    this.attachments.push(attachment);
  }

  isGroupMsg() {
    return this.is_group_msg;
  }

  isPrivateMsg() {
    return this.is_direct_msg;
  }

  addEntity(entity) {
    this.entities.push = entity;
  }
}

module.exports = Message;
