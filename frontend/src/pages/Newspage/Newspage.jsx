import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar/Navbar.jsx";
import NewsCard from "../../components/Newscard/Newscard.jsx";
import LoadingSpinner from "../../components/Loadspinner/Loadspinner.jsx";
import Errorbar from "../../components/Errorbar/Errorbar.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import "./newsPage.css";

export default function Newspage() {
  const [headlines, setHeadlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState("");
  const [error, setError] = useState("");

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/news/news", {
        withCredentials: true,
      });

      setSource(res.data.source);
      setHeadlines(res.data.message || res.data.meesage);
    } catch (err) {
      setError("Unable to fetch latest market news.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <>
      <Navbar />

      <div className="news-container">
        <h1 className="news-title">Market News</h1>
        <p className="news-subtitle">
          Stay updated with the latest headlines from top financial sources.
        </p>

        {source && (
          <div className="news-source">
            Source: <span>{source}</span>
          </div>
        )}

        {error && <Errorbar message={error} />}
        {loading && <LoadingSpinner />}

        {!loading && !error && (
          <div className="news-grid">
            {headlines.map((obj, index) => (
              <NewsCard key={index} title={obj.title} subtitle={obj.subtitle} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
