import mongoose from 'mongoose';
import validator from 'validator';
import { paginate, toJSON } from './plugins';

const { Schema } = mongoose;

const notificationSchema = new Schema({
  to: {
    type: String,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Invalid email');
      }
    },
  },
  title: { type: String },
  content: { type: String },
  from: { type: Schema.Types.ObjectId, ref: 'User' },
  type: { type: Number }, //1:system,2:normal,3:accept
  checked: { type: Number, default: 0 }, //1:checked,0:unchecked
  createdAt: { type: Date, default: Date.now },
});

// add plugin that converts mongoose to json
notificationSchema.plugin(toJSON);
notificationSchema.plugin(paginate);

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
