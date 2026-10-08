'use strict';
const W=1080,H=1920,DUR=70.1666667,C={bg:'#080b05',panel:'rgba(16,22,10,.58)',panel2:'rgba(44,58,26,.62)',lime:'#ccff00',ink:'#f5f6ef',mute:'#9bA48c',line:'#394425',faint:'rgba(70,90,40,.50)'};
const canvas=document.getElementById('film'),g=canvas.getContext('2d');const T0=window.__T0||0;
const E=OM.ease,L=OM.lerp,U=(t,a,b,e=E.cubicInOut)=>e(OM.seg(t,a,b));
const assets={},frameCache=new Map();let tracked={},currentFrame=null;
const SCENES=[
 {t:0,id:'hook',title:'RESEARCH',p:{x:90,y:685,w:900,h:870,r:42},s:{x:355,y:157,w:370,h:370,r:185}},
 {t:6.8,id:'voice',title:'THE SCRIPT',p:{x:90,y:858,w:900,h:688,r:42},s:{x:171,y:165,w:738,h:537,r:42}},
 {t:11.96,id:'identity',title:'MEET JUNO',p:{x:90,y:662,w:900,h:893,r:42},s:{x:365,y:157,w:350,h:350,r:175}},
 {t:17.44,id:'access',title:'THE CONTEXT',p:{x:90,y:858,w:900,h:688,r:42},s:{x:171,y:165,w:738,h:537,r:42}},
 {t:21.8,id:'connect',title:'CONNECT',p:{x:90,y:688,w:900,h:866,r:42},s:{x:355,y:157,w:370,h:370,r:185}},
 {t:31.46,id:'analytics',title:'ANALYTICS',p:{x:90,y:685,w:900,h:870,r:42},s:{x:355,y:157,w:370,h:370,r:185}},
 {t:36.34,id:'search',title:'COMPETITOR RESEARCH',p:{x:90,y:685,w:900,h:870,r:42},s:{x:355,y:157,w:370,h:370,r:185}},
 {t:43.06,id:'patterns',title:'CONTENT PATTERNS',p:{x:90,y:685,w:900,h:870,r:42},s:{x:355,y:157,w:370,h:370,r:185}},
 {t:47.84,id:'planner',title:'30-DAY PLAN',p:{x:90,y:662,w:900,h:893,r:42},s:{x:355,y:157,w:370,h:370,r:185}},
 {t:51.9,id:'topics',title:'TOPICS',p:{x:90,y:685,w:900,h:870,r:42},s:{x:355,y:157,w:370,h:370,r:185}},
 {t:55.74,id:'script',title:'HOOK → SCRIPT',p:{x:90,y:685,w:900,h:870,r:42},s:{x:355,y:157,w:370,h:370,r:185}},
 {t:61.32,id:'guide',title:'YOUR GUIDE',p:{x:90,y:715,w:900,h:840,r:42},s:{x:355,y:157,w:370,h:370,r:185}},
 {t:65.94,id:'cta',title:'COMMENT JUNO',p:{x:90,y:870,w:900,h:685,r:42},s:{x:171,y:165,w:738,h:537,r:42}}
];
const CLICK=[4.43,10.26,20.03,29.33,34.43,42.62,45.83,49.22,52.20,58.48,64.55,68.26];
function rect(x,y,w,h,r,fill,stroke=null,lw=1){g.beginPath();g.roundRect(x,y,Math.max(.1,w),Math.max(.1,h),Math.min(r,w/2,h/2));if(fill){g.fillStyle=fill;g.fill()}if(stroke){g.lineWidth=lw;g.strokeStyle=stroke;g.stroke()}}
function text(s,x,y,size=32,weight=500,color=C.ink,align='left',font='Inter'){g.font=`${weight} ${size}px ${font}`;g.textAlign=align;g.textBaseline='alphabetic';g.fillStyle=color;g.fillText(s,x,y)}
function line(x,y,xx,yy,c=C.line,w=1){g.beginPath();g.moveTo(x,y);g.lineTo(xx,yy);g.strokeStyle=c;g.lineWidth=w;g.stroke()}
function dot(x,y,r,c){g.beginPath();g.arc(x,y,r,0,Math.PI*2);g.fillStyle=c;g.fill()}
function alpha(op,fn){if(op<=.001)return;g.save();g.globalAlpha*=Math.min(1,op);fn();g.restore()}
function check(x,y,s=1,col=C.lime){g.save();g.translate(x,y);g.scale(s,s);g.lineWidth=3;g.lineCap='round';g.lineJoin='round';g.strokeStyle=col;g.beginPath();g.moveTo(-9,0);g.lineTo(-2,7);g.lineTo(11,-9);g.stroke();g.restore()}
function arrow(x,y,w=90,col=C.lime){line(x,y,x+w,y,col,3);line(x+w,y,x+w-10,y-8,col,3);line(x+w,y,x+w-10,y+8,col,3)}
function track(id,b){tracked[id]={...b,op:b.op??1}}
function pill(s,x,y,w,col=C.lime){rect(x,y,w,45,22,C.faint);text(s,x+w/2,y+30,21,550,col,'center','Mono')}
let curT=0,curS=0;function head(a,b){const ws=a.split(' ');words(curT,ws.map((w,j)=>[w,curS+.12+j*.15]),52,83,51,580,C.ink);if(b)alpha(U(curT,curS+.6,curS+1.0),()=>text(b,54,127,26,400,C.mute))}
function skeleton(x,y,w,n=3,step=26,col=C.line){for(let i=0;i<n;i++)rect(x,y+i*step,w*(i===n-1?.64:1),5,3,col)}
function pose(t){let i=0;while(i+1<SCENES.length&&t>=SCENES[i+1].t)i++;const a=SCENES[Math.max(0,i-1)],b=SCENES[i],k=i?U(t,b.t,b.t+.65,E.quintInOut):1;return {i,a,b,k,p:OM.morphRect(t,b.t,b.t+.65,a.p,b.p,{curve:E.quintInOut}),s:OM.morphRect(t,b.t,b.t+.65,a.s,b.s,{curve:E.quintInOut})}}
function cover(im,x,y,w,h,r=0,focus=.38){g.save();g.beginPath();g.roundRect(x,y,w,h,Math.min(r,w/2,h/2));g.clip();const sc=Math.max(w/im.width,h/im.height),sw=w/sc,sh=h/sc,sx=(im.width-sw)/2,sy=Math.max(0,Math.min(im.height-sh,im.height*focus-sh*focus));g.drawImage(im,sx,sy,sw,sh,x,y,w,h);g.restore()}
function speaker(t,s){g.save();g.shadowColor='rgba(0,0,0,.5)';g.shadowBlur=30;g.shadowOffsetY=15;rect(s.x-5,s.y-5,s.w+10,s.h+10,s.r+5,C.lime);g.shadowBlur=0;g.shadowOffsetY=0;if(currentFrame)cover(currentFrame,s.x,s.y,s.w,s.h,s.r,.35);g.restore();track('speaker',{x:s.x-5,y:s.y-5,w:s.w+10,h:s.h+10})}
function blink(t){let k=0;for(const at of [1.6,12.95,15.3,22.85,28.15,36.9,43.7,49.65,61.9,68.85]){if(t>at&&t<at+.21)k=Math.max(k,Math.sin((t-at)/.21*Math.PI));}return k}
function mascot(t,x,y,size=140,kind='purple',rot=0){
 const im=assets[kind],hopTimes=[{a:2.12,b:2.72,d:14},{a:3.7,b:4.15,d:17},{a:13.1,b:13.65,d:12},{a:29.33,b:29.9,d:12},{a:49.3,b:50.0,d:14},{a:68.3,b:68.85,d:20}];let hop=0,tilt=rot;
 for(const h of hopTimes)if(t>=h.a&&t<=h.b){const k=U(t,h.a,h.b,E.sineInOut);hop=-Math.sin(k*Math.PI)*h.d;tilt+=Math.sin(k*Math.PI*2)*.045;}
 g.save();g.translate(x+size/2,y+size/2+hop);g.rotate(tilt);g.shadowColor='rgba(0,0,0,.45)';g.shadowBlur=20;g.shadowOffsetY=7;rect(-size/2,-size/2,size,size,kind==='purple'?size/2:24,'#f4f1ee');g.shadowBlur=0;g.shadowOffsetY=0;
 cover(im,-size/2,-size/2,size,size,kind==='purple'?size/2:24,.5);
 if(kind==='purple'){const k=blink(t);if(k>.02){g.save();g.translate(-size/2,-size/2);g.scale(size/554,size/554);for(const x of [227,328]){g.save();g.globalAlpha=k;g.fillStyle='#e4cba2';g.beginPath();g.ellipse(x,147,20,25,0,0,Math.PI*2);g.fill();g.strokeStyle='#493b2f';g.lineWidth=3.8;g.lineCap='round';g.beginPath();g.moveTo(x-12,147);g.quadraticCurveTo(x,155,x+12,147);g.stroke();g.restore()}g.restore()}}
 g.restore();
}
function cursor(t,click,targetX,targetY,enter=.65,exit=.66){if(t<click-enter||t>click+exit+.42)return;
 const k=U(t,click-enter,click-.075,E.cubicOut),out=U(t,click+.35,click+exit+.42,E.cubicIn);let x=L(targetX+180,targetX,k),y=L(1965,targetY,k);x=L(x,1170,out);y=L(y,targetY+170,out);
 const press=OM.press(t,click,{depth:.16});g.save();g.translate(x,y);g.scale(press.s*3.4,press.s*3.4);g.shadowColor='rgba(0,0,0,.65)';g.shadowBlur=3;g.shadowOffsetY=2;g.beginPath();g.moveTo(0,0);g.lineTo(3,24);g.lineTo(9,17);g.lineTo(15,28);g.lineTo(20,25);g.lineTo(14,15);g.lineTo(24,13);g.closePath();g.fillStyle='#fafbf4';g.fill();g.strokeStyle='#171a12';g.lineWidth=1.2;g.stroke();g.restore();track('cursor',{x,y,w:85,h:96});
}
function dateCell(i){return{x:62+(i%5)*156,y:260+Math.floor(i/5)*80,w:143,h:68,r:11}}
function calendar(t,start,{slow=false,selected=6,click=null,detail=false}={}){
 const delay=slow?.037:.021,duration=slow?.42:.33;
 for(let i=0;i<30;i++){const b=dateCell(i),q=U(t,start+i*delay,start+i*delay+duration,E.quintOut);if(q<.001)continue;let bb={...b,y:b.y+(1-q)*58};
 if(i===selected&&click!==null&&t>=click){bb=OM.morphRect(t,click,click+.68,b,{x:53,y:338,w:794,h:381,r:26},{curve:E.quintInOut});}
 if(i===selected&&click!==null&&t>=click)continue;
 const hi=i===selected&&click!==null?U(t,click-.30,click-.08):0;
 alpha(q,()=>{rect(bb.x,bb.y,bb.w,bb.h,bb.r,hi>.1?C.lime:C.panel2,hi>.1?C.lime:C.line);text(String(i+1).padStart(2,'0'),bb.x+15,bb.y+30,23,550,hi>.1?C.bg:C.mute,'left','Mono');rect(bb.x+15,bb.y+47,bb.w*.55,3,2,hi>.1?'#697e1a':C.line)});
 }
 if(click!==null&&t>=click){const b=OM.morphRect(t,click,click+.68,dateCell(selected),{x:53,y:338,w:794,h:381,r:26},{curve:E.quintInOut});rect(b.x,b.y,b.w,b.h,b.r,'#161d0e');rect(b.x,b.y,b.w,b.h,b.r,C.panel2,C.lime,1.5);alpha(U(t,click+.35,click+.72),()=>{text('DAY '+String(selected+1).padStart(2,'0'),b.x+34,b.y+49,24,500,C.lime,'left','Mono');text(detail?'Your next idea':'Content category',b.x+34,b.y+112,37,550);const vstart=detail?click+.70:5.16;alpha(U(t,vstart,vstart+.32,E.quintOut),()=>text(detail?'Topic → Hook':'Viral',b.x+34,b.y+224,detail?59:87,600,C.lime));skeleton(b.x+35,b.y+277,b.w-110,3,23);});}
}
function hook(t){
 const month=U(t,3.12,3.70,E.quintInOut);words(t,[['Juno',0.05],['did',0.45],['the',0.72],['research.',0.98]],52,81,47,580,C.ink);alpha(U(t,.95,1.12)*(1-month),()=>text(String(Math.round(300*U(t,1.0,1.5,E.quintOut))),53,229,125,600,C.ink,'left','Geist'));
 alpha(1-month,()=>text('COMPETITORS',376,209,29,500,C.lime,'left','Mono'));
 if(month>.01){alpha(month,()=>{text('30',54,229,125,600,C.lime,'left','Geist');text('DAYS OF CONTENT',333,209,27,500,C.ink,'left','Mono');});}
 const gridY=331;for(let i=0;i<300;i++){const col=i%20,row=Math.floor(i/20),group=Math.floor(col/2)+Math.floor(row/5)*10,k=(row%5)*2+col%2;
 const a={x:64+col*38.3,y:gridY+row*29,w:27,h:23,r:5},b=dateCell(group),q=U(t,.42+row*.016,.86+row*.016,E.quintOut),gather=U(t,2.64+group*.009,3.13+group*.009,E.quintInOut);
 const cx=L(a.x,75+(group%10)*76,gather),cy=L(a.y,410+Math.floor(group/10)*105,gather),date=U(t,3.13+group*.021,3.49+group*.021,E.quintOut),op=q*(k===0?1:1-gather);
 if(op<.005||date>=1)continue;const x=L(cx,b.x,date),y=L(cy,b.y,date)+(1-q)*100,w=L(a.w,b.w,date),h=L(a.h,b.h,date);
 alpha(op,()=>{rect(x,y,w,h,5+date*6,t>2.1+col*.029?C.faint:C.panel2,C.line);if(date<.35){dot(x+w*.5,y+h*.32,3,t>2.1+col*.029?C.lime:C.mute);rect(x+w*.3,y+h*.58,w*.4,5,2,C.mute);}});
 }
 if(t>3.13)calendar(t,3.13,{selected:6,click:4.43});
 if(t>2.08&&t<2.92){const x=L(58,833,U(t,2.08,2.83,E.sineInOut));line(x,321,x,765,C.lime,2.5);dot(x,314,5,C.lime)}
 alpha(1-U(t,3.03,3.33),()=>pill(t<2.12?'300 profiles. One brief.':'Finding the patterns…',55,790,790));
 alpha(U(t,3.8,4.10),()=>pill('RESEARCH → YOUR CONTENT PLAN',55,790,790));
}
function voice(t){head('“Juno told me what to say.”','The idea becomes the script.');const grow=U(t,7.6,8.4,E.quintInOut);rect(54,176,792,345,24,C.panel2,C.line);pill('SCRIPT / IN PROGRESS',80,201,310);
 const lines=['Your next reel starts here.','A researched topic.','A stronger opening.'];for(let i=0;i<3;i++){const at=[7.8,9.05,10.24][i],q=U(t,at,at+.45,E.quintOut);alpha(q,()=>{rect(81,278+i*66,727,49,9,i===2&&t>10.24?C.faint:C.panel2);words(t,lines[i].split(' ').map((w,j)=>[w,at+.06+j*.17]),100,312+i*66,29,500,i===2?C.lime:C.ink)})}
 alpha(U(t,10.24,10.72),()=>{check(808,553,1);text('From research to words.',55,581,29,500,C.mute)});}
