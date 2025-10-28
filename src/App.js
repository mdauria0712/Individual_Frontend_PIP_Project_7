import { useState, useEffect } from "react";

function App() {
  const [category, setCategory] = useState("Programming");
  const [joke, setJoke] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(null);
  const [ratings, setRatings] = useState([]); // store all ratings

  const fetchJoke = async (chosenCategory = category) => {
    try {
      setLoading(true);
      setError(null);
      setRating(null); // reset rating on new joke
      const res = await fetch(
        `https://v2.jokeapi.dev/joke/${chosenCategory}?safe-mode`
      );
      if (!res.ok) throw new Error("Network error");
      const data = await res.json();
      const formatted =
        data.type === "single"
          ? data.joke
          : `${data.setup}\n${data.delivery}`;
      setJoke(formatted);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJoke(category);
  }, [category]);

  // handle rating and store it
  const handleRating = (value) => {
    setRating(value);
    setRatings((prev) => [...prev, value]);
  };

  // calculate average rating
  const averageRating =
    ratings.length > 0
      ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
      : null;

  return (
    <main
      style={{
        fontFamily: "system-ui, sans-serif",
        textAlign: "center",
        padding: "2rem",
        background: "#f7f8fa",
        minHeight: "100vh",
      }}
    >
      <h1>Topic-Based Joke Generator</h1>
      <p style={{ color: "#666" }}>Pick a topic and get a safe, funny joke!</p>

      {/* Dropdown for topic */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={{
          padding: "0.5rem",
          borderRadius: "8px",
          border: "1px solid #ccc",
          marginBottom: "1rem",
        }}
      >
        <option value="Programming">Programming</option>
        <option value="Misc">Miscellaneous</option>
        <option value="Pun">Pun</option>
        <option value="Spooky">Spooky</option>
        <option value="Christmas">Christmas</option>
      </select>

      {/* Joke display */}
      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          border: "1px solid #ddd",
          padding: "1rem",
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        {loading && <p>Loading joke...</p>}
        {error && <p style={{ color: "red" }}>Error: {error}</p>}
        {!loading && !error && (
          <pre
            style={{
              fontSize: "1.25rem",
              whiteSpace: "pre-line",
              minHeight: "4rem",
            }}
          >
            {joke}
          </pre>
        )}
      </div>

      {/* New joke button */}
      <button
        onClick={() => fetchJoke()}
        style={{
          marginTop: "1.5rem",
          padding: "0.75rem 1.25rem",
          border: "none",
          background: "#007bff",
          color: "#fff",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "1rem",
        }}
      >
        Get Another Joke
      </button>

      {/* Rating section */}
      {!loading && joke && (
        <section style={{ marginTop: "1.5rem" }}>
          <h3>Rate this joke:</h3>
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              onClick={() => handleRating(num)}
              style={{
                margin: "0.25rem",
                padding: "0.5rem 0.75rem",
                fontSize: "1rem",
                borderRadius: "6px",
                border: rating === num ? "2px solid #007bff" : "1px solid #ccc",
                background: rating === num ? "#e7f1ff" : "#fff",
                cursor: "pointer",
              }}
            >
              {num}
            </button>
          ))}
          {rating && (
            <p style={{ marginTop: "0.5rem", color: "#333" }}>
              You rated this joke: <strong>{rating}/5</strong>
            </p>
          )}
        </section>
      )}

      {/* Display average rating */}
      {averageRating && (
        <p style={{ marginTop: "1rem", color: "#555" }}>
          Average rating across all jokes: <strong>{averageRating}/5</strong>
        </p>
      )}
    </main>
  );
}

export default App;
