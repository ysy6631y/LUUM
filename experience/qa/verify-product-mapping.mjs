import{chromium}from'@playwright/test';import{homedir}from'node:os';import assert from'node:assert/strict';import{products}from'../src/content.js';
import{readFileSync,writeFileSync}from'node:fs';
const expected=[['FOAM CLEANSER','03','diamond','Chamomile'],['SHAMPOO','01','grid','Rosemary'],['CONDITIONER','02','horizontal','Lavender'],['BODY WASH','04','zigzag','Peony'],['BODY LOTION','05','diagonal','Chamomile']];
for(let i=0;i<5;i++){
 const p=products[i],e=expected[i];assert.equal(p.name,e[0]);assert.equal(p.id,e[1]);assert.equal(p.scent,e[3]);
 const b=readFileSync(new URL(`../public/models/luum-${p.id}.glb`,import.meta.url));const j=JSON.parse(b.subarray(20,20+b.readUInt32LE(12)).toString());assert.ok(j.meshes.some(m=>m.name.includes(e[2])));
}
const browser=await chromium.launch({headless:true,executablePath:`${homedir()}/Library/Caches/ms-playwright/chromium-1161/chrome-mac/Chromium.app/Contents/MacOS/Chromium`});const page=await browser.newPage({viewport:{width:1440,height:1000}});const results=[];
await page.goto('http://127.0.0.1:5173');await page.locator('.preloader').waitFor({state:'detached',timeout:120000});await page.evaluate(()=>scrollTo(0,document.getElementById('showcase').offsetTop));await page.waitForTimeout(2200);
for(let i=0;i<5;i++){
 const p=products[i];await page.getByRole('button',{name:`${p.name} ${p.ko} 보기`}).click();await page.waitForTimeout(1500);assert.equal(await page.locator('.product-title').innerText(),p.name);
 const scene=JSON.parse(await page.locator('.product-canvas').getAttribute('data-scene'));assert.equal(scene.asset,p.id);assert.ok(scene.meshes.some(m=>m.includes(expected[i][2])));assert.equal(scene.solid,true);
 await page.screenshot({path:`qa/mapping-${p.id}.png`});results.push({name:p.name,asset:p.id,pattern:p.patternName,scent:p.scentKo,meshes:scene.meshes});
}
writeFileSync('docs/product-mapping-verified.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results));await browser.close();
