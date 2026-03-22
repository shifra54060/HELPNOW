const mongoose = require('mongoose');

const VolunteerSchema = new mongoose.Schema({
  volunteerCode: {
    type: String,
    required: true,
    unique: true
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  specialties: [String]
});

module.exports = mongoose.model('volunteers', VolunteerSchema);