function identity(t){head('Meet Juno.','A little character. A bigger workflow.');const travel=OM.hop(t,13.05,13.75,{x:332,y:211},{x:105,y:242},{height:44,curve:E.sineInOut});mascot(t,travel.x,travel.y,230,'purple');
 const q=U(t,13.40,14.08,E.quintOut);alpha(q,()=>{text('Juno',409,325,77,600);text('Your AI companion',412,374,29,400,C.mute)});
 const names=[['JUNO',12.2],['MUSE',14.42],['META',16.62]];for(let i=0;i<3;i++){const q=U(t,names[i][1],names[i][1]+.44,E.quintOut);alpha(q,()=>{rect(54+i*271,572,250,99,24,i===2?C.lime:C.panel2,C.line);text(names[i][0],179+i*271,634+(1-q)*24,35,600,i===2?C.bg:C.ink,'center');if(i<2)arrow(305+i*271,621,16,C.mute)})}
 alpha(U(t,15.4,16),()=>text('Research  ·  Plan  ·  Create',450,765,29,500,C.mute,'center'));}
function access(t){head('Access matters.','The setup comes before the workflow.');rect(55,189,790,238,25,C.panel2,C.line);text('INDIA',87,249,28,550,C.mute,'left','Mono');text('Availability & access',86,320,43,580);pill('CHECK THE SETUP',87,351,340);
 alpha(U(t,19.35,19.90),()=>{rect(55,466,790,132,22,C.faint);text('Covered in the previous reels',87,521,30,500);text('Then put Juno to work.',87,566,27,400,C.mute)});}
