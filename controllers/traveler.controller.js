var mongoose = require("mongoose"),
  Traveler = mongoose.model("Traveler");
exports.create = (req, res) => {
  let travelerId = req.params.id;
  try {
    Traveler.create({
      user: travelerId,
    });
    return res.status(200).send({});
  } catch {
    return res.status(500).send({
      code: "500",
      error: "Server Disconnected!",
    });
  }
};

