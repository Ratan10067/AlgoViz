const fs = require("fs");
const path = require("path");
const glob = require("glob");

function getAllFiles(patterns) {
  return patterns.flatMap(pattern => glob.sync(pattern));
}

const assetFiles = getAllFiles([
  "src/assets/**/*.*",
  "src/styles/**/*.*",
]);

const codeFiles = getAllFiles([
  "src/**/*.js",
  "src/**/*.jsx",
  "src/**/*.css",
]);

// Read all code file contents
let codeText = "";
for (const file of codeFiles) {
  codeText += fs.readFileSync(file, "utf8") + "\n";
}

console.log("Checking usage…\n");

for (const asset of assetFiles) {
  const short = asset.replace(/^src\//, "");
  const isUsed = codeText.includes(short) || codeText.includes("./" + short);

  if (!isUsed) {
    console.log("❌ Unused:", asset);
  } else {
    console.log("✅ Used:", asset);
  }
}