function connect(t){head(t<24.66?'Make it work for you.':'Connect the context.',t<24.66?'Creative use starts with a clear brief.':'Your content feeds the workflow.');
 const start=24.66;mascot(t,337,205,225,'working');
 const nodes=[{x:60,y:488,label:'YOUR CONTENT',at:26.56},{x:592,y:488,label:'MUSE',at:27.58}];for(const n of nodes){alpha(U(t,n.at-.30,n.at+.25),()=>{rect(n.x,n.y,247,109,22,C.panel2,C.line);text(n.label,n.x+123.5,n.y+65,24,550,C.ink,'center','Mono')})}
 const k=U(t,29.32,30.98,E.cubicInOut);line(307,543,307+285*k,543,C.lime,3);if(k>.01)dot(307+285*k,543,7,C.lime);
 alpha(U(t,30.34,30.85),()=>{rect(54,661,792,134,23,C.faint,C.line);check(95,728,1.15);text('Ready for your analytics',136,739,34,550,C.lime)});
 if(t<24.66){alpha(1-U(t,24.0,24.66),()=>{text('RESEARCH',450,564,43,600,C.lime,'center');text('→',450,628,34,400,C.mute,'center');text('CONTENT',450,704,43,600,C.ink,'center')});}}
function analytics(t){head('Which reel works?','And why does it work?');const labels=['Opening hook','Topic relevance','Audience response'];for(let i=0;i<3;i++){const q=U(t,31.7+i*.36,32.3+i*.36,E.quintOut),y=205+i*137;alpha(q,()=>{rect(54,y,792,113,22,C.panel2,C.line);text(labels[i],82,y+46,31,550);rect(82,y+73,635,9,4,C.faint);rect(82,y+73,635*[.79,.59,.88][i]*q,9,4,i===0?C.lime:'#6f842d');})}
 alpha(U(t,34.35,34.85),()=>{rect(54,645,792,147,23,C.faint,C.lime);text('LOOK FOR THE PATTERN',81,693,23,550,C.lime,'left','Mono');text('What made people stop?',81,754,38,550)});}
