import{chromium}from'@playwright/test';import{homedir}from'node:os';
const browser=await chromium.launch({headless:true,executablePath:`${homedir()}/Library/Caches/ms-playwright/chromium-1161/chrome-mac/Chromium.app/Contents/MacOS/Chromium`});const page=await browser.newPage({viewport:{width:1280,height:900}});
await page.goto('http://127.0.0.1:5173');await page.getByRole('button',{name:'컬렉션 감상하기'}).click({timeout:120000});await page.locator('.opening').waitFor({state:'hidden'});await page.waitForTimeout(2600);await page.mouse.move(640,400);await page.mouse.down();await page.mouse.up();await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(2400);
for(const name of ['a','b']){console.log(name,await page.locator('.product-canvas').getAttribute('data-scene'),await page.locator('.atmosphere-canvas').getAttribute('data-light-time'));await page.screenshot({path:`qa/reduced-${name}.png`});await page.waitForTimeout(1200);}
await browser.close();
