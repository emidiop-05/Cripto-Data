import { useState, useEffect } from "react";
import axios from "axios";
import Sparkline from "../components/Sparkline";
import styles from "../pages/Home.module.css";
import { NavLink } from "react-router-dom";

const formatCurrency = (value) => {
  if (value === null || value === undefined) {
    return "-";
  }
  return `€${value.toLocaleString()}`;
};

const Trending = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/crypto?page=${page}`
        );
        setCoins(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error connecting to server:", err);
        setError("Could not fetch data. Is the server running?");
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

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
        {loading ? (
          <h2 style={{ textAlign: "center", color: "white", padding: "20px" }}>
            Loading Page {page}...
          </h2>
        ) : (
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
            <tbody className={styles.TableBody}>
              {coins
                .filter((coin) => (coin.price_change_percentage_24h || 0) > 0)
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

                    <td>{formatCurrency(coin.current_price)}</td>

                    <td style={{ color: "green" }}>
                      {coin.price_change_percentage_24h?.toFixed(2) ?? "-"}%
                    </td>

                    <td style={{ color: "green" }}>
                      {formatCurrency(coin.high_24h)}
                    </td>
                    <td style={{ color: "red" }}>
                      {formatCurrency(coin.low_24h)}
                    </td>

                    <td>
                      <Sparkline
                        data={coin.sparkline_in_7d?.price || []}
                        isPositive={true}
                      />
                    </td>

                    <td>{formatCurrency(coin.market_cap)}</td>
                    <td>{formatCurrency(coin.ath)}</td>
                    <td>{formatCurrency(coin.atl)}</td>

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
        )}
      </div>

      <div className={styles.PageBtnContainer}>
        <button
          className={styles.PreviousBtn}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span
          style={{
            alignSelf: "center",
            color: "#3f3f3f",
            fontWeight: "bold",
            fontFamily: "inter",
          }}
        >
          Page {page}
        </span>
        <button
          className={styles.NextBtn}
          onClick={() => setPage((prev) => prev + 1)}
          style={{ padding: "10px 20px", cursor: "pointer" }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Trending;
