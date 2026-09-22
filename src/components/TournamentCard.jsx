function TournamentCard({ name, teams, matches }) {
  return (
    <div className="tournament-card">
      <h3>{name}</h3>
      <p>Teams: {teams}</p>
      <p>Matches: {matches}</p>

      <button>View Tournament</button>
    </div>
  );
}

export default TournamentCard;