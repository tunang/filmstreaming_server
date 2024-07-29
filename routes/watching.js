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
      const watchingFilmsList = await watchingFilms.findOne({ user: req.userId });
  
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
  

module.exports = router;