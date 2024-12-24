import express from "express";

import * as apiController from "../controllers/apiController";
import { auth as authMiddleware } from "../middleware/auth";

const router = express.Router();

router.get("/search", authMiddleware, apiController.searchMovie); // search movie database

router.get("/watchlist", authMiddleware, apiController.retrieveWatchlist); // retrieve user's watchlist

router.post("/watchlist", authMiddleware, apiController.addMovieToWatchlist); // add movie to user's watchlist

router.delete(
  "/watchlist/:id",
  authMiddleware,
  apiController.removeMovieFromWatchlist
); // remove movie from user's watchlist

router.get("/watchlist/filter", authMiddleware, apiController.filterMovies); // filter user's watchlist

export default router;
