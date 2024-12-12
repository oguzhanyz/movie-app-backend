import { Request, Response } from "express";
import Movie from "../models/Movie";
import Watchlist from "../models/Watchlist";
import { IWatchlist } from "../models/Watchlist";
import { AuthRequest } from "../types/AuthRequest";
import { MovieFilterQuery } from "../types/MovieFilterQuery";

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

export const addMovieToWatchlist = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  const { movieId } = req.body;
  const userId = req.userId;

  if (!req.userId || !movieId) {
    return res
      .status(400)
      .json({ error: "User ID and Movie ID are required." });
  }

  try {
    const watchlist: IWatchlist | null = await Watchlist.findOne({ userId });

    if (!watchlist) {
      const newWatchlist = new Watchlist({ userId, movies: [movieId] });
      await newWatchlist.save();
      return res.status(201).json(newWatchlist);
    }

    if (watchlist.movies.includes(movieId)) {
      return res.status(400).json({ error: "Movie already in watchlist." });
    }

    watchlist.movies.push(movieId);
    await watchlist.save();
    return res.status(201).json(watchlist);
  } catch (err) {
    res.status(500).json({ error: "Server error." });
  }
};

export const retrieveWatchlist = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  const userId = req.userId;

  try {
    const watchlist: IWatchlist | null = await Watchlist.findOne({ userId });
    if (!watchlist) {
      return res.status(400).json({ error: "Watchlist not found" });
    }
    const movies = await Movie.find({
      _id: { $in: watchlist.movies },
    });
    return res.status(200).json(movies);
  } catch (err) {
    return res.status(500).json({ error: "Server error." });
  }
};

export const filterMovies = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const { minLength, maxLength, genres }: MovieFilterQuery = req.query;
    const userId = req.userId;

    const watchlist: IWatchlist | null = await Watchlist.findOne({ userId });
    if (!watchlist) {
      return res.status(400).json({ error: "Watchlist not found" });
    }

    const filter: any = {
      _id: { $in: watchlist.movies },
    };

    if (minLength || maxLength) {
      filter.runtimeMinutes = {};

      if (minLength) {
        filter.runtimeMinutes.$gte = parseInt(minLength, 10);
      }

      if (maxLength) {
        filter.runtimeMinutes.$lte = parseInt(maxLength, 10);
      }
    }

    if (genres) {
      filter.genres = { $all: genres };
    }

    const movies = await Movie.find(filter).limit(100).exec();

    return res.json(movies);
  } catch (error) {
    console.error("Error filtering movies:", error);
    return res.status(500).json({
      message: "Error filtering movies",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
