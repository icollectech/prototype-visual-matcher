export default function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#111827",
        color: "white",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "32px" }}>
        Prototype Visual Matcher
      </h1>

      <p>
        Upload an Apple prototype image to search
        eBay and PicClick for visually similar listings.
      </p>

      <input
        type="file"
        accept="image/*"
        style={{ marginTop: "20px" }}
      />

      <div style={{ marginTop: "20px" }}>
        <button
          style={{
            padding: "12px 20px",
            borderRadius: "12px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Scan Listings
        </button>
      </div>

      <div style={{ marginTop: "40px" }}>
        <h2>Prototype Match Results</h2>
        <p>Waiting for scan...</p>
      </div>
    </div>
  );
}
