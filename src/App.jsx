import { useState } from "react";
import "./App.css";
import marketplaceIndex from "../output-index.json";

export default function App() {
  const [queryImage, setQueryImage] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  function scoreMatch(filename, queryName) {
    const q = queryName.toLowerCase();

    let score = 0;

    if (
      filename.toLowerCase().includes("ebay")
    )
      score += 15;

    if (
      filename.toLowerCase().includes("prototype")
    )
      score += 20;

    const words = q.split(" ");

    words.forEach(word => {
      if (
        filename
          .toLowerCase()
          .includes(word)
      ) {
        score += 10;
      }
    });

    return score;
  }

  function handleFileUpload(e) {
    const file = e.target.files[0];

    if (!file) return;

    setQueryImage(URL.createObjectURL(file));
  }

  async function runMatch() {
    if (!queryImage) return;

    setLoading(true);

    const fileName =
      document.querySelector(
        'input[type="file"]'
      ).files[0].name || "";

    const ranked = marketplaceIndex
      .map(item => ({
        ...item,
        score: scoreMatch(
          item.file,
          fileName
        )
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);

    setResults(ranked);
    setLoading(false);
  }

  return (
    <div className="app">
      <h1>
        Prototype Marketplace Scanner
      </h1>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
      />

      <button onClick={runMatch}>
        Run AI Match
      </button>

      {queryImage && (
        <div style={{ marginTop: 20 }}>
          <h3>Query Image</h3>
          <img
            src={queryImage}
            alt="query"
            style={{
              width: 220,
              borderRadius: 12
            }}
          />
        </div>
      )}

      {loading && (
        <p>Scanning marketplace...</p>
      )}

      <div
        style={{
          marginTop: 30,
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill,minmax(220px,1fr))",
          gap: 20
        }}
      >
        {results.map((item, i) => (
          <div
            key={i}
            style={{
              border:
                "1px solid #333",
              borderRadius: 12,
              padding: 12
            }}
          >
            <img
              src={`/dataset/${item.file}`}
              alt={item.title}
              style={{
                width: "100%",
                borderRadius: 10
              }}
            />

            <h4>{item.title}</h4>

            <p>
              Match Score:{" "}
              {item.score}
            </p>

            <a
              href={item.url}
              target="_blank"
            >
              Open Listing
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
