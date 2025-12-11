import { useState, useEffect } from "react";
import axios from "axios";
import Sparkline from "../components/Sparkline";
import styles from "../pages/Home.module.css";
import AnimatedPage from "../components/AnimatedPage";

const formatCurrency = (value) => {
  if (value === null || value === undefined) {
    return "-";
  }
  return `€${value.toLocaleString()}`;
};

const Watchlist = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${user.token}` },
        };

        const userResponse = await axios.get(
          "http://localhost:5000/api/users/me",
          config
        );
        const myCoinIds = userResponse.data.watchlist;

        if (myCoinIds.length > 0) {
          const marketResponse = await axios.get(
            `https://api.coingecko.com/api/v3/coins/markets`,
            {
              params: {
                vs_currency: "eur",
                ids: myCoinIds.join(","),
                sparkline: true,
              },
            }
          );
          setCoins(marketResponse.data);
        } else {
          setCoins([]);
        }
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    if (user) fetchWatchlist();
  }, []);

  const handleRemove = async (coinId) => {
    if (!confirm("Remove this coin from your watchlist?")) return;

    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
        data: { coinId },
      };

      await axios.delete("http://localhost:5000/api/users/watchlist", config);

      setCoins((current) => current.filter((c) => c.id !== coinId));
    } catch (error) {
      console.error("Error removing coin:", error);
      alert("Could not remove coin. Try again.");
    }
  };

  if (loading)
    return (
      <h2 style={{ textAlign: "center", color: "white", padding: "20px" }}>
        Loading Watchlist...
      </h2>
    );

  if (!user)
    return (
      <h2 style={{ textAlign: "center", color: "white", padding: "20px" }}>
        Please log in to view your watchlist.
      </h2>
    );

  return (
    <AnimatedPage>
      <div className={styles.MarketContainer}>
        <h1 className={styles.MarketTitle}>My Watchlist</h1>

        <div className={styles.SubContainer}>
          {coins.length === 0 ? (
            <h2
              style={{
                textAlign: "center",
                padding: "2rem",
                fontFamily: "Space Grotesk",
              }}
            >
              Your watchlist is empty. Go add some coins!
            </h2>
          ) : (
            <div className={styles.TableWrapper}>
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
                  {coins.map((coin) => (
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

                      <td
                        style={{
                          color:
                            (coin.price_change_percentage_24h || 0) > 0
                              ? "green"
                              : "red",
                        }}
                      >
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
                          isPositive={
                            (coin.price_change_percentage_24h || 0) > 0
                          }
                        />
                      </td>

                      <td>{formatCurrency(coin.market_cap)}</td>
                      <td>{formatCurrency(coin.ath)}</td>
                      <td>{formatCurrency(coin.atl)}</td>

                      <td>
                        <button
                          onClick={() => handleRemove(coin.id)}
                          style={{
                            padding: "5px 10px",
                            cursor: "pointer",
                            backgroundColor: "#db0303",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            fontWeight: "bold",
                          }}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AnimatedPage>
  );
};

export default Watchlist;
