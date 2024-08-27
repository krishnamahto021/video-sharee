import mongoose, { Schema, Document, Model, mongo } from "mongoose";
interface Iuser extends Document {
  name?: string;
  email: string;
  password: string;
}

const userSchema: Schema = new Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User: Model<Iuser> = mongoose.model<Iuser>("User", userSchema);

export default User;
