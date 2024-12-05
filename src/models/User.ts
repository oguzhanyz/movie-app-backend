import { Schema, model, Document } from "mongoose";

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  playlists: string[];
  watchlist: Schema.Types.ObjectId;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  playlists: { type: [String], default: [] },
  watchlist: { type: Schema.Types.ObjectId, ref: "Watchlist" },
});

export default model<IUser>("User", UserSchema);
