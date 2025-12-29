import { useState } from "react";
import axios from "axios";

export default function AddStockModal({ close, refresh }) {
  const [form, setForm] = useState({
    symbol: "",
    quantity: "",
    buyValue: "",
    assettype: "stock",
  });

  const submit = async () => {
    await axios.post(
      "http://localhost:5000/api/portfolio/add",
      form,
      { withCredentials: true }
    );
    refresh();
    close();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Add Stock</h2>

        <input placeholder="Symbol" onChange={e => setForm({ ...form, symbol: e.target.value })} />
        <input type="number" placeholder="Quantity" onChange={e => setForm({ ...form, quantity: e.target.value })} />
        <input type="number" placeholder="Buy Price" onChange={e => setForm({ ...form, buyValue: e.target.value })} />

        <div className="modal-actions">
          <button onClick={submit}>Add</button>
          <button onClick={close}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
