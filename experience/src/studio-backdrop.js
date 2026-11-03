import * as THREE from 'three';
import gsap from 'gsap';
import {products} from './content';

// An original studio backdrop: diffuse depth, restrained grain and a few defocused flecks.
// No assets or shader source from Random-eyes are reused. No water displacement.
function createCloudTexture(){
  const size=256,data=new Uint8Array(size*size*4);
  const hash=(x,y,period)=>{x=((x%period)+period)%period;y=((y%period)+period)%period;let n=Math.imul(x,374761393)+Math.imul(y,668265263);n=Math.imul(n^(n>>>13),1274126177);return((n^(n>>>16))>>>0)/4294967295;};
  const noise=(u,v,period)=>{let x=Math.floor(u),y=Math.floor(v),a=u-x,b=v-y;a=a*a*(3-2*a);b=b*b*(3-2*b);return(1-b)*((1-a)*hash(x,y,period)+a*hash(x+1,y,period))+b*((1-a)*hash(x,y+1,period)+a*hash(x+1,y+1,period));};
  for(let y=0;y<size;y++)for(let x=0;x<size;x++){
    const u=x/size,v=y/size;const value=noise(u*8,v*8,8)*.6+noise(u*16,v*16,16)*.28+noise(u*32,v*32,32)*.12;const i=(y*size+x)*4;
    data[i]=data[i+1]=data[i+2]=Math.round(value*255);data[i+3]=255;
  }
  const t=new THREE.DataTexture(data,size,size);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.magFilter=t.minFilter=THREE.LinearFilter;t.needsUpdate=true;return t;
}
export class StudioBackdrop{
 constructor(scene){
  this.texture=createCloudTexture();this.uniforms={uColor:{value:new THREE.Color(products[0].studioBg)},uTime:{value:0},uAspect:{value:1},uPointer:{value:new THREE.Vector2()},uCloud:{value:this.texture}};
  this.geometry=new THREE.BufferGeometry();this.geometry.setAttribute('position',new THREE.Float32BufferAttribute([-1,-1,0,3,-1,0,-1,3,0],3));
  this.material=new THREE.ShaderMaterial({uniforms:this.uniforms,depthTest:false,depthWrite:false,toneMapped:false,
   vertexShader:'varying vec2 vUv;void main(){vUv=position.xy*.5+.5;gl_Position=vec4(position.xy,.999,1.);}',
   fragmentShader:`precision highp float;varying vec2 vUv;uniform vec3 uColor;uniform float uTime,uAspect;uniform vec2 uPointer;uniform sampler2D uCloud;
    void main(){vec2 uv=vUv,p=(uv-.5)*vec2(uAspect,1.);vec2 pointer=uPointer*vec2(.035,-.025);
      float cloud=texture2D(uCloud,p*.24+vec2(.42,.36)+vec2(uTime*.0015,-uTime*.001)).r;
      float diffusion=texture2D(uCloud,p*.13+vec2(.16,-.18)+pointer*.2).r;
      vec2 q=(p-vec2(-.23,.08)-pointer)*vec2(.9,1.35);float pool=exp(-dot(q,q)*1.6);
      float edge=clamp(dot(p*vec2(.6,.85),p*vec2(.6,.85)),0.,1.);
      float fold=p.x*.53+p.y*.78+.06*sin(p.y*2.1);
      float shade=smoothstep(-.32,.12,fold)*.22;
      float grazing=exp(-pow(fold-.18-pointer.x,2.)/.018);
      float floorLight=exp(-pow((uv.y-.30)*8.,2.))*exp(-pow((uv.x-.5)*2.,2.));
      float shaft=exp(-pow(p.x*.42+p.y*.7-.12-pointer.x,2.)/.045);
      // Neutral light preserves the selected stone's hue, including the white vessels.
      float illumination=.80+pool*.14+(cloud-.5)*.12+(diffusion-.5)*.05-edge*.08-shade*.35+floorLight*.04;
      vec3 color=uColor*illumination;
      color+=(vec3(1.)-uColor)*shaft*.012+uColor*grazing*.035;
      float grain=fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453)-.5;color+=grain*.003;
      gl_FragColor=vec4(color,1.);#include <colorspace_fragment>
    }`.replace(';}#',';}\n#').replace(';#include',';\n#include')});
  this.mesh=new THREE.Mesh(this.geometry,this.material);this.mesh.frustumCulled=false;this.mesh.renderOrder=-100;scene.add(this.mesh);
  const positions=[];for(let i=0;i<12;i++)positions.push((Math.sin(i*127.1+4)*43758.5)%1*.5+.5,(Math.cos(i*311.7+8)*36234.2)%1*.5+.5,(i*7%11)/11);
  this.dustGeometry=new THREE.BufferGeometry();this.dustGeometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
  this.dustMaterial=new THREE.ShaderMaterial({uniforms:{uTime:this.uniforms.uTime,uDpr:{value:1}},transparent:true,depthTest:false,depthWrite:false,toneMapped:false,
   vertexShader:'uniform float uTime,uDpr;varying float alpha;void main(){vec2 p=fract(position.xy+vec2(sin(uTime*.06+position.z*6.)*.003,uTime*(.001+position.z*.001)));gl_Position=vec4(p*2.-1.,.998,1.);gl_PointSize=(3.+position.z*9.)*uDpr;alpha=.05+position.z*.16;}',
   fragmentShader:'varying float alpha;void main(){float r=length(gl_PointCoord-.5)*2.;float a=pow(max(0.,1.-r),2.)*alpha;gl_FragColor=vec4(1.,.95,.83,a);}'
  });this.dust=new THREE.Points(this.dustGeometry,this.dustMaterial);this.dust.frustumCulled=false;this.dust.renderOrder=-99;scene.add(this.dust);
 }
 select(index,reduced){const c=new THREE.Color(products[index].studioBg);gsap.to(this.uniforms.uColor.value,{r:c.r,g:c.g,b:c.b,duration:reduced?.01:2.4,ease:'sine.inOut',overwrite:true});}
 update(time,x,y,width,height,dpr,reduced){this.uniforms.uTime.value=reduced?0:time;this.uniforms.uPointer.value.set(x,y);this.uniforms.uAspect.value=width/height;this.dustMaterial.uniforms.uDpr.value=dpr;}
 dispose(){gsap.killTweensOf(this.uniforms.uColor.value);this.mesh.removeFromParent();this.dust.removeFromParent();this.texture.dispose();this.geometry.dispose();this.material.dispose();this.dustGeometry.dispose();this.dustMaterial.dispose();}
}
