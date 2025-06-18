const mongoose = require('mongoose')

const chatChannelSchema = new mongoose.Schema({
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Chỉ 2 người
    isHiddenFor: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Ai đã ẩn kênh này
  }, { timestamps: true });
  
  module.exports = mongoose.model('ChatChannel', chatChannelSchema);
  