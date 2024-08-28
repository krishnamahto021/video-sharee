import mongoose, { Schema, Document, Model, mongo } from "mongoose";
export interface Iuser extends Document {
  name?: string;
  email: string;
  password: string;
  token?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema: Schema = new Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    token: { type: String },
  },
  { timestamps: true }
);

const User: Model<Iuser> = mongoose.model<Iuser>("User", userSchema);

export default User;
