/* One series identity; day 1–60 is data, never a separate design. */
(function(){
const {clamp,tween,ease,lerp}=OM;
window.DDRIdent={draw(g,t,day,W=1080,H=1920){
g.clearRect(0,0,W,H);g.fillStyle='#101216';g.fillRect(0,0,W,H);
let grad=g.createRadialGradient(470,880,30,470,880,900);grad.addColorStop(0,'#26323c');grad.addColorStop(.7,'#141a20');grad.addColorStop(1,'#101216');g.fillStyle=grad;g.fillRect(0,0,W,H);
const exit=tween(t,2.08,2.57,ease.quintInOut),entry=OM.swiftSpring(t-.08,'snappy',{duration:.60,bounce:.10});
g.save();g.translate(480,850);g.scale(lerp(.90+.10*entry,.19,exit),lerp(.90+.10*entry,.19,exit));g.translate(lerp(0,1620,exit),lerp(0,-2820,exit));
const r=230;for(let i=0;i<3;i++){let a=-Math.PI/2+i*Math.PI*2/3,span=tween(t,.12+i*.065,.70+i*.065,ease.expoOut)*1.65;g.save();g.rotate((1-entry)*-.45);g.beginPath();g.arc(0,0,r,a,a+span);g.strokeStyle=['#65d1e6','#e7777e','#edc772'][i];g.lineWidth=11;g.lineCap='round';g.stroke();g.restore();}
g.strokeStyle='#7c91a020';g.lineWidth=1;g.beginPath();g.arc(0,0,205,0,Math.PI*2);g.stroke();
g.textAlign='center';g.fillStyle='#aeb8c4';g.font='500 29px Inter';g.fillText('DAY',0,-100);
let num=String(day).padStart(2,'0');for(let i=0;i<num.length;i++){let p=OM.letterDrop(t,.35,i,{stagger:.07,dist:85,squash:.06});g.save();g.translate((i-.5)*145,63+p.y);g.scale(p.sx,p.sy);g.globalAlpha=clamp((t-.30-i*.07)/.15);g.font='600 245px Outfit';g.fillStyle='#f1f4f7';g.fillText(num[i],0,0);g.restore();}
g.font='500 20px Inter';g.fillStyle='#8996a4';g.fillText('OF 60',0,132);g.restore();
let rise=OM.wordRise(t,.03,{dist:35,omega:18,zeta:.85});g.globalAlpha=rise.op*(1-exit);g.textAlign='left';g.fillStyle='#b1bcc8';g.font='500 24px Inter';g.fillText('DECODING',100,418+rise.y);
g.font='600 77px Outfit';g.fillStyle='#f1f4f7';g.fillText('DaVinci Resolve',94,507+rise.y);
g.font='400 26px Inter';g.fillStyle='#aab6c3';g.fillText('One thing. Every day.',101,1218);
g.globalAlpha=clamp(exit);g.font='600 21px Inter';g.fillStyle='#adb5c0';g.fillText('DECODING DAVINCI RESOLVE',143,308);g.globalAlpha=1;
['#65d1e6','#e7777e','#edc772'].forEach((c,i)=>{g.fillStyle=c;g.beginPath();g.arc(98+i*15,300,5,0,Math.PI*2);g.fill();});
g.strokeStyle='#62738233';g.beginPath();g.moveTo(90,1570);g.lineTo(870,1570);g.stroke();
}};
})();
