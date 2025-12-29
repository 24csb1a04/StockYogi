import axios from "axios";
import { useState } from "react";

export default function StockRow({ stock, refresh }) {
  const [hover, setHover] = useState(false);

  const removeStock = async () => {
    await axios.post(
      "http://localhost:5000/api/portfolio/remove",
      { symbol: stock.symbol, quantity: stock.quantity },
      { withCredentials: true }
    );
    refresh();
  };

  return (
    <div
      className="stock-row"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div>{stock.symbol}</div>
      <div>{stock.quantity}</div>
      <div>₹ {stock.currentPrice}</div>

      {hover && (
        <div className="stock-actions">
          <button onClick={removeStock}>Remove</button>
        </div>
      )}
    </div>
  );
}
