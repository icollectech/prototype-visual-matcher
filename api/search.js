export default async function handler(req, res) {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: "No query provided" });
  }

  try {
    // eBay Finding API (public-ish endpoint via search HTML fallback)
    const url = `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(query)}`;

    // We cannot legally scrape full structured data without API,
    // so we return structured "listing preview cards" from search context

    const results = [
      {
        title: `${query} (eBay search results)`,
        source: "eBay",
        url,
        image: "https://via.placeholder.com/150",
        price: "Check listings"
      }
    ];

    res.status(200).json({ results });
  } catch (e) {
    res.status(500).json({ error: "Search failed" });
  }
}
