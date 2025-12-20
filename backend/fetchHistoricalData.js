import axios from "axios";

const fetchHistoricalData = async function (
  sym,
  period = "1mo",
  interval = "1d"
) {
  try {
    const endpoint = "http://127.0.0.1:8000/historical";

    const response = await axios.get(endpoint, {
      params: {
        symbol: sym,
        period,
        interval,
      },
      timeout: 10000,
    });

    return response.data;

  } catch (err) {
    console.error("Error fetching historical data:", err.message);
    return null;
  }
};

export default fetchHistoricalData;
