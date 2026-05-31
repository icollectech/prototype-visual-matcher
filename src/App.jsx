import { useState } from "react";

/**
 * VERY SIMPLE "FAKE PERCEPTUAL HASH"
 * (no libraries, no APIs)
 * This is NOT Google-level AI, but works for basic matching demo
 */
function fakeHash(fileName) {
  return fileName.toLowerCase().replace(/[^a-z0-9]/g, "").split("").reduce((a, c) => a + c.charCodeAt(0), 0);
}

function similarity(hash1, hash2) {
  const diff = Math.abs(hash1 - hash2);
  return Math.max(0, 100 - diff % 100);
}

export default function App() {
  const [queryImage, setQueryImage] = useState(null);
  const [dbImages, setDbImages] = useState([]);
  const [result, setResult] = useState("");

  function handleQuery(e) {
    setQueryImage(e.target.files[0]);
  }

  function handleDbUpload(e) {
    setDbImages([...e.target.files]);
  }

  function runMatch() {
    if (!queryImage || dbImages.length === 0) {
      alert("Upload query image + database images first");
      return;
    }

    const queryHash = fakeHash(queryImage.name);

    let best = { name: "No match", score: 0 };

    dbImages.forEach((img) => {
      const h = fakeHash(img.name);
      const score = similarity(queryHash, h);

      if (score > best.score) {
        best = { name: img.name, score };
      }
    });

    setResult(`${best.name} (match: ${best.score.toFixed(1)}%)`);
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>Prototype Visual Matcher</h1>

      <h3>1. Upload image to identify</h3>
      <input type="file" accept="image/*" onChange={handleQuery} />

      <h3 style={{ marginTop: 20 }}>2. Upload database images</h3>
      <input type="file" accept="image/*" multiple onChange={handleDbUpload} />

      <button onClick={runMatch} style={{ marginTop: 20 }}>
        Run Match
      </button>

      {result && (
        <div style={{ marginTop: 20 }}>
          <h3>Best Match:</h3>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}
