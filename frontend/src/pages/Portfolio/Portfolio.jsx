import { useEffect, useState } from "react";
import axios from "axios";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import LoadingSpinner from "../../components/Loadspinner/Loadspinner";
import Errorbar from "../../components/Errorbar/Errorbar";
import PortfolioSummary from "../../components/PortfolioSummary/PortfolioSummary";
import StockRow from "../../components/StockRow/StockRow";
import AddStockModal from "../../components/AddStockModal/AddStockModal";

import "./Portfolio.css";

export default function Portfolio() {
  const [holdings, setHoldings] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [gainLoss, setGainLoss] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);

      const [valueRes, gainRes, holdingsRes] = await Promise.all([
        axios.get("<backend_endpoint>/api/portfolio/value", { withCredentials: true }),
        axios.get("<backend_endpoint>/api/portfolio/gain", { withCredentials: true }),
        axios.get("<backend_endpoint>/api/portfolio/all", { withCredentials: true }),
      ]);

      setTotalValue(valueRes.data.data);
      setGainLoss(gainRes.data.totalGain);
      setHoldings(holdingsRes.data.holdings);

    } catch (err) {
      if (err.response?.status === 404) {
        setError("Please login to view your portfolio.");
      } else {
        setError("Unable to load portfolio.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  return (
    <>
      <Navbar />

      <div className="portfolio-container">
        <h1>My Portfolio</h1>

        {error && <Errorbar message={error} />}
        {loading && <LoadingSpinner />}

        {!loading && !error && (
          <>
            <PortfolioSummary
              totalValue={totalValue}
              gainLoss={gainLoss}
            />

            {holdings.length === 0 ? (
              <div className="empty-portfolio">
                <p>Your portfolio is empty.</p>
                <button onClick={() => setShowAdd(true)}>
                  Add Stock
                </button>
              </div>
            ) : (
              <>
                <div className="portfolio-table">
                  {holdings.map((stock, i) => (
                    <StockRow
                      key={i}
                      stock={stock}
                      refresh={fetchPortfolio}
                    />
                  ))}
                </div>

                <button
                  className="add-stock-btn"
                  onClick={() => setShowAdd(true)}
                >
                  + Add Stock
                </button>
              </>
            )}
          </>
        )}
      </div>

      {showAdd && (
        <AddStockModal
          close={() => setShowAdd(false)}
          refresh={fetchPortfolio}
        />
      )}

      <Footer />
    </>
  );
}

