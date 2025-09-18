import React, { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const API_URL = process.env.REACT_APP_API_URL;
    fetch(`${API_URL}/hello`)
      .then((res) => res.text())
      .then((data) => setMessage(data))
      .catch((err) => console.error("API call failed:", err));
  }, []);

  return (
    <div>
      <h1>Frontend Hello World</h1>
      <p>Backend says: {message}</p>
    </div>
  );
}

export default App;