function search(t){head('Start with the competitors.','One clear prompt.');const typing=OM.typeOn(t,39.96,'Find my 300 competitors.',{cps:32,blink:false});rect(54,184,792,115,24,C.panel2,C.line);text(t<39.96?'Ask Juno…':typing.str,83,253,32,450,t<39.96?C.mute:C.ink);rect(758,212,56,56,16,C.lime);arrow(774,240,22,C.bg);
 const k=U(t,40.88,42.38,E.quintOut);alpha(k,()=>{text(String(Math.round(300*k)),450,502,167,600,C.lime,'center','Geist');text('COMPETITORS',450,556,29,500,C.mute,'center','Mono');for(let i=0;i<45;i++){const c=i%9,r=Math.floor(i/9),q=U(t,40.94+i*.023,41.22+i*.023,E.quintOut);alpha(q,()=>{rect(76+c*83,609+r*29,65,20,6,C.faint,C.line)})}});
 if(t<39.96){mascot(t,343,377,215,'purple');text('A better input.',450,672,45,550,C.ink,'center');text('A better starting point.',450,729,29,400,C.mute,'center');}}
function patterns(t){head('Read the content.','Find what keeps repeating.');const tags=['HOOK','TOPIC','FORMAT'];for(let i=0;i<3;i++){const q=U(t,43.12+i*.22,43.66+i*.22,E.quintOut),y=207+i*146;alpha(q,()=>{rect(54,y+(1-q)*50,792,123,23,C.panel2,C.line);rect(79,y+25,73,73,14,C.faint);text(String(i+1).padStart(2,'0'),116,y+72,27,500,C.lime,'center','Mono');text(tags[i],180,y+52,30,550);skeleton(180,y+76,550,1);})}
 const q=U(t,45.84,46.38);alpha(q,()=>{rect(54,673,792,120,23,C.faint,C.lime);text('Viral patterns',86,746,49,570,C.lime);check(791,730,1.3)});}
