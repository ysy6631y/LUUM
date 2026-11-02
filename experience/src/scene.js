import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import gsap from 'gsap';
import { asset, products } from './content';

const lerp = THREE.MathUtils.lerp;
const clamp = THREE.MathUtils.clamp;
const smooth = t => t * t * (3 - 2 * t);

export class ProductScene {
  constructor(canvas, { onProgress, onReady, onError, onPick }) {
    this.canvas = canvas;
    this.disposed = false;
    this.selected = 3;
    this.gallery = { value: 0 };
    this.scroll = 0;
    this.progress = 0;
    this.pointer = { x: 0, y: 0, sx: 0, sy: 0 };
    this.drag = 0;
    this.models = [];
    this.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(30, 1, .05, 90);
    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 700 ? 1.5 : 1.8));
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
    const fill = new THREE.DirectionalLight('#f4eee5', .65);
    fill.position.set(4, 2, 3); this.scene.add(fill);
    const rim = new THREE.DirectionalLight('#fff5d8', 1.4);
    rim.position.set(2, 5, -3); this.scene.add(rim);
    this.scene.add(new THREE.HemisphereLight('#fffaf0', '#8c7762', .45));
    this.raycaster = new THREE.Raycaster();
    this.onPick = onPick;
    this.resize = () => {
      this.mobile = innerWidth < 700;
      this.camera.aspect = innerWidth / innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(innerWidth, innerHeight);
      this.readScroll();
    };
    this.readScroll = () => {
      this.scroll = clamp(window.scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight) * 3, 0, 3);
    };
    this.move = e => {
      this.pointer.x = (e.clientX / innerWidth - .5) * 2;
      this.pointer.y = (e.clientY / innerHeight - .5) * 2;
      if (this.down && !this.gallery.value) {
        this.drag += (e.clientX - this.lastX) * .006;
        this.lastX = e.clientX;
      }
    };
    this.pointerDown = e => {
      this.down = true; this.lastX = e.clientX; this.startX = e.clientX; this.startY = e.clientY;
      canvas.style.cursor = 'grabbing';
    };
    this.pointerUp = e => {
      if (this.down && this.gallery.value > .9 && Math.hypot(e.clientX - this.startX, e.clientY - this.startY) < 10) {
        this.raycaster.setFromCamera(new THREE.Vector2(e.clientX / innerWidth * 2 - 1, -e.clientY / innerHeight * 2 + 1), this.camera);
        const hits = this.raycaster.intersectObjects(this.models.filter(Boolean), true);
        if (hits.length) { let o = hits[0].object; while (o.parent && o.userData.productIndex === undefined) o = o.parent; if (o.userData.productIndex !== undefined) this.onPick(o.userData.productIndex); }
      }
      this.down = false; canvas.style.cursor = this.gallery.value > .5 ? 'pointer' : 'grab';
    };
    this.contextLost = e => { e.preventDefault(); onError('context'); };
    this.onPreference = e => { this.reduced = e.matches; };
    this.preference = matchMedia('(prefers-reduced-motion: reduce)');
    this.preference.addEventListener('change', this.onPreference);
    window.addEventListener('resize', this.resize);
    window.addEventListener('scroll', this.readScroll, { passive: true });
    window.addEventListener('pointermove', this.move, { passive: true });
    canvas.addEventListener('pointerdown', this.pointerDown);
    window.addEventListener('pointerup', this.pointerUp);
    canvas.addEventListener('webglcontextlost', this.contextLost);
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
        const box = new THREE.Box3().setFromObject(object), center = box.getCenter(new THREE.Vector3());
        object.position.sub(center);
        const group = new THREE.Group(); group.add(object); group.scale.setScalar(4 / .19);
        // Bake export uses metres. A wrapper keeps the original scale/proportions intact.
        const root = new THREE.Group(); root.add(group);
        root.userData = { productIndex: i, weight: i === this.selected ? 1 : 0, side: 1, materials: [] };
        object.traverse(mesh => {
          if (!mesh.isMesh) return;
          mesh.material = mesh.material.clone();
          if (mesh.material.anisotropy) mesh.material.anisotropy = 0;
          mesh.material.envMapIntensity = mesh.material.metalness > .8 ? 1.4 : .8;
          if (mesh.material.map) mesh.material.map.anisotropy = Math.min(4, this.renderer.capabilities.getMaxAnisotropy());
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
    if (!this.disposed) { this.ready = true; onReady(); }
  }
  select(index) {
    if (index === this.selected) return;
    const previous = this.selected;
    this.selected = index;
    const direction = index > previous ? 1 : -1;
    this.drag = 0;
    for (let i = 0; i < this.models.length; i++) {
      const model = this.models[i]; if (!model) continue;
      gsap.killTweensOf(model.userData);
      model.userData.side = i === index ? direction : -direction;
      gsap.to(model.userData, { weight: i === index ? 1 : 0, duration: this.reduced ? .01 : i === index ? 1.25 : .65, delay: this.reduced || i !== index ? 0 : .12, ease: 'power2.inOut' });
    }
  }
  setGallery(open) {
    gsap.to(this.gallery, { value: open ? 1 : 0, duration: this.reduced ? .01 : 1.2, ease: 'power3.inOut', overwrite: true });
    this.canvas.style.cursor = open ? 'pointer' : 'grab';
  }
  pose(progress) {
    const m = this.mobile;
    const poses = [
      [0, m ? .7 : .6, 0, .12, -.18, -.10, m ? .63 : .69],
      [m ? .15 : 1.65, m ? .15 : -1.0, 0, .10, -.42, .12, m ? 1.08 : 1.72],
      [m ? 0 : -1.6, m ? -1.1 : -2.35, 0, .52, .23, -.18, m ? 1.25 : 1.85],
      [m ? 0 : -1.85, m ? 1.1 : .12, 0, .15, .25, .1, m ? .5 : .82],
    ];
    const k = Math.min(2, Math.floor(progress)), t = smooth(progress - k);
    return poses[k].map((n, i) => lerp(n, poses[k + 1][i], t));
  }
  tick(now) {
    if (this.disposed) return;
    this.frame = requestAnimationFrame(this.tick);
    if (document.hidden) { this.lastTime = now; return; }
    const dt = Math.min(.05, (now - (this.lastTime || now)) / 1000); this.lastTime = now;
    const damping = this.reduced ? 1 : 1 - Math.exp(-dt * 7);
    this.progress = lerp(this.progress, this.scroll, damping);
    this.pointer.sx = lerp(this.pointer.sx, this.reduced ? 0 : this.pointer.x, damping);
    this.pointer.sy = lerp(this.pointer.sy, this.reduced ? 0 : this.pointer.y, damping);
    const pose = this.pose(this.progress), g = this.gallery.value;
    // Portrait screens keep the full object in view without stretching its geometry.
    const cameraZ = 10.5;
    const galleryZ = this.mobile ? Math.max(12, 7.8 / (this.camera.aspect * .536)) : 12;
    const labelsWidth = this.mobile ? innerWidth * .91 : Math.min(innerHeight * 1.55, innerWidth * .91);
    const galleryStep = labelsWidth / innerHeight / 5 * (2 * Math.tan(Math.PI / 12) * galleryZ);
    this.camera.position.set(this.pointer.sx * .16 * (1-g), .45 - this.pointer.sy * .12 * (1-g), lerp(cameraZ, galleryZ, g));
    this.camera.lookAt(0, .05, 0);
    this.key.position.x = -4 + this.pointer.sx * .7 * (1-g);
    this.models.forEach((model, i) => {
      const weight = model.userData.weight, visibility = lerp(weight, 1, g);
      model.visible = visibility > .001;
      if (!model.visible) { model.userData.shadow.visible = false; return; }
      const jar = i === 4;
      const heroScale = pose[6] * (jar ? 1.75 : 1);
      const galleryX = (i - 2) * galleryStep;
      model.position.set(lerp(pose[0] + (1-weight) * 3.5 * model.userData.side, galleryX, g), lerp(pose[1] + (jar ? .0 : 0), .1, g), lerp(-(1-weight)*2.0, 0, g));
      model.rotation.set(lerp(pose[3] + this.pointer.sy * .025, .12, g), lerp(pose[4] + this.drag + this.pointer.sx * .06 + (1-weight)*.32*model.userData.side, -.12, g), lerp(pose[5], 0, g));
      model.scale.setScalar(lerp(heroScale * (.78 + weight*.22), jar ? .95 : .55, g));
      const shadow = model.userData.shadow;
      shadow.visible = model.visible;
      const floor = model.position.y - (jar ? 1.64 : 4) * model.scale.x / 2 - .06;
      shadow.position.set(model.position.x, floor, -.45);
      shadow.scale.set((jar ? 2.4 : 1.65) * model.scale.x, .17 * model.scale.x, 1);
      shadow.material.opacity = visibility * .55;
      for (const mat of model.userData.materials) {
        const transparent = visibility < .999;
        if (mat.transparent !== transparent) { mat.transparent = transparent; mat.needsUpdate = true; }
        mat.opacity = visibility; mat.depthWrite = !transparent;
      }
    });
    const signature = [this.progress, g, this.drag, this.pointer.sx*(1-g), this.pointer.sy*(1-g), ...this.models.map(m => m.userData.weight), innerWidth, innerHeight].map(v => Math.round(v*5000)).join(',');
    if (signature !== this.lastRenderSignature) { this.renderer.render(this.scene, this.camera); this.lastRenderSignature = signature; }
    // Read-only diagnostics support QA of the real GLB scene rather than screenshots alone.
    if (this.ready && now - (this.lastDiagnostic || 0) > 500) {
      this.lastDiagnostic = now;
      this.canvas.dataset.scene = JSON.stringify({ selected: this.selected, progress: +this.progress.toFixed(3), gallery: +g.toFixed(3), models: this.models.length, triangles: this.renderer.info.render.triangles });
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
    this.disposed = true; cancelAnimationFrame(this.frame);
    window.removeEventListener('resize', this.resize); window.removeEventListener('scroll', this.readScroll);
    window.removeEventListener('pointermove', this.move); window.removeEventListener('pointerup', this.pointerUp);
    this.canvas.removeEventListener('pointerdown', this.pointerDown);this.canvas.removeEventListener('webglcontextlost', this.contextLost);
    this.preference.removeEventListener('change', this.onPreference);
    gsap.killTweensOf(this.gallery);
    this.models.forEach(o => { gsap.killTweensOf(o.userData); this.disposeObject(o); this.disposeObject(o.userData.shadow); });
    this.environment.dispose(); this.renderer.dispose();
  }
}
