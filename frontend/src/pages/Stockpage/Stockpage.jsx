import { useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import Navbar from "../../components/Navbar/Navbar.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import LoadingSpinner from "../../components/Loadspinner/Loadspinner.jsx";
import Errorbar from "../../components/Errorbar/Errorbar.jsx";
import "./Stockpage.css";

export default function Stockpage() {
  const [symbol, setSymbol] = useState("");
  const [stockData, setStockData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chartLoading, setChartLoading] = useState(false);
  const [error, setError] = useState("");

  const [showChart, setShowChart] = useState(false);
  const [period, setPeriod] = useState("1mo");
  const [interval, setInterval] = useState("1d");
  const [chartType, setChartType] = useState("line");

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
      setShowChart(false);

      const res = await axios.get(
        `http://localhost:5000/api/stocks/stocks/${symbol}`,
        { withCredentials: true }
      );

      setStockData(res.data);
    } catch (err) {
      setError("Failed to fetch stock price. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchChartData = async () => {
    try {
      setChartLoading(true);
      const sym = `${symbol}.NS`
      const res = await axios.get(
        `http://localhost:5000/api/stocks/history/`,
        {
          params: { sym ,period, interval },
          withCredentials: true,
        }
      );

      setChartData(res.data.data);
      setShowChart(true);
    } catch (err) {
      setError("Failed to load chart data.");
    } finally {
      setChartLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="stocks-container">
        <h1 className="stocks-title">Live Stock Price Checker</h1>

        <form className="stock-form" onSubmit={fetchStock}>
          <input
            type="text"
            placeholder="Enter stock symbol..."
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
            <p className="stock-source">
              Source: <span>{stockData.source}</span>
            </p>

            <h2 className="stock-company">{stockData.company}</h2>

            <div className="stock-price-box">
              <span className="price-label">Live Price:</span>
              <span className="price-value">{stockData.data}</span>
            </div>

            <button className="chart-btn" onClick={fetchChartData}>
              View Chart
            </button>
          </div>
        )}

        {/* Chart Controls */}
        {showChart && (
          <div className="chart-controls">
            <select value={period} onChange={(e) => setPeriod(e.target.value)}>
              <option value="1mo">1 Month</option>
              <option value="3mo">3 Months</option>
              <option value="6mo">6 Months</option>
              <option value="1y">1 Year</option>
            </select>

            <select
              value={interval}
              onChange={(e) => setInterval(e.target.value)}
            >
              <option value="1d">1 Day</option>
              <option value="1wk">1 Week</option>
            </select>

            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
            >
              <option value="line">Line</option>
              <option value="candlestick">Candlestick</option>
            </select>

            <button onClick={fetchChartData}>Apply</button>
          </div>
        )}

        {/* Chart */}
        {chartLoading && <LoadingSpinner />}

        {!chartLoading && chartData.length > 0 && chartType === "line" && (
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="close"
                  stroke="#2563eb"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {chartType === "candlestick" && (
          <p className="chart-note">
            Candlestick chart support can be added using ApexCharts or
            Lightweight Charts.
          </p>
        )}
      </div>

      <Footer />
    </>
  );
}
