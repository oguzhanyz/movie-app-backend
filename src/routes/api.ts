import express from "express";

import * as apiController from "../controllers/apiController";
import { auth as authMiddleware } from "../middleware/auth";

const router = express.Router();

router.get("/search", authMiddleware, apiController.searchMovie); // search movie database

// router.get("/watchlist"); // retrieve user's watchlist

router.post("/watchlist", authMiddleware, apiController.addMovieToWatchlist); // add movie to user's watchlist

// router.get("/watchlist/filter"); // filter user's watchlist

export default router;
