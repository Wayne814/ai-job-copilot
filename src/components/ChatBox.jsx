import { useState } from "react";
import axios from "axios";
import styles from "./ChatBox.module.css";

export default function ChatBox() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = async () => {
    if (!message.trim()) return;
    
    setLoading(true);
    setError(null);
    setResponse("");

    try {
      const res = await axios.post("http://localhost:8000/chat", { message });
      setResponse(res.data.response);
      setMessage("");
    } catch (err) {
      setError("Failed to get response. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>AI Job Assistant</h1>
      
      <div className={styles.inputGroup}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe your job goal or resume topic..."
          rows="3"
        />
        <button 
          onClick={sendMessage} 
          disabled={loading}
          className={loading ? styles.loading : styles.sendBtn}
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>

      {error && <p className={styles.error}>{error}</p>}
      
      {response && (
        <div className={styles.response}>
          <h3>Response:</h3>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}