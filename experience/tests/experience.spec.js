import {test,expect} from '@playwright/test';
import {products,storyLines} from '../src/content.js';
const scene=page=>page.locator('.product-canvas').getAttribute('data-scene').then(v=>JSON.parse(v||'{}'));
async function loaded(page){await page.goto('/');await page.getByRole('button',{name:'ENTER THE ROOM',exact:true}).click({timeout:120000});await expect(page.locator('.preloader')).toHaveCount(0,{timeout:120000});await expect.poll(async()=>(await scene(page)).models,{timeout:120000}).toBe(5);}
async function scrollTo(page,id,fraction=0){await page.evaluate(({id,fraction})=>{const e=document.getElementById(id);scrollTo(0,e.getBoundingClientRect().top+scrollY+Math.max(0,e.offsetHeight-innerHeight)*fraction);},{id,fraction});}
const productAt=(page,index,local)=>scrollTo(page,'showcase',(index+local)/5);

test('five scroll chapters start whole, enter separately and retain solid source geometry and detail cameras',async({page})=>{
 test.setTimeout(240000);await page.setViewportSize({width:1440,height:1000});const errors=[];page.on('pageerror',e=>errors.push(e.message));await loaded(page);
 for(let i=0;i<5;i++){
  await productAt(page,i,.02);await expect.poll(async()=>(await scene(page)).selected).toBe(i);await expect.poll(async()=>(await scene(page)).progress).toBeLessThan(.02);expect((await scene(page)).arrival).toBeLessThan(.1);await expect(page.locator('.product-title')).toHaveText(products[i].name);
  await productAt(page,i,.18);await expect.poll(async()=>(await scene(page)).arrival).toBe(1);await page.waitForTimeout(1850);expect((await scene(page)).solid).toBe(true);expect((await scene(page)).asset).toBe(products[i].id);await page.screenshot({path:`qa/revised-product-${products[i].id}.png`});
  for(const [local,camera]of[[.5,1],[.72,2],[.86,3]]){await productAt(page,i,local);await expect.poll(async()=>(await scene(page)).progress).toBeCloseTo(camera,1);expect((await scene(page)).solid).toBe(true);}
  if(i<4){await productAt(page,i,.985);await expect.poll(async()=>(await scene(page)).departure).toBeGreaterThan(.95);}
 }
 await productAt(page,4,1);await expect.poll(async()=>(await scene(page)).progress).toBeCloseTo(4,1);await page.waitForTimeout(600);await page.screenshot({path:'qa/revised-desktop-lineup.png'});
 const lineup=await scene(page);expect(lineup.physicalHeightRatio).toBeCloseTo(.0778/.19,4);expect(Math.max(...lineup.groundLevels)-Math.min(...lineup.groundLevels)).toBeLessThan(.001);expect(new Set(lineup.scales).size).toBe(1);
 // A menu jump out of a close-up must also start the next vessel at its whole pose.
 await page.getByRole('button',{name:'SHAMPOO 샴푸 보기',exact:true}).click();await expect.poll(async()=>(await scene(page)).selected).toBe(1);await expect.poll(async()=>(await scene(page)).progress).toBeLessThan(.02);expect((await scene(page)).arrival).toBe(1);
 expect(errors).toEqual([]);
});

