"""Builds film_v2.js from film.js (original untouched): camera that travels to clicks + CSS perspective tilt, glass panels,
word-by-word typing, progressive 'search' beat. Also writes comp_v2_hook.html / comp_v2_search.html (segment samples)."""
import re, io
src = open("film.js", encoding="utf-8").read()


def sub1(old, new, flags=0):
    global src
    assert old in src, old[:60]
    src = src.replace(old, new, 1)


# ---- time offset for segment renders
sub1("const canvas=document.getElementById('film'),g=canvas.getContext('2d');",
     "const canvas=document.getElementById('film'),g=canvas.getContext('2d');const T0=window.__T0||0;")
sub1("window.__seek=async t=>{t=Math.max(0,Math.min(DUR,t));", "window.__seek=async t=>{t=Math.max(0,Math.min(DUR,t+T0));")

# ---- glass colours (translucent layers)
sub1("panel:'#12160f',panel2:'#1b2114'", "panel:'rgba(16,22,10,.58)',panel2:'rgba(44,58,26,.62)'")
sub1("faint:'#232c19'", "faint:'rgba(70,90,40,.50)'")


# ---- fixes for translucent glass: '300' fades into '30'; detail card gets an opaque backing; 300 lands on its spoken word
sub1("text('300',53,229,125,600,C.ink,'left','Geist');", "alpha(U(t,.95,1.12)*(1-month),()=>text(String(Math.round(300*U(t,1.0,1.5,E.quintOut))),53,229,125,600,C.ink,'left','Geist'));")
sub1("rect(b.x,b.y,b.w,b.h,b.r,C.panel2,C.lime,1.5);", "rect(b.x,b.y,b.w,b.h,b.r,'#161d0e');rect(b.x,b.y,b.w,b.h,b.r,C.panel2,C.lime,1.5);")


sub1("rect(54,120,295,123,0,C.panel);", "")
sub1("inFrame:{speaker:[0,DUR,'whole'],'main-panel':[0,DUR,'whole']}", "inFrame:{}")


# ================= v2 full-reel extras =================
# progressive headers: every scene's title is written word by word from its own start time
sub1("function head(a,b){text(a,52,83,51,580);if(b)text(b,54,127,26,400,C.mute)}",
     "let curT=0,curS=0;function head(a,b){const ws=a.split(' ');words(curT,ws.map((w,j)=>[w,curS+.12+j*.15]),52,83,51,580,C.ink);if(b)alpha(U(curT,curS+.6,curS+1.0),()=>text(b,54,127,26,400,C.mute))}")
sub1("function transitionModule(t,scene,p,op,dy){alpha(op,", "function transitionModule(t,scene,p,op,dy){curT=t;curS=scene.t;alpha(op,")
# voice beat: script lines are written word by word
sub1("text(lines[i],100,312+i*66+(1-q)*20,29,500,i===2?C.lime:C.ink)", "words(t,lines[i].split(' ').map((w,j)=>[w,at+.06+j*.17]),100,312+i*66,29,500,i===2?C.lime:C.ink)")

# ---- glass main panel
src = re.sub(r"function panel\(t,p\)\{.*?\n", """function panel(t,p){g.save();g.shadowColor='rgba(0,0,0,.50)';g.shadowBlur=55;g.shadowOffsetY=28;rect(p.x,p.y,p.w,p.h,p.r,C.panel);g.shadowBlur=0;g.shadowOffsetY=0;
 const gr=g.createLinearGradient(p.x,p.y,p.x+p.w*.4,p.y+p.h);gr.addColorStop(0,'rgba(255,255,255,.13)');gr.addColorStop(.25,'rgba(255,255,255,.035)');gr.addColorStop(1,'rgba(204,255,0,.05)');rect(p.x,p.y,p.w,p.h,p.r,gr);rect(p.x,p.y,p.w,p.h,p.r,null,'rgba(255,255,255,.20)',1.6);g.restore();track('main-panel',p);}
""", src, count=1, flags=re.S)

