const mongoose = require('mongoose');

exports.initializeDatabase = () => {
   return mongoose.connect('mongodb://localhost:27017/artGallery');}