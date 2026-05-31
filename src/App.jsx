import { useState } from "react";

/**
 * ----------------------------
 * IMAGE MATCHING (pHash-lite)
 * ----------------------------
 */

function getImageData(file) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = 8;
      canvas.height = 8;

      ctx.drawImage(img, 0, 0, 8, 8);

      const data = ctx.getImageData(0, 0, 8, 8).data;

      let gray = [];

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        gray.push((r + g + b) / 3);
      }

      resolve(gray);
    };
  });
}

function buildHash(gray) {
  const avg = gray.reduce((a, b) => a + b, 0) / gray.length;
  return gray.map((v) => (v > avg ? 1 : 0)).join("");
}

function hammingDistance(a, b) {
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) diff++;
  }
  return diff;
}

function similarity(a, b) {
  const dist = hammingDistance(a, b);
  return Math.max(0, 100 - dist * 2.5);
}

export default function App() {
  const [queryImage, setQueryImage] = useState(null);
  const [dbImages, setDbImages] = useState([]);
  const [results, setResults] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  function handleQuery(e) {
    setQueryImage(e.target.files[0]);
  }

  function handleDb(e) {
    setDbImages(Array.from(e.target.files));
  }

  async function runMatch() {
    if (!queryImage || dbImages.length === 0) {
      alert("Upload query image + database images first");
      return;
    }

    setLoading(true);

    const queryGray = await getImageData(queryImage);
    const queryHash = buildHash(queryGray);

    let matches = [];

    for (let img of dbImages) {
      const gray = await getImageData(img);
      const hash = buildHash(gray);

      const score = similarity(queryHash, hash);

      const rawName = img.name.replace(/\.[^/.]+$/, "");

      // clean collector search term
      const searchQuery =
        rawName.replace(/IMG|DSC|photo|image|screenshot/gi, "").trim() +
        " prototype EVT Apple device";

      matches.push({
        name: rawName,
        score: Number(score.toFixed(1)),
        preview: URL.createObjectURL(img),

        // marketplace search engines (NO APIs)
        listings: {
          ebay: `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(searchQuery)}`,
          mercari: `https://www.mercari.com/search/?keyword=${encodeURIComponent(searchQuery)}`,
          goofish: `https://www.goofish.com/search?q=${encodeURIComponent(searchQuery)}`
        }
      });
    }

    matches.sort((a, b) => b.score - a.score);

    const top5 = matches.slice(0, 5);

    setResults(top5);
    setHistory((h) => [top5[0], ...h].slice(0, 10));

    setLoading(false);
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial", background: "#f5f5f5" }}>
      <h1>🧠 Pro Collector Search Engine</h1>

      <p>Match prototypes + explore marketplace listings instantly</p>

      {/* INPUTS */}
      <div style={{ marginTop: 20 }}>
        <h3>Query Image</h3>
        <input type="file" accept="image/*" onChange={handleQuery} />
      </div>

      <div style={{ marginTop: 20 }}>
        <h3>Database Images</h3>
        <input type="file" accept="image/*" multiple onChange={handleDb} />
      </div>

      <button
        onClick={runMatch}
        style={{
          marginTop: 20,
          padding: "10px 15px",
          cursor: "pointer",
          background: "#111",
          color: "#fff",
          border: "none",
          borderRadius: 6
        }}
      >
        {loading ? "Scanning..." : "Run Collector Scan"}
      </button>

      {/* RESULTS */}
      {results.length > 0 && (
        <div style={{ marginTop: 30 }}>
          <h2>Potential Matches</h2>

          {results.map((r, i) => (
            <div
              key={i}
              style={{
                background: "#fff",
                padding: 15,
                marginBottom: 15,
                borderRadius: 10,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
              }}
            >
              {/* HEADER */}
              <div style={{ display: "flex", gap: 12 }}>
                <img
                  src={r.preview}
                  alt={r.name}
                  style={{
                    width: 70,
                    height: 70,
                    objectFit: "cover",
                    borderRadius: 8,
                    border: "1px solid #ddd"
                  }}
                />

                <div>
                  <h3 style={{ margin: 0 }}>
                    #{i + 1} {r.name}
                  </h3>

                  <p style={{ margin: 0 }}>
                    Match Score: {r.score}%
                  </p>
                </div>
              </div>

              {/* BAR */}
              <div
                style={{
                  height: 10,
                  background: "#eee",
                  borderRadius: 5,
                  overflow: "hidden",
                  marginTop: 10
                }}
              >
                <div
                  style={{
                    width: `${r.score}%`,
                    height: "100%",
                    background:
                      r.score > 70 ? "green" : r.score > 40 ? "orange" : "red"
                  }}
                />
              </div>

              {/* LISTINGS */}
              <div style={{ marginTop: 10 }}>
                <b>Find Listings:</b>
                <ul>
                  <li>
                    <a href={r.listings.ebay} target="_blank">
                      eBay Listings
                    </a>
                  </li>
                  <li>
                    <a href={r.listings.mercari} target="_blank">
                      Mercari Listings
                    </a>
                  </li>
                  <li>
                    <a href={r.listings.goofish} target="_blank">
                      Goofish Listings
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* HISTORY */}
      {history.length > 0 && (
        <div style={{ marginTop: 40 }}>
          <h2>Recent Searches</h2>

          {history.map((h, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                marginBottom: 6
              }}
            >
              <img
                src={h.preview}
                alt=""
                style={{
                  width: 25,
                  height: 25,
                  borderRadius: 4,
                  objectFit: "cover"
                }}
              />

              <span>
                {h.name} ({h.score}%)
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
