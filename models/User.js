const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  refreshToken: { type: String },
  username: { type: String, required: true, unique: true },
  email: { type: String, unique: true, sparse: true },
  avatar: { type: String },
  password: { type: String },
  googleId: { type: String },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  // ✅ Phân quyền user / admin
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },

  // (Optional) trạng thái
  isActive: {
    type: Boolean,
    default: true
  },

  // ✅ Trạng thái tài khoản: bị ban hay không
  isBanned: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
