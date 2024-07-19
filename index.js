import "dotenv/config";
import puppeteer from "puppeteer";
import yargs from "yargs";

import formatDate from "./src/format-date.js";
import delay from "./src/delay.js";
import waitUntil from "./src/wait-until.js";

const email = process.env.SKEDDA_EMAIL;
const password = process.env.SKEDDA_PASSWORD;

const anticipate = 60; // ms to anticipate the hour

const argv = yargs(process.argv.slice(2)).parse();
let hour = argv.hour;
const courtNumber = argv.court || 2;

if (hour === undefined) {
  const now = new Date();
  hour = now.getHours() + 1;
}

if (typeof hour !== "number") {
  console.error("hour must be a number between 0 and 23");
  process.exit(1);
}

const hr = hour.toLocaleString("en-US", { minimumIntegerDigits: 2 });
const nextHr = (hour + 1).toLocaleString("en-US", { minimumIntegerDigits: 2 });

if (![1, 2, 3].includes(courtNumber)) {
  console.error("court must be 1, 2, or 3");
  process.exit(1);
}

const court = {
  1: "17087",
  2: "17088",
  3: "17089",
}[courtNumber];

// YYYY-MM-DD
const date = new Date();
date.setDate(date.getDate() + 1);
const tomorrow = formatDate(date);

const browser = await puppeteer.launch();
const page = await browser.newPage();

const url = encodeURIComponent(
  `https://sgptc.skedda.com/booking?viewdate=${tomorrow}`
);

const path = `https://sgptc.skedda.com/booking?nbend=${tomorrow}T${nextHr}%3A00%3A00&nbspaces=${court}&nbstart=${tomorrow}T${hr}%3A00%3A00&viewdate=${tomorrow}`;

await page.goto(`https://app.skedda.com/account/login?returnUrl=${url}`);
await page.setViewport({ width: 1600, height: 1600 });

await delay(1000);

// Log in
await page.type("#login-email", email);
await page.type("#login-password", password);
await page.click('button[type="submit"]');

await delay(2000);

// Open court booking page
await page.goto(path);

console.log(
  `Logged in! Booking court ${courtNumber} for ${tomorrow} at ${hour}:00.`
);

const now = new Date();
const desiredTime = new Date(
  now.getFullYear(),
  now.getMonth(),
  now.getDate(),
  hour
).getTime();
await waitUntil(() => {
  const currentTime = new Date().getTime();
  return currentTime + anticipate >= desiredTime;
});

console.log("Booking court...", new Date());

// Book court

await page.click("div.modal-body button.btn-success");

console.log("Done clicking", new Date());

await delay(2000);
await browser.close();

console.log("done!");
process.exit(0);
