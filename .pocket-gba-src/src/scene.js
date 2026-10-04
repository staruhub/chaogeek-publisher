import * as T from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import './fidelity.css';

export function createScene(host, screenCanvas, events) {
  const renderer = new T.WebGLRenderer({antialias:true,alpha:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputColorSpace=T.SRGBColorSpace;
  renderer.setClearColor(0x101012,0);host.append(renderer.domElement);
  const scene=new T.Scene(), camera=new T.PerspectiveCamera(34,1,.1,80);
  camera.position.set(0,.15,12.5);
  const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.enablePan=false;controls.minDistance=6.2;controls.maxDistance=16;controls.rotateSpeed=.7;controls.target.set(0,.25,0);
  scene.add(new T.HemisphereLight(0xf2eeff,0x28232c,2.3));
  const key=new T.DirectionalLight(0xfff8ff,3.5);key.position.set(-4,6,8);scene.add(key);
  const edge=new T.DirectionalLight(0x8d7abb,2);edge.position.set(5,-2,-5);scene.add(edge);
  const root=new T.Group();scene.add(root);const device=new T.Group();root.add(device);
  const shell=new T.MeshStandardMaterial({color:'#8e78bf',roughness:.57,metalness:.08});
  const backmat=new T.MeshStandardMaterial({color:'#7964a5',roughness:.66});
  const dark=new T.MeshStandardMaterial({color:'#29252f',roughness:.8});
  const silver=new T.MeshStandardMaterial({color:'#c3c2cc',roughness:.46,metalness:.16});
  const rubber=new T.MeshStandardMaterial({color:'#6d5a89',roughness:.82});
  const seam=new T.MeshStandardMaterial({color:'#5b4c72',roughness:.8});
  const meshes={};
  function rounded(w,h,r){const s=new T.Shape(),x=-w/2,y=-h/2;s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);return s;}
  function extrude(shape,depth,mat,parent,x=0,y=0,z=0,bevel=.035){const m=new T.Mesh(new T.ExtrudeGeometry(shape,{depth,steps:1,bevelEnabled:bevel>0,bevelSegments:3,bevelSize:bevel,bevelThickness:bevel,curveSegments:28}),mat);m.position.set(x,y,z);parent.add(m);return m;}
  function box(w,h,d,r,mat,parent,x,y,z){return extrude(rounded(w,h,r),d,mat,parent,x,y,z,Math.min(.018,d*.25,h*.2,w*.2));}
  function disk(radius,depth,mat,parent,x,y,z){const m=new T.Mesh(new T.CylinderGeometry(radius,radius,depth,48),mat);m.rotation.x=Math.PI/2;m.position.set(x,y,z);parent.add(m);return m;}
  function label(text,w,h,parent,x,y,z,{color='#cbc6d5',size=56,weight=600,bg=null}={}){const c=document.createElement('canvas');c.width=1024;c.height=Math.round(1024*h/w);const ctx=c.getContext('2d');if(bg){ctx.fillStyle=bg;ctx.fillRect(0,0,c.width,c.height);}ctx.fillStyle=color;ctx.font=`${weight} ${size}px Arial,sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,512,c.height/2);const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;const m=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({map:tex,transparent:true,depthWrite:false}));m.position.set(x,y,z);parent.add(m);return m;}
  const shape=new T.Shape();shape.moveTo(-2.35,-1.51);shape.bezierCurveTo(-3.03,-1.42,-3.19,-.75,-3.1,.15);shape.bezierCurveTo(-3.07,.72,-2.82,1.34,-2.46,1.48);shape.bezierCurveTo(-1.5,1.69,1.5,1.69,2.46,1.48);shape.bezierCurveTo(2.86,1.34,3.08,.72,3.1,.15);shape.bezierCurveTo(3.2,-.78,2.95,-1.42,2.35,-1.51);shape.bezierCurveTo(1.2,-1.76,-1.2,-1.76,-2.35,-1.51);
  extrude(shape,.20,backmat,device,0,0,-.34,.09);extrude(shape,.025,seam,device,0,0,-.08,.095);extrude(shape,.19,shell,device,0,0,-.02,.095);
  box(3.10,2.58,.08,.25,rubber,device,0,.02,.22);box(2.99,2.47,.045,.22,dark,device,0,.035,.31);
  box(2.48,1.69,.015,.015,new T.MeshStandardMaterial({color:'#100f16'}),device,0,.18,.39);
  const texture=new T.CanvasTexture(screenCanvas);texture.colorSpace=T.SRGBColorSpace;texture.minFilter=T.NearestFilter;texture.magFilter=T.NearestFilter;texture.generateMipmaps=false;
  const screen=new T.Mesh(new T.PlaneGeometry(2.40,1.60),new T.MeshBasicMaterial({map:texture}));screen.position.set(0,.18,.425);device.add(screen);
  label('GAME BOY ADVANCE',2.65,.25,device,0,-1.02,.40,{size:70,weight:700});label('32 BIT HANDHELD',2,.12,device,0,-1.45,.275,{color:'#55436e',size:50});
  disk(.45,.035,rubber,device,-2.18,.0,.27);
  const cross=new T.Shape();const pts=[[-.13,.37],[.13,.37],[.13,.13],[.37,.13],[.37,-.13],[.13,-.13],[.13,-.37],[-.13,-.37],[-.13,-.13],[-.37,-.13],[-.37,.13],[-.13,.13]];pts.forEach(([x,y],i)=>i?cross.lineTo(x,y):cross.moveTo(x,y));cross.closePath();const dp=extrude(cross,.075,silver,device,-2.18,0,.31,.025);disk(.095,.012,rubber,device,-2.18,0,.41);
  for(const [keyName,x,y] of [['ArrowUp',-2.18,.27],['ArrowDown',-2.18,-.27],['ArrowLeft',-2.45,0],['ArrowRight',-1.91,0]]){const hit=box(.23,.23,.015,.015,new T.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}),device,x,y,.435);hit.userData.key=keyName;meshes[keyName]=dp;}
  const bed=box(1.12,.65,.025,.31,rubber,device,2.17,.37,.24);bed.rotation.z=.52;
  for(const [name,keyName,x,y] of [['A','KeyX',2.46,.54],['B','KeyZ',1.96,.23]]){const m=disk(.255,.10,silver,device,x,y,.35);m.userData.key=keyName;meshes[keyName]=m;label(name,.28,.27,device,x,y,.413,{size:640,color:'#62606b',weight:700});}
  for(const [name,keyName,x,y] of [['SELECT','ShiftRight',-2.08,-1.0],['START','Enter',-1.67,-.85]]){const b=box(.27,.092,.07,.045,silver,device,x,y,.29);b.rotation.z=.50;b.userData.key=keyName;meshes[keyName]=b;label(name,.39,.09,device,x+.025,y-.15,.32,{size:175,color:'#594870'});}
  for(let i=0;i<6;i++){const s=box(.056,.35,.018,.026,dark,device,1.82+i*.12,-.82+i*.03,.25);s.rotation.z=.45;}
  const ledmat=new T.MeshBasicMaterial({color:'#30272b'});disk(.038,.014,ledmat,device,1.66,.94,.29);label('POWER',.40,.1,device,1.68,.79,.28,{color:'#584870',size:135});
  for(const [k,x]of [['KeyA',-2.25],['KeyS',2.25]]){const b=box(.79,.20,.24,.1,silver,device,x,1.49,-.15);b.userData.key=k;meshes[k]=b;}
  const sw=box(.35,.10,.1,.02,dark,device,2.73,-1.22,-.10);sw.userData.power=true;
  const backside=new T.Group();backside.rotation.y=Math.PI;backside.position.z=-.46;device.add(backside);
  box(2.38,1.57,.03,.12,seam,backside,0,-.24,0);box(2.30,1.50,.04,.10,backmat,backside,0,-.24,.018);box(.32,.08,.02,.02,seam,backside,0,.45,.07);
  label('POCKET',1.8,.25,backside,0,1.02,.02,{color:'#514462',size:150});label('A LITTLE JOY. RELOADED.',1.85,.11,backside,0,.72,.025,{color:'#514462',size:70});label('32 BIT / AGB-001',1.8,.12,backside,0,-.75,.072,{color:'#514462',size:90});
  for(const[x,y]of[[-2.42,-.82],[2.42,-.82],[-2.35,1.04],[2.35,1.04]]){disk(.065,.02,dark,backside,x,y,.055);box(.07,.014,.006,.003,silver,backside,x,y,.069);}
  box(1.94,.15,.28,.04,dark,device,0,1.53,-.30);
  const card=new T.Group();root.add(card);box(1.81,1.22,.19,.055,new T.MeshStandardMaterial({color:'#49434f',roughness:.75}),card,0,0,-.22);box(1.91,.14,.20,.025,new T.MeshStandardMaterial({color:'#514b59',roughness:.65}),card,0,.49,-.22);
  const sticker=document.createElement('canvas');sticker.width=768;sticker.height=460;const st=new T.CanvasTexture(sticker);st.colorSpace=T.SRGBColorSpace;const face=new T.Mesh(new T.PlaneGeometry(1.57,.93),new T.MeshStandardMaterial({map:st,roughness:.9}));face.position.set(0,-.06,.012);card.add(face);
  function cardLabel(name='A LITTLE\nMORE PLAY.'){const c=sticker.getContext('2d');c.fillStyle='#d4c8a2';c.fillRect(0,0,768,460);c.fillStyle='#a79ac4';c.beginPath();c.arc(624,132,180,0,Math.PI*2);c.fill();c.fillStyle='#2b2535';c.font='bold 28px monospace';c.fillText('YOUR NEXT ADVENTURE',34,52);c.font='800 80px Arial';name.split('\n').slice(0,2).forEach((s,i)=>c.fillText(s.slice(0,17),34,188+i*86));c.font='21px monospace';c.fillText('INSERT. SWITCH ON. ENJOY.',34,417);st.needsUpdate=true;}
  cardLabel();label('GAME BOY ADVANCE',1.62,.13,card,0,.485,.022,{size:89,color:'#8e849c'});
  for(let i=0;i<16;i++)box(.055,.115,.018,.001,new T.MeshStandardMaterial({color:'#b69a53',metalness:.7,roughness:.5}),card,-.65+i*.086,-.62,-.16);
  const reverse=label('POCKET / GAME PAK',1.6,.2,card,0,0,-.264,{size:100,color:'#9890a3'});reverse.rotation.y=Math.PI;
  const ray=new T.Raycaster(),pointer=new T.Vector2();let mode='orbit',inserted=false,down=null,held=null,dragCard=false,cardY=2.2,targetCardY=2.2;
  function pick(e){const b=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-b.left)/b.width*2-1,-(e.clientY-b.top)/b.height*2+1);ray.setFromCamera(pointer,camera);return ray.intersectObjects([device,card],true);}
  renderer.domElement.addEventListener('pointerdown',e=>{const hits=pick(e);down={x:e.clientX,y:e.clientY};if(mode==='play'){const found=hits.find(h=>h.object.userData.key||h.object.userData.power);if(found?.object.userData.power)events.power();else if(found){held=found.object.userData.key;events.key(held,true);renderer.domElement.setPointerCapture(e.pointerId);}}else if(mode!=='card'&&!inserted&&hits.some(h=>{let o=h.object;while(o){if(o===card)return true;o=o.parent;}return false;})){dragCard=true;controls.enabled=false;renderer.domElement.setPointerCapture(e.pointerId);}});
  renderer.domElement.addEventListener('pointermove',e=>{if(dragCard&&down)cardY=2.2-Math.max(0,e.clientY-down.y)/100;});
  const release=e=>{if(held){events.key(held,false);held=null;}if(dragCard){if(e.type!=='pointercancel'&&down&&e.clientY-down.y>28)events.insert();dragCard=false;controls.enabled=mode!=='play';cardY=targetCardY;}down=null;};renderer.domElement.addEventListener('pointerup',release);renderer.domElement.addEventListener('pointercancel',release);
  function distance(){const tangent=Math.tan(T.MathUtils.degToRad(camera.fov/2));return Math.max((mode==='card'?3.7:mode==='play'?3.9:5.3)/(2*tangent),(mode==='card'?4.5:7.3)/(2*tangent*camera.aspect));}
  function resize(){const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();camera.position.set(0,.25,distance());controls.target.set(0,mode==='card'?0:mode==='play'?0:.35,0);controls.update();}new ResizeObserver(resize).observe(host);resize();
  let desiredRotation=new T.Vector3(.12,-.1,.19);root.rotation.set(.12,-.1,.19);let alive=true;
  function frame(){if(!alive)return;requestAnimationFrame(frame);controls.update();root.rotation.x=T.MathUtils.lerp(root.rotation.x,desiredRotation.x,.12);root.rotation.y=T.MathUtils.lerp(root.rotation.y,desiredRotation.y,.12);root.rotation.z=T.MathUtils.lerp(root.rotation.z,desiredRotation.z,.12);if(!dragCard)cardY=T.MathUtils.lerp(cardY,targetCardY,.12);card.position.set(0,mode==='card'?0:cardY,mode==='card'?.5:-.12);card.scale.setScalar(mode==='card'?2.1:1);device.visible=mode!=='card';texture.needsUpdate=true;renderer.render(scene,camera);}frame();
  function setView(next){mode=next;controls.enabled=next!=='play';controls.reset();controls.target.set(0,next==='card'||next==='play'?0:.35,0);camera.position.set(0,.25,distance());desiredRotation.set(next==='play'?0:.12,next==='back'?Math.PI:next==='card'?-.18:next==='play'?0:-.1,next==='play'||next==='back'?0:.19);controls.update();}
  return {setView,setInserted(value){inserted=value;targetCardY=value?.99:2.2;},setPower(on){ledmat.color.set(on?'#99ed83':'#30272b');},setColor(value){shell.color.set(value);backmat.color.set(value).multiplyScalar(.82);},setCard(name){cardLabel(name?name.toUpperCase().slice(0,30).replace(/(.{1,15})\s/,'$1\n'):'A LITTLE\nMORE PLAY.');},press(key,pressed){const m=meshes[key];if(m){if(m.userData.restZ===undefined)m.userData.restZ=m.position.z;m.position.z=m.userData.restZ-(pressed?.035:0);}},destroy(){alive=false;controls.dispose();renderer.dispose();},get mode(){return mode;}};
}
