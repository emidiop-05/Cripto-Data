// client/src/pages/Watchlist.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import Sparkline from "../components/Sparkline";

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

        // 1. Get the User's latest List (e.g., ['bitcoin', 'ethereum'])
        const userResponse = await axios.get(
          "http://localhost:5000/api/users/me",
          config
        );
        const myCoinIds = userResponse.data.watchlist;

        if (myCoinIds.length > 0) {
          // 2. Fetch the actual market data ONLY for those coins
          // CoinGecko allows filtering by IDs: vs_currency=usd&ids=bitcoin,ethereum
          const marketResponse = await axios.get(
            `https://api.coingecko.com/api/v3/coins/markets`,
            {
              params: {
                vs_currency: "usd",
                ids: myCoinIds.join(","), // "bitcoin,ethereum"
                sparkline: true,
              },
            }
          );
          setCoins(marketResponse.data);
        }
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    if (user) fetchWatchlist();
  }, []);

  if (loading) return <h1>Loading Watchlist...</h1>;
  if (coins.length === 0)
    return <h1>Your watchlist is empty! Go add some coins.</h1>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>My Watchlist</h1>
      <table>
        <thead>
          <tr>
            <th>Coin</th>
            <th>Price</th>
            <th>24h Change</th>
            <th>7 Day Trend</th>
          </tr>
        </thead>
        <tbody>
          {coins.map((coin) => (
            <tr key={coin.id}>
              <td
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <img src={coin.image} alt={coin.name} width="25" />
                {coin.name}
              </td>
              <td>${coin.current_price.toLocaleString()}</td>
              <td
                style={{
                  color: coin.price_change_percentage_24h > 0 ? "green" : "red",
                }}
              >
                {coin.price_change_percentage_24h.toFixed(2)}%
              </td>
              <td>
                <Sparkline
                  data={coin.sparkline_in_7d.price}
                  isPositive={coin.price_change_percentage_24h > 0}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Watchlist;
