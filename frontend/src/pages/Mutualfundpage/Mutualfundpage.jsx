import { useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar/Navbar.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import LoadingSpinner from "../../components/Loadspinner/Loadspinner.jsx";
import Errorbar from "../../components/Errorbar/Errorbar.jsx";
import "./Mutualfundpage.css";

export default function Mutualfundpage() {
  const [symbol, setSymbol] = useState("");
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchStock = async (e) => {
    e.preventDefault();
    if (!symbol.trim()) {
      setError("Please enter a valid stock symbol.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setStockData(null);

      const res = await axios.get(
        `http://<backend_endpoint>/api/stocks/mutualfund/${symbol}`,
        { withCredentials: true }
      );

      setStockData(res.data);
    } catch (err) {
      setError("Failed to fetch stock price. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="stocks-container">
        <h1 className="stocks-title">Live Stock Price Checker</h1>
        <p className="stocks-subtitle">
          Enter your mutual fund code
        </p>

        <form className="stock-form" onSubmit={fetchStock}>
          <input
            type="text"
            placeholder="Enter mutual fund code..."
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            className="stock-input"
          />
          <button className="stock-btn" type="submit">
            Search
          </button>
        </form>

        {loading && <LoadingSpinner />}
        {error && <Errorbar message={error} />}

        {!loading && stockData && (
          <div className="stock-result-card">
            <h2 className="stock-company">{stockData.scheme_name}</h2>

            <div className="stock-price-box">
              <span className="price-label">Live Nav:</span>
              <span className="price-value">{stockData.fundnav}</span>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}

