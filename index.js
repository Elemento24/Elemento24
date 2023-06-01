require("isomorphic-unfetch");
const fs_wopro = require("fs");
const { promises: fs } = require("fs");
const { parse } = require("csv-parse");
const CsvReadableStream = require("csv-reader")
const path = require("path");

async function main() {
  const readmeTemplate = (
    await fs.readFile(path.join(process.cwd(), "./README.template.md"))
  ).toString("utf-8");

  // const office_quote = await (
  //   await fetch("https://officeapi.dev/api/quotes/random")
  // ).json();

  // Loading the CSV file
  const data = [];

  fs_wopro.createReadStream("quotes_small.csv", "utf-8")
    .pipe(
      new CsvReadableStream({
        skiplines: 2,
        delimiter: ";",
        parseNumbers: true,
        parseBooleans: true,
      })
    )
    .on("data", function (row) {
      row.pop()
      data.push(row)
    })
    .on("end", async function () {
      console.log("No more rows!");
      let index = Math.floor(Math.random() * data.length)
      let quote = data[index];

      const readme = readmeTemplate
        .replace("{office_quote}", quote[0])
        .replace("{office_character}", quote[1]);
      await fs.writeFile("README.md", readme);
    });

  // const readme = readmeTemplate
  //   .replace("{office_quote}", quote[0])
  //   .replace("{office_character}", quote[1])

  // await fs.writeFile("README.md", readme);
}

main();