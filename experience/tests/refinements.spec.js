import {test,expect} from '@playwright/test';
const scene=page=>page.locator('.product-canvas').getAttribute('data-scene').then(s=>JSON.parse(s||'{}'));
const go=(page,id,fraction=0)=>page.evaluate(({id,fraction})=>{const e=document.getElementById(id);scrollTo({top:e.getBoundingClientRect().top+scrollY+(e.offsetHeight-innerHeight)*fraction,behavior:'instant'});},{id,fraction});

test('rapid scroll responds without a camera hold and keeps the outgoing close-up intact',async({page})=>{
 test.setTimeout(90000);await page.setViewportSize({width:1440,height:1000});await page.goto('/');await page.getByRole('button',{name:'ENTER THE ROOM',exact:true}).click();await expect(page.locator('.preloader')).toHaveCount(0);
 await go(page,'showcase',.86/5);await expect.poll(async()=>(await scene(page)).progress).toBeCloseTo(3,2);const before=await scene(page);await page.screenshot({path:'qa/refined-before-switch.png'});
 await go(page,'showcase',1.5/5);await expect.poll(async()=>(await scene(page)).selected).toBe(1);
 const during=await scene(page);expect(during.transitioning).toBe(true);expect(during.outgoing.find(o=>o.asset==='03')?.scale).toBeCloseTo(before.scales[0],2);await page.screenshot({path:'qa/refined-switch-start.png'});
 await expect.poll(async()=>(await scene(page)).progress,{timeout:1800,intervals:[100,150,200]}).toBeGreaterThan(.5);await page.screenshot({path:'qa/refined-switch-arrival.png'});
 await expect.poll(async()=>(await scene(page)).progress,{timeout:4000}).toBeCloseTo(1,2);await expect.poll(async()=>(await scene(page)).outgoing.length).toBe(0);expect((await scene(page)).solid).toBe(true);await page.screenshot({path:'qa/refined-switch-detail.png'});
 // Backward scrolling must respond during the same entrance, rather than queue behind it.
 await go(page,'showcase',2.72/5);await expect.poll(async()=>(await scene(page)).selected).toBe(2);await expect.poll(async()=>(await scene(page)).progress,{timeout:1800,intervals:[100,150,200]}).toBeGreaterThan(.3);
 await go(page,'showcase',2.18/5);await expect.poll(async()=>(await scene(page)).progress,{timeout:4000}).toBeLessThan(.02);
 await page.getByRole('button',{name:'SHAMPOO 샴푸 보기',exact:true}).click();await expect.poll(async()=>(await scene(page)).progress).toBeLessThan(.02);

 await go(page,'showcase',1.72/5);await expect.poll(async()=>(await scene(page)).progress).toBeCloseTo(2,2);await page.waitForTimeout(1300);await page.screenshot({path:'qa/refined-clean-detail.png'});
 for(const selector of ['.ring-copy','.chapter-rail'])expect(await page.locator(selector).first().evaluate(e=>getComputedStyle(e).backdropFilter)).toBe('none');
 expect(await page.locator('.chapter-rail .active i').evaluate(e=>getComputedStyle(e).width)).toBe('1px');expect(await page.locator('.chapter-rail').evaluate(e=>getComputedStyle(e,'::before').display)).toBe('none');
 for(const selector of ['.detail-action','.product-selector button'])expect(await page.locator(selector).first().evaluate(e=>getComputedStyle(e).backdropFilter)).toBe('blur(7px)');
 const gap=await page.locator('.product-selector .selected>span').evaluate(e=>innerHeight-e.getBoundingClientRect().bottom);expect(gap).toBeGreaterThan(25);
});

