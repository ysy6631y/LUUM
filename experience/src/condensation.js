// One shared, static condensation background. Input darkens only the original
// geometric guide; the fog, its color and its texture always remain opaque.
export class CondensationSurface {
  constructor(canvas, background, source) {
    this.canvas=canvas;this.background=background;this.ctx=canvas.getContext('2d');
    this.histories=Array.from({length:5},()=>({strokes:[],revealed:false}));this.index=0;this.state=this.histories[0];
    this.width=0;this.height=0;this.current=null;
    this.observer=new ResizeObserver(()=>this.resize());this.observer.observe(canvas);this.resize();
    const image=new Image();image.onload=()=>{if(this.disposed)return;this.image=image;this.prepare();};image.onerror=()=>{if(!this.disposed)this.canvas.dataset.frostReady='fallback';};image.src=source;
  }
  setPattern(index,svg){this.current=null;this.index=index;this.state=this.histories[index];this.svg=svg;this.measureGuide();this.render();this.canvas.dataset.pattern=String(index);}
  measureGuide(){
    if(!this.svg)return;const a=this.canvas.getBoundingClientRect(),b=this.svg.getBoundingClientRect();
    this.guide={x:b.left-a.left,y:b.top-a.top,width:b.width,height:b.height,path:new Path2D(this.svg.querySelector('path').getAttribute('d'))};
    this.radius=Math.max(7,Math.min(10,b.width*.025));this.canvas.dataset.brushRadius=this.radius;
    this.mask=document.createElement('canvas');this.ink=document.createElement('canvas');this.overlay=document.createElement('canvas');
    for(const tile of [this.mask,this.ink,this.overlay]){tile.width=Math.ceil(b.width*this.dpr);tile.height=Math.ceil(b.height*this.dpr);tile.getContext('2d').setTransform(this.dpr,0,0,this.dpr,0,0);}
    this.paintPath(this.ink.getContext('2d'),'#52614ce6');
    this.replay();
  }
  paintPath(c,color){const g=this.guide;c.save();c.scale(g.width/100,g.height/100);c.beginPath();c.rect(0,0,100,100);c.clip();c.strokeStyle=color;c.lineWidth=100/g.width;c.stroke(g.path);c.restore();}
  local(p){const g=this.guide;return{x:(p.x*this.width-g.x)/g.width,y:(p.y*this.height-g.y)/g.height};}
  paintMask(a,b){const g=this.guide,c=this.mask.getContext('2d');c.beginPath();c.moveTo(a.x*g.width,a.y*g.height);c.lineTo(b.x*g.width,b.y*g.height);c.lineWidth=this.radius*2;c.lineCap=c.lineJoin='round';c.strokeStyle='#fff';c.stroke();}
  replay(){
    if(!this.mask)return;const g=this.guide,c=this.mask.getContext('2d');c.clearRect(0,0,g.width,g.height);
    if(this.state.revealed){c.fillStyle='#fff';c.fillRect(0,0,g.width,g.height);return;}
    for(const stroke of this.state.strokes){this.paintMask(stroke[0],stroke[0]);for(let i=1;i<stroke.length;i++)this.paintMask(stroke[i-1],stroke[i]);}
  }
  resize(){
    const {width,height}=this.canvas.getBoundingClientRect();if(!width||!height)return;
    const dpr=Math.min(devicePixelRatio,1.25);if(width===this.width&&height===this.height&&dpr===this.dpr)return;
    this.width=width;this.height=height;this.dpr=dpr;
    for(const c of [this.canvas,this.background]){c.width=Math.round(width*dpr);c.height=Math.round(height*dpr);c.getContext('2d').setTransform(dpr,0,0,dpr,0,0);}
    this.measureGuide();this.prepare();
  }
  prepare(){
    const {width:w,height:h,dpr}=this;if(!w)return;
    const sharp=this.background.getContext('2d');sharp.clearRect(0,0,w,h);sharp.fillStyle='#8a9384';sharp.fillRect(0,0,w,h);
    if(this.image){const image=this.image,scale=Math.max(w/image.width,h/image.height),iw=image.width*scale,ih=image.height*scale;sharp.save();sharp.globalAlpha=.04;sharp.drawImage(image,(w-iw)/2,(h-ih)/2,iw,ih);sharp.restore();sharp.globalCompositeOperation='multiply';sharp.fillStyle='#8a9285';sharp.fillRect(0,0,w,h);sharp.globalCompositeOperation='source-over';}
    // Grade the user's own sheer image as warm natural light behind wet glass.
    const light=sharp.createLinearGradient(0,0,w*.1,h);light.addColorStop(0,'#f4f7edcf');light.addColorStop(.42,'#c9d0c01f');light.addColorStop(1,'#17291d94');sharp.fillStyle=light;sharp.fillRect(0,0,w,h);
    const fog=this.fog=document.createElement('canvas');fog.width=this.canvas.width;fog.height=this.canvas.height;const c=fog.getContext('2d');c.setTransform(dpr,0,0,dpr,0,0);
    c.fillStyle='#b9c1b1';c.fillRect(0,0,w,h);c.save();c.filter=`blur(${18*dpr}px)`;c.drawImage(this.background,0,0,w,h);c.restore();
    const milk=c.createLinearGradient(0,0,w*.2,h);milk.addColorStop(0,'#f7f8f1a1');milk.addColorStop(.55,'#e5e9dc73');milk.addColorStop(1,'#cdd4c45c');c.fillStyle=milk;c.fillRect(0,0,w,h);
    // Static condensation grain and tiny beads: no particles or animation loop.
    let seed=1703;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)|0;return(seed>>>0)/4294967296;};
    const tile=document.createElement('canvas');tile.width=tile.height=192;const t=tile.getContext('2d'),pixels=t.createImageData(192,192);
    for(let i=0;i<pixels.data.length;i+=4){const n=35+random()*190;pixels.data[i]=pixels.data[i+1]=pixels.data[i+2]=n;pixels.data[i+3]=75;}t.putImageData(pixels,0,0);c.save();c.globalCompositeOperation='soft-light';c.fillStyle=c.createPattern(tile,'repeat');c.fillRect(0,0,w,h);c.restore();
    for(let i=0;i<w*h/7000;i++){const x=random()*w,y=random()*h,r=.45+Math.pow(random(),2)*1.9;c.save();c.translate(x,y);c.scale(1,1.15+random()*.35);c.beginPath();c.arc(0,0,r,0,Math.PI*2);c.fillStyle='#f6f8ec16';c.fill();c.strokeStyle='#273c291f';c.lineWidth=.6;c.stroke();c.beginPath();c.arc(-r*.18,-r*.15,r*.64,3.6,5.2);c.strokeStyle='#fffdf3a3';c.lineWidth=.55;c.stroke();c.restore();}
    this.render();this.canvas.dataset.frostReady=this.image?'true':'loading';
  }
  render(){
    if(!this.fog)return;this.ctx.globalCompositeOperation='source-over';this.ctx.drawImage(this.fog,0,0,this.width,this.height);this.renderGuide();
  }
  renderGuide(){
    if(!this.guide||!this.fog)return;const g=this.guide,c=this.ctx;
    const x=Math.max(0,Math.floor(g.x*this.dpr)-2),y=Math.max(0,Math.floor(g.y*this.dpr)-2),w=Math.min(this.canvas.width-x,Math.ceil((g.x+g.width)*this.dpr)+2-x),h=Math.min(this.canvas.height-y,Math.ceil((g.y+g.height)*this.dpr)+2-y);
    c.drawImage(this.fog,x,y,w,h,x/this.dpr,y/this.dpr,w/this.dpr,h/this.dpr);
    c.save();c.translate(g.x,g.y);this.paintPath(c,'#fffcdf80');c.restore();
    const ink=this.overlay.getContext('2d');ink.globalCompositeOperation='source-over';ink.clearRect(0,0,g.width,g.height);ink.drawImage(this.ink,0,0,g.width,g.height);ink.globalCompositeOperation='destination-in';ink.drawImage(this.mask,0,0,g.width,g.height);ink.globalCompositeOperation='source-over';
    c.drawImage(this.overlay,g.x,g.y,g.width,g.height);
  }
  begin(p){if(this.state.revealed||!this.guide)return false;const point=this.local(p);if(point.x<-.05||point.x>1.05||point.y<-.05||point.y>1.05)return false;this.current=[point];this.state.strokes.push(this.current);this.paintMask(point,point);this.renderGuide();return true;}
  move(p){if(!this.current)return;const point=this.local(p),last=this.current[this.current.length-1];if(Math.hypot(point.x-last.x,point.y-last.y)<.002)return;this.current.push(point);this.paintMask(last,point);this.renderGuide();}
  finish(){const changed=!!this.current;this.current=null;return changed;}
  reveal(){this.current=null;this.state.revealed=true;this.replay();this.renderGuide();}
  reset(){this.current=null;this.state.strokes=[];this.state.revealed=false;this.replay();this.renderGuide();}
  dispose(){this.disposed=true;this.observer.disconnect();}
}