# ---- hook headline written word by word
sub1("text('Juno did the research.',52,81,47,580);", "words(t,[['Juno',0.05],['did',0.45],['the',0.72],['research.',0.98]],52,81,47,580,C.ink);")

# ---- helpers + camera + new search beat (inserted before 'const modules')
helpers = r"""
function words(t,list,x,y,size,weight,color,font='Inter'){g.font=`${weight} ${size}px ${font}`;let cx=x;for(const [w,at] of list){const q=U(t,at,at+.24,E.quintOut);if(q>.001)alpha(q,()=>text(w,cx,y+(1-q)*16,size,weight,color,'left',font));cx+=g.measureText(w+' ').width;}}
function gbox(x,y,w,h,r,o=1){if(o<=.002)return;g.save();g.globalAlpha*=Math.min(1,o);g.shadowColor='rgba(0,0,0,.45)';g.shadowBlur=34;g.shadowOffsetY=16;rect(x,y,w,h,r,C.panel2);g.shadowBlur=0;g.shadowOffsetY=0;
 const gr=g.createLinearGradient(x,y,x,y+h);gr.addColorStop(0,'rgba(255,255,255,.16)');gr.addColorStop(.4,'rgba(255,255,255,.04)');gr.addColorStop(1,'rgba(204,255,0,.06)');rect(x,y,w,h,r,gr);rect(x,y,w,h,r,null,'rgba(255,255,255,.24)',1.4);g.restore();}
function gchip(t,s,x,y,at,w=null){const q=U(t,at,at+.34,E.quintOut);if(q<.002)return;g.font='550 25px Mono';const ww=w||g.measureText(s).width+52;alpha(q,()=>{g.save();g.translate(x+ww/2,y+25);g.scale(.82+.18*q,.82+.18*q);g.translate(-ww/2,-25);gbox(0,0,ww,50,25,1);text(s,ww/2,33,24,550,C.lime,'center','Mono');g.restore()});return ww}
function search(t){
 words(t,[['Start',36.34],['with',36.78],['the',37.0],['competitors.',37.56]],52,83,51,580,C.ink);
 alpha(U(t,38.2,38.6),()=>text('One clear prompt.',54,127,26,400,C.mute));
 const k=U(t,36.55,37.4,E.quintInOut),b=OM.morphRect(t,36.55,37.4,{x:395,y:226,w:110,h:64,r:32},{x:54,y:184,w:792,h:115,r:24},{curve:E.quintInOut});
 g.save();if(k<1)g.filter=`blur(${(1-k)*5}px)`;gbox(b.x,b.y,b.w,b.h,b.r,U(t,36.5,36.85));g.restore();
 const typedAt=[['Find',40.50],['my',41.08],['300',41.54],['competitors.',41.72]];
 alpha(U(t,37.2,37.6)*(t<40.5?1:0),()=>text('Ask Juno…',83,253,32,450,C.mute));
 g.save();g.beginPath();g.rect(54,184,792,115);g.clip();words(t,typedAt,83,253,32,450,C.ink);
 if(t>40.5&&t<42.7&&Math.floor(t*2.4)%2===0){g.font='450 32px Inter';let cx=83;for(const [w,at] of typedAt)if(t>at)cx+=g.measureText(w+' ').width;rect(cx,224,3,40,1.5,C.lime)}g.restore();
 const sp=U(t,37.35,37.8,E.quintOut),press=OM.press(t,42.62,{depth:.16});alpha(sp,()=>{g.save();g.translate(786,240);g.scale((.7+.3*sp)*press.s,(.7+.3*sp)*press.s);rect(-28,-28,56,56,16,C.lime);arrow(-16,0,22,C.bg);g.restore()});
 let cx=54;const labels=[['competitor',37.56],['research',38.04],['also',38.5]];
 for(const [s,at] of labels){const ww=gchip(t,s==='also'?'+ analysis':s,cx,330,at);if(ww)cx+=ww+16;}
 alpha(U(t,39.48,39.9)*(1-U(t,40.4,40.7)),()=>{gbox(54,430,792,86,22,1);text('FOR EXAMPLE',84,486,25,550,C.lime,'left','Mono');text('Ask it directly.',330,486,30,500,C.ink)});
 if(t<40.3){alpha(U(t,38.9,39.5)*(1-U(t,40.0,40.3)),()=>mascot(t,343,560,200,'purple'))}
 const r=U(t,42.66,43.1,E.quintOut);if(r>.001){alpha(r,()=>{text(String(Math.round(300*r)),450,560,167,600,C.lime,'center','Geist');text('COMPETITORS',450,612,29,500,C.mute,'center','Mono');for(let i=0;i<45;i++){const c=i%9,rw=Math.floor(i/9),q=U(t,42.68+i*.008,42.9+i*.008,E.quintOut);alpha(q,()=>gbox(76+c*83,650+rw*29+(1-q)*40,65,20,6,1))}});}
}
// ----- camera: travels to every click, tilts in perspective, settles
const ACT=[{at:4.43,x:dateCell(6).x+72,y:dateCell(6).y+34},{at:10.26,x:730,y:435},{at:20.03,x:432,y:535},{at:29.33,x:450,y:543},{at:34.43,x:448,y:688},{at:42.62,x:786,y:240},{at:45.83,x:450,y:736},{at:49.22,x:780,y:795},{at:52.20,x:dateCell(6).x+72,y:dateCell(6).y+34},{at:58.48,x:280,y:318},{at:64.55,x:641,y:484},{at:68.26,x:786,y:258}];
const CAMKEYS=[{t:0,x:330,y:800,zoom:1.95,rot:-.04},{t:1.5,x:540,y:960,zoom:1,rot:0},{t:2.0,x:300,y:1150,zoom:1.45,rot:.02},{t:2.83,x:760,y:1150,zoom:1.45,rot:-.02},{t:3.3,x:540,y:960,zoom:1,rot:0}];
const CAMMOVES=[[0,1.5,1100],[1.95,3.3,900]];
for(const a of ACT){const pp=pose(a.at).p,tx=pp.x+a.x,ty=pp.y+a.y,fx=L(540,tx,.8),fy=L(960,ty,.8),rot=tx<540?.022:-.022;
 CAMKEYS.push({t:a.at-1.1,x:540,y:960,zoom:1,rot:0},{t:a.at-.22,x:fx,y:fy,zoom:1.62,rot:rot},{t:a.at+.55,x:fx,y:fy,zoom:1.62,rot:rot},{t:a.at+1.35,x:540,y:960,zoom:1,rot:0});CAMMOVES.push([a.at-1.1,a.at-.22,1100],[a.at+.55,a.at+1.35,1100]);}
for(let i=1;i<SCENES.length;i++){const st=SCENES[i].t+.2;if(ACT.some(a=>st-a.at>=0&&st-a.at<1.6))continue;const d=(i%2?1:-1);CAMKEYS.push({t:st,x:540+d*26,y:1000,zoom:1.055,rot:d*.01},{t:st+1.6,x:540-d*14,y:980,zoom:1.025,rot:0});CAMMOVES.push([st,st+1.6,500]);}
CAMKEYS.sort((p,q)=>p.t-q.t);
const camAt=t=>OM.camera(t,CAMKEYS,{W,H});
function applyTilt(cam,t){const zf=Math.min(1,Math.max(0,(cam.zoom-1)/.6)),stp=pose(t),sg=n=>n<=0?0:(n%2?1:-1)*4.2,base=L(sg(stp.i-1),sg(stp.i),stp.k),ry=-(cam.x-540)/540*7*zf+base,rx=(cam.y-960)/960*5*zf+base*.45;canvas.style.transform=`perspective(1700px) rotateX(${rx.toFixed(3)}deg) rotateY(${ry.toFixed(3)}deg) scale(1.045)`;canvas.style.transformOrigin='50% 50%';}
function groundCam(cam){g.setTransform(1,0,0,1,0,0);g.fillStyle=C.bg;g.fillRect(0,0,W,H);const M=OM.view(cam,{W,H,depth:1.4});g.setTransform(M[0],M[1],M[2],M[3],M[4],M[5]);
 const r=g.createRadialGradient(125,330,0,180,570,1500);r.addColorStop(0,'#2c3a07');r.addColorStop(.55,'#121a08');r.addColorStop(1,C.bg);g.fillStyle=r;g.fillRect(-W,-H,W*3,H*3);
 const r2=g.createRadialGradient(920,1500,0,920,1500,900);r2.addColorStop(0,'rgba(204,255,0,.10)');r2.addColorStop(1,'rgba(204,255,0,0)');g.fillStyle=r2;g.fillRect(-W,-H,W*3,H*3);}
"""
sub1("const modules={", helpers + "\nconst modules={")

