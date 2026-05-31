import { useState } from "react";

function getPixels(file) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = 12;
      canvas.height = 12;

      ctx.drawImage(img, 0, 0, 12, 12);

      const data = ctx.getImageData(0, 0, 12, 12).data;

      let arr = [];

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        arr.push((r + g + b) / 3);
      }

      resolve(arr);
    };
  });
}

function similarity(a, b) {
  let diff = 0;

  for (let i = 0; i < a.length; i++) {
    diff += Math.abs(a[i] - b[i]);
  }

  return Math.max(0, 100 - diff / 8);
}

export default function App() {
  const [queryImage, setQueryImage] = useState(null);
  const [dataset, setDataset] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  async function runScan() {
    if (!queryImage || dataset.length === 0) {
      alert("Upload query image + dataset images");
      return;
    }

    setLoading(true);

    const qPixels = await getPixels(queryImage);

    let matches = [];

    for (let file of dataset) {
      const pixels = await getPixels(file);

      const score = similarity(qPixels, pixels);

      const name = file.name.replace(/\.[^/.]+$/, "");

      matches.push({
        name,
        score: Number(score.toFixed(1)),
        image: URL.createObjectURL(file)
      });
    }

    matches.sort((a, b) => b.score - a.score);

    const top = matches.slice(0, 5);

    setResults(top);

    setLoading(false);
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>🧠 Prototype Dataset Matcher (Option A)</h1>

      <h3>Query Image</h3>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setQueryImage(e.target.files[0])}
      />

      <h3>Dataset (upload MANY images)</h3>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => setDataset(Array.from(e.target.files))}
      />

      <br /><br />

      <button onClick={runScan}>
        {loading ? "Scanning dataset..." : "Run Match"}
      </button>

      <div style={{ marginTop: 20 }}>
        {results.map((r, i) => (
          <div key={i} style={{ border: "1px solid #ddd", padding: 10 }}>
            <img src={r.image} width="80" />
            <h3>{r.name}</h3>
            <p>Match: {r.score}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}
