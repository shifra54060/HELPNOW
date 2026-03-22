const mongoose = require('mongoose');

const AreaSchema = new mongoose.Schema({

  areaCode: {
    type: Number,
    required: true,
    unique: true
  },
  name: { type: String, required: true }

});


module.exports = mongoose.model('Area', AreaSchema, 'area');