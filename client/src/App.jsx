import Navbar from './components/Navbar'
import StatCard from './components/StatCard'
import TournamentCard from './components/TournamentCard'
import './App.css'

function App() {
  return (
    <div>
      <Navbar />

      <main className="dashboard">
        <h1>Dashboard</h1>
        <p>Welcome to Tournament Intelligence Platform</p>

        <section className="stats">
          <StatCard title="Tournaments" value="5" />
          <StatCard title="Teams" value="24" />
          <StatCard title="Players" value="180" />
          <StatCard title="Matches" value="72" />
        </section>

        <h2>Recent Tournaments</h2>

        <section className="tournaments">
          <TournamentCard name="Chennai Cup 2026" teams="12" matches="36" />
          <TournamentCard name="College League 2026" teams="8" matches="24" />
        </section>
      </main>
    </div>
  )
}

export default App
