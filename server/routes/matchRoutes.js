const express = require("express");
const Match = require("../models/Match");

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
