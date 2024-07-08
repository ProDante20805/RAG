import mongoose from 'mongoose';
import validator from 'validator';
import { paginate, toJSON } from './plugins';

const { Schema } = mongoose;

const contactusSchema = new Schema({
  fullname: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Invalid email');
      }
    },
  },
  message: [
    {
      type: String,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

// add plugin that converts mongoose to json
contactusSchema.plugin(toJSON);
contactusSchema.plugin(paginate);

contactusSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const contactus = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!contactus;
};

const Contactus = mongoose.model('Contactus', contactusSchema);

export default Contactus;
