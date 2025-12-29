import { useEffect, useState } from "react";
import axios from "axios";

import Navbar from "../../components/Navbar/Navbar.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import LoadingSpinner from "../../components/Loadspinner/Loadspinner.jsx";
import Errorbar from "../../components/Errorbar/Errorbar.jsx";
import IndexCard from "../../components/IndexCard/IndexCard.jsx";

import "./Dashboard.css";

export default function Dashboard() {
  const [indices, setIndices] = useState([]);
  const [start, setStart] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchIndexData = async () => {
    try {
      setLoading(true);

      const names = [
        "NIFTY50",
        "SENSEX",
        "NIFTYBANK",
        "NIFTYMIDCAP"
      ];

      const requests = names.map((name) =>
        axios.get(`<backend_endpoint>/api/stocks/index/${name}`, {
          withCredentials: true,
        })
      );

      const responses = await Promise.all(requests);
      setIndices(responses.map((r) => r.data));

    } catch (err) {
      setError("Failed to fetch index prices.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIndexData();
  }, []);

  const next = () => {
    if (start + 2 < indices.length) setStart(start + 1);
  };

  const prev = () => {
    if (start > 0) setStart(start - 1);
  };

  return (
    <>
      <Navbar />

      <div className="dashboard-container">
        <h1 className="dashboard-title">Market Dashboard</h1>
        <p className="dashboard-subtitle">
          Live snapshot of key Indian market indices
        </p>

        {error && <Errorbar message={error} />}
        {loading && <LoadingSpinner />}

        {!loading && !error && (
          <div className="index-slider">
            <button onClick={prev} disabled={start === 0}>
              ←
            </button>

            <div className="index-grid">
              {indices.slice(start, start + 2).map((idx, i) => (
                <IndexCard
                  key={i}
                  name={idx.company}
                  price={idx.data}
                  source={idx.source}
                />
              ))}
            </div>

            <button
              onClick={next}
              disabled={start + 2 >= indices.length}
            >
              →
            </button>
          </div>
        )}

        <div className="auth-cta">
          <p>Sign in to track your portfolio and get AI insights</p>
          <div className="auth-buttons">
            <a href="/login" className="btn primary">Login</a>
            <a href="/signup" className="btn secondary">Signup</a>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

