import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
import Watchlist from "../models/Watchlist";
import { Schema } from "mongoose";

export const registerUser = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { username, email, password } = req.body;

  const errors: string[] = [];

  if (!username || username.trim() === "") {
    errors.push("Username is required");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push("Please provide a valid email address");
  }

  if (!password || password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }

  const existingUser = await User.findOne({
    $or: [{ username: username }, { email: email }],
  });

  if (existingUser) {
    if (existingUser.username === username) {
      return res.status(409).json({ message: "Username already exists." });
    }
    if (existingUser.email === email) {
      return res.status(409).json({ message: "Email already exists." });
    }
  }

  if (errors.length > 0) return res.status(400).json({ errors });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    const newWatchlist = new Watchlist({
      userId: newUser._id,
      movies: [],
    });
    await newWatchlist.save();
    newUser.watchlist = newWatchlist._id as Schema.Types.ObjectId;
    console.log(newUser);
    await newUser.save();
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });
    res.status(201).json({ userName: newUser.username, userToken: token });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    res.json({ userName: user.username, userToken: token });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
