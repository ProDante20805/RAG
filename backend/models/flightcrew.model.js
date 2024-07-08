import mongoose from 'mongoose';
import { paginate, toJSON } from './plugins';

const { Schema } = mongoose;

const flightcrewSchema = new Schema({
  fc_name: { type: String, required: true },
  creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  invited_users: [{ type: Schema.Types.ObjectId, ref: 'User', default: null }],
  createdAt: { type: Date, default: Date.now },
});

// add plugin that converts mongoose to json
flightcrewSchema.plugin(toJSON);
flightcrewSchema.plugin(paginate);

const Flightcrew = mongoose.model('Flightcrew', flightcrewSchema);

export default Flightcrew;
