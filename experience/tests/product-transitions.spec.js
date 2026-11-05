import {test,expect} from '@playwright/test';

test('scrolling between products uses one entrance, including reverse navigation',async({page})=>{
  test.setTimeout(90000);
  await page.goto('/');
  const canvas=page.locator('.product-canvas');
  const scene=()=>canvas.getAttribute('data-scene').then(value=>JSON.parse(value||'{}'));
  await expect.poll(async()=>(await scene()).models,{timeout:60000}).toBe(5);
  for(const index of [0,1,2,3,4,3,2,1,0]){
    await page.evaluate(index=>{
      const section=document.getElementById('showcase');
      scrollTo(0,section.getBoundingClientRect().top+scrollY+(section.offsetHeight-innerHeight)*(index+.06)/5);
    },index);
    await expect.poll(async()=>{
      const state=await scene();
      return {selected:state.selected,segment:state.segment,transitioning:state.transitioning,outgoing:state.outgoing?.length};
    }).toEqual({selected:index,segment:index,transitioning:false,outgoing:0});
  }
  await expect(page.locator('.product-guidance,.product-next')).toHaveCount(0);
});
