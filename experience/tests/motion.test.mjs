import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,statSync} from 'node:fs';
import {createHash} from 'node:crypto';
const readGLB=id=>{const b=readFileSync(new URL(`../public/models/luum-${id}.glb`,import.meta.url));assert.equal(b.readUInt32LE(0),0x46546c67);assert.equal(b.readUInt32LE(8),b.length);return JSON.parse(b.subarray(20,20+b.readUInt32LE(12)).toString())};
test('five genuine GLBs retain distinct body geometry, gold rings and gold patterns',()=>{
 const geometries=[];
 for(let i=1;i<=5;i++){
  const id=String(i).padStart(2,'0'),g=readGLB(id);
  assert.equal(g.meshes.length,3);assert.ok(g.meshes.some(m=>/BODY/i.test(m.name)));assert.ok(g.meshes.some(m=>/GOLD_top_rim/i.test(m.name)));assert.ok(g.meshes.some(m=>m.name===`ENGRAVING_${id}`));
  const gold=g.materials.find(m=>m.name==='LUUM_GOLD_CHAMPAGNE_SATIN');assert.ok(gold.pbrMetallicRoughness.metallicFactor>.97);assert.ok(!gold.extensions?.KHR_materials_anisotropy);
  const body=g.materials.find(m=>m.name===`LUUM_QUARTZ_${id}`);assert.ok(body.pbrMetallicRoughness.baseColorTexture);assert.ok(body.normalTexture);
  assert.ok(g.extensionsRequired.includes('EXT_meshopt_compression'));assert.ok(statSync(new URL(`../public/models/luum-${id}.glb`,import.meta.url)).size<4_000_000);
  geometries.push(g.meshes.map(m=>m.primitives.map(p=>g.accessors[p.indices].count)).flat().join(','));
 }
 assert.equal(new Set(geometries).size,5);
});
test('the supplied brand font is byte-for-byte preserved',()=>{
 const expected=JSON.parse(readFileSync(new URL('../docs/asset-integrity.json',import.meta.url))).files['luum/experience/public/media/LUUM.woff2'];
 assert.equal(createHash('sha256').update(readFileSync(new URL('../public/media/LUUM.woff2',import.meta.url))).digest('hex'),expected);
});
