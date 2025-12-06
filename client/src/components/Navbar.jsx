import { Link, useNavigate } from "react-router-dom";
import BigLogo from "../assets/Large-Logo.png";
import styles from "../components/Navbar.module.css";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
    window.location.reload();
  };

  return (
    <nav className={styles.Navbar}>
      <Link to="/">
        <img className={styles.BigLogo} src={BigLogo} alt="logo Cripto Data" />
      </Link>

      <div className={styles.NavLinks}>
        {user ? (
          <div className={styles.Container}>
            <span className={styles.UserName}>Hello, {user.name}</span>
            <Link to="/watchlist" className={styles.WatchList}>
              Watchlist
            </Link>

            <button onClick={handleLogout} className={styles.LogoutBtn}>
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" className={styles.LoginBtn}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
