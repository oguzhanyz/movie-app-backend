import { Schema, model, Document } from "mongoose";

interface IWatchlist extends Document {
  userId: Schema.Types.ObjectId;
  movies: any[]; // Store movies as an array of any objects
}

const WatchlistSchema = new Schema<IWatchlist>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  movies: [{ type: Schema.Types.Mixed }], // Movies can have any structure
});

const Watchlist = model<IWatchlist>("Watchlist", WatchlistSchema);
export default Watchlist;
