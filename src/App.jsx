export default function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#111827",
        color: "white",
        padding: "20px",
        fontFamily: "Arial"
      }}
    >
      <h1>Prototype Visual Matcher</h1>
      <p>
        Upload an Apple prototype image and search for visually similar
        eBay/PicClick listings.
      </p>

      <input type="file" accept="image/*" />

      <div style={{ marginTop: "20px" }}>
        <button
          style={{
            padding: "12px 20px",
            borderRadius: "12px",
            border: "none",
            fontSize: "16px"
          }}
        >
          Scan Listings
        </button>
      </div>

      <div style={{ marginTop: "30px" }}>
        <h2>Future Matches</h2>
        <p>94% match — hidden iPhone prototype listing</p>
        <p>87% match — MacBook engineering unit</p>
      </div>
    </div>
  );
}
