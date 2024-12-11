import express from "express";

import * as apiController from "../controllers/apiController";

const router = express.Router();

router.get("/search", apiController.searchMovie); // search movie database

// router.get("/watchlist"); // retrieve user's watchlist

// router.post("/watchlist"); // add movie to user's watchlist

// router.get("/watchlist/filter"); // filter user's watchlist

export default router;
