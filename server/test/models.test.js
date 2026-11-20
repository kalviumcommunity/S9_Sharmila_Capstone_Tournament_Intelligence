const assert = require("node:assert/strict");
const { test } = require("node:test");
const mongoose = require("mongoose");
const Match = require("../models/Match");
const Player = require("../models/Player");
const Team = require("../models/Team");
const Tournament = require("../models/Tournament");

const objectId = () => new mongoose.Types.ObjectId();

async function assertInvalid(document, paths) {
  await assert.rejects(document.validate(), (error) => {
    for (const path of paths) {
      assert.ok(error.errors[path], `Expected validation error for ${path}`);
    }
    return true;
  });
}

test("tournament trims its name and defaults to upcoming", async () => {
  const tournament = new Tournament({
    name: "  Summer Cup  ",
    startDate: new Date("2026-06-01"),
  });

  await tournament.validate();
  assert.equal(tournament.name, "Summer Cup");
  assert.equal(tournament.status, "upcoming");
});

test("tournament requires a name and start date", async () => {
  await assertInvalid(new Tournament(), ["name", "startDate"]);
});

test("tournament rejects an unsupported status", async () => {
  const tournament = new Tournament({
    name: "Summer Cup",
    startDate: new Date("2026-06-01"),
    status: "paused",
  });

  await assertInvalid(tournament, ["status"]);
});

test("team trims its name and requires a tournament", async () => {
  const team = new Team({ name: "  Falcons  ", tournament: objectId() });

  await team.validate();
  assert.equal(team.name, "Falcons");
  await assertInvalid(new Team({ name: "Falcons" }), ["tournament"]);
});

test("player trims its name and accepts a nonnegative age", async () => {
  const player = new Player({ name: "  Alex  ", team: objectId(), age: 18 });

  await player.validate();
  assert.equal(player.name, "Alex");
});

test("player rejects negative ages and requires a team", async () => {
  const player = new Player({ name: "Alex", age: -1 });

  await assertInvalid(player, ["age", "team"]);
});

test("match initializes scores to zero", async () => {
  const match = new Match({
    tournament: objectId(),
    team1: objectId(),
    team2: objectId(),
    matchDate: new Date("2026-06-02"),
  });

  await match.validate();
  assert.equal(match.team1Score, 0);
  assert.equal(match.team2Score, 0);
});

test("match requires a tournament, two teams, and a date", async () => {
  await assertInvalid(new Match(), ["tournament", "team1", "team2", "matchDate"]);
});
