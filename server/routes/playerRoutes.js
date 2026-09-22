const express = require("express");
const Player = require("../models/Player");
const Team = require("../models/Team");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const players = await Player.find()
      .populate("team", "name coach")
      .sort({ createdAt: -1 });

    res.json(players);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const player = await Player.findById(req.params.id).populate(
      "team",
      "name coach"
    );

    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    res.json(player);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const teamExists = await Team.exists({ _id: req.body.team });

    if (!teamExists) {
      return res.status(404).json({ message: "Team not found" });
    }

    const player = await Player.create(req.body);
    const populatedPlayer = await player.populate("team", "name coach");

    res.status(201).json(populatedPlayer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    if (req.body.team) {
      const teamExists = await Team.exists({ _id: req.body.team });

      if (!teamExists) {
        return res.status(404).json({ message: "Team not found" });
      }
    }

    const player = await Player.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("team", "name coach");

    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    res.json(player);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
