const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || '@playwright/test');
import { homedir } from 'node:os';
import { rename } from 'node:fs/promises';
const browser=await chromium.launch({headless:true,executablePath:`${homedir()}/Library/Caches/ms-playwright/chromium-1161/chrome-mac/Chromium.app/Contents/MacOS/Chromium`});
const context=await browser.newContext({viewport:{width:1440,height:900},recordVideo:{dir:'qa/recording',size:{width:1440,height:900}}});
const page=await context.newPage();
await page.goto('http://127.0.0.1:5173/');
await page.waitForTimeout(1600);
const height=await page.evaluate(()=>document.documentElement.scrollHeight);
for(let y=0;y<height;y+=450){await page.mouse.wheel(0,450);await page.waitForTimeout(300);}
await page.waitForTimeout(1000);
await page.locator('.site-header a[href="#products"]').first().evaluate(el=>el.click());
await page.waitForTimeout(500);
for(let i=4;i>=0;i--){await page.locator('.chapter-button').nth(i).click();await page.waitForTimeout(900);}
const video=page.video();
await context.close();
await video.saveAs('qa/luum-scroll-demo.webm');
await browser.close();
console.log('Saved qa/luum-scroll-demo.webm');
