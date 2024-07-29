const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddle");

const favFilms = require('../models/FavoriteFilms')


// router.get("/", (req, res) => res.send("Favorite ROUTE"));

//@route GET api/favorite
//@desc Get favorite films
//@access Private
router.get("/", verifyToken, async (req, res) => {
    try {
      const favoriteFilmsList = await favFilms.findOne({ user: req.userId });
  
      res.json({ success: true, favoriteFilmsList});
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Internel server error" });
    }
});

//@route PUT api/favorite
//@desc Update favorite films
//@access Private

router.put("/", verifyToken, async (req, res) => {
    const { films } = req.body;
  
    console.log(films);
  
    try {
      let updateFavoriteFilmsList = {
        $set: {
            favoriteFilms: films,
        },
      };
      const favoriteFilmsListUpdateCondition = { userId: req.userId };
  
      const result = await favFilms.findOneAndUpdate(
        favoriteFilmsListUpdateCondition,
        updateFavoriteFilmsList
      );
  
      if (!result) {
        return res.status(401).on({ success: false, message: "fav products list not found" });
      }
  
      return res.json({
        success: true,
        message: "Happy learning",
        favoriteFilms: films,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Internel server error" });
    }
  });

module.exports = router;
