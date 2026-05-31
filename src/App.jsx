import { useState } from "react"

export default function App() {
  const [input, setInput] = useState("")

  return (
    <div style={{
      padding: 20,
      fontFamily: "Arial",
      maxWidth: 600,
      margin: "0 auto"
    }}>
      <h1 style={{ color: "black" }}>
        Prototype Visual Matcher
      </h1>

      <p>Search prototype or device name:</p>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type here..."
        style={{
          width: "100%",
          padding: 10,
          fontSize: 16,
          marginTop: 10,
          marginBottom: 20
        }}
      />

      <div style={{
        padding: 15,
        border: "1px solid #ddd",
        borderRadius: 8
      }}>
        <h3>Live Preview</h3>
        <p>{input ? input : "Nothing typed yet"}</p>
      </div>
    </div>
  )
}
