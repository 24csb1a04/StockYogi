import "./Errorbar.css";

export default function Errorbar({ message }) {
  if (!message) return null;

  return (
    <div className="error-box">
      ⚠️ {message}
    </div>
  );
}