test('drag has priority, keyboard works, brand sentences keep their order and pattern inspection targets the correct product',async({page})=>{
 test.setTimeout(120000);await page.setViewportSize({width:1440,height:1000});await loaded(page);await productAt(page,0,.18);
 await page.mouse.move(520,430);await page.mouse.down();await page.mouse.move(720,430,{steps:12});await productAt(page,0,.5);await page.waitForTimeout(600);expect((await scene(page)).progress).toBeLessThan(.02);await page.mouse.up();await expect.poll(async()=>(await scene(page)).progress).toBeCloseTo(1,1);expect((await scene(page)).rotation).toBeGreaterThan(1);
 await page.screenshot({path:'qa/revised-desktop-detail.png'});await page.locator('.product-canvas').focus();const angle=(await scene(page)).rotation;await page.keyboard.press('ArrowRight');await expect.poll(async()=>(await scene(page)).rotation).toBeGreaterThan(angle+.15);
 for(const [local,file]of[[.72,'ring'],[.86,'signature']]){await productAt(page,0,local);await page.waitForTimeout(800);await page.screenshot({path:`qa/revised-desktop-${file}.png`});}
 await scrollTo(page,'brand-story',.98);await page.waitForTimeout(900);const copy=await page.locator('.brand-editorial-copy').textContent();let position=-1;for(const line of storyLines){const n=copy.indexOf(line);expect(n).toBeGreaterThan(position);position=n;}await page.screenshot({path:'qa/revised-story.png'});
 await expect(page.locator('.opening-product-canvas,.opening-glass,.object-frost')).toHaveCount(0);
 await scrollTo(page,'collection');await page.waitForTimeout(1600);await page.screenshot({path:'qa/revised-collection.png'});await page.getByRole('button',{name:'BODY LOTION 패턴 보기',exact:true}).click();const lotion=page.getByRole('button',{name:'BODY LOTION Diagonal Lines 3D 디테일 보기'});await lotion.focus();await page.keyboard.press('Enter');await expect.poll(async()=>(await scene(page)).selected).toBe(4);await expect.poll(async()=>(await scene(page)).progress).toBeCloseTo(1,1);await page.screenshot({path:'qa/revised-lotion-detail.png'});
 const fonts=await page.evaluate(async()=>{await document.fonts.ready;return{brand:document.fonts.check('24px LUUM','LUUM'),ko:document.fonts.check('16px Pretendard','감각'),family:getComputedStyle(document.querySelector('.product-title')).fontFamily,overflow:document.documentElement.scrollWidth>innerWidth};});expect(fonts.brand&&fonts.ko).toBe(true);expect(fonts.family).toContain('LUUM');expect(fonts.overflow).toBe(false);
 await page.reload();await expect(page.locator('.preloader')).toHaveCount(0);expect(await page.evaluate(()=>sessionStorage.getItem('luum-loaded'))).toBe('true');
});

test('mobile layout, all five selectors, reduced motion and real brand footer links',async({page})=>{
 test.setTimeout(120000);await page.setViewportSize({width:390,height:844});await loaded(page);await page.screenshot({path:'qa/revised-mobile-opening.png'});await scrollTo(page,'brand-story',.98);await page.waitForTimeout(800);await page.screenshot({path:'qa/revised-mobile-story.png'});await productAt(page,0,.18);
 for(let i=0;i<5;i++){const p=products[i];await page.getByRole('button',{name:`${p.name} ${p.ko} 보기`,exact:true}).click();await expect.poll(async()=>(await scene(page)).selected).toBe(i);await expect.poll(async()=>(await scene(page)).progress).toBeLessThan(.02);}
 await page.waitForTimeout(1200);await page.screenshot({path:'qa/revised-mobile-lotion.png'});expect(await page.locator('.product-canvas').evaluate(e=>getComputedStyle(e).touchAction)).toBe('pan-y');
 await page.getByRole('button',{name:'FOAM CLEANSER 폼 클렌저 보기'}).click();await page.waitForTimeout(1200);await page.screenshot({path:'qa/revised-mobile-product.png'});await productAt(page,0,.5);await expect.poll(async()=>(await scene(page)).progress).toBeCloseTo(1,1);await page.screenshot({path:'qa/revised-mobile-detail.png'});
 await scrollTo(page,'collection');await page.waitForTimeout(500);await page.screenshot({path:'qa/revised-mobile-collection.png'});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await scrollTo(page,'ending');await page.screenshot({path:'qa/brand-flow-mobile-footer.png'});await expect(page.getByRole('link',{name:'Instagram @luum ↗'})).toHaveAttribute('href','https://www.instagram.com/luum/');await expect(page.getByRole('link',{name:'Brand website ↗'})).toHaveAttribute('href','https://ysy6631y.github.io/LUUM/');
 await page.setViewportSize({width:320,height:740});await productAt(page,0,.18);await page.waitForTimeout(700);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.screenshot({path:'qa/revised-small-mobile.png'});
 await page.emulateMedia({reducedMotion:'reduce'});await expect.poll(async()=>(await scene(page)).daylight).toBe(0);expect((await scene(page)).solid).toBe(true);
});

test('real source image fallback remains navigable when WebGL is unavailable',async({page})=>{
 await page.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){if(/webgl/.test(type))return null;return original.call(this,type,...args)}});
 await page.goto('/');await page.getByRole('button',{name:'ENTER THE ROOM',exact:true}).click({timeout:30000});await expect(page.locator('.preloader')).toHaveCount(0,{timeout:30000});await productAt(page,0,.18);await expect(page.locator('.fallback-stage')).toHaveCSS('opacity','1');
 for(const p of products){await page.getByRole('button',{name:`${p.name} ${p.ko} 보기`,exact:true}).click();await expect(page.locator('.fallback-stage img')).toHaveAttribute('src',new RegExp(`luum-${p.id}.png`));}
 await page.screenshot({path:'qa/revised-fallback.png'});
});
