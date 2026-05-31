import { useState, useRef } from "react";
import * as mobilenet from "@tensorflow-models/mobilenet";
import "@tensorflow/tfjs";

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

  async function embed(model, file) {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = async () => {
        const tensor = model.infer(img, true);
        const arr = await tensor.array();
        resolve(arr[0]);
      };
    });
  }

  function cosine(a, b) {
    let dot = 0, magA = 0, magB = 0;

    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      magA += a[i] * a[i];
      magB += b[i] * b[i];
    }

    return dot / (Math.sqrt(magA) * Math.sqrt(magB));
  }

  async function runScan() {
    if (!queryImage || dbImages.length === 0) {
      alert("Upload query + dataset images");
      return;
    }

    setLoading(true);

    const model = await loadModel();

    const qVec = await embed(model, queryImage);

    let matches = [];

    for (let file of dbImages) {
      const vec = await embed(model, file);

      const score = cosine(qVec, vec);

      const name = file.name.replace(/\.[^/.]+$/, "");

      matches.push({
        name,
        score: Math.round(score * 100),
        image: URL.createObjectURL(file)
      });
    }

    matches.sort((a, b) => b.score - a.score);

    const top = matches.slice(0, 5);

    const best = top[0];

    const query = `${best.name} prototype apple device EVT teardown`;

    setResults(
      top.map((r) => ({
        ...r,
        links: {
          ebay: `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(query)}`,
          mercari: `https://www.mercari.com/search/?keyword=${encodeURIComponent(query)}`
        }
      }))
    );

    setLoading(false);
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>🧠 AI Vision Engine (CLIP-style)</h1>

      <h3>Query Image</h3>
      <input type="file" accept="image/*" onChange={(e) => setQueryImage(e.target.files[0])} />

      <h3>Dataset Images</h3>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => setDbImages(Array.from(e.target.files))}
      />

      <br /><br />

      <button onClick={runScan}>
        {loading ? "Analyzing..." : "Run AI Vision Match"}
      </button>

      <div style={{ marginTop: 20 }}>
        {results.map((r, i) => (
          <div key={i} style={{ border: "1px solid #ddd", padding: 10 }}>
            <img src={r.image} width="80" />
            <h3>{r.name}</h3>
            <p>Similarity: {r.score}%</p>

            <a href={r.links.ebay} target="_blank">eBay</a> |{" "}
            <a href={r.links.mercari} target="_blank">Mercari</a>
          </div>
        ))}
      </div>
    </div>
  );
}
