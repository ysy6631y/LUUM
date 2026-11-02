import * as THREE from 'three';
import gsap from 'gsap';
import { products } from './content';

// One full-screen triangle: flowing daylight, a sheer shadow and quiet caustics.
// This is separate from the product canvas so the five-model collection can stay still.
export class Atmosphere {
  constructor(canvas) {
    this.canvas = canvas;
    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'low-power' });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 700 ? 1 : 1.25));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.scene = new THREE.Scene(); this.camera = new THREE.Camera();
    this.uniforms = {
      uTime: { value: 0 }, uAspect: { value: 1 },
      uColor: { value: new THREE.Color(products[3].bg) },
      uPointer: { value: new THREE.Vector2() },
      uDepth: { value: 0 },
    };
    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute('position', new THREE.Float32BufferAttribute([-1,-1,0, 3,-1,0, -1,3,0],3));
    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms, depthTest: false, depthWrite: false, toneMapped: false,
      vertexShader: `varying vec2 vUv;
        void main(){vUv=position.xy*.5+.5;gl_Position=vec4(position,1.0);}`,
      fragmentShader: `
        precision highp float;
        varying vec2 vUv;
        uniform float uTime,uAspect,uDepth;
        uniform vec3 uColor;
        uniform vec2 uPointer;
        float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
        void main(){
          float t=uTime*1.35;
          vec2 uv=vUv;
          vec2 p=(uv-.5)*vec2(uAspect,1.0);
          p+=uPointer*.025;
          vec2 warp=p+vec2(sin(p.y*3.8+t*.17),cos(p.x*3.2-t*.13))*.20;
          // A broad, wandering fold of daylight, rather than a uniform gradient.
          float fold=sin(warp.x*4.4+warp.y*5.6+sin(warp.y*3.0-t*.12)*1.3+t*.10);
          float silk=pow(.5+.5*fold,3.0);
          float shade=pow(.5+.5*sin(p.x*3.8+p.y*2.5+sin(p.y*2.7+t*.10)*.65),4.0);
          // Bent, low-contrast reflection lines stay behind the object.
          vec2 q=warp*4.0;
          float a=sin(q.x+sin(q.y*1.4+t*.20)*.65-t*.15);
          float b=sin(q.y*.9+sin(q.x*1.1-t*.16)*.8+t*.12);
          float water=pow(clamp(1.0-abs(a+b)*.65,0.0,1.0),12.0);
          float sun=exp(-pow(p.x*.70+p.y*.90-.30*sin(t*.19),2.0)/.035);
          float pool=exp(-length((p-vec2(-.28,.2))*vec2(.8,1.35))*1.1);
          vec3 color=uColor*(.90-shade*.11+silk*.13);
          color+=vec3(1.0,.965,.88)*(silk*.070+water*.045+pool*.055+sun*.060);
          color=mix(color,color*.965,uDepth*.35);
          color+=(hash(gl_FragCoord.xy)-.5)/650.0;
          gl_FragColor=vec4(color,1.0);
          #include <colorspace_fragment>
        }`,
    });
    this.scene.add(new THREE.Mesh(this.geometry,this.material));
    this.resize=()=>{this.renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<700?1:1.25));this.renderer.setSize(innerWidth,innerHeight);this.uniforms.uAspect.value=innerWidth/innerHeight;this.dirty=true;};
    this.resize(); window.addEventListener('resize',this.resize);
    this.pointer=new THREE.Vector2();
    this.draw=this.draw.bind(this);this.frame=requestAnimationFrame(this.draw);
  }
  select(index,reduced=false) {
    const color=new THREE.Color(products[index].bg);
    gsap.to(this.uniforms.uColor.value,{r:color.r,g:color.g,b:color.b,duration: reduced ? .01 : 1.8,ease:'sine.inOut',overwrite:true,onUpdate:()=>{this.dirty=true;}});
  }
  setReducedMotion(value){this.reduced=value;this.dirty=true;}
  update(x,y,depth){this.pointer.set(x,y);if(this.uniforms.uDepth.value!==depth/4)this.dirty=true;this.uniforms.uDepth.value=depth/4;}
  draw(now){
    if(this.disposed)return;
    this.frame=requestAnimationFrame(this.draw);
    if(document.hidden){this.previous=now;return;}
    const interval=innerWidth<700?50:40;
    if(now-(this.lastFrame||0)<interval)return;
    const dt=Math.min(.08,(now-(this.previous||now))/1000);this.previous=now;this.lastFrame=now;
    if(!this.reduced)this.uniforms.uTime.value+=dt;
    this.uniforms.uPointer.value.lerp(this.pointer,this.reduced?1:.045);
    if(!this.reduced||this.dirty){this.renderer.render(this.scene,this.camera);this.canvas.dataset.lightTime=this.uniforms.uTime.value.toFixed(3);this.dirty=false;}
  }
  dispose(){this.disposed=true;cancelAnimationFrame(this.frame);window.removeEventListener('resize',this.resize);gsap.killTweensOf(this.uniforms.uColor.value);this.geometry.dispose();this.material.dispose();this.renderer.dispose();}
}
