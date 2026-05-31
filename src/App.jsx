import { useState } from "react"

const PROTOTYPES = [
  {
    id: 1,
    name: "iPhone 2G Prototype",
    year: 2006,
    status: "Early Dev Unit",
    notes: "Pre-release hardware, debug OS build"
  },
  {
    id: 2,
    name: "iPhone 3G EVT Unit",
    year: 2007,
    status: "Engineering Validation",
    notes: "Carrier testing hardware"
  },
  {
    id: 3,
    name: "iPod Touch DVT Prototype",
    year: 2007,
    status: "Design Validation",
    notes: "Multitouch experimentation unit"
  },
  {
    id: 4,
    name: "MacBook Unibody EVT",
    year: 2008,
    status: "Engineering Prototype",
    notes: "Aluminum unibody validation"
  }
]

export default function App() {
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState(null)

  const filtered = PROTOTYPES.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={styles.page}>
      {/* Background Glow */}
      <div style={styles.bgGlow}></div>

      <div style={styles.container}>
        <h1 style={styles.title}>Prototype Visual Matcher</h1>

        {/* Search */}
        <input
          placeholder="Search prototypes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.search}
        />

        {/* Grid */}
        <div style={styles.grid}>
          {filtered.map(item => (
            <div
              key={item.id}
              onClick={() => setSelected(item)}
              style={styles.card}
            >
              <h3 style={styles.cardTitle}>{item.name}</h3>
              <p style={styles.cardYear}>{item.year}</p>
              <span style={styles.badge}>{item.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selected && (
        <div style={styles.modalOverlay} onClick={() => setSelected(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>{selected.name}</h2>
            <p><b>Year:</b> {selected.year}</p>
            <p><b>Status:</b> {selected.status}</p>
            <p>{selected.notes}</p>

            <button style={styles.button} onClick={() => setSelected(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* STYLES */
const styles = {
  page: {
    minHeight: "100vh",
    background: "#0b0f1a",
    color: "white",
    fontFamily: "Arial",
    overflow: "hidden"
  },

  bgGlow: {
    position: "absolute",
    width: "600px",
    height: "600px",
    background: "radial-gradient(circle, #4f46e5, transparent 60%)",
    top: "-200px",
    left: "-200px",
    filter: "blur(80px)",
    opacity: 0.5
  },

  container: {
    position: "relative",
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "40px"
  },

  title: {
    fontSize: "32px",
    marginBottom: "20px"
  },

  search: {
    width: "100%",
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.05)",
    color: "white",
    outline: "none",
    marginBottom: "25px"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "16px"
  },

  card: {
    padding: "16px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    backdropFilter: "blur(12px)",
    cursor: "pointer",
    transition:
