const http = require("http");
const fs = require("fs");
const puppeteer = require("puppeteer");

let server;
let browser;
let page;

beforeAll(async () => {
  server = http.createServer((req, res) => {
    const filePath = __dirname + "/.." + req.url;
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.error(`Error reading file: ${filePath}`, err);
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "File not found" }));
        return;
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });
  });

  const PORT = process.env.PORT || 3000;
  await new Promise((resolve) => server.listen(PORT, resolve));
});

afterAll(async () => {
  await new Promise((resolve) => server.close(resolve));
});

beforeEach(async () => {
  browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  page = await browser.newPage();
  await page.goto("http://localhost:3000/index.html");
});

afterEach(async () => {
  await browser.close();
});

describe("unordered list", () => {
  it("should exist", async () => {
    const unorderedList = await page.$("ul");
    expect(unorderedList).not.toBeNull();
  });

  it("should have 3 list items", async () => {
    const unorderedListItems = await page.$$("ul > li");
    expect(unorderedListItems.length).toBe(3);
  });
});

describe("ordered list", () => {
  it("should exist", async () => {
    const orderedList = await page.$("ol");
    expect(orderedList).not.toBeNull();
  });

  it("should have 3 list items", async () => {
    const orderedListItems = await page.$$("ol > li");
    expect(orderedListItems.length).toBe(3);
  });
});
