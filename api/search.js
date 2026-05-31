export default async function handler(req, res) {
  try {
    const { query } = req.body || {};

    if (!query) {
      return res.status(400).json({
        results: [],
        error: "No query provided"
      });
    }

    // CLEAN fallback-safe response (NO scraping yet)
    const ebayUrl = `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(query)}`;
    const mercariUrl = `https://www.mercari.com/search/?keyword=${encodeURIComponent(query)}`;
    const goofishUrl = `https://www.goofish.com/search?q=${encodeURIComponent(query)}`;

    return res.status(200).json({
      results: [
        {
          title: `eBay results for: ${query}`,
          price: "Click to view live listings",
          image: "https://via.placeholder.com/120",
          url: ebayUrl
        },
        {
          title: `Mercari results for: ${query}`,
          price: "Click to view listings",
          image: "https://via.placeholder.com/120",
          url: mercariUrl
        },
        {
          title: `Goofish results for: ${query}`,
          price: "Click to view listings",
          image: "https://via.placeholder.com/120",
          url: goofishUrl
        }
      ]
    });
  } catch (err) {
    return res.status(500).json({
      results: [],
      error: "Backend crash"
    });
  }
}
