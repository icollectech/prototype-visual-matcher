const tf = require("@tensorflow/tfjs");
const mobilenet = require("@tensorflow-models/mobilenet");
const fs = require("fs");
const path = require("path");

async function buildIndex() {
  console.log("Loading model...");

  const model = await mobilenet.load();

  const metadata = JSON.parse(
    fs.readFileSync("urls.json", "utf8")
  );

  const index = [];

  for (const item of metadata) {
    try {
      console.log(`Processing: ${item.file}`);

      index.push({
        file: item.file,
        title: item.title,
        url: item.url
      });
    } catch (err) {
      console.log(
        `Skipped ${item.file}:`,
        err.message
      );
    }
  }

  fs.writeFileSync(
    "output-index.json",
    JSON.stringify(index, null, 2)
  );

  console.log(
    `DONE ✔ Indexed ${index.length} images`
  );
}

buildIndex().catch(console.error);