test('tracing darkens the original fine lines while the opaque background stays unchanged',async({page})=>{
 test.setTimeout(90000);await page.setViewportSize({width:1440,height:1000});await page.addInitScript(()=>sessionStorage.setItem('luum-entry-room-v1','true'));await page.goto('/');
 const canvas=page.locator('.pattern-drawing');
 for(let i=0;i<5;i++){
  await go(page,'collection',(i+.3)/5);await expect(page.locator('#collection')).toHaveAttribute('data-pattern',String(i));await expect(canvas).toHaveAttribute('data-frost-ready','true');await page.waitForTimeout(900);
  const active=page.locator('.atelier-scene.is-active'),box=await active.locator('.pattern').boundingBox();
  await canvas.evaluate(c=>{c.baseline=c.getContext('2d').getImageData(0,0,c.width,c.height).data;});
  if(i===0)await page.screenshot({path:'qa/condensation-trace-before.png'});
  // A narrow sweep crosses the real guide. Only guide pixels may darken.
  await page.mouse.move(box.x+2,box.y+box.height*.47);await page.mouse.down();await page.mouse.move(box.x+box.width-2,box.y+box.height*.47,{steps:20});await page.mouse.up();
  const result=await canvas.evaluate(c=>{const a=c.getContext('2d').getImageData(0,0,c.width,c.height).data,b=c.baseline;let changed=0,transparent=0,outside=0;for(let n=0;n<a.length;n+=4){if(a[n+3]!==255)transparent++;if(a[n]!==b[n]||a[n+1]!==b[n+1]||a[n+2]!==b[n+2]){changed++;if(n/4%c.width<20)outside++;}}return{changed,transparent,outside};});
  expect(result.transparent).toBe(0);expect(result.outside).toBe(0);expect(result.changed).toBeGreaterThan(50);expect(result.changed).toBeLessThan(8000);
  if(i===0)await page.screenshot({path:'qa/condensation-trace-after.png'});
  await active.getByRole('button',{name:'다시 그리기',exact:true}).click();
  expect(await canvas.evaluate(c=>{const a=c.getContext('2d').getImageData(0,0,c.width,c.height).data;return a.every((v,n)=>v===c.baseline[n]);})).toBe(true);
  await active.getByRole('button',{name:'패턴 보기',exact:true}).focus();await page.keyboard.press('Enter');await expect(active.getByRole('button',{name:'패턴 보기',exact:true})).toBeDisabled();
 }
});

test('reduced motion entry retains both phrases, a separated keyboard entry and a paused film',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/?intro=1');const button=page.getByRole('button',{name:'ENTER THE ROOM',exact:true});await expect(button).toBeEnabled({timeout:30000});
 for(const p of await page.locator('.gate-copy p').all())await expect(p).toHaveCSS('opacity','1');
 const bounds=await page.locator('.entry-gate').evaluate(e=>({copy:e.querySelector('.gate-copy').getBoundingClientRect().bottom,button:e.querySelector('button').getBoundingClientRect().top}));expect(bounds.button-bounds.copy).toBeGreaterThan(10);await expect.poll(()=>page.locator('.opening-video').evaluate(v=>v.paused)).toBe(true);
 await button.focus();await page.keyboard.press('Enter');await expect(page.locator('.preloader')).toHaveCount(0);await expect(page.locator('#opening-title')).toBeFocused();
});

test('touch traces fine guide lines without scrolling; the surrounding page still scrolls',async({browser})=>{
 const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true,reducedMotion:'reduce'});
 try{
  const page=await context.newPage();await page.goto('/?intro=1');await page.getByRole('button',{name:'ENTER THE ROOM',exact:true}).tap();await expect(page.locator('.preloader')).toHaveCount(0);await go(page,'collection',.06);
  const canvas=page.locator('.pattern-drawing');await expect(canvas).toHaveAttribute('data-frost-ready','true');const box=await page.locator('.atelier-scene.is-active .pattern').boundingBox(),client=await context.newCDPSession(page),before=await page.evaluate(()=>scrollY);
  const touch=(type,x,y)=>client.send('Input.dispatchTouchEvent',{type,touchPoints:type==='touchEnd'?[]:[{x,y,radiusX:1,radiusY:1,force:.5}]});
  await touch('touchStart',box.x+2,box.y+box.height*.47);for(let i=1;i<=12;i++)await touch('touchMove',box.x+box.width*i/13,box.y+box.height*.47);await touch('touchEnd');
  await expect(page.locator('.atelier-scene.is-active').getByRole('button',{name:'다시 그리기'})).toBeEnabled();expect(await page.evaluate(()=>scrollY)).toBe(before);
  expect(await canvas.evaluate(c=>c.getContext('2d').getImageData(0,0,c.width,c.height).data.every((v,n)=>n%4!==3||v===255))).toBe(true);await page.screenshot({path:'qa/condensation-trace-mobile.png'});
  await touch('touchStart',382,700);for(let i=1;i<=10;i++){await touch('touchMove',382,700-i*35);await page.waitForTimeout(20);}await touch('touchEnd');await expect.poll(()=>page.evaluate(()=>scrollY)).toBeGreaterThan(before+100);
 }finally{await context.close();}
});
