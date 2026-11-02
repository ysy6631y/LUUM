import * as THREE from 'three';

// A soft sheer-fabric mask projected by a real PBR light onto the supplied meshes.
export function createDaylightMap() {
  const size=256, data=new Uint8Array(size*size*4);
  for(let y=0;y<size;y++)for(let x=0;x<size;x++){
    const u=x/(size-1)-.5, v=y/(size-1)-.5;
    const fold=u*.78+v*.62+Math.sin(v*5)*.045;
    const broad=Math.exp(-Math.pow(fold-.06,2)/.017);
    const fine=Math.exp(-Math.pow(fold+.29,2)/.006)*.4;
    const veil=.5+.5*Math.sin(u*14+v*9+Math.sin(v*6)*.7);
    const value=Math.min(1,.045+broad*.78+fine+veil*.10);
    const i=(y*size+x)*4;
    data[i]=data[i+1]=data[i+2]=Math.round(value*255);data[i+3]=255;
  }
  const map=new THREE.DataTexture(data,size,size,THREE.RGBAFormat);
  map.minFilter=map.magFilter=THREE.LinearFilter;map.needsUpdate=true;
  return map;
}
