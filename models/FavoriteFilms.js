const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favoriteFilmsSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    favoriteFilms: []
  });
  


  module.exports = mongoose.model('FavoriteFilms', favoriteFilmsSchema);