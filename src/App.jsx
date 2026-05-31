import { useState } from "react"

const MOCK_RESULTS = [
  {
    id: 1,
    title: "iPhone Prototype - Early EVT Unit",
    platform: "eBay",
    match: "94%",
    price: "$2,500 - $4,000"
  },
  {
    id: 2,
    title: "Apple Engineering Sample Device",
    platform: "Goofish",
    match: "88%",
    price: "$1,800 - $3,200"
  },
  {
    id: 3,
    title: "Vintage iOS Development Phone",
    platform: "Mercari",
    match: "81%",
    price: "$900 - $1,500"
  }
]

export default function App() {
  const [image, setImage] = useState(null)
  const [results, setResults] = useState([])

  const handleUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setImage(URL.createObjectURL(file))
    setResults(MOCK_RESULTS)
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial", maxWidth: 900, margin: "0 auto" }}>
      <h1>Prototype Image Matcher</h1>

      {/* Upload */}
      <input type="file" accept="image/*" onChange={handleUpload} />

      {/* Preview */}
      {image && (
        <div style={{ marginTop: 20 }}>
          <h3>Uploaded Image</h3>
          <img
            src={image}
            alt="upload"
            style={{ width: 250, borderRadius: 10 }}
          />
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div style={{ marginTop: 30 }}>
          <h3>Matches</h3>

          <div style={{ display: "grid", gap: 10 }}>
            {results.map(item => (
              <div
                key={item.id}
                style={{
                  border: "1px solid #ddd",
                  padding: 15,
                  borderRadius: 10
                }}
              >
                <b>{item.title}</b>
                <div>Platform: {item.platform}</div>
                <div>Match: {item.match}</div>
                <div>Estimated price: {item.price}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
