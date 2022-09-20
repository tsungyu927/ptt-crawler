const puppeteer = require('puppeteer');

const browser = await puppeteer.launch({ headless: true });

const page = await browser.newPage();

await page.goto('');
