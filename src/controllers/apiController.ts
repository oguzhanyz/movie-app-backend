import { Request, Response } from "express";
import Movie from "../models/Movie";

export const searchMovie = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { title } = req.query;

  if (!title) {
    return res.status(400).json({ error: "Title must be provided." });
  }

  try {
    const movies = await Movie.find({ primaryTitle: title });
    return res.json(movies);
  } catch (error) {
    return res.status(500).json({ error: "Server error." });
  }
};
