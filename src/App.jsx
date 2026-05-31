import { useState } from "react";

function buildQuery(fileName) {
  return (
    fileName
      .replace(/\.[^/.]+$/, "")
      .replace(/IMG|DSC|photo|image|Screenshot|capture/gi, "")
      .trim() + " prototype EVT Apple device"
  );
}

export default function App() {
  const [image, setImage] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleImage(e) {
    setImage(e.target.files[0]);
    setResults([]);
    setError("");
  }

  async function runScan() {
    if (!image) {
      alert("Upload image first");
      return;
    }

    setLoading(true);
    setError("");
    setResults([]);

    try {
      const query = buildQuery(image.name);

      console.log("QUERY:", query);

      const res = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ query })
      });

      console.log("STATUS:", res.status);

      const text = await res.text();
      console.log("RAW RESPONSE:", text);

      if (!res.ok) {
        throw new Error(`Server error ${res.status}`);
      }

      const data = JSON.parse(text);

      if (!data.results) {
        throw new Error("No results returned from backend");
      }

      setResults(data.results);
    } catch (err) {
      console.error(err);
      setError("Backend failed or returned invalid data.");
    }

    setLoading(false);
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial", background: "#f5f5f5" }}>
      <h1>🧠 Prototype Marketplace Scanner</h1>

      <p>Upload one image → scan marketplace listings</p>

      <input type="file" accept="image/*" onChange={handleImage} />

      <br />
      <br />

      <button
        onClick={runScan}
        style={{
          padding: "10px 15px",
          background: "#111",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          cursor: "pointer"
        }}
      >
        {loading ? "Scanning..." : "Scan Listings"}
      </button>

      {/* ERROR DISPLAY */}
      {error && (
        <p style={{ color: "red", marginTop: 10 }}>
          {error}
        </p>
      )}

      {/* RESULTS */}
      <div style={{ marginTop: 20 }}>
        {results.map((r, i) => (
          <div
            key={i}
            style={{
              background: "#fff",
              padding: 10,
              marginBottom: 10,
              borderRadius: 8,
              border: "1px solid #ddd"
            }}
          >
            {r.image && (
              <img
                src={r.image}
                width="80"
                style={{ borderRadius: 6 }}
              />
            )}

            <h3>{r.title}</h3>

            {r.price && <p>{r.price}</p>}

            <a href={r.url} target="_blank" rel="noreferrer">
              View Listing
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
