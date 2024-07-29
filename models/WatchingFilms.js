const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const watchingFilmsSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    watchingFilms: []
  });
  


  module.exports = mongoose.model('WatchingFilms', watchingFilmsSchema);