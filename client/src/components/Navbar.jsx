function Navbar({ user, onSignOut }) {
  return (
    <nav className="navbar">
      <h2>Tournament Intelligence</h2>

      <div className="nav-links">
        <span>Dashboard</span>
        <span>Tournaments</span>
        <span>Analytics</span>
        <span>Players</span>
      </div>

      <div className="nav-account">
        {user.picture && <img className="user-avatar" src={user.picture} alt="" />}
        <span className="user-name">{user.name}</span>
        <button type="button" className="sign-out-button" onClick={onSignOut}>Sign out</button>
      </div>
    </nav>
  )
}

export default Navbar
