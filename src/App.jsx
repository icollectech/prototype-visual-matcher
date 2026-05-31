import { useState } from "react";

export default function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  function handleChange(e) {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  }

  function handleMatch() {
    alert("AI matching coming next — UI is working");
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>Prototype Visual Matcher</h1>

      <input type="file" accept="image/*" onChange={handleChange} />

      {preview && (
        <div style={{ marginTop: 20 }}>
          <img src={preview} alt="preview" width="200" />
        </div>
      )}

      <br />

      <button onClick={handleMatch} style={{ marginTop: 20 }}>
        Run AI Match
      </button>
    </div>
  );
}