function planner(t){head('A month, mapped out.','30 days of content from the research.');calendar(t,49.02,{slow:true,selected:6});const q=U(t,48.06,48.66);alpha(q,()=>pill('RESEARCH → TOPICS → YOUR PLAN',54,779,792));}
function topics(t){head('Every day gets an idea.','First the topic. Then the talking points.');calendar(t,49.02,{slow:true,selected:6,click:52.20,detail:true});alpha(U(t,54.03,54.55),()=>pill('TOPICS + SCRIPTING POINTS',54,785,792));}
function script(t){head('Build the opening.',t<58.48?'Give the topic a strong first line.':'The hook becomes the script.');
 const large=U(t,59.10,59.80,E.quintInOut);const b=OM.morphRect(t,59.10,59.80,{x:54,y:200,w:792,h:173,r:25},{x:54,y:200,w:792,h:529,r:25},{curve:E.quintInOut});rect(b.x,b.y,b.w,b.h,b.r,C.panel2,C.line);
 text('INSTAGRAM',84,248,23,550,C.mute,'left','Mono');text(t>=58.48?'HOOK':'Your opening',83,326,63,580,t>=58.48?C.lime:C.ink);alpha(large,()=>{line(85,376,813,376);text('SCRIPT',85,435,24,550,C.lime,'left','Mono');skeleton(85,470,675,6,31);});
 alpha(U(t,59.42,60.0),()=>{check(805,778,1.1);text('From idea to a usable script.',55,786,31,500,C.mute)});}
