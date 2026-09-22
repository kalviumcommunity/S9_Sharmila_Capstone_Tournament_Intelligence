const express = require("express");
const Match = require("../models/Match");
const Team = require("../models/Team");
const Tournament = require("../models/Tournament");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const matches = await Match.find()
      .populate("tournament", "name status")
      .populate("team1", "name")
      .populate("team2", "name")
      .populate("winner", "name")
      .sort({ matchDate: 1 });

    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { tournament, team1, team2, winner } = req.body;

    if (team1 === team2) {
      return res
        .status(400)
        .json({ message: "A match must include two different teams" });
    }

    const tournamentExists = await Tournament.exists({ _id: tournament });

    if (!tournamentExists) {
      return res.status(404).json({ message: "Tournament not found" });
    }

    const teams = await Team.find({ _id: { $in: [team1, team2] } }).select(
      "_id"
    );

    if (teams.length !== 2) {
      return res
        .status(404)
        .json({ message: "Both participating teams must exist" });
    }

    if (winner && winner !== team1 && winner !== team2) {
      return res
        .status(400)
        .json({ message: "Winner must be one of the participating teams" });
    }

    const match = await Match.create(req.body);
    const populatedMatch = await match.populate([
      { path: "tournament", select: "name status" },
      { path: "team1", select: "name" },
      { path: "team2", select: "name" },
      { path: "winner", select: "name" },
    ]);

    res.status(201).json(populatedMatch);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
