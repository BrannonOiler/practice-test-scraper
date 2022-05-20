import generateHTML from "./generateHTML";
import scrapeWebsite from "./scrapeWebsite";

console.log("Scraping website...");
await scrapeWebsite();

console.log("Generating HTML...");
await generateHTML();

console.log("Done!");
