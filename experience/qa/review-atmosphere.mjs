import{chromium}from'@playwright/test';import{homedir}from'node:os';
const browser=await chromium.launch({headless:true,executablePath:`${homedir()}/Library/Caches/ms-playwright/chromium-1161/chrome-mac/Chromium.app/Contents/MacOS/Chromium`});
const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});const errors=[];
page.on('pageerror',e=>{errors.push(e.message);console.log('ERROR',e.message)});page.on('console',m=>{if(m.type()==='error')console.log('CONSOLE',m.text())});
await page.goto('http://127.0.0.1:5173');await page.getByRole('button',{name:'컬렉션 감상하기'}).waitFor({timeout:120000});await page.waitForTimeout(1000);await page.screenshot({path:'qa/atmosphere-opening.png'});
await page.getByRole('button',{name:'컬렉션 감상하기'}).click();await page.locator('.opening').waitFor({state:'hidden'});await page.waitForFunction(()=>JSON.parse(document.querySelector('.product-canvas').dataset.scene).intro<.001);await page.screenshot({path:'qa/atmosphere-hero.png'});
await page.getByRole('button',{name:'UMBER 엄버 보기'}).click();await page.waitForTimeout(500);console.log('TRANSITION',await page.locator('.product-canvas').getAttribute('data-scene'));await page.screenshot({path:'qa/atmosphere-transition.png'});await page.waitForTimeout(1000);await page.screenshot({path:'qa/atmosphere-umber.png'});
await page.getByRole('button',{name:'IVORY 아이보리 보기'}).click();await page.waitForTimeout(1500);
for(const [i,label]of[[1,'금빛 패턴'],[2,'디테일'],[3,'시그니처'],[4,'컬렉션 피날레']]){await page.getByRole('button',{name:label,exact:true}).click();await page.waitForFunction(i=>Math.abs(JSON.parse(document.querySelector('.product-canvas').dataset.scene).progress-i)<.005,i);await page.waitForTimeout(800);await page.screenshot({path:`qa/atmosphere-scene-${i}.png`});}
await page.setViewportSize({width:390,height:844});await page.getByRole('button',{name:'오브제',exact:true}).click();await page.waitForTimeout(1800);await page.screenshot({path:'qa/atmosphere-mobile.png'});
for(const [i,label]of[[1,'금빛 패턴'],[3,'시그니처'],[4,'컬렉션 피날레']]){await page.getByRole('button',{name:label,exact:true}).click();await page.waitForFunction(i=>Math.abs(JSON.parse(document.querySelector('.product-canvas').dataset.scene).progress-i)<.005,i);await page.waitForTimeout(600);await page.screenshot({path:`qa/atmosphere-mobile-${i}.png`});}
console.log(JSON.stringify({errors}));await browser.close();
