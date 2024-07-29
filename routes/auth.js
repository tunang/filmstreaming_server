const express = require("express");
const router = express.Router();
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

const users = require('../models/users')
const favFilms = require('../models/FavoriteFilms')
const watchingFilms = require('../models/WatchingFilms')
const verifyToken = require("../middleware/authMiddle")

router.get("/", (req, res) => res.send("USER ROUTE"));

router.post('/register', async(req, res) => {
    const { email, password, firstname, lastname } = req.body;

  //Simple validation

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Missing username and/or password" });
  }

  try {
    const user = await users.findOne({ email: email });

    if (user) {
      return res.status(400).json({ success: false, message: "Email taken" });
    }

    //All good

    const hashedPassword = await argon2.hash(password);
    const newUser = new users({
      email,
      password: hashedPassword,
      firstname,
      lastname,
    });
    await newUser.save();

    

    const newFavFilmsList = new favFilms({
      userId: newUser._id,
      favoriteFilms: [],
    });

    await newFavFilmsList.save();

    const newWatchingFilmsList = new watchingFilms({
      userId: newUser._id,
      watchingFilms: [],
    });

    await newWatchingFilmsList.save();
    

    //Return token
    const tokens = generateTokens({ userId: newUser._id });

    let updateRefreshToken = {
      $set: {
        refreshToken: tokens.refreshToken,
      },
    };

    const refreshTokenUpdateCondition = { _id: newUser._id };

    const result = await users.updateOne(
      refreshTokenUpdateCondition,
      updateRefreshToken
    );

    return res.json({
      success: true,
      message: "User created successfully",
      tokens,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});


router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  //simple validation
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Missing username and/or password" });
  }

  try {
    //Check for existing user
    const user = await users.findOne({ email: email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect username/password" });
    }
    //Username found
    //console.log(user);
    const passwordValid = await argon2.verify(user.password, password);

    if (!passwordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect username/password" });
    }

    //All good
    const tokens = generateTokens({ userId: user._id });

    let updateRefreshToken = {
      $set: {
        refreshToken: tokens.refreshToken,
      },
    };

    const refreshTokenUpdateCondition = { _id: user._id };

    const result = await users.updateOne(
      refreshTokenUpdateCondition,
      updateRefreshToken
    );

    return res.json({
      success: true,
      message: "User login successfully",
      tokens,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internel server error" });
  }
});


const generateTokens = (payload) => {
    //create jwt
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
    });
  
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRE,
    });
  
    return { accessToken, refreshToken };
};

module.exports = router;