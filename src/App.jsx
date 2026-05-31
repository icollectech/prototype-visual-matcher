import { useState } from "react";

export default function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState("");

  function handleChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult("");
  }

  function handleMatch() {
    if (!image) {
      alert("Upload an image first");
      return;
    }

    // Fake AI results (for now)
    const matches = [
      "iPhone Prototype (2007 EVT)",
      "MacBook Engineering Sample",
      "Apple Internal Diagnostic Unit",
      "Unknown Prototype Hardware",
      "Pre-release Mobile Device"
    ];

    const random = matches[Math.floor(Math.random() * matches.length)];

    setResult(random);
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>Prototype Visual Matcher</h1>

      <input type="file" accept="image/*" onChange={handleChange} />

      {preview && (
        <div style={{ marginTop: 20 }}>
          <img
            src={preview}
            alt="preview"
            width="250"
            style={{ borderRadius: 8 }}
          />
        </div>
      )}

      <button
        onClick={handleMatch}
        style={{
          marginTop: 20,
          padding: "10px 15px",
          cursor: "pointer"
        }}
      >
        Run AI Match
      </button>

      {result && (
        <div style={{ marginTop: 20 }}>
          <h3>AI Result:</h3>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}
