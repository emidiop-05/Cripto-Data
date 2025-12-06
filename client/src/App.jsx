import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

import Sparkline from "./components/Sparkline";

function App() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <h1>Loading Market Data...</h1>;
  if (error) return <h1 style={{ color: "red" }}>{error}</h1>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Crypto Dashboard</h1>

      <table>
        <thead>
          <tr>
            <th>Coin</th>
            <th>Price</th>
            <th>24h Change</th>
            <th>Last 7 Days</th>
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
}

export default App;
