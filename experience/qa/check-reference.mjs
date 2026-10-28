import { chromium } from '@playwright/test';
import { homedir } from 'node:os';
const browser = await chromium.launch({headless:true, executablePath:`${homedir()}/Library/Caches/ms-playwright/chromium-1161/chrome-mac/Chromium.app/Contents/MacOS/Chromium`});
const page=await browser.newPage({viewport:{width:1920,height:1080}});
try {
 const response = await page.goto('https://www.cartier.com/en-fr/lechoeurdespierres',{waitUntil:'domcontentloaded',timeout:45000});
 console.log(JSON.stringify({status:response.status(),title:await page.title(),text:(await page.locator('body').innerText()).slice(0,1500)}));
 await page.screenshot({path:'qa/cartier-access.png'});
} catch(e) { console.log(e.message); }
await browser.close();
