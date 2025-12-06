import { useState, useEffect } from "react";
import axios from "axios";
import Sparkline from "../components/Sparkline";
import styles from "../pages/Home.module.css";

const Home = () => {
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
    <div style={{ padding: "20px" }}>
      <h1>Crypto Dashboard</h1>

      <table>
        <thead>
          <tr>
            <th>Coin</th>
            <th>Price</th>
            <th>24h Change</th>
            <th>Last 7 Days</th>
            <th>Action</th>
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
  );
};

export default Home;
