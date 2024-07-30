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
      const favoriteFilmsList = await favFilms.findOne({ userId: req.userId });
      
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



  router.put("/add", verifyToken, async (req, res) => {
    const { films } = req.body;
    console.log(films._id);
    try {
      const favoriteFilmsListUpdateCondition = { userId: req.userId };
  
      // Retrieve the user's favorite films list
      const userFavoriteFilms = await favFilms.findOne(favoriteFilmsListUpdateCondition);
  
      // Check if any film in the list has the same ID
      const isFilmAlreadyAdded = userFavoriteFilms.favoriteFilms.some(film => film._id === films[0]._id);
  
      if (isFilmAlreadyAdded) {
        return res.status(400).json({ success: false, message: 'Film already added to favorites' });
      }
  
      // Rest of your code to add the film to the list
      // ...

      let updateFavoriteFilmsList = {
        $push: {
          favoriteFilms: { $each: films },
        },
      };
  
      const result = await favFilms.findOneAndUpdate(
        favoriteFilmsListUpdateCondition,
        updateFavoriteFilmsList
      );
  
      if (!result) {
        return res.status(401).json({ success: false, message: "fav products list not found" });
      }
  
      return res.json({
        success: true,
        message: "Happy learning",
        favoriteFilms: result.favoriteFilms,
      });
  
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Internel server error" });
    }
  });

module.exports = router;
