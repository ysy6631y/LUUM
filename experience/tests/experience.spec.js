import { test, expect } from '@playwright/test';
const scene = page => page.locator('.product-canvas').getAttribute('data-scene').then(v=>JSON.parse(v||'{}'));
async function enter(page) {
  await page.goto('/');
  await page.getByRole('button',{name:'컬렉션 감상하기'}).click({timeout:120000});
  await expect(page.locator('.opening')).toHaveClass(/opening-out/);
  await expect(page.locator('.opening')).toBeHidden();
  await expect.poll(async()=>(await scene(page)).models).toBe(5);
  await expect.poll(async()=>(await scene(page)).intro).toBe(0);
}

test('five source models, selection, continuous detail, collection, and fonts', async ({page}) => {
  test.setTimeout(180000);
  await page.setViewportSize({width:1440,height:1000});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
  await enter(page);
  await page.screenshot({path:'qa/final-desktop-ivory.png'});
  const names=['UMBER 엄버','SIENNA 시에나','SAND 샌드','IVORY 아이보리','PEARL 펄'];
  for(let i=0;i<5;i++) {
    await page.getByRole('button',{name:`${names[i]} 보기`}).click();
    await expect.poll(async()=>(await scene(page)).selected).toBe(i);
    await expect(page.locator('.product-title')).toHaveText(names[i].split(' ')[0]);
    for(let sample=0;sample<5;sample++){await page.waitForTimeout(240);expect((await scene(page)).solid).toBe(true);}
    await page.screenshot({path:`qa/final-product-0${i+1}.png`});
  }
  await page.getByRole('button',{name:'IVORY 아이보리 보기'}).click();
  for(const [index,label] of [[1,'금빛 패턴'],[2,'디테일'],[3,'시그니처'],[4,'컬렉션 피날레']]) {
    await page.getByRole('button',{name:label,exact:true}).click();
    await expect.poll(async()=>(await scene(page)).progress,{timeout:15000}).toBeCloseTo(index,1);
    await page.waitForTimeout(900);
    await page.screenshot({path:`qa/final-desktop-scene-${index}.png`});
  }
  await page.getByRole('button',{name:'컬렉션',exact:true}).click();
  await expect.poll(async()=>(await scene(page)).gallery,{timeout:20000}).toBe(1);
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.screenshot({path:'qa/final-desktop-collection.png'});
  await page.getByRole('button',{name:'SIENNA 탐색'}).click();
  await expect.poll(async()=>(await scene(page)).selected).toBe(1);
  await expect.poll(async()=>(await scene(page)).gallery).toBe(0);
  await expect.poll(async()=>(await scene(page)).progress).toBe(0);
  // Drag changes the actual canvas pixels, while preserving the selected model.
  await page.waitForTimeout(1600);
  const before=await page.locator('.product-canvas').screenshot();
  await page.mouse.move(720,450);await page.mouse.down();await page.mouse.move(900,450,{steps:12});await page.mouse.up();
  await page.waitForTimeout(400);
  const after=await page.locator('.product-canvas').screenshot();
  expect(before.equals(after)).toBe(false);
  await expect.poll(async()=>(await scene(page)).rotation).toBeGreaterThan(.9);
  const fonts=await page.evaluate(async()=>{
    await document.fonts.ready;
    return {luum:document.fonts.check('24px LUUM','LUUM'),pretendard:document.fonts.check('14px Pretendard','빛'),family:getComputedStyle(document.querySelector('.product-title')).fontFamily,overflow:document.documentElement.scrollWidth>innerWidth};
  });
  expect(fonts.luum).toBe(true);expect(fonts.pretendard).toBe(true);expect(fonts.family).toContain('LUUM');expect(fonts.overflow).toBe(false);
  expect(errors).toEqual([]);
});

test('portrait layouts, all collection controls, and reduced motion', async ({page}) => {
  test.setTimeout(180000);
  await page.setViewportSize({width:390,height:844});await enter(page);
  await page.waitForTimeout(1500);await page.screenshot({path:'qa/final-mobile.png'});
  await page.getByRole('button',{name:'금빛 패턴',exact:true}).click();
  await expect.poll(async()=>(await scene(page)).progress).toBeCloseTo(1,1);
  await page.screenshot({path:'qa/final-mobile-detail.png'});
  await page.getByRole('button',{name:'컬렉션',exact:true}).click();
  await expect.poll(async()=>(await scene(page)).gallery,{timeout:20000}).toBe(1);
  await page.screenshot({path:'qa/final-mobile-collection.png'});
  await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.setViewportSize({width:320,height:740});
  await page.getByRole('button',{name:'오브제',exact:true}).click();
  await expect.poll(async()=>(await scene(page)).progress).toBe(0);
  await page.screenshot({path:'qa/final-small-mobile.png'});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.getByRole('button',{name:'PEARL 펄 보기'}).click();
  await expect.poll(async()=>(await scene(page)).selected).toBe(4);
});

test('WebGL unavailable shows actual rendered source product images', async ({page}) => {
  await page.addInitScript(()=>{
    const get=HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext=function(kind,...args){if(kind==='webgl2'||kind==='webgl'||kind==='experimental-webgl')return null;return get.call(this,kind,...args)};
  });
  await page.goto('/');await page.getByRole('button',{name:'컬렉션 감상하기'}).click();
  await expect(page.locator('.fallback-stage')).toBeVisible();
  await page.getByRole('button',{name:'UMBER 엄버 보기'}).click();
  await expect(page.locator('.fallback-stage img')).toHaveAttribute('src',/luum-01.png/);
  await expect.poll(()=>page.locator('.fallback-stage img').evaluate(i=>i.naturalWidth)).toBeGreaterThan(0);
  await page.screenshot({path:'qa/final-webgl-fallback.png'});
});


test('atmosphere, matching cursor and reduced motion respond without making products transparent', async ({page})=>{
  test.setTimeout(120000);
  await page.setViewportSize({width:1280,height:900});
  await enter(page);
  await expect(page.locator('.cursor-arrows,.object-caption,.interaction-tools')).toHaveCount(0);
  await expect(page.getByText('Drag to rotate',{exact:true})).toHaveCount(0);
  expect((await scene(page)).sunlight).toBe(true);
  const background=page.locator('.atmosphere-canvas');
  const initialDaylight=(await scene(page)).daylight;
  const a=await background.screenshot();await page.waitForTimeout(1500);const b=await background.screenshot();
  expect(a.equals(b)).toBe(false);
  expect((await scene(page)).daylight).toBeGreaterThan(initialDaylight);
  await page.mouse.move(640,400);
  await expect(page.locator('.object-cursor')).toHaveAttribute('data-visible','true');
  await expect(page.locator('.object-cursor')).toHaveAttribute('data-mode','rotate');
  await page.mouse.down();await expect(page.locator('.object-cursor')).toHaveAttribute('data-down','true');await page.mouse.up();
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.waitForTimeout(1800);
  const frozenDaylight=(await scene(page)).daylight;
  const c=await background.screenshot();await page.waitForTimeout(800);const d=await background.screenshot();
  expect((await scene(page)).daylight).toBe(frozenDaylight);
  expect(c.equals(d)).toBe(true);
  expect((await scene(page)).solid).toBe(true);
  await page.screenshot({path:'qa/atmosphere-reduced-motion.png'});
});
