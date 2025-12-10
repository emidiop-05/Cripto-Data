import { useState, useEffect } from "react";
import axios from "axios";
import Sparkline from "../components/Sparkline";
import styles from "../pages/Home.module.css";
import { NavLink } from "react-router-dom";

const Trending = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/crypto");
        setCoins(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error connecting to server:", err);
        setError("Could not fetch data. Is the server running?");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAdd = async (coinId) => {
    if (!user) {
      alert("Please login to use the watchlist!");
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      await axios.put(
        "http://localhost:5000/api/users/watchlist",
        { coinId },
        config
      );

      alert("Coin added to your watchlist!");
    } catch (error) {
      console.error(error);
      alert("Error adding coin (maybe it's already there?)");
    }
  };

  if (loading) return <h1>Loading Market Data...</h1>;
  if (error) return <h1 style={{ color: "red" }}>{error}</h1>;

  return (
    <div className={styles.MarketContainer}>
      <h1 className={styles.MarketTitle}>Trending Coins last 24H</h1>
      <nav className={styles.SubCategoriesContainer}>
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? styles.ActiveCategory : styles.SubCategories
          }
        >
          All
        </NavLink>

        <NavLink
          to="/trending"
          className={({ isActive }) =>
            isActive ? styles.ActiveCategory : styles.SubCategories
          }
        >
          Trending
        </NavLink>

        <NavLink
          to="/down"
          className={({ isActive }) =>
            isActive ? styles.ActiveCategory : styles.SubCategories
          }
        >
          Down
        </NavLink>
      </nav>
      <div className={styles.SubContainer}>
        <table className={styles.MarketTable}>
          <thead>
            <tr className={styles.MarketSubTitles}>
              <th>Coin</th>
              <th>Price</th>
              <th>24h Change</th>
              <th>High 24h</th>
              <th>Low 24h</th>
              <th>Last 7 Days</th>
              <th>Market Cap</th>
              <th>All Time High</th>
              <th>All Time Down</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {coins

              .filter((coin) => coin.price_change_percentage_24h > 0)
              .map((coin) => (
                <tr key={coin.id}>
                  <td>
                    <div className={styles.MarketTbRow}>
                      <img
                        src={coin.image}
                        alt={coin.name}
                        className={styles.CoinImg}
                      />
                      {coin.name}
                    </div>
                  </td>

                  <td>€{coin.current_price.toLocaleString()}</td>
                  <td
                    style={{
                      color: "green",
                    }}
                  >
                    {coin.price_change_percentage_24h.toFixed(2)}%
                  </td>

                  <td style={{ color: "green" }}>
                    €{coin.high_24h.toLocaleString()}
                  </td>
                  <td style={{ color: "red" }}>
                    €{coin.low_24h.toLocaleString()}
                  </td>

                  <td>
                    <Sparkline
                      data={coin.sparkline_in_7d.price}
                      isPositive={true}
                    />
                  </td>

                  <td>€{coin.market_cap.toLocaleString()}</td>

                  <td>€{coin.ath.toLocaleString()}</td>

                  <td>€{coin.atl.toLocaleString()}</td>

                  <td>
                    <button
                      onClick={() => handleAdd(coin.id)}
                      style={{
                        padding: "5px 10px",
                        cursor: "pointer",
                        backgroundColor: "#333",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                      }}
                    >
                      + Add
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Trending;
