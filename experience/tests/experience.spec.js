import {test,expect} from '@playwright/test';
import {products,storyLines} from '../src/content.js';
const scene=page=>page.locator('.product-canvas').getAttribute('data-scene').then(v=>JSON.parse(v||'{}'));
async function loaded(page){await page.goto('/');await expect(page.locator('.preloader')).toHaveCount(0,{timeout:120000});await expect.poll(async()=>(await scene(page)).models,{timeout:120000}).toBe(5);}
async function scrollTo(page,id,fraction=0){await page.evaluate(({id,fraction})=>{const e=document.getElementById(id);scrollTo(0,e.offsetTop+Math.max(0,e.offsetHeight-innerHeight)*fraction);},{id,fraction});}

test('source matching, solid switches, detail cameras, drag priority and keyboard rotation',async({page})=>{
 test.setTimeout(240000);await page.setViewportSize({width:1440,height:1000});const errors=[];page.on('pageerror',e=>errors.push(e.message));await loaded(page);await scrollTo(page,'showcase');
 await expect(page.locator('.experience')).toHaveAttribute('data-viewing','true');
 for(let i=0;i<5;i++){
  const p=products[i];await page.getByRole('button',{name:`${p.name} ${p.ko} 보기`,exact:true}).click();
  await expect.poll(async()=>(await scene(page)).selected).toBe(i);await expect(page.locator('.product-title')).toHaveText(p.name);
  for(let n=0;n<3;n++){expect((await scene(page)).solid).toBe(true);await page.waitForTimeout(220);}
  expect((await scene(page)).asset).toBe(p.id);await page.waitForTimeout(700);await page.screenshot({path:`qa/revised-product-${p.id}.png`});
 }
 await page.getByRole('button',{name:'FOAM CLEANSER 폼 클렌저 보기'}).click();await page.waitForTimeout(1300);
 await page.mouse.move(720,430);await page.mouse.down();await page.mouse.move(920,430,{steps:12});await scrollTo(page,'showcase',.25);await page.waitForTimeout(600);
 expect((await scene(page)).progress).toBeLessThan(.02);await page.mouse.up();await expect.poll(async()=>(await scene(page)).progress).toBeCloseTo(1,1);expect((await scene(page)).rotation).toBeGreaterThan(1);
 await page.screenshot({path:'qa/revised-desktop-detail.png'});await page.locator('.product-canvas').focus();const r=(await scene(page)).rotation;await page.keyboard.press('ArrowRight');await expect.poll(async()=>(await scene(page)).rotation).toBeGreaterThan(r+.15);
 for(const [fraction,file]of[[.5,'ring'],[.75,'signature'],[1,'lineup']]){await scrollTo(page,'showcase',fraction);await expect.poll(async()=>(await scene(page)).progress).toBeCloseTo(fraction*4,1);await page.waitForTimeout(500);await page.screenshot({path:`qa/revised-desktop-${file}.png`});}
 expect(errors).toEqual([]);
});

test('compact story, source typography, accessible pattern inspection and non-repeating loader',async({page})=>{
 test.setTimeout(180000);await page.setViewportSize({width:1440,height:1000});await loaded(page);await page.waitForTimeout(800);await page.screenshot({path:'qa/revised-opening.png'});
 await expect(page.locator('.glass-sheet,.story-glass,.narrative-scene')).toHaveCount(0);
 const copy=await page.locator('.brand-editorial-copy').innerText();let position=-1;for(const line of storyLines){const n=copy.indexOf(line);expect(n).toBeGreaterThan(position);position=n;}
 expect(await page.locator('#brand-story').evaluate(e=>e.offsetHeight/innerHeight)).toBeLessThan(1.5);
 await scrollTo(page,'brand-story');await page.waitForTimeout(900);await page.screenshot({path:'qa/revised-story.png'});
 await scrollTo(page,'collection');await page.waitForTimeout(600);await page.screenshot({path:'qa/revised-collection.png'});
 const lotion=page.getByRole('button',{name:'BODY LOTION Diagonal Lines 3D 디테일 보기'});await lotion.focus();await page.keyboard.press('Enter');await expect.poll(async()=>(await scene(page)).selected).toBe(4);await expect.poll(async()=>(await scene(page)).progress,{timeout:15000}).toBeCloseTo(1,1);await page.screenshot({path:'qa/revised-lotion-detail.png'});
 const fonts=await page.evaluate(async()=>{await document.fonts.ready;return{brand:document.fonts.check('24px LUUM','LUUM'),ko:document.fonts.check('16px Pretendard','감각'),family:getComputedStyle(document.querySelector('.product-title')).fontFamily,overflow:document.documentElement.scrollWidth>innerWidth};});expect(fonts.brand&&fonts.ko).toBe(true);expect(fonts.family).toContain('LUUM');expect(fonts.overflow).toBe(false);
 await page.reload();await expect(page.locator('.preloader')).toHaveCount(0);expect(await page.evaluate(()=>sessionStorage.getItem('luum-loaded'))).toBe('true');
});

test('mobile layout, touch-compatible rotation area, all five products and reduced motion',async({page})=>{
 test.setTimeout(180000);await page.setViewportSize({width:390,height:844});await loaded(page);await page.screenshot({path:'qa/revised-mobile-opening.png'});await scrollTo(page,'brand-story');await page.waitForTimeout(700);await page.screenshot({path:'qa/revised-mobile-story.png'});await scrollTo(page,'showcase');
 for(let i=0;i<5;i++){const p=products[i];await page.getByRole('button',{name:`${p.name} ${p.ko} 보기`,exact:true}).click();await expect.poll(async()=>(await scene(page)).selected).toBe(i);}
 await page.waitForTimeout(1200);await page.screenshot({path:'qa/revised-mobile-lotion.png'});expect(await page.locator('.product-canvas').evaluate(e=>getComputedStyle(e).touchAction)).toBe('pan-y');
 await page.getByRole('button',{name:'FOAM CLEANSER 폼 클렌저 보기'}).click();await page.waitForTimeout(1200);await page.screenshot({path:'qa/revised-mobile-product.png'});await scrollTo(page,'showcase',.25);await expect.poll(async()=>(await scene(page)).progress).toBeCloseTo(1,1);await page.screenshot({path:'qa/revised-mobile-detail.png'});
 await scrollTo(page,'collection');await page.waitForTimeout(700);await page.screenshot({path:'qa/revised-mobile-collection.png'});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.setViewportSize({width:320,height:740});await scrollTo(page,'showcase');await page.waitForTimeout(1000);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.screenshot({path:'qa/revised-small-mobile.png'});
 await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(900);expect(await page.locator('.atmosphere-canvas,.glass-sheet,.glass-ui,.product-note').count()).toBe(0);expect((await scene(page)).daylight).toBe(0);expect((await scene(page)).solid).toBe(true);

});

test('real source image fallback remains navigable when WebGL is unavailable',async({page})=>{
 await page.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){if(/webgl/.test(type))return null;return original.call(this,type,...args)}});
 await page.goto('/');await expect(page.locator('.preloader')).toHaveCount(0,{timeout:30000});await scrollTo(page,'showcase');await expect(page.locator('.fallback-stage')).toHaveCSS('opacity','1');
 for(const p of products){await page.getByRole('button',{name:`${p.name} ${p.ko} 보기`,exact:true}).click();await expect(page.locator('.fallback-stage img')).toHaveAttribute('src',new RegExp(`luum-${p.id}.png`));}
 await page.screenshot({path:'qa/revised-fallback.png'});
});