# ---- new render with camera
m = re.search(r"function render\(t\)\{.*?\n\}\nasync function loadImage", src, re.S)
new_render = r"""function render(t){tracked={};const cam=camAt(t);applyTilt(cam,t);groundCam(cam);const M=OM.view(cam,{W,H});g.setTransform(M[0],M[1],M[2],M[3],M[4],M[5]);
 const state=pose(t),{p,s}=state;
 g.save();g.globalAlpha=U(t,6.55,7.3)*(1-Math.min(1,(cam.zoom-1)/.4)*.9);if(g.globalAlpha>.01)speaker(t,s);g.restore();
 text('Juno',87,105,40,600,C.ink,'left','Geist');dot(63,93,6,C.lime);text('RESEARCH → CONTENT',972,99,20,500,C.mute,'right','Mono');
 const m=mascotPose(t,p);if(state.b.id!=='identity'&&!(state.b.id==='search'&&t<40.3))mascot(t,m.x,m.y,m.size,'purple');
 panel(t,p);
 if(state.i>0&&state.k<1){transitionModule(t,state.a,p,1-state.k,-55*state.k);transitionModule(t,state.b,p,state.k,70*(1-state.k));}else transitionModule(t,state.b,p,1,0);
 for(const a of ACT)cursor(t,a.at,p.x+a.x,p.y+a.y);
 g.setTransform(1,0,0,1,0,0);
 const idx=state.i;alpha(U(t,0,.35),()=>{text(String(idx+1).padStart(2,'0')+' / '+String(SCENES.length).padStart(2,'0'),90,1760,22,500,C.mute,'left','Mono');text(state.b.title,988,1760,22,500,C.lime,'right','Mono');line(90,1790,990,1790,C.faint,4);line(90,1790,90+900*Math.min(1,t/DUR),1790,C.lime,4)});
 return true;
}
async function loadImage"""
src = src[:m.start()] + new_render + src[m.end():]

# ---- shutter budget includes camera moves
sub1("window.__motion=(a,b)=>{let d=0;", "window.__motion=(a,b)=>{let d=0;for(const [s,e,px] of CAMMOVES)d=Math.max(d,Math.abs(U(b,s,e)-U(a,s,e))*px);")
# the old search click time must follow the new one
sub1("const CLICK=[4.43,10.26,20.03,29.33,34.43,40.88,", "const CLICK=[4.43,10.26,20.03,29.33,34.43,42.62,")
open("film_v2.js", "w", encoding="utf-8").write(src)

html = open("comp.html", encoding="utf-8").read().replace("film.js", "film_v2.js")
for name, t0, dur in (("hook", 0.0, 7.4), ("search", 35.6, 8.0), ("full", 0.0, 70.17)):
    h = html.replace('<script src="motion.js">', f'<script>window.__T0={t0}</script><script src="motion.js">')
    open(f"comp_v2_{name}.html", "w", encoding="utf-8").write(h)
print("ok", len(src))
