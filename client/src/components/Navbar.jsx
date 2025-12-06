import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        CryptoTracker
      </Link>

      <div className="nav-links">
        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <Link
              to="/watchlist"
              style={{
                color: "#16c784",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              My Watchlist
            </Link>

            <span>Hello, {user.name}</span>

            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" className="nav-link">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
