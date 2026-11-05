import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import gsap from 'gsap';
import { asset, products } from './content';
import { createDaylightMap } from './daylight';
import { productJourney, cameraChapter } from './journey';
import { StudioBackdrop } from './studio-backdrop';

const lerp = THREE.MathUtils.lerp;
const clamp = THREE.MathUtils.clamp;
const smooth = t => t * t * (3 - 2 * t);

export class ProductScene {
  constructor(canvas, { onProgress, onReady, onError, onPick, onSequence, onJourney }) {
    this.canvas = canvas;
    this.disposed = false;
    this.selected = 0;
    this.gallery = { value: 0 };
    this.scroll = 0;
    this.progress = 0;
    this.pointer = { x: 0, y: 0, sx: 0, sy: 0 };
    this.drag = 0;
    this.dragTarget = 0; this.dragTilt = 0; this.dragTiltTarget = 0;
    this.intro = { value: 1 }; this.lighting = { warmth: .5, shift: 0 };
    this.elapsed = 0;
    this.models = [];
    this.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.scene = new THREE.Scene();
    this.backdrop=new StudioBackdrop(this.scene);
    this.camera = new THREE.PerspectiveCamera(30, 1, .05, 90);
    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 700 ? 1.25 : 1.5));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = .95;
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    const room = new RoomEnvironment();
    this.environment = pmrem.fromScene(room, .04);
    this.scene.environment = this.environment.texture;
    this.scene.environmentIntensity = .75;
    room.dispose(); pmrem.dispose();
    this.key = new THREE.DirectionalLight('#fff8e9', 1.7);
    this.key.position.set(-4, 6, 5); this.scene.add(this.key);
    const fill = this.fill = new THREE.DirectionalLight('#f4eee5', .65);
    fill.position.set(4, 2, 3); this.scene.add(fill);
    const rim = this.rim = new THREE.DirectionalLight('#fff5d8', 1.4);
    rim.position.set(2, 5, -3); this.scene.add(rim);
    this.sun = new THREE.SpotLight('#fff4e1',140,0,.57,.86,2);
    this.sun.position.set(-3.6,4.6,5.5);
    this.sun.map = createDaylightMap();
    this.sun.target.position.set(0,.4,0);
    // SpotLight.map uses its projection matrix without a shadow-map render pass in r187.
    this.scene.add(this.sun,this.sun.target);
    this.scene.add(new THREE.HemisphereLight('#fffaf0', '#8c7762', .45));
    this.raycaster = new THREE.Raycaster();
    this.onPick = onPick;
    this.onSequence=onSequence; this.onJourney=onJourney;
    this.stage=productJourney(0);this.targetJourney=this.stage;
    this.resize = () => {
      this.mobile = innerWidth < 700;
      this.camera.aspect = innerWidth / innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setPixelRatio(Math.min(devicePixelRatio,this.mobile?1.25:1.5));
      this.renderer.setSize(innerWidth, innerHeight);
      this.readScroll();
    };
    this.readScroll = () => {
      const section = document.getElementById('showcase');
      if (!section) return;
      this.active = scrollY > section.offsetTop-innerHeight && scrollY < section.offsetTop+section.offsetHeight;
      this.targetJourney=productJourney((scrollY-section.offsetTop)/Math.max(1,section.offsetHeight-innerHeight));
      this.scroll=this.targetJourney.camera;
      if(this.active&&this.ready&&!this.down&&this.targetJourney.index!==this.selected){
        this.select(this.targetJourney.index,{scrollDriven:true});this.onSequence?.(this.targetJourney.index);
      }
    };
    this.move = e => {
      this.pointer.x = (e.clientX / innerWidth - .5) * 2;
      this.pointer.y = (e.clientY / innerHeight - .5) * 2;
      if (this.down && this.gallery.value < .01 && this.progress < 3.7) {
        this.dragTarget += (e.clientX - this.lastX) * .006;
        // Horizontal drag turns the complete solid object. Vertical touch stays native scroll.
        if (e.pointerType !== 'touch') this.dragTiltTarget = clamp(this.dragTiltTarget + (e.clientY-this.lastY)*.002, -.38, .38);
        this.lastX = e.clientX; this.lastY = e.clientY; this.lastInteraction = this.elapsed;
      }
    };
    this.pointerDown = e => {
      this.down = true; this.lastX = e.clientX; this.lastY = e.clientY; this.lastInteraction = this.elapsed; this.startX = e.clientX; this.startY = e.clientY;
      canvas.style.cursor = 'grabbing';
      if(e.pointerType !== 'touch') canvas.setPointerCapture(e.pointerId);
    };
    this.pointerUp = e => {
      if (this.down && (this.gallery.value > .9 || this.progress > 3.98) && Math.hypot(e.clientX - this.startX, e.clientY - this.startY) < 10) {
        this.raycaster.setFromCamera(new THREE.Vector2(e.clientX / innerWidth * 2 - 1, -e.clientY / innerHeight * 2 + 1), this.camera);
        const hits = this.raycaster.intersectObjects(this.models.filter(Boolean), true);
        if (hits.length) { let o = hits[0].object; while (o.parent && o.userData.productIndex === undefined) o = o.parent; if (o.userData.productIndex !== undefined) this.onPick(o.userData.productIndex); }
      }
      this.down = false; this.readScroll(); canvas.style.cursor = this.gallery.value > .5 ? 'pointer' : 'grab';
    };
    this.contextLost = e => { e.preventDefault(); onError('context'); };
    this.onPreference = () => this.setReducedMotion(this.manualReduced);
    this.preference = matchMedia('(prefers-reduced-motion: reduce)');
    this.preference.addEventListener('change', this.onPreference);
    window.addEventListener('resize', this.resize);
    window.addEventListener('scroll', this.readScroll, { passive: true });
    window.addEventListener('pointermove', this.move, { passive: true });
    canvas.addEventListener('pointerdown', this.pointerDown);
    window.addEventListener('pointerup', this.pointerUp);
    canvas.addEventListener('webglcontextlost', this.contextLost);
    canvas.addEventListener('pointercancel', this.pointerUp);
    this.resize();
    this.tick = this.tick.bind(this);
    this.frame = requestAnimationFrame(this.tick);
    this.load(onProgress, onReady, onError);
  }
  async load(onProgress, onReady, onError) {
    const loader = new GLTFLoader(); loader.setMeshoptDecoder(MeshoptDecoder);
    let loaded = 0;
    // Load the opening ivory object first; serial loading bounds decode/memory spikes.
    for (const i of [3, 0, 1, 2, 4]) {
      try {
        const gltf = await loader.loadAsync(asset(`models/luum-${products[i].id}.glb`));
        if (this.disposed) { this.disposeObject(gltf.scene); return; }
        const object = gltf.scene;
        const box = new THREE.Box3().setFromObject(object), center = box.getCenter(new THREE.Vector3()), sourceSize = box.getSize(new THREE.Vector3());
        object.position.sub(center);
        const group = new THREE.Group(); group.add(object); group.scale.setScalar(4 / .19);
        // Bake export uses metres. A wrapper keeps the original scale/proportions intact.
        const root = new THREE.Group(); root.add(group);
        root.userData = { productIndex: i, sourceSize, nativeHeight:sourceSize.y*4/.19, nativeWidth:sourceSize.x*4/.19, assetId: products[i].id, meshNames: gltf.parser.json.meshes.map(m=>m.name), weight: i === this.selected ? 1 : 0, side: 1, materials: [] };
        object.traverse(mesh => {
          if (!mesh.isMesh) return;
          mesh.material = mesh.material.clone();
          if (mesh.material.anisotropy) mesh.material.anisotropy = 0;
          mesh.material.envMapIntensity = mesh.material.metalness > .8 ? 1.4 : .8;
          if (mesh.material.map) mesh.material.map.anisotropy = Math.min(4, this.renderer.capabilities.getMaxAnisotropy());
          mesh.material.transparent = false; mesh.material.opacity = 1; mesh.material.depthWrite = true;
          root.userData.materials.push(mesh.material);
        });
        const shadowCanvas = document.createElement('canvas'); shadowCanvas.width = 128; shadowCanvas.height = 64;
        const ctx = shadowCanvas.getContext('2d');
        const grad = ctx.createRadialGradient(64,32,1,64,32,60); grad.addColorStop(0,'rgba(55,43,27,.32)'); grad.addColorStop(.4,'rgba(55,43,27,.13)'); grad.addColorStop(1,'rgba(55,43,27,0)');
        ctx.fillStyle=grad;ctx.fillRect(0,0,128,64);
        const shadow = new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(shadowCanvas),depthWrite:false,opacity:.5}));
        root.userData.shadow = shadow; this.scene.add(shadow);
        this.models[i] = root; this.scene.add(root);
        loaded++; onProgress(Math.round(loaded / 5 * 100));
      } catch (error) { if (!this.disposed) onError(error.message); return; }
    }
    if (!this.disposed) { this.ready = true; onReady(); this.readScroll(); }
  }
  rotate(delta) { this.dragTarget += delta; this.lastInteraction = this.elapsed; }
  select(index, {scrollDriven=false} = {}) {
    if (index === this.selected) return;
    const previous = this.selected;
    this.selected = index;
    this.backdrop.select(index,this.reduced);
    this.progress=scrollDriven?this.targetJourney.camera:0;this.gallery.value=0;
    if(scrollDriven)this.stage={...this.targetJourney};
    const direction = index > previous ? 1 : -1;
    this.drag=this.dragTarget=0;this.dragTilt=this.dragTiltTarget=0;
    gsap.to(this.lighting, { warmth: [1,.8,.6,.3,.15][index], shift: (index-2)*.23, duration: this.reduced ? .01 : 2.4, ease: 'sine.inOut', overwrite: true });
    for (let i = 0; i < this.models.length; i++) {
      const model = this.models[i]; if (!model) continue;
      gsap.killTweensOf(model.userData);
      // Native scrolling already supplies departure and arrival. A second
      // timed slide here would replay the exit and move the incoming vessel
      // sideways while its scroll entrance moves it vertically.
      if(scrollDriven){
        model.userData.outgoing=null;
        model.userData.side=0;
        model.userData.weight=i===index?1:0;
        model.visible=i===index;
        model.userData.shadow.visible=i===index;
        continue;
      }
      // Preserve the outgoing object's last rendered pose. Resetting the shared
      // camera passage must never snap a still-visible close-up back to the hero.
      model.userData.outgoing=i!==index&&model.visible?{position:model.position.clone(),rotation:model.rotation.clone(),scale:model.scale.clone(),weight:Math.max(.001,model.userData.weight),direction:-direction}:null;
      model.userData.side = i === index ? direction : -direction;
      if(i===index)model.userData.weight=0;
      gsap.to(model.userData, { weight: i === index ? 1 : 0, duration: this.reduced ? .01 : 1.7, ease: 'sine.inOut' });
    }
  }
  resetForExhibition() {
    this.select(0,{scrollDriven:true});
    this.down=false;
    this.drag=this.dragTarget=this.dragTilt=this.dragTiltTarget=0;
    this.progress=this.scroll=0;this.gallery.value=0;
    this.stage=productJourney(0);this.targetJourney=this.stage;
    for(let i=0;i<this.models.length;i++){
      const model=this.models[i];if(!model)continue;
      gsap.killTweensOf(model.userData);
      model.userData.weight=i===0?1:0;
      model.userData.outgoing=null;model.userData.side=0;
    }
  }
  setGallery(open) {
    gsap.to(this.gallery, { value: open ? 1 : 0, duration: this.reduced ? .01 : 1.2, ease: 'power3.inOut', overwrite: true });
    this.canvas.style.cursor = open ? 'pointer' : 'grab';
  }
  enter() {
    gsap.to(this.intro, { value: 0, duration: this.reduced ? .01 : 2.8, ease: 'power3.inOut', overwrite: true });
  }
  setReducedMotion(value = false) {
    this.manualReduced = value; this.reduced = value || this.preference.matches;
  }
  pose(progress) {
    const m = this.mobile;
    const poses = [
      [m ? 0 : -1.15, m ? .7 : .6, 0, .12, -.18, -.10, m ? .63 : .69],
      [m ? .15 : 1.65, m ? .15 : -1.0, 0, .10, -.42, .12, m ? 1.08 : 1.72],
      [m ? 0 : -1.6, m ? -1.1 : -2.35, 0, .52, .23, -.18, m ? 1.25 : 1.85],
      [m ? 0 : -1.45, m ? 1.85 : 2.65, 0, .02, -.12, -.08, m ? 1.25 : 1.75],
      [0, .4, 0, .12, -.12, 0, .69],
    ];
    const k = Math.min(3, Math.floor(progress)), t = smooth(progress - k);
    return poses[k].map((n, i) => lerp(n, poses[k + 1][i], t));
  }
  tick(now) {
    if (this.disposed) return;
    this.frame = requestAnimationFrame(this.tick);
    if (document.hidden || (this.ready && !this.active && this.canvas.dataset.scene)) { this.lastTime = now; return; }
    const dt = Math.min(.05, (now - (this.lastTime || now)) / 1000); this.lastTime = now;
    const damping = this.reduced ? 1 : 1 - Math.exp(-dt * 5);
    if (!this.down) {
      this.progress = lerp(this.progress, this.scroll, damping);
      const next=this.targetJourney,changed=next.index!==this.stage.index;
      this.stage={...next,arrival:changed?next.arrival:lerp(this.stage.arrival,next.arrival,damping),departure:changed?next.departure:lerp(this.stage.departure,next.departure,damping)};
    }
    this.pointer.sx = lerp(this.pointer.sx, this.reduced ? 0 : this.pointer.x, damping);
    this.pointer.sy = lerp(this.pointer.sy, this.reduced ? 0 : this.pointer.y, damping);
    this.elapsed += dt;
    this.drag = lerp(this.drag, this.dragTarget, this.reduced ? 1 : 1-Math.exp(-dt*14));
    this.dragTilt = lerp(this.dragTilt, this.dragTiltTarget, this.reduced ? 1 : 1-Math.exp(-dt*14));
    const end = smooth(clamp((this.progress-3.48)/.52,0,1));
    const pose = this.pose(this.progress), g = Math.max(this.gallery.value, end);
    const intro = this.intro.value;
    const idleStrength = this.reduced || this.down ? 0 : smooth(clamp((this.elapsed-(this.lastInteraction || -3)-1)/2,0,1))*(1-g);
    const idle = Math.sin(this.elapsed*.21)*idleStrength;
    // Portrait screens keep the full object in view without stretching its geometry.
    const cameraZ = 10.5 + Math.sin(this.progress*Math.PI)*.12 + this.lighting.shift*.18;
    const galleryZ = this.mobile ? Math.max(12, 7.8 / (this.camera.aspect * .536)) : 12;
    const labelsWidth = this.mobile ? innerWidth * .91 : Math.min(innerHeight * 1.55, innerWidth * .91);
    const galleryStep = labelsWidth / innerHeight / 5 * (2 * Math.tan(Math.PI / 12) * galleryZ);
    this.camera.position.set(this.pointer.sx * .16 * (1-g), .45 - this.pointer.sy * .12 * (1-g), lerp(cameraZ, galleryZ, g));
    this.camera.lookAt(0, .05, 0);
    const daylightTime = this.reduced?0:this.elapsed*.09;
    this.key.position.x = -4 + this.pointer.sx * .7 * (1-g) + Math.sin(daylightTime*.18)*.35 + this.lighting.shift;
    const signatureLight = Math.exp(-Math.pow((this.progress-3)/.45,2));
    this.key.position.x -= signatureLight*2.5;
    this.key.position.z = 5-signatureLight*3.4;
    this.key.intensity = 1.4+signatureLight*.25;
    this.key.position.y = 6 + Math.sin(this.progress*.9)*.55;
    this.key.color.setRGB(1, .96-this.lighting.warmth*.035, .88-this.lighting.warmth*.05);
    this.rim.intensity = 1.4 + Math.sin(this.progress*1.1)*.14;
    this.fill.intensity = .65 - signatureLight*.25 + Math.cos(daylightTime*.16)*.035*(this.reduced?0:1);
    const daylightPhase = daylightTime*.28;
    this.sun.position.set(-3.6+Math.sin(daylightPhase)*1.1,4.6+Math.cos(daylightPhase*.7)*.45,5.5);
    this.sun.target.position.set(Math.sin(daylightPhase*.8)*1.3,.35+Math.cos(daylightPhase)*.65,0);
    this.sun.intensity = 140+Math.sin(daylightPhase*.65)*16;
    const travel = Math.max(4.7, 2*Math.tan(Math.PI/12)*cameraZ*this.camera.aspect*.7+1);
    const grounding=1-smooth(clamp(this.progress/.6,0,1));
    const referenceHeight=Math.max(4,...this.models.filter(Boolean).map(m=>m.userData.nativeHeight));
    this.models.forEach((model, i) => {
      const weight = model.userData.weight, visibility = lerp(weight, 1, g);
      model.visible = visibility > .001;
      if (!model.visible) { model.userData.shadow.visible = false; return; }
      const heroScale = pose[6];
      const galleryX = (i - 2) * galleryStep;
      model.position.set(lerp(lerp(pose[0], this.mobile ? .7 : 2.2, intro) + (1-weight) * travel * model.userData.side, galleryX, g), lerp(lerp(pose[1], -.85, intro) + idle*.025, .1, g), lerp(-(1-weight)*2.0, 0, g));
      model.rotation.set(lerp(pose[3] + this.dragTilt + this.pointer.sy * .025 + idle*.008, 0, g), lerp(pose[4] + this.drag + this.pointer.sx * .06 + idle*.025 + intro*.35 + (1-weight)*.32*model.userData.side, -.12, g), lerp(pose[5] - intro*.12, 0, g));
      // Original metre dimensions determine the relative size of all five vessels.
      model.scale.setScalar(lerp(lerp(heroScale, this.mobile ? 1.1 : 1.6, intro), .55, g));
      const heroGroundOffset=(model.userData.nativeHeight-referenceHeight)*model.scale.x*.5*grounding;
      const galleryCenter=.1+(model.userData.nativeHeight-referenceHeight)*model.scale.x*.5;
      const heroCenter=lerp(pose[1],-.85,intro)+idle*.025+heroGroundOffset;
      model.position.y=lerp(heroCenter,galleryCenter,g);
      // Opaque entrances and exits separate the five scroll chapters.
      model.position.y-=(1-this.stage.arrival)*4.5*(1-g);
      model.position.x-=this.stage.departure*travel*(1-g);
      const outgoing=model.userData.outgoing;
      if(i!==this.selected&&outgoing&&g<.001){
        const exit=smooth(clamp(1-weight/outgoing.weight,0,1));
        model.position.copy(outgoing.position);model.position.x+=outgoing.direction*travel*exit;model.position.z-=exit*.8;
        model.rotation.copy(outgoing.rotation);model.scale.copy(outgoing.scale);
      }
      const shadow = model.userData.shadow;
      shadow.visible = model.visible;
      const floor = model.position.y - model.userData.nativeHeight * model.scale.x / 2 - .06;
      shadow.position.set(model.position.x-Math.sin(daylightPhase)*.035, floor, -.45);
      shadow.scale.set(model.userData.nativeWidth * 1.2 * model.scale.x, .17 * model.scale.x, 1);
      shadow.material.opacity = visibility * .55;
      // Never alpha-fade individual mesh surfaces: that exposes the bottle's inside.
      // Switching uses solid silhouettes moving through depth instead of hollow shells.
      for (const mat of model.userData.materials) {
        mat.opacity = 1; mat.depthWrite = true;
      }
    });
    this.backdrop.update(this.elapsed*.55,this.pointer.sx,this.pointer.sy,innerWidth,innerHeight,this.renderer.getPixelRatio(),this.reduced);
    this.onJourney?.({chapter:cameraChapter(this.progress),presence:Math.min(this.stage.arrival*1.5,1)*(1-this.stage.departure)*(this.models[this.selected]?.userData.weight??0),index:this.selected});
    const signature = [this.reduced?0:Math.floor(this.elapsed*24),Math.floor(daylightTime*12), this.progress, this.stage.arrival, this.stage.departure, g, this.drag, this.dragTilt, intro, this.lighting.warmth, this.lighting.shift, idle, this.pointer.sx*(1-g), this.pointer.sy*(1-g), ...this.models.map(m => m.userData.weight), innerWidth, innerHeight].map(v => Math.round(v*5000)).join(',');
    if ((this.active || !this.ready) && signature !== this.lastRenderSignature && now-(this.lastProductFrame || 0) > (this.mobile?40:30)) {
      this.lastProductFrame=now; this.renderer.render(this.scene, this.camera); this.lastRenderSignature = signature; }
    // Read-only diagnostics support QA of the real GLB scene rather than screenshots alone.
    if (this.ready && now - (this.lastDiagnostic || 0) > 500) {
      this.lastDiagnostic = now;
      this.canvas.dataset.scene = JSON.stringify({ selected: this.selected, segment:this.stage.index, local:+this.stage.local.toFixed(3), arrival:+this.stage.arrival.toFixed(3), departure:+this.stage.departure.toFixed(3), asset: this.models[this.selected]?.userData.assetId, meshes: this.models[this.selected]?.userData.meshNames, progress: +this.progress.toFixed(3), gallery: +g.toFixed(3), models: this.models.length, transitioning:this.models.some(m=>m.userData.weight>.001&&m.userData.weight<.999), outgoing:this.models.filter(m=>m.visible&&m.userData.outgoing&&m.userData.productIndex!==this.selected).map(m=>({asset:m.userData.assetId,scale:+m.scale.x.toFixed(4)})), backdropTime:+this.backdrop.uniforms.uTime.value.toFixed(3), backdropColor:this.backdrop.uniforms.uColor.value.getHexString(), triangles: this.renderer.info.render.triangles, solid: this.models.every(m=>m.userData.materials.every(mat=>!mat.transparent && mat.opacity===1 && mat.depthWrite)), rotation: +this.drag.toFixed(3), intro: +intro.toFixed(3), sunlight: !!this.sun.map, daylight: +daylightTime.toFixed(3), physicalHeightRatio:+(this.models[4].userData.nativeHeight/this.models[0].userData.nativeHeight).toFixed(4), groundLevels:this.models.map(m=>+(m.position.y-m.userData.nativeHeight*m.scale.y/2).toFixed(4)), scales:this.models.map(m=>+m.scale.x.toFixed(4)) });
    }
  }
  disposeObject(object) {
    object.traverse(o => {
      o.geometry?.dispose();
      for (const m of [].concat(o.material || [])) {
        for (const v of Object.values(m)) if (v?.isTexture) v.dispose();
        m.dispose();
      }
    });
  }
  dispose() {
    this.disposed = true; cancelAnimationFrame(this.frame);this.backdrop.dispose();
    window.removeEventListener('resize', this.resize); window.removeEventListener('scroll', this.readScroll);
    window.removeEventListener('pointermove', this.move); window.removeEventListener('pointerup', this.pointerUp);
    this.canvas.removeEventListener('pointercancel', this.pointerUp);this.canvas.removeEventListener('pointerdown', this.pointerDown);this.canvas.removeEventListener('webglcontextlost', this.contextLost);
    this.preference.removeEventListener('change', this.onPreference);
    gsap.killTweensOf(this.gallery); gsap.killTweensOf(this.intro); gsap.killTweensOf(this.lighting);
    this.models.forEach(o => { gsap.killTweensOf(o.userData); this.disposeObject(o); this.disposeObject(o.userData.shadow); });
    this.sun.map.dispose(); this.sun.dispose(); this.environment.dispose(); this.renderer.dispose();
  }
}
