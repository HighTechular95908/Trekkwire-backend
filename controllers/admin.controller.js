const handleError = require("../config/utils/handleError");
var mongoose = require("mongoose"),
  Traveler = mongoose.model("Traveler"),
  Guide = mongoose.model("Guide");
exports.totalTraveler = (req, res) => {
  Traveler.find()
    .then((travelers) => {
      res.status(200).send({
        total: travelers.length,
      });
    })
    .catch((err) => handleError(err, res));
};
exports.totalGuide = (req, res) => {
  Guide.find()
    .then((guides) => {
      res.status(200).send({
        total: guides.length,
      });
    })
    .catch((err) => handleError(err, res));
};

