import { useState, useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";

export default function App() {
  const [queryImage, setQueryImage] = useState(null);
  const [dbImages, setDbImages] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const modelRef = useRef(null);

  async function loadModel() {
    if (!modelRef.current) {
      modelRef.current = await mobilenet.load();
    }
    return modelRef.current;
  }

  async function getEmbedding(model, file) {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = async () => {
        const embedding = model.infer(img, true);
        const arr = await embedding.array();
        resolve(arr[0]);
      };
    });
  }

  function cosineSim(a, b) {
    let dot = 0,
      magA = 0,
      magB = 0;

    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      magA += a[i] * a[i];
      magB += b[i] * b[i];
    }

    return dot / (Math.sqrt(magA) * Math.sqrt(magB));
  }

  async function runScan() {
    if (!queryImage || dbImages.length === 0) {
      alert("Upload query + database images");
      return;
    }

    setLoading(true);

    const model = await loadModel();

    const qEmbed = await getEmbedding(model, queryImage);

    let matches = [];

    for (let img of dbImages) {
      const embed = await getEmbedding(model, img);

      const score = cosineSim(qEmbed, embed);

      const name = img.name.replace(/\.[^/.]+$/, "");

      matches.push({
        name,
        score: Number((score * 100).toFixed(1)),
        image: URL.createObjectURL(img)
      });
    }

    matches.sort((a, b) => b.score - a.score);

    const top = matches[0];

    const query = `${top.name} prototype EVT Apple device`;

    setResults([
      {
        ...top,
        links: {
          ebay: `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(query)}`,
          mercari: `https://www.mercari.com/search/?keyword=${encodeURIComponent(query)}`,
          goofish: `https://www.goofish.com/search?q=${encodeURIComponent(query)}`
        }
      }
    ]);

    setLoading(false);
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>🧠 CLIP-Style Visual Matcher</h1>

      <h3>Query Image</h3>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setQueryImage(e.target.files[0])}
      />

      <h3>Database Images</h3>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => setDbImages(Array.from(e.target.files))}
      />

      <br />
      <br />

      <button
        onClick={runScan}
        style={{
          padding: 10,
          background: "#111",
          color: "#fff",
          border: "none",
          borderRadius: 6
        }}
      >
        {loading ? "Analyzing..." : "Run CLIP Match"}
      </button>

      <div style={{ marginTop: 20 }}>
        {results.map((r, i) => (
          <div key={i} style={{ border: "1px solid #ddd", padding: 10 }}>
            <img src={r.image} width="80" />
            <h3>{r.name}</h3>
            <p>Similarity: {r.score}%</p>

            <ul>
              <li>
                <a href={r.links.ebay} target="_blank">
                  eBay
                </a>
              </li>
              <li>
                <a href={r.links.mercari} target="_blank">
                  Mercari
                </a>
              </li>
              <li>
                <a href={r.links.goofish} target="_blank">
                  Goofish
                </a>
              </li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
