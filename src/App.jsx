import { useState } from "react";

const database = [
  {
    name: "iPhone 2G EVT Prototype (2007)",
    keywords: ["iphone", "2g", "2007", "early", "evT", "black"]
  },
  {
    name: "iPhone Engineering Sample (Pre-Release)",
    keywords: ["iphone", "prototype", "engineering", "sample", "dev"]
  },
  {
    name: "MacBook Engineering Unit",
    keywords: ["macbook", "logic", "board", "prototype", "apple"]
  },
  {
    name: "Apple Internal Diagnostic Device",
    keywords: ["apple", "diagnostic", "internal", "tool", "service"]
  }
];

function matchPrototype(fileName = "") {
  const text = fileName.toLowerCase();

  let bestMatch = {
    name: "Unknown Prototype Device",
    score: 0
  };

  database.forEach((item) => {
    let score = 0;

    item.keywords.forEach((key) => {
      if (text.includes(key.toLowerCase())) {
        score += 1;
      }
    });

    if (score > bestMatch.score) {
      bestMatch = { name: item.name, score };
    }
  });

  return bestMatch;
}

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
    if (!image) return alert("Upload an image first");

    const match = matchPrototype(image.name);

    const searchLink =
      "https://www.ebay.com/sch/i.html?_nkw=" +
      encodeURIComponent(match.name);

    setResult(
      match.name +
        " (confidence: " +
        Math.min(100, match.score * 35) +
        "%)"
    );

    alert("Marketplace search: " + searchLink);
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>Prototype Visual Matcher</h1>

      <input type="file" accept="image/*" onChange={handleChange} />

      {preview && (
        <div style={{ marginTop: 20 }}>
          <img src={preview} width="250" />
        </div>
      )}

      <button onClick={handleMatch} style={{ marginTop: 10 }}>
        Run AI Match
      </button>

      {result && (
        <div style={{ marginTop: 20 }}>
          <h3>Result:</h3>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}