function guide(t){head('Your content workflow.','Research, planning and writing — connected.');const q=U(t,61.45,62.2,E.quintOut);alpha(q,()=>{rect(82,195,351,480,28,C.panel2,C.line);rect(82,195,351,87,28,C.lime);text('JUNO',112,253,38,650,C.bg);mascot(t,167,322,180,'thinking');text('CONTENT',115,556,35,600);text('CREATION',115,604,35,600);text('GUIDE',115,647,27,500,C.lime,'left','Mono');});
 const labels=[['Research',62.1],['Plan',63.15],['Write',64.16],['Automate',65.06]];for(let i=0;i<4;i++){const k=U(t,labels[i][1],labels[i][1]+.4,E.quintOut);alpha(k,()=>{rect(470,219+i*111,351,86,20,i===3?C.faint:C.panel2,C.line);check(505,261+i*111,.8);text(labels[i][0],537,271+i*111,29,550,i===3?C.lime:C.ink)})}
 alpha(U(t,65.05,65.5),()=>pill('ONE CONNECTED PROCESS',54,744,792));}
function cta(t){head('Give Juno some love.','Leave a comment. Get the guide.');rect(54,190,792,130,25,C.panel2,C.line);const v=OM.typeOn(t,66.84,'Juno, kamaal kar diya! 🙌',{cps:24,blink:false});text(v.str,84,266,33,450);rect(757,229,59,59,17,C.lime);arrow(773,258,24,C.bg);
 const send=U(t,68.26,68.96,E.quintInOut);alpha(send,()=>{rect(54,378+(1-send)*80,792,173,25,C.faint,C.lime);mascot(t,80,397,120,'purple');text('Your Juno guide',230,444,39,550);text('Ready for you.',231,493,29,400,C.mute);check(796,466,1.3)});}

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

const modules={hook,voice,identity,access,connect,analytics,search,patterns,planner,topics,script,guide,cta};
function ground(){g.setTransform(1,0,0,1,0,0);g.fillStyle=C.bg;g.fillRect(0,0,W,H);const r=g.createRadialGradient(125,330,0,180,570,1300);r.addColorStop(0,'#253006');r.addColorStop(.62,'#101607');r.addColorStop(1,C.bg);g.fillStyle=r;g.fillRect(0,0,W,H);}
function panel(t,p){g.save();g.shadowColor='rgba(0,0,0,.50)';g.shadowBlur=55;g.shadowOffsetY=28;rect(p.x,p.y,p.w,p.h,p.r,C.panel);g.shadowBlur=0;g.shadowOffsetY=0;
 const gr=g.createLinearGradient(p.x,p.y,p.x+p.w*.4,p.y+p.h);gr.addColorStop(0,'rgba(255,255,255,.13)');gr.addColorStop(.25,'rgba(255,255,255,.035)');gr.addColorStop(1,'rgba(204,255,0,.05)');rect(p.x,p.y,p.w,p.h,p.r,gr);rect(p.x,p.y,p.w,p.h,p.r,null,'rgba(255,255,255,.20)',1.6);g.restore();track('main-panel',p);}
