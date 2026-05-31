export default function handler(req, res) {
  res.status(200).json({
    results: [
      { name: "iPhone 2G Prototype EVT", match: 95 },
      { name: "Apple Engineering Sample", match: 88 },
      { name: "MacBook Prototype Unit", match: 81 }
    ]
  })
}
