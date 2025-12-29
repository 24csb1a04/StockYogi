import { useState } from "react";
import axios from "axios";

import Navbar from "../../components/Navbar/Navbar.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import LoadingSpinner from "../../components/Loadspinner/Loadspinner.jsx";
import Errorbar from "../../components/Errorbar/Errorbar.jsx";

import "./FundAlloc.css";

export default function FundAlloc() {
  const [targetReturn, setTargetReturn] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAllocation = async (e) => {
    e.preventDefault();

    if (!targetReturn) {
      setError("Please enter a valid minimum annual return.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const res = await axios.get(
        "http://localhost:5000/api/stocks/fundalloc",
        {
          params: { x: targetReturn },
        }
      );

      setResult(res.data);
    } catch (err) {
      setError("Unable to compute optimal portfolio.");
    } finally {
      setLoading(false);
    }
  };

  const years = [
    "2014","2015","2016","2017","2018",
    "2019","2020","2021","2022","2023"
  ];

  return (
    <>
      <Navbar />

      <div className="fundalloc-container">
        <h1 className="fundalloc-title">AI Mutual Fund Allocator</h1>
        <p className="fundalloc-subtitle">
          Enter your minimum expected annual return (%) and let AI generate an
          optimal mutual fund portfolio.
        </p>

        <form className="fundalloc-form" onSubmit={fetchAllocation}>
          <input
            type="number"
            step="0.1"
            placeholder="Minimum annual return (e.g. 12)"
            value={targetReturn}
            onChange={(e) => setTargetReturn(e.target.value)}
            className="fundalloc-input"
          />
          <button type="submit" className="fundalloc-btn">
            Optimize Portfolio
          </button>
        </form>

        {loading && <LoadingSpinner />}
        {error && <Errorbar message={error} />}

        {!loading && result && (
          <>
            {result.funds.length === 0 ? (
              <div className="no-solution">
                No feasible portfolio found for the given return expectation.
              </div>
            ) : (
              <div className="allocation-card">
                <h2>Optimized Portfolio Allocation</h2>

                {/* Fund + Allocation Table */}
                <table className="allocation-table">
                  <thead>
                    <tr>
                      <th>Fund</th>
                      <th>Allocation (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.funds.map((fund, i) => (
                      <tr key={i}>
                        <td>{fund}</td>
                        <td>{result.allocations[i]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Year-wise Returns Table */}
                <h3 className="returns-title">Year-wise Portfolio Returns</h3>

                <table className="returns-table">
                  <thead>
                    <tr>
                      <th>Year</th>
                      <th>Return (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {years.map((year, i) => (
                      <tr key={year}>
                        <td>{year}</td>
                        <td>{result.returns[i]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Average Return */}
                <div className="portfolio-summary">
                  <strong>Average Annual Return (2014–2023):</strong>{" "}
                  <span>{result.ans}%</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </>
  );
}
