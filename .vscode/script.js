// Skibidi vs Ohio – Mini Invaders (Banners, No Sound)
(() => {
const c=document.getElementById('game'), x=c.getContext('2d'); const W=c.width,H=c.height;
const UI=document.querySelector('.ui'), btnS=document.getElementById('skibidi'), btnO=document.getElementById('ohio');
const bannerWrap=document.getElementById('bannerWrap');
let side='skibidi', running=false, t=0, keys={}, shots=[], foes=[], dir=1, drop=0, score=0, lives=3, level=1;

const rnd=(a,b)=>Math.random()*(b-a)+a, clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
function banner(msg, type='ok', ms=1400){
  const el=document.createElement('div'); el.className=`banner ${type}`; el.textContent=msg; bannerWrap.appendChild(el);
  requestAnimationFrame(()=>el.classList.add('show'));
  setTimeout(()=>{ el.classList.remove('show'); setTimeout(()=>el.remove(), 260); }, ms);
}

const p={x:W/2,y:H-40,w:42,h:18,vx:0};
function newWave(){
  foes=[]; const cols=8, rows=3, gap=60, startX=60, startY=80;
  for(let r=0;r<rows;r++) for(let i=0;i<cols;i++)
    foes.push({x:startX+i*gap,y:startY+r*44,w:30,h:20,alive:true});
  dir=1; drop=0;
  banner(side==='skibidi' ? 'Skibidi on the offensive!' : 'Ohio marches forward!', 'warn', 1200);
}
function reset(s){
  side=s; score=0;lives=3;level=1;p.x=W/2;shots=[];newWave();running=true;UI.style.display='none';
  banner(side==='skibidi' ? 'Skibidi rises! 🚽' : 'Only in Ohio! 🛑', 'ok', 1500);
  loop();
}
function shoot(){ shots.push({x:p.x,y:p.y-14,r:4,vy:-7}); }
function collide(a,b){ return Math.abs(a.x-b.x)<(a.w/2+(b.r||b.w/2)) && Math.abs(a.y-b.y)<(a.h/2+(b.r||b.h/2)); }

onkeydown=e=>{ keys[e.key]=1; if((e.key===' '||e.code==='Space')&&running){ shoot(); e.preventDefault(); } };
onkeyup=e=>keys[e.key]=0;

function loop(){ if(!running) return; requestAnimationFrame(loop); update(); render(); }
function update(){
  t+=1/60;
  p.vx=(keys['ArrowRight']||keys['d']?4:0)-(keys['ArrowLeft']||keys['a']?4:0);
  p.x=clamp(p.x+p.vx, 30, W-30);
  shots.forEach(s=>s.y+=s.vy); shots=shots.filter(s=>s.y>-8);

  let minX=1e9,maxX=-1e9; foes.forEach(f=>{ if(!f.alive) return; f.x+=dir*(1+level*0.1); minX=Math.min(minX,f.x-15); maxX=Math.max(maxX,f.x+15); });
  if(minX<20||maxX>W-20){ dir*=-1; drop=16; }
  if(drop){ foes.forEach(f=>{ if(f.alive) f.y+=drop; }); drop=0; }

  for(let f of foes){
    if(!f.alive) continue;
    for(let j=shots.length-1;j>=0;j--){
      const s=shots[j]; if(collide({x:f.x,y:f.y,w:f.w,h:f.h}, s)){
        f.alive=false; shots.splice(j,1); score+=10; break;
      }
    }
    if(f.y>H-70) { f.alive=false; lives--; banner('Life lost!', 'bad', 900); if(lives<=0) return gameOver(); }
  }
  if(foes.every(f=>!f.alive)){ level++; banner(side==='skibidi' ? 'Skibidi go go go!' : 'Yay Ohio!', 'ok', 1200); newWave(); }
}
function drawToilet(cx,cy){ x.fillStyle='#e6f1ff'; x.fillRect(cx-10,cy-6,20,12); x.fillRect(cx-6,cy-14,12,8); }
function drawOhio(cx,cy){ x.fillStyle='#ff4d5a'; x.beginPath(); for(let i=0;i<8;i++){ const a=(Math.PI/4)*i; const px=cx+14*Math.cos(a), py=cy+14*Math.sin(a); if(i?x.lineTo(px,py):x.moveTo(px,py)); } x.closePath(); x.fill(); }
function render(){
  x.clearRect(0,0,W,H);
  x.strokeStyle='rgba(81,229,255,.08)'; x.lineWidth=1; x.beginPath();
  for(let i=0;i<W;i+=24){ x.moveTo(i,0); x.lineTo(i,H);} for(let j=0;j<H;j+=24){ x.moveTo(0,j); x.lineTo(W,j);} x.stroke();
  x.fillStyle= side==='skibidi' ? '#51e5ff' : '#ff57c9'; x.fillRect(p.x-21,p.y-9,42,18);
  x.fillStyle='#001018'; x.fillRect(p.x-6,p.y-6,12,12);
  x.fillStyle= side==='skibidi' ? '#ff57c9' : '#51e5ff'; shots.forEach(s=>{ x.beginPath(); x.arc(s.x,s.y,4,0,6.28); x.fill(); });
  foes.forEach(f=>{ if(!f.alive) return; if(side==='skibidi'){ drawOhio(f.x,f.y); } else { drawToilet(f.x,f.y); } });
  x.fillStyle='#e6f1ff'; x.font='16px monospace'; x.textAlign='left'; x.fillText('Score: '+score,14,22);
  x.textAlign='center'; x.fillText('Level: '+level, W/2, 22);
  x.textAlign='right'; x.fillText('Lives: '+lives, W-14, 22);
}
function gameOver(){
  running=false; UI.style.display='grid'; UI.querySelector('.hint').textContent='Game over. Pick a side to play again.';
  banner(side==='skibidi' ? 'Ohio prevails this time.' : 'Skibidi toilets rise again.', 'warn', 1600);
}
btnS.onclick=()=>reset('skibidi'); btnO.onclick=()=>reset('ohio');
})();