function transitionModule(t,scene,p,op,dy){curT=t;curS=scene.t;alpha(op,()=>{g.save();g.beginPath();g.roundRect(p.x+1,p.y+1,p.w-2,p.h-2,p.r);g.clip();g.translate(p.x,p.y+dy);modules[scene.id](t);g.restore()})}
function mascotPose(t,p){let x=837,y=535,size=105;const q=U(t,6.8,7.45)*(1-U(t,11.96,12.61))+U(t,17.44,18.09)*(1-U(t,21.8,22.45))+U(t,65.94,66.59);y=L(535,725,Math.min(1,q));return{x,y,size}}
function render(t){tracked={};const cam=camAt(t);applyTilt(cam,t);groundCam(cam);const M=OM.view(cam,{W,H});g.setTransform(M[0],M[1],M[2],M[3],M[4],M[5]);
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
async function loadImage(path){const im=new Image();im.src=path;await im.decode();return im}
async function frameAt(t){const n=Math.min(2100,Math.max(1,Math.round(t*30)+1));if(!frameCache.has(n)){frameCache.set(n,loadImage('footage/'+String(n).padStart(4,'0')+'.jpg'));if(frameCache.size>12)frameCache.delete(frameCache.keys().next().value);}return await frameCache.get(n)}
window.__seek=async t=>{t=Math.max(0,Math.min(DUR,t+T0));currentFrame=await frameAt(t);return render(t)};
window.__track=()=>tracked;
// Geometry-derived shutter budget, including transforms, cursor travel and date cascades.
const MOVES=[[0,.7,180],[.42,1.45,140],[2.08,2.83,790],[2.64,3.70,650],[3.13,4.13,160],[4.43,5.11,720],[5.16,5.48,100],...SCENES.slice(1).map(s=>[s.t,s.t+.65,650]),[13.05,13.75,270],[29.32,30.98,285],[40.88,42.38,180],[43.12,44.4,120],[49.02,50.51,160],[52.20,52.88,720],[58.48,58.8,80],[59.10,59.80,400],[68.26,68.96,140]];
window.__motion=(a,b)=>{let d=0;for(const [s,e,px] of CAMMOVES)d=Math.max(d,Math.abs(U(b,s,e)-U(a,s,e))*px);for(const [s,e,px] of MOVES)d=Math.max(d,Math.abs(U(b,s,e)-U(a,s,e))*px);for(const c of CLICK){d=Math.max(d,Math.abs(U(b,c-.65,c-.075,E.cubicOut)-U(a,c-.65,c-.075,E.cubicOut))*1500,Math.abs(U(b,c+.35,c+1.08,E.cubicIn)-U(a,c+.35,c+1.08,E.cubicIn))*1100)}return d;};
window.__meta={dur:DUR,fps:30,width:W,height:H,cuts:[],inFrame:{}};
window.__events=()=>({duration:DUR,clicks:CLICK,transitions:SCENES.slice(1).map(s=>s.t),moves:MOVES});
window.__ready=Promise.all([document.fonts.load('500 32px Inter'),document.fonts.load('600 100px Geist'),document.fonts.load('500 24px Mono'),...['purple','working','thinking'].map(async k=>assets[k]=await loadImage('assets/juno_'+k+'.png'))]).then(async()=>{await window.__seek(0);const qs=new URLSearchParams(location.search);if(qs.has('t'))await window.__seek(+qs.get('t'));if(qs.has('play')){const audio=new Audio('mix.wav');document.body.addEventListener('click',async()=>{await audio.play();const tick=async()=>{await window.__seek(audio.currentTime);if(!audio.paused)requestAnimationFrame(tick)};tick()})}return true});
