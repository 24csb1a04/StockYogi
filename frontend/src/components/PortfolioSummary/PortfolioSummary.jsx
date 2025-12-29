export default function PortfolioSummary({ totalValue, gainLoss }) {
  const isPositive = gainLoss >= 0;

  return (
    <div className="portfolio-summary">
      <div>
        <h2>Total Value</h2>
        <p>₹ {totalValue.toFixed(2)}</p>
      </div>
      <div>
        <h2>Today's Gain/Loss</h2>
        <p style={{ color: isPositive ? "green" : "red" }}>
          ₹ {gainLoss.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
