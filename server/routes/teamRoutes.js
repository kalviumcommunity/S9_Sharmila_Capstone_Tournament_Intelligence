const express = require("express");
const Team = require("../models/Team");
const Tournament = require("../models/Tournament");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const teams = await Team.find()
      .populate("tournament", "name status")
      .sort({ createdAt: -1 });

    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const tournamentExists = await Tournament.exists({
      _id: req.body.tournament,
    });

    if (!tournamentExists) {
      return res.status(404).json({ message: "Tournament not found" });
    }

    const team = await Team.create(req.body);
    const populatedTeam = await team.populate("tournament", "name status");

    res.status(201).json(populatedTeam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
