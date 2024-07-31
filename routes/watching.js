const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddle");

const watchingFilms = require('../models/WatchingFilms')


// router.get("/", (req, res) => res.send("Watching ROUTE"));

//@route GET api/watching
//@desc Get watching films
//@access Private
router.get("/", verifyToken, async (req, res) => {
    try {
      const watchingFilmsList = await watchingFilms.findOne({ userId: req.userId });
  
      res.json({ success: true, watchingFilmsList});
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Internel server error" });
    }
});



//@route PUT api/watching
//@desc Update watching film list
//@access Private

router.put("/", verifyToken, async (req, res) => {
    const { films } = req.body;
  
    console.log(films);
  
    try {
      let updateWatchingFilmsList = {
        $set: {
            watchingFilms: films,
        },
      };
      const watchingFilmsListUpdateCondition = { userId: req.userId };
  
      const result = await watchingFilms.findOneAndUpdate(
        watchingFilmsListUpdateCondition,
        updateWatchingFilmsList
      );
  
      if (!result) {
        return res.status(401).on({ success: false, message: "fav products list not found" });
      }
  
      return res.json({
        success: true,
        message: "Happy learning",
        watchingFilms: films,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Internel server error" });
    }
  });


//@route PUT api/watching/add
//@desc push 1 watching films into watching films models
//@access Private

router.put("/add", verifyToken, async (req, res) => {
  const { films } = req.body;

  try {
    const watchingFilmsListUpdateCondition = { userId: req.userId };

    // Retrieve the user's favorite films list
    const userWatchingFilms = await watchingFilms.findOne(
      watchingFilmsListUpdateCondition
    );

    // Check if any film in the list has the same ID
    const isFilmAlreadyAdded = userWatchingFilms.watchingFilms.some(
      (film) => film._id === films[0]._id
    );

    if (isFilmAlreadyAdded) {
      return res
        .status(400)
        .json({ success: false, message: "Film already added to watching" });
    }

    // Rest of your code to add the film to the list
    // ...

    let updateWatchingFilmsList = {
      $push: {
        watchingFilms: { $each: films },
      },
    };

    const result = await watchingFilms.findOneAndUpdate(
      watchingFilmsListUpdateCondition,
      updateWatchingFilmsList
    );

    if (!result) {
      return res
        .status(401)
        .json({ success: false, message: "watching films list not found" });
    }

    return res.json({
      success: true,
      message: "Happy learning",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internel server error" });
  }
});

router.delete("/", verifyToken, async (req, res) => {
  const { films } = req.body;
  try {
    const watchingFilmsListUpdateCondition = { userId: req.userId };

    // Retrieve the user's favorite films list
    const userWatchingFilms = await watchingFilms.findOne(
      watchingFilmsListUpdateCondition
    );

    const newWatchingFilmsList = userWatchingFilms.watchingFilms.filter(film => film._id !== films[0]._id);

    console.log(newWatchingFilmsList);

    userWatchingFilms.watchingFilms = newWatchingFilmsList;

    await userWatchingFilms.save();

    return res.json({
      success: true,
      message: "Film was removed from favorites"
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internel server error" });
  }
});
  

module.exports = router;