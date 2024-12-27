import { Schema, model, Document } from "mongoose";

interface IMovie extends Document {
  tconst: string;
  titleType: string;
  primaryTitle: string;
  originalTitle: string;
  isAdult: boolean;
  startYear: number;
  endYear: number;
  runtimeMinutes: number;
  genres: string[];
  averageRating: number;
  numVotes: number;
}

const MovieSchema = new Schema<IMovie>({
  tconst: { type: String, required: true, unique: true },
  titleType: { type: String, required: true },
  primaryTitle: { type: String, required: true },
  originalTitle: { type: String, required: true },
  isAdult: { type: Boolean, required: true },
  startYear: { type: Number, required: true },
  endYear: { type: Number, default: null },
  runtimeMinutes: { type: Number, required: true },
  genres: { type: [String], required: true },
  averageRating: { type: Number },
  numVotes: { type: Number },
});

export default model<IMovie>("Movie", MovieSchema);
